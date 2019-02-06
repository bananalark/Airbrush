import store, {
  toggleVoice,
  toggleDraw,
  toggleErase,
  toggleBodyPart,
  toggleBrush,
  toggleColorPicker
} from '../store'
import {voiceModeStartStop} from './speechUtil'
import {clearCanvas, download, saveCanvas} from './draw'

let hoverFramesCaptured = 30 //this can be adjusted for button responsiveness
let hoveryCoords = Array(hoverFramesCaptured)
let hoverxCoords = Array(hoverFramesCaptured)
let frameNum = 0
let lingerTimer = 0

const resetCoordMarkers = () => {
  //user to reset frame info after each touch
  hoveryCoords = Array(hoverFramesCaptured)
  hoverxCoords = Array(hoverFramesCaptured)
  frameNum = 0
  lingerTimer = 0
}

/*eslint-disable*/
export const hoverToChooseTool = (xCoord, yCoord) => {
  // *** This is where the buttons are located on the canvas *** //
  const voiceToggleZone = document
    .getElementById('voice-button')
    .getBoundingClientRect()

  const drawingHandZone = document
    .getElementById('body-part-option')
    .getBoundingClientRect()

  const brushSelectionZone = document
    .getElementById('brush-button')
    .getBoundingClientRect()

  const eraseModeToggleZone = document
    .getElementById('erase-button')
    .getBoundingClientRect()
  const colorPickerToggleZone = document
    .getElementById('color-picker')
    .getBoundingClientRect()

  const clearCanvasZone = document
    .getElementById('clear-button')
    .getBoundingClientRect()

  const snapshotZone = document
    .getElementById('take-snapshot')
    .getBoundingClientRect()

  // const toolbarLeftBorder = voiceToggleZone.width + 20
  // const toolbarRightBorder = voiceToggleZone.width + 20
  const toolbarOffset = 215
  let toolbarLeftBorder = voiceToggleZone.left
  let toolbarRightBorder = voiceToggleZone.right + 20

  // console.log('your x-Coord', xCoord)
  // // // console.log(voiceToggleZone)
  // console.log('toolbarLeftborder', toolbarLeftBorder)
  // console.log('toolbarRightborder', toolbarRightBorder)
  /*
  APPROACH: 
  Keep n coordinates (var hoverFramesCaptured) from unique 
  frames in an array (var hoverCoords). 
  
  Check the average of those coordinates. If that average 
  falls within an acceptable innaccuracy boundary (var inaccuracyAllowance), 
  then that hover action yields a touch.
  */

  hoveryCoords[frameNum % hoverFramesCaptured] = yCoord
  hoverxCoords[frameNum % hoverFramesCaptured] = xCoord

  let lastFewHoverYcoordsAverage
  let lastFewHoverXcoordsAverage
  const offset = 120

  lastFewHoverYcoordsAverage =
    hoveryCoords.reduce((acc, coords) => acc + coords, 0) /
      hoverFramesCaptured +
    offset

  lastFewHoverXcoordsAverage =
    hoverxCoords.reduce((acc, coords) => acc + coords, 0) /
      hoverFramesCaptured +
    toolbarOffset

  const userLingersInZone = (allowance, y) => {
    if (
      Math.abs(lastFewHoverYcoordsAverage - y) <= allowance &&
      lastFewHoverXcoordsAverage <= toolbarRightBorder &&
      lastFewHoverXcoordsAverage >= toolbarLeftBorder
    ) {
      console.log('lingering!')
      lingerTimer += 1
      console.log(lingerTimer)
    }
    if (lingerTimer === 10) {
      lingerTimer = 0
      return true
    }
  }

  const buttonMidpoint = zone => {
    // console.log('zone bottom--->', zone.bottom)
    // console.log('zone top--->', zone.top)
    let middle = (zone.bottom - zone.top) / 2
    return zone.top + middle
  }

  //This can be adjusted for fine-tuning. I find that 30 gives us
  //about the right amount of wiggle room.
  const inaccuracyAllowance = 20

  // TODO: This may need some serious refactoring. It's getting crazy. -Amber

  //VOICE ON/OFF
  if (
    userLingersInZone(inaccuracyAllowance, buttonMidpoint(voiceToggleZone)) &&
    lastFewHoverYcoordsAverage <= drawingHandZone.top
  ) {
    store.dispatch(toggleVoice())
    voiceModeStartStop()
    resetCoordMarkers()
  }

  //HAND/NOSE SELECT
  if (
    userLingersInZone(inaccuracyAllowance, buttonMidpoint(drawingHandZone)) &&
    lastFewHoverYcoordsAverage <= brushSelectionZone.top
  ) {
    store.dispatch(toggleBodyPart())
    resetCoordMarkers()
  }

  //BRUSH SELECT
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(brushSelectionZone)
    ) &&
    lastFewHoverYcoordsAverage <= eraseModeToggleZone.top
  ) {
    store.dispatch(toggleBrush())
    resetCoordMarkers()
  }

  //COLOR PICKER
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(colorPickerToggleZone)
    ) &&
    lastFewHoverYcoordsAverage <= clearCanvasZone.top
  ) {
    store.dispatch(toggleColorPicker())
    resetCoordMarkers()
  }

  //CLEAR CANVAS
  if (
    userLingersInZone(inaccuracyAllowance, buttonMidpoint(clearCanvasZone)) &&
    lastFewHoverYcoordsAverage <= snapshotZone.top
  ) {
    clearCanvas()
    resetCoordMarkers()
  }

  //SNAPSHOT
  if (
    userLingersInZone(inaccuracyAllowance, buttonMidpoint(snapshotZone)) &&
    lastFewHoverYcoordsAverage >= clearCanvasZone.bottom
  ) {
    saveCanvas()
    resetCoordMarkers()
  }

  frameNum += 1
}
/*eslint-enable*/
