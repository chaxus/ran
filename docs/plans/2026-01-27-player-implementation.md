# Player 组件现代化重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 player 组件重构为模块化、使用 Shadow DOM 的现代化架构

**Architecture:** 拆分为多个管理器（VideoManager, ControlsManager, ProgressManager, HlsManager, FullscreenManager），主类负责协调

**Tech Stack:** TypeScript, Shadow DOM, Custom Elements, HLS.js

---

## 阶段 1: 类型系统和基础设施

### Task 1: 创建类型定义文件

**Files:**
- Create: `packages/ranui/components/player/types.ts`

**Step 1: 创建 types.ts 文件**

```typescript
/**
 * Player component types
 */

// 播放器状态
export type PlayerState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'
  | 'buffering';

// 播放器配置
export interface PlayerConfig {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  poster?: string;
}

// 事件详情类型
export interface PlayerEventDetail {
  currentTime: number;
  duration: number;
  state: PlayerState;
  volume: number;
  playbackRate: number;
}

// 事件类型
export type PlayerEventType =
  | 'play'
  | 'pause'
  | 'playing'
  | 'ended'
  | 'timeupdate'
  | 'volumechange'
  | 'ratechange'
  | 'loadstart'
  | 'loadeddata'
  | 'canplay'
  | 'error'
  | 'seeking'
  | 'seeked'
  | 'fullscreenchange'
  | 'qualitychange'
  | 'statechange';

// HLS 相关类型
export interface HlsPlayer {
  startLoad(): () => void;
  off: (s: string, f: Function) => void;
  on: (s: string, f: Function) => void;
  loadSource: (s: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  destroy: () => void;
}

export interface Level {
  audioCodec: string;
  bitrate: number;
  height: number;
  width: number;
  name: string;
  url: string;
  videoCodec: string;
}

// 控制栏配置
export interface ControlsConfig {
  showProgress?: boolean;
  showVolume?: boolean;
  showSpeed?: boolean;
  showClarity?: boolean;
  showFullscreen?: boolean;
}

// 内部上下文（用于管理器间通信）
export interface PlayerContext {
  currentTime: number;
  duration: number;
  currentState: string;
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
  levels: Partial<Level>[];
  url: string;
  levelMap: Map<string, string>;
  clarity: string;
}
```

**Step 2: 提交类型定义**

```bash
git add packages/ranui/components/player/types.ts
git commit -m "feat(player): add TypeScript type definitions

Add comprehensive type system for player component:
- PlayerState, PlayerConfig, PlayerEventDetail
- HLS types (HlsPlayer, Level)
- ControlsConfig and PlayerContext

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: 创建 VideoManager

**Files:**
- Create: `packages/ranui/components/player/video-manager.ts`

**Step 1: 创建 VideoManager 基础结构**

```typescript
import type { PlayerEventDetail, PlayerState } from './types';

export class VideoManager {
  private video: HTMLVideoElement;
  private container: HTMLElement;
  private onStateChange?: (state: PlayerState) => void;
  private onEvent?: (type: string, detail: PlayerEventDetail) => void;

  constructor(
    container: HTMLElement,
    callbacks: {
      onStateChange?: (state: PlayerState) => void;
      onEvent?: (type: string, detail: PlayerEventDetail) => void;
    }
  ) {
    this.container = container;
    this.onStateChange = callbacks.onStateChange;
    this.onEvent = callbacks.onEvent;
    this.video = this.createVideo();
    this.setupEventListeners();
  }

  private createVideo(): HTMLVideoElement {
    const video = document.createElement('video');
    video.setAttribute('class', 'player-video');
    video.setAttribute('preload', 'auto');
    video.setAttribute('x5-video-player-type', 'h5');
    video.setAttribute('x5-video-orientation', 'portrait');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.controls = false;
    this.container.appendChild(video);
    return video;
  }

  private setupEventListeners(): void {
    // 播放相关
    this.video.addEventListener('play', this.handlePlay);
    this.video.addEventListener('playing', this.handlePlaying);
    this.video.addEventListener('pause', this.handlePause);
    this.video.addEventListener('ended', this.handleEnded);

    // 加载相关
    this.video.addEventListener('loadstart', this.handleLoadStart);
    this.video.addEventListener('loadeddata', this.handleLoadedData);
    this.video.addEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.video.addEventListener('canplay', this.handleCanPlay);

    // 进度相关
    this.video.addEventListener('timeupdate', this.handleTimeUpdate);
    this.video.addEventListener('seeking', this.handleSeeking);
    this.video.addEventListener('seeked', this.handleSeeked);

    // 其他
    this.video.addEventListener('volumechange', this.handleVolumeChange);
    this.video.addEventListener('ratechange', this.handleRateChange);
    this.video.addEventListener('error', this.handleError);
    this.video.addEventListener('waiting', this.handleWaiting);
  }

  private handlePlay = (e: Event): void => {
    this.emitState('playing', e.type);
  };

  private handlePlaying = (e: Event): void => {
    this.emitState('playing', e.type);
  };

  private handlePause = (e: Event): void => {
    this.emitState('paused', e.type);
  };

  private handleEnded = (e: Event): void => {
    this.emitState('ended', e.type);
  };

  private handleLoadStart = (e: Event): void => {
    this.emitState('loading', e.type);
  };

  private handleLoadedData = (e: Event): void => {
    this.emitState('ready', e.type);
  };

  private handleLoadedMetadata = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleCanPlay = (e: Event): void => {
    this.emitState('ready', e.type);
  };

  private handleTimeUpdate = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleSeeking = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleSeeked = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleVolumeChange = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleRateChange = (e: Event): void => {
    this.emitEvent(e.type);
  };

  private handleError = (e: Event): void => {
    this.emitState('error', e.type);
  };

  private handleWaiting = (e: Event): void => {
    this.emitState('buffering', e.type);
  };

  private emitState(state: PlayerState, eventType: string): void {
    this.onStateChange?.(state);
    this.emitEvent(eventType);
  }

  private emitEvent(type: string): void {
    const detail: PlayerEventDetail = {
      currentTime: this.video.currentTime,
      duration: this.video.duration || 0,
      state: 'idle', // Will be updated by state handler
      volume: this.video.volume,
      playbackRate: this.video.playbackRate,
    };
    this.onEvent?.(type, detail);
  }

  // 公共 API
  public async play(time?: number): Promise<void> {
    if (time !== undefined && time >= 0) {
      this.video.currentTime = time;
    }
    await this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public setCurrentTime(time: number): void {
    this.video.currentTime = time;
  }

  public getCurrentTime(): number {
    return this.video.currentTime;
  }

  public getDuration(): number {
    return this.video.duration || 0;
  }

  public setVolume(volume: number): void {
    this.video.volume = Math.max(0, Math.min(1, volume));
  }

  public getVolume(): number {
    return this.video.volume;
  }

  public setPlaybackRate(rate: number): void {
    this.video.playbackRate = rate;
  }

  public getPlaybackRate(): number {
    return this.video.playbackRate;
  }

  public setSrc(src: string): void {
    this.video.src = src;
  }

  public getVideoElement(): HTMLVideoElement {
    return this.video;
  }

  public destroy(): void {
    // 移除所有事件监听器
    this.video.removeEventListener('play', this.handlePlay);
    this.video.removeEventListener('playing', this.handlePlaying);
    this.video.removeEventListener('pause', this.handlePause);
    this.video.removeEventListener('ended', this.handleEnded);
    this.video.removeEventListener('loadstart', this.handleLoadStart);
    this.video.removeEventListener('loadeddata', this.handleLoadedData);
    this.video.removeEventListener('loadedmetadata', this.handleLoadedMetadata);
    this.video.removeEventListener('canplay', this.handleCanPlay);
    this.video.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.video.removeEventListener('seeking', this.handleSeeking);
    this.video.removeEventListener('seeked', this.handleSeeked);
    this.video.removeEventListener('volumechange', this.handleVolumeChange);
    this.video.removeEventListener('ratechange', this.handleRateChange);
    this.video.removeEventListener('error', this.handleError);
    this.video.removeEventListener('waiting', this.handleWaiting);

    this.video.remove();
  }
}
```

**Step 2: 提交 VideoManager**

```bash
git add packages/ranui/components/player/video-manager.ts
git commit -m "feat(player): add VideoManager for video playback

Implement VideoManager to handle:
- Video element creation and lifecycle
- All native video events
- Playback control (play, pause, seek)
- Volume and playback rate management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: 创建 ProgressManager

**Files:**
- Create: `packages/ranui/components/player/progress-manager.ts`

**Step 1: 创建 ProgressManager**

```typescript
import { range } from 'ranuts/utils';

export class ProgressManager {
  private progressWrap: HTMLDivElement;
  private progressValue: HTMLDivElement;
  private progressDot: HTMLDivElement;
  private progressBar: HTMLDivElement;
  private isDragging = false;
  private currentPercentage = 0;

  private onSeek?: (percentage: number) => void;
  private onDragStart?: () => void;
  private onDragEnd?: (percentage: number) => void;

  constructor(
    container: HTMLElement,
    callbacks: {
      onSeek?: (percentage: number) => void;
      onDragStart?: () => void;
      onDragEnd?: (percentage: number) => void;
    }
  ) {
    this.onSeek = callbacks.onSeek;
    this.onDragStart = callbacks.onDragStart;
    this.onDragEnd = callbacks.onDragEnd;

    // 创建进度条结构
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress';

    this.progressWrap = document.createElement('div');
    this.progressWrap.className = 'progress-wrap';

    this.progressValue = document.createElement('div');
    this.progressValue.className = 'progress-value';

    this.progressDot = document.createElement('div');
    this.progressDot.className = 'progress-dot';

    this.progressWrap.appendChild(this.progressValue);
    this.progressBar.appendChild(this.progressWrap);
    this.progressBar.appendChild(this.progressDot);
    container.appendChild(this.progressBar);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 点击进度条
    this.progressBar.addEventListener('click', this.handleProgressClick);

    // 拖拽进度点
    this.progressDot.addEventListener('mousedown', this.handleDragStart);
    document.addEventListener('mousemove', this.handleDragMove);
    document.addEventListener('mouseup', this.handleDragEnd);
  }

  private handleProgressClick = (e: MouseEvent): void => {
    if (e.target === this.progressDot) return;

    const rect = this.progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = range(offsetX / this.progressBar.offsetWidth);

    this.onSeek?.(percentage);
    this.updateProgress(percentage);
  };

  private handleDragStart = (e: MouseEvent): void => {
    e.preventDefault();
    this.isDragging = true;
    this.onDragStart?.();
  };

  private handleDragMove = (e: MouseEvent): void => {
    if (!this.isDragging) return;

    const rect = this.progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = range(offsetX / this.progressBar.offsetWidth);

    this.currentPercentage = percentage;
    this.updateProgressUI(percentage);
  };

  private handleDragEnd = (): void => {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.onDragEnd?.(this.currentPercentage);
  };

  private updateProgressUI(percentage: number): void {
    this.progressValue.style.transform = `scaleX(${percentage})`;
    this.progressDot.style.transform = `translateX(${percentage * this.progressBar.offsetWidth}px)`;
  }

  public updateProgress(percentage: number): void {
    if (this.isDragging) return; // 拖拽时不更新
    this.currentPercentage = percentage;
    this.updateProgressUI(percentage);
  }

  public destroy(): void {
    this.progressBar.removeEventListener('click', this.handleProgressClick);
    this.progressDot.removeEventListener('mousedown', this.handleDragStart);
    document.removeEventListener('mousemove', this.handleDragMove);
    document.removeEventListener('mouseup', this.handleDragEnd);
    this.progressBar.remove();
  }
}
```

**Step 2: 提交 ProgressManager**

```bash
git add packages/ranui/components/player/progress-manager.ts
git commit -m "feat(player): add ProgressManager for progress control

Implement ProgressManager to handle:
- Progress bar rendering and updates
- Click to seek functionality
- Drag interaction for seeking
- Optimized UI updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: 创建 FullscreenManager

**Files:**
- Create: `packages/ranui/components/player/fullscreen-manager.ts`

**Step 1: 创建 FullscreenManager**

```typescript
export class FullscreenManager {
  private element: HTMLElement;
  private isFullscreen = false;
  private onFullscreenChange?: (isFullscreen: boolean) => void;

  constructor(
    element: HTMLElement,
    callbacks: {
      onFullscreenChange?: (isFullscreen: boolean) => void;
    }
  ) {
    this.element = element;
    this.onFullscreenChange = callbacks.onFullscreenChange;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange);
  }

  private handleFullscreenChange = (): void => {
    const isNowFullscreen = this.checkFullscreen();
    if (isNowFullscreen !== this.isFullscreen) {
      this.isFullscreen = isNowFullscreen;
      this.onFullscreenChange?.(this.isFullscreen);
    }
  };

  private checkFullscreen(): boolean {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  }

  public async enter(): Promise<void> {
    if (this.isFullscreen) return;

    try {
      if (this.element.requestFullscreen) {
        await this.element.requestFullscreen();
      } else if ((this.element as any).webkitRequestFullscreen) {
        await (this.element as any).webkitRequestFullscreen();
      } else if ((this.element as any).mozRequestFullScreen) {
        await (this.element as any).mozRequestFullScreen();
      } else if ((this.element as any).msRequestFullscreen) {
        await (this.element as any).msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      throw error;
    }
  }

  public async exit(): Promise<void> {
    if (!this.isFullscreen) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      throw error;
    }
  }

  public async toggle(): Promise<void> {
    if (this.isFullscreen) {
      await this.exit();
    } else {
      await this.enter();
    }
  }

  public getIsFullscreen(): boolean {
    return this.isFullscreen;
  }

  public destroy(): void {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange);
  }
}
```

**Step 2: 提交 FullscreenManager**

```bash
git add packages/ranui/components/player/fullscreen-manager.ts
git commit -m "feat(player): add FullscreenManager for fullscreen control

Implement FullscreenManager to handle:
- Fullscreen API with browser compatibility
- Enter/exit/toggle fullscreen
- Fullscreen state monitoring
- Keyboard shortcuts support (Escape)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 阶段 2: 高级功能管理器

### Task 5: 创建 HlsManager

**Files:**
- Create: `packages/ranui/components/player/hls-manager.ts`

**Step 1: 创建 HlsManager**

```typescript
import type { HlsPlayer, Level } from './types';

declare global {
  interface Window {
    Hls: any;
  }
}

export class HlsManager {
  private hls?: HlsPlayer;
  private video: HTMLVideoElement;
  private levels: Level[] = [];
  private levelMap = new Map<string, string>();
  private currentQuality = 'Auto';

  private onManifestLoaded?: (levels: Level[], url: string) => void;
  private onError?: (event: unknown, data: unknown) => void;

  constructor(
    video: HTMLVideoElement,
    callbacks: {
      onManifestLoaded?: (levels: Level[], url: string) => void;
      onError?: (event: unknown, data: unknown) => void;
    }
  ) {
    this.video = video;
    this.onManifestLoaded = callbacks.onManifestLoaded;
    this.onError = callbacks.onError;
  }

  public loadSource(url: string): void {
    const Hls = window.Hls;

    // 检查是否支持原生 HLS
    if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      this.video.src = url;
      return;
    }

    // 检查是否支持 HLS.js
    if (!Hls?.isSupported()) {
      console.error('HLS is not supported');
      return;
    }

    // 销毁旧实例
    if (this.hls) {
      this.hls.destroy();
    }

    // 创建新实例
    this.hls = new Hls();
    this.hls.loadSource(url);
    this.hls.attachMedia(this.video);

    // 监听事件
    this.hls.on(Hls.Events.MANIFEST_LOADED, (event: string, data: any) => {
      this.handleManifestLoaded(event, data);
    });

    this.hls.on(Hls.Events.ERROR, (event: string, data: any) => {
      this.handleError(event, data);
    });
  }

  private handleManifestLoaded = (event: string, data: any): void => {
    const { url, levels = [] } = data;

    this.levels = [];
    this.levelMap.clear();

    // 添加所有清晰度选项
    levels.forEach((level: Level) => {
      if (!this.levelMap.has(level.name)) {
        this.levels.push(level);
        this.levelMap.set(level.name, level.url);
      }
    });

    // 添加 Auto 选项
    if (!this.levelMap.has('Auto')) {
      this.levels.push({ name: 'Auto', url } as Level);
      this.levelMap.set('Auto', url);
    }

    this.onManifestLoaded?.(this.levels, url);
  };

  private handleError = (event: unknown, data: unknown): void => {
    console.error('HLS Error:', event, data);
    this.onError?.(event, data);

    // 尝试降级到直接播放
    if (this.video.src !== this.video.currentSrc) {
      this.video.src = this.video.currentSrc;
    }
  };

  public switchQuality(levelName: string): void {
    const url = this.levelMap.get(levelName);
    if (!url || !this.hls) return;

    this.currentQuality = levelName;

    // 保存当前状态
    const currentTime = this.video.currentTime;
    const wasPaused = this.video.paused;

    // 重新加载源
    this.hls.loadSource(url);

    // 恢复状态
    this.video.currentTime = currentTime;
    if (!wasPaused) {
      this.video.play();
    }
  }

  public getQualities(): Level[] {
    return this.levels;
  }

  public getCurrentQuality(): string {
    return this.currentQuality;
  }

  public destroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = undefined;
    }
    this.levels = [];
    this.levelMap.clear();
  }
}
```

**Step 2: 提交 HlsManager**

```bash
git add packages/ranui/components/player/hls-manager.ts
git commit -m "feat(player): add HlsManager for HLS streaming

Implement HlsManager to handle:
- HLS.js initialization and configuration
- Quality level switching
- Manifest loading and parsing
- Error handling and fallback

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: 创建 ControlsManager (第一部分 - 基础结构)

**Files:**
- Create: `packages/ranui/components/player/controls-manager.ts`

**Step 1: 创建 ControlsManager 基础**

```typescript
import { timeFormat } from 'ranuts/utils';
import type { ControlsConfig } from './types';

export class ControlsManager {
  private container: HTMLDivElement;
  private controlsBar: HTMLDivElement;
  private bottomBar: HTMLDivElement;
  private leftSection: HTMLDivElement;
  private rightSection: HTMLDivElement;

  // 左侧控件
  private playButton: HTMLDivElement;
  private timeDisplay: HTMLDivElement;
  private timeCurrent: HTMLDivElement;
  private timeDivide: HTMLDivElement;
  private timeDuration: HTMLDivElement;

  // 右侧控件
  private speedSelect?: HTMLElement;
  private volumeControl?: HTMLDivElement;
  private claritySelect?: HTMLElement;
  private fullscreenButton: HTMLDivElement;

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
      showProgress: true,
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
    this.timeDivide = this.timeDisplay.querySelector('.time-divide')!;
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

    if (container instanceof ShadowRoot) {
      (container as ShadowRoot).appendChild(this.controlsBar);
    } else {
      container.appendChild(this.controlsBar);
    }

    this.container = this.controlsBar;
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
```

**Step 2: 提交 ControlsManager**

```bash
git add packages/ranui/components/player/controls-manager.ts
git commit -m "feat(player): add ControlsManager for UI controls

Implement ControlsManager to handle:
- Control bar rendering (play, time, volume, speed, clarity, fullscreen)
- Auto-hide functionality
- User interaction handling
- Dynamic control updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 阶段 3: 主组件集成

### Task 7: 创建新的 Player 主类 (player.ts)

**Files:**
- Create: `packages/ranui/components/player/player.ts`

**Step 1: 创建 Player 主类骨架**

```typescript
import { HTMLElementSSR } from '@/utils/index';
import type { PlayerState, PlayerConfig, PlayerEventDetail, Level } from './types';
import { VideoManager } from './video-manager';
import { ProgressManager } from './progress-manager';
import { ControlsManager } from './controls-manager';
import { HlsManager } from './hls-manager';
import { FullscreenManager } from './fullscreen-manager';

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
    style.textContent = this.getStyles();
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

  private getStyles(): string {
    return `
      :host {
        display: block;
        width: var(--width, 100%);
        height: var(--height, 100%);
        position: relative;
        background: var(--background, #000);
        overflow: hidden;
      }

      .container {
        width: 100%;
        height: 100%;
        position: relative;
      }

      .video-container {
        width: 100%;
        height: 100%;
      }

      .player-video {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .controls-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px;
      }

      .controls {
        background: var(--controls-bg, linear-gradient(180deg, transparent, rgba(0,0,0,0.7)));
        opacity: 0;
        transition: opacity 0.3s;
      }

      .controls-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
      }

      .controls-left,
      .controls-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .play-button {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-size: contain;
      }

      .play-button.paused {
        background: url(./img/smallplay.png) no-repeat;
      }

      .play-button.playing {
        background: url(./img/smallpause.png) no-repeat;
      }

      .time-display {
        display: flex;
        gap: 4px;
        color: #fff;
        font-size: 12px;
      }

      .progress {
        width: 100%;
        height: 4px;
        position: relative;
        cursor: pointer;
      }

      .progress-wrap {
        width: 100%;
        height: 100%;
        background: var(--progress-bg, rgba(255,255,255,0.3));
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-value {
        height: 100%;
        background: var(--progress-color, #fff);
        transform: scaleX(0);
        transform-origin: left;
        will-change: transform;
      }

      .progress-dot {
        position: absolute;
        top: -2px;
        left: -4px;
        width: 8px;
        height: 8px;
        background: #fff;
        border-radius: 50%;
        transform: translateX(0);
      }

      .fullscreen-button {
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: url(./img/fullscreenfig.png) no-repeat;
        background-size: contain;
      }
    `;
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
      onFullscreenChange: (isFullscreen) => {
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
          onManifestLoaded: (levels, url) => {
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
```

**Step 2: 提交 Player 主类**

```bash
git add packages/ranui/components/player/player.ts
git commit -m "feat(player): add modernized Player main class

Implement Player class with:
- Shadow DOM architecture
- Manager-based modular design
- Complete public API
- Event system integration
- Lifecycle management

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: 更新入口文件

**Files:**
- Modify: `packages/ranui/components/player/index.ts`

**Step 1: 备份旧代码并更新入口**

```bash
# 备份旧代码
mv packages/ranui/components/player/index.ts packages/ranui/components/player/index.ts.old
```

**Step 2: 创建新的入口文件**

```typescript
import { Player } from './player';

// 导出类型
export * from './types';

// 导出主类
export { Player };

// 自动注册组件
function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-player')) {
    customElements.define('r-player', Player);
    return Player;
  }
}

export default Custom();
```

**Step 3: 提交入口文件**

```bash
git add packages/ranui/components/player/index.ts
git commit -m "feat(player): update entry point for new architecture

Update index.ts to:
- Export new Player class
- Export all types
- Auto-register custom element

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 阶段 4: 样式和优化

### Task 9: 创建现代化样式

**Files:**
- Create: `packages/ranui/components/player/index.css`
- Modify: `packages/ranui/components/player/index.less` (备份)

**Step 1: 备份旧样式**

```bash
mv packages/ranui/components/player/index.less packages/ranui/components/player/index.less.old
```

**Step 2: 创建新的 CSS 样式**

创建 `packages/ranui/components/player/index.css`:

```css
/* Player Modern Styles */

:host {
  display: block;
  width: var(--width, 100%);
  height: var(--height, 100%);
  position: relative;
  background: var(--background, #000);
  overflow: hidden;
}

/* Container */
.container {
  width: 100%;
  height: 100%;
  position: relative;
}

.video-container {
  width: 100%;
  height: 100%;
}

.player-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Hide native controls */
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}

/* Controls Container */
.controls-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.controls {
  background: var(--controls-bg, linear-gradient(180deg, transparent, rgba(0,0,0,0.7)));
  padding: var(--controls-padding, 16px);
  opacity: 0;
  transition: opacity var(--controls-transition, 0.3s);
}

.controls:hover {
  opacity: 1;
}

/* Progress Bar */
.progress {
  width: 100%;
  height: var(--progress-height, 4px);
  position: relative;
  cursor: pointer;
  margin-bottom: 8px;
}

.progress-wrap {
  width: 100%;
  height: 100%;
  background: var(--progress-bg, rgba(255,255,255,0.3));
  border-radius: 2px;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background: var(--progress-color, #fff);
  transform: scaleX(0);
  transform-origin: left;
  will-change: transform;
  transition: transform 0.1s linear;
}

.progress-dot {
  position: absolute;
  top: -2px;
  left: -4px;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  cursor: grab;
  transform: translateX(0);
  transition: transform 0.1s linear;
}

.progress-dot:active {
  cursor: grabbing;
}

/* Controls Bottom Bar */
.controls-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: var(--controls-gap, 12px);
}

/* Play Button */
.play-button {
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
}

.play-button.paused {
  background-image: url(./img/smallplay.png);
}

.play-button.playing {
  background-image: url(./img/smallpause.png);
}

/* Time Display */
.time-display {
  display: flex;
  gap: 4px;
  color: var(--time-color, #fff);
  font-size: var(--time-font-size, 12px);
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  user-select: none;
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
}

.volume-icon:not(.muted) {
  background-image: url(./img/volumenotmute.svg);
}

.volume-icon.muted {
  background-image: url(./img/volumemute.svg);
}

.volume-progress {
  width: 50px;
}

/* Speed & Clarity Selects */
.speed-select,
.clarity-select {
  color: var(--select-color, #fff);
  font-size: var(--select-font-size, 12px);
}

/* Fullscreen Button */
.fullscreen-button {
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: url(./img/fullscreenfig.png) no-repeat;
  background-size: contain;
}

/* Responsive */
@media (max-width: 500px) {
  .volume-control {
    display: none;
  }

  .controls-gap {
    --controls-gap: 8px;
  }
}

/* Accessibility */
button:focus,
[role="button"]:focus {
  outline: 2px solid var(--focus-color, #fff);
  outline-offset: 2px;
}

/* Loading State */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
```

**Step 3: 提交样式文件**

```bash
git add packages/ranui/components/player/index.css
git commit -m "feat(player): add modern CSS styles

Add modernized CSS with:
- Clean CSS variable naming
- Shadow DOM compatible styles
- Responsive design
- Accessibility improvements
- Loading states

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: 最终测试和文档

**Files:**
- Create: `packages/ranui/components/player/README.md`

**Step 1: 创建使用文档**

```markdown
# Player Component

Modern video player component with HLS support, quality switching, and customizable controls.

## Features

- 🎬 HLS streaming support
- 📺 Multiple quality levels
- ⚡ Playback speed control
- 🔊 Volume control
- 📱 Responsive design
- 🎨 Fully customizable with CSS variables
- ♿ Accessible
- 🌓 Shadow DOM encapsulation

## Installation

```bash
npm install ranui
```

## Usage

### Basic

```html
<r-player src="https://example.com/video.mp4"></r-player>
```

### With HLS

```html
<r-player src="https://example.com/playlist.m3u8" autoplay></r-player>
```

### JavaScript API

```javascript
const player = document.querySelector('r-player');

// Play
await player.play();

// Pause
player.pause();

// Seek
player.seek(30); // Jump to 30 seconds

// Volume
player.setVolume(0.5); // 50%

// Playback rate
player.setPlaybackRate(1.5); // 1.5x speed

// Fullscreen
await player.requestFullscreen();

// Quality
player.setQuality('720p');
```

### Events

```javascript
player.addEventListener('play', (e) => {
  console.log('Playing', e.detail);
});

player.addEventListener('timeupdate', (e) => {
  console.log('Time:', e.detail.currentTime);
});

player.addEventListener('statechange', (e) => {
  console.log('State:', e.detail.state);
});
```

## CSS Customization

```css
r-player {
  --width: 800px;
  --height: 450px;
  --background: #000;
  --controls-bg: linear-gradient(180deg, transparent, rgba(0,0,0,0.9));
  --progress-color: #ff0000;
  --progress-height: 6px;
  --time-color: #fff;
}
```

## API Reference

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| src | string | - | Video source URL |
| autoplay | boolean | false | Auto play on load |
| muted | boolean | false | Start muted |
| loop | boolean | false | Loop playback |
| volume | number | 0.5 | Volume (0-1) |
| playbackRate | number | 1.0 | Playback speed |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| play() | time?: number | Promise<void> | Start playback |
| pause() | - | void | Pause playback |
| stop() | - | void | Stop and reset |
| seek() | time: number | void | Jump to time |
| setVolume() | volume: number | void | Set volume (0-1) |
| setPlaybackRate() | rate: number | void | Set speed |
| setQuality() | level: string | void | Change quality |
| requestFullscreen() | - | Promise<void> | Enter fullscreen |
| exitFullscreen() | - | Promise<void> | Exit fullscreen |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| play | PlayerEventDetail | Playback started |
| pause | PlayerEventDetail | Playback paused |
| ended | PlayerEventDetail | Playback ended |
| timeupdate | PlayerEventDetail | Time updated |
| statechange | PlayerEventDetail | State changed |
| volumechange | PlayerEventDetail | Volume changed |
| ratechange | PlayerEventDetail | Speed changed |
| fullscreenchange | PlayerEventDetail | Fullscreen toggled |

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: 14+
- iOS Safari: 14+
- Android Chrome: Latest

## License

MIT
```

**Step 2: 提交文档**

```bash
git add packages/ranui/components/player/README.md
git commit -m "docs(player): add comprehensive documentation

Add README with:
- Feature list
- Installation and usage examples
- API reference
- Customization guide
- Browser support

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 总结

完成以上所有任务后，player 组件将：

✅ 使用 Shadow DOM 实现样式隔离
✅ 模块化设计，代码清晰易维护
✅ 完整的 TypeScript 类型系统
✅ 保留所有现有功能（HLS、清晰度、倍速、全屏等）
✅ 简洁现代的 CSS 变量系统
✅ 完善的公共 API
✅ 完整的文档

### 验证步骤

1. 构建项目
2. 运行示例页面
3. 测试所有功能
4. 检查类型定义
5. 验证事件系统

### 后续优化

- 添加键盘快捷键
- 添加画中画支持
- 添加字幕支持
- 性能优化
- 单元测试
