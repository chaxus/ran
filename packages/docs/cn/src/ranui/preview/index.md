---
description: "ranui Preview（<r-preview>）在浏览器中在线预览 docx、pptx、pdf、xlsx 文件。"
---

# preview 文件预览

支持 `docx`、`pptx`、`pdf`、`xlsx` 文件的在线预览组件

> ⚠️ **重要通知**: ranui 包在 0.1.10-alpha-27 版本之后将不再提供此组件，请迁移到独立的 [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) 包

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
    <r-button type="primary" onclick="uploadFile('preview-demo')">选择文件预览</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">选择文件预览</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## API 参考

### 属性

| 属性        | 类型      | 默认值                      | 说明                                   |
| ----------- | --------- | --------------------------- | -------------------------------------- |
| `src`       | `string`  | `''`                        | 文件预览地址，有值时会自动打开预览弹窗 |
| `closeable` | `boolean` | `true`                      | 是否显示关闭按钮                       |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | 自定义文档预览服务地址                 |

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

> 💡 **提示**: 默认使用 `https://edit.chaxus.com` 提供的预览服务，如需自部署请参考 [OnlyOffice Web Local](https://github.com/ranuts/document)

## 版本历史

- **ranui 0.1.10-alpha-24 版本之前**:
  - 使用多个第三方库（jszip、docx-preview、exceljs、pdfjs、pptx2html）进行文档预览

- **ranui 0.1.10-alpha-26 版本之后**:
  - 改用 OnlyOffice WebAssembly 版本，提供更好的预览体验
  - 部署详情请参考：[OnlyOffice Web Local](https://github.com/ranuts/document)

- **ranui 0.1.10-alpha-27 版本之后**:
  - 🎉 新增独立的 [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) 包
  - 提供更轻量级的安装选项，专门用于文件预览功能
  - ranui 包将不再包含 `r-preview` 组件

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
