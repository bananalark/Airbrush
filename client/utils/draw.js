/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
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

// export const buttonHandHover = drawingHand => {
//   let selectorX = drawingHand.position.x
//   let selectorY = drawingHand.position.y

//   const voiceZone = [{x: 100, y: 40}, {x: 200, y: 100}]
//   if (selectorX > voiceZone[0].x && selectorX < voiceZone[1].x) {
//     // console.log('here are your y-coords---->', selectorY)
//     console.log('you may be in the VOICE zone')
//     // if (selectorY > voiceZone[0].y && selectorY < voiceZone[1].y) {
//     // }
//   }
// }

export function createProject(window, cnv) {
  paper.install(window)
  paper.setup(cnv)
}

export function clearCanvas() {
  paper.project.clear()
}

export function eraseTool() {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, ctx.width, ctx.height)
  paper.project.clear()
}

export function saveCanvas() {
  const backgroundCanvas = document.getElementById('background')
  const bgCtx = backgroundCanvas.getContext('2d')
  const canvas = document.getElementById('output')

  bgCtx.drawImage(canvas, 0, 0)
  fullImageStr = bgCtx.canvas.toDataURL('image/png')

  return fullImageStr
}

//create a DOM element to hold download ref
export function download() {
  let element = document.createElement('a')
  const file = fullImageStr.replace('image/png', 'image/octet-stream')
  element.href = file
  element.download = 'airbrush.png'
  element.click()
}

function getColor() {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255
  return {red: red, green: green, blue: blue}
}

const prevStateDifferent = (function() {
  let prevBodyPart = store.getState().chosenBodyPart
  return function(bodyPart) {
    if (prevBodyPart !== bodyPart) {
      prevBodyPart = bodyPart
      return true
    }
    return false
  }
})()

function determineBodyPart(chosenBodyPart, nose, leftHand, rightHand) {
  switch (chosenBodyPart) {
    case 'nose':
      return nose
    case 'leftHand':
      return leftHand
    case 'rightHand':
      return rightHand
    default:
      return rightHand
  }
}

/*eslint-disable*/
export function drawAnything(nose, leftHand, rightHand, path) {
  const {chosenBrush, chosenBodyPart} = store.getState().paintTools

  //this prevents any lines from being drawn between previous drawing body part and current drawing body part
  if (prevStateDifferent(chosenBodyPart) === true) {
    return null
  }

  const part = determineBodyPart(chosenBodyPart, nose, leftHand, rightHand)

  //apply Kalman filter for accuracy
  part.position.x = xFilter.filter(part.position.x)
  part.position.y = yFilter.filter(part.position.y)

  if (
    part.position.x < 0 ||
    part.position.y < 0 ||
    part.position.x > videoWidth ||
    part.position.y > videoHeight
  ) {
    return null
  }

  switch (chosenBrush) {
    case 'defaultLine':
      return drawLine(part, path)
    case 'circleLine':
      return drawCircleLine(part)
    case 'triangleLine':
      return drawTriangleLine(part)
    case 'rectangle':
      return drawRectangleShape(rightHand, leftHand)
    case 'circleShape':
      if (part === rightHand || part === leftHand) {
        return drawCircleShape(nose, part)
      } else {
        return drawCircleShape(nose, rightHand)
      }
    case 'ellipse':
      if (part === rightHand || part === leftHand) {
        return drawEllipseShape(nose, part)
      } else {
        return drawEllipseShape(nose, rightHand)
      }
    case 'triangleShape':
      if (part === rightHand || part === leftHand) {
        return drawTriangleShape(nose, part)
      } else {
        return drawTriangleShape(nose, rightHand)
      }
    default:
      return drawLine(part, path)
  }
}
/*eslint-enable*/

//draw lines
function drawLine(oneKeypoint, path) {
  let color = getColor()

  const pathStyle = new Path({
    segments: [oneKeypoint.position],
    strokeColor: new Color(color.red, color.green, color.blue),
    strokeWidth: 5,
    strokeCap: 'round'
  })
  if (!path) path = pathStyle
  // console.log('ERASE MODE IS OFF...?')
  // console.log(
  //   'IS STATE CHANGING---->',
  //   store.getState().paintTools.eraseModeOn === false
  // )

  path.add(oneKeypoint.position)

  //if there are a certain number of points, implement smoothing function and reset to a fresh path
  //this is another variable worth playing around with
  if (path.segments.length > 5) {
    // below, path.simplify(num): from docs: This value is set to 2.5 by default. Setting it to a lower value, produces a more correct path but with more segment points. Setting it to a higher value leads to a smoother curve and less segment points, but the shape of the path will be more different than the original.
    path.smooth({type: 'continuous'})

    path = pathStyle
  }
  return path
}

//draw circle as line
export function drawCircleLine(oneKeypoint) {
  let color = getColor()

  const shape = new Path.Circle(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    30
  )
  shape.strokeColor = new Color(color.red, color.green, color.blue)
  shape.strokeWidth = 3

  return shape
}

//draw circle as a shape
export function drawCircleShape(oneKeypoint, secondKeypoint) {
  let color = getColor()
  const r = Math.sqrt(
    Math.pow(secondKeypoint.position.x - oneKeypoint.position.x, 2) +
      Math.pow(secondKeypoint.position.y - oneKeypoint.position.y, 2)
  )

  const shape = new Path.Circle(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    r
  )
  shape.strokeColor = new Color(color.red, color.green, color.blue)
  shape.strokeWidth = 5

  return shape
}

//draw rectangle as a shape
function drawRectangleShape(oneKeypoint, secondKeypoint) {
  let color = getColor()

  const shape = new Path.Rectangle(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    new Size(
      secondKeypoint.position.x - oneKeypoint.position.x, //leftWrist - rightWrist
      secondKeypoint.position.y - oneKeypoint.position.y
    )
  )
  shape.strokeColor = new Color(color.red, color.green, color.blue)
  shape.strokeWidth = 5

  return shape
}

//draw ellipse as a shape
function drawEllipseShape(oneKeypoint, secondKeypoint) {
  let color = getColor()

  const shape = new Path.Ellipse({
    center: [oneKeypoint.position.x, oneKeypoint.position.y],
    radius: [
      secondKeypoint.position.x - oneKeypoint.position.x,
      secondKeypoint.position.y - oneKeypoint.position.y
    ],
    strokeColor: new Color(color.red, color.green, color.blue),
    strokeWidth: 5
  })

  return shape
}

//draw triangle as a line
function drawTriangleLine(oneKeypoint) {
  let color = getColor()

  const triangle = new Path.RegularPolygon(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    3,
    30
  )
  triangle.strokeColor = new Color(color.red, color.green, color.blue)

  return triangle
}

//draw triangle as a shape
function drawTriangleShape(oneKeypoint, secondKeypoint) {
  let color = getColor()

  let side = Math.sqrt(
    Math.pow(secondKeypoint.position.x - oneKeypoint.position.x, 2) +
      Math.pow(secondKeypoint.position.y - oneKeypoint.position.y, 2)
  )
  const triangle = new Path.RegularPolygon(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    3,
    side
  )
  triangle.strokeColor = new Color(color.red, color.green, color.blue)

  return triangle
}

//on-off switch with gesture
export function draw(keypoints, minPartConfidence) {
  let drawMode = document.getElementById('draw-button').value
  return (
    (keypoints[10].score >= minPartConfidence &&
      Math.abs(keypoints[10].position.y - keypoints[6].position.y) < 50) ||
    drawMode === 'true'
  )
}

let voiceZoneHoverStart = 0
let drawingHandHoverStart = 0
let drawModeHoverStart = 0
let brushOptionHoverStart = 0
let eraserModeHoverStart = 0
let clearCanvasHoverStart = 0
let snapshotHoverStart = 0

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

  if (yCoord >= 0 && yCoord < 100) {
    voiceZoneHoverStart += 1
    if (voiceZoneHoverStart === hoverTimer) {
      confirmSelectionCircle(voiceZoneHoverStart)
      await store.dispatch(toggleVoice())
      voiceModeStartStop()
      voiceZoneHoverStart = 0
    }
  }

  /* TODO: We'll have to move the hand/nose-drawer open/close state to REDUX if we want touch functionality. -Amber*/
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

//***** TRACKING CIRCLE *****
//Here we construct a small green circle to follow the hand or nose

function drawTracker(xCoord, yCoord, vidWidth, vidHeight, paintingPointerCtx) {
  paintingPointerCtx.clearRect(0, 0, vidWidth, vidHeight)

  paintingPointerCtx.beginPath()

  paintingPointerCtx.arc(xCoord, yCoord, 30, 0, 2 * Math.PI, true)
  if (xCoord > 0 && xCoord < 200) {
    //pointer changes to white in the toolbar
    paintingPointerCtx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  } else {
    paintingPointerCtx.fillStyle = 'rgba(22, 208, 171, 0.58)'
  }
  paintingPointerCtx.fill()
}

export function smoothAndDrawTrackingCircle(
  collectedXCoords,
  collectedYCoords,
  frames,
  videoWidth,
  videoHeight,
  paintingPointerCtx
) {
  let xCoordAverage =
    collectedXCoords.reduce((acc, curVal) => acc + curVal) / frames
  let yCoordAverage =
    collectedYCoords.reduce((acc, curVal) => acc + curVal) / frames

  //reset arrays
  collectedXCoords = Array(frames)
  collectedYCoords = Array(frames)

  drawTracker(
    xCoordAverage,
    yCoordAverage,
    videoWidth,
    videoHeight,
    paintingPointerCtx
  )
}
