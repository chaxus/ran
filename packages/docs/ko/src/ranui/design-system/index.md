---
description: 'ranui의 디자인 언어와 토큰 전체 레퍼런스. 모든 전역 `--ran-*` 토큰을 Geist 색 사다리(라이트·다크 값), 시맨틱 역할, 간격, 크기, 타이포그래피, 모서리, 그림자, 쌓임, 모션, 포커스, 스킨 프리미티브까지 담았습니다.'
---

# 디자인 시스템

ranui가 딛고 선 **디자인 언어**와, 그것을 표현하는 토큰의 **완전한** 목록입니다. 라이브러리가 선언하는 모든 전역 `--ran-*` 사용자 정의 속성을, 두 테마에서의 값과 함께 실었습니다. 컴포넌트는 값을 직접 박아 넣는 대신 이 토큰들을 읽으므로, 토큰 하나를 덮어쓰면 그것을 쓰는 모든 것의 모습이 바뀝니다.

네 페이지가 네 가지 다른 물음에 답하며, 일부러 나누어 두었습니다.

| 페이지                                      | 답하는 것                               |
| ------------------------------------------- | --------------------------------------- |
| **디자인 시스템**(이 페이지)                | 토큰이 _무엇인지_, 곧 어휘              |
| [디자인 지침](/ko/src/ranui/design-guides/) | 화면을 만들 때 그중에서 _어떻게 고를지_ |
| [정보 구조](/ko/src/ranui/information-architecture/) | 페이지 자체가 **어떤 형태**여야 하는지 |
| [테마](/ko/src/ranui/theme/)                | 실행 중에 _어떻게 바꾸고 덮어쓸지_      |

> **이럴 때 씁니다.** 토큰의 이름이나 값(색의 역할, 간격 단계, 아이콘 크기, 그림자 단계, 이징 곡선)이 필요할 때, 또는 스케일이 왜 이런 모양인지 알고 싶을 때.

## 언어: Geist

ranui의 토큰은 Vercel의 오픈소스 디자인 시스템 [Geist](https://vercel.com/geist)에 바탕을 둡니다. 모든 색 스케일은 고를 수 있는 명암의 모음이 아니라, 단마다 할 일이 정해진 사다리입니다. 200단은 "조금 더 어두운 회색"이 아니라 "호버 배경"입니다. 단의 할 일이 정해지고 나면, 상호작용 상태의 색을 고르는 일은 판단이 아니라 조회가 됩니다.

ranui는 그 사다리를 `--ran-*` 스케일로 받아들이고, 그 위에 시맨틱 토큰을 얹으며, 기본 서체로 **Geist Sans / Geist Mono**를 함께 싣습니다.

## 두 개의 층 {#two-layers}

**1층: 기본 팔레트.** 아래에 늘어놓은 날 스케일입니다. 직접 쓰는 일은 드뭅니다.

**2층: 시맨틱 토큰.** `--ran-color-*`와 그 동료들로, 1층 위에 대응됩니다. **쓰는 것은 이 층입니다.** 다크 모드는 1층만 다시 정의하므로, 모든 시맨틱 토큰이 `var()`를 통해 함께 바뀌고, 라이브러리 어디에도 컴포넌트별 다크 전용 덮어쓰기는 없습니다.

```
--ran-gray-1000        →  #171717(라이트) / #ededed(다크)        ← 1층. 바뀝니다
--ran-color-text       →  var(--ran-gray-1000)                    ← 2층. 따라갑니다
--ran-btn-color        →  var(--ran-color-text, …)                ← 컴포넌트 토큰
```

이 사슬이 구조의 전부입니다. 기본 단을 바꾸면 어디로든 퍼지고, 시맨틱 토큰을 바꾸면 역할 하나가 바뀌며, 컴포넌트 토큰을 바꾸면 요소 하나가 바뀝니다.

## 색

### 사다리 {#the-ladder}

모든 색상 스케일은 `100 → 1000`으로 달리고, 단마다 할 일이 하나씩 정해져 있습니다.

| 단  | 역할            | 단   | 역할                 |
| --- | --------------- | ---- | -------------------- |
| 100 | 기본 배경       | 600  | 활성 테두리          |
| 200 | 호버 배경       | 700  | 단색 채움(버튼/배지) |
| 300 | 활성(눌림) 배경 | 800  | 단색 채움(호버)      |
| 400 | 기본 테두리     | 900  | 보조 텍스트와 아이콘 |
| 500 | 호버 테두리     | 1000 | 주요 텍스트와 아이콘 |

### 배경

| 토큰                   | 라이트                                                          | 다크                                                            | 쓰임새             |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------------ |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | 페이지 배경        |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | 은은한 페이지 영역 |

### 회색 — `--ran-gray-100..1000`

텍스트와 테두리, 면 뒤에 놓인 스케일입니다.

| 단   | 라이트                                                          | 다크                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200  | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300  | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400  | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500  | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600  | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700  | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800  | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900  | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000 | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### 회색 알파 — `--ran-gray-alpha-100..1000`

반투명이라 어떤 면 위에도 겹칠 수 있습니다. 가림막, 호버의 옅은 물듦, 무엇이 밑에 올지 모르는 자리에 놓을 구분선에는 이것이 맞습니다.

| 단   | 라이트                                                                       | 다크                                                                         |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100  | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200  | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300  | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400  | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500  | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600  | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700  | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800  | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900  | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000 | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### 파랑 — `--ran-blue-100..1000`

링크와 포커스 링을 위해 남겨 둔 색입니다.

| 단   | 라이트                                                          | 다크                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200  | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300  | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400  | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500  | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600  | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700  | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800  | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900  | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000 | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### 빨강 — `--ran-red-100..1000`

위험과 오류입니다.

| 단   | 라이트                                                          | 다크                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200  | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300  | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400  | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500  | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600  | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700  | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800  | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900  | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000 | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### 호박 — `--ran-amber-100..1000`

경고입니다.

| 단   | 라이트                                                          | 다크                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200  | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300  | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400  | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500  | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600  | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700  | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800  | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900  | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000 | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### 초록 — `--ran-green-100..1000`

성공입니다.

| 단   | 라이트                                                          | 다크                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200  | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300  | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400  | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500  | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600  | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700  | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800  | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900  | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000 | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### 시맨틱 색 토큰

컴포넌트가 실제로 읽는 층입니다. 여기 있는 것은 모두 위의 스케일을 통해 풀리므로, 테마에 맞춰 저절로 바뀝니다.

| 토큰                           | 풀리는 곳                                                                                                                                | 역할                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                   | 페이지 배경                     |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                   | 은은한 페이지 영역              |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (다크)                                                                                                 | 카드, 면                        |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                         | 들어간·가라앉은 채움            |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                         | 호버의 면                       |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                         | 활성(눌림)의 면                 |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                        | 주요 텍스트                     |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                         | 보조 텍스트                     |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                         | 비활성 텍스트                   |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                         | 기본 테두리                     |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                         | 더 은은한 테두리                |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                         | 호버 테두리                     |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                         | 활성 테두리                     |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                        | 주된 동작(흑백)                 |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` (다크) | primary의 호버                  |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` (다크) | primary의 눌림                  |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                   | primary 면 **위에** 얹히는 잉크 |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                        | 성공                            |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                        | 경고                            |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                          | 위험 / 오류                     |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                         | 링크                            |

`--ran-color-primary-hover` / `-active`는 시맨틱 층에 있는 두 개의 리터럴입니다. 스케일을 따라가는 대신 페이지 배경 쪽으로 다가가므로, 다크 모드에서는 이것들을 직접 다시 정의합니다.

### 강조색마다의 뜻

- **primary는 흑백입니다.** 라이트에서는 흰 바탕에 검정, 다크에서는 검은 바탕에 흰색(Geist의 브랜드 톤, `<r-button type="primary">`). 그 위의 텍스트와 아이콘은 `--ran-color-primary-text`를 쓰고, 이것도 함께 바뀝니다. 따로 "대비" 토큰은 없습니다. primary _자체가_ 대비가 가장 큰 동작입니다.
- **파랑은 남겨 둔 색입니다.** 링크(`--ran-color-link`)와 포커스 링을 위한 것입니다. primary의 대안이 아닙니다.
- **초록＝성공 · 호박＝경고 · 빨강＝위험.** 저마다 뜻은 하나입니다.

`--ran-color-error`는 없습니다. 토큰은 `--ran-color-danger`입니다. 선언되지 않은 속성을 가리키는 `var()`는 아무것으로도 풀리지 않고 선언 전체가 조용히 버려집니다. 그래서 이름이 틀렸을 때는 짐작하지 말고 이 표와 맞춰 보는 편이 낫습니다.

## 간격 {#spacing}

사물 사이의 틈, 곧 `padding`, `margin`, `gap`입니다. 기본 단위는 4px이고 값은 **아홉 개**, 그 이상은 없습니다.

| 토큰            | 값   | 토큰             | 값   |
| --------------- | ---- | ---------------- | ---- |
| `--ran-space-1` | 4px  | `--ran-space-8`  | 32px |
| `--ran-space-2` | 8px  | `--ran-space-10` | 40px |
| `--ran-space-3` | 12px | `--ran-space-16` | 64px |
| `--ran-space-4` | 16px | `--ran-space-24` | 96px |
| `--ran-space-6` | 24px |                  |      |

숫자는 4px의 배수라서 스케일은 건너뜁니다. `--ran-space-5`는 없습니다. 바로 그 점이 핵심입니다. 페이지의 리듬을 만드는 것은 제한된 선택지입니다.

## 크기

요소 자신의 치수입니다. 아이콘 크기, 컨트롤 높이, 작은 정사각형이나 직사각형 컨트롤 같은 것들.

| 토큰           | 값   | 흔한 쓰임                           |
| -------------- | ---- | ----------------------------------- |
| `--ran-size-1` | 16px | 체크박스의 상자, 작은 인라인 아이콘 |
| `--ran-size-2` | 18px | —                                   |
| `--ran-size-3` | 20px | 컨트롤 안의 아이콘                  |
| `--ran-size-4` | 24px | 툴바의 아이콘 버튼                  |
| `--ran-size-5` | 28px | 촘촘한 컨트롤의 높이                |
| `--ran-size-6` | 30px | —                                   |
| `--ran-size-7` | 32px | 기본 컨트롤 높이                    |

**이것은 일부러 간격과 별개로 둔 스케일이며**, 둘을 섞어 쓰는 것은 기계가 잡아내는 오류입니다(`sizing-scale`). 둘은 범위도 진행도 다릅니다(4px에서 배로 늘어나는 간격 스케일은 아이콘과 컨트롤 크기로는 어색한 값을 냅니다). 그리고 쓰는 쪽은 한쪽을 조정해도 다른 쪽을 흔들지 않을 수 있어야 합니다. 아이콘이 커졌다고 해서 우연히 같은 픽셀 값을 쓰던 모든 틈까지 넓어져서는 안 됩니다. 어떤 단이 간격의 단과 숫자로 겹칠 때(`--ran-size-4`와 `--ran-space-6`은 둘 다 24px입니다) 그것은 우연이지 별칭이 아닙니다.

다른 어떤 컴포넌트도 함께 쓰지 않는, 정말로 한 번뿐인 치수(예컨대 메뉴의 `min-width`)는 억지로 단에 밀어 넣지 말고, 자기 리터럴 대체값을 지닌 평범한 컴포넌트 토큰으로 남깁니다.

## 타이포그래피 {#typography}

| 토큰                | 값                                                            |
| ------------------- | ------------------------------------------------------------- |
| `--ran-font-family` | Geist / Geist Sans, 그다음 시스템 UI 스택                     |
| `--ran-font-mono`   | Geist Mono, 그다음 `ui-monospace`, SF Mono, Menlo, Consolas … |
| `--ran-font-size`   | `14px`(기준 크기)                                             |
| `--ran-line-height` | `1.5715`                                                      |

글자는 **역할**로 정리되고, 역할이 글꼴·크기·굵기·행간을 한꺼번에 정합니다.

| 역할        | 쓰임                      | 굵기 토큰                                                                      | 크기 토큰                                 |
| ----------- | ------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **heading** | 제목                      | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px) |
| **label**   | 한 줄로, 눈으로 훑는 것   | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)      |
| **copy**    | 여러 줄의 본문            | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)          |
| **button**  | 버튼의 글자               | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)           |
| **mono**    | 코드, 데이터, 작은 머리글 | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | label / copy의 크기를 빌립니다            |

역할이 제대로 자리 잡게 하려고만 있는 토큰이 둘 있습니다.

| 토큰                            | 값        | 이유                                                         |
| ------------------------------- | --------- | ------------------------------------------------------------ |
| `--ran-text-heading-tracking`   | `-0.03em` | 큰 표시 크기에서는 제목의 자간을 더 좁혀야 합니다.           |
| `--ran-text-button-line-height` | `1`       | 높이가 정해진 컨트롤 안에서 세로 가운데를 또렷하게 맞춥니다. |

Geist는 굵기의 상한이 600(세미볼드)입니다. 강조는 크기와 여백에서 나오지, 더 굵은 서체에서 나오지 않습니다. `--ran-text-copy-3`은 없습니다. 12px 단은 `--ran-text-label-3`입니다.

### 글꼴

ranui는 두 서체를 직접 호스팅합니다(가변 굵기 100–900, SIL OFL 1.1). 그래서 import 하나로 CDN 의존 없이 불러올 수 있습니다.

```js
import 'ranui/fonts'; // 번들러용
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

이것이 없으면 토큰은 시스템 글꼴 스택으로 물러납니다. 모든 것이 여전히 동작하지만 Geist 서체는 아닙니다.

## 모서리

| 토큰                | 값       | 쓰임새                   |
| ------------------- | -------- | ------------------------ |
| `--ran-radius-sm`   | `6px`    | 컨트롤: 버튼, 입력, 선택 |
| `--ran-radius-md`   | `12px`   | 카드, 대화 상자          |
| `--ran-radius-lg`   | `16px`   | 큰 면                    |
| `--ran-radius-full` | `9999px` | 알약 모양, 아바타        |

## 그림자 높이

그림자는 장식이 아니라 **역할**입니다. 단계는 그 요소가 무엇인지로 고르세요. 다크 모드에서는 셋 모두 갈아 끼웁니다. 흰 페이지에 맞춰 다듬은 그림자는 검은 페이지에서 사라지기 때문입니다.

| 토큰                    | 쓰임새                                                        | 라이트                                                          | 다크                                                                                        |
| ----------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | 흐름 속에 있으면서 테두리도 지닌 면: `r-card`, `r-section`    | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | 내용 위에 잠시 겹치는 층: 드롭다운, 선택 메뉴, 팝오버, 토스트 | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | 앞을 막는 대화 상자: `r-modal`                                | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

테두리 없는 오버레이는 주변과의 분리를 오로지 그림자에 기댑니다. 그래서 오버레이 단계에는 실제로 무게가 실려 있습니다. 오버레이가 들린 면 단계로 내려앉으면 납작해 보이고 페이지에 붙박인 것처럼 보입니다.

## 쌓임 {#stacking}

떠 있는 오버레이는 `<body>`로 포털되므로, 명시적인 단계가 필요합니다.

| 토큰               | 기본값 | 쓰임새                                                                                       |
| ------------------ | ------ | -------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000` | 앞을 막는 대화 상자와 그 마스크                                                              |
| `--ran-z-dropdown` | `1100` | 드롭다운 / 선택 메뉴 / 팝오버: 모달**보다 위**. 그래야 대화 상자 안의 select가 계속 보입니다 |
| `--ran-z-message`  | `1200` | 토스트와 알림: 언제나 맨 위                                                                  |

사다리가 1000에서 시작하는 것은 평범한 페이지 틀을 넘어서기 위해서입니다(내비게이션 바와 배경막은 보통 수십 대에 놓입니다). 단계를 덮어쓸 때는 `:root`에서, 또는 컴포넌트별로(`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`) 하고, `!important`는 절대 쓰지 마세요.

## 모션

| 토큰                         | 값      | 쓰임                  |
| ---------------------------- | ------- | --------------------- |
| `--ran-motion-duration-fast` | `0.15s` | 호버·활성 상태의 전환 |
| `--ran-motion-duration-base` | `0.2s`  | 팝오버, 메뉴          |
| `--ran-motion-duration-slow` | `0.35s` | 더 큰 등장            |

| 이징 토큰                    | 곡선                                | 성격                                   |
| ---------------------------- | ----------------------------------- | -------------------------------------- |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | 인-아웃. 범용                          |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | 빠르고 넘침 없음: 토글                 |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | 살짝 넘침: 버튼, 카드                  |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | 장난스러운 넘침: 좋아요, 장바구니 담기 |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | 차분하고 넘침 없음: 등장, 레이아웃     |

spring 계열은 다듬어진 SwiftUI 스프링에서 증류한 것입니다(response/damping을 한 번만 넘치는 베지어로 줄였습니다).

**이것들은 움직임 속성하고만 짝지으세요.** `transform`, `opacity`, 상자의 형상입니다. 팔레트 속성(`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`)에는 일부러 기본 트랜지션을 두지 않았습니다. CSS는 상호작용과 테마 전환을 구별하지 못하기 때문입니다. 색에 붙인 페이드는 라이트↔다크가 바뀔 때도 발동합니다. 그래도 다시 켜고 싶다면, 모든 컴포넌트가 `--ran-*-transition` 훅을 열어 둡니다.

## 포커스

| 토큰                             | 값                                                                   | 용도                                      |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | 표준 링. `box-shadow`로                   |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | _두_ 테마 모두에서 어두운 면을 위한 링 색 |

링은 두 겹입니다. 배경색의 안쪽 링과 파란 바깥 링. 그래서 어떤 면 위에서도 보이고, 이제 흑백이 된 primary를 따라가지 않고 파랑으로 남습니다.

`--ran-focus-ring-inverse-color`는 **일부러 다크 모드에서 다시 정의하지 않습니다.** 페이지 테마와 상관없이 자기 면이 늘 어두운 컴포넌트(임의의 영상 위에 얹히는 `r-player`의 컨트롤 바)를 위한 것이고, 그 면은 페이지가 바뀌어도 바뀌지 않기 때문입니다.

## 스킨 프리미티브

컴포넌트들이 함께 쓰는 구조적인 값 가운데, 색도 크기도 글자도 아닌 몇 안 되는 것들입니다. 일부러 최소로 유지합니다. 이 층은 예전에 훨씬 컸고, 대부분은 테마 팩과 함께 걷어냈습니다.

| 토큰                            | 값                           | 용도                                                                                |
| ------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | 컴포넌트가 그리는 테두리 두께                                                       |
| `--ran-skin-border-style`       | `solid`                      | 컴포넌트가 그리는 테두리 종류                                                       |
| `--ran-skin-border-image-width` | `4px`                        | `border-image-slice`의 안쪽 여백. button/checkbox/input/modal/message가 함께 씁니다 |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | 들린 면의 그림자. 스킨이 바꿀 수 있도록 한 번 거쳐 갑니다                           |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | 컴포넌트가 쓰는 서체. 같은 방식으로 한 번 거쳐 갑니다                               |

## 다크 모드가 다시 정의하는 것

`<html>`(또는 임의의 서브트리. [테마](/ko/src/ranui/theme/) 참고)에 붙은 `data-ran-theme="dark"`가 다시 정의하는 것은 **기본 팔레트뿐**입니다. 다만 스케일을 통해 풀 수 없는 예외가 셋 있습니다.

- 1층 전체: 회색, 회색 알파, 파랑, 빨강, 호박, 초록의 모든 단과 두 배경.
- `--ran-color-bg-elevated`. 다크에서는 `--ran-gray-100`을 가리켜, 카드가 검은 페이지에 묻히지 않고 들려 보이게 합니다.
- `--ran-color-primary-hover` / `-active`. 스케일 참조가 아니라 리터럴이기 때문입니다.
- 그림자 세 단계 모두. 어두운 바탕에 맞춰 다시 다듬습니다.

그 밖의 모든 것(다른 모든 시맨틱 토큰, 모든 크기, 모든 지속 시간)은 한 번만 정의됩니다.

## 컴포넌트 토큰

시맨틱 층 아래에서는 모든 컴포넌트가 자기 훅을 이렇게 이름 붙여 노출합니다.

```
--ran-{component}-{element}[-{state}]-{property}
```

예를 들어 `--ran-btn-hover-background`, `--ran-select-search-active-border-width`입니다. 기본값은 시맨틱 토큰으로 물러납니다: `var(--ran-btn-background, var(--ran-color-primary, #171717))`. 그래서 시맨틱 토큰 하나를 덮어쓰면 그 전부에 닿고, 컴포넌트 토큰을 덮어쓰면 변화가 요소 하나로 좁혀집니다.

생성된 전체 목록은 저장소의 [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)에 있습니다. 요소별 API는 [여기](/ko/src/ranui/api)에 있습니다. 적용하는 법은 [테마](/ko/src/ranui/theme/#customizing-tokens)를 보세요.

## 내 CSS에서 토큰 쓰기 {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

세 가지 규칙이 그것을 다크에서도 안전하게 지켜 줍니다.

1. 테마를 따라야 하는 것에는 **날 16진수를 쓰지 마세요.**
2. **대체값은 함께 바뀌는 토큰을 가리켜야 합니다**: `var(--ran-color-text, var(--ran-gray-1000))`이지, `var(--ran-color-text, #171717)`이 아닙니다.
3. **대체값은 존재하는 토큰을 가리켜야 합니다.** 그러지 않으면 선언이 버려지고, 요소는 물려받은 값을 조용히 지닌 채로 남습니다.

> 라이브러리가 선언하는 전역 토큰은 모두 이 페이지에 실려 있고, 여기에 적지 않은 채 토큰을 늘리면 단위 테스트가 실패합니다. 컴포넌트 범위의 토큰은 따로 생성되어 [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)에 있습니다.
