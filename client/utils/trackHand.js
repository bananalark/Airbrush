const trackHand = (lsx, rsx, hx, hy) => {
  //make mini canvas rightHandBox
  //params: left shoulder x, right shoulder x, hand x, hand y

  //approx hand size from shoulder distance
  const canvasSize = Math.abs(lsx - rsx)

  //upper left corner of mini canvas
  const left = hx - canvasSize / 2
  const top = hy - canvasSize / 2

  let handCanvas = document.getElementById('hand')
  handCanvas.width = canvasSize
  handCanvas.height = canvasSize
  const handCtx = handCanvas.getContext('2d')

  const bgCanvas = document.getElementById('background')

  let handImage = bgCanvas.toDataURL('image/svg', {
    left,
    top,
    width: canvasSize,
    height: canvasSize
  })

  handImage = new Blob([handImage], {type: 'image/svg'})

  handCtx.drawImage(handImage, 0, 0)
}

export default trackHand
