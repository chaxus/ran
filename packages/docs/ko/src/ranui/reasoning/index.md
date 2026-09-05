---
description: '추론이 스트리밍되는 동안 펼쳐지고 끝나면 접히는 접이식 사고 사슬. 독자가 직접 손대기 전까지만 그렇게 동작합니다.'
---

# Reasoning

접이식 사고 사슬입니다.

> **이럴 때 쓰세요.** 모델이 답과 별개로 추론을 드러내는데, 독자에게 그 과정을 보여 주되
> 끝난 뒤까지 화면에 남기고 싶지는 않을 때.

추론은 응답 가운데 진행되는 동안에는 보고 싶지만 끝난 뒤에는 거의 남기고 싶지 않은 유일한 부분입니다.
그래서 이 엘리먼트는 `streaming`이 켜져 있는 동안 펼쳐졌다가, 꺼지면 접힙니다.

**독자가 손대기 전까지만.** 독자가 직접 펼치거나 접는 순간, 이 자동 동작은 그대로 멈춥니다.
스크롤에도 [`createBottomFollower`](../../ranuts/utils/)가 같은 소유권 규칙을 따르고, 이유도 같습니다.
독자가 이미 정한 것을 계속 다시 정하는 인터페이스는, 아무것도 정하지 않는 인터페이스보다 나쁩니다.
스크립트에서 `open`을 지정하는 것도 주도권을 가져간 것으로 칩니다. 스크립트는 의견이 있는 호출자를
대신해 움직이니까요.

## 빠른 시작

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.createElement('r-reasoning');

reasoning.streaming = true; // 펼쳐진다
reasoning.content += delta; // 보이는 채로 자란다
reasoning.duration = 4200; // 레이블 옆에 "4.2s"
reasoning.streaming = false; // 독자가 개입하지 않았다면 접힌다

conversation.append(reasoning);
```

`ranuts/stream`은 이미 `reasoning-delta`를 `text-delta`와 따로 두므로, 뷰는 스냅숏에서 바로
흘려 넣으면 됩니다.

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## 알아 둘 만한 점

- **1초 미만의 시간은 아무것도 표시하지 않습니다.** 독자에게 중요한 것은 빨랐다는 사실이지 340ms였다는
  사실이 아닙니다.
- **스트리밍 중에는 레이블이 맥동합니다.** 오래 조용히 생각해도 멈춘 것으로 읽히지 않습니다.
  `prefers-reduced-motion`에서는 정보는 그대로 두고 애니메이션만 꺼집니다.
- **기본 슬롯은 렌더링된 텍스트를 대체합니다.** 본문을 일반 텍스트 대신 `<r-markdown>`으로 두고 싶은
  호출자를 위한 것입니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티    | 타입             | 기본값        | 설명                                                     |
| ----------- | ---------------- | ------------- | -------------------------------------------------------- |
| `content`   | `string`         | `''`          | 추론 텍스트. 반복해서 대입하는 것이 스트리밍 경로입니다. |
| `streaming` | `boolean`        | `false`       | 추론이 아직 도착 중인지 여부.                            |
| `open`      | `boolean`        | `false`       | 본문이 펼쳐져 있는지 여부.                               |
| `label`     | `string`         | `'Reasoning'` | 요약 줄의 텍스트.                                        |
| `duration`  | `number \| null` | `null`        | 생각한 밀리초. 1초 미만은 감춰집니다.                    |
| `sheet`     | `string`         | `''`          | 엘리먼트의 섀도 DOM에 주입할 CSS.                        |

유한하고 음이 아닌 수가 아닌 `duration`은 다시 읽으면 `null`이 됩니다.

### 슬롯

| 슬롯   | 설명                                             |
| ------ | ------------------------------------------------ |
| (기본) | 렌더링된 텍스트를 직접 만든 본문으로 대체합니다. |

### Part

`reasoning`, `summary`, `marker`, `label`, `meta`, `body`, `text`.

### 접근성

요약 줄은 `aria-expanded`를 가진 진짜 `<button type="button">`이므로, 별도 배선 없이 키보드로 닿고
조작할 수 있습니다.

## 스타일

`<r-reasoning>`은 자체 **CSS 커스텀 프로퍼티 4개**와 테마에서 읽어 오는 의미 토큰을 공개합니다.
상속이 닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Part: `body` · `row` · `text`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#reasoning)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 함께 보기

- [Conversation](../conversation/): 대화 기록의 추론 줄로 이것을 넣기
- [ranuts/stream](../../ranuts/stream/): `reasoning-delta`가 나오는 곳
