---
title: Service Worker 的三个静默失败
date: 2026-08-20
pillar: practice
tags: [Service Worker, PWA, 缓存]
description: 三个都不报错、都不影响页面显示、但让 Service Worker 完全不干活的错误。
---

给文档站加 Service Worker 的时候踩了三个坑。共同点是：**都不报错，都不影响页面显示，而 Service Worker 完全没在干活**。

## 一：把版本号写进文件名

一开始每次构建都把 `sw.js` 改名成 `sw<时间戳>.js`，想着这样能保证拿到新的。

这恰好废掉了 Service Worker 自带的更新机制。

浏览器判断要不要更新 SW 的方式，是**重新抓取同一个 URL 然后逐字节比对**。而老用户注册的是 `sw<旧时间戳>.js`，这个文件在新部署里已经不存在了 —— 每次更新检查都是 404。唯一剩下的更新途径变成「用户打开页面，页面里的内联脚本注册新文件名」。

版本号写在**文件内容里**就够了：内容变了，字节比对就会发现。而且浏览器抓 SW 主脚本时默认绕过 HTTP 缓存（`updateViaCache` 默认是 `'imports'`），不存在「URL 没变所以拿到旧文件」这回事。

固定 URL 换回来的是浏览器自己的更新路径：导航时检查，大约每 24 小时也检查一次。

## 二：async 的 fetch 处理器

```js
// 坏的
self.addEventListener('fetch', async (event) => {
  cacheFirst(event.request);
});
```

两个问题叠在一起。

`event.respondWith()` **只在事件同步派发期间有效**。一个 `async` 函数在第一个 `await` 处就已经让出了，那之后再调用 `respondWith` 会抛 `InvalidStateError`。

而上面这段更彻底 —— 它压根没调 `respondWith`。

结果是：install 阶段老老实实把 app shell 预缓存了，然后**没有任何一个请求会去读它**。用户付了下载的代价，拿到零收益，离线也不工作。而且从头到尾没有一行报错。

正确的形状是同步函数里立刻调 `respondWith`，把 promise 交给它：

```js
self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});
```

## 三：在微任务里 clone 响应

```js
// 坏的
function updateCache(request, response) {
  caches.open(CACHE_NAME).then((cache) => {
    cache.put(request, response.clone());
  });
}
```

一个 Response 的 body 只能读一次。

`caches.open()` 返回 promise，`.then()` 里的代码要等到一个微任务之后才跑。而那时候调用方早就把 response 返回给浏览器了，body 正在被消费 —— `clone()` 抛出：

```text
Failed to execute 'clone' on 'Response': Response body is already used
```

修法是**同步 clone**，在把响应交出去之前：

```js
function updateCache(request, response) {
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
}
```

::: note 为什么第三个坑是最后才浮出来的
在第二个坑还没修的时候，这段代码从来没有真正执行过 —— 没有任何请求被拦截，也就没有响应需要缓存。修好 fetch 处理器、拦截开始真正工作的那一刻，它才暴露出来。

一个 bug 被另一个 bug 挡住，是这类问题里很常见的形态。
:::

## 还有一条：策略要分请求类型

全站 cache-first 对文档站是错的 —— 那意味着给读者看昨天的文章。

- **HTML 导航**（`request.mode === 'navigate'`）走 network-first，缓存兜底
- **其他一切**走 cache-first，因为构建产物是内容哈希命名的，本来就不可变

`activate` 里跑一次清理，只保留当前 `CACHE_NAME`，上一次部署的资源才会真正被清掉。

## 共同点

这三个错误没有一个会让页面白屏，没有一个会在控制台留下红字。站看起来完全正常，只是那个你以为在工作的东西一直没在工作。

检验方式只有一个：**打开 DevTools 的 Application 面板，看请求到底有没有从 Service Worker 出来**。相信代码看起来是对的，在这个领域里格外不划算。
