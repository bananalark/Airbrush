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
  drawOff,
  toggleErase
} from '../store'
import {Size, Path} from 'paper'
import {videoHeight, videoWidth} from './camera'
import {voiceModeStartStop, isChrome} from './speechUtil'
import KalmanFilter from 'kalmanjs'

const xFilter = new KalmanFilter()
const yFilter = new KalmanFilter()

let fullImageStr

export function createProject(window, cnv) {
  paper.install(window)
  paper.setup(cnv)
}

export async function clearCanvas() {
  paper.project.clear()

  //restarts drawing line, also needed as bugfix
  store.dispatch(drawOff())
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
  //create a DOM element to hold download ref
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

export function getBodyPart() {
  return store.getState().paintTools.chosenBodyPart
}

const prevStateDifferent = (function() {
  let prevBodyPart = store.getState().paintTools.chosenBodyPart
  return function(bodyPart) {
    if (prevBodyPart !== bodyPart) {
      prevBodyPart = bodyPart
      return true
    }
    return false
  }
})()

function setSize(size) {
  switch (size) {
    case 'small':
      return 3
    case 'medium':
      return 8
    case 'large':
      return 15
    default:
      return 3
  }
}

//i broke it

/*eslint-disable*/
export function drawAnything(part, path, left, right, nose) {
  const {chosenBrush, chosenBodyPart, size} = store.getState().paintTools
  const pixelWidth = setSize(size)

  //this prevents any lines from being drawn between previous drawing body part and current drawing body part
  if (prevStateDifferent(chosenBodyPart) === true) {
    return null
  }

  //apply Kalman filter for accuracy
  let x = xFilter.filter(part.position.x)
  let y = yFilter.filter(part.position.y)

  if (x < 0 || y < 0 || x > videoWidth || y > videoHeight) {
    return null
  }

  switch (chosenBrush) {
    case 'defaultLine':
      return drawLine(part, path, pixelWidth)
    case 'circleLine':
      return drawCircleLine(part, pixelWidth)
    case 'triangleLine':
      return drawTriangleLine(part, pixelWidth)
    case 'rectangle':
      return drawRectangleShape(right, left, pixelWidth)
    case 'circleShape':
      return drawCircleShape(nose, right, pixelWidth)
    case 'ellipse':
      return drawEllipseShape(nose, right, pixelWidth)
    case 'triangleShape':
      return drawTriangleShape(nose, right, pixelWidth)
    // case 'circleShape':
    //   console.log(part)
    //   if (part === rightHand || part === leftHand) {
    //     return drawCircleShape(nose, part, pixelWidth)
    //   } else {
    //     return drawCircleShape(nose, rightHand, pixelWidth)
    //   }
    // case 'ellipse':
    //   if (part === rightHand || part === leftHand) {
    //     return drawEllipseShape(nose, part, pixelWidth)
    //   } else {
    //     return drawEllipseShape(nose, rightHand, pixelWidth)
    //   }
    // case 'triangleShape':
    //   if (part === rightHand || part === leftHand) {
    //     return drawTriangleShape(nose, part, pixelWidth)
    //   } else {
    //     return drawTriangleShape(nose, rightHand, pixelWidth)
    //   }

    default:
      return drawLine(part, path, pixelWidth)
  }
}
/*eslint-enable*/
let oldColor = store.getState().color.color
let colorToCompare = oldColor

let oldBrush = store.getState().paintTools.chosenBrush
let brushToCompare = oldBrush

//draw lines
function drawLine(oneKeypoint, path, pixelWidth) {
  let color = getColor()

  const pathStyle = new Path({
    segments: [oneKeypoint.position],
    strokeColor: new Color(color.red, color.green, color.blue),
    strokeWidth: pixelWidth,
    strokeCap: 'round'
  })

  if (
    store.getState().color.color !== colorToCompare ||
    store.getState().paintTools.chosenBrush !== brushToCompare
  ) {
    path = null
    colorToCompare = store.getState().color.color
    brushToCompare = store.getState().paintTools.chosenBrush
  }

  if (!path) path = pathStyle
  path.add(oneKeypoint.position)

  if (path.segments.length % 5 === 0) {
    path.smooth({type: 'continuous'})
  }

  return path
}

//draw circle as line
export function drawCircleLine(oneKeypoint, pixelWidth) {
  let color = getColor()
  let shape = new Path.Circle(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    30
  )

  shape.strokeColor = new Color(color.red, color.green, color.blue)
  shape.strokeWidth = pixelWidth

  if (
    store.getState().color.color !== colorToCompare ||
    store.getState().paintTools.chosenBrush !== brushToCompare
  ) {
    shape = null
    colorToCompare = store.getState().color.color
    brushToCompare = store.getState().paintTools.chosenBrush
  }
  if (!shape) {
    shape = new Path.Circle(
      new Point(oneKeypoint.position.x, oneKeypoint.position.y),
      30
    )
    shape.strokeColor = new Color(color.red, color.green, color.blue)
    shape.strokeWidth = pixelWidth
  }

  return shape
}

//draw circle as a shape
export function drawCircleShape(oneKeypoint, secondKeypoint, pixelWidth) {
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
  shape.strokeWidth = pixelWidth

  return shape
}

//draw rectangle as a shape
function drawRectangleShape(oneKeypoint, secondKeypoint, pixelWidth) {
  let color = getColor()

  const shape = new Path.Rectangle(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    new Size(
      secondKeypoint.position.x - oneKeypoint.position.x, //leftWrist - rightWrist
      secondKeypoint.position.y - oneKeypoint.position.y
    )
  )
  shape.strokeColor = new Color(color.red, color.green, color.blue)
  shape.strokeWidth = pixelWidth

  return shape
}

//draw ellipse as a shape
function drawEllipseShape(oneKeypoint, secondKeypoint, pixelWidth) {
  let color = getColor()

  const shape = new Path.Ellipse({
    center: [oneKeypoint.position.x, oneKeypoint.position.y],
    radius: [
      secondKeypoint.position.x - oneKeypoint.position.x,
      secondKeypoint.position.y - oneKeypoint.position.y
    ],
    strokeColor: new Color(color.red, color.green, color.blue),
    strokeWidth: pixelWidth
  })

  return shape
}

//draw triangle as a line
function drawTriangleLine(oneKeypoint, pixelWidth) {
  let color = getColor()

  let triangle = new Path.RegularPolygon(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    3,
    30
  )
  triangle.strokeColor = new Color(color.red, color.green, color.blue)
  triangle.strokeWidth = pixelWidth

  if (
    store.getState().color.color !== colorToCompare ||
    store.getState().paintTools.chosenBrush !== brushToCompare
  ) {
    triangle = null
    colorToCompare = store.getState().color.color
    brushToCompare = store.getState().paintTools.chosenBrush
  }

  if (!triangle) {
    triangle = new Path.RegularPolygon(
      new Point(oneKeypoint.position.x, oneKeypoint.position.y),
      3,
      30
    )
    triangle.strokeColor = new Color(color.red, color.green, color.blue)
    triangle.strokeWidth = pixelWidth
  }

  return triangle
}

//draw triangle as a shape
function drawTriangleShape(oneKeypoint, secondKeypoint, pixelWidth) {
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
  triangle.strokeWidth = pixelWidth

  return triangle
}

//on-off switch with gesture
export function getDrawMode() {
  return store.getState().paintTools.drawModeOn === true
}

//***** TRACKING CIRCLES *****
//Here we construct a small green circle to follow te drawing tool, and a small pink circle to track the hand you'll use for button presses

export function drawTracker(keypoint, vidWidth, vidHeight, paintingPointerCtx) {
  let x = keypoint.position.x
  let y = keypoint.position.y
  paintingPointerCtx.clearRect(0, 0, vidWidth, vidHeight)

  paintingPointerCtx.beginPath()

  paintingPointerCtx.moveTo(x, y)

  paintingPointerCtx.arc(x, y, 10, 0, 2 * Math.PI, true)
  if (y > 0 && x < 200) {
    //pointer changes to white in the toolbar
    paintingPointerCtx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  } else {
    paintingPointerCtx.fillStyle = 'rgba(22, 208, 171, 0.58)'
  }
  paintingPointerCtx.fill()
}

export function hoverButtonHandTracker(keypoint, vidWidth, vidHeight, ctx) {
  let x = keypoint.position.x
  let y = keypoint.position.y
  ctx.clearRect(0, 0, vidWidth, vidHeight)

  ctx.beginPath()

  ctx.moveTo(x, y)

  ctx.arc(x, y, 10, 0, 2 * Math.PI, true)
  if (y > 0 && x < 200) {
    //pointer changes to white in the toolbar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'
  } else {
    ctx.fillStyle = 'rgba(139, 135, 253, 0.76)'
  }
  ctx.fill()
}

export function smooth(collectedXCoords, collectedYCoords) {
  let xCoordAverage =
    collectedXCoords.reduce((acc, curVal) => acc + curVal) /
    collectedXCoords.length
  let yCoordAverage =
    collectedYCoords.reduce((acc, curVal) => acc + curVal) /
    collectedYCoords.length

  return {position: {x: xCoordAverage, y: yCoordAverage}}
}
