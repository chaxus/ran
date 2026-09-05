---
description: '현재 경로가 패턴과 맞는 동안에만 슬롯 콘텐츠를 보여 주는 라우팅 아웃렛. r-router 안에서 씁니다.'
---

# Route

라우팅 아웃렛 엘리먼트입니다. [`r-router`](../router/) 안에 두면, 현재 경로가 자신의 `path` 패턴과 맞을 때 슬롯 콘텐츠를 보여 주고 아니면 숨깁니다.

> **이럴 때 쓰세요.** 현재 경로가 패턴과 맞는 동안에만 콘텐츠를 보여 주는 아웃렛이 필요할 때(`:param`과 `*` 지원). `<r-route>`를 `<r-router>` 안에 두면 클라이언트 쪽 뷰 전환을 만들 수 있습니다.

## 빠른 시작

### 기본 사용법

`path`가 `/`인 `r-route`는 기본 경로와 맞으므로, 혼자서도 콘텐츠가 그려집니다.

<Demo>
  <r-route path="/">
    <p>현재 경로가 맞으면 이 콘텐츠가 보입니다.</p>
  </r-route>
</Demo>

```html
<r-route path="/">
  <p>현재 경로가 맞으면 이 콘텐츠가 보입니다.</p>
</r-route>
```

### 라우터 안에서

[`r-router`](../router/) 안에서 쓰면 여러 라우트가 스위치처럼 동작합니다. 라우터는 이동할 때마다 모든 `r-route` 자식을 동기화해, `path`가 맞는 것을 보이고 나머지를 숨깁니다.

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

`r-router` 컨테이너와 `createRouter` / `RouterCore` 자바스크립트 API(이동, 가드, 뷰 트랜지션)는 [Router 페이지](../router/)에 정리되어 있습니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입                     | 기본값  | 설명                                                          |
| -------- | ------------------------ | ------- | ------------------------------------------------------------- |
| `path`   | `string`                 | `'/'`   | 현재 경로와 맞춰 볼 패턴. `:param` 구간과 `*`를 지원합니다    |
| `exact`  | `boolean`                | `false` | 읽기 전용. `exact` 어트리뷰트가 있으면 정확히 일치해야 합니다 |
| `params` | `Record<string, string>` | `{}`    | 읽기 전용. 이번 일치에서 뽑아낸 파라미터                      |
| `sheet`  | `string`                 | `''`    | 컴포넌트의 섀도 DOM에 주입할 CSS                              |

### 경로 일치 `path`

`path`는 `/`로 나뉘어 구간마다 정규식으로 컴파일됩니다.

- `:`로 시작하는 구간은 이름 있는 파라미터를 잡아냅니다(경로 한 구간과 일치)
- `*` 구간은 남은 경로 전체와 일치합니다
- 그 밖의 구간은 글자 그대로 일치합니다

`exact`가 없으면 패턴은 경로의 **접두사**로 일치합니다(뒤에 구간이 더 붙어도 됩니다). `exact`가 있으면 완전한 일치만 받아들입니다.

```
/users            /users, /users/42, /users/42/profile 와 일치
/users (exact)    /users 하고만 일치
/users/:id        :id 를 잡아 params.id 로
/*                모든 것과 일치
```

잡아낸 파라미터는 읽기 전용 `params` 프로퍼티에서 읽습니다(각 값은 `decodeURIComponent`로 디코딩됩니다).

```js
const route = document.createElement('r-route');
route.path = '/users/:id';
router.append(route);
route.params; // 라우터가 이 라우트와 맞추면 예: { id: '42' }
```

### 정확한 일치 `exact`

불리언 어트리뷰트입니다. 있으면 이 아웃렛은 정확한 경로와만 일치합니다(접두사 일치 없음). `path="/users" exact`는 `/users`와는 맞지만 `/users/42`와는 맞지 않습니다.

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### 외부 CSS `sheet`

컴포넌트의 섀도 DOM에 주입하는 CSS로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다.

### 슬롯

기본(이름 없는) 슬롯이 라우트가 활성일 때 보여 줄 콘텐츠를 담습니다. 경로가 맞지 않으면 호스트에 `hidden`이 지정되고 콘텐츠는 보이지 않습니다.

```html
<r-route path="/about">
  <!-- 기본 슬롯: /about 이 활성일 때만 보임 -->
  <h2>About</h2>
</r-route>
```

## 이벤트

### `routematch`

이 아웃렛이 활성이 될 때(자신의 `path`가 현재 경로와 맞을 때) 발생합니다. **버블링됩니다.** `event.detail`은 `{ path, params }` 입니다.

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  // 같은 방식으로 만든 라우트를 붙이기 전에 구독해 둡니다
  const route = document.createElement('r-route');
  route.path = '/users/:id';
  route.addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
  router.append(route);
</script>
```

## 스타일

`r-route`는 `::part()` 핸들도, 전용 `--ran-route-*` CSS 변수도 공개하지 않습니다. 호스트는 평범한 `display: block` 엘리먼트이며 숨겨진 동안에는 `display: none`으로 접힙니다. 꾸미려면 `sheet` 어트리뷰트를 쓰거나 호스트에 직접 스타일을 주세요.

`import 'ranui'`(모든 컴포넌트 등록)나 단독 `import 'ranui/route'`로 불러옵니다.

## 권장 사항

- **`r-router` 안에 두세요**: `r-route`는 동기화해 줄 [`r-router`](../router/) 조상이 있을 때만 이동에 따라 전환됩니다.
- **루트에는 `exact`를**: `path="/"`에 `exact` 어트리뷰트를 주어 다른 모든 라우트에 접두사로 걸리지 않게 하세요.
- **구체적인 것부터 일반적인 것 순으로**: 모두 받는 `path="/*"` 라우트는 마지막에 두세요. `exact`가 아닌 라우트는 접두사로 일치하기 때문입니다.
- **URL을 직접 파싱하지 말고 `params`를 읽으세요**: 동적 구간은 `:param`으로 잡고 `params` 프로퍼티에서 읽으세요.
- **`routematch`로 활성화에 반응하세요**: 버블링되는 `routematch` 이벤트를 써서 라우트가 활성이 될 때 데이터 로딩을 시작하세요.
