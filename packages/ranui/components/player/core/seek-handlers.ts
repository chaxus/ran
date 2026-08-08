import { formatDuration, range } from 'ranuts/utils';
import { batch } from '@/utils/index';
import { sliderStepFromKeydown } from '@/utils/a11y';
import { getBufferedPercentage, normalizeProgress } from './progress';
import { resolveSeekDuration } from './playback';
import type { RanPlayer } from '../index';

export interface PlayerSeekHandlers {
  progressClick: (e: MouseEvent) => void;
  onProgressKeydown: (e: KeyboardEvent) => void;
  progressDotMouseDown: () => void;
  progressDotMouseMove: (e: MouseEvent) => void;
  progressDotMouseMoveDocument: (e: MouseEvent) => void;
  progressDotMouseUp: () => void;
  syncProgressByPercentage: (percentage: number) => void;
  seekToPercentage: (percentage: number) => void;
  updateCurrentProgress: () => void;
  requestAnimationFrame: (fn: Function) => void;
  cancelAnimationFrame: () => void;
  progressMouseEnter: (e: MouseEvent) => void;
  progressMouseLeave: (e: MouseEvent) => void;
  progressMouseMove: (e: MouseEvent) => void;
  updateBufferedProgress: () => void;
}

/**
 * Everything about the seek bar: click/drag/keyboard seeking, the hover tip,
 * and the rAF loop that keeps the progress display live while playing. Moved
 * out of `index.ts` to keep it under the repo's 800-line-per-file limit — see
 * `core/media-handlers.ts`'s file-level comment for why these are closures
 * over `player` rather than `this`-bound methods, and why the factory must be
 * called exactly once (in the constructor), not per-invocation.
 */
export function createSeekHandlers(player: RanPlayer): PlayerSeekHandlers {
  const updateBufferedProgress = (): void => {
    if (!player._video) return;
    const duration = player.getTotalTime();
    const percentage = getBufferedPercentage(player._video, duration);
    // Batched for the same reason as onLoadeddata/updateCurrentProgress —
    // `batch()` absorbs nested calls into whichever batch is already open
    // (e.g. when this runs from inside updateCurrentProgress's batch), so
    // it's always correct to batch here even when called standalone.
    batch(() => {
      player._visualSignals.duration.setter(duration);
      player._visualSignals.bufferedPercentage.setter(percentage);
    });
  };

  const syncProgressByPercentage = (percentage: number): void => {
    const normalizedPercentage = normalizeProgress(percentage);
    player._progressWrapValue.style.setProperty('transform', `scaleX(${normalizedPercentage})`);
    player._progressDot.style.setProperty(
      'transform',
      `translateX(${normalizedPercentage * player._progress.offsetWidth}px)`,
    );
    player._progress.setAttribute('aria-valuenow', String(Math.round(normalizedPercentage * 100)));
    player._progress.setAttribute('aria-valuetext', formatDuration(normalizedPercentage * player.ctx.duration));
  };

  const seekToPercentage = (percentage: number): void => {
    const durationFromContext = player.ctx.duration;
    const durationFromVideo = player.getTotalTime();
    const duration = resolveSeekDuration(durationFromVideo, durationFromContext);
    if (!Number.isFinite(duration) || duration <= 0) return;
    player.setCurrentTime(duration * normalizeProgress(percentage));
    updateCurrentProgress();
  };

  const requestAnimationFrameFn = (fn: Function): void => {
    if (player.requestAnimationFrameId) return;
    player.requestAnimationFrameId = window.requestAnimationFrame(() => {
      fn();
      if (player.requestAnimationFrameId) {
        cancelAnimationFrame(player.requestAnimationFrameId);
      }
      player.requestAnimationFrameId = undefined;
      requestAnimationFrameFn(fn);
    });
  };

  const cancelAnimationFrameFn = (): void => {
    if (!player.requestAnimationFrameId) return;
    cancelAnimationFrame(player.requestAnimationFrameId);
    player.requestAnimationFrameId = undefined;
  };

  const updateCurrentProgress = (): void => {
    if (player._isSwitchingSource && player._pendingPlaybackRestore) {
      const duration = player.ctx.duration;
      const currentTime = player._pendingPlaybackRestore.currentTime;
      batch(() => {
        player._visualSignals.duration.setter(duration);
        player._visualSignals.currentTime.setter(currentTime);
      });
      return;
    }
    const currentTime = player.getCurrentTime();
    player.ctx.currentTime = currentTime;
    const { duration } = player.ctx;
    // Single batch covers duration+currentTime here and, when it runs,
    // updateBufferedProgress's own (nested) batch too — nested batches are
    // absorbed by the outermost one, so all the setters this tick share one
    // effect flush instead of two or three.
    batch(() => {
      player._visualSignals.duration.setter(duration);
      player._visualSignals.currentTime.setter(currentTime);
      if (Number.isFinite(duration) && duration > 0) {
        player.updateBufferedProgress();
      }
    });
  };

  return {
    updateBufferedProgress,
    syncProgressByPercentage,
    seekToPercentage,
    requestAnimationFrame: requestAnimationFrameFn,
    cancelAnimationFrame: cancelAnimationFrameFn,
    updateCurrentProgress,
    progressClick: (e: MouseEvent): void => {
      const rect = player._progressWrap.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = range(offsetX / player._progress.offsetWidth);
      seekToPercentage(percentage);
    },
    /**
     * ARIA slider keyboard contract for the seek bar — Home/End jump to the
     * ends, ArrowLeft/Down and ArrowRight/Up step (Shift for a coarser step),
     * matching the `role="slider"`/aria-valuemin/valuemax the element already
     * carries (see core/view.ts). Reuses the same percentage scale (0-100) as
     * aria-valuenow and the same `seekToPercentage` seek path the click/drag
     * handlers already use, rather than duplicating seek math.
     * `sliderStepFromKeydown` returning `undefined` means the key isn't part
     * of the slider pattern, so nothing is prevented/handled.
     */
    onProgressKeydown: (e: KeyboardEvent): void => {
      const { currentTime, duration } = player.ctx;
      const hasDuration = Number.isFinite(duration) && duration > 0;
      const currentPercentage = hasDuration ? normalizeProgress(currentTime / duration) * 100 : 0;
      const next = sliderStepFromKeydown(e, { current: currentPercentage, min: 0, max: 100 });
      if (next === undefined) return;
      e.preventDefault();
      seekToPercentage(next / 100);
    },
    progressDotMouseDown: (): void => {
      player._playerBtn.style.setProperty('display', 'none');
      player.moveProgress.mouseDown = true;
      const duration = player.getTotalTime() || player.ctx.duration;
      const currentTime = player.getCurrentTime();
      player.moveProgress.percentage =
        duration > 0 ? Math.floor(normalizeProgress(currentTime / duration) * 100) / 100 : 0;
      player._isSeeking = true;
      player._wasPlayingBeforeSeek = !!player._video && !player._video.paused && !player._video.ended;
      cancelAnimationFrameFn();
    },
    progressDotMouseMove: (e: MouseEvent): void => {
      player.showControllerBar(e);
      if (!player.moveProgress.mouseDown) return;
      const rect = player._progress.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - 9;
      const percentage = range(offsetX / player._progress.offsetWidth);
      syncProgressByPercentage(percentage);
      player.moveProgress.percentage = Math.floor(percentage * 100) / 100;
    },
    progressDotMouseMoveDocument: (e: MouseEvent): void => {
      if (!player.moveProgress.mouseDown) return;
      const rect = player._progress.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - 9;
      const percentage = range(offsetX / player._progress.offsetWidth);
      syncProgressByPercentage(percentage);
      player.moveProgress.percentage = Math.floor(percentage * 100) / 100;
    },
    progressDotMouseUp: (): void => {
      if (!player.moveProgress.mouseDown) return;
      const shouldResume = player._wasPlayingBeforeSeek;
      seekToPercentage(player.moveProgress.percentage);
      player.moveProgress.mouseDown = false;
      player._isSeeking = false;
      player._wasPlayingBeforeSeek = false;
      if (shouldResume) {
        player.safePlay(true);
        requestAnimationFrameFn(updateCurrentProgress);
        return;
      }
      player.pause();
      cancelAnimationFrameFn();
    },
    progressMouseEnter: (e: MouseEvent): void => {
      player._playerTip.style.setProperty('opacity', '1');
      const rect = player._progress.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      if (player._playerTipText.innerText) {
        player._playerTip.style.setProperty('transform', `translate(calc(${offsetX}px - 50%),-20px)`);
      } else {
        player._playerTip.style.setProperty('transform', `translateX(calc(${offsetX}px - 50%))`);
      }
      player._playerTipTime.innerText = formatDuration((offsetX / player._progress.clientWidth) * player.ctx.duration);
    },
    progressMouseLeave: (e: MouseEvent): void => {
      if ((e.target as HTMLElement | null)?.classList.contains('ran-player-controller-progress-wrap-dot')) {
        return;
      }
      player._playerTip.style.setProperty('opacity', '0');
    },
    progressMouseMove: (e: MouseEvent): void => {
      const rect = player._progress.getBoundingClientRect();
      player._playerTip.style.setProperty('opacity', '1');
      const offsetX = e.clientX - rect.left;
      if (player._playerTipText.innerText) {
        player._playerTip.style.setProperty('transform', `translate(calc(${offsetX}px - 50%),-20px)`);
      } else {
        player._playerTip.style.setProperty('transform', `translateX(calc(${offsetX}px - 50%))`);
      }
      player._playerTipTime.innerText = formatDuration((offsetX / player._progress.clientWidth) * player.ctx.duration);
    },
  };
}
