---
description: '液状のガラス面。マテリアルを選ぶだけで、背後をすりガラス状にぼかし、レンズのような縁で曲げます。画像や動画の上では WebGL2 でピクセルそのものを屈折させます。'
---

# Glass

液状のガラス面です。`material` を選べばガラスは完成します。背後にあるものをすりガラス状にぼかし、湾曲した縁でレンズのようにそれを曲げ、縁でわずかに色を分け、縁を照らします。個々の値は同じ名前の属性で上書きできます。コンテンツはデフォルトスロットに入れ、ガラスの上で読みやすい色が付きます。

> **こんなときに**：色や情報の豊かなコンテンツの上にパネルを置くとき（ヒーローカード、フローティングツールバー、メディアのオーバーレイなど）。平坦な背景の上では曲げるものがないため、効果は見えなくなります。

## プレイグラウンド

ガラスをドラッグし、マテリアルと背景を切り替えて、マークアップをコピーできます。スニペットにはマテリアルと異なる値だけが含まれます。

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## マテリアル

ほとんどの用途は 4 つのマテリアルでまかなえます。既定は `regular` です。

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| マテリアル | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| ---------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`     | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular`  | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`    | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`    | 2      | 130        | 28         | 40      | 40           | 120        |

## 画像の上に置く

ガラスを `<img>` や `<video>` の上に置くときは `backdrop` を付けます。値がなければガラスの親要素にある最初の画像または動画を使い、セレクターを書けば別の要素を指定できます。するとガラスはその要素のピクセルを WebGL2 で読み取り、波長ごとに異なる量で屈折させます。CSS の経路で光が曲がるのは Chromium だけですが、こちらは WebGL2 を持つすべてのエンジンで動きます。画像はページに残るので、alt テキストや周囲のコンテンツは変わりません。

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

クロスオリジンの画像を読み取るには `crossorigin` と CORS レスポンスが必要です。そうでなければ、ガラスは CSS のすりガラスのままです。

## トーンとインク

`tone` はガラスの背後に何があるかを表します。暗い背景や色の濃い背景では縁が照らされ、コンテンツは白になります。明るい背景では白い縁が見えなくなるため、縁には陰が付き、コンテンツは暗い色になります。`backdrop` 画像の上では、指定しない限りトーンは覆っている領域の明るさに従います。現在のトーンは `:state(light)` と `:state(dark)` で取得でき、`--ran-glass-ink` でコンテンツの色を上書きできます。

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## 入れ子

`<r-glass>` は組み合わせられます。ガラスのパネルの上にガラスのツールバーを置くように、入れ子にすれば重なったマテリアルになります。どの層も自分の背後にあるものを曲げます。

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API リファレンス

### プロパティ

| プロパティ    | 型        | 既定値         | 説明                                                                                                                                                                                                           |
| ------------- | --------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular`      | `thin`、`regular`、`thick`、`clear` のいずれか。以下の光学値をまとめて設定します。                                                                                                                             |
| `blur`        | `number`  | マテリアル依存 | すりガラスのぼかし半径（px）。                                                                                                                                                                                 |
| `saturate`    | `number`  | マテリアル依存 | 背後にあるものの彩度（パーセント）。                                                                                                                                                                           |
| `displace`    | `number`  | マテリアル依存 | 縁が背景を内側へ引き込む距離（px）。`0` は平らな板です。                                                                                                                                                       |
| `bevel`       | `number`  | マテリアル依存 | 光を曲げる湾曲した縁の帯の幅（px）。                                                                                                                                                                           |
| `dispersion`  | `number`  | マテリアル依存 | 縁での色の分かれ具合。`displace` に対するパーセント。                                                                                                                                                          |
| `specular`    | `number`  | マテリアル依存 | ハイライトの強さ（パーセント）。                                                                                                                                                                               |
| `radius`      | `number`  | `20`           | 角丸の半径（px）。                                                                                                                                                                                             |
| `tint`        | `string`  | マテリアル依存 | すりガラスの上に重ねる塗り。任意の CSS background 値。                                                                                                                                                         |
| `tone`        | `string`  | `dark`         | `dark` または `light`。ガラスの背後に何があるか。`backdrop` の上で未指定なら画像に追従します。                                                                                                                 |
| `backdrop`    | `string`  | —              | `<img>` または `<video>` を WebGL2 で屈折させます。空なら親要素の最初のものを、セレクターなら別の要素を指します。                                                                                              |
| `rim`         | `boolean` | `false`        | GPU で照らした縁。外壁と内壁、キーライトとフィルライト、きらめき。パネルの形だけに依存します。                                                                                                                 |
| `sheen`       | `boolean` | `false`        | 表面を横切って流れるハイライト。                                                                                                                                                                               |
| `interactive` | `boolean` | `false`        | クリックできるガラス向けの、ホバー時の浮き上がりと押し込みのフィードバック。ホストをキーボード操作できるボタンにもします：`role="button"`、タブ移動の対象になり、Enter と Space がクリックと同じ動作をします。 |

### 屈折 `displace`

`displace` は、縁が背後にあるものを中心へどれだけ引き寄せるかを決めます。これにより縁のすぐ内側の背景が縁の上に引き伸ばされ、厚い凸状の縁が拡大するのと同じ見え方になります。`bevel` はその湾曲した帯の幅を決めます。bevel の半分を超えると、本物の厚いガラスの縁と同じように、縁が像を折り返します。

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### 流れる光と操作感

`sheen` は動くハイライトを、`interactive` はホバー時の浮き上がりと押し込んで滑らかに戻る反応を加えます。

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — GPU によるスペキュラーエッジ（オプトイン）

`rim` は縁を GPU で描きます。明るい外壁と、bevel が平らな面と接する位置のかすかな内壁があり、左上からのキーライトと右下からの弱いフィルライトで照らされ、縁に沿って厚みが変わり、ときおりきらめきます。`light` トーンでは壁は照らされる代わりに陰になります。背景はサンプリングしません。シェーダーが知っているのはパネルのサイズ、角丸、bevel だけです。まず WebGL で描画し、ブラウザが WebGPU を持っていればバックグラウンドで移行し、どちらも使えなければ CSS のハイライトをそのまま残します。

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### CSS parts とトークン

内部は `::part(glass)`、`::part(specular)`、`::part(refraction)`、`rim` 指定時は `::part(rim)` でスタイルを当てるか、`--ran-glass-*` カスタムプロパティを上書きします：

| トークン                                      | 用途                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------- |
| `--ran-glass-ink`                             | コンテンツの色。既定は白、light トーンではほぼ黒。                   |
| `--ran-glass-tint`                            | すりガラスの上の塗り。                                               |
| `--ran-glass-border`                          | 縁のボーダー。                                                       |
| `--ran-glass-shadow`                          | ボックスシャドウの重なり（スペキュラーと奥行き）。                   |
| `--ran-glass-brightness`                      | 背後にあるものの明るさ。                                             |
| `--ran-glass-specular-background`             | CSS ハイライトの背景。                                               |
| `--ran-glass-specular-opacity`                | CSS ハイライトの強さ。そのレイヤーでは `specular` より優先されます。 |
| `--ran-glass-reduced-transparency-background` | OS の「透明度を下げる」設定がオンのときの代替の面。                  |
| `--ran-glass-reduced-transparency-shadow`     | 同じ状態での代替の影。                                               |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## 説明 {#notes}

- **2 つの経路**：`backdrop` がなければ、`backdrop-filter` がガラスの背後にある実際のページをすりガラス状にするので、背後のテキスト、動画、コントロールはそのまま動きます。レンズ状で色の分かれる縁は SVG フィルターで、Chromium で描画され、Safari と Firefox ではすりガラスだけが残ります。`backdrop` があれば、WebGL2 を持つすべてのエンジンで、その画像や動画 1 つを WebGL2 が屈折させます。
- **読みやすさ**：コンテンツには `--ran-glass-ink` の色が付きます。長い文章はガラスにコントラストを任せず、不透明な内側の面に置いてください。
- **透明度を下げる設定**：OS の「透明度を下げる」または「コントラストを上げる」設定（`prefers-reduced-transparency: reduce`）のもとでは、ガラスはテーマに追従する不透明な面（`--ran-color-bg-elevated`）になり、すりガラス、屈折、ハイライトはなくなります。
- **モーション**：面がトランジションするのは `transform` だけなので、テーマの切り替えは 1 フレームで終わります。流れる光と押し込みは `prefers-reduced-motion` に従います。
- **コスト**：SVG のレンズマップは、パネルのサイズ、角丸、bevel が変わったときに作り直されます。WebGL の屈折は表示中に 1 フレームに 1 回パネルと画像を確認し、どちらかが動いたときだけ描画します。
