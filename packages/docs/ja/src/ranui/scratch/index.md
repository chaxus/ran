---
description: 'Pointer Events API を使い、canvas の覆いをドラッグして削ると下の内容が現れる、実験的なスクラッチカードの面。'
---

# Scratch

実験的なスクラッチカードの面です。shadow DOM の中で、表示層の上に画面いっぱいの `<canvas>` の覆いを描きます。canvas の上をドラッグすると、ポインターが実際に通った経路に沿って `destination-out` の合成で覆いが削られ、十分な面積を削ると下にあるものが現れます。ホストは `display: block` なので、明示的な幅と高さを与えてください。

> **使いどころ**：ドラッグで覆いの canvas を削ると、下に置いた任意の内容が現れる、実験的なスクラッチカードの面が欲しいとき。Pointer Events API のおかげで、マウスでもタッチでもペンでも同じように動きます。

> ⚠️ **実験的**：このコンポーネントはまだ作りかけです。堅牢な本番向けの部品ではなく、楽しい仕掛けとして扱ってください。

## クイックスタート

### 基本的な使い方

`<r-scratch>` の中に置いたものが、そのまま現れる内容になります（金額でも、画像でも、`<r-icon>` でも、複数の要素でも）。ranui のほかのコンポーネントとまったく同じように、デフォルトスロットを通して覆いの下の層へ投影されます。

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">50 コイン当たり！</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">50 コイン当たり！</r-scratch>
```

## API リファレンス

### プロパティ

| プロパティ | 型        | 既定値  | 説明                                                                                                |
| ---------- | --------- | ------- | --------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | 削る操作を無効にします（覆いの canvas に `pointer-events: none`、加えてハンドラー側でも防ぎます）。 |
| `sheet`    | `string`  | `''`    | コンポーネントの shadow DOM に注入する CSS。                                                        |

### 無効状態 `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">50 コイン当たり！</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">50 コイン当たり！</r-scratch>
```

### 外部スタイル `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## 操作

このコンポーネントはカスタムイベントを**派発しません**。リスナーを結び付ける先はありません。削る動作は canvas に登録された内部の [Pointer Events](https://developer.mozilla.org/ja/docs/Web/API/Pointer_events) リスナーだけで駆動されるので、マウスもタッチもペンも同じ経路を通ります。

- `pointerdown`：削る準備をし、ポインターが触れたその場を小さく削ります（ドラッグしないタップでも何かが現れます）。
- `pointermove`：準備ができているあいだ、前の点から今の点まで **繋がった線**（点々ではなく）を `globalCompositeOperation = 'destination-out'` で引きます。したがって速くドラッグしても途切れない跡が現れ、削った面積が積み上がっていきます。
- `pointerup` / `pointercancel`：削る準備を解きます。積み上がった面積が **canvas のピクセル面積の 35%** を超えていれば、`clearRect` で覆いを丸ごと消し、下の層を完全に見せます（「少し削れば、あとは自分で終わる」という、あえて寛容なしきい値です。覆いを全部手で消させるより、スクラッチカードとしてありふれた体験です）。

ポインターの座標は canvas の実際の描画バッファの解像度（下記）を通して対応づけられるので、要素の CSS 上の大きさや画面のデバイスピクセル比に関わらず、指やカーソルの下を正しく追います。`disabled` のあいだ、どのハンドラーも何もしません。また canvas の `touch-action: none` が、タッチのドラッグでページまでスクロールするのを防ぎます。

デバイス固有のいくつかの端は、マウス・タッチ・ペンの「統一」に任せきりにせず、明示的に扱っています。

- **マウス**：主ボタン（左）だけが削り始めます。右ドラッグや中クリックでは始まりません。
- **マルチタッチ**：最初に触れた指が線を引き、削っている途中で触れた二本目の指は、最初の指が離れるまで無視されます。二本の指が同じ描画状態へ同時に書き込むことはありません。
- **中断されたジェスチャー**：`pointerup` を一度も出さないまま OS がポインターのキャプチャを取り戻した場合（一部の Android WebView で、システムの戻るスワイプが削る操作を割り込んだときに見られます）も、`lostpointercapture` のリスナーが内部状態を戻します。これがないと内部状態は準備されたままになり、次の無関係なポインターの動きで黙って描き続けてしまいます。

### canvas の解像度

canvas の内部解像度は、ブラウザ既定の 300×150 のままにせず、実際に描画される CSS 上の大きさ × `devicePixelRatio` に同期します（接続時と、ウィンドウの `resize` のたびに）。これで HiDPI の画面でも覆いは鮮明なままで、どんな大きさでもポインターと canvas の座標の対応が正確に保たれます。リサイズは進行中の削りをリセットします（バッファは寸法が変われば必ず消えます）。

## スロット

| スロット     | 説明                                         |
| ------------ | -------------------------------------------- |
| (デフォルト) | 現れる内容。削る覆いの下の層へ投影されます。 |

## スタイリング

このコンポーネントは **`::part()` を一つも公開していません**が、二つの層の色はテーマトークンで動く CSS 変数です。shadow DOM は固定の三層です。

| クラス                       | 役割                                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | 全面の相対配置コンテナ（`width: 100%; height: 100%`）                                                                                                 |
| `.ran-scratch-ticket-award`  | 現れる層。`z-index: 1`、`background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`。デフォルトスロットを持ちます           |
| `.ran-scratch-ticket-canvas` | 削る覆いの canvas。`z-index: 2`。ホストに設定された `--ran-scratch-cover-background`（既定は `var(--ran-color-text-secondary, #6b6b6b)`）で塗られます |

どちらの色もテーマトークンを経由し、リテラルのフォールバックを持つので、既定でライト／ダークに馴染み、`--ran-scratch-award-background` / `--ran-scratch-cover-background` で上書きできます。ホストの大きさは普通の `width` / `height` で決めてください。

## ベストプラクティス

- **必ずホストに大きさを与える**：`display: block` で固有の大きさを持ちません。明示的な `width` と `height` を与えないと、内側の `100%` の層は高さゼロに潰れます。
- **現れる内容は何でもよい**：テキスト、画像、`<r-icon>`、複数の要素。賞品が実際に何であれ、そのままスロットに入れてください。回避すべき「アイコン＋サイズ」の固定 API はありません。
- **マウス・タッチ・ペンで動く**：Pointer Events が三つを統一するので、デスクトップでもモバイルでも同じように反応します。
- **実験的なものとして扱う**：まだ作りかけです。本番の挙動を当てにしないでください。
