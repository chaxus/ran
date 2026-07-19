# Linear Algebra

## I: What Exactly Is a Vector

The most basic, most fundamental building block of linear algebra is the vector. Generally speaking, there are three ways of looking at a vector:

1. From a physicist's perspective: a vector is an arrow in space, defined by its length and the direction it points. A vector in a plane is two-dimensional, while a vector in the space we live in is three-dimensional. As long as the length and direction stay the same, we're free to move it around without the vector changing.
2. From a computer scientist's perspective: a vector is an ordered list of numbers. For instance, suppose we're doing some analysis related to housing prices, and we only care about two features: house area and price. We'd model a house using a pair of numbers:

<r-math latex="\begin{bmatrix} \text{127.6$m^2$} \\ \text{¥176} \end{bmatrix}"></r-math>

The first is the house area, and the second field is the price. Note that the order of these numbers cannot be swapped. We'd model the house using a two-dimensional vector.

3. Mathematicians try to generalize these two viewpoints: broadly speaking, a vector can be anything, as long as vector addition and scalar multiplication of a vector are well defined.

In short, vector addition and scalar multiplication run throughout linear algebra and play a very important role.

## II: Linear Transformations

A transformation refers to the process of taking an input and producing an output. Any given transformation can be arbitrarily complex. A linear transformation refers to a special class of transformations.

Geometrically speaking, if a line remains a straight line after the transformation — without any curving — and the origin stays fixed, then it's a linear transformation.

In short, this means the grid lines remain parallel and evenly spaced. Some linear transformations are easy to picture, such as rotation around the origin, scaling, and shearing.

Next, let's describe linear transformations numerically. Given a vector, applying a linear transformation to it produces another vector.

It turns out that we only need to record where <r-math style="display: inline-block;" latex="\hat{i}"></r-math> and <r-math style="display: inline-block;" latex="\hat{j}"></r-math> land after the transformation. Every other vector will follow accordingly.

## III: Matrix-Vector Multiplication

A linear transformation is completely determined by its effect on the space's basis vectors, because any other vector can be expressed as a linear combination of the basis vectors.

The fact that grid lines remain parallel and evenly spaced after a linear transformation leads to a beautiful consequence:

As long as we record where the basis vectors land after the linear transformation, we can determine where any vector <r-math style="display: inline-block;" latex="\begin{bmatrix} x \\ y \end{bmatrix}"></r-math> lands after the transformation. It's simply vector x times <r-math style="display: inline-block;" latex="\hat{i}"></r-math>, plus vector y times <r-math style="display: inline-block;" latex="\hat{j}" ></r-math>.

For example, suppose we have a vector <r-math style="display: inline-block;" latex="\vec{v} = \begin{bmatrix} -1 \\ 2 \end{bmatrix}"></r-math>, which is equivalent to <r-math style="display: inline-block;" latex="\vec{v} = -1 \hat{\imath} + 2 \hat{\jmath}"></r-math>. We then apply a linear transformation such that <r-math style="display: inline-block;" latex="\hat{\imath} = \begin{bmatrix}1 \\ -2 \end{bmatrix}, \quad \hat{\jmath} = \begin{bmatrix} 3 \\ 0 \end{bmatrix}"></r-math>. The transformed vector <r-math style="display: inline-block;" latex="\vec{v}"></r-math> is then <r-math style="display: inline-block;"  latex="\vec{v} = 1 \begin{bmatrix} 1 \\ -2 \end{bmatrix} + 2 \begin{bmatrix} 3 \\ 0 \end{bmatrix} =  \begin{bmatrix} 1 + 6 \\ -2 + 0 \end{bmatrix} = \begin{bmatrix} 7 \\ -2 \end{bmatrix}"></r-math>

In other words, this turns vector-matrix multiplication into scalar multiplication and addition of vectors.

<r-math latex="\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}"></r-math>

Here, we call <r-math style="display: inline-block;" latex="\begin{bmatrix} a \\ c \end{bmatrix}"></r-math> the vector <r-math style="display: inline-block;" latex="\hat{i}" ></r-math>, and <r-math style="display: inline-block;" latex="\begin{bmatrix} b \\ d \end{bmatrix}"></r-math> the vector <r-math style="display: inline-block;" latex="\hat{j}" ></r-math>.

This can therefore be extended to multiplication between an n-dimensional vector and a matrix:

<r-math latex="\mathbf{b} = A \mathbf{x}"></r-math>

Where:

<r-math latex="A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix}, \quad \mathbf{x} = \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}, \quad \mathbf{b} = \begin{pmatrix} b_1 \\ b_2 \\ \vdots \\ b_m \end{pmatrix}"></r-math>

Multiplying a matrix by a vector is precisely applying the linear transformation to that vector.

## IV: Matrix Multiplication

Often, we want to describe an effect like this: after applying one transformation, apply another. For example, we might want to describe rotating first, then shearing. In general, this is a composite linear transformation.

How should we describe such a composite transformation? This is what matrix multiplication does:

<r-math latex="\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e & f \\ g & h \end{bmatrix} = \begin{bmatrix} ae + bg & af+ bh \\ ce + dg & cf + dh \end{bmatrix}"></r-math>

Note that matrix multiplication is applied from right to left. We can understand this as: <r-math style="display: inline-block;" latex="\hat{i}"></r-math> and <r-math style="display: inline-block;" latex="\hat{j}"></r-math> first undergo the transformation on the right, then the transformation on the left.

<r-math style="display: inline-block;" latex="\hat{i}"></r-math> and <r-math style="display: inline-block;" latex="\hat{j}"></r-math> first move to the position <r-math style="display: inline-block;" latex="\begin{bmatrix} e \\ g \end{bmatrix}"></r-math>, undergoing vector-matrix multiplication. Then the vector <r-math style="display: inline-block;" latex="\begin{bmatrix} f \\ h \end{bmatrix}"></r-math> undergoes the same multiplication, and the final result is the matrix product.

We can extend this to the n-dimensional case:

Suppose we have two transformations:

<r-math latex="A = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}, \quad B = \begin{bmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \end{bmatrix}"></r-math>

The matrix product <r-math style="display: inline-block;" latex="C = AB"></r-math> is:

<r-math latex="C = \begin{bmatrix} c_{11} & c_{12} \\ c_{21} & c_{22} \end{bmatrix}"></r-math>

Where:

<r-math latex="c_{11} = a_{11}b_{11} + a_{12}b_{21}"></r-math>
<r-math latex="c_{12} = a_{11}b_{12} + a_{12}b_{22}"></r-math>
<r-math latex="c_{21} = a_{21}b_{11} + a_{22}b_{21}"></r-math>
<r-math latex="c_{22} = a_{21}b_{12} + a_{22}b_{22}"></r-math>

## V: Affine Transformations

Geometrically, a linear transformation has three key properties:

- Lines before the transformation remain lines after the transformation
- Ratios along a line remain unchanged
- The origin before the transformation remains the origin after the transformation

Numerically, a linear transformation is implemented via matrix multiplication.

<r-math latex="\vec{y}=A\vec{x}"></r-math>

An affine transformation, geometrically, has only two key properties:

- Lines before the transformation remain lines after the transformation
- Ratios along a line remain unchanged

It's missing the requirement that the origin stays fixed. Translation, for example, is an affine transformation rather than a linear transformation, because the origin moves.

So numerically, an affine transformation requires not just matrix multiplication, but also addition.

<r-math latex="\vec{y}=A\vec{x}+\vec{b}"></r-math>

For the formula above, we can raise the dimensionality to turn the translation into a linear transformation.

<r-math latex="\vec{y}=A\vec{x}+\vec{b} = \begin{bmatrix} \vec{y} \\ 1 \end{bmatrix} = \begin{bmatrix} A & \vec{b} \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \vec{x} \\ 1 \end{bmatrix}"></r-math>

After adding a dimension, we can accomplish the lower-dimensional affine transformation through a linear transformation in the higher dimension.

Geometrically, this can be understood as adding a <r-math style="display: inline-block;" latex="\vec{z}"></r-math> axis, so that translation becomes a transformation along the <r-math style="display: inline-block;" latex="\vec{z}"></r-math> direction — thereby ensuring that the grid lines remain parallel and evenly spaced.
