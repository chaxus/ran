import { announceCopy, copyText, interactionCopy } from './copy';

export const mountCodeCopy = (): void => {
  const text = interactionCopy(document.documentElement.lang);
  for (const figure of document.querySelectorAll<HTMLElement>('.prose figure.code')) {
    const code = figure.querySelector('pre code');
    if (!code || figure.querySelector('.code-copy')) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = text.copy;
    figure.appendChild(button);
    const status = document.createElement('p');
    status.className = 'code-copy__status';
    status.setAttribute('role', 'status');
    figure.appendChild(status);
    let pending = false;
    let resetTimer: number | undefined;
    button.addEventListener('click', async () => {
      if (pending) return;
      pending = true;
      window.clearTimeout(resetTimer);
      button.style.minInlineSize = `${Math.max(button.getBoundingClientRect().width, parseFloat(button.style.minInlineSize) || 0)}px`;
      button.setAttribute('aria-disabled', 'true');
      status.textContent = '';
      const success = await copyText(code.textContent ?? '');
      pending = false;
      button.removeAttribute('aria-disabled');
      button.classList.toggle('done', success);
      button.textContent = success ? text.copied : text.copy;
      if (success) announceCopy(true);
      else status.textContent = text.copyFailed;
      resetTimer = window.setTimeout(() => {
        button.classList.remove('done');
        button.textContent = text.copy;
      }, 1600);
    });
  }
};

export const mountNavigation = (): void => {
  const toggle = document.querySelector<HTMLInputElement>('#drawer');
  const trigger = document.querySelector<HTMLElement>('.drawer__button');
  const sidebar = document.querySelector<HTMLElement>('.sidebar');
  if (toggle && trigger && sidebar) {
    const narrow = window.matchMedia('(max-width: 899px)');
    toggle.tabIndex = -1;
    toggle.setAttribute('aria-hidden', 'true');
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
    let focused: Element | null = document.activeElement;
    document.addEventListener('focusin', (event) => {
      focused = event.target instanceof Element ? event.target : null;
    });
    document.addEventListener('pointerdown', (event) => {
      if (!sidebar.contains(event.target as Node)) focused = null;
    });
    const background = [...document.querySelectorAll<HTMLElement>('#main, .toc')];
    const sync = (): void => {
      const open = narrow.matches && toggle.checked;
      trigger.setAttribute('aria-expanded', String(open));
      sidebar.inert = narrow.matches && !open;
      for (const item of background) item.inert = open;
      document.body.classList.toggle('drawer-open', open);
    };
    const close = (restore = true): void => {
      toggle.checked = false;
      sync();
      if (restore) trigger.focus();
    };
    toggle.addEventListener('change', () => {
      const restore = narrow.matches && !toggle.checked;
      sync();
      if (toggle.checked && narrow.matches) sidebar.querySelector<HTMLElement>('a, summary')?.focus();
      else if (restore) trigger.focus();
    });
    trigger.addEventListener('click', (event) => {
      // Retain the native checkbox fallback until enhancement, then prevent label
      // activation from focusing the hidden checkbox after our change handler.
      event.preventDefault();
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event('change'));
    });
    document.querySelector('.drawer__scrim')?.addEventListener('click', (event) => {
      event.preventDefault();
      close();
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggle.checked = !toggle.checked;
      toggle.dispatchEvent(new Event('change'));
    });
    sidebar.addEventListener('click', (event) => {
      if ((event.target as Element)?.closest('a')) close(false);
    });
    document.addEventListener('keydown', (event) => {
      if (!narrow.matches || !toggle.checked) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const targets = [trigger, ...sidebar.querySelectorAll<HTMLElement>('a, summary, button, [tabindex="0"]')].filter(
        (el) => el === trigger || (el.checkVisibility?.() ?? el.getClientRects().length > 0),
      );
      const at = targets.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next =
        at === -1
          ? event.shiftKey
            ? targets.length - 1
            : 0
          : (at + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
      targets[next]?.focus();
    });
    narrow.addEventListener('change', () => {
      // Responsive visibility can clear native focus before this callback runs.
      const active = document.activeElement === document.body ? focused : document.activeElement;
      const restore = narrow.matches && sidebar.contains(active);
      toggle.checked = false;
      sync();
      if (restore) trigger.focus();
    });
    sync();
  }
  document.querySelector('.mobile-toc')?.addEventListener('click', (event) => {
    if ((event.target as Element)?.closest('a')) (event.currentTarget as HTMLDetailsElement).open = false;
  });
  for (const menu of document.querySelectorAll<HTMLDetailsElement>('.langs, .mobile-toc')) {
    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target as Node)) menu.open = false;
    });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    });
  }
};
