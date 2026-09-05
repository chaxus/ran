# create

DOM 요소를 만드는 헬퍼 함수로, HTML과 SVG 요소를 모두 지원합니다.

## API

### create

#### 반환값

| 인자 | 설명 | 타입 |
| ------------- | ------------------- | ------------- |
| `HTMLElement` | 생성된 DOM 요소 | `HTMLElement` |

#### 매개변수

| 매개변수 | 설명 | 타입 | 기본값 |
| --------- | --------------------------- | ------------------------ | -------- |
| `tagName` | 태그 이름 | `string` | 필수 |
| `options` | 생성 옵션(선택) | `ElementCreationOptions` | 선택 |

## 예시

### 기본 사용법

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### SVG 요소 만들기

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### 생성 옵션 사용하기

```js
import { create } from 'ranuts';

// 커스텀 요소 만들기
const customElement = create('my-custom-element', { is: 'my-element' });
```

## 참고

1. **자동 인식**: SVG 태그를 알아서 알아보고 올바른 네임스페이스로 만듭니다.
2. **HTML 요소**: 일반 HTML 요소는 `document.createElement`로 만듭니다.
3. **SVG 요소**: SVG 요소는 `document.createElementNS`로 만듭니다.
4. **활용**: SVG 요소를 만들어야 하는 상황에서 절차를 줄여 줍니다.
