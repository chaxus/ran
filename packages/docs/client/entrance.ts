import { observeEntry, prefersReducedMotion, rollText, spring, stagger } from 'ranuts/utils';

/** Settles in about half a second with a slight overshoot. */
const RISE = spring({ stiffness: 220, damping: 22 });

/** Groups whose icons rise as they arrive. Only the icons move: text and values never wait. */
const GROUPS = '.pillars, .bento';
const ICONS = '.pillar-icon, .caps-ico';

/**
 * A quiet entrance for the landing's decorative icons and its row of figures.
 *
 * Transform only, never opacity, so nothing is hidden at any moment and a failed script
 * leaves the page exactly as rendered. A group already on screen at load is left alone:
 * moving what the reader is already looking at reads as a glitch, not an arrival.
 */
export const mountEntrance = (): void => {
  if (prefersReducedMotion() || typeof Element.prototype.animate !== 'function') return;
  // WebKit runs module scripts before a pending stylesheet applies. Measured unstyled, the page
  // is far taller and every group reads as below the fold, so the ones on screen would move.
  const pending = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].filter(
    (link) => !link.sheet,
  );
  void Promise.all(
    pending.map(
      (link) =>
        new Promise((settle) => {
          link.addEventListener('load', settle, { once: true });
          link.addEventListener('error', settle, { once: true });
        }),
    ),
  ).then(arm);
};

const arm = (): void => {
  for (const group of document.querySelectorAll(GROUPS)) {
    if (group.getBoundingClientRect().top < window.innerHeight) continue;
    const icons = [...group.querySelectorAll<HTMLElement>(ICONS)];
    if (!icons.length) continue;
    observeEntry(group, {
      onEnter: ({ reduced }) => {
        if (reduced) return;
        icons.forEach((icon, index) =>
          icon.animate([{ transform: 'translateY(10px) scale(0.92)' }, { transform: 'none' }], {
            duration: RISE.duration * 1000,
            easing: RISE.easing,
            delay: stagger(index, icons.length, { each: 0.04 }) * 1000,
            fill: 'backwards',
          }),
        );
      },
    });
  }
  // The figures rise digit by digit; transform only, so each value reads correctly throughout.
  const stats = document.querySelector('.stats');
  if (stats && stats.getBoundingClientRect().top >= window.innerHeight) {
    observeEntry(stats, {
      onEnter: ({ reduced }) => {
        if (reduced) return;
        for (const num of stats.querySelectorAll<HTMLElement>('.stat-num'))
          rollText(num, num.textContent ?? '', { rise: true });
      },
    });
  }
};
