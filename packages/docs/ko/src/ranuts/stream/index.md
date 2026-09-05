# ranuts/stream — 모델 응답 스트리밍

Server-Sent Events 파싱, 스트리밍되는 모델 응답 하나를 가리키는 공급자 중립 어휘, 그리고 그 어휘를 그릴 수 있는 블록으로 접는 일입니다.

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**자체 진입점입니다.** 여기 있는 것은 DOM을 전혀 건드리지 않으므로, 응답을 테스트 안에서도 서버에서도 접을 수 있습니다. `ranuts/utils`에서 import하면 DOM을 향한 모듈까지 끌려옵니다.

**여기에 벤더는 살지 않습니다.** 주류 채팅 완성 API는 모두 같은 네 가지(어시스턴트의 텍스트, 따로 과금되는 추론 텍스트, 도구 호출, 토큰 수)를 흘려보내지만, 이름 붙이는 법과 뒤섞는 법이 저마다 다릅니다. 어떤 공급자의 이벤트를 `StreamChunk`로 옮기는 것만이 벤더에 매인 단계이고, 그것은 여러분 몫으로 남습니다. 전선 형식 하나를 구워 넣으면 나머지 두 층은 다른 누구에게도 쓸모없어집니다.

## 세 개의 층

| 층                          | 하는 일                                       |
| --------------------------- | --------------------------------------------- |
| `parseEventStream(source)`  | 바이트 → `ServerSentEvent`. 전송만 다룹니다.  |
| `StreamChunk`               | 응답 하나가 흘려보내는 어휘.                  |
| `createStreamAccumulator()` | 조각들을 뷰가 그릴 수 있는 블록으로 접습니다. |

`mapEventStream(source, map)`은 앞의 둘을 잇습니다. 이벤트를 훑으며, 여러분의 매핑이 각각에 대해 0개 이상의 조각을 돌려주게 합니다. keep-alive나 `[DONE]` 파수꾼을 버리려면 `[]`를 돌려주세요.

## 어휘

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index`가 뒤섞여 오는 델타를 엮어 줍니다.** 추론과 텍스트가 번갈아 도착하고 도구 호출이 여럿 동시에 열리므로, 도착 순서는 묶음이 되지 못합니다.
- **`block-end`는 다 짜인 블록을 싣고 오며**, 델타가 만든 것을 이깁니다. 완성된 블록만 원하는 쪽은 모든 델타를 무시해도 됩니다.
- **도구의 인자는 날 JSON 텍스트 그대로 남습니다.** JSON 문서의 절반은 값이 아닙니다. `arguments`는 `finish` 뒤에 한 번만 파싱하세요. 흐름 도중에 `argumentsDelta`를 파싱하는 것이야말로 스트리밍 도구 호출이 대개 깨지는 지점입니다.
- **`block-start`는 선택입니다.** 여러 공급자가 첫 델타로 블록을 열기 때문에, 누산기도 필요할 때 하나를 엽니다. 여러분의 매핑에서도 이것을 필수로 두지 마세요.
- **`finish`가 끝을 알립니다.** `usage`는 그보다 먼저 오고, 그 뒤에는 아무것도 오지 않습니다.

## 응답 접기

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // 인자는 아직 텍스트입니다 — 파싱은 여기서
```

`snapshot()`은 불변입니다. 흐름 도중에 찍은 스냅숏은 그때의 값을 지키므로, 뷰가 하나를 쥐고 있어도 나중의 `push`가 그 발밑을 바꾸지 않습니다. `text()`와 `reasoning()`은 자기 블록들을 인덱스 순으로 잇고, `reset()`은 다음 응답을 위해 인스턴스를 비웁니다.

## SSE 파서가 감당하는 것

프레이밍 규칙은 몇 개 되지 않는데도 온전히 구현되는 일이 거의 없습니다. `parseEventStream`은 이런 것들을 다룹니다.

- **어디에서든** 생기는 조각의 경계. 멀티바이트 문자 한가운데나 `\r\n`의 두 반쪽 사이도 포함합니다
- 되풀이된 `data:` 필드를 `\n`으로 잇기
- 콜론 뒤의 공백을 정확히 하나만 걷어내기
- `:`로 시작하는 주석 줄. 서버가 연결을 따뜻하게 유지하는 방법입니다
- 앞머리의 BOM
- 서버가 빈 줄로 끝맺지 않은 마지막 블록
- `Symbol.asyncIterator`가 없는 `ReadableStream`

`ReadableStream`뿐 아니라 어떤 `AsyncIterable<Uint8Array>`도 받습니다. 그래서 테스트가 네트워크 없이 바이트 조각을 건넬 수 있습니다.

## 실제로 도는 매핑

이 저장소의 `packages/im`이 동작하는 소비자입니다. OpenAI 호환 SSE 라우트, `StreamChunk`로의 매핑, 그리고 델타를 스스로 잇는 대신 스냅숏을 쥐는 뷰가 있습니다. 왕복 테스트는 진짜 서버의 바이트를 여러 조각 크기로 진짜 클라이언트에 흘려보내므로, 두 반쪽이 서로 멀어질 수 없습니다.

## 함께 보기

- [ranuts/conversation](../conversation/): 나온 이벤트를 그릴 수 있는 노드로 투영합니다
- [`<r-conversation>`](../../ranui/conversation/): 그 노드를 그립니다
