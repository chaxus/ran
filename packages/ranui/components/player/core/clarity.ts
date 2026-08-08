import { View } from '@/utils/builder';
import { buildManifestLevels, type ManifestLevelLike } from './levels';
import type { PlaybackSnapshot } from './playback';
import type { PlayerRuntimeState } from './state';

export interface PlayerClarityRefs {
  clarityContainer: HTMLElement;
  player: HTMLDivElement;
}

export type PlayerClarityRuntimeState = Pick<PlayerRuntimeState<PlaybackSnapshot>, 'isSwitchingSource' | 'pendingPlaybackRestore'>;

export interface PlayerClarityCtx<TLevel extends ManifestLevelLike = ManifestLevelLike> {
  levels: TLevel[];
  levelMap: Map<string, string>;
  clarity: string;
  url: string;
}

export interface HlsLoadable {
  loadSource: (src: string) => void;
  startLoad(): () => void;
}

export interface PlayerClarityDeps<TLevel extends ManifestLevelLike = ManifestLevelLike> {
  refs: PlayerClarityRefs;
  state: PlayerClarityRuntimeState;
  ctx: PlayerClarityCtx<TLevel>;
  getVideo: () => HTMLVideoElement | undefined;
  getHls: () => HlsLoadable | undefined;
  getSrc: () => string;
  capturePlaybackSnapshot: () => PlaybackSnapshot;
  setLoadingState: (loading: boolean) => void;
  change: (name: string, value: unknown) => void;
  showErrorModal: (message: string) => void;
}

export interface PlayerClarityHandlers<TLevel extends ManifestLevelLike = ManifestLevelLike> {
  changeClarity: (e: Event) => void;
  createClaritySelect: () => void;
  manifestLoaded: (type: string, data: { levels: TLevel[]; url: string }) => void;
  hlsError: (event: unknown, data: unknown) => void;
}

/**
 * HLS-shaped rendition switching — the exact surface `docs/PLAYER_ROADMAP.md`
 * Phase 2's engine-agnostic adapter refactor rewrites (`loadSource(url)`
 * reload → `setQualityFor`/`setQuality(id)`). Kept separate from
 * `core/subtitles.ts` so that refactor only touches this one file.
 */
export function createClarityHandlers<TLevel extends ManifestLevelLike = ManifestLevelLike>(
  deps: PlayerClarityDeps<TLevel>,
): PlayerClarityHandlers<TLevel> {
  const { refs, state, ctx } = deps;

  const createClaritySelect = (): void => {
    const { levels } = ctx;
    refs.clarityContainer.innerHTML = '';
    if (levels.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    levels.forEach((item) => {
      const { name, url } = item;
      if (!name || !url) return;
      ctx.levelMap.set(name, url);
      const option = View('r-option').attr('value', name).text(name).build() as HTMLElement;
      Fragment.appendChild(option);
    });
    const id = refs.player.getAttribute('id');
    const select = View('r-select')
      .attr('value', ctx.clarity || 'Auto')
      .attr('type', 'text')
      .attr('trigger', 'hover,click')
      .attr('placement', 'top')
      .attr('dropdownclass', 'video-clarity-dropdown')
      .aria('label', 'Video quality')
      .children(Fragment as unknown as HTMLElement)
      .build() as HTMLElement;

    if (id) select.setAttribute('getPopupContainerId', id);
    select.addEventListener('change', changeClarity);
    refs.clarityContainer.appendChild(select);
  };

  const changeClarity = (e: Event): void => {
    ctx.clarity = (e as CustomEvent).detail.value;
    const url = ctx.levelMap.get((e as CustomEvent).detail.value);
    const hls = deps.getHls();
    if (url && hls) {
      state.pendingPlaybackRestore = deps.capturePlaybackSnapshot();
      state.isSwitchingSource = true;
      deps.setLoadingState(true);
      hls.loadSource(url);
      hls.startLoad();
    }
  };

  const manifestLoaded = (type: string, data: { levels: TLevel[]; url: string }): void => {
    if (type === 'hlsManifestLoaded') {
      const { url, levels = [] } = data;
      if (levels.length <= 0) return;
      const normalized = buildManifestLevels<TLevel>({ levels, manifestUrl: url, existingLevelMap: ctx.levelMap });
      ctx.levels.push(...normalized.levels);
      normalized.levelMapEntries.forEach(([name, levelUrl]) => ctx.levelMap.set(name, levelUrl));
      ctx.url = url;
      createClaritySelect();
      deps.change('hlsManifestLoaded', { data });
    }
  };

  const hlsError = (event: unknown, data: unknown): void => {
    state.isSwitchingSource = false;
    deps.setLoadingState(false);
    deps.change('hlsError', { event, data });
    const video = deps.getVideo();
    if (video) {
      video.src = deps.getSrc();
    }
    // Non-fatal hls.js errors are already handled by the library's own internal
    // recovery — only a fatal error means playback has actually stopped and is
    // worth interrupting the user for.
    if ((data as { fatal?: boolean } | null)?.fatal) {
      deps.showErrorModal('The stream could not be loaded.');
    }
  };

  return { changeClarity, createClaritySelect, manifestLoaded, hlsError };
}
