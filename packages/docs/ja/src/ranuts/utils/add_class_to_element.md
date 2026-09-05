# addClassToElement

指定した DOM 要素に CSS のクラス名を追加します。

## API

### addClassToElement

#### 戻り値

戻り値はありません（`void`）

#### パラメーター

| パラメーター | 説明             | 型        | 既定値 |
| ------------ | ---------------- | --------- | ------ |
| `element`    | DOM 要素         | `Element` | 必須   |
| `addClass`   | 追加するクラス名 | `string`  | 必須   |

## 使用例

### 基本的な使い方

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// これで element は 'active' クラスを持ちます
```

### 重複した追加を避ける

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // 重複して追加はされません
```

### サーバー側での安全性

```js
import { addClassToElement } from 'ranuts';

// サーバー側の環境では例外を投げず、静かに何もしません
addClassToElement(element, 'class-name'); // サーバー側：何も起きません
```

## 補足

1. **重複の確認**：要素がすでにそのクラス名を持っていれば、重ねて追加しません。
2. **サーバー側での安全性**：サーバー側の環境（`document` オブジェクトがない）では、例外を投げず静かに処理します。
3. **classList を使います**：現代的な `classList.add()` を使うので、`className` を直接いじるより安全です。
