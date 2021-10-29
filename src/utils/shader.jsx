export function program(context, { vertex, fragment }) {
  const pg = context.createProgram()

  if (vertex) {
    context.attachShader(pg, load(context, context.VERTEX_SHADER, vertex))
  }

  if (fragment) {
    context.attachShader(pg, load(context, context.FRAGMENT_SHADER, fragment))
  }

  context.linkProgram(pg)

  return pg
}

export function load(context, type, source) {
  const shader = context.createShader(type)

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader)

    return null
  }

  return shader
}
