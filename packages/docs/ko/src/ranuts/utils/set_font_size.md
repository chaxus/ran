# setFontSize2html

루트 `<html>`의 `font-size`를 뷰포트에 비례해 정합니다. 고정 너비(모바일 디자인에서 흔한 375px)로 만든 시안이 실제 화면에 맞춰 늘고 줄게 되지요. `rem`으로 짠 모바일 레이아웃에서 익숙한 "flexible rem" 기법입니다.

## 사용법

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // 디자인 너비는 기본이 375px
// 다른 너비로 만든 시안이라면:
setFontSize2html(414);
```

시작할 때 한 번만 부르세요. 크기가 바뀌거나 화면 방향이 돌아갈 때마다 스스로 다시 도니, 페이지가 살아 있는 동안 한 번이면 넉넉합니다.

```css
/* 너비 375px 시안에서 200px로 그린 상자 */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### 매개변수

| 매개변수      | 설명                 | 타입     | 기본값 |
| ------------- | -------------------- | -------- | ------ |
| `designWidth` | 시안을 만든 너비(px) | `number` | `375`  |

#### 반환값

반환값 없음(`void`). 부수 효과로 `documentElement.style.fontSize`를 정하고, `resize`와 `orientationchange` 리스너를 스스로 답니다.

## 참고

1. **아이패드는 기준이 알아서 바뀝니다.** `currentDevice()`가 아이패드라고 알리면, 넘긴 `designWidth` 대신 디자인 너비와 화면비가 `768` / `1024:768`로 바뀝니다. 이 함수는 기본적으로 휴대폰 시안을 전제하고, 흔한 예외 하나만 맞춰 줍니다.
2. **거두는 수단이 없습니다.** 리스너를 다는 이 라이브러리의 다른 헬퍼들과 달리 `setFontSize2html`은 해지 함수를 돌려주지 않습니다. 붙었다 떨어졌다 하는 컴포넌트에 매어 두는 것이 아니라, 페이지가 사는 동안 한 번 부르라고 만든 것입니다.
3. `document`와 `window`가 있어야 합니다. SSR에서 돌 수 있는 코드라면 부르는 쪽에서 막아 주세요.
4. 시안의 `px` 값을 같은 기준으로 `rem`으로 바꿔 주는 CSS 빌드 단계(postcss-pxtorem 따위)와 짝을 이룹니다. `setFontSize2html`은 루트 글꼴 크기만 정할 뿐, 스타일시트를 바꾸지는 않습니다.
