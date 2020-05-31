export function rgb(hex, float) {
  let r,
    g,
    b = 0

  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split("")

    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = "0x" + c.join("")
    r = (c >> 16) & 255
    g = (c >> 8) & 255
    b = c & 255
  }

  if (float) {
    return {
      r: r / 255,
      g: g / 255,
      b: b / 255
    }
  } else {
    return {
      r,
      g,
      b
    }
  }
}

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

export function buffer(context, points, type) {
  const buffer = context.createBuffer()

  context.bindBuffer(type, buffer)
  context.bufferData(type, points, context.STATIC_DRAW)

  return buffer
}

export function vertex(context, attribute, components, buffer) {
  context.bindBuffer(context.ARRAY_BUFFER, buffer);

  context.vertexAttribPointer(
    attribute,
    components,
    context.FLOAT,
    false,
    0,
    0)

  context.enableVertexAttribArray(attribute)
}