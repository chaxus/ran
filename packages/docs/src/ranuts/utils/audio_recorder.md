# AudioRecorder

Record microphone audio to a `Blob`, working around a real browser bug rather than
just wrapping `MediaRecorder`.

Chrome (and Chromium-based browsers) writes WEBM files from `MediaRecorder` without
duration metadata — the file plays, but seeking and showing a duration fail until the
whole blob has been decoded once. `AudioRecorder` requests the microphone, records, and
on `stop()` patches the WEBM container's duration field in place before handing back the
`Blob`, so the recording behaves like a normal audio file immediately.

Recording bytes and recognizing speech are separate concerns — see
[`createSpeechRecognizer`](./speech.md) if what you actually want is a transcript, not an
audio file.

## Usage

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // requests microphone access immediately

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

Requests `getUserMedia({ audio: true })` as soon as it's constructed, and begins
recording once permission is granted. There is no separate "arm" step — construction
**is** the permission prompt.

### `start()`

Resumes recording if it was `pause()`d. Returns the underlying `MediaRecorder`, or
`undefined` before the microphone stream is ready.

### `pause()`

Pauses an active recording. Returns the underlying `MediaRecorder`, or `undefined`.

### `stop()`

Stops recording and returns the recorded `Blob` — synchronously, before the container
fix (`fixDuration`) has actually run, since patching the duration itself needs the full
buffer to be read from the underlying `MediaRecorder`'s `stop` event first. In practice
this only matters if you read `recorder.stop()`'s return value at the exact instant it
resolves versus a moment later; awaiting the next microtask, or reading `recorder.blob`
after the `dataavailable`/`stop` sequence settles, is the safe order.

## Notes

1. **One recorder, one stream.** There's no `destroy()`/teardown — the microphone track
   stays open for the component's lifetime once granted. Don't construct a new
   `AudioRecorder` per recording; reuse one and call `start()`/`stop()`.
2. **Permission is requested at construction, not at `start()`.** If you want to defer the
   browser's permission prompt until the user actually clicks record, defer constructing
   `AudioRecorder` itself, not just the call to `start()`.
3. **The duration fix only touches `audio/webm`.** Other MIME types the browser might pick
   (`audio/mp4`, `audio/ogg`, `audio/wav`, `audio/aac`) are returned as-is.
4. Errors during `getUserMedia` (denied permission, no microphone) are logged to the
   console rather than thrown or surfaced through a callback — check for a real
   `MediaDevices` prompt in your own UI rather than relying on this class to report denial.
