---
description: 'r-popover 와 r-select 가 딛고 선, 위치와 쌓임 순서를 담당하는 저수준 떠 있는 패널 기본 요소.'
---

# Dropdown

저수준의 떠 있는 패널 기본 요소입니다. 모서리가 둥글고 떠오른 표면에 방향을 가리키는 화살표를 선택적으로 붙일 수 있습니다. 오버레이의 쌓임 순서를 담당하며, `r-popover`와 `r-select`가 이것을 자리 잡아 `<body>`로 포털합니다.

> **이럴 때 쓰세요.** 팝오버나 셀렉트 메뉴 같은 오버레이를 만들 저수준 떠 있는 패널이 필요할 때. `<r-dropdown>`이 쌓임 순서와 화살표를 갖고 있으므로 위치 계산을 직접 짜지 않아도 됩니다.

## 빠른 시작

### 기본 사용법

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">떠 있는 패널의 내용</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">떠 있는 패널의 내용</div>
</r-dropdown>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티  | 타입     | 기본값 | 설명                                                                 |
| --------- | -------- | ------ | -------------------------------------------------------------------- |
| `arrow`   | `string` | `''`   | 화살표 방향: `top`, `bottom`, `left`, `right`. 생략하면 화살표 없음. |
| `transit` | `string` | `''`   | 어트리뷰트가 붙어 있는 동안 패널에 비추는 애니메이션 클래스          |
| `sheet`   | `string` | `''`   | 컴포넌트의 섀도 DOM 에 주입할 CSS                                    |

### 화살표 방향 `arrow`

패널 한쪽 변에 가리키는 화살표를 그립니다. 어트리뷰트를 생략하면 화살표가 없습니다.

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### 등장 애니메이션 `transit`

들어오고 나가는 애니메이션을 재생하려고 패널에 비추는 CSS 클래스 이름입니다. 컴포넌트가 함께 제공하는 것들: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

클래스는 어트리뷰트와 정확히 같은 만큼만 삽니다. 애니메이션이 언제 끝났는지는 지정한 쪽이 정하고, 어트리뷰트를 떼면 클래스도 떨어집니다. (예전에는 300ms 쯤 뒤에 스스로 사라졌고, 그 시간이 스타일시트와 JS 두 곳에 적혀 있었습니다. 게다가 그 타이머는 자기가 붙인 클래스가 아니라 발동하는 순간의 `transit`이 가리키는 것을 떼어 냈기 때문에, 그 시간 안에 방향을 뒤집으면 첫 클래스가 패널에 영원히 남아 `-in`과 `-out`이 함께 걸린 채로 있었습니다.)

`getAnimationTarget()`은 애니메이션이 실제로 도는 엘리먼트를 돌려줍니다. 그것은 섀도 루트 안에 있으므로 호스트에 대한 `getAnimations()`는 아무것도 알려 주지 않고 `{ subtree: true }`도 경계를 넘지 않습니다. 패널 전환이 끝나기를 기다리는 코드는 섀도 트리를 뒤져 클래스 이름을 찾는 대신 `getAnimationTarget()`을 부르세요.

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">연결될 때 애니메이션으로 들어옵니다</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">연결될 때 애니메이션으로 들어옵니다</div>
</r-dropdown>
```

### 외부 스타일 `sheet`

패널의 섀도 DOM 에 주입하는 CSS 로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">직접 꾸민 패널</div>
</r-dropdown>
```

## 이벤트

`r-dropdown`은 수동적인 표면이며 커스텀 이벤트를 디스패치하지 않습니다. 위치를 잡고, 보이고, 숨기는 일은 쓰는 쪽 (예: `r-popover`나 `r-select`) 이 합니다.

## 슬롯

| 슬롯   | 설명                                |
| ------ | ----------------------------------- |
| (기본) | 패널의 내용. 있는 그대로 그려집니다 |

## CSS Part

| Part       | 설명                                           |
| ---------- | ---------------------------------------------- |
| `dropdown` | 패널 표면. 섀도 바깥에서 스타일을 줄 때 씁니다 |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

눈에 보이는 모든 성질은 `--ran-dropdown-*` 토큰으로 덮어쓸 수 있습니다. 예를 들어 `--ran-dropdown-background`, `--ran-dropdown-border-radius`, `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width`, `--ran-dropdown-host-z-index` 입니다. 화살표는 자기 `viewBox`로 크기가 정해지는 인라인 SVG 라서, `--ran-dropdown-arrow-width`/`-height`는 주변의 빈 상자가 아니라 삼각형 자체의 크기를 바꿉니다.

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## 권장 사항

- **저수준 기본 요소**: 직접 만든 떠 있는 패널이 필요할 때만 `r-dropdown`을 그대로 쓰세요. 흔한 경우에는 `r-popover`나 `r-select`가 낫습니다.
- **호스트에 크기를 주세요**: 패널은 기본으로 호스트의 `width` / `height: 100%`를 따릅니다. 호스트에 명시적인 크기와 위치를 준 다음 포털하세요.
- **쌓임 순서**: 호스트가 `--ran-z-dropdown`(`1100`) 을 가지므로 다이얼로그 위에 쌓입니다. 필요하면 `--ran-dropdown-host-z-index`로 덮어쓰세요.
- **화살표는 기본적으로 자기 기준**: `r-dropdown`은 바깥의 '트리거' 엘리먼트를 전혀 추적하지 않습니다. 가진 것은 자기 패널의 치수뿐입니다. 위치를 잡아 주는 쪽이 붙어 있지 않으면 `arrow="top"`/`"bottom"`은 패널 자신의 너비 가운데에 옵니다. `r-dropdown`을 맨몸으로 쓸 때 (위 데모처럼) 그것이 옳은 기본값입니다. `r-popover`가 `r-dropdown` 위에 얹혀 있는 이유가 바로 트리거 추적을 더하기 위해서입니다. 진짜 트리거 엘리먼트를 재고 `--ran-dropdown-arrow-anchor-offset`으로 픽셀 어긋남을 되돌려 주어, 패널이 더 넓어 가운데가 아니라 가장자리로 맞춰졌을 때도 화살표가 트리거의 중심을 가리키게 합니다. `r-dropdown` 위에 자기만의 트리거 추적 패널을 만드는 쪽은 `r-popover`의 위치 논리를 다시 만드는 대신 그 변수를 직접 지정하면 됩니다.
- **불러오기**: `import 'ranui'`(모든 컴포넌트 등록) 나 단독 `import 'ranui/dropdown'`으로 불러오세요.
