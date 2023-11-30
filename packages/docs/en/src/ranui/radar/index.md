# Radar 雷达图

以二维形式综合对比多组数据的差异,常用于比较 2 组或更多组数据集

## 代码演示

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

## 属性

### 需要展示的数据`abilitys`

一个数组对象，对象中属性如下

| 参数            | 说明                     | 类型             |
| --------------- | ------------------------ | ---------------- |
| abilityName     | 展示的属性名称           | 必传参数`string` |
| scoreRate       | 展示维度的数值，最大 100 | 必传参数`number` |
| backgroundColor | 属性名称的背景颜色       | 可选参数`string` |
| fontSize        | 属性名称的字体大小       | 可选参数`number` |
| fontFamily      | 属性名称的字体           | 可选参数`string` |
| fontColor       | 属性名称的字体颜色       | 可选参数`string` |

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 多边形颜色`colorPolygon`

<r-radar style="width:300px;height:300px;display: block;" colorPolygon="green" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    colorPolygon="green"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 顶点连线颜色`colorLine`

<r-radar style="width:300px;height:300px;display: block;" colorLine="blue" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    colorLine="blue"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
></r-radar>
```

### 数据渲染处的颜色`fillColor`

<r-radar style="width:300px;height:300px;display: block;" fillColor="red" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    fillColor="red"
    abilitys='[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 数据渲染处线和点的颜色`strokeColor`

<r-radar style="width:300px;height:300px;display: block;" strokeColor="blue" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

```xml
<r-radar
    strokeColor="blue"
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
```

### 使用的例子数据

由于`HTMl`的`attribute`只能获取`string`。因此需要传入的数据需要是`json`字符串格式，然后通过`JSON.parse`解析程数组对象，如果`JSON`格式有误，则无法解析。

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
