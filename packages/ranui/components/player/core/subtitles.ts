import { View } from '@/utils/builder';
import {
  applyTracksToVideo,
  loadPreferredSubtitleLanguage,
  savePreferredSubtitleLanguage,
  setActiveSubtitleLanguage,
  type PlayerTrackConfig,
} from './tracks';

export interface PlayerSubtitleRefs {
  subtitleContainer: HTMLElement;
  player: HTMLDivElement;
}

export interface PlayerSubtitleDeps {
  refs: PlayerSubtitleRefs;
  getPlayerId: () => string | null;
  getVideo: () => HTMLVideoElement | undefined;
  getTracks: () => PlayerTrackConfig[];
  change: (name: string, value: unknown) => void;
}

export interface PlayerSubtitleHandlers {
  applyTracks: () => void;
  setSubtitleLanguage: (lang: string) => void;
  changeSubtitleTrack: (e: Event) => void;
  createSubtitleSelect: () => void;
}

/** Engine-independent — untouched by Phase 2's HLS/DASH/FLV adapter refactor, unlike `core/clarity.ts`. */
export function createSubtitleHandlers(deps: PlayerSubtitleDeps): PlayerSubtitleHandlers {
  const { refs } = deps;

  const setSubtitleLanguage = (lang: string): void => {
    const video = deps.getVideo();
    if (!video) return;
    setActiveSubtitleLanguage(video.textTracks, lang);
    const select = refs.subtitleContainer.querySelector('r-select');
    if (select) select.setAttribute('value', lang === 'off' ? 'Off' : lang);
  };

  const changeSubtitleTrack = (e: Event): void => {
    const lang = (e as CustomEvent).detail.value === 'Off' ? 'off' : (e as CustomEvent).detail.value;
    setSubtitleLanguage(lang);
    savePreferredSubtitleLanguage(lang);
    deps.change('subtitlechange', lang);
  };

  /**
   * Mirrors `core/clarity.ts`'s `createClaritySelect` structure exactly — an
   * `<r-select>` with "Off" + one option per track, no separate CC toggle
   * button ("Off" is the off switch, same interaction model as clarity).
   */
  const createSubtitleSelect = (): void => {
    refs.subtitleContainer.innerHTML = '';
    const tracks = deps.getTracks();
    if (tracks.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    Fragment.appendChild(View('r-option').attr('value', 'Off').text('Off').build() as HTMLElement);
    tracks.forEach((track) => {
      const option = View('r-option').attr('value', track.srclang).text(track.label).build() as HTMLElement;
      Fragment.appendChild(option);
    });
    const id = deps.getPlayerId();
    const select = View('r-select')
      .attr('value', 'Off')
      .attr('type', 'text')
      .attr('trigger', 'hover,click')
      .attr('placement', 'top')
      .attr('dropdownclass', 'video-subtitle-dropdown')
      .aria('label', 'Subtitles')
      .attr('title', 'Subtitles')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', changeSubtitleTrack);
    refs.subtitleContainer.appendChild(select);
  };

  /**
   * Applies the current track config to `_video` — rebuilds the `<track>`
   * elements, rebuilds the language-picker select, then picks an initial
   * active language from either the remembered preference or whichever track
   * config has `default: true`.
   */
  const applyTracks = (): void => {
    const video = deps.getVideo();
    if (!video) return;
    const tracks = deps.getTracks();
    applyTracksToVideo(video, tracks);
    createSubtitleSelect();
    if (tracks.length <= 0) return;
    const preferred = loadPreferredSubtitleLanguage();
    const preferredAvailable = preferred !== 'off' && tracks.some((track) => track.srclang === preferred);
    const fallbackDefault = tracks.find((track) => track.default);
    const initialLang = preferredAvailable ? preferred : fallbackDefault?.srclang || 'off';
    setSubtitleLanguage(initialLang);
  };

  return { applyTracks, setSubtitleLanguage, changeSubtitleTrack, createSubtitleSelect };
}
