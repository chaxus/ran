# hexToRgb

16진수 색 값을 RGB 배열로 바꿉니다.

## API

### hexToRgb

#### 반환값

| 인자                    | 설명                         | 타입                    |
| ----------------------- | ---------------------------- | ----------------------- |
| `Array<number> \| null` | RGB 배열 [r, g, b] 또는 null | `Array<number> \| null` |

#### 매개변수

| 매개변수 | 설명         | 타입     | 기본값 |
| -------- | ------------ | -------- | ------ |
| `hex`    | 16진수 색 값 | `string` | 필수   |

## 예시

### 기본 사용법

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### 잘못된 값 다루기

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### `#`는 있어도 없어도 됩니다

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### 색 변환

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// 다시 16진수로
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## 참고

1. **받는 형식**: 여섯 자리 16진수 색 값을 지원합니다(`#ff0000`이든 `ff0000`이든 됩니다).
2. **반환값**: 성공하면 `[r, g, b]` 배열을, 실패하면 `null`을 반환합니다.
3. **대소문자**: `#FF0000`과 `#ff0000`을 똑같이 다룹니다.
4. **활용**: 색 변환, 색 가공, CSS 색 처리 등에 흔히 쓰입니다.
