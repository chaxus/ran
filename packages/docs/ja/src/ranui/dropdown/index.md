---
description: 'r-popover と r-select が土台にしている、位置決めと重なり順を担う低レベルの浮遊パネル部品。'
---

# Dropdown

低レベルの浮遊パネル部品です。角の丸い、浮き上がった面に、任意で向きを示す矢印が付きます。オーバーレイの重なり順を担い、`r-popover` と `r-select` がこれを位置決めして `<body>` へポータルします。

> **使いどころ**：ポップオーバーやセレクトメニューのようなオーバーレイを組むための、低レベルの浮遊パネルが必要なとき。`<r-dropdown>` が重なり順と矢印を持つので、位置決めを自前で書かずに済みます。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">浮遊パネルの中身</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">浮遊パネルの中身</div>
</r-dropdown>
```

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値 | 説明                                                                       |
| ---------- | -------- | ------ | -------------------------------------------------------------------------- |
| `arrow`    | `string` | `''`   | 矢印の向き：`top`、`bottom`、`left`、`right`。省けば矢印は出ません。       |
| `transit`  | `string` | `''`   | パネルに写されるアニメーションのクラス。属性が設定されているあいだだけ有効 |
| `sheet`    | `string` | `''`   | コンポーネントの shadow DOM に注入する CSS                                 |

### 矢印の向き `arrow`

パネルのどれか一辺に、指し示す矢印を描きます。属性を省けば矢印は出ません。

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### 出現アニメーション `transit`

出入りのアニメーションを再生するためにパネルへ写される CSS のクラス名です。コンポーネントは次を同梱しています：`ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`。

クラスは属性とちょうど同じだけ生きます。いつアニメーションが終わったかを決めるのは設定した側であり、属性を外せばクラスも外れます。（以前は約 300ms で自然に消えていました。その時間は JS 側とスタイルシート側の二か所に置かれていました。しかもそのタイマーは、自分が付けたクラスではなく発火した瞬間の `transit` が指すものを外していたので、その時間内に向きを反転させると最初のクラスがパネルに永久に残り、`-in` と `-out` の両方が当たったままになっていました。）

`getAnimationTarget()` は、アニメーションが実際に走っている要素を返します。それは shadow root の内側にあるので、ホストに対する `getAnimations()` は何も報告せず、`{ subtree: true }` も境界を越えません。パネルのトランジション終了を待つコードは、shadow ツリーへ手を伸ばしてクラス名を探すのではなく `getAnimationTarget()` を呼んでください。

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">接続時にアニメーションで現れます</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">接続時にアニメーションで現れます</div>
</r-dropdown>
```

### 外部スタイル `sheet`

パネルの shadow DOM に注入する CSS です。ranui のどのコンポーネントとも同じ `sheet` の作法に従います。

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">スタイルを当てたパネル</div>
</r-dropdown>
```

## イベント

`r-dropdown` は受け身の面で、カスタムイベントは派発しません。位置決め、表示、非表示は使う側（たとえば `r-popover` や `r-select`）が行います。

## スロット

| スロット     | 説明                             |
| ------------ | -------------------------------- |
| (デフォルト) | パネルの中身。そのまま描かれます |

## CSS Part

| Part       | 説明                                        |
| ---------- | ------------------------------------------- |
| `dropdown` | パネルの面。shadow の外からスタイルを当てる |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

見た目に関わるプロパティはすべて `--ran-dropdown-*` のトークンで上書きできます。たとえば `--ran-dropdown-background`、`--ran-dropdown-border-radius`、`--ran-dropdown-box-shadow`、`--ran-dropdown-padding`、`--ran-dropdown-arrow-width`、`--ran-dropdown-host-z-index` です。矢印は自身の `viewBox` で拡縮されるインライン SVG なので、`--ran-dropdown-arrow-width` / `-height` は、周りの空の箱ではなく三角形そのものの大きさを変えます。

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## ベストプラクティス

- **低レベルの部品**：自前の浮遊パネルが必要なときにだけ `r-dropdown` を直接使ってください。よくある用途には `r-popover` や `r-select` を優先します。
- **ホストに大きさを与える**：パネルは既定でホストの `width` / `height: 100%` を取ります。ホストに明示的な大きさと位置を与えてから、ポータルしてください。
- **重なり順**：ホストは `--ran-z-dropdown`（`1100`）を持ち、ダイアログより上に積まれます。必要なら `--ran-dropdown-host-z-index` で上書きしてください。
- **矢印は既定で自分基準**：`r-dropdown` は外部の「トリガー」要素を一切追いません。手元にあるのは自分のパネルの寸法だけです。位置決めをする使い手が繋がっていない状態では、`arrow="top"` / `"bottom"` はパネル自身の幅の中央に来ます。`r-dropdown` を素で使う（上のデモのように）ときは、それが正しい既定です。`r-popover` はまさにトリガー追跡を足すために `r-dropdown` の上に載っています。本物のトリガー要素を測り、`--ran-dropdown-arrow-anchor-offset` を通してピクセルのずれを戻すことで、パネルの方が広くて中央ではなく端で揃っているときでも、矢印がトリガーの中心を指すようにします。`r-dropdown` の上に自前のトリガー追跡パネルを作る使い手は、`r-popover` の位置決めの論理を再現する代わりに、その変数を直接設定できます。
- **読み込み**：`import 'ranui'`（すべてのコンポーネントを登録）または単体の `import 'ranui/dropdown'` で読み込みます。
