# ranui

Web Components를 바탕으로 한 실험적인 UI 컴포넌트 라이브러리입니다. 컴포넌트는 섀도 DOM에 싸여 있고, CSS 토큰으로 옷을 입으며, SSR과 Declarative Shadow DOM을 지원합니다.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## 먼저 읽어 주세요

아직 초기 단계에 있는 **실험적인 UI 라이브러리**입니다. 쓸 수는 있지만, 무엇보다 배우고 이것저것 해 보려고 만들었습니다.

요점:

- **초기 단계**: 기능은 아직 만들고 다듬는 중입니다.
- **실험적**: API가 자주 바뀔 수 있습니다.
- **배움이 먼저**: 주로 Web Components와 UI 개발을 익히려고 만든 것입니다.

## 무엇이 있나

1. **프레임워크를 가리지 않습니다:** React, Vue, Preact, SolidJS, Svelte는 물론 W3C 표준을 따르는 어떤 자바스크립트 프로젝트에서도 씁니다.
2. **브라우저가 아는 요소처럼:** `<r-button>`이나 `<r-modal>` 같은 사용자 정의 요소를 원래의 HTML 요소와 똑같이 씁니다.
3. **모듈로 갈라 둔 설계:** 통째로 가져오기와 컴포넌트별 가져오기를 모두 지원해, 유지하기도 쉽고 번들 크기도 손에 쥘 수 있습니다.
4. **섀도 DOM으로 감싸기:** 컴포넌트 속은 기본으로 바깥과 끊겨 있고, CSS 토큰과 `::part()`, `sheet` 속성이 정해진 꾸밈 통로를 내어 줍니다.
5. **타입스크립트:** 타입스크립트로 쓰였고 타입 정의도 함께 옵니다.
6. **SSR에 친절:** `defineSSR`, `renderToString`, Declarative Shadow DOM으로 서버 렌더링을 지원합니다.
7. **접근성:** ARIA 역할과 상태, 키보드만으로 하는 온전한 이동, 폼에 묶이는 입력(`<r-checkbox>`, `<r-input>`, `<r-select>`는 브라우저의 `FormData`에 실립니다), 라이브 리전 토스트, 그리고 `prefers-reduced-motion` 존중.

## 설치

npm을 쓴다면:

```console
npm install ranui --save
```

## 문서와 예제

[컴포넌트와 쓰는 예를 보세요](https://ran.chaxus.com/ko/src/ranui/)

### 컴포넌트와 API 레퍼런스

요소마다 속성, 프로퍼티, **이벤트(그 `detail`의 생김새까지)**, 슬롯, `::part()` 이름이 소스에서 뽑혀 나옵니다. 내보내기를 일일이 뒤질 필요가 없습니다.

- 요소별 API: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- 디자인 기준(색, 여백, 타이포그래피, 움직임, 접근성): [docs/DESIGN.md](./docs/DESIGN.md)

컴포넌트의 API를 바꿨다면 이것으로 다시 만드세요.

```bash
pnpm doc:api
```

CI는 저장소 루트에서 `pnpm run verify:docs`를 돌리며, 생성된 레퍼런스가 소스와 어긋나는 순간 실패합니다.

### AI와 Claude Code용 스킬

이미 만들어 둔 스킬이 있어, AI 어시스턴트(Claude Code)가 소스를 헤집지 않고도 ranui를 읽고 쓸 수 있습니다. `ran` 플러그인 마켓플레이스에서 배포합니다.

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

설치해 두면 ranui를 만질 때 Claude가 알아서 씁니다(`/ranui:ranui`로 직접 불러도 됩니다). 스킬에는 가져오기 대응표, 요소 목록, builder와 반응성 API, 접근성, 쓰는 예가 들어 있고, 패키지에 함께 실려 오는 API 레퍼런스([docs/COMPONENTS.md](./docs/COMPONENTS.md))로 이끌어 줍니다.

### 스타일 문서

스타일 체계는 CSS 토큰과 `::part()`를 중심으로 한 갈래로 모여 있습니다.

- 스타일 덮어쓰기 안내: [docs/style-override.md](./docs/style-override.md)
- 토큰과 part의 전체 목록(자동 생성): [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- 쓰는 쪽을 위한 공개 스타일 API(자동 생성): [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- 공개 토큰 거르기 설정: [docs/style-token-filter.json](./docs/style-token-filter.json)

스타일 문서는 이것으로 새로 만듭니다.

```bash
pnpm doc:style
```

### 테마

ranui의 토큰 체계는 하나뿐이며, Vercel이 공개한 디자인 언어인 [Geist 디자인 시스템](https://vercel.com/geist)을 바탕으로 합니다. 거기서 색은 **상태의 사다리**입니다. 각 단계는 100에서 1000까지 오르고, 한 칸마다 맡은 일이 하나씩 정해져 있습니다(배경 → hover → 테두리 → 꽉 찬 색 → 글자). ranui는 그 사다리와 **Geist Sans·Geist Mono**를 함께 들여왔으므로, 어두운 모드는 바탕 단계만 다시 정의하면 되고 의미 토큰은 모두 알아서 넘어갑니다. 모드는 `light`, `dark`, `system` 셋뿐이고 테마 팩은 없습니다. 실행 중에 모드를 바꾸거나 어떤 토큰이든 덮어쓸 수 있습니다(SSR에서도 안전합니다).

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // 불러올 때, 저장해 둔 선택을 되살립니다
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

`ranui/theme` 진입점에는 테마 엔진만 들어 있습니다. 사용자 정의 요소는 하나도 등록되지 않으므로, 토큰과 어두운 모드만 원한다면 번들에 군더더기가 끼지 않습니다. 같은 API는 `ranui` 배럴에서도 다시 내보냅니다.

어두운 모드가 다시 정의하는 것은 바탕 색 단계뿐입니다. 의미 토큰(`--ran-color-*`)은 그것을 가리키므로 알아서 넘어갑니다. [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md)와 [docs/DESIGN.md](./docs/DESIGN.md)를 보세요.

### 국제화

프레임워크를 가리지 않는 i18n 엔진이 `ranui/i18n`이라는 별도 진입점으로 들어 있습니다. `ranui/theme`처럼 사용자 정의 요소는 하나도 등록하지 않습니다.

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // 로캘마다 평평한 사전입니다. 키는 그대로 쓰이고, 겹쳐 넣지 않습니다
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // 선택을 localStorage에 기억해 둡니다
  detectNavigat또는: true, // 처음 로캘을 브라우저에서 고릅니다
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // 저장한 뒤 구독자에게 알립니다
```

`t()`는 먼저 대체 로캘로, 그래도 없으면 키 자체로 물러납니다. `{param}` 자리는 값으로 채워집니다. 핵심부는 SSR에서도 안전합니다.

## 가져오기

번들을 가볍게 하려면 컴포넌트별로 가져오세요.

```js
import 'ranui/button';
```

컴포넌트가 아닌 하위 경로는 유틸리티만 따로 내어 줍니다. 모든 요소를 등록하지 않고도 필요한 엔진만 끌어올 수 있습니다.

```js
import { initTheme } from 'ranui/theme'; // 테마만
import { createI18n } from 'ranui/i18n'; // 국제화만
```

스타일이 빠져 보이면 스타일시트를 직접 가져오세요.

```js
import 'ranui/style';
```

타입 해석이 안 되면 타입 진입점 가운데 하나를 직접 가져오세요.

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

되는 것 하나면 충분합니다.

통째로 가져오기도 됩니다.

```ts
import 'ranui';
```

ES 모듈:

```js
import 'ranui';
```

또는:

```js
import 'ranui/button';
```

UMD, IIFE, CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### 번들러 없이(정적 페이지나 CDN)

그 페이지가 쓰는 컴포넌트 수에 맞는 배포 형태를 고르세요.

| 상황                               | 알맞은 선택                                 | 왜                                                        |
| ---------------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| 컴포넌트 한두 개, script 태그 하나 | 컴포넌트별 IIFE: `dist/iife/<name>.iife.js` | 그 자체로 완결되고 모듈 문법이 필요 없습니다              |
| 컴포넌트 여러 개                   | 컴포넌트별 ES 모듈: `dist/<name>.js`        | 브라우저의 모듈 그래프가 공용 런타임의 겹침을 없애 줍니다 |
| 전부                               | 통째 번들: `dist/index.iife.js`             | 파일 하나로 모든 컴포넌트가 등록됩니다                    |
| 번들러가 있는 프로젝트             | npm에서 가져오기: `import 'ranui/<name>'`   | 안 쓰는 것이 걸러지고 런타임도 하나뿐입니다               |

컴포넌트별 IIFE. 태그 하나면 되고 빌드 단계가 없습니다.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

IIFE는 저마다 안에서 쓰는 의존을 품고 있습니다(예를 들어 `select`에는 `icon`이 들어 있습니다). 요소 등록에는 이중 등록을 막는 장치가 있어, 의존을 나눠 쓰는 파일을 여럿 불러도 문제없습니다. 다만 파일마다 공용 런타임의 사본을 하나씩 지고 옵니다. 한 페이지에서 컴포넌트를 여럿 쓴다면, 그 겹침을 없애 주는 ES 모듈 쪽을 고르세요.

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## 쓰는 법

RanUI의 컴포넌트는 Web Components라, 프레임워크마다의 감싸개 없이 그냥 씁니다.

대개는 원래의 HTML 요소처럼 쓰면 됩니다.

예:

- html
- js
- jsx
- vue
- tsx

### html

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

### js

```js
import 'ranui';

const Button = document.createElement('r-button');
Button.textContent = 'this is button text';
document.body.appendChild(Button);
```

### jsx

```jsx
import 'ranui';

const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
</script>
```

### tsx

```tsx
import 'ranui/button';

const Button = () => {
  return (
    <div>
      <r-button type="primary">button</r-button>
    </div>
  );
};
```

### 메시지의 자리와 담길 곳

`window.message`에서는 위에서 떨어진 거리, 겹침 순서, 그리고 어디에 붙일지를 정할 수 있습니다.

```ts
import 'ranui/message';

const customRoot = document.getElementById('custom-message-root');

window.message?.success({
  content: 'Saved',
  duration: 2000,
  top: 24,
  zIndex: 3000,
  getContainer: () => customRoot,
});
```

`top`은 `number`도 `string`도 됩니다. `24`는 `24px`가 되고, `'2rem'`은 단위를 그대로 지킵니다.

`zIndex`도 `number`와 `string`을 모두 받습니다.

`getContainer`는 `HTMLElement`를 돌려주어야 합니다. 빼면 메시지는 `document.body`에 붙습니다.

### 반응형 부품

`signal`, `createEffect`, `computed`, `batch`, `untrack`과 소유 계층(`createRoot`, `onCleanup`, `getOwner`, `runWithOwner`)이 DOM builder와 나란히 들어 있습니다. 프레임워크 없이 반응하는 화면 조각을 짜기 위한 것입니다. 설계는 SwiftUI의 `@Observable`을 본뜨되 Solid.js식 보장을 갖췄습니다. 이펙트는 다시 돌기 전에 낡은 구독을 알아서 치웁니다. `batch()`는 여러 쓰기를 한 번의 반영으로 모읍니다. `computed`는 **게으르고 값으로 메모**됩니다(아무도 읽지 않는 메모는 한 번도 계산되지 않고, 값이 실제로 달라졌을 때만 딸린 것들을 깨웁니다). 그리고 이펙트와 메모, 바인딩은 모두 자기 범위가 주인이라, `createRoot` 하나를 버리면 거기서 태어난 것이 한 번의 호출로 전부 걷힙니다. 페이지나 라우트를 접는 단위가 바로 이것입니다. `ElementBuilder`의 체이닝 메서드(`text`, `attr`, `class` 등)는 시그널 게터도 받아, 알아서 갱신되는 바인딩이 됩니다. 자세한 안내: [`ranview`](../ranview/README.md).

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from 'ranui/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().build();
  const view = Div()
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('reset')
        .listen(
          scope,
          'click',
          () =>
            batch(() => {
              setCount(0);
              setStep(1);
            }), // 쓰기 두 번에 반영은 한 번
        ),
    )
    .build();

  const dispose = createEffect(() => {
    label.textContent = `${count()} (×2 = ${doubled()})`;
  });

  container.appendChild(view);
  return () => {
    dispose();
    scope.abort();
  }; // 걷어 내기
}
```

API 전체는 [유틸리티 문서](./utils/README.md)를 보세요.

### 라우팅

RanUI에는 클라이언트 쪽 라우팅이 들어 있습니다. 선언적인 컴포넌트로도, 자바스크립트 API로도 씁니다.

**선언적인 컴포넌트:**

```html
<r-router>
  <nav>
    <r-link href="/">Home</r-link>
    <r-link href="/about">About</r-link>
  </nav>

  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User detail</h2></r-route>
</r-router>
```

**이동 가드가 붙은 자바스크립트 API:**

```ts
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both'
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) next('/login');
  else next();
});

router.push('/users/42');
```

JS 라우터가 필요 없는 순수 MPA 사이트에서는 `enableMpaViewTransitions()`를 불러 `@view-transition { navigation: auto }`를 끼워 넣으세요. 요소를 공유한 채 모양이 바뀌는 애니메이션은 표준 CSS 속성인 `view-transition-name`으로 씁니다.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

가드와 `onPageSwap`·`onPageReveal`, 요소별 전환 이름까지 포함한 API 전체는 [라우터 문서](https://ran.chaxus.com/ko/src/ranui/router/)를 보세요.

### SSR과 builder

SSR을 하거나 UI를 선언적으로 짤 때, RanUI는 속에서 `builder`와 SSR 등록부, Declarative Shadow DOM을 씁니다. 컴포넌트는 `ensureShadowRoot`로 이미 있는 섀도 루트를 다시 쓰고, 자기 트리는 생성자에서 짓습니다. 서버가 그린 트리는 첫 프레임을 그리고 나서 갈립니다. 컴포넌트가 붙이는 것은 **닫힌** 섀도 루트이고, `attachShadow`는 선언적 섀도 루트의 자식을 지우기 때문에, 클라이언트에서는 언제나 다시 짓게 됩니다.

소스 층위의 SSR 렌더링 예:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Declarative Shadow DOM이 담긴 HTML 문자열을 돌려줍니다.
const html = renderToString(button);
```

자세한 것은 [유틸리티 문서](./utils/README.md)를 보세요.

## 컴포넌트를 쓸 때의 약속

컴포넌트를 더하거나 손볼 때는 이 패키지의 약속을 따르세요.

- `RanElement`를 물려받으세요. 브라우저의 `HTMLElement`를 곧바로 물려받으면 안 됩니다.
- 섀도 루트는 `ensureShadowRoot`로 만들거나 다시 쓰세요. `attachShadow`를 직접 부르면 안 됩니다.
- 섀도 DOM의 하위 트리는 생성자에서 짓고, 다른 곳에서는 짓지 마세요.
- 지으면서 `.ref()`로 요소를 붙잡고 `shadowPart`로 되읽으세요. 컴포넌트가 손수 지은 것을 `querySelector`로 찾아서는 안 됩니다.
- `observedAttributes`에 `sheet`를 넣고, 컴포넌트 단위의 스타일 덮어쓰기는 `syncSheetAttribute`로 반영하세요.
- `attributeChangedCallback`은 `if (old === next) return;`으로 막아 두세요.
- 컴포넌트 등록은 `defineSSR('r-name', Component)`로 하세요. `customElements.define`을 직접 부르면 안 됩니다.
- `index.ts`에는 타입 내보내기와 부수 효과 가져오기를 모두 넣고, `vite.config.ts`와 `package.json`에도 개별 진입점을 넣으세요.
- `connectedCallback`에서 생명주기에 매인 리스너를 달 때는 `@/utils/builder`의 `EventManager`를 쓰고, `disconnectedCallback`에서 `manager.abort()`를 부르세요. `removeEventListener`를 하나하나 좇지 마세요.

## 함께 만들기

배우러 오신 분도, 개발자도 모두 환영합니다. 실험적인 프로젝트라 자주 바뀔 것을 감안해 주세요.

## 함께해 주신 분들

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 그 밖에

[라이선스(MIT)](/LICENSE)
