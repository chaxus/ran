---
description: 'ranui Popover(<r-popover>)는 트리거에 커서를 올리거나 클릭할 때 떠 있는 말풍선 카드를 엽니다. 툴팁, 메뉴, 맥락에 따른 내용에 씁니다.'
---

# Popover

트리거에 커서를 올리거나 클릭했을 때 떠 있는 말풍선 카드 층을 여는 팝오버 컴포넌트입니다.

> **이럴 때 씁니다.** 트리거에 호버하거나 클릭하면 열리는 떠 있는 패널이 필요할 때. `<r-popover>`가 `<r-content>` 패널의 위치를 잡고 포털로 옮기며 접근성까지 연결해 둡니다.

## 빠른 시작

### 기본 사용법

트리거는 기본 슬롯에 두고, 떠 있는 내용은 중첩된 `<r-content>` 요소로 감쌉니다.

<ran-demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>이것이 패널 내용입니다</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>이것이 패널 내용입니다</div>
  </r-content>
</r-popover>
```

## API 레퍼런스

### 속성

| 속성                  | 타입     | 기본값    | 설명                                                                                                                                   |
| --------------------- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | 트리거를 기준으로 한 패널의 위치: `top`, `bottom`, `left`, `right`. 각각에 `-start`(기본), `-center`, `-end` 접미사를 붙일 수 있습니다 |
| `trigger`             | `string` | `'hover'` | 패널을 여는 방식: `hover` 또는 `click`(`click` 핸들러는 언제나 연결됩니다)                                                             |
| `getPopupContainerId` | `string` | `''`      | 패널을 그 안에서 배치할 요소의 `id`(열 때 읽으며, 속성으로 반영하지 않습니다)                                                          |
| `sheet`               | `string` | `''`      | 컴포넌트 섀도 DOM에 주입할 CSS                                                                                                         |

### 여는 방식 `trigger`

<ran-demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### 위치 `placement`

<ran-demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### 정렬 `placement="<방향>-<정렬>"`

방향만 쓰면 패널의 시작 모서리가 트리거의 시작 모서리에 맞춰집니다. 트리거 가운데에 놓이게 하거나 트리거의 끝 모서리에 맞추고 싶을 때 `-center`나 `-end`를 붙이세요. 헤더 바 오른쪽 끝에 매달린 메뉴가 바로 그런 경우로, 화면 밖으로 나갔다가 이동으로 밀려 들어오는 대신 처음부터 안쪽으로 열립니다. 이 접미사는 자동 뒤집기에도 살아남습니다. `bottom-end`는 `top`이 아니라 `top-end`가 됩니다.

<ran-demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — bottom-start와 같음</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</ran-demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## 슬롯

| 컴포넌트      | 슬롯   | 설명                                                                           |
| ------------- | ------ | ------------------------------------------------------------------------------ |
| `<r-popover>` | (기본) | 트리거 요소와 `<r-content>` 래퍼                                               |
| `<r-content>` | (기본) | 떠 있는 패널의 내용. 이 자식들은 `document.body`로 포털되어 열릴 때 표시됩니다 |

두 컴포넌트 모두 이름 없는 기본 슬롯 하나만 노출하며, 이름 있는 슬롯은 없습니다.

## 열림 상태 `open`

`open`은 패널의 상태 그 자체이며, `<details open>`이나 `<dialog open>`처럼 어트리뷰트로 반영됩니다. 패널의 `display`에서 상태를 되짚는 곳은 어디에도 없습니다. `display`는 퇴장 애니메이션만큼 상태보다 늦기 때문입니다. 그래서 어트리뷰트와 `aria-expanded`, 화면에 보이는 것이 서로 어긋날 수 없습니다.

```html
<r-popover id="pop" trigger="click">
  <r-button>트리거</r-button>
  <r-content><div>내용</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // 또는 pop.show()
  pop.open = false; // 또는 pop.hide()
  pop.toggle();
</script>
```

`show()`, `hide()`, `toggle()`은 그 위에 얹힌 얇은 래퍼입니다. `closePopover()`는 `hide()`의 별칭으로 남아 있습니다.

## 이벤트

`<r-popover>`는 패널의 전환 앞뒤로 네 개의 이벤트를 발생시키며, 어느 것도 `detail`을 싣지 않습니다.

| 이벤트       | 시점                                   |
| ------------ | -------------------------------------- |
| `show`       | 패널이 곧 나타납니다.                  |
| `after-show` | 나타났고 등장 애니메이션도 끝났습니다. |
| `hide`       | 패널이 곧 닫힙니다.                    |
| `after-hide` | 닫혔고 퇴장 애니메이션도 끝났습니다.   |

기다리는 대상은 스크립트에 옮겨 적은 시간이 아니라 스타일시트의 애니메이션 자체입니다. 그래서 `prefers-reduced-motion`에서는(재생할 애니메이션이 아예 없으므로) `after-hide`가 고정된 지연 뒤가 아니라 `hide` 바로 다음에 옵니다.

그 밖에는 표준 DOM 상호작용이 움직입니다.

- **열기**: `mouseenter`(`trigger`에 `hover`가 포함될 때), `click`, 또는 포커스된 상태에서 `Enter` / `Space`.
- **닫기**: `mouseleave`(hover 모드), `Escape`, 또는 문서의 다른 곳 클릭.

내부적으로는 짝이 되는 `<r-content>` 요소가 `MutationObserver`로 자기 서브트리를 감시하며 `change` `CustomEvent`(`detail: { type, value: { content, mutation } }`)를 내보내고, 팝오버가 이를 받아 패널을 맞춥니다. 이는 공개 API가 아니라 구현 세부사항입니다.

접근성은 자동으로 연결됩니다. 호스트에는 `tabindex="0"`, `aria-haspopup="dialog"`, 그리고 패널이 열리고 닫힘에 따라 `"false"`와 `"true"`를 오가는 `aria-expanded`가 붙습니다.

## 모범 사례

- **트리거 요소**: 포커스를 받을 수 있는 컨트롤(예: `<r-button>`)을 트리거로 두세요. 그래야 키보드로 열고 닫는 동작이 됩니다.
- **내용 래퍼**: 패널 내용은 반드시 `<r-content>`로 감싸세요. `<r-content>` 밖에 있는 평범한 자식은 떠 있는 패널로 표시되지 않습니다.
- **인라인 크기**: 호스트는 `display: block`입니다. `style="display: inline-block;"`을 붙이거나(또는 인라인 문맥에 두면) 트리거 크기만큼 줄어듭니다.
- **위치**: `placement`는 선호이지 보장이 아닙니다. 트리거가 뷰포트 가장자리에 가까워 선호한 방향에 자리가 없으면, 패널이 알아서 반대쪽으로 뒤집히고 교차축을 따라 이동해 화면 안에 남습니다. 이 자동 뒤집기는 기본값인 body 수준 배치에서만 적용됩니다.
- **한정된 컨테이너**: 기본값인 body 수준 배치가 곤란할 때는 `getPopupContainerId`로 특정 스크롤/배치 컨테이너 안에 패널을 고정하세요. 이 모드에서는 뒤집기와 이동이 적용되지 않으므로, 그 컨테이너에 맞는 `placement`를 고르세요. 정렬 접미사는 body 포털에서와 똑같이 여기서도 적용됩니다.
