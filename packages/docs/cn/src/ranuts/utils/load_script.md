# loadScript

动态注入单个 `<script>`，按内容去重。

与 [`scriptOnLoad`](/cn/src/ranuts/utils/script_on_load) 的分工：那个负责一次性**批量**加载若干 url（`.css` 走 `<link>` 标签），这个负责**单个**脚本、支持内联正文，并且保证同一段脚本只求值一次。重复注入同一个第三方 SDK，通常意味着它的初始化副作用跑了两遍。

去重键是 `type + 内容` 的 md5，所以 URL 和同名的内联脚本不会互相误判。

## 使用

```ts
import { loadScript } from 'ranuts/utils';

// 外链脚本
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// 内联脚本
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// 第二次调用是空操作 —— 已经求值过了
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### 参数

| 参数      | 说明                                                    | 类型                 | 默认值 |
| --------- | ------------------------------------------------------- | -------------------- | ------ |
| `type`    | `'url'` 走 `src` 外链加载，`'content'` 直接内联脚本文本 | `'url' \| 'content'` | 必填   |
| `content` | type 为 `'url'` 时是地址，为 `'content'` 时是脚本正文   | `string`             | 必填   |

#### 返回

| 参数      | 说明                                   | 类型                            |
| --------- | -------------------------------------- | ------------------------------- |
| `promise` | 求值完成后 resolve `{ success: true }` | `Promise<{ success: boolean }>` |

外链脚本加载失败时 reject `{ success: false, error }`。

## 说明

**内联** script 在 append 的那一刻同步求值，之后**不会**再派发 `load` 事件。如果只等 `onload`，这个 Promise 在真实浏览器里永远不会 settle，所以 `type: 'content'` 时，`append` 一返回就视为完成。（jsdom **会**为内联脚本派发 load 事件，这也是单测看不出这个差异的原因。）
