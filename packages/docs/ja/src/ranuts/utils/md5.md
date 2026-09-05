# md5

MD5 のハッシュ関数です。文字列を MD5 のハッシュ値（16 進数の文字列）に変換します。

## API

### md5

#### 戻り値

| 引数     | 説明                                | 型       |
| -------- | ----------------------------------- | -------- |
| `string` | MD5 のハッシュ値（16 進数の文字列） | `string` |

#### パラメーター

| パラメーター | 説明                 | 型       | 既定値 |
| ------------ | -------------------- | -------- | ------ |
| `str`        | ハッシュ化する文字列 | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### パスワードのハッシュ化

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### ファイルの中身のハッシュ化

```js
import { md5 } from 'ranuts';

const fileContent = 'ここにファイルの中身';
const fileHash = md5(fileContent);
console.log('ファイルのハッシュ:', fileHash);
```

### 文字列でない値の扱い

```js
import { md5 } from 'ranuts';

// 文字列でない値を渡すと、ランダムな文字列が返ります
const result = md5(123);
console.log(result); // ランダムな文字列
```

## 補足

1. **安全性**：MD5 は安全でないとされているので、パスワードの保存など安全性が問われる場面では使わないでください。SHA-256 のような、より安全なハッシュアルゴリズムをおすすめします。
2. **入力の型**：文字列でない値を渡すと、ランダムな文字列が返ります。
3. **出力の形**：32 文字の 16 進数の文字列（小文字）を返します。
4. **速度**：データが大きいと MD5 の計算に時間がかかることがあるので、非同期の場面で使うのがおすすめです。
