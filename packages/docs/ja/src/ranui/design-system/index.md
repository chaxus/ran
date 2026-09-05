---
description: 'ranui のデザイン言語と、そのトークンの完全なリファレンス。すべてのグローバルな `--ran-*` トークンを、Geist のカラーラダー（ライトとダークの値）、セマンティックな役割、余白、寸法、タイポグラフィ、角丸、影、重なり、モーション、フォーカス、スキンのプリミティブまで網羅します。'
---

# デザインシステム

ranui が拠って立つ**デザイン言語**と、それを表すトークンの**完全な**カタログです。ライブラリが宣言するすべてのグローバルな `--ran-*` カスタムプロパティを、両テーマでの値つきで載せています。コンポーネントは値を直に書く代わりにこれらを読むので、トークンをひとつ上書きすれば、それを使うものすべての見た目が変わります。

3 つのページが 3 つの異なる問いに答えます。それらはあえて分けてあります。

| ページ                                               | 答えること                               |
| ---------------------------------------------------- | ---------------------------------------- |
| **デザインシステム**（このページ）                   | トークンが_何か_、つまり語彙             |
| [デザインガイドライン](/ja/src/ranui/design-guides/) | 画面を作るとき、その中から_どう選ぶか_   |
| [テーマ](/ja/src/ranui/theme/)                       | 実行時に_どう切り替え、どう上書きするか_ |

> **こんなときに**：トークンの名前や値（色の役割、余白の段階、アイコンの大きさ、影の段階、イージングのカーブ）が必要なとき、あるいはスケールがなぜこの形をしているのかを知りたいとき。

## 言語：Geist

ranui のトークンは、Vercel のオープンソースなデザインシステム [Geist](https://vercel.com/geist) を土台にしています。どの色スケールも、選ぶための濃淡の集まりではなく、段ごとに役目が定まったはしごです。200 段は「少し暗いグレー」ではなく「ホバーの背景」です。段の役目がいったん定まれば、操作の状態に対する色を選ぶことは判断ではなく引き当てになります。

ranui はそのはしごを `--ran-*` のスケールとして取り入れ、その上にセマンティックトークンを重ね、既定の書体として **Geist Sans / Geist Mono** を同梱しています。

## ふたつの層 {#two-layers}

**第 1 層：基礎パレット。** 下に並ぶ生のスケールです。直接使うことは滅多にありません。

**第 2 層：セマンティックトークン。** `--ran-color-*` とその仲間で、第 1 層の上に対応づけられています。**使うのはこの層です。** ダークモードが再定義するのは第 1 層だけなので、すべてのセマンティックトークンは `var()` を通じて切り替わり、ライブラリのどこにもコンポーネントごとのダーク用の上書きはありません。

```
--ran-gray-1000        →  #171717（ライト） / #ededed（ダーク） ← 第 1 層。切り替わる
--ran-color-text       →  var(--ran-gray-1000)                    ← 第 2 層。追随する
--ran-btn-color        →  var(--ran-color-text, …)                ← コンポーネントのトークン
```

この連鎖がアーキテクチャのすべてです。基礎の段を変えればどこにでも伝わり、セマンティックトークンを変えればひとつの役割が変わり、コンポーネントのトークンを変えればひとつの要素が変わります。

## 色

### はしご {#the-ladder}

どの色相のスケールも `100 → 1000` で走り、段ごとに役目がひとつ定まっています。

| 段  | 役目                     | 段   | 役目                       |
| --- | ------------------------ | ---- | -------------------------- |
| 100 | 既定の背景               | 600  | アクティブの境界線         |
| 200 | ホバーの背景             | 700  | ベタ塗り（ボタン／バッジ） |
| 300 | アクティブ（押下）の背景 | 800  | ベタ塗り（ホバー）         |
| 400 | 既定の境界線             | 900  | 副次のテキストとアイコン   |
| 500 | ホバーの境界線           | 1000 | 主要なテキストとアイコン   |

### 背景

| トークン               | ライト                                                          | ダーク                                                          | 用途         |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------ |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | ページの背景 |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | 控えめな区画 |

### グレー — `--ran-gray-100..1000`

テキスト、境界線、面の背後にあるスケールです。

| 段   | ライト                                                          | ダーク                                                          |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200  | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300  | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400  | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500  | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600  | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700  | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800  | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900  | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000 | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### グレー（アルファ） — `--ran-gray-alpha-100..1000`

半透明なので、どんな面の上にも重ねられます。覆いの膜、ホバーの淡い色、そして何が下にあるか分からない場所に置く区切り線には、これが正解です。

| 段   | ライト                                                                       | ダーク                                                                       |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100  | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200  | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300  | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400  | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500  | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600  | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700  | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800  | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900  | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000 | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### ブルー — `--ran-blue-100..1000`

リンクとフォーカスリングのために取ってあります。

| 段   | ライト                                                          | ダーク                                                          |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200  | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300  | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400  | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500  | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600  | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700  | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800  | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900  | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000 | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### レッド — `--ran-red-100..1000`

危険とエラーです。

| 段   | ライト                                                          | ダーク                                                          |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200  | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300  | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400  | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500  | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600  | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700  | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800  | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900  | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000 | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### アンバー — `--ran-amber-100..1000`

警告です。

| 段   | ライト                                                          | ダーク                                                          |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200  | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300  | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400  | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500  | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600  | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700  | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800  | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900  | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000 | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### グリーン — `--ran-green-100..1000`

成功です。

| 段   | ライト                                                          | ダーク                                                          |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200  | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300  | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400  | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500  | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600  | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700  | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800  | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900  | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000 | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### セマンティックな色トークン

コンポーネントが実際に読む層です。ここにあるものはすべて上のスケールを通じて解決されるので、テーマに合わせて自分で切り替わります。

| トークン                       | 解決先                                                                                                                                       | 役割                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                       | ページの背景                     |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                       | 控えめな区画                     |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 （ダーク）                                                                                                 | カード、面                       |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                             | 沈んだ／控えめな塗り             |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                             | ホバーの面                       |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                             | アクティブ（押下）の面           |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                            | 主要なテキスト                   |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                             | 副次のテキスト                   |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                             | 無効なテキスト                   |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                             | 既定の境界線                     |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                             | より控えめな境界線               |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                             | ホバーの境界線                   |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                             | アクティブの境界線               |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                            | 主たるアクション（モノクロ）     |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` （ダーク） | primary のホバー                 |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` （ダーク） | primary の押下                   |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                       | primary の面**の上に**乗るインク |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                            | 成功                             |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                            | 警告                             |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                              | 危険／エラー                     |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                             | リンク                           |

`--ran-color-primary-hover` / `-active` は、セマンティック層にあるふたつのリテラルです。スケールに沿ってではなくページの背景に向かって進むので、ダークモードではこれらを直接定義し直します。

### アクセントそれぞれの意味

- **primary はモノクロです**：ライトでは白地に黒、ダークでは黒地に白（Geist のブランドの調子で、`<r-button type="primary">`）。その上のテキストとアイコンは `--ran-color-primary-text` を使い、これも一緒に切り替わります。別に「コントラスト」のトークンはありません。primary _こそが_ 最もコントラストの高いアクションです。
- **ブルーは取ってあります**：リンク（`--ran-color-link`）とフォーカスリングのためです。primary の代わりではありません。
- **グリーン＝成功 · アンバー＝警告 · レッド＝危険。** それぞれ意味はひとつです。

`--ran-color-error` はありません。トークンは `--ran-color-danger` です。宣言されていないプロパティを指す `var()` は何にも解決されず、宣言まるごとが黙って捨てられます。だから名前を間違えたときは、当て推量ではなくこの表と突き合わせる価値があります。

## 余白 {#spacing}

ものとものの間隔、つまり `padding`、`margin`、`gap` です。基本単位は 4px で、値は **9 つ**、それ以上はありません。

| トークン        | 値   | トークン         | 値   |
| --------------- | ---- | ---------------- | ---- |
| `--ran-space-1` | 4px  | `--ran-space-8`  | 32px |
| `--ran-space-2` | 8px  | `--ran-space-10` | 40px |
| `--ran-space-3` | 12px | `--ran-space-16` | 64px |
| `--ran-space-4` | 16px | `--ran-space-24` | 96px |
| `--ran-space-6` | 24px |                  |      |

数字は 4px の倍数なので、スケールは飛び飛びです。`--ran-space-5` はありません。そこが肝心で、ページのリズムを生むのは限られた選択肢のほうです。

## 寸法

要素そのものの大きさです。アイコンの大きさ、コントロールの高さ、小さな正方形や長方形のコントロールなど。

| トークン       | 値   | 典型的な用途                             |
| -------------- | ---- | ---------------------------------------- |
| `--ran-size-1` | 16px | チェックボックスの箱、小さな行内アイコン |
| `--ran-size-2` | 18px | —                                        |
| `--ran-size-3` | 20px | コントロール内のアイコン                 |
| `--ran-size-4` | 24px | ツールバーのアイコンボタン               |
| `--ran-size-5` | 28px | 詰まったコントロールの高さ               |
| `--ran-size-6` | 30px | —                                        |
| `--ran-size-7` | 32px | 既定のコントロールの高さ                 |

**これは意図的に余白とは別のスケールです。** 混ぜて使うのは機械が検出するエラーです（`sizing-scale`）。ふたつは範囲も刻み方も違います（4px を倍にしていく余白のスケールは、アイコンやコントロールの大きさとしては据わりの悪い値になります）。そして利用者は、片方を調整しても、もう片方を乱さずにいられなければなりません。アイコンが大きくなったからといって、たまたま同じピクセル値を共有していた余白まで広がってしまってはいけないのです。段が余白の段と数字の上で一致する場合（`--ran-size-4` と `--ran-space-6` はどちらも 24px です）、それは偶然であって別名ではありません。

ほかのどのコンポーネントとも共有しない、本当に一回きりの寸法（たとえばメニューの `min-width`）は、無理に段へ押し込まず、自前のリテラルなフォールバックを持つ素のコンポーネントトークンのままにします。

## タイポグラフィ {#typography}

| トークン            | 値                                                           |
| ------------------- | ------------------------------------------------------------ |
| `--ran-font-family` | Geist / Geist Sans、次いでシステム UI のスタック             |
| `--ran-font-mono`   | Geist Mono、次いで `ui-monospace`、SF Mono、Menlo、Consolas… |
| `--ran-font-size`   | `14px`（基準の大きさ）                                       |
| `--ran-line-height` | `1.5715`                                                     |

文字は**役割**で整理され、役割がフォント・大きさ・太さ・行間をまとめて決めます。

| 役割        | 用途                     | 太さのトークン                                                                 | 大きさのトークン                          |
| ----------- | ------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **heading** | 見出し                   | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px) |
| **label**   | 一行で、目で追えるもの   | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)      |
| **copy**    | 複数行の本文             | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)          |
| **button**  | ボタンの文字             | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)           |
| **mono**    | コード、データ、小見出し | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | label / copy の大きさを借ります           |

役割をきちんと着地させるためだけに、ふたつのトークンがあります。

| トークン                        | 値        | 理由                                                         |
| ------------------------------- | --------- | ------------------------------------------------------------ |
| `--ran-text-heading-tracking`   | `-0.03em` | 大きな表示サイズでは、見出しに詰めた字間が要ります。         |
| `--ran-text-button-line-height` | `1`       | 高さの決まったコントロールの中で、縦位置をきれいに揃えます。 |

Geist は太さの上限が 600（セミボールド）です。強調は大きさと余白から生まれるもので、より太い書体からではありません。`--ran-text-copy-3` はありません。12px の段は `--ran-text-label-3` です。

### フォント

ranui はどちらの書体も自前でホストしています（可変ウェイト 100〜900、SIL OFL 1.1）。だから import ひとつで、CDN への依存なしに読み込めます。

```js
import 'ranui/fonts'; // バンドラー向け
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

これがなければトークンはシステムのフォントスタックへフォールバックします。すべて問題なく動きますが、Geist の書体にはなりません。

## 角丸

| トークン            | 値       | 用途                                 |
| ------------------- | -------- | ------------------------------------ |
| `--ran-radius-sm`   | `6px`    | コントロール：ボタン、入力、セレクト |
| `--ran-radius-md`   | `12px`   | カード、ダイアログ                   |
| `--ran-radius-lg`   | `16px`   | 大きな面                             |
| `--ran-radius-full` | `9999px` | ピル、アバター                       |

## 影の高さ

影は装飾ではなく**役割**です。段階は、その要素が何であるかで選びます。ダークモードでは 3 つとも差し替えられます。白いページに合わせて調整した影は、黒いページでは消えてしまうからです。

| トークン                | 用途                                                                           | ライト                                                          | ダーク                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | 流れの中にあって境界線も持つ面：`r-card`、`r-section`                          | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | 内容の上に一時的に重なる層：ドロップダウン、セレクト、ポップオーバー、トースト | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | 行く手をふさぐダイアログ：`r-modal`                                            | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

境界線のないオーバーレイは、周囲との切り分けを影だけに頼ります。だからオーバーレイの段階には本当に重みがあります。オーバーレイが持ち上げの段階に落ちてしまうと、平らでページに貼り付いて見えます。

## 重なり {#stacking}

浮くオーバーレイは `<body>` へポータルされるので、明示的な段階が要ります。

| トークン           | 既定値 | 用途                                                                                                       |
| ------------------ | ------ | ---------------------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000` | 行く手をふさぐダイアログとそのマスク                                                                       |
| `--ran-z-dropdown` | `1100` | ドロップダウン／セレクト／ポップオーバー：モーダルの**上**。ダイアログの中のセレクトが見えたままになります |
| `--ran-z-message`  | `1200` | トーストと通知：常に最前面                                                                                 |

はしごが 1000 から始まるのは、普通のページの外枠を越えるためです（ナビゲーションバーや背景は、たいてい十の位に置かれます）。段階を上書きするときは `:root` で、あるいはコンポーネントごとに（`--ran-dropdown-host-z-index`、`--ran-modal-root-z-index`、`--ran-message-z-index`）行い、`!important` は決して使わないでください。

## モーション

| トークン                     | 値      | 用途                         |
| ---------------------------- | ------- | ---------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | ホバー／アクティブの状態遷移 |
| `--ran-motion-duration-base` | `0.2s`  | ポップオーバー、メニュー     |
| `--ran-motion-duration-slow` | `0.35s` | もっと大きな現れ方           |

| イージングのトークン         | カーブ                              | 性格                                     |
| ---------------------------- | ----------------------------------- | ---------------------------------------- |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | イン・アウト。汎用                       |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | 素早く、行き過ぎなし：トグル             |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | わずかに行き過ぎ：ボタン、カード         |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | 遊びのある行き過ぎ：いいね、カートに追加 |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | 穏やかで行き過ぎなし：現れ、レイアウト   |

spring 系は、調整済みの SwiftUI のばねから蒸留したものです（response / damping を、一度だけ行き過ぎるベジェに落とし込んでいます）。

**これらは動きのプロパティとだけ組み合わせてください**：`transform`、`opacity`、箱の寸法です。パレットのプロパティ（`background-color`、`color`、`border-color`、`box-shadow`、`fill`、`stroke`）には、あえて既定のトランジションを付けていません。CSS は操作とテーマの切り替えを区別できないからです。色に付けたフェードは、ライトとダークが入れ替わるときにも発火します。それでも自分で有効にしたいときのために、どのコンポーネントも `--ran-*-transition` のフックを公開しています。

## フォーカス

| トークン                         | 値                                                                   | 用途                                                  |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | 標準のリング。`box-shadow` として                     |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | _どちらの_ テーマでも暗いままの面のための、リングの色 |

リングは 2 層です。背景色の内側のリングと、青い外側のリング。だからどんな面の上でも見えたままになりますし、モノクロになった primary に追随せず青のままです。

`--ran-focus-ring-inverse-color` は**あえてダークモードで再定義していません**。ページのテーマに関わらず自分の面が暗いままのコンポーネント（任意の映像の上に重なる `r-player` のコントロールバー）のためにあり、その面はページが変わっても変わらないからです。

## スキンのプリミティブ

コンポーネントが共有する構造的な値のうち、色でも寸法でも文字でもない、ごく少数のものです。あえて最小限に保っています。この層はかつてもっと大きく、そのほとんどはテーマパックとともに取り除かれました。

| トークン                        | 値                           | 用途                                                                                        |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | コンポーネントが描く境界線の太さ                                                            |
| `--ran-skin-border-style`       | `solid`                      | コンポーネントが描く境界線の種類                                                            |
| `--ran-skin-border-image-width` | `4px`                        | `border-image-slice` のインセット。button / checkbox / input / modal / message が共有します |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | 持ち上げた面の影。スキンが変えられるよう間接参照にしてあります                              |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | コンポーネントが使う書体。同じように間接参照にしてあります                                  |

## ダークモードが再定義するもの

`<html>`（あるいは任意のサブツリー。[テーマ](/ja/src/ranui/theme/)を参照）に付いた `data-ran-theme="dark"` が再定義するのは、**基礎パレットだけ**です。ただし、スケールを通じては解決できない例外が 3 つあります。

- 第 1 層のすべて：グレー、グレー（アルファ）、ブルー、レッド、アンバー、グリーンの全段と、ふたつの背景。
- `--ran-color-bg-elevated`。ダークでは `--ran-gray-100` を指し、カードが黒いページに溶けるのではなく浮き上がるようにします。
- `--ran-color-primary-hover` / `-active`。スケールの参照ではなくリテラルだからです。
- 影の 3 段階すべて。暗い地に合わせて調整し直されます。

それ以外（ほかのすべてのセマンティックトークン、すべての寸法、すべての時間）は一度だけ定義されます。

## コンポーネントのトークン

セマンティック層の下では、どのコンポーネントも自前のフックを、こう名づけて公開しています。

```
--ran-{component}-{element}[-{state}]-{property}
```

たとえば `--ran-btn-hover-background`、`--ran-select-search-active-border-width` です。既定ではセマンティックトークンへ落ちます：`var(--ran-btn-background, var(--ran-color-primary, #171717))`。だからセマンティックトークンをひとつ上書きすればそのすべてに届き、コンポーネントのトークンを上書きすれば変化はひとつの要素に絞られます。

生成された完全な一覧は、リポジトリの [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) にあります。要素ごとの API は[こちら](/ja/src/ranui/api)です。適用のしかたは[テーマ](/ja/src/ranui/theme/#customizing-tokens)を参照してください。

## 自分の CSS でトークンを使う {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

3 つのルールが、それをダークでも安全に保ちます。

1. テーマに追随すべきものに**生の 16 進数を書かないこと**。
2. **フォールバックは切り替わるトークンを指すこと**：`var(--ran-color-text, var(--ran-gray-1000))` であって、`var(--ran-color-text, #171717)` ではありません。
3. **フォールバックは存在するトークンを指すこと**。さもないと宣言は捨てられ、要素は継承したものを黙って保ち続けます。

> ライブラリが宣言するグローバルなトークンはすべてこのページに載っており、ここに書かないままトークンを増やすとユニットテストが落ちます。コンポーネント単位のトークンは別途生成され、[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) にあります。
