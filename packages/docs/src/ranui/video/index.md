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

<r-player style="display: block;width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

```xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
```

## 属性

### 资源地址`src`
