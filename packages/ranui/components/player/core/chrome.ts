import { addClassToElement, range, removeClassToElement } from 'ranuts/utils';
import { isActivationKey } from '@/utils/a11y';
import { PLAY_STATE_LIST } from './constants';
import { exitDocumentFullscreen, requestElementFullscreen } from './fullscreen';
import { shouldResumePlayback } from './playback';
import type { PlaybackSnapshot } from './playback';
import { exitPip, isPipSupported, requestPip } from './pip';
import { isRemotePlaybackSupported, requestRemotePlayback } from './remote-playback';
import { maybeSaveResumePosition } from './resume';
import type { PlayerContextState, PlayerRuntimeState } from './state';

export interface PlayerChromeRefs {
  player: HTMLDivElement;
  playerBtn: HTMLDivElement;
  playerController: HTMLDivElement;
  playControllerBottomVolume: HTMLDivElement;
  playControllerBottomPip: HTMLDivElement;
  playControllerBottomRemote: HTMLDivElement;
}

export type PlayerChromeRuntimeState = Pick<PlayerRuntimeState<PlaybackSnapshot>, 'isBuffering' | 'controllerBarTimeId'>;

export interface PlayerChromeDeps {
  refs: PlayerChromeRefs;
  state: PlayerChromeRuntimeState;
  ctx: Pick<PlayerContextState, 'currentState' | 'fullScreen' | 'playbackRate' | 'volume' | 'duration' | 'currentTime'>;
  getVideo: () => HTMLVideoElement | undefined;
  isDebug: () => boolean;
  play: () => void;
  pause: () => void;
  setCurrentTime: (n: number) => number;
  setPlaybackRate: (n: number) => number;
  setVolume: (n: number) => number;
  safePlay: (showLoading: boolean) => void;
  change: (name: string, value: unknown) => void;
  updateCurrentProgress: () => void;
  /**
   * Self-forwarding entries for this module's own `resize`/`customRequestFullscreen`/
   * `customExitFullscreen` — `openFullScreen`/`SpaceKeyDown` call these through the
   * RanPlayer wrapper (`this.resize()` etc.) instead of the local closures below, so a
   * `vi.spyOn(player, 'resize')` set up after construction still intercepts them (a bare
   * local reference would forever point at the pre-spy original).
   */
  resize: () => void;
  customRequestFullscreen: () => Promise<void>;
  customExitFullscreen: () => Promise<void>;
  getVolumeMemo: () => number | undefined;
  setVolumeMemo: (n: number) => void;
  rememberPosition: () => boolean;
  getSrc: () => string;
  getCurrentTime: () => number;
}

export interface PlayerChromeHandlers {
  setLoadingState: (loading: boolean) => void;
  showControllerBar: (e?: MouseEvent) => void;
  customRequestFullscreen: () => Promise<void>;
  customExitFullscreen: () => Promise<void>;
  openFullScreen: () => void;
  dispatchClickPlayerContainerAction: (e: Event) => void;
  dispatchClickPlayerBtnAction: (e: Event) => void;
  SpaceKeyDown: (e: KeyboardEvent) => void;
  onPlayBtnKeydown: (e: KeyboardEvent) => void;
  onFullScreenKeydown: (e: KeyboardEvent) => void;
  changeVolumeProgress: (e: Event) => void;
  changePlayerVolume: () => void;
  changeSpeed: (e: Event) => void;
  syncPipButtonVisibility: () => void;
  togglePip: () => void;
  syncRemoteButtonVisibility: () => void;
  showRemotePlaybackPicker: () => void;
  resize: () => void;
  onVisibilityChange: () => void;
  fullScreenChange: () => void;
}

/**
 * Control-bar chrome: play/pause dispatch, keyboard shortcuts, volume, speed,
 * fullscreen, Picture-in-Picture, the auto-hiding controller bar, and the
 * buffering class.
 */
export function createChromeHandlers(deps: PlayerChromeDeps): PlayerChromeHandlers {
  const { refs, state, ctx } = deps;

  const setLoadingState = (loading: boolean): void => {
    if (state.isBuffering === loading) return;
    state.isBuffering = loading;
    if (loading) {
      addClassToElement(refs.player, 'ran-player-buffering');
      return;
    }
    removeClassToElement(refs.player, 'ran-player-buffering');
  };

  // The speed/quality/subtitle `<r-select>` dropdown panels aren't
  // descendants of `.ran-player-controller` — they portal straight into
  // `.ran-player` via `getPopupContainerId` — so hiding the controller's
  // opacity has no effect on them at all. Without this check, a user who
  // opens one of those menus and then holds the mouse still for 2s (reading
  // the options — an entirely normal thing to do) sees the *bar* fade out
  // from under the *menu*, leaving the panel floating alone with no visible
  // trigger beneath it. `r-select` reflects its open state as a real
  // `aria-expanded` attribute on every open/close path (selecting an option,
  // clicking away, Escape) regardless of what triggered it, so checking it
  // here covers all of them.
  const isAnySelectDropdownOpen = (): boolean => !!refs.player.querySelector('r-select[aria-expanded="true"]');

  const scheduleControllerBarHide = (): void => {
    state.controllerBarTimeId = setTimeout(() => {
      if (isAnySelectDropdownOpen()) {
        // Still open — don't give up on hiding, just recheck shortly. This
        // also covers a mouse that never moves again after the menu closes,
        // which the normal mousemove-driven re-arm below wouldn't catch.
        scheduleControllerBarHide();
        return;
      }
      refs.playerController.style.setProperty('opacity', '0');
      clearTimeout(state.controllerBarTimeId);
      state.controllerBarTimeId = undefined;
    }, 2000);
  };

  const showControllerBar = (e?: MouseEvent): void => {
    if (e) {
      const dom = e.target as HTMLElement;
      if (dom?.classList.value.includes('ran-player-controller')) {
        refs.playerController.style.setProperty('opacity', '1');
        if (state.controllerBarTimeId) {
          clearTimeout(state.controllerBarTimeId);
          state.controllerBarTimeId = undefined;
        }
        return;
      }
    }
    if (PLAY_STATE_LIST.includes(ctx.currentState)) {
      refs.playerController.style.setProperty('opacity', '1');
      if (state.controllerBarTimeId) {
        clearTimeout(state.controllerBarTimeId);
        state.controllerBarTimeId = undefined;
      }
      scheduleControllerBarHide();
    } else {
      refs.playerController.style.setProperty('opacity', '1');
      if (state.controllerBarTimeId) {
        clearTimeout(state.controllerBarTimeId);
        state.controllerBarTimeId = undefined;
      }
    }
  };

  const dispatchClickAction = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    if (PLAY_STATE_LIST.includes(ctx.currentState)) {
      deps.pause();
      refs.playerBtn.style.setProperty('display', 'block');
    } else {
      deps.play();
      refs.playerBtn.style.setProperty('display', 'none');
    }
  };

  const customRequestFullscreen = (): Promise<void> => requestElementFullscreen(refs.player);
  const customExitFullscreen = (): Promise<void> => exitDocumentFullscreen(document);

  const resize = (): void => {
    const video = deps.getVideo();
    if (video) {
      const { width, height } = refs.player.getBoundingClientRect();
      video.style.setProperty('width', `${width}px`);
      video.style.setProperty('height', `${height}px`);
      if (document.body.clientWidth < 500) {
        refs.playControllerBottomVolume.style.setProperty('display', 'none');
      } else {
        refs.playControllerBottomVolume.style.setProperty('display', 'flex');
      }
    }
    deps.updateCurrentProgress();
  };

  const openFullScreen = (): void => {
    if (!ctx.fullScreen) {
      deps
        .customRequestFullscreen()
        .then(() => {
          deps.resize();
          ctx.fullScreen = true;
        })
        .catch((error) => {
          if (deps.isDebug()) console.warn(`full screen error:${error}`);
        });
    } else {
      deps
        .customExitFullscreen()
        .then(() => {
          deps.resize();
          ctx.fullScreen = false;
        })
        .catch((error) => {
          if (deps.isDebug()) console.warn(`exit full screen error:${error}`);
        });
    }
  };

  return {
    setLoadingState,
    showControllerBar,
    customRequestFullscreen,
    customExitFullscreen,
    openFullScreen,
    resize,
    // Click on the video itself, and click on the bottom-bar play/pause
    // button, currently do the exact same thing — kept as two separate
    // exported methods (matching the two separate click targets in
    // core/controller.ts) rather than merged, since that's how index.ts
    // originally exposed them and tests call both by name.
    dispatchClickPlayerContainerAction: dispatchClickAction,
    dispatchClickPlayerBtnAction: dispatchClickAction,
    SpaceKeyDown: (e: KeyboardEvent): void => {
      const { currentTime, duration } = ctx;
      if (e.code === 'Space') {
        dispatchClickAction(e);
      }
      if (e.code === 'Escape') {
        deps
          .customExitFullscreen()
          .then(() => {
            ctx.fullScreen = false;
          })
          .catch((error) => {
            if (deps.isDebug()) console.warn(`exit full screen error:${error}`);
          });
      }
      if (e.code === 'ArrowLeft') {
        const time = range(currentTime - 5, 0, duration);
        deps.setCurrentTime(time);
        deps.play();
      }
      if (e.code === 'ArrowRight') {
        const time = range(currentTime + 5, 0, duration);
        deps.setCurrentTime(time);
        deps.play();
      }
    },
    /**
     * Enter/Space activation for the play/pause div — it has no native button
     * semantics, so nothing fires a `click` from the keyboard without this.
     * `dispatchClickPlayerBtnAction` already stops propagation, which also
     * keeps the host's own Space-to-toggle-play handler (`SpaceKeyDown`) from
     * double-firing on the same keystroke.
     */
    onPlayBtnKeydown: (e: KeyboardEvent): void => {
      if (!isActivationKey(e)) return;
      dispatchClickAction(e);
    },
    /**
     * Enter/Space activation for the fullscreen div. Stops propagation itself
     * (unlike `dispatchClickPlayerBtnAction`, `openFullScreen` takes no event) —
     * otherwise Space here would bubble to the host and also toggle play/pause.
     */
    onFullScreenKeydown: (e: KeyboardEvent): void => {
      if (!isActivationKey(e)) return;
      e.preventDefault();
      e.stopPropagation();
      openFullScreen();
    },
    changeVolumeProgress: (e: Event): void => {
      if (deps.getVideo()) {
        const volume = (e as CustomEvent).detail.value;
        deps.setVolume(volume);
        deps.change('volume', volume);
        if (volume > 0) {
          deps.setVolumeMemo(volume);
        }
      }
    },
    changePlayerVolume: (): void => {
      if (!deps.getVideo()) return;
      const { volume } = ctx;
      if (volume > 0) {
        deps.setVolume(0);
        deps.change('volume', 0);
      } else {
        const restoredVolume = deps.getVolumeMemo() || 50;
        deps.setVolume(restoredVolume);
        deps.change('volume', restoredVolume);
      }
    },
    changeSpeed: (e: Event): void => {
      const speed = Number((e as CustomEvent).detail.value) || 1;
      const shouldResume = shouldResumePlayback(deps.getVideo());
      ctx.playbackRate = speed;
      deps.change('speed', speed);
      deps.setPlaybackRate(speed);
      if (shouldResume) {
        deps.safePlay(false);
      }
    },
    /**
     * PiP button only renders when the browser actually supports it —
     * progressive enhancement, not a dead button. `isPipSupported()` needs
     * `document`, so it's only meaningful from `connectedCallback` onward.
     */
    syncPipButtonVisibility: (): void => {
      const supported = isPipSupported(deps.getVideo());
      refs.playControllerBottomPip.classList.toggle('ran-player-controller-bottom-right-pip-hidden', !supported);
    },
    togglePip: (): void => {
      const video = deps.getVideo();
      if (!video) return;
      if (document.pictureInPictureElement === video) {
        exitPip().catch((error) => {
          if (deps.isDebug()) console.warn(`exit picture-in-picture error:${error}`);
        });
        return;
      }
      requestPip(video).catch((error) => {
        if (deps.isDebug()) console.warn(`request picture-in-picture error:${error}`);
      });
    },
    /**
     * Cast/AirPlay button — same progressive-enhancement rule as PiP: only
     * rendered when at least one of the Remote Playback API or
     * `webkitShowPlaybackTargetPicker` is actually available.
     */
    syncRemoteButtonVisibility: (): void => {
      const supported = isRemotePlaybackSupported(deps.getVideo());
      refs.playControllerBottomRemote.classList.toggle('ran-player-controller-bottom-right-remote-hidden', !supported);
    },
    showRemotePlaybackPicker: (): void => {
      const video = deps.getVideo();
      if (!video) return;
      requestRemotePlayback(video).catch((error) => {
        if (deps.isDebug()) console.warn(`request remote playback error:${error}`);
      });
    },
    /**
     * Second trigger for resume-position saving — `pause` only covers a
     * manual pause; navigating away or closing the tab often doesn't fire
     * that first. `visibilitychange` is more reliable than `beforeunload`
     * (better mobile support; MDN now recommends it for "save state before
     * the page loses focus").
     */
    onVisibilityChange: (): void => {
      if (document.visibilityState === 'hidden') {
        maybeSaveResumePosition({
          rememberPosition: deps.rememberPosition(),
          src: deps.getSrc(),
          currentTime: deps.getCurrentTime(),
        });
      }
    },
    fullScreenChange: (): void => {
      if (document.fullscreenElement?.classList.contains('ran-player')) {
        deps.change('fullscreen', true);
        ctx.fullScreen = true;
      } else {
        deps.change('fullscreen', false);
        ctx.fullScreen = false;
      }
    },
  };
}
