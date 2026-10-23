# ranui demo product brief

## Register

brand

## Users

Frontend engineers, UI library maintainers, and technical learners evaluating Web Components for real applications. They arrive with a developer mindset: they want to see whether ranui is native, themeable, inspectable, and usable across frameworks before reading full API documentation.

## Product Purpose

ranui is an experimental Web Components UI library. The demo should introduce the library, prove that the components are real custom elements, and make theme packs, import paths, styling hooks, and representative components easy to inspect in one page.

## Brand Personality

Precise, experimental, and tool-minded. The interface should feel like a component workbench for engineers, not a generic SaaS landing page or a decorative gallery.

## Anti-references

Avoid purple-gradient SaaS templates, oversized hero metrics, vague marketing claims, stock illustrations, and demo pages that look like raw component test fixtures. Avoid hiding the actual components behind screenshots or decorative mockups.

## Design Principles

- Show real components first.
- Treat theme switching as the signature interaction.
- Keep developer next steps visible: install, import, inspect, style.
- Make the page dense enough for scanning without feeling like an API dump.
- Preserve ranui's experimental honesty while making the library feel intentional.

## Accessibility & Inclusion

Target WCAG AA contrast for page chrome and documentation content. Respect reduced motion, keep touch targets at least 44px on coarse pointers, avoid hover-only functionality, and ensure anchors land below sticky navigation.

## Component-stage interaction contract

Component demo frames and ordinary `r-card` examples contain controls; they are not themselves
navigation targets. Their border, elevation and position stay stable while a child is hovered,
tapped or focused. This distinguishes the actual control from its container and avoids sticky
synthetic hover on touch. Real navigation cards and explicit actions retain their own affordance.
Verify unchanged frame geometry and border on mouse/touch in both motion preferences, then inspect
an opened Popover together with its trigger. Do not normalize a screenshot by hiding the frame.
