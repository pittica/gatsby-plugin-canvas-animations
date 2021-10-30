import React, { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import useInterval from "react-useinterval"
import { hexToRgb } from "@pittica/gatsby-plugin-utils"

import { randomize } from "../helpers/ledwall"

export default function Ledwall({
  lineWidth,
  width,
  height,
  gutter,
  background,
  primary,
  secondary,
  random,
  timing,
}) {
  const ref = useRef()
  const [opacity, setOpacity] = useState(0.0)

  useEffect(() => {
    const canvas = ref.current

    if (typeof window !== "undefined") {
      canvas.width = canvas.parentNode.clientWidth
      canvas.height = canvas.parentNode.clientHeight

      window.addEventListener("resize", resize)

      return () => window.removeEventListener("resize", resize)
    } else {
      canvas.width = 1920
      canvas.height = 1080
    }
  }, [])

  useInterval(() => draw(), timing)

  const resize = () => {
    const canvas = ref.current

    canvas.width = canvas.parentNode.clientWidth
    canvas.height = canvas.parentNode.clientHeight

    draw()
  }

  const draw = () => {
    const canvas = ref.current

    if (canvas.getContext) {
      const context = canvas.getContext("2d")
      context.clearRect(0, 0, canvas.width, canvas.height)

      context.lineWidth = lineWidth
      context.lineCap = "round"

      const { r, g, b } = hexToRgb(primary)
      let x = gutter
      let y = gutter
      let alpha = opacity

      for (x; x < canvas.width; x += width + gutter) {
        for (y; y < canvas.height; y += height + gutter) {
          context.beginPath()
          context.rect(x, y, width, height)

          if (random) {
            randomize(context, { background, primary, secondary })
          } else {
            alpha += 0.1

            if (alpha >= 1) {
              alpha = 0
            }

            context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          }

          context.fill()
        }

        y = gutter
      }

      setOpacity(alpha)
    }
  }

  return <canvas ref={ref} />
}

Ledwall.propTypes = {
  lineWidth: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  gutter: PropTypes.number,
  background: PropTypes.string.isRequired,
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  random: PropTypes.bool,
  timing: PropTypes.number,
}

Ledwall.defaultProps = {
  lineWidth: 2,
  width: 24,
  height: 24,
  gutter: 10,
  random: false,
  timing: 150,
}
