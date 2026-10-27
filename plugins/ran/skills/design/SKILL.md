---
name: design
description: Design, improve or review product interfaces, including layout, visual hierarchy, interaction and motion, with actual browser evidence. Works with the project's existing framework and component library.
---

# Ran Design

Use the host's product goals, framework and visual language. This skill needs no npm package.

Read the [design guide](references/DESIGN.md). It is one page, ordered the way you design: start
from the task, then visual language, layout, components, interaction, motion and words. Read the
sections the task touches; a small correction stays small.

Before implementation, write the [brief](references/DESIGN.md#start-from-the-task) in the existing
task note, and update it before changing direction. Compare composed screens before adding motion.

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
Preserve accessible names, useful constraints, errors and consequences.

Open the change in the real host: screenshots for layout, density and responsive states; continuous
recordings for changed transitions, streaming, navigation and interruption. Say which revision you
inspected, what you observed, what you only inferred and what you could not check. Do not mark your
own review as accepted; the host project's approval rules still apply.

## Before handing back

Walk the [review checklist](references/DESIGN.md#review-checklist) and the
[guidance for coding agents](references/DESIGN.md#guidance-for-coding-agents); skip lines that do
not apply to the change.

When the project uses ranui or ranuts, load that library's sibling skill for installed-version contracts.
These design references describe methods, not APIs or permission to install or upgrade dependencies.
