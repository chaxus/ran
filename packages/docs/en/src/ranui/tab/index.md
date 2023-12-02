# Tab 

TAB pages, where 'r-tab' needs to be used with 'r-tabs'

## Code demo

<div style="width:100%;">
    <r-tabs >
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs >
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## Attribute

### `label`

'r-tab' property to set the name of the tag

<div style="width:100%;">
    <r-tabs >
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs >
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### active tag 'active', the tag's unique identifier 'ranKey'

- 'ranKey' is an attribute of 'r-tab' that determines the unique value of 'r-tab' under the same 'r-tabs'. If 'ranKey' is not set, it defaults to 'index'. (Not using the 'key' field is to prevent the 'key' is reserved field)
- 'active' is an attribute of 'r-tabs', which is used to set active tabs. The label 'active' equals' key 'is an active label.

1. 'key' is not set

<div style="width:100%;">
    <r-tabs active="1">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs active="1">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
 </r-tabs>
```

1. Set 'key'

<div style="width:100%;">
   <r-tabs active="c">
      <r-tab label="tab1" ranKey="a">11111</r-tab>
      <r-tab label="tab2" ranKey="b">22222</r-tab>
      <r-tab label="tab3" ranKey="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
</div>

```xml
    <r-tabs active="c">
      <r-tab label="tab1" ranKey="a">11111</r-tab>
      <r-tab label="tab2" ranKey="b">22222</r-tab>
      <r-tab label="tab3" ranKey="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
```

### `disabled`

Set unclickable labels

<div style="width:100%;">
   <r-tabs active="c">
      <r-tab label="tab1" ranKey="a" disabled>11111</r-tab>
      <r-tab label="tab2" ranKey="b">22222</r-tab>
      <r-tab label="tab3" ranKey="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
</div>

```xml
    <r-tabs active="c">
      <r-tab label="tab1" ranKey="a" disabled>11111</r-tab>
      <r-tab label="tab2" ranKey="b">22222</r-tab>
      <r-tab label="tab3" ranKey="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
```

### `type`

The 'r-tabs' property sets the types of tabs. If not set, the default is' flat '

1. `flat`

<div style="width:100%;">
    <r-tabs type="flat">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs type="flat">
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

2. `line`

<div style="width:100%;">
    <r-tabs type="line">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs type="line">
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### `align`

Set the alignment of the label. The default is' align="start" '

1. `start`

<div style="width:100%;">
    <r-tabs type="line" align="start">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="start">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```

2. `center`

<div style="width:100%;">
    <r-tabs type="line" align="center">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="center">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```

3. `end`

<div style="width:100%;">
    <r-tabs type="line" align="end">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="end">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```
