# loadScript

`<script>` をひとつ動的に差し込みます。中身で重複を判定します。

[`scriptOnLoad`](/ja/src/ranuts/utils/script_on_load) との違い。あちらは複数の URL を **まとめて** 読み込み（`.css` は `<link>` タグに回します）、こちらは **ひとつの** スクリプトを扱い、インラインの本体にも対応し、同じスクリプトが一度しか評価されないことを保証します。サードパーティの SDK を二重に差し込むと、たいてい初期化の副作用まで二度走ってしまいます。

重複を見分ける鍵は `type + content` の md5 なので、URL と、同じ名前を持つインラインのスクリプトが取り違えられることはありません。

## 使い方

```ts
import { loadScript } from 'ranuts/utils';

// 外部のスクリプト
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// インラインのスクリプト
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// 2 回目は何も起きません。すでに評価済みです
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### パラメーター

| パラメーター | 説明                                                                              | 型                   | 既定値 |
| ------------ | --------------------------------------------------------------------------------- | -------------------- | ------ |
| `type`       | `'url'` は `src` で読み込み、`'content'` はスクリプトの本文をそのまま埋め込みます | `'url' \| 'content'` | 必須   |
| `content`    | `type` が `'url'` なら URL、`'content'` ならスクリプトの本文                      | `string`             | 必須   |

#### 戻り値

| 引数      | 説明                                              | 型                              |
| --------- | ------------------------------------------------- | ------------------------------- |
| `promise` | 評価が終わると `{ success: true }` で解決されます | `Promise<{ success: boolean }>` |

外部のスクリプトの読み込みに失敗すると、`{ success: false, error }` で reject されます。

## 補足

**インライン** のスクリプトは、差し込まれたその瞬間に同期的に評価され、そのあと `load` イベントを発火しません。`onload` だけを待っていると、実際のブラウザーでは Promise が永遠に保留のままになるので、`type: 'content'` のときは `append` が返った時点で解決します。（jsdom はインラインのスクリプトにも load イベントを発火する _ので_、単体テストではこの違いに気づけません。）
