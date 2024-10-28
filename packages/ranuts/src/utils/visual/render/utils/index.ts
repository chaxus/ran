export const getRgb = (color: string): [number, number, number] => {
  const colorHexStr = color.slice(1);
  const colorHex = parseInt(colorHexStr, 16);

  const r = (colorHex >> 16) & 0xff;
  const g = (colorHex >> 8) & 0xff;
  const b = colorHex & 0xff;

  return [r, g, b];
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
