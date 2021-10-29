export function randomize(context, { background, primary, secondary }) {
  switch (Math.round(Math.random() * 2 + 1)) {
    case 3:
      context.fillStyle = background
      break
    case 2:
      context.fillStyle = primary
      break
    default:
      context.fillStyle = secondary
      break
  }
}
