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
import * as posenet from '@tensorflow-models/posenet'
import * as tf from '@tensorflow/tfjs'
const paper = require('paper')
const {Path} = paper
import clearCanvas from './clearCanvas'
import store from '../../store'
import canvg from 'canvg'

export function createProject(window, cnv) {
  paper.install(window)
  paper.setup(cnv)
  clearCanvas(paper.project)
}

export function saveCanvas() {
  const canvas = document.getElementById('output')
  const ctx = canvas.getContext('2d')

  const backgroundCanvas = document.getElementById('background')
  const backgroundctx = backgroundCanvas.getContext('2d')

  const canvasString = ctx.canvas.toDataURL()
  const backgroundString = backgroundctx.canvas.toDataURL()

  const projectSvgEl = paper.project.exportSVG()
  const txt = projectSvgEl.innerHTML

  const canvasForSave = document.getElementById('saved-image')
  const saveCtx = canvasForSave.getContext('2d')
  canvasForSave.width = backgroundCanvas.width
  canvasForSave.height = backgroundCanvas.height

  //saveCtx.drawImage(backgroundCanvas, 0, 0)

  canvg(canvasForSave, txt)
}
//smoother 'drawLineBetweenPoints' with paper.js project
export function drawLine(oneKeypoint, path) {
  let color = store.getState().color.color
  const red = color.r / 255
  const green = color.g / 255
  const blue = color.b / 255

  const pathStyle = new Path({
    segments: [oneKeypoint.position],
    strokeColor: new Color(red, green, blue),
    strokeWidth: 10,
    strokeCap: 'round'
  })

  if (!path) path = pathStyle

  path.add(oneKeypoint.position)

  //if there are a certain number of points, implement smoothing function and reset to a fresh path
  //this is another variable worth playing around with
  if (path.segments.length > 10) {
    // below, path.simplify(num): from docs: This value is set to 2.5 by default. Setting it to a lower value, produces a more correct path but with more segment points. Setting it to a higher value leads to a smoother curve and less segment points, but the shape of the path will be more different than the original.
    path.simplify(20)
    path.simplify(20)

    path = pathStyle
  }

  return path
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

function toTuple({y, x}) {
  return [y, x]
}

//this will go away by replacing paper.js functionality
let lineWidth
export function drawSegment([ay, ax], [by, bx], scale, ctx) {
  ctx.beginPath()
  ctx.moveTo(ax * scale, ay * scale)
  ctx.lineTo(bx * scale, by * scale)
  ctx.lineWidth = lineWidth
  ctx.stroke()
}
//this will go away by replacing paper.js functionality
export function drawLineBetweenPoints(
  adjacentKeyPoints,
  ctx,
  scale = 1,
  newLineWidth
) {
  lineWidth = newLineWidth
  drawSegment(
    toTuple(adjacentKeyPoints[0].position),
    toTuple(adjacentKeyPoints[1].position),
    scale,
    ctx
  )
}
