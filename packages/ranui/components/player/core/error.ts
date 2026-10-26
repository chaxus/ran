import { uiText } from '@/utils/ui-text';
import { playerText } from '../text';
/**
 * `MediaError.code` → human-readable text. `MediaError` itself has no message
 * worth surfacing for most codes (browsers leave it empty), so this maps the
 * spec's four error codes directly instead of trusting `error.message`. `element` picks the language.
 */
export function describeMediaError(error: MediaError | null | undefined, element?: Element): string {
  switch (error?.code) {
    case 1:
      return uiText(playerText, 'player.errorAborted', element);
    case 2:
      return uiText(playerText, 'player.errorNetwork', element);
    case 3:
      return uiText(playerText, 'player.errorDecode', element);
    case 4:
      return uiText(playerText, 'player.errorUnsupported', element);
    default:
      return uiText(playerText, 'player.errorUnknown', element);
  }
}
