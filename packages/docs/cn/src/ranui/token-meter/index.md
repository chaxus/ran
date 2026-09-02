---
description: 'ranui TokenMeter（<r-token-meter>）显示一段会话占用了多少上下文窗口，在服务端拒绝下一次请求之前把增长暴露出来。'
---

# TokenMeter 上下文用量

一段会话正在占用多少上下文窗口。

> **适用场景**：在有上下文上限的模型上做聊天界面时。每一个省掉它的客户端都是「用一周然后突然不能
> 用」：每一轮都携带全部历史，请求单调增长，某一天服务端直接拒绝。拒绝是以一堵墙的形式到来的——这个
> 组件就是在那之前把增长显示出来的仪表。

## 快速开始

### 基础用法

<Demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</Demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.querySelector('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // 下一次请求会携带的上下文
meter.spent = 128431; // 整段会话累计计费的 token，可选
```

进度条填充到 `used / limit`，并按三档升级：**ok**、**warn**（达到上限的 80% 起）、**over**。`level`
会反射到宿主元素上，页面可以对同一次升级作出反应：

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used` 和 `spent` 是两个数

- **`used`**——**下一次请求**会携带的量：是历史，不是整段会话。上限约束的是这个数，进度条画的也是它。
- **`spent`**——整段会话**累计**计费的量。它只增不减，也不受窗口大小约束。

截断会话会降低 `used`，但不影响 `spent`。只显示其中一个，就只回答了用户两个问题里的一个（「下一条
还发得出去吗」和「这段对话花了我多少」）。

### 没有上限时

`limit` 未设置或为 0 时，进度条消失，只保留计数——在窗口大小未知时很有用。

<Demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</Demo>

### 改写标签

<Demo>
  <r-token-meter label="上下文" limit="65536" used="41200"></r-token-meter>
</Demo>

```html
<r-token-meter label="上下文" limit="65536" used="41200"></r-token-meter>
<!-- label="" 则只剩计数 -->
```

## API 参考

### 属性

| 属性值  | 属性    | 类型                       | 默认值      | 说明                                                           |
| ------- | ------- | -------------------------- | ----------- | -------------------------------------------------------------- |
| `limit` | `limit` | `number`                   | `0`         | 上下文窗口大小（token）。为 0 或缺省时隐藏进度条。             |
| `used`  | `used`  | `number`                   | `0`         | 下一次请求会携带的 token 数。                                  |
| `spent` | `spent` | `number`                   | `0`         | 整段会话累计计费的 token 数。                                  |
| `label` | `label` | `string`                   | `'Context'` | 读数前缀；设为 `''` 则只剩计数。                               |
| `level` | `level` | `'ok' \| 'warn' \| 'over'` | 推导得出    | 窗口的拥挤程度。**由组件写入**——外部赋值会在下次更新时被覆盖。 |
| `sheet` | `sheet` | `string`                   | `''`        | 注入 shadow root 的 CSS。                                      |

计数按人读数的方式格式化：一千以下给精确值（`847` 是一个人能记住的数），一千以上做缩写（`41.2k`、
`128k`）——`128,431` 的第三位数字不会改变任何人的决定。

### Part

| Part    | 元素       |
| ------- | ---------- |
| `meter` | 整个元素   |
| `track` | 进度条底槽 |
| `fill`  | 已填充部分 |
| `text`  | 标签与计数 |

## 无障碍

元素始终带有陈述具体数字的 `title`，因此**颜色永远不是唯一载体**——进度条变琥珀色是第二重信号，而不是
唯一信号。重新设计配色时请保持这一点。

## 最佳实践

- **在构造请求的地方更新 `used`**，而不是在渲染流程里——人们信任的那个数，是下一次请求真正会发出去的量。
- **升级提示放在组件外面。** `level="over"` 时真正有用的 UI 是一个建议（做摘要、另起会话），那属于应用。
- **不要给填充加会在主题切换时触发的过渡**——见[设计规范](/cn/src/ranui/design-guides/#动效)。
