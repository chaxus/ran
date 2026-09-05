---
description: 'ranui の Progress（<r-progress>）は、タスクの進み具合をバーで示します。ドラッグできるつまみも付けられます。'
---

# Progress

タスクの進み具合を示すプログレスバーです。ドラッグできるつまみも付けられます。

> **使いどころ**：タスクの進み具合を示すプログレスバーが欲しいとき。読み取り専用の進捗には `<r-progress>` をそのまま、ユーザーにつまみで値を決めさせたいときは `type="drag"` を使います。

## クイックスタート

<Demo>
  <r-progress percent="40%"></r-progress>
</Demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **ヒント**：`r-progress` はブロックレベルの要素で、固有の幅を持ちません。flex の行の中では幅ゼロに潰れることがあります。明示的な幅（例：`style="width:100%"`）を与えるか、ブロックの文脈に置いてください。

## API リファレンス

### プロパティ

| プロパティ | 型       | 既定値      | 説明                                                                 |
| ---------- | -------- | ----------- | -------------------------------------------------------------------- |
| `percent`  | `string` | `'0'`       | 現在の進捗。数値でもパーセントでも可。`total` が上限です。           |
| `total`    | `string` | `'100'`     | 進捗の全体量。数値でもパーセントでも可。                             |
| `type`     | `string` | `'primary'` | バーの種類：`primary`（静的）または `drag`（クリック／ドラッグ可）。 |
| `dot`      | `string` | `'true'`    | ドラッグのつまみを表示するか：`true` または `false`。                |
| `sheet`    | `string` | `''`        | コンポーネントの shadow DOM に注入する CSS。                         |

### 進捗の値 `percent`

現在の進捗を設定します。数値でもパーセント文字列でも受け付け、`total` を超えることはできません。`total` を設定していない場合は `100` が既定なので、`percent` は 100 に対するパーセントとして読まれます。

<Demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</Demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### 全体量 `total`

`percent` の分母を設定します。数値もパーセントも使えるので、`percent="30" total="1000"` ならバーは 3% 埋まります。

<Demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</Demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### バーの種類 `type`

- `primary`：静的なプログレスバー。`type` を設定しないときの既定です。
- `drag`：クリックとドラッグができるプログレスバー。トラックをクリックするか、つまみをドラッグすると `percent` が更新され、`change` イベントが発生します。つまみのドラッグには `dot="true"` が必要です。

<Demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### ドラッグのつまみ `dot`

つまみの表示を切り替えます。つまみが描画されるのは `dot="true"` **かつ** `type="drag"` のときだけです。静的な `primary` のバーでは意図的に省かれるので、そこでは `dot` に見た目の効果はありません。

<Demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## イベント

### `change`

`drag` の種類で、ユーザーがトラックをクリックするかつまみをドラッグして `percent` が変わるたびに派発されます。`detail` オブジェクトが運ぶのは次のとおりです。

| フィールド | 型       | 説明         |
| ---------- | -------- | ------------ |
| `value`    | `string` | 現在の進捗   |
| `percent`  | `string` | 現在の進捗   |
| `total`    | `string` | 進捗の全体量 |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## CSS Part

| Part    | 説明                     |
| ------- | ------------------------ |
| `track` | 進捗のトラック（背景）。 |
| `fill`  | トラックの埋まった部分。 |
| `dot`   | ドラッグのつまみ。       |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## ベストプラクティス

- **静的なバー**：読み取り専用の進捗には既定の `type="primary"` を使います。
- **操作できるバー**：ユーザーに値を決めさせたいときは `type="drag"` を使い、`change` イベントを購読します。
- **パーセントか数値か**：`percent` と `total` は自由に組み合わせられます。既知の全体量に対応する生の数値でも、直接指定するパーセントでもかまいません。
- **レイアウトの幅**：flex のレイアウトで潰れないよう、バーをブロックのコンテナで包むか、明示的な幅を設定してください。
