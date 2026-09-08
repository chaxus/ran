---
description: 'ranui の Icon（<r-icon>）は、サイズと色を制御できる意味のあるベクター図形（SVG）を描画します。'
---

# Icon

サイズと色を制御できる、意味のあるベクター図形（SVG）を描画します。

> **使いどころ**：名前で指定でき、大きさも色も変えられる（回転アニメーションも任意で付く）ベクターアイコンを UI にインラインで置きたいとき。`<r-icon>` は `name` から登録済みの SVG を描画します。

## アイコンの使い方

### いちばん簡単：同梱の名前をそのまま使う（設定不要）

ranui はアイコンセットを**パッケージにインライン同梱**しています。同梱の `name` は**必要になった時点で自分を読み込みます**。登録も import も、アセットパスの配線も要りません。実際に使った SVG だけが取得され（それぞれ別の非同期チャンクです）、アイコンを一つ参照してもセット全体が引っ張られることはありません。

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

有効な同梱の名前は `RanIconName` のユニオン型 / `RAN_ICON_NAMES` のタプルです（下記）。一度も登録していない**カスタム**の名前は、やはり**何も描画しません**（空白のまま）。これはあなた自身の SVG にだけ当てはまる話で、[カスタムアイコン](#custom-icons)で扱います。

### 任意：セット全体を先に登録する

同梱アイコンをすべて**同期的に**使えるようにしたい場合（アイコンの多い画面で初回描画のちらつきを避けたい、コード分割のない環境で使いたい、など）、できるだけ早い段階で `registerBuiltinIcons()` を一度だけ呼んでください。

```ts
import { registerBuiltinIcons } from 'ranui'; // または 'ranui/icons'

registerBuiltinIcons(); // RAN_ICON_NAMES のすべての名前を先に登録します（約 15 KB）
```

有効な名前は `RanIconName` のユニオン型と `RAN_ICON_NAMES` のタプルとして公開されています（エディターが補完し、打ち間違いは型検査で捕まります）。

`add-user`、`arrow-down`、`book`、`check-circle`、`check-circle-fill`、`close`、`close-circle`、`close-circle-fill`、`drop`、`eye`、`eye-close`、`github`、`globe`、`home`、`info-circle`、`info-circle-fill`、`issue`、`loading`、`loading-scene`、`lock`、`menu`、`message`、`more`、`plus`、`power-off`、`preview`、`search`、`setting`、`sort`、`team`、`unlock`、`user`、`warning-circle`、`warning-circle-fill`、`without-content`

### カスタムアイコン {#custom-icons}

自分の SVG（どのアイコンライブラリのものでも、ビルドのアセットパイプラインからでも）を登録するには、生の SVG 文字列を `registerIcons` / `registerIcon` に渡します。

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // バンドラーが SVG を生の文字列として渡す方法で

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // インライン文字列——アセットファイルは不要
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

生の SVG マークアップを `name` に直接渡せば、レジストリを完全に飛ばすこともできます（`<svg` で始まるときはそのまま描画されます）。

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **注意：** 生の `assets/icons/*.svg` ファイルは公開されている npm パッケージに**含まれません**（`dist/` だけを配布しています）。したがって `ranui` から `import '…/lock.svg?raw'` は解決しません。同梱セットには `registerBuiltinIcons()` を使うか、自分の SVG 文字列を登録してください。

> **SSR / タイミング。** 登録はブラウザで実行される必要があります。`<r-icon>` がアイコンの登録前に接続されると空白のままになり、登録が終わると自動的に埋まります（要素は `ranui-icon-registered` イベントを購読しています）。空のアイコンがちらつくのを避けるには、エントリーモジュールのいちばん上で登録し、最初のコンポーネントが描画される前にレジストリが埋まるようにしてください。開発時、未登録の名前は `[ranui-icon] icon not registered: <name>` と記録されます。

## コードデモ

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## 属性

### `name`

名前によって別のアイコンを選びます。

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<ran-demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<ran-demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

spin を設定すると回転が有効になり、数値を渡すと回転の速さを制御できます。数値が小さいほど速く回ります。

<ran-demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</ran-demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## アイコン一覧

どのアイコンでもクリックすればマークアップをコピーできます。

<IconGallery />

## スタイリング

`<r-icon>` は自前の **CSS カスタムプロパティを 6 個**、そしてテーマから読むセマンティックトークンを
公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素そのもの）。

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Part：`ran-icon`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#icon)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。
