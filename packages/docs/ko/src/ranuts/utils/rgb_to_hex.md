# rgbToHex

RGB 값을 16진수 색 값으로 바꿉니다.

## API

### rgbToHex

#### 반환값

| 인자     | 설명         | 타입     |
| -------- | ------------ | -------- |
| `string` | 16진수 색 값 | `string` |

#### 매개변수

| 매개변수 | 설명                  | 타입                        | 기본값 |
| -------- | --------------------- | --------------------------- | ------ |
| `r`      | 빨강 값 또는 RGB 배열 | `string \| number \| Array` | 필수   |
| `g`      | 초록 값(선택)         | `string \| number`          | `0`    |
| `b`      | 파랑 값(선택)         | `string \| number`          | `0`    |

## 예시

### 기본 사용법

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### 배열로 넘기기

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### 색 변환

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// 다시 RGB로
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### 색을 동적으로 만들기

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## 참고

1. **인자 넘기는 방법**: 세 가지를 지원합니다.
   - 인자 세 개: `rgbToHex(r, g, b)`
   - 배열 하나: `rgbToHex([r, g, b])`
   - 문자열이든 숫자든: 알아서 변환합니다

2. **반환값**: 언제나 `#`가 붙은 16진수 색 값을 반환합니다.

3. **값의 범위**: RGB 값은 보통 0–255이며, 범위를 벗어난 값도 그대로 16진수로 바뀝니다.

4. **활용**: 색 변환, CSS 색 생성, 색 가공 등에 흔히 쓰입니다.
