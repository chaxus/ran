---
title: Agents
---

# Agents

One ran plugin provides three skills: design for product decisions, ranui for components, and ranuts for utilities.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

From the repository root, register this checkout and install the plugin.

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

In a new session, invoke `$design`, `$ranui` or `$ranuts` in Codex; use `/ran:design`, `/ran:ranui` or `/ran:ranuts` in Claude Code.

After publication, replace `.` in the marketplace command with `chaxus/ran`. Repository links below refer to the canonical locations on main after merge.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
