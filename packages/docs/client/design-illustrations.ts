/** Enhance only existing teaching figures; static diagrams remain the no-script default. */
export const mountDesignIllustrations = (): (() => void) => {
  const figures = [...document.querySelectorAll<HTMLElement>('[data-design-illustration]:not([data-enhanced])')];
  if (!figures.length) return () => {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = figures.map((figure) => {
    const button = figure.querySelector<HTMLButtonElement>('button')!;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let remaining = 4000;
    let started = 0;
    const clear = (): void => {
      clearTimeout(timer);
      timer = undefined;
    };
    const state = (next: string): void => {
      figure.dataset.state = next;
      button.textContent =
        button.dataset[
          motion.matches
            ? 'reduced'
            : next === 'playing'
              ? 'pause'
              : next === 'paused'
                ? 'resume'
                : next === 'finished'
                  ? 'replay'
                  : 'play'
        ]!;
    };
    const reset = (): void => {
      clear();
      remaining = 4000;
      state('idle');
      button.disabled = motion.matches;
    };
    const click = (): void => {
      if (motion.matches) return;
      if (figure.dataset.state === 'playing') {
        remaining -= Date.now() - started;
        clear();
        state('paused');
      } else {
        if (figure.dataset.state !== 'paused') {
          reset();
          // Commit the static state so Replay restarts CSS animations, not just its timer.
          figure.getBoundingClientRect();
        }
        state('playing');
        started = Date.now();
        timer = setTimeout(() => {
          timer = undefined;
          state('finished');
        }, remaining);
      }
    };
    figure.dataset.enhanced = 'true';
    button.hidden = false;
    reset();
    button.addEventListener('click', click);
    motion.addEventListener('change', reset);
    return () => {
      reset();
      button.hidden = true;
      delete figure.dataset.enhanced;
      button.removeEventListener('click', click);
      motion.removeEventListener('change', reset);
    };
  });
  return () => cleanups.forEach((stop) => stop());
};
