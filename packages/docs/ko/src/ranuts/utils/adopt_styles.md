# adoptStyles / adoptSheetText

Shadow DOM에 CSS를 끼워 넣습니다. **Constructable Stylesheets**를 먼저 씁니다. 같은 CSS를 한 번만 파싱하고 그것을 _참조로_ 모든 컴포넌트 인스턴스가 나눠 쓰므로, 인스턴스가 천 개여도 파싱 결과는 하나뿐입니다. 이를 지원하지 않는 곳에서는 둘 다 `<style>` 태그를 끼워 넣는 방식으로 물러섭니다.

둘 다 SSR에서 안전하고(`document`가 없으면 곧바로 돌아옵니다) 여러 번 불러도 결과가 같습니다.

## 사용법

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

컴포넌트의 **정적인** 스타일용입니다. 물러선 경로에서는 **루트 단위**로 중복을 걸러 냅니다. 하나의 shadow root는 표시가 붙은 `<style>`을 딱 하나만 두고, 먼저 쓴 쪽이 남습니다. 컴포넌트의 정적 스타일은 루트마다 하나만 있어야 하므로, 두 번째 호출은 부른 쪽이 실수했다는 뜻입니다.

#### 매개변수

| 매개변수     | 설명                              | 타입         | 기본값                 |
| ------------ | --------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 대상 shadow root                  | `ShadowRoot` | 필수                   |
| `cssText`    | 스타일 문자열                     | `string`     | 필수                   |
| `marker`     | 물러선 `<style>`에 붙일 표시 속성 | `string`     | `'data-adopted-style'` |

#### 반환값

반환값 없음(`void`)

### adoptSheetText

실행 중에 건네지는 **동적인** 스타일용입니다(컴포넌트의 `sheet` 속성 따위). `adoptStyles`와 다른 점은 물러선 경로가 무엇을 기준으로 중복을 거르느냐 하나뿐입니다. 여기서는 **cssText**가 기준이라, 한 루트에 서로 다른 동적 스타일을 여럿 쌓을 수 있는 한편 똑같은 것은 한 번만 들어갑니다.

#### 매개변수

| 매개변수     | 설명                              | 타입         | 기본값                 |
| ------------ | --------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | 대상 shadow root                  | `ShadowRoot` | 필수                   |
| `cssText`    | 스타일 문자열                     | `string`     | 필수                   |
| `marker`     | 물러선 `<style>`에 붙일 표시 속성 | `string`     | `'data-adopted-sheet'` |

#### 반환값

반환값 없음(`void`)

## 상수

| 이름                   | 값                     | 뜻                                                 |
| ---------------------- | ---------------------- | -------------------------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | `adoptStyles`가 물러설 때 쓰는 태그의 기본 표시    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | `adoptSheetText`가 물러설 때 쓰는 태그의 기본 표시 |

`marker` 인자가 있는 까닭은, 라이브러리가 자기가 끼워 넣은 스타일에 표를 남겨 나중에 다시 찾을 수 있게 하기 위해서입니다. 이를테면 ranui는 `data-ranui`와 `data-ranui-sheet`를 넘깁니다.
