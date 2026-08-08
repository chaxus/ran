---
description: 'The ranui Player (<r-player>) wraps native <video> with a unified control bar: play, progress dragging, volume, speed and fullscreen.'
---

# Player

A native `<r-player>` media element that wraps a `<video>` with a unified control bar, progress dragging, volume control, playback speed, fullscreen, and HLS streaming.

> **Use when** you need a video player with a built-in control bar, progress scrubbing, playback speed, fullscreen, and HLS (`.m3u8`) streaming — `<r-player>` wraps `<video>` and runs unchanged across frameworks.

Built on `hls.js` and Web Components, so the same player runs unchanged across frameworks. Capabilities driven from source:

- Draggable progress bar with buffered indicator and a time tooltip on hover
- Volume control and mute toggle
- Playback speed selection
- Fullscreen toggle (and `Esc` to exit)
- Picture-in-Picture toggle — the button only renders when the browser actually supports it
- `poster` / `autoplay` / `loop` / `muted` — standard `<video>` attributes, passed straight through
- HLS (`.m3u8`) playback with automatic bitrate switching and a manual clarity selector, when `window.Hls` (hls.js) is available
- Keyboard shortcuts: `Space` play/pause, `ArrowLeft` / `ArrowRight` seek 5s, `Escape` exit fullscreen, `Home`/`End`/arrows on the focused seek bar

## Quick Start

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>
</Demo>

```html
<r-player src="/ran/hls/example.m3u8"></r-player>
```

> The element renders as `display: block`. Give it an explicit width/height (inline style or CSS) so the video has a box to fill.

## API Reference

### Properties

| Property       | Type     | Default | Description                                                                                           |
| -------------- | -------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `src`          | `string` | `''`    | Video resource URL. Changing it reloads the player. `.m3u8` sources use HLS when hls.js is present.   |
| `volume`       | `string` | `''`    | Initial volume on a `0`–`100` scale — same scale as `setVolume()`/`getVolume()`. |
| `currentTime`  | `string` | `''`    | Initial playback position in seconds. Also accepted lowercase as `currenttime`.                       |
| `playbackRate` | `string` | `''`    | Playback speed multiplier (e.g. `1`, `1.5`, `2`). Also accepted lowercase as `playbackrate`.          |
| `debug`        | `string` | `''`    | When truthy, logs every internal `change` event and warnings to the console.                          |
| `sheet`        | `string` | `''`    | CSS text injected into the component's shadow DOM for custom styling.                                 |
| `poster`       | `string` | `''`    | Image URL shown before playback starts. Passed straight to `<video poster>`.                          |
| `autoplay`     | `boolean` | `false` | Boolean attribute — presence means `true`, same as native `<video autoplay>`. Browsers generally require `muted` for autoplay to actually start without a user gesture. |
| `loop`         | `boolean` | `false` | Boolean attribute — loops playback on end, same as native `<video loop>`.                             |
| `muted`        | `boolean` | `false` | Boolean attribute — starts silent. Internally this sets volume to `0` (so the mute icon/slider agree) **and** the native `<video>.muted` flag (so the browser's autoplay-muted policy is satisfied). Removing the attribute restores the previous volume. |

> Observed attributes (from `observedAttributes`): `src`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `autoplay`, `loop`, `muted`.

### Video Source `src`

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>
</Demo>

```html
<r-player src="/ran/hls/example.m3u8"></r-player>
```

### Initial Volume `volume`

Value is on a `0`–`100` scale.

```html
<r-player src="/ran/hls/example.m3u8" volume="30"></r-player>
```

### Initial Playback Time `currentTime`

Seconds from the start of the media.

```html
<r-player src="/ran/hls/example.m3u8" currentTime="15"></r-player>
```

### Playback Speed `playbackRate`

```html
<r-player src="/ran/hls/example.m3u8" playbackRate="1.5"></r-player>
```

### Debug Logging `debug`

```html
<r-player src="/ran/hls/example.m3u8" debug="true"></r-player>
```

### Poster, Autoplay, Loop, Muted

```html
<r-player src="/ran/hls/example.m3u8" poster="/ran/hls/poster.jpg" autoplay muted loop></r-player>
```

### Picture-in-Picture

The PiP button in the control bar only appears when `document.pictureInPictureEnabled` is true — there's no dead button in browsers that don't support it. Toggle it programmatically with `togglePip()`.

## Methods

The player exposes imperative controls on the element instance:

| Method                                     | Description                                             |
| ------------------------------------------ | ------------------------------------------------------- |
| `play(time?)`                              | Start playback, optionally seeking to `time` (seconds). |
| `pause()`                                  | Pause playback.                                         |
| `getCurrentTime()`                         | Current playback position in seconds.                   |
| `setCurrentTime(seconds)`                  | Seek to a position.                                     |
| `getTotalTime()`                           | Total media duration in seconds.                        |
| `getVolume()` / `setVolume(v)`             | Read/set volume on a `0`–`100` scale — same scale as the `volume` attribute. |
| `getPlaybackRate()` / `setPlaybackRate(n)` | Read/set the speed multiplier.                          |
| `customRequestFullscreen()`                | Enter fullscreen. Returns a `Promise`.                  |
| `customExitFullscreen()`                   | Exit fullscreen. Returns a `Promise`.                   |
| `togglePip()`                              | Enter/exit Picture-in-Picture. No-op if unsupported or no source is loaded. |

## Events

The player dispatches a single `change` CustomEvent. Every internal state transition — native media events and the player's own UI actions — funnels through it, so you subscribe once and switch on `detail.type`.

```html
<r-player id="player" src="/ran/hls/example.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` is the <r-player> instance itself
  });
</script>
```

### `detail` payload

| Property      | Type      | Description                                 |
| ------------- | --------- | ------------------------------------------- |
| `type`        | `string`  | The name of the change that occurred.       |
| `data`        | `unknown` | The value/event associated with the change. |
| `currentTime` | `number`  | Current playback time (seconds).            |
| `duration`    | `number`  | Total media duration (seconds).             |
| `tag`         | `Element` | The `<r-player>` instance.                  |

### `detail.type` values

Native media states forwarded from the underlying `<video>`:

| Type             | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `canplay`        | Enough data to start playing.                         |
| `canplaythrough` | Can play to the end without buffering.                |
| `complete`       | Rendering complete.                                   |
| `durationchange` | The `duration` value changed.                         |
| `emptied`        | Media emptied / reloaded.                             |
| `ended`          | Playback reached the end.                             |
| `error`          | A media error occurred.                               |
| `loadstart`      | The browser began loading the media.                  |
| `loadedmetadata` | Metadata has loaded.                                  |
| `loadeddata`     | The first frame has loaded.                           |
| `progress`       | Fired periodically while the resource loads.          |
| `ratechange`     | Playback rate changed.                                |
| `seeking`        | A seek started.                                       |
| `seeked`         | A seek completed.                                     |
| `stalled`        | The browser is trying to fetch data but none arrived. |
| `suspend`        | Media loading was suspended.                          |
| `timeupdate`     | `currentTime` changed.                                |
| `volumechange`   | The video element's volume changed.                   |
| `waiting`        | Playback stalled waiting for data.                    |
| `play`           | Playback started.                                     |
| `playing`        | Playback resumed after buffering/pause.               |
| `pause`          | Playback paused.                                      |

Player-specific actions:

| Type                | `data`             | Description                                            |
| ------------------- | ------------------ | ------------------------------------------------------ |
| `volume`            | `number` (`0`–`100`) | Volume changed via the control bar or mute toggle.     |
| `speed`             | `number`           | Playback speed changed via the speed selector.         |
| `fullscreen`        | `boolean`          | Fullscreen entered (`true`) or exited (`false`).       |
| `pictureinpicture`  | `boolean`          | Picture-in-Picture entered (`true`) or exited (`false`) — fires whether triggered by `togglePip()` or the browser's own PiP window controls. |
| `hlsManifestLoaded` | `{ data }`         | HLS manifest parsed; clarity levels are now available. |
| `hlsError`          | `{ event, data }`  | An HLS error occurred (falls back to the raw `src`).   |

## Slots

The player does not accept slotted content: it clears its own light-DOM children (`this.innerHTML = ''`) in the constructor and again on every source load. For custom overlays, style the player via the `sheet` attribute instead.

## Best Practices

- **Sizing**: The host is `display: block` with no intrinsic size — always give it an explicit width and height, otherwise the video collapses.
- **HLS**: `.m3u8` playback needs hls.js loaded on `window.Hls`. Without it the player falls back to setting the raw `src` on the `<video>`, which only works where the browser plays HLS natively (e.g. Safari). Enable `debug` to see a warning when hls.js is missing.
- **One listener**: Prefer a single `change` listener with a `switch (detail.type)` over trying to attach many event handlers — all state flows through `change`.
- **Volume units**: `volume` (attribute), `setVolume()`/`getVolume()`, and the `volume` change payload all use a single `0`–`100` scale. Only the underlying native `<video>.volume` is `0`–`1` — the player converts at that one boundary.
- **Picture-in-Picture is progressive enhancement**: the button is hidden, not disabled, when the browser lacks support — don't rely on it always being present in the DOM.
- **Custom styling**: Use the `sheet` attribute to inject shadow-DOM CSS; there are no exported `::part()` handles on the player itself.

## Roadmap

`<r-player>` is actively growing — subtitles/CC, DASH/FLV playback, an error+retry UI, resume playback, and more are planned. See [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md) in the repo for the full breakdown and current phase.
