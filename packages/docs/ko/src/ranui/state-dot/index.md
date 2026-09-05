---
description: 'ranui 의 StateDot(<r-state-dot>) 은 후광과 중심을 한 엘리먼트로 그리는 8px 생명주기 표시점 (idle, running, success, warning, error) 입니다.'
---

# StateDot

8px 생명주기 표시점입니다. 후광과 중심이 한 엘리먼트 안에 있고 둘 다 `currentColor`를 쓰므로,
하나의 상태는 두 개의 토큰이 아니라 하나의 색 규칙입니다.

> **이럴 때 쓰세요.** 어떤 행이 작업의 어느 단계인지 (대기 중, 진행 중, 완료, 실패) 를 한 줄을
> 통째로 쓰지 않고 보여야 할 때. `<r-tool-card>`와 압축 표시가 쓰는 점도 이것입니다.

## 빠른 시작

### 기본 사용법

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running`만 맥동하고 나머지는 정지해 있습니다. 알 수 없는 값은 사라지지 않고 `idle`로 그려지므로,
보내는 쪽이 새로 추가했지만 페이지가 아직 모르는 상태도 행에서 제자리를 지킵니다.

### 레이블과 나란히

이 점은 색으로만 상태를 나타낼 뿐, 그 색이 무엇을 뜻하는지는 설명하지 않습니다. 두 행을 구분하는
단서가 색뿐인 상황은 절대 만들지 마세요.
[디자인 가이드](/ko/src/ranui/design-guides/#accessibility)를 참고하세요.

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>테스트 실행 중</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>테스트 2 개 실패</span>
  </div>
</Demo>

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 어트리뷰트 | 타입                                                       | 기본값   | 설명                                        |
| -------- | ---------- | ---------------------------------------------------------- | -------- | ------------------------------------------- |
| `state`  | `state`    | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | 어느 단계를 보일지. 알 수 없는 값은 `idle`. |
| `label`  | `label`    | `string`                                                   | `''`     | 접근성 이름. 아래 참고.                     |
| `sheet`  | `sheet`    | `string`                                                   | `''`     | 섀도 루트에 주입할 CSS.                     |

### 접근성

**`label`을 주기 전까지 이 점은 `aria-hidden` 입니다.** 이미 결과를 글로 밝힌 행 옆의 점은
스크린 리더에게 잡음일 뿐입니다. "진행 중"을 두 번 읽어 주는 것은 아무에게도 도움이 되지 않습니다.
점이 상태의 _유일한_ 전달자일 때만 `label`을 설정하세요.

```html
<!-- 글이 이미 말하고 있다: 점은 조용히 -->
<r-state-dot state="error"></r-state-dot> <span>빌드 실패</span>

<!-- 셀에 점만 있다: 이름을 준다 -->
<r-state-dot state="error" label="빌드 실패"></r-state-dot>
```

### Part

| Part  | 엘리먼트 |
| ----- | -------- |
| `dot` | 점 자체  |

### 스타일

각 상태는 색 **하나**입니다. 후광은 그 색의 16% 이고 중심은 그것을 60% 안으로 줄인 것이며, 둘 다
`currentColor`로 그립니다. 그러니 하나의 상태는 두 개가 아니라 한 개의 토큰입니다.

| 토큰                            | 기본값                             |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running`은 회전이 아니라 중심을 맥동시킵니다 (8px 에서는 회전하는 아이콘이 너무 작아 회전으로
읽히지 않습니다). 맥동은 `prefers-reduced-motion`에서 멈춥니다.
