# durationHandler

遅らせて実行する関数を作ります。決めた時間がたってから、指定した関数を実行します。

## API

### durationHandler

#### 戻り値

| 引数 | 説明 | 型 |
| ---------- | ---------------------------------------------------- | ---------------------------------- |
| `Function` | 遅延時間を受け取る関数を返します | `(duration: number) => Promise<U>` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| ----------- | ------------------------------ | ---------- | -------- |
| `handler` | 実行する関数 | `Function` | 必須 |
| `...params` | 関数に渡す引数 | `T[]` | 必須 |

## 使用例

### 基本的な使い方

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('こんにちは', name);
  return 'done';
}, 'World');

// 1 秒後に実行する
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### API リクエストを遅らせる

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// 2 秒後にリクエストを実行する
const data = await delayedRequest(2000);
console.log(data);
```

### networkSpeed と組み合わせる

```js
import { durationHandler, imageRequest } from 'ranuts';

// 遅らせて画像をリクエストする関数を作る
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// 3 秒後に実行する
const latency = await delayedImageRequest(3000);
console.log('遅延:', latency, 'ms');
```

## 補足

1. **カリー化された関数**：遅延時間を受け取る関数を返すので、関数型のスタイルに馴染みます。
2. **非同期にも対応**：非同期関数にも対応し、実行が終わるまで待ちます。
3. **エラーの扱い**：関数の実行が失敗すると、Promise は reject されます。
4. **使いどころ**：遅らせての実行、時間を決めた処理、ネットワークの計測などでよく使われます。
