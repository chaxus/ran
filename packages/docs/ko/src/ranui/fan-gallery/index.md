---
description: 'ranui 의 FanGallery(<r-fan-gallery>) 는 자식 요소를 손에 든 카드처럼 부채꼴로 펼칩니다. 처음 화면에 스크롤되어 들어올 때 스프링으로 열리고, 포인터나 포커스가 있는 자식을 들어 올립니다.'
---

# FanGallery

자식 요소를 손에 든 카드처럼 부채꼴로 펼칩니다. 각 자식은 행 아래의 한 점을 중심으로 회전하므로,
띠처럼 늘어선 것이 아니라 하나의 묶음으로 읽힙니다.

> **이럴 때 사용**: 몇 장의 표지, 스크린샷, 카드를 한 세트로 보여 주고 싶고, 각각을 전부 보여 주는 것보다
> 여러 장이 있다는 것을 보여 주는 것이 더 중요할 때. 독자가 나란히 비교해야 하는 콘텐츠라면 그리드를 사용하세요.

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

자식은 여러분이 직접 만든 엘리먼트입니다. 링크, 버튼, 이미지는 역할과 이름, 탭 순서를 그대로 유지하고,
갤러리는 위치만 움직입니다.

### 펼침 각도

`spread` 는 첫 번째와 마지막 자식 사이의 각도(도)입니다. `0` 이면 모두 겹쳐집니다.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## 모션

- **열기.** 갤러리가 처음 화면에 스크롤되어 들어오기 전까지 자식들은 겹쳐 있어, 맨 앞 카드는 처음부터 읽을 수 있습니다.
  화면에 들어오면 부채가 스프링으로 하나씩 열립니다. 페이지마다 한 번만 열리며, 스크롤로 벗어났다 돌아와도 다시 재생되지 않습니다.
- **포인터와 포커스.** 포인터 아래 있거나 포커스를 가진 자식이 들려 올라와 맨 앞으로 오고, 이웃한 자식은 조금 옆으로 비켜 돕니다.
  반응은 즉각적이며, 새 동작은 직전 동작이 도달한 위치에서 이어받습니다.
- **동작 줄이기.** `prefers-reduced-motion: reduce` 에서는 처음부터 부채가 열려 있고, 모든 변화가 트랜지션 없이 적용됩니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 어트리뷰트 | 타입     | 기본값 | 설명                                             |
| -------- | ---------- | -------- | ------ | ------------------------------------------------ |
| `spread` | `spread`   | `string` | `'24'` | 열렸을 때 첫 번째와 마지막 자식 사이의 각도(도). |
| `sheet`  | `sheet`    | `string` | `''`   | 섀도 루트에 주입할 CSS.                          |

### Part

| Part    | 엘리먼트                        |
| ------- | ------------------------------- |
| `stage` | 모든 자식이 겹쳐 놓이는 그리드. |

### 스타일

| 토큰                        | 기본값           | 역할                                                                 |
| --------------------------- | ---------------- | -------------------------------------------------------------------- |
| `--ran-fan-gallery-padding` | `--ran-space-10` | 회전한 모서리가 뻗어 나갈 stage 주변의 여백.                         |
| `--ran-fan-gallery-pivot`   | `320px`          | 자식이 행 아래 얼마나 먼 곳을 중심으로 도는지. 짧을수록 넓게 펼쳐짐. |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | 포인터나 포커스가 있는 자식이 밖으로 나오는 거리.                    |

갤러리의 높이는 가장 큰 자식과 같습니다. 회전한 모서리는 stage 밖으로 넘치므로,
주변에 여백을 두거나 `--ran-fan-gallery-padding` 을 늘리세요.
