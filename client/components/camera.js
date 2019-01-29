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
import store from '../store'

let videoHeight
let videoWidth

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

const getCurrentCommand = () => store.getState().speech.currentCommand

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
  // console.log(test)
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
    minPartConfidence: 0.7
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
let path
let hand

function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')

  const flipHorizontal = true

  canvas.width = videoWidth
  canvas.height = videoHeight

  //begin the paper.js project, located in utils/draw.js
  createProject(window, canvas)

  async function poseDetectionFrame(prevPoses = [], innerPath = path) {
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

    // For each pose (i.e. person) detected in an image (though we have only one at present), draw line from the chosen keypoint
    /*eslint-disable*/
    poses.forEach(({score, keypoints}) => {
      if (score >= minPoseConfidence) {
        //'if we want to draw a line now'
        console.log('CURRENTCOMMAND---->', getCurrentCommand())
        if (
          draw(keypoints, minPartConfidence) ||
          (getCurrentCommand() === 'start' && getCurrentCommand() !== 'stop')
        ) {
          // if (currentCommand) {
          // }
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
            hand = {score: leftWrist.score, position: {y: handY, x: handX}}
            keypoints[17] = hand

            // console.log(rightWrist.position, rightShoulder.position)
            // console.log('ERASEMODEVAL, CURRENTLY---->', eraseModeValue)
            if (hand.score > minPartConfidence) {
              ctx.globalCompositeOperation = 'source-over'
              const thisPath = drawLine(hand, path)

              path = thisPath
              if (eraseModeValue === true) {
                ctx.globalCompositeOperation = 'destination-out'

                //needs refactor for using hand - having trouble passing into loop
                //keypoints[9] == leftWrist (but literally your right wrist)
                if (prevPoses[0].keypoints[17]) {
                  drawLineBetweenPoints(
                    [hand, prevPoses[0].keypoints[17]],
                    ctx,
                    1,
                    15
                  )
                }
              }
            }
          }
        } else if (
          keypoints[10].score >= minPartConfidence &&
          Math.abs(keypoints[10].position.y - keypoints[6].position.y) > 150
        ) {
          path = null
        }
      }
      prevKeypoints = keypoints
      prevScore = score
    })
    requestAnimationFrame(() => poseDetectionFrame(poses, path))
  }

  poseDetectionFrame()
}
/*eslint-enable*/

/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
  // Load the PoseNet model weights with architecture 0.75
  const net = await posenet.load(0.75)

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
