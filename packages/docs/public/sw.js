
const cacheName = 0

self.addEventListener('install', function (event) {
    // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
    event.waitUntil(
        // 创建了叫做 v1 的新缓存
        caches.open(cacheName).then(function (cache) {
            // serviceWorkCacheFilePaths 从 bin/build.sh 中生成注入
            cache.addAll(serviceWorkCacheFilePaths);
        })
    );
});

const ignoreRequest = [
    // google 上报不需要缓存
    'google',
    'chrome-extension',
    'baidu.com'
]
/**
 * 缓存优先
 * @param {*} request 
 * @returns 
 */
const cacheFirst = async (request) => {
    // 从缓存中读取 respondWith 表示拦截请求并返回自定义的响应
    const { url, method } = request
    try {
        const responseFromCache = await caches.match(request);
        if (responseFromCache) {
            return responseFromCache
        }
        // 如果缓存中没有，就从网络中请求
        const responseFromServer = await fetch(request);
        if (!ignoreRequest.some(item => url.includes(item)) && method === 'GET') {
            caches.open(cacheName).then(cache => {
                // 将请求到的资源添加到缓存中
                cache.put(request, responseFromServer.clone());
            }).catch(error => {
                console.log('service work cache:', error)
            })
        }
        return responseFromServer;
    } catch (error) {
        console.log('cacheFirst', error)
    }

}

self.addEventListener("fetch", (event) => {
    // 拦截请求
    event.respondWith(cacheFirst(event.request));
});

const deleteCache = async (key) => {
    try {
        await caches.delete(key);
    } catch (error) {
        console.log('deleteCache', error)
    }
};

const deleteOldCaches = async () => {
    const cacheKeepList = ["v2"];
    try {
        const keyList = await caches.keys();
        const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
        await Promise.all(cachesToDelete.map(deleteCache));
    } catch (error) {
        console.log('deleteOldCaches', deleteOldCaches)
    }

};

self.addEventListener("activate", (event) => {
    event.waitUntil(deleteOldCaches());
});



