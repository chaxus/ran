import { announceCopy, copyText, interactionCopy } from './copy';
import { ButtonBuilder } from '@alixex/ranview/static';

export const mountCodeCopy = (): void => {
  const text = interactionCopy(document.documentElement.lang);
  for (const figure of document.querySelectorAll<HTMLElement>('.prose figure.code')) {
    const code = figure.querySelector('pre code');
    if (!code || figure.querySelector('.code-copy')) continue;
    const button = ButtonBuilder().attrs({ type: 'button', class: 'code-copy' }).text(text.copy).build();
    figure.appendChild(button);
    let timer: number | undefined;
    button.addEventListener('click', async () => {
      window.clearTimeout(timer);
      button.disabled = true;
      const success = await copyText(code.textContent ?? '');
      button.disabled = false;
      button.classList.toggle('done', success);
      button.textContent = success ? text.copied : text.copy;
      announceCopy(success);
      timer = window.setTimeout(() => {
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
    trigger.tabIndex = 0;
    trigger.setAttribute('role', 'button');
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
      sync();
      if (toggle.checked && narrow.matches) sidebar.querySelector<HTMLElement>('a, summary')?.focus();
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
        (el) => el === trigger || el.getClientRects().length,
      );
      const at = targets.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && at <= 0) {
        event.preventDefault();
        targets.at(-1)?.focus();
      } else if (!event.shiftKey && (at === targets.length - 1 || at === -1)) {
        event.preventDefault();
        trigger.focus();
      }
    });
    narrow.addEventListener('change', () => {
      toggle.checked = false;
      sync();
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
