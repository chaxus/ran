---
title: Agents
---

# Agents

One ran plugin provides three skills: design for product decisions, ranui for components, and ranuts for utilities.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

Install the plugin from GitHub.

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

In a new session, invoke `$design`, `$ranui` or `$ranuts` in Codex; use `/ran:design`, `/ran:ranui` or `/ran:ranuts` in Claude Code.

To try a local checkout instead, run the marketplace command with `.` in place of `chaxus/ran` from the repository root.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
