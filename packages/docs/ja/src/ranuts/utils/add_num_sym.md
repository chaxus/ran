# addNumSym

数値に正負の符号（+ か -）を付けます。

## API

### addNumSym

#### 戻り値

| 引数     | 説明                     | 型       |
| -------- | ------------------------ | -------- |
| `string` | 符号の付いた数値の文字列 | `string` |

#### パラメーター

| パラメーター | 説明                                     | 型                 | 既定値 |
| ------------ | ---------------------------------------- | ------------------ | ------ |
| `value`      | 処理する数値または文字列                 | `string \| number` | 必須   |
| `flag`       | 符号のフラグ（任意。符号を強制するため） | `string \| number` | 任意   |

## 使用例

### 基本的な使い方

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### 文字列を渡す

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' （すでに符号があるのでそのまま）
```

### 符号を強制する

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100'（flag > 0）
console.log(addNumSym(100, -1)); // '100'（flag <= 0 なので + は付きません）
console.log(addNumSym(100, 0)); // '100'
```

### すでに符号が付いている場合

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' （すでに符号があるのでそのまま）
console.log(addNumSym('-50')); // '-50' （すでに符号があるのでそのまま）
```

## 補足

1. **符号のきまり**：
   - 正の数には自動で `+` を付けます
   - 負の数は `-` をそのまま残します
   - ゼロには符号を付けません

2. **すでに符号がある場合**：文字列が `+` か `-` で始まっていれば、符号を重ねて付けることはありません。

3. **強制のフラグ**：`flag` 引数で `+` を付けるかどうかを強制できます（`flag > 0` のときに付きます）。

4. **使いどころ**：損益や増減など、正負をはっきり見せたい表示でよく使われます。
