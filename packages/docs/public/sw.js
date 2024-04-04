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
// service worker 状态
const SERVICE_WORK = {
    INSTALL: 'install',
    FETCH: 'fetch',
    ACTIVATE: 'activate'
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
    if (ignoreQuestUrl(request)) {
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
 * @description: 忽略 IGNORE_REQUEST_LIST 列表中的请求和非GET方法的请求
 * @param {*} request
 * @return {*}
 */
const ignoreQuestUrl = (request) => {
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
        const responseFromCache = await caches.match(request);
        // 如果缓存中有，返回已经缓存的资源
        if (responseFromCache) return responseFromCache
        // 如果缓存中没有，就从网络中请求，并更新到缓存中
        const responseFromServer = await fetch(request);
        updateCache(responseFromServer, request)
        return responseFromServer
    } catch (error) {
        // 当缓存中也没有，请求也不可用的时候
        // 始终需要一个一个响应
        // 甚至可以设置回落的请求，在catch中继续发起请求
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
            // 不用 cache.addAll 避免一个请求失败，全部缓存失败
            // 可以使用 cache.add
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

this.addEventListener(SERVICE_WORK.FETCH, (event) => {
    // 拦截请求
    try {
        const { request } = event
        // 忽略 IGNORE_REQUEST_LIST 中的请求，不进行拦截
        if (ignoreQuestUrl(request)) {
            const responseFromServer = cacheFirst(request)
            if (responseFromServer?.clone) {
                event.respondWith(responseFromServer);
            }
        }
    } catch (error) {
        console.log('service worker self fetch error:', error, event)
    }
});

this.addEventListener(SERVICE_WORK.ACTIVATE, (event) => {
    // 启用导航预加载，其将在发出 fetch 请求后，立即开始下载资源，并同时激活 service worker。
    // 这确保了在导航到一个页面时，立即开始下载，而不是等到 service worker 被激活。这种延迟发生的次数相对较少，但是一旦发生就不可避免，而且可能很重要。
    if(self.registration?.navigationPreload){
        event.waitUntil(self.registration?.navigationPreload.enable());
    }
    event.waitUntil(deleteOldCaches());
});



