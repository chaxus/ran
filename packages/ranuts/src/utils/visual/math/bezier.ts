export const getBezierLength = (
  P0X: number,
  P0Y: number,
  P1X: number,
  P1Y: number,
  P2X: number,
  P2Y: number,
  P3X: number,
  P3Y: number,
): number => {
  const n = 10; // 取 10 段

  let x = P0X;
  let y = P0Y;

  let length = 0;

  for (let i = 1; i <= n; i++) {
    const t = i / n;

    const newX =
      (1 - t) * (1 - t) * (1 - t) * P0X + 3 * t * (1 - t) * (1 - t) * P1X + 3 * t * t * (1 - t) * P2X + t * t * t * P3X;
    const newY =
      (1 - t) * (1 - t) * (1 - t) * P0Y + 3 * t * (1 - t) * (1 - t) * P1Y + 3 * t * t * (1 - t) * P2Y + t * t * t * P3Y;

    const dx = newX - x;
    const dy = newY - y;

    length += Math.sqrt(dx * dx + dy * dy);

    x = newX;
    y = newY;
  }

  return length;
};

export const getQuadraticBezierLength = (
  P0X: number,
  P0Y: number,
  P1X: number,
  P1Y: number,
  P2X: number,
  P2Y: number,
): number => {
  const ax = 2 * (P0X - 2 * P1X + P2X);
  const bx = -2 * (P0X - P1X);
  const ay = 2 * (P0Y - 2 * P1Y + P2Y);
  const by = -2 * (P0Y - P1Y);

  const A = ax * ax + ay * ay;
  const B = 2 * (ax * bx + ay * by);
  const C = bx * bx + by * by;

  const a = Math.sqrt((4 * A * C - B * B) / 4);

  // 牛顿 - 莱布尼兹公式
  const F1 =
    (A / 2 + B / 4) * Math.sqrt((A + B / 2) * (A + B / 2) + a * a) +
    ((a * a) / 2) * Math.log(Math.abs(A + B / 2 + Math.sqrt((A + B / 2) * (A + B / 2) + a * a)));

  const F0 =
    (B / 4) * Math.sqrt((B * B) / 4 + a * a) + ((a * a) / 2) * Math.log(B / 2 + Math.sqrt((B * B) / 4 + a * a));

  const length = (1 / (Math.sqrt(A) * A)) * (F1 - F0); // 不要忘了前面还有个(A根号A分之一)

  return length;
};
