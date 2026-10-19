<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">웹 애플리케이션을 위한 UI 컴포넌트와 TypeScript 도구.</p>
<p align="center"><a href="https://ran.chaxus.com/ko/">문서</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <b>한국어</b> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran은 웹 인터페이스를 만들기 위한 라이브러리 모음입니다. HTML 컴포넌트로 폼, 대시보드, 콘텐츠 페이지를 만들고, 브라우저 및 데이터 처리 함수를 재사용하거나, TypeScript로 반응형 DOM 뷰를 직접 구성할 수 있습니다.

각 패키지는 개별적으로 설치할 수 있습니다. [문서 사이트](./packages/docs/)와 [IM 데모](./packages/im/)는 이 라이브러리들을 실제 애플리케이션에서 함께 사용하는 예입니다.

## 패키지 선택

| 패키지                                                | 만들 수 있는 것                                                                                                                  |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [ranui@0.5.0](./packages/ranui/README.ko.md)          | 입력창, 선택기, 대화 상자, 표, Markdown, 미디어 플레이어를 제공하는 사용자 정의 HTML 요소. 테마와 서버 렌더링 도구를 포함합니다. |
| [ranuts@0.5.0](./packages/ranuts/README.ko.md)        | 색상·바이너리 변환, 저장소 접근, SSE 파싱, 스트리밍 응답 상태 등 브라우저 및 데이터 처리 작업.                                   |
| [@alixex/ranview@0.2.0](./packages/ranview/README.md) | 체이닝 가능한 빌더와 반응형 시그널을 이용한 DOM 뷰 및 서버 렌더링용 정적 HTML 생성.                                              |

## ranui 사용해 보기

ESM 호환 번들러를 사용하는 브라우저 애플리케이션에 설치합니다.

```sh
npm install ranui@0.5.0
```

애플리케이션의 JavaScript 진입점에 다음 코드를 추가하면 클릭에 반응하는 버튼이 생성됩니다.

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = '저장';
button.addEventListener('click', () => {
  button.textContent = '저장됨';
});
document.body.append(button);
```

컴포넌트는 사용자 정의 요소와 표준 브라우저 이벤트를 사용하므로 React 또는 Vue 런타임이 필요하지 않습니다. 다른 컴포넌트는 `ranui/input`처럼 개별 진입점으로 가져옵니다. 태그, 이벤트, 맞춤 설정은 [컴포넌트 예제](https://ran.chaxus.com/ko/src/ranui/)에서 확인하세요. 번들러 없이 사용하려면 [독립 스크립트 예제](./packages/ranui/README.ko.md#iife--cdn)를 참고하세요.

## 저장소 개발

Node 24+와 pnpm 11.6.0을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

각 패키지 디렉터리에 가이드와 예제가 있습니다. 기여 전에는 [저장소 규칙](./AGENTS.md)을, 패키지 배포 준비 시에는 [배포 절차](./docs/RELEASING.md)를 확인하세요.

## 라이선스

[MIT](./LICENSE)
