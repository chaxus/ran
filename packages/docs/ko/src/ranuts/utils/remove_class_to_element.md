# removeClassToElement

지정한 DOM 요소에서 CSS 클래스 이름을 없앱니다.

## API

### removeClassToElement

#### 반환값

반환값 없음(`void`)

#### 매개변수

| 매개변수      | 설명             | 타입      | 기본값 |
| ------------- | ---------------- | --------- | ------ |
| `element`     | DOM 요소         | `Element` | 필수   |
| `removeClass` | 없앨 클래스 이름 | `string`  | 필수   |

## 예시

### 기본 사용법

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// element에서 'active' 클래스가 사라졌습니다
```

### 조건부 제거

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### 서버에서의 안전성

```js
import { removeClassToElement } from 'ranuts';

// 서버 환경에서는 오류를 던지지 않고 조용히 넘어갑니다
removeClassToElement(element, 'class-name'); // 서버: 아무 일도 없음
```

## 참고

1. **존재 확인**: 요소가 그 클래스를 가지고 있을 때만 없앱니다.
2. **서버에서의 안전성**: 서버 환경(`document` 객체가 없음)에서는 오류를 던지지 않고 조용히 처리합니다.
3. **classList를 씁니다**: 현대적인 `classList.remove()`를 쓰므로 `className`을 직접 만지는 것보다 안전합니다.
