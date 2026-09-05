# Chain

メソッドをつないで書ける DOM 操作のクラスです。要素の生成、属性の設定、イベントの購読などができます。

## API

### Chain

#### コンストラクター

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### 主なメソッド

| メソッド           | 説明                                 | 戻り値  |
| ------------------ | ------------------------------------ | ------- |
| `setAttribute`     | 要素の属性を設定します               | `Chain` |
| `removeAttribute`  | 要素の属性を取り除きます             | `Chain` |
| `append`           | 子要素を追加します                   | `Chain` |
| `remove`           | 子要素を取り除きます                 | `Chain` |
| `setTextContent`   | テキストの中身を設定します           | `Chain` |
| `setStyle`         | スタイルを設定します                 | `Chain` |
| `addChild`         | 子要素を追加します（配列も渡せます） | `Chain` |
| `listen`           | イベントリスナーを登録します         | `Chain` |
| `clearListener`    | イベントリスナーを外します           | `Chain` |
| `clearAllListener` | すべてのイベントリスナーを外します   | `Chain` |

#### プロパティ

| プロパティ | 説明     | 型            |
| ---------- | -------- | ------------- |
| `element`  | DOM 要素 | `HTMLElement` |

## 使用例

### 基本的な使い方

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### メソッドチェーン

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('クリックしてください')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('ボタンが押されました');
  });

document.body.appendChild(button.element);
```

### 子要素を追加する

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('見出し'))
  .addChild(new Chain('p').setTextContent('本文'));

document.body.appendChild(container.element);
```

### 子要素をまとめて追加する

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('項目 1'),
  new Chain('li').setTextContent('項目 2'),
  new Chain('li').setTextContent('項目 3'),
]);

document.body.appendChild(list.element);
```

### SVG 要素

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## 補足

1. **メソッドチェーン**：どのメソッドも `Chain` のインスタンスを返すので、つないで書けます。
2. **SVG への対応**：SVG のタグを自動で見分け、正しい名前空間で作ります。
3. **イベントの管理**：内部でイベントリスナーの対応づけを持っているので、管理も取り外しも簡単です。
4. **使いどころ**：DOM の構造を動的に組み立てたり、UI の部品を作ったりするのによく使われます。
