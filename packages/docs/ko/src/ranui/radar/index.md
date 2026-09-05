---
description: '한 데이터셋의 여러 지표를 2D 캔버스 위에서 견주어 보는 레이더(거미줄) 차트.'
---

# Radar

한 데이터셋의 여러 지표를 이차원 캔버스 위에서 견주어 보는 레이더 차트입니다.

> **이럴 때 쓰세요.** 한 데이터셋의 여러 지표를 비교할 레이더 차트가 필요할 때. 축 이름과 점수의 JSON 배열을 `abilitys` 어트리뷰트로 `<r-radar>`에 넘기세요.

## 빠른 시작

### 기본 사용법

데이터는 `abilitys` 어트리뷰트에 **JSON 문자열**(객체 배열)로 넘깁니다. HTML 어트리뷰트는 문자열만 담을 수 있으므로 값은 올바른 JSON이어야 하고, 내부에서 `JSON.parse`로 해석됩니다. `<r-radar>` 호스트는 고유 크기가 없으니 너비와 높이를 명시적으로 주세요.

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

`abilitys` JS 프로퍼티로 명령형으로 지정할 수도 있습니다. 배열(어트리뷰트로 다시 문자열화됩니다)이나 JSON 문자열을 받습니다.

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: '체력', scoreRate: 10 },
  { abilityName: '공격력', scoreRate: 90 },
  { abilityName: '방어력', scoreRate: 20 },
];
chart.append(radar);
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티       | 타입               | 기본값                                       | 설명                                           |
| -------------- | ------------------ | -------------------------------------------- | ---------------------------------------------- |
| `abilitys`     | `string` / `Array` | `''`                                         | 차트 데이터. JSON 문자열(JS 프로퍼티라면 배열) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | 동심 격자 다각형의 색                          |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | 축선과 바깥 테두리의 색                        |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | 데이터 영역의 채움 색                          |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | 데이터 영역 윤곽선과 꼭짓점 점의 색            |
| `sheet`        | `string`           | `''`                                         | 컴포넌트의 섀도 DOM에 주입할 CSS               |

`abilitys` 배열의 각 항목은 다음 키를 받습니다.

| 키                | 타입     | 필수   | 설명                                      |
| ----------------- | -------- | ------ | ----------------------------------------- |
| `abilityName`     | `string` | 예     | 축 레이블 텍스트                          |
| `scoreRate`       | `number` | 예     | 그 축의 값. 격자의 최대는 `100` 입니다    |
| `backgroundColor` | `string` | 아니오 | 레이블 배경색(기본은 투명)                |
| `fontSize`        | `number` | 아니오 | 레이블 글자 크기(기본은 차트에 맞춘 크기) |
| `fontColor`       | `string` | 아니오 | 레이블 글자색(기본은 `--ran-color-text`)  |
| `fontFamily`      | `string` | 아니오 | 레이블 글꼴(기본은 `SimHei`)              |

> 참고: `colorPolygon`, `colorLine`, `fillColor`, `strokeColor`는 대소문자를 가리지 않고 읽히므로, 어트리뷰트가 처음부터 있든 마운트 후에 바뀌든 제대로 그려집니다. 어느 것을 갱신해도 차트가 다시 그려집니다. 테마를 따르는 스타일을 원하면 아래 CSS 변수를 먼저 쓰세요.

### 차트 데이터 `abilitys`

축별 레이블 스타일(`backgroundColor`, `fontSize`, `fontColor`)은 항목마다 따로 지정할 수 있습니다.

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"체력","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"체력","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

### 격자 다각형 색 `colorPolygon`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

### 축선 색 `colorLine`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

### 영역 채움 색 `fillColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

### 영역 윤곽선 색 `strokeColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"체력","scoreRate":"10"},{"abilityName":"공격력","scoreRate":"90"},{"abilityName":"방어력","scoreRate":"20"},{"abilityName":"원소 마스터리","scoreRate":"50"},{"abilityName":"치명타 확률","scoreRate":"80"},{"abilityName":"치명타 피해","scoreRate":"50"}]'
></r-radar>
```

### 전체 예제 데이터

HTML의 `attribute`는 `string`만 담을 수 있으므로, 넘기는 데이터는 `json` 문자열이어야 하고 `JSON.parse`로 객체 배열로 되돌아갑니다. `JSON` 형식이 어긋나면 해석할 수 없습니다.

```json
[
  {
    "abilityName": "체력",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "공격력",
    "scoreRate": "90"
  },
  {
    "abilityName": "방어력",
    "scoreRate": "20"
  },
  {
    "abilityName": "원소 마스터리",
    "scoreRate": "50"
  },
  {
    "abilityName": "치명타 확률",
    "scoreRate": "80"
  },
  {
    "abilityName": "치명타 피해",
    "scoreRate": "50"
  }
]
```

### CSS 변수

차트 색은 호스트의 CSS 커스텀 프로퍼티로도(테마에 반응하게) 지정할 수 있습니다.

| 변수                        | 기본값                                | 설명                         |
| --------------------------- | ------------------------------------- | ---------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | 격자 다각형 색               |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | 축선 색                      |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | 데이터 영역 채움 색          |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | 데이터 영역 윤곽선 색        |
| `--ran-radar-width`         | `100%`                                | 캔버스 컨테이너 너비         |
| `--ran-radar-height`        | `100%`                                | 캔버스 컨테이너 높이         |
| `--ran-radar-display`       | `block`                               | 캔버스 컨테이너의 `display`  |
| `--ran-radar-position`      | `relative`                            | 캔버스 컨테이너의 `position` |

레이블 글자색도 테마 토큰 `--ran-color-text`로 물러나므로, 라이트에서도 다크에서도 레이블이 읽힙니다.

## 이벤트

없습니다. `<r-radar>`는 커스텀 이벤트를 디스패치하지 않습니다.

## 권장 사항

- **크기**: 호스트에는 고유 크기가 없습니다. 언제나 `width`/`height`를 명시적으로(`style`이나 `--ran-radar-width`/`--ran-radar-height` 변수로) 지정하세요. 컨테이너 크기가 바뀌면 `ResizeObserver`로 감지해 차트가 자동으로 다시 그려집니다.
- **데이터 형식**: `abilitys`에는 올바른 JSON을 넘기세요. 형식이 어긋난 JSON은 기록되고 해석되지 않습니다. 코드에서 진짜 배열을 다룰 때는 `abilitys` JS 프로퍼티를 쓰세요.
- **척도**: `scoreRate`는 고정된 최대값 `100`을 기준으로 잽니다. 값을 그 범위로 정규화하세요.
- **테마**: 색 어트리뷰트(`colorPolygon`, `colorLine`, `fillColor`, `strokeColor`)는 반응형이라 마운트 뒤에 바꾸면 차트를 다시 그립니다. 색이 라이트/다크 테마를 저절로 따르게 하려면 `--ran-radar-*` CSS 변수를 먼저 쓰세요.
