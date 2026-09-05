# currentDevice

いまのデバイスの種類を取得します。

## API

### currentDevice

#### 戻り値

| 引数            | 説明                 | 型                                        |
| --------------- | -------------------- | ----------------------------------------- |
| `CurrentDevice` | デバイス種別の文字列 | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`いまのデバイス: ${device}`);
// 出力の例：'ipad'、'android'、'iphone'、'pc'
```

### デバイスの種類で処理を分ける

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // iPhone 固有の処理
    break;
  case 'android':
    // Android 固有の処理
    break;
  case 'ipad':
    // iPad 固有の処理
    break;
  case 'pc':
    // PC 固有の処理
    break;
}
```

### デバイスごとのスタイル

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## 補足

1. **判定の順序**：次の順に見分けます。
   - iPad / iPod
   - Android
   - iPhone
   - それ以外（既定では 'pc' を返します）

2. **サーバーサイドレンダリング**：サーバー側の環境（`window` オブジェクトがない）では `'pc'` を返します。

3. **判定のしかた**：User Agent の文字列から見分けます。

4. **戻り値**：戻り値は列挙型で、`'ipad'`、`'android'`、`'iphone'`、`'pc'` のいずれかにしかなりません。
