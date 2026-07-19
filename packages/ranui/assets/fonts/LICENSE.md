# Bundled math fonts — provenance & licenses

These fonts are bundled by `<r-math>` (see `components/math/`) so LaTeX renders to
pixel-consistent MathML across every browser/OS, instead of depending on whichever math
font the reader's system happens to have. They are inlined as `?inline` data-URIs and
registered once at the document level.

## latinmodernmath.woff2

- **Font:** Latin Modern Math (a clone of Computer Modern — the classic LaTeX look).
- **Source:** https://temml.org/assets/latinmodernmath.woff2 (as shipped by Temml), originally
  from GUST e-foundry — http://www.gust.org.pl/projects/e-foundry/
- **License:** GUST Font License (GFL), legally equivalent to the LaTeX Project Public
  License (LPPL). Freely redistributable.

## Temml.woff2

- **Font:** A clone of `KaTeX_Script-Regular` with code points remapped to the Unicode
  Mathematical Alphanumeric Script capitals (U+1D49C–U+1D4B5); used for `\mathscr` and
  prime glyphs.
- **Source:** The Temml distribution (https://github.com/ronkok/Temml).
- **License:** MIT (inherited from KaTeX's fonts).
