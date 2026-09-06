# prefetch

大きなアセットを、必要になる前にブラウザーのキャッシュへ温めておきます。それも、利用者に黙って通信量を使うことなく。

肝心なのはこの一点です。Service Worker が同一オリジンの GET をキャッシュ優先で扱っているなら、URL を一度 `fetch` するだけで CacheStorage に入ります。以後、同じ URL への要求はキャッシュに当たり、オフラインでも動きます。ですから先読みに特別なダウンローダーは要りません。バイト列を引いてくるだけです。

## API

| 関数 | 説明 |
| ---------------------------------- | ------------------------------------------------------------------ |
| `whenIdle(callback, options?)` | ブラウザーが暇になったら実行します。取り消し用の関数を返します |
| `networkAllowsDownload(options?)` | いま利用者の通信量を使ってよいか |
| `isUrlCached(url)` | その URL はすでに CacheStorage にあるか |
| `prefetchUrl(url)` | URL をひとつキャッシュへ引き込みます。すでにあれば飛ばし、失敗しても黙っています |
| `prefetchUrls(urls, options?)` | 一覧に対して同じことを、**順番に** 行います |
| `prefetchWhenIdle(urls, options?)` | 3 つを合わせたもの。許可 → 暇 → 順番に先読み。呼び出しを妨げません |

### オプション

| オプション | 対象 | 説明 | 既定値 |
| ---------------------- | ----------------- | -------------------------------------------------------------- | ------------------- |
| `timeout` | `whenIdle` | `requestIdleCallback` を待つ上限（ミリ秒） | `8000` |
| `fallbackDelay` | `whenIdle` | `requestIdleCallback` がないときの待ち時間（ミリ秒） | `2500` |
| `optOutKey` | 通信の可否 | localStorage のキー。値が何であれ、利用者が先読みを切ったという意味です | — |
| `slowTypes` | 通信の可否 | 遅すぎるとみなす `effectiveType` の値 | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls` | 一覧を制御中の SW へ渡すためのメッセージの `type` | — |

## 使用例

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// あとで：もう手元にあるか？（いちばん最後に落ち終わるファイルで確かめます）
const ready = await isUrlCached(modelFiles.at(-1));
```

## 補足

1. **先読みが使うのは他人の通信量です。** `networkAllowsDownload` は、データセーバーが有効なとき、回線が遅いとき、利用者が断ったときに拒みます。
2. **わからないなら許可とみなします。** Network Information API は Safari にも Firefox にもありません。回線の状態を読めないことは、先読みを一切しない理由にはなりません。
3. **一覧は順番に取ってきます。** 帯域を埋め尽くせば、利用者がいま見ているページのほうが遅くなってしまいます。
4. **できれば Service Worker の経路を使ってください。** `event.waitUntil` を使う SW ならページを移っても落とし続けますが、メインスレッドの fetch は利用者が別の場所へ移った時点で死にます。制御中の SW がなければ、自動でそちらへ切り替わります。
5. **一式がキャッシュ済みかを確かめるときは、いちばん大きなファイルで確かめてください。** さもないと、途中まで落ちただけのものが完了と読めてしまいます。
6. **失敗を黙って飲み込むのは意図してのことです。** 先読みに失敗しても、本番の読み込みのときに落ちてくるだけのことです。
