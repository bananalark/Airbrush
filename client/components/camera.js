import * as posenet from '@tensorflow-models/posenet'
const paper = require('paper')
import {draw, drawLineBetweenPoints} from './utils/draw.js'
import clearCanvas from './utils/clearCanvas'

let videoHeight
let videoWidth

if (5 * window.innerWidth / 6 > window.innerHeight) {
  videoHeight = window.innerHeight
  videoWidth = 6 * window.innerHeight / 5
} else {
  videoWidth = window.innerWidth
  videoHeight = 5 * window.innerWidth / 6
}

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
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')
  //current rendering of video feed:
  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  paper.install(window)

  const flipHorizontal = true

  canvas.width = videoWidth
  canvas.height = videoHeight
  backgroundCanvas.width = videoWidth
  backgroundCanvas.height = videoHeight

  paper.setup(canvas)
  clearCanvas(paper.project)

  let path

  async function poseDetectionFrame(prevPoses = []) {
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

            if (eraseModeValue === 'false') {
              ctx.globalCompositeOperation = 'source-over'

              //beginning to map out hand
              const yDiff = Math.abs(
                leftShoulder.position.y - leftWrist.position.y
              )
              const xDiff = Math.abs(
                leftShoulder.position.x - leftWrist.position.x
              )
              const handDistance =
                Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) / 2 //half the forearm length

              const pathStyle = new Path({
                segments: [leftWrist.position],
                strokeColor: 'aqua',
                strokeWidth: 7,
                strokeCap: 'round'
              })

              if (!path) {
                path = pathStyle
              }
              path.add(leftWrist.position)

              if (path.segments.length > 5) {
                console.log('kaboom')
                path.simplify(10)

                path = pathStyle
              }
            } else {
              ctx.globalCompositeOperation = 'destination-out'
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
    })

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
  setTimeout(() => detectPoseInRealTime(video, net), 1000)
}

// kick off the demo
bindPage()
