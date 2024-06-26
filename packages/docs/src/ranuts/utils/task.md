# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## 一.`startTask`,`taskEnd`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| ------ | -------- | ---------------- |
| taskId | 任务标识 | `unique symbol ` |

### 2.taskEnd

任务结束的时候执行，需要传入`startTask`返回的任务标识

#### Options

| 参数   | 说明     | 类型             | 默认值                                     |
| ------ | -------- | ---------------- | ------------------------------------------ |
| taskId | 任务标识 | `unique symbol ` | 无默认值，参数必传，否则无法识别是哪个任务 |

#### Return

| 参数   | 说明             | 类型     |
| ------ | ---------------- | -------- |
| `time` | `task`执行的时间 | `number` |

### 3.使用例子

```js
const taskId = startTask();

// do something

const time = taskEnd(taskId);

console.log('task 执行花费的时间', time);
```

## 二.new Date().getTime()

`new Date().getTime()` 返回一个数值，表示从 1970 年 1 月 1 日 0 时 0 分 0 秒（UTC，即协调世界时）距离该日期对象所代表时间的毫秒数。用来计算 JS 执行时间会有两个问题：

1. 某些情况下，毫秒级精度可能不够。
2. `new Date()` 解析的时间在不同浏览器，或者不同设备上可能并不一致。[MDN 说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > 由于浏览器之间的差异与不一致性，强烈不推荐使用 Date 构造函数来解析日期字符串 (或使用与其等价的 Date.parse)。对 RFC 2822 格式的日期仅有约定俗成的支持。对 ISO 8601 格式的支持中，仅有日期的串 (例如 "1970-01-01") 会被处理为 UTC 而不是本地时间，与其他格式的串的处理不同。

## 三.`console.time()`, `console.timeEnd()`

启动一个计时器来跟踪某一个操作的占用时长。每一个计时器必须拥有唯一的名字，页面中最多能同时运行 10,000 个计时器。当以此计时器名字为参数调用 console.timeEnd() 时，浏览器将以毫秒为单位，输出对应计时器所经过的时间。比起`new Date().getTime()`，统计时间更加精确，可以统计到 0.001 毫秒(比如：0.134ms)

## 四.`performance.now()`

`performance.now()`返回的时间精度最高可达微秒级，且不会受到系统时间的影响（系统时钟可能会被手动调整或被 NTP 等软件篡改）。另外，`performance.timing.navigationStart + performance.now()` 约等于 `Date.now()`。因此对于统计 JS 执行耗时方面，更推荐使用`performance.now()`。

> 注意：为了提供对定时攻击和指纹的保护，`performance.now()` 的精度可能会根据浏览器的设置而被舍弃。 在 `Firefox` 中，`privacy.reduceTimerPrecision` 偏好是默认启用的，默认值为 `1ms`。可以启用 `privacy.resistFingerprinting` 这将精度改为 100ms 或`privacy.resistFingerprinting.reduceTimerPrecision.microseconds` 的值，以较大者为准。
