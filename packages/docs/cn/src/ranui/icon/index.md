---
description: "ranui Icon（<r-icon>）渲染语义化矢量图形（SVG），支持尺寸与颜色控制。"
---

# Icon 图标

语义化的矢量图形

## 使用前需先注册图标

**`<r-icon>` 没有内置图标集，也没有 iconfont 兜底。** 它只渲染你按名称注册到内存表里的 SVG。如果某个 `name` 从未注册，元素**什么都不渲染**（一片空白）—— 这正是「图标显示为空」最常见的原因。

### 最简单：注册自带图标集（推荐）

ranui 已把自带图标集**内联进了产物包**（无需接线任何资源文件）。**尽早、只调用一次** `registerBuiltinIcons()`——要在任何会渲染 `<r-icon>` 的组件挂载之前——所有自带名称即可使用：

```ts
import { registerBuiltinIcons } from 'ranui'; // 或 'ranui/icons'

registerBuiltinIcons(); // 注册 RAN_ICON_NAMES 里的全部名称
```

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

有效名称以 `RanIconName` 联合类型与 `RAN_ICON_NAMES` 元组导出（编辑器可自动补全、拼写错误会被类型检查捕获）：

`add-user`、`arrow-down`、`book`、`check-circle`、`check-circle-fill`、`close`、`close-circle`、`close-circle-fill`、`drop`、`eye`、`eye-close`、`github`、`globe`、`home`、`info-circle`、`info-circle-fill`、`issue`、`loading`、`loading-scene`、`lock`、`menu`、`message`、`more`、`plus`、`power-off`、`preview`、`search`、`setting`、`sort`、`team`、`unlock`、`user`、`warning-circle`、`warning-circle-fill`、`without-content`

### 自定义图标

要注册你自己的 SVG（来自任意图标库或你构建流程的资源），把原始 SVG 字符串传给 `registerIcons` / `registerIcon`：

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // 你的打包器把 SVG 暴露为原始字符串的方式

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // 内联字符串——无需资源文件
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

也可以完全跳过注册表，直接把原始 SVG 标记传给 `name`（以 `<svg` 开头时会原样渲染）：

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **注意：** 原始的 `assets/icons/*.svg` 文件**不在**已发布的 npm 包内（只发布 `dist/`），所以在外部应用中 `import '…/lock.svg?raw'` 无法从 `ranui` 解析——自带图标请用 `registerBuiltinIcons()`，或注册你自己的 SVG 字符串。

> **SSR / 时序。** 注册必须在浏览器端执行。如果某个 `<r-icon>` 在其图标注册之前就挂载，它会先保持空白，待注册完成后自动补上（元素会监听 `ranui-icon-registered` 事件）。要避免图标空白闪烁，请在入口模块最顶部注册，让注册表在首个组件渲染前就已就绪。开发模式下，未注册的名称会打印 `[ranui-icon] icon not registered: <name>`。

## 代码演示

<div style='display:flex'>
     <r-icon name="lock" size="50" ></r-icon>
     <r-icon name="eye" size="50" ></r-icon>
     <r-icon name="user" size="50" ></r-icon>
</div>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## 属性

### 名称`name`

根据名称选择不同的图标

<div style='display:flex'>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="eye" size="50" ></r-icon>
 <r-icon name="user" size="50" ></r-icon>
</div>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### 尺寸`size`

<div style='display:flex;align-items: flex-end;'>
 <r-icon name="lock" size="30" ></r-icon>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="lock" size="70" ></r-icon>
</div>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### 颜色`color`

<div style='display:flex'>
 <r-icon name="lock" size="50" color="red" ></r-icon>
 <r-icon name="lock" size="50" color="#1E90FF" ></r-icon>
 <r-icon name="lock" size="50" color="#F44336" ></r-icon>
 <r-icon name="lock" size="50" color="#3F51B5" ></r-icon>
</div>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### 旋转`spin`

设置 spin 开启旋转，传入数字控制旋转的速度，数字越小旋转越快

<div style='display:flex'>
 <r-icon name="loading" size="50" color="#1E90FF" spin='0.7'></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin='5'></r-icon>
</div>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## 图标列表

点击任意图标即可复制其用法。

<IconGallery />
