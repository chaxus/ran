import { offlineCopy } from './offline-copy';

type WorkerState = 'working' | 'ready' | 'paused' | 'network' | 'storage' | 'busy';
interface Progress {
  state: WorkerState;
  completed?: number;
  total?: number;
}
interface Connection extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

/** Idle callbacks grant a small batch; they do not grant an endless download loop. */
export const mountOfflineCache = (): (() => void) => {
  if (!('serviceWorker' in navigator)) return () => {};
  const serviceWorker = navigator.serviceWorker;
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const lang = document.documentElement.lang || 'en';
  const copy = offlineCopy(lang);
  const root = document.createElement('section');
  root.className = 'offline-cache';
  root.setAttribute('aria-label', copy.title);
  const heading = document.createElement('p');
  heading.className = 'offline-cache__title';
  heading.textContent = copy.title;
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  const progress = document.createElement('progress');
  progress.setAttribute('aria-label', copy.title);
  const count = document.createElement('span');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.dataset.offlineToggle = '';
  const scope = document.createElement('p');
  scope.className = 'offline-cache__scope';
  scope.textContent = copy.scope;
  const row = document.createElement('div');
  row.className = 'offline-cache__row';
  row.append(status, progress, count, toggle);
  root.append(heading, row, scope);
  (document.querySelector('.doc') ?? document.body).append(root);

  let paused = false;
  try {
    paused = localStorage.getItem('ran.docs.offline.paused') === 'true';
  } catch {
    /* Storage can be disabled. */
  }
  let disposed = false;
  let ready = false;
  let blocked = false;
  let inFlight = false;
  let lastActivity = Date.now();
  let completed = 0;
  let total = 0;
  let timer = 0;
  let idle: number | undefined;
  let cancelRequest: (() => void) | undefined;

  const render = (state: keyof typeof copy): void => {
    root.dataset.offlineState = state;
    const message = copy[state];
    if (status.textContent !== message) status.textContent = message;
    if (total) {
      progress.max = total;
      progress.value = completed;
      count.textContent = `${completed} / ${total}`;
    } else {
      progress.removeAttribute('value');
      count.textContent = '';
    }
    toggle.hidden = ready;
    toggle.textContent = paused || blocked ? copy.resume : copy.pause;
  };
  const policy = (): 'paused' | 'network' | 'connection' | 'hidden' | 'storage' | null => {
    if (paused) return 'paused';
    if (blocked) return 'storage';
    if (!navigator.onLine) return 'network';
    if (connection?.saveData || /^(?:(?:slow-)?2g|3g)$/.test(connection?.effectiveType ?? '')) return 'connection';
    if (document.visibilityState !== 'visible') return 'hidden';
    return null;
  };
  const clearSchedule = (): void => {
    window.clearTimeout(timer);
    if (idle !== undefined) window.cancelIdleCallback(idle);
    idle = undefined;
  };
  const pauseWorker = (): void => {
    serviceWorker.controller?.postMessage({ type: 'OFFLINE_PAUSE' });
  };
  const schedule = (delay = 1600): void => {
    clearSchedule();
    if (disposed || ready) return;
    const reason = policy();
    if (reason) {
      render(reason);
      return;
    }
    timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window)
        idle = window.requestIdleCallback(() => {
          idle = undefined;
          void run();
        });
      else void run();
    }, delay);
  };
  const request = (type = 'OFFLINE_BATCH'): Promise<Progress | null> =>
    new Promise((resolve) => {
      const controller = serviceWorker.controller;
      if (!controller) {
        resolve(null);
        return;
      }
      const channel = new MessageChannel();
      let finished = false;
      const close = (reply: Progress | null): void => {
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
      channel.port1.onmessage = (event) => close(event.data as Progress);
      const resources = performance
        .getEntriesByType('resource')
        .map((entry) => new URL(entry.name, location.href))
        .filter((url) => url.origin === location.origin)
        .map((url) => url.pathname)
        .slice(-100);
      const destinations = [...document.querySelectorAll<HTMLAnchorElement>('.nav a[href]')]
        .map((link) => new URL(link.href, location.href))
        .filter((url) => url.origin === location.origin)
        .map((url) => url.pathname);
      const priority = [...new Set([...destinations, ...resources])];
      try {
        controller.postMessage({ type, lang, current: location.pathname, priority }, [channel.port2]);
      } catch {
        close({ state: 'network' });
      }
    });
  const run = async (): Promise<void> => {
    if (disposed || ready || inFlight) return;
    const reason = policy();
    if (reason) {
      render(reason);
      return;
    }
    const quiet = Date.now() - lastActivity;
    if (quiet < 1600) {
      schedule(1600 - quiet);
      return;
    }
    if (!serviceWorker.controller) {
      schedule(2000);
      return;
    }
    inFlight = true;
    const reply = await request();
    inFlight = false;
    if (disposed || !reply) return;
    completed = reply.completed ?? completed;
    total = reply.total ?? total;
    const stopped = policy();
    if (stopped) {
      render(stopped);
      return;
    }
    if (reply.state === 'ready') {
      ready = true;
      render('ready');
      return;
    }
    if (reply.state === 'storage') {
      blocked = true;
      render('storage');
      return;
    }
    render(reply.state === 'network' ? 'network' : 'working');
    schedule(reply.state === 'network' ? 30000 : 1600);
  };
  const refreshStatus = async (): Promise<void> => {
    if (disposed || inFlight || !serviceWorker.controller) return;
    inFlight = true;
    const reply = await request('OFFLINE_STATUS');
    inFlight = false;
    if (disposed || !reply) return;
    completed = reply.completed ?? 0;
    total = reply.total ?? 0;
    if (reply.state === 'ready') {
      ready = true;
      render('ready');
      clearSchedule();
      return;
    }
    if (reply.state === 'storage') blocked = true;
    render(policy() ?? 'waiting');
    schedule();
  };
  const activity = (): void => {
    lastActivity = Date.now();
    if (!ready) {
      pauseWorker();
      schedule();
    }
  };
  const changed = (): void => {
    pauseWorker();
    schedule();
  };
  const controllerChanged = (): void => {
    cancelRequest?.();
    ready = false;
    blocked = false;
    completed = 0;
    total = 0;
    render('waiting');
    schedule();
    queueMicrotask(() => void refreshStatus());
  };
  const preferenceChanged = (event: StorageEvent): void => {
    if (event.key !== 'ran.docs.offline.paused' && event.key !== null) return;
    paused = event.newValue === 'true';
    pauseWorker();
    render(paused ? 'paused' : 'waiting');
    schedule();
  };
  const onToggle = (): void => {
    paused = blocked ? false : !paused;
    blocked = false;
    try {
      localStorage.setItem('ran.docs.offline.paused', String(paused));
    } catch {
      /* Optional preference. */
    }
    pauseWorker();
    render(paused ? 'paused' : 'waiting');
    schedule();
  };
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
  for (const event of events) window.addEventListener(event, activity, { passive: true });
  window.addEventListener('storage', preferenceChanged);
  window.addEventListener('online', changed);
  window.addEventListener('offline', changed);
  document.addEventListener('visibilitychange', changed);
  connection?.addEventListener('change', changed);
  serviceWorker.addEventListener('controllerchange', controllerChanged);
  toggle.addEventListener('click', onToggle);
  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    pauseWorker();
    clearSchedule();
    cancelRequest?.();
    for (const event of events) window.removeEventListener(event, activity);
    window.removeEventListener('storage', preferenceChanged);
    window.removeEventListener('online', changed);
    window.removeEventListener('offline', changed);
    window.removeEventListener('pagehide', pageHidden);
    window.removeEventListener('pageshow', changed);
    document.removeEventListener('visibilitychange', changed);
    connection?.removeEventListener('change', changed);
    serviceWorker.removeEventListener('controllerchange', controllerChanged);
    root.remove();
  };
  const pageHidden = (event: PageTransitionEvent): void => {
    if (event.persisted) {
      pauseWorker();
      clearSchedule();
      cancelRequest?.();
    } else dispose();
  };
  window.addEventListener('pagehide', pageHidden);
  window.addEventListener('pageshow', changed);
  render('waiting');
  schedule();
  void refreshStatus();
  return dispose;
};
