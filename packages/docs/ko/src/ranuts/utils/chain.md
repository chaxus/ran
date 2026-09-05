# Chain

메서드를 이어 붙여 쓰는 DOM 조작 클래스입니다. 요소 만들기, 속성 넣기, 이벤트 구독 따위를 합니다.

## API

### Chain

#### 생성자

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### 주요 메서드

| 메서드             | 설명                                  | 반환값  |
| ------------------ | ------------------------------------- | ------- |
| `setAttribute`     | 요소에 속성을 넣습니다                | `Chain` |
| `removeAttribute`  | 요소에서 속성을 뗍니다                | `Chain` |
| `append`           | 자식 요소를 붙입니다                  | `Chain` |
| `remove`           | 자식 요소를 뗍니다                    | `Chain` |
| `setTextContent`   | 텍스트 내용을 정합니다                | `Chain` |
| `setStyle`         | 스타일을 정합니다                     | `Chain` |
| `addChild`         | 자식 요소를 붙입니다(배열도 받습니다) | `Chain` |
| `listen`           | 이벤트 리스너를 답니다                | `Chain` |
| `clearListener`    | 이벤트 리스너를 뗍니다                | `Chain` |
| `clearAllListener` | 모든 이벤트 리스너를 뗍니다           | `Chain` |

#### 속성

| 프로퍼티  | 설명     | 타입          |
| --------- | -------- | ------------- |
| `element` | DOM 요소 | `HTMLElement` |

## 예시

### 기본 사용법

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### 메서드 체이닝

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('눌러 보세요')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('버튼을 눌렀습니다');
  });

document.body.appendChild(button.element);
```

### 자식 요소 붙이기

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('제목'))
  .addChild(new Chain('p').setTextContent('본문'));

document.body.appendChild(container.element);
```

### 자식 요소 한꺼번에 붙이기

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('항목 1'),
  new Chain('li').setTextContent('항목 2'),
  new Chain('li').setTextContent('항목 3'),
]);

document.body.appendChild(list.element);
```

### SVG 요소

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## 참고

1. **체이닝**: 모든 메서드가 `Chain` 인스턴스를 돌려주므로 이어 붙여 쓸 수 있습니다.
2. **SVG 지원**: SVG 태그를 알아서 가려내 올바른 네임스페이스로 만듭니다.
3. **이벤트 관리**: 안에서 이벤트 리스너 대응표를 들고 있어 챙기고 떼기가 쉽습니다.
4. **활용**: DOM 구조를 동적으로 짜거나 UI 부품을 만드는 데 흔히 쓰입니다.
