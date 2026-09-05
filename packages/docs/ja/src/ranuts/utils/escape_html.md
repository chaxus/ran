# escapeHtml

HTML の特殊文字をエスケープして、XSS 攻撃を防ぎます。

## API

### escapeHtml

#### 戻り値

| 引数     | 説明                 | 型       |
| -------- | -------------------- | -------- |
| `string` | エスケープ後の文字列 | `string` |

#### パラメーター

| パラメーター | 説明                 | 型                         | 既定値 |
| ------------ | -------------------- | -------------------------- | ------ |
| `string`     | エスケープする文字列 | `string \| number \| null` | 必須   |

## 使用例

### 基本的な使い方

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### 特殊文字をエスケープする

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### 数値と null の扱い

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### XSS 攻撃を防ぐ

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// 安全に表示され、スクリプトは実行されません
```

## 補足

1. **エスケープされる文字**：次の文字がエスケープされます。
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **型の変換**：文字列でない型は、まず文字列に変換してからエスケープします。

3. **安全性**：XSS 攻撃を防ぐためのもので、ユーザーの入力を表示するときに使ってください。

4. **速度**：特殊文字を含まない文字列は、そのまま元の文字列を返します。
