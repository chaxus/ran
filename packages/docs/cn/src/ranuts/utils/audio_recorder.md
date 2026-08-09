# AudioRecorder

把麦克风录音录制成 `Blob`——不只是包一层 `MediaRecorder`，而是绕开了一个真实存在的浏览器 bug。

Chrome（以及 Chromium 内核浏览器）用 `MediaRecorder` 写出的 WEBM 文件没有时长元数据——文件能播放，但在整个 blob 被完整解码一次之前，跳转和显示时长都会失败。`AudioRecorder` 在请求麦克风、录音之后，会在 `stop()` 时原地修补 WEBM 容器里的时长字段，再把 `Blob` 交出来，这样录出来的文件立刻就能像普通音频文件一样使用。

## 使用

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // 构造时立即请求麦克风权限

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

构造时立即发起 `getUserMedia({ audio: true })`，权限一旦获得就开始录音。没有单独的"预备"步骤——构造本身**就是**权限弹窗。

### `start()`

如果之前 `pause()` 过，则恢复录音。返回底层的 `MediaRecorder`；麦克风流还没就绪时返回 `undefined`。

### `pause()`

暂停正在进行的录音。返回底层的 `MediaRecorder`，或 `undefined`。

### `stop()`

停止录音并返回录制好的 `Blob`——是同步返回的，此时容器修复（`fixDuration`）实际上还没跑完，因为修补时长本身需要先从底层 `MediaRecorder` 的 `stop` 事件里读到完整的缓冲区。实际使用中，这只在你恰好在它 resolve 的那一瞬间去读 `recorder.stop()` 的返回值、而不是稍后再读时才有影响；等下一个微任务，或者在 `dataavailable`/`stop` 的事件序列结束后再读 `recorder.blob`，都是安全的读取时机。

## 注意事项

1. **一个 recorder 对应一条流。** 没有 `destroy()`/销毁方法——麦克风轨道在获得权限之后会一直保持打开状态。不要每次录音都新建一个 `AudioRecorder`，复用同一个实例，反复调用 `start()`/`stop()`。
2. **权限是在构造时请求的，不是在 `start()` 时。** 如果想把浏览器的权限弹窗推迟到用户真正点击录制按钮那一刻，需要推迟的是构造 `AudioRecorder` 本身，而不只是延后调用 `start()`。
3. **时长修复只针对 `audio/webm`。** 浏览器可能选中的其他 MIME 类型（`audio/mp4`、`audio/ogg`、`audio/wav`、`audio/aac`）会原样返回。
4. `getUserMedia` 过程中的错误（权限被拒绝、没有麦克风）只会打印到控制台，不会抛出或者通过回调暴露出来——如果需要在自己的 UI 里展示拒绝提示，请自行监测真实的 `MediaDevices` 弹窗，不要依赖这个类来上报。
