Shader 的本质是用各种数学计算来操控屏幕上的像素，这带给了我们极高的自由度：小到写各种创意的图形 demo，大到实现 3D 游戏里的场景特效，对于我们前端来说，则可以实现各种新颖的网页特效。

下面我推荐一些 Shader 味很足的网站，有兴趣的小伙伴可以点进去看看：

- kentatoshikura.com/
- homunculus.jp/
- hsmkrt1996.com/
- www.nightingale.world/
- unseen.co/
- zero.tech/

# Shader 在 vscode 开发插件

以下列举了一些助力 Shader 开发的插件，它们是 VSCode 编辑器专用的，如果你用的是别的编辑器，请自行寻找对应的替代品。

Shader 语言支持（必须）
首先，我们的 Shader 文件的代码需要有完整的高亮支持。

在插件中搜索 Shader languages support for VS Code，安装即可。

Shader 实时预览（必须）
其次，我们希望能实时预览我们 Shader 渲染的效果。

在插件中搜索 Shader Toy，安装即可。

HTML 实时预览（必须）
在后面的某几个章节里，我们将会把 Shader 代码直接作为字符串写入 html 文件，因此需要一个能直接预览 html 文件渲染结果的插件。

在插件中搜索 Live Preview，安装即可。

JS 中的 Shader 高亮（可选）
在后面的某几个章节里，我们的 html 文件的 JS 部分会有 Shader 代码的字符串，它们也需要得到高亮提示。

在插件中搜索 es6-string-html，安装即可。

Shader 格式化（可选）
有一个比较实用的插件，它为 Shader 代码提供了格式化功能，同时也提供了取色器，方便调整 3 维变量的颜色值。

在插件中搜索 glsl-canvas，安装即可。

# 首先，编写 Shader 的主体。
