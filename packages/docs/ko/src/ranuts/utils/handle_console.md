# 계측용 훅

`console`, `fetch`, `XMLHttpRequest`, 클릭, 잡히지 않은 오류에 끼어듭니다. 모니터링 백엔드, 디버그 오버레이, 테스트에 쓸 수 있습니다.

**모두 정리용 함수를 돌려줍니다. 받아 두었다가 반드시 부르세요.** 전역에 손을 대 놓고 되돌릴 길이 없으면 테스트가 제 뒷정리를 못 하고, 핫 리로드마다 이미 손댄 전역에 또 손을 대게 되어 결국 한 번의 호출이 열 겹 남짓 감싸개를 거치고 이벤트마다 N번씩 보고됩니다.

## API

| Function                     | 손대는 대상                          | 반환값        |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert` | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                       | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`      | `restore`     |
| `handleError(hook)`          | `error`와 `unhandledrejection`       | `unsubscribe` |
| `handleClick(hook)`          | document의 클릭(캡처 단계)           | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | 아무 객체의 아무 속성                | `restore`     |

`handleFetchHook`과 `handleXhrHook`은 `{ requestHook, responseHook, errorHook }`을 받습니다.

## 예시

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// 정리할 때(HMR, 경로 전환, 테스트 뒷정리)
teardown.forEach((off) => off());
```

## 참고

1. **본래 동작은 그대로 둡니다.** 응답은 그냥 지나가고, 오류는 다시 던져지며, 콘솔 출력도 여전히 찍힙니다.
2. **`replaceOld`의 restore는 제가 댄 손질만 되돌립니다.** 그 뒤에 다른 층이 위에 손을 댔다면, 생각 없이 되돌릴 경우 그 층을 소리 없이 걷어내게 되므로 대신 되돌리기를 삼갑니다.
3. **`handleXhrHook`은 프로토타입에 손을 댑니다.** 그래서 모든 인스턴스에 걸립니다. 리스너는 `{ once: true }`로 등록하니 XHR 객체를 다시 써도 리스너가 쌓이지 않습니다.
4. **콘솔 출력을 콘솔에 찍는 백엔드로 보고하지 마세요.** 그 훅은 자신이 만들어 낸 바로 그 호출에서 발화합니다. (`Monitor`의 `console` 채널이 기본으로 꺼져 있는 까닭입니다.)

::: warning 0.3에서 달라졌습니다
전에는 모두 `void`만 돌려주어 걷어낼 길이 없었습니다. 이제는 정리용 함수를 돌려줍니다. 이미 쓰던 코드는 그대로 돌아가고, 그 함수를 쓰기 시작하기만 하면 됩니다.
:::
