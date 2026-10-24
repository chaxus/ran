# Loading: complete variant review and targeted repairs

Reviewed all 29 named variants in both themes at 1280px and 360px, with normal and reduced motion. `final/` retains 8 complete galleries and 116 individually scrolled captures, plus geometry/animation observations. `full-cycle/` contains two continuous recordings spanning 14 seconds of normal motion (including the 12-second solar cycle) followed by 2 seconds of reduced motion. Decoded sequences support temporal inspection; they are not a frame-rate benchmark. The manifest binds source inputs and media to the actual host Chromium version.

## Repairs accepted in this batch

- Arc keeps an in-flow, theme-colored label; reduced motion no longer removes it.
- Dot-pulse immediately exposes its five static dots with reduced motion, without staggered disappearance.
- Circle-line, pulse, dot-bar and dot-line use semantic ink. The circle core follows the surface, and dot-line no longer needs an extensive neon glow to distinguish its marks.
- Drop's label sits below the illustration in theme ink. A clipped visual wrapper prevents falling droplets from crossing the label or adjacent content. The first attempted outside label without this clip was rejected during recording review.

The focused browser run passed 19 cases (Loading/Scratch plus Player chrome/demo); a further three Loading cases passed after clipping drop. The added behavioral check measures contrast and text separation rather than accepting a replacement screenshot alone. The design gate decreased from 302 to 294 existing violations; no limit increased.

## Outcome and remaining design scope

These are bounded repairs, not a claim that all 29 illustrations now form one premium product palette. Existing stylized variants such as circle-rotate/spin/turn, solar and the very small dot-circle retain their distinct art direction. Dot-circle is visibly tiny in both motion modes; it should not be chosen as a sole high-salience progress indicator. Default semantic indicators are preferable for product status. Custom overrides and every instantaneous alpha value are not contrast-certified by this gallery. All variants render in the tested themes/modes; additional art-direction work remains explicit instead of being hidden behind passing snapshots.
