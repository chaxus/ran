---
description: 'ranui Player（<r-player>）在原生 <video> 之上封装统一控制栏：播放、进度拖拽、音量、倍速与全屏，支持 HLS/DASH/FLV 流媒体。'
---

# r-player 视频播放器

基于 `web components`，让原生的标签`r-player`拥有统一的视频控件；`hls.js`/`dashjs`/`mpegts.js` 按需懒加载，分别对应 HLS/DASH/FLV 三种格式。
不采用`new Player(options)`的方式挂载到指定`dom`，视图的归视图，逻辑的归逻辑，所见及所得，更加直观。

1. 可拖拽进度条
2. 音量控制
3. 根据当前带宽自适应码率切换
4. 手动清晰度切换
5. 倍速播放
6. 样式自定义覆盖
7. `hls`/`dash`/`flv` 流媒体播放，引擎按需懒加载，无需手动引入
8. 基于原生开发，可在所有框架运行，统一跨框架情况
9. 各浏览器控件统一
10. 画中画（Picture-in-Picture）——只在浏览器真正支持时才渲染按钮
11. AirPlay / Remote Playback 投屏按钮——同样只在浏览器支持时才渲染
12. 移动端手势——双击左右两侧快进/快退 10 秒，右侧竖向滑动调节音量（仅触摸生效）
13. `poster`/`autoplay`/`loop`/`muted` 原生 `<video>` 属性透传
14. 字幕/CC——原生 `<track>` 渲染，语言选择记住上次的选择
15. 错误 + 重试弹窗——播放失败时默认弹出，可关闭
16. 断点续播——可选开启，存到 `localStorage`
17. QoE 埋点——`getMetrics()` 基于现有事件流算出卡顿次数/时长、首帧耗时、清晰度切换次数、错误次数

## 代码演示

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

```xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
```

## 属性

### src

视频的资源地址，播放引擎（HLS/native）按扩展名自动探测。

### format

强制指定播放引擎——`hls`/`dash`/`flv`/`native`——代替按 `src` 扩展名自动探测，给拿不到扩展名的加签/无后缀流地址用。改这个属性会重新加载播放器。

### volume

设置初始音量，0-100 制，默认 50。`setVolume()`/`getVolume()` 方法与 `volume` change 事件的 `data` 也是同一套 0-100 刻度。

### currentTime

设置初始播放时间，默认从头开始播放

### playbackRate

设置倍速，默认 1.0

### debug

控制台会打印输出一些信息

### poster

初始播放前展示的封面图 URL，透传给 `<video poster>`。

### autoplay

布尔属性，出现即为 `true`，等价于原生 `<video autoplay>`。大多数浏览器要求同时设置 `muted` 才能在没有用户交互的情况下自动播放。

### loop

布尔属性，播放结束后循环播放，等价于原生 `<video loop>`。

### muted

布尔属性，初始静音。内部同时把音量设为 `0`（保证静音图标/滑块和实际状态一致）并设置原生 `<video>.muted`（保证满足浏览器的"静音才允许自动播放"策略）。移除该属性会恢复之前的音量。

### togglePip()

进入/退出画中画的方法。画中画按钮只在 `document.pictureInPictureEnabled` 为真时才会显示。

### showRemotePlaybackPicker()

打开浏览器自带的 AirPlay / Remote Playback 设备选择器。投屏按钮只在浏览器支持标准的 Remote Playback API（`videoElement.remote.prompt()`，Chrome/Edge）或 Safari 的 `webkitShowPlaybackTargetPicker()`（AirPlay）中至少一种时才会显示——和画中画按钮一样是渐进增强，不支持就直接隐藏而不是显示一个点了没反应的按钮。

### 移动端手势

仅触摸生效，默认开启，不需要设置任何属性：双击视频左半边快退 10 秒，双击右半边快进 10 秒（会有一个简短的 `-10s`/`+10s` 提示浮层确认），在右半边竖向拖动可以调节音量。鼠标和触控笔的交互完全不受影响——单指点击依然是切换播放/暂停，只是延迟了和判断双击一样的时间窗口再执行，这样双击快进/快退时中间不会先闪一下播放状态。触发 `gestureseek` change 事件（`{ direction, seconds }`），音量滑动则复用已有的 `volume` 事件。

### disable-error-modal

布尔属性。播放失败（fatal 的引擎错误、原生 `error` 事件）默认会弹出 `Modal.error()` 错误 + 重试弹窗（`r-modal` 懒加载，真的出错才下载），设了这个属性就关掉，改成自己接 `error`/`sourceerror` change 事件做自定义 UI。

### remember-position

布尔属性，开启断点续播：`pause` 时和标签页切到后台时把当前播放位置存到 `localStorage`（按 `src` 分别存），下次加载同一个 `src` 时自动跳转过去，播完（`ended`）后清掉。离结尾不到 2 秒的位置不会续播（避免刚看完又跳回结尾）。只记播放位置，不记音量/倍速/字幕这些。

### tracks

字幕/CC 轨道配置，**只有 JS 属性，没有对应的 HTML attribute**（player 每次加载都会清空 light DOM，声明式的 `<track>` 子标签活不下来）：

```js
const player = document.querySelector('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
```

每一项会变成挂在原生 `<video>` 上的 `<track>`，字幕渲染完全交给浏览器，播放器不做任何自定义样式。控制栏会出现一个语言选择器（"Off" + 每条 track 的 `label`，和清晰度选择器交互方式一样），选择结果存在 `localStorage`（全局的，不分视频），下次有 `tracks` 的播放器会自动应用；没存过的话就用配置里 `default: true` 的那条。`setSubtitleLanguage(lang)` 可以用代码切换（`lang` 是某条 track 的 `srclang`，或者 `'off'`）。

### getMetrics()

读取当前源的 QoE（体验质量）快照，数据全部来自播放器已有的 `change` 事件流，不需要额外开启任何东西：

```js
const player = document.querySelector('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
```

| 字段                 | 类型              | 说明                                                         |
| -------------------- | ----------------- | ------------------------------------------------------------ |
| `rebufferCount`      | `number`          | `waiting`→`playing` 的次数（卡顿后恢复播放的次数）           |
| `rebufferDuration`   | `number`          | 所有卡顿累计耗时（毫秒）                                     |
| `firstFrameMs`       | `number \| null`  | 从当前 `src` 开始加载到首帧可播放的耗时（毫秒），首帧出现前为 `null` |
| `qualitySwitchCount` | `number`          | 用户在清晰度选择器里切换档位的次数                           |
| `errorCount`         | `number`          | `error`/`sourceerror` 事件的次数                             |

每次 `src`/`format` 变化重新加载都会重置——快照永远只描述**当前**这个源，不是跨源的累计值。

## 事件`event`

### onchange

监听任何播放器发生的变化，返回的值如下。

可通过这个方法获得`播放器的实例`。

活着通过`type`判断不同的事件类型，进行不同的操作

| 属性        | 说明               | 类型      |
| ----------- | ------------------ | --------- |
| type        | 发生变化的事件类型 | `string`  |
| data        | 事件的值           | `Object`  |
| currentTime | 播放的当前时间     | `number`  |
| duration    | 视频的总时长       | `number`  |
| tag         | 播放器的实例       | `Element` |

其中`type`类型有

| 名称           | 说明                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| canplay        | 浏览器可以播放媒体文件了，但估计没有足够的数据来支撑播放到结束，不必停下来进一步缓冲内容。                        |
| canplaythrough | 浏览器估计它可以在不停止内容缓冲的情况下播放媒体直到结束。                                                        |
| complete       | OfflineAudioContext 渲染完成。                                                                                    |
| durationchange | duration 属性的值改变时触发。                                                                                     |
| emptied        | 媒体内容变为空；例如，当这个 media 已经加载完成（或者部分加载完成），则发送此事件，并调用 load() 方法重新加载它。 |
| ended          | 视频停止播放，因为 media 已经到达结束点。                                                                         |
| loadedmetadata | 已加载元数据。                                                                                                    |
| progress       | 在浏览器加载资源时周期性触发。                                                                                    |
| ratechange     | 播放速率发生变化。                                                                                                |
| seeked         | 跳帧（seek）操作完成。                                                                                            |
| seeking        | 跳帧（seek）操作开始。                                                                                            |
| stalled        | 用户代理（user agent）正在尝试获取媒体数据，但数据意外未出现。                                                    |
| suspend        | 媒体数据加载已暂停。                                                                                              |
| loadeddata     | media 中的首帧已经完成加载。                                                                                      |
| timeupdate     | currentTime 属性指定的时间发生变化。                                                                              |
| volumechange   | 音量发生变化。                                                                                                    |
| waiting        | 由于暂时缺少数据，播放已停止。                                                                                    |
| play           | 播放已开始。                                                                                                      |
| playing        | 由于缺乏数据而暂停或延迟后，播放准备开始。                                                                        |
| pause          | 播放已暂停。                                                                                                      |
| volume         | 音量发生变化。                                                                                                    |
| fullscreen     | 触发全屏事件                                                                                                      |
| pictureinpicture | 画中画进入（`true`）/退出（`false`）——不管是通过 `togglePip()` 还是浏览器自己的画中画窗口控件触发的                |
| subtitlechange | 字幕语言切换（通过选择器或 `setSubtitleLanguage()`），`data` 是 `srclang` 或 `'off'`                                  |
| resume         | `remember-position` 静默恢复了保存的播放位置，`data` 是恢复到的秒数                                                   |
| levelsready    | 播放引擎解析完 manifest，清晰度档位可用了                                                                          |
| sourceerror    | 播放引擎报错（回退到原始 `src`；fatal 错误且没设 `disable-error-modal` 时还会弹错误+重试框）                          |
| qualityswitch  | 用户在清晰度选择器里切换了档位，`data` 是 `{ level }`                                                              |
| gestureseek    | 双击手势触发了快进/快退，`data` 是 `{ direction, seconds }`（`direction` 为 `'forward'`/`'backward'`）              |
