export function handleShapes(
  arrayOfShapes,
  path,
  frameState,
  colorAtStart,
  brushAtStart
) {
  let togglePoint

  arrayOfShapes.length < 100
    ? arrayOfShapes.push(path)
    : (arrayOfShapes = [path])
  //every time the color or brush is changed, we should start a new path of shapes.
  if (frameState.color.color !== colorAtStart) {
    togglePoint = arrayOfShapes.length
    colorAtStart = frameState.color.color

    arrayOfShapes = arrayOfShapes.slice(togglePoint - 2)
  }
  if (frameState.paintTools.chosenBrush !== brushAtStart) {
    togglePoint = arrayOfShapes.length
    brushAtStart = frameState.paintTools.chosenBrush

    arrayOfShapes = arrayOfShapes.slice(togglePoint - 2)
  }
}

export function isShape(path) {
  return path !== null && path.style.strokeCap !== 'round'
}
