/** The worker survives each batch through waitUntil; visits resume persisted progress. */
export const mountOfflineCache = (): void => {
  if (!('serviceWorker' in navigator) || typeof MessageChannel !== 'function') return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  let complete = false;
  let generation = 0;
  let lastInteraction = -Infinity;
  const connection = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (type: string, listener: () => void) => void;
      };
    }
  ).connection;
  const allowed = (): boolean =>
    navigator.onLine &&
    document.visibilityState === 'visible' &&
    !connection?.saveData &&
    !['slow-2g', '2g'].includes(connection?.effectiveType ?? '');
  const schedule = (delay = 2000): void => {
    if (timer || running || complete || !allowed()) return;
    timer = setTimeout(() => {
      timer = undefined;
      const idle = (): void => {
        void batch();
      };
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(idle, { timeout: 5000 });
      else if (Date.now() - lastInteraction < 1000) schedule(1000);
      else idle();
    }, delay);
  };
  const batch = async (): Promise<void> => {
    if (running || complete || !allowed()) return;
    const worker = navigator.serviceWorker.controller;
    if (!worker) return;
    running = true;
    const currentGeneration = generation;
    let retry = 2000;
    const channel = new MessageChannel();
    try {
      const progress = await new Promise<{ complete?: boolean; failures?: number }>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Offline batch timeout')), 330000);
        channel.port1.onmessage = (event) => {
          clearTimeout(timeout);
          resolve(event.data);
        };
        worker.postMessage({ type: 'CACHE_OFFLINE_BATCH' }, [channel.port2]);
      });
      complete = currentGeneration === generation && !!progress.complete;
      if (progress.failures) retry = 30000;
    } catch {
      retry = 30000;
    } finally {
      channel.port1.close();
      running = false;
      schedule(retry);
    }
  };
  const resume = (): void => schedule();
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    generation++;
    complete = false;
    resume();
  });
  connection?.addEventListener?.('change', resume);
  const interacted = (): void => {
    lastInteraction = Date.now();
  };
  for (const type of ['pointerdown', 'touchstart', 'keydown', 'wheel']) {
    window.addEventListener(type, interacted, { passive: true });
  }
  window.addEventListener('online', resume);
  document.addEventListener('visibilitychange', resume);
  if (document.readyState === 'complete') resume();
  else window.addEventListener('load', resume, { once: true });
};
