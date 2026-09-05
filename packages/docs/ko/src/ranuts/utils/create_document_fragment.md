# createDocumentFragment

`DocumentFragment`를 만들고 여러 자식 요소를 담습니다.

## API

### createDocumentFragment

#### 반환값

| 인자                            | 설명                    | 타입                            |
| ------------------------------- | ----------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | `DocumentFragment` 객체 | `DocumentFragment \| undefined` |

#### 매개변수

| 매개변수 | 설명             | 타입        | 기본값 |
| -------- | ---------------- | ----------- | ------ |
| `list`   | 담을 요소의 배열 | `Element[]` | 필수   |

## 예시

### 기본 사용법

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// 한 번에 DOM에 추가
document.body.appendChild(fragment);
```

### 요소를 한꺼번에 추가하기

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = '항목';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### 서버에서의 안전성

```js
import { createDocumentFragment } from 'ranuts';

// 서버 환경에서는 undefined를 반환합니다
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (서버 환경)
```

## 참고

1. **성능 개선**: `DocumentFragment`를 쓰면 DOM 조작 횟수를 줄일 수 있어 더 빨라집니다.
2. **서버에서도 안전**: 서버 환경(`document` 객체가 없는 경우)에서는 `undefined`를 반환하며 예외를 던지지 않습니다.
3. **한 번뿐**: 프래그먼트를 DOM에 추가하면 자식 요소들이 대상 요소로 옮겨 가고 프래그먼트 자체는 남지 않습니다.
4. **활용**: 요소를 한꺼번에 추가해 리플로와 리페인트를 줄이고 속도를 높이는 데 흔히 쓰입니다.
