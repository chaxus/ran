# isWeiXin

いまの環境が WeChat のブラウザーかどうかを判定します。

## API

### isWeiXin

#### 戻り値

| 引数      | 説明                        | 型        |
| --------- | --------------------------- | --------- |
| `boolean` | WeChat のブラウザーかどうか | `boolean` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('いまは WeChat のブラウザーです');
} else {
  console.log('WeChat のブラウザーではありません');
}
```

### WeChat 固有の機能

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // WeChat の JS-SDK を使う
  wx.config({
    // 設定
  });
} else {
  // 通常の共有機能を使う
  shareToSocial();
}
```

### 条件付きの表示

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // WeChat 固有のヒントを出す
  showWeChatTip();
}
```

## 補足

1. **判定のしかた**：User Agent に `micromessenger` の文字列が含まれるかどうかで判定します。

2. **サーバーサイドレンダリング**：サーバー側の環境（`window` オブジェクトがない）では `false` を返します。

3. **正確さ**：User Agent に基づく判定なので、UA が書き換えられていると正しく見分けられないことがあります。

4. **WeChat のバージョン**：WeChat ブラウザーのすべてのバージョンで動きます（WeChat 内蔵ブラウザーとミニプログラムの WebView を含みます）。
