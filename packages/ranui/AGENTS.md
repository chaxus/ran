# ranui — consumer orientation

Use this file first when installing or prompting an agent against the published package.
Contributor recipes live in [CLAUDE.md](./CLAUDE.md) and [docs/CODING.md](./docs/CODING.md).

## Install

```sh
npm install ranui@0.5.4
```

```ts
import 'ranui/style';
import 'ranui/button';
import 'ranui/input';
```

Prefer per-component subpaths (`ranui/button`, `ranui/select`, …). Importing from `ranui`
loads the barrel and registers every exported component module it re-exports — not
`r-scratch` (use `ranui/scratch`). Companion tags register with their owners:
`r-option` / `r-dropdown-item` with `ranui/select`, `r-content` with `ranui/popover`.

Lean entries without custom-element registration: `ranui/theme`, `ranui/i18n`,
`ranui/ssr`, `ranui/builder`, `ranui/testing`.

Heavy renderers (`ranui/markdown`, `ranui/mermaid`, `ranui/math`, `ranui/player`) pull
extra runtime dependencies through the package; only import them when the host needs them.

## Contracts

| Need                                         | Read                                                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Attributes, properties, events, slots, parts | [docs/COMPONENTS.json](./docs/COMPONENTS.json) (preferred) or [docs/COMPONENTS.md](./docs/COMPONENTS.md) |
| Public CSS variables                         | [docs/style-tokens-public.md](./docs/style-tokens-public.md)                                             |
| Design methods + ranui token adapter         | [docs/DESIGN.md](./docs/DESIGN.md#ranui-implementation-adapter)                                          |
| Form-associated fields / `serializeForm`     | CLAUDE.md form sections; `r-input`, `r-checkbox`, `r-select`                                             |
| SSR                                          | `ranui/ssr` + CLAUDE.md SSR notes                                                                        |
| Closed-shadow tests                          | `ranui/testing` (`insideShadow`, `settlePainted`)                                                        |
| JSX / globals                                | `import type {} from 'ranui/typings'`                                                                    |

Validate markup against the installed JSON:

```sh
pnpm exec tsx node_modules/ranui/bin/check-component-attrs.ts path/to/file.html
```

Do not invent attributes from the website or from an unreleased checkout when a host
install is present — the installed `docs/COMPONENTS.*` wins.
