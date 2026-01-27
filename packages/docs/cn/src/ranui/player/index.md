# r-player 视频播放器

现代化的视频播放器组件，支持 HLS 流媒体、清晰度切换和自定义控件。

基于 `hls.js` 和 `Web Components` 构建，采用 Shadow DOM 的现代模块化架构。原生的 `<r-player>` 标签在所有浏览器和框架中提供统一的视频控件。

## 特性

- 🎬 **HLS 流媒体** - 自适应码率流媒体和清晰度切换
- 📺 **多清晰度** - 自动和手动清晰度选择
- ⚡ **倍速播放** - 可变速度控制（0.5x - 2.0x）
- 🔊 **音量控制** - 交互式音量滑块和静音切换
- 📱 **响应式** - 移动端友好的响应式设计
- 🎨 **可定制** - 通过 CSS 变量完全控制样式
- ♿ **无障碍** - 符合 ARIA 标准，支持键盘导航
- 🌓 **Shadow DOM** - 样式封装，更好的隔离性
- 🔧 **模块化** - 清晰的基于管理器的架构
- 🎯 **框架无关** - 适用于 React、Vue、Angular 或原生 JS

## 架构设计

现代化的播放器采用模块化设计，使用专门的管理器：

```
Player (主类)
├── VideoManager - 视频元素和播放控制
├── ProgressManager - 进度条和拖拽交互
├── ControlsManager - UI 控件渲染和更新
├── HlsManager - HLS 流媒体（可选，自动初始化）
└── FullscreenManager - 全屏 API，兼容各浏览器
```

## 代码演示

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

### 基本用法

```html
<r-player src="/ran/hls/example.m3u8"></r-player>
```

### 带属性

```html
<r-player
  src="https://example.com/video.m3u8"
  autoplay
  volume="0.8"
  playbackrate="1.5">
</r-player>
```

### JavaScript API

```javascript
const player = document.querySelector('r-player');

// 播放控制
await player.play();
await player.play(30); // 从 30 秒开始播放
player.pause();
player.stop();
player.seek(60); // 跳转到 60 秒

// 音量控制
player.setVolume(0.8); // 设置为 80%
player.mute();
player.unmute();

// 播放速度
player.setPlaybackRate(1.5); // 1.5 倍速

// 清晰度控制（HLS）
const qualities = player.getQualities();
player.setQuality('720p');

// 全屏
await player.requestFullscreen();
await player.exitFullscreen();
await player.toggleFullscreen();

// 获取状态
console.log(player.state); // 'playing', 'paused' 等
console.log(player.currentTime);
console.log(player.duration);
console.log(player.paused);
```

## 属性

### src

视频源 URL。支持普通视频文件和 HLS 流媒体（`.m3u8`）。

- **类型**: `string`
- **默认值**: `""`

```html
<r-player src="https://example.com/video.mp4"></r-player>
<r-player src="https://example.com/stream.m3u8"></r-player>
```

### autoplay

加载后自动开始播放。

- **类型**: `boolean`
- **默认值**: `false`

```html
<r-player src="video.mp4" autoplay></r-player>
```

### muted

以静音状态开始。

- **类型**: `boolean`
- **默认值**: `false`

```html
<r-player src="video.mp4" muted></r-player>
```

### loop

视频结束后循环播放。

- **类型**: `boolean`
- **默认值**: `false`

```html
<r-player src="video.mp4" loop></r-player>
```

### volume

初始音量（0-1）。

- **类型**: `number`
- **默认值**: `0.5`

```html
<r-player src="video.mp4" volume="0.8"></r-player>
```

### playbackrate

初始播放速度倍率。

- **类型**: `number`
- **默认值**: `1.0`
- **范围**: `0.5` - `2.0`

```html
<r-player src="video.mp4" playbackrate="1.5"></r-player>
```

## 属性（只读）

### state

当前播放器状态。

- **类型**: `PlayerState`
- **可选值**: `'idle'` | `'loading'` | `'ready'` | `'playing'` | `'paused'` | `'ended'` | `'error'` | `'buffering'`

```javascript
console.log(player.state); // 'playing'
```

### currentTime

当前播放位置（秒）。

- **类型**: `number`

```javascript
console.log(player.currentTime); // 45.2
player.currentTime = 60; // 也可以设置
```

### duration

视频总时长（秒）。

- **类型**: `number`

```javascript
console.log(player.duration); // 180.5
```

### paused

是否当前处于暂停状态。

- **类型**: `boolean`

```javascript
console.log(player.paused); // true
```

## 事件

使用标准事件监听器监听播放器事件：

```javascript
player.addEventListener('play', (e) => {
  console.log('开始播放', e.detail);
});

player.addEventListener('timeupdate', (e) => {
  console.log('当前时间:', e.detail.currentTime);
  console.log('总时长:', e.detail.duration);
});

player.addEventListener('statechange', (e) => {
  console.log('新状态:', e.detail.state);
});
```

### 事件详情

所有事件都包含一个 `detail` 对象：

```typescript
{
  currentTime: number;  // 当前播放位置
  duration: number;     // 总时长
  state: PlayerState;   // 当前状态
  volume: number;       // 当前音量（0-1）
  playbackRate: number; // 当前播放速度
}
```

### 可用事件

| 事件 | 说明 |
|-------|-------------|
| `play` | 播放开始 |
| `pause` | 播放暂停 |
| `playing` | 正在播放（缓冲后） |
| `ended` | 播放到达结尾 |
| `timeupdate` | 当前时间变化（频繁触发） |
| `volumechange` | 音量变化 |
| `ratechange` | 播放速度变化 |
| `loadstart` | 开始加载媒体 |
| `loadeddata` | 媒体数据已加载 |
| `canplay` | 可以开始播放 |
| `error` | 发生错误 |
| `seeking` | 跳转开始 |
| `seeked` | 跳转完成 |
| `statechange` | 播放器状态变化 |
| `fullscreenchange` | 全屏状态变化 |
| `qualitychange` | 视频清晰度变化（HLS） |

### 旧版 `onchange` 事件

为了向后兼容，仍然支持 `change` 事件：

```javascript
player.addEventListener('change', (e) => {
  const { type, data, currentTime, duration, tag } = e.detail;
  console.log('事件类型:', type);
  console.log('播放器实例:', tag);
});
```

## 样式定制

使用 CSS 变量自定义播放器外观：

```css
r-player {
  /* 尺寸 */
  --width: 800px;
  --height: 450px;

  /* 背景 */
  --background: #000;

  /* 控制栏 */
  --controls-bg: linear-gradient(180deg, transparent, rgba(0,0,0,0.9));
  --controls-padding: 16px;
  --controls-gap: 12px;

  /* 进度条 */
  --progress-height: 4px;
  --progress-bg: rgba(255,255,255,0.3);
  --progress-color: #ff0000;

  /* 文本 */
  --time-color: #fff;
  --time-font-size: 12px;
  --select-color: #fff;

  /* 过渡效果 */
  --controls-transition: 0.3s;
}
```

### 响应式设计

播放器自动适配移动设备：
- 在屏幕宽度 < 500px 时隐藏音量控制
- 触摸友好的控件
- 优化垂直和水平方向

## 浏览器支持

- Chrome/Edge: 最新版
- Firefox: 最新版
- Safari: 14+
- iOS Safari: 14+
- Android Chrome: 最新版

HLS 支持：
- Safari（iOS/macOS）原生支持
- 其他浏览器通过 hls.js

## 从旧版 API 迁移

如果您正在从旧版本升级：

### 破坏性变更

1. **CSS 变量**：从 `--ran-player-*` 重命名为更简洁的名称（如 `--width`、`--progress-color`）
2. **Shadow DOM**：样式现在被封装。使用 CSS 变量或 `::part()` 进行自定义
3. **事件**：新增 `statechange` 事件用于监控播放器状态

### 保持不变

- ✅ HTML 标签名：`<r-player>`
- ✅ 基本属性：`src`、`volume`、`currentTime`、`playbackrate`
- ✅ 基本方法：`play()`、`pause()` 等
- ✅ 旧版 `change` 事件仍然有效

## TypeScript

完整的 TypeScript 支持，包含导出的类型：

```typescript
import { Player, PlayerState, PlayerEventDetail } from 'ranui';

const player = document.querySelector('r-player') as Player;

player.addEventListener('statechange', (e: CustomEvent<PlayerEventDetail>) => {
  const state: PlayerState = e.detail.state;
});
```

## 许可证

MIT
