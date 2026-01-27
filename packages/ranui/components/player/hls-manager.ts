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
    this.hls!.loadSource(url);
    this.hls!.attachMedia(this.video);

    // 监听事件
    this.hls!.on(Hls.Events.MANIFEST_LOADED, (event: string, data: any) => {
      this.handleManifestLoaded(event, data);
    });

    this.hls!.on(Hls.Events.ERROR, (event: string, data: any) => {
      this.handleError(event, data);
    });
  }

  private handleManifestLoaded = (_: string, data: any): void => {
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
