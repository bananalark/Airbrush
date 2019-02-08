import store, {toggleBrush, chooseBrush, chooseSize, toggleDraw} from '../store'
import 'lightbox-react/style.css'

import {
  timeToLinger,
  inaccuracyAllowance,
  hoverFramesCaptured
} from './hoverButton'

import {fetchZones} from './hoverButtonBrushes'

let hoveryCoords = Array(hoverFramesCaptured)
let hoverxCoords = Array(hoverFramesCaptured)
let frameNum = 0

class LingerTimerHandNose {
  constructor() {
    this.leftHand = 0
    this.rightHand = 0
    this.nose = 0
  }
}

let lingerTimer = new LingerTimerHandNose()
let lingers = ['nose', 'leftHand', 'rightHand']
const resetCoordMarkers = () => {
  //user to reset frame info after each touch
  hoveryCoords = Array(hoverFramesCaptured)
  hoverxCoords = Array(hoverFramesCaptured)
  frameNum = 0
  lingers.forEach(zone => (lingerTimer[zone] = 0))
}

export const fetchZones = () => {
  // *** This is where the buttons are located on the canvas *** //

  // *** TOOLBAR BUTTONS *** //
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

  // *** BRUSHES *** //
  const defaultLine = document
    .getElementById('button-brush-defaultLine')
    .getBoundingClientRect()

  const circleLine = document
    .getElementById('button-brush-circleLine')
    .getBoundingClientRect()
  const triangleLine = document
    .getElementById('button-brush-triangleLine')
    .getBoundingClientRect()
  const rectangle = document
    .getElementById('button-brush-rectangle')
    .getBoundingClientRect()
  const circleShape = document
    .getElementById('button-brush-circleShape')
    .getBoundingClientRect()
  const ellipse = document
    .getElementById('button-brush-ellipse')
    .getBoundingClientRect()
  const triangleShape = document
    .getElementById('button-brush-triangleShape')
    .getBoundingClientRect()

  const lineThin = document
    .getElementById('button-size-small')
    .getBoundingClientRect()
  const lineMedium = document
    .getElementById('button-size-medium')
    .getBoundingClientRect()
  const lineThick = document
    .getElementById('button-size-large')
    .getBoundingClientRect()

  return {
    voiceToggleZone,
    drawingHandZone,
    brushSelectionZone,
    eraseModeToggleZone,
    colorPickerToggleZone,
    clearCanvasZone,
    snapshotZone,
    circleLine,
    defaultLine,
    triangleLine,
    rectangle,
    circleShape,
    ellipse,
    triangleShape,
    lineThin,
    lineMedium,
    lineThick
  }
}

/*eslint-disable*/
export const hoverToChooseBrush = (xCoord, yCoord) => {
  const {
    voiceToggleZone,
    circleLine,
    defaultLine,
    triangleLine,
    rectangle,
    circleShape,
    ellipse,
    triangleShape,
    lineThin,
    lineMedium,
    lineThick
  } = fetchZones()
  // const toolbarOffset = 215
  const toolbarOffset = voiceToggleZone.left
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

  if (insideButton(defaultLine) === true) {
    lingerTimer.defaultLine += 1
    if (lingerTimer.defaultLine === timeToLinger) {
      lingerTimer.defaultLine = 0
      store.dispatch(chooseBrush('defaultLine'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(circleLine) === true) {
    lingerTimer.circleLine += 1
    if (lingerTimer.circleLine === timeToLinger) {
      lingerTimer.circleLine = 0
      store.dispatch(chooseBrush('circleLine'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(triangleLine) === true) {
    lingerTimer.triangleLine += 1
    if (lingerTimer.triangleLine === timeToLinger) {
      lingerTimer.triangleLine = 0
      store.dispatch(chooseBrush('triangleLine'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(rectangle) === true) {
    lingerTimer.rectangle += 1
    if (lingerTimer.rectangle === timeToLinger) {
      lingerTimer.rectangle = 0
      store.dispatch(chooseBrush('rectangle'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(circleShape) === true) {
    lingerTimer.circleShape += 1
    if (lingerTimer.circleShape === timeToLinger) {
      lingerTimer.circleShape = 0
      store.dispatch(chooseBrush('circleShape'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(ellipse) === true) {
    lingerTimer.ellipse += 1
    if (lingerTimer.ellipse === timeToLinger) {
      lingerTimer.ellipse = 0
      store.dispatch(chooseBrush('ellipse'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(triangleShape) === true) {
    lingerTimer.triangleShape += 1
    if (lingerTimer.triangleShape === timeToLinger) {
      lingerTimer.triangleShape = 0
      store.dispatch(chooseBrush('triangleShape'))
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(lineThin) === true) {
    lingerTimer.lineThin += 1
    if (lingerTimer.lineThin === timeToLinger) {
      lingerTimer.lineThin = 0
      store.dispatch(chooseSize('small'))
      store.dispatch(toggleDraw())
      if (store.getState().paintTools.drawModeOn === false) {
        setTimeout(() => store.dispatch(toggleDraw()), 500)
      }
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(lineMedium) === true) {
    lingerTimer.lineMedium += 1
    if (lingerTimer.lineMedium === timeToLinger) {
      lingerTimer.lineMedium = 0
      store.dispatch(chooseSize('medium'))
      store.dispatch(toggleDraw())
      if (store.getState().paintTools.drawModeOn === false) {
        setTimeout(() => store.dispatch(toggleDraw()), 500)
      }
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }
  if (insideButton(lineThick) === true) {
    lingerTimer.lineThick += 1
    if (lingerTimer.lineThick === timeToLinger) {
      lingerTimer.lineThick = 0
      store.dispatch(chooseSize('large'))
      store.dispatch(toggleDraw())
      if (store.getState().paintTools.drawModeOn === false) {
        setTimeout(() => store.dispatch(toggleDraw()), 500)
      }
      store.dispatch(toggleBrush())
      resetCoordMarkers()
    }
  }

  frameNum += 1
}
/*eslint-enable*/
