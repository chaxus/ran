import { DEG_TO_RAD } from '@/utils/visual/math/enums';

/**
 * @description: Degrees to radians
 * @param {number} deg angle in degrees
 * @return {number} angle in radians
 */
export const getAngle = (deg: number): number => {
  return DEG_TO_RAD * deg;
};

/**
 * @description: The point on a circle at a given angle
 * @param {number} deg angle in radians
 * @param {number} r radius
 * @return {[number, number]} the coordinates [x, y]
 */
export const getArcPointerByDeg = (deg: number, r: number): [number, number] => {
  return [+(Math.cos(deg) * r).toFixed(8), +(Math.sin(deg) * r).toFixed(8)];
};

/**
 * @description: The tangent line at a point on a circle
 * @param {number} x x coordinate
 * @param {number} y y coordinate
 * @return {Array<number>} [slope, intercept]
 */
export const getTangentByPointer = (x: number, y: number): Array<number> => {
  const k = -x / y;
  const b = -k * x + y;
  return [k, b];
};

/**
 * @description: Trace a pie slice with arc(), including the gutter between slices.
 * Builds the path only — no fill or stroke, so the caller decides how to paint it.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} maxRadius outer radius
 * @param {number} start start angle in radians
 * @param {number} end end angle in radians
 * @param {number} gutter width of the gap between slices
 */
export const fanShapedByArc = (
  ctx: CanvasRenderingContext2D,
  maxRadius: number,
  start: number,
  end: number,
  gutter: number,
): void => {
  ctx.beginPath();
  const maxGutter = getAngle((90 / Math.PI / maxRadius) * gutter);
  const maxStart = start + maxGutter;
  const maxEnd = end - maxGutter;
  ctx.arc(0, 0, maxRadius, maxStart, maxEnd, false);
  // A gutter shorter than the slice draws as an arc; otherwise new coordinates are computed
  ctx.lineTo(...getArcPointerByDeg((start + end) / 2, gutter / 2 / Math.abs(Math.sin((start - end) / 2))));
  ctx.closePath();
};

/**
 * @description: Trace a rounded rectangle with arc(). A corner radius larger than half the
 * shorter side is clamped to half, so adjacent corners cannot overlap. Builds the path only
 * — no fill or stroke.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number[]} rest [x, y, w, h, r]
 */
export const roundRectByArc = (ctx: CanvasRenderingContext2D, ...[x, y, w, h, r]: number[]): void => {
  const min = Math.min(w, h),
    PI = Math.PI;
  if (r > min / 2) r = min / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -PI / 2, 0);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, PI / 2, PI);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, PI, -PI / 2);
  ctx.closePath();
};

/**
 * @description: Translate a CSS `linear-gradient(...)` string into a Canvas CanvasGradient.
 *
 * createLinearGradient only takes a start and an end point, while CSS describes direction
 * as an angle — so the circle is split into eight 45° sectors and the tangent turns the
 * angle back into start/end coordinates on the rectangle's boundary.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x x of the rectangle's top-left corner
 * @param {number} y y of the rectangle's top-left corner
 * @param {number} w rectangle width
 * @param {number} h rectangle height
 * @param {string} background a string such as `linear-gradient(90deg, red, blue)`
 * @return {CanvasGradient} assignable straight to fillStyle / strokeStyle
 */
export const getLinearGradient = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  background: string,
): CanvasGradient => {
  const context = (/linear-gradient\((.+)\)/.exec(background) as Array<string>)[1]
    .split(',') // split on commas
    .map((text: string) => text.trim()); // trim each part
  let deg = context.shift() as string;
  let direction: [number, number, number, number] = [0, 0, 0, 0];
  // Derive the gradient's end point from the start point and the angle, via Pythagoras
  if (deg.includes('deg')) {
    const angle = Number(deg.slice(0, -3)) % 360;
    deg = `${angle}`;
    // The start point comes from the quadrant; the end point from which of the eight 45° sectors the angle falls in
    const getLenOfTanDeg = (d: number) => Math.tan((d / 180) * Math.PI);
    if (angle >= 0 && angle < 45) direction = [x, y + h, x + w, y + h - w * getLenOfTanDeg(angle - 0)];
    else if (angle >= 45 && angle < 90) direction = [x, y + h, x + w - h * getLenOfTanDeg(angle - 45), y];
    else if (angle >= 90 && angle < 135) direction = [x + w, y + h, x + w - h * getLenOfTanDeg(angle - 90), y];
    else if (angle >= 135 && angle < 180) direction = [x + w, y + h, x, y + w * getLenOfTanDeg(angle - 135)];
    else if (angle >= 180 && angle < 225) direction = [x + w, y, x, y + w * getLenOfTanDeg(angle - 180)];
    else if (angle >= 225 && angle < 270) direction = [x + w, y, x + h * getLenOfTanDeg(angle - 225), y + h];
    else if (angle >= 270 && angle < 315) direction = [x, y, x + h * getLenOfTanDeg(angle - 270), y + h];
    else if (angle >= 315 && angle < 360) direction = [x, y, x + w, y + h - w * getLenOfTanDeg(angle - 315)];
  }
  // The four axis-aligned directions
  else if (deg.includes('top')) direction = [x, y + h, x, y];
  else if (deg.includes('bottom')) direction = [x, y, x, y + h];
  else if (deg.includes('left')) direction = [x + w, y, x, y];
  else if (deg.includes('right')) direction = [x, y, x + w, y];
  // createLinearGradient needs integer coordinates
  const gradient = ctx.createLinearGradient(...(direction.map((n) => n >> 0) as typeof direction));
  return context.reduce((acc: CanvasGradient, item: string, index: number) => {
    const info = item.split(' ');
    if (info.length === 1) acc.addColorStop(index, info[0]);
    else if (info.length === 2) acc.addColorStop(Number(info[1]), info[0]);
    return acc;
  }, gradient);
};
