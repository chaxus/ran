# 随机与噪声

## 随机函数

在 JS 中，我们可以用它的内置函数 Math.random 来模拟随机，但是，直到本小册成书为止，GLSL 却仍没有内置的随机函数可供使用。所幸的是，在 GitHub 上，已经有人封装好了随机函数——glsl-random，先来看看它是什么样的。

```glsl
highp float random(vec2 co)
{
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy,vec2(a,b));
    highp float sn=mod(dt,3.14);
    return fract(sin(sn)*c);
}
```

这个随机函数的意义是取 sin 函数偏后面的小数部分来模拟伪随机数。

我们可以给它传入一个 UV 坐标，看看会输出什么效果。

```glsl
void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;

    float noise=random(uv);

    vec3 col=vec3(noise);
    fragColor=vec4(col,1.);
}
```
