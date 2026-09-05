# getFrame

1 ミリ秒あたりのフレームレートを求めます。1 秒あたりにするには 1000 を掛けてください。

## API

### getFrame

#### 戻り値

| 引数              | 説明                                                 | 型        |
| ----------------- | ---------------------------------------------------- | --------- |
| `Promise<number>` | フレームレート（1 ミリ秒あたり）で解決される Promise | `Promise` |

#### パラメーター

| パラメーター | 説明                   | 型       | 既定値 |
| ------------ | ---------------------- | -------- | ------ |
| `n`          | 標本にするフレームの数 | `number` | `10`   |

## 使用例

### 基本的な使い方

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('フレームレート（1 ミリ秒あたり）:', fps);
console.log('フレームレート（1 秒あたり）:', fps * 1000);
```

### 標本の数を変える

```js
import { getFrame } from 'ranuts';

// 20 フレームを標本にして平均のフレームレートを求める
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### パフォーマンスの計測

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('フレームレートが低い:', fpsPerSecond);
  } else {
    console.log('フレームレートは正常:', fpsPerSecond);
  }
}
```

### アニメーションの具合を確かめる

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`アニメーションのフレームレート: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## 補足

1. **単位について**：返るのは 1 ミリ秒あたりのフレームレートです。1 秒あたり（FPS）にするには 1000 を掛けてください。
2. **標本の取り方**：`requestAnimationFrame` で標本を取り、複数フレームの平均の間隔から求めます。
3. **非同期の処理**：Promise を返すので、`await` か `.then()` で扱ってください。
4. **使いどころ**：パフォーマンスの監視、アニメーションの具合の確認、ゲームのフレームレートの監視などでよく使われます。
