# 실행 시간 재기

성능을 살피려고 함수가 얼마나 걸리는지 재야 할 때가 있어, 그 용도로 `startTask`와 `taskEnd`를 마련했습니다. 시간을 재는 다른 세 가지 방법도 함께 소개합니다.

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask`와 `taskEnd`

### 1. startTask

일이 시작되기 전에 부릅니다.

#### 반환값

| 매개변수 | 설명 | 타입 |
| --------- | --------------- | --------------- |
| taskId | 일의 식별자 | `unique symbol` |

### 2. taskEnd

일이 끝났을 때 부릅니다. `startTask`가 돌려준 식별자가 필요합니다.

#### 옵션

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | --------------- | --------------- | -------- |
| taskId | 일의 식별자 | `unique symbol` | 필수 |

#### 반환값

| 매개변수 | 설명 | 타입 |
| --------- | ------------------- | -------- |
| `time` | 일에 걸린 시간 | `number` |

### 3. 사용 예

```js
const taskId = startTask();

// 무언가를 합니다

const time = taskEnd(taskId);

console.log('일에 걸린 시간:', time);
```

## II. new Date().getTime()

`new Date().getTime()`은 1970년 1월 1일 00:00:00 UTC(협정 세계시)부터 그 날짜 객체가 나타내는 시각까지의 밀리초 수를 숫자로 돌려줍니다. 이것으로 JS 실행 시간을 재려 하면 두 가지 문제가 있습니다.

1. 어떤 경우에는 밀리초 정밀도로는 모자랍니다.
2. `new Date()`가 해석한 시각이 브라우저나 기기마다 다를 수 있습니다. [MDN 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > 브라우저마다 다르고 일관되지도 않으므로, 날짜 문자열을 해석하는 데 Date 생성자(그리고 그와 같은 Date.parse)를 쓰지 않기를 강력히 권합니다. RFC 2822 형식의 날짜는 관례적으로만 지원됩니다. ISO 8601 형식은, 날짜만 있는 문자열(예: "1970-01-01")이 지역 시각이 아니라 UTC로 다뤄져 다른 형식의 처리와 다릅니다.

## III. `console.time()`, `console.timeEnd()`

어떤 일이 얼마나 걸리는지 좇는 타이머를 시작합니다. 타이머마다 이름이 겹치지 않아야 하며, 한 쪽에서 동시에 최대 10,000개까지 돌릴 수 있습니다. 타이머 이름을 인자로 `console.timeEnd()`를 부르면, 브라우저가 그 타이머의 경과 시간을 밀리초로 찍어 냅니다. `new Date().getTime()`에 견주면 이 방법이 더 정밀해서 0.001밀리초(예: 0.134ms)까지 읽힙니다.

## IV. `performance.now()`

`performance.now()`는 마이크로초까지의 정밀도로 시각을 돌려주며, 시스템 시각에 좌우되지 않습니다(시스템 시계는 손으로 고쳐질 수도 있고 NTP 같은 소프트웨어가 건드릴 수도 있습니다). 게다가 `performance.timing.navigationStart + performance.now()`는 대략 `Date.now()`와 같습니다. 그러니 JS 실행 시간을 잴 때는 `performance.now()`가 더 권할 만한 선택입니다.

> 참고: 타이밍 공격과 핑거프린팅을 막기 위해, 브라우저 설정에 따라 `performance.now()`의 정밀도가 낮아질 수 있습니다. `Firefox`에서는 `privacy.reduceTimerPrecision` 설정이 기본으로 켜져 있고 기본값은 `1ms`입니다. `privacy.resistFingerprinting`을 켜면 정밀도가 100ms나 `privacy.resistFingerprinting.reduceTimerPrecision.microseconds` 값 가운데 큰 쪽으로 바뀝니다.
