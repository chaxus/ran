---
description: 'ranuts はツリーシェイキングできる JavaScript / TypeScript のユーティリティライブラリです。DOM / BOM、文字列・オブジェクト・数値・色のヘルパー、ストレージ、ストリーム、2D レンダリングエンジン、仮想 DOM を備えます。'
---

# ranuts

フロントエンドと Node のためのユーティリティライブラリで、**独立した、ツリーシェイキングできるエントリーポイント**として公開されています。必要なものを持っているサブパスから import すれば、それ以外はバンドルに入りません。すべて TypeScript で書かれ、すべての export はソースから生成されたドキュメントを持ちます。

- **npm**：<a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **ソース**：<a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## エントリーポイント

| import                                                | 中身                                                             | 実行環境            |
| ----------------------------------------------------- | ---------------------------------------------------------------- | ------------------- |
| `ranuts`                                              | ルートのバレル：utils と visual をまとめたもの                   | ブラウザー + Node   |
| [`ranuts/utils`](/ja/src/ranuts/utils/)               | DOM / BOM、文字列、オブジェクト、数値、色、時間、ストレージ…     | ブラウザー + Node\* |
| [`ranuts/node`](/ja/src/ranuts/node/)                 | HTTP サーバー、ルーター、WebSocket、fs、ストリーム、ミドルウェア | **Node 専用**       |
| [`ranuts/visual`](/ja/src/ranuts/visual/)             | 2D レンダリングエンジン（Canvas / WebGL / WebGPU）               | **ブラウザー専用**  |
| [`ranuts/i18n`](/ja/src/ranuts/i18n/)                 | 翻訳エンジン：フラットな辞書、実行時の切り替え                   | ブラウザー + Node   |
| [`ranuts/sw`](/ja/src/ranuts/sw/)                     | キャッシュ戦略と、プリキャッシュ規約のワーカー側                 | **Service Worker**  |
| [`ranuts/vnode`](/ja/src/ranuts/vnode/)               | Snabbdom 風の仮想 DOM                                            | ブラウザー          |
| [`ranuts/stream`](/ja/src/ranuts/stream/)             | SSE の解析、モデルストリームの畳み込み、トークンの予算           | ブラウザー + Node   |
| [`ranuts/conversation`](/ja/src/ranuts/conversation/) | イベントログ → 描画できる会話のノード                            | ブラウザー + Node   |

\* `ranuts/utils` は間口が広く、大半はブラウザー向けですが、純粋なヘルパーはどこでも動きます。**ブラウザーのコードで `ranuts/node` を import しないでください。** `fs` / `http` / `child_process` を引き込みます。

## 何が入っているか

**関数まわり**：[debounce](/ja/src/ranuts/utils/debounce) · [throttle](/ja/src/ranuts/utils/throttle) ·
[once / singleFlight](/ja/src/ranuts/utils/memoize) ·
[QuestQueue](/ja/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/ja/src/ranuts/utils/with_timeout) ·
[compose](/ja/src/ranuts/utils/compose)

**データ**：[cloneDeep](/ja/src/ranuts/utils/clone_deep) · [isEqual](/ja/src/ranuts/utils/is_equal) ·
[merge](/ja/src/ranuts/utils/merge) · [filterObj](/ja/src/ranuts/utils/filter_obj) ·
[数値の整形と解析](/ja/src/ranuts/utils/parse_number) ·
[色の変換と混合](/ja/src/ranuts/utils/color)

**テキスト**：[md5](/ja/src/ranuts/utils/md5) · [truncate](/ja/src/ranuts/utils/truncate) ·
[detectLanguage](/ja/src/ranuts/utils/detect_language) ·
[resolveLocale](/ja/src/ranuts/utils/resolve_locale) ·
[segmentByRanges](/ja/src/ranuts/utils/segment) · [paginate](/ja/src/ranuts/utils/paginate) ·
[escapeHtml](/ja/src/ranuts/utils/escape_html)

**ブラウザー**：[ストレージ](/ja/src/ranuts/utils/local_storage) ·
[IndexedDB](/ja/src/ranuts/utils/web_db) · [Worker クライアント](/ja/src/ranuts/utils/worker_client) ·
[postMessage ブリッジ](/ja/src/ranuts/bridge/) · [プリフェッチ](/ja/src/ranuts/utils/prefetch) ·
[デバイス判定](/ja/src/ranuts/utils/current_device) ·
[パフォーマンス](/ja/src/ranuts/utils/get_performance) · [ZIP](/ja/src/ranuts/utils/zip) ·
[音声の録音](/ja/src/ranuts/utils/audio_recorder) ·
[音声からテキストへ](/ja/src/ranuts/utils/speech)

**AI とチャット**：[stream](/ja/src/ranuts/stream/) · [conversation](/ja/src/ranuts/conversation/) ·
[i18n](/ja/src/ranuts/i18n/)

**描画**：[2D エンジン](/ja/src/ranuts/visual/) · [仮想 DOM](/ja/src/ranuts/vnode/) ·
[canvas のヘルパー](/ja/src/ranuts/utils/canvas) · [tween](/ja/src/ranuts/utils/tween)

**Node**：[HTTP サーバーとルーター](/ja/src/ranuts/node/) ·
[ファイル操作](/ja/src/ranuts/file/write_file) ·
[MIME タイプ](/ja/src/ranuts/mime_type/mime_type)

これは一部です。[API リファレンス](/ja/src/ranuts/api)には**すべての** export がシグネチャと説明つきで載っており、ソースから生成されているのでずれることがありません。

## 次に読むもの

| こうしたいとき                                   | 読むもの                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| ある関数があるかどうかと、そのシグネチャを調べる | [API リファレンス](/ja/src/ranuts/api)                                          |
| 似たふたつのユーティリティのどちらを使うか決める | [ユーティリティの選び方](/ja/src/ranuts/choosing/)                              |
| カテゴリーごとに眺める                           | [ユーティリティ一覧](/ja/src/ranuts/utils/)                                     |
| ストリーミングされたモデルの応答を描画する       | [stream](/ja/src/ranuts/stream/) → [conversation](/ja/src/ranuts/conversation/) |
| その上に UI を作る                               | [ranui](/ja/src/ranui/)                                                         |

どちらのパッケージも npm の tarball の中に `CLAUDE.md` を同梱しています。コーディングエージェント向けの案内で、ネットワークなしに `node_modules` からそのまま読めます。
