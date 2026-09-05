---
description: '채도/명도, 색상, 투명도 컨트롤과 HEX/RGB 입력을 갖춘 패널을 여는 작은 색 견본.'
---

# Color Picker

채도·명도 팔레트, 색상 슬라이더, 투명도 슬라이더, HEX/RGB 값 입력을 갖춘 팝오버 패널을 여는 작은 색 견본입니다. `value`는 표준 CSS 색 문자열을 받고 내보냅니다.

> **이럴 때 쓰세요.** 채도·색상·투명도 패널과 HEX/RGB 입력으로 색을 고르게 하고 싶을 때. `<r-colorpicker>`는 표준 CSS 색 문자열을 받고 내보내며, `change`에서 모든 형식을 함께 알려 줍니다.

## 빠른 시작

### 기본 사용법

<Demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

견본을 클릭하거나 (또는 포커스를 준 뒤 Enter/Space를 눌러) 패널을 엽니다. 색상과 투명도 슬라이더는 키보드로도 조작됩니다. 화살표 키는 1 씩, Shift+ 화살표는 10 씩 움직이고, Home/End는 양 끝으로 뜁니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입      | 기본값  | 설명                                                                    |
| ---------- | --------- | ------- | ----------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | 현재 색. CSS 색 문자열 (HEX, `rgb(...)`, `rgba(...)`)                   |
| `disabled` | `boolean` | `false` | 있으면 견본이 열리지 않고 탭 순서에서 빠지며 `aria-disabled`가 붙습니다 |
| `sheet`    | `string`  | `''`    | 컴포넌트의 섀도 DOM 에 주입할 CSS                                       |

### 값 `value`

현재 색을 CSS 색 문자열로 나타냅니다. 입력으로는 HEX(`#1677FF`, `#fff`), `rgb(...)`, `rgba(...)`를 받습니다. 읽어 낼 때의 표준형은 완전히 불투명하면 6 자리 HEX 문자열, 투명도가 1 보다 작으면 `rgba(...)` 문자열입니다.

<Demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // 현재 색을 읽습니다
toolbar.append(picker);
```

### 비활성 `disabled`

`disabled` 어트리뷰트를 붙이면 피커가 반응하지 않습니다. 견본은 마우스로도 키보드로도 패널을 열지 않고, 탭 순서에서 빠지며, 호스트에 `aria-disabled="true"`가 붙습니다. 어트리뷰트를 빼면 평소대로 돌아옵니다.

<Demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // 조작 막기
picker.disabled = false; // 다시 켜기
toolbar.append(picker);
```

### 외부 스타일 `sheet`

컴포넌트의 섀도 DOM 에 주입하는 CSS 로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## 이벤트

### `change`

색이 바뀔 때마다 발생합니다. 팔레트를 끌거나, 슬라이더를 움직이거나, 값 입력을 고치거나, `value` 어트리뷰트를 지정할 때 모두 해당합니다. **버블링**되고 **composed**입니다 (섀도 경계를 넘습니다). `event.detail`은 색을 모든 형식으로 담습니다.

| 필드    | 타입     | 예시                                      |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## CSS Part

패널을 여는 견본은 섀도 DOM 바깥에서 스타일을 줄 수 있도록 part 두 개를 공개합니다.

| Part     | 설명                                      |
| -------- | ----------------------------------------- |
| `block`  | 견본 컨테이너 (체커보드를 깐 트리거 상자) |
| `swatch` | 현재 색을 보여 주는 안쪽 채움             |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

팝오버 패널은 `document.body`로 포털되므로, 그 스타일은 이름 공간이 붙어 있고 (`.ran-color-picker-*`) 호스트가 아니라 패널을 따라다닙니다.

### CSS 변수

견본은 다음 토큰을 읽습니다.

| 변수                                    | 쓰임                         |
| --------------------------------------- | ---------------------------- |
| `--ran-colorpicker-background`          | 견본 배경                    |
| `--ran-colorpicker-border`              | 견본 테두리                  |
| `--ran-colorpicker-hover-border-color`  | 마우스를 올렸을 때 테두리 색 |
| `--ran-colorpicker-border-radius`       | 견본 모서리 반경             |
| `--ran-colorpicker-block-border-radius` | 안쪽 블록의 모서리 반경      |
| `--ran-colorpicker-transition`          | 호버 전환                    |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## 권장 사항

- **입력 형식**: `value`에는 어떤 CSS 색 문자열이든 넣으세요. HEX, `rgb(...)`, `rgba(...)` 모두 피커가 내부에서 정규화합니다.
- **결과 읽기**: `change`를 구독하고 필요한 형식을 `event.detail`에서 읽으세요 (`hex`, `rgb`, `rgba`, `alpha`).
- **투명도**: 투명도가 필요하면 `rgba(...)` 입력이나 투명도 슬라이더를 쓰세요. 투명도가 1 아래로 내려가면 읽어 낸 `value`가 `rgba(...)` 문자열이 됩니다.
- **키보드**: 견본과 두 슬라이더 모두 포커스가 가고 키보드로 조작됩니다. 마우스가 없어도 됩니다.
- **불러오기**: `import 'ranui'`(모든 컴포넌트 등록) 나 단독 `import 'ranui/colorpicker'`로 불러오세요.
