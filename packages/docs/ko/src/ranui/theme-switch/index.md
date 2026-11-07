---
description: '색 테마 (system / light / dark) 셀렉트. ranui 테마 API 에 연결.'
---

# ThemeSwitch

색 테마 (**system / light / dark**) 용 컴팩트 **select**. ranui
[테마 API](/ko/ranui/theme/)에 연결됩니다. 선택하면 `setTheme()`가 호출되고 `ran-theme`에
저장되며 페이지 (다른 탭 포함) 의 인스턴스가 동기화됩니다. 스타일 / 리퀴드 글래스는 별도 축입니다.
`<r-surface-switch>`를 사용하세요.

> **사용할 때**: 바로 쓸 수 있는 색 테마 컨트롤이 필요할 때.

## 빠른 시작

### 기본 사용

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

페이지 로드 시 `initTheme()`를 한 번 호출하세요.

```js
import { initTheme } from 'ranui';
initTheme();
```

## API 참고

### 속성

| 속성    | 타입                            | 기본값     | 설명                                                    |
| ------- | ------------------------------- | ---------- | ------------------------------------------------------- |
| `value` | `'system' \| 'light' \| 'dark'` | `'system'` | `getTheme()`의 현재 값. 할당하면 적용·저장됩니다.      |
| `sheet` | `string`                        | `''`       | Shadow DOM 에 주입하는 CSS.                              |

### 로컬라이즈 속성

| 속성           | 기본값     | 설명                      |
| -------------- | ---------- | ------------------------- |
| `label`        | `'Theme'`  | select 의 `aria-label`.    |
| `label-system` | `'System'` | system 옵션 문구.         |
| `label-light`  | `'Light'`  | light 옵션 문구.          |
| `label-dark`   | `'Dark'`   | dark 옵션 문구.           |

## 이벤트

| 이벤트   | Detail                                     | 설명                                      |
| -------- | ------------------------------------------ | ----------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | 테마 선택 시. 버블링되며 Shadow DOM 을 통과. |

## CSS Parts

| Part                        | 설명                |
| --------------------------- | ------------------- |
| `select`                    | 내부 `r-select`.    |
| `option`                    | 각 `r-option`.      |
| `system` / `light` / `dark` | 개별 옵션.          |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
