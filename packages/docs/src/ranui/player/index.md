# r-player

Modern video player component with HLS support, quality switching, and customizable controls.

Built on `hls.js` and `Web Components` with a modern modular architecture using Shadow DOM. The native `<r-player>` tag provides unified video controls across all browsers and frameworks.

## Features

- 🎬 **HLS Streaming** - Adaptive bitrate streaming with quality switching
- 📺 **Multi-Quality** - Automatic and manual quality level selection
- ⚡ **Playback Speed** - Variable speed control (0.5x - 2.0x)
- 🔊 **Volume Control** - Interactive volume slider with mute toggle
- 📱 **Responsive** - Mobile-friendly responsive design
- 🎨 **Customizable** - Full styling control via CSS variables
- ♿ **Accessible** - ARIA-compliant and keyboard navigable
- 🌓 **Shadow DOM** - Style encapsulation for better isolation
- 🔧 **Modular** - Clean manager-based architecture
- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JS

## Architecture

The modernized player uses a modular design with specialized managers:

```
Player (Main Class)
├── VideoManager - Video element and playback control
├── ProgressManager - Progress bar with drag interaction
├── ControlsManager - UI controls rendering and updates
├── HlsManager - HLS streaming (optional, auto-initialized)
└── FullscreenManager - Fullscreen API with browser compatibility
```

## Code Demo

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

### Basic Usage

```html
<r-player src="/ran/hls/example.m3u8"></r-player>
```

### With Attributes

```html
<r-player
  src="https://example.com/video.m3u8"
  autoplay
  volume="0.8"
  playbackrate="1.5">
</r-player>
```

### JavaScript API

```javascript
const player = document.querySelector('r-player');

// Playback control
await player.play();
await player.play(30); // Play from 30 seconds
player.pause();
player.stop();
player.seek(60); // Jump to 60 seconds

// Volume control
player.setVolume(0.8); // Set to 80%
player.mute();
player.unmute();

// Playback speed
player.setPlaybackRate(1.5); // 1.5x speed

// Quality control (HLS)
const qualities = player.getQualities();
player.setQuality('720p');

// Fullscreen
await player.requestFullscreen();
await player.exitFullscreen();
await player.toggleFullscreen();

// Get state
console.log(player.state); // 'playing', 'paused', etc.
console.log(player.currentTime);
console.log(player.duration);
console.log(player.paused);
```

## Attributes

### src

Video source URL. Supports both regular video files and HLS streams (`.m3u8`).

- **Type**: `string`
- **Default**: `""`

```html
<r-player src="https://example.com/video.mp4"></r-player>
<r-player src="https://example.com/stream.m3u8"></r-player>
```

### autoplay

Automatically start playback when loaded.

- **Type**: `boolean`
- **Default**: `false`

```html
<r-player src="video.mp4" autoplay></r-player>
```

### muted

Start with audio muted.

- **Type**: `boolean`
- **Default**: `false`

```html
<r-player src="video.mp4" muted></r-player>
```

### loop

Loop playback when video ends.

- **Type**: `boolean`
- **Default**: `false`

```html
<r-player src="video.mp4" loop></r-player>
```

### volume

Initial volume level (0-1).

- **Type**: `number`
- **Default**: `0.5`

```html
<r-player src="video.mp4" volume="0.8"></r-player>
```

### playbackrate

Initial playback speed multiplier.

- **Type**: `number`
- **Default**: `1.0`
- **Range**: `0.5` - `2.0`

```html
<r-player src="video.mp4" playbackrate="1.5"></r-player>
```

## Properties (Read-Only)

### state

Current player state.

- **Type**: `PlayerState`
- **Values**: `'idle'` | `'loading'` | `'ready'` | `'playing'` | `'paused'` | `'ended'` | `'error'` | `'buffering'`

```javascript
console.log(player.state); // 'playing'
```

### currentTime

Current playback position in seconds.

- **Type**: `number`

```javascript
console.log(player.currentTime); // 45.2
player.currentTime = 60; // Setter also available
```

### duration

Total video duration in seconds.

- **Type**: `number`

```javascript
console.log(player.duration); // 180.5
```

### paused

Whether playback is currently paused.

- **Type**: `boolean`

```javascript
console.log(player.paused); // true
```

## Events

Listen to player events using standard event listeners:

```javascript
player.addEventListener('play', (e) => {
  console.log('Started playing', e.detail);
});

player.addEventListener('timeupdate', (e) => {
  console.log('Current time:', e.detail.currentTime);
  console.log('Duration:', e.detail.duration);
});

player.addEventListener('statechange', (e) => {
  console.log('New state:', e.detail.state);
});
```

### Event Detail

All events include a `detail` object with:

```typescript
{
  currentTime: number;  // Current playback position
  duration: number;     // Total duration
  state: PlayerState;   // Current state
  volume: number;       // Current volume (0-1)
  playbackRate: number; // Current playback speed
}
```

### Available Events

| Event | Description |
|-------|-------------|
| `play` | Playback started |
| `pause` | Playback paused |
| `playing` | Playback is playing (after buffering) |
| `ended` | Playback reached the end |
| `timeupdate` | Current time changed (fires frequently) |
| `volumechange` | Volume changed |
| `ratechange` | Playback rate changed |
| `loadstart` | Started loading media |
| `loadeddata` | Media data loaded |
| `canplay` | Can start playing |
| `error` | An error occurred |
| `seeking` | Seeking started |
| `seeked` | Seeking completed |
| `statechange` | Player state changed |
| `fullscreenchange` | Fullscreen state changed |
| `qualitychange` | Video quality changed (HLS) |

### Legacy `onchange` Event

For backward compatibility, the `change` event is still supported:

```javascript
player.addEventListener('change', (e) => {
  const { type, data, currentTime, duration, tag } = e.detail;
  console.log('Event type:', type);
  console.log('Player instance:', tag);
});
```

## Styling

Customize the player appearance using CSS variables:

```css
r-player {
  /* Size */
  --width: 800px;
  --height: 450px;

  /* Background */
  --background: #000;

  /* Controls */
  --controls-bg: linear-gradient(180deg, transparent, rgba(0,0,0,0.9));
  --controls-padding: 16px;
  --controls-gap: 12px;

  /* Progress bar */
  --progress-height: 4px;
  --progress-bg: rgba(255,255,255,0.3);
  --progress-color: #ff0000;

  /* Text */
  --time-color: #fff;
  --time-font-size: 12px;
  --select-color: #fff;

  /* Transitions */
  --controls-transition: 0.3s;
}
```

### Responsive Design

The player automatically adapts to mobile devices:
- Volume control hidden on screens < 500px
- Touch-friendly controls
- Optimized for vertical and horizontal orientations

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: 14+
- iOS Safari: 14+
- Android Chrome: Latest

HLS support:
- Native in Safari (iOS/macOS)
- Via hls.js in other browsers

## Migration from Old API

If you're upgrading from the previous version:

### Breaking Changes

1. **CSS Variables**: Renamed from `--ran-player-*` to simpler names (e.g., `--width`, `--progress-color`)
2. **Shadow DOM**: Styles are now encapsulated. Use CSS variables or `::part()` to customize
3. **Events**: New `statechange` event for monitoring player state

### What Stays the Same

- ✅ HTML tag name: `<r-player>`
- ✅ Basic attributes: `src`, `volume`, `currentTime`, `playbackrate`
- ✅ Basic methods: `play()`, `pause()`, etc.
- ✅ Legacy `change` event still works

## TypeScript

Full TypeScript support with exported types:

```typescript
import { Player, PlayerState, PlayerEventDetail } from 'ranui';

const player = document.querySelector('r-player') as Player;

player.addEventListener('statechange', (e: CustomEvent<PlayerEventDetail>) => {
  const state: PlayerState = e.detail.state;
});
```

## License

MIT
