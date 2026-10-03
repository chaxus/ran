/** Register only page components, including examples inserted after initial load. */
const loaders: Record<string, () => Promise<unknown>> = {
  'r-attachments': () => import('ranui/attachments'),
  'r-button': () => import('ranui/button'),
  'r-card': () => import('ranui/card'),
  'r-checkbox': () => import('ranui/checkbox'),
  'r-colorpicker': () => import('ranui/colorpicker'),
  'r-conversation': () => import('ranui/conversation'),
  'r-disclosure-row': () => import('ranui/disclosure-row'),
  'r-dropdown': () => import('ranui/dropdown'),
  'r-glass': () => import('ranui/glass'),
  'r-icon': () => import('ranui/icon'),
  'r-img': () => import('ranui/image'),
  'r-input': () => import('ranui/input'),
  'r-link': () => import('ranui/link'),
  'r-loading': () => import('ranui/loading'),
  'r-markdown': () => import('ranui/markdown'),
  'r-math': () => import('ranui/math'),
  'r-mermaid': () => import('ranui/mermaid'),
  'r-message': () => import('ranui/message'),
  'r-modal': () => import('ranui/modal'),
  'r-player': () => import('ranui/player'),
  'r-popover': () => import('ranui/popover'),
  'r-progress': () => import('ranui/progress'),
  'r-radar': () => import('ranui/radar'),
  'r-reasoning': () => import('ranui/reasoning'),
  'r-route': () => import('ranui/route'),
  'r-router': () => import('ranui/router'),
  'r-scratch': () => import('ranui/scratch'),
  'r-section': () => import('ranui/section'),
  'r-select': () => import('ranui/select'),
  'r-skeleton': () => import('ranui/skeleton'),
  'r-state-dot': () => import('ranui/state-dot'),
  'r-tabs': () => import('ranui/tab'),
  'r-tab': () => import('ranui/tabpane'),
  'r-theme-switch': () => import('ranui/theme-switch'),
  'r-token-meter': () => import('ranui/token-meter'),
  'r-tool-card': () => import('ranui/tool-card'),
  'r-voice-button': () => import('ranui/voice-button'),
  'r-preview': () => import('@ranui/preview'),
};
const selector = Object.keys(loaders).join(',');

export const mountComponents = (): (() => void) => {
  const pending = new Set<string>();
  const load = (element: Element): void => {
    const tag = element.localName;
    if (!loaders[tag] || pending.has(tag) || customElements.get(tag)) return;
    pending.add(tag);
    void loaders[tag]().catch((error: unknown) => {
      pending.delete(tag);
      console.error(`Failed to load ${tag}`, error);
    });
  };
  const scan = (root: ParentNode): void => {
    if (root instanceof Element) load(root);
    root.querySelectorAll(selector).forEach(load);
  };
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  scan(document);
  return () => observer.disconnect();
};
