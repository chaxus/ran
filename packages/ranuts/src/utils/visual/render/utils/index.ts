// Colour parse cache: each colour is parsed once (named colours and rgb() go through a canvas, which is expensive)
const colorCache = new Map<string, [number, number, number]>();

// One reused 1x1 offscreen canvas, borrowing the browser's own CSS colour parser as a fallback
let resolverCtx: CanvasRenderingContext2D | null | undefined;

/**
 * Parse any valid CSS colour (named, rgb(), rgba(), hsl(), …) into [r, g, b], so the WebGL
 * and WebGPU backends accept exactly the same colour input as the Canvas backend and the
 * three stay aligned.
 */
const resolveCssColor = (color: string): [number, number, number] => {
  if (resolverCtx === undefined) {
    resolverCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  if (!resolverCtx) return [0, 0, 0];
  // Fill with black first: an invalid colour assignment is ignored and so degrades to black, matching the Canvas backend
  resolverCtx.fillStyle = '#000';
  resolverCtx.fillStyle = color;
  resolverCtx.fillRect(0, 0, 1, 1);
  const [r, g, b] = resolverCtx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
};

export const getRgb = (color: string): [number, number, number] => {
  const cached = colorCache.get(color);
  if (cached) return cached;

  let rgb: [number, number, number];

  if (/^#?[0-9a-fA-F]{3}$/.test(color)) {
    // Fast path: the #rgb shorthand, expanded to #rrggbb
    const hex = color.replace('#', '');
    rgb = [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
  } else if (/^#?[0-9a-fA-F]{6}$/.test(color)) {
    // Fast path: #rrggbb, avoiding the canvas entirely
    const colorHex = parseInt(color.replace('#', ''), 16);
    rgb = [(colorHex >> 16) & 0xff, (colorHex >> 8) & 0xff, colorHex & 0xff];
  } else {
    // Fallback: hand any other valid CSS colour to the browser, matching the Canvas backend
    rgb = resolveCssColor(color);
  }

  colorCache.set(color, rgb);
  return rgb;
};

export const toRgbaLittleEndian = (color: string, alpha: number): number => {
  const [r, g, b] = getRgb(color).map((i) => Math.round(i * alpha));

  const a = Math.round(alpha * 255);

  let res = 0;
  res += a << 24;
  res += b << 16;
  res += g << 8;
  res += r;

  return res;
};

export const toRgbArray = (color: string): [number, number, number] => {
  const [r, g, b] = getRgb(color);

  return [r / 255, g / 255, b / 255];
};
