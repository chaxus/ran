import { View } from '@/utils/builder';
import type { EngineAdapter, EngineQualityLevel } from './adapters/types';
import type { PlaybackSnapshot } from './playback';
import type { PlayerRuntimeState } from './state';

export interface PlayerClarityRefs {
  clarityContainer: HTMLElement;
  player: HTMLDivElement;
}

export type PlayerClarityRuntimeState = Pick<PlayerRuntimeState<PlaybackSnapshot>, 'isSwitchingSource' | 'pendingPlaybackRestore'>;

export interface PlayerClarityCtx<TLevel extends EngineQualityLevel = EngineQualityLevel> {
  levels: TLevel[];
  levelMap: Map<string, string>;
  clarity: string;
}

export interface PlayerClarityDeps<TLevel extends EngineQualityLevel = EngineQualityLevel> {
  refs: PlayerClarityRefs;
  state: PlayerClarityRuntimeState;
  ctx: PlayerClarityCtx<TLevel>;
  getEngine: () => EngineAdapter | undefined;
  getVideo: () => HTMLVideoElement | undefined;
  getSrc: () => string;
  capturePlaybackSnapshot: () => PlaybackSnapshot;
  setLoadingState: (loading: boolean) => void;
  change: (name: string, value: unknown) => void;
  showErrorModal: (message: string) => void;
  /**
   * Self-forwarding entry for this module's own `createClaritySelect` —
   * `manifestLoaded` calls it through the RanPlayer wrapper instead of the
   * local closure below, so a `vi.spyOn(player, 'createClaritySelect')` set
   * up after construction still intercepts it.
   */
  createClaritySelect: () => void;
}

export interface PlayerClarityHandlers<TLevel extends EngineQualityLevel = EngineQualityLevel> {
  changeClarity: (e: Event) => void;
  createClaritySelect: () => void;
  manifestLoaded: (levels: TLevel[]) => void;
  hlsError: (payload: { fatal: boolean; detail: unknown }) => void;
}

/**
 * Rendition/quality switching, generalized across whichever `EngineAdapter`
 * is currently loaded (`docs/PLAYER_ROADMAP.md` Phase 2) — no engine-specific
 * branching lives here, that's the adapter's job (`core/adapters/*.ts`). Kept
 * separate from `core/subtitles.ts` since subtitles are engine-independent.
 */
export function createClarityHandlers<TLevel extends EngineQualityLevel = EngineQualityLevel>(
  deps: PlayerClarityDeps<TLevel>,
): PlayerClarityHandlers<TLevel> {
  const { refs, state, ctx } = deps;

  const createClaritySelect = (): void => {
    const { levels } = ctx;
    refs.clarityContainer.innerHTML = '';
    if (levels.length <= 0) return;
    const Fragment = document.createDocumentFragment();
    levels.forEach((item) => {
      const { name, id } = item;
      if (!name || !id) return;
      ctx.levelMap.set(name, id);
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
    const id = ctx.levelMap.get((e as CustomEvent).detail.value);
    const engine = deps.getEngine();
    if (!id || !engine) return;
    if (engine.reloadsOnQualityChange) {
      state.pendingPlaybackRestore = deps.capturePlaybackSnapshot();
      state.isSwitchingSource = true;
      deps.setLoadingState(true);
    }
    engine.setQuality(id);
    deps.change('qualityswitch', { level: ctx.clarity });
  };

  const manifestLoaded = (levels: TLevel[]): void => {
    if (levels.length <= 0) return;
    ctx.levels = levels;
    ctx.levelMap = new Map(levels.map((level) => [level.name, level.id]));
    deps.createClaritySelect();
    deps.change('levelsready', { levels });
  };

  const hlsError = (payload: { fatal: boolean; detail: unknown }): void => {
    state.isSwitchingSource = false;
    deps.setLoadingState(false);
    deps.change('sourceerror', payload);
    const video = deps.getVideo();
    if (video) {
      video.src = deps.getSrc();
    }
    // Non-fatal engine errors are already handled by the library's own internal
    // recovery — only a fatal error means playback has actually stopped and is
    // worth interrupting the user for.
    if (payload.fatal) {
      deps.showErrorModal('The stream could not be loaded.');
    }
  };

  return { changeClarity, createClaritySelect, manifestLoaded, hlsError };
}
