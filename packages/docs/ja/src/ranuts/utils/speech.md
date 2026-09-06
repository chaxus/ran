# createSpeechRecognizer / isSpeechRecognitionSupported

Web Speech API の `SpeechRecognition` を包んだものです。音声の **バイト列** を録る [`AudioRecorder`](./audio_recorder.md) と対になるもので、こちらは話し言葉を **文字** に変えるよう、その環境に頼みます。

素の API は直に触るより、一度包んでおく値打ちがあります。WebKit ではいまだに接頭辞が付いていますし（`webkitSpeechRecognition`）、`lib.dom.d.ts` には載っておらず、しかも何事でもない出来事（黙っている間、プログラムからの `stop()`）を、マイクを拒まれたときと同じエラーの通り道で知らせてくるからです。

## 使い方

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // 一度きりではなく、収録のたびに読み直します
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('マイクの利用を断られました');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // マイクのボタンをはじめから隠します
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

`boolean` を返します。確かめるのは呼び出しのときで、モジュールの読み込み時に覚えておくわけではありません。ですからサーバー側の描画のあいだにこのモジュールを読み込んでおき、ページが水和してから確かめても大丈夫です。

### `createSpeechRecognizer(options?)`

使い回せる `SpeechRecognizer` を組み立てます。`start()` は毎回、素の認識のインスタンスを新しく作るので、**関数** として渡したオプション（とりわけ `lang`）は、作った時点で固まるのではなく、収録が始まるたびに読み直されます。

#### パラメーター（`SpeechRecognizerOptions`）

| オプション       | 説明                                                                              | 型                                               | 既定値 |
| ---------------- | --------------------------------------------------------------------------------- | ------------------------------------------------ | ------ |
| `lang`           | BCP 47 のタグ（`'en-US'`、`'zh-CN'`）、または収録のたびに読まれる関数             | `string \| (() => string)`                       | `''`   |
| `continuous`     | 間が空いても最初のところで止めず、聞き続けます                                    | `boolean`                                        | `true` |
| `interimResults` | 話している最中の、途中までの結果も流します                                        | `boolean`                                        | `true` |
| `onResult`       | **ここまでの収録ぜんぶ** の書き起こしと、それが最終かどうかを受け取って呼ばれます | `(transcript: string, isFinal: boolean) => void` | `-`    |
| `onError`        | 種類分けされたエラーを受け取って呼ばれます                                        | `(error: SpeechError) => void`                   | `-`    |
| `onStart`        | 収録が始まったときに発火します                                                    | `() => void`                                     | `-`    |
| `onEnd`          | 収録ごとに一度、どんな終わり方をしても発火します（止めた、時間切れ、エラー）      | `() => void`                                     | `-`    |

#### `SpeechRecognizer`

| メンバー    | 説明                                                                                   | 型                    |
| ----------- | -------------------------------------------------------------------------------------- | --------------------- |
| `supported` | その環境に音声認識がなければ `false`。そのときはどのメソッドも何もしません             | `boolean`（ゲッター） |
| `active`    | いま収録が走っているかどうか                                                           | `boolean`（ゲッター） |
| `start()`   | 収録を始めます。すでに走っていれば何もしません                                         | `() => void`          |
| `stop()`    | いまの収録を終えます。すでに認識できたぶんは残り、続いて `onEnd` が来ます              | `() => void`          |
| `abort()`   | いまの収録を終え、まだ確定していない結果を捨てます                                     | `() => void`          |
| `toggle()`  | 止まっていれば始め、走っていれば止めます。マイクのボタンひとつに求められるふるまいです | `() => void`          |

#### `SpeechError`

| フィールド | 説明                                                                                                                                                               | 型                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `kind`     | `'denied'`（マイクを拒まれた。伝える値打ちがあります）、`'noSpeech'` / `'aborted'`（よくあることで、たいてい見せる必要はありません）、`'failed'`（それ以外すべて） | `SpeechErrorKind` |
| `detail`   | その環境のイベントが持っていた、生の `error` の文字列                                                                                                              | `string`          |

## 補足

1. **どこでも使えるわけではありません。** Firefox には `SpeechRecognition` の実装がそもそもありません。コンストラクターがあるものと決めてかからず、マイクのボタンを見せる前に必ず `recognizer.supported`（あるいは `isSpeechRecognitionSupported()`）を確かめてください。
2. **`supported` と `active` はゲッターで、触れるたびに評価し直されます。** 作った時点の値を抱え込むわけではありません。これは `createSpeechRecognizer()` が `window` やベンダー接頭辞つきのコンストラクターより先に走ったとき（SSR や、水和より前のモジュールの最上位での呼び出し）に効いてきます。認識器は、本物の API が現れた時点でそれを拾えるので、`supported === false` と言い続けたまま動けなくなることがありません。
3. **`onResult` の書き起こしは積み上がったものです。** 差分ではありません。ここまでの収録の全文であり、途中の結果が固まるにつれて書き直されます。自分でつなぎ合わせないでください。
4. 素の認識器を作ったり、その `start()` を呼んだりすると、同期的に例外が飛ぶことがあります（Permissions-Policy による制限や、収録がすでに走っているときに Chrome が出す `InvalidStateError` など）。`createSpeechRecognizer` はこれを捕まえ、外へ漏らさずに `onError` と `onEnd` で知らせます。
