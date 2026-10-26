# spring / stagger / observeEntry

그리기는 호출하는 쪽에 맡기는 모션 기본 요소입니다. 정확히 풀어낸 스프링(CSS `linear()` 이징으로도 출력), 시차 지연, 한 번만 동작하는 뷰포트 진입 감지, 그리고 읽는 사람의 동작 줄이기 설정입니다. 모두 자체 애니메이션 루프가 없어서 Web Animations, CSS 트랜지션, 직접 만든 `requestAnimationFrame` 어디에나 쓸 수 있습니다.

## API

### spring(options?)

`{ at, duration, easing }`을 반환합니다. `at(seconds)`는 0에서 1까지의 진행률이고(감쇠가 부족한 스프링은 1을 넘었다가 안정됩니다), `duration`은 목표의 0.1% 안에 머무를 때까지의 초, `easing`은 같은 곡선을 그 시간에 맞춘 CSS `linear()` 문자열입니다.

| 옵션        | 설명                                                          | 기본값 |
| ----------- | ------------------------------------------------------------- | ------ |
| `stiffness` | 목표로 당기는 힘. 클수록 빠름                                 | `170`  |
| `damping`   | 저항. `2 * sqrt(stiffness * mass)`보다 작으면 넘쳤다가 돌아옴 | `26`   |
| `mass`      | 관성                                                          | `1`    |
| `velocity`  | 초기 속도(초당 진행률)                                        | `0`    |

### stagger(index, count, options?)

`count`개 중 `index`번째 요소의 지연 시간(초). 처음, 끝, 가운데 중 어디서 시작할지 `from`으로 정합니다.

### observeEntry(element, options)

요소의 위쪽 끝이 `line`(뷰포트 위에서부터의 높이 비율)을 처음 넘을 때 `onEnter`를 한 번 호출하고 관찰을 멈춥니다. 인자는 `{ reduced }`이며 `true`이면 애니메이션 없이 최종 상태를 보여 줍니다. 반환된 함수로 미리 관찰을 멈출 수 있습니다.

### prefersReducedMotion()

읽는 사람이 동작 줄이기를 켰으면 `true`, window가 없는 환경(SSR, Node)에서는 `false`.

## 예제

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## 참고

1. **스크립트 없이도 내용이 보입니다.** CSS로 먼저 숨기지 말고 `fill: 'backwards'`로 오프셋 위치*에서부터* 애니메이션하면, 스크립트가 실패하거나 동작 줄이기가 켜져도 모든 것이 제자리에 있습니다.
2. **IntersectionObserver가 없으면 `observeEntry`는 즉시 진입으로 처리해** 요소를 기다리게 하지 않습니다.
3. **스프링은 단계 계산이 아니라 정확한 해**라서 같은 옵션이면 어떤 프레임 속도에서도 같은 곡선입니다.
