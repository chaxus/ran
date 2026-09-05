# networkSpeed

何度かリクエストを送って、いまのネットワークの ping 値とゆらぎを測ります。

## API

### networkSpeed

#### 戻り値

| 引数                  | 説明                                       | 型        |
| --------------------- | ------------------------------------------ | --------- |
| `Promise<ReturnType>` | ネットワークの測定結果で解決される Promise | `Promise` |

#### ReturnType

| プロパティ | 説明                           | 型       |
| ---------- | ------------------------------ | -------- |
| `ping`     | ping 値の平均（ミリ秒）        | `number` |
| `jitter`   | ネットワークのゆらぎ（ミリ秒） | `number` |

#### パラメーター

| パラメーター | 説明             | 型        | 既定値 |
| ------------ | ---------------- | --------- | ------ |
| `options`    | 設定のオプション | `Options` | 必須   |

#### オプション

| パラメーター | 説明                             | 型       | 既定値 |
| ------------ | -------------------------------- | -------- | ------ |
| `url`        | 測定に使う画像の URL             | `string` | 必須   |
| `duration`   | リクエストどうしの間隔（ミリ秒） | `number` | `3000` |
| `count`      | 測定の回数                       | `number` | `5`    |

## 使用例

### 基本的な使い方

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('平均の遅延:', result.ping, 'ms');
console.log('ネットワークのゆらぎ:', result.jitter, 'ms');
```

### ネットワークの品質を見立てる

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('ネットワークの品質はとても良い');
  } else if (ping < 100 && jitter < 50) {
    console.log('ネットワークの品質は良い');
  } else {
    console.log('ネットワークの品質は並');
  }
}
```

### 測定の条件を変える

```js
import { networkSpeed } from 'ranuts';

// 2 秒おきに 10 回測ります
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## 補足

1. **ゆらぎ**：ネットワークの揺れ具合を表します。何度かの測定結果のうち最大と最小の差で、小さいほどネットワークが安定しています。
2. **測り方**：画像のリクエストを何度か送り、遅延の平均とゆらぎを求めます。
3. **既定の条件**：既定では 3 秒おきに 5 回測ります。
4. **使いどころ**：ネットワークの品質の判定、パフォーマンスの監視、体験の改善などでよく使われます。
