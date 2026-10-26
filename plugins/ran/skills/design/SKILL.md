---
name: design
description: Design, improve or review product interfaces, including layout, visual hierarchy, interaction and motion, with actual browser evidence. Works with the project's existing framework and component library.
---

# Ran Design

Use the host's product goals, framework and visual language. This skill needs no npm package.

Start with the [design index](references/README.md) and read only the owner relevant to the task.
For a small correction, keep the scope small. For a redesign, establish real content, primary tasks,
shared proportions and interaction states before decoration. Before implementation, record the
[style brief](references/DESIGN.md#style-coherence-across-components-and-pages) in the existing task
note; update that brief before changing direction. Compare composed screens before adding motion.

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
Preserve accessible names, useful constraints, errors and consequences.

Use screenshots of the actual host to inspect layout, content density and responsive states.
Use continuous recordings for changed transitions, streaming, navigation and interruption.
Record the source/runtime being inspected, observations and limits; fixtures do not certify another product.
Distinguish automated checks, agent visual review and human acceptance. Do not add a confirmation step
to work that is already authorized; the host project's own approval rules still apply.

## Before handing back

Check what the change touched; skip lines that do not apply. IDs resolve in the [rule index](references/RULES.md).

- The primary task and action are unmistakable on the changed surface (D-VERIFY-2).
- Spacing, type, colour, radius and elevation come from the host's tokens; nested radii follow their inset (D-VERIFY-8, D-ELEV-1).
- Changed states were exercised: hover, active, focus, disabled, loading, empty, error (D-VERIFY-5).
- Mouse, keyboard and touch work at narrow and wide widths; focus stays visible; state is never colour alone (D-INPUT-1, D-ACCESS-2–4).
- Text and values appear on first paint; any entrance motion matches the region table; reduced motion shows the final state (D-MOTION-13, D-MOTION-17, D-MOTION-10).
- Changed motion was watched as a continuous recording, including interruption and the reverse path (V-MOTION-1, V-MOTION-2).
- Long text, large numbers and the host's locales were tried (D-VERIFY-7).
- The report names the source revision inspected, labels each claim with its evidence, and says what stays unverified (V-FRESH-1, V-PROOF-23).

When the project uses ranui or ranuts, load that library's sibling skill for installed-version contracts.
These design references describe methods, not APIs or permission to install or upgrade dependencies.
