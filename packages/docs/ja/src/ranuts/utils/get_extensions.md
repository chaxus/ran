# getExtensions

MIME タイプに対応するファイル拡張子の配列を取得します。

## API

### getExtensions

#### 戻り値

| 引数    | 説明                               | 型         |
| ------- | ---------------------------------- | ---------- |
| `Array` | ファイル拡張子の配列（ドットなし） | `string[]` |

#### パラメーター

| パラメーター | 説明        | 型       | 既定値 |
| ------------ | ----------- | -------- | ------ |
| `mimeType`   | MIME タイプ | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### すべての拡張子を取得する

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### ファイル種別の検証

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## 補足

1. **戻り値の形**：返る拡張子にドット（`.`）は含まれません。`'.jpg'` ではなく `'jpg'` です。
2. **複数の拡張子**：ひとつの MIME タイプが複数の拡張子に対応することがあり、一致するものをすべて返します。
3. **空の配列**：その MIME タイプが存在しなければ、空の配列を返します。
4. **使いどころ**：ファイル種別の検証やアップロードの確認などでよく使われます。
