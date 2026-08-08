import { addClassToElement, range, removeClassToElement } from 'ranuts/utils';
import { isActivationKey } from '@/utils/a11y';
import { PLAY_STATE_LIST } from './constants';
import { exitDocumentFullscreen, requestElementFullscreen } from './fullscreen';
import { shouldResumePlayback } from './playback';
import { exitPip, isPipSupported, requestPip } from './pip';
import { saveResumePosition } from './resume';
import type { RanPlayer } from '../index';

export interface PlayerChromeHandlers {
  dispatchClickPlayerContainerAction: (e: Event) => void;
  SpaceKeyDown: (e: KeyboardEvent) => void;
  dispatchClickPlayerBtnAction: (e: Event) => void;
  onPlayBtnKeydown: (e: KeyboardEvent) => void;
  onFullScreenKeydown: (e: KeyboardEvent) => void;
  changeVolumeProgress: (e: Event) => void;
  changePlayerVolume: () => void;
  changeSpeed: (e: Event) => void;
  customRequestFullscreen: () => Promise<void>;
  customExitFullscreen: () => Promise<void>;
  openFullScreen: () => void;
  syncPipButtonVisibility: () => void;
  togglePip: () => void;
  fullScreenChange: () => void;
  onVisibilityChange: () => void;
  resize: () => void;
  showControllerBar: (e?: MouseEvent) => void;
  setLoadingState: (loading: boolean) => void;
}

/**
 * Control-bar chrome: play/pause dispatch, keyboard shortcuts, volume, speed,
 * fullscreen, Picture-in-Picture, the auto-hiding controller bar, and the
 * buffering class. Moved out of `index.ts` to keep it under the repo's
 * 800-line-per-file limit — see `core/media-handlers.ts`'s file-level comment
 * for why these are closures over `player` and why the factory must be called
 * exactly once (in the constructor).
 */
export function createChromeHandlers(player: RanPlayer): PlayerChromeHandlers {
  const setLoadingState = (loading: boolean): void => {
    if (player._isBuffering === loading) return;
    player._isBuffering = loading;
    if (loading) {
      addClassToElement(player._player, 'ran-player-buffering');
      return;
    }
    removeClassToElement(player._player, 'ran-player-buffering');
  };

  const showControllerBar = (e?: MouseEvent): void => {
    if (e) {
      const dom = e.target as HTMLElement;
      if (dom?.classList.value.includes('ran-player-controller')) {
        player._playerController.style.setProperty('opacity', '1');
        if (player.controllerBarTimeId) {
          clearTimeout(player.controllerBarTimeId);
          player.controllerBarTimeId = undefined;
        }
        return;
      }
    }
    if (PLAY_STATE_LIST.includes(player.ctx.currentState)) {
      player._playerController.style.setProperty('opacity', '1');
      if (player.controllerBarTimeId) {
        clearTimeout(player.controllerBarTimeId);
        player.controllerBarTimeId = undefined;
      }
      player.controllerBarTimeId = setTimeout(() => {
        player._playerController.style.setProperty('opacity', '0');
        clearTimeout(player.controllerBarTimeId);
        player.controllerBarTimeId = undefined;
      }, 2000);
    } else {
      player._playerController.style.setProperty('opacity', '1');
      if (player.controllerBarTimeId) {
        clearTimeout(player.controllerBarTimeId);
        player.controllerBarTimeId = undefined;
      }
    }
  };

  const dispatchClickAction = (e: Event): void => {
    e.stopPropagation();
    e.preventDefault();
    if (PLAY_STATE_LIST.includes(player.ctx.currentState)) {
      player.pause();
      player._playerBtn.style.setProperty('display', 'block');
    } else {
      player.play();
      player._playerBtn.style.setProperty('display', 'none');
    }
  };

  const customRequestFullscreen = (): Promise<void> => requestElementFullscreen(player._player);
  const customExitFullscreen = (): Promise<void> => exitDocumentFullscreen(document);

  const openFullScreen = (): void => {
    if (!player.ctx.fullScreen) {
      customRequestFullscreen()
        .then(() => {
          player.resize();
          player.ctx.fullScreen = true;
        })
        .catch((error) => {
          if (player.debug) console.warn(`full screen error:${error}`);
        });
    } else {
      customExitFullscreen()
        .then(() => {
          player.resize();
          player.ctx.fullScreen = false;
        })
        .catch((error) => {
          if (player.debug) console.warn(`exit full screen error:${error}`);
        });
    }
  };

  return {
    setLoadingState,
    showControllerBar,
    customRequestFullscreen,
    customExitFullscreen,
    openFullScreen,
    // Click on the video itself, and click on the bottom-bar play/pause
    // button, currently do the exact same thing — kept as two separate
    // exported methods (matching the two separate click targets in
    // core/controller.ts) rather than merged, since that's how index.ts
    // originally exposed them and tests call both by name.
    dispatchClickPlayerContainerAction: dispatchClickAction,
    dispatchClickPlayerBtnAction: dispatchClickAction,
    SpaceKeyDown: (e: KeyboardEvent): void => {
      const { currentTime, duration } = player.ctx;
      if (e.code === 'Space') {
        dispatchClickAction(e);
      }
      if (e.code === 'Escape') {
        customExitFullscreen()
          .then(() => {
            player.ctx.fullScreen = false;
          })
          .catch((error) => {
            if (player.debug) console.warn(`exit full screen error:${error}`);
          });
      }
      if (e.code === 'ArrowLeft') {
        const time = range(currentTime - 5, 0, duration);
        player.setCurrentTime(time);
        player.play();
      }
      if (e.code === 'ArrowRight') {
        const time = range(currentTime + 5, 0, duration);
        player.setCurrentTime(time);
        player.play();
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
      if (player._video) {
        const volume = (e as CustomEvent).detail.value;
        player.setVolume(volume);
        player.change('volume', volume);
        if (volume > 0) {
          player._volume = volume;
        }
      }
    },
    changePlayerVolume: (): void => {
      if (!player._video) return;
      const { volume } = player.ctx;
      if (volume > 0) {
        player.setVolume(0);
        player.change('volume', 0);
      } else {
        const restoredVolume = player._volume || 50;
        player.setVolume(restoredVolume);
        player.change('volume', restoredVolume);
      }
    },
    changeSpeed: (e: Event): void => {
      const speed = Number((e as CustomEvent).detail.value) || 1;
      const shouldResume = shouldResumePlayback(player._video);
      player.ctx.playbackRate = speed;
      player.change('speed', speed);
      player.setPlaybackRate(speed);
      if (shouldResume) {
        player.safePlay(false);
      }
    },
    /**
     * PiP button only renders when the browser actually supports it —
     * progressive enhancement, not a dead button. `isPipSupported()` needs
     * `document`, so it's only meaningful from `connectedCallback` onward.
     */
    syncPipButtonVisibility: (): void => {
      const supported = isPipSupported(player._video);
      player._playControllerBottomPip.classList.toggle('ran-player-controller-bottom-right-pip-hidden', !supported);
    },
    togglePip: (): void => {
      if (!player._video) return;
      if (document.pictureInPictureElement === player._video) {
        exitPip().catch((error) => {
          if (player.debug) console.warn(`exit picture-in-picture error:${error}`);
        });
        return;
      }
      requestPip(player._video).catch((error) => {
        if (player.debug) console.warn(`request picture-in-picture error:${error}`);
      });
    },
    resize: (): void => {
      if (player._video) {
        const { width, height } = player._player.getBoundingClientRect();
        player._video.style.setProperty('width', `${width}px`);
        player._video.style.setProperty('height', `${height}px`);
        if (document.body.clientWidth < 500) {
          player._playControllerBottomVolume.style.setProperty('display', 'none');
        } else {
          player._playControllerBottomVolume.style.setProperty('display', 'flex');
        }
      }
      player.updateCurrentProgress();
    },
    /**
     * Second trigger for resume-position saving — `pause` only covers a
     * manual pause; navigating away or closing the tab often doesn't fire
     * that first. `visibilitychange` is more reliable than `beforeunload`
     * (better mobile support; MDN now recommends it for "save state before
     * the page loses focus").
     */
    onVisibilityChange: (): void => {
      if (player.rememberPosition && document.visibilityState === 'hidden') {
        saveResumePosition(player.src, player.getCurrentTime());
      }
    },
    fullScreenChange: (): void => {
      if (document.fullscreenElement?.classList.contains('ran-player')) {
        player.change('fullscreen', true);
        player.ctx.fullScreen = true;
      } else {
        player.change('fullscreen', false);
        player.ctx.fullScreen = false;
      }
    },
  };
}
