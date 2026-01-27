import { timeFormat } from 'ranuts/utils';
import type { ControlsConfig } from './types';

export class ControlsManager {
  private controlsBar: HTMLDivElement;
  private bottomBar: HTMLDivElement;
  private leftSection: HTMLDivElement;
  private rightSection: HTMLDivElement;

  // 左侧控件
  private playButton: HTMLDivElement;
  private timeDisplay: HTMLDivElement;
  private timeCurrent: HTMLDivElement;
  private timeDuration: HTMLDivElement;

  // 右侧控件
  private speedSelect?: HTMLElement;
  private volumeControl?: HTMLDivElement;
  private claritySelect?: HTMLElement;
  private fullscreenButton?: HTMLDivElement;

  private config: ControlsConfig;
  private hideTimeout?: NodeJS.Timeout;

  // 回调
  private onPlayPause?: () => void;
  private onVolumeChange?: (volume: number) => void;
  private onSpeedChange?: (rate: number) => void;
  private onClarityChange?: (level: string) => void;
  private onFullscreen?: () => void;

  constructor(
    container: HTMLElement,
    config: ControlsConfig = {},
    callbacks: {
      onPlayPause?: () => void;
      onVolumeChange?: (volume: number) => void;
      onSpeedChange?: (rate: number) => void;
      onClarityChange?: (level: string) => void;
      onFullscreen?: () => void;
    } = {}
  ) {
    this.config = {
      showVolume: true,
      showSpeed: true,
      showClarity: true,
      showFullscreen: true,
      ...config,
    };

    this.onPlayPause = callbacks.onPlayPause;
    this.onVolumeChange = callbacks.onVolumeChange;
    this.onSpeedChange = callbacks.onSpeedChange;
    this.onClarityChange = callbacks.onClarityChange;
    this.onFullscreen = callbacks.onFullscreen;

    // 创建控制栏
    this.controlsBar = document.createElement('div');
    this.controlsBar.className = 'controls';

    this.bottomBar = document.createElement('div');
    this.bottomBar.className = 'controls-bottom';

    this.leftSection = document.createElement('div');
    this.leftSection.className = 'controls-left';

    this.rightSection = document.createElement('div');
    this.rightSection.className = 'controls-right';

    // 创建左侧控件
    this.playButton = this.createPlayButton();
    this.timeDisplay = this.createTimeDisplay();
    this.timeCurrent = this.timeDisplay.querySelector('.time-current')!;
    this.timeDuration = this.timeDisplay.querySelector('.time-duration')!;

    this.leftSection.appendChild(this.playButton);
    this.leftSection.appendChild(this.timeDisplay);

    // 创建右侧控件
    if (this.config.showSpeed) {
      this.speedSelect = this.createSpeedSelect();
      this.rightSection.appendChild(this.speedSelect);
    }

    if (this.config.showVolume) {
      this.volumeControl = this.createVolumeControl();
      this.rightSection.appendChild(this.volumeControl);
    }

    if (this.config.showClarity) {
      this.claritySelect = this.createClaritySelect();
      this.rightSection.appendChild(this.claritySelect);
    }

    if (this.config.showFullscreen) {
      this.fullscreenButton = this.createFullscreenButton();
      this.rightSection.appendChild(this.fullscreenButton);
    }

    this.bottomBar.appendChild(this.leftSection);
    this.bottomBar.appendChild(this.rightSection);
    this.controlsBar.appendChild(this.bottomBar);

    container.appendChild(this.controlsBar);
  }

  private createPlayButton(): HTMLDivElement {
    const button = document.createElement('div');
    button.className = 'play-button paused';
    button.addEventListener('click', () => {
      this.onPlayPause?.();
    });
    return button;
  }

  private createTimeDisplay(): HTMLDivElement {
    const display = document.createElement('div');
    display.className = 'time-display';
    display.innerHTML = `
      <span class="time-current">00:00</span>
      <span class="time-divide">/</span>
      <span class="time-duration">00:00</span>
    `;
    return display;
  }

  private createSpeedSelect(): HTMLElement {
    const select = document.createElement('r-select');
    select.className = 'speed-select';
    select.setAttribute('value', '1');
    select.setAttribute('trigger', 'hover,click');
    select.setAttribute('type', 'text');
    select.setAttribute('placement', 'top');

    const speeds = [
      { label: '2.0X', value: 2.0 },
      { label: '1.5X', value: 1.5 },
      { label: '1.0X', value: 1.0 },
      { label: '0.8X', value: 0.8 },
      { label: '0.5X', value: 0.5 },
    ];

    speeds.forEach(({ label, value }) => {
      const option = document.createElement('r-option');
      option.innerHTML = label;
      option.setAttribute('value', `${value}`);
      select.appendChild(option);
    });

    select.addEventListener('change', (e: Event) => {
      const rate = parseFloat((e as CustomEvent).detail.value);
      this.onSpeedChange?.(rate);
    });

    return select;
  }

  private createVolumeControl(): HTMLDivElement {
    const control = document.createElement('div');
    control.className = 'volume-control';

    const icon = document.createElement('div');
    icon.className = 'volume-icon';

    const progress = document.createElement('r-progress') as any;
    progress.className = 'volume-progress';
    progress.setAttribute('percent', '0.5');
    progress.setAttribute('type', 'drag');

    progress.addEventListener('change', (e: Event) => {
      const volume = (e as CustomEvent).detail.value;
      this.onVolumeChange?.(volume);
    });

    icon.addEventListener('click', () => {
      const currentVolume = parseFloat(progress.getAttribute('percent') || '0');
      const newVolume = currentVolume > 0 ? 0 : 0.5;
      progress.setAttribute('percent', `${newVolume}`);
      this.onVolumeChange?.(newVolume);
    });

    control.appendChild(icon);
    control.appendChild(progress);

    return control;
  }

  private createClaritySelect(): HTMLElement {
    const select = document.createElement('r-select');
    select.className = 'clarity-select';
    select.setAttribute('value', 'Auto');
    select.setAttribute('trigger', 'hover,click');
    select.setAttribute('type', 'text');
    select.setAttribute('placement', 'top');

    select.addEventListener('change', (e: Event) => {
      const level = (e as CustomEvent).detail.value;
      this.onClarityChange?.(level);
    });

    return select;
  }

  private createFullscreenButton(): HTMLDivElement {
    const button = document.createElement('div');
    button.className = 'fullscreen-button';
    button.addEventListener('click', () => {
      this.onFullscreen?.();
    });
    return button;
  }

  // 公共 API
  public show(): void {
    this.controlsBar.style.opacity = '1';
    this.autoHide();
  }

  public hide(): void {
    this.controlsBar.style.opacity = '0';
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  private autoHide(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 2000);
  }

  public updateTime(current: number, duration: number): void {
    this.timeCurrent.textContent = timeFormat(current);
    this.timeDuration.textContent = timeFormat(duration);
  }

  public updatePlayState(playing: boolean): void {
    if (playing) {
      this.playButton.classList.remove('paused');
      this.playButton.classList.add('playing');
    } else {
      this.playButton.classList.remove('playing');
      this.playButton.classList.add('paused');
    }
  }

  public updateVolume(volume: number): void {
    if (this.volumeControl) {
      const progress = this.volumeControl.querySelector('r-progress');
      if (progress) {
        progress.setAttribute('percent', `${volume}`);
      }

      const icon = this.volumeControl.querySelector('.volume-icon');
      if (icon) {
        if (volume > 0) {
          icon.classList.remove('muted');
        } else {
          icon.classList.add('muted');
        }
      }
    }
  }

  public updateClarityOptions(levels: string[]): void {
    if (!this.claritySelect) return;

    this.claritySelect.innerHTML = '';
    levels.forEach((level) => {
      const option = document.createElement('r-option');
      option.setAttribute('value', level);
      option.innerHTML = level;
      this.claritySelect!.appendChild(option);
    });
  }

  public destroy(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    this.controlsBar.remove();
  }
}
