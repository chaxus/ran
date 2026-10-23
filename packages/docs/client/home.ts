/**
 * Progressive enhancement for the three page-level demos.
 *
 * Every one of them renders and reads correctly with this file blocked: the home page is
 * complete markup, the glass element carries its default attributes, and the icon grid is
 * twenty real cells. What is added here is motion and interaction, in that order of
 * dismissability.
 */

import { announceCopy, copyText } from './copy';

/** Feedback changes only after a successful clipboard write. */
const wireCopy = (button: HTMLElement, text: string | (() => string), doneLabel?: string): void => {
  const restore = doneLabel ? button.textContent : null;
  let timer: number | undefined;
  let pending = false;
  button.addEventListener('click', async () => {
    if (pending) return;
    pending = true;
    const success = await copyText(typeof text === 'function' ? text() : text);
    pending = false;
    announceCopy(success);
    if (!success) return;
    window.clearTimeout(timer);
    button.classList.add('done');
    if (doneLabel) button.textContent = doneLabel;
    timer = window.setTimeout(() => {
      button.classList.remove('done');
      if (restore !== null) button.textContent = restore;
    }, 1600);
  });
};

const mountHome = (): void => {
  const root = document.querySelector<HTMLElement>('.cine');
  if (!root) return;

  for (const button of root.querySelectorAll<HTMLElement>('[data-copy]')) {
    wireCopy(button, button.dataset.copy ?? '');
  }
};

const mountGlass = (): void => {
  const root = document.querySelector<HTMLElement>('[data-glass]');
  const glass = root?.querySelector<HTMLElement>('.gp-glass');
  const stage = root?.querySelector<HTMLElement>('.gp-stage');
  if (!root || !glass || !stage) return;

  let x = 0;
  let y = 0;
  let drag: { pointer: number; x: number; y: number } | undefined;
  const move = (nextX = x, nextY = y): void => {
    x = Math.max(0, Math.min(nextX, stage.clientWidth - glass.offsetWidth));
    y = Math.max(0, Math.min(nextY, stage.clientHeight - glass.offsetHeight));
    glass.style.left = `${x}px`;
    glass.style.top = `${y}px`;
  };
  glass.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || drag) return;
    drag = { pointer: event.pointerId, x: event.clientX - x, y: event.clientY - y };
    glass.setPointerCapture(event.pointerId);
    stage.focus({ preventScroll: true });
  });
  glass.addEventListener('pointermove', (event) => {
    if (drag?.pointer === event.pointerId) move(event.clientX - drag.x, event.clientY - drag.y);
  });
  const endDrag = (event: PointerEvent): void => {
    if (drag?.pointer !== event.pointerId) return;
    drag = undefined;
  };
  glass.addEventListener('pointerup', endDrag);
  glass.addEventListener('pointercancel', endDrag);
  glass.addEventListener('lostpointercapture', endDrag);
  stage.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 50 : 10;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const offset = delta[event.key];
    if (!offset) return;
    event.preventDefault();
    move(x + offset[0], y + offset[1]);
  });
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => move());
    observer.observe(stage);
    observer.observe(glass);
  } else window.addEventListener('resize', () => move());

  const codeEl = root.querySelector('.gp-code code');
  const read = (param: string): string => root.querySelector<HTMLInputElement>(`[data-param="${param}"]`)?.value ?? '';

  const sync = (): void => {
    for (const input of root.querySelectorAll<HTMLInputElement>('[data-param]')) {
      const param = input.dataset.param ?? '';
      const unit = input.dataset.unit ?? '';
      // `width` is geometry, not a component attribute — it sizes the host.
      if (param === 'width') glass.style.width = `${input.value}px`;
      else glass.setAttribute(param, input.value);
      const out = input.parentElement?.querySelector('.gp-val');
      if (out) out.textContent = `${input.value}${unit}`;
    }
    for (const box of root.querySelectorAll<HTMLInputElement>('[data-flag]')) {
      glass.toggleAttribute(box.dataset.flag ?? '', box.checked);
    }
    move();
    if (codeEl) {
      codeEl.textContent =
        `<r-glass blur="${read('blur')}" saturate="${read('saturate')}" ` +
        `displace="${read('displace')}" radius="${read('radius')}" style="width:${read('width')}px"` +
        `${glass.hasAttribute('sheen') ? ' sheen' : ''}${glass.hasAttribute('interactive') ? ' interactive' : ''}>\n  …\n</r-glass>`;
    }
  };

  root.addEventListener('input', sync);
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    for (const input of root.querySelectorAll<HTMLInputElement>('[data-param]')) {
      input.value = input.defaultValue;
    }
    for (const box of root.querySelectorAll<HTMLInputElement>('[data-flag]')) box.checked = false;
    x = y = 0;
    sync();
  });

  const copy = root.querySelector<HTMLElement>('[data-copy-code]');
  if (copy) wireCopy(copy, () => codeEl?.textContent ?? '', copy.dataset.done);
};

const mountIconGallery = (): void => {
  const grid = document.querySelector<HTMLElement>('[data-icon-gallery]');
  if (!grid) return;
  const copiedLabel = grid.dataset.copied ?? 'Copied';
  grid.addEventListener('click', async (event) => {
    const cell = (event.target as Element | null)?.closest<HTMLElement>('.icon-cell');
    if (!cell) return;
    const name = cell.dataset.icon ?? '';
    const label = cell.querySelector('.icon-cell__name');
    const success = await copyText(`<r-icon name="${name}"></r-icon>`);
    announceCopy(success);
    if (!success) return;
    cell.classList.add('is-copied');
    if (label) label.textContent = copiedLabel;
    window.setTimeout(() => {
      cell.classList.remove('is-copied');
      if (label) label.textContent = name;
    }, 1200);
  });
};

export const mountDemos = (): void => {
  mountHome();
  mountGlass();
  mountIconGallery();
};
