export default function clearCanvas(project) {
  let canvas = document.getElementById('output')
  let context = canvas.getContext('2d')
  document.getElementById('clear-button').addEventListener(
    'click',
    () => {
      //context.clearRect(0, 0, canvas.width, canvas.height)
      project.clear()
    },
    false
  )
}
