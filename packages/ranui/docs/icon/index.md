# Icon 图标

语义化的矢量图形

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
 <r-icon name="lock" ></r-icon>
 <r-icon name="eye" ></r-icon>
 <r-icon name="user" ></r-icon>
```

### 尺寸`size`

<div style='display:flex;align-items: flex-end;'>
 <r-icon name="lock" size="30" ></r-icon>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="lock" size="70" ></r-icon>
</div>

```html
 <r-icon name="lock" size="30" ></r-icon>
 <r-icon name="lock" size="50" ></r-icon>
 <r-icon name="lock" size="70" ></r-icon>
```

### 颜色`color`
<div style='display:flex'>
 <r-icon name="lock" size="50" color="red" ></r-icon>
 <r-icon name="lock" size="50" color="#1E90FF" ></r-icon>
 <r-icon name="lock" size="50" color="#F44336" ></r-icon>
 <r-icon name="lock" size="50" color="#3F51B5" ></r-icon>
</div>

```html
 <r-icon name="lock" size="50" color="red" ></r-icon>
 <r-icon name="lock" size="50" color="#1E90FF" ></r-icon>
 <r-icon name="lock" size="50" color="#F44336" ></r-icon>
 <r-icon name="lock" size="50" color="#3F51B5" ></r-icon>
```


### 旋转`spin`

设置spin开启旋转，传入数字控制旋转的速度，数字越小旋转越快

<div style='display:flex'>
 <r-icon name="loading" size="50" color="#1E90FF" spin='0.7'></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin='5'></r-icon>
</div>

```html
 <r-icon name="loading" size="50" color="#1E90FF" spin='0.7'></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
 <r-icon name="loading" size="50" color="#1E90FF" spin='5'></r-icon>
```

## 图标列表

<div style="display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: row wrap;">
    <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="lock" size="50" ></r-icon>
        <span>lock</span>
    </div>
     <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="unlock" size="50" ></r-icon>
        <span>unlock</span>
    </div>
    <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="eye" size="50" ></r-icon>
        <span>eye</span>
    </div>
     <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="eye-close" size="50" ></r-icon>
        <span>eye-close</span>
    </div>
    <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="check-circle" size="50" ></r-icon>
        <span>check-circle</span>
    </div>
    <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="close-circle" size="50" ></r-icon>
        <span>close-circle</span>
    </div>
    <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="info-circle" size="50" ></r-icon>
        <span>info-circle</span>
    </div>
     <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="user" size="50" ></r-icon>
        <span>user</span>
    </div>
     <div style="display: flex;
        align-items: center;
        margin: 15px;
        justify-content: center;
        flex-flow: column nowrap;">
        <r-icon name="loading" size="50" ></r-icon>
        <span>loading</span>
    </div>
</div>
