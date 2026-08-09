---
description: '在二维画布上对比一份数据集的多项指标的雷达图/蜘蛛图。'
---

# Radar 雷达图

在二维画布上综合对比一份数据集的多项指标，常用于比较 2 组或更多组数据。

> **适用场景**：需要一张雷达图/蜘蛛图来比较一份数据集的多项指标——通过 `abilitys` 属性向 `<r-radar>` 传入一个坐标轴名称与分值组成的 JSON 数组即可。

## 快速开始

### 基础用法

数据通过 `abilitys` 属性以 **JSON 字符串**的形式传入（一个对象数组）。由于 HTML 属性只能承载字符串，该值必须是合法的 JSON，内部会用 `JSON.parse` 解析。`<r-radar>` 宿主元素本身没有固有尺寸，需要显式设置宽高。

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

也可以通过 `abilitys` 这个 JS 属性以命令式方式设置数据；它既接受数组（会被重新字符串化写回 attribute），也接受 JSON 字符串：

```js
const radar = document.querySelector('r-radar');
radar.abilitys = [
  { abilityName: '生命', scoreRate: 10 },
  { abilityName: '攻击', scoreRate: 90 },
  { abilityName: '防御', scoreRate: 20 },
];
```

## API 参考

### 属性

| 属性           | 类型                | 默认值                                        | 说明                                             |
| -------------- | ------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `abilitys`     | `string` / `Array`  | `''`                                           | 图表数据，JSON 字符串（也可以通过 JS 属性传入数组） |
| `colorPolygon` | `string`            | `var(--ran-radar-polygon-color)` / `#e6e6e6`   | 同心多边形网格的颜色                              |
| `colorLine`    | `string`            | `var(--ran-radar-line-color)` / `#e6e6e6`      | 坐标轴线与外边框的颜色                            |
| `fillColor`    | `string`            | `rgba(255,121,35,0.60)`                        | 数据区域的填充色                                  |
| `strokeColor`  | `string`            | `rgba(255,121,35,0.60)`                        | 数据区域轮廓线与顶点圆点的描边色                  |
| `sheet`        | `string`            | `''`                                            | 注入组件 shadow DOM 的自定义样式                  |

`abilitys` 数组中每一项支持以下字段：

| 键                | 类型     | 是否必填 | 说明                                          |
| ----------------- | -------- | -------- | --------------------------------------------- |
| `abilityName`     | `string` | 是       | 坐标轴标签文本                                |
| `scoreRate`       | `number` | 是       | 该坐标轴上的数值；网格最大值固定为 `100`      |
| `backgroundColor` | `string` | 否       | 标签胶囊的背景色（默认透明）                  |
| `fontSize`        | `number` | 否       | 标签字体大小（默认按图表比例自适应）          |
| `fontColor`       | `string` | 否       | 标签文字颜色（默认取 `--ran-color-text`）     |
| `fontFamily`      | `string` | 否       | 标签字体（默认 `SimHei`）                     |

> 注意：`colorPolygon`、`colorLine`、`fillColor`、`strokeColor` 均按大小写不敏感的方式读取，无论属性在挂载前就已存在还是挂载后再修改都能正确渲染——修改其中任意一个都会触发图表重新绘制。如果希望颜色跟随主题自动切换，优先使用下面的 CSS 变量。

### 图表数据 `abilitys`

可以为每一项单独设置标签样式（`backgroundColor`、`fontSize`、`fontColor`）：

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 多边形网格颜色 `colorPolygon`

<r-radar style="width:300px;height:300px;display: block;" colorPolygon="green" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    colorPolygon="green"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 坐标轴线颜色 `colorLine`

<r-radar style="width:300px;height:300px;display: block;" colorLine="blue" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    colorLine="blue"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
></r-radar>
```

### 区域填充色 `fillColor`

<r-radar style="width:300px;height:300px;display: block;" fillColor="red" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    fillColor="red"
    abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 区域描边色 `strokeColor`

<r-radar style="width:300px;height:300px;display: block;" strokeColor="blue" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    strokeColor="blue"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 完整示例数据

由于 HTML 的 `attribute` 只能承载 `string`，因此传入的数据需要是 `json` 字符串格式，再通过 `JSON.parse` 解析成数组对象；如果 `JSON` 格式有误则无法解析：

```json
[
  {
    "abilityName": "生命",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "攻击",
    "scoreRate": "90"
  },
  {
    "abilityName": "防御",
    "scoreRate": "20"
  },
  {
    "abilityName": "元素精通",
    "scoreRate": "50"
  },
  {
    "abilityName": "暴击率",
    "scoreRate": "80"
  },
  {
    "abilityName": "暴击伤害",
    "scoreRate": "50"
  }
]
```

### CSS 变量

图表颜色也可以通过宿主元素上的 CSS 自定义属性来设置（可跟随主题响应式变化）：

| 变量                        | 默认值                                 | 说明                        |
| --------------------------- | --------------------------------------- | --------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6`   | 网格多边形颜色              |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6`   | 坐标轴线颜色                |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`                 | 数据区域填充色              |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`                 | 数据区域描边色              |
| `--ran-radar-width`         | `100%`                                  | 画布容器宽度                |
| `--ran-radar-height`        | `100%`                                  | 画布容器高度                |
| `--ran-radar-display`       | `block`                                  | 画布容器的 `display`       |
| `--ran-radar-position`      | `relative`                               | 画布容器的 `position`      |

标签文字颜色同样会回退到 `--ran-color-text` 主题 token，因此在浅色/深色模式下都能保持可读性。

## 事件

无。`<r-radar>` 不派发任何自定义事件。

## 最佳实践

- **尺寸设置**：宿主元素没有固有尺寸——务必显式设置 `width`/`height`（通过 `style` 或 `--ran-radar-width`/`--ran-radar-height` 变量）。容器尺寸变化时图表会通过 `ResizeObserver` 自动重绘。
- **数据格式**：`abilitys` 必须传入合法 JSON；格式错误会被记录且无法解析。若在脚本中直接操作真实数组，使用 `abilitys` 这个 JS 属性会更方便。
- **量表范围**：`scoreRate` 是相对固定最大值 `100` 衡量的，请把数值归一化到该范围内。
- **主题定制**：颜色相关属性（`colorPolygon`、`colorLine`、`fillColor`、`strokeColor`）是响应式的，挂载后修改会触发图表重新渲染。若希望颜色自动跟随浅色/深色主题切换，优先使用 `--ran-radar-*` 系列 CSS 变量。
