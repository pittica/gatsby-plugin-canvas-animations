export function getPoint({ width, height }, { x, y }) {
  const min = Math.min(width, height)
  const orto = min / 100

  return {
    x: orto * x + Math.max(0, (width - min) / 2),
    y: orto * y + Math.max(0, (height - min) / 2),
  }
}

export function drawShape(canvas, context, shape) {
  shape.forEach((coords, i) => {
    const { x, y } = getPoint(canvas, coords)

    if (i === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  })

  context.save()
}
