# isClient

いまの環境がクライアント（ブラウザー）かどうかを判定します。

## API

### isClient

#### 戻り値

| 引数      | 説明                       | 型        |
| --------- | -------------------------- | --------- |
| `boolean` | クライアントの環境かどうか | `boolean` |

#### パラメーター

パラメーターはありません

## 使用例

### 基本的な使い方

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('いまはブラウザーの環境です');
  // window や document などのブラウザー API が使えます
  window.localStorage.setItem('key', 'value');
} else {
  console.log('いまはサーバー側の環境です');
}
```

### 条件付きの実行

```js
import { isClient } from 'ranuts';

// クライアントでのみ実行する
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### サーバーサイドレンダリングでの安全性

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## 補足

1. **判定のしかた**：`typeof window !== 'undefined'` で判定します。
2. **定数です**：`isClient` は関数ではなく定数なので、使うときに括弧は要りません。
3. **使いどころ**：クライアントとサーバー側の環境を見分け、サーバー側でブラウザー API を使ってしまう事故を避けるのによく使われます。
