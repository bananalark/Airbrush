export function saveCanvas() {
  //the three layers
  const backgroundCanvas = document.getElementById('background')
  const projectViewStr = paper.view.element.toDataURL()
  const canvas = document.getElementById('output')

  //a canvas for meshing all together: display-none
  const canvasForSave = document.getElementById('saved-image')
  const saveCtx = canvasForSave.getContext('2d')

  canvasForSave.width = canvas.width
  canvasForSave.height = canvas.height

  //draw video snapshot
  saveCtx.drawImage(backgroundCanvas, 0, 0)

  //draw paper project
  var image = new Image()
  image.onload = function() {
    saveCtx.drawImage(image, 0, 0)
  }
  image.src = projectViewStr

  //finally draw any erasures
  saveCtx.drawImage(canvas, 0, 0)

  const fullImageStr = canvasForSave.toDataUrl()

  //test loaded image on loaded-image canavas
  const loadedImgCanvas = document.getElementById('loaded-image')
  const loadedCtx = loadedImgCanvas.getContext('2d')
  loadedImgCanvas.width = canvas.width
  loadedImgCanvas.height = canvas.height

  var image = new Image()
  image.onload = function() {
    loadedCtx.drawImage(image, 0, 0)
    console.log('ok')
  }
  image.src = fullImageStr
}
