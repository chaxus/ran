# formatDate / timestampToTime

按模板格式化日期。

## API

### formatDate(value?, pattern?)

| 参数      | 说明                                      | 类型                       | 默认值                  |
| --------- | ----------------------------------------- | -------------------------- | ----------------------- |
| `value`   | 时间戳、日期字符串或 `Date`；省略表示当前 | `number \| string \| Date` | 当前时间                |
| `pattern` | 模板                                      | `string`                   | `'YYYY-MM-DD HH:mm:ss'` |

| 占位符      | 含义       | 占位符   | 含义          |
| ----------- | ---------- | -------- | ------------- |
| `YYYY`/`YY` | 年         | `mm`/`m` | 分            |
| `MM`/`M`    | 月（1–12） | `ss`/`s` | 秒            |
| `DD`/`D`    | 日         | `SSS`    | 毫秒          |
| `HH`/`H`    | 时（0–23） | `A`/`a`  | AM/PM · am/pm |
| `hh`/`h`    | 时（1–12） | `[...]`  | 原样文本      |

无法解析时返回 `'Invalid Date'`。

### timestampToTime(timestamp?)

已废弃。返回一个实例上挂了 `format` 方法的 `Date`。

## 示例

```js
import { formatDate } from 'ranuts';

formatDate(); // '2026-07-25 14:30:00'
formatDate(1753425000000, 'YYYY/MM/DD'); // '2026/07/25'
formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a');
formatDate('not a date'); // 'Invalid Date'
```

## 注意

1. **大小写有意义**。`MM` 是月、`mm` 是分；`HH` 是 24 小时制、`hh` 是 12 小时制。
2. **模板一次性替换完成**，刚写入的值不会被后面的占位符再次命中。
3. **原样文本用 `[]` 包起来**，避免其中的字母被当成占位符。

::: warning 0.3 修复并提供替代
旧实现链式调用六次 `.replace()` 且带忽略大小写标志，导致两个问题：后一个模式可能命中前一步刚写入的
数字；`/M+/g`、`/m+/g`、`/D+/gi` 互相重叠 —— 所以小写模板 `yyyy-mm-dd` 会输出「年-分钟-日」。

`timestampToTime` 已废弃，请改用 `formatDate`：往 `Date` 实例上挂方法在序列化后会丢失，
类型也只能标成 `Function`。它的 `format` 现在委托给 `formatDate`，老调用方也能享受修复后的占位符处理。
:::
