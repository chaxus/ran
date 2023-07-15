# preview 预览组件

支持`docx`，`pptx`，`pdf`文件的预览

## 代码演示

预览`docx`



<div style="width: 100px;margin-top:10px">
    <r-preview id="docx"><r-icon name="preview" size="50" color="#1E90FF"></r-icon>点击预览</r-preview>
    <r-button type="link" onclick="uploadFile('docx')">上传docx</r-button>
</div>



```xml
 <r-preview >点击预览</r-preview>
 <r-button type="link" onclick="uploadFile()">上传docx</r-button>
```

预览`pptx`
<div style="width: 100px;margin-top:10px">
    <r-preview id="pptx">这里是占位符</r-preview>
    <r-button type="link" onclick="uploadFile('pptx')">上传pptx</r-button>
</div>


```xml
 <r-icon name="eye"></r-icon><r-preview >点击预览</r-preview>
 <r-button type="link" onclick="uploadFile()">上传docx</r-button>
```

预览`pdf`
<div style="width: 100px;margin-top:10px">
    <r-preview id="pdf">这里是占位符</r-preview>
    <r-button type="link" onclick="uploadFile('pdf')">上传pptx</r-button>
</div>


```xml
 <r-icon name="eye"></r-icon><r-preview >点击预览</r-preview>
 <r-button type="link" onclick="uploadFile()">上传docx</r-button>
```

## 属性

### 预览的文件地址`src`

 <r-preview src="//www.ecma-international.org/wp-content/uploads/ECMA-423_1st_edition_june_2023.pdf">预览的文案或者图片什么的，点击预览</r-preview>

```xml
 <r-preview src="//www.ecma-international.org/wp-content/uploads/ECMA-423_1st_edition_june_2023.pdf">预览的文案或者图片什么的，点击预览</r-preview>
```
