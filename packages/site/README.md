# packages/site — chaxus.com

Personal homepage and blog, published to **https://chaxus.com**.

This site is built by **ranpress**, the generator in `packages/ranpress`, with its policy
in `build/`. It was the proving ground for that generator at a size where a mistake is
cheap; `packages/docs` — 1,393 pages, eight languages — now runs on the same engine.

```
packages/site/
├── build/          # the generator
│   ├── config.ts       # origin, nav, the three content pillars — one source of truth
│   ├── frontmatter.ts  # a strict documented subset of YAML, not a YAML parser
│   ├── markdown.ts     # marked + shiki, anchors, containers, TOC, excerpt
│   ├── content.ts      # discovery, the page model, validation
│   ├── page.ts         # the HTML document
│   ├── seo.ts          # per-page head, sitemap, RSS, llms.txt, robots.txt
│   ├── build.ts        # the driver
│   ├── verify.ts       # post-build checks — fails the deploy, not the reader
│   ├── dev.ts          # rebuild-on-change, served the way the host serves
│   └── preview.ts      # serve the built dist/ exactly as the host will
├── content/        # index.md, about.md, 404.md, blog/*.md
├── client/         # the one client bundle
├── styles/         # site.css — the whole stylesheet, no preprocessor
├── assets/         # og.html — source for the social card, rendered by `pnpm -F site og`
├── public/         # copied verbatim: icons, manifest, og.png, _headers, _redirects
└── bin/build.sh    # generate → verify
```

## Commands

```sh
pnpm -F site dev      # http://localhost:4173, drafts included, rebuild on change
pnpm -F site build    # generate into dist/ and verify
pnpm -F site preview  # http://localhost:4174, serve the built dist/ — builds nothing
pnpm -F site verify   # re-run the checks against an existing dist/
pnpm -F site og       # regenerate og.png and the PNG icons (needs Chromium)
```

`dev` and `preview` both resolve URLs the way Cloudflare Pages does, including its
redirects — see `packages/ranpress/README.md` for the table. `preview` is the one to reach
for before a deploy: it serves the real built bytes and nothing else, so a page that only
works because the dev server just rebuilt it has nowhere to hide.

`og` is deliberately not part of `build`: the card and the icons change when the
wordmark or the tagline changes, which is close to never, and making every deploy depend
on a browser binary is a poor trade. Their outputs are committed — run it after editing
`assets/og.html` or `public/favicon.svg`.

`build` needs ranui's `dist/` to exist. From a clean checkout, `sh bin/build-site.sh` at
the repo root builds ranuts → ranui → site in order; that is also the Cloudflare Pages
build command, with output directory `packages/site/dist`.

## Writing a post

A file in `content/blog/`. Its filename is its URL.

```md
---
title: 标题
date: 2026-09-08
pillar: from-scratch | internals | practice
tags: [一个, 两个]
description: 可选。不写就取正文第一段。
draft: false
---
```

Frontmatter is parsed by `frontmatter.ts`, which supports flat `key: value`, quoted
strings, `[a, b]` lists and booleans — and **throws on anything else**, naming the file
and line. That is deliberate: five fields do not justify a YAML dependency, and a real
YAML parser's willingness to guess is what once turned an em dash typed as a colon into
a silent build failure on the docs site.

Markdown gets GFM plus `::: note | tip | warning | danger` containers. Code fences must
use a language listed in `LANGS` in `build/markdown.ts`; an unlisted one fails the build
rather than quietly rendering as plain text.

## Things that are load-bearing

**Every output file contains only its own page.** ranui's `generateStaticPages()` renders
a router tree and hides non-matching routes with `hidden`, so their content stays in the
DOM. Right for an app shell, wrong for a content site — every file would carry every
other page's prose. `build.ts` emits the matched page alone.

**`verify.ts` runs on every build and fails it.** Dead internal links, a canonical that
resolves to a different page, a `.html` URL anywhere, a missing description, a built page
absent from the sitemap. None of these break a page in a browser, which is exactly why
they need a check. It has already caught one: post bylines linked to `/blog/#practice`
while the archive was grouped by year, so every one of those anchors was dead.

**The 404 page is the one page with different rules.** Cloudflare Pages serves
`/404.html` from the root for any unmatched path, so it is written there literally rather
than at `404/index.html`. It must not declare a canonical — served from every wrong URL,
a canonical would claim a different page each time — and must carry `noindex`, and it
stays out of the sitemap. `verify.ts` enforces all three.

**The site works with JavaScript disabled.** Content, navigation, styling and theming all
render without the bundle; `client/main.ts` adds the theme switch and code-copy buttons on
top. Cross-document view transitions are a CSS at-rule in `site.css`, not the
`enableMpaViewTransitions()` helper — the helper injects that same rule from script, which
would mean no transition on the first navigation.

**No web font.** The site is Chinese-primary: a CJK face is megabytes and a third-party
Latin face is a slow or blocked request for much of the audience.
