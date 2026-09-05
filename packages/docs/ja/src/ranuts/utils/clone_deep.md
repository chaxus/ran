# cloneDeep

オブジェクトや配列をディープコピーします。入れ子になったオブジェクトや配列も含め、完全に独立した複製を作ります。

## API

### cloneDeep

#### 戻り値

| 引数  | 説明                                 | 型    |
| ----- | ------------------------------------ | ----- |
| `any` | 複製された新しいオブジェクトまたは値 | `any` |

#### パラメーター

| パラメーター | 説明       | 型    | 既定値 |
| ------------ | ---------- | ----- | ------ |
| `value`      | 複製する値 | `any` | 必須   |

## 使用例

### 基本的な使い方

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2（もとのオブジェクトは変わりません）
console.log(cloned.b.c); // 3
```

### 配列を複製する

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3（もとの配列は変わりません）
console.log(cloned[2].a); // 4
```

### 入れ子のオブジェクトを複製する

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### Date オブジェクトを複製する

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## 補足

1. **完全に独立**：複製されたオブジェクトはもとのものから完全に独立しており、どちらを変えても互いに影響しません。
2. **ディープコピー**：入れ子のオブジェクトや配列を、再帰的にすべて複製します。
3. **循環参照**：循環した参照も正しく扱えます。
4. **速度**：大きなオブジェクトや配列では、ディープコピーに時間がかかることがあります。
5. **関数や特殊なオブジェクト**：関数や正規表現など一部の特殊なオブジェクトの複製のされ方は、実装によって変わることがあります。
