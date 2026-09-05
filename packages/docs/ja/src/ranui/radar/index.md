---
description: '一つのデータセットの複数の指標を 2D キャンバス上で見比べるレーダー（スパイダー）チャート。'
---

# Radar

一つのデータセットの複数の指標を、二次元のキャンバス上で見比べるためのレーダーチャートです。

> **使いどころ**：一つのデータセットの複数の指標を見比べるレーダーチャートが必要なとき。軸の名前と点数の JSON 配列を `abilitys` 属性から `<r-radar>` に渡します。

## クイックスタート

### 基本的な使い方

データは `abilitys` 属性に **JSON 文字列**（オブジェクトの配列）として渡します。HTML の属性は文字列しか持てないので、値は妥当な JSON である必要があり、内部で `JSON.parse` により解析されます。`<r-radar>` のホストは固有の大きさを持たないので、明示的な幅と高さを与えてください。

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

`abilitys` の JS プロパティから手続き的に設定することもできます。配列（属性へ文字列化して書き戻されます）でも JSON 文字列でも受け付けます。

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: 'HP', scoreRate: 10 },
  { abilityName: '攻撃', scoreRate: 90 },
  { abilityName: '防御', scoreRate: 20 },
];
chart.append(radar);
```

## API リファレンス

### プロパティ

| プロパティ     | 型                 | 既定値                                       | 説明                                                   |
| -------------- | ------------------ | -------------------------------------------- | ------------------------------------------------------ |
| `abilitys`     | `string` / `Array` | `''`                                         | チャートのデータ。JSON 文字列（JS プロパティなら配列） |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | 同心の網目多角形の色                                   |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | 軸線と外周の色                                         |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | データ領域の塗りの色                                   |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | データ領域の輪郭と頂点の点の色                         |
| `sheet`        | `string`           | `''`                                         | コンポーネントの shadow DOM に注入する CSS             |

`abilitys` 配列の各要素は次のキーを受け付けます。

| キー              | 型       | 必須   | 説明                                                 |
| ----------------- | -------- | ------ | ---------------------------------------------------- |
| `abilityName`     | `string` | はい   | 軸のラベル文字列                                     |
| `scoreRate`       | `number` | はい   | その軸の値。網目の上限は `100` です                  |
| `backgroundColor` | `string` | いいえ | ラベルの背景色（既定は透明）                         |
| `fontSize`        | `number` | いいえ | ラベルの文字サイズ（既定はチャートに合わせた大きさ） |
| `fontColor`       | `string` | いいえ | ラベルの文字色（既定は `--ran-color-text`）          |
| `fontFamily`      | `string` | いいえ | ラベルの書体（既定は `SimHei`）                      |

> メモ：`colorPolygon`、`colorLine`、`fillColor`、`strokeColor` は大文字小文字を区別せずに読まれるので、最初から属性がある場合もマウント後に変えた場合も正しく描画されます。どれを更新してもチャートは描き直されます。テーマに追従させたいときは、下の CSS 変数を優先してください。

### チャートのデータ `abilitys`

ラベルごとのスタイル（`backgroundColor`、`fontSize`、`fontColor`）は、要素ごとに設定できます。

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"HP","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"HP","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

### 網目多角形の色 `colorPolygon`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

### 軸線の色 `colorLine`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

### 領域の塗りの色 `fillColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

### 領域の輪郭の色 `strokeColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"攻撃","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素熟知","scoreRate":"50"},{"abilityName":"会心率","scoreRate":"80"},{"abilityName":"会心ダメージ","scoreRate":"50"}]'
></r-radar>
```

### 完全な例データ

HTML の `attribute` は `string` しか運べないので、渡すデータは `json` の文字列である必要があり、`JSON.parse` でオブジェクトの配列に戻されます。`JSON` の形が崩れていると解析できません。

```json
[
  {
    "abilityName": "HP",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "攻撃",
    "scoreRate": "90"
  },
  {
    "abilityName": "防御",
    "scoreRate": "20"
  },
  {
    "abilityName": "元素熟知",
    "scoreRate": "50"
  },
  {
    "abilityName": "会心率",
    "scoreRate": "80"
  },
  {
    "abilityName": "会心ダメージ",
    "scoreRate": "50"
  }
]
```

### CSS 変数

チャートの色は、ホストの CSS カスタムプロパティからも（テーマに反応する形で）設定できます。

| 変数                        | 既定値                                | 説明                              |
| --------------------------- | ------------------------------------- | --------------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | 網目多角形の色                    |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | 軸線の色                          |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | データ領域の塗りの色              |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | データ領域の輪郭の色              |
| `--ran-radar-width`         | `100%`                                | キャンバスのコンテナの幅          |
| `--ran-radar-height`        | `100%`                                | キャンバスのコンテナの高さ        |
| `--ran-radar-display`       | `block`                               | キャンバスのコンテナの `display`  |
| `--ran-radar-position`      | `relative`                            | キャンバスのコンテナの `position` |

ラベルの文字色もテーマトークン `--ran-color-text` にフォールバックするので、ライトでもダークでもラベルは読めるままです。

## イベント

ありません。`<r-radar>` はカスタムイベントを派発しません。

## ベストプラクティス

- **大きさ**：ホストは固有の大きさを持ちません。必ず明示的な `width` / `height` を（`style` か `--ran-radar-width` / `--ran-radar-height` の変数で）設定してください。コンテナのリサイズは `ResizeObserver` で検知し、チャートは自動で描き直されます。
- **データの形式**：`abilitys` には妥当な JSON を渡してください。形の崩れた JSON は記録され、解析できません。スクリプトで実際の配列を扱うときは `abilitys` の JS プロパティを使います。
- **尺度**：`scoreRate` は固定の最大値 `100` に対して測られます。値をその範囲に正規化してください。
- **テーマ**：色の属性（`colorPolygon`、`colorLine`、`fillColor`、`strokeColor`）はリアクティブで、マウント後に変えるとチャートを描き直します。色をライト／ダークのテーマに自動で追従させたいときは `--ran-radar-*` の CSS 変数を優先してください。
