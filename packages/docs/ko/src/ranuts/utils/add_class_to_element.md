# addClassToElement

지정한 DOM 요소에 CSS 클래스 이름을 더합니다.

## API

### addClassToElement

#### 반환값

반환값 없음(`void`)

#### 매개변수

| 매개변수   | 설명             | 타입      | 기본값 |
| ---------- | ---------------- | --------- | ------ |
| `element`  | DOM 요소         | `Element` | 필수   |
| `addClass` | 더할 클래스 이름 | `string`  | 필수   |

## 예시

### 기본 사용법

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// 이제 element에 'active' 클래스가 있습니다
```

### 중복해서 더하지 않기

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // 중복해서 더하지 않습니다
```

### 서버에서의 안전성

```js
import { addClassToElement } from 'ranuts';

// 서버 환경에서는 오류를 던지지 않고 조용히 넘어갑니다
addClassToElement(element, 'class-name'); // 서버: 아무 일도 없음
```

## 참고

1. **중복 확인**: 요소에 이미 그 클래스가 있으면 다시 더하지 않습니다.
2. **서버에서의 안전성**: 서버 환경(`document` 객체가 없음)에서는 오류를 던지지 않고 조용히 처리합니다.
3. **classList를 씁니다**: 현대적인 `classList.add()`를 쓰므로 `className`을 직접 만지는 것보다 안전합니다.
