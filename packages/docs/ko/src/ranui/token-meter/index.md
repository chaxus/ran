---
description: 'ranui 의 TokenMeter(<r-token-meter>) 는 공급자가 다음 요청을 거절하기 전에, 대화가 모델 컨텍스트 창을 얼마나 쓰고 있는지 보여 줍니다.'
---

# TokenMeter

대화가 컨텍스트 창을 얼마나 쓰고 있는지.

> **이럴 때 쓰세요.** 컨텍스트 한도가 있는 모델을 상대로 채팅 UI 를 만들 때. 이걸 보여 주지 않는
> 클라이언트는 처음에는 잘 돌다가 결국 실패합니다. 턴마다 전체 기록을 다시 보내니 요청은 커지기만
> 하고, 언젠가 공급자가 한도 초과로 거절합니다. 이 컴포넌트는 거절당하기 전에 그 증가를 보여 줍니다.

## 빠른 시작

### 기본 사용법

<Demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</Demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.createElement('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // 다음 요청이 실어 보낼 컨텍스트
meter.spent = 128431; // 대화 전체에서 청구된 토큰, 선택 사항
composer.append(meter);
```

막대는 `used / limit`까지 차오르며 세 단계로 올라갑니다: **ok**, **warn**(한도의 80% 부터), **over**.
`level`은 호스트에 반영되므로, 페이지도 막대와 같은 단계에 반응할 수 있습니다.

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used`와 `spent`는 다른 숫자입니다

- **`used`**: _다음 요청_ 이 실어 보낼 양, 즉 대화 기록이지 대화 전체가 아닙니다. 한도가 적용되는
  숫자이자 막대가 그리는 숫자입니다.
- **`spent`**: 지금까지 대화 **전체**에서 청구된 양. 오직 늘어나기만 하고 창 크기에 매이지 않습니다.

기록을 잘라 내면 `used`는 줄지만 `spent`는 그대로입니다. 둘 중 하나만 보여 주면 사용자가 가진 두 가지
질문 ("다음 메시지가 들어갈까?", "지금까지 얼마나 들었지?") 가운데 하나에만 답하게 됩니다.

### 한도가 없을 때

`limit`이 지정되지 않았거나 0 이면 막대가 사라지고 숫자만 남습니다. 창 크기를 아직 모를 때 유용합니다.

<Demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</Demo>

### 레이블 바꾸기

<Demo>
  <r-token-meter label="컨텍스트" limit="65536" used="41200"></r-token-meter>
</Demo>

```html
<r-token-meter label="컨텍스트" limit="65536" used="41200"></r-token-meter>
<!-- label="" 이면 숫자만 남습니다 -->
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 어트리뷰트 | 타입                       | 기본값      | 설명                                                                           |
| -------- | ---------- | -------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `limit`  | `limit`    | `number`                   | `0`         | 컨텍스트 창 크기 (토큰). 0 이거나 없으면 막대를 숨깁니다.                      |
| `used`   | `used`     | `number`                   | `0`         | 다음 요청이 실어 보낼 토큰 수.                                                 |
| `spent`  | `spent`    | `number`                   | `0`         | 지금까지 대화 전체에서 청구된 토큰 수.                                         |
| `label`  | `label`    | `string`                   | `'Context'` | 표시 앞에 붙는 말. `''`이면 숫자만 남습니다.                                   |
| `level`  | `level`    | `'ok' \| 'warn' \| 'over'` | 파생        | 창이 얼마나 찼는지. **엘리먼트가 지정합니다**: 써 넣어도 다음 갱신에 덮입니다. |
| `sheet`  | `sheet`    | `string`                   | `''`        | 섀도 루트에 주입할 CSS.                                                        |

숫자는 빨리 읽히도록 다듬어집니다. 천 미만은 정확하게 (`847`은 정확히 읽을 만큼 짧습니다), 그 위로는
줄여서 (`41.2k`, `128k`). `128,431`의 세 번째 자리는 읽는 사람의 행동을 바꾸지 않습니다.

### Part

| Part    | 엘리먼트      |
| ------- | ------------- |
| `meter` | 엘리먼트 전체 |
| `track` | 막대의 배경   |
| `fill`  | 채워진 부분   |
| `text`  | 레이블과 숫자 |

## 접근성

이 엘리먼트는 숫자를 밝히는 `title`을 늘 지니고 있습니다. 그래서 **색이 경고의 유일한 전달자가 되는
일은 없습니다.** 막대가 호박색이 되는 것은 두 번째 신호이지 유일한 신호가 아닙니다. 단계 스타일을
바꿀 때도 이 성질은 지켜 주세요.

## 스타일

`<r-token-meter>`는 자체 **CSS 커스텀 프로퍼티 9 개**와 테마에서 읽어 오는 의미 토큰을 공개합니다.
상속이 닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-token-meter {
  --ran-token-meter-fill-background: var(--ran-color-bg-subtle);
}
```

Part: `fill` · `meter` · `text` · `track`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#token-meter)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 권장 사항

- **`used`는 요청을 만드는 바로 그 자리에서 갱신하세요.** 렌더링 단계에서가 아니라요. 사람들이 믿는
  숫자는 다음 요청이 실제로 보낼 숫자입니다.
- **단계별 대응은 미터 밖에서 하세요.** `level="over"`일 때 쓸모 있는 UI 는 제안 (요약하기, 새 스레드
  시작하기) 이고, 그것은 앱의 몫입니다.
- **테마가 바뀔 때 채움을 애니메이션하지 마세요**: [디자인 가이드](/ko/src/ranui/design-guides/#motion)를
  보세요.
