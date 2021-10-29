import React, { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import useInterval from "react-useinterval"

import rgb from "../utils/rgb"
import { create, draw } from "../helpers/rain"

export default function Rain({ color, stroke, parts, timing }) {
  const ref = useRef()
  const [particles, setParticles] = useState([])
  const init = () => {
    if (typeof window !== "undefined") {
      const canvas = ref.current

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      if (canvas.getContext) {
        const { r, g, b } = rgb(color)
        const context = canvas.getContext("2d")

        context.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`
        context.width = stroke
        context.lineCap = "round"

        setParticles(create(parts, canvas.width, canvas.height))
      }
    }
  }

  useEffect(() => {
    init()

    window.addEventListener("resize", init)
    return () => window.removeEventListener("resize", init)
  }, [particles.length > 0])

  useInterval(() => {
    const canvas = ref.current

    if (canvas.getContext) {
      const context = canvas.getContext("2d")

      draw(particles, context, canvas.width, canvas.height)
    }
  }, timing)

  return <canvas ref={ref} />
}

Rain.propTypes = {
  stroke: PropTypes.number,
  parts: PropTypes.number,
  color: PropTypes.string,
  timing: PropTypes.number,
}

Rain.defaultProps = {
  stroke: 2,
  parts: 1000,
  color: "#ffffff",
  timing: 30,
}
