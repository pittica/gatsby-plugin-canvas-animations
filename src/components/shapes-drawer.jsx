import React, { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import useInterval from "react-useinterval"

import { drawShape } from "../utils/shapes"

export default function ShapesDrawer({ shapes, stroke, fill, timing }) {
  const ref = useRef()
  const [current, setCurrent] = useState(null)
  const [play, setPlay] = useState(timing)

  useEffect(() => {
    init()

    window.addEventListener("resize", init)
    return () => window.removeEventListener("resize", init)
  }, [])

  useInterval(() => {
    const canvas = ref.current

    if (canvas.getContext) {
      const context = canvas.getContext("2d")

      if (current !== null && current < shapes.length) {
        context.beginPath()

        if (shapes[current].shape) {
          drawShape(canvas, context, shapes[current].shape)
        }

        if (shapes[current].inner) {
          drawShape(canvas, context, shapes[current].inner)
        }
        context.closePath()

        context.stroke()
        context.fill("evenodd")

        setCurrent(current + 1)
      } else {
        setCurrent(null)
        setPlay(null)
      }
    }
  }, play)
  
  const init = () => {
    if (typeof window !== "undefined") {
      const canvas = ref.current

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      if (canvas.getContext) {
        const context = canvas.getContext("2d")

        context.strokeStyle = stroke
        context.fillStyle = fill
        context.imageSmoothingEnabled = true

        if (shapes.length > 0) {
          setCurrent(0)
          setPlay(timing)
        }
      }
    }
  }

  return <canvas ref={ref} />
}

ShapesDrawer.propTypes = {
  shapes: PropTypes.array.isRequired,
  stroke: PropTypes.string,
  fill: PropTypes.string,
  timing: PropTypes.number,
}

ShapesDrawer.defaultProps = {
  shapes: [],
  stroke: "#000000",
  fill: "#ffffff",
  timing: 120,
}
