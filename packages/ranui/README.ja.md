# ranui

Web Components を土台にした、実験的な UI コンポーネントライブラリです。各コンポーネントは Shadow DOM に包まれ、CSS トークンで装いを整え、SSR と Declarative Shadow DOM に対応しています。

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## はじめにお読みください

これは開発の初期段階にある**実験的な UI ライブラリ**です。使えはしますが、主に学びと試行のために作っています。

要点：

- **開発の初期段階**：機能はまだ作り込みと手直しの途中です。
- **実験的**：API はたびたび変わるかもしれません。
- **学びが目的**：主に Web Components と UI 開発を学ぶためのものです。

## 特徴

1. **フレームワークを選びません：** React、Vue、Preact、SolidJS、Svelte、そして W3C の標準に沿った JavaScript のプロジェクトなら何にでも使えます。
2. **素の HTML と同じ手ざわり：** `<r-button>` や `<r-modal>` といったカスタム要素を、ネイティブの HTML 要素と同じように書けます。
3. **モジュールに分かれた設計：** まるごとの import とコンポーネント単位の import の両方に対応し、保守しやすさとバンドルの大きさを手元に置けます。
4. **Shadow DOM による隔離：** コンポーネントの中身は既定で外から切り離されており、CSS トークン・`::part()`・`sheet` 属性が、決められた形の差し込み口を用意します。
5. **TypeScript 対応：** TypeScript で書かれ、型定義もついています。
6. **SSR に優しい：** `defineSSR`、`renderToString`、Declarative Shadow DOM を通してサーバー側の描画に対応します。
7. **アクセシブル：** ARIA のロールと状態、キーボードだけでの操作、フォームに紐づく入力（`<r-checkbox>` / `<r-input>` / `<r-select>` はネイティブの `FormData` に載ります）、ライブリージョンのトースト、`prefers-reduced-motion` への対応。

## インストール

npm を使う場合：

```console
npm install ranui --save
```

## ドキュメントと例

[コンポーネントと使用例を見る](https://ran.chaxus.com/ja/src/ranui/)

### コンポーネントと API リファレンス

どの要素についても、属性・プロパティ・**イベント（`detail` の形つき）**・スロット・`::part()` の名前がソースから生成されています。export を grep して回る必要はありません。

- 要素ごとの API：[docs/COMPONENTS.md](./docs/COMPONENTS.md)
- デザインの基準（色・余白・タイポグラフィ・動き・アクセシビリティ）：[docs/DESIGN.md](./docs/DESIGN.md)

コンポーネントの API を変えたら、次で作り直してください。

```bash
pnpm doc:api
```

CI はリポジトリのルートで `pnpm run verify:docs` を走らせます。生成されたリファレンスがソースと食い違うと、そこで落ちます。

### AI / Claude Code のスキル

既製のスキルを入れると、AI アシスタント（Claude Code）がソースを掘り返さずに ranui を読み、使えるようになります。`ran` プラグインマーケットプレイスで公開しています。

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

入れておけば、ranui を触っているときに Claude が自動で使います（`/ranui:ranui` と打って直に呼ぶこともできます）。スキルには import の対応表、要素の一覧、builder とリアクティビティの API、アクセシビリティ、使用例が入っていて、パッケージに同梱された API リファレンス（[docs/COMPONENTS.md](./docs/COMPONENTS.md)）へ導いてくれます。

### スタイルのドキュメント

スタイルのしくみは CSS トークンと `::part()` に統一されています。

- スタイル上書きの手引き：[docs/style-override.md](./docs/style-override.md)
- トークンと Part の完全な一覧（自動生成）：[docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- 利用者向けの公開スタイル API（自動生成）：[docs/style-tokens-public.md](./docs/style-tokens-public.md)
- 公開トークンの絞り込み設定：[docs/style-token-filter.json](./docs/style-token-filter.json)

スタイルのドキュメントは次で更新します。

```bash
pnpm doc:style
```

### テーマ

ranui のトークン体系はひとつだけで、[Geist デザインシステム](https://vercel.com/geist)（Vercel が公開しているデザイン言語）を土台にしています。そこでは色は**状態のはしご**です。どの階調も 100 から 1000 まで進み、一段ごとに役目がひとつ決まっています（背景 → ホバー → 枠線 → べた塗り → 文字）。ranui はそのはしごと **Geist Sans / Geist Mono** を取り入れているので、ダークモードでは基礎の階調を定義し直すだけで、意味のトークンはすべて自動で切り替わります。モードは `light`・`dark`・`system` の三つだけで、テーマパックはありません。実行時にモードを切り替えたり、どのトークンでも上書きしたりできます（SSR でも安全です）。

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // 読み込み時に、保存しておいた選択を復元します
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

`ranui/theme` のエントリーにはテーマのエンジンしか入っていません。カスタム要素は何も登録されないので、トークンとダークモードだけが欲しいならバンドルに余計なものが入りません。同じ API は `ranui` のバレルからも再 export されています。

ダークモードで定義し直すのは基礎の色階調だけです。意味のトークン（`--ran-color-*`）はそれを参照しているので、自動で切り替わります。[docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) と [docs/DESIGN.md](./docs/DESIGN.md) を参照してください。

### 多言語対応

フレームワークに依らない i18n エンジンが、`ranui/i18n` という独立したエントリーとして入っています。`ranui/theme` と同じく、カスタム要素は何も登録しません。

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // ロケールごとに平らな辞書です。キーはそのまま使われ、入れ子にはなりません
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // 選択を localStorage に覚えておきます
  detectNavigatあるいは： true, // 最初のロケールをブラウザーから決めます
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // 保存したうえで、購読者へ知らせます
```

`t()` はまずフォールバックのロケールへ、それでも見つからなければキーそのものへと落ちます。`{param}` の差し込みも行われます。核の部分は SSR でも安全です。

## import のしかた

バンドルを小さく保つには、コンポーネント単位で import してください。

```js
import 'ranui/button';
```

コンポーネント以外のサブパスは、ユーティリティだけを単体で提供します。要素をすべて登録することなく、必要なエンジンだけを引き込めます。

```js
import { initTheme } from 'ranui/theme'; // テーマだけ
import { createI18n } from 'ranui/i18n'; // 多言語だけ
```

スタイルが当たらないときは、スタイルシートを自分で import してください。

```js
import 'ranui/style';
```

型の解決に失敗するときは、型のエントリーポイントのどれかを自分で import してください。

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

うまくいくものがひとつあれば足ります。

まるごとの import にも対応しています。

```ts
import 'ranui';
```

ES モジュール：

```js
import 'ranui';
```

あるいは：

```js
import 'ranui/button';
```

UMD、IIFE、CJS：

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### バンドラーを使わない場合（静的なページや CDN）

そのページが使うコンポーネントの数に合った配布形態を選んでください。

| 場面                                      | おすすめ                                              | 理由                                                                 |
| ----------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| コンポーネント 1〜2 個、script タグひとつ | コンポーネント単位の IIFE：`dist/iife/<name>.iife.js` | それだけで完結し、モジュール構文が要りません                         |
| コンポーネントが数個                      | コンポーネント単位の ES モジュール：`dist/<name>.js`  | 共通のランタイムは、ブラウザーのモジュールグラフが重複を取り除きます |
| ぜんぶ                                    | まるごとのバンドル：`dist/index.iife.js`              | ファイルひとつで、すべてのコンポーネントが登録されます               |
| バンドラーのあるプロジェクト              | npm からの import：`import 'ranui/<name>'`            | tree shaking が効き、ランタイムもひとつで済みます                    |

コンポーネント単位の IIFE。タグひとつで、ビルドの手順は要りません。

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

IIFE はそれぞれ、内部で使う依存を取り込んでいます（たとえば `select` には `icon` が入っています）。要素の登録には二重登録を防ぐ仕掛けがあるので、依存を共有するファイルをいくつも読み込んでも問題ありません。ただし、ファイルごとに共通ランタイムの写しを抱えます。ページが複数のコンポーネントを使うなら、重複を取り除いてくれる ES モジュールのほうを選んでください。

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## 使い方

RanUI のコンポーネントは Web Components なので、フレームワークごとのラッパーなしで使えます。

たいていの場面では、ネイティブの HTML 要素と同じように書けます。

例：

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

### メッセージの位置と置き場所

`window.message` では、上からの位置・重なり順・どこに差し込むかを指定できます。

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

`top` は `number` でも `string` でもかまいません。`24` は `24px` になり、`'2rem'` は単位のまま扱われます。

`zIndex` も `number` と `string` の両方を受けつけます。

`getContainer` は `HTMLElement` を返す必要があります。省いた場合、メッセージは `document.body` に差し込まれます。

### リアクティビティの部品

`signal`、`createEffect`、`computed`、`batch`、`untrack`、それに所有関係の層（`createRoot` / `onCleanup` / `getOwner` / `runWithOwner`）が、DOM の builder と並んで入っています。フレームワークなしで、反応する画面の一部を組み立てるためのものです。設計は SwiftUI の `@Observable` になぞらえつつ、Solid.js 流の保証を備えています。エフェクトは再実行のたびに古い購読を自動で片づけます。`batch()` は複数の書き込みをひとつの反映にまとめます。`computed` は**遅延評価かつ値でメモ化**されます（誰にも読まれないメモは一度も計算されず、値が実際に変わったときだけ依存する側を起こします）。そしてエフェクト・メモ・バインディングはすべてスコープが持ち主なので、`createRoot` を破棄すれば、そこから生まれたものが一度の呼び出しでまとめて片づきます。ページやルートを畳む単位がこれです。`ElementBuilder` のチェーンできるメソッド（`text` / `attr` / `class` など）はシグナルのゲッターも受けつけ、自動で更新されるバインディングになります。詳しくは [`ranvi`](../ranvi/README.md) を。

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
            }), // 書き込み二回で、エフェクトの反映は一回
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
  }; // 片づけ
}
```

API の全体は[ユーティリティのドキュメント](./utils/README.md)を参照してください。

### ルーティング

RanUI にはクライアント側のルーティングが入っています。宣言的なコンポーネントと JavaScript の API の両方から使えます。

**宣言的なコンポーネント：**

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

**遷移ガードつきの JavaScript API：**

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

JS のルーターが要らない純粋な MPA のサイトでは、`enableMpaViewTransitions()` を呼ぶと `@view-transition { navigation: auto }` が差し込まれます。要素を共有したまま形を変えるアニメーションは、標準の `view-transition-name` プロパティで書けます。

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

ガード、`onPageSwap` / `onPageReveal`、要素ごとのトランジション名まで含めた API の全体は、[ルーターのドキュメント](https://ran.chaxus.com/ja/src/ranui/router/)を参照してください。

### SSR と Builder

SSR や宣言的な UI の組み立てのために、RanUI は内部で `builder`、SSR のレジストリ、Declarative Shadow DOM を使っています。コンポーネントは `ensureShadowRoot` で既存の Shadow Root を再利用し、木の組み立てはコンストラクターで行います。サーバーが描いた木は最初の一コマを描いたあと差し替えられます。コンポーネントが取り付けるのは**閉じた** shadow root で、`attachShadow` は宣言的な shadow root の子を消すため、クライアント側では必ず組み立て直されるからです。

ソースの層での SSR 描画の例：

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Declarative Shadow DOM を含む HTML 文字列を返します。
const html = renderToString(button);
```

詳しくは[ユーティリティのドキュメント](./utils/README.md)を参照してください。

## コンポーネントを書くときの決めごと

コンポーネントを足したり手入れしたりするときは、このパッケージの決めごとに従ってください。

- `RanElement` を継承してください。ブラウザーの `HTMLElement` を直に継承してはいけません。
- Shadow Root は `ensureShadowRoot` で作る、または使い回してください。`attachShadow` を直に呼んではいけません。
- Shadow DOM の部分木はコンストラクターで組み立ててください。ほかの場所ではいけません。
- 組み立てながら `.ref()` で要素を掴み、`shadowPart` で読み戻してください。コンポーネント自身が組み立てたものを `querySelector` で探してはいけません。
- `observedAttributes` に `sheet` を含め、コンポーネント単位のスタイル上書きは `syncSheetAttribute` を通して反映してください。
- `attributeChangedCallback` の先頭は `if (old === next) return;` で守ってください。
- コンポーネントの登録は `defineSSR('r-name', Component)` で行ってください。`customElements.define` を直に呼んではいけません。
- `index.ts` には型の export と副作用の import の両方を足してください。あわせて `vite.config.ts` と `package.json` にも単独のエントリーを足します。
- `connectedCallback` の中でライフサイクルに紐づくリスナーを張るときは `@/utils/builder` の `EventManager` を使い、`disconnectedCallback` で `manager.abort()` を呼んでください。`removeEventListener` を一つずつ追いかけるのはやめましょう。

## 貢献について

学びの途中の方も、開発者の方も、貢献を歓迎します。実験的なプロジェクトなので、活発に作り変わっていくものと思ってください。

## 貢献してくださった方々

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## その他

[ライセンス（MIT）](/LICENSE)
