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

/** How long the example pretends the server takes; long enough to see the busy state. */
const EXAMPLE_LATENCY = 900;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The home page's invite form: a real task in miniature, following the rules it links to.
 * Validation sits on the field; one activation sends once; success is shown only after the
 * "server" answers; a failure keeps every entry (the design guide's Interaction section). The request is simulated; nothing leaves the page.
 */
export const mountExample = (form: HTMLElement): void => {
  const email = form.querySelector<HTMLElement & { value: string }>('r-input[name="email"]');
  const role = form.querySelector<HTMLElement & { value: string }>('r-select[name="role"]');
  const simulate = form.querySelector<HTMLElement & { checked: boolean }>('r-checkbox[name="simulate"]');
  const submit = form.querySelector<HTMLElement>('.example__submit');
  const status = form.querySelector<HTMLElement>('.example__status');
  if (!email || !role || !submit || !status) return;
  const label = submit.textContent ?? '';
  let sending = false;

  const say = (text: string, tone: '' | 'success' | 'error'): void => {
    status.textContent = text;
    status.dataset.tone = tone;
  };
  const clearError = (): void => {
    if (email.getAttribute('status') !== 'error') return;
    email.removeAttribute('status');
    email.removeAttribute('message');
  };
  email.addEventListener('input', () => {
    clearError();
    if (status.dataset.tone) say('', '');
  });

  const send = (): void => {
    if (sending) return;
    const address = email.value.trim();
    if (!EMAIL.test(address)) {
      email.setAttribute('status', 'error');
      email.setAttribute('message', form.dataset.invalid ?? '');
      say('', '');
      email.focus();
      return;
    }
    sending = true;
    submit.setAttribute('disabled', '');
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = form.dataset.sending ?? label;
    say('', '');
    const fails = simulate?.checked === true;
    const roleName = role.querySelector(`r-option[value="${role.value}"]`)?.textContent ?? role.value;
    window.setTimeout(() => {
      sending = false;
      submit.removeAttribute('disabled');
      submit.removeAttribute('aria-busy');
      submit.textContent = label;
      if (fails) {
        say(form.dataset.failed ?? '', 'error');
        return;
      }
      say((form.dataset.sent ?? '').replace('{email}', address).replace('{role}', roleName), 'success');
      email.value = '';
    }, EXAMPLE_LATENCY);
  };
  submit.addEventListener('click', send);
  // Enter in the email field sends, as it would in a single-field form.
  email.addEventListener('keydown', (event) => {
    if ((event as KeyboardEvent).key === 'Enter' && !(event as KeyboardEvent).isComposing) send();
  });
};

const OPTIC_KEYS = ['blur', 'saturate', 'displace', 'bevel', 'dispersion', 'specular'] as const;

/** The material table, written into the markup at build time from ranui's own. */
type Materials = Record<string, Record<(typeof OPTIC_KEYS)[number], number>>;

const mountGlass = (): void => {
  const root = document.querySelector<HTMLElement>('[data-glass]');
  const glass = root?.querySelector<HTMLElement>('.gp-glass');
  const stage = root?.querySelector<HTMLElement>('.gp-stage');
  const scene = root?.querySelector<HTMLImageElement>('[data-scene]');
  if (!root || !glass || !stage || !scene) return;
  const GLASS_MATERIALS = JSON.parse(root.dataset.materials ?? '{}') as Materials;
  if (!GLASS_MATERIALS.regular) return;

  let x = 24;
  let y = 24;
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
  const control = (name: string): HTMLInputElement | HTMLSelectElement | null =>
    root.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-param="${name}"]`);
  const material = (): string => {
    const value = control('material')?.value ?? '';
    return Object.hasOwn(GLASS_MATERIALS, value) ? value : 'regular';
  };

  /** Writes a slider's value beside it and fills the field up to it. */
  const paint = (input: HTMLInputElement): void => {
    const min = Number(input.min);
    const fill = ((Number(input.value) - min) / (Number(input.max) - min)) * 100;
    input.parentElement?.style.setProperty('--fill', `${fill}%`);
    const out = input.parentElement?.querySelector('.gp-val');
    const text = `${input.value}${input.dataset.unit ?? ''}`;
    input.setAttribute('aria-valuetext', text);
    if (out) out.textContent = text;
  };

  /**
   * The element only carries what differs from its material, and so does the snippet: the
   * shortest markup that reproduces the stage is the one a reader should copy.
   */
  const sync = (): void => {
    const preset = GLASS_MATERIALS[material()]!;
    const attrs: string[] = [];
    if (material() === 'regular') glass.removeAttribute('material');
    else {
      glass.setAttribute('material', material());
      attrs.push(`material="${material()}"`);
    }
    for (const key of OPTIC_KEYS) {
      const value = control(key)?.value ?? '';
      if (Number(value) === preset[key]) glass.removeAttribute(key);
      else {
        glass.setAttribute(key, value);
        attrs.push(`${key}="${value}"`);
      }
    }
    const radius = control('radius')?.value ?? '';
    glass.setAttribute('radius', radius);
    attrs.push(`radius="${radius}"`);
    const tone = control('tone')?.value ?? 'auto';
    if (tone === 'auto') glass.removeAttribute('tone');
    else {
      glass.setAttribute('tone', tone);
      attrs.push(`tone="${tone}"`);
    }
    for (const box of root.querySelectorAll<HTMLInputElement>('[data-flag]')) {
      const flag = box.dataset.flag ?? '';
      glass.toggleAttribute(flag, box.checked);
      if (box.checked) attrs.push(flag);
    }
    const width = control('width')?.value ?? '';
    glass.style.width = `${width}px`;
    for (const input of root.querySelectorAll<HTMLInputElement>('input[type="range"]')) paint(input);
    move();
    if (codeEl) codeEl.textContent = `<r-glass ${[...attrs, `style="width:${width}px"`].join(' ')}>\n  …\n</r-glass>`;
  };

  /** Choosing a material moves every optical control to that material's value. */
  const applyMaterial = (): void => {
    const preset = GLASS_MATERIALS[material()]!;
    for (const key of OPTIC_KEYS) {
      const input = control(key);
      if (input) input.value = String(preset[key]);
    }
  };

  root.addEventListener('input', (event) => {
    if ((event.target as HTMLElement).dataset.param === 'material') applyMaterial();
    sync();
  });

  let uploaded = '';
  /** A scene tile's thumbnail is the full picture, so the stage reuses its URL. */
  const tileSource = (radio: HTMLInputElement): string => radio.parentElement?.querySelector('img')?.src ?? '';
  const showScene = (src: string): void => {
    if (!src) return;
    scene.src = src;
    if (uploaded && src !== uploaded) {
      URL.revokeObjectURL(uploaded);
      uploaded = '';
    }
  };
  root.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === 'gp-scene') showScene(tileSource(target));
    if (target.matches('[data-upload]') && target.files?.[0]) {
      const url = URL.createObjectURL(target.files[0]);
      showScene(url);
      uploaded = url;
      for (const radio of root.querySelectorAll<HTMLInputElement>('[name="gp-scene"]')) radio.checked = false;
      target.value = '';
    }
  });

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    for (const input of root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-param]')) {
      if (input instanceof HTMLSelectElement)
        input.selectedIndex = [...input.options].findIndex((o) => o.defaultSelected);
      else input.value = input.defaultValue;
    }
    for (const box of root.querySelectorAll<HTMLInputElement>('[data-flag]')) box.checked = false;
    const first = root.querySelector<HTMLInputElement>('[name="gp-scene"]');
    if (first) {
      first.checked = true;
      showScene(tileSource(first));
    }
    x = y = 24;
    sync();
  });

  const copy = root.querySelector<HTMLElement>('[data-copy-code]');
  if (copy) wireCopy(copy, () => codeEl?.textContent ?? '', copy.dataset.done);
  sync();
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
  for (const form of document.querySelectorAll<HTMLElement>('[data-home-example]')) mountExample(form);
  mountGlass();
  mountIconGallery();
};
