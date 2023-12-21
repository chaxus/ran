import{d as w,o as l,c as p,r as m,a as ee,t as A,n as O,_ as M,b as I,w as f,e as x,T as ze,u as Xe,i as In,l as Tn,f as We,g as S,h as T,j as ue,k as d,m as u,p as se,q as ae,s as be,v as Se,x as et,y as q,z as _e,A as dt,B as Gt,C as Vn,D as ke,F as j,E as Z,G as pt,H as Pe,I as k,J as qt,K as ge,L as Ve,M as He,N as Ue,O as An,P as le,Q as Qt,R as Kt,S as En,U as Ie,V as ht,W as mt,X as Rn,Y as Jt,Z as Zt,$ as Nn,a0 as Fe,a1 as Yt,a2 as Xt,a3 as Hn,a4 as Bn,a5 as On,a6 as Fn,a7 as en,a8 as Dn,a9 as jn,aa as zn,ab as Wn}from"./framework.AX6sllpn.js";const Un=w({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(n){return(e,t)=>(l(),p("span",{class:O(["VPBadge",e.type])},[m(e.$slots,"default",{},()=>[ee(A(e.text),1)],!0)],2))}}),Gn=M(Un,[["__scopeId","data-v-5e3d0c84"]]),qn={key:0,class:"VPBackdrop"},Qn=w({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(n){return(e,t)=>(l(),I(ze,{name:"fade"},{default:f(()=>[e.show?(l(),p("div",qn)):x("",!0)]),_:1}))}}),Kn=M(Qn,[["__scopeId","data-v-9b6231e0"]]),E=Xe;function Jn(n,e){let t,r=!1;return()=>{t&&clearTimeout(t),r?t=setTimeout(n,e):(n(),(r=!0)&&setTimeout(()=>r=!1,e))}}function tt(n){return/^\//.test(n)?n:`/${n}`}function Te(n){const{pathname:e,search:t,hash:r,protocol:s}=new URL(n,"http://a.com");if(In(n)||n.startsWith("#")||!s.startsWith("http")||/\.(?!html|md)\w+($|\?)/i.test(n)&&Tn(n))return n;const{site:a}=E(),o=e.endsWith("/")||e.endsWith(".html")?n:n.replace(/(?:(^\.+)\/)?.*$/,`$1${e.replace(/(\.md)?$/,a.value.cleanUrls?"":".html")}${t}${r}`);return We(o)}function Ae({removeCurrent:n=!0,correspondingLink:e=!1}={}){const{site:t,localeIndex:r,page:s,theme:a}=E(),o=S(()=>{var i,h;return{label:(i=t.value.locales[r.value])==null?void 0:i.label,link:((h=t.value.locales[r.value])==null?void 0:h.link)||(r.value==="root"?"/":`/${r.value}/`)}});return{localeLinks:S(()=>Object.entries(t.value.locales).flatMap(([i,h])=>n&&o.value.label===h.label?[]:{text:h.label,link:Zn(h.link||(i==="root"?"/":`/${i}/`),a.value.i18nRouting!==!1&&e,s.value.relativePath.slice(o.value.link.length-1),!t.value.cleanUrls)})),currentLang:o}}function Zn(n,e,t,r){return e?n.replace(/\/$/,"")+tt(t.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):n}const Yn=n=>(se("data-v-8803dd6c"),n=n(),ae(),n),Xn={class:"NotFound"},er={class:"code"},tr={class:"title"},nr=Yn(()=>d("div",{class:"divider"},null,-1)),rr={class:"quote"},sr={class:"action"},ar=["href","aria-label"],or=w({__name:"NotFound",setup(n){const{site:e,theme:t}=E(),{localeLinks:r}=Ae({removeCurrent:!1}),s=T("/");return ue(()=>{var o;const a=window.location.pathname.replace(e.value.base,"").replace(/(^.*?\/).*$/,"/$1");r.value.length&&(s.value=((o=r.value.find(({link:c})=>c.startsWith(a)))==null?void 0:o.link)||r.value[0].link)}),(a,o)=>{var c,i,h,v,y;return l(),p("div",Xn,[d("p",er,A(((c=u(t).notFound)==null?void 0:c.code)??"404"),1),d("h1",tr,A(((i=u(t).notFound)==null?void 0:i.title)??"PAGE NOT FOUND"),1),nr,d("blockquote",rr,A(((h=u(t).notFound)==null?void 0:h.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),d("div",sr,[d("a",{class:"link",href:u(We)(s.value),"aria-label":((v=u(t).notFound)==null?void 0:v.linkLabel)??"go to home"},A(((y=u(t).notFound)==null?void 0:y.linkText)??"Take me home"),9,ar)])])}}}),ir=M(or,[["__scopeId","data-v-8803dd6c"]]);function tn(n,e){if(Array.isArray(n))return Be(n);if(n==null)return[];e=tt(e);const t=Object.keys(n).sort((s,a)=>a.split("/").length-s.split("/").length).find(s=>e.startsWith(tt(s))),r=t?n[t]:[];return Array.isArray(r)?Be(r):Be(r.items,r.base)}function lr(n){const e=[];let t=0;for(const r in n){const s=n[r];if(s.items){t=e.push(s);continue}e[t]||e.push({items:[]}),e[t].items.push(s)}return e}function cr(n){const e=[];function t(r){for(const s of r)s.text&&s.link&&e.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&t(s.items)}return t(n),e}function nt(n,e){return Array.isArray(e)?e.some(t=>nt(n,t)):be(n,e.link)?!0:e.items?nt(n,e.items):!1}function Be(n,e){return[...n].map(t=>{const r={...t},s=r.base||e;return s&&r.link&&(r.link=s+r.link),r.items&&(r.items=Be(r.items,s)),r})}function de(){const{frontmatter:n,page:e,theme:t}=E(),r=et("(min-width: 960px)"),s=T(!1),a=S(()=>{const b=t.value.sidebar,g=e.value.relativePath;return b?tn(b,g):[]}),o=T(a.value);q(a,(b,g)=>{JSON.stringify(b)!==JSON.stringify(g)&&(o.value=a.value)});const c=S(()=>n.value.sidebar!==!1&&o.value.length>0&&n.value.layout!=="home"),i=S(()=>h?n.value.aside==null?t.value.aside==="left":n.value.aside==="left":!1),h=S(()=>n.value.layout==="home"?!1:n.value.aside!=null?!!n.value.aside:t.value.aside!==!1),v=S(()=>c.value&&r.value),y=S(()=>c.value?lr(o.value):[]);function _(){s.value=!0}function $(){s.value=!1}function P(){s.value?$():_()}return{isOpen:s,sidebar:o,sidebarGroups:y,hasSidebar:c,hasAside:h,leftAside:i,isSidebarEnabled:v,open:_,close:$,toggle:P}}function ur(n,e){let t;_e(()=>{t=n.value?document.activeElement:void 0}),ue(()=>{window.addEventListener("keyup",r)}),dt(()=>{window.removeEventListener("keyup",r)});function r(s){s.key==="Escape"&&n.value&&(e(),t==null||t.focus())}}const nn=T(Se?location.hash:"");Se&&window.addEventListener("hashchange",()=>{nn.value=location.hash});function dr(n){const{page:e}=E(),t=T(!1),r=S(()=>n.value.collapsed!=null),s=S(()=>!!n.value.link),a=T(!1),o=()=>{a.value=be(e.value.relativePath,n.value.link)};q([e,n,nn],o),ue(o);const c=S(()=>a.value?!0:n.value.items?nt(e.value.relativePath,n.value.items):!1),i=S(()=>!!(n.value.items&&n.value.items.length));_e(()=>{t.value=!!(r.value&&n.value.collapsed)}),Gt(()=>{(a.value||c.value)&&(t.value=!1)});function h(){r.value&&(t.value=!t.value)}return{collapsed:t,collapsible:r,isLink:s,isActiveLink:a,hasActiveLink:c,hasChildren:i,toggle:h}}function pr(){const{hasSidebar:n}=de(),e=et("(min-width: 960px)"),t=et("(min-width: 1280px)");return{isAsideEnabled:S(()=>!t.value&&!e.value?!1:n.value?t.value:e.value)}}const hr=71;function vt(n){return typeof n.outline=="object"&&!Array.isArray(n.outline)&&n.outline.label||n.outlineTitle||"On this page"}function ft(n){const e=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(t=>t.id&&t.hasChildNodes()).map(t=>{const r=Number(t.tagName[1]);return{title:mr(t),link:"#"+t.id,level:r}});return vr(e,n)}function mr(n){let e="";for(const t of n.childNodes)if(t.nodeType===1){if(t.classList.contains("VPBadge")||t.classList.contains("header-anchor"))continue;e+=t.textContent}else t.nodeType===3&&(e+=t.textContent);return e.trim()}function vr(n,e){if(e===!1)return[];const t=(typeof e=="object"&&!Array.isArray(e)?e.level:e)||2,[r,s]=typeof t=="number"?[t,t]:t==="deep"?[2,6]:t;n=n.filter(o=>o.level>=r&&o.level<=s);const a=[];e:for(let o=0;o<n.length;o++){const c=n[o];if(o===0)a.push(c);else{for(let i=o-1;i>=0;i--){const h=n[i];if(h.level<c.level){(h.children||(h.children=[])).push(c);continue e}}a.push(c)}}return a}function fr(n,e){const{isAsideEnabled:t}=pr(),r=Jn(a,100);let s=null;ue(()=>{requestAnimationFrame(a),window.addEventListener("scroll",r)}),Vn(()=>{o(location.hash)}),dt(()=>{window.removeEventListener("scroll",r)});function a(){if(!t.value)return;const c=[].slice.call(n.value.querySelectorAll(".outline-link")),i=[].slice.call(document.querySelectorAll(".content .header-anchor")).filter($=>c.some(P=>P.hash===$.hash&&$.offsetParent!==null)),h=window.scrollY,v=window.innerHeight,y=document.body.offsetHeight,_=Math.abs(h+v-y)<1;if(i.length&&_){o(i[i.length-1].hash);return}for(let $=0;$<i.length;$++){const P=i[$],b=i[$+1],[g,R]=gr($,P,b);if(g){o(R);return}}}function o(c){s&&s.classList.remove("active"),c==null?s=null:s=n.value.querySelector(`a[href="${decodeURIComponent(c)}"]`);const i=s;i?(i.classList.add("active"),e.value.style.top=i.offsetTop+33+"px",e.value.style.opacity="1"):(e.value.style.top="33px",e.value.style.opacity="0")}}function St(n){return n.parentElement.offsetTop-hr}function gr(n,e,t){const r=window.scrollY;return n===0&&r===0?[!0,null]:r<St(e)?[!1,null]:!t||r<St(t)?[!0,e.hash]:[!1,null]}const br=["href","title"],yr=w({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(n){function e({target:t}){const r=t.href.split("#")[1],s=document.getElementById(decodeURIComponent(r));s==null||s.focus({preventScroll:!0})}return(t,r)=>{const s=ke("VPDocOutlineItem",!0);return l(),p("ul",{class:O(t.root?"root":"nested")},[(l(!0),p(j,null,Z(t.headers,({children:a,link:o,title:c})=>(l(),p("li",null,[d("a",{class:"outline-link",href:o,onClick:e,title:c},A(c),9,br),a!=null&&a.length?(l(),I(s,{key:0,headers:a},null,8,["headers"])):x("",!0)]))),256))],2)}}}),gt=M(yr,[["__scopeId","data-v-a43a04f9"]]),_r=n=>(se("data-v-541e8366"),n=n(),ae(),n),kr={class:"content"},wr={class:"outline-title",role:"heading","aria-level":"2"},$r={"aria-labelledby":"doc-outline-aria-label"},xr=_r(()=>d("span",{class:"visually-hidden",id:"doc-outline-aria-label"}," Table of Contents for current page ",-1)),Mr=w({__name:"VPDocAsideOutline",setup(n){const{frontmatter:e,theme:t}=E(),r=pt([]);Pe(()=>{r.value=ft(e.value.outline??t.value.outline)});const s=T(),a=T();return fr(s,a),(o,c)=>(l(),p("div",{class:O(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:s,role:"navigation"},[d("div",kr,[d("div",{class:"outline-marker",ref_key:"marker",ref:a},null,512),d("div",wr,A(u(vt)(u(t))),1),d("nav",$r,[xr,k(gt,{headers:r.value,root:!0},null,8,["headers"])])])],2))}}),Sr=M(Mr,[["__scopeId","data-v-541e8366"]]),Cr={class:"VPDocAsideCarbonAds"},Lr=w({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(n){const e=()=>null;return(t,r)=>(l(),p("div",Cr,[k(u(e),{"carbon-ads":t.carbonAds},null,8,["carbon-ads"])]))}}),Pr=n=>(se("data-v-5c93c961"),n=n(),ae(),n),Ir={class:"VPDocAside"},Tr=Pr(()=>d("div",{class:"spacer"},null,-1)),Vr=w({__name:"VPDocAside",setup(n){const{theme:e}=E();return(t,r)=>(l(),p("div",Ir,[m(t.$slots,"aside-top",{},void 0,!0),m(t.$slots,"aside-outline-before",{},void 0,!0),k(Sr),m(t.$slots,"aside-outline-after",{},void 0,!0),Tr,m(t.$slots,"aside-ads-before",{},void 0,!0),u(e).carbonAds?(l(),I(Lr,{key:0,"carbon-ads":u(e).carbonAds},null,8,["carbon-ads"])):x("",!0),m(t.$slots,"aside-ads-after",{},void 0,!0),m(t.$slots,"aside-bottom",{},void 0,!0)]))}}),Ar=M(Vr,[["__scopeId","data-v-5c93c961"]]);function Er(){const{theme:n,page:e}=E();return S(()=>{const{text:t="Edit this page",pattern:r=""}=n.value.editLink||{};let s;return typeof r=="function"?s=r(e.value):s=r.replace(/:path/g,e.value.filePath),{url:s,text:t}})}function Rr(){const{page:n,theme:e,frontmatter:t}=E();return S(()=>{var i,h,v,y,_,$,P,b;const r=tn(e.value.sidebar,n.value.relativePath),s=cr(r),a=s.findIndex(g=>be(n.value.relativePath,g.link)),o=((i=e.value.docFooter)==null?void 0:i.prev)===!1&&!t.value.prev||t.value.prev===!1,c=((h=e.value.docFooter)==null?void 0:h.next)===!1&&!t.value.next||t.value.next===!1;return{prev:o?void 0:{text:(typeof t.value.prev=="string"?t.value.prev:typeof t.value.prev=="object"?t.value.prev.text:void 0)??((v=s[a-1])==null?void 0:v.docFooterText)??((y=s[a-1])==null?void 0:y.text),link:(typeof t.value.prev=="object"?t.value.prev.link:void 0)??((_=s[a-1])==null?void 0:_.link)},next:c?void 0:{text:(typeof t.value.next=="string"?t.value.next:typeof t.value.next=="object"?t.value.next.text:void 0)??(($=s[a+1])==null?void 0:$.docFooterText)??((P=s[a+1])==null?void 0:P.text),link:(typeof t.value.next=="object"?t.value.next.link:void 0)??((b=s[a+1])==null?void 0:b.link)}}})}const Nr={},Hr={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},Br=d("path",{d:"M18,23H4c-1.7,0-3-1.3-3-3V6c0-1.7,1.3-3,3-3h7c0.6,0,1,0.4,1,1s-0.4,1-1,1H4C3.4,5,3,5.4,3,6v14c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1v-7c0-0.6,0.4-1,1-1s1,0.4,1,1v7C21,21.7,19.7,23,18,23z"},null,-1),Or=d("path",{d:"M8,17c-0.3,0-0.5-0.1-0.7-0.3C7,16.5,6.9,16.1,7,15.8l1-4c0-0.2,0.1-0.3,0.3-0.5l9.5-9.5c1.2-1.2,3.2-1.2,4.4,0c1.2,1.2,1.2,3.2,0,4.4l-9.5,9.5c-0.1,0.1-0.3,0.2-0.5,0.3l-4,1C8.2,17,8.1,17,8,17zM9.9,12.5l-0.5,2.1l2.1-0.5l9.3-9.3c0.4-0.4,0.4-1.1,0-1.6c-0.4-0.4-1.2-0.4-1.6,0l0,0L9.9,12.5z M18.5,2.5L18.5,2.5L18.5,2.5z"},null,-1),Fr=[Br,Or];function Dr(n,e){return l(),p("svg",Hr,Fr)}const jr=M(Nr,[["render",Dr]]),he=w({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(n){const e=n,t=S(()=>e.tag??(e.href?"a":"span")),r=S(()=>e.href&&qt.test(e.href));return(s,a)=>(l(),I(ge(t.value),{class:O(["VPLink",{link:s.href,"vp-external-link-icon":r.value,"no-icon":s.noIcon}]),href:s.href?u(Te)(s.href):void 0,target:s.target??(r.value?"_blank":void 0),rel:s.rel??(r.value?"noreferrer":void 0)},{default:f(()=>[m(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),zr={class:"VPLastUpdated"},Wr=["datetime"],Ur=w({__name:"VPDocFooterLastUpdated",setup(n){const{theme:e,page:t,frontmatter:r,lang:s}=E(),a=S(()=>new Date(r.value.lastUpdated??t.value.lastUpdated)),o=S(()=>a.value.toISOString()),c=T("");return ue(()=>{_e(()=>{var i,h,v;c.value=new Intl.DateTimeFormat((h=(i=e.value.lastUpdated)==null?void 0:i.formatOptions)!=null&&h.forceLocale?s.value:void 0,((v=e.value.lastUpdated)==null?void 0:v.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(a.value)})}),(i,h)=>{var v;return l(),p("p",zr,[ee(A(((v=u(e).lastUpdated)==null?void 0:v.text)||u(e).lastUpdatedText||"Last updated")+": ",1),d("time",{datetime:o.value},A(c.value),9,Wr)])}}}),Gr=M(Ur,[["__scopeId","data-v-69705538"]]),qr={key:0,class:"VPDocFooter"},Qr={key:0,class:"edit-info"},Kr={key:0,class:"edit-link"},Jr={key:1,class:"last-updated"},Zr={key:1,class:"prev-next"},Yr={class:"pager"},Xr=["href"],es=["innerHTML"],ts=["innerHTML"],ns={class:"pager"},rs=["href"],ss=["innerHTML"],as=["innerHTML"],os=w({__name:"VPDocFooter",setup(n){const{theme:e,page:t,frontmatter:r}=E(),s=Er(),a=Rr(),o=S(()=>e.value.editLink&&r.value.editLink!==!1),c=S(()=>t.value.lastUpdated&&r.value.lastUpdated!==!1),i=S(()=>o.value||c.value||a.value.prev||a.value.next);return(h,v)=>{var y,_,$,P,b,g;return i.value?(l(),p("footer",qr,[m(h.$slots,"doc-footer-before",{},void 0,!0),o.value||c.value?(l(),p("div",Qr,[o.value?(l(),p("div",Kr,[k(he,{class:"edit-link-button",href:u(s).url,"no-icon":!0},{default:f(()=>[k(jr,{class:"edit-link-icon","aria-label":"edit icon"}),ee(" "+A(u(s).text),1)]),_:1},8,["href"])])):x("",!0),c.value?(l(),p("div",Jr,[k(Gr)])):x("",!0)])):x("",!0),(y=u(a).prev)!=null&&y.link||(_=u(a).next)!=null&&_.link?(l(),p("nav",Zr,[d("div",Yr,[($=u(a).prev)!=null&&$.link?(l(),p("a",{key:0,class:"pager-link prev",href:u(Te)(u(a).prev.link)},[d("span",{class:"desc",innerHTML:((P=u(e).docFooter)==null?void 0:P.prev)||"Previous page"},null,8,es),d("span",{class:"title",innerHTML:u(a).prev.text},null,8,ts)],8,Xr)):x("",!0)]),d("div",ns,[(b=u(a).next)!=null&&b.link?(l(),p("a",{key:0,class:"pager-link next",href:u(Te)(u(a).next.link)},[d("span",{class:"desc",innerHTML:((g=u(e).docFooter)==null?void 0:g.next)||"Next page"},null,8,ss),d("span",{class:"title",innerHTML:u(a).next.text},null,8,as)],8,rs)):x("",!0)])])):x("",!0)])):x("",!0)}}}),is=M(os,[["__scopeId","data-v-6b64686f"]]),ls={},cs={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},us=d("path",{d:"M9,19c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l5.3-5.3L8.3,6.7c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l6,6c0.4,0.4,0.4,1,0,1.4l-6,6C9.5,18.9,9.3,19,9,19z"},null,-1),ds=[us];function ps(n,e){return l(),p("svg",cs,ds)}const bt=M(ls,[["render",ps]]),hs={key:0,class:"VPDocOutlineDropdown"},ms={key:0,class:"items"},vs=w({__name:"VPDocOutlineDropdown",setup(n){const{frontmatter:e,theme:t}=E(),r=T(!1);Pe(()=>{r.value=!1});const s=pt([]);return Pe(()=>{s.value=ft(e.value.outline??t.value.outline)}),(a,o)=>s.value.length>0?(l(),p("div",hs,[d("button",{onClick:o[0]||(o[0]=c=>r.value=!r.value),class:O({open:r.value})},[ee(A(u(vt)(u(t)))+" ",1),k(bt,{class:"icon"})],2),r.value?(l(),p("div",ms,[k(gt,{headers:s.value},null,8,["headers"])])):x("",!0)])):x("",!0)}}),fs=M(vs,[["__scopeId","data-v-27aab854"]]),gs=n=>(se("data-v-a84b423e"),n=n(),ae(),n),bs={class:"container"},ys=gs(()=>d("div",{class:"aside-curtain"},null,-1)),_s={class:"aside-container"},ks={class:"aside-content"},ws={class:"content"},$s={class:"content-container"},xs={class:"main"},Ms=w({__name:"VPDoc",setup(n){const{theme:e}=E(),t=Ve(),{hasSidebar:r,hasAside:s,leftAside:a}=de(),o=S(()=>t.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(c,i)=>{const h=ke("Content");return l(),p("div",{class:O(["VPDoc",{"has-sidebar":u(r),"has-aside":u(s)}])},[m(c.$slots,"doc-top",{},void 0,!0),d("div",bs,[u(s)?(l(),p("div",{key:0,class:O(["aside",{"left-aside":u(a)}])},[ys,d("div",_s,[d("div",ks,[k(Ar,null,{"aside-top":f(()=>[m(c.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":f(()=>[m(c.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":f(()=>[m(c.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":f(()=>[m(c.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":f(()=>[m(c.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":f(()=>[m(c.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):x("",!0),d("div",ws,[d("div",$s,[m(c.$slots,"doc-before",{},void 0,!0),k(fs),d("main",xs,[k(h,{class:O(["vp-doc",[o.value,u(e).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),k(is,null,{"doc-footer-before":f(()=>[m(c.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),m(c.$slots,"doc-after",{},void 0,!0)])])]),m(c.$slots,"doc-bottom",{},void 0,!0)],2)}}}),Ss=M(Ms,[["__scopeId","data-v-a84b423e"]]),Cs=w({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{}},setup(n){const e=n,t=S(()=>e.href&&qt.test(e.href)),r=S(()=>e.tag||e.href?"a":"button");return(s,a)=>(l(),I(ge(r.value),{class:O(["VPButton",[s.size,s.theme]]),href:s.href?u(Te)(s.href):void 0,target:t.value?"_blank":void 0,rel:t.value?"noreferrer":void 0},{default:f(()=>[ee(A(s.text),1)]),_:1},8,["class","href","target","rel"]))}}),Ls=M(Cs,[["__scopeId","data-v-4f754f40"]]),Ps=["src","alt"],Is=w({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(n){return(e,t)=>{const r=ke("VPImage",!0);return e.image?(l(),p(j,{key:0},[typeof e.image=="string"||"src"in e.image?(l(),p("img",He({key:0,class:"VPImage"},typeof e.image=="string"?e.$attrs:{...e.image,...e.$attrs},{src:u(We)(typeof e.image=="string"?e.image:e.image.src),alt:e.alt??(typeof e.image=="string"?"":e.image.alt||"")}),null,16,Ps)):(l(),p(j,{key:1},[k(r,He({class:"dark",image:e.image.dark,alt:e.image.alt},e.$attrs),null,16,["image","alt"]),k(r,He({class:"light",image:e.image.light,alt:e.image.alt},e.$attrs),null,16,["image","alt"])],64))],64)):x("",!0)}}}),De=M(Is,[["__scopeId","data-v-6fcb7e78"]]),Ts=n=>(se("data-v-dd3cfae8"),n=n(),ae(),n),Vs={class:"container"},As={class:"main"},Es={key:0,class:"name"},Rs=["innerHTML"],Ns=["innerHTML"],Hs=["innerHTML"],Bs={key:0,class:"actions"},Os={key:0,class:"image"},Fs={class:"image-container"},Ds=Ts(()=>d("div",{class:"image-bg"},null,-1)),js=w({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(n){const e=Ue("hero-image-slot-exists");return(t,r)=>(l(),p("div",{class:O(["VPHero",{"has-image":t.image||u(e)}])},[d("div",Vs,[d("div",As,[m(t.$slots,"home-hero-info",{},()=>[t.name?(l(),p("h1",Es,[d("span",{innerHTML:t.name,class:"clip"},null,8,Rs)])):x("",!0),t.text?(l(),p("p",{key:1,innerHTML:t.text,class:"text"},null,8,Ns)):x("",!0),t.tagline?(l(),p("p",{key:2,innerHTML:t.tagline,class:"tagline"},null,8,Hs)):x("",!0)],!0),t.actions?(l(),p("div",Bs,[(l(!0),p(j,null,Z(t.actions,s=>(l(),p("div",{key:s.link,class:"action"},[k(Ls,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link},null,8,["theme","text","href"])]))),128))])):x("",!0)]),t.image||u(e)?(l(),p("div",Os,[d("div",Fs,[Ds,m(t.$slots,"home-hero-image",{},()=>[t.image?(l(),I(De,{key:0,class:"image-src",image:t.image},null,8,["image"])):x("",!0)],!0)])])):x("",!0)])],2))}}),zs=M(js,[["__scopeId","data-v-dd3cfae8"]]),Ws=w({__name:"VPHomeHero",setup(n){const{frontmatter:e}=E();return(t,r)=>u(e).hero?(l(),I(zs,{key:0,class:"VPHomeHero",name:u(e).hero.name,text:u(e).hero.text,tagline:u(e).hero.tagline,image:u(e).hero.image,actions:u(e).hero.actions},{"home-hero-info":f(()=>[m(t.$slots,"home-hero-info")]),"home-hero-image":f(()=>[m(t.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):x("",!0)}}),Us={},Gs={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},qs=d("path",{d:"M19.9,12.4c0.1-0.2,0.1-0.5,0-0.8c-0.1-0.1-0.1-0.2-0.2-0.3l-7-7c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l5.3,5.3H5c-0.6,0-1,0.4-1,1s0.4,1,1,1h11.6l-5.3,5.3c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l7-7C19.8,12.6,19.9,12.5,19.9,12.4z"},null,-1),Qs=[qs];function Ks(n,e){return l(),p("svg",Gs,Qs)}const Js=M(Us,[["render",Ks]]),Zs={class:"box"},Ys={key:0,class:"icon"},Xs=["innerHTML"],ea=["innerHTML"],ta=["innerHTML"],na={key:4,class:"link-text"},ra={class:"link-text-value"},sa=w({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(n){return(e,t)=>(l(),I(he,{class:"VPFeature",href:e.link,rel:e.rel,target:e.target,"no-icon":!0,tag:e.link?"a":"div"},{default:f(()=>[d("article",Zs,[typeof e.icon=="object"&&e.icon.wrap?(l(),p("div",Ys,[k(De,{image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])])):typeof e.icon=="object"?(l(),I(De,{key:1,image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])):e.icon?(l(),p("div",{key:2,class:"icon",innerHTML:e.icon},null,8,Xs)):x("",!0),d("h2",{class:"title",innerHTML:e.title},null,8,ea),e.details?(l(),p("p",{key:3,class:"details",innerHTML:e.details},null,8,ta)):x("",!0),e.linkText?(l(),p("div",na,[d("p",ra,[ee(A(e.linkText)+" ",1),k(Js,{class:"link-text-icon"})])])):x("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),aa=M(sa,[["__scopeId","data-v-b3083232"]]),oa={key:0,class:"VPFeatures"},ia={class:"container"},la={class:"items"},ca=w({__name:"VPFeatures",props:{features:{}},setup(n){const e=n,t=S(()=>{const r=e.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,s)=>r.features?(l(),p("div",oa,[d("div",ia,[d("div",la,[(l(!0),p(j,null,Z(r.features,a=>(l(),p("div",{key:a.title,class:O(["item",[t.value]])},[k(aa,{icon:a.icon,title:a.title,details:a.details,link:a.link,"link-text":a.linkText,rel:a.rel,target:a.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):x("",!0)}}),ua=M(ca,[["__scopeId","data-v-c1915af0"]]),da=w({__name:"VPHomeFeatures",setup(n){const{frontmatter:e}=E();return(t,r)=>u(e).features?(l(),I(ua,{key:0,class:"VPHomeFeatures",features:u(e).features},null,8,["features"])):x("",!0)}}),pa={class:"VPHome"},ha=w({__name:"VPHome",setup(n){return(e,t)=>{const r=ke("Content");return l(),p("div",pa,[m(e.$slots,"home-hero-before",{},void 0,!0),k(Ws,null,{"home-hero-info":f(()=>[m(e.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":f(()=>[m(e.$slots,"home-hero-image",{},void 0,!0)]),_:3}),m(e.$slots,"home-hero-after",{},void 0,!0),m(e.$slots,"home-features-before",{},void 0,!0),k(da),m(e.$slots,"home-features-after",{},void 0,!0),k(r)])}}}),ma=M(ha,[["__scopeId","data-v-86374fe4"]]),va={},fa={class:"VPPage"};function ga(n,e){const t=ke("Content");return l(),p("div",fa,[m(n.$slots,"page-top"),k(t),m(n.$slots,"page-bottom")])}const ba=M(va,[["render",ga]]),ya=w({__name:"VPContent",setup(n){const{page:e,frontmatter:t}=E(),{hasSidebar:r}=de();return(s,a)=>(l(),p("div",{class:O(["VPContent",{"has-sidebar":u(r),"is-home":u(t).layout==="home"}]),id:"VPContent"},[u(e).isNotFound?m(s.$slots,"not-found",{key:0},()=>[k(ir)],!0):u(t).layout==="page"?(l(),I(ba,{key:1},{"page-top":f(()=>[m(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":f(()=>[m(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):u(t).layout==="home"?(l(),I(ma,{key:2},{"home-hero-before":f(()=>[m(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info":f(()=>[m(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":f(()=>[m(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":f(()=>[m(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":f(()=>[m(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":f(()=>[m(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):u(t).layout&&u(t).layout!=="doc"?(l(),I(ge(u(t).layout),{key:3})):(l(),I(Ss,{key:4},{"doc-top":f(()=>[m(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":f(()=>[m(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":f(()=>[m(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":f(()=>[m(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":f(()=>[m(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":f(()=>[m(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":f(()=>[m(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":f(()=>[m(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":f(()=>[m(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":f(()=>[m(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":f(()=>[m(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),_a=M(ya,[["__scopeId","data-v-d02484bb"]]),ka={class:"container"},wa=["innerHTML"],$a=["innerHTML"],xa=w({__name:"VPFooter",setup(n){const{theme:e,frontmatter:t}=E(),{hasSidebar:r}=de();return(s,a)=>u(e).footer&&u(t).footer!==!1?(l(),p("footer",{key:0,class:O(["VPFooter",{"has-sidebar":u(r)}])},[d("div",ka,[u(e).footer.message?(l(),p("p",{key:0,class:"message",innerHTML:u(e).footer.message},null,8,wa)):x("",!0),u(e).footer.copyright?(l(),p("p",{key:1,class:"copyright",innerHTML:u(e).footer.copyright},null,8,$a)):x("",!0)])],2)):x("",!0)}}),Ma=M(xa,[["__scopeId","data-v-d6a37242"]]),Sa={class:"header"},Ca={class:"outline"},La=w({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(n){const e=n,{theme:t}=E(),r=T(!1),s=T(0),a=T();Pe(()=>{r.value=!1});function o(){r.value=!r.value,s.value=window.innerHeight+Math.min(window.scrollY-e.navHeight,0)}function c(h){h.target.classList.contains("outline-link")&&(a.value&&(a.value.style.transition="none"),le(()=>{r.value=!1}))}function i(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,v)=>(l(),p("div",{class:"VPLocalNavOutlineDropdown",style:An({"--vp-vh":s.value+"px"})},[h.headers.length>0?(l(),p("button",{key:0,onClick:o,class:O({open:r.value})},[ee(A(u(vt)(u(t)))+" ",1),k(bt,{class:"icon"})],2)):(l(),p("button",{key:1,onClick:i},A(u(t).returnToTopLabel||"Return to top"),1)),k(ze,{name:"flyout"},{default:f(()=>[r.value?(l(),p("div",{key:0,ref_key:"items",ref:a,class:"items",onClick:c},[d("div",Sa,[d("a",{class:"top-link",href:"#",onClick:i},A(u(t).returnToTopLabel||"Return to top"),1)]),d("div",Ca,[k(gt,{headers:h.headers},null,8,["headers"])])],512)):x("",!0)]),_:1})],4))}}),Pa=M(La,[["__scopeId","data-v-dc93ab37"]]),Ia={},Ta={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Va=d("path",{d:"M17,11H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,11,17,11z"},null,-1),Aa=d("path",{d:"M21,7H3C2.4,7,2,6.6,2,6s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,7,21,7z"},null,-1),Ea=d("path",{d:"M21,15H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h18c0.6,0,1,0.4,1,1S21.6,15,21,15z"},null,-1),Ra=d("path",{d:"M17,19H3c-0.6,0-1-0.4-1-1s0.4-1,1-1h14c0.6,0,1,0.4,1,1S17.6,19,17,19z"},null,-1),Na=[Va,Aa,Ea,Ra];function Ha(n,e){return l(),p("svg",Ta,Na)}const Ba=M(Ia,[["render",Ha]]),Oa=["aria-expanded"],Fa={class:"menu-text"},Da=w({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(n){const{theme:e,frontmatter:t}=E(),{hasSidebar:r}=de(),{y:s}=Qt(),a=pt([]),o=T(0);ue(()=>{o.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Pe(()=>{a.value=ft(t.value.outline??e.value.outline)});const c=S(()=>a.value.length===0&&!r.value),i=S(()=>({VPLocalNav:!0,fixed:c.value,"reached-top":s.value>=o.value}));return(h,v)=>u(t).layout!=="home"&&(!c.value||u(s)>=o.value)?(l(),p("div",{key:0,class:O(i.value)},[u(r)?(l(),p("button",{key:0,class:"menu","aria-expanded":h.open,"aria-controls":"VPSidebarNav",onClick:v[0]||(v[0]=y=>h.$emit("open-menu"))},[k(Ba,{class:"menu-icon"}),d("span",Fa,A(u(e).sidebarMenuLabel||"Menu"),1)],8,Oa)):x("",!0),k(Pa,{headers:a.value,navHeight:o.value},null,8,["headers","navHeight"])],2)):x("",!0)}}),ja=M(Da,[["__scopeId","data-v-1cafca66"]]);function za(){const n=T(!1);function e(){n.value=!0,window.addEventListener("resize",s)}function t(){n.value=!1,window.removeEventListener("resize",s)}function r(){n.value?t():e()}function s(){window.outerWidth>=768&&t()}const a=Ve();return q(()=>a.path,t),{isScreenOpen:n,openScreen:e,closeScreen:t,toggleScreen:r}}const Wa={},Ua={class:"VPSwitch",type:"button",role:"switch"},Ga={class:"check"},qa={key:0,class:"icon"};function Qa(n,e){return l(),p("button",Ua,[d("span",Ga,[n.$slots.default?(l(),p("span",qa,[m(n.$slots,"default",{},void 0,!0)])):x("",!0)])])}const Ka=M(Wa,[["render",Qa],["__scopeId","data-v-effb9a6a"]]),Ja={},Za={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Ya=d("path",{d:"M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"},null,-1),Xa=[Ya];function eo(n,e){return l(),p("svg",Za,Xa)}const to=M(Ja,[["render",eo]]),no={},ro={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},so=Kt('<path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"></path><path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"></path><path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"></path><path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"></path><path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"></path><path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"></path><path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"></path><path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"></path>',9),ao=[so];function oo(n,e){return l(),p("svg",ro,ao)}const io=M(no,[["render",oo]]),lo=w({__name:"VPSwitchAppearance",setup(n){const{isDark:e}=E(),t=Ue("toggle-appearance",()=>{e.value=!e.value}),r=S(()=>e.value?"Switch to light theme":"Switch to dark theme");return(s,a)=>(l(),I(Ka,{title:r.value,class:"VPSwitchAppearance","aria-checked":u(e),onClick:u(t)},{default:f(()=>[k(io,{class:"sun"}),k(to,{class:"moon"})]),_:1},8,["title","aria-checked","onClick"]))}}),yt=M(lo,[["__scopeId","data-v-522418a2"]]),co={key:0,class:"VPNavBarAppearance"},uo=w({__name:"VPNavBarAppearance",setup(n){const{site:e}=E();return(t,r)=>u(e).appearance&&u(e).appearance!=="force-dark"?(l(),p("div",co,[k(yt)])):x("",!0)}}),po=M(uo,[["__scopeId","data-v-ba11efa7"]]),_t=T();let rn=!1,Je=0;function ho(n){const e=T(!1);if(Se){!rn&&mo(),Je++;const t=q(_t,r=>{var s,a,o;r===n.el.value||(s=n.el.value)!=null&&s.contains(r)?(e.value=!0,(a=n.onFocus)==null||a.call(n)):(e.value=!1,(o=n.onBlur)==null||o.call(n))});dt(()=>{t(),Je--,Je||vo()})}return En(e)}function mo(){document.addEventListener("focusin",sn),rn=!0,_t.value=document.activeElement}function vo(){document.removeEventListener("focusin",sn)}function sn(){_t.value=document.activeElement}const fo={},go={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},bo=d("path",{d:"M12,16c-0.3,0-0.5-0.1-0.7-0.3l-6-6c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l5.3,5.3l5.3-5.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-6,6C12.5,15.9,12.3,16,12,16z"},null,-1),yo=[bo];function _o(n,e){return l(),p("svg",go,yo)}const an=M(fo,[["render",_o]]),ko={},wo={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},$o=d("circle",{cx:"12",cy:"12",r:"2"},null,-1),xo=d("circle",{cx:"19",cy:"12",r:"2"},null,-1),Mo=d("circle",{cx:"5",cy:"12",r:"2"},null,-1),So=[$o,xo,Mo];function Co(n,e){return l(),p("svg",wo,So)}const Lo=M(ko,[["render",Co]]),Po={class:"VPMenuLink"},Io=w({__name:"VPMenuLink",props:{item:{}},setup(n){const{page:e}=E();return(t,r)=>(l(),p("div",Po,[k(he,{class:O({active:u(be)(u(e).relativePath,t.item.activeMatch||t.item.link,!!t.item.activeMatch)}),href:t.item.link,target:t.item.target,rel:t.item.rel},{default:f(()=>[ee(A(t.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Ge=M(Io,[["__scopeId","data-v-2a5ce3c3"]]),To={class:"VPMenuGroup"},Vo={key:0,class:"title"},Ao=w({__name:"VPMenuGroup",props:{text:{},items:{}},setup(n){return(e,t)=>(l(),p("div",To,[e.text?(l(),p("p",Vo,A(e.text),1)):x("",!0),(l(!0),p(j,null,Z(e.items,r=>(l(),p(j,null,["link"in r?(l(),I(Ge,{key:0,item:r},null,8,["item"])):x("",!0)],64))),256))]))}}),Eo=M(Ao,[["__scopeId","data-v-fc4e050a"]]),Ro={class:"VPMenu"},No={key:0,class:"items"},Ho=w({__name:"VPMenu",props:{items:{}},setup(n){return(e,t)=>(l(),p("div",Ro,[e.items?(l(),p("div",No,[(l(!0),p(j,null,Z(e.items,r=>(l(),p(j,{key:r.text},["link"in r?(l(),I(Ge,{key:0,item:r},null,8,["item"])):(l(),I(Eo,{key:1,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):x("",!0),m(e.$slots,"default",{},void 0,!0)]))}}),Bo=M(Ho,[["__scopeId","data-v-d7fe51e3"]]),Oo=["aria-expanded","aria-label"],Fo={key:0,class:"text"},Do=["innerHTML"],jo={class:"menu"},zo=w({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(n){const e=T(!1),t=T();ho({el:t,onBlur:r});function r(){e.value=!1}return(s,a)=>(l(),p("div",{class:"VPFlyout",ref_key:"el",ref:t,onMouseenter:a[1]||(a[1]=o=>e.value=!0),onMouseleave:a[2]||(a[2]=o=>e.value=!1)},[d("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":e.value,"aria-label":s.label,onClick:a[0]||(a[0]=o=>e.value=!e.value)},[s.button||s.icon?(l(),p("span",Fo,[s.icon?(l(),I(ge(s.icon),{key:0,class:"option-icon"})):x("",!0),s.button?(l(),p("span",{key:1,innerHTML:s.button},null,8,Do)):x("",!0),k(an,{class:"text-icon"})])):(l(),I(Lo,{key:1,class:"icon"}))],8,Oo),d("div",jo,[k(Bo,{items:s.items},{default:f(()=>[m(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),kt=M(zo,[["__scopeId","data-v-cd71553e"]]),Wo={discord:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',facebook:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',github:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',instagram:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>',linkedin:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',mastodon:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Mastodon</title><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>',slack:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Slack</title><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',twitter:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/></svg>',x:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',youtube:'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'},Uo=["href","aria-label","innerHTML"],Go=w({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(n){const e=n,t=S(()=>typeof e.icon=="object"?e.icon.svg:Wo[e.icon]);return(r,s)=>(l(),p("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:t.value},null,8,Uo))}}),qo=M(Go,[["__scopeId","data-v-d38ddcd3"]]),Qo={class:"VPSocialLinks"},Ko=w({__name:"VPSocialLinks",props:{links:{}},setup(n){return(e,t)=>(l(),p("div",Qo,[(l(!0),p(j,null,Z(e.links,({link:r,icon:s,ariaLabel:a})=>(l(),I(qo,{key:r,icon:s,link:r,ariaLabel:a},null,8,["icon","link","ariaLabel"]))),128))]))}}),wt=M(Ko,[["__scopeId","data-v-aab0a068"]]),Jo={key:0,class:"group translations"},Zo={class:"trans-title"},Yo={key:1,class:"group"},Xo={class:"item appearance"},ei={class:"label"},ti={class:"appearance-action"},ni={key:2,class:"group"},ri={class:"item social-links"},si=w({__name:"VPNavBarExtra",setup(n){const{site:e,theme:t}=E(),{localeLinks:r,currentLang:s}=Ae({correspondingLink:!0}),a=S(()=>r.value.length&&s.value.label||e.value.appearance||t.value.socialLinks);return(o,c)=>a.value?(l(),I(kt,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:f(()=>[u(r).length&&u(s).label?(l(),p("div",Jo,[d("p",Zo,A(u(s).label),1),(l(!0),p(j,null,Z(u(r),i=>(l(),I(Ge,{key:i.link,item:i},null,8,["item"]))),128))])):x("",!0),u(e).appearance&&u(e).appearance!=="force-dark"?(l(),p("div",Yo,[d("div",Xo,[d("p",ei,A(u(t).darkModeSwitchLabel||"Appearance"),1),d("div",ti,[k(yt)])])])):x("",!0),u(t).socialLinks?(l(),p("div",ni,[d("div",ri,[k(wt,{class:"social-links-list",links:u(t).socialLinks},null,8,["links"])])])):x("",!0)]),_:1})):x("",!0)}}),ai=M(si,[["__scopeId","data-v-a9cec746"]]),oi=n=>(se("data-v-97a4b71d"),n=n(),ae(),n),ii=["aria-expanded"],li=oi(()=>d("span",{class:"container"},[d("span",{class:"top"}),d("span",{class:"middle"}),d("span",{class:"bottom"})],-1)),ci=[li],ui=w({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(n){return(e,t)=>(l(),p("button",{type:"button",class:O(["VPNavBarHamburger",{active:e.active}]),"aria-label":"mobile navigation","aria-expanded":e.active,"aria-controls":"VPNavScreen",onClick:t[0]||(t[0]=r=>e.$emit("click"))},ci,10,ii))}}),di=M(ui,[["__scopeId","data-v-97a4b71d"]]),pi=["innerHTML"],hi=w({__name:"VPNavBarMenuLink",props:{item:{}},setup(n){const{page:e}=E();return(t,r)=>(l(),I(he,{class:O({VPNavBarMenuLink:!0,active:u(be)(u(e).relativePath,t.item.activeMatch||t.item.link,!!t.item.activeMatch)}),href:t.item.link,target:t.item.target,rel:t.item.rel,tabindex:"0"},{default:f(()=>[d("span",{innerHTML:t.item.text},null,8,pi)]),_:1},8,["class","href","target","rel"]))}}),mi=M(hi,[["__scopeId","data-v-86d36afd"]]),vi=w({__name:"VPNavBarMenuGroup",props:{item:{}},setup(n){const e=n,{page:t}=E(),r=a=>"link"in a?be(t.value.relativePath,a.link,!!e.item.activeMatch):a.items.some(r),s=S(()=>r(e.item));return(a,o)=>(l(),I(kt,{class:O({VPNavBarMenuGroup:!0,active:u(be)(u(t).relativePath,a.item.activeMatch,!!a.item.activeMatch)||s.value}),button:a.item.text,items:a.item.items},null,8,["class","button","items"]))}}),fi=n=>(se("data-v-e02be692"),n=n(),ae(),n),gi={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},bi=fi(()=>d("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),yi=w({__name:"VPNavBarMenu",setup(n){const{theme:e}=E();return(t,r)=>u(e).nav?(l(),p("nav",gi,[bi,(l(!0),p(j,null,Z(u(e).nav,s=>(l(),p(j,{key:s.text},["link"in s?(l(),I(mi,{key:0,item:s},null,8,["item"])):(l(),I(vi,{key:1,item:s},null,8,["item"]))],64))),128))])):x("",!0)}}),_i=M(yi,[["__scopeId","data-v-e02be692"]]);var Ct;const on=typeof window<"u",ki=n=>typeof n=="string",Oe=()=>{};on&&((Ct=window==null?void 0:window.navigator)!=null&&Ct.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function rt(n){return typeof n=="function"?n():u(n)}function wi(n,e){function t(...r){n(()=>e.apply(this,r),{fn:e,thisArg:this,args:r})}return t}function $i(n,e={}){let t,r;return s=>{const a=rt(n),o=rt(e.maxWait);if(t&&clearTimeout(t),a<=0||o!==void 0&&o<=0)return r&&(clearTimeout(r),r=null),s();o&&!r&&(r=setTimeout(()=>{t&&clearTimeout(t),r=null,s()},o)),t=setTimeout(()=>{r&&clearTimeout(r),r=null,s()},a)}}function xi(n){return n}function Mi(n){return Yt()?(Xt(n),!0):!1}function ln(n,e=200,t={}){return wi($i(e,t),n)}function Ze(n,e=200,t={}){if(e<=0)return n;const r=T(n.value),s=ln(()=>{r.value=n.value},e,t);return q(n,()=>s()),r}function cn(n,e,t){return q(n,(r,s,a)=>{r&&e(r,s,a)},t)}function Si(n){var e;const t=rt(n);return(e=t==null?void 0:t.$el)!=null?e:t}const un=on?window:void 0;function Re(...n){let e,t,r,s;if(ki(n[0])?([t,r,s]=n,e=un):[e,t,r,s]=n,!e)return Oe;let a=Oe;const o=q(()=>Si(e),i=>{a(),i&&(i.addEventListener(t,r,s),a=()=>{i.removeEventListener(t,r,s),a=Oe})},{immediate:!0,flush:"post"}),c=()=>{o(),a()};return Mi(c),c}const Lt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Pt="__vueuse_ssr_handlers__";Lt[Pt]=Lt[Pt]||{};const Ci={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Li(n={}){const{reactive:e=!1,target:t=un,aliasMap:r=Ci,passive:s=!0,onEventFired:a=Oe}=n,o=Ie(new Set),c={toJSON(){return{}},current:o},i=e?Ie(c):c,h=new Set,v=new Set;function y(b,g){b in i&&(e?i[b]=g:i[b].value=g)}function _(){for(const b of v)y(b,!1)}function $(b,g){var R,F;const N=(R=b.key)==null?void 0:R.toLowerCase(),z=[(F=b.code)==null?void 0:F.toLowerCase(),N].filter(Boolean);N&&(g?o.add(N):o.delete(N));for(const G of z)v.add(G),y(G,g);N==="meta"&&!g?(h.forEach(G=>{o.delete(G),y(G,!1)}),h.clear()):typeof b.getModifierState=="function"&&b.getModifierState("Meta")&&g&&[...o,...z].forEach(G=>h.add(G))}Re(t,"keydown",b=>($(b,!0),a(b)),{passive:s}),Re(t,"keyup",b=>($(b,!1),a(b)),{passive:s}),Re("blur",_,{passive:!0}),Re("focus",_,{passive:!0});const P=new Proxy(i,{get(b,g,R){if(typeof g!="string")return Reflect.get(b,g,R);if(g=g.toLowerCase(),g in r&&(g=r[g]),!(g in i))if(/[+_-]/.test(g)){const N=g.split(/[+_-]/g).map(z=>z.trim());i[g]=S(()=>N.every(z=>u(P[z])))}else i[g]=T(!1);const F=Reflect.get(b,g,R);return e?u(F):F}});return P}var It;(function(n){n.UP="UP",n.RIGHT="RIGHT",n.DOWN="DOWN",n.LEFT="LEFT",n.NONE="NONE"})(It||(It={}));var Pi=Object.defineProperty,Tt=Object.getOwnPropertySymbols,Ii=Object.prototype.hasOwnProperty,Ti=Object.prototype.propertyIsEnumerable,Vt=(n,e,t)=>e in n?Pi(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,Vi=(n,e)=>{for(var t in e||(e={}))Ii.call(e,t)&&Vt(n,t,e[t]);if(Tt)for(var t of Tt(e))Ti.call(e,t)&&Vt(n,t,e[t]);return n};const Ai={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Vi({linear:xi},Ai);function ce(n){return Array.isArray?Array.isArray(n):hn(n)==="[object Array]"}const Ei=1/0;function Ri(n){if(typeof n=="string")return n;let e=n+"";return e=="0"&&1/n==-Ei?"-0":e}function Ni(n){return n==null?"":Ri(n)}function oe(n){return typeof n=="string"}function dn(n){return typeof n=="number"}function Hi(n){return n===!0||n===!1||Bi(n)&&hn(n)=="[object Boolean]"}function pn(n){return typeof n=="object"}function Bi(n){return pn(n)&&n!==null}function re(n){return n!=null}function Ye(n){return!n.trim().length}function hn(n){return n==null?n===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(n)}const Oi="Incorrect 'index' type",Fi=n=>`Invalid value for key ${n}`,Di=n=>`Pattern length exceeds max of ${n}.`,ji=n=>`Missing ${n} property in key`,zi=n=>`Property 'weight' in key '${n}' must be a positive integer`,At=Object.prototype.hasOwnProperty;class Wi{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(r=>{let s=mn(r);t+=s.weight,this._keys.push(s),this._keyMap[s.id]=s,t+=s.weight}),this._keys.forEach(r=>{r.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function mn(n){let e=null,t=null,r=null,s=1,a=null;if(oe(n)||ce(n))r=n,e=Et(n),t=st(n);else{if(!At.call(n,"name"))throw new Error(ji("name"));const o=n.name;if(r=o,At.call(n,"weight")&&(s=n.weight,s<=0))throw new Error(zi(o));e=Et(o),t=st(o),a=n.getFn}return{path:e,id:t,weight:s,src:r,getFn:a}}function Et(n){return ce(n)?n:n.split(".")}function st(n){return ce(n)?n.join("."):n}function Ui(n,e){let t=[],r=!1;const s=(a,o,c)=>{if(re(a))if(!o[c])t.push(a);else{let i=o[c];const h=a[i];if(!re(h))return;if(c===o.length-1&&(oe(h)||dn(h)||Hi(h)))t.push(Ni(h));else if(ce(h)){r=!0;for(let v=0,y=h.length;v<y;v+=1)s(h[v],o,c+1)}else o.length&&s(h,o,c+1)}};return s(n,oe(e)?e.split("."):e,0),r?t:t[0]}const Gi={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},qi={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(n,e)=>n.score===e.score?n.idx<e.idx?-1:1:n.score<e.score?-1:1},Qi={location:0,threshold:.6,distance:100},Ki={useExtendedSearch:!1,getFn:Ui,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var V={...qi,...Gi,...Qi,...Ki};const Ji=/[^ ]+/g;function Zi(n=1,e=3){const t=new Map,r=Math.pow(10,e);return{get(s){const a=s.match(Ji).length;if(t.has(a))return t.get(a);const o=1/Math.pow(a,.5*n),c=parseFloat(Math.round(o*r)/r);return t.set(a,c),c},clear(){t.clear()}}}class $t{constructor({getFn:e=V.getFn,fieldNormWeight:t=V.fieldNormWeight}={}){this.norm=Zi(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((t,r)=>{this._keysMap[t.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,oe(this.docs[0])?this.docs.forEach((e,t)=>{this._addString(e,t)}):this.docs.forEach((e,t)=>{this._addObject(e,t)}),this.norm.clear())}add(e){const t=this.size();oe(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,r=this.size();t<r;t+=1)this.records[t].i-=1}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!re(e)||Ye(e))return;let r={v:e,i:t,n:this.norm.get(e)};this.records.push(r)}_addObject(e,t){let r={i:t,$:{}};this.keys.forEach((s,a)=>{let o=s.getFn?s.getFn(e):this.getFn(e,s.path);if(re(o)){if(ce(o)){let c=[];const i=[{nestedArrIndex:-1,value:o}];for(;i.length;){const{nestedArrIndex:h,value:v}=i.pop();if(re(v))if(oe(v)&&!Ye(v)){let y={v,i:h,n:this.norm.get(v)};c.push(y)}else ce(v)&&v.forEach((y,_)=>{i.push({nestedArrIndex:_,value:y})})}r.$[a]=c}else if(oe(o)&&!Ye(o)){let c={v:o,n:this.norm.get(o)};r.$[a]=c}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function vn(n,e,{getFn:t=V.getFn,fieldNormWeight:r=V.fieldNormWeight}={}){const s=new $t({getFn:t,fieldNormWeight:r});return s.setKeys(n.map(mn)),s.setSources(e),s.create(),s}function Yi(n,{getFn:e=V.getFn,fieldNormWeight:t=V.fieldNormWeight}={}){const{keys:r,records:s}=n,a=new $t({getFn:e,fieldNormWeight:t});return a.setKeys(r),a.setIndexRecords(s),a}function Ne(n,{errors:e=0,currentLocation:t=0,expectedLocation:r=0,distance:s=V.distance,ignoreLocation:a=V.ignoreLocation}={}){const o=e/n.length;if(a)return o;const c=Math.abs(r-t);return s?o+c/s:c?1:o}function Xi(n=[],e=V.minMatchCharLength){let t=[],r=-1,s=-1,a=0;for(let o=n.length;a<o;a+=1){let c=n[a];c&&r===-1?r=a:!c&&r!==-1&&(s=a-1,s-r+1>=e&&t.push([r,s]),r=-1)}return n[a-1]&&a-r>=e&&t.push([r,a-1]),t}const fe=32;function el(n,e,t,{location:r=V.location,distance:s=V.distance,threshold:a=V.threshold,findAllMatches:o=V.findAllMatches,minMatchCharLength:c=V.minMatchCharLength,includeMatches:i=V.includeMatches,ignoreLocation:h=V.ignoreLocation}={}){if(e.length>fe)throw new Error(Di(fe));const v=e.length,y=n.length,_=Math.max(0,Math.min(r,y));let $=a,P=_;const b=c>1||i,g=b?Array(y):[];let R;for(;(R=n.indexOf(e,P))>-1;){let J=Ne(e,{currentLocation:R,expectedLocation:_,distance:s,ignoreLocation:h});if($=Math.min(J,$),P=R+v,b){let X=0;for(;X<v;)g[R+X]=1,X+=1}}P=-1;let F=[],N=1,z=v+y;const G=1<<v-1;for(let J=0;J<v;J+=1){let X=0,Q=z;for(;X<Q;)Ne(e,{errors:J,currentLocation:_+Q,expectedLocation:_,distance:s,ignoreLocation:h})<=$?X=Q:z=Q,Q=Math.floor((z-X)/2+X);z=Q;let we=Math.max(1,_-Q+1),ie=o?y:Math.min(_+Q,y)+v,ne=Array(ie+2);ne[ie+1]=(1<<J)-1;for(let C=ie;C>=we;C-=1){let B=C-1,K=t[n.charAt(B)];if(b&&(g[B]=+!!K),ne[C]=(ne[C+1]<<1|1)&K,J&&(ne[C]|=(F[C+1]|F[C])<<1|1|F[C+1]),ne[C]&G&&(N=Ne(e,{errors:J,currentLocation:B,expectedLocation:_,distance:s,ignoreLocation:h}),N<=$)){if($=N,P=B,P<=_)break;we=Math.max(1,2*_-P)}}if(Ne(e,{errors:J+1,currentLocation:_,expectedLocation:_,distance:s,ignoreLocation:h})>$)break;F=ne}const Y={isMatch:P>=0,score:Math.max(.001,N)};if(b){const J=Xi(g,c);J.length?i&&(Y.indices=J):Y.isMatch=!1}return Y}function tl(n){let e={};for(let t=0,r=n.length;t<r;t+=1){const s=n.charAt(t);e[s]=(e[s]||0)|1<<r-t-1}return e}class fn{constructor(e,{location:t=V.location,threshold:r=V.threshold,distance:s=V.distance,includeMatches:a=V.includeMatches,findAllMatches:o=V.findAllMatches,minMatchCharLength:c=V.minMatchCharLength,isCaseSensitive:i=V.isCaseSensitive,ignoreLocation:h=V.ignoreLocation}={}){if(this.options={location:t,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:c,isCaseSensitive:i,ignoreLocation:h},this.pattern=i?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;const v=(_,$)=>{this.chunks.push({pattern:_,alphabet:tl(_),startIndex:$})},y=this.pattern.length;if(y>fe){let _=0;const $=y%fe,P=y-$;for(;_<P;)v(this.pattern.substr(_,fe),_),_+=fe;if($){const b=y-fe;v(this.pattern.substr(b),b)}}else v(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,includeMatches:r}=this.options;if(t||(e=e.toLowerCase()),this.pattern===e){let P={isMatch:!0,score:0};return r&&(P.indices=[[0,e.length-1]]),P}const{location:s,distance:a,threshold:o,findAllMatches:c,minMatchCharLength:i,ignoreLocation:h}=this.options;let v=[],y=0,_=!1;this.chunks.forEach(({pattern:P,alphabet:b,startIndex:g})=>{const{isMatch:R,score:F,indices:N}=el(e,P,b,{location:s+g,distance:a,threshold:o,findAllMatches:c,minMatchCharLength:i,includeMatches:r,ignoreLocation:h});R&&(_=!0),y+=F,R&&N&&(v=[...v,...N])});let $={isMatch:_,score:_?y/this.chunks.length:1};return _&&r&&($.indices=v),$}}class me{constructor(e){this.pattern=e}static isMultiMatch(e){return Rt(e,this.multiRegex)}static isSingleMatch(e){return Rt(e,this.singleRegex)}search(){}}function Rt(n,e){const t=n.match(e);return t?t[1]:null}class nl extends me{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class rl extends me{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const t=e.indexOf(this.pattern)===-1;return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class sl extends me{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class al extends me{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class ol extends me{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}class il extends me{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class gn extends me{constructor(e,{location:t=V.location,threshold:r=V.threshold,distance:s=V.distance,includeMatches:a=V.includeMatches,findAllMatches:o=V.findAllMatches,minMatchCharLength:c=V.minMatchCharLength,isCaseSensitive:i=V.isCaseSensitive,ignoreLocation:h=V.ignoreLocation}={}){super(e),this._bitapSearch=new fn(e,{location:t,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:c,isCaseSensitive:i,ignoreLocation:h})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class bn extends me{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t=0,r;const s=[],a=this.pattern.length;for(;(r=e.indexOf(this.pattern,t))>-1;)t=r+a,s.push([r,t-1]);const o=!!s.length;return{isMatch:o,score:o?0:1,indices:s}}}const at=[nl,bn,sl,al,il,ol,rl,gn],Nt=at.length,ll=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,cl="|";function ul(n,e={}){return n.split(cl).map(t=>{let r=t.trim().split(ll).filter(a=>a&&!!a.trim()),s=[];for(let a=0,o=r.length;a<o;a+=1){const c=r[a];let i=!1,h=-1;for(;!i&&++h<Nt;){const v=at[h];let y=v.isMultiMatch(c);y&&(s.push(new v(y,e)),i=!0)}if(!i)for(h=-1;++h<Nt;){const v=at[h];let y=v.isSingleMatch(c);if(y){s.push(new v(y,e));break}}}return s})}const dl=new Set([gn.type,bn.type]);class pl{constructor(e,{isCaseSensitive:t=V.isCaseSensitive,includeMatches:r=V.includeMatches,minMatchCharLength:s=V.minMatchCharLength,ignoreLocation:a=V.ignoreLocation,findAllMatches:o=V.findAllMatches,location:c=V.location,threshold:i=V.threshold,distance:h=V.distance}={}){this.query=null,this.options={isCaseSensitive:t,includeMatches:r,minMatchCharLength:s,findAllMatches:o,ignoreLocation:a,location:c,threshold:i,distance:h},this.pattern=t?e:e.toLowerCase(),this.query=ul(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:s}=this.options;e=s?e:e.toLowerCase();let a=0,o=[],c=0;for(let i=0,h=t.length;i<h;i+=1){const v=t[i];o.length=0,a=0;for(let y=0,_=v.length;y<_;y+=1){const $=v[y],{isMatch:P,indices:b,score:g}=$.search(e);if(P){if(a+=1,c+=g,r){const R=$.constructor.type;dl.has(R)?o=[...o,...b]:o.push(b)}}else{c=0,a=0,o.length=0;break}}if(a){let y={isMatch:!0,score:c/a};return r&&(y.indices=o),y}}return{isMatch:!1,score:1}}}const ot=[];function hl(...n){ot.push(...n)}function it(n,e){for(let t=0,r=ot.length;t<r;t+=1){let s=ot[t];if(s.condition(n,e))return new s(n,e)}return new fn(n,e)}const je={AND:"$and",OR:"$or"},lt={PATH:"$path",PATTERN:"$val"},ct=n=>!!(n[je.AND]||n[je.OR]),ml=n=>!!n[lt.PATH],vl=n=>!ce(n)&&pn(n)&&!ct(n),Ht=n=>({[je.AND]:Object.keys(n).map(e=>({[e]:n[e]}))});function yn(n,e,{auto:t=!0}={}){const r=s=>{let a=Object.keys(s);const o=ml(s);if(!o&&a.length>1&&!ct(s))return r(Ht(s));if(vl(s)){const i=o?s[lt.PATH]:a[0],h=o?s[lt.PATTERN]:s[i];if(!oe(h))throw new Error(Fi(i));const v={keyId:st(i),pattern:h};return t&&(v.searcher=it(h,e)),v}let c={children:[],operator:a[0]};return a.forEach(i=>{const h=s[i];ce(h)&&h.forEach(v=>{c.children.push(r(v))})}),c};return ct(n)||(n=Ht(n)),r(n)}function fl(n,{ignoreFieldNorm:e=V.ignoreFieldNorm}){n.forEach(t=>{let r=1;t.matches.forEach(({key:s,norm:a,score:o})=>{const c=s?s.weight:null;r*=Math.pow(o===0&&c?Number.EPSILON:o,(c||1)*(e?1:a))}),t.score=r})}function gl(n,e){const t=n.matches;e.matches=[],re(t)&&t.forEach(r=>{if(!re(r.indices)||!r.indices.length)return;const{indices:s,value:a}=r;let o={indices:s,value:a};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),e.matches.push(o)})}function bl(n,e){e.score=n.score}function yl(n,e,{includeMatches:t=V.includeMatches,includeScore:r=V.includeScore}={}){const s=[];return t&&s.push(gl),r&&s.push(bl),n.map(a=>{const{idx:o}=a,c={item:e[o],refIndex:o};return s.length&&s.forEach(i=>{i(a,c)}),c})}class ye{constructor(e,t={},r){this.options={...V,...t},this.options.useExtendedSearch,this._keyStore=new Wi(this.options.keys),this.setCollection(e,r)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof $t))throw new Error(Oi);this._myIndex=t||vn(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){!re(e)||(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){const t=[];for(let r=0,s=this._docs.length;r<s;r+=1){const a=this._docs[r];e(a,r)&&(this.removeAt(r),r-=1,s-=1,t.push(a))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){const{includeMatches:r,includeScore:s,shouldSort:a,sortFn:o,ignoreFieldNorm:c}=this.options;let i=oe(e)?oe(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return fl(i,{ignoreFieldNorm:c}),a&&i.sort(o),dn(t)&&t>-1&&(i=i.slice(0,t)),yl(i,this._docs,{includeMatches:r,includeScore:s})}_searchStringList(e){const t=it(e,this.options),{records:r}=this._myIndex,s=[];return r.forEach(({v:a,i:o,n:c})=>{if(!re(a))return;const{isMatch:i,score:h,indices:v}=t.searchIn(a);i&&s.push({item:a,idx:o,matches:[{score:h,value:a,norm:c,indices:v}]})}),s}_searchLogical(e){const t=yn(e,this.options),r=(c,i,h)=>{if(!c.children){const{keyId:y,searcher:_}=c,$=this._findMatches({key:this._keyStore.get(y),value:this._myIndex.getValueForItemAtKeyId(i,y),searcher:_});return $&&$.length?[{idx:h,item:i,matches:$}]:[]}const v=[];for(let y=0,_=c.children.length;y<_;y+=1){const $=c.children[y],P=r($,i,h);if(P.length)v.push(...P);else if(c.operator===je.AND)return[]}return v},s=this._myIndex.records,a={},o=[];return s.forEach(({$:c,i})=>{if(re(c)){let h=r(t,c,i);h.length&&(a[i]||(a[i]={idx:i,item:c,matches:[]},o.push(a[i])),h.forEach(({matches:v})=>{a[i].matches.push(...v)}))}}),o}_searchObjectList(e){const t=it(e,this.options),{keys:r,records:s}=this._myIndex,a=[];return s.forEach(({$:o,i:c})=>{if(!re(o))return;let i=[];r.forEach((h,v)=>{i.push(...this._findMatches({key:h,value:o[v],searcher:t}))}),i.length&&a.push({idx:c,item:o,matches:i})}),a}_findMatches({key:e,value:t,searcher:r}){if(!re(t))return[];let s=[];if(ce(t))t.forEach(({v:a,i:o,n:c})=>{if(!re(a))return;const{isMatch:i,score:h,indices:v}=r.searchIn(a);i&&s.push({score:h,key:e,value:a,idx:o,norm:c,indices:v})});else{const{v:a,n:o}=t,{isMatch:c,score:i,indices:h}=r.searchIn(a);c&&s.push({score:i,key:e,value:a,norm:o,indices:h})}return s}}ye.version="6.6.2";ye.createIndex=vn;ye.parseIndex=Yi;ye.config=V;ye.parseQuery=yn;hl(pl);const Bt=Ie({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Ce=()=>({isSearching:S(()=>Bt.search!==""),...Nn(Bt)});function _l(n){return{all:n=n||new Map,on:function(e,t){var r=n.get(e);r?r.push(t):n.set(e,[t])},off:function(e,t){var r=n.get(e);r&&(t?r.splice(r.indexOf(t)>>>0,1):n.set(e,[]))},emit:function(e,t){var r=n.get(e);r&&r.slice().map(function(s){s(t)}),(r=n.get("*"))&&r.slice().map(function(s){s(e,t)})}}}const kl=_l(),qe=()=>({emitter:kl});function wl(n,e){let t=n.nextElementSibling;for(;t;){if(t.matches(e))return t;t=t.nextElementSibling}}function $l(n,e){let t=n.previousElementSibling;for(;t;){if(t.matches(e))return t;t=t.previousElementSibling}}const xl=["command-theme"],Ml={"command-root":""},Sl=w({name:"Command"}),Cl=w({...Sl,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(n,{emit:e}){const t=n,r='[command-item=""]',s="command-item-key",a='[command-group=""]',o="command-group-key",c='[command-group-heading=""]',i=`${r}:not([aria-disabled="true"])`,h=`${r}[aria-selected="true"]`,v="command-item-select",y="data-value";ht("theme",t.theme||"default");const{selectedNode:_,search:$,dataValue:P,filtered:b}=Ce(),{emitter:g}=qe(),R=T(),F=Ze(T(new Map),333),N=Ze(T(new Set),333),z=Ze(T(new Map)),G=S(()=>{const L=[];for(const[D,H]of F.value.entries())L.push({key:D,label:H});return L}),Y=S(()=>{const L=ye.createIndex(t.fuseOptions.keys,G.value);return new ye(G.value,t.fuseOptions,L)}),J=()=>{var L,D,H;const W=X();W&&(((L=W.parentElement)==null?void 0:L.firstElementChild)===W&&((H=(D=W.closest(a))==null?void 0:D.querySelector(c))==null||H.scrollIntoView({block:"nearest"})),W.scrollIntoView({block:"nearest"}))},X=()=>{var L;return(L=R.value)==null?void 0:L.querySelector(h)},Q=(L=R.value)=>{const D=L==null?void 0:L.querySelectorAll(i);return D?Array.from(D):[]},we=()=>{var L;const D=(L=R.value)==null?void 0:L.querySelectorAll(a);return D?Array.from(D):[]},ie=()=>{const[L]=Q();L&&L.getAttribute(s)&&(_.value=L.getAttribute(s)||"")},ne=L=>{const D=Q()[L];D&&(_.value=D.getAttribute(s)||"")},C=L=>{const D=X(),H=Q(),W=H.findIndex(Ee=>Ee===D),pe=H[W+L];pe?_.value=pe.getAttribute(s)||"":L>0?ne(0):ne(H.length-1)},B=L=>{const D=X();let H=D==null?void 0:D.closest(a),W=null;for(;H&&!W;)H=L>0?wl(H,a):$l(H,a),W=H==null?void 0:H.querySelector(i);W?_.value=W.getAttribute(s)||"":C(L)},K=()=>ne(0),U=()=>ne(Q().length-1),$e=L=>{L.preventDefault(),L.metaKey?U():L.altKey?B(1):C(1)},Qe=L=>{L.preventDefault(),L.metaKey?K():L.altKey?B(-1):C(-1)},Ke=L=>{switch(L.key){case"n":case"j":{L.ctrlKey&&$e(L);break}case"ArrowDown":{$e(L);break}case"p":case"k":{L.ctrlKey&&Qe(L);break}case"ArrowUp":{Qe(L);break}case"Home":{K();break}case"End":{U();break}case"Enter":{const D=X();if(D){const H=new Event(v);D.dispatchEvent(H)}}}},te=()=>{if(!$.value){b.value.count=N.value.size;return}b.value.groups=new Set("");const L=new Map,D=Y.value.search($.value).map(H=>H.item);for(const{key:H,label:W}of D)L.set(H,W);for(const[H,W]of z.value)for(const pe of W)L.get(pe)&&b.value.groups.add(H);le(()=>{b.value.count=L.size,b.value.items=L})},ve=()=>{const L=Q(),D=we();for(const H of L){const W=H.getAttribute(s)||"",pe=H.getAttribute(y)||"";N.value.add(W),F.value.set(W,pe),b.value.count=F.value.size}for(const H of D){const W=Q(H),pe=H.getAttribute(o)||"",Ee=new Set("");for(const Ln of W){const Pn=Ln.getAttribute(s)||"";Ee.add(Pn)}z.value.set(pe,Ee)}};q(()=>_.value,L=>{L&&le(J)},{deep:!0}),q(()=>$.value,L=>{te(),le(ie)}),g.on("selectItem",L=>{e("select-item",L)});const Cn=ln(L=>{L&&(ve(),le(ie))},100);return g.on("rerenderList",Cn),ue(()=>{ve(),ie()}),(L,D)=>(l(),p("div",{class:O(n.theme),onKeydown:Ke,ref_key:"commandRef",ref:R,"command-theme":n.theme},[d("div",Ml,[m(L.$slots,"default")])],42,xl))}}),Le=(n,e)=>{const t=n.__vccOpts||n;for(const[r,s]of e)t[r]=s;return t},ut=Le(Cl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Ll={"command-dialog":""},Pl={"command-dialog-mask":""},Il={"command-dialog-wrapper":""},Tl={"command-dialog-header":""},Vl={"command-dialog-body":""},Al={key:0,"command-dialog-footer":""},El=w({name:"Command.Dialog"}),Rl=w({...El,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(n,{emit:e}){const t=n,{search:r,filtered:s}=Ce(),{emitter:a}=qe(),o=T();a.on("selectItem",i=>{e("select-item",i)});const c=()=>{r.value="",s.value.count=0,s.value.items=new Map,s.value.groups=new Set};return cn(()=>t.visible,c),mt(c),(i,h)=>(l(),I(Rn,{to:"body",ref_key:"dialogRef",ref:o},[k(ze,{name:"command-dialog",appear:""},{default:f(()=>[n.visible?(l(),I(ut,{key:0,theme:n.theme},{default:f(()=>[d("div",Ll,[d("div",Pl,[d("div",Il,[d("div",Tl,[m(i.$slots,"header")]),d("div",Vl,[m(i.$slots,"body")]),i.$slots.footer?(l(),p("div",Al,[m(i.$slots,"footer")])):x("v-if",!0)])])])]),_:3},8,["theme"])):x("v-if",!0)]),_:3})],512))}}),Nl=Le(Rl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let _n=(n=21)=>crypto.getRandomValues(new Uint8Array(n)).reduce((e,t)=>(t&=63,t<36?e+=t.toString(36):t<62?e+=(t-26).toString(36).toUpperCase():t>62?e+="-":e+="_",e),"");const Hl=["command-group-key","data-value"],Bl={key:0,"command-group-heading":""},Ol={"command-group-items":"",role:"group"},Fl=w({name:"Command.Group"}),Dl=w({...Fl,props:{heading:{type:String,required:!0}},setup(n){const e=S(()=>`command-group-${_n()}`),{filtered:t,isSearching:r}=Ce(),s=S(()=>r.value?t.value.groups.has(e.value):!0);return(a,o)=>Jt((l(),p("div",{"command-group":"",role:"presentation",key:u(e),"command-group-key":u(e),"data-value":n.heading},[n.heading?(l(),p("div",Bl,A(n.heading),1)):x("v-if",!0),d("div",Ol,[m(a.$slots,"default")])],8,Hl)),[[Zt,u(s)]])}}),jl=Le(Dl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),zl=["placeholder","value"],Wl=w({name:"Command.Input"}),Ul=w({...Wl,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(n,{emit:e}){const t=T(null),{search:r}=Ce(),s=S(()=>r.value),a=o=>{const c=o,i=o.target;r.value=i==null?void 0:i.value,e("input",c),e("update:value",r.value)};return _e(()=>{var o;(o=t.value)==null||o.focus()}),(o,c)=>(l(),p("input",{ref_key:"inputRef",ref:t,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:n.placeholder,value:u(s),onInput:a},null,40,zl))}}),Gl=Le(Ul,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),ql=["aria-selected","aria-disabled","command-item-key"],Ql=w({name:"Command.Item"}),Kl=w({...Ql,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(n,{emit:e}){const t=n,r="command-item-select",s="data-value",{current:a}=Li(),{selectedNode:o,filtered:c,isSearching:i}=Ce(),{emitter:h}=qe(),v=T(),y=S(()=>`command-item-${_n()}`),_=S(()=>{const b=c.value.items.get(y.value);return i.value?b!==void 0:!0}),$=S(()=>Array.from(a)),P=()=>{var b;const g={key:y.value,value:((b=v.value)==null?void 0:b.getAttribute(s))||""};e("select",g),h.emit("selectItem",g)};return cn($,b=>{t.shortcut&&t.shortcut.length>0&&t.shortcut.every(g=>a.has(g.toLowerCase()))&&t.perform&&t.perform()}),_e(()=>{var b;(b=v.value)==null||b.addEventListener(r,P)}),mt(()=>{var b;(b=v.value)==null||b.removeEventListener(r,P)}),(b,g)=>Jt((l(),p("div",{ref_key:"itemRef",ref:v,"command-item":"",role:"option","aria-selected":u(o)===u(y),"aria-disabled":!u(_),key:u(y),"command-item-key":u(y),onClick:P},[m(b.$slots,"default")],8,ql)),[[Zt,u(_)]])}}),Jl=Le(Kl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),Zl=w({name:"Command.List"}),Yl=w({...Zl,setup(n){const{emitter:e}=qe(),t=T(),r=T();let s=null,a;return _e(()=>{a=r.value;const o=t.value;a&&o&&(s=new ResizeObserver(c=>{le(()=>{const i=a==null?void 0:a.offsetHeight;o==null||o.style.setProperty("--command-list-height",`${i==null?void 0:i.toFixed(1)}px`),e.emit("rerenderList",!0)})}),s.observe(a))}),mt(()=>{s!==null&&a&&s.unobserve(a)}),(o,c)=>(l(),p("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:t},[d("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[m(o.$slots,"default")],512)],512))}}),Xl=Le(Yl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ec=w({name:"Command.Empty",setup(n,{attrs:e,slots:t}){const{filtered:r}=Ce(),s=S(()=>r.value.count===0);return()=>s.value?Fe("div",{"command-empty":"",role:"presentation",...e},t):Fe("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...e})}}),tc=w({name:"Command.Loading",setup(n,{attrs:e,slots:t}){return()=>Fe("div",{"command-loading":"",role:"progressbar",...e},t)}}),nc=w({name:"Command.Separator",setup(n,{attrs:e,slots:t}){return()=>Fe("div",{"command-separator":"",role:"separator",...e})}}),xe=Object.assign(ut,{Dialog:Nl,Empty:ec,Group:jl,Input:Gl,Item:Jl,List:Xl,Loading:tc,Separator:nc,Root:ut});var Ot;const kn=typeof window<"u",rc=n=>typeof n=="string",wn=()=>{};kn&&((Ot=window==null?void 0:window.navigator)!=null&&Ot.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function $n(n){return typeof n=="function"?n():u(n)}function sc(n){return n}function ac(n){return Yt()?(Xt(n),!0):!1}function oc(n,e=!0){Hn()?ue(n):e?n():le(n)}function ic(n){var e;const t=$n(n);return(e=t==null?void 0:t.$el)!=null?e:t}const xt=kn?window:void 0;function Me(...n){let e,t,r,s;if(rc(n[0])||Array.isArray(n[0])?([t,r,s]=n,e=xt):[e,t,r,s]=n,!e)return wn;Array.isArray(t)||(t=[t]),Array.isArray(r)||(r=[r]);const a=[],o=()=>{a.forEach(v=>v()),a.length=0},c=(v,y,_,$)=>(v.addEventListener(y,_,$),()=>v.removeEventListener(y,_,$)),i=q(()=>[ic(e),$n(s)],([v,y])=>{o(),v&&a.push(...t.flatMap(_=>r.map($=>c(v,_,$,y))))},{immediate:!0,flush:"post"}),h=()=>{i(),o()};return ac(h),h}const Ft=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Dt="__vueuse_ssr_handlers__";Ft[Dt]=Ft[Dt]||{};const lc={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function cc(n={}){const{reactive:e=!1,target:t=xt,aliasMap:r=lc,passive:s=!0,onEventFired:a=wn}=n,o=Ie(new Set),c={toJSON(){return{}},current:o},i=e?Ie(c):c,h=new Set,v=new Set;function y(b,g){b in i&&(e?i[b]=g:i[b].value=g)}function _(){o.clear();for(const b of v)y(b,!1)}function $(b,g){var R,F;const N=(R=b.key)==null?void 0:R.toLowerCase(),G=[(F=b.code)==null?void 0:F.toLowerCase(),N].filter(Boolean);N&&(g?o.add(N):o.delete(N));for(const Y of G)v.add(Y),y(Y,g);N==="meta"&&!g?(h.forEach(Y=>{o.delete(Y),y(Y,!1)}),h.clear()):typeof b.getModifierState=="function"&&b.getModifierState("Meta")&&g&&[...o,...G].forEach(Y=>h.add(Y))}Me(t,"keydown",b=>($(b,!0),a(b)),{passive:s}),Me(t,"keyup",b=>($(b,!1),a(b)),{passive:s}),Me("blur",_,{passive:!0}),Me("focus",_,{passive:!0});const P=new Proxy(i,{get(b,g,R){if(typeof g!="string")return Reflect.get(b,g,R);if(g=g.toLowerCase(),g in r&&(g=r[g]),!(g in i))if(/[+_-]/.test(g)){const N=g.split(/[+_-]/g).map(z=>z.trim());i[g]=S(()=>N.every(z=>u(P[z])))}else i[g]=T(!1);const F=Reflect.get(b,g,R);return e?u(F):F}});return P}var jt;(function(n){n.UP="UP",n.RIGHT="RIGHT",n.DOWN="DOWN",n.LEFT="LEFT",n.NONE="NONE"})(jt||(jt={}));var uc=Object.defineProperty,zt=Object.getOwnPropertySymbols,dc=Object.prototype.hasOwnProperty,pc=Object.prototype.propertyIsEnumerable,Wt=(n,e,t)=>e in n?uc(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,hc=(n,e)=>{for(var t in e||(e={}))dc.call(e,t)&&Wt(n,t,e[t]);if(zt)for(var t of zt(e))pc.call(e,t)&&Wt(n,t,e[t]);return n};const mc={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};hc({linear:sc},mc);function vc(n={}){const{window:e=xt,initialWidth:t=1/0,initialHeight:r=1/0,listenOrientation:s=!0,includeScrollbar:a=!0}=n,o=T(t),c=T(r),i=()=>{e&&(a?(o.value=e.innerWidth,c.value=e.innerHeight):(o.value=e.document.documentElement.clientWidth,c.value=e.document.documentElement.clientHeight))};return i(),oc(i),Me("resize",i,{passive:!0}),s&&Me("orientationchange",i,{passive:!0}),{width:o,height:c}}const Ut=T([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

Based on the Web Components UI component library

## Feature

1. Based on 'Web Components', reuse across the framework and unify all cases.
2. Based on 'TypeScript', with declaration and type files.
3. Pure native handwriting, no dependence on basic components.
4. All component instances of the document are interactive.
5. 'MIT' protocol.

## Situation

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- \`git\`：<a href="https://github.com/chaxus/ran/tree/main/packages/ranui">\`https://github.com/chaxus/ran/tree/main/packages/ranui\`</a>
- \`npm\`：<a href="https://www.npmjs.com/package/ranui">\`https://www.npmjs.com/package/ranui\`</a>

## Usage

In most cases, you can use it just like a native 'div' tag.

Here are some examples

1. \`html\`
2. \`js\`
3. \`jsx\`
4. \`vue\`
5. \`tsx\`

### 1.\`html\`

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>

<body>
  <r-button>Button</r-button>
</body>
\`\`\`

### 2.\`js\`

\`\`\`js
import 'ranui';

const Button = document.createElement('r-button');
Button.appendChild('this is button text');
document.body.appendChild(Button);
\`\`\`

### 3.\`jsx\`

Because \`react\` synthetic events, in order to more convenient to use, by \`react\` higher-order components encapsulation [ranui](https://www.npmjs.com/package/ranui), Output the [@ranui/react](https://www.npmjs.com/package/@ranui/react)

In \`react\`, use the [@ranui/react](https://www.npmjs.com/package/@ranui/react) will be more smooth, by higher-order functions after package, and \`react\` ecosystem.

[ranui](https://www.npmjs.com/package/ranui), however, still can be in any \`js\` or \`ts\` in use.

\`\`\`jsx
import 'ranui';
const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
\`\`\`

### 4.\`vue\`

\`\`\`vue
<template>
  <r-button>Button</r-button>
</template>
<script>
import 'ranui';
<\/script>
\`\`\`

### 5.\`tsx\`

Because \`react\` synthetic events, in order to more convenient to use, by \`react\` higher-order components encapsulation [ranui](https://www.npmjs.com/package/ranui), Output the [@ranui/react](https://www.npmjs.com/package/@ranui/react)

In \`react\`, use the [@ranui/react](https://www.npmjs.com/package/@ranui/react) will be more smooth, by higher-order functions after package, and \`react\` ecosystem.

[ranui](https://www.npmjs.com/package/ranui), however, still can be in any \`js\` or \`ts\` in use.

\`\`\`tsx
// react 18
import type { SyntheticEvent } from 'react';
import React, { useRef } from 'react';
import 'ranui';

const FilePreview = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const uploadFile = (e: SyntheticEvent<HTMLDivElement>) => {
    if (ref.current) {
      const uploadFile = document.createElement('input');
      uploadFile.setAttribute('type', 'file');
      uploadFile.click();
      uploadFile.onchange = (e) => {
        const { files = [] } = uploadFile;
        if (files && files?.length > 0 && ref.current) {
          ref.current.setAttribute('src', '');
          const file = files[0];
          const url = URL.createObjectURL(file);
          ref.current.setAttribute('src', url);
        }
      };
    }
  };
  return (
    <div>
      <r-preview ref={ref}></r-preview>
      <r-button type="primary" onClick={uploadFile}>
        choose file to preview
      </r-button>
    </div>
  );
};
\`\`\`

jsx defines the types of all HTML-native components in TypeScript. The type 'web component' is not in the jsx definition. You need to add it manually. Otherwise there is a type problem, but it actually works.

\`\`\`ts
// typings.d.ts
interface RButton {
  type?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

interface RPreview {
  src?: string | Blob | ArrayBuffer;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
}

declare namespace JSX {
  interface IntrinsicElements {
    'r-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RPreview;
    'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RButton;
  }
}
\`\`\`

## Import

Support for on-demand import

\`\`\`js
import 'ranui/button';
\`\`\`

For some globally displayed components, such as preview and message, additional styles need to be loaded

\`\`\`js
import 'ranui/preview';
import 'ranui/style';
\`\`\`

It can also be imported globally, which is more convenient, so that there is no need to consider anything, so that it is done.

- \`ES module\`

\`\`\`js
import 'ranui';
\`\`\`

- \`UMD\`, \`IIFE\`, \`CJS\`

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>
\`\`\`

## Overview

- \`Button\`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">Primary button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning">Warning button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text">Text button</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button >Default button</r-button>
</div>

- \`Icon\`

<div style='display:flex'>
     <r-icon name="lock" size="50" ></r-icon>
     <r-icon name="user" size="50" ></r-icon>
     <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
</div>

- \`Skeleton\`

<div style="width: 100px;margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="width: 200px;margin-top:10px;margin-bottom: 12px;">
    <r-skeleton ></r-skeleton>
</div>

- \`Input\`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input label="user"></r-input>
</div>

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input icon="lock" type="password"></r-input>
</div>

- \`message\`

<r-button onclick="message.info('This is a hint')">Information prompt</r-button>
<r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
<r-button onclick="message.error('This is a hint')">Error prompt</r-button>
<r-button onclick="message.success('This is a hint')">Success tip</r-button>
<r-button onclick="message.toast('This is a hint')">toast tip</r-button>

- \`Tab\`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
   <r-tabs>
      <r-tab label="home" icon="home">tab1</r-tab>
      <r-tab label="message" icon="message">tab2</r-tab>
      <r-tab label="user" icon="user">tab3</r-tab>
   </r-tabs>
</div>

- \`Radar\`

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>

- \`Progress\`

<r-progress type="drag" ></r-progress>

- \`Player\`

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

- \`Select\`

<r-select style="width: 120px; height: 40px" value="185" action="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

## Event

- \`react\`

[@ranui/react](https://www.npmjs.com/package/@ranui/react) By \`react\` higher-order functions encapsulated [ranui](https://www.npmjs.com/package/ranui) and become, \`Event\` events follow \`react\` Event specification. It is slightly different from the W3C standard.

- Modern 'web' standards

In the W3C standard, you can use the on attribute to define event handlers on HTML elements. But this is the old event handler approach.

Modern web development recommends the addEventListener method.

\`\`\`html
<r-button id="button">Button</r-button>

<script>
  const button = document.getElementById('button');
  button.addEventListener('click', function (event) {
    alert('New click event!');
  });
<\/script>
\`\`\`

However, if you do need to use the 'on' attribute, here is an example:

\`\`\`html
<r-input onchange="change(this.value)"></r-input>

<script>
  function change(e) {
    console.log('e`,title:"ranui",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                               |
| `,title:"ranutsoverview",date:"2023-12-21 07:26:43"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2023-12-21 07:26:43"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2023-12-21 07:26:43"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2023-12-21 07:26:43"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

基于 \`Web Components UI\`组件库

## Feature 特点

1. 基于\`Web Components\`，跨框架复用，统一所有情况。
2. 基于\`TypeScript\`，具备声明和类型文件。
3. 纯原生手写，基础组件无依赖。
4. 文档所有组件实例可交互。
5. \`MIT\`协议。

## Situation 项目情况

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- \`git\`：<a href="https://github.com/chaxus/ran/tree/main/packages/ranui">\`https://github.com/chaxus/ran/tree/main/packages/ranui\`</a>
- \`npm\`：<a href="https://www.npmjs.com/package/ranui">\`https://www.npmjs.com/package/ranui\`</a>

## Usage 使用

大多数情况都可以像原生的 \`div\` 标签一样使用。

接下来是一些使用例子

1. \`html\`
2. \`js\`
3. \`jsx\`
4. \`vue\`
5. \`tsx\`

### 1.\`html\`

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>

<body>
  <r-button>Button</r-button>
</body>
\`\`\`

### 2.\`js\`

\`\`\`js
import 'ranui';

const Button = document.createElement('r-button');
Button.appendChild('this is button text');
document.body.appendChild(Button);
\`\`\`

### 3.\`jsx\`

由于\`react\`有合成事件，为了更加方便的使用，通过\`react\`高阶组件进行封装[ranui](https://www.npmjs.com/package/ranui)，输出了[@ranui/react](https://www.npmjs.com/package/@ranui/react)

在\`react\`中，使用[@ranui/react](https://www.npmjs.com/package/@ranui/react)会更加丝滑，通过高阶函数包裹后，与\`react\`生态系统完全融合。

然而，[ranui](https://www.npmjs.com/package/ranui)仍然可以在任何\`js\`或者\`ts\`中使用。

\`\`\`jsx
import 'ranui';
const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
\`\`\`

### 4.\`vue\`

\`\`\`vue
<template>
  <r-button>Button</r-button>
</template>
<script>
import 'ranui';
<\/script>
\`\`\`

### 5.\`tsx\`

由于\`react\`有合成事件，为了更加方便的使用，通过\`react\`高阶组件进行封装[ranui](https://www.npmjs.com/package/ranui)，于是有了[@ranui/react](https://www.npmjs.com/package/@ranui/react)

在\`react\`中，使用[@ranui/react](https://www.npmjs.com/package/@ranui/react)会更加丝滑，通过高阶函数包裹后，与\`react\`生态系统完全融合。

然而，[ranui](https://www.npmjs.com/package/ranui)仍然可以在任何\`js\`或者\`ts\`中使用。

\`\`\`tsx
// react 18
import type { SyntheticEvent } from 'react';
import React, { useRef } from 'react';
import 'ranui';

const FilePreview = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const uploadFile = (e: SyntheticEvent<HTMLDivElement>) => {
    if (ref.current) {
      const uploadFile = document.createElement('input');
      uploadFile.setAttribute('type', 'file');
      uploadFile.click();
      uploadFile.onchange = (e) => {
        const { files = [] } = uploadFile;
        if (files && files?.length > 0 && ref.current) {
          ref.current.setAttribute('src', '');
          const file = files[0];
          const url = URL.createObjectURL(file);
          ref.current.setAttribute('src', url);
        }
      };
    }
  };
  return (
    <div>
      <r-preview ref={ref}></r-preview>
      <r-button type="primary" onClick={uploadFile}>
        choose file to preview
      </r-button>
    </div>
  );
};
\`\`\`

\`jsx\`在\`TypeScript\`中定义了所有\`html\`原生组件的类型。\`web component\`类型不在\`jsx\`定义中。需要手动添加。否则会有类型问题，但它实际上是有效的。

\`\`\`ts
// typings.d.ts
interface RButton {
  type?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

interface RPreview {
  src?: string | Blob | ArrayBuffer;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  ref?: React.MutableRefObject<HTMLDivElement | null>;
}

declare namespace JSX {
  interface IntrinsicElements {
    'r-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RPreview;
    'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & RButton;
  }
}
\`\`\`

## Import 导入方式

支持按需引入

\`\`\`js
import 'ranui/button';
\`\`\`

对于一些全局展示的组件，比如 \`preview\` 和 \`message\`，需要加载一些额外的样式

\`\`\`js
import 'ranui/preview';
import 'ranui/style';
\`\`\`

也可以全局导入，更加方便，这样什么都不用考虑了，梭哈完事。

- \`ES module\`

\`\`\`js
import 'ranui';
\`\`\`

- \`UMD\`, \`IIFE\`, \`CJS\`

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>
\`\`\`

## Overview 组件总览

- \`Button\`

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary">主要按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="warning">警告按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button type="text">文本按钮</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button >默认按钮</r-button>
</div>

- \`Icon\`

<div style='display:flex'>
     <r-icon name="lock" size="50" ></r-icon>
     <r-icon name="user" size="50" ></r-icon>
     <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
</div>

- \`Skeleton\`

<div style="width: 100px;margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="margin-top:10px">
    <r-skeleton ></r-skeleton>
</div>
<div style="width: 200px;margin-top:10px;margin-bottom: 12px;">
    <r-skeleton ></r-skeleton>
</div>

- \`Input\`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input label="user"></r-input>
</div>

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
     <r-input icon="lock" type="password"></r-input>
</div>

- \`message\`

<r-button onclick="message.info('这是一条提示')">信息提示</r-button>
<r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
<r-button onclick="message.error('这是一条提示')">错误提示</r-button>
<r-button onclick="message.success('这是一条提示')">成功提示</r-button>
<r-button onclick="message.toast('这是一条提示')">toast 提示</r-button>

- \`Tab\`

<div style="display:block;margin-right: 8px;margin-bottom: 12px;">
   <r-tabs>
      <r-tab label="home" icon="home">tab1</r-tab>
      <r-tab label="message" icon="message">tab2</r-tab>
      <r-tab label="user" icon="user">tab3</r-tab>
   </r-tabs>
</div>

- \`Radar\`

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

- \`Progress\`

<r-progress type="drag" ></r-progress>

- \`Player\`

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

- \`Select\`

<r-select style="width: 120px; height: 40px" action="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

## Event 事件

- \`react\`

[@ranui/react](https://www.npmjs.com/package/@ranui/react) 是由\`react\`高阶函数封装[ranui](https://www.npmjs.com/package/ranui)而成，\`Event\` 事件遵循\`react\`事件规范。跟\`W3C\`标准略有不同。

- 现代\`web\`标准

在\`W3C\`标准中，你可以使用\`on\`属性在\`HTML\`元素上定义事件处理程序。但这是旧的事件处理程序的方法。

现代的\`web\`开发推荐使用\`addEventListener\`方法。

\`\`\`html
<r-button id="button">按钮</r-button>

<script>
  const button = document.getElementById('button');
  button.addEventListener('click', function (event) {
    alert('新的点击事件！');
  });
<\/script>
\`\`\`

然而，如果你确实需要使用\`on\`属性，下面是一个示例：

\`\`\`html
<r-input onchange="change(this.value)"></r-input>

<script>
  function change(e) {
    console.log('e`,title:"ranui",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                             |
| `,title:"ranutsoverview",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

Global display of operation feedback.

## Code demo

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" onclick="message.info('This is a hint')">Click to trigger the global prompt</r-button>
</div>

\`\`\`xml
<r-button type="primary" onclick="message.info('This is a hint')">Click to trigger the global prompt</r-button>
\`\`\`

## Attribute

### \`type\`

Different prompt types

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info('This is a hint')">Information prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button  onclick="message.error('This is a hint')">Error prompt</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.success('This is a hint')">Success tip</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.toast('This is a hint')">toast tip</r-button>
</div>

\`\`\`html
<r-button onclick="message.info('This is a hint')">Information prompt</r-button>
<r-button onclick="message.warning('This is a hint')">Warning prompt</r-button>
<r-button onclick="message.error('This is a hint')">Error prompt</r-button>
<r-button onclick="message.success('This is a hint')">Success tip</r-button>
<r-button onclick="message.toast('This is a hint')">toast tip</r-button>
\`\`\`

## Method

The component provides a number of static methods, using the following methods and parameters:

1. You can pass only one parameter, prompt the content, the default prompt 3000 milliseconds

\`message.info('This is a hint')\`

\`message.warning('This is a hint')\`

\`message.error('This is a hint')\`

\`message.success('This is a hint')\`

\`message.toast('This is a hint')"\`

2. You can also pass an object, set the prompt content, turn off the delay, and trigger the callback function when you close it

\`message.info({content:'This is a hint', duration: 2000, close: () => {}})\`

\`message.warning({content:'This is a hint', duration: 2000, close: () => {}})\`

\`message.error({content:'This is a hint', duration: 2000, close: () => {}})\`

\`message.success({content:'This is a hint', duration: 2000, close: () => {}})\`

\`message.toast({content:'This is a hint', duration: 2000, close: () => {}})\`

| 参数     | 说明                                                       | 类型         |
| `,title:"message",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

Video player

Based on 'hlsjs' and' web components', let the native tag 'r-player' have a unified video control.
Do not use the 'new Player(options)' way to mount to the specified 'dom', view return view, logic return logic, see and get, more intuitive.

1. Drag and drop the progress bar
2. Volume control
3. The bitrate is automatically switched based on the current bandwidth
4. Manual definition switch
5. Play at double speed
6. Style custom overlay
7. 'hls' protocol standard encryption video playback
8. Based on native development, it can run in all frameworks and unify the cross-framework situation
9. Unified browser controls

## Code demo

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

\`\`\`xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
\`\`\`

## Attribute

### src

Resource address of the video

### volume

Set the initial volume. The default is 0.5

### currentTime

Set the initial playback time. By default, the playback starts from the beginning

### playbackRate

Set the double speed. The default is 1.0

## \`event\`

### onchange

Listen for any player changes, and the value returned is as follows.

An 'instance of the player' can be obtained through this method.

Live by 'type' to judge different event types, perform different operations

| property    | explains that                           | is of type |
| `,title:"r-player",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

Interactive progress bar

## Code demo

<r-progress type="drag" ></r-progress>

\`\`\`xml
<r-progress type="drag" ></r-progress>
\`\`\`

## Attribute

### \`total\`

Set progress bar Total progress, allowed percentages and numbers.

<r-progress percent="30" total="1000"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress percent="70" total="100"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress percent="10%" total="100%"></r-progress>

\`\`\`html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
\`\`\`

### \`percent\`

Set the current progress of the progress bar, you can set the percentage and number, 'percent' cannot exceed 'total'. If 'total' is not set, the default 'total' is' 100% ', that is, '1'.

<r-progress type="primary" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="70%"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="100%"></r-progress>

\`\`\`html
<r-progress type="primary" percent="30%"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
<r-progress type="primary" percent="100%"></r-progress>
\`\`\`

### \`dot\`

Point of the progress bar, Default display, set to 'false' can be hidden

<r-progress type="drag" percent="30%" dot="false"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" ></r-progress>

\`\`\`html
<r-progress type="drag" percent="30%" dot="false"></r-progress>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
\`\`\`

### \`type\`

- \`primary\`: Default progress bar, not setting the 'type' attribute is the default
- \`drag\`: Draggable, clickable progress bar (dragging requires' dot 'to be' true ')

<r-progress type="drag" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%"></r-progress>

\`\`\`html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
\`\`\`

## Method

### \`change\`

The 'change' event is triggered when the 'percent' and 'total' properties change.

| property | explains that    | type               |
| `,title:"progress",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

Comprehensive comparison of differences between multiple sets of data in two-dimensional form, often used to compare 2 or more sets of data

## Code demo

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>

\`\`\`xml
<r-radar
abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
\`\`\`

## Attribute

### \`abilitys\`

Data that needs to be presented

An array object with the following properties

| key             | Description                                            | type                                          |
| `,title:"Radar",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2023-12-21 07:26:43"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

全局展示操作反馈信息。

## 代码演示

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
</div>

\`\`\`xml
<r-button type="primary" onclick="message.info('这是一条提示')">点击触发全局提示</r-button>
\`\`\`

## 属性

### 类型\`type\`

不同的提示类型

<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.info('这是一条提示')">信息提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
    <r-button  onclick="message.error('这是一条提示')">错误提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.success('这是一条提示')">成功提示</r-button>
</div>
<div style="display:inline-block;margin-right: 8px;margin-bottom: 12px;">
     <r-button  onclick="message.toast('这是一条提示')">toast提示</r-button>
</div>

\`\`\`html
<r-button onclick="message.info('这是一条提示')">信息提示</r-button>
<r-button onclick="message.warning('这是一条提示')">警告提示</r-button>
<r-button onclick="message.error('这是一条提示')">错误提示</r-button>
<r-button onclick="message.success('这是一条提示')">成功提示</r-button>
<r-button onclick="message.toast('这是一条提示')">toast提示</r-button>
\`\`\`

## 方法

组件提供了一些静态方法，使用方式和参数如下：

1. 可以只传一个参数，提示的内容，默认提示 3000 毫秒

\`message.info('这是一条提示')\`

\`message.warning('这是一条提示')\`

\`message.error('这是一条提示')\`

\`message.success('这是一条提示')\`

\`message.toast('这是一条提示')"\`

2. 也可以传一个对象，设置提示内容，关闭延时，关闭时触发的回调函数

\`message.info({content:'这是一条提示', duration: 2000, close: () => {}})\`

\`message.warning({content:'这是一条提示', duration: 2000, close: () => {}})\`

\`message.error({content:'这是一条提示', duration: 2000, close: () => {}})\`

\`message.success({content:'这是一条提示', duration: 2000, close: () => {}})\`

\`message.toast({content:'这是一条提示', duration: 2000, close: () => {}})\`

| 参数     | 说明                                     | 类型         |
| `,title:"message全局提示",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

基于\`hlsjs\`和\`web components\`，让原生的标签\`r-player\`拥有统一的视频控件。
不采用\`new Player(options)\`的方式挂载到指定\`dom\`，视图的归视图，逻辑的归逻辑，所见及所得，更加直观。

1. 可拖拽进度条
2. 音量控制
3. 根据当前带宽自适应码率切换
4. 手动清晰度切换
5. 倍速播放
6. 样式自定义覆盖
7. \`hls\`协议标准加密视频播放
8. 基于原生开发，可在所有框架运行，统一跨框架情况
9. 各浏览器控件统一

## 代码演示

<r-player style="display: block;width:100%;max-width:600px;height:300px;" src="/ran/hls/example.m3u8"></r-player>

\`\`\`xml
  <r-player src="/ran/hls/example.m3u8"></r-player>
\`\`\`

## 属性

### src

视频的资源地址

### volume

设置初始音量，默认 0.5

### currentTime

设置初始播放时间，默认从头开始播放

### playbackRate

设置倍速，默认 1.0

## 事件\`event\`

### onchange

监听任何播放器发生的变化，返回的值如下。

可通过这个方法获得\`播放器的实例\`。

活着通过\`type\`判断不同的事件类型，进行不同的操作

| 属性        | 说明               | 类型      |
| `,title:"r-player视频播放器",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

可交互的进度条

## 代码演示

<r-progress type="drag" ></r-progress>

\`\`\`xml
<r-progress type="drag" ></r-progress>
\`\`\`

## 属性

### 总进度\`total\`

设置进度条总进度，允许百分比和数字。

<r-progress percent="30" total="1000"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress percent="70" total="100"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress percent="10%" total="100%"></r-progress>

\`\`\`html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
\`\`\`

### 当前进度\`percent\`

设置进度条的当前进度，可以设置百分比和数字，\`percent\`不能超过\`total\`。如果不设置\`total\`，默认\`total\`为\`100%\`也就是\`1\`。

<r-progress type="primary" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="70%"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="100%"></r-progress>

\`\`\`html
<r-progress type="primary" percent="30%"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
<r-progress type="primary" percent="100%"></r-progress>
\`\`\`

### 进度条的点\`dot\`

默认展示，设置成\`false\`可隐藏

<r-progress type="drag" percent="30%" dot="false"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%" ></r-progress>

\`\`\`html
<r-progress type="drag" percent="30%" dot="false"></r-progress>
<r-progress type="primary" percent="40%" dot="true"></r-progress>
<r-progress type="primary" percent="40%"></r-progress>
\`\`\`

### 类型\`type\`

- \`primary\`: 默认的进度条，不设置\`type\`属性是默认
- \`drag\`: 可拖动，可点击的进度条（拖动需要设置\`dot\`为\`true\`）

<r-progress type="drag" percent="30%"></r-progress>

<div style="height:20px;width:10px"></div>
<r-progress type="primary" percent="40%"></r-progress>

\`\`\`html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
\`\`\`

## 方法

### \`change\`

当\`percent\`和\`total\`属性发生变化时，触发\`change\`事件。

| 属性    | 说明     | 类型             |
| `,title:"progress进度条",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

以二维形式综合对比多组数据的差异,常用于比较 2 组或更多组数据集

## 代码演示

<r-radar style="width:300px;height:300px;display: block;" abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'></r-radar>

\`\`\`xml
<r-radar
    abilitys='[{"abilityName":"生命","scoreRate":"10"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]'
    style="width:300px;height:300px;display: block;"
>
</r-radar>
\`\`\`

## 属性

### 需要展示的数据\`abilitys\`

一个数组对象，对象中属性如下

| 参数            | 说明                     | 类型             |
| `,title:"Radar雷达图",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2023-12-21 07:26:43"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2023-12-21 07:26:43"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2023-12-21 07:26:43"}}]),fc={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(n){return n.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共: {{searchResult}} 条结果",showDate:!1}}};function gc(n,e="yyyy-MM-dd hh:mm:ss"){n instanceof Date||(n=new Date(n));const t={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,`${n.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in t)new RegExp(`(${r})`).test(e)&&(e=e.replace(RegExp.$1,RegExp.$1.length===1?t[r]:`00${t[r]}`.substr(`${t[r]}`.length)));return e}const bc={},yc={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},_c=Kt('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),kc=[_c];function wc(n,e){return l(),p("svg",yc,kc)}const $c=M(bc,[["render",wc]]),Mt=n=>(se("data-v-854e6cfa"),n=n(),ae(),n),xc={class:"blog-search","data-pagefind-ignore":"all"},Mc=Mt(()=>d("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[d("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})],-1)),Sc={key:0,class:"search-tip"},Cc={key:1,class:"metaKey"},Lc={class:"search-dialog"},Pc={class:"link"},Ic={class:"title"},Tc={key:0,class:"date"},Vc=["innerHTML"],Ac={class:"command-palette-logo"},Ec={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Rc=Mt(()=>d("span",{class:"command-palette-Label"},"Search by",-1)),Nc=Mt(()=>d("ul",{class:"command-palette-commands"},[d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),d("span",{class:"command-palette-Label"},"to select")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),d("span",{class:"command-palette-Label"},"to navigate")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),d("span",{class:"command-palette-Label"},"to close")])],-1)),Hc=w({__name:"Search",setup(n){Bn(C=>({"50e246a8":h.value}));const e=T([]),t=fc,{localeIndex:r,site:s}=Xe(),a=S(()=>{var C;return{...t,...((C=t==null?void 0:t.locales)==null?void 0:C[r.value])||{}}}),o=S(()=>{var C;return((C=a.value)==null?void 0:C.showDate)??!0}),c=vc(),i=S(()=>c.width.value<760),h=S(()=>i.value?0:1),v=S(()=>{var C;return(C=a.value)!=null&&C.heading?a.value.heading.replace(/\{\{searchResult\}\}/,e.value.length):`Total: ${e.value.length} search results.`}),y=T("");ue(()=>{y.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const _=T(!1),$=T(""),P=cc({passive:!1,onEventFired(C){C.ctrlKey&&C.key==="k"&&C.type==="keydown"&&C.preventDefault()}}),b=P["Meta+K"],g=P["Ctrl+K"],R=P.Escape;q(b,C=>{C&&(_.value=!0)}),q(g,C=>{C&&(_.value=!0)}),q(R,C=>{C&&(_.value=!1)});function F(){if(!$.value){e.value=[];return}e.value=Ut.value.filter(C=>`${C.meta.description}${C.meta.title}`.includes($.value)).map(C=>{var B,K;return{...C,meta:{...C.meta,description:((K=(B=C.meta)==null?void 0:B.description)==null?void 0:K.replace(new RegExp(`(${$.value})`,"g"),"<mark>$1</mark>"))||""}}}),e.value.sort((C,B)=>+new Date(B.meta.date)-+new Date(C.meta.date))}const N=S(()=>{var C;return((C=a.value)==null?void 0:C.resultOptimization)??!0});q(()=>$.value,async()=>{var C,B,K;if(!((C=window==null?void 0:window.__pagefind__)!=null&&C.search))F();else{const U=typeof a.value.customSearchQuery=="function"?a.value.customSearchQuery($.value):$.value;await((K=(B=window==null?void 0:window.__pagefind__)==null?void 0:B.search)==null?void 0:K.call(B,U).then(async $e=>{const Ke=(await Promise.all($e.results.map(te=>te.data()))).map(te=>{var ve;return{route:te.url.startsWith(s.value.base)?te.url:We(te.url),meta:{title:te.meta.title,description:te.excerpt,date:(ve=te==null?void 0:te.meta)==null?void 0:ve.date}}}).filter(te=>!N.value||Ut.value.some(ve=>ve.route===te.route));e.value=Ke.filter(a.value.filter??(()=>!0))}))}le(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(U=>{U.setAttribute("aria-disabled","false")})})});function z(C){C.target===C.currentTarget&&(_.value=!1)}q(()=>_.value,C=>{var B;C?le(()=>{var K;(K=document.querySelector("div[command-dialog-mask]"))==null||K.addEventListener("click",z)}):(B=document.querySelector("div[command-dialog-mask]"))==null||B.removeEventListener("click",z)});const G=T(999),Y=T(0),J=S(()=>{const B=Y.value%Math.ceil(e.value.length/G.value)*G.value;return e.value.slice(B,B+G.value)}),X=On(),Q=Ve();function we(C){_.value=!1,Q.path!==C.value&&X.go(C.value)}const{lang:ie}=Xe(),ne=S(()=>a.value.langReload??!0);return q(()=>ie.value,()=>{ne.value&&window.location.reload()}),(C,B)=>{var K;return l(),p("div",xc,[d("div",{class:"nav-search-btn-wait",onClick:B[0]||(B[0]=U=>_.value=!0)},[Mc,i.value?x("",!0):(l(),p("span",Sc,A(((K=a.value)==null?void 0:K.btnPlaceholder)||"Search"),1)),i.value?x("",!0):(l(),p("span",Cc,A(y.value)+" K ",1))]),k(u(xe).Dialog,{visible:_.value,theme:"algolia"},Fn({header:f(()=>{var U;return[k(u(xe).Input,{value:$.value,"onUpdate:value":B[1]||(B[1]=$e=>$.value=$e),placeholder:((U=a.value)==null?void 0:U.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:f(()=>[d("div",Lc,[k(u(xe).List,null,{default:f(()=>[e.value.length?(l(),I(u(xe).Group,{key:1,heading:v.value},{default:f(()=>[(l(!0),p(j,null,Z(J.value,U=>(l(),I(u(xe).Item,{key:U.route,"data-value":U.route,onSelect:we},{default:f(()=>[d("div",Pc,[d("div",Ic,[d("span",null,A(U.meta.title),1),o.value&&U.meta.date?(l(),p("span",Tc,A(u(gc)(U.meta.date,"yyyy-MM-dd")),1)):x("",!0)]),d("div",{class:"des",innerHTML:U.meta.description},null,8,Vc)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(l(),I(u(xe).Empty,{key:0},{default:f(()=>{var U;return[ee(A(((U=a.value)==null?void 0:U.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[e.value.length?{name:"footer",fn:f(()=>[d("div",Ac,[d("a",Ec,[Rc,k($c,{style:{width:"77px"}})])]),Nc]),key:"0"}:void 0]),1032,["visible"])])}}}),Bc=M(Hc,[["__scopeId","data-v-854e6cfa"]]),Oc=w({__name:"VPNavBarSocialLinks",setup(n){const{theme:e}=E();return(t,r)=>u(e).socialLinks?(l(),I(wt,{key:0,class:"VPNavBarSocialLinks",links:u(e).socialLinks},null,8,["links"])):x("",!0)}}),Fc=M(Oc,[["__scopeId","data-v-03cd42a8"]]),Dc=["href"],jc=w({__name:"VPNavBarTitle",setup(n){const{site:e,theme:t}=E(),{hasSidebar:r}=de(),{currentLang:s}=Ae();return(a,o)=>(l(),p("div",{class:O(["VPNavBarTitle",{"has-sidebar":u(r)}])},[d("a",{class:"title",href:u(t).logoLink??u(Te)(u(s).link)},[m(a.$slots,"nav-bar-title-before",{},void 0,!0),u(t).logo?(l(),I(De,{key:0,class:"logo",image:u(t).logo},null,8,["image"])):x("",!0),u(t).siteTitle?(l(),p(j,{key:1},[ee(A(u(t).siteTitle),1)],64)):u(t).siteTitle===void 0?(l(),p(j,{key:2},[ee(A(u(e).title),1)],64)):x("",!0),m(a.$slots,"nav-bar-title-after",{},void 0,!0)],8,Dc)],2))}}),zc=M(jc,[["__scopeId","data-v-c0726ded"]]),Wc={},Uc={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},Gc=d("path",{d:"M0 0h24v24H0z",fill:"none"},null,-1),qc=d("path",{d:" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z ",class:"css-c4d79v"},null,-1),Qc=[Gc,qc];function Kc(n,e){return l(),p("svg",Uc,Qc)}const xn=M(Wc,[["render",Kc]]),Jc={class:"items"},Zc={class:"title"},Yc=w({__name:"VPNavBarTranslations",setup(n){const{theme:e}=E(),{localeLinks:t,currentLang:r}=Ae({correspondingLink:!0});return(s,a)=>u(t).length&&u(r).label?(l(),I(kt,{key:0,class:"VPNavBarTranslations",icon:xn,label:u(e).langMenuLabel||"Change language"},{default:f(()=>[d("div",Jc,[d("p",Zc,A(u(r).label),1),(l(!0),p(j,null,Z(u(t),o=>(l(),I(Ge,{key:o.link,item:o},null,8,["item"]))),128))])]),_:1},8,["label"])):x("",!0)}}),Xc=M(Yc,[["__scopeId","data-v-e58525ff"]]),eu=n=>(se("data-v-fd219fc5"),n=n(),ae(),n),tu={class:"container"},nu={class:"title"},ru={class:"content"},su=eu(()=>d("div",{class:"curtain"},null,-1)),au={class:"content-body"},ou=w({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(n){const{y:e}=Qt(),{hasSidebar:t}=de(),{frontmatter:r}=E(),s=T({});return Gt(()=>{s.value={"has-sidebar":t.value,top:r.value.layout==="home"&&e.value===0}}),(a,o)=>(l(),p("div",{class:O(["VPNavBar",s.value])},[d("div",tu,[d("div",nu,[k(zc,null,{"nav-bar-title-before":f(()=>[m(a.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":f(()=>[m(a.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),d("div",ru,[su,d("div",au,[m(a.$slots,"nav-bar-content-before",{},void 0,!0),k(Bc,{class:"search"}),k(_i,{class:"menu"}),k(Xc,{class:"translations"}),k(po,{class:"appearance"}),k(Fc,{class:"social-links"}),k(ai,{class:"extra"}),m(a.$slots,"nav-bar-content-after",{},void 0,!0),k(di,{class:"hamburger",active:a.isScreenOpen,onClick:o[0]||(o[0]=c=>a.$emit("toggle-screen"))},null,8,["active"])])])])],2))}}),iu=M(ou,[["__scopeId","data-v-fd219fc5"]]),lu={key:0,class:"VPNavScreenAppearance"},cu={class:"text"},uu=w({__name:"VPNavScreenAppearance",setup(n){const{site:e,theme:t}=E();return(r,s)=>u(e).appearance&&u(e).appearance!=="force-dark"?(l(),p("div",lu,[d("p",cu,A(u(t).darkModeSwitchLabel||"Appearance"),1),k(yt)])):x("",!0)}}),du=M(uu,[["__scopeId","data-v-69c5b7fe"]]),pu=w({__name:"VPNavScreenMenuLink",props:{item:{}},setup(n){const e=Ue("close-screen");return(t,r)=>(l(),I(he,{class:"VPNavScreenMenuLink",href:t.item.link,target:t.item.target,rel:t.item.rel,onClick:u(e)},{default:f(()=>[ee(A(t.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),hu=M(pu,[["__scopeId","data-v-a1e8fd4e"]]),mu={},vu={xmlns:"http://www.w3.org/2000/svg","aria-hidden":"true",focusable:"false",viewBox:"0 0 24 24"},fu=d("path",{d:"M18.9,10.9h-6v-6c0-0.6-0.4-1-1-1s-1,0.4-1,1v6h-6c-0.6,0-1,0.4-1,1s0.4,1,1,1h6v6c0,0.6,0.4,1,1,1s1-0.4,1-1v-6h6c0.6,0,1-0.4,1-1S19.5,10.9,18.9,10.9z"},null,-1),gu=[fu];function bu(n,e){return l(),p("svg",vu,gu)}const yu=M(mu,[["render",bu]]),_u=w({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(n){const e=Ue("close-screen");return(t,r)=>(l(),I(he,{class:"VPNavScreenMenuGroupLink",href:t.item.link,target:t.item.target,rel:t.item.rel,onClick:u(e)},{default:f(()=>[ee(A(t.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Mn=M(_u,[["__scopeId","data-v-4049ef57"]]),ku={class:"VPNavScreenMenuGroupSection"},wu={key:0,class:"title"},$u=w({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(n){return(e,t)=>(l(),p("div",ku,[e.text?(l(),p("p",wu,A(e.text),1)):x("",!0),(l(!0),p(j,null,Z(e.items,r=>(l(),I(Mn,{key:r.text,item:r},null,8,["item"]))),128))]))}}),xu=M($u,[["__scopeId","data-v-3f1551cb"]]),Mu=["aria-controls","aria-expanded"],Su=["innerHTML"],Cu=["id"],Lu={key:1,class:"group"},Pu=w({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(n){const e=n,t=T(!1),r=S(()=>`NavScreenGroup-${e.text.replace(" ","-").toLowerCase()}`);function s(){t.value=!t.value}return(a,o)=>(l(),p("div",{class:O(["VPNavScreenMenuGroup",{open:t.value}])},[d("button",{class:"button","aria-controls":r.value,"aria-expanded":t.value,onClick:s},[d("span",{class:"button-text",innerHTML:a.text},null,8,Su),k(yu,{class:"button-icon"})],8,Mu),d("div",{id:r.value,class:"items"},[(l(!0),p(j,null,Z(a.items,c=>(l(),p(j,{key:c.text},["link"in c?(l(),p("div",{key:c.text,class:"item"},[k(Mn,{item:c},null,8,["item"])])):(l(),p("div",Lu,[k(xu,{text:c.text,items:c.items},null,8,["text","items"])]))],64))),128))],8,Cu)],2))}}),Iu=M(Pu,[["__scopeId","data-v-e1604314"]]),Tu={key:0,class:"VPNavScreenMenu"},Vu=w({__name:"VPNavScreenMenu",setup(n){const{theme:e}=E();return(t,r)=>u(e).nav?(l(),p("nav",Tu,[(l(!0),p(j,null,Z(u(e).nav,s=>(l(),p(j,{key:s.text},["link"in s?(l(),I(hu,{key:0,item:s},null,8,["item"])):(l(),I(Iu,{key:1,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):x("",!0)}}),Au=w({__name:"VPNavScreenSocialLinks",setup(n){const{theme:e}=E();return(t,r)=>u(e).socialLinks?(l(),I(wt,{key:0,class:"VPNavScreenSocialLinks",links:u(e).socialLinks},null,8,["links"])):x("",!0)}}),Eu={class:"list"},Ru=w({__name:"VPNavScreenTranslations",setup(n){const{localeLinks:e,currentLang:t}=Ae({correspondingLink:!0}),r=T(!1);function s(){r.value=!r.value}return(a,o)=>u(e).length&&u(t).label?(l(),p("div",{key:0,class:O(["VPNavScreenTranslations",{open:r.value}])},[d("button",{class:"title",onClick:s},[k(xn,{class:"icon lang"}),ee(" "+A(u(t).label)+" ",1),k(an,{class:"icon chevron"})]),d("ul",Eu,[(l(!0),p(j,null,Z(u(e),c=>(l(),p("li",{key:c.link,class:"item"},[k(he,{class:"link",href:c.link},{default:f(()=>[ee(A(c.text),1)]),_:2},1032,["href"])]))),128))])],2)):x("",!0)}}),Nu=M(Ru,[["__scopeId","data-v-67456f92"]]),Hu={class:"container"},Bu=w({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(n){const e=T(null),t=en(Se?document.body:null);return(r,s)=>(l(),I(ze,{name:"fade",onEnter:s[0]||(s[0]=a=>t.value=!0),onAfterLeave:s[1]||(s[1]=a=>t.value=!1)},{default:f(()=>[r.open?(l(),p("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:e,id:"VPNavScreen"},[d("div",Hu,[m(r.$slots,"nav-screen-content-before",{},void 0,!0),k(Vu,{class:"menu"}),k(Nu,{class:"translations"}),k(du,{class:"appearance"}),k(Au,{class:"social-links"}),m(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):x("",!0)]),_:3}))}}),Ou=M(Bu,[["__scopeId","data-v-be6b5d03"]]),Fu={key:0,class:"VPNav"},Du=w({__name:"VPNav",setup(n){const{isScreenOpen:e,closeScreen:t,toggleScreen:r}=za(),{frontmatter:s}=E(),a=S(()=>s.value.navbar!==!1);return ht("close-screen",t),_e(()=>{Se&&document.documentElement.classList.toggle("hide-nav",!a.value)}),(o,c)=>a.value?(l(),p("header",Fu,[k(iu,{"is-screen-open":u(e),onToggleScreen:u(r)},{"nav-bar-title-before":f(()=>[m(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":f(()=>[m(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":f(()=>[m(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":f(()=>[m(o.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),k(Ou,{open:u(e)},{"nav-screen-content-before":f(()=>[m(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":f(()=>[m(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):x("",!0)}}),ju=M(Du,[["__scopeId","data-v-2b9c1d3c"]]),zu=n=>(se("data-v-5bc94d82"),n=n(),ae(),n),Wu=["role","tabindex"],Uu=zu(()=>d("div",{class:"indicator"},null,-1)),Gu={key:1,class:"items"},qu=w({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(n){const e=n,{collapsed:t,collapsible:r,isLink:s,isActiveLink:a,hasActiveLink:o,hasChildren:c,toggle:i}=dr(S(()=>e.item)),h=S(()=>c.value?"section":"div"),v=S(()=>s.value?"a":"div"),y=S(()=>c.value?e.depth+2===7?"p":`h${e.depth+2}`:"p"),_=S(()=>s.value?void 0:"button"),$=S(()=>[[`level-${e.depth}`],{collapsible:r.value},{collapsed:t.value},{"is-link":s.value},{"is-active":a.value},{"has-active":o.value}]);function P(g){"key"in g&&g.key!=="Enter"||!e.item.link&&i()}function b(){e.item.link&&i()}return(g,R)=>{const F=ke("VPSidebarItem",!0);return l(),I(ge(h.value),{class:O(["VPSidebarItem",$.value])},{default:f(()=>[g.item.text?(l(),p("div",He({key:0,class:"item",role:_.value},Dn(g.item.items?{click:P,keydown:P}:{},!0),{tabindex:g.item.items&&0}),[Uu,g.item.link?(l(),I(he,{key:0,tag:v.value,class:"link",href:g.item.link,rel:g.item.rel,target:g.item.target},{default:f(()=>[(l(),I(ge(y.value),{class:"text",innerHTML:g.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(l(),I(ge(y.value),{key:1,class:"text",innerHTML:g.item.text},null,8,["innerHTML"])),g.item.collapsed!=null?(l(),p("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:b,onKeydown:jn(b,["enter"]),tabindex:"0"},[k(bt,{class:"caret-icon"})],32)):x("",!0)],16,Wu)):x("",!0),g.item.items&&g.item.items.length?(l(),p("div",Gu,[g.depth<5?(l(!0),p(j,{key:0},Z(g.item.items,N=>(l(),I(F,{key:N.text,item:N,depth:g.depth+1},null,8,["item","depth"]))),128)):x("",!0)])):x("",!0)]),_:1},8,["class"])}}}),Qu=M(qu,[["__scopeId","data-v-5bc94d82"]]),Sn=n=>(se("data-v-32c9a66e"),n=n(),ae(),n),Ku=Sn(()=>d("div",{class:"curtain"},null,-1)),Ju={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},Zu=Sn(()=>d("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),Yu=w({__name:"VPSidebar",props:{open:{type:Boolean}},setup(n){const{sidebarGroups:e,hasSidebar:t}=de(),r=n,s=T(null),a=en(Se?document.body:null);return q([r,s],()=>{var o;r.open?(a.value=!0,(o=s.value)==null||o.focus()):a.value=!1},{immediate:!0,flush:"post"}),(o,c)=>u(t)?(l(),p("aside",{key:0,class:O(["VPSidebar",{open:o.open}]),ref_key:"navEl",ref:s,onClick:c[0]||(c[0]=zn(()=>{},["stop"]))},[Ku,d("nav",Ju,[Zu,m(o.$slots,"sidebar-nav-before",{},void 0,!0),(l(!0),p(j,null,Z(u(e),i=>(l(),p("div",{key:i.text,class:"group"},[k(Qu,{item:i,depth:0},null,8,["item"])]))),128)),m(o.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):x("",!0)}}),Xu=M(Yu,[["__scopeId","data-v-32c9a66e"]]),ed=w({__name:"VPSkipLink",setup(n){const e=Ve(),t=T();q(()=>e.path,()=>t.value.focus());function r({target:s}){const a=document.getElementById(decodeURIComponent(s.hash).slice(1));if(a){const o=()=>{a.removeAttribute("tabindex"),a.removeEventListener("blur",o)};a.setAttribute("tabindex","-1"),a.addEventListener("blur",o),a.focus(),window.scrollTo(0,0)}}return(s,a)=>(l(),p(j,null,[d("span",{ref_key:"backToTop",ref:t,tabindex:"-1"},null,512),d("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),td=M(ed,[["__scopeId","data-v-169c7c16"]]),nd=w({__name:"Layout",setup(n){const{isOpen:e,open:t,close:r}=de(),s=Ve();q(()=>s.path,r),ur(e,r);const{frontmatter:a}=E(),o=Wn(),c=S(()=>!!o["home-hero-image"]);return ht("hero-image-slot-exists",c),(i,h)=>{const v=ke("Content");return u(a).layout!==!1?(l(),p("div",{key:0,class:O(["Layout",u(a).pageClass])},[m(i.$slots,"layout-top",{},void 0,!0),k(td),k(Kn,{class:"backdrop",show:u(e),onClick:u(r)},null,8,["show","onClick"]),k(ju,null,{"nav-bar-title-before":f(()=>[m(i.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":f(()=>[m(i.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":f(()=>[m(i.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":f(()=>[m(i.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":f(()=>[m(i.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":f(()=>[m(i.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),k(ja,{open:u(e),onOpenMenu:u(t)},null,8,["open","onOpenMenu"]),k(Xu,{open:u(e)},{"sidebar-nav-before":f(()=>[m(i.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":f(()=>[m(i.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),k(_a,{"data-pagefind-body":""},{"page-top":f(()=>[m(i.$slots,"page-top",{},void 0,!0)]),"page-bottom":f(()=>[m(i.$slots,"page-bottom",{},void 0,!0)]),"not-found":f(()=>[m(i.$slots,"not-found",{},void 0,!0)]),"home-hero-before":f(()=>[m(i.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info":f(()=>[m(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-image":f(()=>[m(i.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":f(()=>[m(i.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":f(()=>[m(i.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":f(()=>[m(i.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":f(()=>[m(i.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":f(()=>[m(i.$slots,"doc-before",{},void 0,!0)]),"doc-after":f(()=>[m(i.$slots,"doc-after",{},void 0,!0)]),"doc-top":f(()=>[m(i.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":f(()=>[m(i.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":f(()=>[m(i.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":f(()=>[m(i.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":f(()=>[m(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":f(()=>[m(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":f(()=>[m(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":f(()=>[m(i.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),k(Ma),m(i.$slots,"layout-bottom",{},void 0,!0)],2)):(l(),I(v,{key:1}))}}}),rd=M(nd,[["__scopeId","data-v-7f978dd2"]]),ad={Layout:rd,enhanceApp:({app:n})=>{n.component("Badge",Gn)}};export{ad as t};
