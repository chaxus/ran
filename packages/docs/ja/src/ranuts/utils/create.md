# create

DOM 要素を作るためのヘルパー関数です。HTML と SVG のどちらの要素にも対応します。

## API

### create

#### 戻り値

| 引数 | 説明 | 型 |
| ------------- | ------------------- | ------------- |
| `HTMLElement` | 作られた DOM 要素 | `HTMLElement` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | --------------------------- | ------------------------ | -------- |
| `tagName` | タグ名 | `string` | 必須 |
| `options` | 生成のオプション（任意） | `ElementCreationOptions` | 任意 |

## 使用例

### 基本的な使い方

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### SVG 要素を作る

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### 生成のオプションを使う

```js
import { create } from 'ranuts';

// カスタム要素を作る
const customElement = create('my-custom-element', { is: 'my-element' });
```

## 補足

1. **自動で見分けます**：SVG のタグを自動で見分け、正しい名前空間で作ります。
2. **HTML 要素**：普通の HTML 要素は `document.createElement` で作ります。
3. **SVG 要素**：SVG 要素は `document.createElementNS` で作ります。
4. **使いどころ**：SVG 要素を作る必要がある場面でよく使われ、生成の手順を短くします。
