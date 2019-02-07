let fullImageStr

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
