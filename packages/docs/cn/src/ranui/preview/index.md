---
description: 'ranui Preview（<r-preview>）在浏览器中在线预览 docx、pptx、pdf、xlsx 文件。'
---

# Preview 文件预览

支持 `docx`、`pptx`、`pdf`、`xlsx` 文件的在线预览组件

> **适用场景**：需要在浏览器中预览 `docx`、`pptx`、`pdf` 或 `xlsx` 文件时，`<r-preview>` 会从文件 URL 打开一个文档预览弹窗（现已作为独立的 `@ranui/preview` 包发布）。

> ⚠️ **重要通知**：ranui 包在 0.1.10-alpha-27 版本之后将不再提供此组件，请迁移到独立的 [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) 包

## 快速开始

### 安装

```bash
# 使用独立的 preview 包（推荐）
npm install @ranui/preview

# 或使用完整的 ranui 包（0.1.10-alpha-27 版本之前）
npm install ranui
```

### 基础用法

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" data-preview-upload="preview-demo">选择文件预览</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">选择文件预览</r-button>

<script>
  let selectedUrl;
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx,.xls');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedUrl = URL.createObjectURL(file);
        preview.setAttribute('src', selectedUrl);
      }
    };
  };
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted && selectedUrl) URL.revokeObjectURL(selectedUrl);
  });
</script>
```

## API 参考

### 属性

| 属性                   | 类型      | 默认值                    | 说明                                       |
| ---------------------- | --------- | ------------------------- | ------------------------------------------ |
| `src`                  | `string`  | —                         | 文件 URL；设置后打开弹窗                   |
| `closeable`            | `string`  | —                         | 设置字符串 false 隐藏关闭按钮并禁用 Escape |
| `baseUrl` / `baseurl`  | `string`  | `https://edit.chaxus.com` | Office 编辑器页面地址                      |
| `readonly`             | `boolean` | `false`                   | 显式启用 Office 只读模式                   |
| `pdf-mode` / `pdfMode` | `string`  | `eager`                   | PDF 模式：eager 或 virtual                 |
| `label`                | `string`  | `Preview file`            | 触发元素的无障碍名称                       |

### 资源地址 `src`

设置文件地址即可打开预览弹窗，为空时不显示

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### 是否可关闭 `closeable`

控制预览弹窗的关闭行为

```html
<!-- 默认可关闭 -->
<r-preview closeable="true"></r-preview>

<!-- 不可关闭 -->
<r-preview closeable="false"></r-preview>
```

### 自定义预览服务 `baseUrl`

当您需要自定义文档预览服务时，可以通过 `baseUrl` 属性指定服务地址

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **提示**：默认使用 `https://edit.chaxus.com` 提供的预览服务，如需自部署请参考 [OnlyOffice Web Local](https://github.com/ranuts/document)

## 0.3.0 兼容性

0.3.0 保留自动注册和默认可编辑的 Office 行为。PDF 默认使用 `eager` 模式，所有页面绘制完成后触发 `load`。设置 `pdf-mode="virtual"`（JavaScript：`pdfMode = 'virtual'`）可按可见区域渲染，此时 `load` 表示首屏及缓冲区域已就绪，worker 保留到关闭、替换来源或移除元素。修改 `readonly` 或 `closeable` 会保留当前 Office 编辑器和未保存的编辑。

```html
<r-preview pdf-mode="virtual" src="/reports/long.pdf"></r-preview>
<r-preview readonly src="/reports/annual.docx"></r-preview>
```

PDF 在本地渲染。Office 文件会传递给配置的编辑器 iframe，该页面可以访问文件内容。私有或内网文档应使用自己的 `baseUrl` 部署。

## 迁移指南

如果您正在使用 ranui 包中的 `r-preview` 组件，建议按以下步骤迁移：

1. **安装新包**：

   ```bash
   npm install @ranui/preview
   ```

2. **更新导入**：

   ```javascript
   // 之前
   import 'ranui';

   // 现在
   import '@ranui/preview';
   ```

3. **HTML 使用方式保持不变**：
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
