import * as tf from '@tensorflow/tfjs'
import {drawOn, drawOff} from '../store/paintTools'
import store from '../store'

//pixel count corresponding to dataset model was trained on
const span = 224

//small hidden canvas element
const handCanvas = document.createElement('canvas')
handCanvas.height = span
handCanvas.width = span
const handCtx = handCanvas.getContext('2d')

export function trackHand(hx, hy, bgCanvas) {
  const halfSpan = span / 2
  const left = hx - halfSpan
  const top = hy - halfSpan

  handCtx.drawImage(bgCanvas, left, top, span, span, 0, 0, span, span)
}

//turning an image into a MobileNet tensor
function makeTensor(canvas) {
  return tf.tidy(() => {
    // Reads the image as a Tensor from background canvas
    const handImage = tf.fromPixels(canvas)

    // Crop the image so we're using the center square of the rectangular
    // webcam.
    const croppedImage = cropImage(handImage)

    // Expand the outer most dimension so we have a batch span of 1.
    const batchedImage = croppedImage.expandDims(0)

    // Normalize the image between -1 and 1. The image comes in between 0-255,
    // so we divide by 127 and subtract 1.
    return batchedImage
      .toFloat()
      .div(tf.scalar(127))
      .sub(tf.scalar(1))
  })
}

//Crops an image tensor so we get a square image with no white space
function cropImage(img) {
  const centerHeight = img.shape[0] / 2
  const beginHeight = centerHeight - span / 2
  const centerWidth = img.shape[1] / 2
  const beginWidth = centerWidth - span / 2
  return img.slice([beginHeight, beginWidth, 0], [span, span, 3])
}

//layer of certainty
const frameCount = 10
let lastFewPredicts = Array(frameCount)
let latestSureClass
let count = 0

//Makes the magic happen
export async function predict(myModel, mobileModel) {
  const predictedClass = tf.tidy(() => {
    // Capture the frame from the webcam.
    const img = makeTensor(handCanvas)

    // Make a prediction through mobilenet
    const embeddings = mobileModel.predict(img)

    // our mildly-trained model builds from this
    const predictions = myModel.predict(embeddings)

    // returning most probable answer
    return predictions.as1D().argMax()
  })

  const latestClass = (await predictedClass.data())[0]
  predictedClass.dispose()

  lastFewPredicts[count] = latestClass

  //require higher certainty to switch to "draw on"
  if (latestClass === 0) {
    if (lastFewPredicts.reduce((a, x) => a + x, 0) === 0 && latestSureClass) {
      store.dispatch(drawOn())
      latestSureClass = 0
    }
  } else if (
    lastFewPredicts.reduce((a, x) => a + x, 0) > 4 &&
    !latestSureClass
  ) {
    store.dispatch(drawOff())
    latestSureClass = 1
  }

  count < frameCount - 1 ? ++count : (count = 0)
  await tf.nextFrame()
}
