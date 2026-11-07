---
description: 'カラーテーマ（system / light / dark）のセレクト。ranui のテーマ API に接続。'
---

# ThemeSwitch

カラーテーマ（**system / light / dark**）のコンパクトな **select**。ranui の
[テーマ API](/ja/ranui/theme/) に接続します。選択すると `setTheme()` が呼ばれ、`ran-theme` に保存され、
ページ上（他タブ含む）のインスタンスが同期します。スタイル / リキッドガラスは別軸です。
`<r-surface-switch>` を使ってください。

> **使うとき**: 既製のカラーテーマ制御が必要なとき。

## クイックスタート

### 基本的な使い方

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

読み込み時に一度 `initTheme()` を呼んでください。

```js
import { initTheme } from 'ranui';
initTheme();
```

## API リファレンス

### プロパティ

| プロパティ | 型                              | デフォルト | 説明                                              |
| ---------- | ------------------------------- | ---------- | ------------------------------------------------- |
| `value`    | `'system' \| 'light' \| 'dark'` | `'system'` | `getTheme()` の現在値。代入で適用・永続化します。 |
| `sheet`    | `string`                        | `''`       | Shadow DOM に注入する CSS。                       |

### ローカライズ用の属性

| 属性           | デフォルト | 説明                      |
| -------------- | ---------- | ------------------------- |
| `label`        | `'Theme'`  | select の `aria-label`。  |
| `label-system` | `'System'` | system オプションの文言。 |
| `label-light`  | `'Light'`  | light オプションの文言。  |
| `label-dark`   | `'Dark'`   | dark オプションの文言。   |

## イベント

| イベント | Detail                                     | 説明                                           |
| -------- | ------------------------------------------ | ---------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | テーマ選択時。バブルし Shadow DOM を越えます。 |

## CSS Part

| Part                        | 説明                |
| --------------------------- | ------------------- |
| `select`                    | 内側の `r-select`。 |
| `option`                    | 各 `r-option`。     |
| `system` / `light` / `dark` | 個々のオプション。  |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
