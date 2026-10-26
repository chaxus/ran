import { uiText } from '@/utils/ui-text';
import { playerText } from '../text';
export interface PlayerErrorPanelDeps {
  isDisabled: () => boolean;
  onRetry: () => void;
  /** Read at show time, so a changed `label-error` / `label-retry` applies to the next error. */
  labels: () => { title: string; retry: string };
  refs: {
    panel: HTMLDivElement;
    title: HTMLDivElement;
    message: HTMLDivElement;
    retry: HTMLButtonElement;
    live: HTMLDivElement;
  };
}

export interface PlayerErrorPanelController {
  show: (message: string) => void;
  hide: () => void;
  isShowing: () => boolean;
}

/**
 * The inline error + retry panel, shared by the native `onError` (media dispatch) and
 * `hlsError` (clarity) paths so they cannot show it twice or disagree on whether it is up.
 * It sits on the player's own dark surface instead of blocking the page: the failure belongs
 * to this video, not to everything around it.
 */
export function createErrorPanelController(deps: PlayerErrorPanelDeps): PlayerErrorPanelController {
  const { panel, title, message, retry, live } = deps.refs;
  let showing = false;
  const hide = (): void => {
    showing = false;
    panel.hidden = true;
    live.textContent = '';
  };
  retry.addEventListener('click', (e) => {
    e.stopPropagation();
    hide();
    deps.onRetry();
  });
  // Space and Enter belong to the button here; the host's own Space toggles playback.
  retry.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === 'Enter') e.stopPropagation();
  });
  const show = (text: string): void => {
    if (deps.isDisabled() || showing) return;
    showing = true;
    const labels = deps.labels();
    title.textContent = labels.title;
    message.textContent = text;
    retry.textContent = labels.retry;
    panel.hidden = false;
    live.textContent = uiText(playerText, 'player.errorAnnouncement', panel, { title: labels.title, message: text });
  };
  return { show, hide, isShowing: () => showing };
}
