# computePlacement

떠 있는 패널(드롭다운, 팝오버, 툴팁)을 기준 사각형에 맞춰 놓습니다. 바라는 쪽에 자리가 없고 반대쪽이 더 넓으면 반대쪽으로 뒤집고, 그다음 경계 안에 머물도록 가로지르는 축을 따라 밀어 줍니다. Floating UI의 `flip`/`shift` 미들웨어와 같은 일을 의존성 없이 합니다.

순수한 기하입니다. DOM 자체에는 손대지 않습니다. `getBoundingClientRect()`의 결과를 넘기면 적어 넣을 좌표를 돌려줍니다.

## 사용법

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement`는 뒤집은 뒤 실제로 쓰인 쪽입니다. 등장 애니메이션 클래스나
// 화살표 방향을 고르는 데 쓰세요.
```

## API

### computePlacement

#### 매개변수

| 매개변수            | 설명                                                                            | 타입                                     | 기본값      |
| ------------------- | ------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `options.anchor`    | 기준(방아쇠)이 되는 사각형. 뷰포트 좌표로 줍니다(예: `getBoundingClientRect()`) | `{ top, left, width, height }`           | 필수        |
| `options.floating`  | 떠 있는 패널 자체의 크기                                                        | `{ width, height }`                      | 필수        |
| `options.placement` | 바라는 쪽. 자리가 없고 반대쪽이 더 넓으면 반대쪽으로 뒤집습니다                 | `'top' \| 'bottom' \| 'left' \| 'right'` | 필수        |
| `options.offset`    | 기준과 떠 있는 패널 사이에 두는 틈(px)                                          | `number`                                 | `0`         |
| `options.boundary`  | 패널이 머물러야 하는 영역. 뷰포트 좌표로 줍니다                                 | `{ top, left, width, height }`           | 창의 뷰포트 |
| `options.padding`   | 밀 때 패널과 경계 가장자리 사이에 두는 최소한의 틈(px)                          | `number`                                 | `8`         |

#### 반환값

| 인자        | 설명                                           | 타입                                     |
| ----------- | ---------------------------------------------- | ---------------------------------------- |
| `top`       | 정해진 `top`. `anchor`와 같은 좌표 공간입니다  | `number`                                 |
| `left`      | 정해진 `left`. `anchor`와 같은 좌표 공간입니다 | `number`                                 |
| `placement` | 뒤집은 뒤 실제로 쓰인 쪽                       | `'top' \| 'bottom' \| 'left' \| 'right'` |

## 참고

1. **좌표는 처음부터 끝까지 뷰포트 기준**이며, `anchor`와 같은 공간입니다. 패널을 문서에 대해 `position: absolute`로 놓는다면, 스타일을 적을 때 `scrollX`와 `scrollY`를 직접 더하세요(위의 사용 예를 보세요).
2. **실제 배치가 없으면 뒤집기도 밀기도 하지 않습니다.** `anchor`나 `floating`의 너비나 높이가 0일 때(실제 배치를 결코 하지 않는 jsdom이나, 내용이 자리 잡기 전에 읽힌 패널), 공간 계산이 부를 때마다 있지도 않은 충돌을 "찾아냅니다". 그래서 `computePlacement`는 뒤집기와 밀기를 통째로 건너뛰고, 부른 쪽이 바란 `placement`를 그대로 돌려줍니다.
3. **패널이 경계 자체보다 클 때는 밀기를 건너뜁니다.** 죄어 봐야 반대쪽으로 더 화면 밖으로 밀어낼 뿐이기 때문입니다.
4. `ranui`의 `r-popover`와 `r-select`가 속으로 쓰고 있으며, `body`로 옮겨 붙인 드롭다운이 화면 안에 머물게 합니다.
