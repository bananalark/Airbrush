import * as posenet from '@tensorflow-models/posenet'
import {
  draw,
  drawLineBetweenPoints,
  createProject,
  drawAnything
} from './draw.js'

import store from '../store'
//will be moved to UI
let minPartConfidence = 0.75

/*
Setup video size
*/
export let videoHeight = 723
export let videoWidth = 964

// if (3 * parent.innerWidth / 4 > parent.innerHeight) {
//   videoHeight = parent.innerHeight
//   videoWidth = Math.ceil(4 * parent.innerHeight / 3)
// } else {
//   videoWidth = parent.innerWidth
//   videoHeight = Math.ceil(3 * parent.innerWidth / 4)
// }

// //this is a fix for a current issue - if we attempt to render a full size video feed (larger than ~723px high), we are thrown a WebGL error and the <video> HTML element is rendered incorrectly
// if (videoHeight > 723 || videoWidth > 964) {
//   videoHeight = 723
//   videoWidth = 964
// }
let timeInZone = 0

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

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */

let handRight
let handLeft

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

  async function poseDetectionFrame(prevPoses = [], path) {
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

            //here we define "hand" on the right arm using wrist and elbow position
            const yDiffRight = leftWrist.position.y - leftElbow.position.y
            const handYRight = yDiffRight / 2 + leftWrist.position.y
            const xDiffRight = leftWrist.position.x - leftElbow.position.x
            const handXRight = xDiffRight / 2 + leftWrist.position.x
            handRight = {
              score: leftWrist.score,
              position: {y: handYRight, x: handXRight}
            }
            keypoints[17] = handRight

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

            /*here we construct a small green circle to follow the painting hand or nose*/
            let currentBodyPart = store.getState().paintTools.chosenBodyPart
            const painterTracker = (part, vidWidth, vidHeight) => {
              paintingPointerCtx.clearRect(0, 0, vidWidth, vidHeight)
              paintingPointerCtx.beginPath()
              if (part.position) {
                paintingPointerCtx.arc(
                  part.position.x,
                  part.position.y,
                  30,
                  0,
                  2 * Math.PI,
                  true
                )
              }
              paintingPointerCtx.fillStyle = 'rgba(22, 208, 171, 0.58)'
              paintingPointerCtx.fill()
              requestAnimationFrame(painterTracker)
            }

            if (currentBodyPart === 'nose') {
              painterTracker(nose, videoWidth, videoHeight)
            } else if (currentBodyPart === 'rightHand') {
              painterTracker(handRight, videoWidth, videoHeight)
            } else if (currentBodyPart === 'leftHand') {
              painterTracker(handLeft, videoWidth, videoHeight)
            }

            //here we handle the user hovering over the toolbar buttons to select them
            let hoverTool
            if (currentBodyPart === 'nose') {
              hoverTool = nose
            } else if (currentBodyPart === 'rightHand') {
              hoverTool = handLeft
            } else if (currentBodyPart === 'leftHand') {
              hoverTool = handRight
            }

            let hoverToolX = hoverTool.position.x
            let hoverToolY = hoverTool.position.y

            if (hoverToolX > 0 && hoverToolX < 200) {
              if (hoverToolY > 0 && hoverToolY < 100) {
                timeInZone += 1
                console.log(timeInZone)
                if (timeInZone === 50) {
                  console.log('You selected Voice Mode!')
                  timeInZone = 0
                }
              }
              // if (selectorY > 50 && selectorY < 150) {
              //   console.log('you may be in the HAND SELECT zone')
              // }
              // if (selectorY > 100 && selectorY < 150) {
              //   console.log('you may be in the DRAW MODE zone')
              // }
              // if (selectorY > 150 && selectorY < 200) {
              //   console.log('you may be in the BRUSH OPTION zone')
              // }
              // if (selectorY > 200 && selectorY < 250) {
              //   console.log('you may be in the ERASER MODE zone')
              // }
              // if (selectorY > 250 && selectorY < 300) {
              //   console.log('you may be in the COLOR PICKER zone')
              // }
              // if (selectorY > 300 && selectorY < 350) {
              //   console.log('you may be in the CLEAR CANVAS zone')
              // }
              // if (selectorY > 350 && selectorY < 500) {
              //   console.log('you may be in the SNAPSHOT zone')
              // }
              // if (selectorY > 50 && selectorY < 100) {
              //   console.log('you may be in the VOICE zone')
              // }
              // if (selectorY > 100 && selectorY < 150) {
              //   console.log('you may be in the HAND SELECT zone')
              // }
              // if (selectorY > 150 && selectorY < 200) {
              //   console.log('you may be in the DRAW MODE zone')
              // }
              // if (selectorY > 250 && selectorY < 300) {
              //   console.log('you may be in the BRUSH OPTION zone')
              // }
              // if (selectorY > 300 && selectorY < 350) {
              //   console.log('you may be in the ERASER MODE zone')
              // }
              // if (selectorY > 350 && selectorY < 400) {
              //   console.log('you may be in the COLOR PICKER zone')
              // }
              // if (selectorY > 400 && selectorY < 450) {
              //   console.log('you may be in the CLEAR CANVAS zone')
              // }
              // if (selectorY > 450 && selectorY < 500) {
              //   console.log('you may be in the SNAPSHOT zone')
              // }
            }

            if (nose.score >= minPartConfidence) {
              if (eraseModeValue === 'false') {
                ctx.globalCompositeOperation = 'source-over'

                //this calls a utility function in draw.js that chooses which brush tool to use based on our store
                const thisPath = drawAnything(nose, handLeft, handRight, path)

                path = thisPath
              } else {
                // ctx.globalCompositeOperation = 'destination-out'
                // ctx.arc(handX, handY, 2, 0, Math.PI * 2, false)
                // ctx.fill()
                //needs refactor for using nose - having trouble passing into loop
                //keypoints[9] == leftWrist (but literally your right wrist)
                // if (prevPoses[0].keypoints[17]) {
                //   drawLineBetweenPoints(
                //     [handRight, prevPoses[0].keypoints[17]],
                //     ctx,
                //     1,
                //     15
                //   )
                // }
              }
            }
          }
        }
      }

      // } else if (
      //   keypoints[10].score >= minPartConfidence &&
      //   Math.abs(keypoints[10].position.y - keypoints[6].position.y) > 150
      // ) {
      //   path = null
      // }
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

  setTimeout(() => detectPoseInRealTime(video, net), 1000)
}

// kick off the demo
bindPage()
