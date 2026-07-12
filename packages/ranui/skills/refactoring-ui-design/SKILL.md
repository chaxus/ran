---
name: refactoring-ui-design
description: Use when designing, reviewing, or improving web UI visual quality, especially when a developer-built interface feels cluttered, flat, generic, poorly spaced, weakly hierarchical, or hard to scan.
license: MIT
metadata:
  version: 1.0.0
  category: design
  tags: [ui, design, refactoring, visual-hierarchy, spacing, color, typography]
  homepage: https://www.refactoringui.com/
  # This Markdown body is the single source of truth for the skill instructions.
  # Per-vendor adapters live in ./agents/ and reference this file — see README.md.
  agents: [claude, openai]
---

# Refactoring UI Design

## Overview

Apply Refactoring UI's developer-oriented design tactics to make an interface clearer, more polished, and easier to use. Treat visual design as a sequence of concrete refactors, not as decoration or vague taste.

This skill is distilled from the public Refactoring UI site and its published table of contents. Do not quote or reproduce paid book content.

## When to Use

Use this when:

- Building or redesigning a frontend screen, component, dashboard, form, landing page, or documentation page.
- Reviewing a UI that "works" functionally but looks unpolished.
- Choosing spacing, typography, colors, shadows, imagery, or visual hierarchy.
- Converting a wireframe or plain HTML into a finished interface.

Do not use this to override explicit product requirements, an existing design system, accessibility requirements, or brand guidelines. Use it to improve execution within those constraints.

## Workflow

1. Start with the feature, not the layout.
   - Identify the primary job, primary user action, and most important information.
   - Design enough real content to solve that job before adding surrounding sections.
   - Avoid designing too many states or pages before the core screen works.

2. Choose a personality, then limit choices.
   - Pick a small set of reusable decisions for radius, spacing, type scale, color, shadow, and border strength.
   - Reuse tokens and local patterns. Random one-off values usually make the UI look accidental.

3. Establish hierarchy before styling details.
   - Not all elements are equal. Make the primary action, current state, and key content visually dominant.
   - Use size, weight, color, contrast, spacing, and position together; do not rely on font size alone.
   - De-emphasize supporting labels, metadata, disabled actions, helper text, and secondary controls.
   - Replace unnecessary labels with context, grouping, icons, or stronger content structure when the meaning remains clear.

4. Fix layout and spacing.
   - Start with more whitespace than feels natural, then tighten only where relationships need to be clear.
   - Use a spacing scale instead of arbitrary margins.
   - Do not fill the whole screen just because space exists.
   - Avoid ambiguous spacing: related items should be closer to each other than to unrelated items.
   - Prefer simple alignment and grouping over complex grids unless the content genuinely needs a grid.

5. Tune text.
   - Use a deliberate type scale with a small number of sizes.
   - Keep body copy line length readable.
   - Align text for scanning; avoid centered text in dense operational interfaces.
   - Make line-height proportional to text size.
   - Links and interactive text do not always need bright link color if context already signals interactivity.
   - Use letter spacing sparingly, mainly for small uppercase labels.

6. Build color from roles, not decoration.
   - Define neutral, primary, accent, success, warning, danger, and surface shades before scattering colors.
   - Use multiple shades per color role so hover, active, border, background, and text states feel related.
   - Maintain contrast, but do not solve everything with pure black, pure white, or harsh saturated colors.
   - Do not rely on color alone for state; pair it with labels, icons, shape, or position.

7. Add depth only where it clarifies structure.
   - Use shadows to communicate elevation, layering, or focus.
   - Replace excessive borders with background contrast, spacing, or subtle shadow.
   - If using shadows, keep the light source consistent.
   - Overlap elements only when it improves hierarchy or establishes a useful layer.

8. Handle images and media deliberately.
   - Use images at an intended size and crop; do not let arbitrary uploads define the layout.
   - Ensure text over images has consistent contrast across likely image content.
   - Avoid blurry, dark, generic, or decorative imagery when the user needs to inspect real content.

9. Finish with small polish passes.
   - Improve empty states, default browser controls, focus states, hover states, and loading states.
   - Add accent borders, subtle backgrounds, or icon treatments only when they clarify grouping or state.
   - Remove visual noise before adding more visual effects.

## UI Smell Fixes

| Smell                       | Refactor                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------- |
| Everything competes equally | Increase hierarchy with weight, contrast, spacing, and position.                                    |
| Too many boxes and lines    | Remove borders; use spacing, background contrast, or subtle shadow.                                 |
| Page feels cramped          | Increase outer padding and group spacing before changing colors.                                    |
| Page feels sparse           | Constrain width, tighten related groups, and add content hierarchy.                                 |
| Content is hard to scan     | Add section structure, consistent alignment, and stronger labels or metadata treatment.             |
| Colors feel random          | Reduce to defined roles and shade scales.                                                           |
| UI feels flat               | Add elevation, overlap, or background layering only where structure needs it.                       |
| Typography feels amateur    | Reduce font sizes, use fewer weights, improve line-height, and enforce readable line length.        |
| Forms feel heavy            | Group fields, reduce label emphasis, clarify primary action, and remove unnecessary dividers.       |
| Dashboard feels noisy       | De-emphasize chrome, emphasize current data, and use tables/cards only where comparison needs them. |

## Implementation Rules

- Prefer editing real UI over explaining design theory.
- Make a first pass on structure and hierarchy before colors and shadows.
- Use tokens or CSS variables when the project has them.
- Keep changes consistent with the surrounding component library.
- Verify responsive behavior. Spacing, line length, and hierarchy must work on mobile and desktop.
- Motion is for interaction, not for theme changes. Never let a light↔dark switch animate — no `transition: all` and no `background`/`background-color` in a transition on themed surfaces, or the surface visibly fades (e.g. a white→dark flash) while the rest of the page has flipped instantly.
- If a design system supports dark mode, verify the result in **both** light and dark, and while **toggling** between them (flashes only show mid-switch) — not just in a single static theme.
- For significant frontend changes, inspect the result visually in a browser screenshot before claiming completion.

## Source Notes

Public Refactoring UI themes used here include: starting from a feature, limiting choices, hierarchy, layout and spacing, text design, color systems, depth, images, and finishing touches.
