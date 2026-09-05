# report / setReportUrl / createData

テレメトリーのビーコンを、自分のエンドポイントへ送ります。

## API

### setReportUrl(config)

起動時に一度だけ、既定のエンドポイントを設定します。URL の文字列か、次のオブジェクトを受け付けます。

| フィールド     | 説明                                                                   | 型       |
| -------------- | ---------------------------------------------------------------------- | -------- |
| `url`          | `url` を自分で持たない `report()` すべてに使われる既定のエンドポイント | `string` |
| `userIdCookie` | ユーザー ID が入っている Cookie。`createData()` が拾います             | `string` |

### getReportUrl()

設定されているエンドポイント。なければ `''`。

### report({ url?, type?, payload })

`payload` を送ります。`navigator.sendBeacon` を優先し、だめなら 1x1 の画像リクエストに切り替えます。どれかの手段が受け取れば `true`、どれも送れなければ `false` を返します。エンドポイントが設定されていない場合も `false` です。

### createData(params?)

決まった形の外枠を組み立てます。イベント ID、ページの URL、タイムスタンプ、リファラー、ビューポート、User Agent。`userIdCookie` が設定されていれば `userId` も入ります。渡した `params` は最後に適用されます。SSR では `{}` を返します。

## 使用例

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## 補足

1. **既定のエンドポイントは、あえてありません。** ライブラリの側では、あなたのテレメトリーがどこへ行くべきかを知りようがありません。ですから `report()` は当て推量をせず `false` を返します。
2. **どの手段を使うかは、sendBeacon が実際に成功したかどうかで決まります。** `navigator` があるかどうかではありません。`sendBeacon` は、ブラウザーのキューが上限を超えたときも `false` を返します。その場合も画像のビーコンへ回ります。
3. **`createData()` はイベントごとに呼んでください。** 準備のときに一度だけではいけません。この関数は走ったその瞬間の URL とタイムスタンプを写し取ります。ハンドラーの外へ出してしまうと、以後のイベントがすべてページ読み込み時の状態を報告することになります。

::: warning 0.3 で getHost を置き換えました
`getHost()` はなくなりました。このリポジトリの作者のドメインを直に書き込んだうえでログのエンドポイントを組み立てており、しかも編集の名残で出力が文字どおりの `'//log.'`（たどり着けないホスト）にまで落ちていました。そのため `url` を明示しない報告は、すべて黙って虚空へ投げられていました。`createData()` も、直に書かれた `chaxus_prod` という Cookie を読まなくなりました。代わりに `userIdCookie` を設定してください。
:::
