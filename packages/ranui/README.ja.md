# ranui

Shadow DOM、テーマトークン、SSR ヘルパーを備えたフレームワーク非依存の Web Components。

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## クイックスタート

```sh
npm install ranui@0.5.0
```

パッケージのインポートは ESM です。バンドラーではコンポーネント単位で読み込み、共有 CSS はアプリの入口で一度だけ読み込んでください。

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

HTML にカスタム要素を配置します：

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

通常の script タグでは公開済みの独立 IIFE を使用します。バンドラーやモジュールローダーは不要です。

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@0.5.0/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

完全版 IIFE は `dist/index.iife.js` です。同じページでは完全版かコンポーネント版のどちらかを選び、併用しないでください。

## TypeScript

各入口に型が付属します。ブラウザーのグローバル型や JSX 宣言が必要な場合は、型のみをインポートします：

```ts
import type {} from 'ranui/typings';
```

TypeScript が CSS の副作用インポートを検査する場合は、アプリの `assets.d.ts` に CSS 入口を宣言してください：

```ts
declare module 'ranui/style';
```

## SSR

このサーバー例では Node 24+ を使用します。コンポーネントを読み込むと SSR シリアライザーが登録され、結果には Declarative Shadow DOM が含まれます。

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

テーマモードは明示的に有効化します。公開トークンと part で調整してください。詳細は以下のリンクを参照してください。

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## ドキュメント

[ranui](https://ran.chaxus.com/ja/ranui/)

- [コンポーネント API](./docs/COMPONENTS.md)
- [スタイルとトークン](./docs/style-tokens-public.md)
- [デザインと操作](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [DOM ビルダーとシグナル](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [メンテナーと Agent 向け資料](./CLAUDE.md)

## 貢献

[メンテナーと Agent 向け資料](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## ライセンス

[MIT](./LICENSE)
