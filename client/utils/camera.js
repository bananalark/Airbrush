import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import {
  draw,
  createProject,
  drawAnything,
  drawTracker,
  hoverToChooseTool,
  smooth
} from './draw.js'

import {trackHand, predict} from './trackHand'

import store from '../store'
import {Path} from 'paper'

import store, {toggleErase, toggleDraw} from '../store'
//will be moved to UI
let minPartConfidence = 0.75

/*
Setup video size
*/
// vv Amber's hardcoded data until resolution fix
// export let videoHeight = 723
// export let videoWidth = 964
export let videoHeight
export let videoWidth

if (3 * parent.innerWidth / 4 > parent.innerHeight) {
  videoHeight = parent.innerHeight
  videoWidth = Math.ceil(4 * parent.innerHeight / 3)
} else {
  videoWidth = parent.innerWidth
  videoHeight = Math.ceil(3 * parent.innerWidth / 4)
}

//this is a fix for a current issue - if we attempt to render a full size video feed (larger than ~723px high), we are thrown a WebGL error and the <video> HTML element is rendered incorrectly
if (videoHeight > 723 || videoWidth > 964) {
  videoHeight = 723
  videoWidth = 964
}

//FOR DEBUG PURPOSES
videoHeight = 723
videoWidth = 964
/*
 Loads a the camera to be used on canvas
 */
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
    minPoseConfidence: 0.1,
    minPartConfidence //moved to top for ease of change
  },
  output: {
    showVideo: true,
    showPoints: true
  },
  net: null
}

let handRight
let handLeft
let handSpan
let eraseSwitchedOff = false

//this function loops through each frame, feeding an image to posenet for pose estimation
function detectPoseInRealTime(video, net, model, mobileNet) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')

  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  const handCanvas = document.getElementById('hand')
  handCanvas.height = 224
  handCanvas.width = 224

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

  // ***** SELECTION CIRCLE SMOOTHING TECH *****
  /*The following is used for smoothing the tracking circle
  An average is collected of the last five frames. Assigned
  'framesAveraged' to a const, so that we can easily change this
  later, as needed.*/
  let currentPoseNum = 0
  const frames = 5
  let lastFewXCoords = Array(frames).fill('null')
  let lastFewYCoords = Array(frames).fill('null')
  /*End of smoothing tech*/

  async function poseDetectionFrame(prevPoses = [], path) {
    //start our frame counter, reset if reached 5

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor
    const outputStride = +guiState.input.outputStride

    let poses = []
    let minPoseConfidence
    let minPartConfidence
    /*eslint-disable*/

    const pose = await net.estimateSinglePose(
      video,
      imageScaleFactor,
      flipHorizontal,
      outputStride
    )
    poses.push(pose)

    minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence
    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence

    /*eslint-enable*/

    backgroundctx.save()
    backgroundctx.scale(-1, 1)
    backgroundctx.translate(-videoWidth, 0)
    backgroundctx.drawImage(video, 0, 0, videoWidth, videoHeight)
    backgroundctx.restore()

    // For each pose (i.e. person) detected in an image (though we have only one at present), draw line from the chosen keypoint
    /*eslint-disable*/
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (prevPoses.length) {
          let eraseMode = document.getElementById('erase-button')
          let eraseModeValue = eraseMode.attributes.value.nodeValue
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

          //hand "keypoint" defintion: manual definition for each smooths rendering

          //define "hand" on the right arm using wrist and elbow position
          const yDiffRight = leftWrist.position.y - leftElbow.position.y
          const handYRight = yDiffRight / 2 + leftWrist.position.y
          const xDiffRight = leftWrist.position.x - leftElbow.position.x
          const handXRight = xDiffRight / 2 + leftWrist.position.x
          handRight = {
            score: leftWrist.score,
            position: {y: handYRight, x: handXRight}
          }
          keypoints[17] = handRight

          // if (!handSpan) {
          //   //pretty wonky attempt at general size of hand-extended-toward-camera
          //   handSpan = Math.floor(
          //     Math.abs(leftShoulder.position.x - rightShoulder.position.x)
          //   )
          // }

          //here we define "hand" on the left arm using wrist and elbow position
          const yDiffLeft = rightWrist.position.y - rightElbow.position.y
          const handYLeft = yDiffLeft / 2 + rightWrist.position.y
          const xDiffLeft = rightWrist.position.x - rightElbow.position.x
          const handXLeft = xDiffLeft / 2 + rightWrist.position.x
          handLeft = {
            score: rightWrist.score,
            position: {y: handYLeft, x: handXLeft}
          }
          keypoints[18] = handLeft

          //****DRAWING ACTION ****/

          let currentBodyPart = store.getState().paintTools.chosenBodyPart

          //if somebody is there, calculate drawing needs
          if (nose.score >= minPartConfidence) {
            //determine current drawing tool and its coordinates
            let keypoint =
              currentBodyPart === 'nose'
                ? nose
                : currentBodyPart === 'leftHand' ? handLeft : handRight

            //When the user is hovering near the toolbar, kick off selection funcs (utils/draw.js)

            let {x, y} = keypoint.position

            if (x > 0 && y < 200) {
              hoverToChooseTool(x, y)
            }

            //to smooth points
            //add to arrays for averaging over frames
            lastFewXCoords[currentPoseNum] = x
            lastFewYCoords[currentPoseNum] = y

            if (!lastFewXCoords.includes('null')) {
              keypoint = smooth(lastFewXCoords, lastFewYCoords)
            }

            //draw dot
            drawTracker(keypoint, videoWidth, videoHeight, paintingPointerCtx)

            //track gesture
            trackHand(
              handSpan,
              handXRight,
              handYRight,
              handCanvas,
              backgroundCanvas
            )

            if (eraseModeValue === 'false') {
              ctx.globalCompositeOperation = 'source-over'

              if (draw()) {
                const thisPath = drawAnything(keypoint, path)
                path = thisPath
              } else {
                path.removeSegment(path.segments.length - 1)

                //this turns off both erase and draw mode once there are no more segments to remove
                if (path.segments.length === 0) {
                  path = null
                  store.dispatch(toggleErase())
                  if (store.getState().paintTools.drawModeOn === true) {
                    store.dispatch(toggleDraw())
                  }
                }
              }
            }
          }
        }
      }
    })

    //implement hand recognition from trackHand.js
    predict(handCanvas, model, mobileNet)

    //increment/reset frame count
    currentPoseNum < 4 ? currentPoseNum++ : (currentPoseNum = 0)

    if (store.getState().paintTools.drawModeOn === false) {
      path = null
      paintingPointerCtx.clearRect(0, 0, videoWidth, videoHeight)
      lastFewXCoords = Array(frames).fill('null')
      lastFewYCoords = Array(frames).fill('null')
    }

    requestAnimationFrame(() => poseDetectionFrame(poses, path))
  }

  poseDetectionFrame()
}
/*eslint-enable*/

// model to our pretrained version
async function loadModel() {
  let ml = await tf.loadModel('http://localhost:8080/mymodel.json')
  return ml
}

//also highly-trained model it was built on
async function loadTruncatedMobileNet() {
  const mobilenet = await tf.loadModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  )

  const layer = mobilenet.getLayer('conv_pw_13_relu')
  let tmn = tf.model({inputs: mobilenet.inputs, outputs: layer.output})
  return tmn
}

//load models, find camera, set off detectPose
export async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75)
  const model = await loadModel()
  const mobileNet = await loadTruncatedMobileNet()

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

// kick off the demo
bindPage()
