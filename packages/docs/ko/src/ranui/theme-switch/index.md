---
description: 'ranui 의 테마 API 에 연결된 시스템/라이트/다크 3 상태 세그먼트 컨트롤. 탭 사이에서도 동기화됩니다.'
---

# ThemeSwitch

ranui 의 [테마 API](/ko/src/ranui/theme/)에 연결된 3 상태 (**시스템 / 라이트 / 다크**) 세그먼트
컨트롤입니다. 세그먼트를 누르면 `setTheme()`를 호출하고, 선택을 localStorage 키 `ran-theme`에
저장하며, 페이지 안 (그리고 다른 탭) 의 모든 인스턴스를 같은 상태로 유지합니다.

> **이럴 때 쓰세요.** ranui 테마 API 에 이미 연결된 시스템/라이트/다크 세그먼트 컨트롤이 필요할 때. `<r-theme-switch>`가 저장, 시스템 추종, 탭 간 동기화를 맡으므로 토글을 직접 만들 필요가 없습니다.

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // 또는 단독 엔트리:
import 'ranui/theme-switch';
```

> 💡 **이 문서 사이트에서는** 헤더의 사이트 전역 토글이 테마를 쥐고 있으며 `data-ran-theme`를
> 스스로 덮어씁니다. 그래서 위 데모가 사이트에 의해 되돌려질 수 있습니다. 여러분의 앱에서는
> `<r-theme-switch>`가 유일한 진실의 원천입니다.

저장된 선택이 스위치가 그려지기 전에 복원되도록, 페이지 로드 때 `initTheme()`를 한 번 호출하세요.

```js
import { initTheme } from 'ranui';
initTheme();
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입                            | 기본값     | 설명                                                                                     |
| -------- | ------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `value`  | `'system' \| 'light' \| 'dark'` | `'system'` | 현재 선택. 테마 API(`getTheme()`) 에서 읽습니다. 값을 넣으면 테마를 적용하고 저장합니다. |
| `sheet`  | `string`                        | `''`       | 컴포넌트의 섀도 DOM 에 주입할 CSS.                                                       |

### 지역화 어트리뷰트

세 버튼은 아이콘만 있으므로 각각 `aria-label`을 가집니다. 지역화하려면 덮어쓰세요.

| 어트리뷰트     | 기본값           | 설명                        |
| -------------- | ---------------- | --------------------------- |
| `label`        | `'Theme'`        | 컨트롤 묶음의 `aria-label`. |
| `label-system` | `'System theme'` | 시스템 버튼의 `aria-label`. |
| `label-light`  | `'Light theme'`  | 라이트 버튼의 `aria-label`. |
| `label-dark`   | `'Dark theme'`   | 다크 버튼의 `aria-label`.   |

```html
<r-theme-switch
  label="테마"
  label-system="시스템 테마"
  label-light="라이트 테마"
  label-dark="다크 테마"
></r-theme-switch>
```

## 이벤트

| 이벤트   | Detail                                     | 설명                                                           |
| -------- | ------------------------------------------ | -------------------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | 사용자가 테마를 고를 때 발생. 버블링되고 섀도 DOM 을 넘습니다. |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## 동작

- **저장**: 선택은 `setTheme()`를 거치므로 localStorage(`ran-theme`) 에 저장되고 다음 방문 때
  `initTheme()`가 복원합니다.
- **여러 인스턴스 동기화**: 헤더와 푸터에 하나씩 두어도, 어느 쪽에서 테마를 고르든 둘 다 갱신됩니다.
- **탭 간 동기화**: 다른 탭에서 바꾼 테마가 `storage` 이벤트를 통해 이 컨트롤에도 반영됩니다.
- **브라우저 크롬**: 라이트/다크를 강제하면 `<meta name="theme-color">`가 해석된 페이지 배경으로
  갱신되어 브라우저·PWA 크롬이 어울립니다. `system`을 고르면 각 meta 의 원래 내용 (미디어 조건이 붙어
  있을 수도 있는) 이 되돌아옵니다.

## CSS Part

| Part                        | 설명                                                           |
| --------------------------- | -------------------------------------------------------------- |
| `switch`                    | 바깥쪽 세그먼트 알약.                                          |
| `button`                    | 모든 선택 버튼 (각 버튼은 자기 선택 이름도 추가 part 로 노출). |
| `system` / `light` / `dark` | 개별 선택 버튼.                                                |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

덮어쓸 수 있는 CSS 변수: `--ran-theme-switch-display`, `--ran-theme-switch-gap`,
`--ran-theme-switch-padding`, `--ran-theme-switch-border-color`, `--ran-theme-switch-radius`,
`--ran-theme-switch-background`, `--ran-theme-switch-button-size`, `--ran-theme-switch-icon-size`,
`--ran-theme-switch-button-color`, `--ran-theme-switch-button-hover-color`,
`--ran-theme-switch-button-active-background`, `--ran-theme-switch-button-active-color`,
`--ran-theme-switch-button-focus-outline`.

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## 권장 사항

- **진실의 원천은 하나로**: 토글을 직접 만들지 말고 `<r-theme-switch>`를 쓰세요. 저장, 시스템 추종,
  인스턴스 동기화, `theme-color` meta 까지 이미 처리합니다.
- **일찍 복원하세요**: 라이트에서 다크로 번쩍이는 것을 피하려면 `initTheme()`를 되도록 일찍
  (가능하면 첫 페인트 전에 인라인으로) 호출하세요.
- **지역화하세요**: 버튼은 아이콘뿐입니다. 영어가 아닌 UI 에서는 `label` / `label-*`를 지정하세요.
