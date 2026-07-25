const CACHE_NAME = 'chaxus_ran_' + VERSION

const IGNORE_REQUEST_LIST = [
  // google 上报不需要缓存
  'google',
  // 插件请求不用缓存
  'chrome-extension',
  // 百度的请求不用缓存
  'baidu.com',
  'blob:',
  'www.google-analytics.com'
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
const updateCache = (fetchedResponse, request) => {
  const { url } = request
  const { status } = fetchedResponse
  // 只缓存状态码为 200 的请求
  if (status !== RESPONSE_STATUS.SUCCESS) return
  if (filterRequest(request)) {
    caches.open(CACHE_NAME).then(cache => {
      // 将请求到的资源添加到缓存中
      // 判断下只有 fetch 的请求才有 clone 方法，才可以被缓存，从 cache 中获取的响应没有 clone
      if (fetchedResponse?.clone) {
        cache.put(url, fetchedResponse.clone());
      }
    }).catch(error => {
      console.log('service worker update cache error:', error, request)
    })
  }
}
/**
 * @description: 忽略 IGNORE_REQUEST_LIST 列表中的请求和非 GET 方法的请求
 * @param {*} request
 * @return {*}
 */
const filterRequest = (request) => {
  const { url, method } = request
  return !IGNORE_REQUEST_LIST.some(item => url.includes(item)) && method === REQUEST_METHOD.GET
}

/**
 * 缓存优先
 * @param {*} request
 * @returns
 */
const cacheFirst = async (request) => {
  // 从缓存中读取 respondWith 表示拦截请求并返回自定义的响应
  try {
    const { url } = request
    const responseFromCache = await caches.match(url);
    // 如果缓存中有，返回已经缓存的资源
    if (responseFromCache) return responseFromCache
    // 如果缓存中没有，就从网络中请求，并更新到缓存中
    const responseFromServer = await fetch(request);
    updateCache(responseFromServer, request)
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
  const cacheKeepList = [CACHE_NAME];
  try {
    const keyList = await caches.keys();
    const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
    await Promise.all(cachesToDelete.map(deleteCache));
  } catch (error) {
    console.log('service worker deleteOldCaches error:', deleteOldCaches, cacheKeepList)
  }

};

this.addEventListener(SERVICE_WORK.INSTALL, function (event) {
  // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // 创建了叫做 chaxus_ran 的新缓存
    caches.open(CACHE_NAME).then(function (cache) {
      // SERVICE_WORK_CACHE_FILE_PATHS 从 bin/build.sh 中生成注入，会去缓存所有的资源
      // 不用 cache.addAll 避免一个请求失败，全部缓存失败，类似 Promise.all
      // 可以使用 cache.add 但 Cache.add/Cache.addAll 不会缓存 Response.status 值不在 200 范围内的响应，
      // 而 cache.put 允许你存储任何请求/响应对。因此，Cache.add/Cache.addAll 不能用于不透明的响应，而 Cache.put 可以。
      return SERVICE_WORK_CACHE_FILE_PATHS.map(url =>
        fetch(url).then(response => {
          // 检查响应是否成功
          if (!response.ok) {
            console.log('service worker fetch response error:', url)
          }
          // 将响应添加到缓存
          return cache.put(url, response);
        }).catch(error => {
          console.log('service worker self installed error:', url, error);
        })
      )
    })
  );
});

/**
 * 网络优先，失败回落到缓存。
 * 给 HTML 导航用：文档站的正文必须是最新的，缓存只作为离线兜底。
 */
const networkFirst = async (request) => {
  try {
    const responseFromServer = await fetch(request);
    updateCache(responseFromServer, request)
    return responseFromServer
  } catch (error) {
    const responseFromCache = await caches.match(request.url);
    if (responseFromCache) return responseFromCache
    console.log('service worker networkFirst error:', error, request)
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// 这个处理器**必须是同步函数**：respondWith 只能在事件派发的同步阶段调用，
// 包成 async 之后第一个 await 就已经让出了控制权，浏览器会认为没人拦截。
//
// 之前这里是 `async (event) => { cacheFirst(event.request) }` —— 既没调
// respondWith，函数本身又是 async。两个原因叠加，结果是整个 Service Worker
// 从不拦截任何请求：install 时辛苦预缓存的资源一次都没被读过，用户白白付了
// 安装时的下载成本，离线也不可用。
this.addEventListener(SERVICE_WORK.FETCH, (event) => {
  const { request } = event
  // 非 GET（POST 表单、上报等）交回浏览器，缓存里也不该有它们
  if (request.method !== REQUEST_METHOD.GET) return
  if (!filterRequest(request)) return
  // HTML 导航走网络优先，其余（构建产物带内容哈希，天然不可变）走缓存优先
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return
  }
  event.respondWith(cacheFirst(request));
});

this.addEventListener(SERVICE_WORK.ACTIVATE, (event) => {
  event.waitUntil(deleteOldCaches());
});



