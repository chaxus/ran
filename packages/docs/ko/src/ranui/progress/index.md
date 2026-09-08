---
description: 'ranui의 Progress(<r-progress>)는 작업 진행도를 막대로 보여 주며, 끌 수 있는 손잡이를 붙일 수도 있습니다.'
---

# Progress

작업 진행도를 보여 주는 진행 막대이며, 끌 수 있는 손잡이를 붙일 수 있습니다.

> **이럴 때 쓰세요.** 작업 진행도를 보여 줄 막대가 필요할 때. 읽기 전용 진행도에는 `<r-progress>`를 그대로 쓰고, 사용자가 손잡이를 끌어 값을 정해야 한다면 `type="drag"`를 쓰세요.

## 빠른 시작

<ran-demo>
  <r-progress percent="40%"></r-progress>
</ran-demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **팁**: `r-progress`는 고유 너비가 없는 블록 레벨 엘리먼트입니다. flex 행 안에서는 너비가 0으로 눌릴 수 있으니, 명시적 너비(예: `style="width:100%"`)를 주거나 블록 맥락에 두세요.

## API 레퍼런스

### 프로퍼티

| 프로퍼티  | 타입     | 기본값      | 설명                                                         |
| --------- | -------- | ----------- | ------------------------------------------------------------ |
| `percent` | `string` | `'0'`       | 현재 진행도. 숫자나 백분율을 받습니다. `total`이 상한입니다. |
| `total`   | `string` | `'100'`     | 전체 진행량. 숫자나 백분율을 받습니다.                       |
| `type`    | `string` | `'primary'` | 막대 종류: `primary`(정적) 또는 `drag`(클릭·드래그 가능).    |
| `dot`     | `string` | `'true'`    | 드래그 손잡이를 보일지: `true` 또는 `false`.                 |
| `sheet`   | `string` | `''`        | 컴포넌트의 섀도 DOM에 주입할 CSS.                            |

### 진행 값 `percent`

현재 진행도를 지정합니다. 숫자나 백분율 문자열을 받으며 `total`을 넘을 수 없습니다. `total`을 지정하지 않으면 기본값이 `100`이므로, `percent`는 100에 대한 백분율로 읽힙니다.

<ran-demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### 전체 진행량 `total`

`percent`의 분모를 지정합니다. 숫자와 백분율 모두 쓸 수 있어서 `percent="30" total="1000"`이면 막대가 3% 찹니다.

<ran-demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### 막대 종류 `type`

- `primary`: 정적 진행 막대. `type`을 지정하지 않았을 때의 기본값입니다.
- `drag`: 클릭하고 끌 수 있는 진행 막대. 트랙을 클릭하거나 손잡이를 끌면 `percent`가 갱신되고 `change` 이벤트가 발생합니다. 손잡이를 끌려면 `dot="true"`가 필요합니다.

<ran-demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### 드래그 손잡이 `dot`

손잡이 표시를 켜고 끕니다. 손잡이는 `dot="true"` **이면서** `type="drag"`일 때만 그려집니다. 정적인 `primary` 막대에서는 일부러 빼므로, 거기서는 `dot`이 눈에 보이는 효과를 내지 않습니다.

<ran-demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## 이벤트

### `change`

`drag` 종류에서 사용자가 트랙을 클릭하거나 손잡이를 끌어 `percent`가 바뀔 때마다 디스패치됩니다. `detail` 객체가 담는 값은 다음과 같습니다.

| 필드      | 타입     | 설명        |
| --------- | -------- | ----------- |
| `value`   | `string` | 현재 진행도 |
| `percent` | `string` | 현재 진행도 |
| `total`   | `string` | 전체 진행량 |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## CSS Part

| Part    | 설명                  |
| ------- | --------------------- |
| `track` | 진행 트랙(배경).      |
| `fill`  | 트랙에서 채워진 부분. |
| `dot`   | 드래그 손잡이.        |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## 권장 사항

- **정적 막대**: 읽기 전용 진행도에는 기본값 `type="primary"`를 쓰세요.
- **조작 가능한 막대**: 사용자가 값을 정해야 한다면 `type="drag"`를 쓰고 `change` 이벤트를 구독하세요.
- **백분율과 숫자**: `percent`와 `total`은 자유롭게 섞어 쓰세요. 알려진 전체량에 대응하는 원 숫자를 넘겨도 되고, 직접 제어하려면 백분율을 써도 됩니다.
- **레이아웃 너비**: flex 레이아웃에서 눌리지 않도록 막대를 블록 컨테이너로 감싸거나 명시적 너비를 지정하세요.
