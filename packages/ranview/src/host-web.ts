import type { Host, HostNode } from './host.ts';

const asElement = (node: HostNode): Node => node as unknown as Node;

/**
 * DOM-backed host. Pass an explicit `Document` in tests; defaults to global
 * `document` in the browser. Throws when no document is available — SSR
 * snapshots keep using `@alixex/ranview/static` / mocks, not this host.
 */
export const createWebHost = (doc: Document | null = globalThis.document ?? null): Host => {
  if (doc == null) throw new Error('createWebHost requires a Document');

  return {
    createElement(type) {
      return doc.createElement(type) as unknown as HostNode;
    },
    createText(value) {
      return doc.createTextNode(value) as unknown as HostNode;
    },
    setText(node, value) {
      const el = asElement(node);
      if (el.nodeType === doc.TEXT_NODE || el.nodeType === doc.COMMENT_NODE) el.textContent = value;
      else (el as HTMLElement).textContent = value;
    },
    setProp(node, name, value) {
      const el = asElement(node) as HTMLElement;
      if (name === 'class' || name === 'className') {
        el.className = value == null || value === false ? '' : String(value);
        return;
      }
      if (value === null || value === undefined || value === false) {
        el.removeAttribute(name);
        return;
      }
      if (value === true) {
        el.setAttribute(name, '');
        return;
      }
      el.setAttribute(name, String(value));
    },
    setStyle(node, style) {
      const el = asElement(node) as HTMLElement;
      for (const [key, value] of Object.entries(style)) {
        if (value === null || value === undefined || value === '') {
          el.style.removeProperty(key);
        } else {
          el.style.setProperty(key, String(value));
        }
      }
    },
    insert(parent, child, before = null) {
      asElement(parent).insertBefore(asElement(child), before ? asElement(before) : null);
    },
    remove(parent, child) {
      const parentNode = asElement(parent);
      const childNode = asElement(child);
      if (childNode.parentNode === parentNode) parentNode.removeChild(childNode);
    },
    addListener(node, type, handler) {
      const el = asElement(node);
      const listener = handler as EventListener;
      el.addEventListener(type, listener);
      return () => el.removeEventListener(type, listener);
    },
    focus(node) {
      const el = asElement(node) as HTMLElement;
      el.focus?.();
    },
    getBoundingClientRect(node) {
      const el = asElement(node) as HTMLElement;
      if (typeof el.getBoundingClientRect !== 'function') return { x: 0, y: 0, width: 0, height: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    },
  };
};
