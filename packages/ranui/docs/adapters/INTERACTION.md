## ranui reading integration

`r-conversation` exposes `pinned` and `pinnedchange`; consult
[the generated contract](../COMPONENTS.md). It does not own jobs or persistence.
Use it only when an append-only log fits the task. Host state remains authoritative.
