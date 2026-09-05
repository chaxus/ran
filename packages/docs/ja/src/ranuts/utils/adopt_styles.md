# adoptStyles / adoptSheetText

Shadow DOM に CSS を差し込みます。優先するのは **Constructable Stylesheets** で、ひとつの CSS を一度だけ解析し、それを _参照として_ すべてのコンポーネントのインスタンスで共有します。ですからインスタンスが千あっても、解析結果はひとつのままです。対応していない環境では、どちらも `<style>` タグを差し込む方式に切り替わります。

どちらも SSR で安全（`document` がなければすぐに戻ります）で、何度呼んでも結果は変わりません。

## 使い方

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

コンポーネントの **静的な** スタイルのためのものです。切り替え後の経路では **ルート単位** で重複を取り除きます。ひとつの shadow root が持つ、印の付いた `<style>` はちょうどひとつで、先に書いたほうが残ります。コンポーネントの静的なスタイルはルートにつきひとつあるべきものなので、2 回目の呼び出しは呼び出し側の誤りを意味します。

#### パラメーター

| パラメーター | 説明                                    | 型           | 既定値                 |
| ------------ | --------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 差し込み先の shadow root                | `ShadowRoot` | 必須                   |
| `cssText`    | スタイルの文字列                        | `string`     | 必須                   |
| `marker`     | 切り替え後の `<style>` に付ける印の属性 | `string`     | `'data-adopted-style'` |

#### 戻り値

戻り値はありません（`void`）

### adoptSheetText

実行時に渡される **動的な** スタイルのためのものです（コンポーネントの `sheet` プロパティなど）。`adoptStyles` との違いは、切り替え後に何を基準に重複を取り除くかだけです。こちらは **cssText** を基準にするので、ひとつのルートに異なる動的なスタイルをいくつも重ねられる一方、まったく同じものは一度しか差し込まれません。

#### パラメーター

| パラメーター | 説明                                    | 型           | 既定値                 |
| ------------ | --------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 差し込み先の shadow root                | `ShadowRoot` | 必須                   |
| `cssText`    | スタイルの文字列                        | `string`     | 必須                   |
| `marker`     | 切り替え後の `<style>` に付ける印の属性 | `string`     | `'data-adopted-sheet'` |

#### 戻り値

戻り値はありません（`void`）

## 定数

| 名前                   | 値                     | 意味                                                |
| ---------------------- | ---------------------- | --------------------------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | `adoptStyles` が切り替え後に使うタグの、既定の印    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | `adoptSheetText` が切り替え後に使うタグの、既定の印 |

`marker` 引数があるのは、ライブラリが差し込んだスタイルに自分の印を付け、あとから見つけられるようにするためです。たとえば ranui は `data-ranui` と `data-ranui-sheet` を渡しています。
