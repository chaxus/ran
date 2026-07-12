# refactoring-ui-design

A cross-platform agent skill for the **ranui** component library: developer-oriented
UI polish tactics (hierarchy, spacing, type, color, depth) applied as concrete refactors.

The skill runs on **both Claude and OpenAI** from a single source of truth.

## Layout

```
refactoring-ui-design/
├── SKILL.md            # ⭐ the skill: instructions body (shared) + Claude frontmatter
├── agents/
│   └── openai.yaml     # OpenAI-only interface + policy; references SKILL.md
└── README.md           # this file
```

## Design: one body, many adapters

`SKILL.md` is the **single source of truth for the instructions**. Its Markdown body is
the guidance both platforms execute; its YAML frontmatter (`name`, `description`,
`metadata`, …) is what the **Claude** skill loader reads directly.

Each file under `agents/` is a **thin vendor adapter** — interface labels and invocation
policy only. An adapter must **not** copy the instruction text; it points back at
`../SKILL.md` so the two platforms can never drift.

| Platform | Reads for discovery/UI            | Reads for instructions |
| -------- | --------------------------------- | ---------------------- |
| Claude   | `SKILL.md` frontmatter            | `SKILL.md` body        |
| OpenAI   | `agents/openai.yaml` → `interface`| `SKILL.md` body (via `instructions.source`) |

### `agents/openai.yaml`

| Key                            | Purpose                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| `instructions.source`          | Path to the shared body (`../SKILL.md`) — do not inline it |
| `interface.display_name`       | Name shown in the OpenAI UI                                |
| `interface.short_description`  | One-line summary                                           |
| `interface.default_prompt`     | Suggested invocation prompt                                |
| `policy.allow_implicit_invocation` | Whether the model may invoke without an explicit call  |

## Editing rules

- **Change behavior → edit `SKILL.md` only.** Both platforms pick it up.
- **Change how it shows up / when it fires on OpenAI → edit `agents/openai.yaml`.**
- Keep `display_name` / `short_description` in `openai.yaml` consistent with
  `SKILL.md`'s `name` / `description`.
- Adding another platform = add one file under `agents/` that references `../SKILL.md`;
  never fork the instructions.
