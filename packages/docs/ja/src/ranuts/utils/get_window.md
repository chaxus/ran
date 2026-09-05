# getWindow

ブラウザーをまたいで、ビューポートの大きさを取得します。

## API

### getWindow

#### 戻り値

| 引数 | 説明 | 型 |
| ------------- | ------------------ | ------------- |
| `ClientRatio` | ウィンドウの大きさのオブジェクト | `ClientRatio` |

#### ClientRatio

| プロパティ | 説明 | 型 |
| -------- | ---------------------- | -------- |
| `width` | ウィンドウの幅（ピクセル） | `number` |
| `height` | ウィンドウの高さ（ピクセル） | `number` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('ウィンドウの幅:', windowSize.width);
console.log('ウィンドウの高さ:', windowSize.height);
```

### レスポンシブなレイアウト

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // モバイル向けのレイアウト
  } else {
    // デスクトップ向けのレイアウト
  }
}

window.addEventListener('resize', handleResize);
```

### サーバー側での安全性

```js
import { getWindow } from 'ranuts';

// サーバー側の環境でも例外にならず、{ width: 0, height: 0 } を返します
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### 縦横比を求める

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('縦横比:', aspectRatio);
```

## 補足

1. **ブラウザー間の互換**：`window.innerWidth` と `window.innerHeight` を使うので、いまどきのブラウザーならどれでも動きます。

2. **サーバー側でも安全**：サーバー側の環境（`window` オブジェクトがない）では `{ width: 0, height: 0 }` を返し、例外は投げません。

3. **その時点の値**：呼んだ時点の大きさを返すので、ウィンドウの大きさが変わったら呼び直してください。

4. **使いどころ**：レスポンシブなレイアウト、メディアクエリ、ウィンドウの大きさの監視などでよく使われます。
