import store, {
  toggleVoice,
  toggleDraw,
  toggleErase,
  toggleBodyPart,
  toggleBrush,
  toggleColorPicker,
  takeSnapshot
} from '../store'
import {voiceModeStartStop} from './speechUtil'
import {saveCanvas} from './snapshot'
import {clearCanvas} from './draw'
import 'lightbox-react/style.css'

import Lightbox from 'lightbox-react'

let hoverFramesCaptured = 30 //this can be adjusted for button responsiveness
let hoveryCoords = Array(hoverFramesCaptured)
let hoverxCoords = Array(hoverFramesCaptured)
let frameNum = 0

class LingerTimer {
  constructor() {
    this.voice = 0
    this.handNose = 0
    this.brush = 0
    this.erase = 0
    this.color = 0
    this.clear = 0
    this.snapshot = 0
  }
}

let lingerTimer = new LingerTimer()

const resetCoordMarkers = () => {
  //user to reset frame info after each touch
  hoveryCoords = Array(hoverFramesCaptured)
  hoverxCoords = Array(hoverFramesCaptured)
  // frameNum = 0
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

  const toolbarOffset = 215
  let toolbarLeftBorder = voiceToggleZone.left
  let toolbarRightBorder = voiceToggleZone.right + 20

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

  //Our offset take different window sizes into effect
  const offset = voiceToggleZone.top

  lastFewHoverYcoordsAverage =
    hoveryCoords.reduce((acc, coords) => acc + coords, 0) / hoverFramesCaptured

  lastFewHoverYcoordsAverage += offset

  lastFewHoverXcoordsAverage =
    hoverxCoords.reduce((acc, coords) => acc + coords, 0) /
      hoverFramesCaptured +
    toolbarOffset

  const userLingersInZone = (allowance, y, zone) => {
    if (
      Math.abs(lastFewHoverYcoordsAverage - y) <= allowance &&
      lastFewHoverXcoordsAverage <= toolbarRightBorder &&
      lastFewHoverXcoordsAverage >= toolbarLeftBorder
    ) {
      lingerTimer[zone] += 1
      // console.log(zone, lingerTimer[zone])
    }
    if (lingerTimer[zone] === 15) {
      lingerTimer[zone] = 0
      return true
    } else {
      return false
    }
  }

  const buttonMidpoint = zone => {
    let middle = (zone.bottom - zone.top) / 2
    return zone.top + middle
  }

  //This can be adjusted for fine-tuning. I find that 20 gives us
  //about the right amount of wiggle room.
  const inaccuracyAllowance = 30

  //VOICE ON/OFF
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(voiceToggleZone),
      'voice'
    ) &&
    lastFewHoverYcoordsAverage <= drawingHandZone.top
  ) {
    store.dispatch(toggleVoice())
    voiceModeStartStop()
    resetCoordMarkers()
  }

  //HAND/NOSE SELECT
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(drawingHandZone),
      'handNose'
    ) &&
    lastFewHoverYcoordsAverage <= brushSelectionZone.top &&
    lastFewHoverYcoordsAverage >= voiceToggleZone.bottom
  ) {
    store.dispatch(toggleBodyPart())
    resetCoordMarkers()
  }

  //BRUSH SELECT
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(brushSelectionZone),
      'brush'
    ) &&
    lastFewHoverYcoordsAverage <= eraseModeToggleZone.top &&
    lastFewHoverYcoordsAverage >= drawingHandZone.bottom
  ) {
    store.dispatch(toggleBrush())
    resetCoordMarkers()
  }
  //UNDO
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(eraseModeToggleZone),
      'erase'
    ) &&
    lastFewHoverYcoordsAverage <= colorPickerToggleZone.top &&
    lastFewHoverYcoordsAverage >= brushSelectionZone.bottom
  ) {
    store.dispatch(toggleErase())
    resetCoordMarkers()
  }

  //COLOR PICKER
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(colorPickerToggleZone),
      'color'
    ) &&
    lastFewHoverYcoordsAverage <= clearCanvasZone.top &&
    lastFewHoverYcoordsAverage >= eraseModeToggleZone.bottom
  ) {
    store.dispatch(toggleColorPicker())
    resetCoordMarkers()
  }

  ////CLEAR CANVAS
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(clearCanvasZone),
      'clear'
    ) &&
    lastFewHoverYcoordsAverage <= snapshotZone.top &&
    lastFewHoverYcoordsAverage >= colorPickerToggleZone.bottom
  ) {
    clearCanvas()
    resetCoordMarkers()
  }

  ////SNAPSHOT
  if (
    userLingersInZone(
      inaccuracyAllowance,
      buttonMidpoint(snapshotZone),
      'snapshot'
    ) &&
    lastFewHoverYcoordsAverage >= clearCanvasZone.top &&
    lastFewHoverYcoordsAverage <= snapshotZone.bottom + 20
  ) {
    const imgStr = saveCanvas()
    store.dispatch(takeSnapshot(imgStr))
    resetCoordMarkers()
  }

  frameNum += 1
}
/*eslint-enable*/
