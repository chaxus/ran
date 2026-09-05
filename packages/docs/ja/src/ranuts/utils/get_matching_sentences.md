# getMatchingSentences

文章から検索語を含む文をまるごと取り出します。重なる文があれば、いちばん長いものだけを残します。

## API

### getMatchingSentences

#### 戻り値

| 引数    | 説明                                     | 型         |
| ------- | ---------------------------------------- | ---------- |
| `Array` | 検索語を含む文の配列（重複を除いたもの） | `string[]` |

#### パラメーター

| パラメーター  | 説明       | 型       | 既定値 |
| ------------- | ---------- | -------- | ------ |
| `text`        | もとの文章 | `string` | 必須   |
| `searchValue` | 検索語     | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### 複数の文が一致する場合

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### 重なる文の扱い

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// いちばん長い文だけが残ります
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### 空の値の扱い

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## 補足

1. **文の切れ目**：句点（。）、ピリオド（.）、改行（\n）、感嘆符（！）、疑問符（?、？）で文の切れ目を見分けます。
2. **重複の除去**：重なる文があるときは、いちばん長いものだけを残します。
3. **大文字小文字を区別しません**：検索は大文字小文字を区別しません。
4. **使いどころ**：検索語のハイライト、文章の要約、検索結果の表示などでよく使われます。
