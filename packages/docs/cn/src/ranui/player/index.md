# r-player 视频播放器

基于`hlsjs`和`web components`，让原生的标签`r-player`拥有统一的视频控件。
不采用`new Player(options)`的方式挂载到指定`dom`，视图的归视图，逻辑的归逻辑，所见及所得，更加直观。

1. 可拖拽进度条
2. 音量控制
3. 根据当前带宽自适应码率切换
4. 手动清晰度切换
5. 倍速播放
6. 样式自定义覆盖
7. `hls`协议标准加密视频播放
8. 基于原生开发，可在所有框架运行，统一跨框架情况
9. 各浏览器控件统一

## 代码演示

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

```xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
```

## 属性

### src

视频的资源地址

### volume

设置初始音量，默认 0.5

### currentTime

设置初始播放时间，默认从头开始播放

### playbackRate

设置倍速，默认 1.0

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
