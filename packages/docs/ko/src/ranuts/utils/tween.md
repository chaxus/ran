# 이징 함수(tween)

이징의 갈래가 일곱이고, 저마다 `easeIn`과 `easeOut` 꼴이 있습니다. 순수한 수식이라 DOM도, 자체 RAF 루프도 없습니다. 여러분의 애니메이션 프레임에서 지금 시각을 넣어 주면, 그 프레임이 써야 할 값을 돌려줍니다.

인자는 로버트 페너의 고전적인 관례를 따릅니다.

- `t`: 지금 시각(얼마나 지났는지)
- `b`: 시작 값
- `c`: 값의 변화량(끝 값은 `b + c`)
- `d`: 지속 시간

모든 함수가 안에서 `t >= d`일 때 값을 죄므로, 끝을 지나 불러도 범위 밖으로 외삽하지 않고 마지막 값을 돌려줍니다.

## 사용법

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // 600ms 동안 0 → 300
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## 쓸 수 있는 곡선

| 내보내는 이름 | 곡선      | 느낌                                             |
| ------------- | --------- | ------------------------------------------------ |
| `quad`        | 2차(`t²`) | 가장 부드러운 가속. 무난한 기본값                |
| `cubic`       | 3차(`t³`) | `quad`보다 눈에 띄게 날렵합니다                  |
| `quart`       | 4차(`t⁴`) | 힘찬 가속                                        |
| `quint`       | 5차(`t⁵`) | 매우 힘차고, 끝자락이 움직임의 인상을 좌우합니다 |
| `sine`        | 사인      | 가장 부드러워 이징인지도 잘 느껴지지 않습니다    |
| `expo`        | 지수      | 거의 멎어 있다가 갑자기 내달립니다               |
| `circ`        | 원        | 느리게 시작해 끝이 매우 갑작스럽습니다           |

## API

내보내는 것들의 생김새는 모두 같습니다.

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### 매개변수

| 매개변수 | 설명                      | 타입     | 기본값 |
| -------- | ------------------------- | -------- | ------ |
| `t`      | 지난 시간                 | `number` | 필수   |
| `b`      | 시작 값                   | `number` | 필수   |
| `c`      | 값의 변화량(끝은 `b + c`) | `number` | 필수   |
| `d`      | 지속 시간                 | `number` | 필수   |

#### 반환값

| 인자    | 설명              | 타입     |
| ------- | ----------------- | -------- |
| `value` | 시각 `t`에서의 값 | `number` |

## 참고

`easeIn`은 느리게 시작해 빨라지고, `easeOut`은 빠르게 시작해 느려집니다. 사용자의 동작에 응답하는 UI라면 대개 `easeOut`이 더 자연스럽게 읽힙니다. 먼저 머뭇거리지 않고 곧바로 움직여 자리를 잡기 때문입니다.

[zhangxinxu/Tween](https://github.com/zhangxinxu/Tween)에 감사드립니다.
