# range

숫자를 정해진 최솟값과 최댓값 사이에 붙듭니다.

## API

### range

#### 반환값

| 인자     | 설명           | 타입     |
| -------- | -------------- | -------- |
| `number` | 범위에 든 숫자 | `number` |

#### 매개변수

| 매개변수 | 설명      | 타입     | 기본값 |
| -------- | --------- | -------- | ------ |
| `num`    | 붙들 숫자 | `number` | 필수   |
| `min`    | 최솟값    | `number` | `0`    |
| `max`    | 최댓값    | `number` | `1`    |

## 예시

### 기본 사용법

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (최댓값에 붙듭니다)
console.log(range(-5, 0, 10)); // 0 (최솟값에 붙듭니다)
```

### 백분율 붙들기

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### 직접 정한 범위

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (범위 밖이라 붙듭니다)
```

### 색 값 붙들기

```js
import { range } from 'ranuts';

const red = 300; // RGB 값은 0–255여야 합니다
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## 참고

1. **붙드는 방식**: 최솟값보다 작으면 최솟값을, 최댓값보다 크면 최댓값을 돌려주고, 그 밖에는 원래 값을 그대로 돌려줍니다.
2. **기본 범위**: 0에서 1까지입니다. 백분율이나 비율을 다루기에 알맞습니다.
3. **활용**: 사용자의 입력을 제한하거나 진행률, 색 값을 셈할 때 흔히 쓰입니다.

## 보간과 범위 옮기기

셰이더 식의 보간과 범위 옮기기입니다. GLSL의 `mix`/`clamp`/`smoothstep`이 주는 것과 같은 기본 도구지요. 애니메이션을 부드럽게 하거나, 스크롤 위치를 불투명도로 옮기거나, 서로 상관없는 수치 범위 사이를 오갈 때 쓸모가 있습니다.

### clamp

위의 `range`와 하는 일은 같고 인자의 차례가 GLSL 식입니다. `clamp(value, min, max)`와 `range(num, min, max)`의 차이지요. 이 무리와 발을 맞추려고 더했습니다. 부르는 자리에서 더 잘 읽히는 차례를 고르세요.

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)`는 `t`만큼 `a`에서 `b`로 보간합니다(`t=0`이면 `a`, `t=1`이면 `b`). `inverseLerp(a, b, value)`는 그 반대로, `a`와 `b` 사이의 `value`를 주면 그것이 어디쯤인지를 `0..1`로 돌려줍니다. 둘 다 붙들지 않습니다. `value`가 `[a, b]` 밖이면 `t`(또는 결과)도 `0..1` 밖으로 나갑니다.

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — 붙들지 않습니다
```

#### 매개변수

| 함수                       | 매개변수 | 설명            | 타입     |
| -------------------------- | -------- | --------------- | -------- |
| `lerp(a, b, t)`            | `a`, `b` | 시작 값과 끝 값 | `number` |
|                            | `t`      | 보간 비율       | `number` |
| `inverseLerp(a, b, value)` | `a`, `b` | 시작 값과 끝 값 | `number` |
|                            | `value`  | 자리를 묻는 값  | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)`는 `value`를 `[a1, a2]`에서 `[b1, b2]`로 선형으로 옮깁니다. 붙들지는 않습니다. `fit`은 붙드는 쪽입니다. 같은 옮기기를 한 뒤 출력 범위 안으로 붙듭니다.

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — [0,10] 밖이니 [0,100] 밖으로도 나갑니다

fit(15, 0, 10, 0, 100); // 100 — 출력 범위에 붙듭니다
```

### linearstep / smoothstep

둘 다 `x`가 `edge0`에서 `edge1`로 가는 동안 `0`에서 `1`로 올라가고, 그 밖에서는 붙듭니다. `linearstep`은 직선이고, `smoothstep`은 GLSL의 에르미트 보간 곡선(`3t² - 2t³`)입니다. 직선 대신 천천히 들고 천천히 놓는 모양이라, 애니메이션과 셰이더의 페이드에는 보통 이쪽을 고릅니다.

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5 (한가운데는 같고, 곡선이 다른 것은 그 밖의 자리)
smoothstep(0, 1, 0.1); // 0.028 — 부드러워져서 linearstep의 0.1보다 0을 늦게 떠납니다
```

#### Notes

1. **붙들지 않는 것: `lerp`, `inverseLerp`, `remap`.** 예상 범위 밖의 `value`나 `t`를 주면 오류도 붙든 값도 아닌, 바깥으로 뻗어 나간 결과가 나옵니다.
2. **붙드는 것: `fit`, `linearstep`, `smoothstep`.** 이 셋은 언제나 출력 범위 안의 값을 돌려줍니다.
3. `linearstep(edge0, edge1, x)`에서 `edge0 === edge1`이면, 0으로 나누는 대신 `x < edge0`일 때 `0`을, 그 밖에는 `1`을 돌려줍니다.
