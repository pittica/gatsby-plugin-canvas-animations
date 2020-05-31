import React, { Component } from "react"
import PropTypes from "prop-types"
import mat4 from "gl-mat4"

import { cube } from "./positions"
import { rgb, program, buffer, vertex } from "./utils"

let rotation = 0.0

export default class CubeCanvas extends Component {
  componentDidMount() {
    const canvas = this.refs.canvas

    if (typeof window !== "undefined") {
      canvas.width = canvas.parentNode.clientWidth
      canvas.height = canvas.parentNode.clientWidth
  
      window.addEventListener("resize", () => {
        canvas.width = canvas.parentNode.clientWidth
        canvas.height = canvas.parentNode.clientWidth
  
        this.draw(canvas)
      })
    } else {
      canvas.width = 1920
      canvas.height = 1080
    }

    this.draw(canvas)
  }

  draw(canvas) {
    if (canvas.getContext) {
      const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      if (context) {
        const programInfo = this.info(context)
        const buffers = this.buffers(context)
        let then = 0

        const render = (now) => {
          now *= 0.001;
          const deltaTime = now - then;
          then = now;

          const { r, g, b } = rgb(this.props.background, true)

          context.clearColor(r, g, b, 1.0)
          context.clearDepth(1.0)
          context.enable(context.DEPTH_TEST)
          context.depthFunc(context.LEQUAL)
          context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT)

          const projectionMatrix = mat4.create()
          const modelViewMatrix = mat4.create()
          const ar = Math.min(context.canvas.clientWidth, context.canvas.clientHeight) / Math.max(context.canvas.clientWidth, context.canvas.clientHeight)

          mat4.perspective(projectionMatrix, 45 * Math.PI / 180, ar, 0.1, 100.0)

          mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])
          mat4.rotate(modelViewMatrix, modelViewMatrix, rotation, [0, 0, 1])
          mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [0, 1, 0])

          vertex(context, programInfo.attribLocations.vertexPosition, 3, buffers.position)
          vertex(context, programInfo.attribLocations.vertexColor, 4, buffers.color)

          context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, buffers.indices)
          context.useProgram(programInfo.program)

          context.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
          context.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

          {
            context.drawElements(context.TRIANGLES, 36, context.UNSIGNED_SHORT, 0)
          }

          rotation += deltaTime

          requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
      }
    }
  }

  info(context) {
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
  `, fragment: `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `})

    return {
      program: pg,
      attribLocations: {
        vertexPosition: context.getAttribLocation(pg, 'aVertexPosition'),
        vertexColor: context.getAttribLocation(pg, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: context.getUniformLocation(pg, 'uProjectionMatrix'),
        modelViewMatrix: context.getUniformLocation(pg, 'uModelViewMatrix'),
      },
    }
  }

  buffers(context) {
    const faces = this.colors()
    let colors = []

    colors = colors.concat(faces.front, faces.front, faces.front, faces.front)
    colors = colors.concat(faces.back, faces.back, faces.back, faces.back)
    colors = colors.concat(faces.top, faces.top, faces.top, faces.top)
    colors = colors.concat(faces.bottom, faces.bottom, faces.bottom, faces.bottom)
    colors = colors.concat(faces.right, faces.right, faces.right, faces.right)
    colors = colors.concat(faces.left, faces.left, faces.left, faces.left)

    const indices = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23,
    ]

    const position = buffer(context, new Float32Array(cube), context.ARRAY_BUFFER)
    const color = buffer(context, new Float32Array(colors), context.ARRAY_BUFFER)
    const index = buffer(context, new Uint16Array(indices), context.ELEMENT_ARRAY_BUFFER)

    return {
      position: position,
      color: color,
      indices: index,
    }
  }

  colors() {
    const { r, g, b } = rgb(this.props.color, true)

    return {
      front: [r, g, b, 1.0],
      back: [r, g, b, 0.7],
      top: [r, g, b, 1.0],
      bottom: [r, g, b, 0.9],
      right: [r, g, b, 0.9],
      left: [r, g, b, 0.8]
    }
  }

  render() {
    return (
      <canvas ref="canvas" />
    )
  }
}

CubeCanvas.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string
}

CubeCanvas.defaultProps = {
  color: "#ff0000",
  background: "#000000"
}
