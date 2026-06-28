// 颜色解析缓存：同一颜色只解析一次（命名色 / rgb() 走 canvas，开销较高）
const colorCache = new Map<string, [number, number, number]>();

// 复用一个 1x1 的离屏 canvas，借浏览器自身的 CSS 颜色解析能力兜底
let resolverCtx: CanvasRenderingContext2D | null | undefined;

/**
 * 把任意合法的 CSS 颜色（命名色、rgb()、rgba()、hsl() 等）解析成 [r, g, b]。
 * 这样 WebGL / WebGPU 后端能接受与 Canvas 后端完全一致的颜色输入，避免后端间颜色不对齐。
 */
const resolveCssColor = (color: string): [number, number, number] => {
  if (resolverCtx === undefined) {
    resolverCtx = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
  }
  if (!resolverCtx) return [0, 0, 0];
  // 先填黑：非法颜色赋值会被忽略，从而退化为黑色，行为与 Canvas 后端一致
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
    // 快路径：#rgb 简写，扩展成 #rrggbb
    const hex = color.replace('#', '');
    rgb = [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16)];
  } else if (/^#?[0-9a-fA-F]{6}$/.test(color)) {
    // 快路径：#rrggbb，避免创建 canvas
    const colorHex = parseInt(color.replace('#', ''), 16);
    rgb = [(colorHex >> 16) & 0xff, (colorHex >> 8) & 0xff, colorHex & 0xff];
  } else {
    // 兜底：其它合法 CSS 颜色交给浏览器解析，与 Canvas 后端保持一致
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
