# matchMediaQuery / watchMediaQuery

在 JavaScript 里读取并订阅 CSS 媒体查询。

做布局判断时优先用它们而不是 `isMobile()`：UA 嗅探认的是**设备**，媒体查询认的是**视口** ——
桌面浏览器缩窄窗口、平板横竖屏切换时，只有后者是对的。

## API

| 函数                               | 说明                                     |
| ---------------------------------- | ---------------------------------------- |
| `matchMediaQuery(query)`           | 当前是否匹配；SSR 下返回 `false`         |
| `watchMediaQuery(query, callback)` | 订阅变化，返回取消订阅函数               |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`，共用的移动端断点 |

## 示例

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## 注意

1. **回调会先同步触发一次**当前值，省掉调用方自己再读一遍初值。
2. **务必取消订阅**。未释放的 `MediaQueryList` 监听会让闭包连同它捕获的 DOM 一起存活。
3. **已兼容老 Safari**。`MediaQueryList` 的 `addEventListener` 到 Safari 14 才有，
   这里用 `addListener`/`removeListener` 兜底。
