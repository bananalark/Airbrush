const paper = require('paper')
import store, {
  toggleVoice,
  chooseBodyPart,
  toggleDraw,
  chooseBrush,
  toggleErase
} from '../store'
import {Size, Path} from 'paper'
import {videoHeight, videoWidth} from './camera'
import {voiceModeStartStop, isChrome} from './speechUtil'
import KalmanFilter from 'kalmanjs'

const xFilter = new KalmanFilter()
const yFilter = new KalmanFilter()

let fullImageStr

let voiceZoneHoverStart = 0
let drawingHandHoverStart = 0
let drawModeHoverStart = 0
let brushOptionHoverStart = 0
let eraserModeHoverStart = 0
let clearCanvasHoverStart = 0
let snapshotHoverStart = 0

let hoverFramesCaptured = 30
let hoverCoords = Array(30)

/*eslint-disable*/
export const hoverToChooseTool = async (xCoord, yCoord) => {
  const paintingPointerCanvas = document.getElementById('painting-pointer')
  const paintingPointerCtx = paintingPointerCanvas.getContext('2d')
  const hoverTimer = 30

  const confirmSelectionCircle = zone => {
    paintingPointerCtx.beginPath()
    paintingPointerCtx.arc(xCoord, yCoord, 50, 0, 2 * Math.PI, true)
    paintingPointerCtx.fillStyle = 'rgba(197, 59, 38, 1)'
    paintingPointerCtx.fill()
    zone = 0
  }

  //ALTERNATIVE: Keep 30 frames in an array. Check what percentage of the coords
  //are in our button zone. A certain percentage yields a touch.

  if (yCoord >= 0 && yCoord < 100) {
    hoverCoords[voiceZoneHoverStart % hoverFramesCaptured] = yCoord

    console.log(hoverCoords)
    voiceZoneHoverStart += 1
    // if (voiceZoneHoverStart === hoverTimer) {
    //   confirmSelectionCircle(voiceZoneHoverStart)
    //   await store.dispatch(toggleVoice())
    //   voiceModeStartStop()
    //   voiceZoneHoverStart = 0
    // }
  }

  /* TODO: We'll have to move the hand/nose-drawer open/close state to REDUX if we want touch functionality. -Amber*/
  // TODO: Since the user can only click their chosen body part, we need to remember to toggle draw mode OFF
  // if (yCoord >= 100 && yCoord < 175) {
  //   drawingHandHoverStart += 1
  //   if (drawingHandHoverStart === hoverTimer) {
  //     confirmSelectionCircle(drawingHandHoverStart)
  //     await store.dispatch(chooseBodyPart())
  //     drawingHandHoverStart = 0
  //   }
  // }

  if (yCoord >= 200 && yCoord < 275) {
    drawModeHoverStart += 1
    if (drawModeHoverStart === hoverTimer) {
      confirmSelectionCircle(drawModeHoverStart)
      await store.dispatch(toggleDraw())
      drawModeHoverStart = 0
    }
  }

  /* TODO: We'll have to move the brush-drawer open/close state to REDUX if we want touch functionality. -Amber*/
  // if (yCoord >= 275 && yCoord < 350) {
  //   // console.log('you may be in the brush select zone')
  //   brushOptionHoverStart += 1
  //   if (brushOptionHoverStart === hoverTimer) {
  //     confirmSelectionCircle(brushOptionHoverStart)
  //     await store.dispatch(chooseBrush())
  //     brushOptionHoverStart = 0
  //   }
  // }

  if (yCoord >= 390 && yCoord < 425) {
    eraserModeHoverStart += 1
    if (eraserModeHoverStart === hoverTimer) {
      confirmSelectionCircle(eraserModeHoverStart)
      await store.dispatch(toggleErase())
      eraserModeHoverStart = 0
    }
  }
  if (yCoord >= 475 && yCoord < 575) {
    clearCanvasHoverStart += 1
    if (clearCanvasHoverStart === hoverTimer) {
      confirmSelectionCircle(clearCanvasHoverStart)
      clearCanvas()
      clearCanvasHoverStart = 0
    }
  }
  if (yCoord >= 600) {
    snapshotHoverStart += 1
    if (snapshotHoverStart === hoverTimer) {
      download()
      snapshotHoverStart = 0
    }
  }
}
/*eslint-enable*/
