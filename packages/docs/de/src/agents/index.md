---
title: Agenten
---

# Agenten

Ein ran-Plugin bietet drei Skills: design für Produktentscheidungen, ranui für Komponenten und ranuts für Hilfsfunktionen.

Wähle den Skill nach der Entscheidung vor dir:

- **design** — Layout, Interaktion, Bewegung, oder ob eine Oberfläche die Abnahme besteht
- **ranui** — welches `<r-*>`-Element, seine Attribute oder Theme-Tokens
- **ranuts** — welchen Helfer du importierst, oder welcher Einstiegspunkt das Problem trägt

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

Das Plugin von GitHub installieren.

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

In einer neuen Sitzung `$design`, `$ranui` oder `$ranuts` in Codex verwenden; `/ran:design`, `/ran:ranui` oder `/ran:ranuts` in Claude Code.

Um einen lokalen Checkout zu testen, den Marketplace-Befehl im Stammverzeichnis des Repositorys mit `.` statt `chaxus/ran` ausführen.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
