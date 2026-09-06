# ranuts

よく使う関数と道具を集めた、実験的なユーティリティライブラリです

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

---

## ⚠️ はじめにお読みください

これは開発の初期段階にある**実験的なユーティリティライブラリ**です。動きはしますが、主に学びと試行のために作っています。

**要点：**

- 🚧 **開発の初期段階**：機能はまだ作り込みと手直しの途中です
- 🧪 **実験的**：API はたびたび変わるかもしれません
- 📚 **学びが目的**：JavaScript / TypeScript のユーティリティを学ぶことに主眼を置いています

## インストール

npm を使う場合：

```console
npm install ranuts@latest --save
```

## ドキュメント

[よく使う関数と道具のひととおり](https://ran.chaxus.com/ja/src/ranuts/)

**AI エージェントや LLM の方へ：** まず [CLAUDE.md](./CLAUDE.md)（全体の見取り図。エントリーポイント、実行環境の制約、決めごと）を読み、次に [docs/API.md](./docs/API.md)（export されているすべてのシンボルを、シグネチャと説明つきで生成したリファレンス。更新は `npm run doc:api`）を見てください。

あるいは、`ran` プラグインマーケットプレイスから既製の **Claude Code スキル**を入れてください。import の対応表、`ranuts/utils` の一覧、使用例、決めごとをアシスタントに渡し、パッケージに同梱された API リファレンスへ導いてくれます。

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

あとは Claude が自動で使います（`/ranuts:ranuts` と打って直に呼ぶこともできます）。

## 使い方

必要なものだけ import してください。選べるのは次のとおりです。

- `ranuts/utils` — DOM/BOM、文字列、オブジェクト、数値、色、時間、ストレージ、バイナリと zip、Worker と IndexedDB、多言語まわりのヘルパー
- `ranuts/node` — HTTP サーバー、ルーター、WebSocket、fs、ストリーム、ミドルウェア（**Node 専用**）
- `ranuts/visual` — 2D の描画エンジン（Canvas / WebGL / WebGPU。**ブラウザー専用**）
- `ranuts/sw` — キャッシュ戦略と、プリキャッシュ手順の Service Worker 側（**Service Worker 専用**）
- `ranuts/vnode` — Snabbdom 流の仮想 DOM
- `ranuts/stream` — Server-Sent Events の解析、提供元に依らない形へのモデル応答の畳み込み、そして履歴が収まらなくなる境目を決めるトークンの割り当て
- `ranuts/conversation` — 追記だけのイベントログを、描画できる会話ノードへ射影します
- `ranuts/i18n` — i18n エンジンだけを、`utils` のほかの部分なしで

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

まるごと import する場合（まるごと import すると要らないモジュールまで多く入ってきます。必要なものだけ import することをお勧めします）

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('window resized');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('window resized');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## 貢献について

学びの途中の方も、開発者の方も、貢献を歓迎します。実験的なプロジェクトなので、開発の進みについては気長にお付き合いください。

## 貢献してくださった方々

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 訪問者数

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## その他

[ライセンス（MIT）](/LICENSE)
