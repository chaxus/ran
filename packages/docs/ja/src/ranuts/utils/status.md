# getStatus / status

HTTP のステータスコードとメッセージを引き合わせる表と、双方向のヘルパー `getStatus` です。Node 自身の `http.STATUS_CODES` と同じ内容を、ブラウザーでも使える形にまとめてあります。

## 使い方

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — 数字の文字列はまずコードとして解釈します
getStatus('not found'); // 404 — 見つからなければメッセージとして引きます（大文字小文字は問いません）

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### パラメーター

| パラメーター | 説明                                                         | 型                 | 既定値 |
| ------------ | ------------------------------------------------------------ | ------------------ | ------ |
| `code`       | ステータスコード、数字の文字列、またはステータスのメッセージ | `number \| string` | 必須   |

#### 戻り値

`number | string` です。`number` を渡すと **メッセージ** が、`string` を渡すと **コード** が返ります（`'404'` のような数字の文字列はまずコードとして解釈し、既知のコードでなかったときにだけメッセージとして引き直します）。どちらにも当てはまらなければ例外を投げます。

### `status`

| フィールド | 説明                                                                        | 型                     |
| ---------- | --------------------------------------------------------------------------- | ---------------------- |
| `message`  | コード → メッセージ                                                         | `Map<number, string>`  |
| `code`     | 小文字にしたメッセージ → コード                                             | `Map<string, number>`  |
| `codes`    | 既知のコードすべて                                                          | `number[]`             |
| `redirect` | リダイレクトを表すコード（`300`、`301`、`302`、`303`、`305`、`307`、`308`） | `Record<number, true>` |
| `empty`    | 本文を持たないコード（`204`、`205`、`304`）                                 | `Record<number, true>` |
| `retry`    | やり直す価値のあるコード（`502`、`503`、`504`）                             | `Record<number, true>` |

## 補足

1. **知らないコードやメッセージを渡すと `getStatus` は例外を投げます。** `number` でも `string` でもない引数なら `TypeError`、それ以外は `Error` です。通信から読み取ったステータスコードのように、正しさが保証されない入力には `try`/`catch` を付けるか、先に `status.codes.includes(n)` で確かめてください。
2. **`status.redirect` / `empty` / `retry` は `Set` ではなくただのオブジェクトです。** 含まれるかどうかは `.has()` ではなく `status.retry[code]` で調べてください。
3. ブラウザーでも Node でも動くので（`ranuts/utils`）、サーバー側の `ranuts/node` のハンドラーが使うのと同じコードとメッセージの対応を、クライアントでもそのまま使えます。
