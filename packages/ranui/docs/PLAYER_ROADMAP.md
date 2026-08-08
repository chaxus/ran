# Player Roadmap — Design Guide (`r-player`)

`r-player` wraps a native `<video>` with a unified control bar (play, seek, volume, speed,
clarity, fullscreen) built on Web Components + Shadow DOM, with optional HLS playback via
hls.js. This file is the **canonical evaluation and roadmap** for growing it toward a
production-grade player (Video.js / Plyr / Shaka-level capability), so the analysis isn't
redone each time a feature is picked up. Follow `docs/RENDERER_COMPONENTS.md`'s conventions
where they apply (lazy heavy deps, `::part(error)` + event over console, `registerIcon` +
`<r-icon>` over legacy background-image icons, `r-modal` over reinventing overlays) — player
predates that pattern in places, and closing that gap is itself part of this roadmap.

---

## 1. Current (shipped)

### 1.1 Controls / interaction

- **Play/pause**: click on video or the bottom-bar button, Space key.
- **Seek**: click-to-seek, drag the progress dot, keyboard (`Home`/`End`/`ArrowLeft`/
  `ArrowRight` on the focused seek bar — a real ARIA `role="slider"` with live
  `aria-valuenow`/`aria-valuetext`; `ArrowLeft`/`ArrowRight` on the player host itself also
  seek ±5s as a global shortcut).
- **Volume**: drag slider + mute-toggle icon, unified `0`–`100` scale end-to-end (attribute,
  `setVolume()`/`getVolume()`, the `volume` change payload, and the native `volumechange`
  event all agree on this scale now — previously the attribute was `0`–`100` but the methods
  were `0`–`1`, a real footgun that's been fixed).
- **Speed**: 5 presets (`2.0x/1.5x/1.0x/0.8x/0.5x`) via an `<r-select>` popover.
- **Clarity/quality**: auto-parsed from the HLS manifest's variant levels + a synthetic
  `Auto` entry; switching preserves playback position/rate/volume across the source reload
  (`capturePlaybackSnapshot`/`restorePlaybackSnapshot`).
- **Fullscreen**: standard Fullscreen API with vendor-prefix fallbacks
  (`core/fullscreen.ts`), Esc to exit.
- **Auto-hiding control bar**: fades out 2s after the last interaction while playing.
- **Keyboard focus**: the host is tab-focusable; every shortcut above works without a mouse.
- **Mobile inline playback**: `webkit-playsinline`/`playsinline`/`x5-video-player-type` so
  iOS Safari and WeChat's X5 engine play inline instead of forcing native fullscreen.
- **Picture-in-Picture**: `togglePip()` + a control-bar button, rendered only when
  `document.pictureInPictureEnabled` (progressive enhancement — `core/pip.ts`).
- **`poster`/`autoplay`/`loop`/`muted`**: standard `<video>` attributes, passed through.
- **Subtitles/CC**: `tracks` property (imperative — light DOM gets cleared on every load, so
  no declarative `<track>` children) → native `<track>` elements, native cue rendering, an
  `<r-select>` language picker (mirrors the clarity selector), preference persisted globally
  via `createStore` (`core/tracks.ts`).
- **Error + retry**: on by default — a fatal HLS error or a native `error` event opens a
  lazy-loaded `Modal.error()` dialog with a Retry button; `disable-error-modal` opts out
  (`core/error.ts`).
- **Resume playback**: opt-in via `remember-position` — saves position to `localStorage` on
  `pause`/tab-hidden, restores on the next load of the same `src`, clears on `ended`
  (`core/resume.ts`).

### 1.2 Formats

- **Native `<video>` formats**: MP4, WebM, Ogg — whatever the browser's own decoder supports,
  no extra code needed.
- **HLS (`.m3u8`)**: via `hls.js`, now a real lazy npm dependency (`core/adapters/hls.ts`,
  reached only via `await import('hls.js')`) — no more vendored blob, no more `window.Hls`
  requirement. Falls back to native `<video src>` when the format has no registered adapter or
  `Hls.isSupported()` is false (e.g. Safari, which plays HLS natively).
- **DASH (`.mpd`)**: via `dashjs` (`core/adapters/dash.ts`), also a lazy npm dependency. Quality
  switching stays inside the already-loaded manifest (`setRepresentationForTypeById`) — no
  `<video>` reload, unlike HLS.
- **FLV / raw MPEG-TS (`.flv`/`.ts`)**: via `mpegts.js` (`core/adapters/flv.ts`), the actively
  maintained fork of `flv.js`. Typically single-bitrate live streams — no clarity selector
  renders since there's nothing to switch.
- **Format detection**: by `src`'s extension (`core/adapters/detect.ts`'s `detectFormat`), or
  forced explicitly via the `format` attribute for extensionless/signed streaming URLs.
- **Not supported today**: WebRTC.

### 1.3 Architecture (for context — see the player's own internal-refactor history)

Signal-based visual state (`core/store.ts`/`core/effects.ts`) + `EventManager`-scoped
listeners + a plain `ctx` object for the informal `ctx.action` SyncHook API. Streaming engines
conform to a shared `EngineAdapter` interface (`core/adapters/types.ts`:
`{load, destroy, getQualityLevels, setQuality, on, reloadsOnQualityChange}`), selected by
`core/adapters/index.ts`'s `createEngineAdapter(format)` registry — no format-specific
branching lives in `components/player/index.ts`, `core/media.ts`, or `core/clarity.ts`
themselves. Each adapter is responsible for translating its own library's event/quality
vocabulary into the generic one; `core/levels.ts`'s `buildManifestLevels` (URL-per-level
dedup) is HLS-specific now that its only consumer is `core/adapters/hls.ts` — DASH/FLV build
their own level lists from their own libraries' native APIs.

### 1.4 Icons

Legacy PNG/SVG `background-image` icons (`components/player/img/*`, wired through
`index.less`) — **not** on the `<r-icon>` + `registerIcon` system every other component uses.
New chrome (PiP, subtitles, cast) should use `<r-icon>`; migrating the existing play/pause/
fullscreen/volume glyphs is a separate, purely-visual item (§4, Phase 4) — not bundled into
feature work to avoid unrelated visual-regression risk.

---

## 2. Gap vs. reference players

| # | Feature | Reference | Current state | Worth adding? |
| - | ------- | --------- | -------------- | -------------- |
| 1 | Subtitles/CC | native `<video controls>`, YouTube | **shipped (Phase 1)** | ✅ table-stakes for many use cases |
| 2 | Picture-in-Picture | native `<video controls>`, YouTube | **shipped (Phase 0)** | ✅ one native API call, high value/cost ratio |
| 3 | `poster`/`autoplay`/`loop`/`muted` | native `<video>` | **shipped (Phase 0)** | ✅ trivial, commonly expected |
| 4 | Error + retry UI | Video.js, Shaka | **shipped (Phase 1)** | ✅ real UX gap today |
| 5 | Resume playback | YouTube (signed-in), many VOD players | **shipped (Phase 1)** | ✅ opt-in, low complexity via `localStorage` |
| 6 | Thumbnail scrubbing preview | YouTube, Video.js (VTT sprite plugin) | progress hover shows time text only | 🟡 real value, real complexity (VTT sprite parsing) |
| 7 | DASH | Shaka, dash.js-based players | **shipped (Phase 2)** | ✅ done via the engine-adapter refactor (§3) |
| 8 | FLV / raw MPEG-TS | Video.js + flv.js/mpegts.js plugins | **shipped (Phase 2)** | ✅ done via `mpegts.js` (see below) |
| 9 | Mobile gestures (double-tap seek, swipe volume) | YouTube app, most native players | none | 🟡 real value, no existing gesture code to build on |
| 10 | AirPlay / Remote Playback | native `<video controls>` on Safari/Chrome | none | 🟡 best-effort, feature-detected, inconsistent browser support |
| 11 | QoE metrics hook | Shaka, hls.js's own stats, commercial players | **shipped (Phase 3)** | ✅ done via `core/metrics.ts`, pure computation on existing events |
| 12 | WebRTC low-latency live | ultra-low-latency live players | unsupported | ❌ not planned — different transport model entirely (see §3) |

---

## 3. Enrichment design — mapped to ranui mechanisms

- **Subtitles/CC** → native `<track>` elements, but attached to the **internally-managed**
  `<video>`, not the user's light DOM — the player already clears `this.innerHTML = ''` on
  every source load (documented "no slots" behavior), so a declarative `<track>` child would
  be wiped. Expose an imperative `tracks` property (`player.tracks = [{kind, src, srclang,
  label, default}]`) that builds `<track>` elements onto `_video` in `updatePlayer()`. Cue
  *rendering* is free — the browser paints `<track kind="subtitles">` cues natively, no
  custom renderer needed for v1. Add a CC toggle button (`<r-icon>` + `registerIcon`) and a
  language picker reusing the same `<r-select>` popover pattern as clarity/speed
  (`createClaritySelect` is the template). Persist the last-chosen language via
  `createStore` (see Resume playback below).
- **Picture-in-Picture** → `core/pip.ts` mirroring `core/fullscreen.ts`'s shape: pure
  functions `isPipSupported()`, `requestPip(video)`, `exitPip()`. Button only renders when
  `isPipSupported()` is true (progressive enhancement — PiP support is narrower than
  Fullscreen, so an always-visible dead button would be worse than no button). Wire
  `enterpictureinpicture`/`leavepictureinpicture` through the existing
  `core/media.ts` `MEDIA_EVENT_HANDLER_MAP` table, surface via the existing `change()` event
  (`pictureinpicture` type, boolean payload — same shape as the existing `fullscreen` type).
- **`poster`/`autoplay`/`loop`/`muted`** → straight attribute passthrough in `updatePlayer()`
  alongside the existing `.attr('preload', 'auto')`/`.attr('playsinline', 'true')` calls.
  `muted` needs to sync the volume signal (`setVolume(0)` semantics) so the mute icon doesn't
  disagree with the real `<video>.muted` state on initial load.
- **Error + retry UI** → **`r-modal`'s existing `Modal.error({title, content, okText,
  onConfirm})` static helper** (`components/modal/index.ts`) — no new overlay primitive
  needed, exactly the same reuse `r-mermaid`'s fullscreen lightbox makes of `r-modal`. Wire
  into `hlsError`/media `error` handling, gated on `data.fatal` (hls.js's error payload
  already carries this) so transient/recoverable errors don't interrupt playback with a
  dialog.
- **Resume playback** → `createStore<T>(prefix)` from `ranuts/utils`
  (`packages/ranuts/src/utils/storage.ts`) — the same SSR-safe, JSON-serializing, guarded
  localStorage wrapper `utils/theme.ts` and the i18n singleton already use. Opt-in via a
  `remember-position` boolean attribute (silently resuming without consent is a bad
  surprise, not a default). Key by `src`; save on `pause`/throttled `timeupdate`, restore on
  `loadedmetadata` when the saved position is meaningfully short of the duration.
- **Thumbnail scrubbing preview** → parse a WebVTT sprite manifest (the same convention
  YouTube/Video.js use: cues whose text is `spritesheet.jpg#xywh=x,y,w,h`), position a
  cropped `background-image` of the sprite inside the existing `_playerTip` tooltip on
  progress hover instead of (or alongside) the time text. New `thumbnails` attribute (a VTT
  URL). No existing ranui parsing utility for WebVTT — this is genuinely new code, and the
  most implementation-heavy item on this list after the DASH/FLV engine work.
- **DASH + FLV/TS + the underlying engine-adapter refactor** → these three have to move
  together. Today's `core/media.ts`/`core/levels.ts`/`changeClarity` model is HLS-shaped:
  quality = a different URL, loaded via `hls.loadSource(url)`. **DASH doesn't work that
  way** — `dashjs`'s multi-bitrate renditions live inside one manifest, switched via
  `player.setQualityFor('video', index)`, no new URL. So the fix is a proper engine-adapter
  interface — `{ load(src), destroy(), getQualityLevels(), setQuality(id), on(event,
  handler) }` — that HLS, DASH, and FLV/TS implementations all conform to, with a small
  `detectFormat(src, typeHint?)` utility (`.m3u8`→hls, `.mpd`→dash, `.flv`→flv, else
  native) picking the adapter. Each engine lib becomes a **lazy dynamic `import()`** exactly
  like `mermaid`/`temml` — reached only when a matching `src` is actually set — which also
  fixes the existing eager-`hls.js`-blob problem (§1.2) as a side effect of the same refactor
  (hls.js becomes a real npm `dependency`, not a vendored blob). Recommended libraries:
  **`hls.js`** (already in use, just needs to become a lazy npm dep), **`dashjs`** for DASH,
  and **`mpegts.js`** (the actively-maintained fork of `flv.js`) for FLV — it also covers
  fragmented-MP4 and raw MPEG-TS in the same lib, which is the practical rest of "mainstream
  formats" beyond native+HLS+DASH.
- **Mobile gestures** → no existing seek/volume gesture code anywhere in the repo to build
  on; the closest template is **`r-mermaid`'s fullscreen pan/zoom**
  (`components/mermaid/index.ts` — `pointerdown`/`pointermove`/`pointerup` +
  `setPointerCapture`), which is the right idiom to copy (Pointer Events unify mouse/touch/
  pen, unlike the mouse-only drag code the player's own progress bar currently uses). Scope:
  double-tap left/right half → seek ∓10s with a brief visual flash; vertical swipe on the
  right half → volume. (A left-half "swipe for brightness" gesture some native apps have was
  considered and dropped from scope — it'd have to fake dimming via a CSS `filter` on the
  video element, which is a app-specific gimmick more than a general-purpose library
  feature.)
- **AirPlay / Remote Playback** → feature-detected, best-effort: the standards-track **Remote
  Playback API** (`videoElement.remote.prompt()`) for Chrome/Edge, Safari's
  `webkitShowPlaybackTargetPicker()` for AirPlay. Button renders only when at least one is
  available — same progressive-enhancement rule as Picture-in-Picture.
- **QoE metrics — shipped (Phase 3).** Pure computation layered on the event stream the
  player already emits via `change()`; no new UI. `core/metrics.ts`'s `createMetricsController()`
  derives `{rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount}`
  from that stream — `waiting`→`playing` = a rebuffer, `updatePlayer()`'s `onLoadStart()` call →
  first `canplay`/`playing` = first-frame time, a new `qualityswitch` change event (dispatched
  from `changeClarity` in `core/clarity.ts`) = quality switches, `error`/`sourceerror` = errors.
  `RanPlayer.change()` feeds every event through `this._metrics.record(name, value)`; the
  counters reset on every `updatePlayer()` (a fresh `src`/`format` load) so a snapshot always
  describes the current source, never a cross-source running total. Exposed via `getMetrics()`.
- **WebRTC — not planned.** Fundamentally different transport (no `<video src>` load; needs
  `RTCPeerConnection` + a signaling server) — doesn't fit the engine-adapter model the other
  three formats share, and is a different scope of work than everything else on this list.
  Recorded here so it isn't silently forgotten, not because it's scheduled.

---

## 4. Roadmap (status)

- **Phase 0 — done:** `poster`/`autoplay`/`loop`/`muted` attribute passthrough;
  Picture-in-Picture (`core/pip.ts` + button, feature-detected, `change('pictureinpicture', …)`).
  Zero new dependencies, zero architecture changes.
- **Phase 1 — done:** Error + retry UI (`core/error.ts` + lazy-loaded `Modal.error`, fatal
  HLS errors + native `error`, opt-out via `disable-error-modal`); resume playback
  (`core/resume.ts` + `createStore`, opt-in via `remember-position`, saved on
  `pause`/`visibilitychange:hidden`, cleared on `ended`); subtitles/CC (`core/tracks.ts` +
  `tracks` property + native `<track>` + an `<r-select>` language picker mirroring the
  clarity selector, preference persisted globally via `createStore`).
- **Phase 2 — done:** Engine-adapter architecture generalization (`core/adapters/types.ts`'s
  `{load, destroy, getQualityLevels, setQuality, on, reloadsOnQualityChange}` interface; HLS
  converted onto it and `hls.js` migrated from a 749KB vendored blob to a lazy npm dependency)
  + DASH (`dashjs`, `core/adapters/dash.ts`) + FLV/TS (`mpegts.js`, `core/adapters/flv.ts`) —
  shipped together since all three depend on the same new architecture. A new `format`
  attribute forces a specific engine for URLs that can't be sniffed by extension. The
  `hlsManifestLoaded`/`hlsError` `change` event types were renamed to the generic
  `levelsready`/`sourceerror` as part of this — a deliberate breaking change (alpha stage).
- **Phase 3 — in progress:** QoE metrics (`core/metrics.ts` + `getMetrics()`, a new
  `qualityswitch` change event) — **done**. Still planned: thumbnail scrubbing preview
  (WebVTT sprite), mobile gestures (double-tap seek + volume swipe), AirPlay/Remote
  Playback button.
- **Phase 4 — recorded, not scheduled:** WebRTC low-latency live playback; migrating the
  existing play/pause/fullscreen/volume icons from legacy background-image to
  `<r-icon>`/`registerIcon` (purely visual, decoupled from the feature work above).

Every new control follows the opt-in rule already established elsewhere in ranui (§5): a
bare `<r-player src="...">` stays exactly as simple as it is today.

---

## 5. Consistency checklist for player feature work

- [ ] New heavy engine libs (`dashjs`, `mpegts.js`, and `hls.js` once migrated) are regular
      `dependencies`, reached only via dynamic `import()` — never eager/static in
      `index.js`.
- [ ] New chrome icons (PiP, CC, cast) go through `<r-icon>` + `registerIcon(...)` in-module
      — not the legacy background-image icon system.
- [ ] New overlay UI (error dialog, subtitle-language picker) reuses `r-modal`/`r-select`
      rather than inventing a new overlay primitive.
- [ ] New persisted state (resume position, subtitle language) goes through
      `createStore`/`localStorageGetItem`/`localStorageSetItem` from `ranuts/utils` — never
      raw `localStorage` calls (SSR-safety already handled there).
- [ ] New progressive-enhancement controls (PiP, AirPlay/Remote Playback) render only when
      feature-detected as available — no dead buttons.
- [ ] New gesture code follows the Pointer Events idiom (`pointerdown`/`pointermove`/
      `pointerup` + `setPointerCapture`), not separate mouse/touch listeners.
- [x] New engine adapters conform to the shared `core/adapters/types.ts` `EngineAdapter`
      interface (`{load, destroy, getQualityLevels, setQuality, on, reloadsOnQualityChange}`)
      — no format-specific branching left in `components/player/index.ts`, `core/media.ts`, or
      `core/clarity.ts` (Phase 2, done).
- [ ] Errors surface as a visible UI state (`Modal.error` / a `::part(error)`-style element)
      **and** a `change`/CustomEvent — never console-only.
- [ ] Every new attribute/method/event is added to `docs/src/ranui/player/index.md` **and**
      its `cn/` mirror in the same change.
