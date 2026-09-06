# ran — Web Components UI 라이브러리 (ranui) 와 TypeScript 유틸리티 (ranuts)

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>네이티브 custom elements 위에 세운, 프레임워크에 매이지 않는 Web Components UI 라이브러리 (ranui) 와 트리 셰이킹이 되는 TypeScript 유틸리티 라이브러리 (ranuts). 그리고 그 둘을 둘러싼 도구와 영어·중국어 이중 언어 문서.</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-기능">기능</a> •
  <a href="#-패키지">패키지</a> •
  <a href="#-빠른-시작">빠른 시작</a> •
  <a href="#-문서">문서</a> •
  <a href="#-기여하기">기여하기</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | **한국어** | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## ✨ 기능

- 🎨 **UI 라이브러리**: 웹 컴포넌트
- 🛠️ **유틸리티 라이브러리**: TypeScript 유틸리티
- 🤖 **머신러닝**: 기본적인 ML 도구와 실험
- 📱 **웹 애플리케이션**: IM 채팅 앱 (프로토타입)
- 🔧 **개발 도구**: 빌드 도구와 디버깅 유틸리티
- 🌐 **Web3**: 스마트 컨트랙트 실험
- 🎯 **시각화 도구**: 데이터 시각화 실험

## 📦 패키지

이 모노레포에는 여러 실험적인 패키지가 들어 있습니다.

### 핵심 라이브러리 (알파 단계)

| 패키지                    | 버전                                                                                                 | 다운로드                                                                                   | 설명                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.ko.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | 웹 컴포넌트 라이브러리 |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.ko.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | 유틸리티 라이브러리    |

### 실험적인 프로젝트

| 패키지                                  | 설명               |
| --------------------------------------- | ------------------ |
| [im](packages/im)                       | 채팅 앱 프로토타입 |
| [visual](packages/visual)               | 데이터 시각화 실험 |
| [ranite](packages/ranite)               | 개발 도구 실험     |
| [debug](packages/debug)                 | 디버깅 유틸리티    |
| [image-process](packages/image-process) | 이미지 처리 실험   |
| [cpro](packages/cpro)                   | C/C++ 학습과 실험  |
| [rust](packages/rust)                   | Rust 학습과 실험   |

CI 가 실제로 어떤 패키지를 검사하는지는 [packages/manifest.json](packages/manifest.json)에 적혀 있습니다. 이 파일은 설명이 아니라 실행되는 것입니다. `bin/run-checks.mjs`는 어떤 검사를 선언한 패키지마다 그 검사를 돌리므로, 목록에서 검사된다고 적힌 패키지는 정말로 검사되고 그렇지 않은 패키지는 이유가 함께 적혀 있습니다. `packages/` 아래에 목록에 없는 디렉터리가 생기면 `pnpm run verify:packages`가 실패합니다. 검사 여부를 아무도 정하지 않은 채 새 패키지가 들어오는 일은 없다는 뜻입니다.

## 🚀 빠른 시작

### 설치

```bash
# 저장소 클론
git clone https://github.com/chaxus/ran.git
cd ran

# 의존성 설치
pnpm install

# 모든 패키지 빌드
pnpm build
```

### 핵심 패키지 사용하기

```bash
# ranui(웹 컴포넌트) 설치
npm install ranui

# 유틸리티 설치
npm install ranuts
```

### 개발

```bash
# 개발 서버 실행
pnpm dev

# 테스트 실행
pnpm test

# 특정 패키지만 빌드
pnpm --filter ranui build
```

## 📚 문서

- **📖 블로그와 글**: [웹 문서 미리보기](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 RanUI 문서**: [UI 라이브러리 안내](https://ran.chaxus.com/src/ranui/)
- **🛠️ RanUTS 문서**: [유틸리티 라이브러리 안내](https://ran.chaxus.com/src/ranuts/)
- **📝 프로젝트 문서**: [docs](packages/docs)

## 🤖 AI / Claude Code

이 저장소에는 Claude Code 플러그인 마켓플레이스가 함께 들어 있습니다. AI 어시스턴트가 소스를 뒤지지 않고도 라이브러리를 읽고 쓸 수 있게 하려는 것입니다. 마켓플레이스를 추가한 다음, 쓰는 라이브러리를 설치하세요.

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — 웹 컴포넌트
/plugin install ranuts@ran     # ranuts — 유틸리티
```

각 스킬은 import map, 목록, 사용 예시, 관례를 담고 있고 해당 패키지에 함께 실린 API 문서로 이어집니다. 자세한 것은 각 라이브러리의 해당 절을 보세요: [ranui](packages/ranui/README.ko.md), [ranuts](packages/ranuts/README.ko.md).

## ⚠️ 알아 두실 점

이것은 초기 개발 단계에 있는 **기술 탐구와 학습을 위한 프로젝트**입니다. 대부분의 패키지는 알파 단계이거나 실험 단계입니다.

**요점:**

- 🚧 **초기 개발**: 대부분의 기능이 아직 만들어지는 중입니다
- 🧪 **실험적**: API 가 자주 바뀔 수 있습니다
- 📚 **학습이 목적**: 주로 배우고 실험하기 위한 것입니다

## 🤝 기여하기

배우는 사람도 개발자도 모두 환영합니다. 이렇게 도울 수 있습니다.

1. 저장소를 **Fork** 합니다
2. 기능 브랜치를 **만듭니다**(`git checkout -b feature/amazing-feature`)
3. 변경 사항을 **커밋**합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 **푸시**합니다 (`git push origin feature/amazing-feature`)
5. 풀 리퀘스트를 **엽니다**

### 개발 지침

- 기존 코드 스타일을 따르세요
- 가능하면 새 기능에 테스트를 붙이세요
- 필요하면 문서를 갱신하세요
- 실험적인 기능에는 너그럽게 대해 주세요

## 🌟 왜 오픈 소스인가

오픈 소스에는 배움과 혁신을 앞당기는 힘이 있다고 믿습니다. 개발자로 지내는 동안 저는 수많은 오픈 소스 프로젝트에서 큰 도움을 받았습니다. 이 실험적인 코드를 공개하면서 바라는 것은 이렇습니다.

- 배운 것을 커뮤니티와 나누기
- 다른 사람이 이 코드로 배우고 실험할 수 있게 하기
- 협업과 지식 공유를 북돋우기
- 계속 배우고 나아지는 자리를 만들기

## 📊 프로젝트 통계

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 것은 [LICENSE](LICENSE) 파일을 보세요.

---

<div align="center">
  <p>Ran 커뮤니티가 ❤️ 를 담아 만들었습니다</p>
  <p>배우는 데 도움이 되었다면 ⭐️ 를 눌러 주세요</p>
</div>
