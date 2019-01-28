import * as posenet from '@tensorflow-models/posenet'
const paper = require('paper')
import {
  draw,
  drawLineBetweenPoints,
  createProject,
  drawLine
} from './utils/draw.js'
import clearCanvas from './utils/clearCanvas'
import {Path} from 'paper'

export const videoWidth = 600
const videoHeight = 500

/**
 * Loads a the camera to be used in the demo
 *
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
    minPartConfidence: 0.5
  },
  output: {
    showVideo: true,
    showPoints: true
  },
  net: null
}

/**
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(net) {
  guiState.net = net
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
let path
let hand

function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')
  //current rendering of video feed:
  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  const flipHorizontal = true

  canvas.width = videoWidth
  canvas.height = videoHeight
  backgroundCanvas.width = videoWidth
  backgroundCanvas.height = videoHeight

  //begin the paper.js project, located in utils/draw.js
  createProject(window, canvas)

  async function poseDetectionFrame(prevPoses = [], innerPath = path) {
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose()

      // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
      // version
      guiState.net = await posenet.load(+guiState.changeToArchitecture)

      guiState.changeToArchitecture = null
    }

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor
    const outputStride = +guiState.input.outputStride

    let poses = []
    let prevKeypoints
    let prevScore
    let minPoseConfidence
    let minPartConfidence
    /*eslint-disable*/

    const pose = await guiState.net.estimateSinglePose(
      video,
      imageScaleFactor,
      flipHorizontal,
      outputStride
    )
    poses.push(pose)

    minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence
    minPartConfidence = +guiState.singlePoseDetection.minPartConfidence

    /*eslint-enable*/

    if (guiState.output.showVideo) {
      backgroundctx.save()
      backgroundctx.scale(-1, 1)
      backgroundctx.translate(-videoWidth, 0)
      backgroundctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      backgroundctx.restore()
    }

    // For each pose (i.e. person) detected in an image (though we have only one at present), draw line from the chosen keypoint
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        if (draw(keypoints, minPartConfidence)) {
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

            //beginning to map out hand. will implement after finish integrating paper.js
            const yDiff = leftWrist.position.y - leftElbow.position.y
            const handY = yDiff / 2 + leftWrist.position.y
            const xDiff = leftWrist.position.x - leftElbow.position.x
            const handX = xDiff / 2 + leftWrist.position.x
            hand = {position: {y: handY, x: handX}}

            if (eraseModeValue === 'false') {
              ctx.globalCompositeOperation = 'source-over'

              const thisPath = drawLine(hand, path)

              path = thisPath
            } else {
              ctx.globalCompositeOperation = 'destination-out'

              //needs refactor for using hand - having trouble passing into loop
              //keypoints[9] == leftWrist (but literally your right wrist)
              drawLineBetweenPoints(
                [keypoints[9], prevPoses[0].keypoints[9]],
                ctx,
                1,
                15
              )
            }
          }
        }
      }
      prevKeypoints = keypoints
      prevScore = score
    })
    requestAnimationFrame(() => poseDetectionFrame(poses, path))
  }

  poseDetectionFrame()
}

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75)

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

  clearCanvas()
  setupGui(net)
  setTimeout(() => detectPoseInRealTime(video, net), 1000)
}

// kick off the demo
bindPage()
