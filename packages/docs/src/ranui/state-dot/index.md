---
description: 'The ranui StateDot (<r-state-dot>) is an 8px lifecycle indicator (idle, running, success, warning, error) drawn as a halo and a core in one element.'
---

# StateDot

An 8px lifecycle indicator: a halo and a core in one element, both `currentColor`, so a state
is one colour rule rather than two tokens.

> **Use when** a row needs to show where a piece of work is (queued, running, finished,
> failed) without spending a whole line on it. It is the dot `<r-tool-card>` and the
> compaction marker both use.

## Quick Start

### Basic Usage

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` pulses; the rest are still. An unknown value renders as `idle` rather than
disappearing, so a state your producer added and the page has not learned yet still occupies
its place in the row.

### Beside a label

The dot carries the state; the text carries the meaning. Never let the colour be the only
thing that distinguishes two rows. See [design guidelines](/src/ranui/design-guides/#accessibility).

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>Running tests</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>2 tests failed</span>
  </div>
</Demo>

## API Reference

### Properties

| Property | Attribute | Type                                                       | Default  | Description                                            |
| -------- | --------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------ |
| `state`  | `state`   | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | Which lifecycle step to show. Unknown values → `idle`. |
| `label`  | `label`   | `string`                                                   | `''`     | Accessible name. See below.                            |
| `sheet`  | `sheet`   | `string`                                                   | `''`     | CSS injected into the shadow root.                     |

### Accessibility

**The dot is `aria-hidden` until you give it a `label`.** A dot beside a row that already
states its outcome in text is noise in a screen reader: announcing "running" twice helps
nobody. Set `label` only when the dot is the _only_ carrier of the state:

```html
<!-- Text already says it: leave the dot silent -->
<r-state-dot state="error"></r-state-dot> <span>Build failed</span>

<!-- The dot is alone in the cell: name it -->
<r-state-dot state="error" label="Build failed"></r-state-dot>
```

### Parts

| Part  | Element        |
| ----- | -------------- |
| `dot` | The dot itself |

### Styling

Each state is **one** colour: the halo is that colour at 16% and the core is a 60% inset of
it, both painted from `currentColor`. So a state is one token, not two:

| Token                           | Default                            |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running` pulses the core rather than spinning (a spinner at 8px is a smudge), and the pulse
stops under `prefers-reduced-motion`.
