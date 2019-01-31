export default function clearCanvas(project, ctx) {
  console.log('in clear', ctx)
  ctx.clearRect(0, 0, ctx.width, ctx.height)
  project.clear()
}
