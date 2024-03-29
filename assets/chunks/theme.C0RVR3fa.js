function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/chunks/index.DKC1-TWx.js","assets/chunks/framework.A_XI1Ui1.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{d as k,o as c,c as h,r as p,a as se,t as A,n as F,b as C,w as v,e as S,T as Ue,_ as I,u as nt,i as In,f as Tn,g as ze,h as T,j as xe,k as $,l as he,m as d,p as u,q,s as J,v as ye,x as rt,y as G,z as ke,A as vt,B as Gt,C as En,D as Vn,E as fe,F as D,G as ee,H as qt,I as Ge,J as M,K as Jt,L as Le,M as Te,N as Ne,O as qe,P as An,Q as Qt,R as Rn,S as Nn,U as de,V as Kt,W as Hn,X as Ie,Y as ft,Z as gt,$ as On,a0 as Fe,a1 as Be,a2 as Fn,a3 as je,a4 as Zt,a5 as Yt,a6 as Bn,a7 as jn,a8 as Dn,a9 as Wn,aa as Un,ab as Xt,ac as zn,ad as Gn,ae as qn,af as Jn,ag as Qn}from"./framework.A_XI1Ui1.js";const Kn=k({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(n){return(e,t)=>(c(),h("span",{class:F(["VPBadge",e.type])},[p(e.$slots,"default",{},()=>[se(A(e.text),1)])],2))}}),Zn={key:0,class:"VPBackdrop"},Yn=k({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(n){return(e,t)=>(c(),C(Ue,{name:"fade"},{default:v(()=>[e.show?(c(),h("div",Zn)):S("",!0)]),_:1}))}}),Xn=I(Yn,[["__scopeId","data-v-1f0bc2e2"]]),V=nt;function er(n,e){let t,r=!1;return()=>{t&&clearTimeout(t),r?t=setTimeout(n,e):(n(),(r=!0)&&setTimeout(()=>r=!1,e))}}function at(n){return/^\//.test(n)?n:`/${n}`}function bt(n){const{pathname:e,search:t,hash:r,protocol:a}=new URL(n,"http://a.com");if(In(n)||n.startsWith("#")||!a.startsWith("http")||!Tn(e))return n;const{site:s}=V(),o=e.endsWith("/")||e.endsWith(".html")?n:n.replace(/(?:(^\.+)\/)?.*$/,`$1${e.replace(/(\.md)?$/,s.value.cleanUrls?"":".html")}${t}${r}`);return ze(o)}const yt=T(xe?location.hash:"");xe&&window.addEventListener("hashchange",()=>{yt.value=location.hash});function Ee({removeCurrent:n=!0,correspondingLink:e=!1}={}){const{site:t,localeIndex:r,page:a,theme:s}=V(),o=$(()=>{var i,m;return{label:(i=t.value.locales[r.value])==null?void 0:i.label,link:((m=t.value.locales[r.value])==null?void 0:m.link)||(r.value==="root"?"/":`/${r.value}/`)}});return{localeLinks:$(()=>Object.entries(t.value.locales).flatMap(([i,m])=>n&&o.value.label===m.label?[]:{text:m.label,link:tr(m.link||(i==="root"?"/":`/${i}/`),s.value.i18nRouting!==!1&&e,a.value.relativePath.slice(o.value.link.length-1),!t.value.cleanUrls)+yt.value})),currentLang:o}}function tr(n,e,t,r){return e?n.replace(/\/$/,"")+at(t.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):n}const nr=n=>(q("data-v-1d6e2326"),n=n(),J(),n),rr={class:"NotFound"},ar={class:"code"},sr={class:"title"},or=nr(()=>d("div",{class:"divider"},null,-1)),ir={class:"quote"},lr={class:"action"},cr=["href","aria-label"],ur=k({__name:"NotFound",setup(n){const{site:e,theme:t}=V(),{localeLinks:r}=Ee({removeCurrent:!1}),a=T("/");return he(()=>{var o;const s=window.location.pathname.replace(e.value.base,"").replace(/(^.*?\/).*$/,"/$1");r.value.length&&(a.value=((o=r.value.find(({link:l})=>l.startsWith(s)))==null?void 0:o.link)||r.value[0].link)}),(s,o)=>{var l,i,m,f,y;return c(),h("div",rr,[d("p",ar,A(((l=u(t).notFound)==null?void 0:l.code)??"404"),1),d("h1",sr,A(((i=u(t).notFound)==null?void 0:i.title)??"PAGE NOT FOUND"),1),or,d("blockquote",ir,A(((m=u(t).notFound)==null?void 0:m.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),d("div",lr,[d("a",{class:"link",href:u(ze)(a.value),"aria-label":((f=u(t).notFound)==null?void 0:f.linkLabel)??"go to home"},A(((y=u(t).notFound)==null?void 0:y.linkText)??"Take me home"),9,cr)])])}}}),dr=I(ur,[["__scopeId","data-v-1d6e2326"]]);function en(n,e){if(Array.isArray(n))return He(n);if(n==null)return[];e=at(e);const t=Object.keys(n).sort((a,s)=>s.split("/").length-a.split("/").length).find(a=>e.startsWith(at(a))),r=t?n[t]:[];return Array.isArray(r)?He(r):He(r.items,r.base)}function pr(n){const e=[];let t=0;for(const r in n){const a=n[r];if(a.items){t=e.push(a);continue}e[t]||e.push({items:[]}),e[t].items.push(a)}return e}function hr(n){const e=[];function t(r){for(const a of r)a.text&&a.link&&e.push({text:a.text,link:a.link,docFooterText:a.docFooterText}),a.items&&t(a.items)}return t(n),e}function st(n,e){return Array.isArray(e)?e.some(t=>st(n,t)):ye(n,e.link)?!0:e.items?st(n,e.items):!1}function He(n,e){return[...n].map(t=>{const r={...t},a=r.base||e;return a&&r.link&&(r.link=a+r.link),r.items&&(r.items=He(r.items,a)),r})}function me(){const{frontmatter:n,page:e,theme:t}=V(),r=rt("(min-width: 960px)"),a=T(!1),s=$(()=>{const g=t.value.sidebar,b=e.value.relativePath;return g?en(g,b):[]}),o=T(s.value);G(s,(g,b)=>{JSON.stringify(g)!==JSON.stringify(b)&&(o.value=s.value)});const l=$(()=>n.value.sidebar!==!1&&o.value.length>0&&n.value.layout!=="home"),i=$(()=>m?n.value.aside==null?t.value.aside==="left":n.value.aside==="left":!1),m=$(()=>n.value.layout==="home"?!1:n.value.aside!=null?!!n.value.aside:t.value.aside!==!1),f=$(()=>l.value&&r.value),y=$(()=>l.value?pr(o.value):[]);function _(){a.value=!0}function w(){a.value=!1}function P(){a.value?w():_()}return{isOpen:a,sidebar:o,sidebarGroups:y,hasSidebar:l,hasAside:m,leftAside:i,isSidebarEnabled:f,open:_,close:w,toggle:P}}function mr(n,e){let t;ke(()=>{t=n.value?document.activeElement:void 0}),he(()=>{window.addEventListener("keyup",r)}),vt(()=>{window.removeEventListener("keyup",r)});function r(a){a.key==="Escape"&&n.value&&(e(),t==null||t.focus())}}function vr(n){const{page:e}=V(),t=T(!1),r=$(()=>n.value.collapsed!=null),a=$(()=>!!n.value.link),s=T(!1),o=()=>{s.value=ye(e.value.relativePath,n.value.link)};G([e,n,yt],o),he(o);const l=$(()=>s.value?!0:n.value.items?st(e.value.relativePath,n.value.items):!1),i=$(()=>!!(n.value.items&&n.value.items.length));ke(()=>{t.value=!!(r.value&&n.value.collapsed)}),Gt(()=>{(s.value||l.value)&&(t.value=!1)});function m(){r.value&&(t.value=!t.value)}return{collapsed:t,collapsible:r,isLink:a,isActiveLink:s,hasActiveLink:l,hasChildren:i,toggle:m}}function fr(){const{hasSidebar:n}=me(),e=rt("(min-width: 960px)"),t=rt("(min-width: 1280px)");return{isAsideEnabled:$(()=>!t.value&&!e.value?!1:n.value?t.value:e.value)}}const ot=[];function tn(n){return typeof n.outline=="object"&&!Array.isArray(n.outline)&&n.outline.label||n.outlineTitle||"On this page"}function _t(n){const e=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(t=>t.id&&t.hasChildNodes()).map(t=>{const r=Number(t.tagName[1]);return{element:t,title:gr(t),link:"#"+t.id,level:r}});return br(e,n)}function gr(n){let e="";for(const t of n.childNodes)if(t.nodeType===1){if(t.classList.contains("VPBadge")||t.classList.contains("header-anchor")||t.classList.contains("ignore-header"))continue;e+=t.textContent}else t.nodeType===3&&(e+=t.textContent);return e.trim()}function br(n,e){if(e===!1)return[];const t=(typeof e=="object"&&!Array.isArray(e)?e.level:e)||2,[r,a]=typeof t=="number"?[t,t]:t==="deep"?[2,6]:t;n=n.filter(o=>o.level>=r&&o.level<=a),ot.length=0;for(const{element:o,link:l}of n)ot.push({element:o,link:l});const s=[];e:for(let o=0;o<n.length;o++){const l=n[o];if(o===0)s.push(l);else{for(let i=o-1;i>=0;i--){const m=n[i];if(m.level<l.level){(m.children||(m.children=[])).push(l);continue e}}s.push(l)}}return s}function yr(n,e){const{isAsideEnabled:t}=fr(),r=er(s,100);let a=null;he(()=>{requestAnimationFrame(s),window.addEventListener("scroll",r)}),En(()=>{o(location.hash)}),vt(()=>{window.removeEventListener("scroll",r)});function s(){if(!t.value)return;const l=window.scrollY,i=window.innerHeight,m=document.body.offsetHeight,f=Math.abs(l+i-m)<1,y=ot.map(({element:w,link:P})=>({link:P,top:_r(w)})).filter(({top:w})=>!Number.isNaN(w)).sort((w,P)=>w.top-P.top);if(!y.length){o(null);return}if(l<1){o(null);return}if(f){o(y[y.length-1].link);return}let _=null;for(const{link:w,top:P}of y){if(P>l+Vn()+4)break;_=w}o(_)}function o(l){a&&a.classList.remove("active"),l==null?a=null:a=n.value.querySelector(`a[href="${decodeURIComponent(l)}"]`);const i=a;i?(i.classList.add("active"),e.value.style.top=i.offsetTop+39+"px",e.value.style.opacity="1"):(e.value.style.top="33px",e.value.style.opacity="0")}}function _r(n){let e=0;for(;n!==document.body;){if(n===null)return NaN;e+=n.offsetTop,n=n.offsetParent}return e}const kr=["href","title"],wr=k({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(n){function e({target:t}){const r=t.href.split("#")[1],a=document.getElementById(decodeURIComponent(r));a==null||a.focus({preventScroll:!0})}return(t,r)=>{const a=fe("VPDocOutlineItem",!0);return c(),h("ul",{class:F(["VPDocOutlineItem",t.root?"root":"nested"])},[(c(!0),h(D,null,ee(t.headers,({children:s,link:o,title:l})=>(c(),h("li",null,[d("a",{class:"outline-link",href:o,onClick:e,title:l},A(l),9,kr),s!=null&&s.length?(c(),C(a,{key:0,headers:s},null,8,["headers"])):S("",!0)]))),256))],2)}}}),nn=I(wr,[["__scopeId","data-v-b241817f"]]),$r=n=>(q("data-v-703c4c2a"),n=n(),J(),n),Sr={class:"content"},Lr={class:"outline-title",role:"heading","aria-level":"2"},xr={"aria-labelledby":"doc-outline-aria-label"},Mr=$r(()=>d("span",{class:"visually-hidden",id:"doc-outline-aria-label"}," Table of Contents for current page ",-1)),Pr=k({__name:"VPDocAsideOutline",setup(n){const{frontmatter:e,theme:t}=V(),r=qt([]);Ge(()=>{r.value=_t(e.value.outline??t.value.outline)});const a=T(),s=T();return yr(a,s),(o,l)=>(c(),h("div",{class:F(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:a,role:"navigation"},[d("div",Sr,[d("div",{class:"outline-marker",ref_key:"marker",ref:s},null,512),d("div",Lr,A(u(tn)(u(t))),1),d("nav",xr,[Mr,M(nn,{headers:r.value,root:!0},null,8,["headers"])])])],2))}}),Cr=I(Pr,[["__scopeId","data-v-703c4c2a"]]),Ir={class:"VPDocAsideCarbonAds"},Tr=k({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(n){const e=()=>null;return(t,r)=>(c(),h("div",Ir,[M(u(e),{"carbon-ads":t.carbonAds},null,8,["carbon-ads"])]))}}),Er=n=>(q("data-v-6636b333"),n=n(),J(),n),Vr={class:"VPDocAside"},Ar=Er(()=>d("div",{class:"spacer"},null,-1)),Rr=k({__name:"VPDocAside",setup(n){const{theme:e}=V();return(t,r)=>(c(),h("div",Vr,[p(t.$slots,"aside-top",{},void 0,!0),p(t.$slots,"aside-outline-before",{},void 0,!0),M(Cr),p(t.$slots,"aside-outline-after",{},void 0,!0),Ar,p(t.$slots,"aside-ads-before",{},void 0,!0),u(e).carbonAds?(c(),C(Tr,{key:0,"carbon-ads":u(e).carbonAds},null,8,["carbon-ads"])):S("",!0),p(t.$slots,"aside-ads-after",{},void 0,!0),p(t.$slots,"aside-bottom",{},void 0,!0)]))}}),Nr=I(Rr,[["__scopeId","data-v-6636b333"]]);function Hr(){const{theme:n,page:e}=V();return $(()=>{const{text:t="Edit this page",pattern:r=""}=n.value.editLink||{};let a;return typeof r=="function"?a=r(e.value):a=r.replace(/:path/g,e.value.filePath),{url:a,text:t}})}function Or(){const{page:n,theme:e,frontmatter:t}=V();return $(()=>{var m,f,y,_,w,P,g,b;const r=en(e.value.sidebar,n.value.relativePath),a=hr(r),s=Fr(a,R=>R.link.replace(/[?#].*$/,"")),o=s.findIndex(R=>ye(n.value.relativePath,R.link)),l=((m=e.value.docFooter)==null?void 0:m.prev)===!1&&!t.value.prev||t.value.prev===!1,i=((f=e.value.docFooter)==null?void 0:f.next)===!1&&!t.value.next||t.value.next===!1;return{prev:l?void 0:{text:(typeof t.value.prev=="string"?t.value.prev:typeof t.value.prev=="object"?t.value.prev.text:void 0)??((y=s[o-1])==null?void 0:y.docFooterText)??((_=s[o-1])==null?void 0:_.text),link:(typeof t.value.prev=="object"?t.value.prev.link:void 0)??((w=s[o-1])==null?void 0:w.link)},next:i?void 0:{text:(typeof t.value.next=="string"?t.value.next:typeof t.value.next=="object"?t.value.next.text:void 0)??((P=s[o+1])==null?void 0:P.docFooterText)??((g=s[o+1])==null?void 0:g.text),link:(typeof t.value.next=="object"?t.value.next.link:void 0)??((b=s[o+1])==null?void 0:b.link)}}})}function Fr(n,e){const t=new Set;return n.filter(r=>{const a=e(r);return t.has(a)?!1:t.add(a)})}const le=k({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(n){const e=n,t=$(()=>e.tag??(e.href?"a":"span")),r=$(()=>e.href&&Jt.test(e.href));return(a,s)=>(c(),C(Le(t.value),{class:F(["VPLink",{link:a.href,"vp-external-link-icon":r.value,"no-icon":a.noIcon}]),href:a.href?u(bt)(a.href):void 0,target:a.target??(r.value?"_blank":void 0),rel:a.rel??(r.value?"noreferrer":void 0)},{default:v(()=>[p(a.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Br={class:"VPLastUpdated"},jr=["datetime"],Dr=k({__name:"VPDocFooterLastUpdated",setup(n){const{theme:e,page:t,frontmatter:r,lang:a}=V(),s=$(()=>new Date(r.value.lastUpdated??t.value.lastUpdated)),o=$(()=>s.value.toISOString()),l=T("");return he(()=>{ke(()=>{var i,m,f;l.value=new Intl.DateTimeFormat((m=(i=e.value.lastUpdated)==null?void 0:i.formatOptions)!=null&&m.forceLocale?a.value:void 0,((f=e.value.lastUpdated)==null?void 0:f.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(s.value)})}),(i,m)=>{var f;return c(),h("p",Br,[se(A(((f=u(e).lastUpdated)==null?void 0:f.text)||u(e).lastUpdatedText||"Last updated")+": ",1),d("time",{datetime:o.value},A(l.value),9,jr)])}}}),Wr=I(Dr,[["__scopeId","data-v-17ba9f92"]]),Ur=n=>(q("data-v-ddf60ed5"),n=n(),J(),n),zr={key:0,class:"VPDocFooter"},Gr={key:0,class:"edit-info"},qr={key:0,class:"edit-link"},Jr=Ur(()=>d("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Qr={key:1,class:"last-updated"},Kr={key:1,class:"prev-next"},Zr={class:"pager"},Yr=["innerHTML"],Xr=["innerHTML"],ea={class:"pager"},ta=["innerHTML"],na=["innerHTML"],ra=k({__name:"VPDocFooter",setup(n){const{theme:e,page:t,frontmatter:r}=V(),a=Hr(),s=Or(),o=$(()=>e.value.editLink&&r.value.editLink!==!1),l=$(()=>t.value.lastUpdated&&r.value.lastUpdated!==!1),i=$(()=>o.value||l.value||s.value.prev||s.value.next);return(m,f)=>{var y,_,w,P;return i.value?(c(),h("footer",zr,[p(m.$slots,"doc-footer-before",{},void 0,!0),o.value||l.value?(c(),h("div",Gr,[o.value?(c(),h("div",qr,[M(le,{class:"edit-link-button",href:u(a).url,"no-icon":!0},{default:v(()=>[Jr,se(" "+A(u(a).text),1)]),_:1},8,["href"])])):S("",!0),l.value?(c(),h("div",Qr,[M(Wr)])):S("",!0)])):S("",!0),(y=u(s).prev)!=null&&y.link||(_=u(s).next)!=null&&_.link?(c(),h("nav",Kr,[d("div",Zr,[(w=u(s).prev)!=null&&w.link?(c(),C(le,{key:0,class:"pager-link prev",href:u(s).prev.link},{default:v(()=>{var g;return[d("span",{class:"desc",innerHTML:((g=u(e).docFooter)==null?void 0:g.prev)||"Previous page"},null,8,Yr),d("span",{class:"title",innerHTML:u(s).prev.text},null,8,Xr)]}),_:1},8,["href"])):S("",!0)]),d("div",ea,[(P=u(s).next)!=null&&P.link?(c(),C(le,{key:0,class:"pager-link next",href:u(s).next.link},{default:v(()=>{var g;return[d("span",{class:"desc",innerHTML:((g=u(e).docFooter)==null?void 0:g.next)||"Next page"},null,8,ta),d("span",{class:"title",innerHTML:u(s).next.text},null,8,na)]}),_:1},8,["href"])):S("",!0)])])):S("",!0)])):S("",!0)}}}),aa=I(ra,[["__scopeId","data-v-ddf60ed5"]]),sa=n=>(q("data-v-676a0582"),n=n(),J(),n),oa={class:"container"},ia=sa(()=>d("div",{class:"aside-curtain"},null,-1)),la={class:"aside-container"},ca={class:"aside-content"},ua={class:"content"},da={class:"content-container"},pa={class:"main"},ha=k({__name:"VPDoc",setup(n){const{theme:e}=V(),t=Te(),{hasSidebar:r,hasAside:a,leftAside:s}=me(),o=$(()=>t.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(l,i)=>{const m=fe("Content");return c(),h("div",{class:F(["VPDoc",{"has-sidebar":u(r),"has-aside":u(a)}])},[p(l.$slots,"doc-top",{},void 0,!0),d("div",oa,[u(a)?(c(),h("div",{key:0,class:F(["aside",{"left-aside":u(s)}])},[ia,d("div",la,[d("div",ca,[M(Nr,null,{"aside-top":v(()=>[p(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":v(()=>[p(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":v(()=>[p(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":v(()=>[p(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":v(()=>[p(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":v(()=>[p(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):S("",!0),d("div",ua,[d("div",da,[p(l.$slots,"doc-before",{},void 0,!0),d("main",pa,[M(m,{class:F(["vp-doc",[o.value,u(e).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),M(aa,null,{"doc-footer-before":v(()=>[p(l.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),p(l.$slots,"doc-after",{},void 0,!0)])])]),p(l.$slots,"doc-bottom",{},void 0,!0)],2)}}}),ma=I(ha,[["__scopeId","data-v-676a0582"]]),va=k({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(n){const e=n,t=$(()=>e.href&&Jt.test(e.href)),r=$(()=>e.tag||e.href?"a":"button");return(a,s)=>(c(),C(Le(r.value),{class:F(["VPButton",[a.size,a.theme]]),href:a.href?u(bt)(a.href):void 0,target:e.target??(t.value?"_blank":void 0),rel:e.rel??(t.value?"noreferrer":void 0)},{default:v(()=>[se(A(a.text),1)]),_:1},8,["class","href","target","rel"]))}}),fa=I(va,[["__scopeId","data-v-153a24b5"]]),ga=["src","alt"],ba=k({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(n){return(e,t)=>{const r=fe("VPImage",!0);return e.image?(c(),h(D,{key:0},[typeof e.image=="string"||"src"in e.image?(c(),h("img",Ne({key:0,class:"VPImage"},typeof e.image=="string"?e.$attrs:{...e.image,...e.$attrs},{src:u(ze)(typeof e.image=="string"?e.image:e.image.src),alt:e.alt??(typeof e.image=="string"?"":e.image.alt||"")}),null,16,ga)):(c(),h(D,{key:1},[M(r,Ne({class:"dark",image:e.image.dark,alt:e.image.alt},e.$attrs),null,16,["image","alt"]),M(r,Ne({class:"light",image:e.image.light,alt:e.image.alt},e.$attrs),null,16,["image","alt"])],64))],64)):S("",!0)}}}),De=I(ba,[["__scopeId","data-v-3b056536"]]),ya=n=>(q("data-v-979b6d7d"),n=n(),J(),n),_a={class:"container"},ka={class:"main"},wa={key:0,class:"name"},$a=["innerHTML"],Sa=["innerHTML"],La=["innerHTML"],xa={key:0,class:"actions"},Ma={key:0,class:"image"},Pa={class:"image-container"},Ca=ya(()=>d("div",{class:"image-bg"},null,-1)),Ia=k({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(n){const e=qe("hero-image-slot-exists");return(t,r)=>(c(),h("div",{class:F(["VPHero",{"has-image":t.image||u(e)}])},[d("div",_a,[d("div",ka,[p(t.$slots,"home-hero-info-before",{},void 0,!0),p(t.$slots,"home-hero-info",{},()=>[t.name?(c(),h("h1",wa,[d("span",{innerHTML:t.name,class:"clip"},null,8,$a)])):S("",!0),t.text?(c(),h("p",{key:1,innerHTML:t.text,class:"text"},null,8,Sa)):S("",!0),t.tagline?(c(),h("p",{key:2,innerHTML:t.tagline,class:"tagline"},null,8,La)):S("",!0)],!0),p(t.$slots,"home-hero-info-after",{},void 0,!0),t.actions?(c(),h("div",xa,[(c(!0),h(D,null,ee(t.actions,a=>(c(),h("div",{key:a.link,class:"action"},[M(fa,{tag:"a",size:"medium",theme:a.theme,text:a.text,href:a.link,target:a.target,rel:a.rel},null,8,["theme","text","href","target","rel"])]))),128))])):S("",!0),p(t.$slots,"home-hero-actions-after",{},void 0,!0)]),t.image||u(e)?(c(),h("div",Ma,[d("div",Pa,[Ca,p(t.$slots,"home-hero-image",{},()=>[t.image?(c(),C(De,{key:0,class:"image-src",image:t.image},null,8,["image"])):S("",!0)],!0)])])):S("",!0)])],2))}}),Ta=I(Ia,[["__scopeId","data-v-979b6d7d"]]),Ea=k({__name:"VPHomeHero",setup(n){const{frontmatter:e}=V();return(t,r)=>u(e).hero?(c(),C(Ta,{key:0,class:"VPHomeHero",name:u(e).hero.name,text:u(e).hero.text,tagline:u(e).hero.tagline,image:u(e).hero.image,actions:u(e).hero.actions},{"home-hero-info-before":v(()=>[p(t.$slots,"home-hero-info-before")]),"home-hero-info":v(()=>[p(t.$slots,"home-hero-info")]),"home-hero-info-after":v(()=>[p(t.$slots,"home-hero-info-after")]),"home-hero-actions-after":v(()=>[p(t.$slots,"home-hero-actions-after")]),"home-hero-image":v(()=>[p(t.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):S("",!0)}}),Va=n=>(q("data-v-9636de8a"),n=n(),J(),n),Aa={class:"box"},Ra={key:0,class:"icon"},Na=["innerHTML"],Ha=["innerHTML"],Oa=["innerHTML"],Fa={key:4,class:"link-text"},Ba={class:"link-text-value"},ja=Va(()=>d("span",{class:"vpi-arrow-right link-text-icon"},null,-1)),Da=k({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(n){return(e,t)=>(c(),C(le,{class:"VPFeature",href:e.link,rel:e.rel,target:e.target,"no-icon":!0,tag:e.link?"a":"div"},{default:v(()=>[d("article",Aa,[typeof e.icon=="object"&&e.icon.wrap?(c(),h("div",Ra,[M(De,{image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])])):typeof e.icon=="object"?(c(),C(De,{key:1,image:e.icon,alt:e.icon.alt,height:e.icon.height||48,width:e.icon.width||48},null,8,["image","alt","height","width"])):e.icon?(c(),h("div",{key:2,class:"icon",innerHTML:e.icon},null,8,Na)):S("",!0),d("h2",{class:"title",innerHTML:e.title},null,8,Ha),e.details?(c(),h("p",{key:3,class:"details",innerHTML:e.details},null,8,Oa)):S("",!0),e.linkText?(c(),h("div",Fa,[d("p",Ba,[se(A(e.linkText)+" ",1),ja])])):S("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Wa=I(Da,[["__scopeId","data-v-9636de8a"]]),Ua={key:0,class:"VPFeatures"},za={class:"container"},Ga={class:"items"},qa=k({__name:"VPFeatures",props:{features:{}},setup(n){const e=n,t=$(()=>{const r=e.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,a)=>r.features?(c(),h("div",Ua,[d("div",za,[d("div",Ga,[(c(!0),h(D,null,ee(r.features,s=>(c(),h("div",{key:s.title,class:F(["item",[t.value]])},[M(Wa,{icon:s.icon,title:s.title,details:s.details,link:s.link,"link-text":s.linkText,rel:s.rel,target:s.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):S("",!0)}}),Ja=I(qa,[["__scopeId","data-v-1a6f19f4"]]),Qa=k({__name:"VPHomeFeatures",setup(n){const{frontmatter:e}=V();return(t,r)=>u(e).features?(c(),C(Ja,{key:0,class:"VPHomeFeatures",features:u(e).features},null,8,["features"])):S("",!0)}}),Ka=k({__name:"VPHomeContent",setup(n){const{width:e}=An({includeScrollbar:!1});return(t,r)=>(c(),h("div",{class:"vp-doc container",style:Qt(u(e)?{"--vp-offset":`calc(50% - ${u(e)/2}px)`}:{})},[p(t.$slots,"default",{},void 0,!0)],4))}}),Za=I(Ka,[["__scopeId","data-v-248354ab"]]),Ya={class:"VPHome"},Xa=k({__name:"VPHome",setup(n){const{frontmatter:e}=V();return(t,r)=>{const a=fe("Content");return c(),h("div",Ya,[p(t.$slots,"home-hero-before",{},void 0,!0),M(Ea,null,{"home-hero-info-before":v(()=>[p(t.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":v(()=>[p(t.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":v(()=>[p(t.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":v(()=>[p(t.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":v(()=>[p(t.$slots,"home-hero-image",{},void 0,!0)]),_:3}),p(t.$slots,"home-hero-after",{},void 0,!0),p(t.$slots,"home-features-before",{},void 0,!0),M(Qa),p(t.$slots,"home-features-after",{},void 0,!0),u(e).markdownStyles!==!1?(c(),C(Za,{key:0},{default:v(()=>[M(a)]),_:1})):(c(),C(a,{key:1}))])}}}),es=I(Xa,[["__scopeId","data-v-81f8b458"]]),ts={},ns={class:"VPPage"};function rs(n,e){const t=fe("Content");return c(),h("div",ns,[p(n.$slots,"page-top"),M(t),p(n.$slots,"page-bottom")])}const as=I(ts,[["render",rs]]),ss=k({__name:"VPContent",setup(n){const{page:e,frontmatter:t}=V(),{hasSidebar:r}=me();return(a,s)=>(c(),h("div",{class:F(["VPContent",{"has-sidebar":u(r),"is-home":u(t).layout==="home"}]),id:"VPContent"},[u(e).isNotFound?p(a.$slots,"not-found",{key:0},()=>[M(dr)],!0):u(t).layout==="page"?(c(),C(as,{key:1},{"page-top":v(()=>[p(a.$slots,"page-top",{},void 0,!0)]),"page-bottom":v(()=>[p(a.$slots,"page-bottom",{},void 0,!0)]),_:3})):u(t).layout==="home"?(c(),C(es,{key:2},{"home-hero-before":v(()=>[p(a.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":v(()=>[p(a.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":v(()=>[p(a.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":v(()=>[p(a.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":v(()=>[p(a.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":v(()=>[p(a.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":v(()=>[p(a.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":v(()=>[p(a.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":v(()=>[p(a.$slots,"home-features-after",{},void 0,!0)]),_:3})):u(t).layout&&u(t).layout!=="doc"?(c(),C(Le(u(t).layout),{key:3})):(c(),C(ma,{key:4},{"doc-top":v(()=>[p(a.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":v(()=>[p(a.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":v(()=>[p(a.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":v(()=>[p(a.$slots,"doc-before",{},void 0,!0)]),"doc-after":v(()=>[p(a.$slots,"doc-after",{},void 0,!0)]),"aside-top":v(()=>[p(a.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":v(()=>[p(a.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":v(()=>[p(a.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":v(()=>[p(a.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":v(()=>[p(a.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":v(()=>[p(a.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),os=I(ss,[["__scopeId","data-v-d4c6f1d8"]]),is={class:"container"},ls=["innerHTML"],cs=["innerHTML"],us=k({__name:"VPFooter",setup(n){const{theme:e,frontmatter:t}=V(),{hasSidebar:r}=me();return(a,s)=>u(e).footer&&u(t).footer!==!1?(c(),h("footer",{key:0,class:F(["VPFooter",{"has-sidebar":u(r)}])},[d("div",is,[u(e).footer.message?(c(),h("p",{key:0,class:"message",innerHTML:u(e).footer.message},null,8,ls)):S("",!0),u(e).footer.copyright?(c(),h("p",{key:1,class:"copyright",innerHTML:u(e).footer.copyright},null,8,cs)):S("",!0)])],2)):S("",!0)}}),ds=I(us,[["__scopeId","data-v-2a19fe76"]]);function ps(){const{theme:n,frontmatter:e}=V(),t=qt([]),r=$(()=>t.value.length>0);return Ge(()=>{t.value=_t(e.value.outline??n.value.outline)}),{headers:t,hasLocalNav:r}}const hs=n=>(q("data-v-b5330ce8"),n=n(),J(),n),ms=hs(()=>d("span",{class:"vpi-chevron-right icon"},null,-1)),vs={class:"header"},fs={class:"outline"},gs=k({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(n){const e=n,{theme:t}=V(),r=T(!1),a=T(0),s=T(),o=T();Rn(s,()=>{r.value=!1}),Nn("Escape",()=>{r.value=!1}),Ge(()=>{r.value=!1});function l(){r.value=!r.value,a.value=window.innerHeight+Math.min(window.scrollY-e.navHeight,0)}function i(f){f.target.classList.contains("outline-link")&&(o.value&&(o.value.style.transition="none"),de(()=>{r.value=!1}))}function m(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(f,y)=>(c(),h("div",{class:"VPLocalNavOutlineDropdown",style:Qt({"--vp-vh":a.value+"px"}),ref_key:"main",ref:s},[f.headers.length>0?(c(),h("button",{key:0,onClick:l,class:F({open:r.value})},[se(A(u(tn)(u(t)))+" ",1),ms],2)):(c(),h("button",{key:1,onClick:m},A(u(t).returnToTopLabel||"Return to top"),1)),M(Ue,{name:"flyout"},{default:v(()=>[r.value?(c(),h("div",{key:0,ref_key:"items",ref:o,class:"items",onClick:i},[d("div",vs,[d("a",{class:"top-link",href:"#",onClick:m},A(u(t).returnToTopLabel||"Return to top"),1)]),d("div",fs,[M(nn,{headers:f.headers},null,8,["headers"])])],512)):S("",!0)]),_:1})],4))}}),bs=I(gs,[["__scopeId","data-v-b5330ce8"]]),ys=n=>(q("data-v-1d2fdb57"),n=n(),J(),n),_s={class:"container"},ks=["aria-expanded"],ws=ys(()=>d("span",{class:"vpi-align-left menu-icon"},null,-1)),$s={class:"menu-text"},Ss=k({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(n){const{theme:e,frontmatter:t}=V(),{hasSidebar:r}=me(),{headers:a}=ps(),{y:s}=Kt(),o=T(0);he(()=>{o.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Ge(()=>{a.value=_t(t.value.outline??e.value.outline)});const l=$(()=>a.value.length===0),i=$(()=>l.value&&!r.value),m=$(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:l.value,fixed:i.value}));return(f,y)=>u(t).layout!=="home"&&(!i.value||u(s)>=o.value)?(c(),h("div",{key:0,class:F(m.value)},[d("div",_s,[u(r)?(c(),h("button",{key:0,class:"menu","aria-expanded":f.open,"aria-controls":"VPSidebarNav",onClick:y[0]||(y[0]=_=>f.$emit("open-menu"))},[ws,d("span",$s,A(u(e).sidebarMenuLabel||"Menu"),1)],8,ks)):S("",!0),M(bs,{headers:u(a),navHeight:o.value},null,8,["headers","navHeight"])])],2)):S("",!0)}}),Ls=I(Ss,[["__scopeId","data-v-1d2fdb57"]]);function xs(){const n=T(!1);function e(){n.value=!0,window.addEventListener("resize",a)}function t(){n.value=!1,window.removeEventListener("resize",a)}function r(){n.value?t():e()}function a(){window.outerWidth>=768&&t()}const s=Te();return G(()=>s.path,t),{isScreenOpen:n,openScreen:e,closeScreen:t,toggleScreen:r}}const Ms={},Ps={class:"VPSwitch",type:"button",role:"switch"},Cs={class:"check"},Is={key:0,class:"icon"};function Ts(n,e){return c(),h("button",Ps,[d("span",Cs,[n.$slots.default?(c(),h("span",Is,[p(n.$slots,"default",{},void 0,!0)])):S("",!0)])])}const Es=I(Ms,[["render",Ts],["__scopeId","data-v-24626390"]]),rn=n=>(q("data-v-47d215e2"),n=n(),J(),n),Vs=rn(()=>d("span",{class:"vpi-sun sun"},null,-1)),As=rn(()=>d("span",{class:"vpi-moon moon"},null,-1)),Rs=k({__name:"VPSwitchAppearance",setup(n){const{isDark:e,theme:t}=V(),r=qe("toggle-appearance",()=>{e.value=!e.value}),a=$(()=>e.value?t.value.lightModeSwitchTitle||"Switch to light theme":t.value.darkModeSwitchTitle||"Switch to dark theme");return(s,o)=>(c(),C(Es,{title:a.value,class:"VPSwitchAppearance","aria-checked":u(e),onClick:u(r)},{default:v(()=>[Vs,As]),_:1},8,["title","aria-checked","onClick"]))}}),kt=I(Rs,[["__scopeId","data-v-47d215e2"]]),Ns={key:0,class:"VPNavBarAppearance"},Hs=k({__name:"VPNavBarAppearance",setup(n){const{site:e}=V();return(t,r)=>u(e).appearance&&u(e).appearance!=="force-dark"?(c(),h("div",Ns,[M(kt)])):S("",!0)}}),Os=I(Hs,[["__scopeId","data-v-c8bb2ded"]]),wt=T();let an=!1,Ye=0;function Fs(n){const e=T(!1);if(xe){!an&&Bs(),Ye++;const t=G(wt,r=>{var a,s,o;r===n.el.value||(a=n.el.value)!=null&&a.contains(r)?(e.value=!0,(s=n.onFocus)==null||s.call(n)):(e.value=!1,(o=n.onBlur)==null||o.call(n))});vt(()=>{t(),Ye--,Ye||js()})}return Hn(e)}function Bs(){document.addEventListener("focusin",sn),an=!0,wt.value=document.activeElement}function js(){document.removeEventListener("focusin",sn)}function sn(){wt.value=document.activeElement}const Ds={class:"VPMenuLink"},Ws=k({__name:"VPMenuLink",props:{item:{}},setup(n){const{page:e}=V();return(t,r)=>(c(),h("div",Ds,[M(le,{class:F({active:u(ye)(u(e).relativePath,t.item.activeMatch||t.item.link,!!t.item.activeMatch)}),href:t.item.link,target:t.item.target,rel:t.item.rel},{default:v(()=>[se(A(t.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Je=I(Ws,[["__scopeId","data-v-2874461e"]]),Us={class:"VPMenuGroup"},zs={key:0,class:"title"},Gs=k({__name:"VPMenuGroup",props:{text:{},items:{}},setup(n){return(e,t)=>(c(),h("div",Us,[e.text?(c(),h("p",zs,A(e.text),1)):S("",!0),(c(!0),h(D,null,ee(e.items,r=>(c(),h(D,null,["link"in r?(c(),C(Je,{key:0,item:r},null,8,["item"])):S("",!0)],64))),256))]))}}),qs=I(Gs,[["__scopeId","data-v-4bcb969a"]]),Js={class:"VPMenu"},Qs={key:0,class:"items"},Ks=k({__name:"VPMenu",props:{items:{}},setup(n){return(e,t)=>(c(),h("div",Js,[e.items?(c(),h("div",Qs,[(c(!0),h(D,null,ee(e.items,r=>(c(),h(D,{key:r.text},["link"in r?(c(),C(Je,{key:0,item:r},null,8,["item"])):(c(),C(qs,{key:1,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):S("",!0),p(e.$slots,"default",{},void 0,!0)]))}}),Zs=I(Ks,[["__scopeId","data-v-e74c705e"]]),Ys=n=>(q("data-v-dec6a1e7"),n=n(),J(),n),Xs=["aria-expanded","aria-label"],eo={key:0,class:"text"},to=["innerHTML"],no=Ys(()=>d("span",{class:"vpi-chevron-down text-icon"},null,-1)),ro={key:1,class:"vpi-more-horizontal icon"},ao={class:"menu"},so=k({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(n){const e=T(!1),t=T();Fs({el:t,onBlur:r});function r(){e.value=!1}return(a,s)=>(c(),h("div",{class:"VPFlyout",ref_key:"el",ref:t,onMouseenter:s[1]||(s[1]=o=>e.value=!0),onMouseleave:s[2]||(s[2]=o=>e.value=!1)},[d("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":e.value,"aria-label":a.label,onClick:s[0]||(s[0]=o=>e.value=!e.value)},[a.button||a.icon?(c(),h("span",eo,[a.icon?(c(),h("span",{key:0,class:F([a.icon,"option-icon"])},null,2)):S("",!0),a.button?(c(),h("span",{key:1,innerHTML:a.button},null,8,to)):S("",!0),no])):(c(),h("span",ro))],8,Xs),d("div",ao,[M(Zs,{items:a.items},{default:v(()=>[p(a.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),$t=I(so,[["__scopeId","data-v-dec6a1e7"]]),oo=["href","aria-label","innerHTML"],io=k({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(n){const e=n,t=$(()=>typeof e.icon=="object"?e.icon.svg:`<span class="vpi-social-${e.icon}" />`);return(r,a)=>(c(),h("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:t.value},null,8,oo))}}),lo=I(io,[["__scopeId","data-v-30e0844f"]]),co={class:"VPSocialLinks"},uo=k({__name:"VPSocialLinks",props:{links:{}},setup(n){return(e,t)=>(c(),h("div",co,[(c(!0),h(D,null,ee(e.links,({link:r,icon:a,ariaLabel:s})=>(c(),C(lo,{key:r,icon:a,link:r,ariaLabel:s},null,8,["icon","link","ariaLabel"]))),128))]))}}),St=I(uo,[["__scopeId","data-v-699c5ed2"]]),po={key:0,class:"group translations"},ho={class:"trans-title"},mo={key:1,class:"group"},vo={class:"item appearance"},fo={class:"label"},go={class:"appearance-action"},bo={key:2,class:"group"},yo={class:"item social-links"},_o=k({__name:"VPNavBarExtra",setup(n){const{site:e,theme:t}=V(),{localeLinks:r,currentLang:a}=Ee({correspondingLink:!0}),s=$(()=>r.value.length&&a.value.label||e.value.appearance||t.value.socialLinks);return(o,l)=>s.value?(c(),C($t,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:v(()=>[u(r).length&&u(a).label?(c(),h("div",po,[d("p",ho,A(u(a).label),1),(c(!0),h(D,null,ee(u(r),i=>(c(),C(Je,{key:i.link,item:i},null,8,["item"]))),128))])):S("",!0),u(e).appearance&&u(e).appearance!=="force-dark"?(c(),h("div",mo,[d("div",vo,[d("p",fo,A(u(t).darkModeSwitchLabel||"Appearance"),1),d("div",go,[M(kt)])])])):S("",!0),u(t).socialLinks?(c(),h("div",bo,[d("div",yo,[M(St,{class:"social-links-list",links:u(t).socialLinks},null,8,["links"])])])):S("",!0)]),_:1})):S("",!0)}}),ko=I(_o,[["__scopeId","data-v-31f8f957"]]),wo=n=>(q("data-v-5d8bd6ac"),n=n(),J(),n),$o=["aria-expanded"],So=wo(()=>d("span",{class:"container"},[d("span",{class:"top"}),d("span",{class:"middle"}),d("span",{class:"bottom"})],-1)),Lo=[So],xo=k({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(n){return(e,t)=>(c(),h("button",{type:"button",class:F(["VPNavBarHamburger",{active:e.active}]),"aria-label":"mobile navigation","aria-expanded":e.active,"aria-controls":"VPNavScreen",onClick:t[0]||(t[0]=r=>e.$emit("click"))},Lo,10,$o))}}),Mo=I(xo,[["__scopeId","data-v-5d8bd6ac"]]),Po=["innerHTML"],Co=k({__name:"VPNavBarMenuLink",props:{item:{}},setup(n){const{page:e}=V();return(t,r)=>(c(),C(le,{class:F({VPNavBarMenuLink:!0,active:u(ye)(u(e).relativePath,t.item.activeMatch||t.item.link,!!t.item.activeMatch)}),href:t.item.link,noIcon:t.item.noIcon,target:t.item.target,rel:t.item.rel,tabindex:"0"},{default:v(()=>[d("span",{innerHTML:t.item.text},null,8,Po)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Io=I(Co,[["__scopeId","data-v-0b4c7ab8"]]),To=k({__name:"VPNavBarMenuGroup",props:{item:{}},setup(n){const e=n,{page:t}=V(),r=s=>"link"in s?ye(t.value.relativePath,s.link,!!e.item.activeMatch):s.items.some(r),a=$(()=>r(e.item));return(s,o)=>(c(),C($t,{class:F({VPNavBarMenuGroup:!0,active:u(ye)(u(t).relativePath,s.item.activeMatch,!!s.item.activeMatch)||a.value}),button:s.item.text,items:s.item.items},null,8,["class","button","items"]))}}),Eo=n=>(q("data-v-2eb0acf1"),n=n(),J(),n),Vo={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Ao=Eo(()=>d("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),Ro=k({__name:"VPNavBarMenu",setup(n){const{theme:e}=V();return(t,r)=>u(e).nav?(c(),h("nav",Vo,[Ao,(c(!0),h(D,null,ee(u(e).nav,a=>(c(),h(D,{key:a.text},["link"in a?(c(),C(Io,{key:0,item:a},null,8,["item"])):(c(),C(To,{key:1,item:a},null,8,["item"]))],64))),128))])):S("",!0)}}),No=I(Ro,[["__scopeId","data-v-2eb0acf1"]]);var Pt;const on=typeof window<"u",Ho=n=>typeof n=="string",Oe=()=>{};on&&((Pt=window==null?void 0:window.navigator)!=null&&Pt.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function it(n){return typeof n=="function"?n():u(n)}function Oo(n,e){function t(...r){n(()=>e.apply(this,r),{fn:e,thisArg:this,args:r})}return t}function Fo(n,e={}){let t,r;return a=>{const s=it(n),o=it(e.maxWait);if(t&&clearTimeout(t),s<=0||o!==void 0&&o<=0)return r&&(clearTimeout(r),r=null),a();o&&!r&&(r=setTimeout(()=>{t&&clearTimeout(t),r=null,a()},o)),t=setTimeout(()=>{r&&clearTimeout(r),r=null,a()},s)}}function Bo(n){return n}function jo(n){return Zt()?(Yt(n),!0):!1}function ln(n,e=200,t={}){return Oo(Fo(e,t),n)}function Xe(n,e=200,t={}){if(e<=0)return n;const r=T(n.value),a=ln(()=>{r.value=n.value},e,t);return G(n,()=>a()),r}function cn(n,e,t){return G(n,(r,a,s)=>{r&&e(r,a,s)},t)}function Do(n){var e;const t=it(n);return(e=t==null?void 0:t.$el)!=null?e:t}const un=on?window:void 0;function Ae(...n){let e,t,r,a;if(Ho(n[0])?([t,r,a]=n,e=un):[e,t,r,a]=n,!e)return Oe;let s=Oe;const o=G(()=>Do(e),i=>{s(),i&&(i.addEventListener(t,r,a),s=()=>{i.removeEventListener(t,r,a),s=Oe})},{immediate:!0,flush:"post"}),l=()=>{o(),s()};return jo(l),l}const Ct=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},It="__vueuse_ssr_handlers__";Ct[It]=Ct[It]||{};const Wo={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Uo(n={}){const{reactive:e=!1,target:t=un,aliasMap:r=Wo,passive:a=!0,onEventFired:s=Oe}=n,o=Ie(new Set),l={toJSON(){return{}},current:o},i=e?Ie(l):l,m=new Set,f=new Set;function y(g,b){g in i&&(e?i[g]=b:i[g].value=b)}function _(){for(const g of f)y(g,!1)}function w(g,b){var R,B;const N=(R=g.key)==null?void 0:R.toLowerCase(),W=[(B=g.code)==null?void 0:B.toLowerCase(),N].filter(Boolean);N&&(b?o.add(N):o.delete(N));for(const z of W)f.add(z),y(z,b);N==="meta"&&!b?(m.forEach(z=>{o.delete(z),y(z,!1)}),m.clear()):typeof g.getModifierState=="function"&&g.getModifierState("Meta")&&b&&[...o,...W].forEach(z=>m.add(z))}Ae(t,"keydown",g=>(w(g,!0),s(g)),{passive:a}),Ae(t,"keyup",g=>(w(g,!1),s(g)),{passive:a}),Ae("blur",_,{passive:!0}),Ae("focus",_,{passive:!0});const P=new Proxy(i,{get(g,b,R){if(typeof b!="string")return Reflect.get(g,b,R);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in i))if(/[+_-]/.test(b)){const N=b.split(/[+_-]/g).map(W=>W.trim());i[b]=$(()=>N.every(W=>u(P[W])))}else i[b]=T(!1);const B=Reflect.get(g,b,R);return e?u(B):B}});return P}var Tt;(function(n){n.UP="UP",n.RIGHT="RIGHT",n.DOWN="DOWN",n.LEFT="LEFT",n.NONE="NONE"})(Tt||(Tt={}));var zo=Object.defineProperty,Et=Object.getOwnPropertySymbols,Go=Object.prototype.hasOwnProperty,qo=Object.prototype.propertyIsEnumerable,Vt=(n,e,t)=>e in n?zo(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,Jo=(n,e)=>{for(var t in e||(e={}))Go.call(e,t)&&Vt(n,t,e[t]);if(Et)for(var t of Et(e))qo.call(e,t)&&Vt(n,t,e[t]);return n};const Qo={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Jo({linear:Bo},Qo);function pe(n){return Array.isArray?Array.isArray(n):hn(n)==="[object Array]"}const Ko=1/0;function Zo(n){if(typeof n=="string")return n;let e=n+"";return e=="0"&&1/n==-Ko?"-0":e}function Yo(n){return n==null?"":Zo(n)}function ie(n){return typeof n=="string"}function dn(n){return typeof n=="number"}function Xo(n){return n===!0||n===!1||ei(n)&&hn(n)=="[object Boolean]"}function pn(n){return typeof n=="object"}function ei(n){return pn(n)&&n!==null}function ae(n){return n!=null}function et(n){return!n.trim().length}function hn(n){return n==null?n===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(n)}const ti="Incorrect 'index' type",ni=n=>`Invalid value for key ${n}`,ri=n=>`Pattern length exceeds max of ${n}.`,ai=n=>`Missing ${n} property in key`,si=n=>`Property 'weight' in key '${n}' must be a positive integer`,At=Object.prototype.hasOwnProperty;class oi{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(r=>{let a=mn(r);t+=a.weight,this._keys.push(a),this._keyMap[a.id]=a,t+=a.weight}),this._keys.forEach(r=>{r.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function mn(n){let e=null,t=null,r=null,a=1,s=null;if(ie(n)||pe(n))r=n,e=Rt(n),t=lt(n);else{if(!At.call(n,"name"))throw new Error(ai("name"));const o=n.name;if(r=o,At.call(n,"weight")&&(a=n.weight,a<=0))throw new Error(si(o));e=Rt(o),t=lt(o),s=n.getFn}return{path:e,id:t,weight:a,src:r,getFn:s}}function Rt(n){return pe(n)?n:n.split(".")}function lt(n){return pe(n)?n.join("."):n}function ii(n,e){let t=[],r=!1;const a=(s,o,l)=>{if(ae(s))if(!o[l])t.push(s);else{let i=o[l];const m=s[i];if(!ae(m))return;if(l===o.length-1&&(ie(m)||dn(m)||Xo(m)))t.push(Yo(m));else if(pe(m)){r=!0;for(let f=0,y=m.length;f<y;f+=1)a(m[f],o,l+1)}else o.length&&a(m,o,l+1)}};return a(n,ie(e)?e.split("."):e,0),r?t:t[0]}const li={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},ci={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(n,e)=>n.score===e.score?n.idx<e.idx?-1:1:n.score<e.score?-1:1},ui={location:0,threshold:.6,distance:100},di={useExtendedSearch:!1,getFn:ii,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var E={...ci,...li,...ui,...di};const pi=/[^ ]+/g;function hi(n=1,e=3){const t=new Map,r=Math.pow(10,e);return{get(a){const s=a.match(pi).length;if(t.has(s))return t.get(s);const o=1/Math.pow(s,.5*n),l=parseFloat(Math.round(o*r)/r);return t.set(s,l),l},clear(){t.clear()}}}class Lt{constructor({getFn:e=E.getFn,fieldNormWeight:t=E.fieldNormWeight}={}){this.norm=hi(t,3),this.getFn=e,this.isCreated=!1,this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((t,r)=>{this._keysMap[t.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,ie(this.docs[0])?this.docs.forEach((e,t)=>{this._addString(e,t)}):this.docs.forEach((e,t)=>{this._addObject(e,t)}),this.norm.clear())}add(e){const t=this.size();ie(e)?this._addString(e,t):this._addObject(e,t)}removeAt(e){this.records.splice(e,1);for(let t=e,r=this.size();t<r;t+=1)this.records[t].i-=1}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_addString(e,t){if(!ae(e)||et(e))return;let r={v:e,i:t,n:this.norm.get(e)};this.records.push(r)}_addObject(e,t){let r={i:t,$:{}};this.keys.forEach((a,s)=>{let o=a.getFn?a.getFn(e):this.getFn(e,a.path);if(ae(o)){if(pe(o)){let l=[];const i=[{nestedArrIndex:-1,value:o}];for(;i.length;){const{nestedArrIndex:m,value:f}=i.pop();if(ae(f))if(ie(f)&&!et(f)){let y={v:f,i:m,n:this.norm.get(f)};l.push(y)}else pe(f)&&f.forEach((y,_)=>{i.push({nestedArrIndex:_,value:y})})}r.$[s]=l}else if(ie(o)&&!et(o)){let l={v:o,n:this.norm.get(o)};r.$[s]=l}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function vn(n,e,{getFn:t=E.getFn,fieldNormWeight:r=E.fieldNormWeight}={}){const a=new Lt({getFn:t,fieldNormWeight:r});return a.setKeys(n.map(mn)),a.setSources(e),a.create(),a}function mi(n,{getFn:e=E.getFn,fieldNormWeight:t=E.fieldNormWeight}={}){const{keys:r,records:a}=n,s=new Lt({getFn:e,fieldNormWeight:t});return s.setKeys(r),s.setIndexRecords(a),s}function Re(n,{errors:e=0,currentLocation:t=0,expectedLocation:r=0,distance:a=E.distance,ignoreLocation:s=E.ignoreLocation}={}){const o=e/n.length;if(s)return o;const l=Math.abs(r-t);return a?o+l/a:l?1:o}function vi(n=[],e=E.minMatchCharLength){let t=[],r=-1,a=-1,s=0;for(let o=n.length;s<o;s+=1){let l=n[s];l&&r===-1?r=s:!l&&r!==-1&&(a=s-1,a-r+1>=e&&t.push([r,a]),r=-1)}return n[s-1]&&s-r>=e&&t.push([r,s-1]),t}const be=32;function fi(n,e,t,{location:r=E.location,distance:a=E.distance,threshold:s=E.threshold,findAllMatches:o=E.findAllMatches,minMatchCharLength:l=E.minMatchCharLength,includeMatches:i=E.includeMatches,ignoreLocation:m=E.ignoreLocation}={}){if(e.length>be)throw new Error(ri(be));const f=e.length,y=n.length,_=Math.max(0,Math.min(r,y));let w=s,P=_;const g=l>1||i,b=g?Array(y):[];let R;for(;(R=n.indexOf(e,P))>-1;){let Y=Re(e,{currentLocation:R,expectedLocation:_,distance:a,ignoreLocation:m});if(w=Math.min(Y,w),P=R+f,g){let ne=0;for(;ne<f;)b[R+ne]=1,ne+=1}}P=-1;let B=[],N=1,W=f+y;const z=1<<f-1;for(let Y=0;Y<f;Y+=1){let ne=0,Z=W;for(;ne<Z;)Re(e,{errors:Y,currentLocation:_+Z,expectedLocation:_,distance:a,ignoreLocation:m})<=w?ne=Z:W=Z,Z=Math.floor((W-ne)/2+ne);W=Z;let we=Math.max(1,_-Z+1),ce=o?y:Math.min(_+Z,y)+f,re=Array(ce+2);re[ce+1]=(1<<Y)-1;for(let L=ce;L>=we;L-=1){let O=L-1,X=t[n.charAt(O)];if(g&&(b[O]=+!!X),re[L]=(re[L+1]<<1|1)&X,Y&&(re[L]|=(B[L+1]|B[L])<<1|1|B[L+1]),re[L]&z&&(N=Re(e,{errors:Y,currentLocation:O,expectedLocation:_,distance:a,ignoreLocation:m}),N<=w)){if(w=N,P=O,P<=_)break;we=Math.max(1,2*_-P)}}if(Re(e,{errors:Y+1,currentLocation:_,expectedLocation:_,distance:a,ignoreLocation:m})>w)break;B=re}const te={isMatch:P>=0,score:Math.max(.001,N)};if(g){const Y=vi(b,l);Y.length?i&&(te.indices=Y):te.isMatch=!1}return te}function gi(n){let e={};for(let t=0,r=n.length;t<r;t+=1){const a=n.charAt(t);e[a]=(e[a]||0)|1<<r-t-1}return e}class fn{constructor(e,{location:t=E.location,threshold:r=E.threshold,distance:a=E.distance,includeMatches:s=E.includeMatches,findAllMatches:o=E.findAllMatches,minMatchCharLength:l=E.minMatchCharLength,isCaseSensitive:i=E.isCaseSensitive,ignoreLocation:m=E.ignoreLocation}={}){if(this.options={location:t,threshold:r,distance:a,includeMatches:s,findAllMatches:o,minMatchCharLength:l,isCaseSensitive:i,ignoreLocation:m},this.pattern=i?e:e.toLowerCase(),this.chunks=[],!this.pattern.length)return;const f=(_,w)=>{this.chunks.push({pattern:_,alphabet:gi(_),startIndex:w})},y=this.pattern.length;if(y>be){let _=0;const w=y%be,P=y-w;for(;_<P;)f(this.pattern.substr(_,be),_),_+=be;if(w){const g=y-be;f(this.pattern.substr(g),g)}}else f(this.pattern,0)}searchIn(e){const{isCaseSensitive:t,includeMatches:r}=this.options;if(t||(e=e.toLowerCase()),this.pattern===e){let P={isMatch:!0,score:0};return r&&(P.indices=[[0,e.length-1]]),P}const{location:a,distance:s,threshold:o,findAllMatches:l,minMatchCharLength:i,ignoreLocation:m}=this.options;let f=[],y=0,_=!1;this.chunks.forEach(({pattern:P,alphabet:g,startIndex:b})=>{const{isMatch:R,score:B,indices:N}=fi(e,P,g,{location:a+b,distance:s,threshold:o,findAllMatches:l,minMatchCharLength:i,includeMatches:r,ignoreLocation:m});R&&(_=!0),y+=B,R&&N&&(f=[...f,...N])});let w={isMatch:_,score:_?y/this.chunks.length:1};return _&&r&&(w.indices=f),w}}class ge{constructor(e){this.pattern=e}static isMultiMatch(e){return Nt(e,this.multiRegex)}static isSingleMatch(e){return Nt(e,this.singleRegex)}search(){}}function Nt(n,e){const t=n.match(e);return t?t[1]:null}class bi extends ge{constructor(e){super(e)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(e){const t=e===this.pattern;return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class yi extends ge{constructor(e){super(e)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(e){const t=e.indexOf(this.pattern)===-1;return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class _i extends ge{constructor(e){super(e)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(e){const t=e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,this.pattern.length-1]}}}class ki extends ge{constructor(e){super(e)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(e){const t=!e.startsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class wi extends ge{constructor(e){super(e)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(e){const t=e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[e.length-this.pattern.length,e.length-1]}}}class $i extends ge{constructor(e){super(e)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(e){const t=!e.endsWith(this.pattern);return{isMatch:t,score:t?0:1,indices:[0,e.length-1]}}}class gn extends ge{constructor(e,{location:t=E.location,threshold:r=E.threshold,distance:a=E.distance,includeMatches:s=E.includeMatches,findAllMatches:o=E.findAllMatches,minMatchCharLength:l=E.minMatchCharLength,isCaseSensitive:i=E.isCaseSensitive,ignoreLocation:m=E.ignoreLocation}={}){super(e),this._bitapSearch=new fn(e,{location:t,threshold:r,distance:a,includeMatches:s,findAllMatches:o,minMatchCharLength:l,isCaseSensitive:i,ignoreLocation:m})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(e){return this._bitapSearch.searchIn(e)}}class bn extends ge{constructor(e){super(e)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(e){let t=0,r;const a=[],s=this.pattern.length;for(;(r=e.indexOf(this.pattern,t))>-1;)t=r+s,a.push([r,t-1]);const o=!!a.length;return{isMatch:o,score:o?0:1,indices:a}}}const ct=[bi,bn,_i,ki,$i,wi,yi,gn],Ht=ct.length,Si=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,Li="|";function xi(n,e={}){return n.split(Li).map(t=>{let r=t.trim().split(Si).filter(s=>s&&!!s.trim()),a=[];for(let s=0,o=r.length;s<o;s+=1){const l=r[s];let i=!1,m=-1;for(;!i&&++m<Ht;){const f=ct[m];let y=f.isMultiMatch(l);y&&(a.push(new f(y,e)),i=!0)}if(!i)for(m=-1;++m<Ht;){const f=ct[m];let y=f.isSingleMatch(l);if(y){a.push(new f(y,e));break}}}return a})}const Mi=new Set([gn.type,bn.type]);class Pi{constructor(e,{isCaseSensitive:t=E.isCaseSensitive,includeMatches:r=E.includeMatches,minMatchCharLength:a=E.minMatchCharLength,ignoreLocation:s=E.ignoreLocation,findAllMatches:o=E.findAllMatches,location:l=E.location,threshold:i=E.threshold,distance:m=E.distance}={}){this.query=null,this.options={isCaseSensitive:t,includeMatches:r,minMatchCharLength:a,findAllMatches:o,ignoreLocation:s,location:l,threshold:i,distance:m},this.pattern=t?e:e.toLowerCase(),this.query=xi(this.pattern,this.options)}static condition(e,t){return t.useExtendedSearch}searchIn(e){const t=this.query;if(!t)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:a}=this.options;e=a?e:e.toLowerCase();let s=0,o=[],l=0;for(let i=0,m=t.length;i<m;i+=1){const f=t[i];o.length=0,s=0;for(let y=0,_=f.length;y<_;y+=1){const w=f[y],{isMatch:P,indices:g,score:b}=w.search(e);if(P){if(s+=1,l+=b,r){const R=w.constructor.type;Mi.has(R)?o=[...o,...g]:o.push(g)}}else{l=0,s=0,o.length=0;break}}if(s){let y={isMatch:!0,score:l/s};return r&&(y.indices=o),y}}return{isMatch:!1,score:1}}}const ut=[];function Ci(...n){ut.push(...n)}function dt(n,e){for(let t=0,r=ut.length;t<r;t+=1){let a=ut[t];if(a.condition(n,e))return new a(n,e)}return new fn(n,e)}const We={AND:"$and",OR:"$or"},pt={PATH:"$path",PATTERN:"$val"},ht=n=>!!(n[We.AND]||n[We.OR]),Ii=n=>!!n[pt.PATH],Ti=n=>!pe(n)&&pn(n)&&!ht(n),Ot=n=>({[We.AND]:Object.keys(n).map(e=>({[e]:n[e]}))});function yn(n,e,{auto:t=!0}={}){const r=a=>{let s=Object.keys(a);const o=Ii(a);if(!o&&s.length>1&&!ht(a))return r(Ot(a));if(Ti(a)){const i=o?a[pt.PATH]:s[0],m=o?a[pt.PATTERN]:a[i];if(!ie(m))throw new Error(ni(i));const f={keyId:lt(i),pattern:m};return t&&(f.searcher=dt(m,e)),f}let l={children:[],operator:s[0]};return s.forEach(i=>{const m=a[i];pe(m)&&m.forEach(f=>{l.children.push(r(f))})}),l};return ht(n)||(n=Ot(n)),r(n)}function Ei(n,{ignoreFieldNorm:e=E.ignoreFieldNorm}){n.forEach(t=>{let r=1;t.matches.forEach(({key:a,norm:s,score:o})=>{const l=a?a.weight:null;r*=Math.pow(o===0&&l?Number.EPSILON:o,(l||1)*(e?1:s))}),t.score=r})}function Vi(n,e){const t=n.matches;e.matches=[],ae(t)&&t.forEach(r=>{if(!ae(r.indices)||!r.indices.length)return;const{indices:a,value:s}=r;let o={indices:a,value:s};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),e.matches.push(o)})}function Ai(n,e){e.score=n.score}function Ri(n,e,{includeMatches:t=E.includeMatches,includeScore:r=E.includeScore}={}){const a=[];return t&&a.push(Vi),r&&a.push(Ai),n.map(s=>{const{idx:o}=s,l={item:e[o],refIndex:o};return a.length&&a.forEach(i=>{i(s,l)}),l})}class _e{constructor(e,t={},r){this.options={...E,...t},this.options.useExtendedSearch,this._keyStore=new oi(this.options.keys),this.setCollection(e,r)}setCollection(e,t){if(this._docs=e,t&&!(t instanceof Lt))throw new Error(ti);this._myIndex=t||vn(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(e){!ae(e)||(this._docs.push(e),this._myIndex.add(e))}remove(e=()=>!1){const t=[];for(let r=0,a=this._docs.length;r<a;r+=1){const s=this._docs[r];e(s,r)&&(this.removeAt(r),r-=1,a-=1,t.push(s))}return t}removeAt(e){this._docs.splice(e,1),this._myIndex.removeAt(e)}getIndex(){return this._myIndex}search(e,{limit:t=-1}={}){const{includeMatches:r,includeScore:a,shouldSort:s,sortFn:o,ignoreFieldNorm:l}=this.options;let i=ie(e)?ie(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e);return Ei(i,{ignoreFieldNorm:l}),s&&i.sort(o),dn(t)&&t>-1&&(i=i.slice(0,t)),Ri(i,this._docs,{includeMatches:r,includeScore:a})}_searchStringList(e){const t=dt(e,this.options),{records:r}=this._myIndex,a=[];return r.forEach(({v:s,i:o,n:l})=>{if(!ae(s))return;const{isMatch:i,score:m,indices:f}=t.searchIn(s);i&&a.push({item:s,idx:o,matches:[{score:m,value:s,norm:l,indices:f}]})}),a}_searchLogical(e){const t=yn(e,this.options),r=(l,i,m)=>{if(!l.children){const{keyId:y,searcher:_}=l,w=this._findMatches({key:this._keyStore.get(y),value:this._myIndex.getValueForItemAtKeyId(i,y),searcher:_});return w&&w.length?[{idx:m,item:i,matches:w}]:[]}const f=[];for(let y=0,_=l.children.length;y<_;y+=1){const w=l.children[y],P=r(w,i,m);if(P.length)f.push(...P);else if(l.operator===We.AND)return[]}return f},a=this._myIndex.records,s={},o=[];return a.forEach(({$:l,i})=>{if(ae(l)){let m=r(t,l,i);m.length&&(s[i]||(s[i]={idx:i,item:l,matches:[]},o.push(s[i])),m.forEach(({matches:f})=>{s[i].matches.push(...f)}))}}),o}_searchObjectList(e){const t=dt(e,this.options),{keys:r,records:a}=this._myIndex,s=[];return a.forEach(({$:o,i:l})=>{if(!ae(o))return;let i=[];r.forEach((m,f)=>{i.push(...this._findMatches({key:m,value:o[f],searcher:t}))}),i.length&&s.push({idx:l,item:o,matches:i})}),s}_findMatches({key:e,value:t,searcher:r}){if(!ae(t))return[];let a=[];if(pe(t))t.forEach(({v:s,i:o,n:l})=>{if(!ae(s))return;const{isMatch:i,score:m,indices:f}=r.searchIn(s);i&&a.push({score:m,key:e,value:s,idx:o,norm:l,indices:f})});else{const{v:s,n:o}=t,{isMatch:l,score:i,indices:m}=r.searchIn(s);l&&a.push({score:i,key:e,value:s,norm:o,indices:m})}return a}}_e.version="6.6.2";_e.createIndex=vn;_e.parseIndex=mi;_e.config=E;_e.parseQuery=yn;Ci(Pi);const Ft=Ie({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Me=()=>({isSearching:$(()=>Ft.search!==""),...Fn(Ft)});function Ni(n){return{all:n=n||new Map,on:function(e,t){var r=n.get(e);r?r.push(t):n.set(e,[t])},off:function(e,t){var r=n.get(e);r&&(t?r.splice(r.indexOf(t)>>>0,1):n.set(e,[]))},emit:function(e,t){var r=n.get(e);r&&r.slice().map(function(a){a(t)}),(r=n.get("*"))&&r.slice().map(function(a){a(e,t)})}}}const Hi=Ni(),Qe=()=>({emitter:Hi});function Oi(n,e){let t=n.nextElementSibling;for(;t;){if(t.matches(e))return t;t=t.nextElementSibling}}function Fi(n,e){let t=n.previousElementSibling;for(;t;){if(t.matches(e))return t;t=t.previousElementSibling}}const Bi=["command-theme"],ji={"command-root":""},Di=k({name:"Command"}),Wi=k({...Di,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(n,{emit:e}){const t=n,r='[command-item=""]',a="command-item-key",s='[command-group=""]',o="command-group-key",l='[command-group-heading=""]',i=`${r}:not([aria-disabled="true"])`,m=`${r}[aria-selected="true"]`,f="command-item-select",y="data-value";ft("theme",t.theme||"default");const{selectedNode:_,search:w,dataValue:P,filtered:g}=Me(),{emitter:b}=Qe(),R=T(),B=Xe(T(new Map),333),N=Xe(T(new Set),333),W=Xe(T(new Map)),z=$(()=>{const x=[];for(const[j,H]of B.value.entries())x.push({key:j,label:H});return x}),te=$(()=>{const x=_e.createIndex(t.fuseOptions.keys,z.value);return new _e(z.value,t.fuseOptions,x)}),Y=()=>{var x,j,H;const U=ne();U&&(((x=U.parentElement)==null?void 0:x.firstElementChild)===U&&((H=(j=U.closest(s))==null?void 0:j.querySelector(l))==null||H.scrollIntoView({block:"nearest"})),U.scrollIntoView({block:"nearest"}))},ne=()=>{var x;return(x=R.value)==null?void 0:x.querySelector(m)},Z=(x=R.value)=>{const j=x==null?void 0:x.querySelectorAll(i);return j?Array.from(j):[]},we=()=>{var x;const j=(x=R.value)==null?void 0:x.querySelectorAll(s);return j?Array.from(j):[]},ce=()=>{const[x]=Z();x&&x.getAttribute(a)&&(_.value=x.getAttribute(a)||"")},re=x=>{const j=Z()[x];j&&(_.value=j.getAttribute(a)||"")},L=x=>{const j=ne(),H=Z(),U=H.findIndex(Ve=>Ve===j),ve=H[U+x];ve?_.value=ve.getAttribute(a)||"":x>0?re(0):re(H.length-1)},O=x=>{const j=ne();let H=j==null?void 0:j.closest(s),U=null;for(;H&&!U;)H=x>0?Oi(H,s):Fi(H,s),U=H==null?void 0:H.querySelector(i);U?_.value=U.getAttribute(a)||"":L(x)},X=()=>re(0),ue=()=>re(Z().length-1),Q=x=>{x.preventDefault(),x.metaKey?ue():x.altKey?O(1):L(1)},Ce=x=>{x.preventDefault(),x.metaKey?X():x.altKey?O(-1):L(-1)},Ke=x=>{switch(x.key){case"n":case"j":{x.ctrlKey&&Q(x);break}case"ArrowDown":{Q(x);break}case"p":case"k":{x.ctrlKey&&Ce(x);break}case"ArrowUp":{Ce(x);break}case"Home":{X();break}case"End":{ue();break}case"Enter":{const j=ne();if(j){const H=new Event(f);j.dispatchEvent(H)}}}},K=()=>{if(!w.value){g.value.count=N.value.size;return}g.value.groups=new Set("");const x=new Map,j=te.value.search(w.value).map(H=>H.item);for(const{key:H,label:U}of j)x.set(H,U);for(const[H,U]of W.value)for(const ve of U)x.get(ve)&&g.value.groups.add(H);de(()=>{g.value.count=x.size,g.value.items=x})},oe=()=>{const x=Z(),j=we();for(const H of x){const U=H.getAttribute(a)||"",ve=H.getAttribute(y)||"";N.value.add(U),B.value.set(U,ve),g.value.count=B.value.size}for(const H of j){const U=Z(H),ve=H.getAttribute(o)||"",Ve=new Set("");for(const Pn of U){const Cn=Pn.getAttribute(a)||"";Ve.add(Cn)}W.value.set(ve,Ve)}};G(()=>_.value,x=>{x&&de(Y)},{deep:!0}),G(()=>w.value,x=>{K(),de(ce)}),b.on("selectItem",x=>{e("select-item",x)});const Ze=ln(x=>{x&&(oe(),de(ce))},100);return b.on("rerenderList",Ze),he(()=>{oe(),ce()}),(x,j)=>(c(),h("div",{class:F(n.theme),onKeydown:Ke,ref_key:"commandRef",ref:R,"command-theme":n.theme},[d("div",ji,[p(x.$slots,"default")])],42,Bi))}}),Pe=(n,e)=>{const t=n.__vccOpts||n;for(const[r,a]of e)t[r]=a;return t},mt=Pe(Wi,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Ui={"command-dialog":""},zi={"command-dialog-mask":""},Gi={"command-dialog-wrapper":""},qi={"command-dialog-header":""},Ji={"command-dialog-body":""},Qi={key:0,"command-dialog-footer":""},Ki=k({name:"Command.Dialog"}),Zi=k({...Ki,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(n,{emit:e}){const t=n,{search:r,filtered:a}=Me(),{emitter:s}=Qe(),o=T();s.on("selectItem",i=>{e("select-item",i)});const l=()=>{r.value="",a.value.count=0,a.value.items=new Map,a.value.groups=new Set};return cn(()=>t.visible,l),gt(l),(i,m)=>(c(),C(On,{to:"body",ref_key:"dialogRef",ref:o},[M(Ue,{name:"command-dialog",appear:""},{default:v(()=>[n.visible?(c(),C(mt,{key:0,theme:n.theme},{default:v(()=>[d("div",Ui,[d("div",zi,[d("div",Gi,[d("div",qi,[p(i.$slots,"header")]),d("div",Ji,[p(i.$slots,"body")]),i.$slots.footer?(c(),h("div",Qi,[p(i.$slots,"footer")])):S("v-if",!0)])])])]),_:3},8,["theme"])):S("v-if",!0)]),_:3})],512))}}),Yi=Pe(Zi,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let _n=(n=21)=>crypto.getRandomValues(new Uint8Array(n)).reduce((e,t)=>(t&=63,t<36?e+=t.toString(36):t<62?e+=(t-26).toString(36).toUpperCase():t>62?e+="-":e+="_",e),"");const Xi=["command-group-key","data-value"],el={key:0,"command-group-heading":""},tl={"command-group-items":"",role:"group"},nl=k({name:"Command.Group"}),rl=k({...nl,props:{heading:{type:String,required:!0}},setup(n){const e=$(()=>`command-group-${_n()}`),{filtered:t,isSearching:r}=Me(),a=$(()=>r.value?t.value.groups.has(e.value):!0);return(s,o)=>Fe((c(),h("div",{"command-group":"",role:"presentation",key:u(e),"command-group-key":u(e),"data-value":n.heading},[n.heading?(c(),h("div",el,A(n.heading),1)):S("v-if",!0),d("div",tl,[p(s.$slots,"default")])],8,Xi)),[[Be,u(a)]])}}),al=Pe(rl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),sl=["placeholder","value"],ol=k({name:"Command.Input"}),il=k({...ol,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(n,{emit:e}){const t=T(null),{search:r}=Me(),a=$(()=>r.value),s=o=>{const l=o,i=o.target;r.value=i==null?void 0:i.value,e("input",l),e("update:value",r.value)};return ke(()=>{var o;(o=t.value)==null||o.focus()}),(o,l)=>(c(),h("input",{ref_key:"inputRef",ref:t,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:n.placeholder,value:u(a),onInput:s},null,40,sl))}}),ll=Pe(il,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),cl=["aria-selected","aria-disabled","command-item-key"],ul=k({name:"Command.Item"}),dl=k({...ul,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(n,{emit:e}){const t=n,r="command-item-select",a="data-value",{current:s}=Uo(),{selectedNode:o,filtered:l,isSearching:i}=Me(),{emitter:m}=Qe(),f=T(),y=$(()=>`command-item-${_n()}`),_=$(()=>{const g=l.value.items.get(y.value);return i.value?g!==void 0:!0}),w=$(()=>Array.from(s)),P=()=>{var g;const b={key:y.value,value:((g=f.value)==null?void 0:g.getAttribute(a))||""};e("select",b),m.emit("selectItem",b)};return cn(w,g=>{t.shortcut&&t.shortcut.length>0&&t.shortcut.every(b=>s.has(b.toLowerCase()))&&t.perform&&t.perform()}),ke(()=>{var g;(g=f.value)==null||g.addEventListener(r,P)}),gt(()=>{var g;(g=f.value)==null||g.removeEventListener(r,P)}),(g,b)=>Fe((c(),h("div",{ref_key:"itemRef",ref:f,"command-item":"",role:"option","aria-selected":u(o)===u(y),"aria-disabled":!u(_),key:u(y),"command-item-key":u(y),onClick:P},[p(g.$slots,"default")],8,cl)),[[Be,u(_)]])}}),pl=Pe(dl,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),hl=k({name:"Command.List"}),ml=k({...hl,setup(n){const{emitter:e}=Qe(),t=T(),r=T();let a=null,s;return ke(()=>{s=r.value;const o=t.value;s&&o&&(a=new ResizeObserver(l=>{de(()=>{const i=s==null?void 0:s.offsetHeight;o==null||o.style.setProperty("--command-list-height",`${i==null?void 0:i.toFixed(1)}px`),e.emit("rerenderList",!0)})}),a.observe(s))}),gt(()=>{a!==null&&s&&a.unobserve(s)}),(o,l)=>(c(),h("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:t},[d("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[p(o.$slots,"default")],512)],512))}}),vl=Pe(ml,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),fl=k({name:"Command.Empty",setup(n,{attrs:e,slots:t}){const{filtered:r}=Me(),a=$(()=>r.value.count===0);return()=>a.value?je("div",{"command-empty":"",role:"presentation",...e},t):je("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...e})}}),gl=k({name:"Command.Loading",setup(n,{attrs:e,slots:t}){return()=>je("div",{"command-loading":"",role:"progressbar",...e},t)}}),bl=k({name:"Command.Separator",setup(n,{attrs:e,slots:t}){return()=>je("div",{"command-separator":"",role:"separator",...e})}}),$e=Object.assign(mt,{Dialog:Yi,Empty:fl,Group:al,Input:ll,Item:pl,List:vl,Loading:gl,Separator:bl,Root:mt});var Bt;const kn=typeof window<"u",yl=n=>typeof n=="string",wn=()=>{};kn&&((Bt=window==null?void 0:window.navigator)!=null&&Bt.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function $n(n){return typeof n=="function"?n():u(n)}function _l(n){return n}function kl(n){return Zt()?(Yt(n),!0):!1}function wl(n,e=!0){Bn()?he(n):e?n():de(n)}function $l(n){var e;const t=$n(n);return(e=t==null?void 0:t.$el)!=null?e:t}const xt=kn?window:void 0;function Se(...n){let e,t,r,a;if(yl(n[0])||Array.isArray(n[0])?([t,r,a]=n,e=xt):[e,t,r,a]=n,!e)return wn;Array.isArray(t)||(t=[t]),Array.isArray(r)||(r=[r]);const s=[],o=()=>{s.forEach(f=>f()),s.length=0},l=(f,y,_,w)=>(f.addEventListener(y,_,w),()=>f.removeEventListener(y,_,w)),i=G(()=>[$l(e),$n(a)],([f,y])=>{o(),f&&s.push(...t.flatMap(_=>r.map(w=>l(f,_,w,y))))},{immediate:!0,flush:"post"}),m=()=>{i(),o()};return kl(m),m}const jt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Dt="__vueuse_ssr_handlers__";jt[Dt]=jt[Dt]||{};const Sl={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Ll(n={}){const{reactive:e=!1,target:t=xt,aliasMap:r=Sl,passive:a=!0,onEventFired:s=wn}=n,o=Ie(new Set),l={toJSON(){return{}},current:o},i=e?Ie(l):l,m=new Set,f=new Set;function y(g,b){g in i&&(e?i[g]=b:i[g].value=b)}function _(){o.clear();for(const g of f)y(g,!1)}function w(g,b){var R,B;const N=(R=g.key)==null?void 0:R.toLowerCase(),z=[(B=g.code)==null?void 0:B.toLowerCase(),N].filter(Boolean);N&&(b?o.add(N):o.delete(N));for(const te of z)f.add(te),y(te,b);N==="meta"&&!b?(m.forEach(te=>{o.delete(te),y(te,!1)}),m.clear()):typeof g.getModifierState=="function"&&g.getModifierState("Meta")&&b&&[...o,...z].forEach(te=>m.add(te))}Se(t,"keydown",g=>(w(g,!0),s(g)),{passive:a}),Se(t,"keyup",g=>(w(g,!1),s(g)),{passive:a}),Se("blur",_,{passive:!0}),Se("focus",_,{passive:!0});const P=new Proxy(i,{get(g,b,R){if(typeof b!="string")return Reflect.get(g,b,R);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in i))if(/[+_-]/.test(b)){const N=b.split(/[+_-]/g).map(W=>W.trim());i[b]=$(()=>N.every(W=>u(P[W])))}else i[b]=T(!1);const B=Reflect.get(g,b,R);return e?u(B):B}});return P}var Wt;(function(n){n.UP="UP",n.RIGHT="RIGHT",n.DOWN="DOWN",n.LEFT="LEFT",n.NONE="NONE"})(Wt||(Wt={}));var xl=Object.defineProperty,Ut=Object.getOwnPropertySymbols,Ml=Object.prototype.hasOwnProperty,Pl=Object.prototype.propertyIsEnumerable,zt=(n,e,t)=>e in n?xl(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,Cl=(n,e)=>{for(var t in e||(e={}))Ml.call(e,t)&&zt(n,t,e[t]);if(Ut)for(var t of Ut(e))Pl.call(e,t)&&zt(n,t,e[t]);return n};const Il={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Cl({linear:_l},Il);function Tl(n={}){const{window:e=xt,initialWidth:t=1/0,initialHeight:r=1/0,listenOrientation:a=!0,includeScrollbar:s=!0}=n,o=T(t),l=T(r),i=()=>{e&&(s?(o.value=e.innerWidth,l.value=e.innerHeight):(o.value=e.document.documentElement.clientWidth,l.value=e.document.documentElement.clientHeight))};return i(),wl(i),Se("resize",i,{passive:!0}),a&&Se("orientationchange",i,{passive:!0}),{width:o,height:l}}const tt=T([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

Development scheme based on \`Web Components\`

## Feature

1. **High Cross-Framework Compatibility**: Our solution seamlessly adapts to a wide array of leading front-end frameworks, including \`React\`, \`Vue\`, \`Preact\`, \`SolidJS\`, \`Svelte\`, and more. It also integrates smoothly with any project built on \`JavaScript\` and adhering to \`W3C\` standards. No matter your choice of technology stack, we guarantee consistent and reliable support.
2. **Pure Native Experience**: Our solution eliminates the need for dependencies on front-end frameworks like \`npm\`, \`React\`/\`Vue\`, or complex build tools such as \`webpack\`/\`vite\`. It truly embodies the essence of Web technology. You can get started effortlessly, just like manipulating native \`div\` tags, immediately experiencing the purity and intuitiveness of the technology. This design not only simplifies project structure but also reduces the cost of learning and usage, enabling every developer to appreciate the native charm of Web technology.
3. **Ultimate Modular Design**: Utilizing the principle of minimal modularization, we carefully dismantle large and complex systems or applications into extremely small, functionally independent, and easily reusable component units. This approach significantly enhances code maintainability, scalability, and reusability.
4. **Fully Open-Source for Free Learning**: Our project fully adheres to the \`MIT\` open-source license, granting unrestricted access to all source code. This means you are free to access, learn from, reference, and even modify our code, whether for personal development or commercial applications. We firmly believe that open-source is a vital pathway for technological advancement and innovation.
5. **Interactive and Comprehensive Documentation**: We provide detailed and highly interactive documentation, where all component examples are live and interactive. This allows you to directly experience the component functionality while reading, deepening your understanding and enabling quick hands-on learning. This design is aimed at providing you with the most intuitive and efficient learning experience possible.
6. **Type-Checking Support**: Our development environment is fully built on \`TypeScript\`, equipped with comprehensive declaration files and type definitions, ensuring smooth integration for both \`JavaScript\` and \`TypeScript\` projects. With powerful type-checking capabilities, we significantly enhance code readability, maintainability, and project robustness, bringing unprecedented convenience and peace of mind to development work.
7. **Enhanced Durability and Stability**: Our solution offers exceptional stability, eliminating concerns about disruptive updates encountered during version upgrades, such as \`React\` from version \`15\` to \`16\` (with \`fiber\`) or \`Vue\` from version \`2\` to \`3\` (with \`hooks\`). We ensure that your components won't be forced into unnecessary updates or redevelopments, thus avoiding potential project interruptions and additional workloads. This translates into a continuous and hassle-free project operation.

## Situation

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- \`git\`：<a href="https://github.com/chaxus/ran/tree/main/packages/ranui">\`https://github.com/chaxus/ran/tree/main/packages/ranui\`</a>
- \`npm\`：<a href="https://www.npmjs.com/package/ranui">\`https://www.npmjs.com/package/ranui\`</a>

## Usage

In most cases, you can use it just like a native \`div\` tag.

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
    console.log('e`,title:"ranui",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-03-29 11:51:44"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-03-29 11:51:44"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-03-29 11:51:44"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-03-29 11:51:44"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

基于 \`Web Components\`开发方案

## Feature 特点

1. **高度跨框架兼容**: 能够轻松适配多种主流前端框架，包括\`React\`、\`Vue\`、\`Preact\`、\`SolidJS\`、\`Svelte\`等，甚至任何基于\`JavaScript\`并遵循\`W3C\`标准的项目也能无缝集成。无论您的技术栈如何选择，我们都能提供稳定且一致的支持。
2. **原生纯粹的体验**: 无需依赖\`npm\`、\`React/Vue\`等前端框架，也无需\`webpack/vite\`等复杂的构建工具，真正回归\`Web\`技术的最本质。您可以像操作原生\`div\`标签一样轻松上手，即刻感受技术的纯粹与直观。这样的设计不仅简化了项目的结构，更降低了学习和使用的成本，让每一个开发者都能体验到\`Web\`技术的原生魅力。
3. **极致模块化设计**: 采用最小模块化原则，将庞大复杂的系统或应用程序精心拆解为尺寸极小、功能独立且易于复用的组件单元。有助于提高代码的可维护性、可扩展性和可重用性
4. **全面开源自由学习**: 项目完全遵循\`MIT\`开源协议，所有源代码毫无保留地对外开放。这意味着可以自由地访问、学习、参考甚至修改我们的代码，无论是为了个人提升还是商业应用，我们都为您提供了一个开放、透明的平台。坚信，**开源是促进技术进步和创新的重要途径**。
5. **交互式丰富文档**: 提供详尽且互动性强的文档，其中所有组件实例均可进行实时交互，让您在阅读的同时能够直接体验组件功能，加深理解并快速上手。这样的设计旨在为您提供最直观、最高效的学习体验。
6. **支持类型校验**: 开发环境完全基于\`TypeScript\`构建，配备了完整的声明文件和类型定义，确保无论是\`JavaScript\`还是\`TypeScript\`项目都能得到顺畅的集成。通过强大的类型检查功能，我们极大地提升了代码的可读性、可维护性，以及项目的稳健性，为开发工作带来前所未有的便捷与安心。
7. **更加持久和稳定**：具备出色的稳定性，无需担忧类似于\`React\`从\`15\`版升级到\`16\`版（\`fiber\`），或\`Vue\`从\`2\`版升级到\`3\`版时（\`hooks\`）可能遭遇的破坏性更新问题。我们确保您的组件不会因此被迫进行不必要的更新或重新开发，从而避免了潜在的项目中断和额外工作量。意味着选择了持续、无忧的项目运行。

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
    console.log('e`,title:"ranui",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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

### debug

console.log some info

## \`event\`

### onchange

Listen for any player changes, and the value returned is as follows.

An 'instance of the player' can be obtained through this method.

Live by 'type' to judge different event types, perform different operations

| property    | explains that                           | is of type |
| `,title:"r-player",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-03-29 11:51:44"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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

### debug

控制台会打印输出一些信息

## 事件\`event\`

### onchange

监听任何播放器发生的变化，返回的值如下。

可通过这个方法获得\`播放器的实例\`。

活着通过\`type\`判断不同的事件类型，进行不同的操作

| 属性        | 说明               | 类型      |
| `,title:"r-player视频播放器",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-03-29 11:51:44"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-03-29 11:51:44"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-03-29 11:51:44"}}]),El={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(n){return n.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Vl(n,e="yyyy-MM-dd hh:mm:ss"){n instanceof Date||(n=new Date(n));const t={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,`${n.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in t)new RegExp(`(${r})`).test(e)&&(e=e.replace(RegExp.$1,RegExp.$1.length===1?t[r]:`00${t[r]}`.substr(`${t[r]}`.length)));return e}const Al={},Rl={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Nl=jn('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Hl=[Nl];function Ol(n,e){return c(),h("svg",Rl,Hl)}const Fl=I(Al,[["render",Ol]]),Mt=n=>(q("data-v-e93b2392"),n=n(),J(),n),Bl={class:"blog-search","data-pagefind-ignore":"all"},jl=Mt(()=>d("span",null,[d("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[d("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),Dl={class:"search-dialog"},Wl={class:"link"},Ul={class:"title"},zl={key:0,class:"date"},Gl=["innerHTML"],ql={class:"command-palette-logo"},Jl={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Ql=Mt(()=>d("span",{class:"command-palette-Label"},"Search by",-1)),Kl=Mt(()=>d("ul",{class:"command-palette-commands"},[d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),d("span",{class:"command-palette-Label"},"to select")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),d("span",{class:"command-palette-Label"},"to navigate")]),d("li",null,[d("kbd",{class:"command-palette-commands-key"},[d("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[d("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[d("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),d("span",{class:"command-palette-Label"},"to close")])],-1)),Zl=k({__name:"Search",setup(n){Dn(L=>({"5b3346c5":m.value}));const e=T([]),t=El,{localeIndex:r,site:a}=nt(),s=$(()=>{var L;return{...t,...((L=t==null?void 0:t.locales)==null?void 0:L[r.value])||{}}}),o=$(()=>{var L;return((L=s.value)==null?void 0:L.showDate)??!0}),l=Tl(),i=$(()=>l.width.value<760),m=$(()=>i.value?0:1),f=$(()=>{var L;return(L=s.value)!=null&&L.heading?s.value.heading.replace(/\{\{searchResult\}\}/,e.value.length):`Total: ${e.value.length} search results.`}),y=T("");he(()=>{y.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const _=T(!1),w=T(""),P=Ll({passive:!1,onEventFired(L){L.ctrlKey&&L.key==="k"&&L.type==="keydown"&&L.preventDefault()}}),g=P["Meta+K"],b=P["Ctrl+K"],R=P.Escape;G(g,L=>{L&&(_.value=!0)}),G(b,L=>{L&&(_.value=!0)}),G(R,L=>{L&&(_.value=!1)});function B(){if(!w.value){e.value=[];return}e.value=tt.value.filter(L=>`${L.meta.description}${L.meta.title}`.includes(w.value)).map(L=>{var O,X;return{...L,meta:{...L.meta,description:((X=(O=L.meta)==null?void 0:O.description)==null?void 0:X.replace(new RegExp(`(${w.value})`,"g"),"<mark>$1</mark>"))||""}}}),e.value.sort((L,O)=>+new Date(O.meta.date)-+new Date(L.meta.date))}const N=$(()=>{var L;return((L=s.value)==null?void 0:L.resultOptimization)??!0});G(()=>w.value,async()=>{var L,O,X;if(!((L=window==null?void 0:window.__pagefind__)!=null&&L.search))B();else{const ue=typeof s.value.customSearchQuery=="function"?s.value.customSearchQuery(w.value):w.value;await((X=(O=window==null?void 0:window.__pagefind__)==null?void 0:O.search)==null?void 0:X.call(O,ue).then(async Q=>{const Ke=(await Promise.all(Q.results.map(K=>K.data()))).map(K=>{var oe;return{route:K.url.startsWith(a.value.base)?K.url:ze(K.url),meta:{title:K.meta.title,description:K.excerpt,date:(oe=K==null?void 0:K.meta)==null?void 0:oe.date}}}).map(K=>{const oe=tt.value.find(Ze=>Ze.route===K.route);return{...K,meta:{...K.meta,...oe==null?void 0:oe.meta}}}).filter(K=>!N.value||tt.value.some(oe=>oe.route===K.route));e.value=Ke.filter(s.value.filter??(()=>!0))}))}de(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(ue=>{ue.setAttribute("aria-disabled","false")})})});function W(L){L.target===L.currentTarget&&(_.value=!1)}G(()=>_.value,L=>{var O;L?de(()=>{var X;(X=document.querySelector("div[command-dialog-mask]"))==null||X.addEventListener("click",W)}):(O=document.querySelector("div[command-dialog-mask]"))==null||O.removeEventListener("click",W)});const z=T(999),te=T(0),Y=$(()=>{const O=te.value%Math.ceil(e.value.length/z.value)*z.value;return e.value.slice(O,O+z.value)}),ne=Wn(),Z=Te();function we(L){_.value=!1,Z.path!==L.value&&ne.go(L.value)}const{lang:ce}=nt(),re=$(()=>s.value.langReload??!0);return G(()=>ce.value,()=>{re.value&&window.location.reload()}),(L,O)=>{var ue;const X=fe("ClientOnly");return c(),h("div",Bl,[d("div",{class:"nav-search-btn-wait",onClick:O[0]||(O[0]=Q=>_.value=!0)},[jl,Fe(d("span",{class:"search-tip"},A(((ue=s.value)==null?void 0:ue.btnPlaceholder)||"Search"),513),[[Be,!i.value]]),Fe(d("span",{class:"metaKey"},A(y.value)+" K ",513),[[Be,!i.value]])]),M(X,null,{default:v(()=>[M(u($e).Dialog,{visible:_.value,theme:"algolia"},Un({header:v(()=>{var Q;return[M(u($e).Input,{value:w.value,"onUpdate:value":O[1]||(O[1]=Ce=>w.value=Ce),placeholder:((Q=s.value)==null?void 0:Q.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:v(()=>[d("div",Dl,[M(u($e).List,null,{default:v(()=>[e.value.length?(c(),C(u($e).Group,{key:1,heading:f.value},{default:v(()=>[(c(!0),h(D,null,ee(Y.value,Q=>(c(),C(u($e).Item,{key:Q.route,"data-value":Q.route,onSelect:we},{default:v(()=>[d("div",Wl,[d("div",Ul,[d("span",null,A(Q.meta.title),1),o.value&&Q.meta.date?(c(),h("span",zl,A(u(Vl)(Q.meta.date,"yyyy-MM-dd")),1)):S("",!0)]),d("div",{class:"des",innerHTML:Q.meta.description},null,8,Gl)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(c(),C(u($e).Empty,{key:0},{default:v(()=>{var Q;return[se(A(((Q=s.value)==null?void 0:Q.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[e.value.length?{name:"footer",fn:v(()=>[d("div",ql,[d("a",Jl,[Ql,M(Fl,{style:{width:"77px"}})])]),Kl]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),Yl=I(Zl,[["__scopeId","data-v-e93b2392"]]),Xl=k({__name:"VPNavBarSocialLinks",setup(n){const{theme:e}=V();return(t,r)=>u(e).socialLinks?(c(),C(St,{key:0,class:"VPNavBarSocialLinks",links:u(e).socialLinks},null,8,["links"])):S("",!0)}}),ec=I(Xl,[["__scopeId","data-v-82f77520"]]),tc=["href","rel","target"],nc={key:1},rc={key:2},ac=k({__name:"VPNavBarTitle",setup(n){const{site:e,theme:t}=V(),{hasSidebar:r}=me(),{currentLang:a}=Ee(),s=$(()=>{var i;return typeof t.value.logoLink=="string"?t.value.logoLink:(i=t.value.logoLink)==null?void 0:i.link}),o=$(()=>{var i;return typeof t.value.logoLink=="string"||(i=t.value.logoLink)==null?void 0:i.rel}),l=$(()=>{var i;return typeof t.value.logoLink=="string"||(i=t.value.logoLink)==null?void 0:i.target});return(i,m)=>(c(),h("div",{class:F(["VPNavBarTitle",{"has-sidebar":u(r)}])},[d("a",{class:"title",href:s.value??u(bt)(u(a).link),rel:o.value,target:l.value},[p(i.$slots,"nav-bar-title-before",{},void 0,!0),u(t).logo?(c(),C(De,{key:0,class:"logo",image:u(t).logo},null,8,["image"])):S("",!0),u(t).siteTitle?(c(),h("span",nc,A(u(t).siteTitle),1)):u(t).siteTitle===void 0?(c(),h("span",rc,A(u(e).title),1)):S("",!0),p(i.$slots,"nav-bar-title-after",{},void 0,!0)],8,tc)],2))}}),sc=I(ac,[["__scopeId","data-v-7a954b5f"]]),oc={class:"items"},ic={class:"title"},lc=k({__name:"VPNavBarTranslations",setup(n){const{theme:e}=V(),{localeLinks:t,currentLang:r}=Ee({correspondingLink:!0});return(a,s)=>u(t).length&&u(r).label?(c(),C($t,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:u(e).langMenuLabel||"Change language"},{default:v(()=>[d("div",oc,[d("p",ic,A(u(r).label),1),(c(!0),h(D,null,ee(u(t),o=>(c(),C(Je,{key:o.link,item:o},null,8,["item"]))),128))])]),_:1},8,["label"])):S("",!0)}}),cc=I(lc,[["__scopeId","data-v-fb4d2d7d"]]),uc=n=>(q("data-v-31960093"),n=n(),J(),n),dc={class:"wrapper"},pc={class:"container"},hc={class:"title"},mc={class:"content"},vc={class:"content-body"},fc=uc(()=>d("div",{class:"divider"},[d("div",{class:"divider-line"})],-1)),gc=k({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(n){const{y:e}=Kt(),{hasSidebar:t}=me(),{frontmatter:r}=V(),a=T({});return Gt(()=>{a.value={"has-sidebar":t.value,home:r.value.layout==="home",top:e.value===0}}),(s,o)=>(c(),h("div",{class:F(["VPNavBar",a.value])},[d("div",dc,[d("div",pc,[d("div",hc,[M(sc,null,{"nav-bar-title-before":v(()=>[p(s.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":v(()=>[p(s.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),d("div",mc,[d("div",vc,[p(s.$slots,"nav-bar-content-before",{},void 0,!0),M(Yl,{class:"search"}),M(No,{class:"menu"}),M(cc,{class:"translations"}),M(Os,{class:"appearance"}),M(ec,{class:"social-links"}),M(ko,{class:"extra"}),p(s.$slots,"nav-bar-content-after",{},void 0,!0),M(Mo,{class:"hamburger",active:s.isScreenOpen,onClick:o[0]||(o[0]=l=>s.$emit("toggle-screen"))},null,8,["active"])])])])]),fc],2))}}),bc=I(gc,[["__scopeId","data-v-31960093"]]),yc={key:0,class:"VPNavScreenAppearance"},_c={class:"text"},kc=k({__name:"VPNavScreenAppearance",setup(n){const{site:e,theme:t}=V();return(r,a)=>u(e).appearance&&u(e).appearance!=="force-dark"?(c(),h("div",yc,[d("p",_c,A(u(t).darkModeSwitchLabel||"Appearance"),1),M(kt)])):S("",!0)}}),wc=I(kc,[["__scopeId","data-v-06f901f4"]]),$c=k({__name:"VPNavScreenMenuLink",props:{item:{}},setup(n){const e=qe("close-screen");return(t,r)=>(c(),C(le,{class:"VPNavScreenMenuLink",href:t.item.link,target:t.item.target,rel:t.item.rel,onClick:u(e)},{default:v(()=>[se(A(t.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Sc=I($c,[["__scopeId","data-v-f5300b2c"]]),Lc=k({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(n){const e=qe("close-screen");return(t,r)=>(c(),C(le,{class:"VPNavScreenMenuGroupLink",href:t.item.link,target:t.item.target,rel:t.item.rel,onClick:u(e)},{default:v(()=>[se(A(t.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Sn=I(Lc,[["__scopeId","data-v-8d1d7be5"]]),xc={class:"VPNavScreenMenuGroupSection"},Mc={key:0,class:"title"},Pc=k({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(n){return(e,t)=>(c(),h("div",xc,[e.text?(c(),h("p",Mc,A(e.text),1)):S("",!0),(c(!0),h(D,null,ee(e.items,r=>(c(),C(Sn,{key:r.text,item:r},null,8,["item"]))),128))]))}}),Cc=I(Pc,[["__scopeId","data-v-549610f5"]]),Ic=n=>(q("data-v-89ff3bed"),n=n(),J(),n),Tc=["aria-controls","aria-expanded"],Ec=["innerHTML"],Vc=Ic(()=>d("span",{class:"vpi-plus button-icon"},null,-1)),Ac=["id"],Rc={key:1,class:"group"},Nc=k({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(n){const e=n,t=T(!1),r=$(()=>`NavScreenGroup-${e.text.replace(" ","-").toLowerCase()}`);function a(){t.value=!t.value}return(s,o)=>(c(),h("div",{class:F(["VPNavScreenMenuGroup",{open:t.value}])},[d("button",{class:"button","aria-controls":r.value,"aria-expanded":t.value,onClick:a},[d("span",{class:"button-text",innerHTML:s.text},null,8,Ec),Vc],8,Tc),d("div",{id:r.value,class:"items"},[(c(!0),h(D,null,ee(s.items,l=>(c(),h(D,{key:l.text},["link"in l?(c(),h("div",{key:l.text,class:"item"},[M(Sn,{item:l},null,8,["item"])])):(c(),h("div",Rc,[M(Cc,{text:l.text,items:l.items},null,8,["text","items"])]))],64))),128))],8,Ac)],2))}}),Hc=I(Nc,[["__scopeId","data-v-89ff3bed"]]),Oc={key:0,class:"VPNavScreenMenu"},Fc=k({__name:"VPNavScreenMenu",setup(n){const{theme:e}=V();return(t,r)=>u(e).nav?(c(),h("nav",Oc,[(c(!0),h(D,null,ee(u(e).nav,a=>(c(),h(D,{key:a.text},["link"in a?(c(),C(Sc,{key:0,item:a},null,8,["item"])):(c(),C(Hc,{key:1,text:a.text||"",items:a.items},null,8,["text","items"]))],64))),128))])):S("",!0)}}),Bc=k({__name:"VPNavScreenSocialLinks",setup(n){const{theme:e}=V();return(t,r)=>u(e).socialLinks?(c(),C(St,{key:0,class:"VPNavScreenSocialLinks",links:u(e).socialLinks},null,8,["links"])):S("",!0)}}),Ln=n=>(q("data-v-1ac923f8"),n=n(),J(),n),jc=Ln(()=>d("span",{class:"vpi-languages icon lang"},null,-1)),Dc=Ln(()=>d("span",{class:"vpi-chevron-down icon chevron"},null,-1)),Wc={class:"list"},Uc=k({__name:"VPNavScreenTranslations",setup(n){const{localeLinks:e,currentLang:t}=Ee({correspondingLink:!0}),r=T(!1);function a(){r.value=!r.value}return(s,o)=>u(e).length&&u(t).label?(c(),h("div",{key:0,class:F(["VPNavScreenTranslations",{open:r.value}])},[d("button",{class:"title",onClick:a},[jc,se(" "+A(u(t).label)+" ",1),Dc]),d("ul",Wc,[(c(!0),h(D,null,ee(u(e),l=>(c(),h("li",{key:l.link,class:"item"},[M(le,{class:"link",href:l.link},{default:v(()=>[se(A(l.text),1)]),_:2},1032,["href"])]))),128))])],2)):S("",!0)}}),zc=I(Uc,[["__scopeId","data-v-1ac923f8"]]),Gc={class:"container"},qc=k({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(n){const e=T(null),t=Xt(xe?document.body:null);return(r,a)=>(c(),C(Ue,{name:"fade",onEnter:a[0]||(a[0]=s=>t.value=!0),onAfterLeave:a[1]||(a[1]=s=>t.value=!1)},{default:v(()=>[r.open?(c(),h("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:e,id:"VPNavScreen"},[d("div",Gc,[p(r.$slots,"nav-screen-content-before",{},void 0,!0),M(Fc,{class:"menu"}),M(zc,{class:"translations"}),M(wc,{class:"appearance"}),M(Bc,{class:"social-links"}),p(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):S("",!0)]),_:3}))}}),Jc=I(qc,[["__scopeId","data-v-004d7def"]]),Qc={key:0,class:"VPNav"},Kc=k({__name:"VPNav",setup(n){const{isScreenOpen:e,closeScreen:t,toggleScreen:r}=xs(),{frontmatter:a}=V(),s=$(()=>a.value.navbar!==!1);return ft("close-screen",t),ke(()=>{xe&&document.documentElement.classList.toggle("hide-nav",!s.value)}),(o,l)=>s.value?(c(),h("header",Qc,[M(bc,{"is-screen-open":u(e),onToggleScreen:u(r)},{"nav-bar-title-before":v(()=>[p(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":v(()=>[p(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":v(()=>[p(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":v(()=>[p(o.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),M(Jc,{open:u(e)},{"nav-screen-content-before":v(()=>[p(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":v(()=>[p(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):S("",!0)}}),Zc=I(Kc,[["__scopeId","data-v-2122d568"]]),xn=n=>(q("data-v-6406e89a"),n=n(),J(),n),Yc=["role","tabindex"],Xc=xn(()=>d("div",{class:"indicator"},null,-1)),eu=xn(()=>d("span",{class:"vpi-chevron-right caret-icon"},null,-1)),tu=[eu],nu={key:1,class:"items"},ru=k({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(n){const e=n,{collapsed:t,collapsible:r,isLink:a,isActiveLink:s,hasActiveLink:o,hasChildren:l,toggle:i}=vr($(()=>e.item)),m=$(()=>l.value?"section":"div"),f=$(()=>a.value?"a":"div"),y=$(()=>l.value?e.depth+2===7?"p":`h${e.depth+2}`:"p"),_=$(()=>a.value?void 0:"button"),w=$(()=>[[`level-${e.depth}`],{collapsible:r.value},{collapsed:t.value},{"is-link":a.value},{"is-active":s.value},{"has-active":o.value}]);function P(b){"key"in b&&b.key!=="Enter"||!e.item.link&&i()}function g(){e.item.link&&i()}return(b,R)=>{const B=fe("VPSidebarItem",!0);return c(),C(Le(m.value),{class:F(["VPSidebarItem",w.value])},{default:v(()=>[b.item.text?(c(),h("div",Ne({key:0,class:"item",role:_.value},zn(b.item.items?{click:P,keydown:P}:{},!0),{tabindex:b.item.items&&0}),[Xc,b.item.link?(c(),C(le,{key:0,tag:f.value,class:"link",href:b.item.link,rel:b.item.rel,target:b.item.target},{default:v(()=>[(c(),C(Le(y.value),{class:"text",innerHTML:b.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(c(),C(Le(y.value),{key:1,class:"text",innerHTML:b.item.text},null,8,["innerHTML"])),b.item.collapsed!=null&&b.item.items&&b.item.items.length?(c(),h("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:g,onKeydown:Gn(g,["enter"]),tabindex:"0"},tu,32)):S("",!0)],16,Yc)):S("",!0),b.item.items&&b.item.items.length?(c(),h("div",nu,[b.depth<5?(c(!0),h(D,{key:0},ee(b.item.items,N=>(c(),C(B,{key:N.text,item:N,depth:b.depth+1},null,8,["item","depth"]))),128)):S("",!0)])):S("",!0)]),_:1},8,["class"])}}}),au=I(ru,[["__scopeId","data-v-6406e89a"]]),Mn=n=>(q("data-v-f9fd69ba"),n=n(),J(),n),su=Mn(()=>d("div",{class:"curtain"},null,-1)),ou={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},iu=Mn(()=>d("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),lu=k({__name:"VPSidebar",props:{open:{type:Boolean}},setup(n){const{sidebarGroups:e,hasSidebar:t}=me(),r=n,a=T(null),s=Xt(xe?document.body:null);return G([r,a],()=>{var o;r.open?(s.value=!0,(o=a.value)==null||o.focus()):s.value=!1},{immediate:!0,flush:"post"}),(o,l)=>u(t)?(c(),h("aside",{key:0,class:F(["VPSidebar",{open:o.open}]),ref_key:"navEl",ref:a,onClick:l[0]||(l[0]=qn(()=>{},["stop"]))},[su,d("nav",ou,[iu,p(o.$slots,"sidebar-nav-before",{},void 0,!0),(c(!0),h(D,null,ee(u(e),i=>(c(),h("div",{key:i.text,class:"group"},[M(au,{item:i,depth:0},null,8,["item"])]))),128)),p(o.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):S("",!0)}}),cu=I(lu,[["__scopeId","data-v-f9fd69ba"]]),uu=k({__name:"VPSkipLink",setup(n){const e=Te(),t=T();G(()=>e.path,()=>t.value.focus());function r({target:a}){const s=document.getElementById(decodeURIComponent(a.hash).slice(1));if(s){const o=()=>{s.removeAttribute("tabindex"),s.removeEventListener("blur",o)};s.setAttribute("tabindex","-1"),s.addEventListener("blur",o),s.focus(),window.scrollTo(0,0)}}return(a,s)=>(c(),h(D,null,[d("span",{ref_key:"backToTop",ref:t,tabindex:"-1"},null,512),d("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),du=I(uu,[["__scopeId","data-v-df15d953"]]),pu=k({__name:"Layout",setup(n){const{isOpen:e,open:t,close:r}=me(),a=Te();G(()=>a.path,r),mr(e,r);const{frontmatter:s}=V(),o=Jn(),l=$(()=>!!o["home-hero-image"]);return ft("hero-image-slot-exists",l),(i,m)=>{const f=fe("Content");return u(s).layout!==!1?(c(),h("div",{key:0,class:F(["Layout",u(s).pageClass])},[p(i.$slots,"layout-top",{},void 0,!0),M(du),M(Xn,{class:"backdrop",show:u(e),onClick:u(r)},null,8,["show","onClick"]),M(Zc,null,{"nav-bar-title-before":v(()=>[p(i.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":v(()=>[p(i.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":v(()=>[p(i.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":v(()=>[p(i.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":v(()=>[p(i.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":v(()=>[p(i.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),M(Ls,{open:u(e),onOpenMenu:u(t)},null,8,["open","onOpenMenu"]),M(cu,{open:u(e)},{"sidebar-nav-before":v(()=>[p(i.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":v(()=>[p(i.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),M(os,{"data-pagefind-body":""},{"page-top":v(()=>[p(i.$slots,"page-top",{},void 0,!0)]),"page-bottom":v(()=>[p(i.$slots,"page-bottom",{},void 0,!0)]),"not-found":v(()=>[p(i.$slots,"not-found",{},void 0,!0)]),"home-hero-before":v(()=>[p(i.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":v(()=>[p(i.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":v(()=>[p(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":v(()=>[p(i.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":v(()=>[p(i.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":v(()=>[p(i.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":v(()=>[p(i.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":v(()=>[p(i.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":v(()=>[p(i.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":v(()=>[p(i.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":v(()=>[p(i.$slots,"doc-before",{},void 0,!0)]),"doc-after":v(()=>[p(i.$slots,"doc-after",{},void 0,!0)]),"doc-top":v(()=>[p(i.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":v(()=>[p(i.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":v(()=>[p(i.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":v(()=>[p(i.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":v(()=>[p(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":v(()=>[p(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":v(()=>[p(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":v(()=>[p(i.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),M(ds),p(i.$slots,"layout-bottom",{},void 0,!0)],2)):(c(),C(f,{key:1}))}}}),hu=I(pu,[["__scopeId","data-v-d6f84447"]]),mu={Layout:hu,enhanceApp:({app:n})=>{n.component("Badge",Kn)}},fu={...mu,enhanceApp({app:n,router:e,siteData:t}){Qn(()=>import("./index.DKC1-TWx.js").then(r=>r.i),__vite__mapDeps([0,1]))}};export{fu as R};
