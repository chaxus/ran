# 线性代数

## 一：向量究竟是什么

线性代数中最基础，最根源的组成部分就是向量。一般来说，有三种看待向量的观点：

1. 从物理学家的视角来看：向量是空间中的箭头，决定一个向量是它的长度和它所指的方向。其中平面的向量是二维的，处在我们生活的向量是三维的。只要长度和方向相同，我们就可以自由的移动它而向量不会发生改变。
2. 从计算机学家的角度来看：向量是有序的数字列表。比如正在做一些有关房价的分析，我们只用关注两个特征：房屋面积和价格。我们会用一对数字对房屋进行建模：

<r-math latex="\begin{bmatrix} \text{127.6$m^2$} \\ \text{¥176} \end{bmatrix}"></r-math>

第一个是房屋面积，第二个字段是价格。注意，这里的数字顺序是不能颠倒的。我们会用二维向量对房屋进行建模

3. 数学家会试图概括这两种观点：大致地说，向量可以是任何东西。只要保证向量相加以及数字与向量相乘是有意义的即可。

总之，向量的加法和向量的数乘贯穿线性代数始终，二者起到很重要的作用。

线性变化由它对空间的基向量的作用完全决定，这是因为，其他任意向量，都能表示成基向量的线性组合。

在线性变化之后，网格线保持平行并等距分布这一性质有一个绝妙的推论：

只要记录基向量线性变换后的位置，就能知道任意向量<r-math style="display: inline-block;" latex="\begin{bmatrix} x \\ y \end{bmatrix}"></r-math>变换后的坐标。就是向量 x 乘以 <r-math style="display: inline-block;" latex="\hat{i}"></r-math>，再加上向量 y 乘以 <r-math style="display: inline-block;" latex="\hat{j}" ></r-math>

也就是把向量的乘法，转换为了向量的数乘和相加。

<r-math latex="\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}"></r-math>

其中，我们把<r-math style="display: inline-block;" latex="\begin{bmatrix} a \\ c \end{bmatrix}"></r-math>称之为<r-math style="display: inline-block;" latex="\hat{i}" ></r-math>,<r-math style="display: inline-block;" latex="\begin{bmatrix} b \\ d \end{bmatrix}"></r-math>称之为<r-math style="display: inline-block;" latex="\hat{j}" ></r-math>

因此，可以扩展到 n 维向量和矩阵的乘法：

<r-math latex="\mathbf{b} = A \mathbf{x}"></r-math>

其中：

<r-math latex="A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}, \quad \mathbf{x} = \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}, \quad \mathbf{b} = \begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_m \end{pmatrix}"></r-math>

而矩阵与向量相乘，就是将线性变化作用于这个向量。

很多时候，会想去描述这样一种作用：一个变换之后，在进行另一个变化。比如，想进行描述，先旋转，再斜切。总的来说，是一种复合的线性变换。

我们应该如何去描述这种复合变换呢？这就是矩阵的乘法：

需要注意的是，矩阵的乘法是从右向左的。我们可以理解为： <r-math style="display: inline-block;" latex="\hat{i}"></r-math>和 <r-math style="display: inline-block;" latex="\hat{j}"></r-math>，先进行了右边的矩阵变换，再进行了左边的矩阵变换。



假设两个变换分别为：

<r-math latex="A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix}, \quad B = \begin{pmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \end{pmatrix}"></r-math>

矩阵乘法 <r-math style="display: inline-block;" latex="C = AB"></r-math> 的结果为：

<r-math latex="C = \begin{pmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{pmatrix}"></r-math>

其中：

<r-math latex="c_{11} = a_{11}b_{11} + a_{12}b_{21}"></r-math>
<r-math latex="c_{12} = a_{11}b_{12} + a_{12}b_{22}"></r-math>
<r-math latex="c_{21} = a_{21}b_{11} + a_{22}b_{21}"></r-math>
<r-math latex="c_{22} = a_{21}b_{12} + a_{22}b_{22}"></r-math>
