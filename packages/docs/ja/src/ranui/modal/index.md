---
description: 'ranui の Modal（<r-modal>）は集中した操作のためのダイアログです。フォーカストラップ、スクロールロック、背景の無効化、命令的な Modal.confirm API を備えます。'
---

# Modal

現在のページの上で、集中した操作を行うためのダイアログコンポーネントです。フォーカストラップ、スクロールロック、背景の無効化を備えています。

> **こんなときに**：ページの上に重ねて集中した操作をさせるダイアログが必要で、フォーカストラップ・スクロールロック・背景の無効化もほしいとき。`<r-modal>` は `open` 属性、または命令的な `Modal.confirm` / `Modal.info` ヘルパーで動かします。

## クイックスタート

### 基本的な使い方

モーダルの表示は `open` 属性（または `open` プロパティ）で制御します。初期状態は閉じていて、開くまで何も描画しません。開閉するトリガーを用意してください。

<ran-demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">モーダルを開く</r-button>
  <r-modal id="quickstart-modal" heading="基本のモーダル">
    <p>これがモーダルの内容です。</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">OK</r-button>
    </div>
  </r-modal>
</ran-demo>

```html
<r-button onclick="modal.open = true">モーダルを開く</r-button>

<r-modal id="modal" heading="基本のモーダル">
  <p>これがモーダルの内容です。</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">OK</r-button>
  </div>
</r-modal>
```

## API リファレンス

### プロパティ

| プロパティ     | 型        | 既定値  | 説明                                                            |
| -------------- | --------- | ------- | --------------------------------------------------------------- |
| `open`         | `boolean` | `false` | モーダルを表示するかどうか                                      |
| `heading`      | `string`  | `''`    | ヘッダーのタイトル文字列（空のときは `Modal` にフォールバック） |
| `closable`     | `boolean` | `true`  | 閉じる（`x`）ボタンを出すかどうか                               |
| `maskClosable` | `boolean` | `true`  | 背景マスクのクリックで閉じるかどうか                            |
| `closeOnEsc`   | `boolean` | `true`  | `Escape` キーで閉じるかどうか                                   |
| `lockScroll`   | `boolean` | `true`  | 開いている間、body のスクロールをロックするかどうか             |
| `autoFocus`    | `boolean` | `true`  | 開いたときに最初のフォーカス可能な要素へフォーカスするかどうか  |
| `hideHeader`   | `boolean` | `false` | タイトルバーを丸ごと省き、浮いた閉じるボタンだけを残す          |
| `sheet`        | `string`  | `''`    | Shadow DOM に注入する CSS                                       |

`closing` は要素が自分自身に反映する読み取り専用の属性です（設定できるプロパティではありません）。`close()` が走った瞬間から、マスクとダイアログのフェード＋縮小のトランジションが実際に終わるまで（およそ 0.3 秒後、`afterclose` イベントと同じタイミング）付いています。その見た目の余韻のあいだも、モーダルが「まだそこにある」ものとして扱う必要のあるホストページで役に立ちます。下のベストプラクティスを参照してください。

### タイトル `title`

```html
<r-modal open heading="項目を削除">
  <p>この項目を削除してよろしいですか？</p>
</r-modal>
```

### 閉じるボタン `closable`

ヘッダーの閉じるボタンを隠し、あなた自身のコントロールからしか閉じられないようにします。

```html
<r-modal open heading="利用規約" closable="false">
  <p>続けるには規約に同意する必要があります。</p>
  <div slot="footer">
    <r-button type="primary">同意する</r-button>
  </div>
</r-modal>
```

### マスククリックで閉じる `maskClosable`

既定では背景のクリックでモーダルが閉じます。`false` にすると、はっきりした操作を必要にできます。

```html
<r-modal open heading="未保存の変更" maskClosable="false">
  <p>外側をクリックしてもこのダイアログは閉じません。</p>
</r-modal>
```

### Escape で閉じる `closeOnEsc`

```html
<r-modal open heading="レポート" closeOnEsc="false">
  <p>このダイアログでは Escape キーが無効です。</p>
</r-modal>
```

### スクロールのロック `lockScroll`

```html
<r-modal open heading="プレビュー" lockScroll="false">
  <p>モーダルの背後のページは、まだスクロールできます。</p>
</r-modal>
```

### 自動フォーカス `autoFocus`

```html
<r-modal open heading="検索" autoFocus="false">
  <input type="text" placeholder="入力して検索" />
</r-modal>
```

### ヘッダーなしモード `hideHeader`

タイトルバーとその境界線を丸ごと省き、`closable` のときだけ右上に浮いた閉じるボタンを残します。画像や図のライトボックスのように、タイトルバーが内容を削るだけの「中身しかない」ダイアログ向けです。見えている `<h3>` のタイトルがなくなっても、ダイアログは `aria-label`（`title` から作られます）でアクセシブルな名前を保ちます。ヘッダーなしモードでも、スクリーンリーダー用のラベルとして `title` は設定してください。

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="アーキテクチャ図" style="display: block; max-width: 100%;" />
</r-modal>
```

## スロット

| スロット | 説明                                                       |
| -------- | ---------------------------------------------------------- |
| （既定） | モーダルの本文                                             |
| `footer` | フッターのアクション。埋まっているときだけフッターが出ます |

```html
<r-modal open heading="確認">
  <p>本文はデフォルトスロットに入ります。</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">キャンセル</r-button>
    <r-button type="primary">確定</r-button>
  </div>
</r-modal>
```

## イベント

閉じるに関わるイベントはすべて、何が原因で閉じたかを表す `trigger` を `event.detail` に載せます。値は `'mask'`、`'button'`、`'escape'`、`'program'` のいずれかです。

| イベント      | キャンセル可 | `detail`      | 説明                                          |
| ------------- | ------------ | ------------- | --------------------------------------------- |
| `beforeopen`  | はい         | —             | 開く直前。`preventDefault()` で中止できます   |
| `open`        | いいえ       | —             | モーダルが開いたときに発火                    |
| `afteropen`   | いいえ       | —             | 開くトランジションが終わったあとに発火        |
| `beforeclose` | はい         | `{ trigger }` | 閉じる直前。`preventDefault()` で中止できます |
| `close`       | いいえ       | `{ trigger }` | モーダルが閉じたときに発火                    |
| `afterclose`  | いいえ       | `{ trigger }` | 閉じるトランジションが終わったあとに発火      |

```html
<r-modal id="modal" heading="例"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('変更を破棄しますか？')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('閉じた原因:', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## プログラムから使う API

`Modal` クラスには、マークアップなしでモーダルを作り、マウントし、結果を返す静的ヘルパーがあります。いずれも `Promise<{ action, trigger }>` を返し、`action` は `'confirm'`、`'cancel'`、`'dismiss'` のいずれかです。

| メソッド              | 説明                                           |
| --------------------- | ---------------------------------------------- |
| `Modal.open(opts)`    | OK ボタンひとつのモーダルを開く                |
| `Modal.confirm(opts)` | OK とキャンセルのボタンを持つモーダルを開く    |
| `Modal.info(opts)`    | 案内のモーダル（タイトルの既定値は `Info`）    |
| `Modal.success(opts)` | 成功のモーダル（タイトルの既定値は `Success`） |
| `Modal.warning(opts)` | 警告のモーダル（タイトルの既定値は `Warning`） |
| `Modal.error(opts)`   | エラーのモーダル（タイトルの既定値は `Error`） |

オプション（すべて任意）：`title`、`content`、`okText`、`cancelText`、`showCancel`、`maskClosable`、`closeOnEsc`、`lockScroll`、`autoFocus`、`closable`、`onConfirm`、`onCancel`。`onConfirm` / `onCancel` が `false`（または `false` に解決する Promise）を返すと、モーダルは開いたままになります。

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'プロジェクトを削除',
  content: 'この操作は取り消せません。',
  okText: '削除',
  cancelText: '残す',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // 削除された
}
```

## CSS parts

`::part()` で内部の各部にスタイルを当てられます。

| Part     | 説明                     |
| -------- | ------------------------ |
| `root`   | 外側のオーバーレイ容器   |
| `mask`   | ダイアログの背後の背景   |
| `dialog` | ダイアログ本体           |
| `header` | ヘッダーバー             |
| `title`  | タイトル見出し           |
| `close`  | 閉じる（`x`）ボタン      |
| `body`   | スクロールする本文領域   |
| `footer` | フッターのアクションバー |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## スタイル

`<r-modal>` は自前の **CSS カスタムプロパティを 23 個**と、テーマから読み取るセマンティックトークンを公開しています。継承が届く場所ならどこでも指定できます（`:root`、ラッパー、要素そのものなど）。

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Parts：`body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

全一覧は[スタイルトークン](/ja/src/ranui/style-tokens#modal)にあります。どのトークンを使うかは[デザインシステム](/ja/src/ranui/design-system/)を参照してください。

## ベストプラクティス

- **トリガーと開閉**：`modal.open = true` で開き、`modal.open = false`（または `close()`）で閉じます。
- **破壊的な閉じ方を守る**：`beforeclose` を受けて `preventDefault()` すれば、保存していない作業を捨てる前に確認を挟めます。
- **フッターのアクション**：主要／副次のボタンは `slot="footer"` に置きます。フッターバーはこのスロットに中身があるときだけ現れます。
- **閉じられないフロー**：`closable="false"` と `maskClosable="false"` を設定すると、はっきり選択させることを強制できます。
- **その場限りのダイアログ**：手早い問い合わせなら、マークアップを書かずに `Modal.confirm` / `Modal.info` を使ってください。
- **モーダルが開いている間だけホストページを前面に上げる**：`[open]` だけでなく `:has(r-modal[open]), :has(r-modal[closing])` にマッチさせてください。`open` は `close()` が走った瞬間に外れますが、マスクとダイアログのトランジションはそこからさらに 0.3 秒ほど描画を続けます。フェードの途中で z-index の引き上げをやめると、まだ見えているマスクが、それまで上に乗っていた相手の下で描き直されてしまいます。
