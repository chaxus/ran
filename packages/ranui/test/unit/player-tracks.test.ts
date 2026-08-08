import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTracksToVideo,
  getActiveSubtitleLanguage,
  loadPreferredSubtitleLanguage,
  savePreferredSubtitleLanguage,
  setActiveSubtitleLanguage,
} from '@/components/player/core/tracks';

describe('core/tracks pure functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('applyTracksToVideo builds <track> elements from config and clears old ones on re-apply', () => {
    const video = document.createElement('video');

    applyTracksToVideo(video, [
      { src: 'en.vtt', srclang: 'en', label: 'English', default: true },
      { src: 'fr.vtt', srclang: 'fr', label: 'Français', kind: 'subtitles' },
    ]);
    let tracks = Array.from(video.querySelectorAll('track'));
    expect(tracks).toHaveLength(2);
    expect(tracks[0].src).toContain('en.vtt');
    expect(tracks[0].srclang).toBe('en');
    expect(tracks[0].label).toBe('English');
    expect(tracks[0].default).toBe(true);
    expect(tracks[1].default).toBe(false);
    expect(tracks[0].kind).toBe('subtitles');

    applyTracksToVideo(video, [{ src: 'de.vtt', srclang: 'de', label: 'Deutsch' }]);
    tracks = Array.from(video.querySelectorAll('track'));
    expect(tracks).toHaveLength(1);
    expect(tracks[0].srclang).toBe('de');
  });

  it('applyTracksToVideo clears all tracks when given an empty list', () => {
    const video = document.createElement('video');
    applyTracksToVideo(video, [{ src: 'en.vtt', srclang: 'en', label: 'English' }]);
    expect(video.querySelectorAll('track')).toHaveLength(1);

    applyTracksToVideo(video, []);
    expect(video.querySelectorAll('track')).toHaveLength(0);
  });

  it('setActiveSubtitleLanguage/getActiveSubtitleLanguage toggle TextTrack.mode by language', () => {
    // jsdom doesn't implement the TextTrack API (video.textTracks stays empty
    // even with real <track> children), so these take a plain array of
    // track-like objects instead of a real HTMLVideoElement — see core/tracks.ts.
    const tracks = [
      { language: 'en', mode: 'showing' },
      { language: 'fr', mode: 'hidden' },
    ] as unknown as TextTrack[];

    setActiveSubtitleLanguage(tracks, 'fr');
    expect(getActiveSubtitleLanguage(tracks)).toBe('fr');
    expect(tracks[0].mode).toBe('hidden');
    expect(tracks[1].mode).toBe('showing');

    setActiveSubtitleLanguage(tracks, 'off');
    expect(getActiveSubtitleLanguage(tracks)).toBe('off');
    expect(tracks[0].mode).toBe('hidden');
    expect(tracks[1].mode).toBe('hidden');
  });

  it('persists and reads back the preferred subtitle language', () => {
    expect(loadPreferredSubtitleLanguage()).toBe('off');
    savePreferredSubtitleLanguage('ja');
    expect(loadPreferredSubtitleLanguage()).toBe('ja');
  });
});
