import React, { Component } from "react"
import PropTypes from "prop-types"

let opacity = 0

export default class LedwallCanvas extends Component {
  componentDidMount() {
    const canvas = this.refs.canvas

    if (typeof window !== "undefined") {
      canvas.width = canvas.parentNode.parentNode.clientWidth
      canvas.height = canvas.parentNode.parentNode.clientHeight

      window.addEventListener("resize", () => {
        canvas.width = canvas.parentNode.parentNode.clientWidth
        canvas.height = canvas.parentNode.parentNode.clientHeight

        this.draw(canvas)
      })
    } else {
      canvas.width = 1920
      canvas.height = 1080
    }

    this.draw(canvas)

    setInterval(() => {
      this.draw(canvas)
    }, 150)
  }

  draw(canvas) {
    if (canvas.getContext) {
      const context = canvas.getContext("2d")
      context.clearRect(0, 0, canvas.width, canvas.height)

      context.lineWidth = this.props.lineWidth
      context.lineCap = "round"

      let x = this.props.gutter
      let y = this.props.gutter
      const { r, g, b } = this.rgba(this.props.primary)

      for (x; x < canvas.width; x += this.props.width + this.props.gutter) {
        for (y; y < canvas.height; y += this.props.height + this.props.gutter) {
          context.beginPath()
          context.rect(x, y, this.props.width, this.props.height)

          if (this.props.random) {
            this.random(context)
          } else {
            opacity += 0.1

            if (opacity > 1) {
              opacity = 0
            }

            context.fillStyle =
              "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")"
          }

          context.fill()
        }

        y = this.props.gutter
      }
    }
  }

  rgba(hex) {
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

    return {
      r,
      g,
      b,
    }
  }

  random(context) {
    switch (Math.round(Math.random() * 2 + 1)) {
      case 3:
        context.fillStyle = this.props.background
        break
      case 2:
        context.fillStyle = this.props.primary
        break
      default:
        context.fillStyle = this.props.secondary
        break
    }
  }

  render() {
    return (
      <canvas ref="canvas" />
    )
  }
}

LedwallCanvas.propTypes = {
  lineWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  gutter: PropTypes.number,
  background: PropTypes.string.isRequired,
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  random: PropTypes.bool,
}

LedwallCanvas.defaultProps = {
  lineWidth: 2,
  width: 24,
  height: 24,
  gutter: 10,
  random: false,
}
