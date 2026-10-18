/** Fill the first visit's asset-cache gap without prefetching unvisited content. */
export const cacheVisitedAssets = (): void => {
  if (
    !('serviceWorker' in navigator) ||
    navigator.serviceWorker.controller ||
    typeof PerformanceObserver === 'undefined'
  )
    return;
  const worker = navigator.serviceWorker;
  const seen = new Set<string>();
  const pending: string[] = [];
  let active = 0;
  let stopped = false;
  const drain = (): void => {
    if (stopped || !worker.controller) return;
    while (active < 4 && pending.length) {
      active++;
      // These URLs already loaded before control. Replay through the worker so its
      // normal fetch handler stores them; prefer the browser's existing HTTP cache.
      void fetch(pending.shift()!, { cache: 'force-cache' })
        .then((response) => response.arrayBuffer())
        .catch(() => {})
        .finally(() => {
          active--;
          drain();
        });
    }
  };
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
      const url = new URL(entry.name);
      if (
        entry.workerStart ||
        url.origin !== location.origin ||
        !url.pathname.startsWith('/assets/') ||
        !/\.(?:js|css|woff2?|png|jpe?g|svg|webp|avif)$/i.test(url.pathname) ||
        seen.has(url.href)
      )
        continue;
      seen.add(url.href);
      pending.push(url.href);
    }
    drain();
  });
  // Buffered entries cover completed requests; observation also covers requests
  // begun before control whose response finishes after the worker claims the page.
  observer.observe({ type: 'resource', buffered: true });
  worker.addEventListener('controllerchange', drain);
  window.addEventListener(
    'pagehide',
    () => {
      stopped = true;
      observer.disconnect();
      worker.removeEventListener('controllerchange', drain);
      pending.length = 0;
    },
    { once: true },
  );
};
