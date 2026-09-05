# imageRequest

画像のリクエストを使って、ネットワークの遅延（ping）を測ります。

## API

### imageRequest

#### 戻り値

| 引数              | 説明                                               | 型        |
| ----------------- | -------------------------------------------------- | --------- |
| `Promise<number>` | リクエストの所要時間（ミリ秒）で解決される Promise | `Promise` |

#### パラメーター

| パラメーター | 説明                                         | 型       | 既定値 |
| ------------ | -------------------------------------------- | -------- | ------ |
| `url`        | 画像の URL（任意。既定は GitHub の favicon） | `string` | 任意   |

## 使用例

### 基本的な使い方

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('ネットワークの遅延:', latency, 'ms');
```

### 測定に使う URL を指定する

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('遅延:', latency, 'ms');
```

### ネットワークの品質を測る

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('ネットワークは良好');
    } else if (latency < 300) {
      console.log('ネットワークは並');
    } else {
      console.log('ネットワークは遅い');
    }
  } catch (error) {
    console.error('測定に失敗:', error);
  }
}
```

## 補足

1. **既定の URL**：URL を渡さないときは GitHub の favicon（約 2.2KB）を使います。
2. **測り方**：画像の読み込みにかかる時間、つまりリクエストの開始から読み込み完了までを測って遅延とします。
3. **エラーの扱い**：画像の読み込みに失敗すると、Promise は reject されます。
4. **使いどころ**：ネットワークの品質の判定やパフォーマンスの監視などでよく使われます。
