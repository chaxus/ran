# getStatus / status

HTTP 状态码 ↔ 状态消息的对照表，加上一个双向查询的 `getStatus` 辅助函数——和 Node 自带的 `http.STATUS_CODES` 是同一份数据，打包成浏览器也能用的形式。

## 使用

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' —— 数字字符串会先被当作状态码解析
getStatus('not found'); // 404 —— 解析失败后回退到按消息查找，不区分大小写

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### 参数

| 参数   | 说明                           | 类型               | 默认值 |
| ------ | ------------------------------ | ------------------ | ------ |
| `code` | 状态码、数字字符串，或状态消息 | `number \| string` | 必填   |

#### 返回

`number | string`——传入 `number` 返回**消息**；传入 `string` 返回**状态码**（像 `'404'` 这样的数字字符串会先被当作状态码解析，只有解析不出已知状态码时才回退到按消息查找）。输入既不是已知状态码也不是已知消息时会抛出异常。

### `status`

| 字段       | 说明                                                                  | 类型                   |
| ---------- | --------------------------------------------------------------------- | ---------------------- |
| `message`  | 状态码 → 消息                                                         | `Map<number, string>`  |
| `code`     | 小写消息 → 状态码                                                     | `Map<string, number>`  |
| `codes`    | 所有已知状态码                                                        | `number[]`             |
| `redirect` | 属于重定向的状态码（`300`、`301`、`302`、`303`、`305`、`307`、`308`） | `Record<number, true>` |
| `empty`    | 不带响应体的状态码（`204`、`205`、`304`）                             | `Record<number, true>` |
| `retry`    | 值得重试的状态码（`502`、`503`、`504`）                               | `Record<number, true>` |

## 注意事项

1. **`getStatus` 在状态码/消息未知时会抛出异常**——参数既不是 `number` 也不是 `string` 时抛 `TypeError`，其他未知情况抛普通 `Error`。如果输入不能保证一定合法（比如从网络上读到的状态码），用 `try`/`catch` 包一下，或者先检查 `status.codes.includes(n)`。
2. **`status.redirect` / `empty` / `retry` 是普通对象，不是 `Set`**——判断是否命中要用 `status.retry[code]`，不是 `.has()`。
3. 浏览器和 Node 都能跑（`ranuts/utils`），所以客户端也能用它做和服务端 `ranuts/node` 一样的状态码↔消息映射。
