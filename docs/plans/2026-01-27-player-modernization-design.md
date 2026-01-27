# Player 组件现代化重构设计

**日期**: 2026-01-27
**目标**: 对 player 组件进行现代化重构，提升代码质量和可维护性
**原则**: 保留所有现有功能，不考虑向后兼容性

## 一、架构概览

### 核心改进

1. **Shadow DOM** - 使用 Shadow DOM 实现样式隔离和更好的封装
2. **模块化拆分** - 将 1000+ 行的单文件拆分为多个职责清晰的模块
3. **类型系统** - 完善的 TypeScript 类型定义
4. **事件系统** - 使用 CustomEvent 提供一致的事件接口

### 文件结构

```
player/
  ├── index.ts              # 主入口，导出组件
  ├── types.ts              # 类型定义
  ├── player.ts             # 主组件类
  ├── video-manager.ts      # 视频播放管理
  ├── controls-manager.ts   # 控制栏管理
  ├── progress-manager.ts   # 进度条管理
  ├── hls-manager.ts        # HLS 流管理
  ├── fullscreen-manager.ts # 全屏管理
  ├── index.css             # 样式文件（现代化简洁版本）
  └── img/                  # 图片资源（保留）
```

## 二、类型系统设计

### 核心类型（types.ts）

```typescript
// 播放器状态
export type PlayerState =
  | 'idle' | 'loading' | 'ready'
  | 'playing' | 'paused' | 'ended'
  | 'error' | 'buffering';

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
  | 'play' | 'pause' | 'playing' | 'ended'
  | 'timeupdate' | 'volumechange' | 'ratechange'
  | 'loadstart' | 'loadeddata' | 'canplay'
  | 'error' | 'seeking' | 'seeked'
  | 'fullscreenchange' | 'qualitychange'
  | 'statechange';

// HLS 相关类型（保留现有）
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
```

## 三、主组件设计

### Player 类（player.ts）

```typescript
export class Player extends HTMLElementSSR {
  // Shadow DOM
  private _shadowRoot!: ShadowRoot;

  // 管理器实例
  private _videoManager!: VideoManager;
  private _controlsManager!: ControlsManager;
  private _progressManager!: ProgressManager;
  private _hlsManager?: HlsManager;
  private _fullscreenManager!: FullscreenManager;

  // 状态
  private _state: PlayerState = 'idle';
  private _config: PlayerConfig = {};

  // 生命周期
  constructor();
  connectedCallback();
  disconnectedCallback();
  attributeChangedCallback();

  // 公共 API - 播放控制
  public play(time?: number): Promise<void>;
  public pause(): void;
  public stop(): void;
  public seek(time: number): void;

  // 公共 API - 音量和倍速
  public setVolume(value: number): void;
  public getVolume(): number;
  public mute(): void;
  public unmute(): void;
  public setPlaybackRate(rate: number): void;
  public getPlaybackRate(): number;

  // 公共 API - 时间
  public getCurrentTime(): number;
  public setCurrentTime(time: number): void;
  public getDuration(): number;

  // 公共 API - HLS
  public setQuality(level: string): void;
  public getQualities(): Level[];

  // 公共 API - 全屏
  public requestFullscreen(): Promise<void>;
  public exitFullscreen(): Promise<void>;
  public toggleFullscreen(): Promise<void>;

  // 公共 API - 工具
  public destroy(): void;
  public reset(): void;

  // 私有方法
  private setupManagers(): void;
  private setupEventListeners(): void;
  private handleStateChange(state: PlayerState): void;
  private emitEvent(name: string, detail: any): void;
}
```

## 四、管理器模块设计

### 1. VideoManager（视频播放管理）

**职责**：
- 创建和配置 video 元素
- 处理所有 video 原生事件（canplay, timeupdate, error 等）
- 管理播放状态（play, pause, seek）
- 音量和倍速控制

**接口**：
```typescript
class VideoManager {
  constructor(container: HTMLElement);

  public play(time?: number): Promise<void>;
  public pause(): void;
  public setCurrentTime(time: number): void;
  public setVolume(volume: number): void;
  public setPlaybackRate(rate: number): void;
  public getVideoElement(): HTMLVideoElement;
  public destroy(): void;
}
```

### 2. ControlsManager（控制栏管理）

**职责**：
- 创建和渲染控制栏 UI（播放按钮、时间显示、音量、倍速等）
- 管理控制栏的显示/隐藏逻辑
- 处理用户交互（点击、hover）
- 响应式布局（移动端适配）

**接口**：
```typescript
class ControlsManager {
  constructor(container: HTMLElement, config: ControlsConfig);

  public show(): void;
  public hide(): void;
  public updateTime(current: number, duration: number): void;
  public updatePlayState(playing: boolean): void;
  public updateVolume(volume: number): void;
  public updatePlaybackRate(rate: number): void;
  public destroy(): void;
}
```

### 3. ProgressManager（进度条管理）

**职责**：
- 进度条渲染和更新
- 拖拽交互处理
- 鼠标悬停预览
- 使用 requestAnimationFrame 优化性能

**接口**：
```typescript
class ProgressManager {
  constructor(container: HTMLElement);

  public updateProgress(percentage: number): void;
  public handleDragStart(): void;
  public handleDragMove(percentage: number): void;
  public handleDragEnd(percentage: number): void;
  public showPreview(time: number, position: number): void;
  public hidePreview(): void;
  public destroy(): void;
}
```

### 4. HlsManager（HLS 流管理）

**职责**：
- HLS.js 初始化和配置
- 清晰度切换
- 错误处理和降级
- manifest 加载和解析

**接口**：
```typescript
class HlsManager {
  constructor(video: HTMLVideoElement);

  public loadSource(url: string): void;
  public switchQuality(level: string): void;
  public getQualities(): Level[];
  public destroy(): void;
}
```

### 5. FullscreenManager（全屏管理）

**职责**：
- 全屏 API 兼容性处理
- 全屏状态监听
- 键盘快捷键（Escape 退出等）

**接口**：
```typescript
class FullscreenManager {
  constructor(element: HTMLElement);

  public enter(): Promise<void>;
  public exit(): Promise<void>;
  public toggle(): Promise<void>;
  public isFullscreen(): boolean;
  public destroy(): void;
}
```

## 五、事件系统

### 统一的事件分发

```typescript
class EventEmitter {
  emit(type: PlayerEventType, detail: PlayerEventDetail): void {
    this.dispatchEvent(new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true
    }));
  }
}
```

### 事件使用示例

```typescript
player.addEventListener('statechange', (e) => {
  console.log('State:', e.detail.state);
});

player.addEventListener('timeupdate', (e) => {
  console.log('Time:', e.detail.currentTime, '/', e.detail.duration);
});
```

## 六、样式系统

### Shadow DOM 样式

使用简洁的现代化 CSS 变量命名，不考虑向后兼容：

```css
:host {
  display: block;
  width: var(--width, 100%);
  height: var(--height, 100%);
  position: relative;
  background: var(--background, #000);
}

.controls {
  background: var(--controls-bg, linear-gradient(180deg, transparent, rgba(0,0,0,0.7)));
  padding: var(--controls-padding, 16px);
  opacity: var(--controls-opacity, 0);
  transition: opacity 0.3s;
}

.progress {
  height: var(--progress-height, 4px);
  background: var(--progress-bg, rgba(255,255,255,0.3));
}

.progress-value {
  background: var(--progress-color, #fff);
}
```

### Shadow DOM 结构

```html
<r-player src="video.mp4">
  #shadow-root
    <div part="container" class="container">
      <video part="video"></video>
      <div part="controls" class="controls">
        <div part="progress" class="progress"></div>
        <div part="toolbar" class="toolbar"></div>
      </div>
    </div>
</r-player>
```

## 七、公共 API

### 属性（Attributes/Properties）

- `src: string` - 视频源
- `autoplay: boolean` - 自动播放
- `muted: boolean` - 静音
- `loop: boolean` - 循环播放
- `volume: number` - 音量 (0-1)
- `playbackRate: number` - 播放速度 (0.5-2.0)
- `currentTime: number` - 当前时间

### 只读属性

- `duration: number` - 总时长
- `paused: boolean` - 是否暂停
- `ended: boolean` - 是否结束
- `state: PlayerState` - 当前状态

### 方法

**播放控制**：
- `play(time?: number): Promise<void>`
- `pause(): void`
- `stop(): void`
- `seek(time: number): void`

**音量和倍速**：
- `setVolume(value: number): void`
- `mute(): void`
- `unmute(): void`
- `setPlaybackRate(rate: number): void`

**HLS**：
- `setQuality(level: string): void`
- `getQualities(): Level[]`

**全屏**：
- `requestFullscreen(): Promise<void>`
- `exitFullscreen(): Promise<void>`
- `toggleFullscreen(): Promise<void>`

## 八、使用示例

### JavaScript 使用

```typescript
// 创建播放器
const player = document.createElement('r-player');
player.src = 'https://example.com/video.m3u8';
player.autoplay = true;
document.body.appendChild(player);

// 监听事件
player.addEventListener('statechange', (e) => {
  console.log('State:', e.detail.state);
});

// 控制播放
await player.play();
player.pause();
player.seek(30);

// 设置倍速
player.setPlaybackRate(1.5);
```

### HTML 使用

```html
<r-player
  src="video.m3u8"
  autoplay
  style="--progress-color: #ff0000; --controls-bg: rgba(0,0,0,0.9)">
</r-player>
```

## 九、实施计划

### 阶段 1：类型和基础设施
1. 创建 `types.ts` 文件
2. 创建基础 `player.ts` 框架
3. 设置 Shadow DOM 基础结构

### 阶段 2：核心管理器
1. 实现 `VideoManager`
2. 实现 `ProgressManager`
3. 实现 `FullscreenManager`

### 阶段 3：高级功能
1. 实现 `HlsManager`
2. 实现 `ControlsManager`
3. 集成所有管理器

### 阶段 4：样式和优化
1. 创建现代化 CSS
2. 性能优化
3. 测试和调试

## 十、迁移说明

由于不考虑向后兼容性，用户需要：
1. 更新 CSS 变量名称（从 `--ran-player-*` 到简洁命名）
2. 使用新的事件系统
3. 适应 Shadow DOM 封装

## 总结

这个现代化重构将：
- ✅ 保留所有现有功能（HLS、清晰度、倍速、全屏等）
- ✅ 使用 Shadow DOM 实现封装
- ✅ 模块化拆分，代码更易维护
- ✅ 完整的 TypeScript 类型系统
- ✅ 简洁现代的 API 和样式系统
- ✅ 不考虑向后兼容，完全现代化
