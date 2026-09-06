# AudioRecorder

マイクの音声を `Blob` に録ります。`MediaRecorder` をただ包むのではなく、実在するブラウザーの不具合を回避します。

Chrome（および Chromium 系のブラウザー）は、`MediaRecorder` から書き出す WEBM ファイルに再生時間のメタデータを入れません。ファイルは再生できますが、blob を丸ごと一度デコードするまで、シークも再生時間の表示もできません。`AudioRecorder` はマイクを要求して録音し、`stop()` のときに WEBM コンテナの再生時間の欄をその場で書き直してから `Blob` を返すので、録音したものは最初から普通の音声ファイルとしてふるまいます。

音声を録ることと、話し言葉を認識することは別の話です。ほしいのが音声ファイルではなく書き起こしなら、[`createSpeechRecognizer`](./speech.md) を見てください。

## 使い方

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // その場でマイクの利用許可を求めます

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

生成された時点で `getUserMedia({ audio: true })` を要求し、許可が下りると録音を始めます。「準備」という別の手順はありません。生成すること、それ **自体** が許可を求める合図です。

### `start()`

`pause()` していたなら録音を再開します。土台の `MediaRecorder` を返しますが、マイクのストリームがまだ整っていなければ `undefined` を返します。

### `pause()`

録音中なら一時停止します。土台の `MediaRecorder` を返しますが、なければ `undefined` を返します。

### `stop()`

録音を止め、録れた `Blob` を同期的に返します。ただしコンテナの修正（`fixDuration`）が実際に走る前の時点です。再生時間を書き直すにはバッファ全体が要り、それが揃うのは土台の `MediaRecorder` の `stop` イベントが発火したあとだからです。実際に問題になるのは、`recorder.stop()` の戻り値をまさにその瞬間に読むか、少しあとで読むかという違いだけです。次のマイクロタスクを待つか、`dataavailable` と `stop` の流れが落ち着いてから `recorder.blob` を読むのが安全な順序です。

## 補足

1. **レコーダーひとつに、ストリームひとつ。** `destroy()` のような後片づけはなく、いったん許可が下りればマイクのトラックはコンポーネントが生きているあいだ開いたままです。録音のたびに `AudioRecorder` を作り直さないでください。ひとつを使い回して `start()` と `stop()` を呼びます。
2. **許可を求めるのは生成時であって、`start()` のときではありません。** ブラウザーの許可の求めを、利用者が実際に録音を押すまで遅らせたいなら、`start()` の呼び出しだけでなく、`AudioRecorder` の生成そのものを遅らせてください。
3. **再生時間の修正が触るのは `audio/webm` だけです。** ブラウザーが選びうるほかの MIME タイプ（`audio/mp4`、`audio/ogg`、`audio/wav`、`audio/aac`）はそのまま返します。
4. `getUserMedia` の途中で起きたエラー（許可の拒否、マイクがない）は、投げたりコールバックで知らせたりせず、コンソールに出すだけです。拒否されたことをこのクラスに知らせてもらうのではなく、自分の UI で `MediaDevices` の求めが実際に出るかを確かめてください。
