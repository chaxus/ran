---
description: 'ranui Attachments（<r-attachments>）承载消息旁待发送的文件：保存列表、生成预览、校验规则，并负责回收自己创建的 object URL。'
---

# Attachments 附件条

消息旁待发送的文件：`<r-attachments>` 保存列表、生成预览、校验到达的文件，并负责回收自己创建的
object URL。

> **适用场景**：输入框需要展示「即将发送什么」时。它**不负责收集文件**——粘贴、拖拽、文件选择器是
> 输入区里三个不同元素上的三种手势，提供哪几种是应用自己的决定。在你接的那个手势里调用 `add()`。

## 快速开始

### 基础用法

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.querySelector('r-attachments');

// 文件选择器
picker.addEventListener('change', () => strip.add(picker.files));

// 粘贴——仅在剪贴板确实带文件时拦截。拦下每一次粘贴会破坏粘贴文本，
// 而输入框大部分时候正是用来粘文本的。
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// 拖拽
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});
```

附件条为每个文件渲染一行：缩略图（图片）、文件名、大小和一个移除按钮。`count` 会反射到宿主元素上，
并且在为空时**移除属性**而不是写成 `0`，因此空的附件条可以完全不占空间：

```css
r-attachments:not([count]) {
  display: none;
}
```

### 发送

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` 就是按顺序排列的 `File` 对象，正是请求体想要的形状。需要自己渲染同一份状态时，用信息更全的
`attachments`（`id`、`name`、`size`、`type`、`previewUrl`）。

### 拒绝一定会被告知，绝不静默

一个文件因为超出没人提过的上限而凭空消失，读起来就是页面出了 bug。每一次拒绝都会派发事件，带上文件和
它触犯的规则：

```js
const explain = {
  'too-large': '这个文件超过 5 MB。',
  'type-not-accepted': '这里不接受这种文件类型。',
  'too-many': '最多只能附 4 个文件。',
  duplicate: '这个文件已经附上了。',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` 同时比较文件名、大小和修改时间——也就是文件管理器眼中的「同一个文件」。同一个文件附两次
是手滑，不是指令。

## API 参考

### 属性

| 属性值        | 属性        | 类型                    | 默认值  | 说明                                              |
| ------------- | ----------- | ----------------------- | ------- | ------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`    | 逗号分隔的类型或扩展名，格式同 `<input accept>`。 |
| `maxSize`     | `max-size`  | `number`                | `10 MB` | 单个文件的大小上限（字节）。                      |
| `maxCount`    | `max-count` | `number`                | —       | 同时可暂存的文件数上限；不设则不限。              |
| `attachments` | —           | `readonly Attachment[]` | `[]`    | 已暂存的文件，按到达顺序。                        |
| `files`       | —           | `File[]`                | `[]`    | 只有文件本身，便于构造请求体。                    |
| `sheet`       | `sheet`     | `string`                | `''`    | 注入 shadow root 的 CSS。                         |

`attachments` 和 `files` 是只读视图——请通过 `add()` 暂存文件。

### 方法

| 方法         | 返回值         | 说明                                           |
| ------------ | -------------- | ---------------------------------------------- |
| `add(files)` | `Attachment[]` | 暂存一组 `File`，返回其中被接受的那些。        |
| `detach(id)` | `boolean`      | 按 id 移除一个附件；没有该 id 时返回 `false`。 |
| `clear()`    | `void`         | 清空全部，并回收它们的 object URL。            |

::: tip 是 `detach(id)`，不是 `remove(id)`
每个元素本来就有一个不接受参数、把自己从文档里摘掉的 `remove()`。用不同语义去覆盖它，对任何伸手去用
标准方法的人都是个陷阱。
:::

### 事件

| 事件                 | detail             | 派发选项          | 说明                                                                                       |
| -------------------- | ------------------ | ----------------- | ------------------------------------------------------------------------------------------ |
| `attachmentschange`  | `{ attachments }`  | bubbles, composed | 暂存列表发生了变化。                                                                       |
| `attachmentrejected` | `{ file, reason }` | bubbles, composed | 有文件被拒绝。`reason` 是 `too-large`、`type-not-accepted`、`too-many`、`duplicate` 之一。 |

### 类型

```ts
interface Attachment {
  id: string; // 在该附件的生命周期内稳定
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // 图片是 object URL，其余为 null
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Part

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## 预览是怎么做的

预览用的是 **object URL，不是 data URL**。预览的代价只是引用浏览器已经持有的字节；而把一张 10 MB 的
照片读成 base64 字符串只为显示 40px 的缩略图，代价是那个字符串。data URL 留给真正发送的那一步，构造
一次即可。

组件创建的每一个 URL 都由它自己回收——移除时、清空时、断开连接时。不要把 `previewUrl` 留到附件生命
周期之外使用。

## 无障碍

缩略图的 alt 是**文件名**，不是「图片」：四个附件都念成「图片」，等于什么都没告诉读者。移除按钮同理，
各自以文件命名。

## 最佳实践

- **服务端也要校验。** `accept` 和 `max-size` 是对上传者的体贴，不是安全边界。
- **发送成功后再清空**，不要提前——请求失败时文件应当还留着，方便重试。
- **每一次拒绝都要解释。** 这个事件存在的意义，就是让附件条永远不会悄悄吞掉一个文件。
