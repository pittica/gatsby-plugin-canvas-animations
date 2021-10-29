export function create(context, points, type) {
  const buffer = context.createBuffer()

  context.bindBuffer(type, buffer)
  context.bufferData(type, points, context.STATIC_DRAW)

  return buffer
}

export function vertex(context, attribute, components, buffer) {
  context.bindBuffer(context.ARRAY_BUFFER, buffer)

  context.vertexAttribPointer(attribute, components, context.FLOAT, false, 0, 0)

  context.enableVertexAttribArray(attribute)
}
