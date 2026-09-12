---
description: 'ranui はネイティブのカスタム要素（<r-*>）で作られた Web Components UI ライブラリです。TypeScript の型定義、ライト／ダークテーマ、Shadow DOM、SSR と PWA に対応します。'
---

# ranui

**ネイティブのカスタム要素**で作られた UI ライブラリです。どのコンポーネントも `<r-*>` タグなので、
React でも Vue でも Svelte でも Solid でも Astro でも、素の HTML ファイルでも同じように動きます。
アダプターは要らず、フレームワークのバージョンを合わせる必要もありません。TypeScript の型定義、
デザイントークンによるライト／ダークテーマ、Shadow DOM によるカプセル化、サーバーレンダリングを
最初から備えています。

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://unpkg.com/ranui/dist/index.js"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/tree/main/packages/ranui"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- **npm**: <a href="https://www.npmjs.com/package/ranui">`ranui`</a> ·
  **ソース**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranui">`packages/ranui`</a>
- ranui は **alpha** です。バージョンには破壊的変更が入ります。バージョンを正確に固定し、
  アップグレード前に[更新履歴](/ja/src/ranui/changelog)を読んでください。

## インストール

```bash
npm install ranui
```

```html
<!-- CDN からでも。ビルド工程は不要 -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## 使い方

import すると要素が登録されます。あとはタグを書くだけです。

```js
import 'ranui'; // すべてのコンポーネント
import 'ranui/button'; // 一つだけでも
```

```html
<r-button type="primary">プロジェクトをデプロイ</r-button>
```

タグはどのフレームワークでも同じです。違うのは値の渡し方とイベントの結び付け方だけで、それは
[コーディング規約](/ja/src/ranui/coding-guides/#framework-integration)で詳しく扱っています。

::: code-group

```html [HTML]
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

```jsx [React]
import 'ranui';

export const App = () => <r-button type="primary">Deploy</r-button>;
// 複雑な値とイベントリスナーは ref 経由で渡します — コーディング規約を参照。
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<!-- ビルド設定の compilerOptions.isCustomElement に `r-` を追加してください。 -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## エントリーポイント

各エントリーは名前どおりのものだけを登録します。テーマだけが欲しいページがコンポーネント
ライブラリの分を負担することはありません。

| import                                                | 中身                                                    |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `ranui`                                               | すべてのコンポーネント                                  |
| `ranui/<component>`                                   | コンポーネント一つ：`ranui/button`、`ranui/select`、…   |
| [`ranui/theme`](/ja/src/ranui/theme/)                 | ライト／ダークテーマとトークンの上書き。要素は含まない  |
| [`ranui/i18n`](/ja/src/ranui/i18n/)                   | 翻訳エンジン。要素は含まない                            |
| `ranui/fonts`                                         | セルフホストの Geist Sans + Geist Mono                  |
| `ranui/style`                                         | スタイルシート。自動で読み込まれない環境向け            |
| [`ranui/builder`](/ja/src/ranui/builder/)             | 細粒度リアクティビティつきの流暢な DOM ビルダー         |
| [`ranui/ssr`](/ja/src/ranui/ssr/), `ranui/ssr-stream` | サーバーレンダリング                                    |
| `ranui/testing`                                       | テストから閉じた shadow root に手を入れるためのヘルパー |
| `ranui/typings`                                       | アンビエントな JSX / TS の要素型                        |

## コンポーネント

40 要素。属性、プロパティ、イベント、スロット、`::part()` 名まで含めた全体像は
[要素 API リファレンス](/ja/src/ranui/api)にあります。

**共通**: [Button](/ja/src/ranui/button/) · [Icon](/ja/src/ranui/icon/) ·
[Loading](/ja/src/ranui/loading/)

**データ入力**: [Input](/ja/src/ranui/input/) · [CheckBox](/ja/src/ranui/checkbox/) ·
[Select](/ja/src/ranui/select/) · [ColorPicker](/ja/src/ranui/colorpicker/) ·
[Attachments](/ja/src/ranui/attachments/) · [VoiceButton](/ja/src/ranui/voice-button/) ·
[Forms](/ja/src/ranui/form/)

**データ表示**: [Card](/ja/src/ranui/card/) · [Section](/ja/src/ranui/section/) ·
[Tabs](/ja/src/ranui/tab/) · [Image](/ja/src/ranui/image/) · [Progress](/ja/src/ranui/progress/) ·
[Radar](/ja/src/ranui/radar/) · [Player](/ja/src/ranui/player/) · [Preview](/ja/src/ranui/preview/) ·
[Glass](/ja/src/ranui/glass/) · [Scratch](/ja/src/ranui/scratch/) ·
[StateDot](/ja/src/ranui/state-dot/) · [DisclosureRow](/ja/src/ranui/disclosure-row/)

**コンテンツ描画**: [Markdown](/ja/src/ranui/markdown/) · [Math](/ja/src/ranui/math/) ·
[Mermaid](/ja/src/ranui/mermaid/)

**AI とチャット**: [Conversation](/ja/src/ranui/conversation/) ·
[Reasoning](/ja/src/ranui/reasoning/) · [ToolCard](/ja/src/ranui/tool-card/) ·
[TokenMeter](/ja/src/ranui/token-meter/)

**オーバーレイとフィードバック**: [Modal](/ja/src/ranui/modal/) · [Popover](/ja/src/ranui/popover/) ·
[Dropdown](/ja/src/ranui/dropdown/) · [Message](/ja/src/ranui/message/) ·
[Skeleton](/ja/src/ranui/skeleton/)

**ナビゲーション**: [Router](/ja/src/ranui/router/) · [Route](/ja/src/ranui/route/) ·
[Link](/ja/src/ranui/link/)

**基盤**: [テーマ](/ja/src/ranui/theme/) · [ThemeSwitch](/ja/src/ranui/theme-switch/) ·
[i18n](/ja/src/ranui/i18n/)

5 つの要素には専用ページがありません。ほかの要素の内側でしか存在しないからです：`<r-option>`
（Select）、`<r-tabs>`（Tabs）、`<r-img>`（Image）、`<r-dropdown-item>`（Dropdown）、
`<r-content>`（Popover）。ほかと同じく API リファレンスには載っています。

### ライブ

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px">
  <r-button type="primary">Primary</r-button>
  <r-button type="warning">Warning</r-button>
  <r-button type="text">Text</r-button>
  <r-button>Default</r-button>
  <r-icon name="lock" size="28"></r-icon>
  <r-icon name="user" size="28"></r-icon>
  <r-icon name="loading" size="28" color="#1E90FF" spin></r-icon>
</div>

<div style="width:100%;margin-bottom:12px">
  <r-progress percent="0.7" type="drag"></r-progress>
</div>

<r-markdown copy content="**Streaming** Markdown with `code`, tables, mermaid and math."></r-markdown>

## スタイリング

コンポーネントは**閉じた** shadow root に描画されます。ページ側の CSS は中へ漏れず、セレクターも
中へ届きません。入口は 4 つあり、以下は推奨順です。

**1. デザイントークン（CSS カスタムプロパティ）**：境界を越えて継承されるので、`:root` でも、
外側のコンテナでも、要素そのものでも指定できます。

```html
<r-progress
  percent="0.7"
  type="drag"
  style="--ran-progress-track-background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f)"
></r-progress>
```

<div style="width:100%;margin:12px 0">
  <r-progress percent="0.7" type="drag" style="--ran-progress-track-background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>
</div>

**2. `::part()`**：トークンでは届かない構造的な調整に ·
**3. `sheet` 属性**：shadow root へ CSS を注入する ·
**4. スロットに渡した内容**：あなたのドキュメントに留まり、ページの CSS がそのまま効きます。

トークンの名前は[デザインシステム](/ja/src/ranui/design-system/)に、どれを選ぶかの基準は
[デザインガイドライン](/ja/src/ranui/design-guides/)に、仕組みは
[コーディング規約](/ja/src/ranui/coding-guides/#styling-across-the-shadow-boundary)にあります。

## イベント

コンポーネントは `CustomEvent` を派発し、中身は `detail` に入ります。リスナーは要素に結び付けて
ください。イベントがバブリングするかはコンポーネントごとの判断で、API リファレンスがすべてについて
明記しています。

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

これらは普通の DOM 要素なので `onchange="…"` 属性形式も `el.onchange = …` プロパティ形式も動きます。
ただしハンドラーは一つしか持てず、キャプチャフェーズも使えないので、まずは `addEventListener` を
選んでください。

## 次に読むもの

| やりたいこと                                 | 読むページ                                           |
| -------------------------------------------- | ---------------------------------------------------- |
| 要素の正確な API を調べる                    | [要素 API](/ja/src/ranui/api)                        |
| どのトークンを使うべきか、その理由を知る     | [デザインシステム](/ja/src/ranui/design-system/)     |
| 一つの体系に見える画面を作る                 | [デザインガイドライン](/ja/src/ranui/design-guides/) |
| ranui をアプリへ正しく組み込む               | [コーディング規約](/ja/src/ranui/coding-guides/)     |
| ライト／ダークを足す、全体を作り替える       | [テーマ](/ja/src/ranui/theme/)                       |
| インターフェースを翻訳する                   | [i18n](/ja/src/ranui/i18n/)                          |
| サーバー側で描画する                         | [サーバーレンダリング](/ja/src/ranui/ssr/)           |
| フレームワークなしでリアクティブな画面を作る | [ビルダー](/ja/src/ranui/builder/)                   |
| アップグレード前に変更点を確認する           | [更新履歴](/ja/src/ranui/changelog)                  |

## ブラウザ対応

Custom Elements v1、Shadow DOM v1、CSS カスタムプロパティの上に作られているので、現代のブラウザ
すべてで動きます。**Internet Explorer は対象外です。**

![](../../../assets/ranui/customElements.png)

## コントリビューター

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## さらに読む

このライブラリが立脚する標準：[W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFC](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

開いておく価値のあるデザインの参考資料：[Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
