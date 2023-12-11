var $=Object.defineProperty,p=(s,t,i)=>t in s?$(s,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[t]=i,e=(s,t,i)=>(p(s,typeof t!="symbol"?t+"":t,i),i);const l=Math.round;class f{constructor(t){e(this,"r"),e(this,"g"),e(this,"b"),this.r=t[0],this.g=t[1],this.b=t[2]}toString(){return`rgb(${this.r},${this.g},${this.b})`}}class x extends f{constructor(t){super(t),e(this,"a"),this.a=t[3]}toString(){return`rgba(${this.r},${this.g},${this.b},${this.a})`}}class d{constructor(t){e(this,"h"),e(this,"s"),e(this,"l"),this.h=t[0],this.s=t[1],this.l=t[2]}toString(){return`hsl(${this.h},${this.s}%,${this.l}%)`}}class N extends d{constructor(t){super(t),e(this,"a"),this.a=t[3]}toString(){return`hsla(${this.h},${this.s}%,${this.l}%,${this.a})`}}class F{constructor(t,i=0,h=0,a=1){if(e(this,"r"),e(this,"g"),e(this,"b"),e(this,"a"),e(this,"rgb"),e(this,"rgba"),e(this,"hex"),e(this,"hsl"),e(this,"hsla"),e(this,"h"),e(this,"s"),e(this,"l"),typeof t=="string"){let r=t;r.charAt(0)!=="#"&&(r="#"+r),r.length<7&&(r="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3]),[t,i,h]=m(r)}else t instanceof Array&&(a=t[3]||a,h=t[2],i=t[1],t=t[0]);this.r=Number(t),this.g=Number(i),this.b=Number(h),this.a=a,this.rgb=new f([this.r,this.g,this.b]),this.rgba=new x([this.r,this.g,this.b,this.a]),this.hex=b(this.r,this.g,this.b),this.hsl=new d(H(this.r,this.g,this.b)),this.h=this.hsl.h,this.s=this.hsl.s,this.l=this.hsl.l,this.hsla=new N([this.h,this.s,this.l,this.a])}setHue(t){this.h=t,this.hsl.h=t,this.hsla.h=t,this.updateFromHsl()}setSat(t){this.s=t,this.hsl.s=t,this.hsla.s=t,this.updateFromHsl()}setLum(t){this.l=t,this.hsl.l=t,this.hsla.l=t,this.updateFromHsl()}setAlpha(t){this.a=t,this.hsla.a=t,this.rgba.a=t}updateFromHsl(){this.rgb=new f(_(this.h,this.s,this.l)),this.r=this.rgb.r,this.g=this.rgb.g,this.b=this.rgb.b,this.rgba.r=this.rgb.r,this.rgba.g=this.rgb.g,this.rgba.b=this.rgb.b,this.hex=b([this.r,this.g,this.b])}}const m=function(s){const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]:null},M=(s,t)=>{const i=m(s)||[];for(let h=0;h<3;h++)i[h]=Math.floor(Number(i[h])*(1-t));return b(i[0],i[1],i[2])};function T(s,t){const i=m(s)||[];for(let h=0;h<3;h++)i[h]=Math.floor((255-Number(i[h]))*t+Number(i[h]));return b(i[0],i[1],i[2])}const c=function(s){const t=s.toString(16);return t.length===1?"0"+t:t},b=function(s,t=0,i=0){return s instanceof Array&&(i=s[2],t=s[1],s=s[0]),"#"+c(s)+c(t)+c(i)},H=function(s,t=0,i=0){s instanceof Array&&(i=s[2],t=s[1],s=s[0]);let h,a,r,n=0;s/=255,t/=255,i/=255;const o=Math.max(s,t,i),u=Math.min(s,t,i);if(a=(o+u)/2,o===u)n=h=0;else{switch(r=o-u,h=a>.5?r/(2-o-u):r/(o+u),o){case s:n=(t-i)/r+(t<i?6:0);break;case t:n=(i-s)/r+2;break;case i:n=(s-t)/r+4;break}n/=6}return n=l(n*360),h=l(h*100),a=l(a*100),[n,h,a]},g=function(s,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?s+(t-s)*6*i:i<1/2?t:i<2/3?s+(t-s)*(2/3-i)*6:s},_=function(s,t,i){s instanceof Array&&(i=s[2],t=s[1],s=s[0]),s=Number(s)/360,t=Number(t)/100,i=Number(i)/100;let h,a,r,n,o;return t===0?h=a=r=i:(n=i<.5?i*(1+t):i+t-i*t,o=2*i-n,h=g(o,n,s+1/3),a=g(o,n,s),r=g(o,n,s-1/3)),[l(h*255),l(a*255),l(r*255)]};export{F as C,M as a,T as g};