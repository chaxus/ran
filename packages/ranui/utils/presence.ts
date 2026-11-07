/**
 * Wait until CSS animations/transitions on an element have finished (or there
 * is nothing to wait for), then call `done`.
 *
 * Used by floating panels, modal and message so exit presence ends before
 * teardown or focus restore — the same contract as Base UI / Radix presence.
 *
 * A panel that applies animations inside its shadow root (e.g. `r-dropdown`)
 * can expose `getAnimationTarget()`; otherwise the host itself is watched.
 * Under `prefers-reduced-motion` or with animations disabled, this finishes
 * on the next frame with an empty running list.
 */
export interface AnimatableHost extends Element {
  getAnimationTarget?: () => Element;
}

export const presenceTarget = (host: Element): Element =>
  (host as AnimatableHost).getAnimationTarget?.() ?? host;

export const settlePresence = (host: Element, done: () => void): void => {
  const el = presenceTarget(host);
  // No animation API (jsdom) or no frames to wait for: there is provably
  // nothing running, so finish in this tick rather than a microtask later.
  if (typeof el.getAnimations !== 'function' || typeof requestAnimationFrame !== 'function') {
    done();
    return;
  }
  // A class applied this tick has no running animation until the next frame.
  requestAnimationFrame(() => {
    const running = el.getAnimations();
    if (!running.length) {
      done();
      return;
    }
    void (async () => {
      // `finished` rejects on cancel, which is a normal outcome here: a panel
      // re-opened mid-exit cancels the exit animation.
      await Promise.allSettled(running.map((animation) => animation.finished));
      done();
    })();
  });
};
