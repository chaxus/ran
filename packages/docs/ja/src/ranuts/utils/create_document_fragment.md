# createDocumentFragment

DocumentFragment を作り、複数の子要素を入れます。

## API

### createDocumentFragment

#### 戻り値

| 引数                            | 説明                          | 型                              |
| ------------------------------- | ----------------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | DocumentFragment オブジェクト | `DocumentFragment \| undefined` |

#### パラメーター

| パラメーター | 説明             | 型          | 既定値 |
| ------------ | ---------------- | ----------- | ------ |
| `list`       | 入れる要素の配列 | `Element[]` | 必須   |

## 使用例

### 基本的な使い方

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// 一度に DOM へ追加する
document.body.appendChild(fragment);
```

### 要素をまとめて追加する

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = '項目';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### サーバー側での安全性

```js
import { createDocumentFragment } from 'ranuts';

// サーバー側の環境では undefined を返します
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined（サーバー側の環境）
```

## 補足

1. **パフォーマンスの改善**：DocumentFragment を使えば DOM 操作の回数を減らせるので、速くなります。
2. **サーバー側でも安全**：サーバー側の環境（`document` オブジェクトがない）では `undefined` を返し、例外は投げません。
3. **一度きり**：Fragment を DOM に追加すると、その子要素は対象の要素へ移り、Fragment 自身は残りません。
4. **使いどころ**：要素をまとめて追加してリフローや再描画を減らし、速度を上げるのによく使われます。
