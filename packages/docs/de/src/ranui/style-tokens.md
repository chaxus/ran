---
title: ranui-Style-Tokens
description: 'Die CSS-Custom-Properties und ::part()-Namen, die jedes ranui-Element bereitstellt — aus seinem Stylesheet extrahiert.'
---

# Style-Tokens und Parts

Jede CSS-Custom-Property und jeder `::part()`-Name, den ein Element bereitstellt, von
`pnpm -F ranui doc:style` aus dessen Stylesheet extrahiert und daher nie veraltet.
Strukturelle und interne Tokens sind herausgefiltert: Was bleibt, ist die Styling-API, auf
die du dich verlassen kannst.

Setze ein Token überall dort, wo es vererbt wird — `:root`, ein Wrapper oder das Element
selbst — und bevorzuge ein semantisches Token, wenn eines die Änderung abdeckt: es erreicht
alle Komponenten auf einmal. Das Vokabular ist das [Designsystem](/de/src/ranui/design-system/);
die Namensregel lautet `--ran-{component}-{element}[-{state}]-{property}`.

## `attachments`

- Tokens: 32
- Parts: 7

### Tokens
<!-- layers: semantic: 9 · internal: 23 -->
- `--ran-attachment-background`
- `--ran-attachment-border-color`
- `--ran-attachment-border-radius`
- `--ran-attachment-focus-color`
- `--ran-attachment-gap`
- `--ran-attachment-icon-color`
- `--ran-attachment-name-color`
- `--ran-attachment-name-font-size`
- `--ran-attachment-remove-color`
- `--ran-attachment-remove-hover-background`
- `--ran-attachment-remove-hover-color`
- `--ran-attachment-remove-radius`
- `--ran-attachment-remove-size`
- `--ran-attachment-size-color`
- `--ran-attachment-size-font-size`
- `--ran-attachment-thumb-radius`
- `--ran-attachment-thumb-size`
- `--ran-attachments-gap`
- `--ran-color-bg-hover`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-radius-full`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-size-4`
- `--ran-size-6`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-text-label-3`

### Parts
- `attachment`
- `icon`
- `list`
- `name`
- `remove`
- `size`
- `thumb`

## `button`

- Tokens: 75
- Parts: 2

### Tokens
<!-- layers: semantic: 16 · skin: 2 · component: 48 · internal: 9 -->
- `--ran-btn-active-background`
- `--ran-btn-active-border-color`
- `--ran-btn-active-scale`
- `--ran-btn-after-background-image`
- `--ran-btn-after-opacity`
- `--ran-btn-after-transform`
- `--ran-btn-after-transition`
- `--ran-btn-align-items`
- `--ran-btn-align-self`
- `--ran-btn-background`
- `--ran-btn-background-image`
- `--ran-btn-border`
- `--ran-btn-border-color`
- `--ran-btn-border-image-slice`
- `--ran-btn-border-image-source`
- `--ran-btn-border-radius`
- `--ran-btn-box-shadow`
- `--ran-btn-color`
- `--ran-btn-content-background-image`
- `--ran-btn-content-justify-content`
- `--ran-btn-disabled-background`
- `--ran-btn-disabled-border-color`
- `--ran-btn-disabled-box-shadow`
- `--ran-btn-disabled-color`
- `--ran-btn-disabled-opacity`
- `--ran-btn-font-family`
- `--ran-btn-font-size`
- `--ran-btn-font-weight`
- `--ran-btn-hover-background`
- `--ran-btn-hover-border-color`
- `--ran-btn-hover-color`
- `--ran-btn-padding`
- `--ran-btn-surface-background`
- `--ran-btn-surface-background-image`
- `--ran-btn-surface-disabled-opacity`
- `--ran-btn-surface-transition`
- `--ran-btn-surface-user-select`
- `--ran-btn-text-align`
- `--ran-btn-text-border`
- `--ran-btn-text-box-shadow`
- `--ran-btn-text-disabled-background`
- `--ran-btn-text-surface-background`
- `--ran-btn-transition`
- `--ran-btn-user-select`
- `--ran-btn-warning-background`
- `--ran-btn-warning-border-color`
- `--ran-btn-warning-color`
- `--ran-btn-white-space`
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-hover`
- `--ran-color-danger`
- `--ran-color-focus`
- `--ran-color-primary`
- `--ran-color-primary-active`
- `--ran-color-primary-hover`
- `--ran-color-primary-text`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-focus-ring`
- `--ran-gray-alpha-400`
- `--ran-motion-duration-base`
- `--ran-motion-ease-standard`
- `--ran-radius-full`
- `--ran-radius-sm`
- `--ran-red-700`
- `--ran-size-7`
- `--ran-skin-font-family`
- `--ran-skin-raised-shadow`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-4`
- `--ran-text-button-size`
- `--ran-text-button-weight`

### Parts
- `button`
- `content`

## `card`

- Tokens: 30
- Parts: 7

### Tokens
<!-- layers: semantic: 7 · skin: 1 · internal: 22 -->
- `--ran-card-background`
- `--ran-card-border-color`
- `--ran-card-description-color`
- `--ran-card-description-font-size`
- `--ran-card-description-font-weight`
- `--ran-card-gap`
- `--ran-card-header-gap`
- `--ran-card-hover-border-color`
- `--ran-card-hover-shadow`
- `--ran-card-radius`
- `--ran-card-shadow`
- `--ran-card-title-color`
- `--ran-card-title-font-size`
- `--ran-card-title-font-weight`
- `--ran-card-title-letter-spacing`
- `--ran-color-bg-elevated`
- `--ran-color-border`
- `--ran-color-border-hover`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-radius-md`
- `--ran-shadow-elevated`
- `--ran-skin-border-style`
- `--ran-space-1`
- `--ran-space-4`
- `--ran-text-copy-2`
- `--ran-text-copy-weight`
- `--ran-text-heading-4`
- `--ran-text-heading-tracking`
- `--ran-text-heading-weight`

### Parts
- `body`
- `card`
- `description`
- `extra`
- `footer`
- `header`
- `title`

## `checkbox`

- Tokens: 53
- Parts: 5

### Tokens
<!-- layers: semantic: 11 · skin: 1 · component: 36 · internal: 5 -->
- `--ran-checkbox-border-radius`
- `--ran-checkbox-checked-background-color`
- `--ran-checkbox-checked-background-image`
- `--ran-checkbox-checked-border`
- `--ran-checkbox-color`
- `--ran-checkbox-disabled-background-color`
- `--ran-checkbox-disabled-border`
- `--ran-checkbox-disabled-label-color`
- `--ran-checkbox-disabled-opacity`
- `--ran-checkbox-disabled-tick-color`
- `--ran-checkbox-focus-box-shadow`
- `--ran-checkbox-font-family`
- `--ran-checkbox-font-size`
- `--ran-checkbox-hover-border-color`
- `--ran-checkbox-inner-background-color`
- `--ran-checkbox-inner-border`
- `--ran-checkbox-inner-border-collapse`
- `--ran-checkbox-inner-border-image-slice`
- `--ran-checkbox-inner-border-image-source`
- `--ran-checkbox-inner-border-radius`
- `--ran-checkbox-inner-direction`
- `--ran-checkbox-input-opacity`
- `--ran-checkbox-label-color`
- `--ran-checkbox-label-font-family`
- `--ran-checkbox-label-font-size`
- `--ran-checkbox-label-font-weight`
- `--ran-checkbox-label-gap`
- `--ran-checkbox-pop-animation`
- `--ran-checkbox-tick-border`
- `--ran-checkbox-tick-border-inline-start`
- `--ran-checkbox-tick-checked-opacity`
- `--ran-checkbox-tick-content`
- `--ran-checkbox-tick-opacity`
- `--ran-checkbox-tick-transform`
- `--ran-checkbox-tick-transition`
- `--ran-checkbox-white-space`
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border-control`
- `--ran-color-border-control-hover`
- `--ran-color-border-hover`
- `--ran-color-primary`
- `--ran-color-primary-text`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-focus-ring`
- `--ran-gray-700`
- `--ran-motion-duration-base`
- `--ran-motion-ease-bouncy`
- `--ran-size-1`
- `--ran-skin-font-family`
- `--ran-text-label-1`
- `--ran-text-label-weight`

### Parts
- `checkbox`
- `inner`
- `input`
- `label`
- `wrapper`

## `colorpicker`

- Tokens: 20
- Parts: 2

### Tokens
<!-- layers: semantic: 6 · component: 10 · internal: 4 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-control`
- `--ran-color-border-control-hover`
- `--ran-colorpicker-background`
- `--ran-colorpicker-block-border-radius`
- `--ran-colorpicker-border`
- `--ran-colorpicker-border-radius`
- `--ran-colorpicker-disabled-background`
- `--ran-colorpicker-disabled-border-color`
- `--ran-colorpicker-disabled-opacity`
- `--ran-colorpicker-focus-ring`
- `--ran-colorpicker-hover-border-color`
- `--ran-colorpicker-transition`
- `--ran-focus-ring`
- `--ran-gray-alpha-100`
- `--ran-gray-alpha-200`
- `--ran-radius-sm`
- `--ran-size-7`

### Parts
- `block`
- `swatch`

## `conversation`

- Tokens: 27
- Parts: 5

### Tokens
<!-- layers: semantic: 7 · internal: 20 -->
- `--ran-color-bg`
- `--ran-color-border`
- `--ran-color-border-hover`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-conversation-background`
- `--ran-conversation-color`
- `--ran-conversation-empty-color`
- `--ran-conversation-font-size`
- `--ran-conversation-footer-background`
- `--ran-conversation-gap`
- `--ran-conversation-measure`
- `--ran-conversation-older-border-color`
- `--ran-conversation-older-color`
- `--ran-conversation-older-font-size`
- `--ran-conversation-older-hover-border-color`
- `--ran-conversation-older-hover-color`
- `--ran-conversation-older-radius`
- `--ran-conversation-step-gap`
- `--ran-radius-full`
- `--ran-space-1`
- `--ran-space-3`
- `--ran-space-4`
- `--ran-space-8`
- `--ran-text-copy-2`
- `--ran-text-label-3`

### Parts
- `conversation`
- `empty`
- `footer`
- `list`
- `older`

## `disclosure-row`

- Tokens: 31
- Parts: 7

### Tokens
<!-- layers: semantic: 11 · internal: 20 -->
- `--ran-color-bg`
- `--ran-color-bg-hover`
- `--ran-color-danger`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-color-text-secondary`
- `--ran-disclosure-body-indent`
- `--ran-disclosure-chevron-size`
- `--ran-disclosure-color`
- `--ran-disclosure-error-color`
- `--ran-disclosure-font-size`
- `--ran-disclosure-gap`
- `--ran-disclosure-hover-background`
- `--ran-disclosure-leading-color`
- `--ran-disclosure-leading-size`
- `--ran-disclosure-radius`
- `--ran-disclosure-sep-color`
- `--ran-disclosure-summary-color`
- `--ran-disclosure-sweep-color`
- `--ran-disclosure-sweep-duration`
- `--ran-disclosure-title-weight`
- `--ran-disclosure-toggle-duration`
- `--ran-disclosure-transition`
- `--ran-motion-duration-base`
- `--ran-motion-duration-fast`
- `--ran-motion-ease-standard`
- `--ran-radius-sm`
- `--ran-size-7`
- `--ran-space-2`
- `--ran-text-copy-2`

### Parts
- `body`
- `disclosure`
- `leading`
- `row`
- `separator`
- `summary`
- `title`

## `dropdown`

- Tokens: 30
- Parts: 1

### Tokens
<!-- layers: semantic: 8 · skin: 1 · component: 17 · internal: 4 -->
- `--ran-color-bg-elevated`
- `--ran-color-border`
- `--ran-color-text`
- `--ran-dropdown-animation-duration`
- `--ran-dropdown-animation-timing-function`
- `--ran-dropdown-arrow-anchor-offset`
- `--ran-dropdown-arrow-fill-background`
- `--ran-dropdown-arrow-overlap`
- `--ran-dropdown-arrow-shadow`
- `--ran-dropdown-arrow-shape-offset`
- `--ran-dropdown-arrow-tip-background`
- `--ran-dropdown-background`
- `--ran-dropdown-border`
- `--ran-dropdown-border-radius`
- `--ran-dropdown-box-shadow`
- `--ran-dropdown-color`
- `--ran-dropdown-font-family`
- `--ran-dropdown-font-size`
- `--ran-dropdown-font-variant`
- `--ran-dropdown-font-weight`
- `--ran-motion-duration-base`
- `--ran-motion-ease-standard`
- `--ran-radius-md`
- `--ran-shadow-elevated`
- `--ran-shadow-menu`
- `--ran-skin-font-family`
- `--ran-space-1`
- `--ran-text-label-1`
- `--ran-text-label-weight`
- `--ran-z-dropdown`

### Parts
- `dropdown`

## `fan-gallery`

- Tokens: 4
- Parts: 1

### Tokens
<!-- layers: internal: 4 -->
- `--ran-fan-gallery-lift`
- `--ran-fan-gallery-pivot`
- `--ran-space-10`
- `--ran-space-4`

### Parts
- `stage`

## `glass`

- Tokens: 20
- Parts: 2

### Tokens
<!-- layers: semantic: 6 · internal: 14 -->
- `--ran-color-bg-elevated`
- `--ran-glass-blur`
- `--ran-glass-border`
- `--ran-glass-brightness`
- `--ran-glass-radius`
- `--ran-glass-reduced-transparency-background`
- `--ran-glass-reduced-transparency-shadow`
- `--ran-glass-refraction`
- `--ran-glass-saturate`
- `--ran-glass-shadow`
- `--ran-glass-sheen-duration`
- `--ran-glass-specular-background`
- `--ran-glass-specular-opacity`
- `--ran-glass-tint`
- `--ran-glass-transition`
- `--ran-motion-duration-base`
- `--ran-motion-duration-fast`
- `--ran-motion-ease-spring`
- `--ran-radius-lg`
- `--ran-shadow-elevated`

### Parts
- `glass`
- `specular`

## `icon`

- Tokens: 6
- Parts: 1

### Tokens
<!-- layers: component: 6 -->
- `--ran-icon-align-items`
- `--ran-icon-color`
- `--ran-icon-font-size`
- `--ran-icon-justify-content`
- `--ran-icon-svg-fill`
- `--ran-icon-svg-stroke`

### Parts
- `ran-icon`

## `image`

- Tokens: 6
- Parts: 1

### Tokens
<!-- layers: semantic: 2 · component: 2 · internal: 2 -->
- `--ran-color-bg-muted`
- `--ran-color-text-secondary`
- `--ran-image-fallback-color`
- `--ran-image-placeholder-background`
- `--ran-size-4`
- `--ran-space-10`

### Parts
- `image`

## `input`

- Tokens: 88
- Parts: 4

### Tokens
<!-- layers: semantic: 14 · skin: 1 · component: 61 · internal: 12 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-control`
- `--ran-color-border-control-hover`
- `--ran-color-danger`
- `--ran-color-danger-foreground`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-color-text-placeholder`
- `--ran-color-text-secondary`
- `--ran-color-warning`
- `--ran-color-warning-foreground`
- `--ran-focus-ring`
- `--ran-input-active-border-color`
- `--ran-input-active-box-shadow`
- `--ran-input-align-items`
- `--ran-input-background-color`
- `--ran-input-background-image`
- `--ran-input-border`
- `--ran-input-border-image-slice`
- `--ran-input-border-image-source`
- `--ran-input-border-radius`
- `--ran-input-color`
- `--ran-input-content--webkit-appearance`
- `--ran-input-content-background-color`
- `--ran-input-content-background-image`
- `--ran-input-content-border`
- `--ran-input-content-border-radius`
- `--ran-input-content-color`
- `--ran-input-content-disabled-background-color`
- `--ran-input-content-disabled-border-color`
- `--ran-input-content-disabled-box-shadow`
- `--ran-input-content-disabled-color`
- `--ran-input-content-disabled-opacity`
- `--ran-input-content-font-feature-settings`
- `--ran-input-content-font-size`
- `--ran-input-content-font-variant`
- `--ran-input-content-font-weight`
- `--ran-input-content-hover-border`
- `--ran-input-content-hover-box-shadow`
- `--ran-input-content-letter-spacing`
- `--ran-input-content-placeholder-color`
- `--ran-input-content-text-align`
- `--ran-input-content-text-indent`
- `--ran-input-content-text-rendering`
- `--ran-input-content-text-shadow`
- `--ran-input-content-text-transform`
- `--ran-input-content-transition`
- `--ran-input-content-word-spacing`
- `--ran-input-content-writing-mode`
- `--ran-input-disabled-background-color`
- `--ran-input-disabled-border-color`
- `--ran-input-disabled-box-shadow`
- `--ran-input-disabled-color`
- `--ran-input-disabled-opacity`
- `--ran-input-error-border-color`
- `--ran-input-font-family`
- `--ran-input-font-size`
- `--ran-input-hover-border-color`
- `--ran-input-icon-align-items`
- `--ran-input-icon-justify-content`
- `--ran-input-label-color`
- `--ran-input-label-disabled-color`
- `--ran-input-label-error-color`
- `--ran-input-label-font-size`
- `--ran-input-label-font-weight`
- `--ran-input-label-warning-color`
- `--ran-input-message-color`
- `--ran-input-message-error-color`
- `--ran-input-message-font-size`
- `--ran-input-message-font-weight`
- `--ran-input-message-warning-color`
- `--ran-input-transition`
- `--ran-input-warning-border-color`
- `--ran-radius-sm`
- `--ran-size-1`
- `--ran-size-6`
- `--ran-size-7`
- `--ran-skin-font-family`
- `--ran-space-1`
- `--ran-space-3`
- `--ran-space-8`
- `--ran-text-copy-2`
- `--ran-text-copy-weight`
- `--ran-text-label-1`
- `--ran-text-label-3`
- `--ran-text-label-weight`

### Parts
- `content`
- `input`
- `label`
- `message`

## `link`

- Tokens: 4
- Parts: 0

### Tokens
<!-- layers: semantic: 3 · internal: 1 -->
- `--ran-color-focus`
- `--ran-color-link`
- `--ran-link-active-font-weight`
- `--ran-radius-sm`

### Parts
- (none)

## `loading`

- Tokens: 3
- Parts: 0

### Tokens
<!-- layers: component: 2 · internal: 1 -->
- `--ran-loading-color`
- `--ran-loading-size`
- `--ran-space-10`

### Parts
- (none)

## `loading/variants/arc`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `arc`

## `loading/variants/circle`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `circle`

## `loading/variants/circle-fold`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `circle-fold`

## `loading/variants/circle-line`

- Tokens: 3
- Parts: 1

### Tokens
<!-- layers: semantic: 3 -->
- `--ran-color-bg`
- `--ran-color-text`
- `--ran-color-text-secondary`

### Parts
- `circle-line`

## `loading/variants/circle-rotate`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `circle-rotate`

## `loading/variants/circle-spin`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `circle-spin`

## `loading/variants/circle-turn`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `circle-turn`

## `loading/variants/cube`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `cube`

## `loading/variants/cube-dim`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `cube-dim`

## `loading/variants/cube-fold`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `cube-fold`

## `loading/variants/cube-grid`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `cube-grid`

## `loading/variants/dot`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `dot`

## `loading/variants/dot-bar`

- Tokens: 2
- Parts: 1

### Tokens
<!-- layers: semantic: 2 -->
- `--ran-color-text`
- `--ran-color-text-secondary`

### Parts
- `dot-bar`

## `loading/variants/dot-circle`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `dot-circle`

## `loading/variants/dot-line`

- Tokens: 2
- Parts: 1

### Tokens
<!-- layers: semantic: 2 -->
- `--ran-color-text`
- `--ran-color-text-secondary`

### Parts
- `dot-line`

## `loading/variants/dot-pulse`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `dot-pulse`

## `loading/variants/double-bounce`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `double-bounce`

## `loading/variants/drop`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `drop`

## `loading/variants/line`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `line`

## `loading/variants/line-scale`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `line-scale`

## `loading/variants/pacman`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `pacman`

## `loading/variants/pulse`

- Tokens: 1
- Parts: 1

### Tokens
<!-- layers: semantic: 1 -->
- `--ran-color-text`

### Parts
- `pulse`

## `loading/variants/rotate`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `rotate`

## `loading/variants/scale-out`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `scale-out`

## `loading/variants/solar`

- Tokens: 0
- Parts: 2

### Tokens
- (none)

### Parts
- `solar`
- `sun`

## `loading/variants/square`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `square`

## `loading/variants/stretch`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `stretch`

## `loading/variants/text`

- Tokens: 2
- Parts: 1

### Tokens
<!-- layers: semantic: 1 · internal: 1 -->
- `--ran-font-family`
- `--ran-text-label-1`

### Parts
- `text`

## `loading/variants/triple-bounce`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `triple-bounce`

## `markdown`

- Tokens: 80
- Parts: 4

### Tokens
<!-- layers: semantic: 14 · skin: 1 · internal: 65 -->
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-secondary`
- `--ran-color-danger`
- `--ran-color-danger-foreground`
- `--ran-color-focus`
- `--ran-color-link`
- `--ran-color-primary`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-color-text-secondary`
- `--ran-font-family`
- `--ran-font-mono`
- `--ran-gray-alpha-200`
- `--ran-gray-alpha-500`
- `--ran-markdown-blockquote-border`
- `--ran-markdown-blockquote-color`
- `--ran-markdown-button-color`
- `--ran-markdown-button-hover-background`
- `--ran-markdown-button-hover-color`
- `--ran-markdown-button-size`
- `--ran-markdown-button-touch-size`
- `--ran-markdown-caret`
- `--ran-markdown-caret-color`
- `--ran-markdown-code-bg`
- `--ran-markdown-code-border`
- `--ran-markdown-code-color`
- `--ran-markdown-code-font-size`
- `--ran-markdown-code-header-bg`
- `--ran-markdown-code-lang-color`
- `--ran-markdown-code-radius`
- `--ran-markdown-color`
- `--ran-markdown-error-background`
- `--ran-markdown-error-color`
- `--ran-markdown-font-family`
- `--ran-markdown-font-size`
- `--ran-markdown-gap`
- `--ran-markdown-h1-size`
- `--ran-markdown-h2-size`
- `--ran-markdown-h3-size`
- `--ran-markdown-h4-size`
- `--ran-markdown-heading-color`
- `--ran-markdown-heading-weight`
- `--ran-markdown-hr-color`
- `--ran-markdown-image-radius`
- `--ran-markdown-inline-code-bg`
- `--ran-markdown-inline-code-color`
- `--ran-markdown-line-number-color`
- `--ran-markdown-link-color`
- `--ran-markdown-link-underline`
- `--ran-markdown-list-indent`
- `--ran-markdown-mono-font`
- `--ran-markdown-strong-weight`
- `--ran-markdown-table-border`
- `--ran-markdown-table-font-size`
- `--ran-markdown-table-header-bg`
- `--ran-markdown-table-header-color`
- `--ran-markdown-table-radius`
- `--ran-radius-sm`
- `--ran-red-100`
- `--ran-red-300`
- `--ran-size-7`
- `--ran-skin-border-style`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-space-4`
- `--ran-space-6`
- `--ran-text-copy-1`
- `--ran-text-copy-2`
- `--ran-text-heading-1`
- `--ran-text-heading-2`
- `--ran-text-heading-3`
- `--ran-text-heading-4`
- `--ran-text-heading-tracking`
- `--ran-text-heading-weight`
- `--ran-text-label-2`
- `--ran-text-label-3`
- `--ran-text-label-weight`
- `--ran-text-mono-weight-regular`

### Parts
- `block`
- `body`
- `error`
- `markdown`

## `math`

- Tokens: 37
- Parts: 7

### Tokens
<!-- layers: semantic: 11 · skin: 1 · component: 16 · internal: 9 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-muted`
- `--ran-color-danger`
- `--ran-color-danger-foreground`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-font-mono`
- `--ran-math-align`
- `--ran-math-button-color`
- `--ran-math-button-hover-background`
- `--ran-math-button-hover-color`
- `--ran-math-button-size`
- `--ran-math-color`
- `--ran-math-error-background`
- `--ran-math-error-color`
- `--ran-math-error-font-size`
- `--ran-math-error-font-weight`
- `--ran-math-item-color`
- `--ran-math-menu-item-font-size`
- `--ran-math-menu-item-font-weight`
- `--ran-math-toolbar-background`
- `--ran-math-toolbar-gap`
- `--ran-math-toolbar-shadow`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-red-100`
- `--ran-red-300`
- `--ran-shadow-menu`
- `--ran-size-7`
- `--ran-skin-border-style`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-text-label-2`
- `--ran-text-label-weight`
- `--ran-text-mono-weight-regular`

### Parts
- `button`
- `copy-status`
- `error`
- `math`
- `menu`
- `render`
- `toolbar`

## `mermaid`

- Tokens: 35
- Parts: 7

### Tokens
<!-- layers: semantic: 11 · skin: 1 · internal: 23 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-muted`
- `--ran-color-danger`
- `--ran-color-danger-foreground`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-font-mono`
- `--ran-mermaid-button-color`
- `--ran-mermaid-button-hover-background`
- `--ran-mermaid-button-hover-color`
- `--ran-mermaid-button-size`
- `--ran-mermaid-error-background`
- `--ran-mermaid-error-color`
- `--ran-mermaid-error-font-size`
- `--ran-mermaid-error-font-weight`
- `--ran-mermaid-menu-item-color`
- `--ran-mermaid-menu-item-font-size`
- `--ran-mermaid-menu-item-font-weight`
- `--ran-mermaid-toolbar-background`
- `--ran-mermaid-toolbar-gap`
- `--ran-mermaid-toolbar-shadow`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-red-100`
- `--ran-red-300`
- `--ran-shadow-menu`
- `--ran-size-7`
- `--ran-skin-border-style`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-text-label-2`
- `--ran-text-label-weight`
- `--ran-text-mono-weight-regular`

### Parts
- `button`
- `copy-status`
- `diagram`
- `error`
- `menu`
- `mermaid`
- `toolbar`

## `message`

- Tokens: 61
- Parts: 0

### Tokens
<!-- layers: semantic: 12 · component: 43 · internal: 6 -->
- `--ran-color-bg`
- `--ran-color-bg-elevated`
- `--ran-color-border`
- `--ran-color-danger`
- `--ran-color-link`
- `--ran-color-success`
- `--ran-color-text`
- `--ran-color-warning-foreground`
- `--ran-message-color`
- `--ran-message-content-background`
- `--ran-message-content-border`
- `--ran-message-content-border-image-slice`
- `--ran-message-content-border-image-source`
- `--ran-message-content-border-radius`
- `--ran-message-content-box-shadow`
- `--ran-message-content-toast-background`
- `--ran-message-content-toast-border`
- `--ran-message-content-toast-border-radius`
- `--ran-message-enter-duration`
- `--ran-message-enter-easing`
- `--ran-message-exit-duration`
- `--ran-message-exit-easing`
- `--ran-message-font-feature-settings`
- `--ran-message-font-size`
- `--ran-message-font-variant`
- `--ran-message-font-weight`
- `--ran-message-icon-error-color`
- `--ran-message-icon-gap`
- `--ran-message-icon-info-color`
- `--ran-message-icon-size`
- `--ran-message-icon-success-color`
- `--ran-message-icon-warning-color`
- `--ran-message-info-align-items`
- `--ran-message-info-toast-align-items`
- `--ran-message-ist-style`
- `--ran-message-notice-text-align`
- `--ran-message-notice-toast-text-align`
- `--ran-message-notice-toast-word-break`
- `--ran-message-notice-word-break`
- `--ran-message-stack-offset`
- `--ran-message-stack-scale`
- `--ran-message-text-color`
- `--ran-message-text-font-feature-settings`
- `--ran-message-text-font-size`
- `--ran-message-text-font-variant`
- `--ran-message-text-font-weight`
- `--ran-message-text-toast-color`
- `--ran-message-text-toast-font-feature-settings`
- `--ran-message-text-toast-font-size`
- `--ran-message-text-toast-font-variant`
- `--ran-message-text-toast-font-weight`
- `--ran-motion-duration-fast`
- `--ran-motion-ease-standard`
- `--ran-radius-md`
- `--ran-shadow-menu`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-space-4`
- `--ran-text-copy-2`
- `--ran-text-copy-weight`
- `--ran-z-message`

### Parts
- (none)

## `modal`

- Tokens: 56
- Parts: 8

### Tokens
<!-- layers: semantic: 15 · component: 29 · internal: 12 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-hover`
- `--ran-color-border`
- `--ran-color-border-secondary`
- `--ran-color-primary`
- `--ran-color-primary-text`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-focus-ring`
- `--ran-modal-action-font-size`
- `--ran-modal-action-font-weight`
- `--ran-modal-actions-gap`
- `--ran-modal-body-color`
- `--ran-modal-close-background`
- `--ran-modal-close-border`
- `--ran-modal-close-border-radius`
- `--ran-modal-close-color`
- `--ran-modal-close-font-size`
- `--ran-modal-close-hover-background`
- `--ran-modal-close-hover-color`
- `--ran-modal-close-size`
- `--ran-modal-close-touch-size`
- `--ran-modal-dialog-background`
- `--ran-modal-dialog-border`
- `--ran-modal-dialog-border-image-slice`
- `--ran-modal-dialog-border-image-source`
- `--ran-modal-dialog-border-radius`
- `--ran-modal-dialog-box-shadow`
- `--ran-modal-footer-align-items`
- `--ran-modal-footer-gap`
- `--ran-modal-footer-justify-content`
- `--ran-modal-header-align-items`
- `--ran-modal-header-justify-content`
- `--ran-modal-mask-background`
- `--ran-modal-title-color`
- `--ran-modal-title-font-size`
- `--ran-modal-title-font-weight`
- `--ran-modal-title-letter-spacing`
- `--ran-motion-duration-fast`
- `--ran-motion-duration-slow`
- `--ran-motion-ease-standard`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-shadow-elevated`
- `--ran-shadow-modal`
- `--ran-size-7`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-space-4`
- `--ran-text-button-size`
- `--ran-text-button-weight`
- `--ran-text-heading-4`
- `--ran-text-heading-tracking`
- `--ran-text-heading-weight`
- `--ran-z-modal`

### Parts
- `body`
- `close`
- `dialog`
- `footer`
- `header`
- `mask`
- `root`
- `title`

## `player`

- Tokens: 179
- Parts: 0

### Tokens
<!-- layers: semantic: 9 · component: 154 · internal: 16 -->
- `--ran-color-`
- `--ran-color-border`
- `--ran-color-primary`
- `--ran-dropdown-background`
- `--ran-dropdown-border`
- `--ran-dropdown-box-shadow`
- `--ran-dropdown-option-active-background-color`
- `--ran-dropdown-option-item-color`
- `--ran-dropdown-option-item-content-color`
- `--ran-dropdown-option-item-content-font-size`
- `--ran-dropdown-option-item-content-text-align`
- `--ran-dropdown-option-item-hover-background-color`
- `--ran-dropdown-option-selected-background-color`
- `--ran-focus-ring-inverse-color`
- `--ran-media-background`
- `--ran-motion-duration-fast`
- `--ran-motion-duration-slow`
- `--ran-motion-ease-smooth`
- `--ran-motion-ease-standard`
- `--ran-player-background`
- `--ran-player-clarity-border-radius`
- `--ran-player-clarity-color`
- `--ran-player-clarity-font-family`
- `--ran-player-clarity-font-size`
- `--ran-player-clarity-font-style`
- `--ran-player-clarity-font-weight`
- `--ran-player-clarity-hover-background`
- `--ran-player-clarity-transition`
- `--ran-player-controller-backdrop-filter`
- `--ran-player-controller-background`
- `--ran-player-controller-opacity`
- `--ran-player-controller-transition`
- `--ran-player-controls-align-items`
- `--ran-player-controls-justify-content`
- `--ran-player-error-background`
- `--ran-player-error-color`
- `--ran-player-fullscreen-border-radius`
- `--ran-player-fullscreen-color`
- `--ran-player-fullscreen-focus-visible-border-radius`
- `--ran-player-fullscreen-hover-background`
- `--ran-player-fullscreen-transition`
- `--ran-player-gesture-flash-background`
- `--ran-player-gesture-flash-border-radius`
- `--ran-player-gesture-flash-center`
- `--ran-player-gesture-flash-color`
- `--ran-player-gesture-flash-font-size`
- `--ran-player-gesture-flash-font-weight`
- `--ran-player-gesture-flash-transition`
- `--ran-player-knowledge-color`
- `--ran-player-knowledge-font-family`
- `--ran-player-knowledge-font-size`
- `--ran-player-knowledge-font-style`
- `--ran-player-knowledge-font-weight`
- `--ran-player-loading-animation`
- `--ran-player-loading-background-repeat`
- `--ran-player-loading-background-size`
- `--ran-player-loading-border`
- `--ran-player-loading-color`
- `--ran-player-loading-filter`
- `--ran-player-loading-mask-backdrop-filter`
- `--ran-player-loading-mask-background`
- `--ran-player-pip-align-items`
- `--ran-player-pip-border-radius`
- `--ran-player-pip-color`
- `--ran-player-pip-focus-visible-border-radius`
- `--ran-player-pip-hover-background`
- `--ran-player-pip-transition`
- `--ran-player-play-btn-color`
- `--ran-player-play-btn-filter`
- `--ran-player-play-btn-transform`
- `--ran-player-progress-buffer-background`
- `--ran-player-progress-buffer-border-radius`
- `--ran-player-progress-buffer-transform`
- `--ran-player-progress-buffer-transform-origin`
- `--ran-player-progress-buffer-will-change`
- `--ran-player-progress-dot-background`
- `--ran-player-progress-dot-border-radius`
- `--ran-player-progress-fill-background`
- `--ran-player-progress-fill-border-radius`
- `--ran-player-progress-fill-transform`
- `--ran-player-progress-fill-transform-origin`
- `--ran-player-progress-fill-will-change`
- `--ran-player-progress-focus-visible-border-radius`
- `--ran-player-progress-track-background`
- `--ran-player-progress-track-border-radius`
- `--ran-player-remote-align-items`
- `--ran-player-remote-border-radius`
- `--ran-player-remote-color`
- `--ran-player-remote-focus-visible-border-radius`
- `--ran-player-remote-hover-background`
- `--ran-player-remote-transition`
- `--ran-player-select-item-color`
- `--ran-player-select-item-font-size`
- `--ran-player-select-item-font-weight`
- `--ran-player-speed-border-radius`
- `--ran-player-speed-color`
- `--ran-player-speed-font-family`
- `--ran-player-speed-font-size`
- `--ran-player-speed-font-style`
- `--ran-player-speed-font-weight`
- `--ran-player-speed-hover-background`
- `--ran-player-speed-transition`
- `--ran-player-subtitle-border-radius`
- `--ran-player-subtitle-color`
- `--ran-player-subtitle-font-family`
- `--ran-player-subtitle-font-size`
- `--ran-player-subtitle-font-style`
- `--ran-player-subtitle-font-weight`
- `--ran-player-subtitle-hover-background`
- `--ran-player-subtitle-transition`
- `--ran-player-time-align-items`
- `--ran-player-time-current-color`
- `--ran-player-time-current-font-family`
- `--ran-player-time-current-font-size`
- `--ran-player-time-current-font-style`
- `--ran-player-time-current-font-weight`
- `--ran-player-time-current-text-align`
- `--ran-player-time-divide-color`
- `--ran-player-time-divide-font-family`
- `--ran-player-time-divide-font-size`
- `--ran-player-time-divide-font-style`
- `--ran-player-time-divide-font-weight`
- `--ran-player-time-divide-text-align`
- `--ran-player-time-duration-color`
- `--ran-player-time-duration-font-family`
- `--ran-player-time-duration-font-size`
- `--ran-player-time-duration-font-style`
- `--ran-player-time-duration-font-weight`
- `--ran-player-time-duration-text-align`
- `--ran-player-time-justify-content`
- `--ran-player-tip-background`
- `--ran-player-tip-border-radius`
- `--ran-player-tip-box-shadow`
- `--ran-player-tip-color`
- `--ran-player-tip-font-family`
- `--ran-player-tip-font-size`
- `--ran-player-tip-font-variant`
- `--ran-player-tip-font-weight`
- `--ran-player-tip-opacity`
- `--ran-player-tip-text-align`
- `--ran-player-tip-text-text-align`
- `--ran-player-tip-text-white-space`
- `--ran-player-tip-thumbnail-border`
- `--ran-player-tip-thumbnail-border-radius`
- `--ran-player-tip-thumbnail-box-shadow`
- `--ran-player-tip-thumbnail-transform`
- `--ran-player-tip-time-text-align`
- `--ran-player-tip-time-white-space`
- `--ran-player-tip-white-space`
- `--ran-player-toggle-border-radius`
- `--ran-player-toggle-color`
- `--ran-player-toggle-focus-visible-border-radius`
- `--ran-player-toggle-hover-background`
- `--ran-player-toggle-transition`
- `--ran-player-volume-align-items`
- `--ran-player-volume-border-radius`
- `--ran-player-volume-hover-background`
- `--ran-player-volume-icon-color`
- `--ran-player-volume-justify-content`
- `--ran-player-volume-transition`
- `--ran-progress-dot-background`
- `--ran-progress-fill-background`
- `--ran-progress-track-background`
- `--ran-radius-full`
- `--ran-radius-sm`
- `--ran-size-3`
- `--ran-size-4`
- `--ran-size-7`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-4`
- `--ran-space-6`
- `--ran-text-heading-weight`
- `--ran-text-label-1`
- `--ran-text-label-2`
- `--ran-text-label-3`
- `--ran-text-label-weight`
- `--ran-text-mono-weight-regular`
- `--ran-z-dropdown`

### Parts
- (none)

## `player/core/adapters`

- Tokens: 0
- Parts: 0

### Tokens
- (none)

### Parts
- (none)

## `popover`

- Tokens: 2
- Parts: 0

### Tokens
<!-- layers: semantic: 1 · internal: 1 -->
- `--ran-focus-ring`
- `--ran-radius-sm`

### Parts
- (none)

## `popover/content`

- Tokens: 0
- Parts: 0

### Tokens
- (none)

### Parts
- (none)

## `progress`

- Tokens: 19
- Parts: 3

### Tokens
<!-- layers: semantic: 5 · component: 12 · internal: 2 -->
- `--ran-color-bg-elevated`
- `--ran-color-focus`
- `--ran-color-primary`
- `--ran-gray-200`
- `--ran-progress-dot-background`
- `--ran-progress-dot-border`
- `--ran-progress-dot-border-radius`
- `--ran-progress-dot-box-shadow`
- `--ran-progress-dot-transform`
- `--ran-progress-fill-background`
- `--ran-progress-fill-border-radius`
- `--ran-progress-fill-transform-origin`
- `--ran-progress-fill-will-change`
- `--ran-progress-track-background`
- `--ran-progress-track-border-radius`
- `--ran-progress-track-transform`
- `--ran-radius-full`
- `--ran-shadow-elevated`
- `--ran-size-3`

### Parts
- `dot`
- `fill`
- `track`

## `radar`

- Tokens: 6
- Parts: 0

### Tokens
<!-- layers: semantic: 2 · component: 4 -->
- `--ran-color-border`
- `--ran-color-primary`
- `--ran-radar-fill-color`
- `--ran-radar-line-color`
- `--ran-radar-polygon-color`
- `--ran-radar-stroke-color`

### Parts
- (none)

## `reasoning`

- Tokens: 12
- Parts: 3

### Tokens
<!-- layers: semantic: 2 · internal: 10 -->
- `--ran-color-border`
- `--ran-color-text-secondary`
- `--ran-disclosure-body-indent`
- `--ran-disclosure-color`
- `--ran-reasoning-body-indent`
- `--ran-reasoning-border-color`
- `--ran-reasoning-color`
- `--ran-reasoning-font-size`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-6`
- `--ran-text-copy-2`

### Parts
- `body`
- `row`
- `text`

## `route`

- Tokens: 0
- Parts: 0

### Tokens
- (none)

### Parts
- (none)

## `router`

- Tokens: 0
- Parts: 0

### Tokens
- (none)

### Parts
- (none)

## `scratch`

- Tokens: 21
- Parts: 2

### Tokens
<!-- layers: semantic: 8 · skin: 1 · component: 3 · internal: 9 -->
- `--ran-background-100`
- `--ran-color-bg-elevated`
- `--ran-color-bg-hover`
- `--ran-color-border`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-gray-1000`
- `--ran-gray-200`
- `--ran-gray-400`
- `--ran-gray-900`
- `--ran-radius-sm`
- `--ran-scratch-award-background`
- `--ran-scratch-cover-background`
- `--ran-scratch-disabled-opacity`
- `--ran-shadow-elevated`
- `--ran-size-7`
- `--ran-skin-raised-shadow`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-text-button-size`

### Parts
- `award`
- `reveal-button`

## `section`

- Tokens: 24
- Parts: 4

### Tokens
<!-- layers: semantic: 6 · skin: 1 · internal: 17 -->
- `--ran-color-bg-elevated`
- `--ran-color-border`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-radius-md`
- `--ran-section-background`
- `--ran-section-border-color`
- `--ran-section-header-gap`
- `--ran-section-heading-color`
- `--ran-section-heading-font-size`
- `--ran-section-heading-font-weight`
- `--ran-section-heading-letter-spacing`
- `--ran-section-radius`
- `--ran-section-shadow`
- `--ran-section-subtitle-color`
- `--ran-shadow-elevated`
- `--ran-skin-border-style`
- `--ran-space-2`
- `--ran-space-24`
- `--ran-space-6`
- `--ran-space-8`
- `--ran-text-heading-2`
- `--ran-text-heading-tracking`
- `--ran-text-heading-weight`

### Parts
- `body`
- `header`
- `heading`
- `subtitle`

## `select`

- Tokens: 69
- Parts: 6

### Tokens
<!-- layers: semantic: 9 · skin: 1 · component: 47 · internal: 12 -->
- `--ran-background-200`
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-control`
- `--ran-color-border-control-hover`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-color-text-placeholder`
- `--ran-focus-ring`
- `--ran-gray-400`
- `--ran-gray-700`
- `--ran-gray-800`
- `--ran-gray-900`
- `--ran-radius-sm`
- `--ran-select-background-color`
- `--ran-select-background-image`
- `--ran-select-border`
- `--ran-select-border-radius`
- `--ran-select-color`
- `--ran-select-focus-border`
- `--ran-select-focus-box-shadow`
- `--ran-select-font-family`
- `--ran-select-font-size`
- `--ran-select-font-weight`
- `--ran-select-hover-border`
- `--ran-select-icon-align-items`
- `--ran-select-icon-color`
- `--ran-select-icon-font-size`
- `--ran-select-icon-font-style`
- `--ran-select-icon-text-align`
- `--ran-select-icon-text-rendering`
- `--ran-select-icon-text-transform`
- `--ran-select-icon-transform`
- `--ran-select-item-align-items`
- `--ran-select-item-appearance`
- `--ran-select-item-background`
- `--ran-select-item-border`
- `--ran-select-item-focus-color`
- `--ran-select-item-font-family`
- `--ran-select-item-hover-color`
- `--ran-select-item-user-select`
- `--ran-select-item-white-space`
- `--ran-select-label-color`
- `--ran-select-label-disabled-color`
- `--ran-select-label-font-size`
- `--ran-select-label-font-weight`
- `--ran-select-search-active-border`
- `--ran-select-search-active-border-color`
- `--ran-select-search-active-box-shadow`
- `--ran-select-search-appearance`
- `--ran-select-search-background`
- `--ran-select-search-border`
- `--ran-select-search-cancel-appearance`
- `--ran-select-search-font-family`
- `--ran-select-search-input-border`
- `--ran-select-search-opacity`
- `--ran-select-search-visible-opacity`
- `--ran-select-select-color`
- `--ran-select-text-background`
- `--ran-select-text-border`
- `--ran-select-transition`
- `--ran-size-1`
- `--ran-size-7`
- `--ran-skin-font-family`
- `--ran-space-1`
- `--ran-text-label-1`
- `--ran-text-label-3`
- `--ran-text-label-weight`

### Parts
- `icon`
- `label`
- `search`
- `select`
- `selection`
- `selection-item`

## `select/dropdown-item`

- Tokens: 23
- Parts: 2

### Tokens
<!-- layers: semantic: 4 · component: 16 · internal: 3 -->
- `--ran-color-bg-hover`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-dropdown-option-active-background-color`
- `--ran-dropdown-option-item-border-radius`
- `--ran-dropdown-option-item-color`
- `--ran-dropdown-option-item-content-color`
- `--ran-dropdown-option-item-content-font-family`
- `--ran-dropdown-option-item-content-font-size`
- `--ran-dropdown-option-item-content-font-variant`
- `--ran-dropdown-option-item-content-text-align`
- `--ran-dropdown-option-item-content-white-space`
- `--ran-dropdown-option-item-font-size`
- `--ran-dropdown-option-item-font-weight`
- `--ran-dropdown-option-item-hover-background-color`
- `--ran-dropdown-option-item-transition`
- `--ran-dropdown-option-selected-background-color`
- `--ran-dropdown-option-selected-check-color`
- `--ran-dropdown-option-selected-font-weight`
- `--ran-radius-sm`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-text-label-1`

### Parts
- `content`
- `item`

## `select/option`

- Tokens: 0
- Parts: 0

### Tokens
- (none)

### Parts
- (none)

## `skeleton`

- Tokens: 8
- Parts: 0

### Tokens
<!-- layers: semantic: 1 · component: 4 · internal: 3 -->
- `--ran-gray-alpha-200`
- `--ran-gray-alpha-500`
- `--ran-radius-sm`
- `--ran-size-1`
- `--ran-skeleton-background`
- `--ran-skeleton-border-radius`
- `--ran-skeleton-shimmer-animation-duration`
- `--ran-skeleton-shimmer-background`

### Parts
- (none)

## `state-dot`

- Tokens: 12
- Parts: 1

### Tokens
<!-- layers: semantic: 5 · internal: 7 -->
- `--ran-color-danger`
- `--ran-color-primary`
- `--ran-color-success`
- `--ran-color-text-disabled`
- `--ran-color-warning`
- `--ran-state-dot-color`
- `--ran-state-dot-error-color`
- `--ran-state-dot-halo-opacity`
- `--ran-state-dot-running-color`
- `--ran-state-dot-size`
- `--ran-state-dot-success-color`
- `--ran-state-dot-warning-color`

### Parts
- `dot`

## `tab`

- Tokens: 43
- Parts: 7

### Tokens
<!-- layers: semantic: 14 · component: 23 · internal: 6 -->
- `--ran-btn-active-scale`
- `--ran-btn-border-radius`
- `--ran-btn-color`
- `--ran-btn-hover-color`
- `--ran-color-bg-elevated`
- `--ran-color-bg-hover`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-secondary`
- `--ran-color-primary`
- `--ran-color-text-secondary`
- `--ran-gray-400`
- `--ran-gray-alpha-100`
- `--ran-motion-duration-fast`
- `--ran-motion-duration-slow`
- `--ran-motion-ease-standard`
- `--ran-radius-full`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-shadow-elevated`
- `--ran-size-5`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-tab-active-color`
- `--ran-tab-border-color`
- `--ran-tab-color`
- `--ran-tab-content-background`
- `--ran-tab-content-border`
- `--ran-tab-content-border-radius`
- `--ran-tab-content-transition`
- `--ran-tab-gap`
- `--ran-tab-hover-background`
- `--ran-tab-hover-radius`
- `--ran-tab-hover-transition`
- `--ran-tab-line-border-radius`
- `--ran-tab-line-color`
- `--ran-tab-line-transition`
- `--ran-tab-segment-background`
- `--ran-tab-segment-border`
- `--ran-tab-segment-radius`
- `--ran-tab-segment-thumb-background`
- `--ran-tab-segment-thumb-shadow`

### Parts
- `content`
- `content-wrap`
- `header`
- `hover`
- `indicator`
- `nav`
- `tabs`

## `tabpane`

- Tokens: 0
- Parts: 1

### Tokens
- (none)

### Parts
- `content`

## `theme-switch`

- Tokens: 22
- Parts: 2

### Tokens
<!-- layers: semantic: 6 · skin: 1 · internal: 15 -->
- `--ran-color-bg-hover`
- `--ran-color-border`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-radius-full`
- `--ran-size-1`
- `--ran-size-5`
- `--ran-skin-border-style`
- `--ran-space-1`
- `--ran-theme-switch-`
- `--ran-theme-switch-background`
- `--ran-theme-switch-border-color`
- `--ran-theme-switch-button-active-background`
- `--ran-theme-switch-button-active-color`
- `--ran-theme-switch-button-color`
- `--ran-theme-switch-button-hover-color`
- `--ran-theme-switch-button-size`
- `--ran-theme-switch-gap`
- `--ran-theme-switch-icon-size`
- `--ran-theme-switch-radius`
- `--ran-theme-switch-touch-size`

### Parts
- `button ${choice}`
- `switch`

## `token-meter`

- Tokens: 23
- Parts: 3

### Tokens
<!-- layers: semantic: 6 · component: 3 · internal: 14 -->
- `--ran-color-bg-muted`
- `--ran-color-danger`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-color-warning`
- `--ran-gray-alpha-700`
- `--ran-progress-fill-background`
- `--ran-progress-track-background`
- `--ran-progress-track-border-radius`
- `--ran-radius-full`
- `--ran-space-2`
- `--ran-text-label-3`
- `--ran-text-label-weight`
- `--ran-token-meter-`
- `--ran-token-meter-color`
- `--ran-token-meter-fill-background`
- `--ran-token-meter-font-size`
- `--ran-token-meter-gap`
- `--ran-token-meter-over-background`
- `--ran-token-meter-track-background`
- `--ran-token-meter-track-radius`
- `--ran-token-meter-transition`
- `--ran-token-meter-warn-background`

### Parts
- `flag`
- `meter`
- `text`

## `tool-card`

- Tokens: 44
- Parts: 11

### Tokens
<!-- layers: semantic: 8 · internal: 36 -->
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-danger`
- `--ran-color-link`
- `--ran-color-text`
- `--ran-color-text-secondary`
- `--ran-disclosure-body-indent`
- `--ran-font-mono`
- `--ran-green-200`
- `--ran-radius-sm`
- `--ran-red-200`
- `--ran-size-4`
- `--ran-space-1`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-space-6`
- `--ran-text-copy-2`
- `--ran-text-label-2`
- `--ran-text-label-3`
- `--ran-text-mono-weight-regular`
- `--ran-tool-card-added-background`
- `--ran-tool-card-body-gap`
- `--ran-tool-card-color`
- `--ran-tool-card-file-gap`
- `--ran-tool-card-font-size`
- `--ran-tool-card-gutter-color`
- `--ran-tool-card-hunk-gap`
- `--ran-tool-card-io-background`
- `--ran-tool-card-io-border-color`
- `--ran-tool-card-io-error-color`
- `--ran-tool-card-io-gutter-gap`
- `--ran-tool-card-io-label-color`
- `--ran-tool-card-io-label-size`
- `--ran-tool-card-io-radius`
- `--ran-tool-card-line-gap`
- `--ran-tool-card-location-color`
- `--ran-tool-card-locations-gap`
- `--ran-tool-card-output-background`
- `--ran-tool-card-output-font`
- `--ran-tool-card-output-radius`
- `--ran-tool-card-output-weight`
- `--ran-tool-card-path-color`
- `--ran-tool-card-path-gap`
- `--ran-tool-card-removed-background`

### Parts
- `body`
- `exit`
- `file`
- `hunk`
- `io`
- `io-text`
- `line`
- `location`
- `locations`
- `path`
- `row`

## `voice-button`

- Tokens: 39
- Parts: 3

### Tokens
<!-- layers: semantic: 13 · skin: 1 · internal: 25 -->
- `--ran-color-bg-elevated`
- `--ran-color-bg-subtle`
- `--ran-color-border`
- `--ran-color-border-hover`
- `--ran-color-danger`
- `--ran-color-focus`
- `--ran-color-text`
- `--ran-color-text-disabled`
- `--ran-color-text-secondary`
- `--ran-radius-md`
- `--ran-radius-sm`
- `--ran-red-200`
- `--ran-shadow-elevated`
- `--ran-shadow-menu`
- `--ran-size-7`
- `--ran-skin-raised-shadow`
- `--ran-space-2`
- `--ran-space-3`
- `--ran-text-label-3`
- `--ran-voice-active-background`
- `--ran-voice-active-border-color`
- `--ran-voice-active-color`
- `--ran-voice-background`
- `--ran-voice-border-color`
- `--ran-voice-border-radius`
- `--ran-voice-cancel-background`
- `--ran-voice-color`
- `--ran-voice-disabled-color`
- `--ran-voice-focus-color`
- `--ran-voice-hint-background`
- `--ran-voice-hint-cancel-color`
- `--ran-voice-hint-color`
- `--ran-voice-hint-font-size`
- `--ran-voice-hint-gap`
- `--ran-voice-hint-radius`
- `--ran-voice-hint-shadow`
- `--ran-voice-hover-border-color`
- `--ran-voice-hover-color`
- `--ran-voice-size`

### Parts
- `button`
- `hint`
- `icon`

