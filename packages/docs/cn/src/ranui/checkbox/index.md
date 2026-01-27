# Checkbox 复选框

现代化的复选框组件，支持不确定状态、多种尺寸和表单集成。

## 快速开始

### 基础用法

<r-checkbox>复选框</r-checkbox>

```html
<r-checkbox>复选框</r-checkbox>
```

## API 参考

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | 是否选中 |
| `value` | `string` | `''` | 表单提交时的值 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `required` | `boolean` | `false` | 是否必选 |
| `indeterminate` | `boolean` | `false` | 是否为不确定状态 |
| `size` | `string` | `'md'` | 复选框尺寸：`sm`、`md`、`lg` |
| `status` | `string` | `'normal'` | 复选框状态：`normal`、`error`、`warning`、`success` |
| `name` | `string` | - | 表单提交时的字段名 |
| `label` | `string` | - | 标签文本 |

### 选中状态 `checked`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox>未选中</r-checkbox>
<r-checkbox checked>已选中</r-checkbox>
</div>

```html
<r-checkbox>未选中</r-checkbox>
<r-checkbox checked>已选中</r-checkbox>
```

### 尺寸 `size`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox size="sm">小号</r-checkbox>
<r-checkbox size="md">中号</r-checkbox>
<r-checkbox size="lg">大号</r-checkbox>
</div>

```html
<r-checkbox size="sm">小号</r-checkbox>
<r-checkbox size="md">中号</r-checkbox>
<r-checkbox size="lg">大号</r-checkbox>
```

### 状态 `status`

<div style="display:flex;gap:12px;align-items:center;flex-direction:column;align-items:flex-start;">
<r-checkbox status="normal" checked>正常</r-checkbox>
<r-checkbox status="success" checked>成功</r-checkbox>
<r-checkbox status="warning" checked>警告</r-checkbox>
<r-checkbox status="error" checked>错误</r-checkbox>
</div>

```html
<r-checkbox status="normal" checked>正常</r-checkbox>
<r-checkbox status="success" checked>成功</r-checkbox>
<r-checkbox status="warning" checked>警告</r-checkbox>
<r-checkbox status="error" checked>错误</r-checkbox>
```

### 禁用状态 `disabled`

<div style="display:flex;gap:12px;align-items:center;">
<r-checkbox disabled>禁用未选中</r-checkbox>
<r-checkbox disabled checked>禁用已选中</r-checkbox>
</div>

```html
<r-checkbox disabled>禁用未选中</r-checkbox>
<r-checkbox disabled checked>禁用已选中</r-checkbox>
```

### 不确定状态 `indeterminate`

<r-checkbox indeterminate>不确定</r-checkbox>

```html
<r-checkbox indeterminate>不确定</r-checkbox>
```

### 只读状态 `readonly`

<r-checkbox readonly checked>只读</r-checkbox>

```html
<r-checkbox readonly checked>只读</r-checkbox>
```

### 必选字段 `required`

<r-checkbox required>必选复选框</r-checkbox>

```html
<r-checkbox required>必选复选框</r-checkbox>
```

## 事件

### 变化事件

当复选框状态改变时触发：

```html
<r-checkbox>接受条款</r-checkbox>

<script>
  const checkbox = document.querySelector('r-checkbox');
  checkbox.addEventListener('checkbox-change', (e) => {
    console.log('已选中：', e.detail.checked);
    console.log('值：', e.detail.value);
  });
</script>
```

## 方法

### toggle()

以编程方式切换复选框状态：

```javascript
const checkbox = document.querySelector('r-checkbox');
checkbox.toggle();
```

## 表单集成

复选框组件使用 ElementInternals API 与原生 HTML 表单集成：

```html
<form id="myForm">
  <r-checkbox name="terms" value="accepted" required>我接受条款和条件</r-checkbox>
  <r-checkbox name="newsletter" value="yes">订阅新闻通讯</r-checkbox>
  <button type="submit">提交</button>
</form>

<script>
  const form = document.getElementById('myForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('表单数据：', Object.fromEntries(formData));
  });
</script>
```

## CSS Parts

复选框组件暴露以下 CSS 部件用于样式定制：

```css
/* 定位容器 */
r-checkbox::part(container) {
  /* 自定义样式 */
}

/* 定位 input 元素 */
r-checkbox::part(input) {
  /* 自定义样式 */
}

/* 定位复选框框体 */
r-checkbox::part(checkbox) {
  /* 自定义样式 */
}

/* 定位对勾 */
r-checkbox::part(checkmark) {
  /* 自定义样式 */
}

/* 定位标签 */
r-checkbox::part(label) {
  /* 自定义样式 */
}
```

## CSS 自定义属性

使用 CSS 变量自定义复选框外观：

```css
r-checkbox {
  /* 颜色 */
  --checkbox-color-border: #d1d5db;
  --checkbox-color-bg: #ffffff;
  --checkbox-color-checked: #3b82f6;
  --checkbox-color-checkmark: #ffffff;
  --checkbox-color-disabled: #e5e7eb;

  /* 状态颜色 */
  --checkbox-color-error: #ef4444;
  --checkbox-color-warning: #f59e0b;
  --checkbox-color-success: #10b981;

  /* 尺寸 */
  --checkbox-sm-size: 16px;
  --checkbox-md-size: 20px;
  --checkbox-lg-size: 24px;

  /* 边框 */
  --checkbox-border-width: 2px;
  --checkbox-border-radius: 4px;

  /* 过渡动画 */
  --checkbox-transition-duration: 150ms;
}
```

## 最佳实践

- **标签**：始终为复选框提供清晰的标签
- **分组**：将相关的复选框组合在一起
- **不确定状态**：在"全选"场景中使用不确定状态
- **必选**：明确标记必选的复选框
- **状态**：使用状态颜色指示验证状态
- **禁用**：当选项暂时不可用时使用禁用状态
- **表单集成**：使用 `name` 和 `value` 属性进行正确的表单提交

## 无障碍性

复选框组件遵循 WAI-ARIA 最佳实践：

- 使用语义化的 `<input type="checkbox">` 元素
- 支持键盘导航（空格键切换）
- 正确管理 `checked`、`disabled`、`readonly` 和 `indeterminate` 状态
- 保持焦点指示器
- 将标签与复选框关联
- 通过 `aria-invalid` 暴露验证状态
- 支持必填字段的 `aria-required`
- 向屏幕阅读器宣告状态变化
