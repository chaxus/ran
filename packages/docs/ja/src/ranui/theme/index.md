---
description: 'ranui の実行時テーマ機構：initTheme / setTheme / getTheme、ライト・ダーク・システムのモード、範囲を絞った適用、実行時のトークン上書き。'
---

# Theming

ranui のスタイリングの**実行時**の半分です。ライト、ダーク、システムモードの切り替え、選択の保存、
そしてトークンをその場で上書きすることを扱います。

トークンそのもの（何という名前で、それぞれ何のためにあるか）は[デザインシステム](/ja/ranui/design-system/)、
どれを選ぶかの基準は[デザインガイドライン](/ja/ranui/design-guides/)です。このページは、それらを
_適用する_ 話だけをします。

> **使いどころ**：ranui のアプリでライト／ダークのテーマが必要なとき。読み込み時に `initTheme` を一度呼び、
> 切り替えには `setTheme` を、追加の CSS を配らずに個々のトークンを上書きしたいときは `setThemeToken(s)` を
> 使います。

テーマはちょうど二つ、**light** と **dark** です。加えて OS の設定に従う **system** モードがあります。
（以前の「テーマパック」の API は削除されました。`setThemePack` / `RanThemePackName` はもう存在しません。）

## クイックスタート

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// localStorage に保存されたテーマ（'light' | 'dark' | 'system'）を復元する
initTheme();

// テーマを切り替える —— 自動で保存されます
setTheme('dark');
setTheme('system'); // prefers-color-scheme を追跡し、その場で更新します

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

専用の **`ranui/theme`** エントリーはテーマのエンジンだけを配ります。import してもカスタム要素は
一つも登録されないので、トークンとダークモードだけが欲しいページがコンポーネントライブラリを
引き込むことはありません。同じ関数はトップレベルの `ranui` からも再エクスポートされています。

`setTheme` は `<html>` に `data-ran-theme`（および従来からの `theme`）属性を書き込み、
すべてのコンポーネントのスタイルがそれに反応します。選択は localStorage の `ran-theme` キーに保存されます。

出来合いの切り替え UI が欲しいときは [`<r-theme-switch>`](/ja/ranui/theme-switch/) を使ってください。
この API にすでに接続され、インスタンス間で同期し、`theme-color` の meta も更新する、システム／ライト／
ダークのセグメントコントロールです。

## API

| 関数              | シグネチャ                                                              | 説明                                                                                            |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | `localStorage` に保存されたテーマを復元します。読み込み時に一度呼びます。SSR では何もしません。 |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | `'light'` \| `'dark'` \| `'system'` を適用して保存します。`'system'` は OS を随時追跡します。   |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | 有効なテーマを読みます。システムモードなら `'system'`、未設定なら `''` を返します。             |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | 実行時にトークンを一つ上書きします（対象へのインラインスタイル）。                              |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | 多数のトークンを一度に上書きします。値が `null` / `undefined` ならそのトークンを消します。      |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | 実行時のトークン上書きを取り除きます。                                                          |

**型**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // 既定は document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**：どの関数も既定では `<html>`（`document.documentElement`）を対象にします。要素を渡せば、
ページ全体ではなく部分木にテーマやトークンの上書きを限定できます。

**SSR で安全**：`document` / `localStorage` / `matchMedia` へのアクセスはすべてガードされているので、
サーバー描画中これらの関数は何もしません（例外も投げません）。

## サーフェス言語（solid / glass）

カラーテーマとサーフェス言語は独立した軸です。`setSurface('glass')` は対象（通常は `<html>`）に `data-ran-surface="glass"` を書き込みます。パイロットコントロール（`r-button`、`r-input`、`r-card`、`r-modal`、`r-message`）はその属性の下、または要素自身が `surface="glass"` のときに曇ります。ドキュメント級のガラスから外すには `surface="solid"` を付けます。

プライマリ／危険ボタンと toast ピルはガラスでも実色のままです。`prefers-reduced-transparency: reduce` は elevated の実色トークンへ落ち、[`r-glass`](/ja/ranui/glass/) と同じ契約です。

液体ガラスのパネル（屈折・マテリアル）は引き続き [`r-glass`](/ja/ranui/glass/) を使います——サーフェス軸はコントロール族のフロストであり、その置き換えではありません。

<ran-demo>
  <div style="display: grid; gap: 16px;">
    <div style="position: relative; padding: 24px; border-radius: 16px; overflow: hidden; background:
      radial-gradient(circle at 20% 20%, #94ccff 0%, transparent 45%),
      radial-gradient(circle at 80% 30%, #ffb1b3 0%, transparent 40%),
      radial-gradient(circle at 50% 80%, #b9f5bc 0%, transparent 45%),
      #e8e8ec;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #55555e;">solid (default)</p>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <r-card heading="Solid card" description="Graphite elevated surface." style="width: 220px;">
          <r-input label="Name" placeholder="Ada"></r-input>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <r-button type="primary">Save</r-button>
            <r-button>Cancel</r-button>
          </div>
        </r-card>
      </div>
    </div>
    <div data-ran-surface="glass" style="position: relative; padding: 24px; border-radius: 16px; overflow: hidden; background:
      radial-gradient(circle at 20% 20%, #94ccff 0%, transparent 45%),
      radial-gradient(circle at 80% 30%, #ffb1b3 0%, transparent 40%),
      radial-gradient(circle at 50% 80%, #b9f5bc 0%, transparent 45%),
      #e8e8ec;">
      <p style="margin: 0 0 12px; font-size: 13px; color: #55555e;">glass (`data-ran-surface`)</p>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <r-card heading="Glass card" description="Frosted elevated surface." style="width: 220px;">
          <r-input label="Name" placeholder="Ada"></r-input>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <r-button type="primary">Save</r-button>
            <r-button>Cancel</r-button>
          </div>
        </r-card>
      </div>
    </div>
  </div>
</ran-demo>

## ダークモードの仕組み

`setTheme('dark')` は `<html>` に `data-ran-theme="dark"` を設定します。するとスタイルシートは、
単一の情報源から**基礎パレットだけ**をダーク用に定義し直します。`--ran-color-*` のセマンティック
トークンはどれも `var()` を通してそのパレットを参照しているので自動的に切り替わり、どのコンポーネントも
自前のダークモード上書きを持ちません。

知っておく価値のある帰結が二つあります。

- **あなたの CSS もセマンティックトークンを使っていればダークモードが無料で付いてきます。** 色を
  ベタ書きしたり、ライト専用のフォールバックを書いたりすると壊れます。
  [自分の CSS でトークンを使う](/ja/ranui/design-system/#using-tokens-in-your-own-css)を参照してください。
- **テーマの切り替えで何もトランジションさせてはいけません。** CSS には色が変わった理由が分からないので、
  パレットのプロパティに `transition` があると、テーマを切り替えたときにすべての要素がそれぞれの速さで
  淡く変わってしまいます。ranui のコンポーネントは意図的にそうしていません。あなたのもそうすべきです。

## トークンのカスタマイズ {#customizing-tokens}

### 実行時（JS）

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// トークン一つを <html> に（全体に効きます）
setThemeToken('--ran-color-primary', '#7c3aed');

// まとめて
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// 部分木に限定する
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// 上書きを取り除く
clearThemeToken('--ran-color-primary');
```

### ビルド時（CSS）

`:root`、あるいは好きなスコープでトークンを上書きします。

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### どの層を上書きするか

ダークモードが定義し直すのは基礎パレットだけなので：

- 両方のテーマで同じであるべき変更には、**セマンティック**トークン（`--ran-color-primary`）を上書きします。
- テーマとともに切り替わるべき変更には、**基礎**スケールの段（`--ran-blue-700`）を上書きします。
  それを参照するセマンティックなものはすべて追随します。
- ちょうど一つの要素だけを変えたいなら、**コンポーネント**トークン（`--ran-btn-hover-background`）を
  上書きします。

この層構造は[デザインシステム](/ja/ranui/design-system/#two-layers)のページで詳しく説明しています。
実行時の上書きは対象へのインラインスタイルであることに注意してください。その部分木ではスタイルシートの
規則に勝ちます。これがパネルごとのテーマを成り立たせている一方で、消し忘れた上書きを後から見つけにくく
している理由でもあります。

## テーマをページの一部に限定する

どの関数も対象を受け取るので、プレビューの枠だけを周囲のページと違うテーマで動かせます。

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // この部分木だけ
getTheme(preview); // → 'dark'
```

属性は `<html>` ではなくその要素に付き、あとはトークンのカスケードが引き受けます。
