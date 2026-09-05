---
description: 'ranui/builder는 SwiftUI·Solid 식의 세밀한 반응성을 갖춘, 프레임워크 없는 체이닝 DOM 빌더입니다. 한 번 짓고, 그다음부터는 시그널이 묶인 노드만 갱신합니다.'
---

# Builder

`ranui/builder`는 가상 DOM 없이, 세밀한 반응성으로 DOM을 선언적으로 짓습니다. 컴포넌트들 자체가 이것으로 쓰였고, 앱이 자기 레이아웃과 연결 코드에도 쓸 수 있도록 독립된 진입점으로 공개되어 있습니다.

> **이럴 때 씁니다.** 프레임워크 없이 반응형 뷰(페이지, 라우트, 위젯)를 만들고 싶을 때, 또는 커스텀 엘리먼트를 쓰면서 ranui가 내부에서 쓰는 것과 같은 조립 방식을 원할 때.

> **원칙: 한 번 짓고, 제자리에서 갱신한다.** 뷰 함수는 **한 번만** 돕니다. 상태가 바뀌면 그 시그널에 묶인 노드만 갱신되고, 트리를 다시 그리는 일은 없습니다. 형태에 맞는 프리미티브를 고르세요. 값이면 getter 바인딩, 조건이면 `Show` / `Switch`, 목록이면 `For` / `Index`입니다.

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // 요소 팩토리
  signal,
  computed,
  createEffect,
  batch,
  untrack, // 반응성
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // 소유권
  EventManager, // 생명주기에 묶인 이벤트
} from 'ranui/builder';
```

빌더는 커스텀 엘리먼트를 **하나도** 등록하지 않습니다. `<r-button>` 같은 것을 쓰려면 컴포넌트 진입점도 import하세요: `import 'ranui/button'`.

## 요소

팩토리는 체이닝 가능한 `ElementBuilder`를 돌려주고, `build()`가 DOM 노드를 돌려줍니다.

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`, `Span()`, `ButtonBuilder()`, `InputBuilder()`, `Label()`, `Ul()`, `Li()`, `Section()`, `Article()`, `Nav()`, `Header()`, `Footer()`, `Main()`, `Style()`, `Slot()`, 그리고 커스텀 엘리먼트를 포함해 그 밖의 모든 것을 위한 `View('any-tag')`가 있습니다.

### 체이닝 API

| 묶음          | 메서드                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------- |
| 식별자·클래스 | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                    |
| 어트리뷰트    | `attr(name, v)`, `attrs({…})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`                 |
| 스타일        | `style(prop, v)` / `style({…})`, `cssVar(name, v)`                                                            |
| 접근성        | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)`   |
| 내용          | `text(v)`, `children(…nodes)`, `replaceChildren(…nodes)`                                                      |
| ref·shadow    | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                              |
| 이벤트        | `on(type, handler, options?)`, `listen(manager, type, handler)`, `delegate(manager, selector, type, handler)` |
| 마무리        | `build()`, `serialize()`(SSR용 HTML 문자열)                                                                   |

`children()`은 요소, 문자열, 다른 빌더, 배열, `null` / `undefined`(건너뜁니다), 그리고 getter(아래의 살아 있는 영역)를 받습니다.

### Ref

`createRef<T>()`와 `.ref(holder)`로 지어진 요소를 붙잡습니다. ref에 컴포넌트의 요소 클래스를 타입으로 주면, 캐스팅 없이 그 명령형 메서드를 쓸 수 있습니다.

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## 반응성

```js
const [count, setCount] = signal(0);
count(); // 읽기 — 이펙트와 메모 안에서는 추적됩니다
setCount(1); // 쓰기. setCount((n) => n + 1)도 됩니다
// 값이 그대로인 쓰기는 아무 일도 하지 않습니다(Object.is. signal(v, { equals })로 바꿀 수 있음)

const double = computed(() => count() * 2); // 지연 평가 + 메모이제이션

const dispose = createEffect(() => {
  console.log(count()); // 지금 실행되고, 의존이 바뀔 때마다 다시 실행됩니다
  return () => {
    /* 선택적 정리. 다음 실행 전과 폐기 시에 돕니다 */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // 한 번만 흘려보내고, 이펙트는 중복 제거됩니다
untrack(() => count()); // 구독 없이 읽기
```

- **`computed`는 지연 평가입니다**. 아무도 읽지 않는 메모는 다시 계산되지 않고, _값_ 이 바뀔 때만 다시 알리므로 안정된 메모 뒤의 이펙트는 다시 돌지 않습니다.
- **이펙트는 스스로 추적합니다**. 마지막 실행에서 읽은 시그널만 구독으로 남으므로, 조건 분기가 낡은 구독을 남기는 일이 없습니다.
- **순환하는 이펙트는 돌지 않고 예외를 던집니다**. 자기가 읽는 시그널에 쓰는 이펙트는 버그이므로, 런타임은 영원히 돌게 두는 대신 예외를 냅니다.

### 반응형 바인딩

`text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`, `role`, `label`은 모두 **getter**를 받습니다. 그래서 명시적인 이펙트 없이도 바인딩이 스스로 갱신됩니다.

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

반응형이 되는 것은 값 하나짜리 형태뿐입니다. `style(prop, getter)`는 반응형이지만, `style({…})`과 `attrs({…})`의 맵 형태는 한 번만 적용됩니다.

### 조건과 목록

| 형태                    | 쓸 것                                | 동작                                                      |
| ----------------------- | ------------------------------------ | --------------------------------------------------------- |
| 갈래가 하나             | `Show({ when, children, fallback })` | `when`의 _참·거짓_ 이 뒤집힐 때만 다시 짓습니다.          |
| 갈래가 여럿             | `Switch` + `Match`                   | 고른 갈래가 바뀔 때만 다시 짓습니다.                      |
| 안정된 id가 있는 목록   | `For({ each, key, render })`         | `key`로 항목을 맞추고 **그 노드를 재사용합니다**.         |
| 위치가 곧 정체성인 목록 | `Index({ each, render })`            | 각 위치의 노드를 재사용하고, 항목 자체가 시그널이 됩니다. |
| 형태째 바뀌는 내용      | 자식 자리에 놓은 맨 getter           | 거친 방법. 읽을 때마다 영역 전체를 헐고 다시 짓습니다.    |

```js
Ul().children(
  For({
    each: () => rows(), // 반응형 원본 배열
    key: (row) => row.id, // 안정적이고 유일하게
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

`For`가 실제로 무언가를 재사용하는지는 네 가지 규칙이 정합니다.

- **`key`는 유일해야 합니다.** 겹친 것은 무시되고(첫 항목만 그려집니다) 개발 모드에서 경고가 뜹니다. 배열 인덱스를 키로 쓰지 마세요. 순서를 바꿀 때 재사용이 무너집니다.
- **새 배열로 갱신하세요.** `each`는 시그널을 읽으므로, 같은 배열을 제자리에서 바꿔 다시 넣으면 동등성 비교에 걸려 건너뛰고 목록이 갱신되지 않습니다.
- **`render`는 항목마다 한 번씩만 돕니다.** 목록이 바뀔 때마다가 아닙니다. 줄마다의 갱신은 시그널로 이끄세요. `index`는 getter라서 순서가 바뀐 뒤에도 옳게 남습니다.
- **항목을 없애면 그 줄의 스코프가 폐기됩니다.** 거기 있던 이펙트와 정리 함수도 함께 사라집니다.

자식 자리에 맨 getter를 두기보다 `Show` / `For`를 고르세요. getter는 읽은 값이 바뀔 때마다(결과가 달라지지 않는 변화라도) 영역 전체를 다시 짓기 때문에, 그 안의 포커스, 스크롤 위치, 입력값, 트랜지션이 사라집니다.

## 소유권

모든 이펙트, 메모, 반응형 바인딩은 그것을 만든 스코프가 소유합니다. 스코프를 폐기하면 그 아래의 모든 것이 함께 폐기됩니다.

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // 이 바인딩은 루트가 소유합니다
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // 바인딩의 이펙트를 걷어내고 정리 함수를 실행합니다
```

**반응형 UI는 `createRoot` 안에서 지으세요.** 소유자 없이 만든 바인딩도 동작은 하지만, 자동으로 폐기되지 않습니다.

### 페이지 단위 정리

페이지나 라우트마다 자기 루트를 주고, 이동할 때 폐기하세요. 그 페이지가 만든 이펙트, 바인딩, 타이머, 리스너가 한 번의 호출로 사라집니다.

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/ko/src/ranui/route/)에는 이것이 들어 있습니다. `src`를 쓰면 경로가 맞을 때 페이지 모듈을 import하고, 그 기본 내보내기가 `createRoot` 안에서 돌며, 떠날 때 그 루트가 폐기됩니다. `getOwner()` / `runWithOwner()`로 라우터가 `await`를 건너 스코프를 나를 수 있습니다.

::: warning 웹 컴포넌트 안에서는 getter 바인딩을 쓰지 마세요
컴포넌트의 `constructor`와 `connectedCallback`은 **반응형 스코프가 아닙니다**. 거기서 만든 getter 바인딩이나 `createEffect`는 주인 없는 고아가 되어 결코 폐기되지 않습니다. 떨어져 나간 노드 위에서 계속 발동하고, 시그널이 요소보다 오래 살아남으면 그 요소를 메모리에 붙들어 둡니다. 평범한 값으로 짓고, 갱신은 명시적인 `createEffect`로 이끌되 그 폐기 함수를 모아 두었다가 `disconnectedCallback`에서 부르고, 다시 연결될 때 새로 걸어 주세요. [코딩 지침](/ko/src/ranui/coding-guides/)을 보세요.
:::

## 커스텀 엘리먼트 안의 리스너

`EventManager`는 `AbortController`에 기대고 있으므로, 한 번의 호출로 모든 리스너를 걷어냅니다.

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // 전부 걷어내고, 다음 연결을 위해 초기화합니다
}
```

## 서버 렌더링

빌더는 [SSR](/ko/src/ranui/ssr/)에서도 동작합니다. `build()`는 흉내 낸 노드를, `serialize()`는 HTML을 돌려줍니다. 반응형 바인딩과 `For`, `Show`는 서버에서 **한 번만** 그려져 정적인 스냅숏이 됩니다. 브라우저에서 코드가 돌기 전까지 조정은 일어나지 않습니다.

## 전체 레퍼런스

이 페이지는 실무에서 쓰는 부분만 담았습니다. 완전한 레퍼런스(모든 팩토리, 모든 연산자, SVG 네임스페이스 규칙, `Switch` / `Match` 세부 사항)는 저장소의 [BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md)에 있으며, npm 패키지 안에도 함께 들어 있습니다.
