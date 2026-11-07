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

| import                                            | 中身                                                         | 実行環境            |
| ------------------------------------------------- | ------------------------------------------------------------ | ------------------- |
| `ranuts`                                          | ルートのバレル：utils と visual をまとめたもの               | ブラウザー + Node   |
| [`ranuts/utils`](/ja/ranuts/utils/)               | DOM / BOM、文字列、オブジェクト、数値、色、時間、ストレージ… | ブラウザー + Node\* |
| [`ranuts/visual`](/ja/ranuts/visual/)             | 2D レンダリングエンジン（Canvas / WebGL / WebGPU）           | **ブラウザー専用**  |
| [`ranuts/i18n`](/ja/ranuts/i18n/)                 | 翻訳エンジン：フラットな辞書、実行時の切り替え               | ブラウザー + Node   |
| [`ranuts/sw`](/ja/ranuts/sw/)                     | キャッシュ戦略と、プリキャッシュ規約のワーカー側             | **Service Worker**  |
| [`ranuts/vnode`](/ja/ranuts/vnode/)               | Snabbdom 風の仮想 DOM                                        | ブラウザー          |
| [`ranuts/stream`](/ja/ranuts/stream/)             | SSE の解析、モデルストリームの畳み込み、トークンの予算       | ブラウザー + Node   |
| [`ranuts/conversation`](/ja/ranuts/conversation/) | イベントログ → 描画できる会話のノード                        | ブラウザー + Node   |

## 何が入っているか

**関数まわり**：[debounce](/ja/ranuts/utils/debounce) · [throttle](/ja/ranuts/utils/throttle) ·
[once / singleFlight](/ja/ranuts/utils/memoize) ·
[QuestQueue](/ja/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/ja/ranuts/utils/with_timeout) ·
[compose](/ja/ranuts/utils/compose)

**データ**：[cloneDeep](/ja/ranuts/utils/clone_deep) · [isEqual](/ja/ranuts/utils/is_equal) ·
[merge](/ja/ranuts/utils/merge) · [filterObj](/ja/ranuts/utils/filter_obj) ·
[数値の整形と解析](/ja/ranuts/utils/parse_number) ·
[色の変換と混合](/ja/ranuts/utils/color)

**テキスト**：[truncate](/ja/ranuts/utils/truncate) ·
[detectLanguage](/ja/ranuts/utils/detect_language) ·
[resolveLocale](/ja/ranuts/utils/resolve_locale) ·
[segmentByRanges](/ja/ranuts/utils/segment) · [paginate](/ja/ranuts/utils/paginate) ·
[escapeHtml](/ja/ranuts/utils/escape_html)

**ブラウザー**：[ストレージ](/ja/ranuts/utils/local_storage) ·
[IndexedDB](/ja/ranuts/utils/web_db) · [Worker クライアント](/ja/ranuts/utils/worker_client) ·
[postMessage ブリッジ](/ja/ranuts/bridge/) · [プリフェッチ](/ja/ranuts/utils/prefetch) ·
[デバイス判定](/ja/ranuts/utils/current_device) ·
[パフォーマンス](/ja/ranuts/utils/get_performance) · [ZIP](/ja/ranuts/utils/zip) ·
[音声の録音](/ja/ranuts/utils/audio_recorder) ·
[音声からテキストへ](/ja/ranuts/utils/speech)

**AI とチャット**：[stream](/ja/ranuts/stream/) · [conversation](/ja/ranuts/conversation/) ·
[i18n](/ja/ranuts/i18n/)

**描画**：[2D エンジン](/ja/ranuts/visual/) · [仮想 DOM](/ja/ranuts/vnode/) ·
[canvas のヘルパー](/ja/ranuts/utils/canvas) · [tween](/ja/ranuts/utils/tween)

これは一部です。[API リファレンス](/ja/ranuts/api)には**すべての** export がシグネチャと説明つきで載っており、ソースから生成されているのでずれることがありません。

## 次に読むもの

| こうしたいとき                                   | 読むもの                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------- |
| ある関数があるかどうかと、そのシグネチャを調べる | [API リファレンス](/ja/ranuts/api)                                      |
| 似たふたつのユーティリティのどちらを使うか決める | [ユーティリティの選び方](/ja/ranuts/choosing/)                          |
| カテゴリーごとに眺める                           | [ユーティリティ一覧](/ja/ranuts/utils/)                                 |
| ストリーミングされたモデルの応答を描画する       | [stream](/ja/ranuts/stream/) → [conversation](/ja/ranuts/conversation/) |
| その上に UI を作る                               | [ranui](/ja/ranui/)                                                     |

どちらのパッケージも npm の tarball の中に `CLAUDE.md` を同梱しています。コーディングエージェント向けの案内で、ネットワークなしに `node_modules` からそのまま読めます。
