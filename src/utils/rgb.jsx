export default function rgb(hex, float) {
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
      b: b / 255,
    }
  } else {
    return {
      r,
      g,
      b,
    }
  }
}
