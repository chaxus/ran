/**
 * The glass's lens profile: flat in the middle, curving down over a band of width `bevel` at
 * the edge. Both refraction paths read it — the SVG displacement map below, and the WebGL
 * shader in `refraction.ts`, which repeats the same formulas in GLSL.
 */

/** Width of the curved edge band, in CSS px. */
export const bevelWidth = (width: number, height: number, bevel: number): number =>
  Math.max(1, Math.min(bevel, Math.min(width, height) / 2));

/**
 * 透镜形状用的圆角：至少和斜面一样宽。
 * 圆角小于斜面时，矩形内部的法线在对角线上突变，位移图会出现一条斜缝。
 */
export const lensRadius = (width: number, height: number, radius: number, bevel: number): number =>
  Math.min(Math.max(radius, bevel), Math.min(width, height) / 2);

/**
 * How far an edge point bends light, from 0 (deeper than the bevel) to 1 (on the rim).
 * `u` is 1 at the edge and 0 at the inner end of the bevel.
 */
export const bendAt = (u: number): number => u * u;

/**
 * The `feDisplacementMap` input for a `width`×`height` pane: R and G hold the inward
 * pull at each pixel, 128 is no pull. Every pixel pulls toward the centre, so the backdrop
 * just inside the edge is stretched over the rim, the way a convex lens magnifies.
 */
export const lensMap = (
  width: number,
  height: number,
  radius: number,
  bevel: number,
): Uint8ClampedArray<ArrayBuffer> => {
  const data = new Uint8ClampedArray(width * height * 4);
  const hw = width / 2;
  const hh = height / 2;
  const band = bevelWidth(width, height, bevel);
  const r = lensRadius(width, height, radius, band);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = x + 0.5 - hw;
      const py = y + 0.5 - hh;
      const qx = Math.abs(px) - hw + r;
      const qy = Math.abs(py) - hh + r;
      let nx: number;
      let ny: number;
      let d: number;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy);
        d = len - r;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        d = qx - r;
        nx = Math.sign(px);
        ny = 0;
      } else {
        d = qy - r;
        nx = 0;
        ny = Math.sign(py);
      }
      const u = Math.min(1, Math.max(0, 1 + d / band));
      const m = bendAt(u);
      const i = (y * width + x) * 4;
      data[i] = 128 - nx * m * 127;
      data[i + 1] = 128 - ny * m * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }
  return data;
};
