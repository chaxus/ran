---
title: Agentes
---

# Agentes

Un plugin ran ofrece tres habilidades: design para decisiones de producto, ranui para componentes y ranuts para utilidades.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

Desde la raíz del repositorio, registra esta copia e instala el plugin.

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

En una nueva sesión, usa `$design`, `$ranui` o `$ranuts` en Codex; `/ran:design`, `/ran:ranui` o `/ran:ranuts` en Claude Code.

Tras publicar, sustituye `.` por `chaxus/ran` en el comando del marketplace. Los enlaces apuntan a las ubicaciones canónicas en main después de integrar los cambios.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
