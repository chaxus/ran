import { batch } from '@/utils/index';
import { syncCenterPlayVisibility, shouldSetLoadingOnSeeking, shouldSetLoadingOnWaiting } from './events';
import { describeMediaError } from './error';
import { maybeClearResumePosition, maybeSaveResumePosition, resolveResumeTarget } from './resume';
import type { PlaybackSnapshot } from './playback';
import type { PlayerMediaHandlers } from './media';
import type { PlayerContextState, PlayerRuntimeState } from './state';
import type { PlayerVisualSignals } from './store';

export type PlayerMediaDispatchRuntimeState = Pick<
  PlayerRuntimeState<PlaybackSnapshot>,
  'moveProgress' | 'isSeeking' | 'isSwitchingSource' | 'pendingPlaybackRestore'
>;

export interface PlayerMediaDispatchRefs {
  playerBtn: HTMLElement;
  timeDivide: HTMLElement;
}

export interface PlayerMediaDispatchDeps {
  refs: PlayerMediaDispatchRefs;
  state: PlayerMediaDispatchRuntimeState;
  ctx: Pick<PlayerContextState, 'currentState' | 'duration'>;
  visualSignals: PlayerVisualSignals;
  getVideo: () => HTMLVideoElement | undefined;
  rememberPosition: () => boolean;
  getSrc: () => string;
  change: (name: string, value: unknown) => void;
  setLoadingState: (loading: boolean) => void;
  resize: () => void;
  showErrorModal: (message: string) => void;
  restorePlaybackSnapshot: (snapshot: PlaybackSnapshot) => void;
  setCurrentTime: (n: number) => number;
  getCurrentTime: () => number;
  getTotalTime: () => number;
  getVolume: () => number;
  requestAnimationFrame: (fn: Function) => void;
  cancelAnimationFrame: () => void;
  updateCurrentProgress: () => void;
  updateBufferedProgress: () => void;
  showControllerBar: (e?: MouseEvent) => void;
}

/**
 * Native `<video>` event handlers — translates every event into `ctx`/signal
 * updates and a `change()` dispatch. Native events are the trigger for nearly
 * every other domain (loading state, resume position, the seek rAF loop, the
 * auto-hiding controller bar), so this module's deps interface enumerates
 * that fan-out explicitly as named callbacks rather than hiding it behind a
 * single opaque dependency — see `docs/PLAYER_ROADMAP.md`'s Phase 3 QoE
 * metrics, which taps this exact event stream.
 */
export function createMediaEventHandlers(deps: PlayerMediaDispatchDeps): PlayerMediaHandlers {
  const { refs, state, ctx, visualSignals } = deps;

  return {
    onCanplay: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      visualSignals.isPlaying.setter(false);
      deps.change('canplay', e);
      deps.resize();
    },
    onCanplaythrough: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      deps.change('canplaythrough', e);
    },
    onComplete: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('complete', e);
    },
    onDurationchange: (e: Event): void => {
      ctx.currentState = e.type;
      deps.updateBufferedProgress();
      deps.change('durationchange', e);
    },
    onEmptied: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('emptied', e);
    },
    onEnded: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      maybeClearResumePosition({ rememberPosition: deps.rememberPosition(), src: deps.getSrc() });
      deps.change('ended', e);
    },
    onError: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      deps.change('error', e);
      deps.showErrorModal(describeMediaError(deps.getVideo()?.error));
    },
    onLoadedmetadata: (e: Event): void => {
      ctx.currentState = e.type;
      if (state.pendingPlaybackRestore) {
        deps.restorePlaybackSnapshot(state.pendingPlaybackRestore);
        state.pendingPlaybackRestore = undefined;
      } else {
        // Only a genuine fresh load resumes from storage — a quality-switch reload
        // already took the `pendingPlaybackRestore` branch above instead.
        const resumeAt = resolveResumeTarget({
          rememberPosition: deps.rememberPosition(),
          isSwitchingSource: state.isSwitchingSource,
          src: deps.getSrc(),
          totalTime: deps.getTotalTime(),
        });
        if (resumeAt !== undefined) {
          deps.setCurrentTime(resumeAt);
          deps.change('resume', resumeAt);
        }
      }
      state.isSwitchingSource = false;
      deps.updateBufferedProgress();
      deps.change('loadedmetadata', e);
    },
    onLoadstart: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('loadstart', e);
    },
    onProgress: (e: Event): void => {
      ctx.currentState = e.type;
      deps.updateBufferedProgress();
      deps.change('progress', e);
    },
    onRatechange: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('ratechange', e);
    },
    onSeeked: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      deps.change('seeked', e);
    },
    onSeeking: (e: Event): void => {
      ctx.currentState = e.type;
      deps.setLoadingState(
        shouldSetLoadingOnSeeking({
          isDraggingProgress: state.moveProgress.mouseDown,
          video: deps.getVideo(),
        }),
      );
      deps.change('seeking', e);
    },
    onStalled: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('stalled', e);
    },
    onSuspend: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('suspend', e);
    },
    onLoadeddata: (e: Event): void => {
      ctx.currentState = e.type;
      const duration = deps.getTotalTime();
      ctx.duration = duration;
      deps.updateBufferedProgress();
      const currentTimeWhenSwitching =
        state.isSwitchingSource && state.pendingPlaybackRestore ? state.pendingPlaybackRestore.currentTime : 0;
      // Both setters change in the same tick here — batch so the progress
      // effect (which does a forced-layout `offsetWidth` read) flushes once
      // instead of twice.
      batch(() => {
        visualSignals.duration.setter(duration);
        visualSignals.currentTime.setter(currentTimeWhenSwitching);
      });
      refs.timeDivide.innerText = '/';
      deps.change('loadeddata', e);
    },
    onTimeupdate: (e: Event): void => {
      ctx.currentState = e.type;
      deps.change('timeupdate', e);
    },
    onVolumechange: (e: Event): void => {
      ctx.currentState = e.type;
      // Mirrors the visual signal here too — not just `ctx.volume` — so it
      // can't go stale when the native `volumechange` fires from something
      // other than `setVolume()` (an external script touching `video.volume`
      // directly, an OS media key, etc). `getVolume()` already does the
      // 0-1 → 0-100 scale conversion and writes `ctx.volume`; reuse it instead
      // of duplicating the math, then push the same 0-100 value into the
      // signal so it matches the scale `setVolume()` uses.
      const volume = deps.getVolume();
      visualSignals.volume.setter(volume);
      deps.change('volumechange', e);
    },
    onWaiting: (e: Event): void => {
      ctx.currentState = e.type;
      deps.setLoadingState(
        state.isSwitchingSource ||
          shouldSetLoadingOnWaiting({
            isSeeking: state.isSeeking,
            video: deps.getVideo(),
          }),
      );
      deps.change('waiting', e);
    },
    // Covers the browser's own PiP floating-window controls triggering exit,
    // not just the togglePip() path.
    onEnterPictureInPicture: (): void => {
      deps.change('pictureinpicture', true);
    },
    onLeavePictureInPicture: (): void => {
      deps.change('pictureinpicture', false);
    },
    onPlay: (e: Event): void => {
      ctx.currentState = e.type;
      deps.setLoadingState(false);
      deps.requestAnimationFrame(deps.updateCurrentProgress);
      visualSignals.isPlaying.setter(true);
      deps.showControllerBar();
      deps.change('play', e);
    },
    onPlaying: (e: Event): void => {
      ctx.currentState = e.type;
      state.isSwitchingSource = false;
      deps.setLoadingState(false);
      syncCenterPlayVisibility(refs.playerBtn, false);
      visualSignals.isPlaying.setter(true);
      deps.requestAnimationFrame(deps.updateCurrentProgress);
      deps.showControllerBar();
      deps.change('playing', e);
    },
    onPause: (e: Event): void => {
      ctx.currentState = e.type;
      deps.setLoadingState(false);
      syncCenterPlayVisibility(refs.playerBtn, !state.isSeeking);
      maybeSaveResumePosition({
        rememberPosition: deps.rememberPosition(),
        src: deps.getSrc(),
        currentTime: deps.getCurrentTime(),
      });
      deps.change('pause', e);
      visualSignals.isPlaying.setter(false);
      deps.cancelAnimationFrame();
      // `ctx.currentState` is already 'pause' here, which is not in
      // `PLAY_STATE_LIST` — `showControllerBar()`'s else-branch is exactly
      // this opacity-reset + timer-clear, so delegate instead of duplicating it.
      deps.showControllerBar();
    },
  };
}
