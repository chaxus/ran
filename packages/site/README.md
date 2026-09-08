# packages/site — chaxus.com

Personal homepage and blog, published to **https://chaxus.com**.

Unlike `packages/docs` (VitePress), this site is built by **its own static site generator**
in `build/`, on top of ranui. It exists to prove that generator at a size where a mistake
is cheap, before anyone proposes pointing it at the 1,393-page documentation site.

```
packages/site/
├── build/          # the generator: markdown pipeline, page shell, SSG driver
├── content/        # the site's markdown — index.md, about.md, blog/*.md
├── client/         # the one client bundle: ranui components + progressive enhancement
├── styles/         # site.css — the whole stylesheet, no preprocessor
├── public/         # copied verbatim into dist
└── bin/build.sh    # generate → bundle → verify
```

Zero third-party dependencies beyond what the monorepo already resolves: `marked` and
`shiki` are ranui's, `vite`/`tsx`/`typescript` come from the workspace catalog. There is no
YAML library — frontmatter is a documented strict subset parsed in `build/frontmatter.ts`,
which fails loudly rather than guessing.
