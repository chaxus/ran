---
description: 'The ranui Player (<r-player>) wraps native <video> with a unified control bar: play, progress dragging, volume, speed and fullscreen, with HLS/DASH/FLV streaming.'
---

# Player

A native `<r-player>` media element that wraps a `<video>` with a unified control bar, progress dragging, volume control, playback speed, fullscreen, and HLS/DASH/FLV streaming.

> **Use when** you need a video player with a built-in control bar, progress scrubbing, playback speed, fullscreen, and HLS/DASH/FLV streaming — `<r-player>` wraps `<video>` and runs unchanged across frameworks.

Built on Web Components, with `hls.js`/`dashjs`/`mpegts.js` lazy-loaded on demand for their respective formats, so the same player runs unchanged across frameworks. Capabilities driven from source:

- Draggable progress bar with buffered indicator and a time tooltip on hover
- Volume control and mute toggle
- Playback speed selection
- Fullscreen toggle (and `Esc` to exit)
- Picture-in-Picture toggle — the button only renders when the browser actually supports it
- AirPlay/Remote Playback button — the browser's own device picker, feature-detected the same way as Picture-in-Picture
- Mobile gestures — double-tap the left/right half to seek ∓10s, vertical swipe on the right half for volume (touch only; mouse/pen interaction is unaffected)
- Thumbnail scrubbing preview — set `thumbnails` to a WebVTT sprite-sheet manifest URL, a cropped preview appears above the seek-bar hover tip
- `poster` / `autoplay` / `loop` / `muted` — standard `<video>` attributes, passed straight through
- Subtitles/CC — set the `tracks` property, browser-native cue rendering, a language picker that remembers the viewer's choice
- Error + retry — a `Modal.error()` dialog on fatal playback failures, on by default, opt-out via `disable-error-modal`
- Resume playback — opt-in via `remember-position`, saved to `localStorage`, keyed per `src`
- QoE metrics — `getMetrics()` derives rebuffer count/duration, first-frame time, quality-switch count and error count from the existing event stream
- HLS (`.m3u8`) and DASH (`.mpd`) playback with automatic bitrate switching and a manual clarity selector; FLV/raw MPEG-TS (`.flv`/`.ts`) playback via `mpegts.js` — every engine lazy-loads on demand, no setup required. Force a specific engine (or opt back into plain `<video src>`) via the `format` attribute when a URL's extension can't be sniffed.
- WebRTC low-latency live playback via WHEP (`format="webrtc"`, `src` is a WHEP endpoint URL) — no library dependency, `RTCPeerConnection` is a native browser API.
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
| `src`          | `string` | `''`    | Video resource URL. Changing it reloads the player. Engine (HLS/native) is auto-detected from the extension. |
| `format`       | `string` | `''`    | Force a specific engine — `hls` / `dash` / `flv` / `webrtc` / `native` — instead of auto-detecting from `src`'s extension. Useful for extensionless/signed streaming URLs; **required** for `webrtc` (a WHEP endpoint has no extension to detect). Changing it reloads the player. |
| `volume`       | `string` | `''`    | Initial volume on a `0`–`100` scale — same scale as `setVolume()`/`getVolume()`. |
| `currentTime`  | `string` | `''`    | Initial playback position in seconds. Also accepted lowercase as `currenttime`.                       |
| `playbackRate` | `string` | `''`    | Playback speed multiplier (e.g. `1`, `1.5`, `2`). Also accepted lowercase as `playbackrate`.          |
| `debug`        | `string` | `''`    | When truthy, logs every internal `change` event and warnings to the console.                          |
| `sheet`        | `string` | `''`    | CSS text injected into the component's shadow DOM for custom styling.                                 |
| `poster`       | `string` | `''`    | Image URL shown before playback starts. Passed straight to `<video poster>`.                          |
| `autoplay`     | `boolean` | `false` | Boolean attribute — presence means `true`, same as native `<video autoplay>`. Browsers generally require `muted` for autoplay to actually start without a user gesture. |
| `loop`         | `boolean` | `false` | Boolean attribute — loops playback on end, same as native `<video loop>`.                             |
| `muted`        | `boolean` | `false` | Boolean attribute — starts silent. Internally this sets volume to `0` (so the mute icon/slider agree) **and** the native `<video>.muted` flag (so the browser's autoplay-muted policy is satisfied). Removing the attribute restores the previous volume. |
| `thumbnails`   | `string` | `''`    | URL of a WebVTT sprite-sheet manifest — shows a cropped thumbnail above the seek-bar hover tip. See [Thumbnail Scrubbing Preview](#thumbnail-scrubbing-preview) below. Independent of `src`: only refetched when this attribute itself changes. |
| `disable-error-modal` | `boolean` | `false` | Opt out of the built-in error + retry dialog — errors still reach you via the `error`/`sourceerror` `change` events, so build your own UI on top. |
| `remember-position` | `boolean` | `false` | Opt in to resume playback: saves the current position to `localStorage` (keyed by `src`) on pause / when the tab is hidden, restores it on the next load of the same `src`, and clears it once playback ends. |
| `tracks`       | `PlayerTrackConfig[]` | `[]`    | Subtitle/CC tracks — **JS property only, no matching attribute** (the player clears its own light DOM on every load, so declarative `<track>` children wouldn't survive). See [Subtitles/CC](#subtitles-cc-tracks) below. |

> Observed attributes (from `observedAttributes`): `src`, `format`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `autoplay`, `loop`, `muted`, `disable-error-modal`, `remember-position`.

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

### AirPlay / Remote Playback

The cast button appears when the browser exposes either the standards-track Remote Playback API (`videoElement.remote.prompt()` — Chrome/Edge) or Safari's `webkitShowPlaybackTargetPicker()` (AirPlay); it's hidden, not disabled, everywhere else — the same progressive-enhancement rule as Picture-in-Picture. Open the device picker programmatically with `showRemotePlaybackPicker()`.

### Mobile Gestures

Touch-only, on by default, no attribute to enable: double-tap the left half of the video to seek back 10 seconds, double-tap the right half to seek forward 10 seconds (a brief `-10s`/`+10s` flash confirms it), and drag vertically on the right half to adjust volume. Mouse and pen interaction is completely untouched — a single touch tap still toggles play/pause, just debounced by the same window used to detect a double-tap, so a double-tap-to-seek never lets the in-between tap flicker playback. Fires a `gestureseek` `change` event (`{ direction, seconds }`) alongside the existing `volume` event for the swipe.

### Thumbnail Scrubbing Preview `thumbnails`

```html
<r-player src="/ran/hls/example.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` points at a WebVTT manifest whose cues follow the sprite-sheet convention YouTube and Video.js use — each cue's text is an image reference plus a `#xywh=x,y,w,h` fragment identifying its crop out of a shared sprite sheet:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

The image reference is resolved relative to the VTT file's own URL, so a sprite sheet next to the manifest needs no absolute path. Hovering (or dragging) the seek bar shows the cue covering that time as a cropped thumbnail above the existing time tooltip — nothing renders when `thumbnails` is unset, or before the manifest has loaded. The manifest is fetched and parsed once per `thumbnails` change, independent of `src`: switching quality/source doesn't refetch it.

### Subtitles/CC `tracks`

```js
const player = document.querySelector('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
```

Each entry becomes a native `<track>` on the underlying `<video>` — cue rendering is entirely the browser's own, the player doesn't draw anything custom. A language picker (an `<r-select>`, same interaction as the clarity selector) appears in the control bar with **Off** plus one entry per track; picking a language is remembered in `localStorage` and applied automatically the next time any `<r-player>` on the page gets tracks (global preference, not per-video) — falling back to whichever track has `default: true` if nothing was saved yet. Setting `tracks = []` removes the picker and every track. `setSubtitleLanguage(lang)` sets the active language imperatively (`lang` is a `srclang`, or `'off'`).

### Error + Retry

On by default. A fatal streaming-engine error or a native `<video>` `error` event opens a `Modal.error()` dialog (lazy-loaded — `r-modal` isn't fetched at all until something actually fails) with a **Retry** button that reloads the player. Set `disable-error-modal` to turn this off and handle errors yourself via the `error`/`sourceerror` `change` events instead. Non-fatal engine errors (hls.js recovers these internally) never trigger the dialog.

### Resume Playback `remember-position`

```html
<r-player src="/ran/hls/example.m3u8" remember-position></r-player>
```

Saves `getCurrentTime()` to `localStorage` (keyed by `src`) on `pause` and whenever the tab becomes hidden (`visibilitychange`, more reliable than `beforeunload`), restores it on the next load of that same `src`, and clears it once the video reaches `ended`. Silently skipped if the saved position is within 2 seconds of the duration — a finished video restarts fresh rather than "resuming" at its own end. Only the position is remembered; volume/speed/subtitle preferences are separate opt-ins.

### QoE Metrics

```js
const player = document.querySelector('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
```

`getMetrics()` returns a plain-object snapshot derived from the same `change` event stream documented below — there's no separate tracking to opt into:

| Field                | Type              | Description                                                              |
| -------------------- | ----------------- | ------------------------------------------------------------------------- |
| `rebufferCount`       | `number`          | Number of `waiting`→`playing` transitions (stalls that then recovered).   |
| `rebufferDuration`    | `number`          | Total time (ms) spent stalled across all rebuffers.                      |
| `firstFrameMs`        | `number \| null`  | ms from the current `src` starting to load to the first playable frame; `null` until then. |
| `qualitySwitchCount`  | `number`          | Number of clarity levels the user has picked from the quality selector.  |
| `errorCount`          | `number`          | Number of `error`/`sourceerror` events.                                  |

The snapshot resets whenever a new `src`/`format` loads — it always describes the **current** source, not a running total across sources.

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
| `setSubtitleLanguage(lang)`                | Set the active subtitle track by `srclang`, or `'off'` to disable. |
| `getMetrics()`                             | Read the current [QoE metrics](#qoe-metrics) snapshot. |
| `showRemotePlaybackPicker()`               | Open the browser's AirPlay/Remote Playback device picker. No-op if unsupported or no source is loaded. |

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
| `error`          | A media error occurred (also opens the built-in error+retry dialog, unless `disable-error-modal` is set). |
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
| `subtitlechange`    | `string`           | Subtitle language changed via the CC picker or `setSubtitleLanguage()` — a `srclang`, or `'off'`. |
| `resume`            | `number`           | A saved position was silently restored on load (`remember-position`); `data` is the restored time in seconds. |
| `levelsready`       | `{ levels }`       | The streaming engine's manifest was parsed; clarity levels are now available. |
| `sourceerror`       | `{ fatal, detail }` | A streaming-engine error occurred (falls back to the raw `src`; a **fatal** error also opens the error+retry dialog unless `disable-error-modal` is set — non-fatal errors are the engine's own internal recovery and don't). |
| `qualityswitch`     | `{ level }`        | The user picked a clarity level from the quality selector.                                        |
| `gestureseek`       | `{ direction, seconds }` | A double-tap seek gesture fired (`direction` is `'forward'`/`'backward'`).                    |

## Slots

The player does not accept slotted content: it clears its own light-DOM children (`this.innerHTML = ''`) in the constructor and again on every source load. For custom overlays, style the player via the `sheet` attribute instead.

## Best Practices

- **Sizing**: The host is `display: block` with no intrinsic size — always give it an explicit width and height, otherwise the video collapses.
- **Streaming engines**: `.m3u8` (HLS), `.mpd` (DASH), and `.flv`/`.ts` (FLV/MPEG-TS via `mpegts.js`) sources each load their engine lazily and automatically — no setup required. If a URL's extension can't be sniffed (extensionless/signed CDN URLs), set the `format` attribute explicitly (e.g. `format="dash"`) instead of relying on detection.
- **One listener**: Prefer a single `change` listener with a `switch (detail.type)` over trying to attach many event handlers — all state flows through `change`.
- **Volume units**: `volume` (attribute), `setVolume()`/`getVolume()`, and the `volume` change payload all use a single `0`–`100` scale. Only the underlying native `<video>.volume` is `0`–`1` — the player converts at that one boundary.
- **Picture-in-Picture is progressive enhancement**: the button is hidden, not disabled, when the browser lacks support — don't rely on it always being present in the DOM.
- **Custom styling**: Use the `sheet` attribute to inject shadow-DOM CSS; there are no exported `::part()` handles on the player itself.

## Roadmap

`<r-player>` is actively growing. Subtitles/CC, an error+retry UI, and resume playback (Phase 1), plus DASH and FLV/raw MPEG-TS playback behind an engine-agnostic adapter architecture (Phase 2), are done — thumbnail scrubbing preview, mobile gestures, AirPlay/Remote Playback, and QoE metrics are still planned. See [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md) in the repo for the full breakdown and current phase.
