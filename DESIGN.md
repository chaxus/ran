# Design

The visual identity of the product website, https://ran.chaxus.com, built by `packages/docs`.
[PRODUCT.md](PRODUCT.md) owns its positioning. The shared rules live in [design/DESIGN.md](design/DESIGN.md)
and ranui's token mapping in the [ranui adapter](packages/ranui/docs/adapters/DESIGN.md); this file only
records how the website applies them.

## Overview

A quiet, content-first documentation surface. Real ranui components and composed examples carry the
emphasis; page chrome stays neutral, flat and readable in eight languages, including right-to-left Persian.

## Color

Page chrome aliases ranui's semantic tokens in `packages/docs/styles/docs.css`. The literal after each
token is the pre-stylesheet fallback, not a second palette:

- `--bg`, `--bg-soft`, `--bg-code`: `--ran-color-bg`, `--ran-color-bg-subtle`, `--ran-color-bg-muted`
- `--fg`, `--fg-muted`, `--fg-faint`: `--ran-color-text`, `--ran-color-text-secondary`, `--ran-color-text-disabled`
- `--rule`, `--rule-strong`: `--ran-color-border-secondary`, `--ran-color-border`
- `--accent` (commitment) is `--ran-color-primary`; `--link` (prose links and focus) is `--ran-color-link`

Light and dark follow ranui's theme: `prefers-color-scheme` by default, `data-ran-theme` when the reader
chooses. There is no other theme.

## Typography

`--ran-font-family` (Geist) and `--ran-font-mono`, with system CJK and Arabic fallbacks; no web font is
loaded for those scripts. Prose is capped by `--measure` (44rem); tables, code and demos take the full column.

## Layout

A sticky 60px header, a 272px sidebar from 900px, and a 224px outline from 1240px. Content widths cap at
1440px. Spacing comes from ranui's 4px scale.

## Components

Live examples use real `r-*` elements, loaded per page on demand. `<ran-demo>` and the other `ran-*`
elements are zero-JavaScript presentational wrappers, so examples stay indexable and readable without
script. Navigation, sidebar, outline and language menu are generated HTML.

## Motion

Interaction feedback only. Every landing section is visible on first paint; there is no scroll reveal.
The sidebar's hover fill slides from row to row, and moving between docs pages cross-fades the content
while the header and sidebar hold still. Both stop under reduced motion.

## Responsive Rules

Below 900px the sidebar becomes a drawer and navigation reflows instead of disappearing. Nothing scrolls
horizontally except wide tables and code, which scroll inside their own wrappers.
