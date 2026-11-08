---
title: 에이전트
---

# 에이전트

ran 플러그인은 design, ranui, ranuts 세 스킬로 제품 결정, 컴포넌트, 유틸리티 선택을 돕습니다.

앞에 있는 결정에 맞춰 스킬을 고르세요.

- **design** — 레이아웃, 상호작용, 모션, 또는 화면이 수락 기준을 통과하는지
- **ranui** — 어떤 `<r-*>`를 쓸지, 그 속성, 또는 테마 토큰
- **ranuts** — 어떤 헬퍼를 import 할지, 또는 문제가 어느 엔트리포인트에 속하는지

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

GitHub 에서 플러그인을 설치하세요.

## Codex

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ran@ran
```

새 세션에서는 Codex 에서 `$design`, `$ranui` 또는 `$ranuts`를, Claude Code 에서 `/ran:design`, `/ran:ranui` 또는 `/ran:ranuts`를 사용합니다.

로컬 체크아웃을 쓰려면 저장소 루트에서 `chaxus/ran` 대신 `.`로 마켓플레이스 명령을 실행하세요.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
