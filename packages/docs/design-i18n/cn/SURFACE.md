<!-- source: 733bd36544d9931f7f109d3a1d1e3fc685efb17f -->

# 表面语言

产品如何在**实心**与**液态玻璃**之间选择，与颜色主题（浅色 / 深色 / 跟随系统）正交。与[设计检查清单](./DESIGN.md)一起用；ranui 的映射见实现适配层（已安装 `ranui` 时读 `docs/DESIGN.md#ranui-implementation-adapter`，否则读源码中的[packages/ranui/docs/adapters/DESIGN.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)）。

**MUST** 只用于用户能察觉的缺陷。**SHOULD** 是起点。

## 两轴

| 轴       | 选项                  | 标记                                     | 切换                                |
| -------- | --------------------- | ---------------------------------------- | ----------------------------------- |
| 颜色主题 | system / light / dark | `data-ran-theme`                         | `<r-theme-switch>` / `setTheme`     |
| 表面语言 | solid（默认）/ glass  | `data-ran-surface="glass"`（缺省即实心） | `<r-surface-switch>` / `setSurface` |

- **MUST** 两轴保持正交。玻璃仍跟随浅色与深色；颜色主题不隐含表面，玻璃也不隐含色板。
- **MUST** 实心是默认。要开玻璃就显式开启（`setSurface('glass')` 或宿主打标）。
- **SHOULD** 当文档根拥有该选择时，持久化读者的表面偏好（ranui：`localStorage` 键 `ran-surface`）。

## 玻璃用在哪里才值

对齐 Apple Liquid Glass（WWDC25 / HIG Materials）：**功能层**浮在**内容层**之上。玻璃是 Regular chrome——导航、侧栏、瞬时面板、浮动工具条——不是盖在每一层上的第二套皮肤。

- **SHOULD** 把玻璃放在浮于内容之上的 **chrome**（顶栏、侧栏、菜单、搜索、作为浮层的 toast）。
- **MUST** 让**阅读与编辑内容**足够实心可读：正文、表格、卡片、读者会停留填写的表单、长代码。
- **MUST** 不要玻璃叠玻璃。每一层只有一块磨砂板；板上的控件用 vibrancy 填充，不要第二层 `backdrop-filter`。
- **SHOULD** Clear / Overlay 玻璃只给短命层（菜单、搜索、sheet），放在 Regular chrome 之上——且只盖在富媒体内容上，可读性不够时加 dimming。同一表面上不要混用 Regular 与 Clear。

文档站、控制台和营销页花玻璃的方式不同。文档界面更克制；说服向落地页可以让一个玻璃时刻承载品牌。

## 材质

- **SHOULD** 给玻璃背后安静的气氛（薄雾、柔和晕染、产品意象）。纯白底会让磨砂看起来像一块发白的盒子。
- **SHOULD** 用同一套填充、高光、冷色描边与软阴影配方，让顶栏、侧栏与浮层读成同一种语言。
- **MUST** 尊重 `prefers-reduced-transparency: reduce`：去掉模糊，用抬高的实心底板回退，布局不变。
- **MUST** 玻璃上的文字与控件在真实构图下仍满足 WCAG AA，浅色与深色皆然。

## 玻璃上的交互态

磨砂板会冲淡浅填充。Graphite 上清楚的状态，在玻璃上可能消失。

- **MUST** 悬停与选中彼此可区分，也与静止态可区分。
- **MUST** 状态不只靠颜色（字重、导轨或 chip 与颜色一起用）。
- **SHOULD** 悬停用安静的墨色洗色；浅色玻璃上选中用更亮的霜面抬升加字重（深色上用更实的白色 vibrancy），实心 Graphite 已有导轨处仍保留导轨。不要用描边或投影把选中 chip 压暗——那在磨砂板上会读成实心 chrome。
- **SHOULD** 优先用库 token（`--ran-surface-glass-hover` / `--ran-surface-glass-selected`）以及文档级玻璃下试点控件的默认值（`r-dropdown-item`、`r-select` 触发器、`r-tabs` 标题滑块）。宿主不要为菜单另造一套 hover 灰色——那是 agents 偏离表面语言的常见路径。浮层面板应读 `--ran-surface-glass-overlay-*`，不要另起一套 fill。
- **SHOULD** 统一玻璃**菜单 chrome**（滑动 wash 光标、选中用字重），不要强行统一标签：语言等 URL 菜单继续用 `<details>` + `<a>`；主题 / 表面等取值菜单继续用 `r-select`。

## 宿主责任

把 Apple 的控件样式映射到 ranui 试点：

| 角色              | Apple 思路                  | ranui                                                                                                    |
| ----------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| 次要 / 工具条控件 | `glass`                     | 默认 `r-button`，在文档级 glass 或 `surface="glass"` 下起霜                                              |
| 强调操作          | `glassProminent` / 实心填充 | `type="primary"` 与 `type="warning"` 保持**实心**                                                        |
| 内容表面          | Standard materials          | `r-card`、`r-input` 在文档级 glass 下保持**实心**；仅当该元素本身是磨砂板时用 `surface="glass"` 选择加入 |
| 瞬时浮层          | Clear / sheet 玻璃          | `r-modal`、非 toast 的 `r-message`、`r-dropdown`（select 菜单），在文档级 glass 或 `surface="glass"` 下  |
| Toast 药丸        | 不透明强调                  | 保持**实心**                                                                                             |

用 `surface="solid"` 退出文档级玻璃。

页面 chrome（文档顶栏、应用壳）是**宿主**的事：库不会画你的站点顶栏。复用上面同一套原则；不要另起一套玻璃词汇。

## 五秒自检

1. 不看开关标签，能否分清实心与玻璃？
2. 内容是否仍可读，还是霜盖住了正文？
3. 磨砂 chrome 上的悬停与当前页是否一眼可见？
4. 降低透明度偏好下是否仍像有意设计？
5. 浅色与深色玻璃是否都保住对比？
