
const cacheName = 'chaxus_ran'

self.addEventListener('install', function (event) {
    // 确保 Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
    event.waitUntil(
        // 创建了叫做 chaxus_ran 的新缓存
        caches.open(cacheName).then(function (cache) {
            // serviceWorkCacheFilePaths 从 bin/build.sh 中生成注入，会去缓存所有的资源
            // 不用 cache.addAll 避免一个请求失败，全部缓存失败
            return serviceWorkCacheFilePaths.map(url =>
                fetch(url).then(response => {
                    // 检查响应是否成功  
                    if (!response.ok) {
                        console.log('service work fetch response error:', url)
                    }
                    // 将响应添加到缓存  
                    return cache.put(url, response);
                }).catch(error => {
                    console.log('service work fetch error:', url, error);
                })
            )
        })
    );
});


/**
 * @description: 更新缓存
 * @param {*} fetchedResponse
 * @param {*} request
 * @return {*}
 */
const updateCache = (fetchedResponse, request) => {
    const { url, method } = request
    const ignoreRequest = [
        // google 上报不需要缓存
        'google',
        // 插件请求不用缓存
        'chrome-extension',
        // 百度的请求不用缓存
        'baidu.com'
    ]
    // 只缓存 get 请求
    if (!ignoreRequest.some(item => url.includes(item)) && method === 'GET') {
        caches.open(cacheName).then(cache => {
            // 将请求到的资源添加到缓存中
            cache.put(request, fetchedResponse.clone());
        }).catch(error => {
            console.log('service work update cache error:', error)
        })
    }
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
        // 如果缓存中有，依然去请求，异步更新缓存资源，同步返回已经缓存的资源
        if (responseFromCache) {
            fetch(request).then(fetchedResponse => {
                updateCache(fetchedResponse, request)
            }).catch(error => {
                console.log('cache first fetch error:', error);
            })
            return responseFromCache
        }
        // 如果缓存中没有，就从网络中请求
        const responseFromServer = await fetch(request);
        updateCache(responseFromCache, request)
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



