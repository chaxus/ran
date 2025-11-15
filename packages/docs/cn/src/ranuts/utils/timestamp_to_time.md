# timestampToTime

将时间戳转换为 Date 对象，并添加 `format` 方法用于格式化日期。

## API

### timestampToTime

#### Return

| 参数                           | 说明                         | 类型                           |
| ------------------------------ | ---------------------------- | ------------------------------ |
| `Date & { format?: Function }` | 带有 format 方法的 Date 对象 | `Date & { format?: Function }` |

#### Parameters

| 参数        | 说明                   | 类型               | 默认值 |
| ----------- | ---------------------- | ------------------ | ------ |
| `timestamp` | 时间戳（毫秒或字符串） | `number \| string` | 无     |

### format 方法

返回的 Date 对象包含一个 `format` 方法，用于格式化日期。

#### format 参数

| 参数     | 说明           | 类型     | 默认值                  |
| -------- | -------------- | -------- | ----------------------- |
| `format` | 日期格式字符串 | `string` | `'YYYY-MM-DD HH:mm:ss'` |

#### 格式说明

- `YYYY` - 年份（4 位）
- `MM` - 月份（2 位）
- `DD` - 日期（2 位）
- `HH` - 小时（24 小时制，2 位）
- `mm` - 分钟（2 位）
- `SS` - 秒（2 位）

## Example

### 基础用法

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime(1609459200000);
console.log(date.format()); // '2021-01-01 00:00:00'
```

### 自定义格式

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime(1609459200000);
console.log(date.format('YYYY/MM/DD')); // '2021/01/01'
console.log(date.format('YYYY-MM-DD HH:mm')); // '2021-01-01 00:00'
```

### 使用当前时间

```js
import { timestampToTime } from 'ranuts';

const now = timestampToTime();
console.log(now.format('YYYY年MM月DD日')); // '2024年01月01日'
```

### 字符串时间戳

```js
import { timestampToTime } from 'ranuts';

const date = timestampToTime('1609459200000');
console.log(date.format()); // '2021-01-01 00:00:00'
```

## 注意事项

1. **时间戳格式**：支持数字（毫秒）或字符串格式的时间戳。
2. **默认值**：如果不传参数，使用当前时间。
3. **format 方法**：返回的 Date 对象扩展了 `format` 方法，可以链式调用。
4. **格式字符**：格式字符串中的 `Y`、`M`、`D`、`H`、`m`、`S` 会被替换为对应的日期时间值。
