# randomColor

무작위 색 객체를 생성합니다.

## API

### randomColor

#### 반환값

| 인자    | 설명           | 타입    |
| ------- | -------------- | ------- |
| `Color` | 무작위 색 객체 | `Color` |

#### 매개변수

매개변수 없음

## 예시

### 기본 사용법

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2'(무작위)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### 무작위 색의 값 가져오기

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### 무작위 색 여러 개 생성하기

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`색 ${index + 1}:`, color.hex);
});
```

### 무작위 색 적용하기

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## 참고

1. **무작위 생성**: 부를 때마다 무작위 16진수 색을 생성합니다.
2. **완전한 객체**: hex, rgb, hsl 등 모든 속성을 갖춘 `Color` 객체를 반환합니다.
3. **색 형식**: 생성된 색 값에는 `#`가 붙어 있어 CSS에 그대로 쓸 수 있습니다.
4. **활용**: 무작위 색 생성, 색상 선택기, 데이터 시각화 등에 흔히 쓰입니다.
