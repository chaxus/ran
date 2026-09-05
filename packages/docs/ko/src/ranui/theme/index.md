---
description: 'ranui 의 런타임 테마 체계: initTheme / setTheme / getTheme, 라이트·다크·시스템 모드, 범위를 좁힌 적용, 런타임 토큰 덮어쓰기.'
---

# Theming

ranui 스타일링의 **런타임** 쪽 절반입니다. 라이트·다크·시스템 모드 전환, 선택 저장, 그리고 토큰을
그 자리에서 덮어쓰는 일을 다룹니다.

토큰 자체 (이름이 무엇이고 각각 무엇을 위한 것인지) 는 [디자인 시스템](/ko/src/ranui/design-system/)이고,
그중 무엇을 고를지의 규칙은 [디자인 가이드](/ko/src/ranui/design-guides/)입니다. 이 페이지는 그것을
_적용하는_ 이야기만 합니다.

> **이럴 때 쓰세요.** ranui 앱에 라이트/다크 테마가 필요할 때. 로드 시 `initTheme`을 한 번 부르고,
> 전환에는 `setTheme`을, 추가 CSS 없이 개별 토큰을 덮어쓰고 싶으면 `setThemeToken(s)`을 쓰세요.

테마는 정확히 둘, **light**와 **dark**입니다. 여기에 OS 설정을 따르는 **system** 모드가 더해집니다.
(예전의 '테마 팩' API 는 제거되었습니다. `setThemePack` / `RanThemePackName`은 더 이상 없습니다.)

## 빠른 시작

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// localStorage 에 저장된 테마 ('light' | 'dark' | 'system') 를 복원
initTheme();

// 테마 전환 — 자동으로 저장됩니다
setTheme('dark');
setTheme('system'); // prefers-color-scheme 를 따라가며 실시간으로 갱신합니다

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

전용 **`ranui/theme`** 엔트리는 테마 엔진만 담고 있습니다. import 해도 커스텀 엘리먼트를 하나도 등록하지
않으므로, 토큰과 다크 모드만 필요한 페이지가 컴포넌트 라이브러리를 끌어오지 않습니다. 같은 함수들은
최상위 `ranui` 배럴에서도 다시 내보냅니다.

`setTheme`은 `<html>`에 `data-ran-theme`(그리고 예전의 `theme`) 어트리뷰트를 씁니다. 모든 컴포넌트
스타일이 그것에 반응합니다. 선택은 localStorage 의 `ran-theme` 키에 저장됩니다.

바로 쓸 수 있는 전환 UI 가 필요하면 [`<r-theme-switch>`](/ko/src/ranui/theme-switch/)를 쓰세요. 이 API 에
이미 연결되어 있고, 인스턴스끼리 동기화되며, `theme-color` meta 도 갱신하는 시스템/라이트/다크 세그먼트
컨트롤입니다.

## API

| 함수              | 시그니처                                                                | 설명                                                                                                   |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | `localStorage`에 저장된 테마를 복원합니다. 로드 때 한 번 부르세요. SSR 에서는 아무 일도 하지 않습니다. |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | `'light'` \| `'dark'` \| `'system'`을 적용하고 저장합니다. `'system'`은 OS 를 실시간으로 따라갑니다.   |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | 활성 테마를 읽습니다. 시스템 모드면 `'system'`, 지정된 게 없으면 `''`을 돌려줍니다.                    |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | 런타임에 토큰 하나를 덮어씁니다 (대상에 인라인 스타일로).                                              |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | 여러 토큰을 한 번에 덮어씁니다. 값이 `null` / `undefined`면 그 토큰을 지웁니다.                        |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | 런타임 토큰 덮어쓰기를 없앱니다.                                                                       |

**타입**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // 기본값은 document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**: 모든 함수는 기본으로 `<html>`(`document.documentElement`) 을 대상으로 합니다. 엘리먼트를
넘기면 페이지 전체가 아니라 하위 트리에만 테마나 토큰 덮어쓰기를 한정할 수 있습니다.

**SSR 안전**: `document` / `localStorage` / `matchMedia` 접근이 모두 보호되어 있어, 서버 렌더링 중에는
이 함수들이 아무 일도 하지 않습니다 (예외도 던지지 않습니다).

## 다크 모드가 동작하는 방식

`setTheme('dark')`은 `<html>`에 `data-ran-theme="dark"`를 지정합니다. 그러면 스타일시트가 단일한 진실의
원천에서 **기본 팔레트만** 다크용으로 다시 정의합니다. 모든 `--ran-color-*` 의미 토큰이 `var()`를 통해 그
팔레트를 참조하므로 저절로 뒤집히고, 어떤 컴포넌트도 자기만의 다크 모드 덮어쓰기를 갖지 않습니다.

알아 둘 만한 결과가 둘 있습니다.

- **여러분의 CSS 도 의미 토큰을 쓰면 다크 모드를 공짜로 얻습니다.** 색을 직접 박아 넣거나 라이트 전용
  대비값을 쓰면 어긋납니다. [내 CSS 에서 토큰 쓰기](/ko/src/ranui/design-system/#using-tokens-in-your-own-css)를
  보세요.
- **테마가 뒤집힐 때는 아무것도 전환해서는 안 됩니다.** CSS 는 색이 왜 바뀌었는지 알 수 없으므로, 팔레트
  프로퍼티에 `transition`이 걸려 있으면 테마를 바꿀 때 모든 엘리먼트가 저마다의 속도로 흐릿하게 변합니다.
  ranui 컴포넌트는 일부러 그렇게 하지 않습니다. 여러분 것도 그러지 마세요.

## 토큰 맞춤 {#customizing-tokens}

### 런타임에서 (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// 토큰 하나를 <html>에 (전체에 영향)
setThemeToken('--ran-color-primary', '#7c3aed');

// 여러 개를 한꺼번에
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// 하위 트리로 한정
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// 덮어쓰기 제거
clearThemeToken('--ran-color-primary');
```

### 빌드 타임에서 (CSS)

`:root`나 원하는 어떤 범위에서든 토큰을 덮어쓰세요.

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### 어느 층을 덮어쓸까

다크 모드가 다시 정의하는 것은 기본 팔레트뿐이므로:

- 두 테마에서 똑같아야 하는 변경에는 **의미** 토큰 (`--ran-color-primary`) 을 덮어쓰세요.
- 테마와 함께 뒤집혀야 하는 변경에는 **기본** 스케일의 단계 (`--ran-blue-700`) 를 덮어쓰세요. 그것을
  참조하는 모든 의미 토큰이 따라옵니다.
- 정확히 한 엘리먼트만 바꾸려면 **컴포넌트** 토큰 (`--ran-btn-hover-background`) 을 덮어쓰세요.

이 층 구조는 [디자인 시스템](/ko/src/ranui/design-system/#two-layers) 페이지에서 온전히 설명합니다.
런타임 덮어쓰기는 대상에 붙는 인라인 스타일이라는 점을 기억하세요. 그 하위 트리에서는 스타일시트 규칙을
이깁니다. 패널마다 다른 테마를 가능하게 하는 것도 이것이고, 지우는 것을 잊은 덮어쓰기를 나중에 찾기
어렵게 만드는 것도 이것입니다.

## 테마를 페이지 일부에만 한정하기

모든 함수가 대상을 받으므로, 미리보기 패널만 주변 페이지와 다른 테마로 돌릴 수 있습니다.

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // 이 하위 트리만
getTheme(preview); // → 'dark'
```

어트리뷰트가 `<html>`이 아니라 그 엘리먼트에 붙고, 나머지는 토큰 캐스케이드가 해 줍니다.
