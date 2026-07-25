# prefetch

在需要之前把大资源预热进浏览器缓存，同时不偷偷花用户的流量。

关键事实：只要 Service Worker 对同源 GET 做 cache-first，把某个 URL `fetch` 一次就会进
CacheStorage，之后任何代码请求同一 URL 都命中缓存、离线可用。所以预取不需要专门的下载器 ——
把字节拉进来就够了。

## API

| 函数                               | 说明                                        |
| ---------------------------------- | ------------------------------------------- |
| `whenIdle(callback, options?)`     | 浏览器空闲时执行，返回取消函数              |
| `networkAllowsDownload(options?)`  | 当前是否允许花用户的流量                    |
| `isUrlCached(url)`                 | 该 URL 是否已在 CacheStorage 里             |
| `prefetchUrl(url)`                 | 拉取单个 URL 进缓存；已缓存则跳过，失败静默 |
| `prefetchUrls(urls, options?)`     | 同上，处理一组，**串行**                    |
| `prefetchWhenIdle(urls, options?)` | 三者合一：允许 → 空闲 → 串行预取。非阻塞    |

### 选项

| 选项                   | 作用于         | 说明                                            | 默认值              |
| ---------------------- | -------------- | ----------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`     | `requestIdleCallback` 的最长等待（毫秒）        | `8000`              |
| `fallbackDelay`        | `whenIdle`     | 无 `requestIdleCallback` 时的退避延时（毫秒）   | `2500`              |
| `optOutKey`            | 网络许可       | localStorage 开关，设了任意值即视为用户关闭预取 | —                   |
| `slowTypes`            | 网络许可       | 视为慢网的 `effectiveType`                      | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls` | 交给可控 SW 预取时用的消息 `type`               | —                   |

## 示例

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// 之后：是否已在本地？（探测最后下载完成的那个文件）
const ready = await isUrlCached(modelFiles.at(-1));
```

## 注意

1. **预取花的是别人的流量**。`networkAllowsDownload` 在省流量模式、慢网、用户关闭时会拒绝。
2. **读不到就放行**。Network Information API 在 Safari/Firefox 上不存在，读不到连接信息
   不构成「一律不预取」的理由。
3. **成组预取串行执行** —— 打满带宽会拖慢用户正在看的页面。
4. **优先走 Service Worker**。SW 用 `event.waitUntil` 保活，下载不随页面导航中断；
   主线程 fetch 在用户点走后就断了。无可控 SW 时会自动回退。
5. **判断一组文件是否已缓存时探测最大的那个**，否则「下到一半」会被误判成已缓存。
6. **失败静默是设计如此** —— 预取失败只是让后续真实加载走一次下载。
