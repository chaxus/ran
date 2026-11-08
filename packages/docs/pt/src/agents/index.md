---
title: Agentes
---

# Agentes

Um plugin ran oferece três skills: design para decisões de produto, ranui para componentes e ranuts para utilitários.

Escolha a skill conforme a decisão à sua frente:

- **design** — composição, interação, movimento, ou se uma tela passa na aceitação
- **ranui** — qual elemento `<r-*>` usar, seus atributos ou os tokens do tema
- **ranuts** — qual utilitário importar, ou qual ponto de entrada cobre o problema

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

Instale o plugin a partir do GitHub.

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

Numa nova sessão, use `$design`, `$ranui` ou `$ranuts` no Codex; `/ran:design`, `/ran:ranui` ou `/ran:ranuts` no Claude Code.

Para experimentar um checkout local, execute o comando do marketplace na raiz do repositório com `.` no lugar de `chaxus/ran`.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
