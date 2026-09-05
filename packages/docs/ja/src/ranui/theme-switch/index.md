---
description: 'ranui のテーマ API に接続された、システム／ライト／ダークの 3 状態セグメントコントロール。タブ間でも同期します。'
---

# ThemeSwitch

ranui の[テーマ API](/ja/src/ranui/theme/) に接続された、3 状態（**システム / ライト / ダーク**）の
セグメントコントロールです。セグメントをクリックすると `setTheme()` を呼び、選択を localStorage の
`ran-theme` キーに保存し、ページ上の（そして別タブの）すべてのインスタンスを同期させます。

> **使いどころ**：ranui のテーマ API に接続済みの、システム／ライト／ダークのセグメントコントロールが欲しいとき。`<r-theme-switch>` が永続化、システム追従、タブ間同期まで面倒を見るので、自前でトグルを組む必要はありません。

## クイックスタート

### 基本的な使い方

<Demo>
  <r-theme-switch></r-theme-switch>
</Demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // あるいは単体のエントリー：
import 'ranui/theme-switch';
```

> 💡 **このドキュメントサイトでは**、テーマはヘッダーのサイト全体トグルが握っており、そちらが
> `data-ran-theme` を独自に書き換えます。そのため上のデモはサイト側にリセットされることがあります。
> あなたのアプリでは `<r-theme-switch>` が信頼できる唯一の情報源です。

保存された選択がスイッチの描画前に復元されるよう、ページ読み込み時に一度 `initTheme()` を呼んでください。

```js
import { initTheme } from 'ranui';
initTheme();
```

## API リファレンス

### プロパティ

| プロパティ | 型                              | 既定値     | 説明                                                                                     |
| ---------- | ------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `value`    | `'system' \| 'light' \| 'dark'` | `'system'` | 現在の選択。テーマ API（`getTheme()`）から読みます。設定するとテーマを適用し保存します。 |
| `sheet`    | `string`                        | `''`       | コンポーネントの shadow DOM に注入する CSS。                                             |

### ローカライズ用の属性

3 つのボタンはアイコンのみなので、それぞれ `aria-label` を持っています。上書きしてローカライズしてください。

| 属性           | 既定値           | 説明                            |
| -------------- | ---------------- | ------------------------------- |
| `label`        | `'Theme'`        | コントロール群の `aria-label`。 |
| `label-system` | `'System theme'` | システムボタンの `aria-label`。 |
| `label-light`  | `'Light theme'`  | ライトボタンの `aria-label`。   |
| `label-dark`   | `'Dark theme'`   | ダークボタンの `aria-label`。   |

```html
<r-theme-switch
  label="テーマ"
  label-system="システムのテーマ"
  label-light="ライトテーマ"
  label-dark="ダークテーマ"
></r-theme-switch>
```

## イベント

| イベント | detail                                     | 説明                                                                      |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | ユーザーがテーマを選んだときに発生。バブリングし、shadow DOM を越えます。 |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## 振る舞い

- **永続化**：選択は `setTheme()` を通るので localStorage（`ran-theme`）に保存され、次の訪問時に
  `initTheme()` が復元します。
- **複数インスタンスの同期**：ヘッダーとフッターに 1 つずつ置いても、どちらかでテーマを選べば両方が
  更新されます。
- **タブ間の同期**：別タブで切り替えたテーマは `storage` イベント経由でこのコントロールにも反映されます。
- **ブラウザのクローム**：ライト／ダークを明示すると `<meta name="theme-color">` が解決後のページ背景に
  更新され、ブラウザや PWA のクロームが揃います。`system` を選ぶと各 meta の元の内容（メディア条件付きの
  こともあります）が戻ります。

## CSS Part

| Part                        | 説明                                                           |
| --------------------------- | -------------------------------------------------------------- |
| `switch`                    | 外側のセグメント状のピル。                                     |
| `button`                    | 各選択ボタン（それぞれ自分の選択名も追加の part として公開）。 |
| `system` / `light` / `dark` | 個々の選択ボタン。                                             |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

上書きできる CSS 変数：`--ran-theme-switch-display`、`--ran-theme-switch-gap`、
`--ran-theme-switch-padding`、`--ran-theme-switch-border-color`、`--ran-theme-switch-radius`、
`--ran-theme-switch-background`、`--ran-theme-switch-button-size`、`--ran-theme-switch-icon-size`、
`--ran-theme-switch-button-color`、`--ran-theme-switch-button-hover-color`、
`--ran-theme-switch-button-active-background`、`--ran-theme-switch-button-active-color`、
`--ran-theme-switch-button-focus-outline`。

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## ベストプラクティス

- **情報源は一つに**：自前でトグルを組まず `<r-theme-switch>` を使ってください。永続化、システム追従、
  インスタンス同期、`theme-color` の meta まで、すでに面倒を見ています。
- **早めに復元する**：ライトからダークへのちらつきを避けるため、`initTheme()` はできるだけ早く
  （できれば初回描画前にインラインで）呼んでください。
- **ローカライズする**：ボタンはアイコンのみです。英語以外の UI では `label` / `label-*` を設定してください。
