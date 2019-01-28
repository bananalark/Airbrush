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
 * Sets up dat.gui controller on the top-right of the window
 */
function setupGui(cameras, net) {
  guiState.net = net

  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId
  }

  const gui = new dat.GUI({width: 300})

  // The single-pose algorithm is faster and simpler but requires only one
  // person to be in the frame or results will be innaccurate. Multi-pose works
  // for more than 1 person
  const algorithmController = gui.add(guiState, 'algorithm', [
    'single-pose',
    'multi-pose'
  ])

  // The input parameters have the most effect on accuracy and speed of the
  // network
  let input = gui.addFolder('Input')
  // Architecture: there are a few PoseNet models varying in size and
  // accuracy. 1.01 is the largest, but will be the slowest. 0.50 is the
  // fastest, but least accurate.
  const architectureController = input.add(
    guiState.input,
    'mobileNetArchitecture',
    ['1.01', '1.00', '0.75', '0.50']
  )
  // Output stride:  Internally, this parameter affects the height and width of
  // the layers in the neural network. The lower the value of the output stride
  // the higher the accuracy but slower the speed, the higher the value the
  // faster the speed but lower the accuracy.
  input.add(guiState.input, 'outputStride', [8, 16, 32])
  // Image scale factor: What to scale the image by before feeding it through
  // the network.
  input
    .add(guiState.input, 'imageScaleFactor')
    .min(0.2)
    .max(1.0)
  input.open()

  // Pose confidence: the overall confidence in the estimation of a person's
  // pose (i.e. a person detected in a frame)
  // Min part confidence: the confidence that a particular estimated keypoint
  // position is accurate (i.e. the elbow's position)
  let single = gui.addFolder('Single Pose Detection')
  single.add(guiState.singlePoseDetection, 'minPoseConfidence', 0.0, 1.0)
  single.add(guiState.singlePoseDetection, 'minPartConfidence', 0.0, 1.0)

  let multi = gui.addFolder('Multi Pose Detection')
  multi
    .add(guiState.multiPoseDetection, 'maxPoseDetections')
    .min(1)
    .max(20)
    .step(1)
  multi.add(guiState.multiPoseDetection, 'minPoseConfidence', 0.0, 1.0)
  multi.add(guiState.multiPoseDetection, 'minPartConfidence', 0.0, 1.0)
  // nms Radius: controls the minimum distance between poses that are returned
  // defaults to 20, which is probably fine for most use cases
  multi
    .add(guiState.multiPoseDetection, 'nmsRadius')
    .min(0.0)
    .max(40.0)
  multi.open()

  let output = gui.addFolder('Output')
  output.add(guiState.output, 'showVideo')
  output.add(guiState.output, 'showSkeleton')
  output.add(guiState.output, 'showPoints')
  output.add(guiState.output, 'showBoundingBox')
  output.open()

  architectureController.onChange(function(architecture) {
    guiState.changeToArchitecture = architecture
  })

  algorithmController.onChange(function(value) {
    switch (guiState.algorithm) {
      case 'single-pose':
        multi.close()
        single.open()
        break
      case 'multi-pose':
        single.close()
        multi.open()
        break
    }
  })
}

/**
 * Sets up a frames per second panel on the top-left of the window
 */
function setupFPS() {
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
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
        const pose = await guiState.net.estimateSinglePose(
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

    // ctx.clearRect(0, 0, videoWidth, videoHeight)

    if (guiState.output.showVideo) {
      backgroundctx.save()
      backgroundctx.scale(-1, 1)
      backgroundctx.translate(-videoWidth, 0)
      backgroundctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      backgroundctx.restore()

      // ctx.save()
      // ctx.scale(-1, 1)
      // ctx.translate(-videoWidth, 0)
      // ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      // ctx.restore()
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        // if (guiState.output.showPoints) {
        //   //ATTENTION - note the odd syntax here for keypoints. this is because the "drawKeyPoints" function MUST be given an array. I want to pass it only one keypoint, but must wrap that in an array to maintain proper function

        //
        //   drawKeypoints([keypoints[0]], minPartConfidence, ctx)
        // }
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
            } else if (eraseModeValue === 'true') {
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
  setupGui([], net)
  setupFPS()
  setTimeout(() => detectPoseInRealTime(video, net), 1000)
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia
// kick off the demo
bindPage()
