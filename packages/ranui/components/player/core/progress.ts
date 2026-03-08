import { range } from 'ranuts/utils';

export function normalizeProgress(percentage: number): number {
  return range(percentage);
}

export function getBufferedPercentage(video: HTMLVideoElement, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }
  const { buffered, currentTime } = video;
  let bufferedEnd = 0;
  for (let i = 0; i < buffered.length; i++) {
    const start = buffered.start(i);
    const end = buffered.end(i);
    if (start <= currentTime && currentTime <= end) {
      bufferedEnd = end;
      break;
    }
    if (end > bufferedEnd) {
      bufferedEnd = end;
    }
  }
  return range(bufferedEnd / duration);
}
