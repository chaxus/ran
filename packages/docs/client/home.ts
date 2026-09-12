/**
 * Progressive enhancement for the three page-level demos.
 *
 * Every one of them renders and reads correctly with this file blocked: the home page is
 * complete markup, the glass element carries its default attributes, and the icon grid is
 * twenty real cells. What is added here is motion and interaction, in that order of
 * dismissability.
 */

/** Copy to clipboard, with the button saying what happened. */
const wireCopy = (button: HTMLElement, text: string, doneLabel?: string): void => {
  button.addEventListener('click', () => {
    const restore = doneLabel ? button.textContent : null;
    void navigator.clipboard
      ?.writeText?.(text)
      .catch(() => {
        /* A denied clipboard permission is the reader's choice, not an error to shout
           about — the button still reports, it just reports the same way. */
      })
      .finally(() => {
        button.classList.add('done');
        if (doneLabel) button.textContent = doneLabel;
        window.setTimeout(() => {
          button.classList.remove('done');
          if (restore !== null) button.textContent = restore;
        }, 1600);
      });
  });
};

const mountHome = (): void => {
  const root = document.querySelector<HTMLElement>('.cine');
  if (!root) return;

  for (const button of root.querySelectorAll<HTMLElement>('[data-copy]')) {
    wireCopy(button, button.dataset.copy ?? '');
  }

  // A subtle 3D tilt that follows the pointer across a card.
  for (const card of root.querySelectorAll<HTMLElement>('[data-tilt]')) {
    card.addEventListener('pointermove', (event) => {
      const r = card.getBoundingClientRect();
      const mx = event.clientX - r.left;
      const my = event.clientY - r.top;
      card.style.setProperty('--mx', `${mx}px`);
      card.style.setProperty('--my', `${my}px`);
      card.style.setProperty('--rx', `${((my / r.height) * 2 - 1) * -3}deg`);
      card.style.setProperty('--ry', `${((mx / r.width) * 2 - 1) * 3}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  const reveals = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    // Reduced motion means the end state, immediately — not "no animation, and also
    // never visible", which is what skipping the observer would have produced.
    for (const el of reveals) el.classList.add('in');
    return;
  }

  /** Count a numeric stat up from zero. Non-numeric values ("MIT") are left alone. */
  const countUp = (el: HTMLElement): void => {
    const match = /^(\d+)(.*)$/.exec(el.textContent ?? '');
    if (!match) return;
    const target = Number(match[1]);
    const suffix = match[2];
    const duration = 1100;
    let start = 0;
    const tick = (now: number): void => {
      start ||= now;
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        if (entry.target.classList.contains('stats')) {
          entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
        }
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );
  for (const el of reveals) observer.observe(el);
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
  if (copy) {
    copy.addEventListener('click', () => {
      void navigator.clipboard?.writeText?.(codeEl?.textContent ?? '').catch(() => {});
      const done = copy.dataset.done ?? '';
      const label = copy.dataset.label ?? '';
      copy.textContent = done;
      copy.classList.add('done');
      window.setTimeout(() => {
        copy.textContent = label;
        copy.classList.remove('done');
      }, 1600);
    });
  }
};

const mountIconGallery = (): void => {
  const grid = document.querySelector<HTMLElement>('[data-icon-gallery]');
  if (!grid) return;
  const copiedLabel = grid.dataset.copied ?? 'Copied';
  grid.addEventListener('click', (event) => {
    const cell = (event.target as Element | null)?.closest<HTMLElement>('.icon-cell');
    if (!cell) return;
    const name = cell.dataset.icon ?? '';
    const label = cell.querySelector('.icon-cell__name');
    void navigator.clipboard?.writeText?.(`<r-icon name="${name}"></r-icon>`).catch(() => {});
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
