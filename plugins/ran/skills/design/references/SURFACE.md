<!-- Generated from design/SURFACE.md; edit the source, then run sync:agent-plugin. -->

# Surface language

How a product chooses **solid** versus **liquid glass**, independent of colour theme
(light / dark / system). Use it with the [design checklist](./DESIGN.md); ranui's mapping
lives in the
implementation adapter (installed `ranui` → `docs/DESIGN.md#ranui-implementation-adapter`,
or the source
[packages/ranui/docs/adapters/DESIGN.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)).

**MUST** marks a defect a user can observe. **SHOULD** is a starting point.

## Two axes

| Axis             | Choices                 | Stamps                                      | Switch                              |
| ---------------- | ----------------------- | ------------------------------------------- | ----------------------------------- |
| Colour theme     | system / light / dark   | `data-ran-theme`                            | `<r-theme-switch>` / `setTheme`     |
| Surface language | solid (default) / glass | `data-ran-surface="glass"` (absent = solid) | `<r-surface-switch>` / `setSurface` |

- **MUST** Keep the axes orthogonal. Glass still follows light and dark; a colour theme never
  implies a surface, and glass never implies a palette.
- **MUST** Solid is the default. Enable glass on purpose (`setSurface('glass')` or a host stamp).
- **SHOULD** Persist the reader's surface choice when the document root owns it (ranui:
  `localStorage` key `ran-surface`).

## When glass earns its place

Align with Apple's Liquid Glass (WWDC25 / HIG Materials): a **functional layer** that floats
above a **content layer**. Glass is Regular chrome — navigation, side rails, transient
panels, floating toolbars — not a second skin painted over every surface.

- **SHOULD** Put glass on **chrome** that floats above content (header bar, sidebar rail,
  menus, search, toasts that are overlays).
- **MUST** Keep **reading and editing content** solid enough to read: body copy, tables,
  cards, forms the reader fills for longer than a glance, long code.
- **MUST** Do not stack glass on glass. One frosted plate per layer; controls on that plate
  use vibrancy fills, not a second `backdrop-filter`.
- **SHOULD** Prefer Clear / Overlay glass only for short-lived layers (menus, search,
  sheets) that sit above Regular chrome — and only over media-rich content, with dimming
  when legibility needs it. Do not mix Regular and Clear on the same surface.

A docs site, a console and a marketing page spend glass differently. A document surface
stays quieter; a persuasive landing may let one glass moment carry the brand.

## Materials

- **SHOULD** Give glass a quiet atmosphere behind it (mist, soft wash, product imagery). A
  flat white page makes frost look like a pale box.
- **SHOULD** Use one shared recipe for fill, specular highlight, cool rim and soft depth so
  header, rail and overlays read as one language.
- **MUST** Honour `prefers-reduced-transparency: reduce`: drop blur, use an elevated solid
  fallback, and keep the same layout.
- **MUST** Text and controls on glass still meet WCAG AA on the real composition, in light
  and dark.

## Interactive state on glass

Frosted plates wash out faint fills. State that was clear on Graphite can disappear on glass.

- **MUST** Hover and selected remain distinguishable from each other and from rest.
- **MUST** State is never colour alone (weight, edge, rail or chip together with colour).
- **SHOULD** Hover uses a lighter chip; selected uses a denser chip plus weight (and a rail
  where the solid Graphite pattern already had one).

## Host responsibilities

Map Apple's control styles onto ranui pilots:

| Role                        | Apple idea                    | ranui                                                                                                                       |
| --------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Secondary / toolbar control | `glass`                       | Default `r-button`, under document glass or `surface="glass"`                                                               |
| Emphasized action           | `glassProminent` / solid fill | `type="primary"` and `type="warning"` stay **solid**                                                                        |
| Content surfaces            | Standard materials            | `r-card`, `r-input` stay **solid** under document glass; opt in with `surface="glass"` when the element itself is the plate |
| Transient overlays          | Clear / sheet glass           | `r-modal`, non-toast `r-message` under document glass or `surface="glass"`                                                  |
| Toast pills                 | Opaque emphasis               | Stay **solid**                                                                                                              |

Opt out of document glass on a control with `surface="solid"`.

Page chrome (docs headers, app shells) is the **host's** job: the library does not paint
your site header. Reuse the same principles above; do not invent a second glass vocabulary.

## Five-second check

1. Can you tell solid from glass without reading the switch label?
2. Is content still readable, or did frost cover the article?
3. Are hover and current page obvious on the frosted chrome?
4. Does reduced-transparency still look intentional?
5. Do light and dark glass both keep contrast?
