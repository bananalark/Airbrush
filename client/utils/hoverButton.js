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

let hoverFramesCaptured = 50
let hoverCoords = Array(hoverFramesCaptured)
let approveArray = Array(hoverFramesCaptured)
let frameNum = 0

const shouldHoverPressButton = (yCoordsArray, frames, zone) => {
  let threshold = zone.y // this appears to be the offset
  // console.log('threshold--->', threshold)

  let averagePosition =
    yCoordsArray.reduce((acc, coords) => acc + coords, 0) / frames

  // console.log('average position--->', averagePosition)

  if (Math.abs(threshold - averagePosition) <= 35) {
    return 1
  } else {
    return 0
  }
}

/*eslint-disable*/
export const hoverToChooseTool = yCoord => {
  const voiceToggleZone = document
    .getElementById('voice-button')
    .getBoundingClientRect()

  // console.log(voiceToggleZone)
  const drawingHandZone = document
    .getElementById('body-part-option')
    .getBoundingClientRect()
  const drawModeToggleZone = document.getElementById('draw-button')
  const brushSelectionZone = document.getElementById('brush-button')
  const eraseModeToggleZone = document.getElementById('erase-button')
  const clearCanvasZone = document.getElementById('clear-button')
  const snapshotZone = document.getElementById('take-snapshot')

  //ALTERNATIVE: Keep 30 frames in an array. Check what percentage of the coords
  //are in our button zone. A certain percentage yields a touch.

  hoverCoords[frameNum % hoverFramesCaptured] = yCoord

  //if average of last few hover cords are in the same general area, address that button.

  let lastFewHoverCoordsAverage
  if (hoverCoords[hoverFramesCaptured - 1]) {
    lastFewHoverCoordsAverage =
      hoverCoords.reduce((acc, coords) => acc + coords, 0) / hoverFramesCaptured
  }

  if (Math.abs(lastFewHoverCoordsAverage - voiceToggleZone.top) <= 50) {
  }

  frameNum += 1

  approveArray[frameNum % hoverFramesCaptured] = shouldHoverPressButton(
    hoverCoords,
    hoverFramesCaptured,
    voiceToggleZone
  )

  let averageOfUserInZone = Math.round(
    approveArray.reduce((acc, bool) => acc + bool, 0) / hoverFramesCaptured
  )
  // console.log(approveArray)

  if (averageOfUserInZone === 1) {
    store.dispatch(toggleVoice())
    voiceModeStartStop()

    hoverCoords = Array(hoverFramesCaptured)
    approveArray = Array(hoverFramesCaptured)
    frameNum = 0
  }
}
/*eslint-enable*/
