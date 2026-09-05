---
description: 'ranui 的设计语言与完整令牌参考，覆盖全部全局 `--ran-*` 令牌：Geist 颜色阶梯（含明暗两套值）、语义令牌、间距、尺寸、排版、圆角、投影、层级、动效、聚焦与皮肤基元。'
---

# Design system 设计系统

ranui 构建于其上的**设计语言**，以及表达这套语言的**完整**令牌清单：组件库声明的每一个全局
`--ran-*` 自定义属性，都附上它在明暗两套主题下的取值。组件读的是这些令牌而不是写死的数值，所以覆盖
一个令牌就能改变所有用到它的地方。

三个页面回答三个不同的问题，刻意拆开：

| 页面                                     | 回答                     |
| ---------------------------------------- | ------------------------ |
| **设计系统**（本页）                     | 令牌**是什么**，即词汇表 |
| [设计规范](/cn/src/ranui/design-guides/) | 做界面时**如何取舍**     |
| [主题系统](/cn/src/ranui/theme/)         | 运行时**如何切换与覆盖** |

> **适用场景**：需要查某个令牌的名字或取值（颜色角色、间距档位、图标尺寸、投影层级、缓动曲线），
> 或想理解这些阶梯为什么长这样。

## 设计语言：Geist

ranui 的令牌基于 [Geist](https://vercel.com/geist)，也就是 Vercel 的开源设计体系。每条色阶都是
一条由固定职责组成的阶梯，每一档对应一个职责，而不是供人随意挑选的深浅色块：200 不是「稍深一点
的灰」，它就是「悬停背景」。每一档的职责一旦固定，给某个交互状态选颜色就是查表，不用临场判断。

ranui 把这套阶梯落成 `--ran-*` 色阶，在其上叠加语义令牌，并以 **Geist Sans / Geist Mono** 作为
默认字体。

## 两层令牌 {#two-layers}
**第一层，基础色板**：下面这些原始色阶，很少直接消费。

**第二层，语义令牌**：`--ran-color-*` 等，映射到第一层。**请使用这一层。** 暗色模式只重定义第一
层，每个语义令牌都通过 `var()` 自动翻转，整个组件库不存在任何组件级的暗色覆盖。

```
--ran-gray-1000        →  #171717（浅色） / #ededed（暗色）     ← 第一层，会翻转
--ran-color-text       →  var(--ran-gray-1000)                   ← 第二层，跟随
--ran-btn-color        →  var(--ran-color-text, …)               ← 组件令牌
```

这条链条就是整个架构：改基础档位则全局传导，改语义令牌则改一个角色，改组件令牌则只改一个元素。

## 颜色

### 状态阶梯 {#the-ladder}
每条色阶从 `100` 走到 `1000`，每一档职责固定：

| 档位 | 职责             | 档位 | 职责                  |
| ---- | ---------------- | ---- | --------------------- |
| 100  | 默认背景         | 600  | 激活边框              |
| 200  | 悬停背景         | 700  | 实心填充（按钮/徽标） |
| 300  | 激活（按下）背景 | 800  | 实心填充（悬停）      |
| 400  | 默认边框         | 900  | 次要文字与图标        |
| 500  | 悬停边框         | 1000 | 主要文字与图标        |

### 背景

| 令牌                   | 浅色                                                            | 暗色                                                            | 用于         |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ------------ |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | 页面背景     |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | 轻微区分区域 |

### 灰阶 —— `--ran-gray-100..1000`

文字、边框与表面背后的色阶。

| 档位 | 浅色                                                            | 暗色                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200  | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300  | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400  | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500  | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600  | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700  | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800  | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900  | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000 | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### 半透明灰 —— `--ran-gray-alpha-100..1000`

半透明，可以叠在任意表面上。遮罩、悬停蒙层，或者必须压在未知内容之上的分隔线，都该用它。

| 档位 | 浅色                                                                         | 暗色                                                                         |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100  | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200  | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300  | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400  | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500  | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600  | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700  | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800  | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900  | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000 | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### 蓝 —— `--ran-blue-100..1000`

只保留给链接与聚焦环。

| 档位 | 浅色                                                            | 暗色                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200  | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300  | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400  | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500  | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600  | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700  | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800  | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900  | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000 | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### 红 —— `--ran-red-100..1000`

危险与错误。

| 档位 | 浅色                                                            | 暗色                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200  | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300  | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400  | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500  | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600  | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700  | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800  | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900  | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000 | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### 琥珀 —— `--ran-amber-100..1000`

警告。

| 档位 | 浅色                                                            | 暗色                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200  | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300  | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400  | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500  | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600  | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700  | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800  | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900  | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000 | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### 绿 —— `--ran-green-100..1000`

成功。

| 档位 | 浅色                                                            | 暗色                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200  | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300  | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400  | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500  | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600  | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700  | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800  | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900  | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000 | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### 语义颜色令牌

组件真正读取的那一层。这里的一切都通过上面的色阶解析，因此会自己跟着主题翻转。

| 令牌                           | 解析到                                                                                                                                 | 职责                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                 | 页面背景                 |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                 | 轻微区分的区域           |
| `--ran-color-bg-elevated`      | `--ran-background-100` · 暗色下为 gray-100                                                                                             | 卡片、表面               |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                       | 内凹 / 弱化填充          |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                       | 悬停表面                 |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                       | 激活（按下）表面         |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                      | 主要文字                 |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                       | 次要文字                 |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                       | 禁用文字                 |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                       | 默认边框                 |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                       | 更弱的边框               |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                       | 悬停边框                 |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                       | 激活边框                 |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                      | 主操作（无彩色）         |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · 暗色 <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` | 主操作悬停               |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · 暗色 <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` | 主操作按下               |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                 | 主操作表面**之上**的文字 |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                      | 成功                     |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                      | 警告                     |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                        | 危险 / 错误              |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                       | 链接                     |

`--ran-color-primary-hover` / `-active` 是语义层里仅有的两个字面量：它们是朝页面背景方向走的，而不
是沿着某条色阶走，所以暗色模式直接重定义了它们。

### 每个色彩语义只有一个含义

- **主操作是无彩色的**：浅色下黑底白字，暗色下白底黑字（Geist 的品牌调性，
  `<r-button type="primary">`）。其上的文字与图标用 `--ran-color-primary-text`，会一起翻转。
  这里没有单独的「contrast」令牌：主操作**本身**就是对比度最高的那一个。
- **蓝色是保留色**，只用于链接（`--ran-color-link`）与聚焦环，不是备选的主色。
- **绿色=成功 · 琥珀=警告 · 红色=危险**，一色一义。

不存在 `--ran-color-error`，危险色叫 `--ran-color-danger`。`var()` 引用一个从未声明过的属性会解析
为「空」，整条声明会被丢弃，而且不会有任何报错，所以名字宁可对着表查，也别猜。

## 间距 {#spacing}
元素之间的距离：`padding`、`margin`、`gap`。以 4px 为基数，**只有九档**：

| 令牌            | 值   | 令牌             | 值   |
| --------------- | ---- | ---------------- | ---- |
| `--ran-space-1` | 4px  | `--ran-space-8`  | 32px |
| `--ran-space-2` | 8px  | `--ran-space-10` | 40px |
| `--ran-space-3` | 12px | `--ran-space-16` | 64px |
| `--ran-space-4` | 16px | `--ran-space-24` | 96px |
| `--ran-space-6` | 24px |                  |      |

数字是 4px 的倍数，所以档位是跳着的，没有 `--ran-space-5`。这正是重点：档位有限，页面才有节奏。

## 尺寸

元素自身的尺寸：图标大小、控件高度、小的方形/矩形控件。

| 令牌           | 值   | 典型用途                 |
| -------------- | ---- | ------------------------ |
| `--ran-size-1` | 16px | 多选框方块、小号内联图标 |
| `--ran-size-2` | 18px | —                        |
| `--ran-size-3` | 20px | 控件内部的图标           |
| `--ran-size-4` | 24px | 工具栏图标按钮           |
| `--ran-size-5` | 28px | 紧凑控件高度             |
| `--ran-size-6` | 30px | —                        |
| `--ran-size-7` | 32px | 默认控件高度             |

**这是刻意与间距分开的另一条尺度**，混用会被机器校验拦下（`sizing-scale` 规则）。两者的取值范围和
递进方式不同：4px 翻倍式的间距尺度用在图标和控件尺寸上会得出别扭的数值；而且使用者必须能在不动另
一个的前提下单独调整其中一个：图标变大，不应该顺带把每一个恰好同值的间隙也撑开。某一档在数值上与
间距档位重合（`--ran-size-4` 和 `--ran-space-6` 都是 24px）只是巧合，不是别名。

真正一次性、没有别的组件共享的尺寸（比如某个菜单的 `min-width`），就保持为带自己字面量兜底的组件
令牌，不要硬塞进某一档。

## 排版 {#typography}
| 令牌                | 值                                                           |
| ------------------- | ------------------------------------------------------------ |
| `--ran-font-family` | Geist / Geist Sans，其后是系统 UI 字体栈                     |
| `--ran-font-mono`   | Geist Mono，其后是 `ui-monospace`、SF Mono、Menlo、Consolas… |
| `--ran-font-size`   | `14px`，基准字号                                             |
| `--ran-line-height` | `1.5715`                                                     |

排版按**角色**组织，角色一旦确定，字体、字号、字重、行高就一起定了：

| 角色        | 用于         | 字重令牌                                                                        | 字号令牌                                   |
| ----------- | ------------ | ------------------------------------------------------------------------------- | ------------------------------------------ |
| **heading** | 标题         | `--ran-text-heading-weight`（600）                                              | `--ran-text-heading-1..4`（32/24/20/16px） |
| **label**   | 单行、可扫读 | `--ran-text-label-weight`（500）                                                | `--ran-text-label-1..3`（14/13/12px）      |
| **copy**    | 多行正文     | `--ran-text-copy-weight`（400）                                                 | `--ran-text-copy-1..2`（16/14px）          |
| **button**  | 按钮文字     | `--ran-text-button-weight`（500）                                               | `--ran-text-button-size`（14px）           |
| **mono**    | 代码、数据   | `--ran-text-mono-weight-regular`（400）/ `--ran-text-mono-weight-medium`（500） | 复用 label / copy 档位                     |

另有两个令牌只是为了让角色落地正确：

| 令牌                            | 值        | 原因                             |
| ------------------------------- | --------- | -------------------------------- |
| `--ran-text-heading-tracking`   | `-0.03em` | 大字号标题需要更紧的字距。       |
| `--ran-text-button-line-height` | `1`       | 定高控件内的文字才能锐利地居中。 |

Geist 的字重最高只到 600（semibold），强调靠字号和留白，而不是更粗的字重。没有
`--ran-text-copy-3`：12px 那一档叫 `--ran-text-label-3`。

### 字体

ranui 自托管这两套字体（可变字重 100–900，SIL OFL 1.1 许可），一次引入即可，不依赖 CDN：

```js
import 'ranui/fonts'; // 打包器
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

不引入也能正常工作，只是回退到系统字体栈。

## 圆角

| 令牌                | 值       | 用于                         |
| ------------------- | -------- | ---------------------------- |
| `--ran-radius-sm`   | `6px`    | 控件（按钮、输入框、选择器） |
| `--ran-radius-md`   | `12px`   | 卡片、对话框                 |
| `--ran-radius-lg`   | `16px`   | 大面积表面                   |
| `--ran-radius-full` | `9999px` | 胶囊、头像                   |

## 投影

投影是**角色**，不是装饰，按元素「是什么」来选层级。暗色模式会把三档全部替换，因为为白色页面调过
的投影放到黑色页面上就看不见了。

| 令牌                    | 用于                                                    | 浅色                                                            | 暗色                                                                                        |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | 文档流内、同时带边框的表面，如 `r-card`、`r-section`    | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | 浮在内容之上的临时层，如下拉、选择面板、气泡卡片、toast | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | 阻塞式对话框，如 `r-modal`                              | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

无边框的浮层只靠投影与页面拉开距离，所以浮层层级的投影必须有真实重量；浮层若回退到「抬起」层级，
看起来就像贴在页面上。

## 层级 {#stacking}
浮层会 portal 到 `<body>`，因此需要明确的层级：

| 令牌               | 默认值 | 用于                                                                     |
| ------------------ | ------ | ------------------------------------------------------------------------ |
| `--ran-z-modal`    | `1000` | 阻塞式对话框及其遮罩                                                     |
| `--ran-z-dropdown` | `1100` | 下拉 / 选择面板 / 气泡卡片，**高于** modal，弹窗内的选择面板才不会被盖住 |
| `--ran-z-message`  | `1200` | toast 与通知，永远在最上层                                               |

阶梯从 1000 起，是为了越过常规页面骨架（导航栏、遮罩通常在几十的量级）。可以在 `:root` 上整体覆盖，
也可以按组件覆盖（`--ran-dropdown-host-z-index`、`--ran-modal-root-z-index`、
`--ran-message-z-index`），但不要用 `!important`。

## 动效

| 令牌                         | 值      | 用于                |
| ---------------------------- | ------- | ------------------- |
| `--ran-motion-duration-fast` | `0.15s` | 悬停 / 激活状态过渡 |
| `--ran-motion-duration-base` | `0.2s`  | 气泡、菜单          |
| `--ran-motion-duration-slow` | `0.35s` | 较大的展开          |

| 缓动令牌                     | 曲线                                | 性格                           |
| ---------------------------- | ----------------------------------- | ------------------------------ |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | in-out，通用                   |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | 干脆、无回弹，用于开关等小状态 |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | 轻微回弹，用于按钮、卡片       |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | 明显回弹，用于点赞、加入购物车 |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | 平缓、无回弹，用于展开与布局   |

spring 这一族是把调好的 SwiftUI 弹簧参数（response / damping）折算成的单次回弹贝塞尔曲线。

**只把它们用在运动属性上**，即 `transform`、`opacity` 和盒模型几何属性。调色属性
（`background-color`、`color`、`border-color`、`box-shadow`、`fill`、`stroke`）刻意不带默认过渡：
CSS 分不清「交互」和「主题翻转」，你给颜色加的淡入淡出，在明暗切换时同样会触发。每个组件仍然保留
`--ran-*-transition` 钩子，需要时可以自行开启。

## 聚焦

| 令牌                             | 值                                                                   | 用于                                   |
| -------------------------------- | -------------------------------------------------------------------- | -------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | 标准聚焦环，形式是 `box-shadow`        |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | **两套主题下都是深色**的表面上的环颜色 |

聚焦环是双层的（内层用背景色，外层用蓝色），所以在任何表面上都清晰可见；而且它保持蓝色，不跟随已经
变成无彩色的主操作色。

`--ran-focus-ring-inverse-color` **刻意没有在暗色模式里重定义**：它是给那种「无论页面主题如何、自身
表面始终是深色」的组件用的（`r-player` 覆盖在任意视频之上的控制条），而那种表面并不随页面主题变化。

## 皮肤基元

组件共享的、既不属于颜色也不属于尺寸和排版的少数结构性取值。刻意保持精简：这一层以前大得多，
大部分已经随主题包一起移除了。

| 令牌                            | 值                           | 用于                                                                  |
| ------------------------------- | ---------------------------- | --------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | 组件绘制的边框宽度                                                    |
| `--ran-skin-border-style`       | `solid`                      | 组件绘制的边框样式                                                    |
| `--ran-skin-border-image-width` | `4px`                        | `border-image-slice` 的内缩，button/checkbox/input/modal/message 共享 |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | 抬起表面的投影，做一层间接以便皮肤替换                                |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | 组件使用的字体族，同样做了一层间接                                    |

## 暗色模式重定义了哪些

`<html>` 上的 `data-ran-theme="dark"`（也可以只作用于某棵子树，见[主题系统](/cn/src/ranui/theme/)）
**只重定义基础色板**，外加三处无法通过色阶解析的例外：

- 第一层的全部：gray、gray-alpha、blue、red、amber、green 的每一档，以及两个背景；
- `--ran-color-bg-elevated`，暗色下指向 `--ran-gray-100`，这样卡片才能从黑色页面上浮起来而不是融进去；
- `--ran-color-primary-hover` / `-active`，它们是字面量而不是色阶引用；
- 三档投影，为深色底重新调过。

其余的一切（所有其他语义令牌、所有尺寸、所有时长）都只定义一次。

## 组件令牌

语义层之下，每个组件还暴露自己的钩子，命名为：

```
--ran-{component}-{element}[-{state}]-{property}
```

例如 `--ran-btn-hover-background`、`--ran-select-search-active-border-width`。它们默认指向语义令牌，
例如 `var(--ran-btn-background, var(--ran-color-primary, #171717))`，所以覆盖语义令牌能一次影响
全部，覆盖组件令牌则只改一个元素。

完整清单见仓库中的
[style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)，
逐元素接口见[元素 API](/cn/src/ranui/api)。怎么覆盖见[主题系统](/cn/src/ranui/theme/#customizing-tokens)。

## 在自己的 CSS 里使用令牌 {#using-tokens-in-your-own-css}
```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

三条规则保证它暗色安全：

1. 该跟随主题的值，**不要写死 hex**。
2. **兜底值必须是会翻转的令牌**，写 `var(--ran-color-text, var(--ran-gray-1000))`，不要写
   `var(--ran-color-text, #171717)`。
3. **兜底值引用的令牌必须存在**，否则整条声明被丢弃，元素静默沿用继承来的样式。

> 组件库声明的每一个全局令牌都在本页列出；新增令牌若没有在这里记录，单元测试会失败。组件级令牌另行
> 生成，见
> [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md)。
