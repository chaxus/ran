/**
 * Progressive enhancement for the three page-level demos.
 *
 * Every one of them renders and reads correctly with this file blocked: the home page is
 * complete markup, the glass element carries its default attributes, and the icon grid is
 * twenty real cells. The script adds clipboard and playground interactions.
 */

import { HTMLElementMock } from '@alixex/ranview/static';
import { playgroundCopy } from './playground-copy';
import { interactionCopy } from './copy';
import { announceCopy, copyText } from './copy';

/** Feedback changes only after a successful clipboard write. */
const wireCopy = (button: HTMLElement, text: string | (() => string), doneLabel?: string): void => {
  const label = button.querySelector('[data-copy-label], .copy-label');
  const originalLabel = label?.textContent ?? '';
  const originalText = doneLabel ? button.textContent : null;
  let timer: number | undefined;
  button.addEventListener('click', async () => {
    const success = await copyText(typeof text === 'function' ? text() : text);
    announceCopy(success);
    if (!success) {
      window.clearTimeout(timer);
      button.classList.remove('done');
      if (label) label.textContent = originalLabel;
      if (originalText !== null) button.textContent = originalText;
      return;
    }
    window.clearTimeout(timer);
    if (label) label.textContent = interactionCopy(document.documentElement.lang).copied;
    button.classList.add('done');
    if (doneLabel) button.textContent = doneLabel;
    timer = window.setTimeout(() => {
      button.classList.remove('done');
      if (label) label.textContent = originalLabel;
      if (originalText !== null) button.textContent = originalText;
    }, 1600);
  });
};

const mountHome = (): void => {
  const root = document.querySelector<HTMLElement>('.cine');
  if (!root || root.dataset.enhanced) return;
  root.dataset.enhanced = 'true';
  for (const button of root.querySelectorAll<HTMLElement>('[data-copy]')) wireCopy(button, button.dataset.copy ?? '');
  for (const button of root.querySelectorAll<HTMLElement>('[data-copy-snippet]')) {
    wireCopy(button, () => button.closest('.code-cell')?.querySelector('.snippet')?.textContent ?? '');
  }
  const palettes = [...root.querySelectorAll<HTMLButtonElement>('[data-preview-palette]')];
  palettes.forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      root.querySelector<HTMLElement>('[data-playground]')!.dataset.palette = button.dataset.previewPalette;
      palettes.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
  const search = root.querySelector<HTMLInputElement>('[data-catalog-search]');
  const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-catalog-filter]')];
  const entries = [...root.querySelectorAll<HTMLElement>('[data-catalog-entry]')];
  let library = 'all';
  const filterCatalogue = (): void => {
    const query = search?.value.trim().toLocaleLowerCase() ?? '';
    entries.forEach((entry) => {
      entry.hidden =
        (library !== 'all' && entry.dataset.library !== library) ||
        !(entry.dataset.catalogEntry ?? '').toLocaleLowerCase().includes(query);
    });
    for (const group of root.querySelectorAll<HTMLElement>('[data-catalog-group]')) {
      group.hidden = !entries.some((entry) => !entry.hidden && entry.dataset.library === group.dataset.catalogGroup);
    }
    const count = entries.filter((entry) => !entry.hidden).length;
    root.querySelector<HTMLElement>('[data-catalog-empty]')!.hidden = count !== 0;
  };
  if (search) {
    search.hidden = false;
    search.addEventListener('input', filterCatalogue);
    filters.forEach((button) => {
      button.hidden = false;
      button.addEventListener('click', () => {
        library = button.dataset.catalogFilter ?? 'all';
        filters.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        filterCatalogue();
      });
    });
  }
  const workbench = root.querySelector<HTMLElement>('[data-playground]');
  if (!workbench) return;
  const t = playgroundCopy(workbench.dataset.lang ?? 'en');
  const tabs = [...workbench.querySelectorAll<HTMLButtonElement>('[data-demo-tab]')];
  const panels = [...workbench.querySelectorAll<HTMLElement>('[data-demo-panel]')];
  const buttons = [...workbench.querySelectorAll<HTMLElement>('r-button')];
  const progress = workbench.querySelector<HTMLElement>('r-progress')!;
  const checkbox = workbench.querySelector<HTMLElement>('r-checkbox')!;
  const range = workbench.querySelector<HTMLInputElement>('[data-demo-percent]')!;
  const disabled = workbench.querySelector<HTMLInputElement>('[data-demo-disabled]')!;
  const code = workbench.querySelector<HTMLElement>('[data-demo-code] code')!;
  const doc = workbench.querySelector<HTMLAnchorElement>('[data-demo-doc]')!;
  const docBase = doc.getAttribute('href')!.replace(/button\/$/, '');
  let selected = 0;
  let checked = true;
  // Source nodes must never instantiate registered components or serialize their internals.
  const sourceNode = (tag: string, attrs: Record<string, string | undefined>, text = ''): string => {
    const node = new HTMLElementMock(tag);
    for (const [name, value] of Object.entries(attrs)) {
      if (value !== undefined) node.setAttribute(name, value);
    }
    node.textContent = text;
    return node.serialize();
  };
  const source = (): string => {
    if (selected === 1) return sourceNode('r-progress', { percent: range.value });
    if (selected === 2)
      return sourceNode('r-checkbox', { checked: checked ? '' : undefined }, checkbox.textContent ?? '');
    return buttons
      .map((button) =>
        sourceNode(
          'r-button',
          {
            type: button.getAttribute('type') || undefined,
            disabled: disabled.checked ? '' : undefined,
          },
          button.textContent ?? '',
        ),
      )
      .join('\n');
  };

  const sync = (): void => {
    code.textContent = source();
  };
  const select = (index: number, focus = false): void => {
    selected = index;
    tabs.forEach((tab, i) => {
      tab.tabIndex = i === index ? 0 : -1;
      tab.setAttribute('aria-selected', String(i === index));
      panels[i].hidden = i !== index;
    });
    doc.href = `${docBase}${['button', 'progress', 'checkbox'][index]}/`;
    sync();
    if (focus) tabs[index].focus();
  };
  const tablist = workbench.querySelector<HTMLElement>('.demo-tabs')!;
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', t.title);
  tabs.forEach((tab, index) => {
    tab.hidden = false;
    tab.id = `demo-tab-${tab.dataset.demoTab}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', (event) => {
      const rtl = document.documentElement.dir === 'rtl';
      let next: number | undefined;
      if (event.key === 'ArrowRight') next = (index + (rtl ? 2 : 1)) % 3;
      if (event.key === 'ArrowLeft') next = (index + (rtl ? 1 : 2)) % 3;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = 2;
      if (next !== undefined) {
        event.preventDefault();
        select(next, true);
      }
    });
  });
  range.addEventListener('input', () => {
    progress.setAttribute('percent', range.value);
    workbench.querySelector('[data-demo-value]')!.textContent = `${range.value}%`;
    sync();
  });
  disabled.addEventListener('change', () => {
    buttons.forEach((button) => button.toggleAttribute('disabled', disabled.checked));
    sync();
  });
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      if (!disabled.checked)
        workbench.querySelector('[data-demo-clicked]')!.textContent = t.clicked.replace(
          '{label}',
          button.textContent ?? '',
        );
    }),
  );
  checkbox.addEventListener('change', (event) => {
    const detail = (event as CustomEvent<{ checked?: boolean }>).detail;
    checked =
      typeof detail?.checked === 'boolean'
        ? detail.checked
        : checkbox.getAttribute('checked') !== 'false' && checkbox.hasAttribute('checked');
    workbench.querySelector('[data-demo-selection]')!.textContent = checked ? t.selected : t.unselected;
    sync();
  });
  workbench.querySelector('[data-demo-reset]')!.addEventListener('click', () => {
    if (selected === 0) {
      disabled.checked = false;
      buttons.forEach((button) => button.removeAttribute('disabled'));
      workbench.querySelector('[data-demo-clicked]')!.textContent = '';
    } else if (selected === 1) {
      range.value = range.defaultValue;
      progress.setAttribute('percent', range.value);
      workbench.querySelector('[data-demo-value]')!.textContent = `${range.value}%`;
    } else {
      checked = true;
      checkbox.setAttribute('checked', 'true');
      workbench.querySelector('[data-demo-selection]')!.textContent = t.selected;
    }
    sync();
  });
  wireCopy(workbench.querySelector<HTMLElement>('[data-demo-copy]')!, source);
  workbench.dataset.enhanced = 'true';
  select(0);
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
