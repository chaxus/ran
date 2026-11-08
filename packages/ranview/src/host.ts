/**
 * Platform-agnostic tree host. Web uses DOM; later hosts (e.g. chaxus/nsh) map
 * the same operations onto native / GPUI / terminal backends.
 *
 * @see docs/superpowers/specs/2026-11-08-ranview-cross-platform-nsh-design.md
 */

/** Opaque node handle — never assume `HTMLElement` outside a concrete host. */
export type HostNode = { readonly __brand: 'HostNode' };

export type HostListener = (...args: unknown[]) => void;

export interface Host {
  createElement(type: string): HostNode;
  createText(value: string): HostNode;
  setText(node: HostNode, value: string): void;
  setProp(node: HostNode, name: string, value: unknown): void;
  setStyle?(node: HostNode, style: Record<string, string | number | null | undefined>): void;
  insert(parent: HostNode, child: HostNode, before?: HostNode | null): void;
  remove(parent: HostNode, child: HostNode): void;
  addListener(node: HostNode, type: string, handler: HostListener): () => void;
  focus?(node: HostNode): void;
  getBoundingClientRect?(node: HostNode): { x: number; y: number; width: number; height: number };
}
