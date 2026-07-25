/**
 * @description: A set of easing functions. Each is a pure mathematical mapping — it does not
 * touch the DOM and brings no RAF loop of its own; the caller feeds in the elapsed time from
 * its own animation frame and gets back the value for that frame.
 *
 * Parameters follow Robert Penner's classic convention:
 * - t: current time (how much has elapsed)
 * - b: beginning value
 * - c: change in value (the final value is b + c)
 * - d: duration
 *
 * Every function clamps at `t >= d`, so calling past the duration returns the final value rather than extrapolating.
 *
 * With thanks to Zhang Xinxu — https://github.com/zhangxinxu/Tween
 *
 * @example
 * ```ts
 * const start = performance.now();
 * const tick = (now: number) => {
 *   const x = cubic.easeOut(now - start, 0, 300, 600); // 0 → 300 over 600ms
 *   el.style.transform = `translateX(${x}px)`;
 *   if (now - start < 600) requestAnimationFrame(tick);
 * };
 * requestAnimationFrame(tick);
 * ```
 */

/** One easing function: (elapsed, from, delta, duration) => current value */
export type EasingFn = (t: number, b: number, c: number, d: number) => number;

/** The ease-in / ease-out pair of one easing family */
export interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

// Quadratic easing
export const quad: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return -c * (t /= d) * (t - 2) + b;
  },
};

// Cubic easing
export const cubic: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * (t /= d) * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
};

// Quartic easing
export const quart: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * (t /= d) * t * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
};

// Quintic easing
export const quint: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
};

// Sinusoidal easing
export const sine: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
};

// Exponential easing
export const expo: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return t === 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return t === d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
};

// Circular easing
export const circ: SpeedType = {
  easeIn: function (t, b, c, d) {
    if (t >= d) t = d;
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOut: function (t, b, c, d) {
    if (t >= d) t = d;
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
};
