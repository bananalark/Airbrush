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
import clearCanvas from './clearCanvas'

export function createProject(window, canvas) {
  paper.install(window)
  paper.setup(canvas)
  clearCanvas(paper.project)
}

//smoother 'drawLineBetweenPoints' with paper.js project
export function drawLine(oneKeypoint, path) {
  const pathStyle = new Path({
    segments: [oneKeypoint.position],
    strokeColor: 'aqua',
    strokeWidth: 10,
    strokeCap: 'round'
  })

  if (!path) path = pathStyle

  path.add(oneKeypoint.position)

  //if there are a certain number of points, implement smoothing function and reset to a fresh path
  if (path.segments.length > 5) {
    path.simplify(10)
    path = pathStyle
  }

  return path
}

//on-off switch with gesture
export function draw(keypoints, minPartConfidence) {
  return (
    keypoints[10].score >= minPartConfidence &&
    Math.abs(keypoints[10].position.x - keypoints[6].position.x) < 100
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
