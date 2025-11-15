# timeFormat

将时间秒数转换为 `HH:MM:SS` 或 `MM:SS` 格式的字符串。

## API

### timeFormat

#### Return

| 参数     | 说明                 | 类型     |
| -------- | -------------------- | -------- |
| `string` | 格式化后的时间字符串 | `string` |

#### Parameters

| 参数   | 说明         | 类型     | 默认值 |
| ------ | ------------ | -------- | ------ |
| `time` | 时间（秒数） | `number` | 无     |

## Example

### 基础用法

```js
import { timeFormat } from 'ranuts';

console.log(timeFormat(0)); // '00:00'
console.log(timeFormat(65)); // '01:05'
console.log(timeFormat(3661)); // '01:01:01'
```

### 视频时长显示

```js
import { timeFormat } from 'ranuts';

const videoDuration = 125; // 125 秒
const formatted = timeFormat(videoDuration);
console.log(formatted); // '02:05'
```

### 音频播放时间

```js
import { timeFormat } from 'ranuts';

const currentTime = 3600; // 1 小时
const formatted = timeFormat(currentTime);
console.log(formatted); // '01:00:00'
```

### 处理空值

```js
import { timeFormat } from 'ranuts';

console.log(timeFormat(null)); // '' (空字符串)
console.log(timeFormat(undefined)); // '' (空字符串)
```

## 注意事项

1. **格式规则**：小于 1 小时显示为 `MM:SS`，大于等于 1 小时显示为 `HH:MM:SS`。
2. **零值处理**：输入为 0 时返回 `'00:00'`。
3. **空值处理**：输入为 `null` 或 `undefined` 时返回空字符串。
4. **自动补零**：分钟和秒数小于 10 时自动补零。
