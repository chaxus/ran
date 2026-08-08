# 时间格式化

时间在界面上有三种截然不同的形态，把它们混为一谈是常见的困惑来源。`ranuts` 为每一种提供独立的函数：

| 读者真正想知道的               | 函数                                   | 输出示例              |
| ------------------------------ | -------------------------------------- | --------------------- |
| 这件事**具体**发生在什么时候？ | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| 这段时间**有多长**？           | `formatDuration`                       | `01:01:01`            |
| 距离现在**多久之前**？         | `formatRelative`                       | `3 天前`、`5m`        |

## formatDuration

把经过的**秒数**格式化成冒号分隔的时钟时长——播放器进度条上的那种形态。不足一小时用 `mm:ss`，超过则展开为 `hh:mm:ss`。

#### 参数

| 参数      | 说明                       | 类型     | 默认值 |
| --------- | -------------------------- | -------- | ------ |
| `seconds` | 经过的秒数；负数会被夹到 0 | `number` | 必填   |

#### 返回值

`string` —— 时长字符串；输入不是有限数时返回 `''`。

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

`NaN` 返回空串是刻意的：播放器在元数据加载完成前读 `video.duration` 拿到的就是 `NaN`，此时显示空白比 `NaN:NaN` 得体。

::: tip 已更名
本函数原名 `timeFormat`。旧名作为废弃别名保留、行为完全一致，但它没有说清自己产出的是三种时间格式中的哪一种。
:::

## formatRelative

描述某个时间点相对于另一个时间点的位置——「3 天前」「2 小时后」。

本地化交给平台的
[`Intl.RelativeTimeFormat`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)，
它自 2020 年起在所有主流浏览器可用，且已经掌握各语言的复数与词形规则。`formatRelative` 只补上 `Intl` 有意留白的那部分：决定用**哪个单位**来表达这段间隔。

和 `Intl` 一样，它只报告**单一**单位——3 天 6 小时的间隔是「3 天前」，不会是「3 天 6 小时前」。

#### 参数

| 参数      | 说明           | 类型                       | 默认值 |
| --------- | -------------- | -------------------------- | ------ |
| `value`   | 要描述的时间点 | `number \| string \| Date` | 必填   |
| `options` | 见下表         | `FormatRelativeOptions`    | `{}`   |

| 选项      | 说明                                                     | 类型                       | 默认值     |
| --------- | -------------------------------------------------------- | -------------------------- | ---------- |
| `now`     | 参照的时间点                                             | `number \| string \| Date` | 当前时间   |
| `locale`  | BCP 47 语言标签；`compact` 风格会忽略它                  | `string \| string[]`       | 运行时语言 |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`             | `RelativeStyle`            | `'long'`   |
| `numeric` | `'auto'` 会换用「昨天」这类习惯说法，`'always'` 保留数字 | `'always' \| 'auto'`       | `'auto'`   |

#### 返回值

`string` —— 描述文本；两端任一无法解析时返回 `''`。

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(twoHoursAgo, { locale: 'en-US' }); // '2 hours ago'
formatRelative(twoHoursAgo, { locale: 'en-US', style: 'short' }); // '2 hr. ago'
formatRelative(Date.now() + 60_000, { locale: 'zh-CN' }); // '1 分钟后'
formatRelative(Date.now() - 86_400_000, { locale: 'zh-CN' }); // '昨天'
formatRelative(Date.now() - 86_400_000, { locale: 'zh-CN', numeric: 'always' }); // '1 天前'
```

### compact 风格

`compact` 是列表条目旁边那种紧凑角标：

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning 它不携带方向
`compact` 只是量值，未来的时间戳和过去的渲染结果完全相同——都是 `5m`。它是为「已发生事件的信息流」准备的。凡是读者需要分辨过去与未来的场合，请改用其他风格。
:::

## 注意事项

1. **单位选择**：`formatRelative` 取间隔真正填满的最粗单位，再在该单位内取整。当取整正好顶到下一个单位的门口——59.6 分钟取整成「60 分钟」——它会自动进位，于是你读到的是「1 小时前」。
2. **对称取整**：先对绝对值取整再补回符号。因为 JavaScript 里 `Math.round(-1.5)` 是 `-1`，否则 90 分钟前会显示「1 小时前」，而 90 分钟后却显示「2 小时后」。
3. **格式化器复用**：`Intl.RelativeTimeFormat` 实例按 locale/style/numeric 组合缓存，因此渲染一百条时间戳的列表只会构造一个格式化器，而不是一百个。
4. **降级**：在没有 `Intl.RelativeTimeFormat` 的运行时上会回退到 compact 形态，而不是抛错。
