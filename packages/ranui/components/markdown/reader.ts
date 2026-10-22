/** Reconcile already-sanitized renderer output without replacing its reading viewport. */
export const hasReaderSelection = (element: Node): boolean => {
  const root = element.getRootNode() as ShadowRoot & { getSelection?(): Selection | null };
  const selection = root.getSelection?.() ?? element.ownerDocument?.getSelection();
  // WebKit can retarget a closed-root selection to collapsed document endpoints.
  // Ask for scoped endpoints before trusting the document's isCollapsed flag.
  const composed = selection as
    (Selection & { getComposedRanges?(options: { shadowRoots: ShadowRoot[] }): StaticRange[] }) | null | undefined;
  try {
    for (const selected of composed?.getComposedRanges?.({ shadowRoots: root instanceof ShadowRoot ? [root] : [] }) ??
      []) {
      if (selected.startContainer === selected.endContainer && selected.startOffset === selected.endOffset) continue;
      const range = element.ownerDocument!.createRange();
      range.setStart(selected.startContainer, selected.startOffset);
      range.setEnd(selected.endContainer, selected.endOffset);
      if (range.intersectsNode(element)) return true;
    }
  } catch {
    // Older engines may expose only the ordinary range/anchor APIs below.
  }
  if (selection && !selection.isCollapsed && selection.rangeCount) {
    try {
      if (selection.getRangeAt(0).intersectsNode(element)) return true;
    } catch {
      // The document and a closed root may expose different range trees.
    }
  }
  return (
    !!selection &&
    !selection.isCollapsed &&
    ((!!selection.anchorNode && element.contains(selection.anchorNode)) ||
      (!!selection.focusNode && element.contains(selection.focusNode)))
  );
};

const patchText = (current: Text, next: string): void => {
  const old = current.data;
  if (old === next) return;
  let prefix = 0;
  while (prefix < old.length && prefix < next.length && old[prefix] === next[prefix]) prefix++;
  let suffix = 0;
  while (
    suffix < old.length - prefix &&
    suffix < next.length - prefix &&
    old[old.length - suffix - 1] === next[next.length - suffix - 1]
  )
    suffix++;
  // Editing only the changed suffix preserves native Range offsets in the unchanged prefix.
  current.replaceData(prefix, old.length - prefix - suffix, next.slice(prefix, next.length - suffix));
};

export const syncReaderAttributes = (current: Element, next: Element): void => {
  for (const attribute of [...current.attributes])
    if (!next.hasAttribute(attribute.name)) current.removeAttribute(attribute.name);
  for (const attribute of [...next.attributes])
    if (current.getAttribute(attribute.name) !== attribute.value) current.setAttribute(attribute.name, attribute.value);
};

/** Both trees came from DOMPurify, our builder, or the existing trusted highlighter. */
export const reconcileReader = (current: Node, next: Node, selecting = false): void => {
  if (current.nodeType === Node.TEXT_NODE && next.nodeType === Node.TEXT_NODE) {
    patchText(current as Text, next.textContent ?? '');
    return;
  }
  if (current instanceof Element && next instanceof Element) {
    // An unchanged highlighted line need not lose its token nodes during a selected stream.
    if (selecting && current.classList.contains('line') && next.classList.contains('line')) {
      const old = current.textContent ?? '',
        value = next.textContent ?? '';
      if (old === value) return;
      if (value.startsWith(old)) {
        current.append(document.createTextNode(value.slice(old.length)));
        return;
      }
    }
    syncReaderAttributes(current, next);
  }
  let old = current.firstChild;
  for (const incoming of [...next.childNodes]) {
    if (
      old &&
      old.nodeType === incoming.nodeType &&
      (!(old instanceof Element) || (incoming instanceof Element && old.tagName === incoming.tagName))
    ) {
      const following = old.nextSibling;
      reconcileReader(old, incoming, selecting);
      old = following;
    } else {
      current.insertBefore(incoming, old);
    }
  }
  while (old) {
    const following = old.nextSibling;
    current.removeChild(old);
    old = following;
  }
};
