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
  const updateInterval = 5 * 60 * 1000;
  let nextUpdate = Date.now() + updateInterval;
  let inFlight = false;
  let suspended = false;
  let lastActivity = Date.now();
  let timer = 0;
  let idle: number | undefined;
  let cancelRequest: (() => void) | undefined;
  let cancelUpdate: (() => void) | undefined;
  let pendingUpdate: { valid: boolean; started: boolean } | undefined;
  const allowed = (): boolean =>
    !disposed &&
    !suspended &&
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
    if (!allowed()) return;
    if (ready || blocked) delay = Math.max(delay, nextUpdate - Date.now());
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
  // Native update promises cannot be aborted. Bound our wait, retain at most one
  // started check, and revoke late registration results before they can start IO.
  const checkUpdate = async (): Promise<'updated' | 'retry' | 'cancelled'> => {
    if (pendingUpdate?.started) return 'retry';
    const attempt = { valid: true, started: false };
    pendingUpdate = attempt;
    let deadline = 0;
    const interrupted = new Promise<'retry' | 'cancelled'>((resolve) => {
      const cancel = (result: 'retry' | 'cancelled'): void => {
        attempt.valid = false;
        if (!attempt.started && pendingUpdate === attempt) pendingUpdate = undefined;
        resolve(result);
      };
      deadline = window.setTimeout(() => cancel('retry'), 8000);
      cancelUpdate = () => cancel('cancelled');
    });
    const operation = (async (): Promise<'updated' | 'retry' | 'cancelled'> => {
      try {
        const registration = await worker.getRegistration();
        if (!attempt.valid || !allowed() || Date.now() - lastActivity < 1600) return 'cancelled';
        attempt.started = true;
        await registration?.update();
        return 'updated';
      } catch {
        return 'retry';
      } finally {
        if (pendingUpdate === attempt) pendingUpdate = undefined;
      }
    })();
    try {
      return await Promise.race([operation, interrupted]);
    } finally {
      window.clearTimeout(deadline);
      cancelUpdate = undefined;
    }
  };
  const run = async (): Promise<void> => {
    if (inFlight || !allowed()) return;
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
    let delay = 1600;
    try {
      if (Date.now() >= nextUpdate) {
        const result = await checkUpdate();
        if (result === 'cancelled') return;
        nextUpdate = Date.now() + (result === 'retry' ? 30000 : updateInterval);
      }
      // A new worker can claim this page while update() is pending. Recheck both
      // readiness and user activity before granting its next download batch.
      if (ready || !allowed() || Date.now() - lastActivity < 1600) return;
      blocked = false;
      const reply = await request();
      if (disposed || !reply) return;
      ready = reply.state === 'ready';
      blocked = reply.state === 'storage';
      if (blocked) nextUpdate = Date.now() + updateInterval;
      delay = reply.state === 'network' ? 30000 : 1600;
    } finally {
      inFlight = false;
      schedule(delay);
    }
  };
  const pause = (): void => {
    worker.controller?.postMessage({ type: 'OFFLINE_PAUSE' });
    cancelUpdate?.();
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
    nextUpdate = Date.now() + updateInterval;
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
