---
description: 'Pointer Events API로, 캔버스 덮개를 문질러 지우면 아래 내용이 드러나는 실험적인 스크래치 카드 표면.'
---

# Scratch

실험적인 스크래치 카드 표면입니다. 섀도 DOM 안에서 드러날 층 위에 화면을 가득 채우는 `<canvas>` 덮개를 그립니다. 캔버스 위를 끌면 포인터가 실제로 지나간 경로를 따라 `destination-out` 합성으로 덮개가 지워지고, 충분한 면적을 긁으면 아래 있던 것이 드러납니다. 호스트는 `display: block`이므로 너비와 높이를 명시적으로 주세요.

> **이럴 때 쓰세요.** 끌어서 덮개 캔버스를 지우면 아래에 둔 아무 콘텐츠나 드러나는, 실험적인 스크래치 카드 표면이 필요할 때. Pointer Events API 덕분에 마우스든 터치든 펜이든 똑같이 동작합니다.

> ⚠️ **실험적**: 이 컴포넌트는 아직 만들어 가는 중입니다. 견고한 프로덕션 위젯이 아니라 재미있는 상호작용으로 여겨 주세요.

## 빠른 시작

### 기본 사용법

`<r-scratch>` 안에 넣은 것이 곧 드러날 콘텐츠입니다(금액이든, 이미지든, `<r-icon>`이든, 여러 엘리먼트든). 다른 ranui 컴포넌트의 콘텐츠 투영과 똑같이, 기본 슬롯을 통해 덮개 아래 층으로 투영됩니다.

<ran-demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">50코인 당첨!</r-scratch>
</ran-demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">50코인 당첨!</r-scratch>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입      | 기본값  | 설명                                                                                  |
| ---------- | --------- | ------- | ------------------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | 긁기 상호작용을 끕니다(덮개 캔버스에 `pointer-events: none`, 그리고 핸들러에도 방어). |
| `sheet`    | `string`  | `''`    | 컴포넌트의 섀도 DOM에 주입할 CSS.                                                     |

### 비활성 상태 `disabled`

<ran-demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">50코인 당첨!</r-scratch>
</ran-demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">50코인 당첨!</r-scratch>
```

### 외부 스타일 `sheet`

<ran-demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</ran-demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## 상호작용

이 컴포넌트는 커스텀 이벤트를 **디스패치하지 않습니다.** 리스너를 걸 대상이 없습니다. 대신 긁기는 캔버스에 등록된 내부 [Pointer Events](https://developer.mozilla.org/ko/docs/Web/API/Pointer_events) 리스너만으로 굴러가므로, 마우스와 터치와 펜이 같은 코드 경로를 씁니다.

- `pointerdown`: 긁기를 준비하고 포인터가 닿은 바로 그 자리를 작게 지웁니다(끌지 않고 탭만 해도 무언가 드러납니다).
- `pointermove`: 준비된 동안 앞 점에서 지금 점까지 **이어진 선**(흩어진 점이 아니라)을 `globalCompositeOperation = 'destination-out'`으로 긋습니다. 그래서 빠르게 끌어도 끊긴 자국 대신 이어진 자국이 드러나고, 긁힌 면적이 쌓여 갑니다.
- `pointerup` / `pointercancel`: 긁기를 해제합니다. 쌓인 면적이 **캔버스 픽셀 면적의 35%**를 넘으면 `clearRect`로 덮개를 통째로 지워 아래 층을 온전히 드러냅니다(“조금 긁으면 알아서 끝난다”는, 일부러 넉넉하게 잡은 문턱값입니다. 덮개를 손으로 다 지우게 하기보다 스크래치 카드에서 흔한 경험입니다).

포인터 좌표는 캔버스의 실제 그리기 버퍼 해상도(아래 참고)를 거쳐 대응되므로, 엘리먼트의 CSS 크기나 화면의 기기 픽셀 비와 무관하게 손가락이나 커서 아래를 정확히 따라갑니다. `disabled`인 동안에는 모든 핸들러가 아무 일도 하지 않고, 캔버스의 `touch-action: none`이 터치로 끌 때 페이지까지 스크롤되는 것을 막습니다.

기기마다 다른 몇 가지 가장자리 상황은 마우스·터치·펜의 “통합”이 알아서 하도록 두지 않고 명시적으로 다룹니다.

- **마우스**: 주 버튼(왼쪽)만 긁기를 시작합니다. 오른쪽 버튼으로 끌거나 가운데 버튼을 눌러도 시작되지 않습니다.
- **멀티터치**: 처음 내려온 손가락이 획을 지휘하고, 긁는 도중에 닿은 두 번째 손가락은 첫 손가락이 떨어질 때까지 무시됩니다. 두 손가락이 같은 그리기 상태에 동시에 쓰지 않습니다.
- **끊긴 제스처**: OS가 `pointerup`을 한 번도 내보내지 않은 채 포인터 캡처를 되가져가면(안드로이드 일부 WebView에서 시스템 뒤로 가기 스와이프가 긁기를 끊을 때 보입니다) `lostpointercapture` 리스너가 그래도 내부 상태를 되돌립니다. 그러지 않으면 내부 상태는 준비된 채로 남고, 다음에 아무 상관 없는 포인터 움직임이 조용히 계속 그리게 됩니다.

### 캔버스 해상도

캔버스의 내부 해상도는 브라우저 기본값인 300×150에 머무르지 않고, 실제로 렌더링된 CSS 크기 × `devicePixelRatio`에 맞춰집니다(연결될 때, 그리고 창 `resize` 때마다). 덕분에 HiDPI 화면에서도 덮개가 또렷하고, 어떤 크기에서도 포인터와 캔버스의 좌표 대응이 정확합니다. 크기가 바뀌면 진행 중이던 긁기는 초기화됩니다(버퍼는 치수가 바뀌면 반드시 지워집니다).

## 슬롯

| 슬롯   | 설명                                             |
| ------ | ------------------------------------------------ |
| (기본) | 드러날 콘텐츠. 긁는 덮개 아래 층으로 투영됩니다. |

## 스타일

이 컴포넌트는 **`::part()` 고리를 하나도 공개하지 않지만**, 두 층의 색은 테마 토큰이 움직이는 CSS 변수입니다. 섀도 DOM은 고정된 세 층입니다.

| 클래스                       | 역할                                                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | 전체 크기의 상대 배치 컨테이너(`width: 100%; height: 100%`)                                                                                    |
| `.ran-scratch-ticket-award`  | 드러날 층. `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`. 기본 슬롯을 담습니다           |
| `.ran-scratch-ticket-canvas` | 긁는 덮개 캔버스. `z-index: 2`. 호스트에 지정된 `--ran-scratch-cover-background`(기본 `var(--ran-color-text-secondary, #6b6b6b)`)로 채워집니다 |

두 색 모두 테마 토큰을 거치고 리터럴 대비값을 가지므로 기본적으로 라이트·다크 모드에 맞춰지고, `--ran-scratch-award-background` / `--ran-scratch-cover-background`로 덮어쓸 수 있습니다. 호스트 크기는 평범한 `width` / `height`로 정하세요.

## 권장 사항

- **호스트 크기는 반드시 주세요**: `display: block`이며 고유 크기가 없습니다. `width`와 `height`를 명시적으로 주지 않으면 안쪽 `100%` 층들이 0으로 눌립니다.
- **드러날 콘텐츠는 무엇이든 됩니다**: 텍스트, 이미지, `<r-icon>`, 여러 엘리먼트. 상품이 실제로 무엇이든 그대로 슬롯에 넣으세요. 우회해야 할 고정된 아이콘+크기 API는 없습니다.
- **마우스·터치·펜에서 동작합니다**: Pointer Events가 셋을 통합하므로 데스크톱과 모바일에서 같은 방식으로 반응합니다.
- **실험적인 것으로 여기세요**: 아직 만들어 가는 중입니다. 프로덕션 동작을 여기에 기대지 마세요.
