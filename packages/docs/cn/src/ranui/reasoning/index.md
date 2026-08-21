---
description: '可折叠的思维链：推理流式到达时展开，结束时收起——直到读者自己做出决定。'
---

# Reasoning 思维链

可折叠的思维链。

> **适用场景**：模型把推理过程与最终答案分开输出，而你希望读者能看着它发生，但事后不必一直占着屏幕。

推理是一次响应里读者最想「看着它发生」、事后却几乎不想保留的部分。因此这个元素在 `streaming` 置位时展开，在它清除时收起。

**直到读者自己动手。** 一旦读者自己展开或收起过，自动行为就永久停止——这与 [`createBottomFollower`](../../ranuts/utils/) 对滚动采用的是同一条所有权规则，理由也相同：一个不断替读者重新做决定的界面，比一个从不做决定的界面更糟。从脚本设置 `open` 同样算作接管，因为脚本是在替一个有主张的调用方行事。

## 快速开始

```html
<r-reasoning label="思考中"></r-reasoning>
```

```ts
const reasoning = document.querySelector('r-reasoning');

reasoning.streaming = true; // 展开
reasoning.content += delta; // 可见状态下增长
reasoning.duration = 4200; // 标签旁显示 "4.2s"
reasoning.streaming = false; // 收起（除非读者已介入）
```

`ranuts/stream` 本来就把 `reasoning-delta` 与 `text-delta` 分开，所以视图可以直接从快照喂数据：

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## 值得知道的细节

- **不足一秒的耗时不显示。** 读者关心的是「很快」，而不是「340 毫秒」。
- **流式期间标签会呼吸**，这样长时间的沉默思考不会被读成卡死。`prefers-reduced-motion` 会关闭动画但保留信息。
- **默认插槽会替换渲染出的文本**，供希望在主体里放 `<r-markdown>` 而非纯文本的调用方使用。

## API 参考

### 属性

| 属性        | 类型             | 默认值        | 说明                               |
| ----------- | ---------------- | ------------- | ---------------------------------- |
| `content`   | `string`         | `''`          | 推理文本。反复赋值就是流式路径。   |
| `streaming` | `boolean`        | `false`       | 推理是否仍在到达。                 |
| `open`      | `boolean`        | `false`       | 主体是否展开。                     |
| `label`     | `string`         | `'Reasoning'` | 摘要文字。                         |
| `duration`  | `number \| null` | `null`        | 思考耗时（毫秒）。不足一秒时隐藏。 |
| `sheet`     | `string`         | `''`          | 注入元素 Shadow DOM 的 CSS。       |

`duration` 若不是有限的非负数，读回时为 `null`。

### 插槽

| 插槽     | 说明                             |
| -------- | -------------------------------- |
| （默认） | 用你自己的内容替换渲染出的文本。 |

### Part

`reasoning`、`summary`、`marker`、`label`、`meta`、`body`、`text`。

### 无障碍

摘要是真正的 `<button type="button">` 并带 `aria-expanded`，无需额外接线即可用键盘抵达与操作。

## 相关

- [Conversation 对话](../conversation/) —— 把它作为记录里的推理行挂载
- [ranuts/stream](../../ranuts/stream/) —— `reasoning-delta` 的来源
