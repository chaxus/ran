---
description: '선언적 컴포넌트, JS API, 내비게이션 가드, View Transitions, 문서 간(MPA) 전환까지 갖춘 클라이언트 사이드 SPA 라우팅.'
---

# Router

싱글 페이지 애플리케이션을 위한 클라이언트 사이드 라우팅입니다. 선언적인 HTML 컴포넌트와, 내비게이션 가드·View Transitions·문서 간(MPA) 전환을 갖춘 JavaScript API를 제공합니다.

> **이럴 때 씁니다.** 내비게이션 가드, View Transitions, 문서 간(MPA) 전환이 있는 클라이언트 사이드 SPA 라우팅이 필요할 때. `createRouter`에 `<r-router>` / `<r-route>` / `<r-link>`를 더하면 앱 안 이동이 연결됩니다.

## 빠른 시작

인증 가드와 SPA 전환을 갖춘, 작지만 완결된 앱입니다.

```js
import { createRouter } from 'ranui';

// 1. 인증으로 보호되는 라우트와 SPA 전환을 갖춰 라우터를 만듭니다
const router = createRouter({
  mode: 'history',
  viewTransition: 'spa',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/about', meta: { title: 'About' } },
    { path: '/dashboard', meta: { title: 'Dashboard', requiresAuth: true } },
    { path: '/login', meta: { title: 'Login' } },
  ],
});

// 2. 인증 가드 — 로그인하지 않은 사용자를 보냅니다
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. 이동할 때마다 페이지 제목을 갱신하고 분석 데이터를 보냅니다
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- 라우터를 붙이고, 링크를 두고, 라우트를 선언합니다 -->
<r-router>
  <nav>
    <r-link href="/">홈</r-link>
    <r-link href="/about">소개</r-link>
    <r-link href="/dashboard">대시보드</r-link>
  </nav>

  <r-route path="/" exact><h2>홈</h2></r-route>
  <r-route path="/about"><h2>소개</h2></r-route>
  <r-route path="/dashboard"><h2>대시보드</h2></r-route>
  <r-route path="/login"><h2>로그인</h2></r-route>
</r-router>
```

```css
/* SPA 전환 — 라우트 사이를 크로스페이드 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

## 컴포넌트

### `r-router`

컨테이너 컴포넌트입니다. `popstate`를 듣고, 이동할 때마다 자식 `r-route`를 모두 맞춥니다.

#### 어트리뷰트

| 어트리뷰트 | 타입                  | 기본값      | 설명                                 |
| ---------- | --------------------- | ----------- | ------------------------------------ |
| `mode`     | `'history' \| 'hash'` | `'history'` | History API 모드                     |
| `base`     | `string`              | `''`        | 모든 경로에서 떼어낼 기본 URL 접두사 |
| `sheet`    | `string`              | `''`        | 섀도 DOM에 주입할 CSS                |

#### 이벤트

| 이벤트        | detail             | 설명                            |
| ------------- | ------------------ | ------------------------------- |
| `routechange` | `{ path: string }` | 라우트가 바뀔 때마다 발생합니다 |

### `r-route`

현재 경로가 `path`와 맞으면 슬롯 내용을 보여 주고, 아니면 숨깁니다.

#### 어트리뷰트

| 어트리뷰트 | 타입      | 기본값  | 설명                                                          |
| ---------- | --------- | ------- | ------------------------------------------------------------- |
| `path`     | `string`  | `'/'`   | 맞춰 볼 패턴. `:param` 세그먼트와 `*` 와일드카드를 지원합니다 |
| `exact`    | `boolean` | `false` | 정확히 일치해야 합니다(접두사 일치 금지)                      |
| `src`      | `string`  | `''`    | 지연·코드 분할로 페이지를 붙이고 떼는 모듈 지정자             |
| `sheet`    | `string`  | `''`    | 섀도 DOM에 주입할 CSS                                         |

#### 이벤트

| 이벤트       | detail             | 설명                                |
| ------------ | ------------------ | ----------------------------------- |
| `routematch` | `{ path, params }` | 이 라우트가 활성이 될 때 발생합니다 |

#### 경로 패턴 예시

```
/users            /users, /users/42, /users/42/profile 에 일치
/users (exact)    /users 에만 일치
/users/:id        :id 를 잡아 params.id 로
/*                모든 경로에 일치
```

#### 지연 마운트·언마운트 `src`

페이지가 많은 앱이라면, `r-route`는 슬롯 내용을 늘 미리 실어 보내는 대신 페이지마다 코드를 나눌 수 있습니다. `src`에 모듈 지정자를 두면, 경로가 맞을 때 `r-route`가 그것을 동적으로 `import()`하고 기본 내보내기를 부릅니다. 그 함수의 타입은 `(host: HTMLElement) => void | (() => void)`이며, 반응형 스코프 안에서 호출되고 그릴 호스트 요소를 받습니다. 그 라우트를 떠나면 스코프 전체가 한 번에 버려지고(페이지가 등록한 모든 이펙트, 바인딩, `onCleanup`), 그린 내용이 제거됩니다. 다시 그 라우트로 오면 캐시된 모듈에서 다시 붙으며, 내려받기를 되풀이하지 않습니다.

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* 선택적 정리. 라우트를 떠날 때 실행됩니다 */
  };
}
```

이 모드는 클라이언트 전용입니다. SSR/SSG 동안 지연 라우트는 보임·숨김 상태만 결정하고, 페이지 모듈 자체는 불러오지 않습니다.

### `r-link`

이동용 링크입니다. 같은 출처의 경로에서는 전체 페이지 새로고침을 막고, 라우터가 살아 있으면 `RouterCore.push/replace`를 부르며, 아니라면 `ran-navigate` 이벤트를 DOM 트리 위로 올려 보냅니다.

바깥 URL(`http://`, `//`, `mailto:`, `tel:`)은 평범한 `<a>` 링크로 그대로 지나갑니다.

#### 어트리뷰트

| 어트리뷰트 | 타입      | 기본값  | 설명                                      |
| ---------- | --------- | ------- | ----------------------------------------- |
| `href`     | `string`  | `''`    | 이동할 경로                               |
| `replace`  | `boolean` | `false` | 기록을 쌓는 대신 현재 항목을 바꿔치웁니다 |
| `sheet`    | `string`  | `''`    | 섀도 DOM에 주입할 CSS                     |

```html
<r-link href="/about">소개</r-link>
<r-link href="/settings" replace>설정</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### 슬롯

`r-router`, `r-route`, `r-link` 셋 다 이름 있는 슬롯을 노출하지 않습니다. 모두 기본(이름 없는) `<slot>` 하나만 그립니다. `r-router`와 `r-route`는 자식 라우트나 라우트 내용을 있는 그대로 투영하고, `r-link`는 안에 넣은 것을 링크의 보이는 내용으로 투영합니다. 셋 다 `::part()`도 정의하지 않으므로, 이 컴포넌트 묶음에는 CSS Part 절이 없습니다.

## JavaScript API

### `createRouter(config?)`

전역 `RouterCore` 인스턴스를 만들어 등록합니다. 앱을 시작할 때, `r-router` 요소를 붙이기 전에 한 번만 부르세요.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history'(기본) | 'hash'
  base: '/app', // 내부 경로 전체에서 '/app' 접두사를 떼어냅니다
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### 옵션

| 옵션             | 타입                            | 기본값      | 설명                                               |
| ---------------- | ------------------------------- | ----------- | -------------------------------------------------- |
| `mode`           | `'history' \| 'hash'`           | `'history'` | URL 방식                                           |
| `base`           | `string`                        | `''`        | 기본 경로 접두사                                   |
| `routes`         | `RouteConfig[]`                 | `[]`        | path, exact, meta를 담은 라우트 정의               |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | View Transitions를 켭니다(`true`는 `'spa'`와 같음) |

### `RouterCore`

훅 계열 메서드는 모두 **구독 해제 함수**를 돌려줍니다.

| 이름                     | 시그니처 / 타입                                         | 설명                                                      |
| ------------------------ | ------------------------------------------------------- | --------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | 이동하고 기록 항목을 새로 쌓습니다                        |
| `replace(path)`          | `(path: string) => Promise<void>`                       | 이동하고 현재 항목을 바꿔치웁니다                         |
| `back()`                 | `() => void`                                            | `history.back()`                                          |
| `forward()`              | `() => void`                                            | `history.forward()`                                       |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                       |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | 내비게이션 가드를 등록합니다. 이동이 확정되기 전에 돕니다 |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | 이동 뒤 훅. DOM이 갱신된 다음에 돕니다                    |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | 모든 라우트 변경을 구독합니다                             |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | 문서 간 `pageswap` 이벤트(MPA 모드 전용)                  |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | 문서 간 `pagereveal` 이벤트(MPA 모드 전용)                |
| `destroy()`              | `() => void`                                            | 모든 리스너와 주입한 CSS를 걷어냅니다                     |
| `currentRoute`           | `RouteLocation \| null`                                 | 현재 라우트 위치 객체                                     |
| `mode`                   | `'history' \| 'hash'`                                   | 기록 모드                                                 |
| `base`                   | `string`                                                | 기본 URL 접두사                                           |
| `routes`                 | `RouteConfig[]`                                         | 등록된 라우트 설정                                        |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

살아 있는 `RouterCore` 인스턴스를 돌려주며, `createRouter`가 아직 불리지 않았다면 `null`을 돌려줍니다.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## 내비게이션 가드

가드는 등록한 순서대로, 이동이 확정되기 전에 돕니다. 허용하려면 `next()`, 취소하려면 `next(false)`, 다른 곳으로 보내려면 `next('/path')`를 부르세요.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// 나중에 가드를 떼려면:
unsubscribe();
```

### 이동 뒤 훅

`afterEach`와 `onRouteChange`는 둘 다 DOM이 갱신된 뒤에 발생합니다. 끝난 이동에 기대는 부수효과에는 `afterEach`를, 가벼운 구독에는 `onRouteChange`를 쓰세요.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

브라우저의 [View Transitions API](https://developer.mozilla.org/ko/docs/Web/API/View_Transition_API)로 라우트 전환에 애니메이션을 넣을 수 있습니다.

### 비교

CSS를 쓰기 전에 모드를 먼저 고르세요.

| 모드     | Chrome      | 무엇이 일으키는가                         | JS 필요 |
| -------- | ----------- | ----------------------------------------- | ------- |
| `'spa'`  | 111+        | `router.push()` 또는 `r-link` 클릭        | 예      |
| `'mpa'`  | 126+        | 아무 `<a>` 링크, 폼 제출, `location.href` | 아니오  |
| `'both'` | 111+ / 126+ | 위 모두                                   | 선택    |

### SPA — 같은 문서 안의 전환

```js
const router = createRouter({ viewTransition: 'spa' }); // 또는 true
```

`router.push()` / `router.replace()`를 부를 때마다 DOM 갱신이 `document.startViewTransition()`으로 감싸집니다. API를 지원하지 않는 곳에서는 동기 갱신으로 자연스럽게 낮춰집니다(Chrome 111+).

애니메이션을 정의할 CSS를 더하세요.

```css
/* 기본 크로스페이드 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

### MPA — 문서 간 전환

```js
const router = createRouter({ viewTransition: 'mpa' });
```

`<head>`에 `@view-transition { navigation: auto }`를 주입해, 같은 출처의 전체 페이지 이동마다 자동 전환을 켭니다(Chrome 126+). 각 페이지에 JavaScript는 필요 없습니다.

라우터를 전혀 쓰지 않는 앱이라면:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// 필요하면 cleanup()으로 주입한 <style>을 걷어낼 수 있습니다
```

**MPA 생명주기 이벤트:**

```js
// pageswap은 떠나는 문서에서 언로드 전에 발생합니다
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal은 들어오는 문서에서 첫 렌더 전에 발생합니다
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA와 MPA를 함께

```js
const router = createRouter({ viewTransition: 'both' });
```

SPA 이동에는 `startViewTransition()`을, 전체 페이지 이동에는 CSS `@view-transition` 규칙을 씁니다. 가능하면 JS로 전환하고, 안 되면 CSS에 맡깁니다.

## `view-transition-name` — 공유 요소 전환

`view-transition-name`은 화면 전체가 아니라 특정 요소 하나를 두 페이지 사이에서 애니메이션합니다. 브라우저가 양쪽에서 그 요소의 위치와 크기를 붙잡아 두고 그 사이를 이어 줍니다. [Chrome Profiles 데모](https://view-transitions.chrome.dev/profiles/mpa/)에서 카드가 펼쳐지는 효과가 바로 이것입니다.

### 기본 사용법

출발 페이지와 도착 페이지의 "같은" 요소에 같은 이름을 붙이세요.

```html
<!-- 목록 페이지 -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- 상세 페이지 -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

브라우저가 카드를 목록에서의 자리부터 상세에서의 자리까지 모양을 바꿔 가며 알아서 애니메이션합니다.

### 목록 안에서 이름을 동적으로

`view-transition-name`은 한 페이지 안에서 유일해야 합니다. 항목의 ID를 이름의 일부로 쓰세요.

```css
/* CSS 방식 — 카드마다 규칙 하나 */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// JS 방식 — 이동 직전에 이름을 정합니다
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

도착 페이지에서는 첫 페인트 전에 짝이 되는 이름을 지정하세요.

```js
// 브라우저가 붙잡을 수 있도록 곧바로(동기적으로) 지정합니다
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### 방향이 있는 슬라이드 전환

`beforeEach` 가드와 CSS 사용자 정의 속성을 엮으면, 이동 방향마다 다른 애니메이션을 낼 수 있습니다.

```js
const pages = ['/', '/step-1', '/step-2', '/step-3'];

router.beforeEach((to, from, next) => {
  const toIdx = pages.indexOf(to.path);
  const fromIdx = pages.indexOf(from?.path ?? '');
  document.documentElement.dataset.navDir = toIdx >= fromIdx ? 'forward' : 'back';
  next();
});
```

```css
@keyframes slide-from-right {
  from {
    translate: 100% 0;
  }
}
@keyframes slide-from-left {
  from {
    translate: -100% 0;
  }
}
@keyframes slide-to-right {
  to {
    translate: 100% 0;
  }
}
@keyframes slide-to-left {
  to {
    translate: -100% 0;
  }
}

[data-nav-dir='forward']::view-transition-old(root) {
  animation: 300ms ease slide-to-left;
}
[data-nav-dir='forward']::view-transition-new(root) {
  animation: 300ms ease slide-from-right;
}
[data-nav-dir='back']::view-transition-old(root) {
  animation: 300ms ease slide-to-right;
}
[data-nav-dir='back']::view-transition-new(root) {
  animation: 300ms ease slide-from-left;
}
```

어떤 요소를 전환에서 빼려면 `view-transition-name: none`을 쓰세요. 여러 부분을 따로 애니메이션하려면 각각 유일한 이름을 주면 됩니다. 이름이 없는 것들은 루트 전환으로 함께 페이드됩니다.

## SSR / SSG

브라우저 API(`window`, `history`, `document`)는 모두 `typeof` 검사로 감싸여 있으므로, Node나 Deno의 SSR 환경에서도 `createRouter`를 안전하게 부를 수 있습니다. SSR 문맥에서 `push`와 `replace`는 가드를 돌리고 `currentRoute`를 갱신하지만, `history.pushState` / `history.replaceState`는 건너뜁니다. `popstate` 리스너는 서버에서 전혀 등록되지 않습니다. 클라이언트에서는 평소대로 하이드레이션하면 됩니다. 같은 설정으로 `createRouter`를 다시 부르세요.

## 타입 레퍼런스

```ts
interface RouteLocation {
  path: string; // 예: '/users/42'
  params: Record<string, string>; // 예: { id: '42' }
  query: Record<string, string>; // 예: { tab: 'profile' }
  fullPath: string; // 예: '/users/42?tab=profile'
}

type ViewTransitionMode = 'spa' | 'mpa' | 'both';

interface RouterConfig {
  mode?: 'history' | 'hash';
  base?: string;
  routes?: RouteConfig[];
  viewTransition?: boolean | ViewTransitionMode;
}

interface RouteConfig {
  path: string;
  exact?: boolean;
  meta?: Record<string, unknown>;
  children?: RouteConfig[];
}

type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation | null,
  next: (redirect?: string | false) => void,
) => void;

type RouteChangeHandler = (to: RouteLocation, from: RouteLocation | null) => void;
```
