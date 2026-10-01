/* Startup resources install immediately; the client requests bounded idle batches. */
const CONTENT_CACHE = 'chaxus_ran_content_v2';
const STATE_CACHE = 'chaxus_ran_state_v2';
const STATE_URL = '/__offline_progress__/' + VERSION;
let queue = Promise.resolve();

async function parallel(items, action) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(2, items.length) }, async () => {
      while (next < items.length) await action(items[next++]);
    }),
  );
}

async function download(url) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  let expired = false;
  let timer;
  try {
    await Promise.race([
      (async () => {
        const options = { cache: 'no-cache', priority: 'low' };
        if (controller) options.signal = controller.signal;
        const response = await fetch(url, options);
        if (expired) throw new Error(`Offline cache timeout: ${url}`);
        if (!response.ok) throw new Error(`Offline cache: ${url} (${response.status})`);
        await (await caches.open(CONTENT_CACHE)).put(url, response);
      })(),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          expired = true;
          if (controller) controller.abort();
          reject(new Error(`Offline cache timeout: ${url}`));
        }, 30000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

addEventListener('install', (event) => {
  event.waitUntil(parallel(SERVICE_WORK_CACHE_FILE_PATHS, download).then(() => skipWaiting()));
});
addEventListener('activate', (event) => {
  // Preserve the previous version until the complete replacement is available.
  event.waitUntil(clients.claim());
});

async function cacheBatch() {
  const content = await caches.open(CONTENT_CACHE);
  const manifestResponse = await content.match('/offline-manifest.json');
  const manifest = await (manifestResponse || (await fetch('/offline-manifest.json'))).json();
  const stateCache = await caches.open(STATE_CACHE);
  const saved = await stateCache.match(STATE_URL);
  const state = saved ? await saved.json() : { revisions: {}, cursor: 0 };
  if (!saved) {
    // Reuse unchanged resources across deployments without sharing a writable cursor.
    for (const request of await stateCache.keys()) {
      const response = await stateCache.match(request);
      if (response) Object.assign(state.revisions, (await response.json()).revisions);
    }
  }
  const cachedURLs = new Set((await content.keys()).map((request) => new URL(request.url, location.origin).pathname));
  const pending = [];
  for (const file of manifest.files) {
    if (state.revisions[file.url] !== file.revision || !cachedURLs.has(file.url)) pending.push(file);
  }
  // Rotate failures so a missing resource does not starve the rest of the site.
  const offset = pending.length ? state.cursor % pending.length : 0;
  const batch = [...pending.slice(offset), ...pending.slice(0, offset)].slice(0, 20);
  let failures = 0;
  await parallel(batch, async (file) => {
    try {
      await download(file.url);
      state.revisions[file.url] = file.revision;
    } catch (error) {
      failures++;
      console.warn(error);
    }
  });
  state.cursor = offset + batch.length;
  const complete = pending.length === batch.length && failures === 0;
  await stateCache.put(
    STATE_URL,
    new Response(JSON.stringify(state), { headers: { 'Content-Type': 'application/json' } }),
  );
  if (complete) {
    // Shared content may already contain a newer install's assets. Do not prune
    // individual entries using this worker's potentially superseded inventory.
    const latest = await content.match('/offline-manifest.json');
    if (!latest || (await latest.json()).version !== manifest.version) return { complete: false, failures: 0 };
    for (const name of await caches.keys()) {
      if (name.startsWith('chaxus_ran_') && name !== CONTENT_CACHE && name !== STATE_CACHE) await caches.delete(name);
    }
  }
  return {
    complete,
    cached: manifest.files.length - pending.length + batch.length - failures,
    total: manifest.files.length,
    failures,
  };
}
addEventListener('message', (event) => {
  if ((event.data && event.data.type) !== 'CACHE_OFFLINE_BATCH') return;
  queue = queue.catch(() => {}).then(cacheBatch);
  event.waitUntil(
    queue.then(
      (progress) => event.ports && event.ports[0] && event.ports[0].postMessage(progress),
      () => event.ports && event.ports[0] && event.ports[0].postMessage({ complete: false, failures: 1 }),
    ),
  );
});

async function cached(request) {
  try {
    const current = await (await caches.open(CONTENT_CACHE)).match(request);
    if (current) return current;
    for (const name of await caches.keys()) {
      if (name.startsWith('chaxus_ran_') && name !== STATE_CACHE && name !== CONTENT_CACHE) {
        const response = await (await caches.open(name)).match(request);
        if (response) return response;
      }
    }
  } catch {
    // Storage restrictions must not prevent online reading.
    return undefined;
  }
}

addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin || url.pathname === '/offline-manifest.json') return;
  const networkFirst = request.mode === 'navigate' || /\.(?:json|xml|txt)$/.test(url.pathname);
  let write = Promise.resolve();
  const response = (async () => {
    if (!networkFirst) {
      const hit = await cached(request);
      if (hit) return hit;
    }
    try {
      const fresh = await fetch(request);
      if (fresh.ok) {
        const copy = fresh.clone();
        write = caches
          .open(CONTENT_CACHE)
          .then((cache) => cache.put(request, copy))
          .catch(() => {});
      }
      return fresh;
    } catch (error) {
      const hit = await cached(request);
      if (hit) return hit;
      return new Response(
        'This page is not available offline yet. Reconnect to finish downloading the documentation.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
      );
    }
  })();
  event.respondWith(response);
  event.waitUntil(response.then(() => write));
});
