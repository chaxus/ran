# isEqual

ふたつの値が等しいかどうかを深く比べます。オブジェクト、配列、日付など、込み入った型どうしの比較にも対応します。

## API

### isEqual

#### 戻り値

| 引数      | 説明                       | 型        |
| --------- | -------------------------- | --------- |
| `boolean` | ふたつの値が等しいかどうか | `boolean` |

#### パラメーター

| パラメーター | 説明               | 型    | 既定値 |
| ------------ | ------------------ | ----- | ------ |
| `value`      | 比べるひとつめの値 | `any` | 必須   |
| `other`      | 比べるふたつめの値 | `any` | 必須   |

## 使用例

### 基本的な使い方

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### オブジェクトを比べる

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### 配列を比べる

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### 日付を比べる

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### 循環参照の扱い

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true（循環参照も扱えます）
```

## 補足

1. **深い比較**：オブジェクトや配列のすべてのプロパティを、再帰的に比べます。
2. **循環参照**：循環した参照も正しく扱えます。
3. **型の確認**：値の型も見るので、型が違えば false を返します。
4. **速度**：大きなオブジェクトや配列では、深い比較に時間がかかることがあります。
