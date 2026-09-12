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
└── dev.ts          # serves the way the production host serves
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
pnpm -F ranpress test   # 54 tests over the pure functions
pnpm -F ranpress tsc
```
