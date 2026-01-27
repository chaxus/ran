import type { Level, PlayerConfig, PlayerEventDetail, PlayerState } from './types';
import { VideoManager } from './video-manager';
import { ProgressManager } from './progress-manager';
import { ControlsManager } from './controls-manager';
import { HlsManager } from './hls-manager';
import { FullscreenManager } from './fullscreen-manager';
import { HTMLElementSSR } from '@/utils/index';

export class Player extends (HTMLElementSSR()!) {
  // Shadow DOM
  private _shadowRoot!: ShadowRoot;

  // 容器
  private _container!: HTMLDivElement;
  private _videoContainer!: HTMLDivElement;
  private _controlsContainer!: HTMLDivElement;

  // 管理器
  private _videoManager?: VideoManager;
  private _progressManager?: ProgressManager;
  private _controlsManager?: ControlsManager;
  private _hlsManager?: HlsManager;
  private _fullscreenManager?: FullscreenManager;

  // 状态
  private _state: PlayerState = 'idle';
  private _config: PlayerConfig = {};

  // 动画帧ID
  private _rafId?: number;

  static get observedAttributes(): string[] {
    return ['src', 'autoplay', 'muted', 'loop', 'volume', 'playbackrate'];
  }

  constructor() {
    super();
    this.innerHTML = '';
    this.setupShadowDOM();
  }

  // ========== Shadow DOM 设置 ==========
  private setupShadowDOM(): void {
    this._shadowRoot = this.attachShadow({ mode: 'open' });

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;
    this._shadowRoot.appendChild(style);

    // 创建容器
    this._container = document.createElement('div');
    this._container.className = 'container';
    this._container.setAttribute('part', 'container');

    this._videoContainer = document.createElement('div');
    this._videoContainer.className = 'video-container';
    this._videoContainer.setAttribute('part', 'video-container');

    this._controlsContainer = document.createElement('div');
    this._controlsContainer.className = 'controls-container';
    this._controlsContainer.setAttribute('part', 'controls-container');

    this._container.appendChild(this._videoContainer);
    this._container.appendChild(this._controlsContainer);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== 生命周期 ==========
  connectedCallback(): void {
    this.setupManagers();
    this.setupEventListeners();

    // 初始化配置
    if (this.src) {
      this.loadSource(this.src);
    }
  }

  disconnectedCallback(): void {
    this.destroyManagers();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'src':
        this.loadSource(newValue);
        break;
      case 'volume':
        this.setVolume(parseFloat(newValue));
        break;
      case 'playbackrate':
        this.setPlaybackRate(parseFloat(newValue));
        break;
    }
  }

  // ========== 管理器设置 ==========
  private setupManagers(): void {
    // VideoManager
    this._videoManager = new VideoManager(this._videoContainer, {
      onStateChange: (state) => this.handleStateChange(state),
      onEvent: (type, detail) => this.emitEvent(type, detail),
    });

    // ProgressManager
    this._progressManager = new ProgressManager(this._controlsContainer, {
      onSeek: (percentage) => {
        const time = this._videoManager!.getDuration() * percentage;
        this._videoManager!.setCurrentTime(time);
      },
      onDragStart: () => {
        this.cancelAnimationFrame();
      },
      onDragEnd: (percentage) => {
        const time = this._videoManager!.getDuration() * percentage;
        this._videoManager!.setCurrentTime(time);
        this.play();
      },
    });

    // ControlsManager
    this._controlsManager = new ControlsManager(
      this._controlsContainer,
      {},
      {
        onPlayPause: () => this.togglePlayPause(),
        onVolumeChange: (volume) => this.setVolume(volume),
        onSpeedChange: (rate) => this.setPlaybackRate(rate),
        onClarityChange: (level) => this._hlsManager?.switchQuality(level),
        onFullscreen: () => this._fullscreenManager?.toggle(),
      }
    );

    // FullscreenManager
    this._fullscreenManager = new FullscreenManager(this._container, {
      onFullscreenChange: () => {
        this.emitEvent('fullscreenchange', {
          currentTime: this._videoManager!.getCurrentTime(),
          duration: this._videoManager!.getDuration(),
          state: this._state,
          volume: this._videoManager!.getVolume(),
          playbackRate: this._videoManager!.getPlaybackRate(),
        });
      },
    });
  }

  private destroyManagers(): void {
    this._videoManager?.destroy();
    this._progressManager?.destroy();
    this._controlsManager?.destroy();
    this._hlsManager?.destroy();
    this._fullscreenManager?.destroy();
  }

  private setupEventListeners(): void {
    // 鼠标移动显示控制栏
    this._container.addEventListener('mousemove', () => {
      this._controlsManager?.show();
    });

    // 点击视频切换播放/暂停
    this._videoContainer.addEventListener('click', () => {
      this.togglePlayPause();
    });
  }

  // ========== 内部方法 ==========
  private handleStateChange(state: PlayerState): void {
    this._state = state;

    if (state === 'playing') {
      this.startProgressUpdates();
      this._controlsManager?.updatePlayState(true);
    } else if (state === 'paused') {
      this.stopProgressUpdates();
      this._controlsManager?.updatePlayState(false);
    }

    this.emitEvent('statechange', {
      currentTime: this._videoManager!.getCurrentTime(),
      duration: this._videoManager!.getDuration(),
      state,
      volume: this._videoManager!.getVolume(),
      playbackRate: this._videoManager!.getPlaybackRate(),
    });
  }

  private emitEvent(type: string, detail: PlayerEventDetail): void {
    this.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  private startProgressUpdates(): void {
    const update = () => {
      if (!this._videoManager) return;

      const current = this._videoManager.getCurrentTime();
      const duration = this._videoManager.getDuration();
      const percentage = duration > 0 ? current / duration : 0;

      this._progressManager?.updateProgress(percentage);
      this._controlsManager?.updateTime(current, duration);

      this._rafId = requestAnimationFrame(update);
    };

    this._rafId = requestAnimationFrame(update);
  }

  private stopProgressUpdates(): void {
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = undefined;
    }
  }

  private cancelAnimationFrame(): void {
    this.stopProgressUpdates();
  }

  private loadSource(src: string): void {
    if (!this._videoManager) return;

    // 检查是否是 HLS 源
    if (src.includes('.m3u8')) {
      if (!this._hlsManager) {
        this._hlsManager = new HlsManager(this._videoManager.getVideoElement(), {
          onManifestLoaded: (levels) => {
            const levelNames = levels.map(l => l.name);
            this._controlsManager?.updateClarityOptions(levelNames);
          },
          onError: (event, data) => {
            console.error('HLS Error:', event, data);
          },
        });
      }
      this._hlsManager.loadSource(src);
    } else {
      this._videoManager.setSrc(src);
    }
  }

  private togglePlayPause(): void {
    if (this._state === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  // ========== 公共 API - 属性 ==========
  get src(): string {
    return this.getAttribute('src') || '';
  }

  set src(value: string) {
    this.setAttribute('src', value);
  }

  get volume(): number {
    return this._videoManager?.getVolume() || 0;
  }

  set volume(value: number) {
    this.setVolume(value);
  }

  get playbackRate(): number {
    return this._videoManager?.getPlaybackRate() || 1;
  }

  set playbackRate(value: number) {
    this.setPlaybackRate(value);
  }

  get currentTime(): number {
    return this._videoManager?.getCurrentTime() || 0;
  }

  set currentTime(value: number) {
    this._videoManager?.setCurrentTime(value);
  }

  get duration(): number {
    return this._videoManager?.getDuration() || 0;
  }

  get paused(): boolean {
    return this._state !== 'playing';
  }

  get state(): PlayerState {
    return this._state;
  }

  // ========== 公共 API - 方法 ==========
  public async play(time?: number): Promise<void> {
    if (!this._videoManager) return;
    await this._videoManager.play(time);
  }

  public pause(): void {
    this._videoManager?.pause();
  }

  public stop(): void {
    this.pause();
    this._videoManager?.setCurrentTime(0);
  }

  public seek(time: number): void {
    this._videoManager?.setCurrentTime(time);
  }

  public setVolume(volume: number): void {
    this._videoManager?.setVolume(volume);
    this._controlsManager?.updateVolume(volume);
  }

  public getVolume(): number {
    return this._videoManager?.getVolume() || 0;
  }

  public mute(): void {
    this.setVolume(0);
  }

  public unmute(): void {
    this.setVolume(0.5);
  }

  public setPlaybackRate(rate: number): void {
    this._videoManager?.setPlaybackRate(rate);
  }

  public getPlaybackRate(): number {
    return this._videoManager?.getPlaybackRate() || 1;
  }

  public getCurrentTime(): number {
    return this._videoManager?.getCurrentTime() || 0;
  }

  public setCurrentTime(time: number): void {
    this._videoManager?.setCurrentTime(time);
  }

  public getDuration(): number {
    return this._videoManager?.getDuration() || 0;
  }

  public setQuality(level: string): void {
    this._hlsManager?.switchQuality(level);
  }

  public getQualities(): Level[] {
    return this._hlsManager?.getQualities() || [];
  }

  public async requestFullscreen(): Promise<void> {
    await this._fullscreenManager?.enter();
  }

  public async exitFullscreen(): Promise<void> {
    await this._fullscreenManager?.exit();
  }

  public async toggleFullscreen(): Promise<void> {
    await this._fullscreenManager?.toggle();
  }

  public destroy(): void {
    this.destroyManagers();
  }

  public reset(): void {
    this.stop();
    this._state = 'idle';
  }
}
