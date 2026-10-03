// Page-driven idle batches. The worker never runs an unbounded background loop.
// Persist after each file so worker termination, tab closure and navigation can resume.
const OFFLINE_STATE_URL = new URL('/__offline__/state.json', location.origin).href;
let offlineJob = null;
let offlineState = null;
let foregroundRequests = 0;

const offlineForeground = async (event, load, streamBody) => {
  offlineJob?.controller.abort();
  foregroundRequests++;
  let resolveFinished;
  let released = false;
  const finished = new Promise(resolve => { resolveFinished = resolve; });
  const release = () => {
    if (released) return;
    released = true;
    foregroundRequests--;
    resolveFinished();
  };
  event.waitUntil(finished);
  const writes = [];
  const tracked = { waitUntil: promise => { writes.push(promise); event.waitUntil(promise); } };
  try {
    const response = await load(tracked);
    // Cached foreground requests already clone synchronously and drain via Cache.put.
    if (writes.length) { void Promise.allSettled(writes).then(release); return response; }
    // Opaque and redirected responses must retain their original URL/type semantics.
    if (!streamBody || !response.body || response.type === 'opaque' || response.redirected) {
      release();
      return response;
    }
    const reader = response.body.getReader();
    // Forward one chunk per pull, without cloning/buffering videos or range downloads.
    const body = new ReadableStream({
      async pull(controller) {
        try {
          const chunk = await reader.read();
          if (chunk.done) { controller.close(); release(); }
          else controller.enqueue(chunk.value);
        } catch (error) { controller.error(error); release(); }
      },
      async cancel(reason) { try { await reader.cancel(reason); } finally { release(); } }
    });
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  } catch (error) { release(); throw error; }
};

const readOfflineState = () => {
  if (!offlineState) {
    offlineState = (async () => {
      const cache = await caches.open(CACHE_NAME);
      const stored = await cache.match(OFFLINE_STATE_URL);
      return new Set(stored ? (await stored.json()).done : []);
    })().catch(error => { offlineState = null; throw error; });
  }
  return offlineState;
};
const saveOfflineState = async done => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(OFFLINE_STATE_URL, new Response(JSON.stringify({ done: [...done] }), {
    headers: { 'Content-Type': 'application/json' }
  }));
};
const offlineTarget = url => {
  const document = Object.values(OFFLINE_MANIFEST.locales).some(urls => urls.includes(url) && !url.startsWith('/search/'));
  return document ? DOCUMENT_CACHE_NAME : assetCacheName(url);
};
const runOfflineBatch = async (data, controller) => {
  const done = await readOfflineState();
  const locale = OFFLINE_MANIFEST.locales[data.lang];
  const all = [...new Set([...OFFLINE_MANIFEST.shared, ...locale])];
  const preferred = Array.isArray(data.priority) ? data.priority.filter(url => all.includes(url)) : [];
  const current = locale.includes(data.current) ? [data.current] : [];
  const queue = [...new Set([...preferred, ...current, `/search/${data.lang}.json`, ...all])].filter(url => all.includes(url));
  const progress = state => ({ state, lang: data.lang, completed: all.filter(url => done.has(url)).length, total: all.length });
  let files = 0;
  let bytes = 0;
  try {
    const estimate = await navigator.storage?.estimate?.();
    if (estimate?.quota && estimate.quota - (estimate.usage || 0) < 5 * 1024 * 1024) return progress('storage');
    for (const url of queue) {
      controller.signal.throwIfAborted();
      if (done.has(url)) continue;
      const cache = await caches.open(offlineTarget(url));
      // Content-hashed assets are shared across versions. Documents and indexes must
      // be refreshed once per deploy; a previous version's cached HTML is not ready.
      let response = url.startsWith('/assets/') ? await cache.match(new URL(url, location.origin).href) : undefined;
      if (!response) {
        if (files >= 3 || bytes >= 1024 * 1024) break;
        const timer = setTimeout(() => controller.abort(new DOMException('Download timed out', 'TimeoutError')), 8000);
        try {
          response = await fetch(url, { signal: controller.signal, cache: 'no-cache', credentials: 'same-origin' });
          if (!response.ok || (response.url && new URL(response.url).origin !== location.origin)) throw new Error('Offline resource unavailable');
          controller.signal.throwIfAborted();
          // Cache.put consumes the entire body before the next download starts.
          const size = Number(response.headers.get('content-length'));
          await cache.put(new URL(url, location.origin).href, response);
          files++;
          bytes += size > 0 ? size : 0;
        } finally { clearTimeout(timer); }
      }
      done.add(url);
      await saveOfflineState(done);
    }
    return progress(all.every(url => done.has(url)) ? 'ready' : 'working');
  } catch (error) {
    if (error.name === 'QuotaExceededError') return progress('storage');
    if (controller.signal.aborted && controller.signal.reason?.name !== 'TimeoutError') return progress('paused');
    return progress('network');
  }
};

this.addEventListener('message', event => {
  const data = event.data;
  if (!event.source?.url || new URL(event.source.url).origin !== location.origin) return;
  if (data?.type === 'OFFLINE_PAUSE') {
    offlineJob?.controller.abort();
    return;
  }
  if (!['OFFLINE_BATCH', 'OFFLINE_STATUS'].includes(data?.type)) return;
  const port = event.ports?.[0];
  if (!port) return;
  if (!Object.hasOwn(OFFLINE_MANIFEST.locales, data.lang)) { port.postMessage({ state: 'network' }); return; }
  if (data.type === 'OFFLINE_STATUS') {
    event.waitUntil(readOfflineState().then(done => {
      const all = [...new Set([...OFFLINE_MANIFEST.shared, ...OFFLINE_MANIFEST.locales[data.lang]])];
      const completed = all.filter(url => done.has(url)).length;
      port.postMessage({ state: completed === all.length ? 'ready' : 'working', completed, total: all.length });
    }).catch(error => port.postMessage({ state: error.name === 'QuotaExceededError' ? 'storage' : 'network' })));
    return;
  }
  if (offlineJob || foregroundRequests) {
    port.postMessage({ state: 'busy' });
    return;
  }
  const job = { controller: new AbortController() };
  offlineJob = job;
  event.waitUntil(runOfflineBatch(data, job.controller)
    .catch(error => ({ state: error.name === 'QuotaExceededError' ? 'storage' : 'network' }))
    .then(result => port.postMessage(result))
    .finally(() => { if (offlineJob === job) offlineJob = null; }));
});
