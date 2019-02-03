import * as tf from '@tensorflow/tfjs'

function trackHand(span, hx, hy) {
  //make mini canvas rightHandBox

  //upper left corner of mini canvas:
  //starting with half the hand-span length
  console.log(span, hx, hy)
  const halfSpan = span / 2
  const left = hx - halfSpan
  const top = hy - halfSpan

  let handCanvas = document.getElementById('hand')
  handCanvas.width = span
  handCanvas.height = span
  const handCtx = handCanvas.getContext('2d')

  const bgCanvas = document.getElementById('background')
  console.log('span', span)
  handCtx.drawImage(bgCanvas, left, top, span, span, 0, 0, span, span)
}

const loadModel = async () => {
  const model = await tf.loadModel('http://localhost:8080/mymodel.json')
  console.log('model', model)
}
loadModel()

export default trackHand
