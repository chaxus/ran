# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask`, `taskEnd`

### 1. startTask

Execute before the task begins.

#### Return

| Parameter | Description     | Type            |
| --------- | --------------- | --------------- |
| taskId    | Task identifier | `unique symbol` |

### 2. taskEnd

Execute when task ends, requires task identifier returned by `startTask`.

#### Options

| Parameter | Description     | Type            | Default  |
| --------- | --------------- | --------------- | -------- |
| taskId    | Task identifier | `unique symbol` | Required |

#### Return

| Parameter | Description         | Type     |
| --------- | ------------------- | -------- |
| `time`    | Task execution time | `number` |

### 3. Usage Example

```js
const taskId = startTask();

// do something

const time = taskEnd(taskId);

console.log('Task execution time:', time);
```

## II. new Date().getTime()

`new Date().getTime()` returns a numeric value representing the number of milliseconds from January 1, 1970, 00:00:00 UTC (Coordinated Universal Time) to the time represented by the date object. There are two problems when using it to calculate JS execution time:

1. In some cases, millisecond precision may not be sufficient.
2. The time parsed by `new Date()` may not be consistent across different browsers or devices. [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > Due to differences and inconsistencies between browsers, it is strongly recommended not to use the Date constructor to parse date strings (or use Date.parse which is equivalent). There is only conventional support for RFC 2822 format dates. For ISO 8601 format support, only date strings (e.g., "1970-01-01") will be treated as UTC rather than local time, which differs from other format string handling.

## III. `console.time()`, `console.timeEnd()`

Start a timer to track the duration of an operation. Each timer must have a unique name, and a page can run up to 10,000 timers simultaneously. When `console.timeEnd()` is called with the timer name as a parameter, the browser will output the elapsed time of the corresponding timer in milliseconds. Compared to `new Date().getTime()`, time statistics are more precise, can be accurate to 0.001 milliseconds (e.g., 0.134ms).

## IV. `performance.now()`

`performance.now()` returns time with precision up to microseconds, and is not affected by system time (system clock may be manually adjusted or tampered with by NTP and other software). Additionally, `performance.timing.navigationStart + performance.now()` approximately equals `Date.now()`. Therefore, `performance.now()` is more recommended for statistics on JS execution time.

> Note: To provide protection against timing attacks and fingerprinting, the precision of `performance.now()` may be reduced based on browser settings. In `Firefox`, the `privacy.reduceTimerPrecision` preference is enabled by default with a default value of `1ms`. Enabling `privacy.resistFingerprinting` will change the precision to 100ms or the value of `privacy.resistFingerprinting.reduceTimerPrecision.microseconds`, whichever is larger.
