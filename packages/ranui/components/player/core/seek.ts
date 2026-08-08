import { formatDuration, range } from 'ranuts/utils';
import { batch } from '@/utils/index';
import { sliderStepFromKeydown } from '@/utils/a11y';
import { getBufferedPercentage, normalizeProgress } from './progress';
import { resolveSeekDuration } from './playback';
import type { PlaybackSnapshot } from './playback';
import type { PlayerContextState, PlayerRuntimeState } from './state';
import type { PlayerVisualSignals } from './store';
import { applyThumbnailPreview, type ThumbnailCue } from './thumbnails';

export interface PlayerSeekRefs {
  progress: HTMLDivElement;
  progressWrap: HTMLDivElement;
  progressWrapValue: HTMLDivElement;
  progressDot: HTMLDivElement;
  playerBtn: HTMLDivElement;
  playerTip: HTMLDivElement;
  playerTipThumbnail: HTMLDivElement;
  playerTipTime: HTMLDivElement;
  playerTipText: HTMLDivElement;
}

export type PlayerSeekRuntimeState = Pick<
  PlayerRuntimeState<PlaybackSnapshot>,
  'moveProgress' | 'isSeeking' | 'wasPlayingBeforeSeek' | 'pendingPlaybackRestore' | 'isSwitchingSource'
>;

export interface PlayerSeekDeps {
  refs: PlayerSeekRefs;
  state: PlayerSeekRuntimeState;
  ctx: Pick<PlayerContextState, 'duration' | 'currentTime'>;
  visualSignals: PlayerVisualSignals;
  getVideo: () => HTMLVideoElement | undefined;
  getTotalTime: () => number;
  getCurrentTime: () => number;
  setCurrentTime: (n: number) => number;
  safePlay: (showLoading: boolean) => void;
  pause: () => void;
  showControllerBar: (e?: MouseEvent) => void;
  getThumbnailCue: (time: number) => ThumbnailCue | undefined;
  /**
   * Self-forwarding entries for this module's own methods — handlers below call
   * siblings through the RanPlayer wrapper (`this.seekToPercentage(...)` etc.)
   * instead of the local closures, so a `vi.spyOn(player, 'seekToPercentage')`
   * set up after construction still intercepts them (a bare local reference
   * would forever point at the pre-spy original).
   */
  seekToPercentage: (percentage: number) => void;
  syncProgressByPercentage: (percentage: number) => void;
  updateCurrentProgress: () => void;
  updateBufferedProgress: () => void;
  requestAnimationFrame: (fn: Function) => void;
  cancelAnimationFrame: () => void;
}

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
 * and the rAF loop that keeps the progress display live while playing.
 * `requestAnimationFrameId` lives as a closure-local here — it's never read
 * outside this module (only the `requestAnimationFrame`/`cancelAnimationFrame`
 * methods themselves are test-visible).
 */
export function createSeekHandlers(deps: PlayerSeekDeps): PlayerSeekHandlers {
  const { refs, state, ctx, visualSignals } = deps;
  let requestAnimationFrameId: number | undefined;

  const updateBufferedProgress = (): void => {
    const video = deps.getVideo();
    if (!video) return;
    const duration = deps.getTotalTime();
    const percentage = getBufferedPercentage(video, duration);
    // Batched for the same reason as onLoadeddata/updateCurrentProgress —
    // `batch()` absorbs nested calls into whichever batch is already open
    // (e.g. when this runs from inside updateCurrentProgress's batch), so
    // it's always correct to batch here even when called standalone.
    batch(() => {
      visualSignals.duration.setter(duration);
      visualSignals.bufferedPercentage.setter(percentage);
    });
  };

  const syncProgressByPercentage = (percentage: number): void => {
    const normalizedPercentage = normalizeProgress(percentage);
    refs.progressWrapValue.style.setProperty('transform', `scaleX(${normalizedPercentage})`);
    refs.progressDot.style.setProperty(
      'transform',
      `translateX(${normalizedPercentage * refs.progress.offsetWidth}px)`,
    );
    refs.progress.setAttribute('aria-valuenow', String(Math.round(normalizedPercentage * 100)));
    refs.progress.setAttribute('aria-valuetext', formatDuration(normalizedPercentage * ctx.duration));
  };

  const seekToPercentage = (percentage: number): void => {
    const durationFromContext = ctx.duration;
    const durationFromVideo = deps.getTotalTime();
    const duration = resolveSeekDuration(durationFromVideo, durationFromContext);
    if (!Number.isFinite(duration) || duration <= 0) return;
    deps.setCurrentTime(duration * normalizeProgress(percentage));
    deps.updateCurrentProgress();
  };

  const requestAnimationFrameFn = (fn: Function): void => {
    if (requestAnimationFrameId) return;
    requestAnimationFrameId = window.requestAnimationFrame(() => {
      fn();
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
      requestAnimationFrameId = undefined;
      requestAnimationFrameFn(fn);
    });
  };

  const cancelAnimationFrameFn = (): void => {
    if (!requestAnimationFrameId) return;
    cancelAnimationFrame(requestAnimationFrameId);
    requestAnimationFrameId = undefined;
  };

  const updateCurrentProgress = (): void => {
    if (state.isSwitchingSource && state.pendingPlaybackRestore) {
      const duration = ctx.duration;
      const currentTime = state.pendingPlaybackRestore.currentTime;
      batch(() => {
        visualSignals.duration.setter(duration);
        visualSignals.currentTime.setter(currentTime);
      });
      return;
    }
    const currentTime = deps.getCurrentTime();
    ctx.currentTime = currentTime;
    const { duration } = ctx;
    // Single batch covers duration+currentTime here and, when it runs,
    // updateBufferedProgress's own (nested) batch too — nested batches are
    // absorbed by the outermost one, so all the setters this tick share one
    // effect flush instead of two or three.
    batch(() => {
      visualSignals.duration.setter(duration);
      visualSignals.currentTime.setter(currentTime);
      if (Number.isFinite(duration) && duration > 0) {
        deps.updateBufferedProgress();
      }
    });
  };

  /**
   * Shared by `progressMouseEnter`/`progressMouseMove` — positions the tip,
   * updates the time text, and (when a `thumbnails` manifest is loaded) the
   * cropped sprite preview above it. Kept as one function once thumbnails
   * needed the same hover time the time-text branch already computed, rather
   * than tripling the offset/duration math across three call sites.
   */
  const updateProgressTip = (e: MouseEvent): void => {
    refs.playerTip.style.setProperty('opacity', '1');
    const rect = refs.progress.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    if (refs.playerTipText.innerText) {
      refs.playerTip.style.setProperty('transform', `translate(calc(${offsetX}px - 50%),-20px)`);
    } else {
      refs.playerTip.style.setProperty('transform', `translateX(calc(${offsetX}px - 50%))`);
    }
    const hoverTime = (offsetX / refs.progress.clientWidth) * ctx.duration;
    refs.playerTipTime.innerText = formatDuration(hoverTime);
    applyThumbnailPreview(refs.playerTipThumbnail, deps.getThumbnailCue(hoverTime));
  };

  return {
    updateBufferedProgress,
    syncProgressByPercentage,
    seekToPercentage,
    requestAnimationFrame: requestAnimationFrameFn,
    cancelAnimationFrame: cancelAnimationFrameFn,
    updateCurrentProgress,
    progressClick: (e: MouseEvent): void => {
      const rect = refs.progressWrap.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = range(offsetX / refs.progress.offsetWidth);
      deps.seekToPercentage(percentage);
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
      const { currentTime, duration } = ctx;
      const hasDuration = Number.isFinite(duration) && duration > 0;
      const currentPercentage = hasDuration ? normalizeProgress(currentTime / duration) * 100 : 0;
      const next = sliderStepFromKeydown(e, { current: currentPercentage, min: 0, max: 100 });
      if (next === undefined) return;
      e.preventDefault();
      deps.seekToPercentage(next / 100);
    },
    progressDotMouseDown: (): void => {
      refs.playerBtn.style.setProperty('display', 'none');
      state.moveProgress.mouseDown = true;
      const duration = deps.getTotalTime() || ctx.duration;
      const currentTime = deps.getCurrentTime();
      state.moveProgress.percentage =
        duration > 0 ? Math.floor(normalizeProgress(currentTime / duration) * 100) / 100 : 0;
      state.isSeeking = true;
      const video = deps.getVideo();
      state.wasPlayingBeforeSeek = !!video && !video.paused && !video.ended;
      deps.cancelAnimationFrame();
    },
    progressDotMouseMove: (e: MouseEvent): void => {
      deps.showControllerBar(e);
      if (!state.moveProgress.mouseDown) return;
      const rect = refs.progress.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - 9;
      const percentage = range(offsetX / refs.progress.offsetWidth);
      deps.syncProgressByPercentage(percentage);
      state.moveProgress.percentage = Math.floor(percentage * 100) / 100;
    },
    progressDotMouseMoveDocument: (e: MouseEvent): void => {
      if (!state.moveProgress.mouseDown) return;
      const rect = refs.progress.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - 9;
      const percentage = range(offsetX / refs.progress.offsetWidth);
      deps.syncProgressByPercentage(percentage);
      state.moveProgress.percentage = Math.floor(percentage * 100) / 100;
    },
    progressDotMouseUp: (): void => {
      if (!state.moveProgress.mouseDown) return;
      const shouldResume = state.wasPlayingBeforeSeek;
      deps.seekToPercentage(state.moveProgress.percentage);
      state.moveProgress.mouseDown = false;
      state.isSeeking = false;
      state.wasPlayingBeforeSeek = false;
      if (shouldResume) {
        deps.safePlay(true);
        deps.requestAnimationFrame(deps.updateCurrentProgress);
        return;
      }
      deps.pause();
      deps.cancelAnimationFrame();
    },
    progressMouseEnter: updateProgressTip,
    progressMouseLeave: (e: MouseEvent): void => {
      if ((e.target as HTMLElement | null)?.classList.contains('ran-player-controller-progress-wrap-dot')) {
        return;
      }
      refs.playerTip.style.setProperty('opacity', '0');
    },
    progressMouseMove: updateProgressTip,
  };
}
