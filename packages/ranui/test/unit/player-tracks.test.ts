import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTracksToVideo,
  getActiveSubtitleLanguage,
  loadPreferredSubtitleLanguage,
  savePreferredSubtitleLanguage,
  setActiveSubtitleLanguage,
} from '@/components/player/core/tracks';
import '@/components/player';

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

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  return player;
};

describe('r-player subtitle/CC (integration)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('leaves the subtitle select empty when no tracks are configured', () => {
    const player = makePlayer();
    expect(player._playControllerBottomSubtitle.innerHTML).toBe('');
  });

  it('builds an Off + per-track <r-select> when tracks are set', () => {
    const player = makePlayer();

    player.tracks = [
      { src: 'en.vtt', srclang: 'en', label: 'English' },
      { src: 'fr.vtt', srclang: 'fr', label: 'Français' },
    ];

    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    expect(select).not.toBeNull();
    const options = Array.from(player._playControllerBottomSubtitle.querySelectorAll('r-option')).map((el: any) =>
      el.getAttribute('value'),
    );
    expect(options).toEqual(['Off', 'en', 'fr']);
  });

  it('selects the default:true track on load when no preference is stored', () => {
    const player = makePlayer();

    player.tracks = [
      { src: 'en.vtt', srclang: 'en', label: 'English' },
      { src: 'fr.vtt', srclang: 'fr', label: 'Français', default: true },
    ];

    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    expect(select?.getAttribute('value')).toBe('fr');
  });

  it('prefers a previously-saved language over default:true', () => {
    savePreferredSubtitleLanguage('en');
    const player = makePlayer();

    player.tracks = [
      { src: 'en.vtt', srclang: 'en', label: 'English' },
      { src: 'fr.vtt', srclang: 'fr', label: 'Français', default: true },
    ];

    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    expect(select?.getAttribute('value')).toBe('en');
  });

  it('changing the select updates the persisted preference and emits subtitlechange', () => {
    const player = makePlayer();
    player.tracks = [{ src: 'en.vtt', srclang: 'en', label: 'English' }];
    let detail: any;
    player.addEventListener('change', (e: CustomEvent) => {
      if (e.detail.type === 'subtitlechange') detail = e.detail;
    });

    player.changeSubtitleTrack(new CustomEvent('change', { detail: { value: 'en' } }));

    expect(detail?.data).toBe('en');
    expect(loadPreferredSubtitleLanguage()).toBe('en');
    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    expect(select?.getAttribute('value')).toBe('en');
  });

  it('selecting Off persists as off and shows the Off value on the select', () => {
    const player = makePlayer();
    player.tracks = [{ src: 'en.vtt', srclang: 'en', label: 'English', default: true }];

    player.changeSubtitleTrack(new CustomEvent('change', { detail: { value: 'Off' } }));

    expect(loadPreferredSubtitleLanguage()).toBe('off');
    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    expect(select?.getAttribute('value')).toBe('Off');
  });
});
