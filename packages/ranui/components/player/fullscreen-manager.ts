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
