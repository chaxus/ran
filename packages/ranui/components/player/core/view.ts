import type { Progress } from '@/components/progress';
import { Div, View } from '@/utils/builder';
import type { ElementBuilder } from '@/utils/builder';
import { uiText } from '@/utils/ui-text';
import { playerText } from '../text';

/** A keyboard-focusable, labeled control — the play/fullscreen buttons and the
 * seek slider all need the same tabIndex + role + aria-label triple. `title`
 * rides along with `aria-label` (same pattern as `r-mermaid`'s `iconButton`)
 * so a mouse user hovering an icon-only control — pip, cast, fullscreen —
 * gets the native browser tooltip explaining what it does, not just a
 * screen-reader-only name. */
function focusableRole<T extends HTMLElement>(
  builder: ElementBuilder<T>,
  role: string,
  label: string,
): ElementBuilder<T> {
  return builder.tabIndex(0).role(role).aria('label', label).attr('title', label);
}

/**
 * `<r-icon>` sizes its inner `<svg>` in `1em` by default (`components/icon/index.less`) —
 * it does **not** grow to fill a parent box just because that box has a pixel width. Passing
 * `sizeVar` (the same `--ran-player-*-width` custom property the icon's own button div uses)
 * into the `size` attribute makes `<r-icon>` set that value as an inline CSS width/height on
 * its `<svg>` directly, so the glyph always matches the button's box — including if a
 * consumer overrides the CSS variable — instead of floating undersized inside it.
 */
function icon(name: string, sizeVar: string): HTMLElement {
  return View('r-icon').attr('name', name).attr('size', sizeVar).build() as HTMLElement;
}

/** A focusable icon-only button (play/pause toggle, pip, cast, fullscreen) —
 * these were four separately hand-written `focusableRole(Div()...).children(icon(...)).build()`
 * calls, easy for one to drift from the others (a missing class, a different
 * aria-label pattern). One factory makes that structurally impossible. */
function createIconControl(className: string, iconName: string, ariaLabel: string, sizeVar: string): HTMLDivElement {
  return focusableRole(Div().class(className), 'button', ariaLabel)
    .children(icon(iconName, sizeVar))
    .build() as HTMLDivElement;
}

/** The controls whose names are fixed at build time, named again once the player joins a page. */
export interface PlayerControlLabelRefs {
  progress: HTMLElement;
  speed: HTMLElement;
  volume: HTMLElement;
  pip: HTMLElement;
  remote: HTMLElement;
  fullscreen: HTMLElement;
}

/**
 * Names the controls in the page's language. The play button is not here: its name follows
 * the playback state and `syncPlayButtonState` writes it.
 */
export function labelPlayerControls(refs: PlayerControlLabelRefs): void {
  const name = (element: HTMLElement, key: keyof typeof playerText.en, aria = true): void => {
    const text = uiText(playerText, key, element);
    if (aria) element.setAttribute('aria-label', text);
    element.setAttribute('title', text);
  };
  name(refs.progress, 'player.seek');
  name(refs.speed, 'player.speed');
  name(refs.volume, 'player.volume', false);
  name(refs.pip, 'player.pip');
  name(refs.remote, 'player.cast');
  name(refs.fullscreen, 'player.fullscreen');
}

export interface SpeedOption {
  label: string;
  value: number;
}

export interface PlayerViewRefs {
  player: HTMLDivElement;
  container: HTMLDivElement;
  /** The inline playback-error panel, hidden until `core/error-panel.ts` shows it. */
  errorPanel: HTMLDivElement;
  errorTitle: HTMLDivElement;
  errorMessage: HTMLDivElement;
  errorRetry: HTMLButtonElement;
  /** Always in the tree so a screen reader hears the error once when its text is set. */
  errorLive: HTMLDivElement;
  playerBtn: HTMLDivElement;
  playerController: HTMLDivElement;
  gestureFlash: HTMLDivElement;
  progress: HTMLDivElement;
  progressWrap: HTMLDivElement;
  progressWrapBuffer: HTMLDivElement;
  progressWrapValue: HTMLDivElement;
  progressDot: HTMLDivElement;
  playerControllerBottom: HTMLDivElement;
  playerControllerBottomRight: HTMLDivElement;
  playerControllerBottomLeft: HTMLDivElement;
  playerControllerBottomPlayBtn: HTMLDivElement;
  /** The `<r-icon>` inside `playerControllerBottomPlayBtn` — exposed separately so
   * `syncPlayButtonState` can swap its `name` directly instead of re-querying the
   * button on every play/pause toggle. */
  playerControllerBottomPlayBtnIcon: HTMLElement;
  playerControllerBottomTimeCurrent: HTMLDivElement;
  playerControllerBottomTimeDuration: HTMLDivElement;
  playerControllerBottomTimeDivide: HTMLDivElement;
  playControllerBottomSubtitle: HTMLElement;
  playControllerBottomClarity: HTMLElement;
  playControllerBottomSpeed: HTMLDivElement;
  playControllerBottomVolumeIcon: HTMLDivElement;
  /** The `<r-icon>` inside `playControllerBottomVolumeIcon` — same reasoning as
   * `playerControllerBottomPlayBtnIcon` above, for the mute/unmute swap. */
  playControllerBottomVolumeIconGlyph: HTMLElement;
  playControllerBottomVolumeProgress: Progress;
  playControllerBottomPip: HTMLDivElement;
  playControllerBottomRemote: HTMLDivElement;
  playControllerBottomRightFullScreen: HTMLDivElement;
  playControllerBottomVolume: HTMLDivElement;
  playControllerBottomSpeedPopover: HTMLElement;
  playerTip: HTMLDivElement;
  playerTipThumbnail: HTMLDivElement;
  playerTipTime: HTMLDivElement;
  playerTipText: HTMLDivElement;
}

/**
 * Builds the player's entire shadow DOM subtree in one pass. Every node is created
 * once via the builder and its reference is captured directly in a local — there is
 * no reuse/hydration path (this is called exactly once, from `r-player`'s
 * constructor, and a Custom Element constructor never runs twice for the same
 * instance), so refs are never re-derived by querying the DOM back.
 */
export function ensurePlayerView(input: {
  shadowDom: ShadowRoot;
  speedOptions: SpeedOption[];
  onSpeedChange: (e: Event) => void;
}): PlayerViewRefs {
  const { shadowDom, speedOptions, onSpeedChange } = input;

  const container = Div().build() as HTMLDivElement;
  const playerBtn = Div()
    .class('ran-player-play-btn')
    .children(icon('play', 'var(--ran-player-play-btn-width, 64px)'))
    .build() as HTMLDivElement;
  // Purely visual, `pointer-events: none` in CSS so it never intercepts taps —
  // shown/hidden by `core/gestures.ts` on a double-tap seek.
  const gestureFlash = Div().class('ran-player-gesture-flash').attr('aria-hidden', 'true').build() as HTMLDivElement;

  const progressWrapBuffer = Div().class('ran-player-controller-progress-wrap-buffer').build() as HTMLDivElement;
  const progressWrapValue = Div().class('ran-player-controller-progress-wrap-value').build() as HTMLDivElement;
  const progressWrap = Div()
    .class('ran-player-controller-progress-wrap')
    .children(progressWrapBuffer, progressWrapValue)
    .build() as HTMLDivElement;
  const progressDot = Div().class('ran-player-controller-progress-dot').build() as HTMLDivElement;
  // Percentage-based (0-100), not raw seconds — duration isn't known at
  // construction time and changes per source, whereas 0-100 stays valid for
  // the element's whole lifetime. aria-valuetext (kept in sync in
  // syncProgressByPercentage) carries the actual "current of total" time
  // for a screen reader, since a bare percentage isn't very meaningful for
  // a seek bar.
  const progress = focusableRole(
    Div().class('ran-player-controller-progress'),
    'slider',
    uiText(playerText, 'player.seek'),
  )
    .aria('valuemin', '0')
    .aria('valuemax', '100')
    .children(progressWrap, progressDot)
    .build() as HTMLDivElement;

  const playerControllerBottomPlayBtnIcon = icon('play', 'var(--ran-player-toggle-width, 20px)');
  const playerControllerBottomPlayBtn = focusableRole(
    Div().class('ran-player-controller-bottom-left-btn'),
    'button',
    uiText(playerText, 'player.play'),
  )
    .children(playerControllerBottomPlayBtnIcon)
    .build() as HTMLDivElement;
  const playerControllerBottomTimeCurrent = Div()
    .class('ran-player-controller-bottom-left-time-current')
    .build() as HTMLDivElement;
  const playerControllerBottomTimeDivide = Div()
    .class('ran-player-controller-bottom-left-time-divide')
    .build() as HTMLDivElement;
  const playerControllerBottomTimeDuration = Div()
    .class('ran-player-controller-bottom-left-time-duration')
    .build() as HTMLDivElement;
  const playerControllerBottomLeft = Div()
    .class('ran-player-controller-bottom-left')
    .children(
      playerControllerBottomPlayBtn,
      playerControllerBottomTimeCurrent,
      playerControllerBottomTimeDivide,
      playerControllerBottomTimeDuration,
    )
    .build() as HTMLDivElement;

  const playerIdentifier = 'ran-player' + `${performance.now()}`.replace('.', '');
  const playControllerBottomSpeedPopover = View('r-select')
    .attr('value', '1')
    .attr('trigger', 'hover,click')
    .attr('type', 'text')
    .attr('placement', 'top')
    .attr('getPopupContainerId', playerIdentifier)
    .attr('dropdownclass', 'video-speed-dropdown')
    .aria('label', uiText(playerText, 'player.speed'))
    .attr('title', uiText(playerText, 'player.speed'))
    .children(...speedOptions.map((item) => View('r-option').attr('value', `${item.value}`).text(item.label).build()))
    .build() as HTMLElement;
  playControllerBottomSpeedPopover.addEventListener('change', onSpeedChange);
  const playControllerBottomSpeed = Div()
    .class('ran-player-controller-bottom-right-speed')
    .children(playControllerBottomSpeedPopover)
    .build() as HTMLDivElement;

  const playControllerBottomVolumeIconGlyph = icon('volume', 'var(--ran-player-volume-icon-width, 20px)');
  const playControllerBottomVolumeIcon = Div()
    .class('ran-player-controller-bottom-right-volume-icon')
    .children(playControllerBottomVolumeIconGlyph)
    .build() as HTMLDivElement;
  const playControllerBottomVolumeProgress = View('r-progress')
    .class('ran-player-controller-bottom-right-volume-progress')
    .attr('percent', '50')
    .attr('type', 'drag')
    .build() as Progress;
  const playControllerBottomVolume = Div()
    .class('ran-player-controller-bottom-right-volume')
    .attr('title', uiText(playerText, 'player.volume'))
    .children(playControllerBottomVolumeIcon, playControllerBottomVolumeProgress)
    .build() as HTMLDivElement;

  // Empty/hidden until `createSubtitleSelect()` (index.ts) builds an `<r-select>`
  // into it once `tracks` is set — same lazy-population pattern as clarity below.
  const playControllerBottomSubtitle = Div()
    .class('ran-player-controller-bottom-right-subtitle')
    .build() as HTMLDivElement;
  const playControllerBottomClarity = Div()
    .class('ran-player-controller-bottom-right-clarity')
    .build() as HTMLDivElement;
  // Hidden by default (`ran-player-controller-bottom-right-pip-hidden`, toggled by
  // `syncPipButtonVisibility` in index.ts once `isPipSupported()` is known — that check
  // needs `document`, so it can't run at SSR/construction time). No `<r-icon>` child
  // needed for aria: the icon is decorative by default when it carries no aria-label of
  // its own, and this button already has one via `focusableRole`.
  const playControllerBottomPip = createIconControl(
    'ran-player-controller-bottom-right-pip ran-player-controller-bottom-right-pip-hidden',
    'pip',
    uiText(playerText, 'player.pip'),
    'var(--ran-player-pip-width, 20px)',
  );
  // Hidden by default, same reasoning/mechanism as PiP above — visibility toggled by
  // `syncRemoteButtonVisibility` once `isRemotePlaybackSupported()` is known.
  const playControllerBottomRemote = createIconControl(
    'ran-player-controller-bottom-right-remote ran-player-controller-bottom-right-remote-hidden',
    'cast',
    uiText(playerText, 'player.cast'),
    'var(--ran-player-remote-width, 20px)',
  );
  const playControllerBottomRightFullScreen = createIconControl(
    'ran-player-controller-bottom-right-full',
    'fullscreen',
    uiText(playerText, 'player.fullscreen'),
    'var(--ran-player-fullscreen-width, 20px)',
  );

  const playerControllerBottomRight = Div()
    .class('ran-player-controller-bottom-right')
    .children(
      playControllerBottomSubtitle,
      playControllerBottomClarity,
      playControllerBottomSpeed,
      playControllerBottomVolume,
      playControllerBottomPip,
      playControllerBottomRemote,
      playControllerBottomRightFullScreen,
    )
    .build() as HTMLDivElement;

  const playerControllerBottom = Div()
    .class('ran-player-controller-bottom')
    .children(playerControllerBottomLeft, playerControllerBottomRight)
    .build() as HTMLDivElement;

  // Hidden (`display:none`) until `applyThumbnailPreview()` (`core/thumbnails.ts`) has a
  // cue to show for the hovered time — empty/no `thumbnails` attribute means this box
  // never appears, same progressive-enhancement rule as the PiP/cast buttons.
  const playerTipThumbnail = Div().class('ran-player-controller-tip-thumbnail').build() as HTMLDivElement;
  const playerTipTime = Div().class('ran-player-controller-tip-time').build() as HTMLDivElement;
  const playerTipText = Div().class('ran-player-controller-tip-text').build() as HTMLDivElement;
  const playerTip = Div()
    .class('ran-player-controller-tip')
    .children(playerTipThumbnail, playerTipTime, playerTipText)
    .build() as HTMLDivElement;

  const playerController = Div()
    .class('ran-player-controller')
    .children(playerTip, progress, playerControllerBottom)
    .build() as HTMLDivElement;

  const errorTitle = Div().class('ran-player-error-title').build() as HTMLDivElement;
  const errorMessage = Div().class('ran-player-error-message').build() as HTMLDivElement;
  const errorRetry = View('button')
    .class('ran-player-error-retry')
    .attr('type', 'button')
    .attr('part', 'error-retry')
    .build() as HTMLButtonElement;
  const errorPanel = Div()
    .class('ran-player-error')
    .attr('part', 'error')
    .attr('hidden', '')
    .children(errorTitle, errorMessage, errorRetry)
    .build() as HTMLDivElement;
  const errorLive = Div().class('ran-player-error-live').attr('aria-live', 'polite').build() as HTMLDivElement;

  const player = Div()
    .class('ran-player')
    .id(playerIdentifier)
    .children(container, playerBtn, gestureFlash, playerController, errorPanel, errorLive)
    .build() as HTMLDivElement;

  // deferred mount: this is the constructor's own work, extracted into a function —
  // `ensurePlayerView` has exactly one caller, the r-player constructor.
  shadowDom.appendChild(player);

  return {
    player,
    container,
    errorPanel,
    errorTitle,
    errorMessage,
    errorRetry,
    errorLive,
    playerBtn,
    playerController,
    gestureFlash,
    progress,
    progressWrap,
    progressWrapBuffer,
    progressWrapValue,
    progressDot,
    playerControllerBottom,
    playerControllerBottomRight,
    playerControllerBottomLeft,
    playerControllerBottomPlayBtn,
    playerControllerBottomPlayBtnIcon,
    playerControllerBottomTimeCurrent,
    playerControllerBottomTimeDuration,
    playerControllerBottomTimeDivide,
    playControllerBottomClarity,
    playControllerBottomSpeed,
    playControllerBottomVolumeIcon,
    playControllerBottomVolumeIconGlyph,
    playControllerBottomVolumeProgress,
    playControllerBottomSubtitle,
    playControllerBottomPip,
    playControllerBottomRemote,
    playControllerBottomRightFullScreen,
    playControllerBottomVolume,
    playControllerBottomSpeedPopover,
    playerTip,
    playerTipThumbnail,
    playerTipTime,
    playerTipText,
  };
}
