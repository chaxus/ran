---
description: 'ranui の Player（<r-player>）はネイティブの <video> を統一されたコントロールバーで包みます。再生、進捗のドラッグ、音量、速度、全画面、そして HLS / DASH / FLV / WebRTC のストリーミングに対応します。'
---

# Player

`<video>` を統一されたコントロールバーで包むネイティブの `<r-player>` メディア要素です。進捗のドラッグ、音量調整、再生速度、全画面、そして HLS / DASH / FLV / WebRTC のストリーミングを備えます。

> **こんなときに**：コントロールバーが最初から付いていて、進捗のスクラブ、再生速度、全画面、HLS / DASH / FLV / WebRTC のストリーミングができる動画プレーヤーが必要なとき。`<r-player>` は `<video>` を包み、どのフレームワークでもそのまま動きます。

Web Components の上に作られており、`hls.js` / `dashjs` / `mpegts.js` はそれぞれの形式のために必要になったときだけ遅延読み込みされます。だから同じプレーヤーがどのフレームワークでもそのまま動きます。ソースから拾った機能は次のとおりです。

- ドラッグできる進捗バー。バッファ済みの表示と、ホバー時の時刻ツールチップつき
- 音量調整とミュートの切り替え
- 再生速度の選択
- 全画面の切り替え（`Esc` で解除）
- ピクチャーインピクチャーの切り替え。ボタンはブラウザーが実際に対応しているときだけ描画されます
- AirPlay / リモート再生のボタン。ブラウザー自身のデバイス選択で、ピクチャーインピクチャーと同じように機能検出されます
- モバイルのジェスチャー：左右どちらかの半分をダブルタップで ∓10 秒シーク、右半分の縦スワイプで音量（タッチのみ。マウスやペンの操作には影響しません）
- タッチ、ペン、マウスでのスクラブ：進捗のつまみは 3 つとも単一の Pointer Events 実装を使います。ドラッグの途中でブラウザーがポインターを取り上げた場合は、シークせずにドラッグを終えます。視聴者が選んだ位置でポインターが離されたわけではないからです
- サムネイルのスクラブプレビュー：`thumbnails` に WebVTT のスプライトシート・マニフェストの URL を設定すると、シークバーのホバー表示の上に切り出したプレビューが出ます
- `poster` / `autoplay` / `loop` / `muted`：標準の `<video>` 属性をそのまま素通しします
- 字幕・CC：`tracks` プロパティを設定します。キューの描画はブラウザーのネイティブ機能で、視聴者の選択を覚える言語ピッカーが付きます
- エラーと再試行：致命的な再生失敗時に `Modal.error()` のダイアログを出します。既定で有効で、`disable-error-modal` で無効にできます
- 再生位置の復帰：`remember-position` で有効化。`localStorage` に `src` ごとのキーで保存されます
- QoE 指標：`getMetrics()` が、既存のイベントストリームから再バッファの回数と時間、初回フレームまでの時間、画質切り替えの回数、エラー数を導きます
- HLS（`.m3u8`）と DASH（`.mpd`）の再生。自動ビットレート切り替えと手動の画質セレクターつき。FLV / 生の MPEG-TS（`.flv` / `.ts`）は `mpegts.js` で再生します。どのエンジンも必要になったときに遅延読み込みされ、設定は要りません。URL の拡張子から判別できないときは、`format` 属性で特定のエンジンを強制できます（素の `<video src>` に戻すこともできます）
- WHEP による WebRTC の低遅延ライブ再生（`format="webrtc"`、`src` は WHEP のエンドポイント URL）。ライブラリ依存はありません。`RTCPeerConnection` はブラウザーのネイティブ API です
- キーボードショートカット：`Space` で再生・一時停止、`ArrowLeft` / `ArrowRight` で 5 秒シーク、`Escape` で全画面解除、フォーカス中のシークバーでは `Home` / `End` と矢印キー

## クイックスタート

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> この要素は `display: block` で描画されます。動画が埋める箱を持てるよう、幅と高さを明示的に（インラインスタイルか CSS で）与えてください。

## API リファレンス

### プロパティ

| プロパティ            | 型                    | 既定値  | 説明                                                                                                                                                                                                                                                                                               |
| --------------------- | --------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                 | `string`              | `''`    | 動画リソースの URL。変更するとプレーヤーが読み込み直されます。エンジン（HLS / ネイティブ）は拡張子から自動判別されます。                                                                                                                                                                           |
| `format`              | `string`              | `''`    | `src` の拡張子からの自動判別に代えて、特定のエンジン（`hls` / `dash` / `flv` / `webrtc` / `native`）を強制します。拡張子のない URL や署名つきの配信 URL で役に立ち、`webrtc` では**必須**です（WHEP のエンドポイントには判別できる拡張子がありません）。変更するとプレーヤーが読み込み直されます。 |
| `volume`              | `string`              | `''`    | 初期音量。`0`〜`100` の目盛りで、`setVolume()` / `getVolume()` と同じ尺度です。                                                                                                                                                                                                                    |
| `currentTime`         | `string`              | `''`    | 初期の再生位置（秒）。小文字の `currenttime` でも受け付けます。                                                                                                                                                                                                                                    |
| `playbackRate`        | `string`              | `''`    | 再生速度の倍率（`1`、`1.5`、`2` など）。小文字の `playbackrate` でも受け付けます。                                                                                                                                                                                                                 |
| `debug`               | `string`              | `''`    | 真値のとき、内部の `change` イベントと警告をすべてコンソールに出します。                                                                                                                                                                                                                           |
| `sheet`               | `string`              | `''`    | 見た目を変えるために、コンポーネントの Shadow DOM に注入する CSS テキスト。                                                                                                                                                                                                                        |
| `poster`              | `string`              | `''`    | 再生前に表示する画像の URL。そのまま `<video poster>` に渡されます。                                                                                                                                                                                                                               |
| `autoplay`            | `boolean`             | `false` | 真偽の属性。存在すれば `true` で、ネイティブの `<video autoplay>` と同じです。ユーザーの操作なしに自動再生が実際に始まるには、ブラウザーはたいてい `muted` を求めます。                                                                                                                            |
| `loop`                | `boolean`             | `false` | 真偽の属性。終端で再生を繰り返します。ネイティブの `<video loop>` と同じです。                                                                                                                                                                                                                     |
| `muted`               | `boolean`             | `false` | 真偽の属性。無音で始まります。内部的には音量を `0` にし（ミュートのアイコンとスライダーが一致するように）、**かつ** ネイティブの `<video>.muted` フラグも立てます（ブラウザーのミュート自動再生ポリシーを満たすため）。属性を外すと元の音量に戻ります。                                            |
| `thumbnails`          | `string`              | `''`    | WebVTT スプライトシート・マニフェストの URL。シークバーのホバー表示の上に切り出したサムネイルを出します。下の[サムネイルのスクラブプレビュー](#thumbnail-scrubbing-preview-thumbnails)を参照。`src` とは独立していて、この属性自体が変わったときにだけ取り直されます。                             |
| `disable-error-modal` | `boolean`             | `false` | 組み込みのエラーと再試行のダイアログを無効にします。エラーは `error` / `sourceerror` の `change` イベントとして届き続けるので、その上に自分の UI を作れます。                                                                                                                                      |
| `remember-position`   | `boolean`             | `false` | 再生位置の復帰を有効にします。一時停止時とタブが隠れたときに現在位置を `localStorage`（キーは `src`）へ保存し、同じ `src` を次に読み込んだときに復元し、再生が終わったら消します。                                                                                                                 |
| `tracks`              | `PlayerTrackConfig[]` | `[]`    | 字幕・CC のトラック。**JS のプロパティのみで、対応する属性はありません**（プレーヤーは読み込みのたびに自分のライト DOM を空にするので、宣言的に書いた `<track>` の子は効く前に取り除かれてしまいます）。下の[字幕・CC](#subtitles-cc-tracks)を参照。                                               |

> 監視される属性（`observedAttributes` より）：`src`、`format`、`volume`、`currentTime` / `currenttime`、`playbackRate` / `playbackrate`、`debug`、`sheet`、`poster`、`thumbnails`、`autoplay`、`loop`、`muted`、`disable-error-modal`、`remember-position`。

### 動画のソース `src`

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### WebRTC のライブ再生 `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

低遅延のライブ配信には `format="webrtc"` を設定し、`src` を **WHEP**（WebRTC-HTTP Egress Protocol）のエンドポイントに向けてください。Cloudflare Stream、LiveKit の egress、Millicast などのプラットフォームが公開している、あの形式です。ライブラリ依存はありません。`RTCPeerConnection` と `fetch` はブラウザーのネイティブ API なので、HLS / DASH / FLV と違ってこのエンジンには遅延読み込みするチャンクがありません。WHEP のエンドポイントには自動判別できるファイル拡張子がないので、`format="webrtc"` は**必須**です。`src` から推測されることはありません。

内部では、`recvonly` の音声・映像トランシーバーを持つ `RTCPeerConnection` を作り、ICE の収集を待ち、SDP のオファーを `src` へ `POST` し（`Content-Type: application/sdp`）、応答本文の SDP アンサーを適用し、届いたストリームを `video.srcObject` に取り付けます。再生を終えるときは、サーバーが応答の `Location` ヘッダーで返したセッションのリソースを `DELETE` します。対応範囲はあえて控えめです。WHEP の PATCH ベースのトリクル機構ではなく非トリクル ICE を使い（数秒で打ち切り、そのとき手元にある候補で進めます）、サーバーが示す STUN / TURN のヒントのための `Link: rel="ice-server"` ヘッダーの解析も行いません。直接到達できる WHEP のたいていの構成は、どちらもなしで動きます。FLV と同じく画質セレクターはありません。WHEP にはクライアント側からのマルチビットレート選択の標準がないので、このエンジンでは `getMetrics()` の `qualitySwitchCount` は `0` のままです。

### 初期音量 `volume`

値は `0`〜`100` の目盛りです。

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### 初期の再生位置 `currentTime`

メディアの先頭からの秒数です。

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### 再生速度 `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### デバッグログ `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### ポスター、自動再生、ループ、ミュート

```html
<r-player
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  poster="/ran/hls/poster.jpg"
  autoplay
  muted
  loop
></r-player>
```

### ピクチャーインピクチャー

コントロールバーの PiP ボタンは、`document.pictureInPictureEnabled` が真のときだけ現れます。対応していないブラウザーに、押しても何も起きないボタンが残ることはありません。`togglePip()` でプログラムから切り替えられます。

### AirPlay / リモート再生

キャストのボタンは、ブラウザーが標準化路線の Remote Playback API（`videoElement.remote.prompt()`、Chrome / Edge）か Safari の `webkitShowPlaybackTargetPicker()`（AirPlay）のどちらかを公開しているときに現れます。それ以外では、無効化ではなく非表示になります。ピクチャーインピクチャーと同じ、段階的強化の考え方です。`showRemotePlaybackPicker()` でデバイス選択をプログラムから開けます。

### モバイルのジェスチャー

タッチ専用で、既定で有効、有効にするための属性はありません。動画の左半分をダブルタップで 10 秒戻し、右半分をダブルタップで 10 秒送ります（`-10s` / `+10s` の短い表示が確認になります）。右半分を縦にドラッグすると音量を調整できます。マウスとペンの操作にはまったく手を触れません。一本指のタップは今までどおり再生・一時停止を切り替えますが、ダブルタップの判定に使うのと同じ窓でデバウンスされるので、シークのためのダブルタップの途中で再生がちらつくことはありません。スワイプでは既存の `volume` イベントに加えて、`gestureseek` の `change` イベント（`{ direction, seconds }`）を発火します。

### サムネイルのスクラブプレビュー `thumbnails` {#thumbnail-scrubbing-preview-thumbnails}

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` は、YouTube や Video.js が使うスプライトシートの慣習に従ったキューを持つ WebVTT のマニフェストを指します。各キューのテキストは画像への参照に、共有スプライトシートからの切り出し位置を示す `#xywh=x,y,w,h` のフラグメントを添えたものです。

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

画像への参照は VTT ファイル自身の URL からの相対で解決されるので、マニフェストの隣に置いたスプライトシートに絶対パスは要りません。シークバーをホバー（あるいはドラッグ）すると、その時刻を含むキューが、既存の時刻ツールチップの上に切り出されたサムネイルとして出ます。`thumbnails` が未設定のとき、あるいはマニフェストが読み込まれる前は、何も描かれません。マニフェストは `thumbnails` が変わるたびに一度だけ取得・解析され、`src` とは独立しています。画質やソースを切り替えても取り直しません。

### 字幕・CC `tracks` {#subtitles-cc-tracks}

```js
const player = document.createElement('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
stage.append(player);
```

各エントリーは、下敷きの `<video>` にネイティブの `<track>` として付きます。キューの描画は完全にブラウザー任せで、プレーヤーが独自に何かを描くことはありません。コントロールバーには言語ピッカー（`<r-select>`。画質セレクターと同じ操作感）が現れ、**オフ**と各トラックが並びます。選んだ言語は `localStorage` に覚えられ、次にページ上のどの `<r-player>` にトラックが与えられたときにも自動で適用されます（動画ごとではなく全体の設定です）。まだ何も保存されていなければ、`default: true` を持つトラックにフォールバックします。`tracks = []` にするとピッカーとすべてのトラックが取り除かれます。`setSubtitleLanguage(lang)` で、有効な言語を命令的に設定できます（`lang` は `srclang` か `'off'`）。

### エラーと再試行

既定で有効です。ストリーミングエンジンの致命的なエラーか、ネイティブの `<video>` の `error` イベントが起きると、`Modal.error()` のダイアログが開きます（遅延読み込みで、実際に何かが失敗するまで `r-modal` は取りに行きません）。中には、プレーヤーを読み込み直す**再試行**のボタンがあります。これを止めて自分でエラーを扱いたいときは `disable-error-modal` を設定し、代わりに `error` / `sourceerror` の `change` イベントを使ってください。致命的でないエンジンのエラー（hls.js が内部で回復するもの）は、このダイアログを開きません。

### 再生位置の復帰 `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

`pause` のときと、タブが隠れたとき（`visibilitychange`。`beforeunload` より信頼できます）に `getCurrentTime()` を `localStorage`（キーは `src`）へ保存し、同じ `src` を次に読み込んだときに復元し、動画が `ended` に達したら消します。保存された位置が総再生時間の 2 秒以内なら、黙って飛ばします。見終わった動画は「終端から再開」ではなく、最初から始まるべきだからです。覚えるのは位置だけで、音量・速度・字幕の好みはそれぞれ別の設定です。

### QoE 指標 {#qoe-metrics}

```js
const player = document.createElement('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
stage.append(player);
```

`getMetrics()` は、下に載せているのと同じ `change` イベントのストリームから導いた、素のオブジェクトのスナップショットを返します。別途オプトインする計測はありません。

| フィールド           | 型               | 説明                                                                                         |
| -------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `rebufferCount`      | `number`         | `waiting`→`playing` の遷移の回数（詰まってから回復した回数）。                               |
| `rebufferDuration`   | `number`         | すべての再バッファで詰まっていた合計時間（ミリ秒）。                                         |
| `firstFrameMs`       | `number \| null` | 現在の `src` が読み込みを始めてから最初の再生可能なフレームまでのミリ秒。それまでは `null`。 |
| `qualitySwitchCount` | `number`         | 利用者が画質セレクターから選んだ画質の回数。                                                 |
| `errorCount`         | `number`         | `error` / `sourceerror` のイベント数。                                                       |

新しい `src` / `format` が読み込まれるたびにスナップショットはリセットされます。常に**現在の**ソースについての値であって、ソースをまたいだ累計ではありません。

## メソッド

プレーヤーは要素のインスタンスに命令的なコントロールを公開しています。

| メソッド                                   | 説明                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `play(time?)`                              | 再生を始めます。必要なら `time`（秒）へシークします。                                                   |
| `pause()`                                  | 再生を一時停止します。                                                                                  |
| `getCurrentTime()`                         | 現在の再生位置（秒）。                                                                                  |
| `setCurrentTime(seconds)`                  | 指定の位置へシークします。                                                                              |
| `getTotalTime()`                           | メディア全体の長さ（秒）。                                                                              |
| `getVolume()` / `setVolume(v)`             | 音量の読み書き。`0`〜`100` の目盛りで、`volume` 属性と同じ尺度です。                                    |
| `getPlaybackRate()` / `setPlaybackRate(n)` | 速度の倍率の読み書き。                                                                                  |
| `customRequestFullscreen()`                | 全画面に入ります。`Promise` を返します。                                                                |
| `customExitFullscreen()`                   | 全画面から出ます。`Promise` を返します。                                                                |
| `togglePip()`                              | ピクチャーインピクチャーへ出入りします。未対応かソース未読み込みなら何もしません。                      |
| `setSubtitleLanguage(lang)`                | `srclang` で有効な字幕トラックを設定します。`'off'` で無効にします。                                    |
| `getMetrics()`                             | 現在の [QoE 指標](#qoe-metrics)のスナップショットを読みます。                                           |
| `showRemotePlaybackPicker()`               | ブラウザーの AirPlay / リモート再生のデバイス選択を開きます。未対応かソース未読み込みなら何もしません。 |

## イベント

プレーヤーが発火するのは、たったひとつの `change` CustomEvent です。内部の状態遷移（ネイティブのメディアイベントと、プレーヤー自身の UI 操作）はすべてそこに集約されるので、購読は一度きりで、`detail.type` で分岐します。

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` は <r-player> のインスタンスそのものです
  });
</script>
```

### `detail` の中身

| プロパティ    | 型        | 説明                          |
| ------------- | --------- | ----------------------------- |
| `type`        | `string`  | 起きた変化の名前。            |
| `data`        | `unknown` | その変化に伴う値やイベント。  |
| `currentTime` | `number`  | 現在の再生位置（秒）。        |
| `duration`    | `number`  | メディア全体の長さ（秒）。    |
| `tag`         | `Element` | `<r-player>` のインスタンス。 |

### `detail.type` の値

下敷きの `<video>` から転送されるネイティブのメディア状態：

| 種別             | 説明                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `canplay`        | 再生を始められるだけのデータが揃った。                                                                       |
| `canplaythrough` | バッファリングなしで最後まで再生できる。                                                                     |
| `complete`       | 描画が完了した。                                                                                             |
| `durationchange` | `duration` の値が変わった。                                                                                  |
| `emptied`        | メディアが空になった／読み込み直された。                                                                     |
| `ended`          | 再生が終端に達した。                                                                                         |
| `error`          | メディアのエラーが起きた（`disable-error-modal` がなければ、組み込みのエラー＋再試行ダイアログも開きます）。 |
| `loadstart`      | ブラウザーがメディアの読み込みを始めた。                                                                     |
| `loadedmetadata` | メタデータが読み込まれた。                                                                                   |
| `loadeddata`     | 最初のフレームが読み込まれた。                                                                               |
| `progress`       | リソースの読み込み中に定期的に発火する。                                                                     |
| `ratechange`     | 再生速度が変わった。                                                                                         |
| `seeking`        | シークが始まった。                                                                                           |
| `seeked`         | シークが完了した。                                                                                           |
| `stalled`        | ブラウザーはデータを取りに行っているが、何も届いていない。                                                   |
| `suspend`        | メディアの読み込みが中断された。                                                                             |
| `timeupdate`     | `currentTime` が変わった。                                                                                   |
| `volumechange`   | video 要素の音量が変わった。                                                                                 |
| `waiting`        | データ待ちで再生が止まった。                                                                                 |
| `play`           | 再生が始まった。                                                                                             |
| `playing`        | バッファリングや一時停止のあと、再生が再開した。                                                             |
| `pause`          | 再生が一時停止した。                                                                                         |

プレーヤー固有の操作：

| 種別               | `data`                   | 説明                                                                                                                                                                                                                                |
| ------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `volume`           | `number`（`0`〜`100`）   | コントロールバーかミュート切り替えで音量が変わった。                                                                                                                                                                                |
| `speed`            | `number`                 | 速度セレクターで再生速度が変わった。                                                                                                                                                                                                |
| `fullscreen`       | `boolean`                | 全画面に入った（`true`）／出た（`false`）。                                                                                                                                                                                         |
| `pictureinpicture` | `boolean`                | ピクチャーインピクチャーに入った（`true`）／出た（`false`）。`togglePip()` によるものでも、ブラウザー自身の PiP ウィンドウの操作によるものでも発火します。                                                                          |
| `subtitlechange`   | `string`                 | CC ピッカーか `setSubtitleLanguage()` で字幕の言語が変わった。値は `srclang` か `'off'`。                                                                                                                                           |
| `resume`           | `number`                 | 読み込み時に保存された位置が黙って復元された（`remember-position`）。`data` は復元された時刻（秒）。                                                                                                                                |
| `levelsready`      | `{ levels }`             | ストリーミングエンジンのマニフェストが解析され、画質の段階が使えるようになった。                                                                                                                                                    |
| `sourceerror`      | `{ fatal, detail }`      | ストリーミングエンジンのエラーが起きた（生の `src` にフォールバックします。**致命的な**エラーは、`disable-error-modal` がなければエラー＋再試行のダイアログも開きます。致命的でないものはエンジン自身の内部回復なので開きません）。 |
| `qualityswitch`    | `{ level }`              | 利用者が画質セレクターから画質を選んだ。                                                                                                                                                                                            |
| `gestureseek`      | `{ direction, seconds }` | ダブルタップのシークジェスチャーが発火した（`direction` は `'forward'` / `'backward'`）。                                                                                                                                           |

## スロット

このプレーヤーはスロットの内容を受け取りません。コンストラクターの中と、ソースを読み込むたびに、自分のライト DOM の子（`this.innerHTML = ''`）を空にします。独自のオーバーレイを重ねたい場合は、代わりに `sheet` 属性でプレーヤーにスタイルを当ててください。

## スタイル

`<r-player>` は自前の **CSS カスタムプロパティを 136 個**と、テーマから読み取るセマンティックトークンを公開しています。継承が届く場所ならどこでも指定できます（`:root`、ラッパー、要素そのものなど）。

```css
r-player {
  --ran-player-tip-background: var(--ran-color-bg-subtle);
}
```

全一覧は[スタイルトークン](/ja/src/ranui/style-tokens#player)にあります。どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)を参照してください。

## ベストプラクティス

- **寸法**：ホストは `display: block` で、内在的な大きさを持ちません。必ず幅と高さを明示してください。さもないと動画がつぶれます。
- **ストリーミングエンジン**：`.m3u8`（HLS）、`.mpd`（DASH）、`.flv` / `.ts`（`mpegts.js` 経由の FLV / MPEG-TS）のソースは、それぞれのエンジンを自動で遅延読み込みします。設定は要りません。URL の拡張子から判別できないとき（拡張子のない URL や署名つきの CDN の URL）は、判別に頼らず `format` 属性を明示してください（例：`format="dash"`）。WebRTC（`format="webrtc"`）は常に明示です。WHEP のエンドポイントには判別する材料がありません。
- **リスナーはひとつ**：たくさんのイベントハンドラーを付けようとするより、`change` のリスナーをひとつ置いて `switch (detail.type)` するほうが良い書き方です。すべての状態が `change` を通ります。
- **音量の単位**：`volume`（属性）、`setVolume()` / `getVolume()`、`volume` の変化の値、いずれも `0`〜`100` の単一の目盛りです。`0`〜`1` なのは下敷きのネイティブの `<video>.volume` だけで、プレーヤーがその境目で変換します。
- **ピクチャーインピクチャーは段階的強化です**：ブラウザーが対応していないとき、ボタンは無効化ではなく非表示になります。DOM に常にあることを前提にしないでください。
- **見た目の調整**：Shadow DOM に CSS を注入するには `sheet` 属性を使ってください。プレーヤー自身には公開された `::part()` の取っ手はありません。

## ロードマップ

`<r-player>` は活発に開発中です。次に何を予定しているかは、リポジトリの [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md) を参照してください。
