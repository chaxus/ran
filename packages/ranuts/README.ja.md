# ranuts

ブラウザー API、データ処理、ストリーム、2D 描画向け TypeScript ユーティリティ。

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> プレリリース段階です。API とパッケージ形式は変更される場合があります。バージョンを固定し、更新前に移行ガイドを確認してください。

## クイックスタート

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

実行環境と用途に合う入口を選んでください。一部の関数はブラウザーのグローバル変数を必要とし、すべての関数がサーバー対応とは限りません。

| パッケージ            | 用途                                  |
| --------------------- | ------------------------------------- |
| `ranuts/utils`        | DOM/BOM、色、バイナリ、ストレージなど |
| `ranuts/i18n`         | 独立した国際化エンジン                |
| `ranuts/stream`       | SSE 解析とストリーム応答の状態        |
| `ranuts/conversation` | 会話イベントログの投影                |
| `ranuts/visual`       | 2D 描画；ブラウザー                   |
| `ranuts/vnode`        | 仮想 DOM；ブラウザー                  |
| `ranuts/sw`           | Service Worker のキャッシュ戦略       |

## IIFE / CDN

通常の script タグでは独立 IIFE を使用します。VERSION を公開済みバージョンに置き換えてください。バンドラーやモジュールローダーは不要です。

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

ユーティリティ IIFE のグローバル名は `ranuts_utils`、完全版 `dist/iife/index.iife.js` は `ranuts` です。VERSION を公開済みバージョンに置き換えてください。

## ドキュメント

- [ranuts](https://ran.chaxus.com/ja/src/ranuts/)
- [API](./docs/API.md)
- [メンテナーと Agent 向け資料](./CLAUDE.md)
- [移行ガイド](https://ran.chaxus.com/ja/src/ranuts/migration/)

## 貢献

[メンテナーと Agent 向け資料](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## ライセンス

[MIT](./LICENSE)
