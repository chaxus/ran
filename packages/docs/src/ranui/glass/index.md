---
description: 'A liquid glass surface: pick a material, and it frosts and bends what is behind it at a lensed edge. Over an image or video it refracts the pixels themselves with WebGL2.'
---

# Glass

A liquid glass surface. Pick a `material` and the pane is done: it frosts what is behind it, bends that at a curved edge the way a lens does, splits the colors slightly at the rim and lights the edge. Any single value can be overridden by an attribute of the same name. Content goes in the default slot and takes an ink that reads on the glass.

> **Use when** a panel sits over rich, colorful content: a hero card, a floating toolbar, a media overlay. Over a flat background there is nothing to bend and the effect disappears.

## Playground

Drag the glass, switch the material and the backdrop, and copy the markup. The snippet only carries what differs from the material.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## Materials

Four materials cover most uses. `regular` is the default.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| Material  | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## Over an image

Add `backdrop` when the glass sits over an `<img>` or `<video>`. Without a value it uses the first image or video in the glass's parent; a selector names another one. The glass then reads that element's pixels with WebGL2 and refracts each wavelength by its own amount, in every engine with WebGL2, where the CSS path bends light only in Chromium. The image stays in the page, so its alt text and the content around it are unchanged.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

A cross-origin image needs `crossorigin` and a CORS response to be readable; otherwise the glass keeps its CSS frost.

## Tone and ink

`tone` says what is behind the glass. On a dark or colorful backdrop the edge is lit and the content is white; on a pale one a white edge disappears, so the edge is shaded and the content turns dark. Over a `backdrop` image the tone follows the brightness of the covered area unless you set it. The tone in effect is available as `:state(light)` and `:state(dark)`, and `--ran-glass-ink` overrides the content color.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## Nesting

`<r-glass>` composes: nest one inside another for layered materials, such as a glass toolbar on a glass panel. Each layer bends what is behind it.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## API Reference

### Properties

| Property      | Type      | Default   | Description                                                                                                                                                        |
| ------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `material`    | `string`  | `regular` | `thin`, `regular`, `thick` or `clear`: sets every optical value below at once.                                                                                     |
| `blur`        | `number`  | material  | Frost radius, in px.                                                                                                                                               |
| `saturate`    | `number`  | material  | Saturation of what is behind, as a percentage.                                                                                                                     |
| `displace`    | `number`  | material  | How far the edge pulls the backdrop inward, in px. `0` is a flat pane.                                                                                             |
| `bevel`       | `number`  | material  | Width of the curved edge band that bends light, in px.                                                                                                             |
| `dispersion`  | `number`  | material  | How far the colors split at the edge, as a percentage of `displace`.                                                                                               |
| `specular`    | `number`  | material  | Strength of the highlights, as a percentage.                                                                                                                       |
| `radius`      | `number`  | `20`      | Corner radius, in px.                                                                                                                                              |
| `tint`        | `string`  | material  | Fill over the frost: any CSS background value.                                                                                                                     |
| `tone`        | `string`  | `dark`    | `dark` or `light`: what sits behind the glass. Left unset over a `backdrop`, it follows the image.                                                                 |
| `backdrop`    | `string`  | —         | Refract an `<img>` or `<video>` with WebGL2. Empty uses the first one in the parent; a selector names another.                                                     |
| `rim`         | `boolean` | `false`   | A GPU-lit edge: outer and inner walls, a key light and a fill light, glints. Depends only on the pane's shape.                                                     |
| `sheen`       | `boolean` | `false`   | A highlight that sweeps across the surface.                                                                                                                        |
| `interactive` | `boolean` | `false`   | Hover lift and press feedback, for clickable glass. Also makes the host a keyboard-operable button: `role="button"`, a tab stop, Enter and Space act like a click. |

### Refraction `displace`

`displace` sets how far the edge pulls what is behind it toward the center, so the backdrop just inside the rim is stretched over it, the way a thick convex edge magnifies. `bevel` sets how wide that curved band is. Above half the bevel the edge folds the image back on itself, as the rim of real thick glass does.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### Sheen & interactive

`sheen` adds a moving highlight; `interactive` adds a hover lift and a press that settles back.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — GPU specular edge (opt-in)

`rim` draws the edge on the GPU: a bright outer wall and a fainter inner wall where the bevel meets the flat face, lit by a key light from the top left and a dim fill from the bottom right, with thickness that varies along the edge and occasional glints. On a `light` tone the walls are shaded instead. It never samples the backdrop: the shader only knows the pane's size, radius and bevel. It renders on WebGL first, moves to WebGPU in the background when the browser has it, and leaves the CSS highlight alone when neither is available.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### CSS parts & tokens

Style internals with `::part(glass)`, `::part(specular)`, `::part(refraction)` and, when `rim` is set, `::part(rim)`, or override the `--ran-glass-*` custom properties:

| Token                                         | Purpose                                                           |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `--ran-glass-ink`                             | Content color. Defaults to white, or near-black on a light tone.  |
| `--ran-glass-tint`                            | Fill over the frost.                                              |
| `--ran-glass-border`                          | Edge border.                                                      |
| `--ran-glass-shadow`                          | Box shadow stack (specular and depth).                            |
| `--ran-glass-brightness`                      | Brightness of what is behind.                                     |
| `--ran-glass-specular-background`             | CSS highlight background.                                         |
| `--ran-glass-specular-opacity`                | CSS highlight strength; overrides `specular` for that layer.      |
| `--ran-glass-reduced-transparency-background` | Fallback surface when the OS "reduce transparency" setting is on. |
| `--ran-glass-reduced-transparency-shadow`     | Fallback shadow in that same state.                               |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## Notes

- **Two paths.** Without `backdrop`, `backdrop-filter` frosts the live page behind the glass, so text, video and controls behind it keep working; the lensed, color-split edge is an SVG filter that renders in Chromium, and Safari and Firefox keep the frost. With `backdrop`, WebGL2 refracts that one image or video in every engine that has WebGL2.
- **Legibility.** Content takes `--ran-glass-ink`. Keep long text on a solid inner surface rather than relying on the glass for contrast.
- **Reduced transparency.** Under the OS "reduce transparency" or "increase contrast" setting (`prefers-reduced-transparency: reduce`) the glass becomes a solid, theme-aware surface (`--ran-color-bg-elevated`), without frost, refraction or highlights.
- **Motion.** The surface only transitions `transform`, so a theme switch lands in one frame. Sheen and press respect `prefers-reduced-motion`.
- **Cost.** The SVG lens map is rebuilt when the pane's size, radius or bevel changes. The WebGL refraction checks the pane and the image once a frame while visible and draws only when one of them moved.
