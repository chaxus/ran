import type { Host, HostListener, HostNode } from './host.ts';

type MemoryRecord = {
  kind: 'element' | 'text';
  type: string;
  namespace?: string;
  text: string;
  props: Map<string, unknown>;
  style: Record<string, string | number>;
  children: MemoryRecord[];
  parent: MemoryRecord | null;
  listeners: Map<string, Set<HostListener>>;
};

const asRecord = (node: HostNode): MemoryRecord => node as unknown as MemoryRecord;

/** In-memory host for contract tests and non-DOM environments. */
export const createMemoryHost = (): Host & { /** test helper */ debug(node: HostNode): MemoryRecord } => {
  const host: Host & { debug(node: HostNode): MemoryRecord } = {
    createElement(type, options) {
      const record: MemoryRecord = {
        kind: 'element',
        type,
        namespace: options?.namespace,
        text: '',
        props: new Map(),
        style: {},
        children: [],
        parent: null,
        listeners: new Map(),
      };
      return record as unknown as HostNode;
    },
    createText(value) {
      const record: MemoryRecord = {
        kind: 'text',
        type: '#text',
        text: value,
        props: new Map(),
        style: {},
        children: [],
        parent: null,
        listeners: new Map(),
      };
      return record as unknown as HostNode;
    },
    setText(node, value) {
      asRecord(node).text = value;
    },
    setProp(node, name, value) {
      const record = asRecord(node);
      if (value === null || value === undefined || value === false) record.props.delete(name);
      else record.props.set(name, value === true ? '' : value);
    },
    setStyle(node, style) {
      const record = asRecord(node);
      for (const [key, value] of Object.entries(style)) {
        if (value === null || value === undefined || value === '') delete record.style[key];
        else record.style[key] = value;
      }
    },
    insert(parent, child, before = null) {
      const parentRecord = asRecord(parent);
      const childRecord = asRecord(child);
      if (childRecord.parent) {
        const from = childRecord.parent.children;
        const index = from.indexOf(childRecord);
        if (index >= 0) from.splice(index, 1);
      }
      childRecord.parent = parentRecord;
      if (before) {
        const at = parentRecord.children.indexOf(asRecord(before));
        if (at < 0) throw new Error('insert: before node is not a child of parent');
        parentRecord.children.splice(at, 0, childRecord);
      } else {
        parentRecord.children.push(childRecord);
      }
    },
    remove(parent, child) {
      const parentRecord = asRecord(parent);
      const childRecord = asRecord(child);
      const index = parentRecord.children.indexOf(childRecord);
      if (index < 0) return;
      parentRecord.children.splice(index, 1);
      childRecord.parent = null;
    },
    addListener(node, type, handler) {
      const record = asRecord(node);
      let set = record.listeners.get(type);
      if (!set) {
        set = new Set();
        record.listeners.set(type, set);
      }
      set.add(handler);
      return () => {
        set!.delete(handler);
        if (set!.size === 0) record.listeners.delete(type);
      };
    },
    focus() {
      /* memory host has no focus target */
    },
    getBoundingClientRect() {
      return { x: 0, y: 0, width: 0, height: 0 };
    },
    debug(node) {
      return asRecord(node);
    },
  };
  return host;
};

/** Dispatch a synthetic event to memory-host listeners (tests). */
export const emitMemoryEvent = (node: HostNode, type: string, ...args: unknown[]): void => {
  const set = asRecord(node).listeners.get(type);
  if (!set) return;
  for (const handler of [...set]) handler(...args);
};
