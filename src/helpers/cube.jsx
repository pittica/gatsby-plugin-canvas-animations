import mat4 from "gl-mat4"
import { hexToRgb } from "@pittica/gatsby-plugin-utils"

import { program } from "../utils/shader"
import { create, vertex } from "../utils/buffer"
import { cube, indices } from "../utils/positions"

export function info(context) {
  const pg = program(context, {
    vertex: `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying lowp vec4 vColor;

      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
      }
    `,
    fragment: `
      varying lowp vec4 vColor;

      void main(void) {
        gl_FragColor = vColor;
      }
    `,
  })

  return {
    program: pg,
    attribLocations: {
      vertexPosition: context.getAttribLocation(pg, "aVertexPosition"),
      vertexColor: context.getAttribLocation(pg, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: context.getUniformLocation(pg, "uProjectionMatrix"),
      modelViewMatrix: context.getUniformLocation(pg, "uModelViewMatrix"),
    },
  }
}

export function colors(color) {
  const { r, g, b } = hexToRgb(color, true)

  return {
    front: [r, g, b, 1.0],
    back: [r, g, b, 0.7],
    top: [r, g, b, 1.0],
    bottom: [r, g, b, 0.9],
    right: [r, g, b, 0.9],
    left: [r, g, b, 0.8],
  }
}

export function facets(context, color) {
  const faces = colors(color)
  let matrix = []

  matrix = matrix.concat(faces.front, faces.front, faces.front, faces.front)
  matrix = matrix.concat(faces.back, faces.back, faces.back, faces.back)
  matrix = matrix.concat(faces.top, faces.top, faces.top, faces.top)
  matrix = matrix.concat(faces.bottom, faces.bottom, faces.bottom, faces.bottom)
  matrix = matrix.concat(faces.right, faces.right, faces.right, faces.right)
  matrix = matrix.concat(faces.left, faces.left, faces.left, faces.left)

  return {
    position: create(context, new Float32Array(cube), context.ARRAY_BUFFER),
    color: create(context, new Float32Array(matrix), context.ARRAY_BUFFER),
    indices: create(
      context,
      new Uint16Array(indices),
      context.ELEMENT_ARRAY_BUFFER
    ),
  }
}

export function apply(context, programInfo, buffers, rotation) {
  const projectionMatrix = mat4.create()
  const modelViewMatrix = mat4.create()
  const ar =
    Math.min(context.canvas.clientWidth, context.canvas.clientHeight) /
    Math.max(context.canvas.clientWidth, context.canvas.clientHeight)

  mat4.perspective(projectionMatrix, (45 * Math.PI) / 180, ar, 0.1, 100.0)

  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1])
  mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [0, 1, 0])

  vertex(
    context,
    programInfo.attribLocations.vertexPosition,
    3,
    buffers.position
  )
  vertex(context, programInfo.attribLocations.vertexColor, 4, buffers.color)

  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.indices)
  context.useProgram(programInfo.program)

  context.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  )
  context.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  )

  context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)

  return context
}

export function prepare(context, background) {
  const { r, g, b } = hexToRgb(background, true)

  context.clearColor(r, g, b, 1.0)
  context.clearDepth(1.0)
  context.enable(context.DEPTH_TEST)
  context.depthFunc(context.LEQUAL)
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT)

  return context
}
