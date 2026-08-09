# Glass

A liquid / frosted glass surface. `<r-glass>` frosts and refracts whatever sits behind it — `backdrop-filter` blur + saturate for the frost, an SVG `feDisplacementMap` for the liquid light-bending, plus a specular rim and highlight for the glass read. Everything is token-driven; content goes in the default slot.

> **Use when** you want a premium translucent panel over rich content — a hero card, a floating toolbar, a media overlay. The `displace` knob sets how _liquid_ it looks (0 is a flat frosted pane). All effects degrade to a plain translucent surface where `backdrop-filter` is unsupported.

## Playground

Drag the glass around the stage, tune every knob, and copy the exact markup. The default parameters are the iOS frosted-material look.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> Place `<r-glass>` over colorful or busy content — the effect is invisible over a flat background.

## Nesting

`<r-glass>` composes: nest one inside another for layered materials (e.g. a glass toolbar on a glass panel). Each layer refracts what's behind it.

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    Outer panel
    <r-glass radius="16" displace="6">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API Reference

### Properties

| Property      | Type      | Default | Description                                                                                       |
| ------------- | --------- | ------- | ------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`    | Backdrop blur radius, in px (the frost amount).                                                   |
| `saturate`    | `number`  | `180`   | Backdrop saturation, as a percentage — lifts the color of what's behind the glass.                |
| `displace`    | `number`  | `8`     | Liquid refraction strength (SVG displacement scale). `0` is a flat frosted pane; higher = wavier. |
| `frequency`   | `number`  | `0.005` | Turbulence base frequency — smaller values give larger, smoother ripples.                         |
| `radius`      | `number`  | `20`    | Corner radius, in px.                                                                             |
| `tint`        | `string`  | subtle  | Glass fill tint — any CSS background value.                                                       |
| `sheen`       | `boolean` | `false` | Animated specular sweep across the surface.                                                       |
| `interactive` | `boolean` | `false` | Hover lift + press-scale feedback, for clickable glass. Also makes the host a keyboard-operable button — `role="button"`, a tab stop, Enter/Space act like a click. |
| `rim`         | `boolean` | `false` | Opt-in WebGL specular rim + chromatic edge for a more physically-lit look. Falls back to the plain CSS specular gradient when WebGL is unavailable. |

### Refraction `displace`

`displace` drives the SVG `feDisplacementMap` scale — how strongly light bends through the surface. Set it to `0` for a plain frosted pane.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</Demo>

```html
<r-glass displace="0">…flat frost…</r-glass> <r-glass displace="60">…liquid…</r-glass>
```

### Sheen & interactive

`sheen` adds a moving specular highlight; `interactive` adds a hover lift and a springy press (using the shared `--ran-motion-ease-spring` token).

<Demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass sheen interactive displace="36">
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — WebGL specular edge (opt-in)

`rim` adds a second highlight layer rendered with WebGL: a specular rim lit from a fixed top-left light direction, plus a subtle chromatic (RGB) fringe at the panel's rounded-rect border. Unlike the `displace` refraction, **it never samples the backdrop** — the shader only knows the panel's own width/height/corner radius, so it costs none of the interactivity/accessibility tradeoffs a full backdrop-capturing WebGL approach would (see [Notes](#notes)). It's a purely decorative layer on top of the same `backdrop-filter` frost; turning it on or off never changes what's behind the glass or how it's sampled.

Silently falls back to the plain CSS specular gradient when WebGL is unavailable (very old browsers, WebGL disabled, SSR) — there's no broken/blank state to design around.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">no rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…plain CSS specular…</r-glass> <r-glass rim>…WebGL rim + chromatic edge…</r-glass>
```

### CSS parts & tokens

Style internals with `::part(glass)`, `::part(specular)`, and (when `rim` is set) `::part(rim)`, or override the `--ran-glass-*` custom properties:

| Token                          | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `--ran-glass-blur`             | Backdrop blur radius.                |
| `--ran-glass-saturate`         | Backdrop saturation.                 |
| `--ran-glass-radius`           | Corner radius.                       |
| `--ran-glass-tint`             | Fill background.                     |
| `--ran-glass-border`           | Rim border.                          |
| `--ran-glass-shadow`           | Box shadow stack (specular + depth). |
| `--ran-glass-specular-background` | Specular highlight background.       |
| `--ran-glass-specular-opacity` | Specular strength.                   |
| `--ran-glass-reduced-transparency-background` | Fallback surface when the OS "reduce transparency" setting is on. |
| `--ran-glass-reduced-transparency-shadow` | Fallback shadow in that same state. |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## Notes

- **Backdrop sampling.** `<r-glass>` refracts the DOM behind it via `backdrop-filter`, so it works over normal page content — including selectable text, live video, and interactive elements behind the glass. A WebGL/WebGPU shader path that rasterizes the *backdrop itself* would look more "liquid" and work identically across browsers, but costs that same interactivity/accessibility and a much heavier bundle — deliberately not pursued. `rim` (above) is the middle ground: a WebGL layer that never touches the backdrop, computed purely from the panel's own shape.
- **Legibility.** Keep body text on a solid inner surface; don't rely on the glass alone for contrast.
- **Reduced transparency.** `<r-glass>` responds to the OS-level "reduce transparency" / "increase contrast" setting (`prefers-reduced-transparency: reduce`): it swaps to a solid, theme-aware surface (`--ran-color-bg-elevated` by default) instead of frosting/refracting. Native controls do this automatically; this is the custom-element equivalent.
- **Cross-browser refraction.** The `feDisplacementMap` liquid effect currently renders in Chromium only — Safari and Firefox drop that part of the `backdrop-filter` value and keep the blur/saturate/brightness frost, which is a legitimate (if flatter) fallback, not a broken state.
- **Motion.** The surface only ever transitions `transform` (never color), so light/dark theme switches stay in one frame. Sheen and press respect `prefers-reduced-motion`.
