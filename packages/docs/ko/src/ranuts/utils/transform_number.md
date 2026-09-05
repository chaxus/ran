# transformNumber

숫자를 단위가 붙은 문자열로 바꿉니다. 중국어 단위와 영어 단위를 모두 지원합니다.

## API

### transformNumber

#### 반환값

| 인자     | 설명            | 타입     |
| -------- | --------------- | -------- |
| `string` | 다듬어진 문자열 | `string` |

#### 매개변수

| 매개변수    | 설명                | 타입     | 기본값    |
| ----------- | ------------------- | -------- | --------- |
| `value`     | 바꿀 숫자 문자열    | `string` | 필수      |
| `locale`    | 로케일              | `string` | `'zh-CN'` |
| `precision` | 계산에 쓸 정밀도    | `number` | `2`       |
| `fixed`     | 보여 줄 소수 자릿수 | `number` | `2`       |

## 예시

### 기본 사용법

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (중국어로 만)
console.log(transformNumber('1000000')); // '100.00 万' (백만)
console.log(transformNumber('100000000')); // '1.00 亿' (억)
```

### 영어 단위

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### 정밀도 지정하기

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### 잘못된 입력 다루기

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## 참고

1. **단위 체계**:
   - `zh-CN`: 万(만), 亿(억), 万亿(조) — 네 자리마다
   - `zh-HK`: 萬, 億, 萬億 — 역시 네 자리마다
   - `en`: K(천), M(백만), B(십억), T(조) — 세 자리마다

2. **정밀도 처리**: `Mathjs`로 계산해 부동소수점 오차를 피합니다.

3. **잘못된 입력**: 들어온 값이 올바른 숫자가 아니면 `'--'`를 반환합니다.

4. **활용**: 금액, 조회 수, 팔로워 수처럼 큰 숫자를 보여 줄 때 흔히 쓰입니다.
