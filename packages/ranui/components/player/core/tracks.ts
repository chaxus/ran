import { createStore } from 'ranuts/utils';

export interface PlayerTrackConfig {
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

/** Rebuilds the `<track>` children from scratch — cheap, and avoids diffing. */
export function applyTracksToVideo(video: HTMLVideoElement, tracks: PlayerTrackConfig[]): void {
  video.querySelectorAll('track').forEach((el) => el.remove());
  tracks.forEach((config) => {
    const track = document.createElement('track');
    track.kind = config.kind || 'subtitles';
    track.src = config.src;
    track.srclang = config.srclang;
    track.label = config.label;
    if (config.default) track.default = true;
    video.appendChild(track);
  });
}

/**
 * Takes `video.textTracks` (a `TextTrackList`) rather than the `<video>` itself —
 * keeps this testable with a plain array of track-like objects, since jsdom
 * doesn't implement the TextTrack API at all (`video.textTracks.length` stays 0
 * no matter how many `<track>` children exist).
 *
 * `lang` is a track's `srclang`, or `'off'` to hide every track. Cue rendering
 * itself is entirely native — this only toggles which TextTrack the browser
 * is allowed to render.
 */
export function setActiveSubtitleLanguage(tracks: Iterable<TextTrack>, lang: string): void {
  Array.from(tracks).forEach((track) => {
    track.mode = lang !== 'off' && track.language === lang ? 'showing' : 'hidden';
  });
}

export function getActiveSubtitleLanguage(tracks: Iterable<TextTrack>): string {
  const active = Array.from(tracks).find((track) => track.mode === 'showing');
  return active?.language || 'off';
}

const SUBTITLE_LANG_KEY = 'preferred';
const subtitleLangStore = createStore<string>('ran-player-subtitle-lang:');

/** Global, not per-src — a viewer's language preference should follow them across videos. */
export function loadPreferredSubtitleLanguage(): string {
  return subtitleLangStore.get(SUBTITLE_LANG_KEY, 'off');
}

export function savePreferredSubtitleLanguage(lang: string): void {
  subtitleLangStore.set(SUBTITLE_LANG_KEY, lang);
}
