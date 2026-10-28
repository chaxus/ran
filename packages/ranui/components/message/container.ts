import { createRef, Div } from '@/utils/builder';

export interface MessageRenderOptions {
  top?: number | string;
  zIndex?: number | string;
  getContainer?: () => HTMLElement | null;
  /**
   * Piles the container's toasts in one place, newest in front, the older ones peeking out
   * below it; pointing at the pile or moving focus into it fans them out. Like `top`, each
   * call sets it for the whole container, and leaving it out turns it off.
   */
  stacked?: boolean;
}

/** How far each older toast peeks out below the one in front of it, in px. */
const PEEK = 10;
/** How much smaller each older toast is drawn. */
const SHRINK = 0.05;
/** Older toasts beyond this many behind the front one are hidden until the pile fans out. */
const VISIBLE_BEHIND = 2;

/**
 * Places every toast of a stacked container: collapsed, each one behind the newest moves
 * down by {@link PEEK} and shrinks; fanned out, each sits below the ones in front of it at
 * their measured heights. A container that is not stacked has its toasts' placement cleared.
 */
export const restack = (list: HTMLElement): void => {
  const stacked = list.hasAttribute('data-stacked');
  const open = list.hasAttribute('data-expanded');
  const toasts = [...list.children] as HTMLElement[];
  let offset = 0;
  toasts.reverse().forEach((toast, depth) => {
    if (!stacked) {
      toast.removeAttribute('data-stack');
      toast.removeAttribute('data-buried');
      toast.style.removeProperty('--ran-message-stack-offset');
      toast.style.removeProperty('--ran-message-stack-scale');
      return;
    }
    toast.setAttribute('data-stack', '');
    toast.toggleAttribute('data-buried', !open && depth > VISIBLE_BEHIND);
    toast.style.setProperty('--ran-message-stack-offset', `${open ? offset : depth * PEEK}px`);
    toast.style.setProperty('--ran-message-stack-scale', String(open ? 1 : 1 - depth * SHRINK));
    offset += toast.offsetHeight;
  });
};

/**
 * How long the pile stays fanned out after the pointer leaves it. Only the cards take the
 * pointer, so moving from one card to the next crosses the padding between them.
 */
const CLOSE_DELAY = 200;

/** Fans the pile out while the pointer or the focus is inside it. */
const listenForExpand = (list: HTMLElement): void => {
  let closing: ReturnType<typeof setTimeout> | undefined;
  const set = (open: boolean) => {
    clearTimeout(closing);
    if (list.hasAttribute('data-expanded') === open) return;
    list.toggleAttribute('data-expanded', open);
    restack(list);
  };
  list.addEventListener('pointerenter', () => set(true));
  list.addEventListener('pointerleave', () => {
    if (list.contains(document.activeElement)) return;
    clearTimeout(closing);
    closing = setTimeout(() => set(false), CLOSE_DELAY);
  });
  list.addEventListener('focusin', () => set(true));
  list.addEventListener('focusout', (event) => set(list.contains(event.relatedTarget as Node | null)));
};

const MESSAGE_HOST_ATTR = 'data-ranui-message-host';

export const getMessageHostSelector = (): string => `[${MESSAGE_HOST_ATTR}="true"]`;

export const applyHostStyle = (host: HTMLElement, options?: MessageRenderOptions): void => {
  const top = options?.top ?? 8;
  // Toasts sit at the top of the overlay ladder (see --ran-z-message).
  const zIndex = options?.zIndex ?? 1200;
  host.style.setProperty('position', 'fixed');
  host.style.setProperty('top', typeof top === 'number' ? `${top}px` : String(top));
  host.style.setProperty('left', '0');
  host.style.setProperty('width', '100%');
  host.style.setProperty('z-index', String(zIndex));
  host.style.setProperty('pointer-events', 'none');
};

const resolveMountElement = (options?: MessageRenderOptions): HTMLElement | null => {
  if (typeof document === 'undefined') return null;
  return options?.getContainer?.() || document.body;
};

export const getMessageContainer = (options?: MessageRenderOptions): HTMLDivElement | null => {
  if (typeof document === 'undefined') return null;
  const mountEl = resolveMountElement(options) || document.body;

  let host = mountEl.querySelector<HTMLElement>(getMessageHostSelector());
  if (!host) {
    // The message stack is a persistent polite live region: it exists in the DOM
    // before any toast is added, so screen readers announce each appended toast.
    // `aria-atomic="false"` announces only the newly added toast (not the whole
    // stack); error/warning toasts escalate to assertive via role="alert" on the
    // individual `<r-message>` (see index.ts). Without this, toasts were silent.
    const list = createRef<HTMLDivElement>();
    host = Div()
      .attr(MESSAGE_HOST_ATTR, 'true')
      .children(Div().class('ranui-message').ref(list).attr('aria-live', 'polite').attr('aria-atomic', 'false'))
      .build() as HTMLDivElement;
    mountEl.appendChild(host);
    listenForExpand(list.current!);
  }

  applyHostStyle(host, options);
  const list = host.querySelector<HTMLDivElement>('.ranui-message');
  const stacked = options?.stacked ?? false;
  if (list && list.hasAttribute('data-stacked') !== stacked) {
    list.toggleAttribute('data-stacked', stacked);
    // One grid cell that every toast occupies, so the pile takes the height of its tallest.
    if (stacked) list.style.setProperty('display', 'grid');
    else list.style.removeProperty('display');
    restack(list);
  }
  return list;
};
