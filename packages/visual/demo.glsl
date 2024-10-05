#iChannel0 "https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

vec2 distort(vec2 p){
    p.x+=sin(p.y*10.+iTime)/50.;
    return p;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    uv=distort(uv);
    vec3 tex=texture(iChannel0,uv).xyz;
    fragColor=vec4(tex,1.);
}
