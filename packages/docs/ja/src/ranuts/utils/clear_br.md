# clearBr

文字列から空白、HTML タグ、改行を取り除きます。

## API

### clearBr

#### 戻り値

| 引数     | 説明               | 型       |
| -------- | ------------------ | -------- |
| `string` | 整えたあとの文字列 | `string` |

#### パラメーター

| パラメーター | 説明         | 型       | 既定値 |
| ------------ | ------------ | -------- | ------ |
| `str`        | 整える文字列 | `string` | `''`   |

## 使用例

### 基本的な使い方

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### HTML の内容を整える

```js
import { clearBr } from 'ranuts';

const html = '<div>これは <strong>テスト</strong> の内容</div>\n改行';
const cleaned = clearBr(html);
console.log(cleaned); // 'これはテストの内容改行'
```

### 空文字列の扱い

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // ''（空文字列）
console.log(clearBr()); // ''（空文字列）
```

## 補足

1. **取り除くもの**：空白、HTML タグ、改行（`\r\n`）をすべて取り除きます。
2. **空文字列の扱い**：入力が空文字列なら、そのまま空文字列を返します。
3. **使いどころ**：書式の印を落として、素のテキストだけを取り出すのによく使われます。
