import type { Progress } from '@/components/progress';
import { Div, Slot, View } from '@/utils/builder';

export interface SpeedOption {
  label: string;
  value: number;
}

export interface PlayerViewRefs {
  player: HTMLDivElement;
  container: HTMLDivElement;
  slot: HTMLSlotElement;
  playerBtn: HTMLDivElement;
  playerController: HTMLDivElement;
  progress: HTMLDivElement;
  progressWrap: HTMLDivElement;
  progressWrapBuffer: HTMLDivElement;
  progressWrapValue: HTMLDivElement;
  progressDot: HTMLDivElement;
  playerControllerBottom: HTMLDivElement;
  playerControllerBottomRight: HTMLDivElement;
  playerControllerBottomLeft: HTMLDivElement;
  playerControllerBottomPlayBtn: HTMLDivElement;
  playerControllerBottomTimeCurrent: HTMLDivElement;
  playerControllerBottomTimeDuration: HTMLDivElement;
  playerControllerBottomTimeDivide: HTMLDivElement;
  playControllerBottomClarity: HTMLElement;
  playControllerBottomSpeed: HTMLDivElement;
  playControllerBottomSpeedIcon: HTMLDivElement;
  playControllerBottomVolumeProgress: Progress;
  playControllerBottomRightFullScreen: HTMLDivElement;
  playControllerBottomVolume: HTMLDivElement;
  playControllerBottomSpeedPopover: HTMLElement;
  playerTip: HTMLDivElement;
  playerTipTime: HTMLDivElement;
  playerTipText: HTMLDivElement;
}

function assertExists<T>(node: T | null, selector: string): T {
  if (!node) {
    throw new Error(`r-player view node not found: ${selector}`);
  }
  return node;
}

export function ensurePlayerView(input: {
  shadowDom: ShadowRoot;
  speedOptions: SpeedOption[];
  onSpeedChange: (e: Event) => void;
}): PlayerViewRefs {
  const { shadowDom, speedOptions, onSpeedChange } = input;

  let player = shadowDom.querySelector('.ran-player') as HTMLDivElement | null;
  let container = shadowDom.querySelector('.ran-player-contain') as HTMLDivElement | null;
  let slot = shadowDom.querySelector('slot') as HTMLSlotElement | null;
  let playerBtn = shadowDom.querySelector('.ran-player-play-btn') as HTMLDivElement | null;
  let playerController = shadowDom.querySelector('.ran-player-controller') as HTMLDivElement | null;

  if (!player || !container || !slot || !playerBtn || !playerController) {
    container = Div().build() as HTMLDivElement;
    slot = Slot().build() as HTMLSlotElement;
    playerBtn = Div().class('ran-player-play-btn').build() as HTMLDivElement;

    const progressWrapBuffer = Div().class('ran-player-controller-progress-wrap-buffer').build() as HTMLDivElement;
    const progressWrapValue = Div().class('ran-player-controller-progress-wrap-value').build() as HTMLDivElement;
    const progressWrap = Div()
      .class('ran-player-controller-progress-wrap')
      .children(progressWrapBuffer, progressWrapValue)
      .build() as HTMLDivElement;
    const progressDot = Div().class('ran-player-controller-progress-dot').build() as HTMLDivElement;
    const progress = Div()
      .class('ran-player-controller-progress')
      .children(progressWrap, progressDot)
      .build() as HTMLDivElement;

    const playerControllerBottomPlayBtn = Div().class('ran-player-controller-bottom-left-btn').build() as HTMLDivElement;
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
      .children(...speedOptions.map((item) => View('r-option').attr('value', `${item.value}`).text(item.label).build()))
      .build() as HTMLElement;
    playControllerBottomSpeedPopover.addEventListener('change', onSpeedChange);
    const playControllerBottomSpeed = Div()
      .class('ran-player-controller-bottom-right-speed')
      .children(playControllerBottomSpeedPopover)
      .build() as HTMLDivElement;

    const playControllerBottomSpeedIcon = Div()
      .class('ran-player-controller-bottom-right-volume-icon ran-player-controller-bottom-right-volume-icon-volume')
      .build() as HTMLDivElement;
    const playControllerBottomVolumeProgress = View('r-progress')
      .class('ran-player-controller-bottom-right-volume-progress')
      .attr('percent', '50')
      .attr('type', 'drag')
      .build() as Progress;
    const playControllerBottomVolume = Div()
      .class('ran-player-controller-bottom-right-volume')
      .children(playControllerBottomSpeedIcon, playControllerBottomVolumeProgress)
      .build() as HTMLDivElement;

    const playControllerBottomClarity = Div().class('ran-player-controller-bottom-right-clarity').build() as HTMLDivElement;
    const playControllerBottomRightFullScreen = Div().class('ran-player-controller-bottom-right-full').build() as HTMLDivElement;

    const playerControllerBottomRight = Div()
      .class('ran-player-controller-bottom-right')
      .children(
        playControllerBottomClarity,
        playControllerBottomSpeed,
        playControllerBottomVolume,
        playControllerBottomRightFullScreen,
      )
      .build() as HTMLDivElement;

    const playerControllerBottom = Div()
      .class('ran-player-controller-bottom')
      .children(playerControllerBottomLeft, playerControllerBottomRight)
      .build() as HTMLDivElement;

    const playerTipTime = Div().class('ran-player-controller-tip-time').build() as HTMLDivElement;
    const playerTipText = Div().class('ran-player-controller-tip-text').build() as HTMLDivElement;
    const playerTip = Div().class('ran-player-controller-tip').children(playerTipTime, playerTipText).build() as HTMLDivElement;

    playerController = Div()
      .class('ran-player-controller')
      .children(playerTip, progress, playerControllerBottom)
      .build() as HTMLDivElement;

    player = Div()
      .class('ran-player')
      .id(playerIdentifier)
      .children(container, slot, playerBtn, playerController)
      .build() as HTMLDivElement;

    shadowDom.appendChild(player);
  }

  const progress = assertExists(
    playerController.querySelector('.ran-player-controller-progress') as HTMLDivElement | null,
    '.ran-player-controller-progress',
  );
  const progressWrap = assertExists(
    progress.querySelector('.ran-player-controller-progress-wrap') as HTMLDivElement | null,
    '.ran-player-controller-progress-wrap',
  );
  const progressWrapBuffer = assertExists(
    progressWrap.querySelector('.ran-player-controller-progress-wrap-buffer') as HTMLDivElement | null,
    '.ran-player-controller-progress-wrap-buffer',
  );
  const progressWrapValue = assertExists(
    progressWrap.querySelector('.ran-player-controller-progress-wrap-value') as HTMLDivElement | null,
    '.ran-player-controller-progress-wrap-value',
  );
  const progressDot = assertExists(
    progress.querySelector('.ran-player-controller-progress-dot') as HTMLDivElement | null,
    '.ran-player-controller-progress-dot',
  );

  const playerControllerBottom = assertExists(
    playerController.querySelector('.ran-player-controller-bottom') as HTMLDivElement | null,
    '.ran-player-controller-bottom',
  );
  const playerControllerBottomLeft = assertExists(
    playerControllerBottom.querySelector('.ran-player-controller-bottom-left') as HTMLDivElement | null,
    '.ran-player-controller-bottom-left',
  );
  const playerControllerBottomPlayBtn = assertExists(
    playerControllerBottomLeft.querySelector('.ran-player-controller-bottom-left-btn') as HTMLDivElement | null,
    '.ran-player-controller-bottom-left-btn',
  );
  const playerControllerBottomTimeCurrent = assertExists(
    playerControllerBottomLeft.querySelector('.ran-player-controller-bottom-left-time-current') as HTMLDivElement | null,
    '.ran-player-controller-bottom-left-time-current',
  );
  const playerControllerBottomTimeDivide = assertExists(
    playerControllerBottomLeft.querySelector('.ran-player-controller-bottom-left-time-divide') as HTMLDivElement | null,
    '.ran-player-controller-bottom-left-time-divide',
  );
  const playerControllerBottomTimeDuration = assertExists(
    playerControllerBottomLeft.querySelector('.ran-player-controller-bottom-left-time-duration') as HTMLDivElement | null,
    '.ran-player-controller-bottom-left-time-duration',
  );

  const playerControllerBottomRight = assertExists(
    playerControllerBottom.querySelector('.ran-player-controller-bottom-right') as HTMLDivElement | null,
    '.ran-player-controller-bottom-right',
  );
  const playControllerBottomSpeed = assertExists(
    playerControllerBottomRight.querySelector('.ran-player-controller-bottom-right-speed') as HTMLDivElement | null,
    '.ran-player-controller-bottom-right-speed',
  );
  const playControllerBottomSpeedPopover = assertExists(
    playControllerBottomSpeed.querySelector('r-select') as HTMLElement | null,
    'r-select',
  );
  playControllerBottomSpeedPopover.addEventListener('change', onSpeedChange);

  const playControllerBottomVolume = assertExists(
    playerControllerBottomRight.querySelector('.ran-player-controller-bottom-right-volume') as HTMLDivElement | null,
    '.ran-player-controller-bottom-right-volume',
  );
  const playControllerBottomVolumeProgress = assertExists(
    playControllerBottomVolume.querySelector('r-progress') as Progress | null,
    'r-progress',
  );
  const playControllerBottomSpeedIcon = assertExists(
    playControllerBottomVolume.querySelector('.ran-player-controller-bottom-right-volume-icon') as HTMLDivElement | null,
    '.ran-player-controller-bottom-right-volume-icon',
  );
  const playControllerBottomClarity = assertExists(
    playerControllerBottomRight.querySelector('.ran-player-controller-bottom-right-clarity') as HTMLElement | null,
    '.ran-player-controller-bottom-right-clarity',
  );
  const playControllerBottomRightFullScreen = assertExists(
    playerControllerBottomRight.querySelector('.ran-player-controller-bottom-right-full') as HTMLDivElement | null,
    '.ran-player-controller-bottom-right-full',
  );

  const playerTip = assertExists(
    playerController.querySelector('.ran-player-controller-tip') as HTMLDivElement | null,
    '.ran-player-controller-tip',
  );
  const playerTipTime = assertExists(
    playerTip.querySelector('.ran-player-controller-tip-time') as HTMLDivElement | null,
    '.ran-player-controller-tip-time',
  );
  const playerTipText = assertExists(
    playerTip.querySelector('.ran-player-controller-tip-text') as HTMLDivElement | null,
    '.ran-player-controller-tip-text',
  );

  return {
    player: assertExists(player, '.ran-player'),
    container: assertExists(container, '.ran-player-contain'),
    slot: assertExists(slot, 'slot'),
    playerBtn: assertExists(playerBtn, '.ran-player-play-btn'),
    playerController: assertExists(playerController, '.ran-player-controller'),
    progress,
    progressWrap,
    progressWrapBuffer,
    progressWrapValue,
    progressDot,
    playerControllerBottom,
    playerControllerBottomRight,
    playerControllerBottomLeft,
    playerControllerBottomPlayBtn,
    playerControllerBottomTimeCurrent,
    playerControllerBottomTimeDuration,
    playerControllerBottomTimeDivide,
    playControllerBottomClarity,
    playControllerBottomSpeed,
    playControllerBottomSpeedIcon,
    playControllerBottomVolumeProgress,
    playControllerBottomRightFullScreen,
    playControllerBottomVolume,
    playControllerBottomSpeedPopover,
    playerTip,
    playerTipTime,
    playerTipText,
  };
}
