/** Enhance only existing teaching figures; static diagrams remain the no-script default. */
export const mountDesignIllustrations = (): (() => void) => {
  const figures = [...document.querySelectorAll<HTMLElement>('[data-design-illustration]:not([data-enhanced])')];
  if (!figures.length) return () => {};
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cleanups = figures.map((figure) => {
    const button = figure.querySelector<HTMLButtonElement>('button')!;
    const label = button.querySelector<HTMLElement>('[data-play-label]')!;
    const note = figure.querySelector<HTMLElement>('[data-reduced-note]')!;
    const state = (next: string): void => {
      figure.dataset.state = next;
      label.textContent =
        button.dataset[
          next === 'playing' ? 'pause' : next === 'paused' ? 'resume' : next === 'finished' ? 'replay' : 'play'
        ]!;
    };
    const reset = (): void => {
      const focused = document.activeElement;
      state('idle');
      button.hidden = motion.matches;
      note.hidden = !motion.matches;
      if (motion.matches && focused === button) note.focus();
      else if (!motion.matches && focused === note) button.focus();
    };
    const click = (): void => {
      if (motion.matches) return;
      if (figure.dataset.state === 'playing') state('paused');
      else {
        if (figure.dataset.state !== 'paused') {
          state('idle');
          // Commit the static state so Replay restarts the finite CSS animation.
          figure.getBoundingClientRect();
        }
        state('playing');
      }
    };
    const end = (event: Event): void => {
      if (figure.dataset.state === 'playing' && event.target instanceof Element && event.target.matches('.di-motion'))
        state('finished');
    };
    figure.dataset.enhanced = 'true';
    reset();
    button.addEventListener('click', click);
    figure.addEventListener('animationend', end);
    motion.addEventListener('change', reset);
    return () => {
      state('idle');
      button.hidden = true;
      note.hidden = true;
      delete figure.dataset.enhanced;
      button.removeEventListener('click', click);
      figure.removeEventListener('animationend', end);
      motion.removeEventListener('change', reset);
    };
  });
  return () => cleanups.forEach((stop) => stop());
};
