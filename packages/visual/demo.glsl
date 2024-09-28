float sdBox(in vec2 p,in vec2 b)
{
    vec2 d=abs(p)-b;
    return length(max(d,0.))+min(max(d.x,d.y),0.);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    uv=(uv-.5)*2.;
    uv.x*=iResolution.x/iResolution.y;

    float d=sdBox(uv,vec2(.6,.3));
    float c=smoothstep(0.,.02,d);
    fragColor=vec4(vec3(c),1.);
}
