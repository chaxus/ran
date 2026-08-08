import { View } from '@/utils/builder';
import { buildManifestLevels } from './levels';
import {
  applyTracksToVideo,
  loadPreferredSubtitleLanguage,
  savePreferredSubtitleLanguage,
  setActiveSubtitleLanguage,
} from './tracks';
import type { RanPlayer, Level } from '../index';

export interface PlayerSourceHandlers {
  changeClarity: (e: Event) => void;
  createClaritySelect: () => void;
  manifestLoaded: (type: string, data: { levels: Level[]; url: string }) => void;
  applyTracks: () => void;
  setSubtitleLanguage: (lang: string) => void;
  changeSubtitleTrack: (e: Event) => void;
  createSubtitleSelect: () => void;
  hlsError: (event: unknown, data: unknown) => void;
  showErrorModal: (message: string) => void;
}

/**
 * Everything about "which rendition/track is active": HLS clarity switching,
 * subtitle/CC tracks, the HLS manifest callback, and the error+retry dialog.
 * Moved out of `index.ts` to keep it under the repo's 800-line-per-file limit
 * — see `core/media-handlers.ts`'s file-level comment for why these are
 * closures over `player` and why the factory must be called exactly once (in
 * the constructor).
 */
export function createSourceHandlers(player: RanPlayer): PlayerSourceHandlers {
  const createClaritySelect = (): void => {
    const { levels } = player.ctx;
    player._playControllerBottomClarity.innerHTML = '';
    if (levels.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    levels.forEach((item) => {
      const { name, url } = item;
      if (!name || !url) return;
      player.ctx.levelMap.set(name, url);
      const option = View('r-option').attr('value', name).text(name).build() as HTMLElement;
      Fragment.appendChild(option);
    });
    const id = player._player.getAttribute('id');
    const select = View('r-select')
      .attr('value', player.ctx.clarity || 'Auto')
      .attr('type', 'text')
      .attr('trigger', 'hover,click')
      .attr('placement', 'top')
      .attr('dropdownclass', 'video-clarity-dropdown')
      .aria('label', 'Video quality')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', player.changeClarity);
    player._playControllerBottomClarity.appendChild(select);
  };

  const changeClarity = (e: Event): void => {
    player.ctx.clarity = (e as CustomEvent).detail.value;
    const url = player.ctx.levelMap.get((e as CustomEvent).detail.value);
    if (url && player._hls) {
      player._pendingPlaybackRestore = player.capturePlaybackSnapshot();
      player._isSwitchingSource = true;
      player.setLoadingState(true);
      player._hls.loadSource(url);
      player._hls.startLoad();
    }
  };

  const setSubtitleLanguage = (lang: string): void => {
    if (!player._video) return;
    setActiveSubtitleLanguage(player._video.textTracks, lang);
    const select = player._playControllerBottomSubtitle.querySelector('r-select');
    if (select) select.setAttribute('value', lang === 'off' ? 'Off' : lang);
  };

  const changeSubtitleTrack = (e: Event): void => {
    const lang = (e as CustomEvent).detail.value === 'Off' ? 'off' : (e as CustomEvent).detail.value;
    setSubtitleLanguage(lang);
    savePreferredSubtitleLanguage(lang);
    player.change('subtitlechange', lang);
  };

  /**
   * Mirrors `createClaritySelect`'s structure exactly — an `<r-select>` with
   * "Off" + one option per track, no separate CC toggle button ("Off" is the
   * off switch, same interaction model as clarity).
   */
  const createSubtitleSelect = (): void => {
    player._playControllerBottomSubtitle.innerHTML = '';
    if (player._tracks.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    Fragment.appendChild(View('r-option').attr('value', 'Off').text('Off').build() as HTMLElement);
    player._tracks.forEach((track) => {
      const option = View('r-option').attr('value', track.srclang).text(track.label).build() as HTMLElement;
      Fragment.appendChild(option);
    });
    const id = player._player.getAttribute('id');
    const select = View('r-select')
      .attr('value', 'Off')
      .attr('type', 'text')
      .attr('trigger', 'hover,click')
      .attr('placement', 'top')
      .attr('dropdownclass', 'video-subtitle-dropdown')
      .aria('label', 'Subtitles')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', player.changeSubtitleTrack);
    player._playControllerBottomSubtitle.appendChild(select);
  };

  /**
   * Applies `player._tracks` to the current `_video` — rebuilds the `<track>`
   * elements, rebuilds the language-picker select, then picks an initial
   * active language from either the remembered preference or whichever
   * track config has `default: true`. Called from both `updatePlayer()` (new
   * video) and the `tracks` setter (live update on an existing video).
   */
  const applyTracks = (): void => {
    if (!player._video) return;
    applyTracksToVideo(player._video, player._tracks);
    createSubtitleSelect();
    if (player._tracks.length <= 0) return;
    const preferred = loadPreferredSubtitleLanguage();
    const preferredAvailable = preferred !== 'off' && player._tracks.some((track) => track.srclang === preferred);
    const fallbackDefault = player._tracks.find((track) => track.default);
    const initialLang = preferredAvailable ? preferred : fallbackDefault?.srclang || 'off';
    setSubtitleLanguage(initialLang);
  };

  const manifestLoaded = (type: string, data: { levels: Level[]; url: string }): void => {
    if (type === 'hlsManifestLoaded') {
      const { url, levels = [] } = data;
      if (levels.length <= 0) return;
      const normalized = buildManifestLevels({ levels, manifestUrl: url, existingLevelMap: player.ctx.levelMap });
      player.ctx.levels.push(...normalized.levels);
      normalized.levelMapEntries.forEach(([name, levelUrl]) => player.ctx.levelMap.set(name, levelUrl));
      player.ctx.url = url;
      createClaritySelect();
      player.change('hlsManifestLoaded', { data });
    }
  };

  const hlsError = (event: unknown, data: unknown): void => {
    player._isSwitchingSource = false;
    player.setLoadingState(false);
    player.change('hlsError', { event, data });
    if (player._video) {
      player._video.src = player.src;
    }
    // Non-fatal hls.js errors are already handled by the library's own internal
    // recovery — only a fatal error means playback has actually stopped and is
    // worth interrupting the user for.
    if ((data as { fatal?: boolean } | null)?.fatal) {
      showErrorModal('The stream could not be loaded.');
    }
  };

  /**
   * Default-on error + retry dialog. `disable-error-modal` opts out for
   * consumers who want to build their own UI on the `change`/`hlsError`
   * events instead. `r-modal` is lazy-loaded — nothing is fetched until an
   * error actually happens, same recipe as r-mermaid's fullscreen lightbox
   * (`import('@/components/modal')`).
   */
  const showErrorModal = (message: string): void => {
    if (player.disableErrorModal || player._isShowingErrorModal) return;
    player._isShowingErrorModal = true;
    import('@/components/modal')
      .then(({ default: Modal }) => {
        return Modal.error({
          title: 'Playback failed',
          content: message,
          okText: 'Retry',
          onConfirm: () => {
            player._isShowingErrorModal = false;
            player.updatePlayer();
          },
        });
      })
      .then(() => {
        player._isShowingErrorModal = false;
      });
  };

  return {
    changeClarity,
    createClaritySelect,
    manifestLoaded,
    applyTracks,
    setSubtitleLanguage,
    changeSubtitleTrack,
    createSubtitleSelect,
    hlsError,
    showErrorModal,
  };
}
