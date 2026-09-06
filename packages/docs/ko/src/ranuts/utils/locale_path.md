# createLocalePath

다국어 사이트를 위한 URL 계산입니다. 순수 함수이며 전역 상태도 DOM도 쓰지 않습니다. 빌드 스크립트(사이트맵, `hreflang`)에서도 브라우저에서도 똑같이 씁니다.

서브도메인(`zh.example.com/book/`)이 아니라 **하위 디렉터리**(`/zh/book/`)를 씁니다. 검색 엔진은 서브도메인을 별개의 사이트로 보아 그 평판이 0에서 시작하지만, 하위 디렉터리는 본 사이트의 평판을 물려받습니다. 기본 로케일은 루트에 놓이고, 나머지 로케일에는 접두사가 붙습니다.

## API

### createLocalePath(config)

| 매개변수        | 설명                                                                              | 타입            | 기본값                 |
| --------------- | --------------------------------------------------------------------------------- | --------------- | ---------------------- |
| `locales`       | `{ code, prefix? }[]`. 접두사가 없으면 "기본 로케일이며 루트에 놓인다"는 뜻입니다 | `LocaleRoute[]` | 필수                   |
| `defaultLocale` | 기본 로케일의 코드                                                                | `string`        | 접두사 없는 첫 번째 것 |
| `base`          | 배포 하위 경로(예: `/weread`). 끝의 슬래시는 무시합니다                           | `string`        | `''`                   |

돌려주는 것:

| 멤버                            | 설명                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| `base` / `defaultLocale`        | 다듬어진 설정. 읽기 전용입니다                                     |
| `localeFromPath(pathname)`      | 로케일을 가려냅니다. 모르는 경로는 기본 로케일로 떨어집니다        |
| `stripLocale(pathname)`         | 로케일 접두사를 뗍니다. 라우팅에 쓸, 언어에 매이지 않은 경로입니다 |
| `href(path, code?)`             | 어느 로케일용 링크를 만듭니다                                      |
| `hrefForLocale(pathname, code)` | 지금 경로를 다른 로케일로 돌려 겨눕니다(언어 전환기)               |
| `alternates(pathname)`          | 모든 로케일의 URL. `<link rel="alternate" hreflang>`용입니다       |

## 예시

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/'); // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN'); // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/'); // 'zh-CN'
paths.stripLocale('/docs/zh/book/'); // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// hreflang 태그
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## 참고

1. **`href`는 몇 번을 불러도 결과가 같습니다.** 새 접두사를 붙이기 전에 이미 있던 접두사를 떼므로, 이미 로케일이 붙은 경로를 넣어도 겹치지 않습니다. `hrefForLocale`도 속은 `href`입니다.
2. **가장 긴 접두사가 이깁니다.** 그래서 `zh`가 `/zh-hant/...`를 삼키지 않습니다.
3. **`base`는 앞에서만 뗍니다.** `replace(base, '')`를 쓰면 어디에 있든 첫 번째 것을 떼어 버려, 경로 중간에 같은 문자열이 들어 있으면 망가집니다.
4. **질의와 해시는 그대로 남습니다.** 계산이 손대는 것은 경로뿐입니다.
5. **전역 "현재 로케일" 같은 것은 없습니다.** 코드를 명시해 넘기거나 기본값에 맡기세요. 어느 로케일이 살아 있는지는 i18n 런타임의 몫이지 이 모듈의 몫이 아닙니다.
