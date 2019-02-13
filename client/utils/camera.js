import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import {
  createProject,
  drawAnything,
  drawTracker,
  smooth,
  handleErase
} from './draw.js'
import {hoverToChooseBrush} from './hoverButtonBrushes'
import {hoverToChooseTool} from './hoverButton'
import {trackHand, predict} from './trackHand'
import store from '../store'
import {handleShapes, isShape} from './drawShapes'

let minPartConfidence = 0.75
let model
let mobileNet

//hardcoded to prevent GPU overload
let videoHeight = 723
let videoWidth = 964

//Loads a the camera to be used on canvas
async function setupCamera() {
  const video = document.getElementById('video')
  video.width = videoWidth
  video.height = videoHeight

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: videoWidth,
      height: videoHeight
    }
  })
  video.srcObject = stream

  return new Promise(resolve => {
    video.onloadedmetadata = () => {
      resolve(video)
    }
  })
}

async function loadVideo() {
  const video = await setupCamera()
  video.play()

  return video
}

const guiState = {
  algorithm: 'single-pose',
  input: {
    mobileNetArchitecture: '0.75',
    outputStride: 16,
    imageScaleFactor: 0.5
  },
  singlePoseDetection: {
    minPartConfidence //moved to top for ease of change
  },
  output: {
    showVideo: true,
    showPoints: true
  },
  net: null
}

let rightHand
let leftHand
let arrayOfShapes = []

let initialState = store.getState()
let colorAtStart = initialState.color.color
let brushAtStart = initialState.paintTools.chosenBrush

//initiate frame loop
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')

  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  const paintingPointerCanvas = document.getElementById('painting-pointer')
  paintingPointerCanvas.width = videoWidth
  paintingPointerCanvas.height = videoHeight
  const paintingPointerCtx = paintingPointerCanvas.getContext('2d')
  paintingPointerCtx.globalCompositeOperation = 'destination-over'
  const flipHorizontal = true

  canvas.width = videoWidth
  canvas.height = videoHeight

  backgroundCanvas.width = videoWidth
  backgroundCanvas.height = videoHeight

  //begin the paper.js project, located in utils/draw.js
  createProject(window, canvas, ctx)

  // ***** SMOOTHING TECH *****
  /*The following is used for smoothing the line and circle
  An average is collected of the last five frames. Assigned
  'framesAveraged' to a const, so that we can easily change this
  later, as needed.*/
  let currentPoseNum = 0
  const frames = 5
  let lastFewXCoords = Array(frames)
  let lastFewYCoords = Array(frames)
  /*End of smoothing tech*/

  let drawModeOn, eraseModeOn, chosenPart, keypoint

  async function poseDetectionFrame(prevPose = {}, path) {
    //set draw status for frame
    let frameState = store.getState()

    drawModeOn = frameState.paintTools.drawModeOn
    chosenPart = frameState.paintTools.chosenBodyPart
    eraseModeOn = frameState.paintTools.eraseModeOn

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor
    const outputStride = +guiState.input.outputStride

    let minPartConfidence
    /*eslint-disable*/

    const pose = await net.estimateSinglePose(
      video,
      imageScaleFactor,
      flipHorizontal,
      outputStride
    )

    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence

    backgroundctx.save()
    backgroundctx.scale(-1, 1)
    backgroundctx.translate(-videoWidth, 0)
    backgroundctx.drawImage(video, 0, 0, videoWidth, videoHeight)
    backgroundctx.restore()

    let {keypoints} = pose

    //continue if we have at least two frames to compare
    if (prevPose.score) {
      const [
        nose,
        leftEye,
        rightEye,
        leftEar,
        rightEar,
        leftShoulder,
        rightShoulder,
        leftElbow,
        rightElbow,
        leftWrist,
        rightWrist,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle
      ] = keypoints

      //define mirrored "hand" on the right or left arm using wrist and elbow position
      function calculateHand(wrist, elbow) {
        const yDiff = wrist.position.y - elbow.position.y
        const handY = yDiff / 2 + wrist.position.y
        const xDiff = wrist.position.x - elbow.position.x
        const handX = xDiff / 2 + wrist.position.x

        return {
          score: wrist.score,
          position: {y: handY, x: handX}
        }
      }

      rightHand = calculateHand(leftWrist, leftElbow)
      keypoints[17] = rightHand

      leftHand = calculateHand(rightWrist, rightElbow)
      keypoints[18] = leftHand

      //****DRAWING ACTION ****/

      //if somebody is there and drawMode is on, calculate drawing needs
      if (nose.score >= minPartConfidence) {
        //determine current drawing tool and its coordinates
        if (chosenPart === 'nose') {
          keypoint = nose
        } else if (chosenPart === 'leftHand') {
          keypoint = leftHand
        } else {
          keypoint = rightHand
        }

        if (chosenPart !== 'nose') {
          //track and predict gesture
          trackHand(keypoint.position.x, keypoint.position.y, backgroundCanvas)
          predict(model, mobileNet)
        }
        //button hover functionality
        if (
          (chosenPart !== 'rightHand' && keypoint.position.x < 200) ||
          (chosenPart === 'rightHand' && keypoint.position.x > videoWidth - 200)
        )
          hoverToChooseTool(keypoint.position.x, keypoint.position.y)

        if (frameState.expansionPanels.brush === true) {
          hoverToChooseBrush(keypoint.position.x, keypoint.position.y)
        }

        //to smooth points
        //add to arrays for averaging over frames
        lastFewXCoords[currentPoseNum] = keypoint.position.x
        lastFewYCoords[currentPoseNum] = keypoint.position.y

        keypoint = smooth(lastFewXCoords, lastFewYCoords)

        //draw dot
        drawTracker(keypoint, videoWidth, videoHeight, paintingPointerCtx)

        if (drawModeOn) {
          if (eraseModeOn === false) {
            ctx.globalCompositeOperation = 'source-over'

            const thisPath = drawAnything(
              keypoint,
              path,
              leftHand,
              rightHand,
              nose
            )

            path = thisPath

            //if drawing shapes, make a meta-path of each path as a 'segment'
            if (isShape(path)) {
              handleShapes(
                arrayOfShapes,
                path,
                frameState,
                colorAtStart,
                brushAtStart
              )
            }
          } else {
            //erase mode
            if (path) {
              handleErase(path)
            } else if (isShape(path)) {
              arrayOfShapes.forEach(path => path.removeSegment(0))
            }
          }
        } else if (path !== null) {
          //if drawMode is off but nothing has yet been cleared
          path = null
          lastFewXCoords = Array(frames)
          lastFewYCoords = Array(frames)
          arrayOfShapes = []
        }
      }
    }

    //increment/reset frame count
    currentPoseNum < frames - 1 ? currentPoseNum++ : (currentPoseNum = 0)
    requestAnimationFrame(() => poseDetectionFrame(pose, path))
  }

  poseDetectionFrame()
}
/*eslint-enable*/

async function loadTruncatedMobileNet() {
  const mobilenet = await tf.loadModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  )

  const layer = mobilenet.getLayer('conv_pw_13_relu')
  const tmn = tf.model({inputs: mobilenet.inputs, outputs: layer.output})
  return tmn
}

//load models, find camera, set off detectPose
export async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75)
  mobileNet = await loadTruncatedMobileNet()
  model = await tf.loadModel('mymodel-demo.json')

  document.getElementById('display').style.display = 'block'
  document.getElementById('main').style.display = 'block'

  let video

  try {
    video = await loadVideo()
  } catch (e) {
    let info = document.getElementById('info')
    info.textContent =
      'this browser does not support video capture,' +
      'or this device does not have a camera'
    info.style.display = 'block'
    throw e
  }

  setTimeout(() => detectPoseInRealTime(video, net, model, mobileNet), 1000)
}
