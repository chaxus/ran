# ranuts/conversation — 이벤트 로그에서 그릴 수 있는 노드로

덧붙이기만 하는 이벤트 로그를, 대화 뷰가 그리는 노드로 투영합니다.

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**자체 진입점**이고 DOM을 쓰지 않습니다. 그래서 투영 자체를 시험할 수 있고, 서버에서도 그릴 수 있습니다. DOM 쪽에서 이것을 쓰는 것은 [`<r-conversation>`](../../ranui/conversation/)입니다.

## 이벤트 종류로 분기하지 않는 이유

대화를 그리는 흔한 방법은, 이벤트 종류로 분기해 컴포넌트 트리를 고치는 뷰입니다. 그러면 순서와 정체성, 부분 갱신의 맞춤이 **뷰 안으로** 들어옵니다. 그래서 새로운 종류의 내용(도구 호출, 승인 요청, 상태 줄)이 생길 때마다 손으로 실을 꿰어야 하고, 뷰에는 종류만큼 분기가 늘어납니다.

여기서는 종류마다 **따로 등록된 상태 기계**입니다. 정의는 어떤 이벤트가 자기 것인지 말하고, 그것을 자기 상태로 접어 넣으며, 다른 종류가 있다는 사실을 끝내 모릅니다. 종류를 더하는 일은 정의를 더하는 일이지, 렌더러를 고치는 일이 아닙니다.

## 정의 하나

```ts
const message = {
  kind: 'message',
  // 어떤 이벤트가 내 것이고, 어느 노드에 속하는가.
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // 그것을 내 상태로 접어 넣는다.
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // 구독자가 결과를 얼마나 자주 보아야 하는가.
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions`는 `unknown` 상태 위에 선언되어 있어서, 상태 타입이 서로 다른 정의들이 호출부에서 캐스팅 없이 나란히 등록되면서도, 각자는 쓰인 자리에서 온전히 타입이 붙은 채로 남습니다.

## 의미론

- **모든 정의가 모든 이벤트를 봅니다.** 엔진은 처음 손을 든 곳에서 멈추지 않으므로, 로그의 이벤트 하나가 두 노드를 움직일 수도 있습니다.
- **순서는 `start`에서 고정됩니다.** 계속 갱신되는 노드는 열린 자리에 머물러 있으므로, 스트리밍 중인 메시지가 델타마다 목록 끝으로 튀지 않습니다.
- **열린 노드가 없는 id에 온 `update`는 버려집니다.** 시작 이벤트가 페이지로 잘린 창 밖에 있었다면 그것이 맞는 결과입니다. 부분 갱신만으로 노드를 지으면 존재한 적 없는 것을 그리게 됩니다.
- **`start`가 되풀이되면 그 자리에서 노드를 다시 엽니다.** 정의가 이것을 새 노드라고 판단했으니, 이전 상태는 합쳐지는 대신 버려지고 위치는 그대로 유지됩니다.
- **`reader.previous(kind)`는 뒤쪽만 봅니다.** 자기 뒤에 시작된 노드까지 볼 수 있는 정의는 언제 돌았는지에 따라 답이 달라지고, 같은 로그를 다시 재생해도 같은 뷰가 나오지 않습니다.

## 알림 주기

`publication`은 구독자가 갱신을 얼마나 자주 보는지를 정하며, 성능을 위해 손댈 설정은 이것뿐입니다.

| 주기              | 쓰임새                                                                         |
| ----------------- | ------------------------------------------------------------------------------ |
| `animation-frame` | 토큰 단위의 델타. 두 번의 그리기 사이에 온 델타는 알림 하나로 합쳐집니다       |
| `immediate`       | 낱낱의 사실. 도구의 결과나 승인처럼. 한 프레임을 기다리는 것은 지연만 더합니다 |
| `none`            | 어차피 나중 알림이 실어 갈 상태. 뷰를 깨우지 않고 기록만 됩니다                |

**주기는 올라가기만 하고 느슨해지지 않습니다.** 프레임을 기다리는 동안 `immediate` 알림이 오면 지금 발동하고 그 프레임을 취소합니다. 두 번 알리지 않습니다. `publication`을 빼면 `immediate`입니다.

`scheduler` 옵션은 프레임 스케줄링을 갈아 끼우며, 그리기 없이 주기를 시험하는 방법입니다. 기본값은 브라우저에서는 `requestAnimationFrame`, 그 밖에서는 마이크로태스크를 씁니다.

## 노드

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`. 노드가 사는 내내 변하지 않습니다
  kind: string;
  id: string;
  seq: number; // 시작 이벤트의 순서 — 정렬의 키입니다
  state: State;
}
```

`nodes()`는 다음으로 받아들여지는 이벤트가 올 때까지 같은 배열을 돌려주고, 각 노드는 얼어 있습니다. 그래서 뷰가 알림 하나를 건너 노드를 쥐고 있어도 그 발밑이 바뀌지 않습니다.

## 함께 보기

- [ranuts/stream](../stream/): 이벤트를 만들어 내는 쪽
- [`<r-conversation>`](../../ranui/conversation/): 노드를 그리는 쪽
- [ranuts/utils](../utils/)의 `createBottomFollower`: 뷰를 맨 아래에 붙여 둡니다
