import { Div } from '@/utils/builder';

export interface MessageRenderOptions {
  top?: number | string;
  zIndex?: number | string;
  getContainer?: () => HTMLElement | null;
}

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
    host = Div()
      .attr(MESSAGE_HOST_ATTR, 'true')
      .children(Div().class('ranui-message').attr('aria-live', 'polite').attr('aria-atomic', 'false'))
      .build() as HTMLDivElement;
    mountEl.appendChild(host);
  }

  applyHostStyle(host, options);
  return host.querySelector<HTMLDivElement>('.ranui-message');
};
