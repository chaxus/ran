# isMobile

いまのデバイスがモバイル端末かどうかを判定します。

## API

### isMobile

#### 戻り値

| 引数      | 説明                 | 型        |
| --------- | -------------------- | --------- |
| `boolean` | モバイル端末かどうか | `boolean` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('いまのデバイスはモバイルです');
} else {
  console.log('いまのデバイスはデスクトップです');
}
```

### レスポンシブなレイアウト

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`${layout} のレイアウトを使います`);
```

### 条件付きの読み込み

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // モバイル専用のコードを読み込む
  import('./mobile-module');
} else {
  // デスクトップ向けのコードを読み込む
  import('./desktop-module');
}
```

## 補足

1. **判定の規則**：User Agent から次のデバイスを見分けます。
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **サーバーサイドレンダリング**：サーバー側の環境（`window` オブジェクトがない）では `false` を返します。

3. **正確さ**：User Agent に基づく判定なので、UA を書き換えられると欺かれることがあります。

4. **iPad の扱い**：iPad は User Agent によっては、モバイル端末と判定されることがあります。
