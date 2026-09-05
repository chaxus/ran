---
description: 'ranui の Button（<r-button>）は、種類・サイズ・ローディング／無効状態を備え、即時の操作を起こすフレームワーク非依存の Web Component です。'
---

# Button

複数のスタイルと状態を備え、即時の操作を起こすボタンコンポーネントです。

> **使いどころ**：primary／contrast／warning／text のスタイルに加えて無効状態とアイコンまで用意された、クリックできる操作要素が欲しいとき。素の `<button>` にスタイルを当てるより `<r-button>` に手を伸ばしてください。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値      | 説明                                                              |
| ---------- | --------- | ----------- | ----------------------------------------------------------------- |
| `type`     | `string`  | `'default'` | ボタンの種類：`default`、`primary`、`contrast`、`warning`、`text` |
| `disabled` | `boolean` | `false`     | ボタンを無効にするか                                              |
| `icon`     | `string`  | `''`        | ボタンのアイコン名                                                |
| `effect`   | `boolean` | `true`      | クリック時の波紋エフェクトを出すか                                |

### ボタンの種類 `type`

<Demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</Demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` は（Geist のデザイン言語にならった）モノクロの操作です。ライトモードでは白地に黒、ダークモードでは黒地に白になります。ここでの青にブランドの意味はなく、リンクとフォーカスリングのために取ってあります。`--ran-color-primary*` トークン（`--ran-color-primary`、`-hover`、`-active`、反転インク用の `--ran-color-primary-text`）に乗っています。[テーマとトークン](/ja/src/ranui/theme/)を参照してください。

### 無効状態 `disabled`

<Demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</Demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### アイコン付きボタン `icon`

> 💡 **ヒント**：アイコンの位置を細かく決めたいときは、Icon コンポーネントを直接使ってください。

<Demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### エフェクトの制御 `effect`

クリック時の波紋は既定で有効です。波紋のない素のボタンにしたいときは `effect="false"` を設定します。下の二つのボタンはその属性だけが違うので、それぞれクリックして見比べられます。波紋はポインターデバイス向けのエフェクトで、ビューポート幅 1024px 以上でのみ描画されます。

<Demo>
  <r-button type="primary" icon="home">波紋あり（既定）</r-button>
  <r-button type="primary" icon="home" effect="false">波紋なし</r-button>
</Demo>

```html
<r-button type="primary" icon="home">波紋あり（既定）</r-button>
<r-button type="primary" icon="home" effect="false">波紋なし</r-button>
```

波紋を切るのは文字列 `false` のときだけです。`effect="true"` もそれ以外の値も、有効のままにします。スクリプトからは真偽値のプロパティとして設定してください：`button.effect = false`。

## イベント

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## スタイリング

`<r-button>` は自前の **CSS カスタムプロパティを 43 個**公開しています：`--ran-btn-background`、`--ran-btn-color`、`--ran-btn-border-color` とその `hover` / `active` 版、`warning` 版の 3 つ、そしてテーマから読むセマンティックトークンです。

```css
/* 一つのボタン、あるいはあるスコープ配下のすべてのボタン */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

変更がボタン固有でないなら、代わりに**セマンティック**トークンに手を伸ばしてください。`--ran-color-primary` を上書きすれば、ここだけでなく主要操作の見た目が全体で変わります。

Part：`button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#button)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## ベストプラクティス

- **主要な操作**：`type="primary"` を使う（モノクロ：白地に黒／黒地に白）
- **危険な操作**：`type="warning"` を使う
- **副次的な操作**：`type="text"` を使う
- **無効状態**：操作できないときは `disabled` を使う
- **アイコン**：関連するアイコンを添えて分かりやすくする
