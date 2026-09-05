---
description: 'ranui 의 Icon(<r-icon>) 은 크기와 색을 제어할 수 있는 의미 있는 벡터 그래픽 (SVG) 을 그립니다.'
---

# Icon

크기와 색을 제어할 수 있는 의미 있는 벡터 그래픽 (SVG) 을 그립니다.

> **이럴 때 쓰세요.** 이름으로 지정하고 크기와 색을 바꿀 수 있는 (회전 애니메이션은 선택) 벡터 아이콘을 UI 안에 넣어야 할 때. `<r-icon>`은 `name`으로 등록된 SVG 를 그립니다.

## 아이콘 사용법

### 가장 쉬운 방법: 기본 제공 이름 그대로 쓰기 (설정 없음)

ranui 는 아이콘 세트를 **패키지 안에 인라인으로 담고** 있습니다. 기본 제공 `name`은 **필요할 때 스스로 로드**됩니다. 등록도, import 도, 자산 경로 배선도 필요 없습니다. 실제로 쓴 SVG 만 가져오므로 (각각 별도의 비동기 청크입니다) 아이콘 하나를 참조한다고 세트 전체가 딸려 오지 않습니다.

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

유효한 기본 제공 이름은 `RanIconName` 유니온 타입 / `RAN_ICON_NAMES` 튜플입니다 (아래 참고). 한 번도 등록하지 않은 **커스텀** 이름은 여전히 **아무것도 그리지 않습니다**(빈 자리). 이는 여러분의 SVG 에만 해당하며, [커스텀 아이콘](#custom-icons)에서 다룹니다.

### 선택: 세트 전체를 미리 등록하기

기본 제공 아이콘을 모두 **동기적으로** 쓰고 싶다면 (아이콘이 많은 화면에서 첫 페인트 번쩍임을 피하거나, 코드 분할이 없는 환경에서), 가능한 한 이른 시점에 `registerBuiltinIcons()`를 한 번만 부르세요.

```ts
import { registerBuiltinIcons } from 'ranui'; // 또는 'ranui/icons'

registerBuiltinIcons(); // RAN_ICON_NAMES 의 모든 이름을 미리 등록합니다 (약 15 KB)
```

유효한 이름은 `RanIconName` 유니온 타입과 `RAN_ICON_NAMES` 튜플로 공개됩니다 (편집기가 자동 완성해 주고 오타는 타입 검사에서 잡힙니다).

`add-user`、`arrow-down`、`book`、`check-circle`、`check-circle-fill`、`close`、`close-circle`、`close-circle-fill`、`drop`、`eye`、`eye-close`、`github`、`globe`、`home`、`info-circle`、`info-circle-fill`、`issue`、`loading`、`loading-scene`、`lock`、`menu`、`message`、`more`、`plus`、`power-off`、`preview`、`search`、`setting`、`sort`、`team`、`unlock`、`user`、`warning-circle`、`warning-circle-fill`、`without-content`

### 커스텀 아이콘 {#custom-icons}

직접 만든 SVG(어떤 아이콘 라이브러리든, 빌드의 자산 파이프라인이든) 를 등록하려면 원본 SVG 문자열을 `registerIcons` / `registerIcon`에 넘기세요.

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // 번들러가 SVG 를 원본 문자열로 노출하는 방식대로

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // 인라인 문자열 — 자산 파일이 필요 없습니다
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

원본 SVG 마크업을 `name`에 곧바로 넘기면 레지스트리를 아예 건너뛸 수도 있습니다 (`<svg`로 시작하면 그대로 그려집니다).

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **참고:** 원본 `assets/icons/*.svg` 파일은 배포된 npm 패키지에 **들어 있지 않습니다**(`dist/`만 배포합니다). 그래서 `ranui`에서 `import '…/lock.svg?raw'`는 해석되지 않습니다. 기본 세트는 `registerBuiltinIcons()`를 쓰거나, 직접 만든 SVG 문자열을 등록하세요.

> **SSR 과 시점.** 등록은 브라우저에서 실행되어야 합니다. `<r-icon>`이 아이콘 등록 전에 연결되면 비어 있다가, 등록이 끝나면 자동으로 채워집니다 (엘리먼트가 `ranui-icon-registered` 이벤트를 듣습니다). 빈 아이콘이 번쩍이는 것을 피하려면 엔트리 모듈 맨 위에서 등록해, 첫 컴포넌트가 그려지기 전에 레지스트리가 채워지게 하세요. 개발 모드에서는 등록되지 않은 이름이 `[ranui-icon] icon not registered: <name>`으로 찍힙니다.

## 코드 데모

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## 어트리뷰트

### `name`

이름에 따라 다른 아이콘을 고릅니다.

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<Demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</Demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<Demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</Demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

spin 을 지정하면 회전이 켜지고, 숫자를 넘기면 회전 속도를 조절합니다. 숫자가 작을수록 빠르게 돕니다.

<Demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</Demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## 아이콘 목록

아무 아이콘이나 클릭하면 마크업이 복사됩니다.

<IconGallery />

## 스타일

`<r-icon>`은 자체 **CSS 커스텀 프로퍼티 6 개**와 테마에서 읽어 오는 의미 토큰을 공개합니다. 상속이
닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Part: `ran-icon`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#icon)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.
