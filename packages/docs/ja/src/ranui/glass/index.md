---
description: '背景ぼかし・SVG による光の屈折・スペキュラーリムを組み合わせた液状のすりガラス面。backdrop-filter が使えない環境では素直に劣化します。'
---

# Glass

液状のすりガラス面。`<r-glass>` は背後にあるものを曇らせ、屈折させます。すりガラス感は `backdrop-filter` の blur と saturate、液状の光の曲がりは SVG の `feDisplacementMap`、そこにガラスらしさを出すスペキュラーリムとハイライトが加わります。すべてトークン駆動で、中身はデフォルトスロットに入れます。

> **こんなときに**：色や情報の豊かなコンテンツの上に半透明のパネルを重ねたいとき（ヒーローカード、フローティングツールバー、メディアのオーバーレイなど）。`displace` 属性でどれくらい_液体らしく_見えるかが決まります（0 は平らなすりガラス板）。`backdrop-filter` が使えない環境では、すべての効果がただの半透明面へ素直に劣化します。

## プレイグラウンド

ステージ上でガラスをドラッグし、各属性を調整して、そのままのマークアップをコピーできます。初期値は iOS のすりガラス素材の見え方です。

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> `<r-glass>` は色数の多い、賑やかなコンテンツの上に置いてください。平坦な背景の上では効果が見えません。

## 入れ子

`<r-glass>` は組み合わせられます。入れ子にすれば素材が重なった表現になります（ガラスのパネルの上にガラスのツールバー、など）。どの層も、その背後にあるものを屈折させます。

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">外側のパネル</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">入れ子のガラスツールバー</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    外側のパネル
    <r-glass radius="16" displace="6">
      <div class="toolbar">入れ子のガラスツールバー</div>
    </r-glass>
  </div>
</r-glass>
```

## API リファレンス

### プロパティ

| プロパティ    | 型        | 既定値  | 説明                                                                                                                                                                                                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | 背景ぼかしの半径（px）。すりガラスの強さ。                                                                                                                                                                                                  |
| `saturate`    | `number`  | `180`   | 背景の彩度（パーセント）。ガラス越しの色を持ち上げます。                                                                                                                                                                                    |
| `displace`    | `number`  | `8`     | 液状屈折の強さ（SVG ディスプレイスメントのスケール）。`0` は平らなすりガラス板、大きいほど波打ちます。                                                                                                                                      |
| `frequency`   | `number`  | `0.005` | タービュランスの基本周波数。小さいほど、大きくなめらかな波になります。                                                                                                                                                                      |
| `radius`      | `number`  | `20`    | 角丸の半径（px）。                                                                                                                                                                                                                          |
| `tint`        | `string`  | 控えめ  | ガラスの塗りの色味。任意の CSS background 値。                                                                                                                                                                                              |
| `sheen`       | `boolean` | `false` | 表面を流れるスペキュラーの動き。                                                                                                                                                                                                            |
| `interactive` | `boolean` | `false` | ホバーで浮き、押すと縮むフィードバック。クリックできるガラス向け。ホストをキーボード操作可能なボタンにもします（`role="button"`、タブ停止、Enter / Space がクリックとして働く）。                                                           |
| `rim`         | `boolean` | `false` | スペキュラーリムと色収差エッジを足して、より物理的な光り方にするオプトイン。まず WebGL（常に、同期的に）、可能なら背後で WebGPU へ透過的に切り替わります。どちらも使えない環境では CSS のスペキュラーグラデーションへフォールバックします。 |

### 屈折 `displace`

`displace` は SVG `feDisplacementMap` のスケール、つまり光が面をどれだけ強く曲がって通るかを決めます。平らなすりガラス板にしたいときは `0` にしてください。

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</Demo>

```html
<r-glass displace="0">…平らなすりガラス…</r-glass> <r-glass displace="60">…液状…</r-glass>
```

### 流れる光と操作感

`sheen` は動くスペキュラーハイライトを、`interactive` はホバーでの浮き上がりとばねのある押し込みを加えます（共有トークン `--ran-motion-ease-spring` を使用）。

<Demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">ホバーして押してみてください</div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass sheen interactive displace="36">
  <div>ホバーして押してみてください</div>
</r-glass>
```

### Rim — GPU によるスペキュラーエッジ（オプトイン）

`rim` はもう一枚のハイライト層を足します。左上に固定した光源から当たるスペキュラーリムと、角丸矩形の縁に出るごく控えめな色収差（RGB）のフリンジです。`displace` の屈折と違い、**背景を一切サンプリングしません**。シェーダーはパネル自身の幅・高さ・角丸しか知らないので、背景をまるごと GPU に取り込む方式が抱える操作性やアクセシビリティの代償を払わずに済みます（[説明](#notes)を参照）。同じ `backdrop-filter` のすりガラスの上に重なる純粋な装飾層であり、オンにしてもオフにしても、ガラスの背後にあるものやそのサンプリングの仕方は変わりません。

まず WebGL で描画し（同期的で、事実上どのブラウザでも動くので、リムが自分の初回描画を遅らせることはありません）、ブラウザが対応していれば背後で WebGPU へ透過的に切り替わります（効果は同じで、出力はピクセル単位で一致します）。どちらの GPU API も使えないとき（かなり古いブラウザ、無効化、SSR）は CSS のスペキュラーグラデーションへフォールバックするので、壊れた状態や空白の状態を設計で織り込む必要はありません。

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim なし</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…CSS のスペキュラーのみ…</r-glass>
<r-glass rim>…GPU のリム + 色収差エッジ（WebGL、可能なら WebGPU へ）…</r-glass>
```

### CSS parts とトークン

`::part(glass)`、`::part(specular)`、そして（`rim` を付けたときの）`::part(rim)` で内部にスタイルを当てるか、`--ran-glass-*` カスタムプロパティを上書きします。

| トークン                                      | 用途                                                |
| --------------------------------------------- | --------------------------------------------------- |
| `--ran-glass-blur`                            | 背景ぼかしの半径。                                  |
| `--ran-glass-saturate`                        | 背景の彩度。                                        |
| `--ran-glass-radius`                          | 角丸の半径。                                        |
| `--ran-glass-tint`                            | 塗りの背景。                                        |
| `--ran-glass-border`                          | 縁のライン。                                        |
| `--ran-glass-shadow`                          | シャドウの重ね（ハイライト + 奥行き）。             |
| `--ran-glass-specular-background`             | スペキュラーハイライトの背景。                      |
| `--ran-glass-specular-opacity`                | スペキュラーの強さ。                                |
| `--ran-glass-reduced-transparency-background` | OS の「透明度を下げる」設定が有効なときの代替の面。 |
| `--ran-glass-reduced-transparency-shadow`     | 同じ状態での代替のシャドウ。                        |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## 説明 {#notes}

- **背景のサンプリング**：`<r-glass>` は `backdrop-filter` で背後の DOM を屈折させるので、ガラスの向こうにある選択可能なテキスト、再生中の動画、操作できる要素はそのまま動き続けます。上で触れた `rim` はパネル自身の形から計算される純粋な装飾 GPU 層で、背景をサンプリングしません。
- **読みやすさ**：本文は不透明な内側の面に置いてください。コントラストをガラスだけに任せないこと。
- **透明度を下げる設定**：`<r-glass>` は OS レベルの「透明度を下げる / コントラストを上げる」設定（`prefers-reduced-transparency: reduce`）に反応し、すりガラスや屈折をやめて、不透明でテーマに追随する面（既定は `--ran-color-bg-elevated`）に切り替えます。OS 標準のコントロールが自動でやっていることの、カスタム要素版です。
- **ブラウザ間の屈折の差**：`feDisplacementMap` による液状の効果は、現状 Chromium でのみ描画されます。Safari と Firefox は `backdrop-filter` のその部分を落とし、blur / saturate / brightness のすりガラスだけを残します。平坦にはなりますが、これは壊れた状態ではなく正当なフォールバックです。
- **モーション**：面がトランジションするのは `transform` だけで、色は決してトランジションしません。そのためライト / ダークの切り替えは 1 フレームで終わります。流れる光と押し込みは `prefers-reduced-motion` に従います。
