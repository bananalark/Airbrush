import * as posenet from '@tensorflow-models/posenet'
import dat from '../../node_modules/dat.gui'
import Stats from '../../node_modules/stats.js'

import {
  draw,
  drawBoundingBox,
  drawKeypoints,
  drawSkeleton,
  drawLineBetweenPoints,
  clearCanvas
} from './utils'

export const videoWidth = 600
const videoHeight = 500
const stats = new Stats()

function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function isMobile() {
  return isAndroid() || isiOS()
}

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    )
  }

  const video = document.getElementById('video')
  video.width = videoWidth
  video.height = videoHeight

  const mobile = isMobile()
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: 'user',
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight
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
    mobileNetArchitecture: isMobile() ? '0.50' : '0.75',
    outputStride: 16,
    imageScaleFactor: 0.5
  },
  singlePoseDetection: {
    minPoseConfidence: 0.1,
    minPartConfidence: 0.5
  },
  multiPoseDetection: {
    maxPoseDetections: 5,
    minPoseConfidence: 0.15,
    minPartConfidence: 0.1,
    nmsRadius: 30.0
  },
  output: {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    showBoundingBox: false
  },
  net: null
}

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')
  //current rendering of video feed:
  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  // since images are being fed from a webcam
  const flipHorizontal = true

  canvas.width = videoWidth
  canvas.height = videoHeight
  backgroundCanvas.width = videoWidth
  backgroundCanvas.height = videoHeight

  async function poseDetectionFrame(prevPoses = []) {
    if (guiState.changeToArchitecture) {
      // Important to purge variables and free up GPU memory
      guiState.net.dispose()

      // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
      // version
      guiState.net = await posenet.load(+guiState.changeToArchitecture)

      guiState.changeToArchitecture = null
    }

    // Begin monitoring code for frames per second
    stats.begin()

    // Scale an image down to a certain factor. Too large of an image will slow
    // down the GPU
    const imageScaleFactor = guiState.input.imageScaleFactor
    const outputStride = +guiState.input.outputStride

    let poses = []
    let minPoseConfidence
    let minPartConfidence
    /*eslint-disable*/
    switch (guiState.algorithm) {
      case 'single-pose':
        const pose = await net.estimateSinglePose(
          video,
          imageScaleFactor,
          flipHorizontal,
          outputStride
        )
        poses.push(pose)

        minPoseConfidence = +guiState.singlePoseDetection.minPoseConfidence
        minPartConfidence = +guiState.singlePoseDetection.minPartConfidence
        break
      case 'multi-pose':
        poses = await guiState.net.estimateMultiplePoses(
          video,
          imageScaleFactor,
          flipHorizontal,
          outputStride,
          guiState.multiPoseDetection.maxPoseDetections,
          guiState.multiPoseDetection.minPartConfidence,
          guiState.multiPoseDetection.nmsRadius
        )

        minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence
        minPartConfidence = +guiState.multiPoseDetection.minPartConfidence

        break
    }
    /*eslint-enable*/

    /*
     *  This if-block allows video to play behind the canvas on which we're drawing.
     */
    if (guiState.output.showVideo) {
      backgroundctx.save()
      backgroundctx.scale(-1, 1)
      backgroundctx.translate(-videoWidth, 0)
      backgroundctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      backgroundctx.restore()
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        let command = require('./voiceUtils')
        if (
          draw(keypoints, minPartConfidence) ||
          command.speechResult === 'start'
        ) {
          if (prevPoses.length) {
            let eraseMode = document.getElementById('erase-button')
            let eraseModeValue = eraseMode.attributes.value.nodeValue

            if (eraseModeValue === 'false') {
              ctx.globalCompositeOperation = 'source-over'
              drawLineBetweenPoints(
                [keypoints[0], prevPoses[0].keypoints[0]],
                ctx,
                1,
                5
              )
            } else if (
              // !draw(keypoints, minPartConfidence) ||
              // command.speechResult === 'stop'
              eraseModeValue === 'true'
            ) {
              ctx.globalCompositeOperation = 'destination-out'
              drawLineBetweenPoints(
                [keypoints[0], prevPoses[0].keypoints[0]],
                ctx,
                1,
                15
              )
            }
          }
        }
      }
    })

    // End monitoring code for frames per second
    stats.end()

    requestAnimationFrame(() => poseDetectionFrame(poses))
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

  // document.getElementById('loading').style.display = 'none'
  document.getElementById('display').style.display = 'block'

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
  setTimeout(() => detectPoseInRealTime(video, net), 1000)
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia
// kick off the demo
bindPage()
