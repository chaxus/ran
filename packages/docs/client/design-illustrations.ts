/** Diagrams explain themselves in view; the unenhanced default is always complete and static. */
export const mountDesignIllustrations = (): (() => void) => {
  const figures = [...document.querySelectorAll<HTMLElement>('[data-design-illustration]:not([data-enhanced])')];
  if (!figures.length || typeof IntersectionObserver === 'undefined') return () => {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const canvases = new Map(
    figures.map((figure) => [figure.querySelector('.ran-design-canvas')!, { figure, visible: false }]),
  );
  let active = true;
  const update = (): void => {
    for (const { figure, visible } of canvases.values()) {
      if (motion.matches) delete figure.dataset.state;
      else if (visible) figure.dataset.state = 'playing';
      else if (figure.dataset.state) figure.dataset.state = 'paused';
    }
  };
  const observer = new IntersectionObserver((entries) => {
    if (!active) return;
    for (const entry of entries) {
      const canvas = canvases.get(entry.target);
      if (canvas) canvas.visible = entry.isIntersecting;
    }
    update();
  });
  for (const [canvas, { figure }] of canvases) {
    figure.dataset.enhanced = 'true';
    observer.observe(canvas);
  }
  motion.addEventListener('change', update);
  return () => {
    if (!active) return;
    active = false;
    observer.disconnect();
    motion.removeEventListener('change', update);
    for (const figure of figures) {
      delete figure.dataset.state;
      delete figure.dataset.enhanced;
    }
  };
};
