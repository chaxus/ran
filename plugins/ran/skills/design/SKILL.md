---
name: design
description: Design, improve or review product interfaces, including layout, visual hierarchy, interaction and motion, with actual browser evidence. Works with the project's existing framework and component library.
---

# Ran Design

Use the host's product goals, framework and visual language. This skill needs no npm package.

Read the [design checklist](references/DESIGN.md). It is one page: before you start, the five-second
and trunk tests, visual language, layout, interaction, motion, words and verification. A small
correction stays small.

For a page or region you are building or restructuring, write the
[brief](references/DESIGN.md#before-you-start) in the existing task note first, and update it before
changing direction. Compare composed screens before adding motion.

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
Preserve accessible names, useful constraints, errors and consequences.

Open the change in the real host: screenshots for layout, density and responsive states; continuous
recordings for changed transitions, streaming, navigation and interruption. Say which revision you
inspected, what you observed, what you only inferred and what you could not check. Do not mark your
own review as accepted; the host project's approval rules still apply.

## Before handing back

Walk the [checklist](references/DESIGN.md) again, including the five-second and trunk tests on any
page whose structure changed; skip lines that do not apply to the change.

When the project uses ranui or ranuts, load that library's sibling skill for installed-version contracts.
These design references describe methods, not APIs or permission to install or upgrade dependencies.
