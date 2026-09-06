# createSpeechRecognizer / isSpeechRecognitionSupported

Web Speech API의 `SpeechRecognition`을 감싼 것입니다. 소리의 **바이트**를 담는 [`AudioRecorder`](./audio_recorder.md)와 짝을 이루며, 이쪽은 플랫폼에 말을 **글자**로 바꿔 달라고 청합니다.

맨 API는 직접 건드리기보다 한 번 감싸 둘 값어치가 있습니다. 웹킷에서는 아직 접두사가 붙어 있고(`webkitSpeechRecognition`), `lib.dom.d.ts`에도 없으며, 별일 아닌 것들(말이 없는 사이, 코드가 부른 `stop()`)을 마이크가 거부당했을 때와 같은 오류 통로로 알려 오기 때문입니다.

## 사용법

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // 한 번이 아니라 녹음할 때마다 새로 읽습니다
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('마이크 사용이 거부되었습니다');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // 마이크 버튼을 아예 감춥니다
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

`boolean`을 돌려줍니다. 확인은 부를 때 하며 모듈을 불러올 때 갈무리해 두지 않으므로, 서버에서 그리는 동안 이 모듈을 가져다 두었다가 쪽이 하이드레이션된 뒤에 확인해도 안전합니다.

### `createSpeechRecognizer(options?)`

다시 쓸 수 있는 `SpeechRecognizer`를 만듭니다. `start()`는 그때마다 맨 인식기 인스턴스를 새로 만들므로, **함수**로 넘긴 옵션(특히 `lang`)은 만들 때 굳는 것이 아니라 녹음이 시작될 때마다 새로 읽힙니다.

#### 매개변수(`SpeechRecognizerOptions`)

| 옵션             | 설명                                                                     | 타입                                             | 기본값 |
| ---------------- | ------------------------------------------------------------------------ | ------------------------------------------------ | ------ |
| `lang`           | BCP 47 태그(`'en-US'`, `'zh-CN'`), 또는 녹음이 시작될 때마다 읽히는 함수 | `string \| (() => string)`                       | `''`   |
| `continuous`     | 말이 끊겨도 처음에서 멈추지 않고 계속 듣습니다                           | `boolean`                                        | `true` |
| `interimResults` | 말하는 도중의 중간 결과도 내보냅니다                                     | `boolean`                                        | `true` |
| `onResult`       | **지금까지의 녹음 전체**를 받아쓴 글과, 그것이 최종인지를 받아 불립니다  | `(transcript: string, isFinal: boolean) => void` | `-`    |
| `onError`        | 갈래가 나뉜 오류를 받아 불립니다                                         | `(error: SpeechError) => void`                   | `-`    |
| `onStart`        | 녹음이 시작될 때 발화합니다                                              | `() => void`                                     | `-`    |
| `onEnd`          | 녹음마다 한 번, 어떻게 끝났든 발화합니다(멈춤, 시간 초과, 오류)          | `() => void`                                     | `-`    |

#### `SpeechRecognizer`

| 멤버        | 설명                                                                                    | 타입            |
| ----------- | --------------------------------------------------------------------------------------- | --------------- |
| `supported` | 플랫폼에 음성 인식이 없으면 `false`. 그때는 어느 메서드도 아무 일을 하지 않습니다       | `boolean`(게터) |
| `active`    | 지금 녹음이 돌고 있는지                                                                 | `boolean`(게터) |
| `start()`   | 녹음을 시작합니다. 이미 돌고 있으면 무시합니다                                          | `() => void`    |
| `stop()`    | 지금 녹음을 끝냅니다. 이미 알아들은 것은 남고, 이어서 `onEnd`가 옵니다                  | `() => void`    |
| `abort()`   | 지금 녹음을 끝내고 아직 확정되지 않은 결과를 버립니다                                   | `() => void`    |
| `toggle()`  | 멎어 있으면 시작하고 돌고 있으면 멈춥니다. 마이크 버튼 하나가 바라는 바로 그 동작입니다 | `() => void`    |

#### `SpeechError`

| 필드     | 설명                                                                                                                           | 타입              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `kind`   | `'denied'`(마이크가 거부됨, 알릴 만함), `'noSpeech'` / `'aborted'`(흔한 일이라 대개 보일 것 없음), `'failed'`(그 밖의 모든 것) | `SpeechErrorKind` |
| `detail` | 플랫폼 이벤트가 지녔던 날것의 `error` 문자열                                                                                   | `string`          |

## 참고

1. **어디서나 되는 것은 아닙니다.** 파이어폭스에는 `SpeechRecognition` 구현이 아예 없습니다. 생성자가 있으려니 여기지 말고, 마이크 단추를 보이기 전에 늘 `recognizer.supported`(또는 `isSpeechRecognitionSupported()`)를 확인하세요.
2. **`supported`와 `active`는 게터라 손댈 때마다 다시 따집니다.** 만들 때의 값을 붙들어 두지 않습니다. `createSpeechRecognizer()`가 `window`나 벤더 접두사 붙은 생성자보다 먼저 도는 경우(SSR, 하이드레이션 전 모듈 최상위에서의 이른 호출)에 이 점이 중요합니다. 인식기는 진짜 API가 나타나는 순간 그것을 집어 들 뿐, `supported === false`라고 말한 채 영영 굳지 않습니다.
3. **`onResult`가 주는 받아쓴 글은 쌓인 것입니다.** 증분이 아닙니다. 지금까지의 녹음 전문이며, 중간 결과가 굳어 가면서 고쳐집니다. 직접 이어 붙이지 마세요.
4. 맨 인식기를 만들거나 그 `start()`를 부르면 동기로 예외가 날 수 있습니다(Permissions-Policy 제약이나, 이미 녹음이 돌고 있을 때 크롬이 내는 `InvalidStateError` 따위). `createSpeechRecognizer`는 이것을 잡아 밖으로 내보내지 않고 `onError`와 `onEnd`로 알립니다.
