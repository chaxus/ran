const CACHE_NAME = 'chaxus_ran_' + VERSION
const DOCUMENT_CACHE_NAME = 'chaxus_ran_documents'
const ASSET_CACHE_NAME = 'chaxus_ran_assets'
const assetCacheName = url => new URL(url, location.origin).pathname.startsWith('/assets/') ? ASSET_CACHE_NAME : CACHE_NAME

// Stamp only the stored copy. Network responses retain their URL/redirect semantics.
const storeDocument = (cache, url, response) => cache.put(url, new Response(response.body, {
  status: response.status,
  statusText: response.statusText,
  headers: { ...Object.fromEntries(response.headers), 'X-Ran-Docs-Version': VERSION }
}))

const removeDocument = async url => {
  await (await caches.open(DOCUMENT_CACHE_NAME)).delete(url);
  if (typeof forgetOfflineDocument !== 'undefined') await forgetOfflineDocument(url);
}

const IGNORE_REQUEST_LIST = [
  // google 上报不需要缓存
  'google',
  // 插件请求不用缓存
  'chrome-extension',
  // 百度的请求不用缓存
  'baidu.com',
  'blob:',
  'www.google-analytics.com',
  // Cloudflare Web Analytics 的 beacon，和上面几个同理：分析脚本没有离线价值，
  // 缓存它只会把某个版本钉死
  'cloudflareinsights.com'
]

// 请求方法
const REQUEST_METHOD = {
  GET: 'GET'
}
// 响应状态码
const RESPONSE_STATUS = {
  SUCCESS: 200
}
// service worker 可监听的事件
const SERVICE_WORK = {
  INSTALL: 'install',
  FETCH: 'fetch',
  ACTIVATE: 'activate',
  MESSAGE: 'message',
  SYNC: 'sync',
  PUSH: 'push'
}
/**
 * @description: 更新缓存
 * @param {*} fetchedResponse
 * @param {*} request
 * @return {*}
 */
const updateCache = async (fetchedResponse, request) => {
  const { url } = request
  const { status } = fetchedResponse
  // A removed or redirected route must stop serving its previous cached document.
  if (request.mode === 'navigate' && (fetchedResponse.redirected || status === 404 || status === 410)) {
    try { await removeDocument(url); } catch { /* Optional storage. */ }
    return
  }
  // 只缓存状态码为 200 的请求
  if (status !== RESPONSE_STATUS.SUCCESS) return
  if (!filterRequest(request)) return
  if (request.mode === 'navigate' && (fetchedResponse.redirected ||
    !fetchedResponse.headers.get('content-type')?.includes('text/html'))) return
  // 只有 fetch 来的响应才有 clone；从 cache 里取出的没有
  if (!fetchedResponse?.clone) return

  // **必须在这里同步 clone**，不能放进下面 caches.open 的 .then 里。
  //
  // 调用方是 `const r = await fetch(req); updateCache(r, req); return r;` —— caches.open()
  // 的回调要等到微任务才执行，而那时 return 已经把响应交给浏览器、body 正在被读取，
  // 再 clone() 就会抛 "Failed to execute 'clone' on 'Response': Response body is already used"。
  // 一个响应体只能读一次，所以要在交出去之前先复制一份。
  const copy = fetchedResponse.clone()
  return caches.open(request.mode === 'navigate' ? DOCUMENT_CACHE_NAME : assetCacheName(url)).then(cache => {
    return request.mode === 'navigate' ? storeDocument(cache, url, copy) : cache.put(url, copy);
  }).catch(error => {
    console.log('service worker update cache error:', error, request)
  })
}
/**
 * @description: 忽略 IGNORE_REQUEST_LIST 列表中的请求和非 GET 方法的请求
 * @param {*} request
 * @return {*}
 */
const filterRequest = (request) => {
  const { url, method } = request
  const parsed = new URL(url)
  return parsed.origin === location.origin &&
    !request.headers.has('range') &&
    !/\.(?:mp4|webm|gif|m3u8|ts)$/i.test(parsed.pathname) &&
    !IGNORE_REQUEST_LIST.some(item => url.includes(item)) && method === REQUEST_METHOD.GET
}

/**
 * 缓存优先
 * @param {*} request
 * @returns
 */
const cacheFirst = async (request, event) => {
  // 从缓存中读取 respondWith 表示拦截请求并返回自定义的响应
  try {
    const { url } = request
    const cache = await caches.open(assetCacheName(url));
    const responseFromCache = await cache.match(url);
    // 如果缓存中有，返回已经缓存的资源
    if (responseFromCache) return responseFromCache
    // 如果缓存中没有，就从网络中请求，并更新到缓存中
    const responseFromServer = await fetch(request);
    event.waitUntil(updateCache(responseFromServer, request))
    return responseFromServer
  } catch (error) {
    // 当缓存中也没有，请求也不可用的时候
    // 始终需要一个一个响应
    // 甚至可以设置回落的请求，在 catch 中继续发起请求
    console.log('service worker cacheFirst error:', error, request)
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}


const deleteCache = async (key) => {
  try {
    await caches.delete(key);
  } catch (error) {
    console.log('service worker deleteCache error:', error, key)
  }
};

const deleteOldCaches = async () => {
  const cacheKeepList = [CACHE_NAME, DOCUMENT_CACHE_NAME, ASSET_CACHE_NAME];
  try {
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => key.startsWith('chaxus_ran_') && !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
  } catch (error) {
    console.log('service worker deleteOldCaches error:', deleteOldCaches, cacheKeepList)
  }

};

// 首次加载发生在 worker 接管之前，主动保存打开的 HTML；文档缓存跨版本保留。
const cacheOpenDocuments = async () => {
  const clients = await this.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const urls = [...new Set(clients.map(client => {
    const url = new URL(client.url);
    url.hash = '';
    return url.href;
  }).filter(url => new URL(url).origin === location.origin))][Symbol.iterator]();
  const cache = await caches.open(DOCUMENT_CACHE_NAME);
  await Promise.all(Array.from({ length: 4 }, async () => {
    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (response.ok && !response.redirected && response.headers.get('content-type')?.includes('text/html')) {
          await storeDocument(cache, url, response);
        }
      } catch (error) {
        console.log('service worker document cache skipped:', url, error);
      }
    }
  }));
};

this.addEventListener(SERVICE_WORK.INSTALL, function (event) {
  // 内容哈希资源与当前打开的文档准备完成后接管。
  this.skipWaiting();
  // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // 创建了叫做 chaxus_ran 的新缓存
    caches.open(CACHE_NAME).then(async (cache) => {
      // A small pool avoids flooding the network while the foreground page loads.
      const urls = SERVICE_WORK_CACHE_FILE_PATHS[Symbol.iterator]();
      const worker = async () => {
        for (const url of urls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const target = url.startsWith('/assets/') ? await caches.open(ASSET_CACHE_NAME) : cache;
              await target.put(url, response);
            }
          } catch (error) {
            console.log('service worker precache skipped:', url, error);
          }
        }
      };
      await Promise.all(Array.from({ length: 4 }, worker));
      await cacheOpenDocuments();
    })
  );
});

/**
 * Current-deploy documents render immediately and refresh in the background.
 * Older documents give the network 800ms, then fall back while refresh continues.
 * An unvisited page still waits for its network response.
 */
const navigationResponse = async (request, event) => {
  const network = fetch(request).then(response => {
    const stored = updateCache(response, request);
    return { response, stored };
  }).catch(() => null);
  // Register before yielding, so even an immediate cache hit keeps refresh alive.
  event.waitUntil(network.then(result => result?.stored));
  let cached;
  try {
    const cache = await caches.open(DOCUMENT_CACHE_NAME);
    cached = await cache.match(request.url);
  } catch {
    // Disabled or full storage must not prevent network navigation.
  }
  if (cached?.headers.get('X-Ran-Docs-Version') === String(VERSION)) return cached;
  let timer;
  const result = cached ? await Promise.race([
    network,
    new Promise(resolve => { timer = setTimeout(() => resolve(null), 800); })
  ]) : await network;
  clearTimeout(timer);
  if (result && (!cached || result.response.status < 500)) return result.response;
  return cached || new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
  });
}

// 这个处理器**必须是同步函数**：respondWith 只能在事件派发的同步阶段调用，
// 包成 async 之后第一个 await 就已经让出了控制权，浏览器会认为没人拦截。
//
// 之前这里是 `async (event) => { cacheFirst(event.request) }` —— 既没调
// respondWith，函数本身又是 async。两个原因叠加，结果是整个 Service Worker
// 从不拦截任何请求：install 时辛苦预缓存的资源一次都没被读过，用户白白付了
// 安装时的下载成本，离线也不可用。
this.addEventListener(SERVICE_WORK.FETCH, event => {
  const { request } = event;
  const allowed = request.method === REQUEST_METHOD.GET && filterRequest(request);
  if (typeof offlineForeground !== 'undefined') {
    // Any foreground request interrupts an idle batch. Track downloads to completion
    // so the next idle callback cannot steal bandwidth from a still-streaming body.
    const load = tracked => allowed
      ? request.mode === 'navigate' ? navigationResponse(request, tracked) : cacheFirst(request, tracked)
      : fetch(request);
    event.respondWith(offlineForeground(event, load, !allowed));
    return;
  }
  if (!allowed) return;
  event.respondWith(request.mode === 'navigate' ? navigationResponse(request, event) : cacheFirst(request, event));
});

this.addEventListener(SERVICE_WORK.ACTIVATE, (event) => {
  event.waitUntil(cacheOpenDocuments().then(deleteOldCaches).then(() => this.clients.claim()));
});
