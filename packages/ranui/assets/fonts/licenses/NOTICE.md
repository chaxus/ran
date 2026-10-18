# Bundled mathematical fonts

These documents accompany the unmodified font bytes embedded by `r-math`,
including the ESM, standalone math/Markdown IIFEs and full ranui IIFE.
They are separate from the Geist text-font OFL notice in `dist/fonts/`.

Both local WOFF2 files were compared byte for byte with the Temml 0.13.4
source commit `81641b37317ea6e6e074c3c3b4b712e0684f7d9d`. No glyphs, names or
font metadata are changed by ranui; Vite embeds the files as data URLs.

| Asset | SHA-256 | Upstream source | License materials |
| --- | --- | --- | --- |
| latinmodernmath.woff2 | 0c1e844b33b8811709b462102e6ce3b1af800a82028bc1a7514878c362d556d5 | [Temml source](https://github.com/ronkok/Temml/blob/81641b37317ea6e6e074c3c3b4b712e0684f7d9d/site/assets/latinmodernmath.woff2), originally Latin Modern Math by GUST e-foundry | [GUST Font License](./GUST-FONT-LICENSE.txt), [LPPL 1.3c](./LPPL-1.3c.txt), [manifest](./MANIFEST-Latin-Modern-Math.txt), [README](./README-Latin-Modern-Math.txt) |
| Temml.woff2 | fc70501355ae6d38ff0b80f825af153557d5f2f474198d6b9b7dd2d3a291a0cc | [Temml source](https://github.com/ronkok/Temml/blob/81641b37317ea6e6e074c3c3b4b712e0684f7d9d/site/assets/Temml.woff2), derived from KaTeX Script glyphs | [KaTeX MIT](./KaTeX-LICENSE.txt), [Temml MIT](./Temml-LICENSE.txt) |

Original documents, retained without editing:

- GUST-FONT-LICENSE.txt: [same Temml source commit](https://github.com/ronkok/Temml/blob/81641b37317ea6e6e074c3c3b4b712e0684f7d9d/site/assets/GUST-FONT-LICENSE.txt).
- LPPL-1.3c.txt: [LaTeX Project](https://www.latex-project.org/lppl/lppl-1-3c.txt).
- MANIFEST-Latin-Modern-Math.txt and README-Latin-Modern-Math.txt: [GUST's Latin Modern Math distribution on CTAN](https://mirrors.ctan.org/fonts/lm-math/doc/).
- KaTeX-LICENSE.txt: [KaTeX v0.16.11](https://github.com/KaTeX/KaTeX/blob/v0.16.11/LICENSE).
- Temml-LICENSE.txt: [same Temml source commit](https://github.com/ronkok/Temml/blob/81641b37317ea6e6e074c3c3b4b712e0684f7d9d/LICENSE).

When redistributing standalone JavaScript files containing these fonts, retain
this directory alongside the distribution and preserve the original notices.
