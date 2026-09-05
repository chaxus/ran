# isSafari

いまのブラウザーが Safari かどうかを判定します。

## API

### isSafari

#### 戻り値

| 引数                             | 説明                        | 型                               |
| -------------------------------- | --------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | Safari のブラウザーかどうか | `boolean \| undefined \| string` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('いまのブラウザーは Safari です');
} else {
  console.log('Safari ではありません');
}
```

### Safari 固有の機能

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Safari 固有の処理
  // 例：Safari の互換性の問題に対処する
  applySafariFix();
}
```

### サーバー側の環境

```js
import { isSafari } from 'ranuts';

// サーバー側の環境では undefined を返します
const result = isSafari();
console.log(result); // undefined（サーバー側の環境）
```

## 補足

1. **判定のしかた**：`navigator.vendor` に 'Apple' が含まれるかどうかで判定します。
2. **ほかのブラウザーを除く**：Chrome iOS（CriOS）と Firefox iOS（FxiOS）は除外します。
3. **サーバー側の環境**：サーバー側の環境（`navigator` オブジェクトがない）では `undefined` を返します。
4. **戻り値**：ブラウザーでは `boolean`、サーバー側では `undefined` を返します。場合によっては文字列を返すこともあります。
