import { formatDuration } from 'ranuts/utils';
import { createEffect } from '@/utils/builder';
import { syncPlayButtonState } from './events';
import { normalizeProgress } from './progress';
import type { PlayerVisualSignals } from './store';

export interface PlayerVisualEffectRefs {
  playBtn: HTMLElement;
  playBtnIcon: HTMLElement;
  progress: HTMLElement;
  progressValue: HTMLElement;
  progressDot: HTMLElement;
  progressBuffer: HTMLElement;
  timeCurrent: HTMLElement;
  timeDuration: HTMLElement;
  timeDivide: HTMLElement;
  volumeIconGlyph: HTMLElement;
  volumeProgress: HTMLElement;
}

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
  // The progress effect runs every frame while playing. Reading the track's width there,
  // after writing a transform, forced a style and layout pass per frame; the width is read
  // here and kept current by a ResizeObserver instead, which also re-places a paused dot.
  let trackWidth = refs.progress.offsetWidth;
  let percentage = 0;
  const placeDot = (): void => {
    refs.progressDot.style.setProperty('transform', `translateX(${percentage * trackWidth}px)`);
  };
  const resize =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(([entry]) => {
          trackWidth = entry?.borderBoxSize?.[0]?.inlineSize ?? refs.progress.offsetWidth;
          placeDot();
        });
  resize?.observe(refs.progress);
  // Text nodes are rewritten only when the text changes: four per frame otherwise.
  const shown = new Map<HTMLElement, string>();
  const show = (el: HTMLElement, text: string): void => {
    if (shown.get(el) === text) return;
    shown.set(el, text);
    el.innerText = text;
  };
  return [
    () => resize?.disconnect(),
    // Play/pause button class — was duplicated in onPlay/onPlaying/onPause.
    createEffect(() => {
      syncPlayButtonState(refs.playBtn, refs.playBtnIcon, signals.isPlaying.getter());
    }),
    // Progress fill + buffered track + dot position + time labels — was
    // duplicated across onDurationchange/onProgress/onLoadeddata/updateCurrentProgress.
    createEffect(() => {
      const currentTime = signals.currentTime.getter();
      const duration = signals.duration.getter();
      const buffered = signals.bufferedPercentage.getter();
      const hasDuration = Number.isFinite(duration) && duration > 0;
      percentage = normalizeProgress(hasDuration ? currentTime / duration : 0);
      refs.progressValue.style.setProperty('transform', `scaleX(${percentage})`);
      placeDot();
      refs.progressBuffer.style.setProperty('transform', `scaleX(${normalizeProgress(buffered)})`);
      refs.progress.setAttribute('aria-valuenow', String(Math.round(percentage * 100)));
      refs.progress.setAttribute('aria-valuetext', formatDuration(currentTime));
      show(refs.timeCurrent, formatDuration(currentTime));
      show(refs.timeDuration, hasDuration ? formatDuration(duration) : '');
      refs.timeDuration.hidden = !hasDuration;
      show(refs.timeDivide, hasDuration ? '/' : '');
      refs.timeDivide.hidden = !hasDuration;
    }),
    // Volume icon mute/unmute + slider percent — was duplicated between
    // changePlayerVolume (mute toggle) and changeVolumeProgress (drag).
    createEffect(() => {
      const volume = signals.volume.getter();
      refs.volumeIconGlyph.setAttribute('name', volume > 0 ? 'volume' : 'volume-mute');
      refs.volumeProgress.setAttribute('percent', `${volume}`);
    }),
  ];
}
