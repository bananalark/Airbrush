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
const {Path} = paper
import clearCanvas from './clearCanvas'
import store from '../../store'
import {Shape} from 'paper'

export function createProject(window, canvas) {
  paper.install(window)
  paper.setup(canvas)
  clearCanvas(paper.project)
}

//smoother 'drawLineBetweenPoints' with paper.js project
export function drawLine(oneKeypoint, path) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  const pathStyle = new Path({
    segments: [oneKeypoint.position], //console.log
    strokeColor: new Color(red, green, blue),
    strokeWidth: 10,
    strokeCap: 'round'
  })
  //starting point of drawing
  if (!path) path = pathStyle
  path.add(oneKeypoint.position)
  //if there are a certain number of points, implement smoothing function and reset to a fresh path
  //this is another variable worth playing around with
  if (path.segments.length > 10) {
    // below, path.simplify(num): from docs: This value is set to 2.5 by default. Setting it to a lower value, produces a more correct path but with more segment points. Setting it to a higher value leads to a smoother curve and less segment points, but the shape of the path will be more different than the original.
    path.smooth(10)
    path = pathStyle
  }
  return path
}

//draw circle
export function drawCircle(oneKeypoint, secondKeypoint, path) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  // const pathStyle = new Path.Circle({
  //   center: [oneKeypoint.position],
  //   radius: [secondKeypoint.position],
  //   strokeColor: new Color(red, green, blue),
  //   strokeWidth: 10
  // })
  // if (!path) path = pathStyle
  // path.add(oneKeypoint.position)
  // path.add(secondKeypoint.position)
  // return path

  const shape = new Shape.Circle({
    center: [oneKeypoint.position.x, oneKeypoint.position.y],
    radius: 30,
    strokeColor: new Color(red, green, blue),
    strokeWidth: 10
  })
  return shape
}

//draw rectangle
export function drawRectangle(oneKeypoint, secondKeypoint) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  const shape = new Shape.Rectangle({
    point: [oneKeypoint.position.x, oneKeypoint.position.y],
    size: [
      secondKeypoint.position.x - oneKeypoint.position.x,
      secondKeypoint.position.y - oneKeypoint.position.y
    ],
    strokeColor: new Color(red, green, blue),
    strokeWidth: 10
  })
  return shape
}

//draw ellipse
export function drawEllipse(oneKeypoint, secondKeypoint) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  const shape = new Shape.Ellipse({
    center: [oneKeypoint.position.x, oneKeypoint.position.y],
    radius: [
      secondKeypoint.position.x - oneKeypoint.position.x,
      secondKeypoint.position.y - oneKeypoint.position.y
    ],
    strokeColor: new Color(red, green, blue),
    strokeWidth: 10
  })
  return shape
}
//draw triangle
export function drawTriangle(oneKeypoint) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  const triangle = new Path.RegularPolygon(
    new Point(oneKeypoint.position.x, oneKeypoint.position.y),
    3,
    30
  )
  triangle.strokeColor = new Color(red, green, blue)

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
