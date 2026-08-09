---
description: 'ranui Player（<r-player>）在原生 <video> 之上封装统一控制栏：播放、进度拖拽、音量、倍速与全屏，支持 HLS/DASH/FLV/WebRTC 流媒体。'
---

# Player 播放器

一个原生的 `<r-player>` 媒体元素，在 `<video>` 之上封装了统一的控制栏、进度拖拽、音量控制、播放倍速、全屏，以及 HLS/DASH/FLV/WebRTC 流媒体播放。

> **适用场景**：需要一个带内置控制栏、进度拖拽、播放倍速、全屏以及 HLS/DASH/FLV/WebRTC 流媒体支持的视频播放器——`<r-player>` 封装了 `<video>`，能在各个框架下不做改动直接运行。

基于 Web Components 构建，`hls.js`/`dashjs`/`mpegts.js` 按各自格式按需懒加载，所以同一个播放器能在各框架间不做改动直接运行。源码里实际具备的能力：

- 带缓冲指示和悬停时间提示的可拖拽进度条
- 音量控制与静音切换
- 播放倍速选择
- 全屏切换（`Esc` 退出）
- 画中画（Picture-in-Picture）切换——只在浏览器真正支持时才渲染按钮
- AirPlay / Remote Playback 投屏按钮——浏览器自带的设备选择器，用和画中画一样的方式做特性检测
- 移动端手势——双击左/右半边快退/快进 10 秒，右半边竖向滑动调节音量（仅触摸生效；鼠标/触控笔交互不受影响）
- 缩略图预览——把 `thumbnails` 设为 WebVTT 雪碧图 manifest 地址，进度条悬停提示上方会出现裁剪后的预览图
- `poster` / `autoplay` / `loop` / `muted`——标准 `<video>` 属性，直接透传
- 字幕/CC——设置 `tracks` 属性，浏览器原生渲染字幕 cue，语言选择器会记住用户的选择
- 错误 + 重试——播放致命错误时默认弹出 `Modal.error()` 对话框，可通过 `disable-error-modal` 关闭
- 断点续播——通过 `remember-position` 选择开启，存到 `localStorage`，按 `src` 区分
- QoE 埋点——`getMetrics()` 从现有事件流里算出卡顿次数/时长、首帧耗时、清晰度切换次数、错误次数
- HLS（`.m3u8`）和 DASH（`.mpd`）播放，支持自动码率切换和手动清晰度选择；FLV/原始 MPEG-TS（`.flv`/`.ts`）通过 `mpegts.js` 播放——每个引擎都按需懒加载，无需手动配置。当 URL 的扩展名探测不出来时，可以用 `format` 属性强制指定引擎（或者退回原生 `<video src>`）。
- WebRTC 低延迟直播，通过 WHEP 协议（`format="webrtc"`，`src` 是 WHEP 端点地址）——没有库依赖，`RTCPeerConnection` 是浏览器原生 API。
- 键盘快捷键：`Space` 播放/暂停，`ArrowLeft`/`ArrowRight` 快退/快进 5 秒，`Escape` 退出全屏，聚焦进度条时的 `Home`/`End`/方向键

## 快速开始

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</Demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> 该元素渲染为 `display: block`。请给它一个明确的宽高（内联样式或 CSS），视频才有盒子可以填充。

## API 参考

### 属性

| 属性                   | 类型                   | 默认值  | 说明                                                                                     |
| ---------------------- | ---------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `src`                  | `string`               | `''`    | 视频资源地址。改变它会重新加载播放器。引擎（HLS/native）按扩展名自动探测。               |
| `format`               | `string`               | `''`    | 强制指定引擎——`hls`/`dash`/`flv`/`webrtc`/`native`——代替按 `src` 扩展名自动探测。适用于拿不到扩展名的加签/无后缀流地址；`webrtc` **必须**显式指定（WHEP 端点没有扩展名可探测）。改变它会重新加载播放器。 |
| `volume`               | `string`               | `''`    | 初始音量，`0`–`100` 制——和 `setVolume()`/`getVolume()` 是同一套刻度。                   |
| `currentTime`          | `string`               | `''`    | 初始播放位置（秒）。也接受小写形式 `currenttime`。                                       |
| `playbackRate`         | `string`               | `''`    | 播放倍速（如 `1`、`1.5`、`2`）。也接受小写形式 `playbackrate`。                          |
| `debug`                | `string`               | `''`    | 为真值时，把每个内部 `change` 事件和警告都打印到控制台。                                 |
| `sheet`                | `string`               | `''`    | 注入组件 shadow DOM 的自定义样式文本。                                                   |
| `poster`               | `string`               | `''`    | 播放开始前显示的封面图 URL。直接透传给 `<video poster>`。                                |
| `autoplay`             | `boolean`              | `false` | 布尔属性——出现即为 `true`，等价于原生 `<video autoplay>`。多数浏览器要求同时设置 `muted` 才能在无用户交互时自动播放。 |
| `loop`                 | `boolean`              | `false` | 布尔属性——播放结束后循环，等价于原生 `<video loop>`。                                    |
| `muted`                | `boolean`              | `false` | 布尔属性——初始静音。内部会同时把音量设为 `0`（保证静音图标/滑块状态一致）**以及**设置原生 `<video>.muted` 标志（满足浏览器的静音自动播放策略）。移除该属性会恢复之前的音量。 |
| `thumbnails`           | `string`               | `''`    | WebVTT 雪碧图 manifest 的地址——在进度条悬停提示上方显示裁剪后的缩略图。详见下方[缩略图预览](#缩略图预览-thumbnails)。和 `src` 无关：只有这个属性本身变化时才会重新抓取。 |
| `disable-error-modal`  | `boolean`              | `false` | 关闭内置的错误 + 重试对话框——错误依然会通过 `error`/`sourceerror` 这两个 `change` 事件到达你手上，可以在此基础上搭自己的 UI。 |
| `remember-position`    | `boolean`              | `false` | 开启断点续播：`pause` 时和标签页切到后台时把当前播放位置存到 `localStorage`（按 `src` 区分），下次加载同一个 `src` 时恢复，播放结束后清除。 |
| `tracks`               | `PlayerTrackConfig[]`  | `[]`    | 字幕/CC 轨道——**只有 JS 属性，没有对应的 HTML attribute**（播放器每次加载都会清空自己的 light DOM，声明式的 `<track>` 子标签活不下来）。详见下方[字幕/CC](#字幕-cc-tracks)。 |

> 观察的属性列表（来自 `observedAttributes`）：`src`、`format`、`volume`、`currentTime`/`currenttime`、`playbackRate`/`playbackrate`、`debug`、`sheet`、`poster`、`thumbnails`、`autoplay`、`loop`、`muted`、`disable-error-modal`、`remember-position`。

### 视频源 `src`

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</Demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### WebRTC 低延迟直播 `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

低延迟直播场景下，把 `format` 设为 `webrtc`，`src` 指向一个 **WHEP**（WebRTC-HTTP Egress Protocol）端点——Cloudflare Stream、LiveKit egress、Millicast 这类平台暴露的就是这种端点。这个引擎没有库依赖：`RTCPeerConnection` 和 `fetch` 都是浏览器原生 API，不像 HLS/DASH/FLV 那样有一个懒加载的 chunk 要下载。WHEP 端点没有文件扩展名可以自动探测，所以 `format="webrtc"` 是**必须**显式指定的，不会从 `src` 推断出来。

实现细节：创建一个带 `recvonly` 音视频 transceiver 的 `RTCPeerConnection`，等 ICE 收集完成后把 SDP offer `POST` 到 `src`（`Content-Type: application/sdp`），把响应体里的 SDP answer 应用上去，再把收到的媒体流通过 `video.srcObject` 挂上去。结束播放时会向服务端在响应 `Location` 头里返回的会话资源地址发 `DELETE`。范围有意控制得比较克制：用的是非 trickle 的 ICE（等几秒钟，收集到多少候选就用多少），而不是 WHEP 基于 PATCH 的 trickle 机制，也没有解析 `Link: rel="ice-server"` 响应头拿服务端下发的 STUN/TURN 提示——大多数可以直连的 WHEP 部署这两个都不需要。和 FLV 一样没有清晰度选择器：WHEP 没有客户端可用的标准多码率切换机制，所以这个引擎下 `getMetrics()` 的 `qualitySwitchCount` 会一直是 `0`。

### 初始音量 `volume`

取值范围是 `0`–`100`。

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### 初始播放时间 `currentTime`

从媒体开头算起的秒数。

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### 播放倍速 `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### 调试日志 `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### 封面图、自动播放、循环、静音

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" poster="/ran/hls/poster.jpg" autoplay muted loop></r-player>
```

### 画中画

只有当 `document.pictureInPictureEnabled` 为真时，控制栏里的画中画按钮才会出现——不支持的浏览器里不会有一个点了没反应的死按钮。也可以用 `togglePip()` 以代码方式切换。

### AirPlay / Remote Playback

只有当浏览器支持标准的 Remote Playback API（`videoElement.remote.prompt()`，Chrome/Edge）或者 Safari 的 `webkitShowPlaybackTargetPicker()`（AirPlay）中的一种时，投屏按钮才会出现；其他情况下是隐藏而不是禁用——和画中画一样是渐进增强。用 `showRemotePlaybackPicker()` 以代码方式打开设备选择器。

### 移动端手势

仅触摸生效，默认开启，不需要设置任何属性：双击视频左半边快退 10 秒，双击右半边快进 10 秒（会有一个简短的 `-10s`/`+10s` 提示浮层确认），在右半边竖向拖动可以调节音量。鼠标和触控笔的交互完全不受影响——单指点击依然是切换播放/暂停，只是复用了判断双击的同一个时间窗口做防抖，这样双击快进/快退时中间不会先闪一下播放状态。触发 `gestureseek` change 事件（`{ direction, seconds }`），音量滑动则复用已有的 `volume` 事件。

### 缩略图预览 `thumbnails`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` 指向一个 WebVTT manifest，cue 内容遵循 YouTube / Video.js 的雪碧图约定——每条 cue 的文本是一张图片引用加 `#xywh=x,y,w,h` 片段，标出要从共享雪碧图里裁剪的那一块：

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

图片引用会相对 VTT 文件自己的 URL 解析，所以雪碧图和 manifest 放在同一目录时不用写绝对路径。鼠标悬停（或拖动）进度条时，会在原有的时间提示框上方显示当前时间点对应的裁剪缩略图；没设置 `thumbnails`，或 manifest 还没加载完成时，什么都不会渲染。manifest 只在 `thumbnails` 这个属性本身变化时抓取解析一次，和 `src` 无关——切换清晰度/源不会重新拉取它。

### 字幕/CC `tracks`

```js
const player = document.querySelector('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
```

每一项会变成挂在原生 `<video>` 上的 `<track>`——字幕 cue 渲染完全交给浏览器，播放器不做任何自定义绘制。控制栏会出现一个语言选择器（一个 `<r-select>`，交互方式和清晰度选择器一样），包含 **Off** 加每条 track 一项；选择语言会存到 `localStorage`（全局偏好，不分视频），下次页面上任何拿到 `tracks` 的 `<r-player>` 都会自动应用——如果之前没存过，就回退到配置里 `default: true` 的那条。把 `tracks` 设为 `[]` 会移除语言选择器和所有轨道。`setSubtitleLanguage(lang)` 可以用代码方式设置当前语言（`lang` 是某条 track 的 `srclang`，或者 `'off'`）。

### 错误 + 重试

默认开启。流媒体引擎的致命错误或者原生 `<video>` 的 `error` 事件会弹出一个 `Modal.error()` 对话框（懒加载——不出错的话 `r-modal` 根本不会被下载），带一个**重试**按钮重新加载播放器。设置 `disable-error-modal` 可以关掉这个默认行为，改成自己接 `error`/`sourceerror` change 事件处理。非致命的引擎错误（hls.js 会自己内部恢复）不会触发这个对话框。

### 断点续播 `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

在 `pause` 时和标签页切到后台时（`visibilitychange`，比 `beforeunload` 更可靠）把 `getCurrentTime()` 存到 `localStorage`（按 `src` 区分），下次加载同一个 `src` 时恢复，播放到 `ended` 后清除。如果保存的位置距离总时长不到 2 秒会静默跳过——播完的视频会重新开始，而不是"续播"到自己的结尾。只记播放位置，音量/倍速/字幕这些偏好是各自独立的选择开启项。

### QoE 埋点

```js
const player = document.querySelector('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
```

`getMetrics()` 返回一个从下面文档的同一个 `change` 事件流派生出的普通对象快照——不需要额外开启任何跟踪：

| 字段                  | 类型              | 说明                                                            |
| --------------------- | ----------------- | ---------------------------------------------------------------- |
| `rebufferCount`       | `number`          | `waiting`→`playing` 的转换次数（卡顿后恢复播放的次数）。         |
| `rebufferDuration`    | `number`          | 所有卡顿累计耗时（毫秒）。                                       |
| `firstFrameMs`        | `number \| null`  | 从当前 `src` 开始加载到首帧可播放的耗时（毫秒）；首帧出现前为 `null`。 |
| `qualitySwitchCount`  | `number`          | 用户在清晰度选择器里切换档位的次数。                             |
| `errorCount`          | `number`          | `error`/`sourceerror` 事件的次数。                               |

每次加载新的 `src`/`format` 都会重置这份快照——它永远只描述**当前**这个源，不是跨源的累计值。

## 方法

播放器在元素实例上暴露了以下命令式控制方法：

| 方法                                          | 说明                                                       |
| --------------------------------------------- | ------------------------------------------------------------ |
| `play(time?)`                                 | 开始播放，可选跳转到 `time`（秒）。                          |
| `pause()`                                     | 暂停播放。                                                    |
| `getCurrentTime()`                            | 当前播放位置（秒）。                                          |
| `setCurrentTime(seconds)`                     | 跳转到指定位置。                                              |
| `getTotalTime()`                              | 媒体总时长（秒）。                                            |
| `getVolume()` / `setVolume(v)`                | 读取/设置音量，`0`–`100` 制——和 `volume` 属性同一套刻度。    |
| `getPlaybackRate()` / `setPlaybackRate(n)`    | 读取/设置倍速。                                               |
| `customRequestFullscreen()`                   | 进入全屏。返回一个 `Promise`。                                |
| `customExitFullscreen()`                      | 退出全屏。返回一个 `Promise`。                                |
| `togglePip()`                                 | 进入/退出画中画。不支持或没有加载源时是空操作。               |
| `setSubtitleLanguage(lang)`                   | 按 `srclang` 设置当前字幕轨道，或传 `'off'` 关闭。            |
| `getMetrics()`                                | 读取当前的 [QoE 埋点](#qoe-埋点) 快照。                       |
| `showRemotePlaybackPicker()`                  | 打开浏览器自带的 AirPlay/Remote Playback 设备选择器。不支持或没有加载源时是空操作。 |

## 事件

播放器只派发一个 `change` CustomEvent。所有内部状态变化——原生媒体事件和播放器自己的 UI 动作——都会汇入这一个事件，所以只需要订阅一次，然后按 `detail.type` 分支处理。

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` 就是 <r-player> 实例本身
  });
</script>
```

### `detail` 载荷

| 属性          | 类型      | 说明                       |
| ------------- | --------- | -------------------------- |
| `type`        | `string`  | 发生变化的事件类型。       |
| `data`        | `unknown` | 和这次变化关联的值/事件。 |
| `currentTime` | `number`  | 当前播放时间（秒）。       |
| `duration`    | `number`  | 媒体总时长（秒）。         |
| `tag`         | `Element` | `<r-player>` 实例本身。    |

### `detail.type` 取值

从底层 `<video>` 转发的原生媒体状态：

| 类型             | 说明                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `canplay`        | 有足够数据可以开始播放。                                            |
| `canplaythrough` | 可以不缓冲地播放到结束。                                            |
| `complete`       | 渲染完成。                                                          |
| `durationchange` | `duration` 值发生变化。                                             |
| `emptied`        | 媒体内容被清空/重新加载。                                           |
| `ended`          | 播放到达结尾。                                                      |
| `error`          | 发生媒体错误（除非设了 `disable-error-modal`，否则也会弹出内置的错误+重试对话框）。 |
| `loadstart`      | 浏览器开始加载媒体。                                                |
| `loadedmetadata` | 元数据已加载。                                                      |
| `loadeddata`     | 首帧已加载。                                                        |
| `progress`       | 资源加载期间周期性触发。                                            |
| `ratechange`     | 播放速率发生变化。                                                  |
| `seeking`        | 跳帧（seek）开始。                                                  |
| `seeked`         | 跳帧（seek）完成。                                                  |
| `stalled`        | 浏览器正尝试获取数据但数据没有到达。                                |
| `suspend`        | 媒体加载被挂起。                                                    |
| `timeupdate`     | `currentTime` 发生变化。                                            |
| `volumechange`   | video 元素的音量发生变化。                                          |
| `waiting`        | 播放因等待数据而停止。                                              |
| `play`           | 播放已开始。                                                        |
| `playing`        | 缓冲/暂停之后播放恢复。                                             |
| `pause`          | 播放已暂停。                                                        |

播放器自身的动作：

| 类型                | `data`                    | 说明                                                                                     |
| ------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| `volume`            | `number`（`0`–`100`）     | 通过控制栏或静音切换改变了音量。                                                          |
| `speed`             | `number`                  | 通过倍速选择器改变了播放速度。                                                            |
| `fullscreen`        | `boolean`                 | 进入（`true`）或退出（`false`）全屏。                                                     |
| `pictureinpicture`  | `boolean`                 | 进入（`true`）或退出（`false`）画中画——不管是通过 `togglePip()` 还是浏览器自己的画中画窗口控件触发的。 |
| `subtitlechange`    | `string`                  | 通过 CC 选择器或 `setSubtitleLanguage()` 切换了字幕语言——一个 `srclang`，或 `'off'`。       |
| `resume`            | `number`                  | 加载时静默恢复了保存的位置（`remember-position`）；`data` 是恢复到的秒数。                 |
| `levelsready`       | `{ levels }`               | 流媒体引擎解析完 manifest，清晰度档位已可用。                                             |
| `sourceerror`       | `{ fatal, detail }`        | 发生流媒体引擎错误（回退到原始 `src`；**致命**错误在没设 `disable-error-modal` 时还会弹出错误+重试对话框——非致命错误是引擎自己的内部恢复，不会弹）。 |
| `qualityswitch`     | `{ level }`                | 用户在清晰度选择器里选择了一个档位。                                                       |
| `gestureseek`       | `{ direction, seconds }`   | 双击快进/快退手势触发（`direction` 是 `'forward'`/`'backward'`）。                          |

## 插槽

播放器不接受插槽内容：它会在构造函数里以及每次加载源时清空自己的 light DOM 子节点（`this.innerHTML = ''`）。如果需要自定义覆盖层，请改用 `sheet` 属性来注入样式。

## 最佳实践

- **尺寸**：宿主元素是 `display: block`，没有固有尺寸——务必给它一个明确的宽高，否则视频区域会塌陷。
- **流媒体引擎**：`.m3u8`（HLS）、`.mpd`（DASH）、`.flv`/`.ts`（通过 `mpegts.js` 的 FLV/MPEG-TS）这些源都会自动懒加载对应引擎，无需手动配置。如果 URL 的扩展名探测不出来（无后缀/加签的 CDN 地址），请显式设置 `format` 属性（比如 `format="dash"`），不要依赖自动探测。WebRTC（`format="webrtc"`）永远需要显式指定——WHEP 端点没有任何东西可以探测。
- **单一监听器**：优先用一个 `change` 监听器配合 `switch (detail.type)`，而不是给很多事件各挂一个处理函数——所有状态都流经 `change`。
- **音量单位**：`volume`（属性）、`setVolume()`/`getVolume()`，以及 `volume` change 事件的载荷，全部使用同一套 `0`–`100` 刻度。只有底层原生 `<video>.volume` 是 `0`–`1`——播放器只在这一个边界上做转换。
- **画中画是渐进增强**：浏览器不支持时按钮是隐藏而不是禁用——不要假设它一定存在于 DOM 里。
- **自定义样式**：用 `sheet` 属性注入 shadow DOM 的 CSS；播放器本身没有导出任何 `::part()`。

## Roadmap

`<r-player>` 还在持续演进。字幕/CC、错误+重试 UI、断点续播（第一阶段）；基于引擎无关适配器架构的 DASH 和 FLV/原始 MPEG-TS 播放（第二阶段）；QoE 埋点、AirPlay/Remote Playback、移动端手势、缩略图预览（第三阶段）；以及 WebRTC/WHEP 直播和把播放器自己的控制栏图标迁移到 `<r-icon>`（第四阶段）都已完成。完整拆解见仓库里的 [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md)。
