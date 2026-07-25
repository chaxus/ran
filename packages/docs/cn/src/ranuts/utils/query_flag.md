# queryFlag / isInIframe

读取 URL 上的布尔开关，以及判断页面是否被嵌入 —— `?embed`、`?readonly`、`?debug` 背后的两个判断。

## API

| 函数                   | 说明                                             |
| ---------------------- | ------------------------------------------------ |
| `queryFlag(key, url?)` | 某个查询参数是否为真                             |
| `isInIframe()`         | 当前页面是否运行在 iframe 里；SSR 下返回 `false` |

### `queryFlag`

| 参数  | 说明                  | 类型     | 默认值       |
| ----- | --------------------- | -------- | ------------ |
| `key` | 参数名                | `string` | 必填         |
| `url` | 完整 URL 或查询字符串 | `string` | 当前页面地址 |

`?k`、`?k=`、`?k=1`、`?k=true`（大小写不敏感）为真；其余一律为假，包括参数不存在和显式的
`?k=false`。

## 示例

### 读取开关

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true ← 最常见的写法
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### 判断嵌入模式

```js
import { queryFlag, isInIframe } from 'ranuts';

// 被 iframe 套住，或宿主显式声明，都算嵌入。
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### 在别人的页面里不做统计

```js
import { isInIframe } from 'ranuts';

// 在这里埋点，会把宿主站点的访客算到自己头上。
if (!isInIframe()) initAnalytics();
```

### 只读预览

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## 注意事项

1. **不带值是最常见的写法**。`?embed` 没有值，`getQuery(url).embed` 得到 `''` —— 是假值 ——
   直接判真假会静默漏掉这种最常见的形式。`queryFlag` 就是为此存在的。

2. **`?k=false` 为假**。显式的否定会被尊重，而不是当成「参数存在即开启」。

3. **`isInIframe` 做了保护**。某些引擎下跨源读取 `window.parent` 会抛错；读不到父窗口即视为
   被嵌入 —— 因为事实就是如此。

4. **两者都是 SSR 安全的**。没有 `window` 时 `isInIframe` 返回 `false`，`queryFlag` 在未传
   `url` 时返回 `false` —— 传入 URL 后二者都可以在构建期脚本里使用。
