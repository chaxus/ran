# removeClassToElement

指定した DOM 要素から CSS のクラス名を取り除きます。

## API

### removeClassToElement

#### 戻り値

戻り値はありません（`void`）

#### パラメーター

| パラメーター  | 説明             | 型        | 既定値 |
| ------------- | ---------------- | --------- | ------ |
| `element`     | DOM 要素         | `Element` | 必須   |
| `removeClass` | 取り除くクラス名 | `string`  | 必須   |

## 使用例

### 基本的な使い方

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// element から 'active' クラスが取り除かれました
```

### 条件付きの削除

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### サーバー側での安全性

```js
import { removeClassToElement } from 'ranuts';

// サーバー側の環境では例外を投げず、静かに何もしません
removeClassToElement(element, 'class-name'); // サーバー側：何も起きません
```

## 補足

1. **存在の確認**：要素がそのクラスを持っているときだけ取り除きます。
2. **サーバー側での安全性**：サーバー側の環境（`document` オブジェクトがない）では、例外を投げず静かに処理します。
3. **classList を使います**：現代的な `classList.remove()` を使うので、`className` を直接いじるより安全です。
