# Input 输入框

现代化的输入框组件，支持浮动标签、多种变体和完整的表单集成。

## 快速开始

### 基础用法

<r-input></r-input>

```html
<r-input></r-input>
```

## API 参考

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `string` | `'text'` | 输入框类型：`text`、`password`、`email`、`number`、`tel`、`url`、`search`、`date`、`time`、`datetime-local`、`textarea` |
| `value` | `string` | `''` | 输入框的值 |
| `placeholder` | `string` | `''` | 占位符文本 |
| `label` | `string` | - | 浮动标签文本（Material Design 风格） |
| `name` | `string` | - | 表单提交时的字段名 |
| `disabled` | `boolean` | `false` | 是否禁用输入框 |
| `readonly` | `boolean` | `false` | 是否只读 |
| `required` | `boolean` | `false` | 是否必填 |
| `size` | `string` | `'md'` | 输入框尺寸：`sm`、`md`、`lg` |
| `status` | `string` | `'normal'` | 输入框状态：`normal`、`error`、`warning`、`success` |
| `variant` | `string` | `'outlined'` | 输入框变体：`outlined`、`filled`、`borderless` |
| `maxlength` | `number` | - | 最大字符长度 |
| `min` | `string\|number` | - | 最小值（数字/日期类型） |
| `max` | `string\|number` | - | 最大值（数字/日期类型） |
| `step` | `string\|number` | - | 步长（数字类型） |
| `prefix` | `string` | - | 前缀图标名称 |
| `suffix` | `string` | - | 后缀图标名称 |
| `clearable` | `boolean` | `false` | 是否显示清除按钮 |
| `show-count` | `boolean` | `false` | 是否显示字符计数 |
| `full-width` | `boolean` | `false` | 是否占满容器宽度 |
| `error` | `string` | - | 要显示的错误消息 |
| `autocomplete` | `string` | - | 自动完成属性 |
| `inputmode` | `string` | - | 移动键盘输入模式 |
| `spellcheck` | `boolean` | - | 是否启用拼写检查 |
| `minrows` | `number` | `3` | 最小行数（仅 textarea） |
| `maxrows` | `number` | `6` | 最大行数（仅 textarea） |

### 输入框类型 `type`

#### 文本输入（默认）

<r-input type="text" placeholder="请输入文本"></r-input>

```html
<r-input type="text" placeholder="请输入文本"></r-input>
```

#### 密码输入

<r-input type="password" placeholder="请输入密码"></r-input>

```html
<r-input type="password" placeholder="请输入密码"></r-input>
```

#### 邮箱输入

<r-input type="email" placeholder="请输入邮箱"></r-input>

```html
<r-input type="email" placeholder="请输入邮箱"></r-input>
```

#### 数字输入

<r-input type="number" min="0" max="100" step="1" placeholder="请输入数字"></r-input>

```html
<r-input type="number" min="0" max="100" step="1" placeholder="请输入数字"></r-input>
```

#### 电话输入

<r-input type="tel" placeholder="请输入电话号码"></r-input>

```html
<r-input type="tel" placeholder="请输入电话号码"></r-input>
```

#### URL 输入

<r-input type="url" placeholder="请输入网址"></r-input>

```html
<r-input type="url" placeholder="请输入网址"></r-input>
```

#### 搜索输入

<r-input type="search" placeholder="搜索..."></r-input>

```html
<r-input type="search" placeholder="搜索..."></r-input>
```

#### 日期输入

<r-input type="date"></r-input>

```html
<r-input type="date"></r-input>
```

#### 时间输入

<r-input type="time"></r-input>

```html
<r-input type="time"></r-input>
```

#### 日期时间输入

<r-input type="datetime-local"></r-input>

```html
<r-input type="datetime-local"></r-input>
```

#### 文本域

<r-input type="textarea" placeholder="请输入多行文本" minrows="3" maxrows="6"></r-input>

```html
<r-input type="textarea" placeholder="请输入多行文本" minrows="3" maxrows="6"></r-input>
```

### 浮动标签 `label`

Material Design 风格的浮动标签：

<r-input label="用户名"></r-input>

```html
<r-input label="用户名"></r-input>
```

### 尺寸 `size`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input size="sm" label="小号"></r-input>
<r-input size="md" label="中号"></r-input>
<r-input size="lg" label="大号"></r-input>
</div>

```html
<r-input size="sm" label="小号"></r-input>
<r-input size="md" label="中号"></r-input>
<r-input size="lg" label="大号"></r-input>
```

### 变体 `variant`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input variant="outlined" label="描边"></r-input>
<r-input variant="filled" label="填充"></r-input>
<r-input variant="borderless" label="无边框"></r-input>
</div>

```html
<r-input variant="outlined" label="描边"></r-input>
<r-input variant="filled" label="填充"></r-input>
<r-input variant="borderless" label="无边框"></r-input>
```

### 状态 `status`

<div style="display:flex;gap:12px;align-items:flex-start;flex-direction:column;">
<r-input status="normal" label="正常"></r-input>
<r-input status="success" label="成功"></r-input>
<r-input status="warning" label="警告"></r-input>
<r-input status="error" label="错误" error="此字段有错误"></r-input>
</div>

```html
<r-input status="normal" label="正常"></r-input>
<r-input status="success" label="成功"></r-input>
<r-input status="warning" label="警告"></r-input>
<r-input status="error" label="错误" error="此字段有错误"></r-input>
```

### 禁用状态 `disabled`

<r-input label="用户名" disabled value="禁用的输入框"></r-input>

```html
<r-input label="用户名" disabled value="禁用的输入框"></r-input>
```

### 只读状态 `readonly`

<r-input label="用户名" readonly value="只读输入框"></r-input>

```html
<r-input label="用户名" readonly value="只读输入框"></r-input>
```

### 必填字段 `required`

<r-input label="用户名" required></r-input>

```html
<r-input label="用户名" required></r-input>
```

### 图标 `prefix` / `suffix`

<r-input prefix="user" label="用户名"></r-input>
<r-input suffix="search" label="搜索"></r-input>
<r-input prefix="lock" suffix="eye" type="password" label="密码"></r-input>

```html
<r-input prefix="user" label="用户名"></r-input>
<r-input suffix="search" label="搜索"></r-input>
<r-input prefix="lock" suffix="eye" type="password" label="密码"></r-input>
```

### 可清除 `clearable`

<r-input label="用户名" clearable value="清除我"></r-input>

```html
<r-input label="用户名" clearable value="清除我"></r-input>
```

### 字符计数 `show-count`

<r-input label="个人简介" show-count maxlength="100" type="textarea"></r-input>

```html
<r-input label="个人简介" show-count maxlength="100" type="textarea"></r-input>
```

### 全宽 `full-width`

<r-input label="全宽输入框" full-width></r-input>

```html
<r-input label="全宽输入框" full-width></r-input>
```

## 事件

输入框组件触发多个自定义事件：

### 变化事件

当输入框的值改变并失去焦点时触发：

```html
<r-input label="用户名"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-change', (e) => {
    console.log('值已更改：', e.detail.value);
  });
</script>
```

### 输入事件

每次按键时触发：

```html
<r-input label="搜索"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-input', (e) => {
    console.log('正在输入：', e.detail.value);
  });
</script>
```

### 焦点/失焦事件

```html
<r-input label="用户名"></r-input>

<script>
  const input = document.querySelector('r-input');

  input.addEventListener('input-focus', (e) => {
    console.log('输入框已聚焦');
  });

  input.addEventListener('input-blur', (e) => {
    console.log('输入框已失焦');
  });
</script>
```

### 清除事件

点击清除按钮时触发：

```html
<r-input label="搜索" clearable></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-clear', (e) => {
    console.log('已清除，之前的值：', e.detail.previousValue);
  });
</script>
```

### 回车事件

按下回车键时触发：

```html
<r-input label="搜索"></r-input>

<script>
  const input = document.querySelector('r-input');
  input.addEventListener('input-enter', (e) => {
    console.log('按下回车，当前值：', e.detail.value);
  });
</script>
```

## 方法

### focus()

以编程方式聚焦输入框：

```javascript
const input = document.querySelector('r-input');
input.focus();
```

### blur()

以编程方式使输入框失焦：

```javascript
const input = document.querySelector('r-input');
input.blur();
```

### select()

选中输入框中的所有文本：

```javascript
const input = document.querySelector('r-input');
input.select();
```

### clear()

清除输入框的值：

```javascript
const input = document.querySelector('r-input');
input.clear();
```

## 表单集成

输入框组件使用 ElementInternals API 与原生 HTML 表单集成：

```html
<form id="myForm">
  <r-input name="username" label="用户名" required></r-input>
  <r-input name="email" label="邮箱" type="email" required></r-input>
  <r-input name="age" label="年龄" type="number" min="18" max="100"></r-input>
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

输入框组件暴露以下 CSS 部件用于样式定制：

```css
/* 定位容器 */
r-input::part(container) {
  /* 自定义样式 */
}

/* 定位 input/textarea 元素 */
r-input::part(input) {
  /* 自定义样式 */
}

/* 定位标签 */
r-input::part(label) {
  /* 自定义样式 */
}

/* 定位前缀图标 */
r-input::part(prefix) {
  /* 自定义样式 */
}

/* 定位后缀图标 */
r-input::part(suffix) {
  /* 自定义样式 */
}

/* 定位清除按钮 */
r-input::part(clear) {
  /* 自定义样式 */
}

/* 定位计数器 */
r-input::part(counter) {
  /* 自定义样式 */
}

/* 定位错误消息 */
r-input::part(error) {
  /* 自定义样式 */
}
```

## CSS 自定义属性

使用 CSS 变量自定义输入框外观：

```css
r-input {
  /* 颜色 */
  --input-color-border: #d1d5db;
  --input-color-border-hover: #9ca3af;
  --input-color-border-focus: #3b82f6;
  --input-color-bg: #ffffff;
  --input-color-text: #1f2937;
  --input-color-placeholder: #9ca3af;
  --input-color-label: #6b7280;
  --input-color-disabled-bg: #f3f4f6;
  --input-color-disabled-text: #9ca3af;

  /* 状态颜色 */
  --input-color-error: #ef4444;
  --input-color-warning: #f59e0b;
  --input-color-success: #10b981;

  /* 尺寸 */
  --input-sm-height: 32px;
  --input-md-height: 40px;
  --input-lg-height: 48px;
  --input-sm-font-size: 14px;
  --input-md-font-size: 16px;
  --input-lg-font-size: 18px;

  /* 间距 */
  --input-padding-x: 12px;
  --input-padding-y: 8px;

  /* 边框 */
  --input-border-width: 1px;
  --input-border-radius: 6px;

  /* 过渡动画 */
  --input-transition-duration: 150ms;
}
```

## 最佳实践

- **标签**：始终为无障碍性提供有意义的标签
- **占位符**：使用占位符作为提示，而不是说明
- **类型**：为数据选择正确的输入类型（email、tel、number 等）
- **验证**：使用 `required`、`min`、`max`、`maxlength` 属性进行验证
- **状态**：使用 `status` 和 `error` 属性显示验证反馈
- **图标**：添加相关的前缀/后缀图标以增强用户体验
- **可清除**：为搜索和过滤输入框启用 `clearable`
- **字符计数**：为有长度限制的输入框显示 `show-count`
- **自动完成**：设置适当的 `autocomplete` 值以获得更好的用户体验
- **输入模式**：使用 `inputmode` 优化移动键盘

## 无障碍性

输入框组件遵循 WAI-ARIA 最佳实践：

- 使用语义化的 `<input>` 或 `<textarea>` 元素
- 支持键盘导航（Tab、回车、Escape）
- 正确管理 `disabled` 和 `readonly` 状态
- 保持焦点指示器
- 通过 `aria-label` 或可见标签将标签与输入框关联
- 通过 `aria-invalid` 暴露验证状态
- 支持错误消息的 `aria-describedby`
- 向屏幕阅读器宣告状态变化
