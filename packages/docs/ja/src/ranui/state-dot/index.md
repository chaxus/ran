---
description: 'ranui の StateDot（<r-state-dot>）は、光晕と芯を一つの要素で描く 8px のライフサイクル表示（idle・running・success・warning・error）です。'
---

# StateDot

8px のライフサイクル表示です。光晕と芯が一つの要素の中にあり、どちらも `currentColor` なので、
状態は二つのトークンではなく一つの色ルールで決まります。

> **使いどころ**：ある行が、作業のどの段階にいるか（待機中・実行中・完了・失敗）を、まる一行
> 使わずに示したいとき。`<r-tool-card>` と圧縮マーカーが使っているのもこの点です。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` だけが脈打ち、ほかは静止しています。知らない値は消えるのではなく `idle` として描画される
ので、送り出す側が増やしてページがまだ知らない状態でも、行の中の位置は保たれます。

### ラベルと並べる

この点は色でしか状態を伝えず、その色が何を意味するかは説明しません。二つの行を見分ける手がかりが
色だけ、という状態には決してしないでください。詳しくは
[デザインガイドライン](/ja/src/ranui/design-guides/#accessibility)を参照。

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>テストを実行中</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>テストが 2 件失敗</span>
  </div>
</Demo>

## API リファレンス

### プロパティ

| プロパティ | 属性    | 型                                                         | 既定値   | 説明                                               |
| ---------- | ------- | ---------------------------------------------------------- | -------- | -------------------------------------------------- |
| `state`    | `state` | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | どの段階を示すか。知らない値は `idle` になります。 |
| `label`    | `label` | `string`                                                   | `''`     | アクセシブルな名前。下記を参照。                   |
| `sheet`    | `sheet` | `string`                                                   | `''`     | shadow root に注入する CSS。                       |

### アクセシビリティ

**`label` を与えるまで、この点は `aria-hidden` です。** 結果をすでに文字で述べている行に添えた点は、
スクリーンリーダーにとって雑音でしかありません。「実行中」を二度読み上げても誰の役にも立ちません。
点が状態の**唯一の**担い手であるときにだけ `label` を設定してください。

```html
<!-- 文字がすでに述べている：点は黙らせる -->
<r-state-dot state="error"></r-state-dot> <span>ビルド失敗</span>

<!-- セルの中に点しかない：名前を与える -->
<r-state-dot state="error" label="ビルド失敗"></r-state-dot>
```

### Part

| Part  | 要素       |
| ----- | ---------- |
| `dot` | 点そのもの |

### スタイリング

どの状態も色は**一つ**です。光晕はその色の 16%、芯はそれを 60% 内側に縮めたもので、どちらも
`currentColor` から描かれます。つまり状態は二つではなく一つのトークンです。

| トークン                        | 既定値                              |
| ------------------------------- | ----------------------------------- |
| `--ran-state-dot-size`          | `8px`                               |
| `--ran-state-dot-color`         | `--ran-color-text-disabled`（idle） |
| `--ran-state-dot-running-color` | `--ran-color-primary`               |
| `--ran-state-dot-success-color` | `--ran-color-success`               |
| `--ran-state-dot-warning-color` | `--ran-color-warning`               |
| `--ran-state-dot-error-color`   | `--ran-color-danger`                |
| `--ran-state-dot-halo-opacity`  | `0.16`                              |

`running` は回転ではなく芯を脈打たせます（8px では回転として読み取れないほど小さいため）。
脈動は `prefers-reduced-motion` の下では止まります。
