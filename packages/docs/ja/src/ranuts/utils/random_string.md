# randomString

先頭にタイムスタンプを付けたランダムな文字列を生成し、重なりにくくします。

## API

### randomString

#### 戻り値

| 引数     | 説明                                                    | 型       |
| -------- | ------------------------------------------------------- | -------- |
| `string` | ランダムな文字列（形式：タイムスタンプ-ランダムな文字） | `string` |

#### パラメーター

| パラメーター | 説明                                         | 型       | 既定値 |
| ------------ | -------------------------------------------- | -------- | ------ |
| `len`        | ランダムな部分の長さ（タイムスタンプを除く） | `number` | `8`    |

## 使用例

### 基本的な使い方

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // 例：'1703123456789-abc12345'
```

### 長さを指定する

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // 例：'1703123456789-abcdefghijkl'
```

### 一意な ID を作る

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('一意な ID:', uniqueId);
```

### 一時ファイルの名前

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // 例：'temp_1703123456789-xyz1234567.txt'
```

## 補足

1. **重なりにくさ**：タイムスタンプが入るので、生成される文字列は重なりにくくなっています。
2. **使う文字**：`ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678` を使い、見分けづらい文字（0、O、1、I、l など）を外しています。
3. **形式**：`{タイムスタンプ}-{ランダムな文字}` の形で返します。
4. **長さ**：引数の `len` はランダムな部分の長さだけを決めるもので、タイムスタンプとハイフンは含みません。

## getRandomString

もっと軽い選択肢です。タイムスタンプも付かず、使う文字も絞っていません。`Math.random().toString(36)` を `len` 文字に切り出すだけです（36 進数なので `0-9a-z`）。`randomString` のように衝突に強くはないので、使い捨ての DOM の id や、キャッシュを避けるためのクエリパラメータなど、タイムスタンプの衝突まで気にしなくてよい場面で使ってください。

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // 例：'k3j9x2p1'（8 文字）
getRandomString(4); // 例：'a1b2'
```
