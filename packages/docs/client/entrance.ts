import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts/utils';

/** Settles in about half a second with a slight overshoot. */
const RISE = spring({ stiffness: 220, damping: 22 });

/** Groups whose icons rise as they arrive. Only the icons move: text and values never wait. */
const GROUPS = '.pillars, .bento';
const ICONS = '.pillar-icon, .caps-ico';

/**
 * A quiet entrance for the landing's decorative icons.
 *
 * Transform only, never opacity, so nothing is hidden at any moment and a failed script
 * leaves the page exactly as rendered. A group already on screen at load is left alone:
 * moving what the reader is already looking at reads as a glitch, not an arrival.
 */
export const mountEntrance = (): void => {
  if (prefersReducedMotion() || typeof Element.prototype.animate !== 'function') return;
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
};
