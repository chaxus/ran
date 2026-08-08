export interface PlayerErrorModalDeps {
  isDisabled: () => boolean;
  onRetry: () => void;
}

export interface PlayerErrorModalController {
  show: (message: string) => void;
  isShowing: () => boolean;
}

/**
 * Default-on error + retry dialog, shared by both the native `onError` (media
 * dispatch) and `hlsError` (clarity) paths so they can't stack two modals or
 * drift out of sync on the "is one currently showing" flag. `r-modal` is
 * lazy-loaded — nothing is fetched until an error actually happens, same
 * recipe as r-mermaid's fullscreen lightbox (`import('@/components/modal')`).
 */
export function createErrorModalController(deps: PlayerErrorModalDeps): PlayerErrorModalController {
  let isShowingErrorModal = false;
  const show = (message: string): void => {
    if (deps.isDisabled() || isShowingErrorModal) return;
    isShowingErrorModal = true;
    import('@/components/modal')
      .then(({ default: Modal }) => {
        return Modal.error({
          title: 'Playback failed',
          content: message,
          okText: 'Retry',
          onConfirm: () => {
            isShowingErrorModal = false;
            deps.onRetry();
          },
        });
      })
      .then(() => {
        isShowingErrorModal = false;
      });
  };
  return { show, isShowing: () => isShowingErrorModal };
}
