# createSpeechRecognizer / isSpeechRecognitionSupported

Web Speech API 里 `SpeechRecognition` 的封装，是 [`AudioRecorder`](./audio_recorder.md) 的另一半：`AudioRecorder` 录的是音频**字节**，这个封装则是让平台把语音转成**文本**。

原生 API 值得包一层：它在 WebKit 上还带前缀（`webkitSpeechRecognition`）、不在 `lib.dom.d.ts` 里，并且会把一些正常情况（一次静默的停顿、程序主动调用的 `stop()`）和麦克风被拒绝这种真正的错误混在同一个错误通道里上报。

## 使用

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // 每次开始录音时都重新读取，而不是只读一次
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('麦克风权限被拒绝');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // 提前隐藏麦克风按钮
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

返回 `boolean`。是在调用时检测的（而不是在模块加载时缓存），所以在服务端渲染阶段引入这个模块是安全的，等页面 hydrate 之后再调用检测即可。

### `createSpeechRecognizer(options?)`

构建一个可复用的 `SpeechRecognizer`。`start()` 每次都会创建一个全新的原生识别实例，所以任何以**函数**形式传入的选项（尤其是 `lang`）都会在每次开始录音时重新读取，而不是在创建时就冻结。

#### 参数（`SpeechRecognizerOptions`）

| 选项             | 说明                                                                  | 类型                                             | 默认值 |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------ | ------ |
| `lang`           | BCP 47 语言标签（`'en-US'`、`'zh-CN'`），或是每次开始录音时读取的函数 | `string \| (() => string)`                       | `''`   |
| `continuous`     | 遇到停顿时继续监听，而不是在第一次停顿就结束                          | `boolean`                                        | `true` |
| `interimResults` | 在说话过程中就发出中间结果                                            | `boolean`                                        | `true` |
| `onResult`       | 携带**从录音开始到目前为止的完整文本**、以及是否是最终结果            | `(transcript: string, isFinal: boolean) => void` | `-`    |
| `onError`        | 携带一个已分类的错误                                                  | `(error: SpeechError) => void`                   | `-`    |
| `onStart`        | 一次录音开始时触发                                                    | `() => void`                                     | `-`    |
| `onEnd`          | 每次录音结束都会触发一次，不论是主动停止、超时还是出错                | `() => void`                                     | `-`    |

#### `SpeechRecognizer`

| 成员        | 说明                                                       | 类型                |
| ----------- | ---------------------------------------------------------- | ------------------- |
| `supported` | 平台不支持语音识别时为 `false`；此时所有方法都是空操作     | `boolean`（getter） |
| `active`    | 当前是否正在录音                                           | `boolean`（getter） |
| `start()`   | 开始一次录音。如果已经在录音中则忽略                       | `() => void`        |
| `stop()`    | 结束当前录音；已识别的结果会保留，随后触发 `onEnd`         | `() => void`        |
| `abort()`   | 结束当前录音并丢弃尚未确定的结果                           | `() => void`        |
| `toggle()`  | 空闲时开始、录音中则停止，正好符合单个麦克风按钮的交互需求 | `() => void`        |

#### `SpeechError`

| 字段     | 说明                                                                                                                         | 类型              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `kind`   | `'denied'`（麦克风被拒绝，值得展示给用户）、`'noSpeech'` / `'aborted'`（正常情况，通常不用展示）、`'failed'`（其他所有情况） | `SpeechErrorKind` |
| `detail` | 平台事件里原始的 `error` 字符串                                                                                              | `string`          |

## 注意事项

1. **不是所有平台都支持。** Firefox 完全没有实现 `SpeechRecognition`：在展示麦克风相关 UI 之前，务必先检查 `recognizer.supported`（或 `isSpeechRecognitionSupported()`），不要假设构造函数一定存在。
2. **`supported` 和 `active` 都是 getter**，每次访问都会重新求值，而不是在创建时就固定下来。如果 `createSpeechRecognizer()` 是在 `window` 或带前缀的构造函数出现之前调用的（比如服务端渲染、或 hydrate 之前的模块级早期调用），这一点就很重要：一旦真正的 API 出现，识别器会自动感知到，而不会永远卡在 `supported === false`。
3. **`onResult` 里的文本是累积的**，不是增量的：它是到目前为止整段录音的完整文本，会随着中间结果逐渐修正。不需要自己拼接结果。
4. 构造原生识别器或者调用它的 `start()` 都可能同步抛出异常（比如 Permissions-Policy 限制，或者 Chrome 在已有一次录音进行中时抛出的 `InvalidStateError`）。`createSpeechRecognizer` 会捕获这些异常并通过 `onError`/`onEnd` 上报，而不会让异常直接抛出到调用方。
