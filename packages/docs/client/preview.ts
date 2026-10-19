/** Own only the Blob URLs created by the documentation's file chooser. */
export const mountPreviewDemo = (): (() => void) => {
  if (!document.querySelector('[data-preview-upload]')) return () => {};
  const sources = new Map<HTMLElement, string>();
  const release = (preview: HTMLElement, url: string): void => {
    URL.revokeObjectURL(url);
    sources.delete(preview);
  };
  const observer = new MutationObserver(() => {
    for (const [preview, url] of sources) {
      if (!preview.isConnected || preview.getAttribute('src') !== url) release(preview, url);
    }
  });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
  const chooseFile = (event: MouseEvent): void => {
    const button = event.target instanceof Element ? event.target.closest('[data-preview-upload]') : null;
    const preview = document.getElementById(button?.getAttribute('data-preview-upload') ?? '');
    if (!preview) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.docx,.pptx,.pdf,.xlsx,.xls';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file || !preview.isConnected) return;
      const previous = sources.get(preview);
      if (previous) release(preview, previous);
      const url = URL.createObjectURL(file);
      sources.set(preview, url);
      // Attributes also work before the page's lazy component registration completes.
      preview.setAttribute('src', url);
    };
    input.click();
  };
  const stop = (): void => {
    document.removeEventListener('click', chooseFile);
    window.removeEventListener('pagehide', pagehide);
    observer.disconnect();
    for (const [preview, url] of sources) release(preview, url);
  };
  const pagehide = (event: PageTransitionEvent): void => {
    if (!event.persisted) stop();
  };
  document.addEventListener('click', chooseFile);
  window.addEventListener('pagehide', pagehide);
  return stop;
};
