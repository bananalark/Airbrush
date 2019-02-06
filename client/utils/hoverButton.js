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

const resetCoordMarkers = () => {
  //user to reset frame info after each touch
  hoveryCoords = Array(hoverFramesCaptured)
  hoverxCoords = Array(hoverFramesCaptured)
  frameNum = 0
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

  // const drawModeToggleZone = document
  //   .getElementById('draw-button')
  //   .getBoundingClientRect()

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

  const toolbarRightBorder = voiceToggleZone.width + 20

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

  lastFewHoverYcoordsAverage =
    hoveryCoords.reduce((acc, coords) => acc + coords, 0) / hoverFramesCaptured

  lastFewHoverXcoordsAverage =
    hoverxCoords.reduce((acc, coords) => acc + coords, 0) / hoverFramesCaptured

  const offset = 120
  // console.log(
  //   'hoverAvg+offset--->',
  //   Number(lastFewHoverYcoordsAverage + offset)
  // )
  const userLingersInZone = (allowance, y) => {
    return (
      Math.abs(lastFewHoverYcoordsAverage + offset - y) <= allowance &&
      lastFewHoverXcoordsAverage <= toolbarRightBorder
    )
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
  if (
    userLingersInZone(inaccuracyAllowance, buttonMidpoint(voiceToggleZone)) &&
    lastFewHoverYcoordsAverage <= drawingHandZone.top
  ) {
    store.dispatch(toggleVoice())
    voiceModeStartStop()
    resetCoordMarkers()
  }
  // else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(drawingHandZone)
  //   ) &&
  //   yCoord >= voiceToggleZone.bottom
  // ) {
  //   store.dispatch(toggleBodyPart())
  //   resetCoordMarkers()
  // } else if (
  //   //   userLingersInZone(
  //   //     inaccuracyAllowance,
  //   //     xCoord,
  //   //     buttonMidpoint(drawModeToggleZone)
  //   //   ) &&
  //   //   yCoord >= drawingHandZone.bottom
  //   // ) {
  //   //   store.dispatch(toggleDraw())
  //   //   resetCoordMarkers()
  //   // } else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(brushSelectionZone)
  //   ) &&
  //   yCoord >= drawModeToggleZone.bottom
  // ) {
  //   store.dispatch(toggleBrush())
  //   resetCoordMarkers()
  // } else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(eraseModeToggleZone)
  //   ) &&
  //   yCoord >= brushSelectionZone.bottom
  // ) {
  //   store.dispatch(toggleErase())
  //   resetCoordMarkers()
  // } else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(colorPickerToggleZone)
  //   ) &&
  //   yCoord >= eraseModeToggleZone.bottom
  // ) {
  //   store.dispatch(toggleColorPicker())
  //   resetCoordMarkers()
  // } else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(clearCanvasZone)
  //   ) &&
  //   yCoord >= colorPickerToggleZone.bottom
  // ) {
  //   clearCanvas()
  //   resetCoordMarkers()
  // } else if (
  //   userLingersInZone(
  //     inaccuracyAllowance,
  //     xCoord,
  //     buttonMidpoint(snapshotZone)
  //   ) &&
  //   yCoord >= clearCanvasZone.bottom
  // ) {
  //   saveCanvas()
  //   download()
  //   resetCoordMarkers()
  // }

  frameNum += 1
}
/*eslint-enable*/
