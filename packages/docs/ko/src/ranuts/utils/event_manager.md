# EventManager / createDoubleTapDetector

`AbortController`를 바탕으로 생명주기에 묶어 두는 이벤트 등록기, 그리고 포인터 종류를 가리지 않는 작은 더블 탭 감지기를 담았습니다.

이 도구가 푸는 문제는 _붙여 둔 리스너를 다시 떼어내는 일_ 입니다. `removeEventListener`는 등록할 때 넘긴 것과 **완전히 같은** 함수 참조와 옵션을 건네야만 동작합니다. 넘기는 길에 핸들러를 화살표 함수로 감싸면 그 뒤로는 영영 떼어낼 수 없습니다. 그러면 붙었다 떨어졌다를 반복하는 컴포넌트는 한 주기마다 리스너를 하나씩 흘리게 됩니다. `AbortController`는 그 모든 것을 `abort()` 한 번으로 바꿔 줍니다.

## 사용법

### 웹 컴포넌트 안에서

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // 리스너를 모두 떼고, 다음 연결을 위해 상태를 되돌립니다
  }
}
```

### 평범한 페이지 코드에서

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // 해당 영역을 해제할 때 호출하세요
}
```

## API

### on

이 매니저에 묶인 리스너를 등록합니다. 체이닝할 수 있습니다.

#### 매개변수

| 매개변수  | 설명                                  | 타입                                     | 기본값 |
| --------- | ------------------------------------- | ---------------------------------------- | ------ |
| `target`  | 이벤트 대상                           | `EventTarget`                            | 필수   |
| `type`    | 이벤트 이름                           | `string`                                 | 필수   |
| `handler` | 핸들러 함수                           | `EventListener`                          | 필수   |
| `options` | `signal`을 뺀 `addEventListener` 옵션 | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 반환값

| 인자   | 설명                      | 타입           |
| ------ | ------------------------- | -------------- |
| `this` | 체이닝을 위한 매니저 자신 | `EventManager` |

### delegate

이벤트 위임입니다. `parent`에 리스너를 **하나만** 붙이고, `selector`에 맞는 자손에서 시작된 이벤트일 때만 `handler`를 부릅니다. 체이닝할 수 있습니다.

핸들러는 원래 이벤트와 조건에 맞은 요소를 함께 받습니다.

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### 매개변수

| 매개변수   | 설명                                  | 타입                                     | 기본값 |
| ---------- | ------------------------------------- | ---------------------------------------- | ------ |
| `parent`   | 그 하나뿐인 리스너를 붙일 요소        | `HTMLElement`                            | 필수   |
| `selector` | 자손이 만족해야 할 선택자             | `string`                                 | 필수   |
| `type`     | 이벤트 이름                           | `string`                                 | 필수   |
| `handler`  | `(event, matchedElement) => void`     | `Function`                               | 필수   |
| `options`  | `signal`을 뺀 `addEventListener` 옵션 | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 반환값

| 인자   | 설명                      | 타입           |
| ------ | ------------------------- | -------------- |
| `this` | 체이닝을 위한 매니저 자신 | `EventManager` |

### abort

등록된 리스너를 모두 떼고 내부 `AbortController`를 새로 만듭니다. 여러 번 불러도 안전하며, 이후의 `on()` · `delegate()` 호출은 깨끗한 범위에서 다시 시작합니다.

#### 반환값

반환값 없음(`void`)

### signal

직접 `addEventListener`에 넘기고 싶을 때 쓰는, 바탕이 되는 `AbortSignal`입니다.

| 인자     | 설명                 | 타입          |
| -------- | -------------------- | ------------- |
| `signal` | 매니저의 중단 시그널 | `AbortSignal` |

## createDoubleTapDetector

가공하지 않은 `(x, y, 시각)` 표본만으로 더블 탭을 감지합니다. 포인터 종류를 가리지 않으므로 Pointer·Touch·Mouse 어느 이벤트를 먹여도 똑같이 동작합니다. 두 번 탭해 구간을 옮기거나 확대하거나 좋아요를 누르는 식의 터치 제스처를 겨냥해 만들었습니다. 이런 곳에서 시각과 거리 임계값 계산을 매번 다시 짜면 티 나지 않게 어긋나기 쉽습니다. 한 축만 비교한다든지, 성공한 뒤 초기화를 잊어 빠른 탭 세 번이 겹치는 더블 탭 두 번으로 세어진다든지 하는 식으로요.

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### 매개변수 (`DoubleTapDetectorOptions`)

| 옵션            | 설명                                       | 타입     | 기본값 |
| --------------- | ------------------------------------------ | -------- | ------ |
| `windowMs`      | 두 탭 사이에 허용할 최대 간격(밀리초)      | `number` | `300`  |
| `maxDistancePx` | 두 탭 사이에 허용할 평면상 최대 거리(픽셀) | `number` | `60`   |

#### `DoubleTapDetector`

| 멤버    | 설명                                                                                                                                                                                      | 타입                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `check` | `(x, y)` 지점의 탭을 기록하고, 바로 앞 탭과 묶여 더블 탭이 되는지 알려 줍니다. 더블 탭이 잡히면 추적이 초기화되므로, 세 번째 빠른 탭은 같은 더블 탭의 일부가 아니라 새 짝의 시작이 됩니다 | `(x: number, y: number, now?: number) => boolean` |
| `reset` | 마지막으로 기록한 탭을 잊습니다. 탭이 아닌 제스처(드래그 등)가 시작될 때 부르세요                                                                                                         | `() => void`                                      |
