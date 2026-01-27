# Progress 进度条

现代化的进度条组件，支持多种类型、可拖动交互和不确定状态。

## 快速开始

### 基础用法

<r-progress percent="50"></r-progress>

```html
<r-progress percent="50"></r-progress>
```

## API 参考

### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `percent` | `number` | `0` | 进度百分比 (0-100) |
| `type` | `string` | `'line'` | 进度条类型：`line`、`circle`、`dashboard` |
| `size` | `string` | `'md'` | 进度条尺寸：`sm`、`md`、`lg` |
| `status` | `string` | `'normal'` | 进度条状态：`normal`、`success`、`error`、`warning`、`active` |
| `show-text` | `boolean` | `true` | 是否显示进度文本 |
| `stroke-width` | `number` | - | 线形进度条的粗细 |
| `draggable` | `boolean` | `false` | 是否可拖动（交互式） |
| `width` | `number` | `120` | 圆形/仪表盘类型的宽度（像素） |
| `indeterminate` | `boolean` | `false` | 不确定状态（加载状态） |
| `color` | `string` | - | 进度条颜色 |

### 类型 `type`

#### 线形进度条（默认）

<r-progress type="line" percent="70"></r-progress>

```html
<r-progress type="line" percent="70"></r-progress>
```

#### 圆形进度条

<r-progress type="circle" percent="75"></r-progress>

```html
<r-progress type="circle" percent="75"></r-progress>
```

#### 仪表盘进度条

<r-progress type="dashboard" percent="80"></r-progress>

```html
<r-progress type="dashboard" percent="80"></r-progress>
```

### 尺寸 `size`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress size="sm" percent="40"></r-progress>
<r-progress size="md" percent="60"></r-progress>
<r-progress size="lg" percent="80"></r-progress>
</div>

```html
<r-progress size="sm" percent="40"></r-progress>
<r-progress size="md" percent="60"></r-progress>
<r-progress size="lg" percent="80"></r-progress>
```

### 状态 `status`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress status="normal" percent="40"></r-progress>
<r-progress status="success" percent="100"></r-progress>
<r-progress status="error" percent="50"></r-progress>
<r-progress status="warning" percent="60"></r-progress>
<r-progress status="active" percent="70"></r-progress>
</div>

```html
<r-progress status="normal" percent="40"></r-progress>
<r-progress status="success" percent="100"></r-progress>
<r-progress status="error" percent="50"></r-progress>
<r-progress status="warning" percent="60"></r-progress>
<r-progress status="active" percent="70"></r-progress>
```

### 进度文本 `show-text`

<div style="display:flex;gap:12px;flex-direction:column;align-items:flex-start;">
<r-progress percent="50" show-text></r-progress>
<r-progress percent="75" show-text="false"></r-progress>
</div>

```html
<r-progress percent="50" show-text></r-progress>
<r-progress percent="75" show-text="false"></r-progress>
```

### 可拖动 `draggable`

<r-progress percent="30" draggable></r-progress>

```html
<r-progress percent="30" draggable></r-progress>
```

### 不确定状态 `indeterminate`

<r-progress indeterminate></r-progress>

```html
<r-progress indeterminate></r-progress>
```

### 自定义颜色 `color`

<r-progress percent="70" color="#10b981"></r-progress>

```html
<r-progress percent="70" color="#10b981"></r-progress>
```

### 线条粗细 `stroke-width`

<r-progress percent="60" stroke-width="10"></r-progress>

```html
<r-progress percent="60" stroke-width="10"></r-progress>
```

## 事件

### 变化事件

当进度值改变时触发（对可拖动进度条特别有用）：

```html
<r-progress draggable percent="50"></r-progress>

<script>
  const progress = document.querySelector('r-progress');
  progress.addEventListener('progress-change', (e) => {
    console.log('进度已改变：', e.detail.percent);
  });
</script>
```

## CSS Parts

进度条组件暴露以下 CSS 部件用于样式定制：

```css
/* 定位容器 */
r-progress::part(container) {
  /* 自定义样式 */
}

/* 定位轨道 */
r-progress::part(track) {
  /* 自定义样式 */
}

/* 定位进度条 */
r-progress::part(bar) {
  /* 自定义样式 */
}

/* 定位文本 */
r-progress::part(text) {
  /* 自定义样式 */
}

/* 定位手柄（可拖动时） */
r-progress::part(handle) {
  /* 自定义样式 */
}
```

## CSS 自定义属性

使用 CSS 变量自定义进度条外观：

```css
r-progress {
  /* 颜色 */
  --progress-color-track: #e5e7eb;
  --progress-color-bar: #3b82f6;
  --progress-color-text: #1f2937;

  /* 状态颜色 */
  --progress-color-success: #10b981;
  --progress-color-error: #ef4444;
  --progress-color-warning: #f59e0b;

  /* 尺寸 */
  --progress-sm-height: 4px;
  --progress-md-height: 8px;
  --progress-lg-height: 12px;

  /* 边框 */
  --progress-border-radius: 100px;

  /* 过渡动画 */
  --progress-transition-duration: 300ms;
}
```

## 最佳实践

- **反馈**：使用进度条为正在进行的操作提供视觉反馈
- **状态**：使用适当的状态颜色（完成时为成功，失败时为错误）
- **文本**：显示百分比文本以提供精确的进度指示
- **不确定**：当无法确定进度时使用不确定状态
- **可拖动**：为搜索/拖动功能启用可拖动（媒体播放器等）
- **类型**：在紧凑显示或空间有限时使用圆形/仪表盘类型
- **颜色**：使用自定义颜色以匹配品牌或指示特定状态

## 无障碍性

进度条组件遵循 WAI-ARIA 最佳实践：

- 使用语义化的 `<progress>` 元素或适当的 ARIA 角色
- 通过 `aria-valuenow` 暴露当前进度值
- 通过 `aria-valuemin` 暴露最小值 (0)
- 通过 `aria-valuemax` 暴露最大值 (100)
- 支持描述性文本的 `aria-label`
- 向屏幕阅读器宣告进度更新
- 为可拖动进度条保持键盘可访问性
