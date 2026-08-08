import { addClassToElement, formatDuration, removeClassToElement } from 'ranuts/utils';
import { createEffect } from '@/utils/index';
import { syncPlayButtonState } from './events';
import { normalizeProgress } from './progress';
import type { PlayerVisualSignals } from './store';

export interface PlayerVisualEffectRefs {
  playBtn: HTMLElement;
  progress: HTMLElement;
  progressValue: HTMLElement;
  progressDot: HTMLElement;
  progressBuffer: HTMLElement;
  timeCurrent: HTMLElement;
  timeDuration: HTMLElement;
  volumeIcon: HTMLElement;
  volumeProgress: HTMLElement;
}

const VOLUME_ICON_CLASS = 'ran-player-controller-bottom-right-volume-icon-volume';
const MUTE_ICON_CLASS = 'ran-player-controller-bottom-right-volume-icon-mute';

/**
 * One effect per visual concern that used to be written from several handler
 * methods each (see components/player/index.ts on* handlers). Handlers only
 * write the signals in `core/store.ts`; these effects own the DOM writes, so
 * each concern has exactly one place that touches the DOM for it.
 */
export function createPlaybackVisualEffects(
  refs: PlayerVisualEffectRefs,
  signals: PlayerVisualSignals,
): Array<() => void> {
  return [
    // Play/pause button class — was duplicated in onPlay/onPlaying/onPause.
    createEffect(() => {
      syncPlayButtonState(refs.playBtn, signals.isPlaying.getter());
    }),
    // Progress fill + buffered track + dot position + time labels — was
    // duplicated across onDurationchange/onProgress/onLoadeddata/updateCurrentProgress.
    createEffect(() => {
      const currentTime = signals.currentTime.getter();
      const duration = signals.duration.getter();
      const buffered = signals.bufferedPercentage.getter();
      const hasDuration = Number.isFinite(duration) && duration > 0;
      const percentage = normalizeProgress(hasDuration ? currentTime / duration : 0);
      refs.progressValue.style.setProperty('transform', `scaleX(${percentage})`);
      refs.progressDot.style.setProperty('transform', `translateX(${percentage * refs.progress.offsetWidth}px)`);
      refs.progressBuffer.style.setProperty('transform', `scaleX(${normalizeProgress(buffered)})`);
      refs.progress.setAttribute('aria-valuenow', String(Math.round(percentage * 100)));
      refs.progress.setAttribute('aria-valuetext', formatDuration(percentage * duration));
      refs.timeCurrent.innerText = formatDuration(currentTime);
      refs.timeDuration.innerText = formatDuration(duration);
    }),
    // Volume icon mute/unmute + slider percent — was duplicated between
    // changePlayerVolume (mute toggle) and changeVolumeProgress (drag).
    createEffect(() => {
      const volume = signals.volume.getter();
      if (volume > 0) {
        addClassToElement(refs.volumeIcon, VOLUME_ICON_CLASS);
        removeClassToElement(refs.volumeIcon, MUTE_ICON_CLASS);
      } else {
        addClassToElement(refs.volumeIcon, MUTE_ICON_CLASS);
        removeClassToElement(refs.volumeIcon, VOLUME_ICON_CLASS);
      }
      refs.volumeProgress.setAttribute('percent', `${volume}`);
    }),
  ];
}
