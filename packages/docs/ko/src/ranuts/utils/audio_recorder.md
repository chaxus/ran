# AudioRecorder

마이크 소리를 `Blob`으로 녹음합니다. `MediaRecorder`를 그저 감싸는 데 그치지 않고, 실제로 있는 브라우저 결함을 에둘러 갑니다.

크롬(그리고 크로미엄 계열 브라우저)은 `MediaRecorder`가 내놓는 WEBM 파일에 재생 길이 메타데이터를 넣지 않습니다. 파일은 재생되지만, blob 전체를 한 번 디코딩하기 전까지는 구간 이동도 길이 표시도 되지 않습니다. `AudioRecorder`는 마이크를 요청해 녹음하고, `stop()` 때 WEBM 컨테이너의 길이 필드를 그 자리에서 고친 뒤 `Blob`을 돌려줍니다. 그래서 녹음물이 처음부터 평범한 오디오 파일처럼 움직입니다.

소리를 녹음하는 일과 말을 알아듣는 일은 별개입니다. 정말 필요한 것이 오디오 파일이 아니라 받아쓴 글이라면 [`createSpeechRecognizer`](./speech.md)를 보세요.

## 사용법

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // 곧바로 마이크 사용 허가를 구합니다

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

만들어지자마자 `getUserMedia({ audio: true })`를 요청하고, 허가가 나면 녹음을 시작합니다. "준비"라는 별도의 단계는 없습니다. 만드는 일 그 **자체**가 허가를 구하는 일입니다.

### `start()`

`pause()` 상태였다면 녹음을 다시 시작합니다. 바탕의 `MediaRecorder`를 돌려주지만, 마이크 스트림이 아직 준비되지 않았다면 `undefined`를 돌려줍니다.

### `pause()`

녹음 중이면 잠시 멈춥니다. 바탕의 `MediaRecorder`를 돌려주고, 없으면 `undefined`를 돌려줍니다.

### `stop()`

녹음을 멈추고 녹음된 `Blob`을 동기로 돌려줍니다. 다만 컨테이너 손질(`fixDuration`)이 실제로 돌기 전 시점입니다. 길이를 고치려면 버퍼 전체가 있어야 하는데, 그것은 바탕의 `MediaRecorder`가 `stop` 이벤트를 낸 뒤에야 갖춰집니다. 실제로 문제가 되는 것은 `recorder.stop()`의 반환값을 바로 그 순간에 읽느냐 조금 뒤에 읽느냐뿐입니다. 다음 마이크로태스크를 기다리거나 `dataavailable`과 `stop`의 흐름이 가라앉은 뒤 `recorder.blob`을 읽는 것이 안전한 순서입니다.

## 참고

1. **레코더 하나에 스트림 하나.** `destroy()` 같은 정리 수단은 없고, 허가가 난 뒤에는 마이크 트랙이 컴포넌트가 사는 동안 열린 채로 있습니다. 녹음할 때마다 `AudioRecorder`를 새로 만들지 마세요. 하나를 두고 `start()`와 `stop()`을 부르면 됩니다.
2. **허가는 만들 때 구하지, `start()` 때 구하지 않습니다.** 브라우저의 허가 요청을 사용자가 실제로 녹음을 누를 때까지 미루고 싶다면, `start()` 호출만이 아니라 `AudioRecorder`를 만드는 일 자체를 미루세요.
3. **길이 손질은 `audio/webm`에만 손을 댑니다.** 브라우저가 고를 수 있는 다른 MIME 타입(`audio/mp4`, `audio/ogg`, `audio/wav`, `audio/aac`)은 그대로 돌려줍니다.
4. `getUserMedia` 도중의 오류(허가 거부, 마이크 없음)는 던지거나 콜백으로 알리지 않고 콘솔에 적습니다. 거부를 이 클래스가 알려 주리라 믿지 말고, 여러분의 UI에서 `MediaDevices` 요청이 실제로 뜨는지 확인하세요.
