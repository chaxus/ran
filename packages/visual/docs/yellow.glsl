/**
* @description:
* @params {vec4} fragColor - 输出像素的颜色
* @params {vec2} fragCoord - 输入像素的坐标
* @return {void}
*/
void mainImage(out vec4 fragColor,in vec2 fragCoord){
  // 黄色的颜色值是(255,255,0)，除以 255 归一化后便是(1,1,0)。
  vec3 color=vec3(1.,1.,0.);
  fragColor=vec4(color,1.);
}

// 按下Ctrl+Shift+P，输入Shader Toy: Show GLSL Preview，点击即可预览我们的结果，如果一切顺利的话，你应该能看到画面是一片红色。
