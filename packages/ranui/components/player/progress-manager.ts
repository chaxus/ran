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
    this.progressValue.style.transform = `scaleX(${ percentage})`;
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
