---
title: 에이전트
---

# 에이전트

ran 플러그인은 제품 설계를 위한 design, 컴포넌트를 위한 ranui, 유틸리티를 위한 ranuts 스킬을 제공합니다.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

저장소 루트에서 이 체크아웃을 등록하고 플러그인을 설치하세요.

## Codex

```sh
codex plugin marketplace add .
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add .
claude plugin install ran@ran
```

새 세션에서 Codex는 `$design`, `$ranui`, `$ranuts`를, Claude Code는 `/ran:design`, `/ran:ranui`, `/ran:ranuts`를 사용하세요.

배포 후 marketplace 명령의 `.`을 `chaxus/ran`으로 바꾸세요. 아래 저장소 링크는 병합 후 main의 공식 위치를 가리킵니다.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
