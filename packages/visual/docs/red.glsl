/**
* @description:
* @params {vec4} fragColor - 输出像素的颜色
* @params {vec2} fragCoord - 输入像素的坐标
* @return {void}
*/
void mainImage(out vec4 fragColor,in vec2 fragCoord){
  // 定义了一个名为color的 3 维变量，要将它的值设置为红色，
  // 红色的RGB颜色值为(255,0,0)，
  // 在GLSL中，我们需要先将颜色原先的值进行归一化操作（除以255）后才能将它正确地输出，
  // 因此将红色的值归一化后我们就得到了(1,0,0)这个值，
  // 将它转换为 3 维变量vec3(1.,0.,0.)赋给color变量
  vec3 color=vec3(1.,0.,0.);
  // 最后我们给输出颜色fragColor赋值一个 4 维变量，
  // 前 3 维就是color这个颜色变量，最后一维是透明度，
  // 由于纯红色并不透明，直接将其设为 1 即可。
  fragColor=vec4(color,1.);
}

// 按下Ctrl+Shift+P，输入Shader Toy: Show GLSL Preview，点击即可预览我们的结果，如果一切顺利的话，你应该能看到画面是一片红色。
