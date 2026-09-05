# getCookieByName

正規表現を使い、名前から Cookie の値を取得します。

## API

### getCookieByName

#### 戻り値

| 引数     | 説明                                | 型       |
| -------- | ----------------------------------- | -------- |
| `string` | Cookie の値。存在しなければ空文字列 | `string` |

#### パラメーター

| パラメーター | 説明          | 型       | 既定値 |
| ------------ | ------------- | -------- | ------ |
| `name`       | Cookie の名前 | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // Cookie の値、または空文字列
```

### getCookie との違い

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie は文字列の分割を使います
const value1 = getCookie('token');

// getCookieByName は正規表現を使います
const value2 = getCookieByName('token');

// はたらきは同じで、実装が違うだけです
```

### Cookie があるか確かめる

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('セッション ID:', sessionId);
} else {
  console.log('セッション ID がありません');
}
```

## 補足

1. **正規表現による照合**：正規表現で Cookie を照合するので、名前の前後に空白があっても大丈夫です。
2. **サーバー側でも安全**：サーバー側の環境（`window` オブジェクトがない）では空文字列を返し、例外は投げません。
3. **getCookie との違い**：はたらきは同じですが、`getCookieByName` は正規表現を、`getCookie` は文字列の分割を使います。
4. **戻り値**：Cookie がないときは、`null` でも `undefined` でもなく空文字列を返します。
