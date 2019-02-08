import store, {
  toggleVoice,
  toggleDraw,
  toggleErase,
  toggleBodyPart,
  toggleBrush,
  toggleColorPicker,
  takeSnapshot
} from '../store'
import {fetchZones, hoverToChooseBrush} from './hoverButtonBrushes'
import {voiceModeStartStop} from './speechUtil'
import {saveCanvas} from './snapshot'
import {clearCanvas} from './draw'
import 'lightbox-react/style.css'

export const hoverFramesCaptured = 30 //this can be adjusted for button responsiveness
let hoveryCoords = Array(hoverFramesCaptured)
let hoverxCoords = Array(hoverFramesCaptured)
let frameNum = 0

class LingerTimer {
  constructor() {
    this.voiceToggleZone = 0
    this.drawingHandZone = 0
    this.brushSelectionZone = 0
    this.eraseModeToggleZone = 0
    this.colorPickerToggleZone = 0
    this.clearCanvasZone = 0
    this.snapshotZone = 0
  }
}

let lingerTimer = new LingerTimer()
const lingers = [
  'voiceToggleZone',
  'drawingHandZone',
  'brushSelectionZone',
  'eraseModeToggleZone',
  'colorPickerToggleZone',
  'clearCanvasZone',
  'snapshotZone'
]
export const timeToLinger = 10

//This can be adjusted for fine-tuning. I find that 20 gives us about the right amount of wiggle room.
export const inaccuracyAllowance = 30

const resetCoordMarkers = () => {
  //user to reset frame info after each touch
  hoveryCoords = Array(hoverFramesCaptured)
  hoverxCoords = Array(hoverFramesCaptured)
  frameNum = 0
  lingers.forEach(zone => (lingerTimer[zone] = 0))
}

/*eslint-disable*/
export const hoverToChooseTool = (xCoord, yCoord) => {
  const {
    voiceToggleZone,
    drawingHandZone,
    brushSelectionZone,
    eraseModeToggleZone,
    colorPickerToggleZone,
    clearCanvasZone,
    snapshotZone
  } = fetchZones()
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

  const buttonMidpoint = zone => {
    let middle = (zone.bottom - zone.top) / 2
    return zone.top + middle
  }

  const insideButton = zone => {
    if (
      Math.abs(lastFewHoverYcoordsAverage - buttonMidpoint(zone)) <=
        inaccuracyAllowance &&
      lastFewHoverXcoordsAverage <= zone.right + 5 &&
      lastFewHoverXcoordsAverage >= zone.left - 5 &&
      lastFewHoverYcoordsAverage >= zone.top - 5 &&
      lastFewHoverYcoordsAverage <= zone.bottom + 5
    ) {
      return true
    } else {
      return false
    }
  }

  //VOICE ON/OFF
  if (insideButton(voiceToggleZone) === true) {
    lingerTimer.voiceToggleZone += 1
    if (lingerTimer.voiceToggleZone === timeToLinger) {
      lingerTimer.voiceToggleZone = 0
      store.dispatch(toggleVoice())
      voiceModeStartStop()
      resetCoordMarkers()
    }
  }

  //HAND/NOSE SELECT
  if (insideButton(drawingHandZone) === true) {
    lingerTimer.drawingHandZone += 1
    console.log('brush lingering', lingerTimer.drawingHandZone)
    if (lingerTimer.drawingHandZone === timeToLinger) {
      lingerTimer.drawingHandZone = 0
      store.dispatch(toggleBodyPart())
      resetCoordMarkers()
    }
  }

  //BRUSH SELECT
  if (insideButton(brushSelectionZone) === true) {
    lingerTimer.brushSelectionZone += 1
    if (lingerTimer.brushSelectionZone === timeToLinger) {
      lingerTimer.brushSelectionZone = 0
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }

  // //UNDO
  if (insideButton(eraseModeToggleZone) === true) {
    lingerTimer.eraseModeToggleZone += 1
    console.log('brush lingering', lingerTimer.eraseModeToggleZone)
    if (lingerTimer.eraseModeToggleZone === timeToLinger) {
      lingerTimer.eraseModeToggleZone = 0
      store.dispatch(toggleErase())
      resetCoordMarkers()
    }
  }

  // //COLOR PICKER
  if (insideButton(colorPickerToggleZone) === true) {
    lingerTimer.colorPickerToggleZone += 1
    console.log('brush lingering', lingerTimer.colorPickerToggleZone)
    if (lingerTimer.colorPickerToggleZone === timeToLinger) {
      lingerTimer.colorPickerToggleZone = 0
      store.dispatch(toggleColorPicker())
      resetCoordMarkers()
    }
  }

  // ////CLEAR CANVAS
  if (insideButton(clearCanvasZone) === true) {
    lingerTimer.clearCanvasZone += 1
    console.log('brush lingering', lingerTimer.clearCanvasZone)
    if (lingerTimer.clearCanvasZone === timeToLinger) {
      lingerTimer.clearCanvasZone = 0
      clearCanvas()
      resetCoordMarkers()
    }
  }

  // ////SNAPSHOT
  if (insideButton(snapshotZone) === true) {
    lingerTimer.snapshotZone += 1
    console.log('brush lingering', lingerTimer.snapshotZone)
    if (lingerTimer.snapshotZone === timeToLinger) {
      const imgStr = saveCanvas()
      store.dispatch(takeSnapshot(imgStr))
      resetCoordMarkers()
    }
  }

  frameNum += 1
}
/*eslint-enable*/
