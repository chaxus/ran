/**
 * Progressive enhancement for the three page-level demos.
 *
 * Every one of them renders and reads correctly with this file blocked: the home page is
 * complete markup, the glass element carries its default attributes, and the icon grid is
 * twenty real cells. The script adds clipboard and playground interactions.
 */

import { announceCopy, copyText } from './copy';

/** Feedback changes only after a successful clipboard write. */
const wireCopy = (button: HTMLElement, text: string | (() => string), doneLabel?: string): void => {
  button.addEventListener('click', async () => {
    const success = await copyText(typeof text === 'function' ? text() : text);
    announceCopy(success);
    if (!success) return;
    const restore = doneLabel ? button.textContent : null;
    button.classList.add('done');
    if (doneLabel) button.textContent = doneLabel;
    window.setTimeout(() => {
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
  if (!root || !glass) return;

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
    if (codeEl) {
      codeEl.textContent =
        `<r-glass blur="${read('blur')}" saturate="${read('saturate')}" ` +
        `displace="${read('displace')}" radius="${read('radius')}">\n  …\n</r-glass>`;
    }
  };

  root.addEventListener('input', sync);
  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    for (const input of root.querySelectorAll<HTMLInputElement>('[data-param]')) {
      input.value = input.defaultValue;
    }
    for (const box of root.querySelectorAll<HTMLInputElement>('[data-flag]')) box.checked = false;
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

/**
 * Hand the markdown samples to `<r-markdown>`.
 *
 * The source is URI-encoded in `data-content` rather than written into `content`
 * directly, because these samples contain fenced code blocks and blank lines — either
 * would end the surrounding HTML block in the markdown file, and the sample would be
 * parsed as part of the page instead of reaching the component.
 *
 * Needing script here costs nothing that was not already lost: `<r-markdown>` renders in
 * the browser, so a reader without JavaScript sees no demo either way.
 */
const mountMarkdownDemos = (): void => {
  for (const el of document.querySelectorAll<HTMLElement>('r-markdown[data-content]')) {
    const encoded = el.dataset.content ?? '';
    try {
      (el as HTMLElement & { content: string }).content = decodeURIComponent(encoded);
    } catch {
      // Malformed input would throw and take the rest of the page's setup with it.
    }
  }
};

export const mountDemos = (): void => {
  mountMarkdownDemos();
  mountHome();
  mountGlass();
  mountIconGallery();
};
