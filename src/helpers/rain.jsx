export function create(parts, width, height) {
  const particles = []
  for (let i = 0; i < parts; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      l: Math.random() * 1,
      xs: -4 + Math.random() * 4 + 2,
      ys: Math.random() * 10 + 10,
    })
  }

  return particles
}

export function draw(particles, context, width, height) {
  context.clearRect(0, 0, width, height)

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]

    context.beginPath()
    context.moveTo(p.x, p.y)
    context.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys)
    context.stroke()

    p.x += p.xs
    p.y += p.ys

    if (p.x > width || p.y > height) {
      p.x = Math.random() * width
      p.y = -20
    }
  }
}
