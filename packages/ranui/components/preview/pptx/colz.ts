const round = Math.round

type ColorVal = (string | number)[]

export class Rgb {
  r: string | number
  g: string | number
  b: string | number
  constructor(col: Array<string | number>) {
    this.r = col[0]
    this.g = col[1]
    this.b = col[2]
  }

  toString(): string {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}

export class Rgba extends Rgb {
  a: string | number
  constructor(col: Array<string | number>) {
    super(col)
    this.a = col[3]
  }

  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }
}

export class Hsl {
  h: string | number
  s: string | number
  l: string | number
  constructor(col: Array<string | number>) {
    this.h = col[0]
    this.s = col[1]
    this.l = col[2]
  }

  toString(): string {
    return `hsl(${this.h},${this.s}%,${this.l}%)`
  }
}

export class Hsla extends Hsl {
  a: string | number
  constructor(col: Array<string | number>) {
    super(col)
    this.a = col[3]
  }

  toString(): string {
    return `hsla(${this.h},${this.s}%,${this.l}%,${this.a})`
  }
}

export class Color {
  r: string | number
  g: string | number
  b: string | number
  a: string | number
  rgb: Rgb
  rgba: Rgba
  hex: string
  hsl: Hsl
  hsla: Hsla
  h: string | number
  s: string | number
  l: string | number
  constructor(
    r: string | number | Array<string | number>,
    g: string | number = 0,
    b: string | number = 0,
    a: string | number = 1.0,
  ) {
    if (typeof r === 'string') {
      let str = r
      if (str.charAt(0) !== '#') {
        str = '#' + str
      }
      if (str.length < 7) {
        str = '#' + str[1] + str[1] + str[2] + str[2] + str[3] + str[3]
      }
      ;[r, g, b] = hexToRgb(str)
    } else if (r instanceof Array) {
      a = r[3] || a
      b = r[2]
      g = r[1]
      r = r[0]
    }
    this.r = Number(r)
    this.g = Number(g)
    this.b = Number(b)
    this.a = a
    this.rgb = new Rgb([this.r, this.g, this.b])
    this.rgba = new Rgba([this.r, this.g, this.b, this.a])
    this.hex = rgbToHex(this.r, this.g, this.b)

    this.hsl = new Hsl(rgbToHsl(this.r, this.g, this.b))
    this.h = this.hsl.h
    this.s = this.hsl.s
    this.l = this.hsl.l
    this.hsla = new Hsla([this.h, this.s, this.l, this.a])
  }

  setHue(newHue: string | number): void {
    this.h = newHue
    this.hsl.h = newHue
    this.hsla.h = newHue
    this.updateFromHsl()
  }

  setSat(newSat: string | number): void {
    this.s = newSat
    this.hsl.s = newSat
    this.hsla.s = newSat
    this.updateFromHsl()
  }

  setLum(newLum: number): void {
    this.l = newLum
    this.hsl.l = newLum
    this.hsla.l = newLum
    this.updateFromHsl()
  }

  setAlpha(newAlpha: string | number): void {
    this.a = newAlpha
    this.hsla.a = newAlpha
    this.rgba.a = newAlpha
  }

  updateFromHsl(): void {
    this.rgb = new Rgb(hslToRgb(this.h, this.s, this.l))

    this.r = this.rgb.r
    this.g = this.rgb.g
    this.b = this.rgb.b
    this.rgba.r = this.rgb.r
    this.rgba.g = this.rgb.g
    this.rgba.b = this.rgb.b

    this.hex = rgbToHex([this.r, this.g, this.b])
  }
}

export const randomColor = function (): Color {
  const r = '#' + Math.random().toString(16).slice(2, 8)
  return new Color(r)
}

export const hexToRgb = function (
  hex: string,
): RegExpExecArray | null | Array<number> {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

export const componentToHex = function (c: string | number): string {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export const rgbToHex = function (
  r: string | number | Array<string | number>,
  g: string | number = 0,
  b: string | number = 0,
): string {
  if (r instanceof Array) {
    b = r[2]
    g = r[1]
    r = r[0]
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export const rgbToHsl = function (
  r: number | number[],
  g: number = 0,
  b: number = 0,
): Array<number> {
  if (r instanceof Array) {
    b = r[2]
    g = r[1]
    r = r[0]
  }

  let s,
    l,
    d,
    h = 0

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  h = round(h * 360)
  s = round(s * 100)
  l = round(l * 100)

  return [h, s, l]
}

export const hue2rgb = function (p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1
  }
  if (t > 1) {
    t -= 1
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t
  }
  if (t < 1 / 2) {
    return q
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6
  }
  return p
}

export const hslToRgb = function (
  h: number | string | number[],
  s: number | string,
  l: number | string,
): Array<number> {
  if (h instanceof Array) {
    l = h[2]
    s = h[1]
    h = h[0]
  }
  h = Number(h) / 360
  s = Number(s) / 100
  l = Number(l) / 100

  let r, g, b, q, p

  if (s === 0) {
    r = g = b = l
  } else {
    q = l < 0.5 ? l * (1 + s) : l + s - l * s
    p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [round(r * 255), round(g * 255), round(b * 255)]
}

export const rgbToHsb = function (r: number, g: number, b: number): number[] {
  let h = 0,
    s,
    v

  r = r / 255
  g = g / 255
  b = b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  v = max

  const d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  h = round(h * 360)
  s = round(s * 100)
  v = round(v * 100)

  return [h, s, v]
}

export const hsbToRgb = function (h: number, s: number, v: number): number[] {
  let r = 0,
    g = 0,
    b = 0

  if (v === 0) {
    return [0, 0, 0]
  }

  s = s / 100
  v = v / 100
  h = h / 60

  const i = Math.floor(h)
  const f = h - i
  const p = v * (1 - s)
  const q = v * (1 - s * f)
  const t = v * (1 - s * (1 - f))

  if (i === 0) {
    r = v
    g = t
    b = p
  } else if (i === 1) {
    r = q
    g = v
    b = p
  } else if (i === 2) {
    r = p
    g = v
    b = t
  } else if (i === 3) {
    r = p
    g = q
    b = v
  } else if (i === 4) {
    r = t
    g = p
    b = v
  } else if (i === 5) {
    r = v
    g = p
    b = q
  }

  r = Math.floor(r * 255)
  g = Math.floor(g * 255)
  b = Math.floor(b * 255)

  return [r, g, b]
}

export const hsvToRgb = hsbToRgb

export const hsbToHsl = function (h: any, s: any, b: any): number[] {
  return rgbToHsl(hsbToRgb(h, s, b))
}

export const hsvToHsl = hsbToHsl

export class ColorScheme {
  palette: Color[]
  constructor(colorVal: (string | number)[], angleArray: number[]) {
    this.palette = []

    if (angleArray === undefined && colorVal instanceof Array) {
      this.createFromColors(colorVal)
    } else {
      this.createFromAngles(colorVal, angleArray)
    }
  }

  createFromColors(colorVal: (string | number)[]): Color[] {
    for (const i in colorVal) {
      if (Object.prototype.hasOwnProperty.call(colorVal, i)) {
        this.palette.push(new Color(colorVal[i]))
      }
    }
    return this.palette
  }

  createFromAngles(
    colorVal: string | number | (string | number)[],
    angleArray: number[],
  ): Color[] {
    this.palette.push(new Color(colorVal))
    for (const i in angleArray) {
      if (Object.prototype.hasOwnProperty.call(angleArray, i)) {
        const tempHue = (Number(this.palette[0].h) + angleArray[i]) % 360
        this.palette.push(
          new Color(
            hslToRgb(
              tempHue,
              Number(this.palette[0].s),
              Number(this.palette[0].l),
            ),
          ),
        )
      }
    }
    return this.palette
  }

  static Compl(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [180])
  }

  static Triad(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [120, 240])
  }

  static Tetrad(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [60, 180, 240])
  }

  static Analog(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [-45, 45])
  }

  static Split(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [150, 210])
  }

  static Accent(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [-45, 45, 180])
  }
}
