interface Connection extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}
type BatchReply = { state: 'working' | 'ready' | 'paused' | 'network' | 'storage' | 'busy' };

/** Grant finite background batches only while the visible reader is idle. No UI. */
export const mountIdlePrefetch = (): (() => void) => {
  if (!('serviceWorker' in navigator) || typeof MessageChannel === 'undefined') return () => {};
  const worker = navigator.serviceWorker;
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  let disposed = false;
  let ready = false;
  let blocked = false;
  let inFlight = false;
  let suspended = false;
  let lastActivity = Date.now();
  let timer = 0;
  let idle: number | undefined;
  let cancelRequest: (() => void) | undefined;
  const allowed = (): boolean =>
    !disposed &&
    !suspended &&
    !blocked &&
    navigator.onLine &&
    document.visibilityState === 'visible' &&
    !connection?.saveData &&
    !/^(?:(?:slow-)?2g|3g)$/.test(connection?.effectiveType ?? '');
  const clearSchedule = (): void => {
    window.clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    idle = undefined;
  };
  const schedule = (delay = 1600): void => {
    clearSchedule();
    if (ready || !allowed()) return;
    timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idle = window.requestIdleCallback(() => {
          idle = undefined;
          void run();
        });
      } else void run();
    }, delay);
  };
  const request = (): Promise<BatchReply | null> =>
    new Promise((resolve) => {
      if (!worker.controller) {
        resolve(null);
        return;
      }
      const channel = new MessageChannel();
      let finished = false;
      const close = (reply: BatchReply | null): void => {
        if (finished) return;
        finished = true;
        window.clearTimeout(timeout);
        channel.port1.close();
        channel.port2.close();
        cancelRequest = undefined;
        resolve(reply);
      };
      const timeout = window.setTimeout(() => close({ state: 'network' }), 35000);
      cancelRequest = () => close(null);
      channel.port1.onmessage = (event) => close(event.data as BatchReply);
      const links = [...document.querySelectorAll<HTMLAnchorElement>('.nav a[href]')].map((link) => link.href);
      const resources = (performance.getEntriesByType?.('resource') ?? []).map((entry) => entry.name);
      const priority = [
        ...new Set(
          [...links, ...resources]
            .map((name) => new URL(name, location.href))
            .filter((url) => url.origin === location.origin)
            .map((url) => url.pathname),
        ),
      ];
      try {
        worker.controller.postMessage(
          { type: 'OFFLINE_BATCH', lang: document.documentElement.lang || 'en', current: location.pathname, priority },
          [channel.port2],
        );
      } catch {
        close({ state: 'network' });
      }
    });
  const run = async (): Promise<void> => {
    if (inFlight || ready || !allowed()) return;
    const quiet = Date.now() - lastActivity;
    if (quiet < 1600) {
      schedule(1600 - quiet);
      return;
    }
    if (!worker.controller) {
      schedule(2000);
      return;
    }
    inFlight = true;
    const reply = await request();
    inFlight = false;
    if (disposed || !reply) return;
    ready = reply.state === 'ready';
    blocked = reply.state === 'storage';
    schedule(reply.state === 'network' ? 30000 : 1600);
  };
  const pause = (): void => {
    if (inFlight) worker.controller?.postMessage({ type: 'OFFLINE_PAUSE' });
    cancelRequest?.();
    clearSchedule();
  };
  const activity = (): void => {
    lastActivity = Date.now();
    pause();
    schedule();
  };
  const changed = (): void => {
    pause();
    schedule();
  };
  const controllerChanged = (): void => {
    pause();
    ready = false;
    blocked = false;
    schedule();
  };
  const pageHidden = (event: PageTransitionEvent): void => {
    if (event.persisted) {
      suspended = true;
      pause();
    } else dispose();
  };
  const pageShown = (): void => {
    suspended = false;
    changed();
  };
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
  const dispose = (): void => {
    disposed = true;
    pause();
    for (const event of events) window.removeEventListener(event, activity, event === 'scroll');
    window.removeEventListener('online', changed);
    window.removeEventListener('offline', changed);
    window.removeEventListener('pagehide', pageHidden);
    window.removeEventListener('pageshow', pageShown);
    document.removeEventListener('visibilitychange', changed);
    connection?.removeEventListener('change', changed);
    worker.removeEventListener('controllerchange', controllerChanged);
  };
  for (const event of events) window.addEventListener(event, activity, { passive: true, capture: event === 'scroll' });
  window.addEventListener('online', changed);
  window.addEventListener('offline', changed);
  window.addEventListener('pagehide', pageHidden);
  window.addEventListener('pageshow', pageShown);
  document.addEventListener('visibilitychange', changed);
  connection?.addEventListener('change', changed);
  worker.addEventListener('controllerchange', controllerChanged);
  schedule();
  return dispose;
};
