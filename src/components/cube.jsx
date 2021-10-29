import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"

import { facets, info, apply, prepare } from "../helpers/cube"

export default function Cube({ color, background }) {
  const ref = useRef()

  useEffect(() => {
    const canvas = ref.current

    if (typeof window !== "undefined") {
      canvas.width = canvas.parentNode.clientWidth
      canvas.height = canvas.parentNode.clientWidth

      window.addEventListener("resize", () => {
        canvas.width = canvas.parentNode.clientWidth
        canvas.height = canvas.parentNode.clientWidth

        draw()
      })
    } else {
      canvas.width = 1920
      canvas.height = 1080
    }

    draw()
  }, [])

  const draw = () => {
    const canvas = ref.current

    if (canvas.getContext) {
      const context =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      if (context) {
        const programInfo = info(context)
        const buffers = facets(context, color)
        let then = 0
        let rotation = 0.0

        const render = (now) => {
          now *= 0.001
          const deltaTime = now - then
          then = now

          prepare(context, background)
          apply(context, programInfo, buffers, rotation)

          rotation += deltaTime

          requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
      }
    }
  }

  return <canvas ref={ref} />
}

Cube.propTypes = {
  color: PropTypes.string,
  background: PropTypes.string,
}

Cube.defaultProps = {
  color: "#ff0000",
  background: "#000000",
}
