---
description: '文本输入框的麦克风按钮：它只报告听到了什么，由应用决定文本去哪里，并且绝不替说话人发送。'
---

# VoiceButton 语音按钮

基于 Web Speech API 的听写按钮。

> **适用场景**：把语音作为填写文本框的**另一种**方式，而不是替代方式。键盘输入必须始终可用：只能语音的路径会把有言语差异的人、身处嘈杂环境的人，以及浏览器根本没有识别能力的人都挡在外面。

它只是一个麦克风按钮，不多不少。它负责录音、报告听到了什么；文本去哪里由调用方决定，因为一个顺便往输入框里写的组件，必须知道是哪个输入框、该追加还是替换、光标怎么处理，而这三个答案每个应用都不一样。

## 快速开始

```html
<r-voice-button label="开始语音输入" active-label="停止语音输入"></r-voice-button>
```

```ts
const mic = document.querySelector('r-voice-button');
const input = document.querySelector('textarea');
let base = '';

mic.addEventListener('voicestart', () => {
  // 已输入内容和即将说出的内容之间补一个空格，除非本来就有。
  base = input.value === '' || /\s$/.test(input.value) ? input.value : `${input.value} `;
});

mic.addEventListener('voiceresult', (event) => {
  input.value = base + event.detail.transcript;
});
```

## 背后的几个决定

### 它报告的是「整段录音到目前为止」，不是最新片段

中间结果会随着识别确定而**被修订**：「你好」变成「你好世界」，而不是再来一个只带「世界」的事件。逐个事件追加的消费方最终会得到 `你好你好世界`。请记住输入框里原本的文本，然后一次性拼接。

### 它不发送

识别出错的频率足够高，替说话人提交等于剥夺了他们复核的机会。它只把内容填进输入框，到此为止。发送始终是一个刻意的动作。

### 没有识别能力时它把自己隐藏

Firefox 不提供语音识别，任何缺少该 API 的浏览器也一样。元素设置的是 `hidden` 而不是 `disabled`：**disabled 说的是「现在不行」，不存在说的是「这里没有」**。一个注定不能工作的按钮比没有按钮更糟，它诱使你点一下，然后再来解释自己。

### 四类错误里只有两类值得提示

| 类别       | 是什么       | 要提示吗                 |
| ---------- | ------------ | ------------------------ |
| `denied`   | 麦克风被拒绝 | **要**：用户可以据此行动 |
| `failed`   | 其他失败     | **要**                   |
| `noSpeech` | 一次静默停顿 | 不要                     |
| `aborted`  | 程序主动停止 | 不要                     |

后两者与真正的失败走同一个通道，但它们并不是失败。把它们显示出来，等于每次录音后都唠叨一遍。

### 无障碍

**可访问名称随状态改变**，而不只是图标变化，`aria-pressed` 承载切换态：屏幕阅读器读出的是「停止语音输入，已按下」，而不是一个图标。**Esc 放弃**当前录音而不是提交它，这正是说到一半意识到说错了的人想要的。

监听状态由边框、填充**和**光环共同表达，不依赖颜色单独传达。光环是唯一的动效且属于装饰，`prefers-reduced-motion` 下直接去掉，不损失任何信息。

### 语言跟随页面

`lang` **每次录音时读取**，默认取文档的语言，因此会话中途切换语言的应用，会用它当前展示的语言进行听写。

## API 参考

### 属性

| 属性          | 类型      | 默认值                | 说明                                                                         |
| ------------- | --------- | --------------------- | ---------------------------------------------------------------------------- |
| `lang`        | `string`  | 文档的语言            | 所说语言的 BCP 47 标签，每次录音时读取。                                     |
| `continuous`  | `boolean` | `true`                | 跨停顿持续监听，而不是在第一次停顿时结束。                                   |
| `disabled`    | `boolean` | `false`               | 禁用按钮：`start()` 会被忽略，内部按钮也一并禁用；不会中止已经在进行的录音。 |
| `label`       | `string`  | `'Start voice input'` | 空闲时的可访问名称。                                                         |
| `activeLabel` | `string`  | `'Stop voice input'`  | 监听时的可访问名称。                                                         |
| `listening`   | `boolean` | `false`               | 只读并反射，可用 `:host([listening])` 设样式。                               |
| `supported`   | `boolean` | —                     | 只读。当前平台能否识别语音。                                                 |
| `sheet`       | `string`  | `''`                  | 注入元素 Shadow DOM 的 CSS。                                                 |

### 方法

`start()` · `stop()`（保留已识别内容）· `abort()`（丢弃）· `toggle()`。

`toggle()` 读的是识别器自身的状态而非反射属性：已经开始却还没报告的录音会让两者不一致，那样下一次点击会试图开启第二段录音、被拒绝，然后什么都不发生。

### 事件

| 事件          | detail                    | 触发时机                 |
| ------------- | ------------------------- | ------------------------ |
| `voicestart`  | —                         | 录音开始                 |
| `voiceresult` | `{ transcript, isFinal }` | 文本到达或被修订         |
| `voiceerror`  | `{ kind, detail }`        | 平台报告问题             |
| `voiceend`    | —                         | 录音结束（无论何种原因） |

### Part

`button`、`icon`。

## 相关

- [`createSpeechRecognizer`](../../ranuts/utils/)：它所包装的识别器
- [Conversation 对话](../conversation/)：听写出的消息最终落入的记录

## 自定义样式

`<r-voice-button>` 自身暴露了 **20 个 CSS 自定义属性**，另外还会读取主题里的语义令牌。令牌设在任何能继承到的
地方都有效，比如 `:root`、外层容器，或元素本身：

```css
r-voice-button {
  --ran-voice-background: var(--ran-color-bg-subtle);
}
```

Part：`button` · `hint` · `icon`

完整清单见[样式令牌](/cn/src/ranui/style-tokens#voice-button)；该选哪个令牌见[设计系统](/cn/src/ranui/design-system/)。
