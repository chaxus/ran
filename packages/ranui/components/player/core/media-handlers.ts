import { batch } from '@/utils/index';
import { syncCenterPlayVisibility, shouldSetLoadingOnSeeking, shouldSetLoadingOnWaiting } from './events';
import { describeMediaError } from './error';
import { clearResumePosition, loadResumePosition, saveResumePosition, shouldResumeAt } from './resume';
import type { PlayerMediaHandlers } from './media';
import type { RanPlayer } from '../index';

/**
 * Native `<video>` event handlers — the `PlayerMediaHandlers` shape `core/media.ts`
 * already defines. Moved out of `index.ts` purely to keep that file under the
 * repo's 800-line-per-file limit; every handler here is a closure over `player`
 * (not a `this`-bound method), so it's exactly as safe to pass around as the
 * arrow-function class fields it replaces — see `index.ts`'s constructor, which
 * calls this factory exactly once and `Object.assign`s the result onto the
 * instance (must stay exactly-once: `bindMediaEvents`/`unbindMediaEvents` match
 * listeners by function reference, so re-creating these closures on every call
 * would break `removeEventListener` on disconnect).
 */
export function createMediaEventHandlers(player: RanPlayer): PlayerMediaHandlers {
  return {
    onCanplay: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      player._visualSignals.isPlaying.setter(false);
      player.change('canplay', e);
      player.resize();
    },
    onCanplaythrough: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      player.change('canplaythrough', e);
    },
    onComplete: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('complete', e);
    },
    onDurationchange: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.updateBufferedProgress();
      player.change('durationchange', e);
    },
    onEmptied: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('emptied', e);
    },
    onEnded: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      if (player.rememberPosition) clearResumePosition(player.src);
      player.change('ended', e);
    },
    onError: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      player.change('error', e);
      player.showErrorModal(describeMediaError(player._video?.error));
    },
    onLoadedmetadata: (e: Event): void => {
      player.ctx.currentState = e.type;
      if (player._pendingPlaybackRestore) {
        player.restorePlaybackSnapshot(player._pendingPlaybackRestore);
        player._pendingPlaybackRestore = undefined;
      } else if (player.rememberPosition && !player._isSwitchingSource) {
        // Only a genuine fresh load resumes from storage — a quality-switch reload
        // already took the `_pendingPlaybackRestore` branch above instead.
        const resumeAt = loadResumePosition(player.src);
        if (shouldResumeAt(resumeAt, player.getTotalTime())) {
          player.setCurrentTime(resumeAt);
          player.change('resume', resumeAt);
        }
      }
      player._isSwitchingSource = false;
      player.updateBufferedProgress();
      player.change('loadedmetadata', e);
    },
    onLoadstart: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('loadstart', e);
    },
    onProgress: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.updateBufferedProgress();
      player.change('progress', e);
    },
    onRatechange: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('ratechange', e);
    },
    onSeeked: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      player.change('seeked', e);
    },
    onSeeking: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.setLoadingState(
        shouldSetLoadingOnSeeking({
          isDraggingProgress: player.moveProgress.mouseDown,
          video: player._video,
        }),
      );
      player.change('seeking', e);
    },
    onStalled: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('stalled', e);
    },
    onSuspend: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('suspend', e);
    },
    onLoadeddata: (e: Event): void => {
      player.ctx.currentState = e.type;
      const duration = player.getTotalTime();
      player.ctx.duration = duration;
      player.updateBufferedProgress();
      const currentTimeWhenSwitching =
        player._isSwitchingSource && player._pendingPlaybackRestore ? player._pendingPlaybackRestore.currentTime : 0;
      // Both setters change in the same tick here — batch so the progress
      // effect (which does a forced-layout `offsetWidth` read) flushes once
      // instead of twice.
      batch(() => {
        player._visualSignals.duration.setter(duration);
        player._visualSignals.currentTime.setter(currentTimeWhenSwitching);
      });
      player._playerControllerBottomTimeDivide.innerText = '/';
      player.change('loadeddata', e);
    },
    onTimeupdate: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.change('timeupdate', e);
    },
    onVolumechange: (e: Event): void => {
      player.ctx.currentState = e.type;
      // Mirrors the visual signal here too — not just `ctx.volume` — so it
      // can't go stale when the native `volumechange` fires from something
      // other than `setVolume()` (an external script touching `video.volume`
      // directly, an OS media key, etc). `getVolume()` already does the
      // 0-1 → 0-100 scale conversion and writes `ctx.volume`; reuse it instead
      // of duplicating the math, then push the same 0-100 value into the
      // signal so it matches the scale `setVolume()` uses.
      const volume = player.getVolume();
      player._visualSignals.volume.setter(volume);
      player.change('volumechange', e);
    },
    onWaiting: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.setLoadingState(
        player._isSwitchingSource ||
          shouldSetLoadingOnWaiting({
            isSeeking: player._isSeeking,
            video: player._video,
          }),
      );
      player.change('waiting', e);
    },
    // Covers the browser's own PiP floating-window controls triggering exit,
    // not just the togglePip() path.
    onEnterPictureInPicture: (): void => {
      player.change('pictureinpicture', true);
    },
    onLeavePictureInPicture: (): void => {
      player.change('pictureinpicture', false);
    },
    onPlay: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.setLoadingState(false);
      player.requestAnimationFrame(player.updateCurrentProgress);
      player._visualSignals.isPlaying.setter(true);
      player.showControllerBar();
      player.change('play', e);
    },
    onPlaying: (e: Event): void => {
      player.ctx.currentState = e.type;
      player._isSwitchingSource = false;
      player.setLoadingState(false);
      syncCenterPlayVisibility(player._playerBtn, false);
      player._visualSignals.isPlaying.setter(true);
      player.requestAnimationFrame(player.updateCurrentProgress);
      player.showControllerBar();
      player.change('playing', e);
    },
    onPause: (e: Event): void => {
      player.ctx.currentState = e.type;
      player.setLoadingState(false);
      syncCenterPlayVisibility(player._playerBtn, !player._isSeeking);
      if (player.rememberPosition) saveResumePosition(player.src, player.getCurrentTime());
      player.change('pause', e);
      player._visualSignals.isPlaying.setter(false);
      player.cancelAnimationFrame();
      player._playerController.style.setProperty('opacity', '1');
      if (player.controllerBarTimeId) {
        clearTimeout(player.controllerBarTimeId);
        player.controllerBarTimeId = undefined;
      }
    },
  };
}
