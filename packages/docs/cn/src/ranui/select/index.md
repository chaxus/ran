# Select 下拉选择框

一个普通的下拉选择器。

## 代码演示

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

## 属性

### 默认值`defaultValue`

设置当前选中的值

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```xml
    <r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### 不可用状态`disabled`

添加 disabled 属性即可让选择框处于不可用状态，同时样式也会改变。

<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
</r-select>

```xml
    <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### 类型`type`

可以设置文本类型，不要边框和下拉图标

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### 下拉框的展示方向`placement`

下拉框展示方向默认往下，设置成`top`可以往上

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### 带搜索框 `showSearch`

展开后可对选项进行搜索

<r-select style="width: 120px; height: 40px" showSearch>
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select style="width: 120px; height: 40px" showSearch>
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>
```

### 下拉框挂载元素的 id`getPopupContainerId`

下拉框默认挂载到`document.body`上，可以传入元素的`id`，挂载到指定的元素内
`
<r-select style="width: 120px; height: 40px" >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select getPopupContainerId="elementid">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### 下拉框的 class 名`dropdownclass`

如果需要自定义下拉框的样式，可以传入一个 `class` 名，进行自定义

### action

`select` 组件触发的方法。默认 `click` ，点击触发。可以设置`hover`，或者`click,hover`，表示点击和鼠标移入都触发。

如果设置成 none，就不会触发。

<r-select style="width: 120px; height: 40px" action="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select getPopupContainerId="elementid" action="click,hover">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```
