---
description: 'ranui の Popover（<r-popover>）は、ホバーやクリックで浮かぶバブルカードを開きます。ツールチップ、メニュー、文脈に沿った内容に。'
---

# Popover

トリガーをホバーまたはクリックしたときに、浮かぶバブルカードの層を開くポップオーバーコンポーネントです。

> **こんなときに**：トリガーのホバーやクリックで開く浮遊パネルが必要なとき。`<r-popover>` は `<r-content>` パネルの位置決めとポータル、そしてアクセシビリティの配線までやってくれます。

## クイックスタート

### 基本的な使い方

トリガーはデフォルトスロットに置き、浮遊する内容は入れ子の `<r-content>` 要素で包みます。

<ran-demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>これがパネルの内容です</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>これがパネルの内容です</div>
  </r-content>
</r-popover>
```

## API リファレンス

### プロパティ

| プロパティ            | 型       | 既定値    | 説明                                                                                                                          |
| --------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | トリガーから見たパネルの位置：`top`、`bottom`、`left`、`right`。それぞれに `-start`（既定）、`-center`、`-end` を付けられます |
| `trigger`             | `string` | `'hover'` | パネルの開き方：`hover` または `click`（`click` ハンドラーは常にバインドされます）                                            |
| `getPopupContainerId` | `string` | `''`      | パネルを配置する基準にする要素の `id`（開くときに読み取られ、属性には反映されません）                                         |
| `sheet`               | `string` | `''`      | コンポーネントの Shadow DOM に注入する CSS                                                                                    |

### トリガーの種類 `trigger`

<ran-demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### 表示位置 `placement`

<ran-demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### 揃え方 `placement="<方向>-<揃え>"`

方向だけを指定すると、パネルの先頭側の辺がトリガーの先頭側の辺に揃います。トリガーの中央に置きたいときや、トリガーの末尾側の辺に揃えたいときは `-center` または `-end` を付けます。ヘッダーバーの右端に紐づくメニューがまさにそれで、いったん画面外に出てからシフトで押し戻されるのではなく、最初から内側に開きます。この接尾辞は自動反転のあとも保たれ、`bottom-end` は `top` ではなく `top-end` になります。

<ran-demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — bottom-start と同じ</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## スロット

| コンポーネント | スロット | 説明                                                                                    |
| -------------- | -------- | --------------------------------------------------------------------------------------- |
| `<r-popover>`  | （既定） | トリガー要素と `<r-content>` のラッパー                                                 |
| `<r-content>`  | （既定） | 浮遊パネルの内容。これらの子は `document.body` へポータルされ、開いたときに表示されます |

どちらのコンポーネントも無名のデフォルトスロットを 1 つだけ持ち、名前付きスロットはありません。

## 開閉状態 `open`

`open` はパネルの状態そのもので、`<details open>` や `<dialog open>` と同じように属性へ反映されます。パネルの `display` から状態を推測する箇所はどこにもありません（`display` は退場アニメーションのぶんだけ状態から遅れます）。だから属性と `aria-expanded` と画面上の見た目が食い違うことはありません。

```html
<r-popover id="pop" trigger="click">
  <r-button>トリガー</r-button>
  <r-content><div>内容</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // または pop.show()
  pop.open = false; // または pop.hide()
  pop.toggle();
</script>
```

`show()`、`hide()`、`toggle()` はその薄いラッパーです。`closePopover()` は `hide()` の別名として残っています。

## イベント

`<r-popover>` はパネルの遷移まわりで 4 つのイベントを発火します。いずれも `detail` を持ちません。

| イベント     | タイミング                                 |
| ------------ | ------------------------------------------ |
| `show`       | パネルがこれから現れる。                   |
| `after-show` | 現れ終わり、入場アニメーションも完了した。 |
| `hide`       | パネルがこれから閉じる。                   |
| `after-hide` | 閉じ終わり、退場アニメーションも完了した。 |

待つのはスクリプトに書き写した固定の秒数ではなく、スタイルシートのアニメーションそのものです。そのため `prefers-reduced-motion` のとき（再生すべきアニメーションがない）、`after-hide` は固定の遅延を待たずに `hide` の直後に続きます。

それ以外は標準的な DOM 操作で動きます。

- **開く**：`mouseenter`（`trigger` に `hover` が含まれるとき）、`click`、またはフォーカス中の `Enter` / `Space`。
- **閉じる**：`mouseleave`（hover モード）、`Escape`、または文書内の別の場所のクリック。

内部では、対になる `<r-content>` 要素が `MutationObserver` で自分のサブツリーを監視し、`change` の `CustomEvent`（`detail: { type, value: { content, mutation } }`）を発行します。ポップオーバーはそれを受けてパネルを同期させます。これは公開 API ではなく実装の詳細です。

アクセシビリティは自動で配線されます。ホストには `tabindex="0"`、`aria-haspopup="dialog"`、そしてパネルの開閉に合わせて `"false"` と `"true"` を行き来する `aria-expanded` が付きます。

## ベストプラクティス

- **トリガー要素**：フォーカスできるコントロール（`<r-button>` など）をトリガーにしてください。そうすればキーボードでの開閉が動きます。
- **内容のラッパー**：パネルの内容は必ず `<r-content>` で包んでください。`<r-content>` の外にある素の子要素は浮遊パネルとして表示されません。
- **インラインでの寸法**：ホストは `display: block` です。`style="display: inline-block;"` を付ける（またはインライン文脈に置く）と、トリガーの幅まで縮みます。
- **表示位置**：`placement` は希望であって保証ではありません。トリガーがビューポートの端に近く、希望した側に余裕がないときは、パネルは自動的に反対側へ反転し、交差軸方向にずれて画面内に収まります。この自動反転は既定の body 直下の配置でのみ働きます。
- **限定したコンテナ**：既定の body 直下の配置が望ましくないときは、`getPopupContainerId` でスクロール／配置の基準となるコンテナ内にパネルを固定します。このモードでは反転やシフトは働かないので、そのコンテナに収まる `placement` を選んでください。揃えの接尾辞は、body ポータルのときとまったく同じように効きます。
