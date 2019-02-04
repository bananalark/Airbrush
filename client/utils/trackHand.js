import * as tf from '@tensorflow/tfjs'
import {drawOn, drawOff} from '../store/paintTools'
import store from '../store'

//TODO
//remove handCanvas

export function trackHand(span, hx, hy, hCanvas, bgCanvas) {
  //make mini canvas rightHandBox

  span = 224 //hardcoded to keep data in line with dataset model was trained on
  console.log('imported from camera', hCanvas, bgCanvas)
  const halfSpan = span / 2
  const left = hx - halfSpan
  const top = hy - halfSpan

  // canvas for observation

  const handCtx = hCanvas.getContext('2d')
  handCtx.drawImage(bgCanvas, left, top, span, span, 0, 0, span, span)
}

//now for the model action

function makeTensor(canvas) {
  return tf.tidy(() => {
    console.log('here', canvas)

    // Reads the image as a Tensor from background canvas
    const handImage = tf.fromPixels(canvas)

    // Crop the image so we're using the center square of the rectangular
    // webcam.
    const croppedImage = cropImage(handImage)

    // Expand the outer most dimension so we have a batch size of 1.
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
  const size = 224
  console.log('img shape', img.shape[0])
  const centerHeight = img.shape[0] / 2
  const beginHeight = centerHeight - size / 2
  const centerWidth = img.shape[1] / 2
  const beginWidth = centerWidth - size / 2
  return img.slice([beginHeight, beginWidth, 0], [size, size, 3])
}

//make the magic happen
export async function predict(canvas, myModel, mobileModel) {
  const predictedClass = tf.tidy(() => {
    // Capture the frame from the webcam.
    const img = makeTensor(canvas)

    // Make a prediction through mobilenet, which already knows a lot about images
    const embeddings = mobileModel.predict(img)

    // our mildly-trained model builds from that knowledge and the input
    const predictions = myModel.predict(embeddings)

    // returns most probable answer of which of the two settings the image represents
    return predictions.as1D().argMax()
  })

  const classId = (await predictedClass.data())[0]
  predictedClass.dispose()

  store.dispatch(classId === 0 ? drawOn() : drawOff())

  await tf.nextFrame()
}
