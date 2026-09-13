---
description: 'ranui/builder は、SwiftUI や Solid 風のきめ細かいリアクティビティを備えた、フレームワーク不要の流暢な DOM ビルダーです。組み立ては一度きりで、あとはシグナルが結び付いたノードだけを更新します。'
---

# Builder

`ranui/builder` は、仮想 DOM を使わず、きめ細かいリアクティビティで DOM を宣言的に組み立てます。コンポーネント自身がこれで書かれており、独立したエントリーとして公開されているので、アプリが自分のレイアウトや繋ぎ込みにも使えます。

> **こんなときに**：フレームワークなしでリアクティブなビュー（ページ、ルート、ウィジェット）を作りたいとき、あるいはカスタム要素を書いていて、ranui が内部で使っているのと同じ組み立て方をしたいとき。

> **原則：組み立ては一度きり、更新はその場で。** ビューの関数は**一度だけ**走ります。状態が変わると、そのシグナルに結び付いたノードだけが更新され、ツリーの再描画は起きません。形に合ったプリミティブを選んでください。値なら getter の束縛、条件分岐なら `Show` / `Switch`、リストなら `For` / `Index` です。

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // 要素のファクトリー
  signal,
  computed,
  createEffect,
  batch,
  untrack, // リアクティビティ
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // 所有権
  EventManager, // ライフサイクルに紐づくイベント
} from 'ranui/builder';
```

ビルダーはカスタム要素を**ひとつも**登録しません。`<r-button>` などを使うには、コンポーネントのエントリーも import してください：`import 'ranui/button'`。

## 要素

ファクトリーはチェーン可能な `ElementBuilder` を返し、`build()` が DOM ノードを返します。

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`、`Span()`、`ButtonBuilder()`、`InputBuilder()`、`Label()`、`Ul()`、`Li()`、`Section()`、`Article()`、`Nav()`、`Header()`、`Footer()`、`Main()`、`Style()`、`Slot()`、そしてカスタム要素を含むそれ以外すべてのための `View('any-tag')` があります。

### チェーンできる API

| 分類             | メソッド                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| 識別子・クラス   | `id(v)`、`class(v)`、`addClass(...v)`、`removeClass(...v)`                                                    |
| 属性             | `attr(name, v)`、`attrs({…})`、`boolAttr(name, on, enabledValue?)`、`part(v)`、`data(key, v)`                 |
| スタイル         | `style(prop, v)` / `style({…})`、`cssVar(name, v)`                                                            |
| アクセシビリティ | `aria(key, v)`、`role(v)`、`tabIndex(n)`、`label(v)`、`labelledBy(id)`、`describedBy(id)`、`ariaHidden(b?)`   |
| 内容             | `text(v)`、`children(…nodes)`、`replaceChildren(…nodes)`                                                      |
| ref・shadow      | `ref(holder)`、`shadow(opts?)` → `ShadowBuilder`                                                              |
| イベント         | `on(type, handler, options?)`、`listen(manager, type, handler)`、`delegate(manager, selector, type, handler)` |
| 終端             | `build()`、`serialize()`（SSR 用の HTML 文字列）                                                              |

`children()` は要素、文字列、ほかのビルダー、配列、`null` / `undefined`（読み飛ばされます）、そして getter（後述のライブ領域）を受け取ります。

### Ref

`createRef<T>()` と `.ref(holder)` で、組み立てた要素を捕まえます。ref にコンポーネントの要素クラスを型として与えると、キャストなしでその命令的なメソッドを使えます。

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## リアクティビティ

```js
const [count, setCount] = signal(0);
count(); // 読み取り — エフェクトやメモの中では追跡されます
setCount(1); // 書き込み。setCount((n) => n + 1) も使えます
// 値が変わらない書き込みは何もしません（Object.is。signal(v, { equals }) で差し替え可）

const double = computed(() => count() * 2); // 遅延評価 + メモ化

const dispose = createEffect(() => {
  console.log(count()); // 今すぐ実行され、依存が変わるたびに再実行されます
  return () => {
    /* 任意のクリーンアップ。次の実行の前と、破棄のときに走ります */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // フラッシュは 1 回、エフェクトは重複排除されます
untrack(() => count()); // 購読せずに読む
```

- **`computed` は遅延評価**です。読まれていないメモは再計算されず、_値_ が変わったときにだけ通知し直すので、安定したメモの先にあるエフェクトは再実行されません。
- **エフェクトは自動で追跡します**。最後の実行で読まれたシグナルだけが購読され続けるので、条件分岐が古い購読を残すことはありません。
- **循環するエフェクトはループせず例外を投げます**。自分が読むシグナルに書き込むエフェクトはバグなので、ランタイムは永遠に走らせるのではなく例外にします。

### リアクティブな束縛

`text`、`attr`、`class`、`boolAttr`、`style`、`part`、`data`、`aria`、`role`、`label` はいずれも **getter** を受け取ります。だから明示的なエフェクトなしで、束縛が自分で更新されます。

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

リアクティブになるのは単一値の形だけです。`style(prop, getter)` はリアクティブですが、`style({…})` と `attrs({…})` のマップ形式は一度きりの適用です。

### 条件分岐とリスト

| 形                               | 使うもの                             | ふるまい                                                 |
| -------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| 分岐がひとつ                     | `Show({ when, children, fallback })` | `when` の**真偽** が反転したときだけ作り直します。         |
| 分岐が複数                       | `Switch` + `Match`                   | 選ばれる枝が変わったときだけ作り直します。               |
| 安定した id を持つリスト         | `For({ each, key, render })`         | `key` で項目を突き合わせ、**そのノードを使い回します**。 |
| 位置そのものが同一性であるリスト | `Index({ each, render })`            | 各位置のノードを使い回し、項目自体がシグナルになります。 |
| 形ごと入れ替わる内容             | 素の getter を子に置く               | 粗い方法。読むたびに領域全体を壊して作り直します。       |

```js
Ul().children(
  For({
    each: () => rows(), // リアクティブな元配列
    key: (row) => row.id, // 安定かつ一意
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

`For` が実際に使い回してくれるかを決める 4 つのルールです。

- **`key` は一意でなければなりません。** 重複は無視され（最初の項目だけが描画され）、開発時には警告が出ます。配列のインデックスをキーにしないでください。並べ替えのときに使い回しが効かなくなります。
- **更新は新しい配列で。** `each` はシグナルを読むので、同じ配列をその場で書き換えて入れ直しても等価判定で飛ばされ、リストは更新されません。
- **`render` は項目ごとに一度だけ走ります**。リストが変わるたびではありません。行ごとの更新はシグナルで駆動してください。`index` は getter なので、並べ替えのあとも正しいままです。
- **項目を取り除くと、その行のスコープが破棄されます**。そこにあったエフェクトとクリーンアップも一緒に消えます。

素の getter を子に置くより `Show` / `For` を選んでください。getter は、読んだ値が変わるたび（結果が変わらない変化でも）領域全体を作り直すので、その中のフォーカス、スクロール位置、入力値、トランジションが失われます。

## 所有権

すべてのエフェクト、メモ、リアクティブな束縛は、それを作ったスコープに所有されます。スコープを破棄すれば、その下にあるものすべてが破棄されます。

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // この束縛はルートに所有されます
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // 束縛のエフェクトを取り除き、クリーンアップを走らせます
```

**リアクティブな UI は `createRoot` の中で組み立ててください。** 所有者なしで作られた束縛も動きはしますが、自動では破棄されません。

### ページ単位の破棄

ページやルートごとに自分のルートを持たせ、遷移時に破棄します。そのページが作ったエフェクト、束縛、タイマー、リスナーが一度の呼び出しで片付きます。

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/ja/src/ranui/route/) にはこれが組み込まれています。`src` を使うと、一致したときにページのモジュールが import され、その default export が `createRoot` の中で走り、離れるときにそのルートが破棄されます。`getOwner()` / `runWithOwner()` を使えば、ルーターが `await` をまたいでスコープを運べます。

::: warning Web Component の中では getter の束縛を使わないこと
コンポーネントの `constructor` と `connectedCallback` は**リアクティブなスコープではありません**。そこで作った getter の束縛や `createEffect` は所有者のない孤児になり、決して破棄されません。切り離されたノードの上で発火し続け、シグナルのほうが要素より長生きすれば、その要素をメモリに繋ぎ止めます。素の値で組み立て、更新は明示的な `createEffect` で駆動し、その破棄関数を集めて `disconnectedCallback` で呼び、再接続のときに張り直してください。[コーディングガイドライン](/ja/src/ranui/coding-guides/)を参照してください。
:::

## カスタム要素の中のリスナー

`EventManager` は `AbortController` に支えられているので、一度の呼び出しですべてのリスナーを外せます。

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // すべて外し、次の接続に備えてリセットします
}
```

## サーバーサイドレンダリング

ビルダーは [SSR](/ja/src/ranui/ssr/) でも動きます。`build()` はモックのノードを返し、`serialize()` は HTML を返します。リアクティブな束縛、`For`、`Show` はサーバー上では**一度だけ**、静的なスナップショットとして描画されます。ブラウザーでコードが走るまで、差分の突き合わせは起きません。

## 完全なリファレンス

このページは実務で使う部分だけを取り上げています。完全なリファレンス（すべてのファクトリー、すべての演算子、SVG 名前空間の規則、`Switch` / `Match` の詳細）は、リポジトリの [BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) にあり、npm パッケージにも同梱されています。
