---
description: 'ranui 의 Skeleton(<r-skeleton>) 은 콘텐츠가 로드되는 동안 그 자리를 채우는, 반짝이는 자리표시자입니다.'
---

# Skeleton

콘텐츠가 로드되는 동안 그 자리를 채우는 자리표시자 그래픽으로, 반짝이는 애니메이션을 씁니다.

> **이럴 때 쓰세요.** 콘텐츠가 로드되는 동안 자리를 잡아 둘 반짝이는 막대가 필요할 때. `<r-skeleton>`의 부모를 실제 콘텐츠 크기에 맞춰 두었다가, 데이터가 도착하면 바꿔 끼웁니다.

## 빠른 시작

### 기본 사용법

스켈레톤은 부모 엘리먼트의 너비를 가득 채우며, 높이는 기본값이 `16px` 입니다.

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### 너비는 부모를 따른다

스켈레톤은 `width: 100%` 이므로, 길이는 그것을 담은 컨테이너의 크기로 조절합니다.

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### 자리표시자 쌓기

스켈레톤 여러 개를 조합해 문단이나 텍스트 덩어리를 흉내 냅니다.

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입     | 기본값 | 설명                                                     |
| -------- | -------- | ------ | -------------------------------------------------------- |
| `sheet`  | `string` | `''`   | 범위를 한정해 스타일을 덮어쓰도록 섀도 DOM 에 주입할 CSS |

### 스타일 덮어쓰기 `sheet`

`sheet`에 CSS 문자열을 넘기면 섀도 DOM 안에서 스켈레톤의 모습을 덮어쓸 수 있습니다.

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### CSS 변수

`sheet` 없이 테마를 입힐 수 있도록 CSS 커스텀 프로퍼티도 제공합니다.

| 변수                                        | 기본값                         | 설명                           |
| ------------------------------------------- | ------------------------------ | ------------------------------ |
| `--ran-skeleton-height`                     | `16px`                         | 자리표시자 막대의 높이         |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | 반짝임을 뺀 바탕색             |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | 모서리 반경                    |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | 움직이는 하이라이트 그라디언트 |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | 반짝임이 한 번 지나가는 시간   |

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## 이벤트

없습니다. 스켈레톤은 커스텀 이벤트를 디스패치하지 않습니다.

## 슬롯

없습니다. 스켈레톤은 자신의 막대만 그리며 슬롯 콘텐츠를 투영하지 않습니다.

## 권장 사항

- **레이아웃에 맞추세요**: 부모 컨테이너 크기를 조절해 각 스켈레톤이 대신하는 실제 콘텐츠의 너비와 같아지도록 합니다.
- **모양을 흉내 내세요**: 스켈레톤 여러 개를 일정한 간격으로 쌓아 여러 줄 텍스트나 목록 행을 표현합니다.
- **변수로 테마를 입히세요**: 간단한 조정에는 `--ran-skeleton-*` CSS 변수를 먼저 쓰고, 변수로 닿지 않는 선택자가 필요할 때만 `sheet`를 씁니다.
- **로드되면 교체하세요**: 데이터가 도착하면 스켈레톤을 실제 콘텐츠로 바꾸고, 계속 애니메이션하게 두지 마세요.
