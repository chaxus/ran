export const FMT: Record<string, Array<string>> = {
  bold: ['\x1b[1m', '\x1b[22m'],
  dim: ['\x1b[2m', '\x1b[22m'],
  reset: ['\x1b[0m', '\x1b[0m'],
  italic: ['\x1b[3m', '\x1b[23m'],
  underline: ['\x1b[4m', '\x1b[24m'],
  inverse: ['\x1b[7m', '\x1b[27m'],
  hidden: ['\x1b[8m', '\x1b[28m'],
  strikethrough: ['\x1b[9m', '\x1b[29m'],
  black: ['\x1b[30m', '\x1b[39m'],
  red: ['\x1b[31m', '\x1b[39m'],
  green: ['\x1b[32m', '\x1b[39m'],
  yellow: ['\x1b[33m', '\x1b[39m'],
  blue: ['\x1b[34m', '\x1b[39m'],
  magenta: ['\x1b[35m', '\x1b[39m'],
  cyan: ['\x1b[36m', '\x1b[39m'],
  white: ['\x1b[37m', '\x1b[39m'],
  gray: ['\x1b[90m', '\x1b[39m'],
  bgBlack: ['\x1b[40m', '\x1b[49m'],
  bgRed: ['\x1b[41m', '\x1b[49m'],
  bgGreen: ['\x1b[42m', '\x1b[49m'],
  bgYellow: ['\x1b[43m', '\x1b[49m'],
  bgBlue: ['\x1b[44m', '\x1b[49m'],
  bgMagenta: ['\x1b[45m', '\x1b[49m'],
  bgCyan: ['\x1b[46m', '\x1b[49m'],
  bgWhite: ['\x1b[47m', '\x1b[49m'],
};

const round = Math.round;

type ColorVal = (string | number)[];

export class Rgb {
  r: string | number;
  g: string | number;
  b: string | number;
  constructor(col: Array<string | number>) {
    this.r = col[0];
    this.g = col[1];
    this.b = col[2];
  }

  toString(): string {
    return `rgb(${this.r},${this.g},${this.b})`;
  }
}

export class Rgba extends Rgb {
  a: string | number;
  constructor(col: Array<string | number>) {
    super(col);
    this.a = col[3];
  }

  toString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }
}

export class Hsl {
  h: string | number;
  s: string | number;
  l: string | number;
  constructor(col: Array<string | number>) {
    this.h = col[0];
    this.s = col[1];
    this.l = col[2];
  }

  toString(): string {
    return `hsl(${this.h},${this.s}%,${this.l}%)`;
  }
}

export class Hsla extends Hsl {
  a: string | number;
  constructor(col: Array<string | number>) {
    super(col);
    this.a = col[3];
  }

  toString(): string {
    return `hsla(${this.h},${this.s}%,${this.l}%,${this.a})`;
  }
}

export class Color {
  r: string | number;
  g: string | number;
  b: string | number;
  a: string | number;
  rgb: Rgb;
  rgba: Rgba;
  hex: string;
  hsl: Hsl;
  hsla: Hsla;
  h: string | number;
  s: string | number;
  l: string | number;
  constructor(
    r: string | number | Array<string | number>,
    g: string | number = 0,
    b: string | number = 0,
    a: string | number = 1.0,
  ) {
    if (typeof r === 'string') {
      let str = r;
      if (str.charAt(0) !== '#') {
        str = '#' + str;
      }
      if (str.length < 7) {
        str = '#' + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
      }
      const rgb = hexToRgb(str);
      if (rgb) {
        [r, g, b] = rgb;
      }
    } else if (r instanceof Array) {
      a = r[3] || a;
      b = r[2];
      g = r[1];
      r = r[0];
    }
    this.r = Number(r);
    this.g = Number(g);
    this.b = Number(b);
    this.a = a;
    this.rgb = new Rgb([this.r, this.g, this.b]);
    this.rgba = new Rgba([this.r, this.g, this.b, this.a]);
    this.hex = rgbToHex(this.r, this.g, this.b);

    this.hsl = new Hsl(rgbToHsl(this.r, this.g, this.b));
    this.h = this.hsl.h;
    this.s = this.hsl.s;
    this.l = this.hsl.l;
    this.hsla = new Hsla([this.h, this.s, this.l, this.a]);
  }

  setHue(newHue: string | number): void {
    this.h = newHue;
    this.hsl.h = newHue;
    this.hsla.h = newHue;
    this.updateFromHsl();
  }

  setSat(newSat: string | number): void {
    this.s = newSat;
    this.hsl.s = newSat;
    this.hsla.s = newSat;
    this.updateFromHsl();
  }

  setLum(newLum: number): void {
    this.l = newLum;
    this.hsl.l = newLum;
    this.hsla.l = newLum;
    this.updateFromHsl();
  }

  setAlpha(newAlpha: string | number): void {
    this.a = newAlpha;
    this.hsla.a = newAlpha;
    this.rgba.a = newAlpha;
  }

  updateFromHsl(): void {
    this.rgb = new Rgb(hslToRgb(this.h, this.s, this.l));

    this.r = this.rgb.r;
    this.g = this.rgb.g;
    this.b = this.rgb.b;
    this.rgba.r = this.rgb.r;
    this.rgba.g = this.rgb.g;
    this.rgba.b = this.rgb.b;

    this.hex = rgbToHex([this.r, this.g, this.b]);
  }
}

export const randomColor = function (): Color {
  const r = '#' + Math.random().toString(16).slice(2, 8);
  return new Color(r);
};

/**
 * @description: `#rrggbb` / `#rgb` (with or without the `#`) to `[r, g, b]`; null when it cannot be parsed.
 *
 * The three-digit shorthand is expanded per the CSS rule (`#abc` → `#aabbcc`), not
 * zero-padded — padding would turn `#fff` into `#0f0f0f`, a dark grey rather than white.
 *
 * @param {string} hex
 * @return {Array<number> | null}
 */
export const hexToRgb = function (hex: string): Array<number> | null {
  const value = hex[0] === '#' ? hex.slice(1) : hex;
  if (/^[a-f\d]{3}$/i.test(value)) {
    return [parseInt(value[0] + value[0], 16), parseInt(value[1] + value[1], 16), parseInt(value[2] + value[2], 16)];
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

export const componentToHex = function (c: string | number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

export const rgbToHex = function (
  r: string | number | Array<string | number>,
  g: string | number = 0,
  b: string | number = 0,
): string {
  if (r instanceof Array) {
    b = r[2];
    g = r[1];
    r = r[0];
  }
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const rgbToHsl = function (r: number | number[], g: number = 0, b: number = 0): Array<number> {
  if (r instanceof Array) {
    b = r[2];
    g = r[1];
    r = r[0];
  }

  let s,
    l,
    d,
    h = 0;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  h = round(h * 360);
  s = round(s * 100);
  l = round(l * 100);

  return [h, s, l];
};

export const hue2rgb = function (p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
};

export const hslToRgb = function (
  h: number | string | number[],
  s: number | string,
  l: number | string,
): Array<number> {
  if (h instanceof Array) {
    l = h[2];
    s = h[1];
    h = h[0];
  }
  h = Number(h) / 360;
  s = Number(s) / 100;
  l = Number(l) / 100;

  let r, g, b, q, p;

  if (s === 0) {
    r = g = b = l;
  } else {
    q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [round(r * 255), round(g * 255), round(b * 255)];
};

export const rgbToHsb = function (r: number, g: number, b: number): number[] {
  let h = 0,
    s,
    v;

  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = round(h * 360);
  s = round(s * 100);
  v = round(v * 100);

  return [h, s, v];
};

export const hsbToRgb = function (h: number, s: number, v: number): number[] {
  let r = 0,
    g = 0,
    b = 0;

  if (v === 0) {
    return [0, 0, 0];
  }

  s = s / 100;
  v = v / 100;
  h = h / 60;

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));

  if (i === 0) {
    r = v;
    g = t;
    b = p;
  } else if (i === 1) {
    r = q;
    g = v;
    b = p;
  } else if (i === 2) {
    r = p;
    g = v;
    b = t;
  } else if (i === 3) {
    r = p;
    g = q;
    b = v;
  } else if (i === 4) {
    r = t;
    g = p;
    b = v;
  } else if (i === 5) {
    r = v;
    g = p;
    b = q;
  }

  // round, not floor: floor drags every channel down by up to 1, so an rgb → hsb → rgb
  // round trip never settles — dragging around a colour picker keeps bleeding colour out.
  r = round(r * 255);
  g = round(g * 255);
  b = round(b * 255);

  return [r, g, b];
};

export const hsvToRgb = hsbToRgb;

export const hsbToHsl = function (h: number, s: number, b: number): number[] {
  return rgbToHsl(hsbToRgb(h, s, b));
};

export const hsvToHsl = hsbToHsl;

/** Alias of `rgbToHsb` — HSV and HSB are two names for the same colour space. */
export const rgbToHsv = rgbToHsb;

/**
 * @description: `#rrggbb` / `#rgb` to `[h, s, b]`; null when the hex is invalid.
 * @param {string} hex
 * @return {number[] | null}
 */
export const hexToHsb = function (hex: string): number[] | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsb(rgb[0], rgb[1], rgb[2]) : null;
};

export const hexToHsv = hexToHsb;

/**
 * @description: `[h, s, l]` to `[h, s, b]`
 * @param {number} h hue, 0–360
 * @param {number} s saturation, 0–100
 * @param {number} l lightness, 0–100
 * @return {number[]}
 */
export const hslToHsb = function (h: number, s: number, l: number): number[] {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHsb(r, g, b);
};

export const hslToHsv = hslToHsb;

/**
 * @description: A two-digit hex alpha channel (`ff` / `80` / `00`) to a 0–100 percentage.
 * @param {string} aa two hex digits
 * @return {number} 0 ~ 100
 */
export const hexToAlpha = function (aa: string): number {
  return round((parseInt(aa, 16) / 255) * 100);
};

/**
 * @description: Build a CSS `rgba()` string. Alpha is 0–100 rather than 0–1, matching the
 * percentage convention the rest of this module uses.
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {number} a 0~100
 * @return {string}
 */
export const rgbaString = function (r: number, g: number, b: number, a: number): string {
  return 'rgba(' + [r, g, b, a / 100].join(',') + ')';
};

/**
 * @description: Composite a translucent colour **over white**, giving the equivalent opaque rgb.
 *
 * For places that do not accept alpha (writing back a 6-digit hex, say). Note the backdrop
 * is hard-coded to white: under a dark theme the result comes out too light, so composite
 * against your own backdrop when you need a different one.
 *
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {number} a 0~100
 * @return {number[]} [r, g, b]
 */
export const rgbaToRgb = function (r: number, g: number, b: number, a: number): number[] {
  const alpha = a / 100;
  return [
    Math.trunc((1 - alpha) * 255 + alpha * r),
    Math.trunc((1 - alpha) * 255 + alpha * g),
    Math.trunc((1 - alpha) * 255 + alpha * b),
  ];
};

/**
 * @description: Composite a translucent colour over white and return it as a 6-digit hex.
 * @param {number} r 0~255
 * @param {number} g 0~255
 * @param {number} b 0~255
 * @param {number} a 0~100
 * @return {string}
 */
export const rgbaToHex = function (r: number, g: number, b: number, a: number): string {
  const rgb = rgbaToRgb(r, g, b, a);
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
};

/** `#rgb` / `#rrggbb` (the `#` is required) */
export const HEX_COLOR_REGEX = /^#([\da-f]{6}|[\da-f]{3})$/i;

/** `rgb(r,g,b)`, no spaces — strip whitespace before matching */
export const RGB_REGEX = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;

/** `rgba(r,g,b,a)`, no spaces — strip whitespace before matching */
export const RGBA_REGEX = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d{1,3}(\.\d+)?)\)$/;

export class ColorScheme {
  palette: Color[];
  constructor(colorVal: (string | number)[], angleArray: number[]) {
    this.palette = [];

    if (angleArray === undefined && colorVal instanceof Array) {
      this.createFromColors(colorVal);
    } else {
      this.createFromAngles(colorVal, angleArray);
    }
  }

  createFromColors(colorVal: (string | number)[]): Color[] {
    for (const i in colorVal) {
      if (Object.prototype.hasOwnProperty.call(colorVal, i)) {
        this.palette.push(new Color(colorVal[i]));
      }
    }
    return this.palette;
  }

  createFromAngles(colorVal: string | number | (string | number)[], angleArray: number[]): Color[] {
    this.palette.push(new Color(colorVal));
    for (const i in angleArray) {
      if (Object.prototype.hasOwnProperty.call(angleArray, i)) {
        const tempHue = (Number(this.palette[0].h) + angleArray[i]) % 360;
        this.palette.push(new Color(hslToRgb(tempHue, Number(this.palette[0].s), Number(this.palette[0].l))));
      }
    }
    return this.palette;
  }

  static Compl(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [180]);
  }

  static Triad(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [120, 240]);
  }

  static Tetrad(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [60, 180, 240]);
  }

  static Analog(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [-45, 45]);
  }

  static Split(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [150, 210]);
  }

  static Accent(colorVal: ColorVal): ColorScheme {
    return new this(colorVal, [-45, 45, 180]);
  }
}

/** An RGB triple with each channel in 0..1 (linear or sRGB depending on the operation). */
export type RGB = [number, number, number];

/**
 * @description: Convert one sRGB channel (0..1) to linear-light (IEC 61966-2-1 transfer function).
 * @param {number} c sRGB channel, 0..1
 * @return {number} linear-light channel, 0..1
 */
export const srgbToLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/**
 * @description: Convert one linear-light channel (0..1) to sRGB.
 * @param {number} c linear-light channel, 0..1
 * @return {number} sRGB channel, 0..1
 */
export const linearToSrgb = (c: number): number => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

/**
 * @description: Perceived brightness (luma) of an RGB colour using Rec. 601 weights. Channels may be 0..1 or 0..255 — the result keeps that scale.
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @return {number}
 */
export const luma = (r: number, g: number, b: number): number => 0.299 * r + 0.587 * g + 0.114 * b;

const mapRGB = (a: RGB, b: RGB, f: (x: number, y: number) => number): RGB => [
  f(a[0], b[0]),
  f(a[1], b[1]),
  f(a[2], b[2]),
];

/**
 * @description: Screen blend of two colours (channel-wise `1 - (1 - base)(1 - blend)`). Channels in 0..1.
 * @param {RGB} base
 * @param {RGB} blend
 * @return {RGB}
 */
export const blendScreen = (base: RGB, blend: RGB): RGB => mapRGB(base, blend, (x, y) => 1 - (1 - x) * (1 - y));

/**
 * @description: Multiply blend of two colours (channel-wise `base * blend`). Channels in 0..1.
 * @param {RGB} base
 * @param {RGB} blend
 * @return {RGB}
 */
export const blendMultiply = (base: RGB, blend: RGB): RGB => mapRGB(base, blend, (x, y) => x * y);

/**
 * @description: Overlay blend of two colours (multiply in shadows, screen in highlights). Channels in 0..1.
 * @param {RGB} base
 * @param {RGB} blend
 * @return {RGB}
 */
export const blendOverlay = (base: RGB, blend: RGB): RGB =>
  mapRGB(base, blend, (x, y) => (x < 0.5 ? 2 * x * y : 1 - 2 * (1 - x) * (1 - y)));

/**
 * @description: Adjust brightness and contrast of a colour: `(c - 0.5) * contrast + 0.5 + brightness` per channel. Channels in 0..1.
 * @param {RGB} color
 * @param {number} brightness additive, e.g. 0 = none
 * @param {number} contrast multiplicative, e.g. 1 = none
 * @return {RGB}
 */
export const brightnessContrast = (color: RGB, brightness: number, contrast: number): RGB =>
  color.map((c) => (c - 0.5) * contrast + 0.5 + brightness) as RGB;

/**
 * @description: Adjust saturation by mixing toward the colour's luminance. `amount` 0 = greyscale, 1 = unchanged, >1 = more saturated. Channels in 0..1.
 * @param {RGB} color
 * @param {number} amount
 * @return {RGB}
 */
export const saturation = (color: RGB, amount: number): RGB => {
  const grey = 0.2125 * color[0] + 0.7154 * color[1] + 0.0721 * color[2];
  return color.map((c) => grey + (c - grey) * amount) as RGB;
};

/**
 * @description: Vibrance — saturates muted colours more than already-saturated ones. `amount` > 0 boosts, < 0 mutes. Channels in 0..1.
 * @param {RGB} color
 * @param {number} amount
 * @return {RGB}
 */
export const vibrance = (color: RGB, amount: number): RGB => {
  const average = (color[0] + color[1] + color[2]) / 3;
  const mx = Math.max(color[0], color[1], color[2]);
  const t = (mx - average) * (-amount * 3);
  return color.map((c) => c + (mx - c) * t) as RGB;
};

/**
 * @description: Inigo Quilez cosine gradient palette: `a + b * cos(2π(c·t + d))`. Each of `a,b,c,d` is an RGB triple; `t` is the position 0..1. Returns an RGB triple.
 * @param {number} t position along the gradient
 * @param {RGB} a base / offset
 * @param {RGB} b amplitude
 * @param {RGB} c frequency
 * @param {RGB} d phase
 * @return {RGB}
 */
export const cosinePalette = (t: number, a: RGB, b: RGB, c: RGB, d: RGB): RGB =>
  [0, 1, 2].map((i) => a[i] + b[i] * Math.cos(2 * Math.PI * (c[i] * t + d[i]))) as RGB;
