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
