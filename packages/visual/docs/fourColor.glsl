/**
* @description:
* @params {vec4} fragColor - 输出像素的颜色
* @params {vec2} fragCoord - 输入像素的坐标
* @return {void}
*/
void mainImage(out vec4 fragColor,in vec2 fragCoord){
  // 定义颜色变量
  vec3 color1=vec3(1.,0.,1.);
  vec3 color2=vec3(1.,1.,0.);
  vec3 color3=vec3(0.,0.,1.);
  vec3 color4=vec3(1.,0.,0.);
  // 定义大小和位置
  // 这里用到 fragCoord 变量了，它代表了输入的像素坐标，有 2 个维度xy，它们的大小取决于画面本身的大小。
  // 假设我们画面当前的大小为1536x864，那么每一个像素的fragCoord的x坐标值将会分布在(0,1536)之间，y坐标值则分布在(0,864)之间。
  // 在当前的Shader开发环境内，还有个内置的变量iResolution，代表了画面整体的大小，使用它时一般会取它的xy维度。
  // 我们取fragCoord的x轴维度，判断如果它小于四分之一的画面长度iResolution.x*.25，就填充第一种颜色color1。
  if(fragCoord.x<iResolution.x*.25){
    fragColor=vec4(color1,1.);
  }
  // 然后是第二种颜色，如果x大于等于四分之一的画面长度iResolution.x*.25且小于二分之一的画面长度iResolution.x*.5，就填充第二种颜色color2。
  else if(fragCoord.x>=iResolution.x*.25&&fragCoord.x<iResolution.x*.5){
    fragColor=vec4(color2,1.);
  }
  // 依此类推，剩余 2 种颜色也可以通过范围判断来填充。
  else if(fragCoord.x>=iResolution.x*.5&&fragCoord.x<iResolution.x*.75){
    fragColor=vec4(color3,1.);
  }else{
    fragColor=vec4(color4,1.);
  }
}

// 按下Ctrl+Shift+P，输入Shader Toy: Show GLSL Preview，点击即可预览我们的结果，如果一切顺利的话，你应该能看到画面是一片红色。
