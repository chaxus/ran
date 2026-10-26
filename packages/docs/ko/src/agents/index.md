---
title: 에이전트
---

# 에이전트

ran 플러그인은 제품 설계를 위한 design, 컴포넌트를 위한 ranui, 유틸리티를 위한 ranuts 스킬을 제공합니다.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

GitHub에서 플러그인을 설치하세요.

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

새 세션에서 Codex는 `$design`, `$ranui`, `$ranuts`를, Claude Code는 `/ran:design`, `/ran:ranui`, `/ran:ranuts`를 사용하세요.

로컬 체크아웃을 써 보려면 저장소 루트에서 `chaxus/ran` 대신 `.`으로 marketplace 명령을 실행하세요.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
