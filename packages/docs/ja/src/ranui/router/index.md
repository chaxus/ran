---
description: '宣言的なコンポーネント、JS API、ナビゲーションガード、View Transitions、ドキュメント間（MPA）遷移に対応したクライアントサイドの SPA ルーティング。'
---

# Router

シングルページアプリケーションのためのクライアントサイドルーティングです。宣言的な HTML コンポーネントと、ナビゲーションガード・View Transitions・ドキュメント間（MPA）遷移を備えた JavaScript API を提供します。

> **こんなときに**：ナビゲーションガード、View Transitions、ドキュメント間（MPA）遷移を伴うクライアントサイドの SPA ルーティングが必要なとき。`createRouter` に `<r-router>` / `<r-route>` / `<r-link>` を組み合わせれば、アプリ内の遷移が繋がります。

## クイックスタート

認証ガードと SPA トランジションを備えた、小さいけれど完結したアプリです。

```js
import { createRouter } from 'ranui';

// 1. 認証で保護されたルートと SPA トランジションつきでルーターを作る
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

// 2. 認証ガード — 未認証の利用者をリダイレクトする
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. 遷移ごとにページタイトルを更新し、計測を送る
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- ルーターをマウントし、ナビゲーションリンクを置き、ルートを宣言する -->
<r-router>
  <nav>
    <r-link href="/">ホーム</r-link>
    <r-link href="/about">概要</r-link>
    <r-link href="/dashboard">ダッシュボード</r-link>
  </nav>

  <r-route path="/" exact><h2>ホーム</h2></r-route>
  <r-route path="/about"><h2>概要</h2></r-route>
  <r-route path="/dashboard"><h2>ダッシュボード</h2></r-route>
  <r-route path="/login"><h2>ログイン</h2></r-route>
</r-router>
```

```css
/* SPA トランジション — ルート間をクロスフェードする */
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

## コンポーネント

### `r-router`

コンテナのコンポーネントです。`popstate` を監視し、遷移のたびに子の `r-route` をすべて同期します。

#### 属性

| 属性    | 型                    | 既定値      | 説明                                        |
| ------- | --------------------- | ----------- | ------------------------------------------- |
| `mode`  | `'history' \| 'hash'` | `'history'` | History API のモード                        |
| `base`  | `string`              | `''`        | すべてのパスから取り除くベース URL の接頭辞 |
| `sheet` | `string`              | `''`        | Shadow DOM に注入する CSS                   |

#### イベント

| イベント      | detail             | 説明                         |
| ------------- | ------------------ | ---------------------------- |
| `routechange` | `{ path: string }` | ルートが更新されるたびに発火 |

### `r-route`

現在のパスが `path` に一致したとき、スロットの内容を表示します。一致しなければ隠します。

#### 属性

| 属性    | 型        | 既定値  | 説明                                                                 |
| ------- | --------- | ------- | -------------------------------------------------------------------- |
| `path`  | `string`  | `'/'`   | 照合するパターン。`:param` のセグメントと `*` のワイルドカードに対応 |
| `exact` | `boolean` | `false` | 完全一致を要求する（前方一致にしない）                               |
| `src`   | `string`  | `''`    | 遅延・コード分割でページをマウント／アンマウントするモジュール指定子 |
| `sheet` | `string`  | `''`    | Shadow DOM に注入する CSS                                            |

#### イベント

| イベント     | detail             | 説明                               |
| ------------ | ------------------ | ---------------------------------- |
| `routematch` | `{ path, params }` | このルートが有効になったときに発火 |

#### パスパターンの例

```
/users            /users、/users/42、/users/42/profile に一致
/users (exact)    /users にのみ一致
/users/:id        :id を捕まえて params.id にする
/*                すべてに一致
```

#### 遅延マウント／アンマウント `src`

ページ数の多いアプリでは、`r-route` はスロットの内容をいつも先に配るのではなく、ページごとにコードを分割できます。`src` にモジュール指定子を設定すると、一致したときに `r-route` が動的に `import()` し、その default export（型は `(host: HTMLElement) => void | (() => void)` の関数）をリアクティブスコープの中で呼び、描画先のホスト要素を渡します。そのルートを離れると、スコープごと一度に破棄され（ページが登録したすべてのエフェクト、バインディング、`onCleanup`）、描画された内容が取り除かれます。ルートに戻ったときは、キャッシュされたモジュールから再取得なしでマウントし直されます。

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* 任意のクリーンアップ。ルートを離れるときに実行されます */
  };
}
```

このモードはクライアント専用です。SSR / SSG のあいだ、遅延ルートは表示・非表示の状態だけを解決し、ページのモジュール自体は読み込みません。

### `r-link`

ナビゲーション用のリンクです。同一オリジンのパスではページ全体の再読み込みを防ぎ、ルーターが有効なら `RouterCore.push/replace` を呼び、そうでなければ `ran-navigate` イベントを DOM ツリーの上へ送ります。

外部の URL（`http://`、`//`、`mailto:`、`tel:`）は、普通の `<a>` リンクとしてそのまま通ります。

#### 属性

| 属性      | 型        | 既定値  | 説明                                               |
| --------- | --------- | ------- | -------------------------------------------------- |
| `href`    | `string`  | `''`    | 遷移先のパス                                       |
| `replace` | `boolean` | `false` | 履歴を積むのではなく、現在のエントリーを置き換える |
| `sheet`   | `string`  | `''`    | Shadow DOM に注入する CSS                          |

```html
<r-link href="/about">概要</r-link>
<r-link href="/settings" replace>設定</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### スロット

`r-router`、`r-route`、`r-link` はいずれも名前付きスロットを公開しません。どれもデフォルトの（無名の）`<slot>` だけを描画します。`r-router` と `r-route` は子のルートやルートの内容をそのまま投影し、`r-link` は中に入れたものをリンクの見える内容として投影します。3 つとも `::part()` を定義しないので、このコンポーネント群には CSS parts の節がありません。

## JavaScript API

### `createRouter(config?)`

グローバルな `RouterCore` のインスタンスを作って登録します。アプリの起動時、`r-router` 要素をマウントする前に一度だけ呼んでください。

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history'（既定） | 'hash'
  base: '/app', // 内部のパスすべてから '/app' の接頭辞を取り除く
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### オプション

| オプション       | 型                              | 既定値      | 説明                                                      |
| ---------------- | ------------------------------- | ----------- | --------------------------------------------------------- |
| `mode`           | `'history' \| 'hash'`           | `'history'` | URL の方式                                                |
| `base`           | `string`                        | `''`        | ベースパスの接頭辞                                        |
| `routes`         | `RouteConfig[]`                 | `[]`        | path、exact、meta を持つルート定義                        |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | View Transitions を有効にする（`true` は `'spa'` と同じ） |

### `RouterCore`

フック系のメソッドはすべて**購読解除の関数**を返します。

| 名前                     | シグネチャ / 型                                         | 説明                                                     |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | 遷移して履歴エントリーを新しく積む                       |
| `replace(path)`          | `(path: string) => Promise<void>`                       | 遷移して現在のエントリーを置き換える                     |
| `back()`                 | `() => void`                                            | `history.back()`                                         |
| `forward()`              | `() => void`                                            | `history.forward()`                                      |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                      |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | ナビゲーションガードを登録。遷移が確定する前に走る       |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | 遷移後のフック。DOM が更新されたあとに走る               |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | ルートの変更をすべて購読する                             |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | ドキュメント間の `pageswap` イベント（MPA モードのみ）   |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | ドキュメント間の `pagereveal` イベント（MPA モードのみ） |
| `destroy()`              | `() => void`                                            | すべてのリスナーと注入した CSS を取り除く                |
| `currentRoute`           | `RouteLocation \| null`                                 | 現在のルート位置のオブジェクト                           |
| `mode`                   | `'history' \| 'hash'`                                   | 履歴のモード                                             |
| `base`                   | `string`                                                | ベース URL の接頭辞                                      |
| `routes`                 | `RouteConfig[]`                                         | 登録されたルート設定                                     |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

有効な `RouterCore` のインスタンスを返します。`createRouter` がまだ呼ばれていなければ `null` を返します。

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## ナビゲーションガード

ガードは登録順に、遷移が確定する前に走ります。許可するなら `next()`、取り消すなら `next(false)`、リダイレクトするなら `next('/path')` を呼びます。

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// あとでガードを外す：
unsubscribe();
```

### 遷移後のフック

`afterEach` と `onRouteChange` は、どちらも DOM が更新されたあとに発火します。完了した遷移に依存する副作用には `afterEach` を、軽い購読には `onRouteChange` を使ってください。

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

ブラウザーの [View Transitions API](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API) を使って、ルート遷移にアニメーションを付けられます。

### 比較

CSS を書き始める前にモードを選んでください。

| モード   | Chrome      | きっかけ                                           | JS が必要か |
| -------- | ----------- | -------------------------------------------------- | ----------- |
| `'spa'`  | 111+        | `router.push()` / `r-link` のクリック              | はい        |
| `'mpa'`  | 126+        | 任意の `<a>` リンク、フォーム送信、`location.href` | いいえ      |
| `'both'` | 111+ / 126+ | 上記すべて                                         | 任意        |

### SPA — 同一ドキュメント内の遷移

```js
const router = createRouter({ viewTransition: 'spa' }); // または true
```

`router.push()` / `router.replace()` を呼ぶたびに、DOM の更新が `document.startViewTransition()` で包まれます。API が使えない環境では、同期的な更新へ素直に劣化します（Chrome 111 以上）。

アニメーションを定義する CSS を足します。

```css
/* 既定のクロスフェード */
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

### MPA — ドキュメント間の遷移

```js
const router = createRouter({ viewTransition: 'mpa' });
```

`<head>` に `@view-transition { navigation: auto }` を注入し、同一オリジンのページ全体遷移すべてで自動的なトランジションを有効にします（Chrome 126 以上）。各ページに JavaScript は要りません。

ルーターをまったく使わないアプリ向けには：

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// 必要なら cleanup() で注入した <style> を取り除けます
```

**MPA のライフサイクルイベント：**

```js
// pageswap は、離れていくドキュメントで unload の前に発火します
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal は、入ってくるドキュメントで最初の描画の前に発火します
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA と MPA の併用

```js
const router = createRouter({ viewTransition: 'both' });
```

SPA の遷移では `startViewTransition()` を使い、ページ全体の遷移では CSS の `@view-transition` ルールを使います。JS で駆動できるときはそれを使い、できないときは CSS に任せます。

## `view-transition-name` — 要素を共有する遷移

`view-transition-name` は、ビューポート全体ではなく特定の要素を 2 つのページのあいだでアニメーションさせます。ブラウザーが両側で要素の位置と大きさを捉え、そのあいだを補間します。[Chrome の Profiles デモ](https://view-transitions.chrome.dev/profiles/mpa/)にあるカードが飛び出す効果がこれです。

### 基本的な使い方

遷移元と遷移先で「同じ」要素に、同じ名前を付けます。

```html
<!-- 一覧ページ -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- 詳細ページ -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

ブラウザーが、一覧での位置から詳細での位置まで、カードを形を変えながら自動的にアニメーションさせます。

### 一覧の中で名前を動的に決める

`view-transition-name` はページ内で一意でなければなりません。項目の ID を名前の一部に使ってください。

```css
/* CSS でのやり方 — カードごとに 1 ルール */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// JS でのやり方 — 遷移の直前に名前を動的に設定する
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

遷移先のページでは、最初の描画より前に対応する名前を設定します。

```js
// ブラウザーが捉えられるよう、その場で（同期的に）設定します
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### 方向のあるスライド遷移

`beforeEach` のガードと CSS カスタムプロパティを組み合わせると、遷移の方向ごとに違うアニメーションを出せます。

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

ある要素を遷移から外すには `view-transition-name: none` を使います。複数の部分を別々にアニメーションさせたいときは、それぞれに一意の名前を付けてください。名前のないものは、ルートの遷移でまとめてフェードします。

## SSR / SSG

ブラウザーの API（`window`、`history`、`document`）はすべて `typeof` で守られているので、Node / Deno の SSR 環境でも `createRouter` を安全に呼べます。SSR の文脈では、`push` と `replace` はナビゲーションガードを走らせて `currentRoute` を更新しますが、`history.pushState` / `history.replaceState` は飛ばします。`popstate` のリスナーはサーバー側では一切登録されません。クライアントでのハイドレーションはいつもどおりで、同じ設定でもう一度 `createRouter` を呼んでください。

## 型リファレンス

```ts
interface RouteLocation {
  path: string; // 例：'/users/42'
  params: Record<string, string>; // 例：{ id: '42' }
  query: Record<string, string>; // 例：{ tab: 'profile' }
  fullPath: string; // 例：'/users/42?tab=profile'
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
