import React, { Component } from "react"
import PropTypes from "prop-types"

import { rgb } from "./utils"

export default class RainCanvas extends Component {
  componentDidMount() {
    this.draw()
  }

  draw() {
    const canvas = this.refs.canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    if (canvas.getContext) {
      const context = canvas.getContext("2d")
      const { r, g, b } = rgb(this.props.color)
      let particles = []

      context.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", 0.5)"
      context.width = this.props.stroke
      context.lineCap = "round"

      for (let a = 0; a < this.props.parts; a++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          l: Math.random() * 1,
          xs: -4 + Math.random() * 4 + 2,
          ys: Math.random() * 10 + 10,
        })
      }

      setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i < particles.length; i++) {
          let p = particles[i]

          context.beginPath()
          context.moveTo(p.x, p.y)
          context.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys)
          context.stroke()

          p.x += p.xs
          p.y += p.ys

          if (p.x > canvas.width || p.y > canvas.height) {
            p.x = Math.random() * canvas.width
            p.y = -20
          }
        }
      }, 30)
    }
  }

  render() {
    return <canvas ref="canvas" />
  }
}

RainCanvas.propTypes = {
  stroke: PropTypes.number,
  parts: PropTypes.number,
  color: PropTypes.string,
}

RainCanvas.defaultProps = {
  stroke: 2,
  parts: 1000,
  color: "#ffffff",
}
