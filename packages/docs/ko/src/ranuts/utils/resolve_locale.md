# resolveLocale

지원하는 로케일 가운데 어느 것을 쓸지, 늘 쓰이는 순서대로 고릅니다. **질의 → 쿠키 → localStorage → navigator → 기본값** 순입니다.

메시지 목록은 여러분의 것입니다. 이것이 고르는 것은 그 열쇠뿐입니다.

## API

### resolveLocale(options)

| 옵션 | 설명 | 타입 | 기본값 |
| -------------- | ------------------------------------------------------------------------ | ------------------- | ---------------- |
| `supported` | 실제로 갖춰 둔 로케일. 구체적인 것부터 앞에 둡니다 | `readonly string[]` | 필수 |
| `fallback` | 아무것도 맞지 않을 때 돌아오는 값 | `string` | `supported[0]` |
| `query` | 분명한 선택을 실어 나르는 질의 매개변수(`lang` 따위) | `string` | — |
| `cookie` | 선택을 실어 나르는 쿠키의 이름 | `string` | — |
| `storageKey` | 사용자가 마지막으로 고른 것이 담긴 localStorage의 키 | `string` | — |
| `useNavigator` | 기본값으로 떨어지기 전에 `navigator.languages`와 `navigator.language`를 볼지 여부 | `boolean` | `true` |
| `url` | 질의를 읽어 올 URL | `string` | 지금의 location |

#### 반환값

`supported` 가운데 걸린 항목입니다. 언제나 그중 하나이며, 아무 문자열이나 돌아오는 일은 없습니다.

## 예시

### 전체 흐름

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### 지역이 붙은 값은 바탕 언어로 떨어집니다

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (지원하지 않으므로 기본값으로)
```

### 로케일이 붙은 URL과 함께 쓰기

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// URL이 이미 말하는 것을 앞세우고, 없으면 사용자 자신의 선호로 갑니다.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## 참고

1. **요점은 순서입니다.** URL의 `?lang=`은 분명한 지정이고, 남에게 건넬 수 있으며, 그 한 번뿐이므로 무엇보다 앞섭니다. 쿠키는 서버도 볼 수 있는 결정이니 클라이언트에만 있는 상태보다 앞섭니다. localStorage는 사용자가 앱 안에서 마지막으로 고른 것입니다. `navigator.language`는 처음 온 사람에 대한 짐작일 뿐입니다. 이 순서를 뒤집으면, 공유된 `?lang=en` 링크가 받은 사람이 저장해 둔 언어로 계속 그려지는 그 고전적인 버그가 납니다.

2. **결과는 언제나 `supported` 가운데 하나입니다.** 목록 밖의 값은 돌려주지 않고 무시하므로, 그 결과로 메시지 목록을 색인해도 안전합니다.

3. **대조는 대소문자를 가리지 않고 바탕 언어까지 떨어집니다.** `supported: ['en', 'zh-CN']`이라면 `en-GB`는 `en`에, `zh`는 `zh-CN`에 걸립니다.

4. **`navigator.language`만이 아니라 `navigator.languages`를 순서대로 봅니다.** 그 목록이야말로 사용자가 실제로 매긴 선호 순위이고, 그 첫 항목이 갖춰 둔 것 가운데 가장 잘 맞는 것이 아닐 때가 많기 때문입니다.

5. **어느 출처든 조용히 물러납니다.** `window`가 없어도, `document.cookie`가 없어도, localStorage가 없어도, 저마다 아무것도 보태지 않을 뿐이라 이 흐름은 SSR에서도 빌드 스크립트에서도 돌아갑니다.
