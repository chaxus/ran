/**
 * `MediaError.code` → human-readable text. `MediaError` itself has no message
 * worth surfacing for most codes (browsers leave it empty), so this maps the
 * spec's four error codes directly instead of trusting `error.message`.
 */
export function describeMediaError(error: MediaError | null | undefined): string {
  switch (error?.code) {
    case 1:
      return 'Playback was aborted.';
    case 2:
      return 'A network error occurred while loading the video.';
    case 3:
      return 'The video could not be decoded.';
    case 4:
      return 'This video format or source is not supported.';
    default:
      return 'An unknown playback error occurred.';
  }
}
