# 가상 DOM (vnode)

Snabbdom 식의 가벼운 가상 DOM입니다. 화면을 평범한 자바스크립트 객체(`VNode`)로 나타내고, 옛 트리와 새 트리를 견주어 달라진 곳만 진짜 DOM에 반영합니다.

- `init()`은 조정기를 꾸리고 `patch` 함수를 돌려줍니다. 함께 딸려 오는 모듈(class / props / attrs / style / events)은 알아서 등록됩니다.
- `patch(oldVnode, newVnode)`는 `oldVnode`가 진짜 DOM 요소면 트리를 붙이고, 아니면 vnode 트리 둘을 견주어 DOM을 그 자리에서 고칩니다.
- `h(sel, dataOrChildren?, children?)`는 `VNode`를 짓는 하이퍼스크립트 도우미입니다.

## 가져오기

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> 참고: 이 구현의 `init()`은 **인자를 받지 않습니다**. 모듈 묶음이 고정되어 있고 안에서 등록되므로, `*Module` 하나하나를 `init`에 넘길 필요가 없습니다. 내보내는 것은 살펴보고 확인하라는 뜻입니다.

## 예시

### 빠른 시작

```js
import { init, h } from 'ranuts/vnode';

// init()은 `patch` 함수를 돌려줍니다.
// 함께 딸려 오는 모듈(class, props, attrs, style, events)은 알아서 등록됩니다.
const patch = init();

const container = document.getElementById('app');

// vnode 트리 짓기
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// 첫 그리기. 옛 vnode 자리에 진짜 DOM 요소를 넘기면 그 안에 붙습니다
patch(container, vnode);

// 그다음. 새로 고친 트리를 짓고, 앞의 vnode를 그리로 patch 합니다.
// DOM에 닿는 것은 달라진 곳(텍스트, 스타일, 리스너)뿐입니다.
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // 다음 patch를 위해 최신 트리를 쥐고 있습니다
```

### `h`로 노드 짓기

```js
// 태그만
h('div');

// 태그 + data
h('div', { class: { active: true } });

// 태그 + 텍스트 자식 하나
h('span', 'hello');

// 태그 + 자식 배열
h('ul', [h('li', 'one'), h('li', 'two')]);

// 태그 + data + 자식
h('a', { attrs: { href: '/home' } }, 'Home');

// CSS 식 선택자로 id와 클래스가 정해집니다
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// 선택자가 "svg"로 시작하면 SVG 네임스페이스가 알아서 붙습니다
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

조정기를 만들고 `patch` 함수를 돌려줍니다. 함께 딸려 오는 모듈은 안에서 등록되므로 인자는 받지 않습니다.

#### 반환값

| 값      | 설명                                               | 타입                                                  |
| ------- | -------------------------------------------------- | ----------------------------------------------------- |
| `patch` | vnode 트리를 진짜 DOM에 붙이거나 견주어 반영합니다 | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

`init()`이 돌려주는 함수입니다. 첫 호출에서는 `oldVnode` 자리에 진짜 DOM `Element`를 넘기면 그 안에 트리가 붙습니다. 그다음부터는 앞의 `VNode`를 넘겨 견주어 그 자리에서 고칩니다. 새 `VNode`가 돌아오니, 그것을 다음 호출의 「옛 것」으로 쥐고 계세요.

#### 매개변수

| 매개변수   | 설명                                | 타입               |
| ---------- | ----------------------------------- | ------------------ |
| `oldVnode` | 앞의 vnode. 처음 붙일 때는 DOM 요소 | `VNode \| Element` |
| `vnode`    | 그리려는 새 vnode 트리              | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

`VNode`를 짓는 하이퍼스크립트 도우미입니다. 이렇게 여러 꼴로 부를 수 있습니다.

| 시그니처                 | 설명                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `h(sel)`                 | 선택자 하나만으로 만드는 요소                              |
| `h(sel, data)`           | `VNodeData`가 붙은 요소(`data`는 `null`이어도 됩니다)      |
| `h(sel, children)`       | 자식이 붙은 요소. 문자열이나 숫자, `VNode` 하나, 또는 배열 |
| `h(sel, data, children)` | 데이터와 자식을 함께 가진 요소                             |

#### 매개변수

| 매개변수   | 설명                                                                                                                     | 타입                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `sel`      | CSS 식 선택자. `tag`, `tag#id`, `tag.class`, 또는 이들의 조합(`div#id.a.b`). `svg…`면 SVG 네임스페이스가 알아서 붙습니다 | `string`            |
| `data`     | 노드의 데이터. class / props / attrs / style / 리스너 / key / hook. `null`이어도 됩니다                                  | `VNodeData \| null` |
| `children` | 문자열이나 숫자(텍스트 노드가 됩니다), `VNode` 하나, 또는 그것들의 배열                                                  | `VNodeChildren`     |

#### `VNodeData`의 필드

| 필드    | 설명                                                                 | 타입                                          | 적용하는 모듈              |
| ------- | -------------------------------------------------------------------- | --------------------------------------------- | -------------------------- |
| `props` | `elm[key] = value` 꼴로 넣는 DOM 프로퍼티                            | `Record<string, any>`                         | `propsModule`              |
| `attrs` | `setAttribute`로 넣는 HTML 속성(`true`·`false`로 붙였다 뗐다 합니다) | `Record<string, string \| number \| boolean>` | `attributesModule`         |
| `class` | 조건부 클래스. `name → boolean` 대응                                 | `Record<string, boolean>`                     | `classModule`              |
| `style` | 인라인 스타일. `name → value` 대응(`--var` 키는 CSS 변수가 됩니다)   | `Record<string, any>`                         | `styleModule`              |
| `on`    | 이벤트 리스너. `event → handler`(핸들러 배열도 됩니다)               | `Record<string, Function \| Function[]>`      | `eventListenersModule`     |
| `key`   | 비교 알고리즘이 자식을 짝짓고 자리를 옮길 때 쓰는, 변하지 않는 표식  | `string \| number`                            | (비교의 알맹이)            |
| `ns`    | 네임스페이스 URI(SVG 하위 트리에는 알아서 붙습니다)                  | `string`                                      | (비교의 알맹이)            |
| `hook`  | vnode마다 두는 생명주기 훅(`Hooks`)                                  | `Hooks`                                       | (타입으로만. 참고 글 보기) |

> 참고: `hook`과 `Hooks` 타입은 공개된 타입의 일부입니다. 다만 이 다듬어진 구현은 **모듈**의 생명주기(`create` / `update` / `destroy`)를 통해 DOM을 움직입니다. vnode마다 두는 `data.hook` 콜백은 지금의 `patch` 루프가 부르지 않습니다.

### 모듈

모듈은 저마다 `VNodeData`의 한 조각을 맡습니다. `init()`이 그 전부를 등록하지만, 하나씩 따로도 내보냅니다.

| 내보내기               | 맡는 부분    | 설명                                                     |
| ---------------------- | ------------ | -------------------------------------------------------- |
| `classModule`          | `data.class` | `name → boolean` 대응을 보고 클래스를 붙였다 뗐다 합니다 |
| `propsModule`          | `data.props` | DOM 프로퍼티를 곧바로 대입합니다(`elm[key] = value`)     |
| `attributesModule`     | `data.attrs` | `setAttribute`로 HTML 속성을 넣고 뺍니다(xml·xlink 포함) |
| `styleModule`          | `data.style` | 인라인 스타일과 CSS 사용자 정의 속성을 넣습니다          |
| `eventListenersModule` | `data.on`    | 이벤트 리스너를 붙이고 뗍니다                            |
| `modules`              | —            | 모듈 이름과 모듈 본체를 이어 주는 기본 등록 객체         |

### 더 아래층의 내보내기

| 내보내기     | 타입                                        | 설명                                                                                                  |
| ------------ | ------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `vnode`      | `(sel, data, children, text, elm) => VNode` | `h`가 안에서 쓰는 낮은 층의 `VNode` 팩토리. 애플리케이션 코드에서는 `h`를 쓰세요.                     |
| `addNS`      | `(data, children, sel) => void`             | SVG 네임스페이스를 하위 트리 전체에 재귀로 입힙니다. `svg…` 선택자에서는 `h`가 알아서 부릅니다.       |
| `htmlDomApi` | `DOMAPI`                                    | `patch`가 안에서 쓰는 기본 브라우저 DOM 어댑터(노드 만들기·끼우기·빼기·텍스트 등).                    |
| `is`         | `{ array, isStr, primitive, isVnode }`      | vnode 내부 곳곳에서 쓰는 작은 타입 가드 도우미들.                                                     |
| `Chain`      | `class Chain`                               | 체이닝되는 명령형 DOM 빌더(`setAttribute`, `append`, `setTextContent` 등). vnode 비교와는 무관합니다. |
| `create`     | `(tagName, options?) => Chain`              | 새 `Chain`을 돌려주는 편의용 팩토리.                                                                  |

### 타입

| 타입                | 모양과 뜻                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }`. 가상 노드 그 자체                       |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }`. 필드는 위를 보세요               |
| `VNodes`            | `VNode[]`                                                                                     |
| `VNodeChildElement` | `VNode \| string \| number`                                                                   |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                                    |
| `ArrayOrElement<T>` | `T \| T[]`                                                                                    |
| `Key`               | `string \| number`                                                                            |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | `patch`가 쓰는 DOM 연산을 적어 둔 인터페이스(`htmlDomApi` 참고)                               |
| `Fragment`          | 프래그먼트를 다루려고 넓힌 `DocumentFragment`                                                 |
| `Modules`           | `Record<string, Record<string, ModuleHook>>`. 모듈 등록부의 생김새                            |
| `ModuleHook`        | 모듈 생명주기 콜백 하나                                                                       |

## 참고

1. **브라우저 전용입니다.** `ranuts/vnode`는 `document`와 DOM API를 건드립니다. Node가 아니라 브라우저 코드에서 가져오세요.
2. **마지막 vnode를 쥐고 계세요.** `patch`는 새 `VNode`를 돌려줍니다. 그것을 간직했다가 다음 갱신에서 `oldVnode`로 넘기면, 지금의 트리를 기준으로 차이를 계산합니다.
3. **`VNode`에서 `text`와 `children`은 서로 배타적입니다.** 노드는 텍스트 노드이거나 자식을 가진 요소이거나, 둘 중 하나입니다.
4. **목록에는 `key`를 주세요.** 바뀌는 목록을 그릴 때 형제들에게 변치 않는 `key` 값을 주면, 비교 과정이 노드를 새로 만드는 대신 짝지어 자리만 옮길 수 있습니다.
