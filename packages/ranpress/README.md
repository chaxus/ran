# ranpress

The static site generator behind **chaxus.com** and **ran.chaxus.com**.

It is mechanism, not policy. It knows how to parse frontmatter, render markdown to
documentation-grade HTML, walk a content tree, put bytes on disk in the right order, serve
them the way the host will, and refuse to publish output that contradicts itself. It has
no opinion about what a page is, what URL it gets, or what it looks like — those live in
each site, which is why a personal blog and a 1,393-page multilingual reference share it.

```
src/
├── frontmatter.ts  # a strict documented subset of YAML, not a YAML parser
├── markdown.ts     # marked + shiki: anchors, containers, TOC, sections, excerpt
├── discover.ts     # walk a content tree, split each file
├── driver.ts       # clear, copy, bundle, write — in that order, which matters
├── feeds.ts        # sitemap, RSS, robots.txt
├── search.ts       # build-time index; the tokenizer handles CJK
├── verify.ts       # post-build checks that fail the build
├── host.ts         # one model of how the production host resolves a URL
└── serve.ts        # the dev and preview servers, both built on that model
```

## What a site supplies

Everything policy-shaped is a parameter:

```ts
const markdown = createMarkdown({
  origin: 'https://example.com',
  langs: ['ts', 'js', 'html'],          // shiki loads grammars eagerly; name what you use
  fences: { mermaid: (code) => ... },   // claim a fence language outright
  containers: { 'code-group': ... },    // beyond note/tip/warning/danger
  components: { HomeCinematic: ... },   // a tag the generator renders itself
  resolveLink: (href) => ...,           // ./foo.md → /dir/foo
});
```

## Serving locally

Two servers, both answering requests exactly the way Cloudflare Pages does.

```ts
import { createDevServer, createPreviewServer } from 'ranpress';

// Build, watch, serve. Returns once the first build has finished.
await createDevServer({
  distDir: DIST_DIR,
  port: 4173,
  label: 'site',
  note: '(drafts included)',
  rebuild: (reason, full) => build({ skipAssets: !full }),
  watch: [
    { dir: CONTENT_DIR, match: (file) => file.endsWith('.md') },
    { dir: join(ROOT, 'styles'), full: true },
  ],
});

// Serve an existing dist/ and never write to it.
createPreviewServer({ distDir: DIST_DIR, port: 4174 });
```

`rebuild` is the site's own build function; ranpress supplies only the loop around it. A
`watch` target marked `full: true` means a change there needs the whole pipeline (styles
and client code have to go back through vite, which is the slow half); the default is the
cheap content-only path. A build that throws is logged and the last good output keeps
being served, so a typo in one markdown file does not take the server down.

Watch the source trees, never the package root — `dist/` lives under it and the build
writes there, so a recursive watch would retrigger itself on its own output forever.

## Why not `serve` or `http-server`

Because a generic static server resolves files the way Node would, and the production host
does not. `host.ts` is the difference, and its rules were **measured against Cloudflare
Pages**, not read off its documentation:

| Request          | On disk             | Response                |
| ---------------- | ------------------- | ----------------------- |
| `/about`         | `about.html`        | `200`                   |
| `/about`         | `about/index.html`  | `308` → `/about/`       |
| `/about/`        | `about/index.html`  | `200`                   |
| `/about/`        | `about.html`        | `308` → `/about`        |
| `/sitemap.xml/`  | `sitemap.xml`       | `404` — no reverse hop  |

The redirect rows are the reason this file exists. `dev.ts` and `verify.ts` used to carry
a copy of this logic each, and the copies disagreed: the verifier knew that reaching a
page through `<path>/index.html` means a redirect, the dev server served that same case as
a plain `200`. So local development looked correct for exactly the layout production
redirects away from, and **904 canonical URLs shipped naming a URL the host bounces**. One
model, three callers — the dev server, the preview server, and the verifier — and
`followHost` is what lets the verifier say "this URL resolves, and it is still the wrong
URL to publish".

That is also why a site's `outFileFor` has to agree with its canonical: a page whose
canonical is `/about` must be written to `about.html`, and a section index whose canonical
is `/blog/` must be written to `blog/index.html`.

## Things that are load-bearing

**One page's content per output file.** ranui's own `generateStaticPages()` renders a
router tree and hides non-matching routes with `hidden`, so their content stays in the
DOM. Right for an app shell, wrong for a content site — every file would carry every
other page's prose.

**Slugs match VitePress character for character.** NFKD then combining marks, a specific
punctuation set rather than "everything that is not a letter" (which eats the zero-width
non-joiner Persian headings need), CJK verbatim, repeats numbered from 1. 17,216 anchors
on ran.chaxus.com depend on this; a slugifier that is merely reasonable changes all of
them.

**The search tokenizer is not MiniSearch's.** Its default splits on spaces and
punctuation — correct for English, useless for Chinese, Japanese and Korean, where a
sentence becomes one token and the search box returns nothing forever without an error.
CJK runs become bigrams, and the same function runs over the query so index and search
agree by construction.

**Plain text comes from the token tree, never from stripping tags off rendered HTML.** A
regex that removes _most_ tags reads like a sanitizer to every later reader and to every
scanner, and it is wrong anyway — it leaves entities behind and nested constructs survive
a single pass.

## Commands

```sh
pnpm -F ranpress test   # the pure functions, plus the host model
pnpm -F ranpress tsc
```

In a site that uses it:

```sh
pnpm -F <site> dev      # build, watch, serve on :4173
pnpm -F <site> preview  # serve the built dist/ on :4174, exactly as the host will
```

`preview` builds nothing — run the build first. It is what you use to check a real
deploy's bytes, including its redirects and its 404 status.
