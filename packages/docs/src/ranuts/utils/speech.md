# createSpeechRecognizer / isSpeechRecognitionSupported

A wrapper around the Web Speech API's `SpeechRecognition`, the counterpart to
[`AudioRecorder`](./audio_recorder.md), which captures audio **bytes**; this one asks the
platform to turn speech into **text**.

The native API is worth wrapping once rather than touching directly: it's still prefixed
on WebKit (`webkitSpeechRecognition`), it's absent from `lib.dom.d.ts`, and it reports
routine non-events (a silent pause, a programmatic `stop()`) through the same error
channel as a denied microphone.

## Usage

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // read fresh on every capture, not just once
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('Microphone access was refused');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // hide the mic button up front
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

Returns `boolean`. Checked at call time (not cached at module load), so it's safe to
import this module during server-side rendering and call the check once the page hydrates.

### `createSpeechRecognizer(options?)`

Builds a reusable `SpeechRecognizer`. `start()` constructs a fresh native recognition
instance every time, so any option passed as a **function** (`lang`, notably) is re-read
at the start of each capture rather than frozen at creation time.

#### Parameters (`SpeechRecognizerOptions`)

| Option           | Description                                                                        | Type                                             | Default |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| `lang`           | BCP 47 tag (`'en-US'`, `'zh-CN'`), or a function read at the start of each capture | `string \| (() => string)`                       | `''`    |
| `continuous`     | Keep listening across pauses instead of stopping at the first one                  | `boolean`                                        | `true`  |
| `interimResults` | Emit partial results as the speaker talks                                          | `boolean`                                        | `true`  |
| `onResult`       | Called with the transcript of the **whole capture so far**, and whether it's final | `(transcript: string, isFinal: boolean) => void` | `-`     |
| `onError`        | Called with a classified error                                                     | `(error: SpeechError) => void`                   | `-`     |
| `onStart`        | Fires when a capture begins                                                        | `() => void`                                     | `-`     |
| `onEnd`          | Fires once per capture, however it ended (stopped, timed out, or errored)          | `() => void`                                     | `-`     |

#### `SpeechRecognizer`

| Member      | Description                                                                       | Type               |
| ----------- | --------------------------------------------------------------------------------- | ------------------ |
| `supported` | `false` when the platform has no speech recognition; every method is then a no-op | `boolean` (getter) |
| `active`    | Whether a capture is currently running                                            | `boolean` (getter) |
| `start()`   | Begin a capture. Ignored if one is already running                                | `() => void`       |
| `stop()`    | End the current capture; results already recognized are kept, `onEnd` follows     | `() => void`       |
| `abort()`   | End the current capture and discard pending results                               | `() => void`       |
| `toggle()`  | Start if idle, stop if running: what a single microphone button wants             | `() => void`       |

#### `SpeechError`

| Field    | Description                                                                                                                              | Type              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `kind`   | `'denied'` (mic refused, worth surfacing), `'noSpeech'` / `'aborted'` (routine, usually not worth showing), `'failed'` (everything else) | `SpeechErrorKind` |
| `detail` | The raw `error` string from the platform event                                                                                           | `string`          |

## Notes

1. **Not supported everywhere.** Firefox has no `SpeechRecognition` implementation at all;
   always check `recognizer.supported` (or `isSpeechRecognitionSupported()`) before showing
   a microphone affordance rather than assuming the constructor exists.
2. **`supported` and `active` are getters, re-evaluated on every access**, not captured
   once at creation. That matters if `createSpeechRecognizer()` runs before `window` or the
   vendor-prefixed constructor is available (SSR, an early module-scope call before
   hydration): the recognizer picks up the real API once it appears, rather than being
   permanently stuck reporting `supported === false`.
3. **`onResult`'s transcript is cumulative**, not incremental: it's the full text of the
   capture so far, revised as interim results firm up. Don't concatenate results yourself.
4. Instantiating the native recognizer or calling its `start()` can throw synchronously
   (e.g. a Permissions-Policy restriction, or Chrome's `InvalidStateError` when a capture is
   already in flight); `createSpeechRecognizer` catches this and reports it through
   `onError`/`onEnd` rather than letting it escape.
