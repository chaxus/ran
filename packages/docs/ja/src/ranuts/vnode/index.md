# 仮想 DOM（vnode）

Snabbdom 流の、軽い仮想 DOM です。画面を素の JavaScript オブジェクト（`VNode`）で表し、古い木と新しい木の差分を取り、そのちがいだけを本物の DOM に適用します。

- `init()` は差分適用の仕組みを組み立て、`patch` 関数を返します。同梱のモジュール（class / props / attrs / style / events）は自動で登録されます。
- `patch(oldVnode, newVnode)` は、`oldVnode` が本物の DOM 要素なら木をマウントし、そうでなければ二つの vnode の木の差分を取って DOM をその場で更新します。
- `h(sel, dataOrChildren?, children?)` は `VNode` を組み立てるハイパースクリプトのヘルパーです。

## 読み込み

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> 注意：この実装の `init()` は**引数を取りません**。モジュールの一式は決まっていて内部で登録されるので、個々の `*Module` の export を `init` に渡す必要はありません。export しているのは参照と確認のためです。

## 使用例

### はじめの一歩

```js
import { init, h } from 'ranuts/vnode';

// init() は `patch` 関数を返します。
// 同梱のモジュール（class、props、attrs、style、events）は自動で登録されます。
const patch = init();

const container = document.getElementById('app');

// vnode の木を組み立てる
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// 最初の描画。古い vnode の位置に本物の DOM 要素を渡すと、その中にマウントされます
patch(container, vnode);

// そのあと。更新後の木を組み立て、直前の vnode をそれへ patch します。
// DOM に適用されるのはちがいの部分（テキスト、スタイル、リスナー）だけです。
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // 次の patch のために最新の木を持っておく
```

### `h` でノードを組み立てる

```js
// タグだけ
h('div');

// タグ + data
h('div', { class: { active: true } });

// タグ + 子のテキストひとつ
h('span', 'hello');

// タグ + 子の配列
h('ul', [h('li', 'one'), h('li', 'two')]);

// タグ + data + 子
h('a', { attrs: { href: '/home' } }, 'Home');

// CSS 風のセレクターで id とクラスが決まります
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// セレクターが "svg" で始まると、SVG の名前空間が自動で適用されます
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

差分適用の仕組みを作り、`patch` 関数を返します。同梱のモジュールは内部で登録されるので、引数は取りません。

#### 戻り値

| 値      | 説明                                                    | 型                                                    |
| ------- | ------------------------------------------------------- | ----------------------------------------------------- |
| `patch` | vnode の木を本物の DOM に対してマウント・差分適用します | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

`init()` が返す関数です。最初の呼び出しでは `oldVnode` に本物の DOM の `Element` を渡すと、その中に木がマウントされます。二回目以降は直前の `VNode` を渡すと、差分を取ってその場で更新します。返るのは新しい `VNode` で、それを次の呼び出しの「古いほう」として持っておきます。

#### パラメーター

| パラメーター | 説明                                      | 型                 |
| ------------ | ----------------------------------------- | ------------------ |
| `oldVnode`   | 直前の vnode。最初のマウントでは DOM 要素 | `VNode \| Element` |
| `vnode`      | 描きたい新しい vnode の木                 | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

`VNode` を組み立てるハイパースクリプトのヘルパーです。次のように多重定義されています。

| シグネチャ               | 説明                                                     |
| ------------------------ | -------------------------------------------------------- |
| `h(sel)`                 | セレクターだけから要素を作る                             |
| `h(sel, data)`           | `VNodeData` つきの要素（`data` は `null` でもよい）      |
| `h(sel, children)`       | 子つきの要素。文字列や数値、`VNode` ひとつ、あるいは配列 |
| `h(sel, data, children)` | data と子の両方をもつ要素                                |

#### パラメーター

| パラメーター | 説明                                                                                                                             | 型                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `sel`        | CSS 風のセレクター。`tag`、`tag#id`、`tag.class`、それらの組み合わせ（`div#id.a.b`）。`svg…` なら SVG の名前空間が自動で付きます | `string`            |
| `data`       | ノードのデータ。class / props / attrs / style / リスナー / key / hook。`null` でもかまいません                                   | `VNodeData \| null` |
| `children`   | 文字列か数値（テキストノードになります）、`VNode` ひとつ、あるいはそれらの配列                                                   | `VNodeChildren`     |

#### `VNodeData` のフィールド

| フィールド | 説明                                                                             | 型                                            | 適用するモジュール               |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------- |
| `props`    | `elm[key] = value` の形で設定する DOM のプロパティ                               | `Record<string, any>`                         | `propsModule`                    |
| `attrs`    | `setAttribute` で設定する HTML 属性（`true`/`false` で付け外し）                 | `Record<string, string \| number \| boolean>` | `attributesModule`               |
| `class`    | 条件つきのクラス。`name → boolean` の対応                                        | `Record<string, boolean>`                     | `classModule`                    |
| `style`    | インラインスタイル。`name → value` の対応（`--var` のキーは CSS 変数になります） | `Record<string, any>`                         | `styleModule`                    |
| `on`       | イベントリスナー。`event → handler`（ハンドラーの配列も可）                      | `Record<string, Function \| Function[]>`      | `eventListenersModule`           |
| `key`      | 差分アルゴリズムが子を突き合わせ・並べ替えるために使う、変わらない目印           | `string \| number`                            | （差分の中核）                   |
| `ns`       | 名前空間の URI（SVG の部分木では自動で設定されます）                             | `string`                                      | （差分の中核）                   |
| `hook`     | vnode ごとのライフサイクルフック（`Hooks`）                                      | `Hooks`                                       | （型としてのみ。注意書きを参照） |

> 注意：`hook` と `Hooks` 型は公開されている型の一部です。ただしこの絞り込んだ実装は、**モジュール**のライフサイクル（`create` / `update` / `destroy`）を通して DOM を動かします。vnode ごとの `data.hook` のコールバックは、今の `patch` ループからは呼ばれません。

### モジュール

モジュールはそれぞれ `VNodeData` の一部分を受け持ちます。`init()` がそのすべてを登録しますが、個別にも export されています。

| export                 | 担当する部分 | 説明                                                                       |
| ---------------------- | ------------ | -------------------------------------------------------------------------- |
| `classModule`          | `data.class` | `name → boolean` の対応をもとにクラスを付け外しします                      |
| `propsModule`          | `data.props` | DOM のプロパティを直接代入します（`elm[key] = value`）                     |
| `attributesModule`     | `data.attrs` | `setAttribute` で HTML 属性を付け外しします（xml/xlink も含む）            |
| `styleModule`          | `data.style` | インラインスタイルと CSS カスタムプロパティを設定します                    |
| `eventListenersModule` | `data.on`    | イベントリスナーを付け外しします                                           |
| `modules`              | —            | モジュール名からモジュール本体への対応をもつ、既定のレジストリオブジェクト |

### より低い層の export

| export       | 型                                          | 説明                                                                                                                         |
| ------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `vnode`      | `(sel, data, children, text, elm) => VNode` | `h` が内部で使う、低い層の `VNode` ファクトリー。アプリのコードでは `h` を使ってください。                                   |
| `addNS`      | `(data, children, sel) => void`             | SVG の名前空間を部分木へ再帰的に適用します。`svg…` のセレクターでは `h` が自動で呼びます。                                   |
| `htmlDomApi` | `DOMAPI`                                    | `patch` が内部で使う、既定のブラウザー DOM アダプター（ノードの生成・挿入・削除・テキストなど）。                            |
| `is`         | `{ array, isStr, primitive, isVnode }`      | vnode の内部で広く使われている、小さな型ガードのヘルパー。                                                                   |
| `Chain`      | `class Chain`                               | メソッドチェーンできる命令的な DOM ビルダー（`setAttribute`、`append`、`setTextContent` など）。vnode の差分とは無関係です。 |
| `create`     | `(tagName, options?) => Chain`              | 新しい `Chain` を返す、便利のためのファクトリー。                                                                            |

### 型

| 型                  | 形と意味                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }`。仮想ノードそのもの                      |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }`。フィールドは上を参照             |
| `VNodes`            | `VNode[]`                                                                                     |
| `VNodeChildElement` | `VNode \| string \| number`                                                                   |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                                    |
| `ArrayOrElement<T>` | `T \| T[]`                                                                                    |
| `Key`               | `string \| number`                                                                            |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | `patch` が使う DOM の操作を表すインターフェース（`htmlDomApi` を参照）                        |
| `Fragment`          | フラグメントを扱うための `DocumentFragment` の拡張                                            |
| `Modules`           | `Record<string, Record<string, ModuleHook>>`。モジュールレジストリの形                        |
| `ModuleHook`        | モジュールのライフサイクルのコールバックひとつぶん                                            |

## 補足

1. **ブラウザー専用です。** `ranuts/vnode` は `document` と DOM の API に触ります。Node ではなくブラウザー側のコードで import してください。
2. **最後の vnode を取っておくこと。** `patch` は新しい `VNode` を返します。それを保存して次の更新で `oldVnode` として渡せば、いまの木に対して差分が取られます。
3. **`VNode` では `text` と `children` はどちらか一方だけ**です。ノードはテキストノードか、子をもつ要素かのどちらかです。
4. **リストには `key` を。** 動的なリストを描くときは、兄弟に安定した `key` を与えてください。そうすれば差分アルゴリズムがノードを作り直さず、突き合わせて並べ替えられます。
