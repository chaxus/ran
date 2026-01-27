# Tab 标签页

现代化的选项卡组件，支持完整的键盘导航和无障碍访问。

## 代码展示

基础用法，通过 `label` 属性指定标签名称。

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

## 属性

### 名称 `label`

每个 `r-tab` 需要指定一个名称 `label`，用于显示标签头。

<r-tabs>
    <r-tab label="首页">首页内容</r-tab>
    <r-tab label="文档">文档内容</r-tab>
    <r-tab label="示例">示例内容</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="首页">首页内容</r-tab>
    <r-tab label="文档">文档内容</r-tab>
    <r-tab label="示例">示例内容</r-tab>
</r-tabs>
```

### 禁用 `disabled`

每个 `r-tab` 可以指定 `disabled` 属性，用来禁用该标签页。禁用的标签页不可选中且会被键盘导航跳过。

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2" disabled>tab2（禁用）</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2" disabled>tab2（禁用）</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### 标识 `r-key` 和 `active`

每个 `r-tab` 可以指定一个唯一标识 `r-key`，没有指定时会默认以序列号为 `r-key`。

`active` 作用在 `r-tabs` 上，可以指定切换到具体标签页，也可以指定初始值。

<r-tabs active="B">
    <r-tab label="tab1" r-key="A">tab1</r-tab>
    <r-tab label="tab2" r-key="B">tab2（默认激活）</r-tab>
    <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>

```html
<r-tabs active="B">
  <r-tab label="tab1" r-key="A">tab1</r-tab>
  <r-tab label="tab2" r-key="B">tab2（默认激活）</r-tab>
  <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>
```

### 图标 `icon`

每个 `r-tab` 可以指定 `icon`，配合 `label` 实现图标加文字的效果。

<r-tabs>
    <r-tab label="home" icon="home">首页内容</r-tab>
    <r-tab label="message" icon="message">消息内容</r-tab>
    <r-tab label="user" icon="user">用户内容</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab label="home" icon="home">首页内容</r-tab>
  <r-tab label="message" icon="message">消息内容</r-tab>
  <r-tab label="user" icon="user">用户内容</r-tab>
</r-tabs>
```

也可以单独指定 `icon`，不使用 `label`。这种情况必须要设置 `iconSize`，否则无法判断 icon 的大小。

<r-tabs>
    <r-tab icon="home" iconSize='22'>首页</r-tab>
    <r-tab icon="message" iconSize='22'>消息</r-tab>
    <r-tab icon="user" iconSize='22'>用户</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab icon="home" iconSize="22">首页</r-tab>
  <r-tab icon="message" iconSize="22">消息</r-tab>
  <r-tab icon="user" iconSize="22">用户</r-tab>
</r-tabs>
```

### 风格 `type`

支持两种风格：`flat`（默认）和 `line`（线条风格）。

<r-tabs type="line">
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```html
<r-tabs type="line">
  <r-tab label="tab1">tab1</r-tab>
  <r-tab label="tab2">tab2</r-tab>
  <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### 对齐 `align`

支持三种对齐方式：`start`（默认）、`center`（居中）、`end`（右对齐）。

<r-tabs align="center">
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```html
<r-tabs align="center">
  <r-tab label="tab1">tab1</r-tab>
  <r-tab label="tab2">tab2</r-tab>
  <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

## 键盘导航

组件支持完整的键盘导航，提升无障碍访问体验：

- **左箭头键 (←)**: 聚焦到上一个可用标签
- **右箭头键 (→)**: 聚焦到下一个可用标签
- **Home**: 聚焦到第一个可用标签
- **End**: 聚焦到最后一个可用标签
- **Enter 或 Space**: 激活当前聚焦的标签

禁用的标签会自动被跳过。

## 事件

### change

当标签页切换时触发，事件详情包含当前激活的标签 key 和之前激活的标签 key。

```javascript
const tabs = document.querySelector('r-tabs');
tabs.addEventListener('change', (event) => {
  console.log('当前激活:', event.detail.active);
  console.log('之前激活:', event.detail.previousActive);
});
```

## CSS 自定义属性

| 属性名 | 说明 | 默认值 |
|--------|------|--------|
| `--tab-active-color` | 激活标签的颜色 | `#1890ff` |
| `--tab-line-color` | 指示器线条颜色 | `#1890ff` |
| `--tab-border-color` | 边框颜色（line 类型） | `rgba(0, 0, 0, 0.2)` |
| `--tab-border-radius` | 边框圆角 | `0.25em` |
| `--tab-transition-duration` | 过渡动画时长 | `0.2s` |
| `--tab-header-padding` | 标签头内边距 | `0` |
| `--tab-content-padding` | 内容区内边距 | `10px` |

示例：

```css
r-tabs {
  --tab-active-color: #ff4d4f;
  --tab-line-color: #ff4d4f;
  --tab-transition-duration: 0.3s;
}
```

## API

### r-tabs 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 标签页风格 | `'flat' \| 'line'` | `'flat'` |
| `align` | 标签对齐方式 | `'start' \| 'center' \| 'end'` | `'start'` |
| `active` | 当前激活的标签 key | `string` | - |
| `effect` | 效果属性（传递给按钮） | `string` | - |

### r-tabs 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| `updateAttribute(key, attribute, value)` | 更新指定标签的属性 | `key: string, attribute: string, value?: string \| null` |

### r-tab 属性

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `label` | 标签名称 | `string` | - |
| `r-key` | 唯一标识 | `string` | 索引值 |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `icon` | 图标名称 | `string` | - |
| `iconSize` | 图标大小 | `string` | - |
| `effect` | 效果属性 | `string` | - |

## 无障碍支持

组件遵循 WAI-ARIA 标准，提供完整的无障碍支持：

- **ARIA 角色**: 标签列表使用 `role="tablist"`，标签使用 `role="tab"`，面板使用 `role="tabpanel"`
- **ARIA 属性**:
  - `aria-selected`: 标识当前选中的标签
  - `aria-disabled`: 标识禁用的标签
  - `aria-hidden`: 控制未激活面板的可见性
- **键盘导航**: 完整支持箭头键、Home、End 等导航键
- **焦点管理**: 使用 roving tabindex 模式管理焦点
- **动画控制**: 支持 `prefers-reduced-motion` 减少动画
- **对比度**: 支持 `prefers-contrast` 高对比度模式
