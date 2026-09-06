# getPerformance

ページのパフォーマンスの計測値を取得します。DNS の解決、TCP の接続、リソースの読み込みなどの指標が含まれます。

## API

### getPerformance

#### 戻り値

| 引数 | 説明 | 型 |
| ------------------------ | -------------------------- | ------------------------ |
| `BasicType \| undefined` | パフォーマンスの計測値のオブジェクト | `BasicType \| undefined` |

#### BasicType

| プロパティ | 説明 | 型 |
| -------------- | ------------------------------------------------------- | --------------------- |
| `dnsSearch` | DNS の解決にかかった時間（ミリ秒） | `number` |
| `tcpConnect` | TCP の接続にかかった時間（ミリ秒） | `number` |
| `sslConnect` | SSL の安全な接続にかかった時間（ミリ秒） | `number` |
| `request` | TTFB。ネットワークのリクエストにかかった時間（ミリ秒） | `number` |
| `response` | データの転送にかかった時間（ミリ秒） | `number` |
| `parseDomTree` | DOM の解析にかかった時間（ミリ秒） | `number` |
| `resource` | リソースの読み込みにかかった時間（ミリ秒） | `number` |
| `domReady` | DOM Ready までの時間（ミリ秒） | `number` |
| `httpHead` | HTTP ヘッダーの大きさ（バイト） | `number` |
| `interactive` | 最初に操作できるようになるまでの時間（ミリ秒） | `number` |
| `complete` | ページが完全に読み込まれるまでの時間（ミリ秒） | `number` |
| `redirect` | リダイレクトの回数 | `number` |
| `redirectTime` | リダイレクトにかかった時間（ミリ秒） | `number` |
| `duration` | リソースの要求にかかった合計時間（ミリ秒） | `number` |
| `fp` | First Paint までの時間（白い画面が続いた時間、ミリ秒） | `number \| undefined` |
| `fcp` | First Contentful Paint までの時間（最初の画面が出そろうまで、ミリ秒） | `number \| undefined` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('DNS の解決:', perf.dnsSearch, 'ms');
  console.log('TCP の接続:', perf.tcpConnect, 'ms');
  console.log('最初の画面まで:', perf.fcp, 'ms');
}
```

### パフォーマンスの計測

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // パフォーマンスのデータをサーバーへ送ります
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### パフォーマンスの分析

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== パフォーマンスの分析 ===');
  console.log('DNS の解決:', perf.dnsSearch, 'ms');
  console.log('TCP の接続:', perf.tcpConnect, 'ms');
  console.log('SSL のハンドシェイク:', perf.sslConnect, 'ms');
  console.log('リクエストの応答:', perf.request, 'ms');
  console.log('データの転送:', perf.response, 'ms');
  console.log('DOM の解析:', perf.parseDomTree, 'ms');
  console.log('リソースの読み込み:', perf.resource, 'ms');
  console.log('First Paint:', perf.fp, 'ms');
  console.log('First Contentful Paint:', perf.fcp, 'ms');
}
```

## 補足

1. **ブラウザーの対応**：Performance API に対応したブラウザーが必要ですが、いまどきのブラウザーはどれも対応しています。

2. **サーバー側の環境**：サーバー側の環境（`window` オブジェクトがない）では `undefined` を返します。

3. **呼ぶ時機**：完全なデータを得るには、ページの読み込みが終わってから（`load` イベントのあとで）呼ぶのがおすすめです。

4. **単位**：時間の単位はすべてミリ秒、大きさの単位はバイトです。

5. **使いどころ**：パフォーマンスの監視、分析、改善などでよく使われます。
