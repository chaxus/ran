function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/chunks/index.CV-dxUKH.js","assets/chunks/framework.uTpxwq_I.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{d as V,o as p,c as I,r as O,a as Ze,t as ne,n as me,b as z,w as A,e as G,T as Sn,_ as q,u as gn,i as yo,f as ko,g as On,h as x,j as X,k as tt,l as k,m as g,p as Ie,q as Ce,s as St,v as Xn,x as we,y as gt,z as In,A as Wa,B as wo,C as Lo,D as vt,F as pe,E as Pe,G as Cn,H as Tn,I as Y,J as ja,K as $t,L as en,M as dn,N as Ut,O as Eo,P as Ka,Q as So,R as Oo,S as ct,U as Ga,V as An,W as Io,X as Jt,Y as _r,Z as br,$ as Co,a0 as vn,a1 as _n,a2 as To,a3 as Ft,a4 as Ya,a5 as Xa,a6 as Dt,a7 as Ao,a8 as No,a9 as Mo,aa as Po,ab as za,ac as $o,ad as Ro,ae as Fo,af as Do,ag as xo,ah as Vo,ai as Ho,aj as Uo,ak as Bo,al as zn}from"./framework.uTpxwq_I.js";const Wo=V({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(t,n)=>(p(),I("span",{class:me(["VPBadge",t.type])},[O(t.$slots,"default",{},()=>[Ze(ne(t.text),1)])],2))}}),jo={key:0,class:"VPBackdrop"},Ko=V({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(t,n)=>(p(),z(Sn,{name:"fade"},{default:A(()=>[t.show?(p(),I("div",jo)):G("",!0)]),_:1}))}}),Go=q(Ko,[["__scopeId","data-v-498614d6"]]),ae=gn;function Yo(e,t){let n,r=!1;return()=>{n&&clearTimeout(n),r?n=setTimeout(e,t):(e(),(r=!0)&&setTimeout(()=>r=!1,t))}}function qn(e){return/^\//.test(e)?e:`/${e}`}function yr(e){const{pathname:t,search:n,hash:r,protocol:s}=new URL(e,"http://a.com");if(yo(e)||e.startsWith("#")||!s.startsWith("http")||!ko(t))return e;const{site:a}=ae(),o=t.endsWith("/")||t.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${t.replace(/(\.md)?$/,a.value.cleanUrls?"":".html")}${n}${r}`);return On(o)}function tn({removeCurrent:e=!0,correspondingLink:t=!1}={}){const{site:n,localeIndex:r,page:s,theme:a,hash:o}=ae(),i=x(()=>{var c,d;return{label:(c=n.value.locales[r.value])==null?void 0:c.label,link:((d=n.value.locales[r.value])==null?void 0:d.link)||(r.value==="root"?"/":`/${r.value}/`)}});return{localeLinks:x(()=>Object.entries(n.value.locales).flatMap(([c,d])=>e&&i.value.label===d.label?[]:{text:d.label,link:Xo(d.link||(c==="root"?"/":`/${c}/`),a.value.i18nRouting!==!1&&t,s.value.relativePath.slice(i.value.link.length-1),!n.value.cleanUrls)+o.value})),currentLang:i}}function Xo(e,t,n,r){return t?e.replace(/\/$/,"")+qn(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):e}const zo=e=>(Ie("data-v-68c92b82"),e=e(),Ce(),e),qo={class:"NotFound"},Jo={class:"code"},Qo={class:"title"},Zo=zo(()=>k("div",{class:"divider"},null,-1)),ei={class:"quote"},ti={class:"action"},ni=["href","aria-label"],ri=V({__name:"NotFound",setup(e){const{site:t,theme:n}=ae(),{localeLinks:r}=tn({removeCurrent:!1}),s=X("/");return tt(()=>{var o;const a=window.location.pathname.replace(t.value.base,"").replace(/(^.*?\/).*$/,"/$1");r.value.length&&(s.value=((o=r.value.find(({link:i})=>i.startsWith(a)))==null?void 0:o.link)||r.value[0].link)}),(a,o)=>{var i,l,c,d,m;return p(),I("div",qo,[k("p",Jo,ne(((i=g(n).notFound)==null?void 0:i.code)??"404"),1),k("h1",Qo,ne(((l=g(n).notFound)==null?void 0:l.title)??"PAGE NOT FOUND"),1),Zo,k("blockquote",ei,ne(((c=g(n).notFound)==null?void 0:c.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),k("div",ti,[k("a",{class:"link",href:g(On)(s.value),"aria-label":((d=g(n).notFound)==null?void 0:d.linkLabel)??"go to home"},ne(((m=g(n).notFound)==null?void 0:m.linkText)??"Take me home"),9,ni)])])}}}),ai=q(ri,[["__scopeId","data-v-68c92b82"]]);function qa(e,t){if(Array.isArray(e))return hn(e);if(e==null)return[];t=qn(t);const n=Object.keys(e).sort((s,a)=>a.split("/").length-s.split("/").length).find(s=>t.startsWith(qn(s))),r=n?e[n]:[];return Array.isArray(r)?hn(r):hn(r.items,r.base)}function si(e){const t=[];let n=0;for(const r in e){const s=e[r];if(s.items){n=t.push(s);continue}t[n]||t.push({items:[]}),t[n].items.push(s)}return t}function oi(e){const t=[];function n(r){for(const s of r)s.text&&s.link&&t.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&n(s.items)}return n(e),t}function Jn(e,t){return Array.isArray(t)?t.some(n=>Jn(e,n)):St(e,t.link)?!0:t.items?Jn(e,t.items):!1}function hn(e,t){return[...e].map(n=>{const r={...n},s=r.base||t;return s&&r.link&&(r.link=s+r.link),r.items&&(r.items=hn(r.items,s)),r})}function dt(){const{frontmatter:e,page:t,theme:n}=ae(),r=Xn("(min-width: 960px)"),s=X(!1),a=x(()=>{const _=n.value.sidebar,y=t.value.relativePath;return _?qa(_,y):[]}),o=X(a.value);we(a,(_,y)=>{JSON.stringify(_)!==JSON.stringify(y)&&(o.value=a.value)});const i=x(()=>e.value.sidebar!==!1&&o.value.length>0&&e.value.layout!=="home"),l=x(()=>c?e.value.aside==null?n.value.aside==="left":e.value.aside==="left":!1),c=x(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:n.value.aside!==!1),d=x(()=>i.value&&r.value),m=x(()=>i.value?si(o.value):[]);function h(){s.value=!0}function v(){s.value=!1}function S(){s.value?v():h()}return{isOpen:s,sidebar:o,sidebarGroups:m,hasSidebar:i,hasAside:c,leftAside:l,isSidebarEnabled:d,open:h,close:v,toggle:S}}function ii(e,t){let n;gt(()=>{n=e.value?document.activeElement:void 0}),tt(()=>{window.addEventListener("keyup",r)}),In(()=>{window.removeEventListener("keyup",r)});function r(s){s.key==="Escape"&&e.value&&(t(),n==null||n.focus())}}function li(e){const{page:t,hash:n}=ae(),r=X(!1),s=x(()=>e.value.collapsed!=null),a=x(()=>!!e.value.link),o=X(!1),i=()=>{o.value=St(t.value.relativePath,e.value.link)};we([t,e,n],i),tt(i);const l=x(()=>o.value?!0:e.value.items?Jn(t.value.relativePath,e.value.items):!1),c=x(()=>!!(e.value.items&&e.value.items.length));gt(()=>{r.value=!!(s.value&&e.value.collapsed)}),Wa(()=>{(o.value||l.value)&&(r.value=!1)});function d(){s.value&&(r.value=!r.value)}return{collapsed:r,collapsible:s,isLink:a,isActiveLink:o,hasActiveLink:l,hasChildren:c,toggle:d}}function ci(){const{hasSidebar:e}=dt(),t=Xn("(min-width: 960px)"),n=Xn("(min-width: 1280px)");return{isAsideEnabled:x(()=>!n.value&&!t.value?!1:e.value?n.value:t.value)}}const Qn=[];function Ja(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function kr(e){const t=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const r=Number(n.tagName[1]);return{element:n,title:ui(n),link:"#"+n.id,level:r}});return di(t,e)}function ui(e){let t="";for(const n of e.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor")||n.classList.contains("ignore-header"))continue;t+=n.textContent}else n.nodeType===3&&(t+=n.textContent);return t.trim()}function di(e,t){if(t===!1)return[];const n=(typeof t=="object"&&!Array.isArray(t)?t.level:t)||2,[r,s]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;e=e.filter(o=>o.level>=r&&o.level<=s),Qn.length=0;for(const{element:o,link:i}of e)Qn.push({element:o,link:i});const a=[];e:for(let o=0;o<e.length;o++){const i=e[o];if(o===0)a.push(i);else{for(let l=o-1;l>=0;l--){const c=e[l];if(c.level<i.level){(c.children||(c.children=[])).push(i);continue e}}a.push(i)}}return a}function hi(e,t){const{isAsideEnabled:n}=ci(),r=Yo(a,100);let s=null;tt(()=>{requestAnimationFrame(a),window.addEventListener("scroll",r)}),wo(()=>{o(location.hash)}),In(()=>{window.removeEventListener("scroll",r)});function a(){if(!n.value)return;const i=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,d=Math.abs(i+l-c)<1,m=Qn.map(({element:v,link:S})=>({link:S,top:mi(v)})).filter(({top:v})=>!Number.isNaN(v)).sort((v,S)=>v.top-S.top);if(!m.length){o(null);return}if(i<1){o(null);return}if(d){o(m[m.length-1].link);return}let h=null;for(const{link:v,top:S}of m){if(S>i+Lo()+4)break;h=v}o(h)}function o(i){s&&s.classList.remove("active"),i==null?s=null:s=e.value.querySelector(`a[href="${decodeURIComponent(i)}"]`);const l=s;l?(l.classList.add("active"),t.value.style.top=l.offsetTop+39+"px",t.value.style.opacity="1"):(t.value.style.top="33px",t.value.style.opacity="0")}}function mi(e){let t=0;for(;e!==document.body;){if(e===null)return NaN;t+=e.offsetTop,e=e.offsetParent}return t}const fi=["href","title"],pi=V({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function t({target:n}){const r=n.href.split("#")[1],s=document.getElementById(decodeURIComponent(r));s==null||s.focus({preventScroll:!0})}return(n,r)=>{const s=vt("VPDocOutlineItem",!0);return p(),I("ul",{class:me(["VPDocOutlineItem",n.root?"root":"nested"])},[(p(!0),I(pe,null,Pe(n.headers,({children:a,link:o,title:i})=>(p(),I("li",null,[k("a",{class:"outline-link",href:o,onClick:t,title:i},ne(i),9,fi),a!=null&&a.length?(p(),z(s,{key:0,headers:a},null,8,["headers"])):G("",!0)]))),256))],2)}}}),Qa=q(pi,[["__scopeId","data-v-fe46e72d"]]),gi=e=>(Ie("data-v-214ad41f"),e=e(),Ce(),e),vi={class:"content"},_i={class:"outline-title",role:"heading","aria-level":"2"},bi={"aria-labelledby":"doc-outline-aria-label"},yi=gi(()=>k("span",{class:"visually-hidden",id:"doc-outline-aria-label"}," Table of Contents for current page ",-1)),ki=V({__name:"VPDocAsideOutline",setup(e){const{frontmatter:t,theme:n}=ae(),r=Cn([]);Tn(()=>{r.value=kr(t.value.outline??n.value.outline)});const s=X(),a=X();return hi(s,a),(o,i)=>(p(),I("div",{class:me(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:s,role:"navigation"},[k("div",vi,[k("div",{class:"outline-marker",ref_key:"marker",ref:a},null,512),k("div",_i,ne(g(Ja)(g(n))),1),k("nav",bi,[yi,Y(Qa,{headers:r.value,root:!0},null,8,["headers"])])])],2))}}),wi=q(ki,[["__scopeId","data-v-214ad41f"]]),Li={class:"VPDocAsideCarbonAds"},Ei=V({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const t=()=>null;return(n,r)=>(p(),I("div",Li,[Y(g(t),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),Si=e=>(Ie("data-v-fb75ad69"),e=e(),Ce(),e),Oi={class:"VPDocAside"},Ii=Si(()=>k("div",{class:"spacer"},null,-1)),Ci=V({__name:"VPDocAside",setup(e){const{theme:t}=ae();return(n,r)=>(p(),I("div",Oi,[O(n.$slots,"aside-top",{},void 0,!0),O(n.$slots,"aside-outline-before",{},void 0,!0),Y(wi),O(n.$slots,"aside-outline-after",{},void 0,!0),Ii,O(n.$slots,"aside-ads-before",{},void 0,!0),g(t).carbonAds?(p(),z(Ei,{key:0,"carbon-ads":g(t).carbonAds},null,8,["carbon-ads"])):G("",!0),O(n.$slots,"aside-ads-after",{},void 0,!0),O(n.$slots,"aside-bottom",{},void 0,!0)]))}}),Ti=q(Ci,[["__scopeId","data-v-fb75ad69"]]);function Ai(){const{theme:e,page:t}=ae();return x(()=>{const{text:n="Edit this page",pattern:r=""}=e.value.editLink||{};let s;return typeof r=="function"?s=r(t.value):s=r.replace(/:path/g,t.value.filePath),{url:s,text:n}})}function Ni(){const{page:e,theme:t,frontmatter:n}=ae();return x(()=>{var c,d,m,h,v,S,_,y;const r=qa(t.value.sidebar,e.value.relativePath),s=oi(r),a=Mi(s,M=>M.link.replace(/[?#].*$/,"")),o=a.findIndex(M=>St(e.value.relativePath,M.link)),i=((c=t.value.docFooter)==null?void 0:c.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((d=t.value.docFooter)==null?void 0:d.next)===!1&&!n.value.next||n.value.next===!1;return{prev:i?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((m=a[o-1])==null?void 0:m.docFooterText)??((h=a[o-1])==null?void 0:h.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((v=a[o-1])==null?void 0:v.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((S=a[o+1])==null?void 0:S.docFooterText)??((_=a[o+1])==null?void 0:_.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((y=a[o+1])==null?void 0:y.link)}}})}function Mi(e,t){const n=new Set;return e.filter(r=>{const s=t(r);return n.has(s)?!1:n.add(s)})}const qe=V({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const t=e,n=x(()=>t.tag??(t.href?"a":"span")),r=x(()=>t.href&&ja.test(t.href));return(s,a)=>(p(),z($t(n.value),{class:me(["VPLink",{link:s.href,"vp-external-link-icon":r.value,"no-icon":s.noIcon}]),href:s.href?g(yr)(s.href):void 0,target:s.target??(r.value?"_blank":void 0),rel:s.rel??(r.value?"noreferrer":void 0)},{default:A(()=>[O(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Pi={class:"VPLastUpdated"},$i=["datetime"],Ri=V({__name:"VPDocFooterLastUpdated",setup(e){const{theme:t,page:n,frontmatter:r,lang:s}=ae(),a=x(()=>new Date(r.value.lastUpdated??n.value.lastUpdated)),o=x(()=>a.value.toISOString()),i=X("");return tt(()=>{gt(()=>{var l,c,d;i.value=new Intl.DateTimeFormat((c=(l=t.value.lastUpdated)==null?void 0:l.formatOptions)!=null&&c.forceLocale?s.value:void 0,((d=t.value.lastUpdated)==null?void 0:d.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(a.value)})}),(l,c)=>{var d;return p(),I("p",Pi,[Ze(ne(((d=g(t).lastUpdated)==null?void 0:d.text)||g(t).lastUpdatedText||"Last updated")+": ",1),k("time",{datetime:o.value},ne(i.value),9,$i)])}}}),Fi=q(Ri,[["__scopeId","data-v-b451da10"]]),Di=e=>(Ie("data-v-f8aad9a8"),e=e(),Ce(),e),xi={key:0,class:"VPDocFooter"},Vi={key:0,class:"edit-info"},Hi={key:0,class:"edit-link"},Ui=Di(()=>k("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Bi={key:1,class:"last-updated"},Wi={key:1,class:"prev-next"},ji={class:"pager"},Ki=["innerHTML"],Gi=["innerHTML"],Yi={class:"pager"},Xi=["innerHTML"],zi=["innerHTML"],qi=V({__name:"VPDocFooter",setup(e){const{theme:t,page:n,frontmatter:r}=ae(),s=Ai(),a=Ni(),o=x(()=>t.value.editLink&&r.value.editLink!==!1),i=x(()=>n.value.lastUpdated&&r.value.lastUpdated!==!1),l=x(()=>o.value||i.value||a.value.prev||a.value.next);return(c,d)=>{var m,h,v,S;return l.value?(p(),I("footer",xi,[O(c.$slots,"doc-footer-before",{},void 0,!0),o.value||i.value?(p(),I("div",Vi,[o.value?(p(),I("div",Hi,[Y(qe,{class:"edit-link-button",href:g(s).url,"no-icon":!0},{default:A(()=>[Ui,Ze(" "+ne(g(s).text),1)]),_:1},8,["href"])])):G("",!0),i.value?(p(),I("div",Bi,[Y(Fi)])):G("",!0)])):G("",!0),(m=g(a).prev)!=null&&m.link||(h=g(a).next)!=null&&h.link?(p(),I("nav",Wi,[k("div",ji,[(v=g(a).prev)!=null&&v.link?(p(),z(qe,{key:0,class:"pager-link prev",href:g(a).prev.link},{default:A(()=>{var _;return[k("span",{class:"desc",innerHTML:((_=g(t).docFooter)==null?void 0:_.prev)||"Previous page"},null,8,Ki),k("span",{class:"title",innerHTML:g(a).prev.text},null,8,Gi)]}),_:1},8,["href"])):G("",!0)]),k("div",Yi,[(S=g(a).next)!=null&&S.link?(p(),z(qe,{key:0,class:"pager-link next",href:g(a).next.link},{default:A(()=>{var _;return[k("span",{class:"desc",innerHTML:((_=g(t).docFooter)==null?void 0:_.next)||"Next page"},null,8,Xi),k("span",{class:"title",innerHTML:g(a).next.text},null,8,zi)]}),_:1},8,["href"])):G("",!0)])])):G("",!0)])):G("",!0)}}}),Ji=q(qi,[["__scopeId","data-v-f8aad9a8"]]),Qi=e=>(Ie("data-v-338686b3"),e=e(),Ce(),e),Zi={class:"container"},el=Qi(()=>k("div",{class:"aside-curtain"},null,-1)),tl={class:"aside-container"},nl={class:"aside-content"},rl={class:"content"},al={class:"content-container"},sl={class:"main"},ol=V({__name:"VPDoc",setup(e){const{theme:t}=ae(),n=en(),{hasSidebar:r,hasAside:s,leftAside:a}=dt(),o=x(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(i,l)=>{const c=vt("Content");return p(),I("div",{class:me(["VPDoc",{"has-sidebar":g(r),"has-aside":g(s)}])},[O(i.$slots,"doc-top",{},void 0,!0),k("div",Zi,[g(s)?(p(),I("div",{key:0,class:me(["aside",{"left-aside":g(a)}])},[el,k("div",tl,[k("div",nl,[Y(Ti,null,{"aside-top":A(()=>[O(i.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[O(i.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[O(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[O(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[O(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[O(i.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):G("",!0),k("div",rl,[k("div",al,[O(i.$slots,"doc-before",{},void 0,!0),k("main",sl,[Y(c,{class:me(["vp-doc",[o.value,g(t).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),Y(Ji,null,{"doc-footer-before":A(()=>[O(i.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),O(i.$slots,"doc-after",{},void 0,!0)])])]),O(i.$slots,"doc-bottom",{},void 0,!0)],2)}}}),il=q(ol,[["__scopeId","data-v-338686b3"]]),ll=V({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const t=e,n=x(()=>t.href&&ja.test(t.href)),r=x(()=>t.tag||t.href?"a":"button");return(s,a)=>(p(),z($t(r.value),{class:me(["VPButton",[s.size,s.theme]]),href:s.href?g(yr)(s.href):void 0,target:t.target??(n.value?"_blank":void 0),rel:t.rel??(n.value?"noreferrer":void 0)},{default:A(()=>[Ze(ne(s.text),1)]),_:1},8,["class","href","target","rel"]))}}),cl=q(ll,[["__scopeId","data-v-f9e1ada5"]]),ul=["src","alt"],dl=V({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(t,n)=>{const r=vt("VPImage",!0);return t.image?(p(),I(pe,{key:0},[typeof t.image=="string"||"src"in t.image?(p(),I("img",dn({key:0,class:"VPImage"},typeof t.image=="string"?t.$attrs:{...t.image,...t.$attrs},{src:g(On)(typeof t.image=="string"?t.image:t.image.src),alt:t.alt??(typeof t.image=="string"?"":t.image.alt||"")}),null,16,ul)):(p(),I(pe,{key:1},[Y(r,dn({class:"dark",image:t.image.dark,alt:t.image.alt},t.$attrs),null,16,["image","alt"]),Y(r,dn({class:"light",image:t.image.light,alt:t.image.alt},t.$attrs),null,16,["image","alt"])],64))],64)):G("",!0)}}}),bn=q(dl,[["__scopeId","data-v-94f6372a"]]),hl=e=>(Ie("data-v-0cc70a40"),e=e(),Ce(),e),ml={class:"container"},fl={class:"main"},pl={key:0,class:"name"},gl=["innerHTML"],vl=["innerHTML"],_l=["innerHTML"],bl={key:0,class:"actions"},yl={key:0,class:"image"},kl={class:"image-container"},wl=hl(()=>k("div",{class:"image-bg"},null,-1)),Ll=V({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const t=Ut("hero-image-slot-exists");return(n,r)=>(p(),I("div",{class:me(["VPHero",{"has-image":n.image||g(t)}])},[k("div",ml,[k("div",fl,[O(n.$slots,"home-hero-info-before",{},void 0,!0),O(n.$slots,"home-hero-info",{},()=>[n.name?(p(),I("h1",pl,[k("span",{innerHTML:n.name,class:"clip"},null,8,gl)])):G("",!0),n.text?(p(),I("p",{key:1,innerHTML:n.text,class:"text"},null,8,vl)):G("",!0),n.tagline?(p(),I("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,_l)):G("",!0)],!0),O(n.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(p(),I("div",bl,[(p(!0),I(pe,null,Pe(n.actions,s=>(p(),I("div",{key:s.link,class:"action"},[Y(cl,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link,target:s.target,rel:s.rel},null,8,["theme","text","href","target","rel"])]))),128))])):G("",!0),O(n.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||g(t)?(p(),I("div",yl,[k("div",kl,[wl,O(n.$slots,"home-hero-image",{},()=>[n.image?(p(),z(bn,{key:0,class:"image-src",image:n.image},null,8,["image"])):G("",!0)],!0)])])):G("",!0)])],2))}}),El=q(Ll,[["__scopeId","data-v-0cc70a40"]]),Sl=V({__name:"VPHomeHero",setup(e){const{frontmatter:t}=ae();return(n,r)=>g(t).hero?(p(),z(El,{key:0,class:"VPHomeHero",name:g(t).hero.name,text:g(t).hero.text,tagline:g(t).hero.tagline,image:g(t).hero.image,actions:g(t).hero.actions},{"home-hero-info-before":A(()=>[O(n.$slots,"home-hero-info-before")]),"home-hero-info":A(()=>[O(n.$slots,"home-hero-info")]),"home-hero-info-after":A(()=>[O(n.$slots,"home-hero-info-after")]),"home-hero-actions-after":A(()=>[O(n.$slots,"home-hero-actions-after")]),"home-hero-image":A(()=>[O(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):G("",!0)}}),Ol=e=>(Ie("data-v-89e3b892"),e=e(),Ce(),e),Il={class:"box"},Cl={key:0,class:"icon"},Tl=["innerHTML"],Al=["innerHTML"],Nl=["innerHTML"],Ml={key:4,class:"link-text"},Pl={class:"link-text-value"},$l=Ol(()=>k("span",{class:"vpi-arrow-right link-text-icon"},null,-1)),Rl=V({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(t,n)=>(p(),z(qe,{class:"VPFeature",href:t.link,rel:t.rel,target:t.target,"no-icon":!0,tag:t.link?"a":"div"},{default:A(()=>[k("article",Il,[typeof t.icon=="object"&&t.icon.wrap?(p(),I("div",Cl,[Y(bn,{image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])])):typeof t.icon=="object"?(p(),z(bn,{key:1,image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])):t.icon?(p(),I("div",{key:2,class:"icon",innerHTML:t.icon},null,8,Tl)):G("",!0),k("h2",{class:"title",innerHTML:t.title},null,8,Al),t.details?(p(),I("p",{key:3,class:"details",innerHTML:t.details},null,8,Nl)):G("",!0),t.linkText?(p(),I("div",Ml,[k("p",Pl,[Ze(ne(t.linkText)+" ",1),$l])])):G("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Fl=q(Rl,[["__scopeId","data-v-89e3b892"]]),Dl={key:0,class:"VPFeatures"},xl={class:"container"},Vl={class:"items"},Hl=V({__name:"VPFeatures",props:{features:{}},setup(e){const t=e,n=x(()=>{const r=t.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,s)=>r.features?(p(),I("div",Dl,[k("div",xl,[k("div",Vl,[(p(!0),I(pe,null,Pe(r.features,a=>(p(),I("div",{key:a.title,class:me(["item",[n.value]])},[Y(Fl,{icon:a.icon,title:a.title,details:a.details,link:a.link,"link-text":a.linkText,rel:a.rel,target:a.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):G("",!0)}}),Ul=q(Hl,[["__scopeId","data-v-17e64129"]]),Bl=V({__name:"VPHomeFeatures",setup(e){const{frontmatter:t}=ae();return(n,r)=>g(t).features?(p(),z(Ul,{key:0,class:"VPHomeFeatures",features:g(t).features},null,8,["features"])):G("",!0)}}),Wl=V({__name:"VPHomeContent",setup(e){const{width:t}=Eo({includeScrollbar:!1});return(n,r)=>(p(),I("div",{class:"vp-doc container",style:Ka(g(t)?{"--vp-offset":`calc(50% - ${g(t)/2}px)`}:{})},[O(n.$slots,"default",{},void 0,!0)],4))}}),jl=q(Wl,[["__scopeId","data-v-c4390745"]]),Kl={class:"VPHome"},Gl=V({__name:"VPHome",setup(e){const{frontmatter:t}=ae();return(n,r)=>{const s=vt("Content");return p(),I("div",Kl,[O(n.$slots,"home-hero-before",{},void 0,!0),Y(Sl,null,{"home-hero-info-before":A(()=>[O(n.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[O(n.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[O(n.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[O(n.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[O(n.$slots,"home-hero-image",{},void 0,!0)]),_:3}),O(n.$slots,"home-hero-after",{},void 0,!0),O(n.$slots,"home-features-before",{},void 0,!0),Y(Bl),O(n.$slots,"home-features-after",{},void 0,!0),g(t).markdownStyles!==!1?(p(),z(jl,{key:0},{default:A(()=>[Y(s)]),_:1})):(p(),z(s,{key:1}))])}}}),Yl=q(Gl,[["__scopeId","data-v-7f898e13"]]),Xl={},zl={class:"VPPage"};function ql(e,t){const n=vt("Content");return p(),I("div",zl,[O(e.$slots,"page-top"),Y(n),O(e.$slots,"page-bottom")])}const Jl=q(Xl,[["render",ql]]),Ql=V({__name:"VPContent",setup(e){const{page:t,frontmatter:n}=ae(),{hasSidebar:r}=dt();return(s,a)=>(p(),I("div",{class:me(["VPContent",{"has-sidebar":g(r),"is-home":g(n).layout==="home"}]),id:"VPContent"},[g(t).isNotFound?O(s.$slots,"not-found",{key:0},()=>[Y(ai)],!0):g(n).layout==="page"?(p(),z(Jl,{key:1},{"page-top":A(()=>[O(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[O(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):g(n).layout==="home"?(p(),z(Yl,{key:2},{"home-hero-before":A(()=>[O(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[O(s.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[O(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[O(s.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[O(s.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[O(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[O(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[O(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[O(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):g(n).layout&&g(n).layout!=="doc"?(p(),z($t(g(n).layout),{key:3})):(p(),z(il,{key:4},{"doc-top":A(()=>[O(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[O(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":A(()=>[O(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[O(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[O(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":A(()=>[O(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":A(()=>[O(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[O(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[O(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[O(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":A(()=>[O(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Zl=q(Ql,[["__scopeId","data-v-419054b4"]]),ec={class:"container"},tc=["innerHTML"],nc=["innerHTML"],rc=V({__name:"VPFooter",setup(e){const{theme:t,frontmatter:n}=ae(),{hasSidebar:r}=dt();return(s,a)=>g(t).footer&&g(n).footer!==!1?(p(),I("footer",{key:0,class:me(["VPFooter",{"has-sidebar":g(r)}])},[k("div",ec,[g(t).footer.message?(p(),I("p",{key:0,class:"message",innerHTML:g(t).footer.message},null,8,tc)):G("",!0),g(t).footer.copyright?(p(),I("p",{key:1,class:"copyright",innerHTML:g(t).footer.copyright},null,8,nc)):G("",!0)])],2)):G("",!0)}}),ac=q(rc,[["__scopeId","data-v-32cb763e"]]);function sc(){const{theme:e,frontmatter:t}=ae(),n=Cn([]),r=x(()=>n.value.length>0);return Tn(()=>{n.value=kr(t.value.outline??e.value.outline)}),{headers:n,hasLocalNav:r}}const oc=e=>(Ie("data-v-615f1a8e"),e=e(),Ce(),e),ic={class:"menu-text"},lc=oc(()=>k("span",{class:"vpi-chevron-right icon"},null,-1)),cc={class:"header"},uc={class:"outline"},dc=V({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const t=e,{theme:n}=ae(),r=X(!1),s=X(0),a=X(),o=X();So(a,()=>{r.value=!1}),Oo("Escape",()=>{r.value=!1}),Tn(()=>{r.value=!1});function i(){r.value=!r.value,s.value=window.innerHeight+Math.min(window.scrollY-t.navHeight,0)}function l(d){d.target.classList.contains("outline-link")&&(o.value&&(o.value.style.transition="none"),ct(()=>{r.value=!1}))}function c(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(d,m)=>(p(),I("div",{class:"VPLocalNavOutlineDropdown",style:Ka({"--vp-vh":s.value+"px"}),ref_key:"main",ref:a},[d.headers.length>0?(p(),I("button",{key:0,onClick:i,class:me({open:r.value})},[k("span",ic,ne(g(Ja)(g(n))),1),lc],2)):(p(),I("button",{key:1,onClick:c},ne(g(n).returnToTopLabel||"Return to top"),1)),Y(Sn,{name:"flyout"},{default:A(()=>[r.value?(p(),I("div",{key:0,ref_key:"items",ref:o,class:"items",onClick:l},[k("div",cc,[k("a",{class:"top-link",href:"#",onClick:c},ne(g(n).returnToTopLabel||"Return to top"),1)]),k("div",uc,[Y(Qa,{headers:d.headers},null,8,["headers"])])],512)):G("",!0)]),_:1})],4))}}),hc=q(dc,[["__scopeId","data-v-615f1a8e"]]),mc=e=>(Ie("data-v-122da4b9"),e=e(),Ce(),e),fc={class:"container"},pc=["aria-expanded"],gc=mc(()=>k("span",{class:"vpi-align-left menu-icon"},null,-1)),vc={class:"menu-text"},_c=V({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:t,frontmatter:n}=ae(),{hasSidebar:r}=dt(),{headers:s}=sc(),{y:a}=Ga(),o=X(0);tt(()=>{o.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Tn(()=>{s.value=kr(n.value.outline??t.value.outline)});const i=x(()=>s.value.length===0),l=x(()=>i.value&&!r.value),c=x(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:i.value,fixed:l.value}));return(d,m)=>g(n).layout!=="home"&&(!l.value||g(a)>=o.value)?(p(),I("div",{key:0,class:me(c.value)},[k("div",fc,[g(r)?(p(),I("button",{key:0,class:"menu","aria-expanded":d.open,"aria-controls":"VPSidebarNav",onClick:m[0]||(m[0]=h=>d.$emit("open-menu"))},[gc,k("span",vc,ne(g(t).sidebarMenuLabel||"Menu"),1)],8,pc)):G("",!0),Y(hc,{headers:g(s),navHeight:o.value},null,8,["headers","navHeight"])])],2)):G("",!0)}}),bc=q(_c,[["__scopeId","data-v-122da4b9"]]);function yc(){const e=X(!1);function t(){e.value=!0,window.addEventListener("resize",s)}function n(){e.value=!1,window.removeEventListener("resize",s)}function r(){e.value?n():t()}function s(){window.outerWidth>=768&&n()}const a=en();return we(()=>a.path,n),{isScreenOpen:e,openScreen:t,closeScreen:n,toggleScreen:r}}const kc={},wc={class:"VPSwitch",type:"button",role:"switch"},Lc={class:"check"},Ec={key:0,class:"icon"};function Sc(e,t){return p(),I("button",wc,[k("span",Lc,[e.$slots.default?(p(),I("span",Ec,[O(e.$slots,"default",{},void 0,!0)])):G("",!0)])])}const Oc=q(kc,[["render",Sc],["__scopeId","data-v-862f9a62"]]),Za=e=>(Ie("data-v-d474144b"),e=e(),Ce(),e),Ic=Za(()=>k("span",{class:"vpi-sun sun"},null,-1)),Cc=Za(()=>k("span",{class:"vpi-moon moon"},null,-1)),Tc=V({__name:"VPSwitchAppearance",setup(e){const{isDark:t,theme:n}=ae(),r=Ut("toggle-appearance",()=>{t.value=!t.value}),s=x(()=>t.value?n.value.lightModeSwitchTitle||"Switch to light theme":n.value.darkModeSwitchTitle||"Switch to dark theme");return(a,o)=>(p(),z(Oc,{title:s.value,class:"VPSwitchAppearance","aria-checked":g(t),onClick:g(r)},{default:A(()=>[Ic,Cc]),_:1},8,["title","aria-checked","onClick"]))}}),wr=q(Tc,[["__scopeId","data-v-d474144b"]]),Ac={key:0,class:"VPNavBarAppearance"},Nc=V({__name:"VPNavBarAppearance",setup(e){const{site:t}=ae();return(n,r)=>g(t).appearance&&g(t).appearance!=="force-dark"?(p(),I("div",Ac,[Y(wr)])):G("",!0)}}),Mc=q(Nc,[["__scopeId","data-v-84e8d5ca"]]),Lr=X();let es=!1,Vn=0;function Pc(e){const t=X(!1);if(An){!es&&$c(),Vn++;const n=we(Lr,r=>{var s,a,o;r===e.el.value||(s=e.el.value)!=null&&s.contains(r)?(t.value=!0,(a=e.onFocus)==null||a.call(e)):(t.value=!1,(o=e.onBlur)==null||o.call(e))});In(()=>{n(),Vn--,Vn||Rc()})}return Io(t)}function $c(){document.addEventListener("focusin",ts),es=!0,Lr.value=document.activeElement}function Rc(){document.removeEventListener("focusin",ts)}function ts(){Lr.value=document.activeElement}const Fc={class:"VPMenuLink"},Dc=V({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:t}=ae();return(n,r)=>(p(),I("div",Fc,[Y(qe,{class:me({active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:A(()=>[Ze(ne(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Nn=q(Dc,[["__scopeId","data-v-66a7ecc8"]]),xc={class:"VPMenuGroup"},Vc={key:0,class:"title"},Hc=V({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",xc,[t.text?(p(),I("p",Vc,ne(t.text),1)):G("",!0),(p(!0),I(pe,null,Pe(t.items,r=>(p(),I(pe,null,["link"in r?(p(),z(Nn,{key:0,item:r},null,8,["item"])):G("",!0)],64))),256))]))}}),Uc=q(Hc,[["__scopeId","data-v-50d666b7"]]),Bc={class:"VPMenu"},Wc={key:0,class:"items"},jc=V({__name:"VPMenu",props:{items:{}},setup(e){return(t,n)=>(p(),I("div",Bc,[t.items?(p(),I("div",Wc,[(p(!0),I(pe,null,Pe(t.items,r=>(p(),I(pe,{key:r.text},["link"in r?(p(),z(Nn,{key:0,item:r},null,8,["item"])):(p(),z(Uc,{key:1,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):G("",!0),O(t.$slots,"default",{},void 0,!0)]))}}),Kc=q(jc,[["__scopeId","data-v-f60354c4"]]),Gc=e=>(Ie("data-v-a5a93ab9"),e=e(),Ce(),e),Yc=["aria-expanded","aria-label"],Xc={key:0,class:"text"},zc=["innerHTML"],qc=Gc(()=>k("span",{class:"vpi-chevron-down text-icon"},null,-1)),Jc={key:1,class:"vpi-more-horizontal icon"},Qc={class:"menu"},Zc=V({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const t=X(!1),n=X();Pc({el:n,onBlur:r});function r(){t.value=!1}return(s,a)=>(p(),I("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:a[1]||(a[1]=o=>t.value=!0),onMouseleave:a[2]||(a[2]=o=>t.value=!1)},[k("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":t.value,"aria-label":s.label,onClick:a[0]||(a[0]=o=>t.value=!t.value)},[s.button||s.icon?(p(),I("span",Xc,[s.icon?(p(),I("span",{key:0,class:me([s.icon,"option-icon"])},null,2)):G("",!0),s.button?(p(),I("span",{key:1,innerHTML:s.button},null,8,zc)):G("",!0),qc])):(p(),I("span",Jc))],8,Yc),k("div",Qc,[Y(Kc,{items:s.items},{default:A(()=>[O(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Er=q(Zc,[["__scopeId","data-v-a5a93ab9"]]),eu=["href","aria-label","innerHTML"],tu=V({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const t=e,n=x(()=>typeof t.icon=="object"?t.icon.svg:`<span class="vpi-social-${t.icon}" />`);return(r,s)=>(p(),I("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,eu))}}),nu=q(tu,[["__scopeId","data-v-b8a4b57d"]]),ru={class:"VPSocialLinks"},au=V({__name:"VPSocialLinks",props:{links:{}},setup(e){return(t,n)=>(p(),I("div",ru,[(p(!0),I(pe,null,Pe(t.links,({link:r,icon:s,ariaLabel:a})=>(p(),z(nu,{key:r,icon:s,link:r,ariaLabel:a},null,8,["icon","link","ariaLabel"]))),128))]))}}),Sr=q(au,[["__scopeId","data-v-87c97190"]]),su={key:0,class:"group translations"},ou={class:"trans-title"},iu={key:1,class:"group"},lu={class:"item appearance"},cu={class:"label"},uu={class:"appearance-action"},du={key:2,class:"group"},hu={class:"item social-links"},mu=V({__name:"VPNavBarExtra",setup(e){const{site:t,theme:n}=ae(),{localeLinks:r,currentLang:s}=tn({correspondingLink:!0}),a=x(()=>r.value.length&&s.value.label||t.value.appearance||n.value.socialLinks);return(o,i)=>a.value?(p(),z(Er,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:A(()=>[g(r).length&&g(s).label?(p(),I("div",su,[k("p",ou,ne(g(s).label),1),(p(!0),I(pe,null,Pe(g(r),l=>(p(),z(Nn,{key:l.link,item:l},null,8,["item"]))),128))])):G("",!0),g(t).appearance&&g(t).appearance!=="force-dark"?(p(),I("div",iu,[k("div",lu,[k("p",cu,ne(g(n).darkModeSwitchLabel||"Appearance"),1),k("div",uu,[Y(wr)])])])):G("",!0),g(n).socialLinks?(p(),I("div",du,[k("div",hu,[Y(Sr,{class:"social-links-list",links:g(n).socialLinks},null,8,["links"])])])):G("",!0)]),_:1})):G("",!0)}}),fu=q(mu,[["__scopeId","data-v-94e64718"]]),pu=e=>(Ie("data-v-68ba3f98"),e=e(),Ce(),e),gu=["aria-expanded"],vu=pu(()=>k("span",{class:"container"},[k("span",{class:"top"}),k("span",{class:"middle"}),k("span",{class:"bottom"})],-1)),_u=[vu],bu=V({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(t,n)=>(p(),I("button",{type:"button",class:me(["VPNavBarHamburger",{active:t.active}]),"aria-label":"mobile navigation","aria-expanded":t.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=r=>t.$emit("click"))},_u,10,gu))}}),yu=q(bu,[["__scopeId","data-v-68ba3f98"]]),ku=["innerHTML"],wu=V({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:t}=ae();return(n,r)=>(p(),z(qe,{class:me({VPNavBarMenuLink:!0,active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,noIcon:n.item.noIcon,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:A(()=>[k("span",{innerHTML:n.item.text},null,8,ku)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Lu=q(wu,[["__scopeId","data-v-c0386b04"]]),Eu=V({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const t=e,{page:n}=ae(),r=a=>"link"in a?St(n.value.relativePath,a.link,!!t.item.activeMatch):a.items.some(r),s=x(()=>r(t.item));return(a,o)=>(p(),z(Er,{class:me({VPNavBarMenuGroup:!0,active:g(St)(g(n).relativePath,a.item.activeMatch,!!a.item.activeMatch)||s.value}),button:a.item.text,items:a.item.items},null,8,["class","button","items"]))}}),Su=e=>(Ie("data-v-94e9f52d"),e=e(),Ce(),e),Ou={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Iu=Su(()=>k("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),Cu=V({__name:"VPNavBarMenu",setup(e){const{theme:t}=ae();return(n,r)=>g(t).nav?(p(),I("nav",Ou,[Iu,(p(!0),I(pe,null,Pe(g(t).nav,s=>(p(),I(pe,{key:s.text},["link"in s?(p(),z(Lu,{key:0,item:s},null,8,["item"])):(p(),z(Eu,{key:1,item:s},null,8,["item"]))],64))),128))])):G("",!0)}}),Tu=q(Cu,[["__scopeId","data-v-94e9f52d"]]);var Fr;const ns=typeof window<"u",Au=e=>typeof e=="string",mn=()=>{};ns&&((Fr=window==null?void 0:window.navigator)!=null&&Fr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function Zn(e){return typeof e=="function"?e():g(e)}function Nu(e,t){function n(...r){e(()=>t.apply(this,r),{fn:t,thisArg:this,args:r})}return n}function Mu(e,t={}){let n,r;return s=>{const a=Zn(e),o=Zn(t.maxWait);if(n&&clearTimeout(n),a<=0||o!==void 0&&o<=0)return r&&(clearTimeout(r),r=null),s();o&&!r&&(r=setTimeout(()=>{n&&clearTimeout(n),r=null,s()},o)),n=setTimeout(()=>{r&&clearTimeout(r),r=null,s()},a)}}function Pu(e){return e}function $u(e){return Ya()?(Xa(e),!0):!1}function rs(e,t=200,n={}){return Nu(Mu(t,n),e)}function Hn(e,t=200,n={}){if(t<=0)return e;const r=X(e.value),s=rs(()=>{r.value=e.value},t,n);return we(e,()=>s()),r}function as(e,t,n){return we(e,(r,s,a)=>{r&&t(r,s,a)},n)}function Ru(e){var t;const n=Zn(e);return(t=n==null?void 0:n.$el)!=null?t:n}const ss=ns?window:void 0;function ln(...e){let t,n,r,s;if(Au(e[0])?([n,r,s]=e,t=ss):[t,n,r,s]=e,!t)return mn;let a=mn;const o=we(()=>Ru(t),l=>{a(),l&&(l.addEventListener(n,r,s),a=()=>{l.removeEventListener(n,r,s),a=mn})},{immediate:!0,flush:"post"}),i=()=>{o(),a()};return $u(i),i}const Dr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},xr="__vueuse_ssr_handlers__";Dr[xr]=Dr[xr]||{};const Fu={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Du(e={}){const{reactive:t=!1,target:n=ss,aliasMap:r=Fu,passive:s=!0,onEventFired:a=mn}=e,o=Jt(new Set),i={toJSON(){return{}},current:o},l=t?Jt(i):i,c=new Set,d=new Set;function m(_,y){_ in l&&(t?l[_]=y:l[_].value=y)}function h(){for(const _ of d)m(_,!1)}function v(_,y){var M,W;const b=(M=_.key)==null?void 0:M.toLowerCase(),L=[(W=_.code)==null?void 0:W.toLowerCase(),b].filter(Boolean);b&&(y?o.add(b):o.delete(b));for(const N of L)d.add(N),m(N,y);b==="meta"&&!y?(c.forEach(N=>{o.delete(N),m(N,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&y&&[...o,...L].forEach(N=>c.add(N))}ln(n,"keydown",_=>(v(_,!0),a(_)),{passive:s}),ln(n,"keyup",_=>(v(_,!1),a(_)),{passive:s}),ln("blur",h,{passive:!0}),ln("focus",h,{passive:!0});const S=new Proxy(l,{get(_,y,M){if(typeof y!="string")return Reflect.get(_,y,M);if(y=y.toLowerCase(),y in r&&(y=r[y]),!(y in l))if(/[+_-]/.test(y)){const b=y.split(/[+_-]/g).map(L=>L.trim());l[y]=x(()=>b.every(L=>g(S[L])))}else l[y]=X(!1);const W=Reflect.get(_,y,M);return t?g(W):W}});return S}var Vr;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Vr||(Vr={}));var xu=Object.defineProperty,Hr=Object.getOwnPropertySymbols,Vu=Object.prototype.hasOwnProperty,Hu=Object.prototype.propertyIsEnumerable,Ur=(e,t,n)=>t in e?xu(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Uu=(e,t)=>{for(var n in t||(t={}))Vu.call(t,n)&&Ur(e,n,t[n]);if(Hr)for(var n of Hr(t))Hu.call(t,n)&&Ur(e,n,t[n]);return e};const Bu={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Uu({linear:Pu},Bu);function ut(e){return Array.isArray?Array.isArray(e):ls(e)==="[object Array]"}const Wu=1/0;function ju(e){if(typeof e=="string")return e;let t=e+"";return t=="0"&&1/e==-Wu?"-0":t}function Ku(e){return e==null?"":ju(e)}function Xe(e){return typeof e=="string"}function os(e){return typeof e=="number"}function Gu(e){return e===!0||e===!1||Yu(e)&&ls(e)=="[object Boolean]"}function is(e){return typeof e=="object"}function Yu(e){return is(e)&&e!==null}function De(e){return e!=null}function Un(e){return!e.trim().length}function ls(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const Xu="Incorrect 'index' type",zu=e=>`Invalid value for key ${e}`,qu=e=>`Pattern length exceeds max of ${e}.`,Ju=e=>`Missing ${e} property in key`,Qu=e=>`Property 'weight' in key '${e}' must be a positive integer`,Br=Object.prototype.hasOwnProperty;class Zu{constructor(t){this._keys=[],this._keyMap={};let n=0;t.forEach(r=>{let s=cs(r);n+=s.weight,this._keys.push(s),this._keyMap[s.id]=s,n+=s.weight}),this._keys.forEach(r=>{r.weight/=n})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function cs(e){let t=null,n=null,r=null,s=1,a=null;if(Xe(e)||ut(e))r=e,t=Wr(e),n=er(e);else{if(!Br.call(e,"name"))throw new Error(Ju("name"));const o=e.name;if(r=o,Br.call(e,"weight")&&(s=e.weight,s<=0))throw new Error(Qu(o));t=Wr(o),n=er(o),a=e.getFn}return{path:t,id:n,weight:s,src:r,getFn:a}}function Wr(e){return ut(e)?e:e.split(".")}function er(e){return ut(e)?e.join("."):e}function ed(e,t){let n=[],r=!1;const s=(a,o,i)=>{if(De(a))if(!o[i])n.push(a);else{let l=o[i];const c=a[l];if(!De(c))return;if(i===o.length-1&&(Xe(c)||os(c)||Gu(c)))n.push(Ku(c));else if(ut(c)){r=!0;for(let d=0,m=c.length;d<m;d+=1)s(c[d],o,i+1)}else o.length&&s(c,o,i+1)}};return s(e,Xe(t)?t.split("."):t,0),r?n:n[0]}const td={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},nd={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},rd={location:0,threshold:.6,distance:100},ad={useExtendedSearch:!1,getFn:ed,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var ee={...nd,...td,...rd,...ad};const sd=/[^ ]+/g;function od(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(s){const a=s.match(sd).length;if(n.has(a))return n.get(a);const o=1/Math.pow(a,.5*e),i=parseFloat(Math.round(o*r)/r);return n.set(a,i),i},clear(){n.clear()}}}class Or{constructor({getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){this.norm=od(n,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((n,r)=>{this._keysMap[n.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,Xe(this.docs[0])?this.docs.forEach((t,n)=>{this._addString(t,n)}):this.docs.forEach((t,n)=>{this._addObject(t,n)}),this.norm.clear())}add(t){const n=this.size();Xe(t)?this._addString(t,n):this._addObject(t,n)}removeAt(t){this.records.splice(t,1);for(let n=t,r=this.size();n<r;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(t,n){return t[this._keysMap[n]]}size(){return this.records.length}_addString(t,n){if(!De(t)||Un(t))return;let r={v:t,i:n,n:this.norm.get(t)};this.records.push(r)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach((s,a)=>{let o=s.getFn?s.getFn(t):this.getFn(t,s.path);if(De(o)){if(ut(o)){let i=[];const l=[{nestedArrIndex:-1,value:o}];for(;l.length;){const{nestedArrIndex:c,value:d}=l.pop();if(De(d))if(Xe(d)&&!Un(d)){let m={v:d,i:c,n:this.norm.get(d)};i.push(m)}else ut(d)&&d.forEach((m,h)=>{l.push({nestedArrIndex:h,value:m})})}r.$[a]=i}else if(Xe(o)&&!Un(o)){let i={v:o,n:this.norm.get(o)};r.$[a]=i}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function us(e,t,{getFn:n=ee.getFn,fieldNormWeight:r=ee.fieldNormWeight}={}){const s=new Or({getFn:n,fieldNormWeight:r});return s.setKeys(e.map(cs)),s.setSources(t),s.create(),s}function id(e,{getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){const{keys:r,records:s}=e,a=new Or({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(s),a}function cn(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:s=ee.distance,ignoreLocation:a=ee.ignoreLocation}={}){const o=t/e.length;if(a)return o;const i=Math.abs(r-n);return s?o+i/s:i?1:o}function ld(e=[],t=ee.minMatchCharLength){let n=[],r=-1,s=-1,a=0;for(let o=e.length;a<o;a+=1){let i=e[a];i&&r===-1?r=a:!i&&r!==-1&&(s=a-1,s-r+1>=t&&n.push([r,s]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}const Et=32;function cd(e,t,n,{location:r=ee.location,distance:s=ee.distance,threshold:a=ee.threshold,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,includeMatches:l=ee.includeMatches,ignoreLocation:c=ee.ignoreLocation}={}){if(t.length>Et)throw new Error(qu(Et));const d=t.length,m=e.length,h=Math.max(0,Math.min(r,m));let v=a,S=h;const _=i>1||l,y=_?Array(m):[];let M;for(;(M=e.indexOf(t,S))>-1;){let P=cn(t,{currentLocation:M,expectedLocation:h,distance:s,ignoreLocation:c});if(v=Math.min(P,v),S=M+d,_){let F=0;for(;F<d;)y[M+F]=1,F+=1}}S=-1;let W=[],b=1,L=d+m;const N=1<<d-1;for(let P=0;P<d;P+=1){let F=0,$=L;for(;F<$;)cn(t,{errors:P,currentLocation:h+$,expectedLocation:h,distance:s,ignoreLocation:c})<=v?F=$:L=$,$=Math.floor((L-F)/2+F);L=$;let ue=Math.max(1,h-$+1),be=o?m:Math.min(h+$,m)+d,Q=Array(be+2);Q[be+1]=(1<<P)-1;for(let D=be;D>=ue;D-=1){let se=D-1,ke=n[e.charAt(se)];if(_&&(y[se]=+!!ke),Q[D]=(Q[D+1]<<1|1)&ke,P&&(Q[D]|=(W[D+1]|W[D])<<1|1|W[D+1]),Q[D]&N&&(b=cn(t,{errors:P,currentLocation:se,expectedLocation:h,distance:s,ignoreLocation:c}),b<=v)){if(v=b,S=se,S<=h)break;ue=Math.max(1,2*h-S)}}if(cn(t,{errors:P+1,currentLocation:h,expectedLocation:h,distance:s,ignoreLocation:c})>v)break;W=Q}const C={isMatch:S>=0,score:Math.max(.001,b)};if(_){const P=ld(y,i);P.length?l&&(C.indices=P):C.isMatch=!1}return C}function ud(e){let t={};for(let n=0,r=e.length;n<r;n+=1){const s=e.charAt(n);t[s]=(t[s]||0)|1<<r-n-1}return t}class ds{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){if(this.options={location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c},this.pattern=l?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const d=(h,v)=>{this.chunks.push({pattern:h,alphabet:ud(h),startIndex:v})},m=this.pattern.length;if(m>Et){let h=0;const v=m%Et,S=m-v;for(;h<S;)d(this.pattern.substr(h,Et),h),h+=Et;if(v){const _=m-Et;d(this.pattern.substr(_),_)}}else d(this.pattern,0)}searchIn(t){const{isCaseSensitive:n,includeMatches:r}=this.options;if(n||(t=t.toLowerCase()),this.pattern===t){let S={isMatch:!0,score:0};return r&&(S.indices=[[0,t.length-1]]),S}const{location:s,distance:a,threshold:o,findAllMatches:i,minMatchCharLength:l,ignoreLocation:c}=this.options;let d=[],m=0,h=!1;this.chunks.forEach(({pattern:S,alphabet:_,startIndex:y})=>{const{isMatch:M,score:W,indices:b}=cd(t,S,_,{location:s+y,distance:a,threshold:o,findAllMatches:i,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});M&&(h=!0),m+=W,M&&b&&(d=[...d,...b])});let v={isMatch:h,score:h?m/this.chunks.length:1};return h&&r&&(v.indices=d),v}}class _t{constructor(t){this.pattern=t}static isMultiMatch(t){return jr(t,this.multiRegex)}static isSingleMatch(t){return jr(t,this.singleRegex)}search(){}}function jr(e,t){const n=e.match(t);return n?n[1]:null}class dd extends _t{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const n=t===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class hd extends _t{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const n=t.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class md extends _t{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const n=t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class fd extends _t{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const n=!t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class pd extends _t{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const n=t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class gd extends _t{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const n=!t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class hs extends _t{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){super(t),this._bitapSearch=new ds(t,{location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class ms extends _t{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let n=0,r;const s=[],a=this.pattern.length;for(;(r=t.indexOf(this.pattern,n))>-1;)n=r+a,s.push([r,n-1]);const o=!!s.length;return{isMatch:o,score:o?0:1,indices:s}}}const tr=[dd,ms,md,fd,gd,pd,hd,hs],Kr=tr.length,vd=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,_d="|";function bd(e,t={}){return e.split(_d).map(n=>{let r=n.trim().split(vd).filter(a=>a&&!!a.trim()),s=[];for(let a=0,o=r.length;a<o;a+=1){const i=r[a];let l=!1,c=-1;for(;!l&&++c<Kr;){const d=tr[c];let m=d.isMultiMatch(i);m&&(s.push(new d(m,t)),l=!0)}if(!l)for(c=-1;++c<Kr;){const d=tr[c];let m=d.isSingleMatch(i);if(m){s.push(new d(m,t));break}}}return s})}const yd=new Set([hs.type,ms.type]);class kd{constructor(t,{isCaseSensitive:n=ee.isCaseSensitive,includeMatches:r=ee.includeMatches,minMatchCharLength:s=ee.minMatchCharLength,ignoreLocation:a=ee.ignoreLocation,findAllMatches:o=ee.findAllMatches,location:i=ee.location,threshold:l=ee.threshold,distance:c=ee.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:r,minMatchCharLength:s,findAllMatches:o,ignoreLocation:a,location:i,threshold:l,distance:c},this.pattern=n?t:t.toLowerCase(),this.query=bd(this.pattern,this.options)}static condition(t,n){return n.useExtendedSearch}searchIn(t){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:s}=this.options;t=s?t:t.toLowerCase();let a=0,o=[],i=0;for(let l=0,c=n.length;l<c;l+=1){const d=n[l];o.length=0,a=0;for(let m=0,h=d.length;m<h;m+=1){const v=d[m],{isMatch:S,indices:_,score:y}=v.search(t);if(S){if(a+=1,i+=y,r){const M=v.constructor.type;yd.has(M)?o=[...o,..._]:o.push(_)}}else{i=0,a=0,o.length=0;break}}if(a){let m={isMatch:!0,score:i/a};return r&&(m.indices=o),m}}return{isMatch:!1,score:1}}}const nr=[];function wd(...e){nr.push(...e)}function rr(e,t){for(let n=0,r=nr.length;n<r;n+=1){let s=nr[n];if(s.condition(e,t))return new s(e,t)}return new ds(e,t)}const yn={AND:"$and",OR:"$or"},ar={PATH:"$path",PATTERN:"$val"},sr=e=>!!(e[yn.AND]||e[yn.OR]),Ld=e=>!!e[ar.PATH],Ed=e=>!ut(e)&&is(e)&&!sr(e),Gr=e=>({[yn.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function fs(e,t,{auto:n=!0}={}){const r=s=>{let a=Object.keys(s);const o=Ld(s);if(!o&&a.length>1&&!sr(s))return r(Gr(s));if(Ed(s)){const l=o?s[ar.PATH]:a[0],c=o?s[ar.PATTERN]:s[l];if(!Xe(c))throw new Error(zu(l));const d={keyId:er(l),pattern:c};return n&&(d.searcher=rr(c,t)),d}let i={children:[],operator:a[0]};return a.forEach(l=>{const c=s[l];ut(c)&&c.forEach(d=>{i.children.push(r(d))})}),i};return sr(e)||(e=Gr(e)),r(e)}function Sd(e,{ignoreFieldNorm:t=ee.ignoreFieldNorm}){e.forEach(n=>{let r=1;n.matches.forEach(({key:s,norm:a,score:o})=>{const i=s?s.weight:null;r*=Math.pow(o===0&&i?Number.EPSILON:o,(i||1)*(t?1:a))}),n.score=r})}function Od(e,t){const n=e.matches;t.matches=[],De(n)&&n.forEach(r=>{if(!De(r.indices)||!r.indices.length)return;const{indices:s,value:a}=r;let o={indices:s,value:a};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),t.matches.push(o)})}function Id(e,t){t.score=e.score}function Cd(e,t,{includeMatches:n=ee.includeMatches,includeScore:r=ee.includeScore}={}){const s=[];return n&&s.push(Od),r&&s.push(Id),e.map(a=>{const{idx:o}=a,i={item:t[o],refIndex:o};return s.length&&s.forEach(l=>{l(a,i)}),i})}class Ot{constructor(t,n={},r){this.options={...ee,...n},this.options.useExtendedSearch,this._keyStore=new Zu(this.options.keys),this.setCollection(t,r)}setCollection(t,n){if(this._docs=t,n&&!(n instanceof Or))throw new Error(Xu);this._myIndex=n||us(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){!De(t)||(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const n=[];for(let r=0,s=this._docs.length;r<s;r+=1){const a=this._docs[r];t(a,r)&&(this.removeAt(r),r-=1,s-=1,n.push(a))}return n}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:n=-1}={}){const{includeMatches:r,includeScore:s,shouldSort:a,sortFn:o,ignoreFieldNorm:i}=this.options;let l=Xe(t)?Xe(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Sd(l,{ignoreFieldNorm:i}),a&&l.sort(o),os(n)&&n>-1&&(l=l.slice(0,n)),Cd(l,this._docs,{includeMatches:r,includeScore:s})}_searchStringList(t){const n=rr(t,this.options),{records:r}=this._myIndex,s=[];return r.forEach(({v:a,i:o,n:i})=>{if(!De(a))return;const{isMatch:l,score:c,indices:d}=n.searchIn(a);l&&s.push({item:a,idx:o,matches:[{score:c,value:a,norm:i,indices:d}]})}),s}_searchLogical(t){const n=fs(t,this.options),r=(i,l,c)=>{if(!i.children){const{keyId:m,searcher:h}=i,v=this._findMatches({key:this._keyStore.get(m),value:this._myIndex.getValueForItemAtKeyId(l,m),searcher:h});return v&&v.length?[{idx:c,item:l,matches:v}]:[]}const d=[];for(let m=0,h=i.children.length;m<h;m+=1){const v=i.children[m],S=r(v,l,c);if(S.length)d.push(...S);else if(i.operator===yn.AND)return[]}return d},s=this._myIndex.records,a={},o=[];return s.forEach(({$:i,i:l})=>{if(De(i)){let c=r(n,i,l);c.length&&(a[l]||(a[l]={idx:l,item:i,matches:[]},o.push(a[l])),c.forEach(({matches:d})=>{a[l].matches.push(...d)}))}}),o}_searchObjectList(t){const n=rr(t,this.options),{keys:r,records:s}=this._myIndex,a=[];return s.forEach(({$:o,i})=>{if(!De(o))return;let l=[];r.forEach((c,d)=>{l.push(...this._findMatches({key:c,value:o[d],searcher:n}))}),l.length&&a.push({idx:i,item:o,matches:l})}),a}_findMatches({key:t,value:n,searcher:r}){if(!De(n))return[];let s=[];if(ut(n))n.forEach(({v:a,i:o,n:i})=>{if(!De(a))return;const{isMatch:l,score:c,indices:d}=r.searchIn(a);l&&s.push({score:c,key:t,value:a,idx:o,norm:i,indices:d})});else{const{v:a,n:o}=n,{isMatch:i,score:l,indices:c}=r.searchIn(a);i&&s.push({score:l,key:t,value:a,norm:o,indices:c})}return s}}Ot.version="6.6.2";Ot.createIndex=us;Ot.parseIndex=id;Ot.config=ee;Ot.parseQuery=fs;wd(kd);const Yr=Jt({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Bt=()=>({isSearching:x(()=>Yr.search!==""),...To(Yr)});function Td(e){return{all:e=e||new Map,on:function(t,n){var r=e.get(t);r?r.push(n):e.set(t,[n])},off:function(t,n){var r=e.get(t);r&&(n?r.splice(r.indexOf(n)>>>0,1):e.set(t,[]))},emit:function(t,n){var r=e.get(t);r&&r.slice().map(function(s){s(n)}),(r=e.get("*"))&&r.slice().map(function(s){s(t,n)})}}}const Ad=Td(),Mn=()=>({emitter:Ad});function Nd(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return n;n=n.nextElementSibling}}function Md(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}const Pd=["command-theme"],$d={"command-root":""},Rd=V({name:"Command"}),Fd=V({...Rd,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(e,{emit:t}){const n=e,r='[command-item=""]',s="command-item-key",a='[command-group=""]',o="command-group-key",i='[command-group-heading=""]',l=`${r}:not([aria-disabled="true"])`,c=`${r}[aria-selected="true"]`,d="command-item-select",m="data-value";_r("theme",n.theme||"default");const{selectedNode:h,search:v,dataValue:S,filtered:_}=Bt(),{emitter:y}=Mn(),M=X(),W=Hn(X(new Map),333),b=Hn(X(new Set),333),L=Hn(X(new Map)),N=x(()=>{const j=[];for(const[ie,oe]of W.value.entries())j.push({key:ie,label:oe});return j}),C=x(()=>{const j=Ot.createIndex(n.fuseOptions.keys,N.value);return new Ot(N.value,n.fuseOptions,j)}),P=()=>{var j,ie,oe;const de=F();de&&(((j=de.parentElement)==null?void 0:j.firstElementChild)===de&&((oe=(ie=de.closest(a))==null?void 0:ie.querySelector(i))==null||oe.scrollIntoView({block:"nearest"})),de.scrollIntoView({block:"nearest"}))},F=()=>{var j;return(j=M.value)==null?void 0:j.querySelector(c)},$=(j=M.value)=>{const ie=j==null?void 0:j.querySelectorAll(l);return ie?Array.from(ie):[]},ue=()=>{var j;const ie=(j=M.value)==null?void 0:j.querySelectorAll(a);return ie?Array.from(ie):[]},be=()=>{const[j]=$();j&&j.getAttribute(s)&&(h.value=j.getAttribute(s)||"")},Q=j=>{const ie=$()[j];ie&&(h.value=ie.getAttribute(s)||"")},D=j=>{const ie=F(),oe=$(),de=oe.findIndex(xe=>xe===ie),Fe=oe[de+j];Fe?h.value=Fe.getAttribute(s)||"":j>0?Q(0):Q(oe.length-1)},se=j=>{const ie=F();let oe=ie==null?void 0:ie.closest(a),de=null;for(;oe&&!de;)oe=j>0?Nd(oe,a):Md(oe,a),de=oe==null?void 0:oe.querySelector(l);de?h.value=de.getAttribute(s)||"":D(j)},ke=()=>Q(0),Ee=()=>Q($().length-1),ge=j=>{j.preventDefault(),j.metaKey?Ee():j.altKey?se(1):D(1)},He=j=>{j.preventDefault(),j.metaKey?ke():j.altKey?se(-1):D(-1)},je=j=>{switch(j.key){case"n":case"j":{j.ctrlKey&&ge(j);break}case"ArrowDown":{ge(j);break}case"p":case"k":{j.ctrlKey&&He(j);break}case"ArrowUp":{He(j);break}case"Home":{ke();break}case"End":{Ee();break}case"Enter":{const ie=F();if(ie){const oe=new Event(d);ie.dispatchEvent(oe)}}}},_e=()=>{if(!v.value){_.value.count=b.value.size;return}_.value.groups=new Set("");const j=new Map,ie=C.value.search(v.value).map(oe=>oe.item);for(const{key:oe,label:de}of ie)j.set(oe,de);for(const[oe,de]of L.value)for(const Fe of de)j.get(Fe)&&_.value.groups.add(oe);ct(()=>{_.value.count=j.size,_.value.items=j})},ye=()=>{const j=$(),ie=ue();for(const oe of j){const de=oe.getAttribute(s)||"",Fe=oe.getAttribute(m)||"";b.value.add(de),W.value.set(de,Fe),_.value.count=W.value.size}for(const oe of ie){const de=$(oe),Fe=oe.getAttribute(o)||"",xe=new Set("");for(const nt of de){const Ge=nt.getAttribute(s)||"";xe.add(Ge)}L.value.set(Fe,xe)}};we(()=>h.value,j=>{j&&ct(P)},{deep:!0}),we(()=>v.value,j=>{_e(),ct(be)}),y.on("selectItem",j=>{t("select-item",j)});const Ke=rs(j=>{j&&(ye(),ct(be))},100);return y.on("rerenderList",Ke),tt(()=>{ye(),be()}),(j,ie)=>(p(),I("div",{class:me(e.theme),onKeydown:je,ref_key:"commandRef",ref:M,"command-theme":e.theme},[k("div",$d,[O(j.$slots,"default")])],42,Pd))}}),Wt=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},or=Wt(Fd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Dd={"command-dialog":""},xd={"command-dialog-mask":""},Vd={"command-dialog-wrapper":""},Hd={"command-dialog-header":""},Ud={"command-dialog-body":""},Bd={key:0,"command-dialog-footer":""},Wd=V({name:"Command.Dialog"}),jd=V({...Wd,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(e,{emit:t}){const n=e,{search:r,filtered:s}=Bt(),{emitter:a}=Mn(),o=X();a.on("selectItem",l=>{t("select-item",l)});const i=()=>{r.value="",s.value.count=0,s.value.items=new Map,s.value.groups=new Set};return as(()=>n.visible,i),br(i),(l,c)=>(p(),z(Co,{to:"body",ref_key:"dialogRef",ref:o},[Y(Sn,{name:"command-dialog",appear:""},{default:A(()=>[e.visible?(p(),z(or,{key:0,theme:e.theme},{default:A(()=>[k("div",Dd,[k("div",xd,[k("div",Vd,[k("div",Hd,[O(l.$slots,"header")]),k("div",Ud,[O(l.$slots,"body")]),l.$slots.footer?(p(),I("div",Bd,[O(l.$slots,"footer")])):G("v-if",!0)])])])]),_:3},8,["theme"])):G("v-if",!0)]),_:3})],512))}}),Kd=Wt(jd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let ps=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((t,n)=>(n&=63,n<36?t+=n.toString(36):n<62?t+=(n-26).toString(36).toUpperCase():n>62?t+="-":t+="_",t),"");const Gd=["command-group-key","data-value"],Yd={key:0,"command-group-heading":""},Xd={"command-group-items":"",role:"group"},zd=V({name:"Command.Group"}),qd=V({...zd,props:{heading:{type:String,required:!0}},setup(e){const t=x(()=>`command-group-${ps()}`),{filtered:n,isSearching:r}=Bt(),s=x(()=>r.value?n.value.groups.has(t.value):!0);return(a,o)=>vn((p(),I("div",{"command-group":"",role:"presentation",key:g(t),"command-group-key":g(t),"data-value":e.heading},[e.heading?(p(),I("div",Yd,ne(e.heading),1)):G("v-if",!0),k("div",Xd,[O(a.$slots,"default")])],8,Gd)),[[_n,g(s)]])}}),Jd=Wt(qd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),Qd=["placeholder","value"],Zd=V({name:"Command.Input"}),eh=V({...Zd,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(e,{emit:t}){const n=X(null),{search:r}=Bt(),s=x(()=>r.value),a=o=>{const i=o,l=o.target;r.value=l==null?void 0:l.value,t("input",i),t("update:value",r.value)};return gt(()=>{var o;(o=n.value)==null||o.focus()}),(o,i)=>(p(),I("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:e.placeholder,value:g(s),onInput:a},null,40,Qd))}}),th=Wt(eh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),nh=["aria-selected","aria-disabled","command-item-key"],rh=V({name:"Command.Item"}),ah=V({...rh,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(e,{emit:t}){const n=e,r="command-item-select",s="data-value",{current:a}=Du(),{selectedNode:o,filtered:i,isSearching:l}=Bt(),{emitter:c}=Mn(),d=X(),m=x(()=>`command-item-${ps()}`),h=x(()=>{const _=i.value.items.get(m.value);return l.value?_!==void 0:!0}),v=x(()=>Array.from(a)),S=()=>{var _;const y={key:m.value,value:((_=d.value)==null?void 0:_.getAttribute(s))||""};t("select",y),c.emit("selectItem",y)};return as(v,_=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(y=>a.has(y.toLowerCase()))&&n.perform&&n.perform()}),gt(()=>{var _;(_=d.value)==null||_.addEventListener(r,S)}),br(()=>{var _;(_=d.value)==null||_.removeEventListener(r,S)}),(_,y)=>vn((p(),I("div",{ref_key:"itemRef",ref:d,"command-item":"",role:"option","aria-selected":g(o)===g(m),"aria-disabled":!g(h),key:g(m),"command-item-key":g(m),onClick:S},[O(_.$slots,"default")],8,nh)),[[_n,g(h)]])}}),sh=Wt(ah,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),oh=V({name:"Command.List"}),ih=V({...oh,setup(e){const{emitter:t}=Mn(),n=X(),r=X();let s=null,a;return gt(()=>{a=r.value;const o=n.value;a&&o&&(s=new ResizeObserver(i=>{ct(()=>{const l=a==null?void 0:a.offsetHeight;o==null||o.style.setProperty("--command-list-height",`${l==null?void 0:l.toFixed(1)}px`),t.emit("rerenderList",!0)})}),s.observe(a))}),br(()=>{s!==null&&a&&s.unobserve(a)}),(o,i)=>(p(),I("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[k("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[O(o.$slots,"default")],512)],512))}}),lh=Wt(ih,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ch=V({name:"Command.Empty",setup(e,{attrs:t,slots:n}){const{filtered:r}=Bt(),s=x(()=>r.value.count===0);return()=>s.value?Ft("div",{"command-empty":"",role:"presentation",...t},n):Ft("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...t})}}),uh=V({name:"Command.Loading",setup(e,{attrs:t,slots:n}){return()=>Ft("div",{"command-loading":"",role:"progressbar",...t},n)}}),dh=V({name:"Command.Separator",setup(e,{attrs:t,slots:n}){return()=>Ft("div",{"command-separator":"",role:"separator",...t})}}),Ct=Object.assign(or,{Dialog:Kd,Empty:ch,Group:Jd,Input:th,Item:sh,List:lh,Loading:uh,Separator:dh,Root:or});var Xr;const gs=typeof window<"u",hh=e=>typeof e=="string",vs=()=>{};gs&&((Xr=window==null?void 0:window.navigator)!=null&&Xr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function _s(e){return typeof e=="function"?e():g(e)}function mh(e){return e}function fh(e){return Ya()?(Xa(e),!0):!1}function ph(e,t=!0){Dt()?tt(e):t?e():ct(e)}function gh(e){var t;const n=_s(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Ir=gs?window:void 0;function Mt(...e){let t,n,r,s;if(hh(e[0])||Array.isArray(e[0])?([n,r,s]=e,t=Ir):[t,n,r,s]=e,!t)return vs;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const a=[],o=()=>{a.forEach(d=>d()),a.length=0},i=(d,m,h,v)=>(d.addEventListener(m,h,v),()=>d.removeEventListener(m,h,v)),l=we(()=>[gh(t),_s(s)],([d,m])=>{o(),d&&a.push(...n.flatMap(h=>r.map(v=>i(d,h,v,m))))},{immediate:!0,flush:"post"}),c=()=>{l(),o()};return fh(c),c}const zr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},qr="__vueuse_ssr_handlers__";zr[qr]=zr[qr]||{};const vh={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function _h(e={}){const{reactive:t=!1,target:n=Ir,aliasMap:r=vh,passive:s=!0,onEventFired:a=vs}=e,o=Jt(new Set),i={toJSON(){return{}},current:o},l=t?Jt(i):i,c=new Set,d=new Set;function m(_,y){_ in l&&(t?l[_]=y:l[_].value=y)}function h(){o.clear();for(const _ of d)m(_,!1)}function v(_,y){var M,W;const b=(M=_.key)==null?void 0:M.toLowerCase(),N=[(W=_.code)==null?void 0:W.toLowerCase(),b].filter(Boolean);b&&(y?o.add(b):o.delete(b));for(const C of N)d.add(C),m(C,y);b==="meta"&&!y?(c.forEach(C=>{o.delete(C),m(C,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&y&&[...o,...N].forEach(C=>c.add(C))}Mt(n,"keydown",_=>(v(_,!0),a(_)),{passive:s}),Mt(n,"keyup",_=>(v(_,!1),a(_)),{passive:s}),Mt("blur",h,{passive:!0}),Mt("focus",h,{passive:!0});const S=new Proxy(l,{get(_,y,M){if(typeof y!="string")return Reflect.get(_,y,M);if(y=y.toLowerCase(),y in r&&(y=r[y]),!(y in l))if(/[+_-]/.test(y)){const b=y.split(/[+_-]/g).map(L=>L.trim());l[y]=x(()=>b.every(L=>g(S[L])))}else l[y]=X(!1);const W=Reflect.get(_,y,M);return t?g(W):W}});return S}var Jr;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Jr||(Jr={}));var bh=Object.defineProperty,Qr=Object.getOwnPropertySymbols,yh=Object.prototype.hasOwnProperty,kh=Object.prototype.propertyIsEnumerable,Zr=(e,t,n)=>t in e?bh(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,wh=(e,t)=>{for(var n in t||(t={}))yh.call(t,n)&&Zr(e,n,t[n]);if(Qr)for(var n of Qr(t))kh.call(t,n)&&Zr(e,n,t[n]);return e};const Lh={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};wh({linear:mh},Lh);function Eh(e={}){const{window:t=Ir,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:s=!0,includeScrollbar:a=!0}=e,o=X(n),i=X(r),l=()=>{t&&(a?(o.value=t.innerWidth,i.value=t.innerHeight):(o.value=t.document.documentElement.clientWidth,i.value=t.document.documentElement.clientHeight))};return l(),ph(l),Mt("resize",l,{passive:!0}),s&&Mt("orientationchange",l,{passive:!0}),{width:o,height:i}}const Bn=X([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-04-14 07:07:31"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-04-14 07:07:31"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-04-14 07:07:31"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-04-14 07:07:31"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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
| `,title:"r-player",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-04-14 07:07:31"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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
| `,title:"r-player视频播放器",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-04-14 07:07:31"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-04-14 07:07:31"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-04-14 07:07:31"}}]),Sh={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Oh(e,t="yyyy-MM-dd hh:mm:ss"){e instanceof Date||(e=new Date(e));const n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,`${e.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in n)new RegExp(`(${r})`).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length===1?n[r]:`00${n[r]}`.substr(`${n[r]}`.length)));return t}const Ih={},Ch={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Th=Ao('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Ah=[Th];function Nh(e,t){return p(),I("svg",Ch,Ah)}const Mh=q(Ih,[["render",Nh]]),Cr=e=>(Ie("data-v-e93b2392"),e=e(),Ce(),e),Ph={class:"blog-search","data-pagefind-ignore":"all"},$h=Cr(()=>k("span",null,[k("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[k("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),Rh={class:"search-dialog"},Fh={class:"link"},Dh={class:"title"},xh={key:0,class:"date"},Vh=["innerHTML"],Hh={class:"command-palette-logo"},Uh={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Bh=Cr(()=>k("span",{class:"command-palette-Label"},"Search by",-1)),Wh=Cr(()=>k("ul",{class:"command-palette-commands"},[k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),k("span",{class:"command-palette-Label"},"to select")]),k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),k("span",{class:"command-palette-Label"},"to navigate")]),k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),k("span",{class:"command-palette-Label"},"to close")])],-1)),jh=V({__name:"Search",setup(e){No(D=>({"5b3346c5":c.value}));const t=X([]),n=Sh,{localeIndex:r,site:s}=gn(),a=x(()=>{var D;return{...n,...((D=n==null?void 0:n.locales)==null?void 0:D[r.value])||{}}}),o=x(()=>{var D;return((D=a.value)==null?void 0:D.showDate)??!0}),i=Eh(),l=x(()=>i.width.value<760),c=x(()=>l.value?0:1),d=x(()=>{var D;return(D=a.value)!=null&&D.heading?a.value.heading.replace(/\{\{searchResult\}\}/,t.value.length):`Total: ${t.value.length} search results.`}),m=X("");tt(()=>{m.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const h=X(!1),v=X(""),S=_h({passive:!1,onEventFired(D){D.ctrlKey&&D.key==="k"&&D.type==="keydown"&&D.preventDefault()}}),_=S["Meta+K"],y=S["Ctrl+K"],M=S.Escape;we(_,D=>{D&&(h.value=!0)}),we(y,D=>{D&&(h.value=!0)}),we(M,D=>{D&&(h.value=!1)});function W(){if(!v.value){t.value=[];return}t.value=Bn.value.filter(D=>`${D.meta.description}${D.meta.title}`.includes(v.value)).map(D=>{var se,ke;return{...D,meta:{...D.meta,description:((ke=(se=D.meta)==null?void 0:se.description)==null?void 0:ke.replace(new RegExp(`(${v.value})`,"g"),"<mark>$1</mark>"))||""}}}),t.value.sort((D,se)=>+new Date(se.meta.date)-+new Date(D.meta.date))}const b=x(()=>{var D;return((D=a.value)==null?void 0:D.resultOptimization)??!0});we(()=>v.value,async()=>{var D,se,ke;if(!((D=window==null?void 0:window.__pagefind__)!=null&&D.search))W();else{const Ee=typeof a.value.customSearchQuery=="function"?a.value.customSearchQuery(v.value):v.value;await((ke=(se=window==null?void 0:window.__pagefind__)==null?void 0:se.search)==null?void 0:ke.call(se,Ee).then(async ge=>{const je=(await Promise.all(ge.results.map(_e=>_e.data()))).map(_e=>{var ye;return{route:_e.url.startsWith(s.value.base)?_e.url:On(_e.url),meta:{title:_e.meta.title,description:_e.excerpt,date:(ye=_e==null?void 0:_e.meta)==null?void 0:ye.date}}}).map(_e=>{const ye=Bn.value.find(Ke=>Ke.route===_e.route);return{..._e,meta:{..._e.meta,...ye==null?void 0:ye.meta}}}).filter(_e=>!b.value||Bn.value.some(ye=>ye.route===_e.route));t.value=je.filter(a.value.filter??(()=>!0))}))}ct(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(Ee=>{Ee.setAttribute("aria-disabled","false")})})});function L(D){D.target===D.currentTarget&&(h.value=!1)}we(()=>h.value,D=>{var se;D?ct(()=>{var ke;(ke=document.querySelector("div[command-dialog-mask]"))==null||ke.addEventListener("click",L)}):(se=document.querySelector("div[command-dialog-mask]"))==null||se.removeEventListener("click",L)});const N=X(999),C=X(0),P=x(()=>{const se=C.value%Math.ceil(t.value.length/N.value)*N.value;return t.value.slice(se,se+N.value)}),F=Mo(),$=en();function ue(D){h.value=!1,$.path!==D.value&&F.go(D.value)}const{lang:be}=gn(),Q=x(()=>a.value.langReload??!0);return we(()=>be.value,()=>{Q.value&&window.location.reload()}),(D,se)=>{var Ee;const ke=vt("ClientOnly");return p(),I("div",Ph,[k("div",{class:"nav-search-btn-wait",onClick:se[0]||(se[0]=ge=>h.value=!0)},[$h,vn(k("span",{class:"search-tip"},ne(((Ee=a.value)==null?void 0:Ee.btnPlaceholder)||"Search"),513),[[_n,!l.value]]),vn(k("span",{class:"metaKey"},ne(m.value)+" K ",513),[[_n,!l.value]])]),Y(ke,null,{default:A(()=>[Y(g(Ct).Dialog,{visible:h.value,theme:"algolia"},Po({header:A(()=>{var ge;return[Y(g(Ct).Input,{value:v.value,"onUpdate:value":se[1]||(se[1]=He=>v.value=He),placeholder:((ge=a.value)==null?void 0:ge.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:A(()=>[k("div",Rh,[Y(g(Ct).List,null,{default:A(()=>[t.value.length?(p(),z(g(Ct).Group,{key:1,heading:d.value},{default:A(()=>[(p(!0),I(pe,null,Pe(P.value,ge=>(p(),z(g(Ct).Item,{key:ge.route,"data-value":ge.route,onSelect:ue},{default:A(()=>[k("div",Fh,[k("div",Dh,[k("span",null,ne(ge.meta.title),1),o.value&&ge.meta.date?(p(),I("span",xh,ne(g(Oh)(ge.meta.date,"yyyy-MM-dd")),1)):G("",!0)]),k("div",{class:"des",innerHTML:ge.meta.description},null,8,Vh)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(p(),z(g(Ct).Empty,{key:0},{default:A(()=>{var ge;return[Ze(ne(((ge=a.value)==null?void 0:ge.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[t.value.length?{name:"footer",fn:A(()=>[k("div",Hh,[k("a",Uh,[Bh,Y(Mh,{style:{width:"77px"}})])]),Wh]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),Kh=q(jh,[["__scopeId","data-v-e93b2392"]]),Gh=V({__name:"VPNavBarSocialLinks",setup(e){const{theme:t}=ae();return(n,r)=>g(t).socialLinks?(p(),z(Sr,{key:0,class:"VPNavBarSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),Yh=q(Gh,[["__scopeId","data-v-77be3e81"]]),Xh=["href","rel","target"],zh={key:1},qh={key:2},Jh=V({__name:"VPNavBarTitle",setup(e){const{site:t,theme:n}=ae(),{hasSidebar:r}=dt(),{currentLang:s}=tn(),a=x(()=>{var l;return typeof n.value.logoLink=="string"?n.value.logoLink:(l=n.value.logoLink)==null?void 0:l.link}),o=x(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.rel}),i=x(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.target});return(l,c)=>(p(),I("div",{class:me(["VPNavBarTitle",{"has-sidebar":g(r)}])},[k("a",{class:"title",href:a.value??g(yr)(g(s).link),rel:o.value,target:i.value},[O(l.$slots,"nav-bar-title-before",{},void 0,!0),g(n).logo?(p(),z(bn,{key:0,class:"logo",image:g(n).logo},null,8,["image"])):G("",!0),g(n).siteTitle?(p(),I("span",zh,ne(g(n).siteTitle),1)):g(n).siteTitle===void 0?(p(),I("span",qh,ne(g(t).title),1)):G("",!0),O(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,Xh)],2))}}),Qh=q(Jh,[["__scopeId","data-v-5abe1e14"]]),Zh={class:"items"},em={class:"title"},tm=V({__name:"VPNavBarTranslations",setup(e){const{theme:t}=ae(),{localeLinks:n,currentLang:r}=tn({correspondingLink:!0});return(s,a)=>g(n).length&&g(r).label?(p(),z(Er,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:g(t).langMenuLabel||"Change language"},{default:A(()=>[k("div",Zh,[k("p",em,ne(g(r).label),1),(p(!0),I(pe,null,Pe(g(n),o=>(p(),z(Nn,{key:o.link,item:o},null,8,["item"]))),128))])]),_:1},8,["label"])):G("",!0)}}),nm=q(tm,[["__scopeId","data-v-b3b35c33"]]),rm=e=>(Ie("data-v-99677995"),e=e(),Ce(),e),am={class:"wrapper"},sm={class:"container"},om={class:"title"},im={class:"content"},lm={class:"content-body"},cm=rm(()=>k("div",{class:"divider"},[k("div",{class:"divider-line"})],-1)),um=V({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const{y:t}=Ga(),{hasSidebar:n}=dt(),{frontmatter:r}=ae(),s=X({});return Wa(()=>{s.value={"has-sidebar":n.value,home:r.value.layout==="home",top:t.value===0}}),(a,o)=>(p(),I("div",{class:me(["VPNavBar",s.value])},[k("div",am,[k("div",sm,[k("div",om,[Y(Qh,null,{"nav-bar-title-before":A(()=>[O(a.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[O(a.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),k("div",im,[k("div",lm,[O(a.$slots,"nav-bar-content-before",{},void 0,!0),Y(Kh,{class:"search"}),Y(Tu,{class:"menu"}),Y(nm,{class:"translations"}),Y(Mc,{class:"appearance"}),Y(Yh,{class:"social-links"}),Y(fu,{class:"extra"}),O(a.$slots,"nav-bar-content-after",{},void 0,!0),Y(yu,{class:"hamburger",active:a.isScreenOpen,onClick:o[0]||(o[0]=i=>a.$emit("toggle-screen"))},null,8,["active"])])])])]),cm],2))}}),dm=q(um,[["__scopeId","data-v-99677995"]]),hm={key:0,class:"VPNavScreenAppearance"},mm={class:"text"},fm=V({__name:"VPNavScreenAppearance",setup(e){const{site:t,theme:n}=ae();return(r,s)=>g(t).appearance&&g(t).appearance!=="force-dark"?(p(),I("div",hm,[k("p",mm,ne(g(n).darkModeSwitchLabel||"Appearance"),1),Y(wr)])):G("",!0)}}),pm=q(fm,[["__scopeId","data-v-ca46b477"]]),gm=V({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(p(),z(qe,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t),innerHTML:n.item.text},null,8,["href","target","rel","onClick","innerHTML"]))}}),vm=q(gm,[["__scopeId","data-v-7c67dc36"]]),_m=V({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(p(),z(qe,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t)},{default:A(()=>[Ze(ne(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),bs=q(_m,[["__scopeId","data-v-0efb3ccd"]]),bm={class:"VPNavScreenMenuGroupSection"},ym={key:0,class:"title"},km=V({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",bm,[t.text?(p(),I("p",ym,ne(t.text),1)):G("",!0),(p(!0),I(pe,null,Pe(t.items,r=>(p(),z(bs,{key:r.text,item:r},null,8,["item"]))),128))]))}}),wm=q(km,[["__scopeId","data-v-fef4fb94"]]),Lm=e=>(Ie("data-v-4af39b72"),e=e(),Ce(),e),Em=["aria-controls","aria-expanded"],Sm=["innerHTML"],Om=Lm(()=>k("span",{class:"vpi-plus button-icon"},null,-1)),Im=["id"],Cm={key:1,class:"group"},Tm=V({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const t=e,n=X(!1),r=x(()=>`NavScreenGroup-${t.text.replace(" ","-").toLowerCase()}`);function s(){n.value=!n.value}return(a,o)=>(p(),I("div",{class:me(["VPNavScreenMenuGroup",{open:n.value}])},[k("button",{class:"button","aria-controls":r.value,"aria-expanded":n.value,onClick:s},[k("span",{class:"button-text",innerHTML:a.text},null,8,Sm),Om],8,Em),k("div",{id:r.value,class:"items"},[(p(!0),I(pe,null,Pe(a.items,i=>(p(),I(pe,{key:i.text},["link"in i?(p(),I("div",{key:i.text,class:"item"},[Y(bs,{item:i},null,8,["item"])])):(p(),I("div",Cm,[Y(wm,{text:i.text,items:i.items},null,8,["text","items"])]))],64))),128))],8,Im)],2))}}),Am=q(Tm,[["__scopeId","data-v-4af39b72"]]),Nm={key:0,class:"VPNavScreenMenu"},Mm=V({__name:"VPNavScreenMenu",setup(e){const{theme:t}=ae();return(n,r)=>g(t).nav?(p(),I("nav",Nm,[(p(!0),I(pe,null,Pe(g(t).nav,s=>(p(),I(pe,{key:s.text},["link"in s?(p(),z(vm,{key:0,item:s},null,8,["item"])):(p(),z(Am,{key:1,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):G("",!0)}}),Pm=V({__name:"VPNavScreenSocialLinks",setup(e){const{theme:t}=ae();return(n,r)=>g(t).socialLinks?(p(),z(Sr,{key:0,class:"VPNavScreenSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),ys=e=>(Ie("data-v-672d6404"),e=e(),Ce(),e),$m=ys(()=>k("span",{class:"vpi-languages icon lang"},null,-1)),Rm=ys(()=>k("span",{class:"vpi-chevron-down icon chevron"},null,-1)),Fm={class:"list"},Dm=V({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:t,currentLang:n}=tn({correspondingLink:!0}),r=X(!1);function s(){r.value=!r.value}return(a,o)=>g(t).length&&g(n).label?(p(),I("div",{key:0,class:me(["VPNavScreenTranslations",{open:r.value}])},[k("button",{class:"title",onClick:s},[$m,Ze(" "+ne(g(n).label)+" ",1),Rm]),k("ul",Fm,[(p(!0),I(pe,null,Pe(g(t),i=>(p(),I("li",{key:i.link,class:"item"},[Y(qe,{class:"link",href:i.link},{default:A(()=>[Ze(ne(i.text),1)]),_:2},1032,["href"])]))),128))])],2)):G("",!0)}}),xm=q(Dm,[["__scopeId","data-v-672d6404"]]),Vm={class:"container"},Hm=V({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const t=X(null),n=za(An?document.body:null);return(r,s)=>(p(),z(Sn,{name:"fade",onEnter:s[0]||(s[0]=a=>n.value=!0),onAfterLeave:s[1]||(s[1]=a=>n.value=!1)},{default:A(()=>[r.open?(p(),I("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:t,id:"VPNavScreen"},[k("div",Vm,[O(r.$slots,"nav-screen-content-before",{},void 0,!0),Y(Mm,{class:"menu"}),Y(xm,{class:"translations"}),Y(pm,{class:"appearance"}),Y(Pm,{class:"social-links"}),O(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):G("",!0)]),_:3}))}}),Um=q(Hm,[["__scopeId","data-v-611e0185"]]),Bm={key:0,class:"VPNav"},Wm=V({__name:"VPNav",setup(e){const{isScreenOpen:t,closeScreen:n,toggleScreen:r}=yc(),{frontmatter:s}=ae(),a=x(()=>s.value.navbar!==!1);return _r("close-screen",n),gt(()=>{An&&document.documentElement.classList.toggle("hide-nav",!a.value)}),(o,i)=>a.value?(p(),I("header",Bm,[Y(dm,{"is-screen-open":g(t),onToggleScreen:g(r)},{"nav-bar-title-before":A(()=>[O(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[O(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[O(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[O(o.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),Y(Um,{open:g(t)},{"nav-screen-content-before":A(()=>[O(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[O(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):G("",!0)}}),jm=q(Wm,[["__scopeId","data-v-5f9e5704"]]),ks=e=>(Ie("data-v-1229834d"),e=e(),Ce(),e),Km=["role","tabindex"],Gm=ks(()=>k("div",{class:"indicator"},null,-1)),Ym=ks(()=>k("span",{class:"vpi-chevron-right caret-icon"},null,-1)),Xm=[Ym],zm={key:1,class:"items"},qm=V({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const t=e,{collapsed:n,collapsible:r,isLink:s,isActiveLink:a,hasActiveLink:o,hasChildren:i,toggle:l}=li(x(()=>t.item)),c=x(()=>i.value?"section":"div"),d=x(()=>s.value?"a":"div"),m=x(()=>i.value?t.depth+2===7?"p":`h${t.depth+2}`:"p"),h=x(()=>s.value?void 0:"button"),v=x(()=>[[`level-${t.depth}`],{collapsible:r.value},{collapsed:n.value},{"is-link":s.value},{"is-active":a.value},{"has-active":o.value}]);function S(y){"key"in y&&y.key!=="Enter"||!t.item.link&&l()}function _(){t.item.link&&l()}return(y,M)=>{const W=vt("VPSidebarItem",!0);return p(),z($t(c.value),{class:me(["VPSidebarItem",v.value])},{default:A(()=>[y.item.text?(p(),I("div",dn({key:0,class:"item",role:h.value},$o(y.item.items?{click:S,keydown:S}:{},!0),{tabindex:y.item.items&&0}),[Gm,y.item.link?(p(),z(qe,{key:0,tag:d.value,class:"link",href:y.item.link,rel:y.item.rel,target:y.item.target},{default:A(()=>[(p(),z($t(m.value),{class:"text",innerHTML:y.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(p(),z($t(m.value),{key:1,class:"text",innerHTML:y.item.text},null,8,["innerHTML"])),y.item.collapsed!=null&&y.item.items&&y.item.items.length?(p(),I("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:Ro(_,["enter"]),tabindex:"0"},Xm,32)):G("",!0)],16,Km)):G("",!0),y.item.items&&y.item.items.length?(p(),I("div",zm,[y.depth<5?(p(!0),I(pe,{key:0},Pe(y.item.items,b=>(p(),z(W,{key:b.text,item:b,depth:y.depth+1},null,8,["item","depth"]))),128)):G("",!0)])):G("",!0)]),_:1},8,["class"])}}}),Jm=q(qm,[["__scopeId","data-v-1229834d"]]),ws=e=>(Ie("data-v-2e84fcad"),e=e(),Ce(),e),Qm=ws(()=>k("div",{class:"curtain"},null,-1)),Zm={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},ef=ws(()=>k("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),tf=V({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:t,hasSidebar:n}=dt(),r=e,s=X(null),a=za(An?document.body:null);return we([r,s],()=>{var o;r.open?(a.value=!0,(o=s.value)==null||o.focus()):a.value=!1},{immediate:!0,flush:"post"}),(o,i)=>g(n)?(p(),I("aside",{key:0,class:me(["VPSidebar",{open:o.open}]),ref_key:"navEl",ref:s,onClick:i[0]||(i[0]=Fo(()=>{},["stop"]))},[Qm,k("nav",Zm,[ef,O(o.$slots,"sidebar-nav-before",{},void 0,!0),(p(!0),I(pe,null,Pe(g(t),l=>(p(),I("div",{key:l.text,class:"group"},[Y(Jm,{item:l,depth:0},null,8,["item"])]))),128)),O(o.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):G("",!0)}}),nf=q(tf,[["__scopeId","data-v-2e84fcad"]]),rf=V({__name:"VPSkipLink",setup(e){const t=en(),n=X();we(()=>t.path,()=>n.value.focus());function r({target:s}){const a=document.getElementById(decodeURIComponent(s.hash).slice(1));if(a){const o=()=>{a.removeAttribute("tabindex"),a.removeEventListener("blur",o)};a.setAttribute("tabindex","-1"),a.addEventListener("blur",o),a.focus(),window.scrollTo(0,0)}}return(s,a)=>(p(),I(pe,null,[k("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),k("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),af=q(rf,[["__scopeId","data-v-8ad27773"]]),sf=V({__name:"Layout",setup(e){const{isOpen:t,open:n,close:r}=dt(),s=en();we(()=>s.path,r),ii(t,r);const{frontmatter:a}=ae(),o=Do(),i=x(()=>!!o["home-hero-image"]);return _r("hero-image-slot-exists",i),(l,c)=>{const d=vt("Content");return g(a).layout!==!1?(p(),I("div",{key:0,class:me(["Layout",g(a).pageClass])},[O(l.$slots,"layout-top",{},void 0,!0),Y(af),Y(Go,{class:"backdrop",show:g(t),onClick:g(r)},null,8,["show","onClick"]),Y(jm,null,{"nav-bar-title-before":A(()=>[O(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[O(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[O(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[O(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":A(()=>[O(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[O(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),Y(bc,{open:g(t),onOpenMenu:g(n)},null,8,["open","onOpenMenu"]),Y(nf,{open:g(t)},{"sidebar-nav-before":A(()=>[O(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":A(()=>[O(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),Y(Zl,{"data-pagefind-body":""},{"page-top":A(()=>[O(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[O(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":A(()=>[O(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":A(()=>[O(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[O(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[O(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[O(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[O(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[O(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[O(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[O(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[O(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":A(()=>[O(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[O(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[O(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":A(()=>[O(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[O(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":A(()=>[O(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[O(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[O(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[O(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[O(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[O(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),Y(ac),O(l.$slots,"layout-bottom",{},void 0,!0)],2)):(p(),z(d,{key:1}))}}}),of=q(sf,[["__scopeId","data-v-e2f61dd9"]]),Ls={Layout:of,enhanceApp:({app:e})=>{e.component("Badge",Wo)}};var lf=Object.defineProperty,cf=(e,t,n)=>t in e?lf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,U=(e,t,n)=>(cf(e,typeof t!="symbol"?t+"":t,n),n);const uf=()=>{if(typeof window<"u"){const e=navigator.userAgent.toLowerCase();return/ipad|ipod/.test(e)?"ipad":/android/.test(e)?"android":/iphone/.test(e)?"iphone":"pc"}return"pc"},nn=typeof window<"u",df=()=>nn?window.navigator.userAgent.toLowerCase().includes("micromessenger"):!1,hf=()=>{if(!nn)return!1;const e=window.navigator.userAgent;return!!/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(e)},mf=()=>{if(!nn)return!1;const e=/iphone/i.test(window.navigator.userAgent),t=window.devicePixelRatio&&window.devicePixelRatio===2,n=window.devicePixelRatio&&window.devicePixelRatio===3,r=window.screen.width===360&&window.screen.height===780,s=window.screen.width===375&&window.screen.height===812,a=window.screen.width===390&&window.screen.height===844,o=window.screen.width===414&&window.screen.height===896,i=window.screen.width===428&&window.screen.height===926;switch(!0){case(e&&n&&r):case(e&&n&&s):case(e&&n&&a):case(e&&t&&o):case(e&&n&&o):case(e&&n&&i):return!0;default:return!1}},Es="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ss="ARRAYBUFFER not supported by this environment",Os="UINT8ARRAY not supported by this environment";function ff(e,t,n,r,s){let a,o,i=0,l,c,d,m,h,v;r=r||0;const S=n||[0],_=r>>>3;if(t==="UTF8")for(h=s===-1?3:0,l=0;l<e.length;l+=1)for(a=e.charCodeAt(l),o=[],128>a?o.push(a):2048>a?(o.push(192|a>>>6),o.push(128|a&63)):55296>a||57344<=a?o.push(224|a>>>12,128|a>>>6&63,128|a&63):(l+=1,a=65536+((a&1023)<<10|e.charCodeAt(l)&1023),o.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)),c=0;c<o.length;c+=1){for(m=i+_,d=m>>>2;S.length<=d;)S.push(0);S[d]|=o[c]<<8*(h+s*(m%4)),i+=1}else for(h=s===-1?2:0,v=t==="UTF16LE"&&s!==1||t!=="UTF16LE"&&s===1,l=0;l<e.length;l+=1){for(a=e.charCodeAt(l),v===!0&&(c=a&255,a=c<<8|a>>>8),m=i+_,d=m>>>2;S.length<=d;)S.push(0);S[d]|=a<<8*(h+s*(m%4)),i+=2}return{value:S,binLen:i*8+r}}function pf(e,t,n,r){let s,a,o,i;if(e.length%2!==0)throw new Error("String of HEX type must be in byte increments");n=n||0;const l=t||[0],c=n>>>3,d=r===-1?3:0;for(s=0;s<e.length;s+=2){if(a=parseInt(e.substr(s,2),16),isNaN(a))throw new Error("String of HEX type contains invalid characters");for(i=(s>>>1)+c,o=i>>>2;l.length<=o;)l.push(0);l[o]|=a<<8*(d+r*(i%4))}return{value:l,binLen:e.length*4+n}}function gf(e,t,n,r){let s,a,o,i;n=n||0;const l=t||[0],c=n>>>3,d=r===-1?3:0;for(a=0;a<e.length;a+=1)s=e.charCodeAt(a),i=a+c,o=i>>>2,l.length<=o&&l.push(0),l[o]|=s<<8*(d+r*(i%4));return{value:l,binLen:e.length*8+n}}function vf(e,t,n,r){let s=0,a,o,i,l,c,d,m;n=n||0;const h=t||[0],v=n>>>3,S=r===-1?3:0,_=e.indexOf("=");if(e.search(/^[a-zA-Z\d=+/]+$/)===-1)throw new Error("Invalid character in base-64 string");if(e=e.replace(/=/g,""),_!==-1&&_<e.length)throw new Error("Invalid '=' found in base-64 string");for(o=0;o<e.length;o+=4){for(c=e.substr(o,4),l=0,i=0;i<c.length;i+=1)a=Es.indexOf(c.charAt(i)),l|=a<<18-6*i;for(i=0;i<c.length-1;i+=1){for(m=s+v,d=m>>>2;h.length<=d;)h.push(0);h[d]|=(l>>>16-i*8&255)<<8*(S+r*(m%4)),s+=1}}return{value:h,binLen:s*8+n}}function Is(e,t,n,r){let s,a,o;n=n||0;const i=t||[0],l=n>>>3,c=r===-1?3:0;for(s=0;s<e.length;s+=1)o=s+l,a=o>>>2,i.length<=a&&i.push(0),i[a]|=e[s]<<8*(c+r*(o%4));return{value:i,binLen:e.length*8+n}}function _f(e,t,n,r){return Is(new Uint8Array(e),t,n,r)}function jt(e,t,n){switch(t){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(e){case"HEX":return function(r,s,a){return pf(r,s,a,n)};case"TEXT":return function(r,s,a){return ff(r,t,s,a,n)};case"B64":return function(r,s,a){return vf(r,s,a,n)};case"BYTES":return function(r,s,a){return gf(r,s,a,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ss)}return function(r,s,a){return _f(r,s,a,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Os)}return function(r,s,a){return Is(r,s,a,n)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function bf(e,t,n,r){const s="0123456789abcdef";let a="",o,i;const l=t/8,c=n===-1?3:0;for(o=0;o<l;o+=1)i=e[o>>>2]>>>8*(c+n*(o%4)),a+=s.charAt(i>>>4&15)+s.charAt(i&15);return r.outputUpper?a.toUpperCase():a}function yf(e,t,n,r){let s="",a,o,i,l,c;const d=t/8,m=n===-1?3:0;for(a=0;a<d;a+=3)for(l=a+1<d?e[a+1>>>2]:0,c=a+2<d?e[a+2>>>2]:0,i=(e[a>>>2]>>>8*(m+n*(a%4))&255)<<16|(l>>>8*(m+n*((a+1)%4))&255)<<8|c>>>8*(m+n*((a+2)%4))&255,o=0;o<4;o+=1)a*8+o*6<=t?s+=Es.charAt(i>>>6*(3-o)&63):s+=r.b64Pad;return s}function kf(e,t,n){let r="",s,a;const o=t/8,i=n===-1?3:0;for(s=0;s<o;s+=1)a=e[s>>>2]>>>8*(i+n*(s%4))&255,r+=String.fromCharCode(a);return r}function wf(e,t,n){let r;const s=t/8,a=new ArrayBuffer(s),o=new Uint8Array(a),i=n===-1?3:0;for(r=0;r<s;r+=1)o[r]=e[r>>>2]>>>8*(i+n*(r%4))&255;return a}function Lf(e,t,n){let r;const s=t/8,a=n===-1?3:0,o=new Uint8Array(s);for(r=0;r<s;r+=1)o[r]=e[r>>>2]>>>8*(a+n*(r%4))&255;return o}function ea(e,t,n,r){switch(e){case"HEX":return function(s){return bf(s,t,n,r)};case"B64":return function(s){return yf(s,t,n,r)};case"BYTES":return function(s){return kf(s,t,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ss)}return function(s){return wf(s,t,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Os)}return function(s){return Lf(s,t,n)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}const rn=4294967296,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],ot=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],it=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],an="Chosen SHA variant is not supported",Cs="Cannot set numRounds with MAC";function kn(e,t){let n,r;const s=e.binLen>>>3,a=t.binLen>>>3,o=s<<3,i=4-s<<3;if(s%4!==0){for(n=0;n<a;n+=4)r=s+n>>>2,e.value[r]|=t.value[n>>>2]<<o,e.value.push(0),e.value[r+1]|=t.value[n>>>2]>>>i;return(e.value.length<<2)-4>=a+s&&e.value.pop(),{value:e.value,binLen:e.binLen+t.binLen}}else return{value:e.value.concat(t.value),binLen:e.binLen+t.binLen}}function ta(e){const t={outputUpper:!1,b64Pad:"=",outputLen:-1},n=e||{},r="Output length must be a multiple of 8";if(t.outputUpper=n.outputUpper||!1,n.b64Pad&&(t.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!==0)throw new Error(r);t.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!==0)throw new Error(r);t.outputLen=n.shakeLen}if(typeof t.outputUpper!="boolean")throw new Error("Invalid outputUpper formatting option");if(typeof t.b64Pad!="string")throw new Error("Invalid b64Pad formatting option");return t}function ft(e,t,n,r){const s=e+" must include a value and format";if(!t){if(!r)throw new Error(s);return r}if(typeof t.value>"u"||!t.format)throw new Error(s);return jt(t.format,t.encoding||"UTF8",n)(t.value)}class Pn{constructor(t,n,r){U(this,"shaVariant"),U(this,"inputFormat"),U(this,"utfType"),U(this,"numRounds"),U(this,"keyWithIPad"),U(this,"keyWithOPad"),U(this,"remainder"),U(this,"remainderLen"),U(this,"updateCalled"),U(this,"processedLen"),U(this,"macKeySet");const s=r||{};if(this.inputFormat=n,this.utfType=s.encoding||"UTF8",this.numRounds=s.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.shaVariant=t,this.remainder=[],this.remainderLen=0,this.updateCalled=!1,this.processedLen=0,this.macKeySet=!1,this.keyWithIPad=[],this.keyWithOPad=[]}update(t){let n,r=0;const s=this.variantBlockSize>>>5,a=this.converterFunc(t,this.remainder,this.remainderLen),o=a.binLen,i=a.value,l=o>>>5;for(n=0;n<l;n+=s)r+this.variantBlockSize<=o&&(this.intermediateState=this.roundFunc(i.slice(n,n+s),this.intermediateState),r+=this.variantBlockSize);return this.processedLen+=r,this.remainder=i.slice(r>>>5),this.remainderLen=o%this.variantBlockSize,this.updateCalled=!0,this}getHash(t,n){let r,s,a=this.outputBinLen;const o=ta(n);if(this.isVariableLen){if(o.outputLen===-1)throw new Error("Output length must be specified in options");a=o.outputLen}const i=ea(t,a,this.bigEndianMod,o);if(this.macKeySet&&this.getMAC)return i(this.getMAC(o));for(s=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),a),r=1;r<this.numRounds;r+=1)this.isVariableLen&&a%32!==0&&(s[s.length-1]&=16777215>>>24-a%32),s=this.finalizeFunc(s,a,0,this.newStateFunc(this.shaVariant),a);return i(s)}setHMACKey(t,n,r){if(!this.HMACSupported)throw new Error("Variant does not support HMAC");if(this.updateCalled)throw new Error("Cannot set MAC key after calling update");const s=r||{},a=jt(n,s.encoding||"UTF8",this.bigEndianMod);this._setHMACKey(a(t))}_setHMACKey(t){const n=this.variantBlockSize>>>3,r=n/4-1;let s;if(this.numRounds!==1)throw new Error(Cs);if(this.macKeySet)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.finalizeFunc(t.value,t.binLen,0,this.newStateFunc(this.shaVariant),this.outputBinLen));t.value.length<=r;)t.value.push(0);for(s=0;s<=r;s+=1)this.keyWithIPad[s]=t.value[s]^909522486,this.keyWithOPad[s]=t.value[s]^1549556828;this.intermediateState=this.roundFunc(this.keyWithIPad,this.intermediateState),this.processedLen=this.variantBlockSize,this.macKeySet=!0}getHMAC(t,n){const r=ta(n);return ea(t,this.outputBinLen,this.bigEndianMod,r)(this._getHMAC())}_getHMAC(){let t;if(!this.macKeySet)throw new Error("Cannot call getHMAC without first setting MAC key");const n=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),this.outputBinLen);return t=this.roundFunc(this.keyWithOPad,this.newStateFunc(this.shaVariant)),t=this.finalizeFunc(n,this.outputBinLen,this.variantBlockSize,t,this.outputBinLen),t}}function Tt(e,t){return e<<t|e>>>32-t}function Je(e,t){return e>>>t|e<<32-t}function Ts(e,t){return e>>>t}function na(e,t,n){return e^t^n}function As(e,t,n){return e&t^~e&n}function Ns(e,t,n){return e&t^e&n^t&n}function Ef(e){return Je(e,2)^Je(e,13)^Je(e,22)}function Me(e,t){const n=(e&65535)+(t&65535);return((e>>>16)+(t>>>16)+(n>>>16)&65535)<<16|n&65535}function Sf(e,t,n,r){const s=(e&65535)+(t&65535)+(n&65535)+(r&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)&65535)<<16|s&65535}function qt(e,t,n,r,s){const a=(e&65535)+(t&65535)+(n&65535)+(r&65535)+(s&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)+(a>>>16)&65535)<<16|a&65535}function Of(e){return Je(e,17)^Je(e,19)^Ts(e,10)}function If(e){return Je(e,7)^Je(e,18)^Ts(e,3)}function Cf(e){return Je(e,6)^Je(e,11)^Je(e,25)}function ra(e){return[1732584193,4023233417,2562383102,271733878,3285377520]}function Ms(e,t){let n,r,s,a,o,i,l;const c=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],l=0;l<80;l+=1)l<16?c[l]=e[l]:c[l]=Tt(c[l-3]^c[l-8]^c[l-14]^c[l-16],1),l<20?i=qt(Tt(n,5),As(r,s,a),o,1518500249,c[l]):l<40?i=qt(Tt(n,5),na(r,s,a),o,1859775393,c[l]):l<60?i=qt(Tt(n,5),Ns(r,s,a),o,2400959708,c[l]):i=qt(Tt(n,5),na(r,s,a),o,3395469782,c[l]),o=a,a=s,s=Tt(r,30),r=n,n=i;return t[0]=Me(n,t[0]),t[1]=Me(r,t[1]),t[2]=Me(s,t[2]),t[3]=Me(a,t[3]),t[4]=Me(o,t[4]),t}function Tf(e,t,n,r){let s;const a=(t+65>>>9<<4)+15,o=t+n;for(;e.length<=a;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[a]=o&4294967295,e[a-1]=o/rn|0,s=0;s<e.length;s+=16)r=Ms(e.slice(s,s+16),r);return r}let Af=class extends Pn{constructor(t,n,r){if(t!=="SHA-1")throw new Error(an);super(t,n,r),U(this,"intermediateState"),U(this,"variantBlockSize"),U(this,"bigEndianMod"),U(this,"outputBinLen"),U(this,"isVariableLen"),U(this,"HMACSupported"),U(this,"converterFunc"),U(this,"roundFunc"),U(this,"finalizeFunc"),U(this,"stateCloneFunc"),U(this,"newStateFunc"),U(this,"getMAC");const s=r||{};this.HMACSupported=!0,this.getMAC=this._getHMAC,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ms,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=ra,this.finalizeFunc=Tf,this.intermediateState=ra(),this.variantBlockSize=512,this.outputBinLen=160,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ft("hmacKey",s.hmacKey,this.bigEndianMod))}};function aa(e){let t;return e=="SHA-224"?t=ot.slice():t=it.slice(),t}function Ps(e,t){let n,r,s,a,o,i,l,c,d,m,h;const v=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],i=t[5],l=t[6],c=t[7],h=0;h<64;h+=1)h<16?v[h]=e[h]:v[h]=Sf(Of(v[h-2]),v[h-7],If(v[h-15]),v[h-16]),d=qt(c,Cf(o),As(o,i,l),K[h],v[h]),m=Me(Ef(n),Ns(n,r,s)),c=l,l=i,i=o,o=Me(a,d),a=s,s=r,r=n,n=Me(d,m);return t[0]=Me(n,t[0]),t[1]=Me(r,t[1]),t[2]=Me(s,t[2]),t[3]=Me(a,t[3]),t[4]=Me(o,t[4]),t[5]=Me(i,t[5]),t[6]=Me(l,t[6]),t[7]=Me(c,t[7]),t}function Nf(e,t,n,r,s){let a,o;const i=(t+65>>>9<<4)+15,l=16,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/rn|0,a=0;a<e.length;a+=l)r=Ps(e.slice(a,a+l),r);return s==="SHA-224"?o=[r[0],r[1],r[2],r[3],r[4],r[5],r[6]]:o=r,o}let Mf=class extends Pn{constructor(t,n,r){if(!(t==="SHA-224"||t==="SHA-256"))throw new Error(an);super(t,n,r),U(this,"intermediateState"),U(this,"variantBlockSize"),U(this,"bigEndianMod"),U(this,"outputBinLen"),U(this,"isVariableLen"),U(this,"HMACSupported"),U(this,"converterFunc"),U(this,"roundFunc"),U(this,"finalizeFunc"),U(this,"stateCloneFunc"),U(this,"newStateFunc"),U(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ps,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=aa,this.finalizeFunc=function(a,o,i,l){return Nf(a,o,i,l,t)},this.intermediateState=aa(t),this.variantBlockSize=512,this.outputBinLen=t==="SHA-224"?224:256,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ft("hmacKey",s.hmacKey,this.bigEndianMod))}};class w{constructor(t,n){U(this,"highOrder"),U(this,"lowOrder"),this.highOrder=t,this.lowOrder=n}}function sa(e,t){let n;return t>32?(n=64-t,new w(e.lowOrder<<t|e.highOrder>>>n,e.highOrder<<t|e.lowOrder>>>n)):t!==0?(n=32-t,new w(e.highOrder<<t|e.lowOrder>>>n,e.lowOrder<<t|e.highOrder>>>n)):e}function Qe(e,t){let n;return t<32?(n=32-t,new w(e.highOrder>>>t|e.lowOrder<<n,e.lowOrder>>>t|e.highOrder<<n)):(n=64-t,new w(e.lowOrder>>>t|e.highOrder<<n,e.highOrder>>>t|e.lowOrder<<n))}function $s(e,t){return new w(e.highOrder>>>t,e.lowOrder>>>t|e.highOrder<<32-t)}function Pf(e,t,n){return new w(e.highOrder&t.highOrder^~e.highOrder&n.highOrder,e.lowOrder&t.lowOrder^~e.lowOrder&n.lowOrder)}function $f(e,t,n){return new w(e.highOrder&t.highOrder^e.highOrder&n.highOrder^t.highOrder&n.highOrder,e.lowOrder&t.lowOrder^e.lowOrder&n.lowOrder^t.lowOrder&n.lowOrder)}function Rf(e){const t=Qe(e,28),n=Qe(e,34),r=Qe(e,39);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Ue(e,t){let n,r;n=(e.lowOrder&65535)+(t.lowOrder&65535),r=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n>>>16);const s=(r&65535)<<16|n&65535;n=(e.highOrder&65535)+(t.highOrder&65535)+(r>>>16),r=(e.highOrder>>>16)+(t.highOrder>>>16)+(n>>>16);const a=(r&65535)<<16|n&65535;return new w(a,s)}function Ff(e,t,n,r){let s,a;s=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535),a=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s>>>16);const o=(a&65535)<<16|s&65535;s=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(a>>>16),a=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s>>>16);const i=(a&65535)<<16|s&65535;return new w(i,o)}function Df(e,t,n,r,s){let a,o;a=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535)+(s.lowOrder&65535),o=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s.lowOrder>>>16)+(a>>>16);const i=(o&65535)<<16|a&65535;a=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(s.highOrder&65535)+(o>>>16),o=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s.highOrder>>>16)+(a>>>16);const l=(o&65535)<<16|a&65535;return new w(l,i)}function Yt(e,t){return new w(e.highOrder^t.highOrder,e.lowOrder^t.lowOrder)}function xf(e,t,n,r,s){return new w(e.highOrder^t.highOrder^n.highOrder^r.highOrder^s.highOrder,e.lowOrder^t.lowOrder^n.lowOrder^r.lowOrder^s.lowOrder)}function Vf(e){const t=Qe(e,19),n=Qe(e,61),r=$s(e,6);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Hf(e){const t=Qe(e,1),n=Qe(e,8),r=$s(e,7);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Uf(e){const t=Qe(e,14),n=Qe(e,18),r=Qe(e,41);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}const Bf=[new w(K[0],3609767458),new w(K[1],602891725),new w(K[2],3964484399),new w(K[3],2173295548),new w(K[4],4081628472),new w(K[5],3053834265),new w(K[6],2937671579),new w(K[7],3664609560),new w(K[8],2734883394),new w(K[9],1164996542),new w(K[10],1323610764),new w(K[11],3590304994),new w(K[12],4068182383),new w(K[13],991336113),new w(K[14],633803317),new w(K[15],3479774868),new w(K[16],2666613458),new w(K[17],944711139),new w(K[18],2341262773),new w(K[19],2007800933),new w(K[20],1495990901),new w(K[21],1856431235),new w(K[22],3175218132),new w(K[23],2198950837),new w(K[24],3999719339),new w(K[25],766784016),new w(K[26],2566594879),new w(K[27],3203337956),new w(K[28],1034457026),new w(K[29],2466948901),new w(K[30],3758326383),new w(K[31],168717936),new w(K[32],1188179964),new w(K[33],1546045734),new w(K[34],1522805485),new w(K[35],2643833823),new w(K[36],2343527390),new w(K[37],1014477480),new w(K[38],1206759142),new w(K[39],344077627),new w(K[40],1290863460),new w(K[41],3158454273),new w(K[42],3505952657),new w(K[43],106217008),new w(K[44],3606008344),new w(K[45],1432725776),new w(K[46],1467031594),new w(K[47],851169720),new w(K[48],3100823752),new w(K[49],1363258195),new w(K[50],3750685593),new w(K[51],3785050280),new w(K[52],3318307427),new w(K[53],3812723403),new w(K[54],2003034995),new w(K[55],3602036899),new w(K[56],1575990012),new w(K[57],1125592928),new w(K[58],2716904306),new w(K[59],442776044),new w(K[60],593698344),new w(K[61],3733110249),new w(K[62],2999351573),new w(K[63],3815920427),new w(3391569614,3928383900),new w(3515267271,566280711),new w(3940187606,3454069534),new w(4118630271,4000239992),new w(116418474,1914138554),new w(174292421,2731055270),new w(289380356,3203993006),new w(460393269,320620315),new w(685471733,587496836),new w(852142971,1086792851),new w(1017036298,365543100),new w(1126000580,2618297676),new w(1288033470,3409855158),new w(1501505948,4234509866),new w(1607167915,987167468),new w(1816402316,1246189591)];function oa(e){return e==="SHA-384"?[new w(3418070365,ot[0]),new w(1654270250,ot[1]),new w(2438529370,ot[2]),new w(355462360,ot[3]),new w(1731405415,ot[4]),new w(41048885895,ot[5]),new w(3675008525,ot[6]),new w(1203062813,ot[7])]:[new w(it[0],4089235720),new w(it[1],2227873595),new w(it[2],4271175723),new w(it[3],1595750129),new w(it[4],2917565137),new w(it[5],725511199),new w(it[6],4215389547),new w(it[7],327033209)]}function Rs(e,t){let n,r,s,a,o,i,l,c,d,m,h,v;const S=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],i=t[5],l=t[6],c=t[7],h=0;h<80;h+=1)h<16?(v=h*2,S[h]=new w(e[v],e[v+1])):S[h]=Ff(Vf(S[h-2]),S[h-7],Hf(S[h-15]),S[h-16]),d=Df(c,Uf(o),Pf(o,i,l),Bf[h],S[h]),m=Ue(Rf(n),$f(n,r,s)),c=l,l=i,i=o,o=Ue(a,d),a=s,s=r,r=n,n=Ue(d,m);return t[0]=Ue(n,t[0]),t[1]=Ue(r,t[1]),t[2]=Ue(s,t[2]),t[3]=Ue(a,t[3]),t[4]=Ue(o,t[4]),t[5]=Ue(i,t[5]),t[6]=Ue(l,t[6]),t[7]=Ue(c,t[7]),t}function Wf(e,t,n,r,s){let a,o;const i=(t+129>>>10<<5)+31,l=32,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/rn|0,a=0;a<e.length;a+=l)r=Rs(e.slice(a,a+l),r);return s==="SHA-384"?(r=r,o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder]):o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder,r[6].highOrder,r[6].lowOrder,r[7].highOrder,r[7].lowOrder],o}let jf=class extends Pn{constructor(t,n,r){if(!(t==="SHA-384"||t==="SHA-512"))throw new Error(an);super(t,n,r),U(this,"intermediateState"),U(this,"variantBlockSize"),U(this,"bigEndianMod"),U(this,"outputBinLen"),U(this,"isVariableLen"),U(this,"HMACSupported"),U(this,"converterFunc"),U(this,"roundFunc"),U(this,"finalizeFunc"),U(this,"stateCloneFunc"),U(this,"newStateFunc"),U(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Rs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=oa,this.finalizeFunc=function(a,o,i,l){return Wf(a,o,i,l,t)},this.intermediateState=oa(t),this.variantBlockSize=1024,this.outputBinLen=t==="SHA-384"?384:512,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ft("hmacKey",s.hmacKey,this.bigEndianMod))}};const Kf=[new w(0,1),new w(0,32898),new w(2147483648,32906),new w(2147483648,2147516416),new w(0,32907),new w(0,2147483649),new w(2147483648,2147516545),new w(2147483648,32777),new w(0,138),new w(0,136),new w(0,2147516425),new w(0,2147483658),new w(0,2147516555),new w(2147483648,139),new w(2147483648,32905),new w(2147483648,32771),new w(2147483648,32770),new w(2147483648,128),new w(0,32778),new w(2147483648,2147483658),new w(2147483648,2147516545),new w(2147483648,32896),new w(0,2147483649),new w(2147483648,2147516424)],Gf=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function ir(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=[new w(0,0),new w(0,0),new w(0,0),new w(0,0),new w(0,0)];return n}function Yf(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=e[t].slice();return n}function fn(e,t){let n,r,s,a;const o=[],i=[];if(e!==null)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=Yt(t[(r>>>1)%5][(r>>>1)/5|0],new w(e[r+1],e[r]));for(n=0;n<24;n+=1){for(a=ir(),r=0;r<5;r+=1)o[r]=xf(t[r][0],t[r][1],t[r][2],t[r][3],t[r][4]);for(r=0;r<5;r+=1)i[r]=Yt(o[(r+4)%5],sa(o[(r+1)%5],1));for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=Yt(t[r][s],i[r]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)a[s][(2*r+3*s)%5]=sa(t[r][s],Gf[r][s]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=Yt(a[r][s],new w(~a[(r+1)%5][s].highOrder&a[(r+2)%5][s].highOrder,~a[(r+1)%5][s].lowOrder&a[(r+2)%5][s].lowOrder));t[0][0]=Yt(t[0][0],Kf[n])}return t}function Xf(e,t,n,r,s,a,o){let i,l=0,c;const d=[],m=s>>>5,h=t>>>5;for(i=0;i<h&&t>=s;i+=m)r=fn(e.slice(i,i+m),r),t-=s;for(e=e.slice(i),t=t%s;e.length<m;)e.push(0);for(i=t>>>3,e[i>>2]^=a<<8*(i%4),e[m-1]^=2147483648,r=fn(e,r);d.length*32<o&&(c=r[l%5][l/5|0],d.push(c.lowOrder),!(d.length*32>=o));)d.push(c.highOrder),l+=1,l*64%s===0&&(fn(null,r),l=0);return d}function Fs(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/rn&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r+1>>2]|=n<<(r+1)*8,r+=1);return r=r!==0?r:1,s[0]|=r,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function zf(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/rn&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r>>2]|=n<<r*8,r+=1);return r=r!==0?r:1,s[r>>2]|=r<<r*8,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function Wn(e){return kn(Fs(e.binLen),e)}function ia(e,t){let n=Fs(t),r;n=kn(n,e);const s=t>>>2,a=(s-n.value.length%s)%s;for(r=0;r<a;r++)n.value.push(0);return n.value}function qf(e){const t=e||{};return{funcName:ft("funcName",t.funcName,1,{value:[],binLen:0}),customization:ft("Customization",t.customization,1,{value:[],binLen:0})}}function Jf(e){const t=e||{};return{kmacKey:ft("kmacKey",t.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:ft("Customization",t.customization,1,{value:[],binLen:0})}}let Qf=class extends Pn{constructor(t,n,r){let s=6,a=0;super(t,n,r),U(this,"intermediateState"),U(this,"variantBlockSize"),U(this,"bigEndianMod"),U(this,"outputBinLen"),U(this,"isVariableLen"),U(this,"HMACSupported"),U(this,"converterFunc"),U(this,"roundFunc"),U(this,"finalizeFunc"),U(this,"stateCloneFunc"),U(this,"newStateFunc"),U(this,"getMAC");const o=r||{};if(this.numRounds!==1){if(o.kmacKey||o.hmacKey)throw new Error(Cs);if(this.shaVariant==="CSHAKE128"||this.shaVariant==="CSHAKE256")throw new Error("Cannot set numRounds for CSHAKE variants")}switch(this.bigEndianMod=1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=fn,this.stateCloneFunc=Yf,this.newStateFunc=ir,this.intermediateState=ir(),this.isVariableLen=!1,t){case"SHA3-224":this.variantBlockSize=a=1152,this.outputBinLen=224,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-256":this.variantBlockSize=a=1088,this.outputBinLen=256,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-384":this.variantBlockSize=a=832,this.outputBinLen=384,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-512":this.variantBlockSize=a=576,this.outputBinLen=512,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHAKE128":s=31,this.variantBlockSize=a=1344,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"SHAKE256":s=31,this.variantBlockSize=a=1088,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"KMAC128":s=4,this.variantBlockSize=a=1344,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"KMAC256":s=4,this.variantBlockSize=a=1088,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"CSHAKE128":this.variantBlockSize=a=1344,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"CSHAKE256":this.variantBlockSize=a=1088,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;default:throw new Error(an)}this.finalizeFunc=function(i,l,c,d,m){return Xf(i,l,c,d,a,s,m)},o.hmacKey&&this._setHMACKey(ft("hmacKey",o.hmacKey,this.bigEndianMod))}_initializeCSHAKE(t,n){const r=qf(t||{});n&&(r.funcName=n);const s=kn(Wn(r.funcName),Wn(r.customization));if(r.customization.binLen!==0||r.funcName.binLen!==0){const a=ia(s,this.variantBlockSize>>>3);for(let o=0;o<a.length;o+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(a.slice(o,o+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;return 4}else return 31}_initializeKMAC(t){const n=Jf(t||{});this._initializeCSHAKE(t,n.funcName);const r=ia(Wn(n.kmacKey),this.variantBlockSize>>>3);for(let s=0;s<r.length;s+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(r.slice(s,s+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;this.macKeySet=!0}_getKMAC(t){const n=kn({value:this.remainder.slice(),binLen:this.remainderLen},zf(t.outputLen));return this.finalizeFunc(n.value,n.binLen,this.processedLen,this.stateCloneFunc(this.intermediateState),t.outputLen)}};class Zf{constructor(t,n,r){if(U(this,"shaObj"),t=="SHA-1")this.shaObj=new Af(t,n,r);else if(t=="SHA-224"||t=="SHA-256")this.shaObj=new Mf(t,n,r);else if(t=="SHA-384"||t=="SHA-512")this.shaObj=new jf(t,n,r);else if(t=="SHA3-224"||t=="SHA3-256"||t=="SHA3-384"||t=="SHA3-512"||t=="SHAKE128"||t=="SHAKE256"||t=="CSHAKE128"||t=="CSHAKE256"||t=="KMAC128"||t=="KMAC256")this.shaObj=new Qf(t,n,r);else throw new Error(an)}update(t){return this.shaObj.update(t),this}getHash(t,n){return this.shaObj.getHash(t,n)}setHMACKey(t,n,r){this.shaObj.setHMACKey(t,n,r)}getHMAC(t,n){return this.shaObj.getHMAC(t,n)}}class ep{static generate(t,n){const r={digits:6,algorithm:"SHA-1",period:30,timestamp:Date.now(),...n},s=Math.floor(r.timestamp/1e3),a=this.leftpad(this.dec2hex(Math.floor(s/r.period)),16,"0"),o=new Zf(r.algorithm,"HEX");o.setHMACKey(this.base32tohex(t),"HEX"),o.update(a);const i=o.getHMAC("HEX"),l=this.hex2dec(i.substring(i.length-1));let c=(this.hex2dec(i.substr(l*2,8))&this.hex2dec("7fffffff"))+"";const d=Math.max(c.length-r.digits,0);c=c.substring(d,d+r.digits);const m=Math.ceil((r.timestamp+1)/(r.period*1e3))*r.period*1e3;return{otp:c,expires:m}}static hex2dec(t){return parseInt(t,16)}static dec2hex(t){return(t<15.5?"0":"")+Math.round(t).toString(16)}static base32tohex(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let r="",s="";const a=t.replace(/=+$/,"");for(let o=0;o<a.length;o++){const i=n.indexOf(t.charAt(o).toUpperCase());if(i===-1)throw new Error("Invalid base32 character in key");r+=this.leftpad(i.toString(2),5,"0")}for(let o=0;o+8<=r.length;o+=8){const i=r.substr(o,8);s=s+this.leftpad(parseInt(i,2).toString(16),2,"0")}return s}static leftpad(t,n,r){return n+1>=t.length&&(t=Array(n+1-t.length).join(r)+t),t}}const tp=(e,t)=>{nn&&localStorage.setItem(e,t)},np=e=>nn&&localStorage.getItem(e)||"";function Xt(e){return e<10?`0${e}`:e}function rp(e){let t=new Date;return e&&(t=new Date(e)),t.format=(n="YYYY-MM-DD HH:mm:ss")=>{const r=t.getFullYear(),s=Xt(t.getMonth()+1),a=Xt(t.getDate()),o=Xt(t.getHours()),i=Xt(t.getMinutes()),l=Xt(t.getSeconds());return n.replace(/Y+/gi,`${r}`).replace(/M+/g,`${s}`).replace(/D+/gi,`${a}`).replace(/H+/gi,`${o}`).replace(/m+/g,`${i}`).replace(/S+/gi,`${l}`)},t}const ap=e=>{if(typeof window<"u"){const t={},n=e||window.location.href;return n.split("?")[1]&&n.split("?")[1].split("&").forEach(a=>{const[o,i]=a.split("=");o&&i&&(t[o]=decodeURIComponent(i))}),t}return{}},sp=(e,t)=>{typeof window<"u"&&(window[e]=t),typeof global<"u"&&(global[e]=t)},jn=new Map([[100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],[200,"OK"],[201,"Created"],[202,"Accepted"],[203,"Non-Authoritative Information"],[204,"No Content"],[205,"Reset Content"],[206,"Partial Content"],[207,"Multi-Status"],[208,"Already Reported"],[226,"IM Used"],[300,"Multiple Choices"],[301,"Moved Permanently"],[302,"Found"],[303,"See Other"],[304,"Not Modified"],[305,"Use Proxy"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],[400,"Bad Request"],[401,"Unauthorized"],[402,"Payment Required"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[406,"Not Acceptable"],[407,"Proxy Authentication Required"],[408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[411,"Length Required"],[412,"Precondition Failed"],[413,"Payload Too Large"],[414,"URI Too Long"],[415,"Unsupported Media Type"],[416,"Range Not Satisfiable"],[417,"Expectation Failed"],[418,"I'm a Teapot"],[421,"Misdirected Request"],[422,"Unprocessable Entity"],[423,"Locked"],[424,"Failed Dependency"],[425,"Too Early"],[426,"Upgrade Required"],[428,"Precondition Required"],[429,"Too Many Requests"],[431,"Request Header Fields Too Large"],[451,"Unavailable For Legal Reasons"],[500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],[505,"HTTP Version Not Supported"],[506,"Variant Also Negotiates"],[507,"Insufficient Storage"],[508,"Loop Detected"],[509,"Bandwidth Limit Exceeded"],[510,"Not Extended"],[511,"Network Authentication Required"]]);op(jn),ip(jn);function op(e){const t=new Map;for(const[n,r]of e)t.set(r.toLowerCase(),n);return t}function ip(e){const t=[];for(const[n,r]of e)t.push(n);return t}const et=class{constructor(){U(this,"getDecimalLength",t=>{const[n,r]=t.toString().split(".");return r?r.length:0}),U(this,"amend",(t,n=15)=>parseFloat(Number(t).toPrecision(n))),U(this,"power",(t,n)=>Math.pow(10,Math.max(this.getDecimalLength(t),this.getDecimalLength(n))))}};U(et,"handleMethod",(e,t)=>{const n=new et,{power:r,amend:s}=n,a=r(e,t),o=s(e*a),i=s(t*a);return l=>{switch(l){case"+":return(o+i)/a;case"-":return(o-i)/a;case"*":return o*i/(a*a);case"/":return o/i}}});U(et,"add",(e,t)=>et.handleMethod(e,t)("+"));U(et,"divide",(e,t)=>et.handleMethod(e,t)("/"));U(et,"multiply",(e,t)=>et.handleMethod(e,t)("*"));U(et,"subtract",(e,t)=>et.handleMethod(e,t)("-"));var At=(e=>(e.NORMAL="normal",e.ERROR="error",e.WARNING="warning",e))(At||{}),sn=(e=>(e.EN="en",e.ZH_CN="zh-CN",e))(sn||{});const Ds="ran_chaxus_lang",la=[],lp={"zh-CN":{lang:"简体中文"},en:{lang:"English"}};var xs=(e=>(e.LEGACY="legacy",e))(xs||{});const cp=!1;ap();const lr={isDev:cp,locale:sn.EN,currentDevice:uf(),isWeiXin:df(),isMobile:hf(),isBang:mf()},up={install:e=>{e.config.globalProperties.$env=lr,e.provide("$env",lr)}};/*!
  * shared v9.12.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const wn=typeof window<"u",bt=(e,t=!1)=>t?Symbol.for(e):Symbol(e),dp=(e,t,n)=>hp({l:e,k:t,s:n}),hp=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Se=e=>typeof e=="number"&&isFinite(e),mp=e=>Hs(e)==="[object Date]",pt=e=>Hs(e)==="[object RegExp]",$n=e=>te(e)&&Object.keys(e).length===0,Ne=Object.assign;let ca;const lt=()=>ca||(ca=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function ua(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const fp=Object.prototype.hasOwnProperty;function Ln(e,t){return fp.call(e,t)}const ve=Array.isArray,fe=e=>typeof e=="function",H=e=>typeof e=="string",re=e=>typeof e=="boolean",ce=e=>e!==null&&typeof e=="object",pp=e=>ce(e)&&fe(e.then)&&fe(e.catch),Vs=Object.prototype.toString,Hs=e=>Vs.call(e),te=e=>{if(!ce(e))return!1;const t=Object.getPrototypeOf(e);return t===null||t.constructor===Object},gp=e=>e==null?"":ve(e)||te(e)&&e.toString===Vs?JSON.stringify(e,null,2):String(e);function vp(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}function Rn(e){let t=e;return()=>++t}function _p(e,t){typeof console<"u"&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const un=e=>!ce(e)||ve(e);function pn(e,t){if(un(e)||un(t))throw new Error("Invalid value");const n=[{src:e,des:t}];for(;n.length;){const{src:r,des:s}=n.pop();Object.keys(r).forEach(a=>{un(r[a])||un(s[a])?s[a]=r[a]:n.push({src:r[a],des:s[a]})})}}/*!
  * message-compiler v9.12.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function bp(e,t,n){return{line:e,column:t,offset:n}}function En(e,t,n){const r={start:e,end:t};return n!=null&&(r.source=n),r}const yp=/\{([0-9a-zA-Z]+)\}/g;function Us(e,...t){return t.length===1&&kp(t[0])&&(t=t[0]),(!t||!t.hasOwnProperty)&&(t={}),e.replace(yp,(n,r)=>t.hasOwnProperty(r)?t[r]:"")}const Bs=Object.assign,da=e=>typeof e=="string",kp=e=>e!==null&&typeof e=="object";function Ws(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}const Tr={USE_MODULO_SYNTAX:1,__EXTEND_POINT__:2},wp={[Tr.USE_MODULO_SYNTAX]:"Use modulo before '{{0}}'."};function Lp(e,t,...n){const r=Us(wp[e]||"",...n||[]),s={message:String(r),code:e};return t&&(s.location=t),s}const J={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14,UNHANDLED_CODEGEN_NODE_TYPE:15,UNHANDLED_MINIFIER_NODE_TYPE:16,__EXTEND_POINT__:17},Ep={[J.EXPECTED_TOKEN]:"Expected token: '{0}'",[J.INVALID_TOKEN_IN_PLACEHOLDER]:"Invalid token in placeholder: '{0}'",[J.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]:"Unterminated single quote in placeholder",[J.UNKNOWN_ESCAPE_SEQUENCE]:"Unknown escape sequence: \\{0}",[J.INVALID_UNICODE_ESCAPE_SEQUENCE]:"Invalid unicode escape sequence: {0}",[J.UNBALANCED_CLOSING_BRACE]:"Unbalanced closing brace",[J.UNTERMINATED_CLOSING_BRACE]:"Unterminated closing brace",[J.EMPTY_PLACEHOLDER]:"Empty placeholder",[J.NOT_ALLOW_NEST_PLACEHOLDER]:"Not allowed nest placeholder",[J.INVALID_LINKED_FORMAT]:"Invalid linked format",[J.MUST_HAVE_MESSAGES_IN_PLURAL]:"Plural must have messages",[J.UNEXPECTED_EMPTY_LINKED_MODIFIER]:"Unexpected empty linked modifier",[J.UNEXPECTED_EMPTY_LINKED_KEY]:"Unexpected empty linked key",[J.UNEXPECTED_LEXICAL_ANALYSIS]:"Unexpected lexical analysis in token: '{0}'",[J.UNHANDLED_CODEGEN_NODE_TYPE]:"unhandled codegen node type: '{0}'",[J.UNHANDLED_MINIFIER_NODE_TYPE]:"unhandled mimifier node type: '{0}'"};function Kt(e,t,n={}){const{domain:r,messages:s,args:a}=n,o=Us((s||Ep)[e]||"",...a||[]),i=new SyntaxError(String(o));return i.code=e,t&&(i.location=t),i.domain=r,i}function Sp(e){throw e}const at=" ",Op="\r",$e=`
`,Ip="\u2028",Cp="\u2029";function Tp(e){const t=e;let n=0,r=1,s=1,a=0;const o=P=>t[P]===Op&&t[P+1]===$e,i=P=>t[P]===$e,l=P=>t[P]===Cp,c=P=>t[P]===Ip,d=P=>o(P)||i(P)||l(P)||c(P),m=()=>n,h=()=>r,v=()=>s,S=()=>a,_=P=>o(P)||l(P)||c(P)?$e:t[P],y=()=>_(n),M=()=>_(n+a);function W(){return a=0,d(n)&&(r++,s=0),o(n)&&n++,n++,s++,t[n]}function b(){return o(n+a)&&a++,a++,t[n+a]}function L(){n=0,r=1,s=1,a=0}function N(P=0){a=P}function C(){const P=n+a;for(;P!==n;)W();a=0}return{index:m,line:h,column:v,peekOffset:S,charAt:_,currentChar:y,currentPeek:M,next:W,peek:b,reset:L,resetPeek:N,skipToPeek:C}}const mt=void 0,Ap=".",ha="'",Np="tokenizer";function Mp(e,t={}){const n=t.location!==!1,r=Tp(e),s=()=>r.index(),a=()=>bp(r.line(),r.column(),r.index()),o=a(),i=s(),l={currentType:14,offset:i,startLoc:o,endLoc:o,lastType:14,lastOffset:i,lastStartLoc:o,lastEndLoc:o,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:d}=t;function m(f,u,E,...B){const Z=c();if(u.column+=E,u.offset+=E,d){const le=n?En(Z.startLoc,u):null,Ye=Kt(f,le,{domain:Np,args:B});d(Ye)}}function h(f,u,E){f.endLoc=a(),f.currentType=u;const B={type:u};return n&&(B.loc=En(f.startLoc,f.endLoc)),E!=null&&(B.value=E),B}const v=f=>h(f,14);function S(f,u){return f.currentChar()===u?(f.next(),u):(m(J.EXPECTED_TOKEN,a(),0,u),"")}function _(f){let u="";for(;f.currentPeek()===at||f.currentPeek()===$e;)u+=f.currentPeek(),f.peek();return u}function y(f){const u=_(f);return f.skipToPeek(),u}function M(f){if(f===mt)return!1;const u=f.charCodeAt(0);return u>=97&&u<=122||u>=65&&u<=90||u===95}function W(f){if(f===mt)return!1;const u=f.charCodeAt(0);return u>=48&&u<=57}function b(f,u){const{currentType:E}=u;if(E!==2)return!1;_(f);const B=M(f.currentPeek());return f.resetPeek(),B}function L(f,u){const{currentType:E}=u;if(E!==2)return!1;_(f);const B=f.currentPeek()==="-"?f.peek():f.currentPeek(),Z=W(B);return f.resetPeek(),Z}function N(f,u){const{currentType:E}=u;if(E!==2)return!1;_(f);const B=f.currentPeek()===ha;return f.resetPeek(),B}function C(f,u){const{currentType:E}=u;if(E!==8)return!1;_(f);const B=f.currentPeek()===".";return f.resetPeek(),B}function P(f,u){const{currentType:E}=u;if(E!==9)return!1;_(f);const B=M(f.currentPeek());return f.resetPeek(),B}function F(f,u){const{currentType:E}=u;if(!(E===8||E===12))return!1;_(f);const B=f.currentPeek()===":";return f.resetPeek(),B}function $(f,u){const{currentType:E}=u;if(E!==10)return!1;const B=()=>{const le=f.currentPeek();return le==="{"?M(f.peek()):le==="@"||le==="%"||le==="|"||le===":"||le==="."||le===at||!le?!1:le===$e?(f.peek(),B()):M(le)},Z=B();return f.resetPeek(),Z}function ue(f){_(f);const u=f.currentPeek()==="|";return f.resetPeek(),u}function be(f){const u=_(f),E=f.currentPeek()==="%"&&f.peek()==="{";return f.resetPeek(),{isModulo:E,hasSpace:u.length>0}}function Q(f,u=!0){const E=(Z=!1,le="",Ye=!1)=>{const rt=f.currentPeek();return rt==="{"?le==="%"?!1:Z:rt==="@"||!rt?le==="%"?!0:Z:rt==="%"?(f.peek(),E(Z,"%",!0)):rt==="|"?le==="%"||Ye?!0:!(le===at||le===$e):rt===at?(f.peek(),E(!0,at,Ye)):rt===$e?(f.peek(),E(!0,$e,Ye)):!0},B=E();return u&&f.resetPeek(),B}function D(f,u){const E=f.currentChar();return E===mt?mt:u(E)?(f.next(),E):null}function se(f){return D(f,E=>{const B=E.charCodeAt(0);return B>=97&&B<=122||B>=65&&B<=90||B>=48&&B<=57||B===95||B===36})}function ke(f){return D(f,E=>{const B=E.charCodeAt(0);return B>=48&&B<=57})}function Ee(f){return D(f,E=>{const B=E.charCodeAt(0);return B>=48&&B<=57||B>=65&&B<=70||B>=97&&B<=102})}function ge(f){let u="",E="";for(;u=ke(f);)E+=u;return E}function He(f){y(f);const u=f.currentChar();return u!=="%"&&m(J.EXPECTED_TOKEN,a(),0,u),f.next(),"%"}function je(f){let u="";for(;;){const E=f.currentChar();if(E==="{"||E==="}"||E==="@"||E==="|"||!E)break;if(E==="%")if(Q(f))u+=E,f.next();else break;else if(E===at||E===$e)if(Q(f))u+=E,f.next();else{if(ue(f))break;u+=E,f.next()}else u+=E,f.next()}return u}function _e(f){y(f);let u="",E="";for(;u=se(f);)E+=u;return f.currentChar()===mt&&m(J.UNTERMINATED_CLOSING_BRACE,a(),0),E}function ye(f){y(f);let u="";return f.currentChar()==="-"?(f.next(),u+=`-${ge(f)}`):u+=ge(f),f.currentChar()===mt&&m(J.UNTERMINATED_CLOSING_BRACE,a(),0),u}function Ke(f){y(f),S(f,"'");let u="",E="";const B=le=>le!==ha&&le!==$e;for(;u=D(f,B);)u==="\\"?E+=j(f):E+=u;const Z=f.currentChar();return Z===$e||Z===mt?(m(J.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,a(),0),Z===$e&&(f.next(),S(f,"'")),E):(S(f,"'"),E)}function j(f){const u=f.currentChar();switch(u){case"\\":case"'":return f.next(),`\\${u}`;case"u":return ie(f,u,4);case"U":return ie(f,u,6);default:return m(J.UNKNOWN_ESCAPE_SEQUENCE,a(),0,u),""}}function ie(f,u,E){S(f,u);let B="";for(let Z=0;Z<E;Z++){const le=Ee(f);if(!le){m(J.INVALID_UNICODE_ESCAPE_SEQUENCE,a(),0,`\\${u}${B}${f.currentChar()}`);break}B+=le}return`\\${u}${B}`}function oe(f){y(f);let u="",E="";const B=Z=>Z!=="{"&&Z!=="}"&&Z!==at&&Z!==$e;for(;u=D(f,B);)E+=u;return E}function de(f){let u="",E="";for(;u=se(f);)E+=u;return E}function Fe(f){const u=(E=!1,B)=>{const Z=f.currentChar();return Z==="{"||Z==="%"||Z==="@"||Z==="|"||Z==="("||Z===")"||!Z||Z===at?B:Z===$e||Z===Ap?(B+=Z,f.next(),u(E,B)):(B+=Z,f.next(),u(!0,B))};return u(!1,"")}function xe(f){y(f);const u=S(f,"|");return y(f),u}function nt(f,u){let E=null;switch(f.currentChar()){case"{":return u.braceNest>=1&&m(J.NOT_ALLOW_NEST_PLACEHOLDER,a(),0),f.next(),E=h(u,2,"{"),y(f),u.braceNest++,E;case"}":return u.braceNest>0&&u.currentType===2&&m(J.EMPTY_PLACEHOLDER,a(),0),f.next(),E=h(u,3,"}"),u.braceNest--,u.braceNest>0&&y(f),u.inLinked&&u.braceNest===0&&(u.inLinked=!1),E;case"@":return u.braceNest>0&&m(J.UNTERMINATED_CLOSING_BRACE,a(),0),E=Ge(f,u)||v(u),u.braceNest=0,E;default:{let Z=!0,le=!0,Ye=!0;if(ue(f))return u.braceNest>0&&m(J.UNTERMINATED_CLOSING_BRACE,a(),0),E=h(u,1,xe(f)),u.braceNest=0,u.inLinked=!1,E;if(u.braceNest>0&&(u.currentType===5||u.currentType===6||u.currentType===7))return m(J.UNTERMINATED_CLOSING_BRACE,a(),0),u.braceNest=0,kt(f,u);if(Z=b(f,u))return E=h(u,5,_e(f)),y(f),E;if(le=L(f,u))return E=h(u,6,ye(f)),y(f),E;if(Ye=N(f,u))return E=h(u,7,Ke(f)),y(f),E;if(!Z&&!le&&!Ye)return E=h(u,13,oe(f)),m(J.INVALID_TOKEN_IN_PLACEHOLDER,a(),0,E.value),y(f),E;break}}return E}function Ge(f,u){const{currentType:E}=u;let B=null;const Z=f.currentChar();switch((E===8||E===9||E===12||E===10)&&(Z===$e||Z===at)&&m(J.INVALID_LINKED_FORMAT,a(),0),Z){case"@":return f.next(),B=h(u,8,"@"),u.inLinked=!0,B;case".":return y(f),f.next(),h(u,9,".");case":":return y(f),f.next(),h(u,10,":");default:return ue(f)?(B=h(u,1,xe(f)),u.braceNest=0,u.inLinked=!1,B):C(f,u)||F(f,u)?(y(f),Ge(f,u)):P(f,u)?(y(f),h(u,12,de(f))):$(f,u)?(y(f),Z==="{"?nt(f,u)||B:h(u,11,Fe(f))):(E===8&&m(J.INVALID_LINKED_FORMAT,a(),0),u.braceNest=0,u.inLinked=!1,kt(f,u))}}function kt(f,u){let E={type:14};if(u.braceNest>0)return nt(f,u)||v(u);if(u.inLinked)return Ge(f,u)||v(u);switch(f.currentChar()){case"{":return nt(f,u)||v(u);case"}":return m(J.UNBALANCED_CLOSING_BRACE,a(),0),f.next(),h(u,3,"}");case"@":return Ge(f,u)||v(u);default:{if(ue(f))return E=h(u,1,xe(f)),u.braceNest=0,u.inLinked=!1,E;const{isModulo:Z,hasSpace:le}=be(f);if(Z)return le?h(u,0,je(f)):h(u,4,He(f));if(Q(f))return h(u,0,je(f));break}}return E}function Gt(){const{currentType:f,offset:u,startLoc:E,endLoc:B}=l;return l.lastType=f,l.lastOffset=u,l.lastStartLoc=E,l.lastEndLoc=B,l.offset=s(),l.startLoc=a(),r.currentChar()===mt?h(l,14):kt(r,l)}return{nextToken:Gt,currentOffset:s,currentPosition:a,context:c}}const Pp="parser",$p=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Rp(e,t,n){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(t||n,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function Fp(e={}){const t=e.location!==!1,{onError:n,onWarn:r}=e;function s(b,L,N,C,...P){const F=b.currentPosition();if(F.offset+=C,F.column+=C,n){const $=t?En(N,F):null,ue=Kt(L,$,{domain:Pp,args:P});n(ue)}}function a(b,L,N,C,...P){const F=b.currentPosition();if(F.offset+=C,F.column+=C,r){const $=t?En(N,F):null;r(Lp(L,$,P))}}function o(b,L,N){const C={type:b};return t&&(C.start=L,C.end=L,C.loc={start:N,end:N}),C}function i(b,L,N,C){C&&(b.type=C),t&&(b.end=L,b.loc&&(b.loc.end=N))}function l(b,L){const N=b.context(),C=o(3,N.offset,N.startLoc);return C.value=L,i(C,b.currentOffset(),b.currentPosition()),C}function c(b,L){const N=b.context(),{lastOffset:C,lastStartLoc:P}=N,F=o(5,C,P);return F.index=parseInt(L,10),b.nextToken(),i(F,b.currentOffset(),b.currentPosition()),F}function d(b,L,N){const C=b.context(),{lastOffset:P,lastStartLoc:F}=C,$=o(4,P,F);return $.key=L,N===!0&&($.modulo=!0),b.nextToken(),i($,b.currentOffset(),b.currentPosition()),$}function m(b,L){const N=b.context(),{lastOffset:C,lastStartLoc:P}=N,F=o(9,C,P);return F.value=L.replace($p,Rp),b.nextToken(),i(F,b.currentOffset(),b.currentPosition()),F}function h(b){const L=b.nextToken(),N=b.context(),{lastOffset:C,lastStartLoc:P}=N,F=o(8,C,P);return L.type!==12?(s(b,J.UNEXPECTED_EMPTY_LINKED_MODIFIER,N.lastStartLoc,0),F.value="",i(F,C,P),{nextConsumeToken:L,node:F}):(L.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,N.lastStartLoc,0,Be(L)),F.value=L.value||"",i(F,b.currentOffset(),b.currentPosition()),{node:F})}function v(b,L){const N=b.context(),C=o(7,N.offset,N.startLoc);return C.value=L,i(C,b.currentOffset(),b.currentPosition()),C}function S(b){const L=b.context(),N=o(6,L.offset,L.startLoc);let C=b.nextToken();if(C.type===9){const P=h(b);N.modifier=P.node,C=P.nextConsumeToken||b.nextToken()}switch(C.type!==10&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(C)),C=b.nextToken(),C.type===2&&(C=b.nextToken()),C.type){case 11:C.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(C)),N.key=v(b,C.value||"");break;case 5:C.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(C)),N.key=d(b,C.value||"");break;case 6:C.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(C)),N.key=c(b,C.value||"");break;case 7:C.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(C)),N.key=m(b,C.value||"");break;default:{s(b,J.UNEXPECTED_EMPTY_LINKED_KEY,L.lastStartLoc,0);const P=b.context(),F=o(7,P.offset,P.startLoc);return F.value="",i(F,P.offset,P.startLoc),N.key=F,i(N,P.offset,P.startLoc),{nextConsumeToken:C,node:N}}}return i(N,b.currentOffset(),b.currentPosition()),{node:N}}function _(b){const L=b.context(),N=L.currentType===1?b.currentOffset():L.offset,C=L.currentType===1?L.endLoc:L.startLoc,P=o(2,N,C);P.items=[];let F=null,$=null;do{const Q=F||b.nextToken();switch(F=null,Q.type){case 0:Q.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(Q)),P.items.push(l(b,Q.value||""));break;case 6:Q.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(Q)),P.items.push(c(b,Q.value||""));break;case 4:$=!0;break;case 5:Q.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(Q)),P.items.push(d(b,Q.value||"",!!$)),$&&(a(b,Tr.USE_MODULO_SYNTAX,L.lastStartLoc,0,Be(Q)),$=null);break;case 7:Q.value==null&&s(b,J.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,Be(Q)),P.items.push(m(b,Q.value||""));break;case 8:{const D=S(b);P.items.push(D.node),F=D.nextConsumeToken||null;break}}}while(L.currentType!==14&&L.currentType!==1);const ue=L.currentType===1?L.lastOffset:b.currentOffset(),be=L.currentType===1?L.lastEndLoc:b.currentPosition();return i(P,ue,be),P}function y(b,L,N,C){const P=b.context();let F=C.items.length===0;const $=o(1,L,N);$.cases=[],$.cases.push(C);do{const ue=_(b);F||(F=ue.items.length===0),$.cases.push(ue)}while(P.currentType!==14);return F&&s(b,J.MUST_HAVE_MESSAGES_IN_PLURAL,N,0),i($,b.currentOffset(),b.currentPosition()),$}function M(b){const L=b.context(),{offset:N,startLoc:C}=L,P=_(b);return L.currentType===14?P:y(b,N,C,P)}function W(b){const L=Mp(b,Bs({},e)),N=L.context(),C=o(0,N.offset,N.startLoc);return t&&C.loc&&(C.loc.source=b),C.body=M(L),e.onCacheKey&&(C.cacheKey=e.onCacheKey(b)),N.currentType!==14&&s(L,J.UNEXPECTED_LEXICAL_ANALYSIS,N.lastStartLoc,0,b[N.offset]||""),i(C,L.currentOffset(),L.currentPosition()),C}return{parse:W}}function Be(e){if(e.type===14)return"EOF";const t=(e.value||"").replace(/\r?\n/gu,"\\n");return t.length>10?t.slice(0,9)+"…":t}function Dp(e,t={}){const n={ast:e,helpers:new Set};return{context:()=>n,helper:a=>(n.helpers.add(a),a)}}function ma(e,t){for(let n=0;n<e.length;n++)Ar(e[n],t)}function Ar(e,t){switch(e.type){case 1:ma(e.cases,t),t.helper("plural");break;case 2:ma(e.items,t);break;case 6:{Ar(e.key,t),t.helper("linked"),t.helper("type");break}case 5:t.helper("interpolate"),t.helper("list");break;case 4:t.helper("interpolate"),t.helper("named");break}}function xp(e,t={}){const n=Dp(e);n.helper("normalize"),e.body&&Ar(e.body,n);const r=n.context();e.helpers=Array.from(r.helpers)}function Vp(e){const t=e.body;return t.type===2?fa(t):t.cases.forEach(n=>fa(n)),e}function fa(e){if(e.items.length===1){const t=e.items[0];(t.type===3||t.type===9)&&(e.static=t.value,delete t.value)}else{const t=[];for(let n=0;n<e.items.length;n++){const r=e.items[n];if(!(r.type===3||r.type===9)||r.value==null)break;t.push(r.value)}if(t.length===e.items.length){e.static=Ws(t);for(let n=0;n<e.items.length;n++){const r=e.items[n];(r.type===3||r.type===9)&&delete r.value}}}}const Hp="minifier";function Nt(e){switch(e.t=e.type,e.type){case 0:{const t=e;Nt(t.body),t.b=t.body,delete t.body;break}case 1:{const t=e,n=t.cases;for(let r=0;r<n.length;r++)Nt(n[r]);t.c=n,delete t.cases;break}case 2:{const t=e,n=t.items;for(let r=0;r<n.length;r++)Nt(n[r]);t.i=n,delete t.items,t.static&&(t.s=t.static,delete t.static);break}case 3:case 9:case 8:case 7:{const t=e;t.value&&(t.v=t.value,delete t.value);break}case 6:{const t=e;Nt(t.key),t.k=t.key,delete t.key,t.modifier&&(Nt(t.modifier),t.m=t.modifier,delete t.modifier);break}case 5:{const t=e;t.i=t.index,delete t.index;break}case 4:{const t=e;t.k=t.key,delete t.key;break}default:throw Kt(J.UNHANDLED_MINIFIER_NODE_TYPE,null,{domain:Hp,args:[e.type]})}delete e.type}const Up="parser";function Bp(e,t){const{sourceMap:n,filename:r,breakLineCode:s,needIndent:a}=t,o=t.location!==!1,i={filename:r,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:s,needIndent:a,indentLevel:0};o&&e.loc&&(i.source=e.loc.source);const l=()=>i;function c(y,M){i.code+=y}function d(y,M=!0){const W=M?s:"";c(a?W+"  ".repeat(y):W)}function m(y=!0){const M=++i.indentLevel;y&&d(M)}function h(y=!0){const M=--i.indentLevel;y&&d(M)}function v(){d(i.indentLevel)}return{context:l,push:c,indent:m,deindent:h,newline:v,helper:y=>`_${y}`,needIndent:()=>i.needIndent}}function Wp(e,t){const{helper:n}=e;e.push(`${n("linked")}(`),xt(e,t.key),t.modifier?(e.push(", "),xt(e,t.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function jp(e,t){const{helper:n,needIndent:r}=e;e.push(`${n("normalize")}([`),e.indent(r());const s=t.items.length;for(let a=0;a<s&&(xt(e,t.items[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}function Kp(e,t){const{helper:n,needIndent:r}=e;if(t.cases.length>1){e.push(`${n("plural")}([`),e.indent(r());const s=t.cases.length;for(let a=0;a<s&&(xt(e,t.cases[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}}function Gp(e,t){t.body?xt(e,t.body):e.push("null")}function xt(e,t){const{helper:n}=e;switch(t.type){case 0:Gp(e,t);break;case 1:Kp(e,t);break;case 2:jp(e,t);break;case 6:Wp(e,t);break;case 8:e.push(JSON.stringify(t.value),t);break;case 7:e.push(JSON.stringify(t.value),t);break;case 5:e.push(`${n("interpolate")}(${n("list")}(${t.index}))`,t);break;case 4:e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`,t);break;case 9:e.push(JSON.stringify(t.value),t);break;case 3:e.push(JSON.stringify(t.value),t);break;default:throw Kt(J.UNHANDLED_CODEGEN_NODE_TYPE,null,{domain:Up,args:[t.type]})}}const Yp=(e,t={})=>{const n=da(t.mode)?t.mode:"normal",r=da(t.filename)?t.filename:"message.intl",s=!!t.sourceMap,a=t.breakLineCode!=null?t.breakLineCode:n==="arrow"?";":`
`,o=t.needIndent?t.needIndent:n!=="arrow",i=e.helpers||[],l=Bp(e,{mode:n,filename:r,sourceMap:s,breakLineCode:a,needIndent:o});l.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),l.indent(o),i.length>0&&(l.push(`const { ${Ws(i.map(m=>`${m}: _${m}`),", ")} } = ctx`),l.newline()),l.push("return "),xt(l,e),l.deindent(o),l.push("}"),delete e.helpers;const{code:c,map:d}=l.context();return{ast:e,code:c,map:d?d.toJSON():void 0}};function Xp(e,t={}){const n=Bs({},t),r=!!n.jit,s=!!n.minify,a=n.optimize==null?!0:n.optimize,i=Fp(n).parse(e);return r?(a&&Vp(i),s&&Nt(i),{ast:i,code:""}):(xp(i,n),Yp(i,n))}/*!
  * core-base v9.12.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function zp(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(lt().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(lt().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(lt().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}const yt=[];yt[0]={w:[0],i:[3,0],"[":[4],o:[7]};yt[1]={w:[1],".":[2],"[":[4],o:[7]};yt[2]={w:[2],i:[3,0],0:[3,0]};yt[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};yt[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};yt[5]={"'":[4,0],o:8,l:[5,0]};yt[6]={'"':[4,0],o:8,l:[6,0]};const qp=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function Jp(e){return qp.test(e)}function Qp(e){const t=e.charCodeAt(0),n=e.charCodeAt(e.length-1);return t===n&&(t===34||t===39)?e.slice(1,-1):e}function Zp(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function e0(e){const t=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:Jp(t)?Qp(t):"*"+t}function t0(e){const t=[];let n=-1,r=0,s=0,a,o,i,l,c,d,m;const h=[];h[0]=()=>{o===void 0?o=i:o+=i},h[1]=()=>{o!==void 0&&(t.push(o),o=void 0)},h[2]=()=>{h[0](),s++},h[3]=()=>{if(s>0)s--,r=4,h[0]();else{if(s=0,o===void 0||(o=e0(o),o===!1))return!1;h[1]()}};function v(){const S=e[n+1];if(r===5&&S==="'"||r===6&&S==='"')return n++,i="\\"+S,h[0](),!0}for(;r!==null;)if(n++,a=e[n],!(a==="\\"&&v())){if(l=Zp(a),m=yt[r],c=m[l]||m.l||8,c===8||(r=c[0],c[1]!==void 0&&(d=h[c[1]],d&&(i=a,d()===!1))))return;if(r===7)return t}}const pa=new Map;function n0(e,t){return ce(e)?e[t]:null}function r0(e,t){if(!ce(e))return null;let n=pa.get(t);if(n||(n=t0(t),n&&pa.set(t,n)),!n)return null;const r=n.length;let s=e,a=0;for(;a<r;){const o=s[n[a]];if(o===void 0||fe(s))return null;s=o,a++}return s}const a0=e=>e,s0=e=>"",o0="text",i0=e=>e.length===0?"":vp(e),l0=gp;function ga(e,t){return e=Math.abs(e),t===2?e?e>1?1:0:1:e?Math.min(e,2):0}function c0(e){const t=Se(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Se(e.named.count)||Se(e.named.n))?Se(e.named.count)?e.named.count:Se(e.named.n)?e.named.n:t:t}function u0(e,t){t.count||(t.count=e),t.n||(t.n=e)}function d0(e={}){const t=e.locale,n=c0(e),r=ce(e.pluralRules)&&H(t)&&fe(e.pluralRules[t])?e.pluralRules[t]:ga,s=ce(e.pluralRules)&&H(t)&&fe(e.pluralRules[t])?ga:void 0,a=M=>M[r(n,M.length,s)],o=e.list||[],i=M=>o[M],l=e.named||{};Se(e.pluralIndex)&&u0(n,l);const c=M=>l[M];function d(M){const W=fe(e.messages)?e.messages(M):ce(e.messages)?e.messages[M]:!1;return W||(e.parent?e.parent.message(M):s0)}const m=M=>e.modifiers?e.modifiers[M]:a0,h=te(e.processor)&&fe(e.processor.normalize)?e.processor.normalize:i0,v=te(e.processor)&&fe(e.processor.interpolate)?e.processor.interpolate:l0,S=te(e.processor)&&H(e.processor.type)?e.processor.type:o0,y={list:i,named:c,plural:a,linked:(M,...W)=>{const[b,L]=W;let N="text",C="";W.length===1?ce(b)?(C=b.modifier||C,N=b.type||N):H(b)&&(C=b||C):W.length===2&&(H(b)&&(C=b||C),H(L)&&(N=L||N));const P=d(M)(y),F=N==="vnode"&&ve(P)&&C?P[0]:P;return C?m(C)(F,N):F},message:d,type:S,interpolate:v,normalize:h,values:Ne({},o,l)};return y}let Qt=null;function h0(e){Qt=e}function m0(e,t,n){Qt&&Qt.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:t,meta:n})}const f0=p0("function:translate");function p0(e){return t=>Qt&&Qt.emit(e,t)}const js=Tr.__EXTEND_POINT__,wt=Rn(js),g0={NOT_FOUND_KEY:js,FALLBACK_TO_TRANSLATE:wt(),CANNOT_FORMAT_NUMBER:wt(),FALLBACK_TO_NUMBER_FORMAT:wt(),CANNOT_FORMAT_DATE:wt(),FALLBACK_TO_DATE_FORMAT:wt(),EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER:wt(),__EXTEND_POINT__:wt()},Ks=J.__EXTEND_POINT__,Lt=Rn(Ks),We={INVALID_ARGUMENT:Ks,INVALID_DATE_ARGUMENT:Lt(),INVALID_ISO_DATE_ARGUMENT:Lt(),NOT_SUPPORT_NON_STRING_MESSAGE:Lt(),NOT_SUPPORT_LOCALE_PROMISE_VALUE:Lt(),NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:Lt(),NOT_SUPPORT_LOCALE_TYPE:Lt(),__EXTEND_POINT__:Lt()};function ze(e){return Kt(e,null,void 0)}function Nr(e,t){return t.locale!=null?va(t.locale):va(e.locale)}let Kn;function va(e){if(H(e))return e;if(fe(e)){if(e.resolvedOnce&&Kn!=null)return Kn;if(e.constructor.name==="Function"){const t=e();if(pp(t))throw ze(We.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return Kn=t}else throw ze(We.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw ze(We.NOT_SUPPORT_LOCALE_TYPE)}function v0(e,t,n){return[...new Set([n,...ve(t)?t:ce(t)?Object.keys(t):H(t)?[t]:[n]])]}function Gs(e,t,n){const r=H(n)?n:Vt,s=e;s.__localeChainCache||(s.__localeChainCache=new Map);let a=s.__localeChainCache.get(r);if(!a){a=[];let o=[n];for(;ve(o);)o=_a(a,o,t);const i=ve(t)||!te(t)?t:t.default?t.default:null;o=H(i)?[i]:i,ve(o)&&_a(a,o,!1),s.__localeChainCache.set(r,a)}return a}function _a(e,t,n){let r=!0;for(let s=0;s<t.length&&re(r);s++){const a=t[s];H(a)&&(r=_0(e,t[s],n))}return r}function _0(e,t,n){let r;const s=t.split("-");do{const a=s.join("-");r=b0(e,a,n),s.splice(-1,1)}while(s.length&&r===!0);return r}function b0(e,t,n){let r=!1;if(!e.includes(t)&&(r=!0,t)){r=t[t.length-1]!=="!";const s=t.replace(/!/g,"");e.push(s),(ve(n)||te(n))&&n[s]&&(r=n[s])}return r}const y0="9.12.0",Fn=-1,Vt="en-US",ba="",ya=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function k0(){return{upper:(e,t)=>t==="text"&&H(e)?e.toUpperCase():t==="vnode"&&ce(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,t)=>t==="text"&&H(e)?e.toLowerCase():t==="vnode"&&ce(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,t)=>t==="text"&&H(e)?ya(e):t==="vnode"&&ce(e)&&"__v_isVNode"in e?ya(e.children):e}}let Ys;function ka(e){Ys=e}let Xs;function w0(e){Xs=e}let zs;function L0(e){zs=e}let qs=null;const E0=e=>{qs=e},S0=()=>qs;let Js=null;const wa=e=>{Js=e},O0=()=>Js;let La=0;function I0(e={}){const t=fe(e.onWarn)?e.onWarn:_p,n=H(e.version)?e.version:y0,r=H(e.locale)||fe(e.locale)?e.locale:Vt,s=fe(r)?Vt:r,a=ve(e.fallbackLocale)||te(e.fallbackLocale)||H(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:s,o=te(e.messages)?e.messages:{[s]:{}},i=te(e.datetimeFormats)?e.datetimeFormats:{[s]:{}},l=te(e.numberFormats)?e.numberFormats:{[s]:{}},c=Ne({},e.modifiers||{},k0()),d=e.pluralRules||{},m=fe(e.missing)?e.missing:null,h=re(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,v=re(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,S=!!e.fallbackFormat,_=!!e.unresolving,y=fe(e.postTranslation)?e.postTranslation:null,M=te(e.processor)?e.processor:null,W=re(e.warnHtmlMessage)?e.warnHtmlMessage:!0,b=!!e.escapeParameter,L=fe(e.messageCompiler)?e.messageCompiler:Ys,N=fe(e.messageResolver)?e.messageResolver:Xs||n0,C=fe(e.localeFallbacker)?e.localeFallbacker:zs||v0,P=ce(e.fallbackContext)?e.fallbackContext:void 0,F=e,$=ce(F.__datetimeFormatters)?F.__datetimeFormatters:new Map,ue=ce(F.__numberFormatters)?F.__numberFormatters:new Map,be=ce(F.__meta)?F.__meta:{};La++;const Q={version:n,cid:La,locale:r,fallbackLocale:a,messages:o,modifiers:c,pluralRules:d,missing:m,missingWarn:h,fallbackWarn:v,fallbackFormat:S,unresolving:_,postTranslation:y,processor:M,warnHtmlMessage:W,escapeParameter:b,messageCompiler:L,messageResolver:N,localeFallbacker:C,fallbackContext:P,onWarn:t,__meta:be};return Q.datetimeFormats=i,Q.numberFormats=l,Q.__datetimeFormatters=$,Q.__numberFormatters=ue,__INTLIFY_PROD_DEVTOOLS__&&m0(Q,n,be),Q}function Mr(e,t,n,r,s){const{missing:a,onWarn:o}=e;if(a!==null){const i=a(e,n,t,s);return H(i)?i:t}else return t}function zt(e,t,n){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,n,t)}function Gn(e){return n=>C0(n,e)}function C0(e,t){const n=t.b||t.body;if((n.t||n.type)===1){const r=n,s=r.c||r.cases;return e.plural(s.reduce((a,o)=>[...a,Ea(e,o)],[]))}else return Ea(e,n)}function Ea(e,t){const n=t.s||t.static;if(n)return e.type==="text"?n:e.normalize([n]);{const r=(t.i||t.items).reduce((s,a)=>[...s,cr(e,a)],[]);return e.normalize(r)}}function cr(e,t){const n=t.t||t.type;switch(n){case 3:{const r=t;return r.v||r.value}case 9:{const r=t;return r.v||r.value}case 4:{const r=t;return e.interpolate(e.named(r.k||r.key))}case 5:{const r=t;return e.interpolate(e.list(r.i!=null?r.i:r.index))}case 6:{const r=t,s=r.m||r.modifier;return e.linked(cr(e,r.k||r.key),s?cr(e,s):void 0,e.type)}case 7:{const r=t;return r.v||r.value}case 8:{const r=t;return r.v||r.value}default:throw new Error(`unhandled node type on format message part: ${n}`)}}const Qs=e=>e;let Pt=Object.create(null);const Ht=e=>ce(e)&&(e.t===0||e.type===0)&&("b"in e||"body"in e);function Zs(e,t={}){let n=!1;const r=t.onError||Sp;return t.onError=s=>{n=!0,r(s)},{...Xp(e,t),detectError:n}}const T0=(e,t)=>{if(!H(e))throw ze(We.NOT_SUPPORT_NON_STRING_MESSAGE);{re(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||Qs)(e),s=Pt[r];if(s)return s;const{code:a,detectError:o}=Zs(e,t),i=new Function(`return ${a}`)();return o?i:Pt[r]=i}};function A0(e,t){if(__INTLIFY_JIT_COMPILATION__&&!__INTLIFY_DROP_MESSAGE_COMPILER__&&H(e)){re(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||Qs)(e),s=Pt[r];if(s)return s;const{ast:a,detectError:o}=Zs(e,{...t,location:!1,jit:!0}),i=Gn(a);return o?i:Pt[r]=i}else{const n=e.cacheKey;if(n){const r=Pt[n];return r||(Pt[n]=Gn(e))}else return Gn(e)}}const Sa=()=>"",Ve=e=>fe(e);function Oa(e,...t){const{fallbackFormat:n,postTranslation:r,unresolving:s,messageCompiler:a,fallbackLocale:o,messages:i}=e,[l,c]=ur(...t),d=re(c.missingWarn)?c.missingWarn:e.missingWarn,m=re(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,h=re(c.escapeParameter)?c.escapeParameter:e.escapeParameter,v=!!c.resolvedMessage,S=H(c.default)||re(c.default)?re(c.default)?a?l:()=>l:c.default:n?a?l:()=>l:"",_=n||S!=="",y=Nr(e,c);h&&N0(c);let[M,W,b]=v?[l,y,i[y]||{}]:eo(e,l,y,o,m,d),L=M,N=l;if(!v&&!(H(L)||Ht(L)||Ve(L))&&_&&(L=S,N=L),!v&&(!(H(L)||Ht(L)||Ve(L))||!H(W)))return s?Fn:l;let C=!1;const P=()=>{C=!0},F=Ve(L)?L:to(e,l,W,L,N,P);if(C)return L;const $=$0(e,W,b,c),ue=d0($),be=M0(e,F,ue),Q=r?r(be,l):be;if(__INTLIFY_PROD_DEVTOOLS__){const D={timestamp:Date.now(),key:H(l)?l:Ve(L)?L.key:"",locale:W||(Ve(L)?L.locale:""),format:H(L)?L:Ve(L)?L.source:"",message:Q};D.meta=Ne({},e.__meta,S0()||{}),f0(D)}return Q}function N0(e){ve(e.list)?e.list=e.list.map(t=>H(t)?ua(t):t):ce(e.named)&&Object.keys(e.named).forEach(t=>{H(e.named[t])&&(e.named[t]=ua(e.named[t]))})}function eo(e,t,n,r,s,a){const{messages:o,onWarn:i,messageResolver:l,localeFallbacker:c}=e,d=c(e,r,n);let m={},h,v=null;const S="translate";for(let _=0;_<d.length&&(h=d[_],m=o[h]||{},(v=l(m,t))===null&&(v=m[t]),!(H(v)||Ht(v)||Ve(v)));_++){const y=Mr(e,t,h,a,S);y!==t&&(v=y)}return[v,h,m]}function to(e,t,n,r,s,a){const{messageCompiler:o,warnHtmlMessage:i}=e;if(Ve(r)){const c=r;return c.locale=c.locale||n,c.key=c.key||t,c}if(o==null){const c=()=>r;return c.locale=n,c.key=t,c}const l=o(r,P0(e,n,s,r,i,a));return l.locale=n,l.key=t,l.source=r,l}function M0(e,t,n){return t(n)}function ur(...e){const[t,n,r]=e,s={};if(!H(t)&&!Se(t)&&!Ve(t)&&!Ht(t))throw ze(We.INVALID_ARGUMENT);const a=Se(t)?String(t):(Ve(t),t);return Se(n)?s.plural=n:H(n)?s.default=n:te(n)&&!$n(n)?s.named=n:ve(n)&&(s.list=n),Se(r)?s.plural=r:H(r)?s.default=r:te(r)&&Ne(s,r),[a,s]}function P0(e,t,n,r,s,a){return{locale:t,key:n,warnHtmlMessage:s,onError:o=>{throw a&&a(o),o},onCacheKey:o=>dp(t,n,o)}}function $0(e,t,n,r){const{modifiers:s,pluralRules:a,messageResolver:o,fallbackLocale:i,fallbackWarn:l,missingWarn:c,fallbackContext:d}=e,h={locale:t,modifiers:s,pluralRules:a,messages:v=>{let S=o(n,v);if(S==null&&d){const[,,_]=eo(d,v,t,i,l,c);S=o(_,v)}if(H(S)||Ht(S)){let _=!1;const M=to(e,v,t,S,v,()=>{_=!0});return _?Sa:M}else return Ve(S)?S:Sa}};return e.processor&&(h.processor=e.processor),r.list&&(h.list=r.list),r.named&&(h.named=r.named),Se(r.plural)&&(h.pluralIndex=r.plural),h}function Ia(e,...t){const{datetimeFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:o}=e,{__datetimeFormatters:i}=e,[l,c,d,m]=dr(...t),h=re(d.missingWarn)?d.missingWarn:e.missingWarn;re(d.fallbackWarn)?d.fallbackWarn:e.fallbackWarn;const v=!!d.part,S=Nr(e,d),_=o(e,s,S);if(!H(l)||l==="")return new Intl.DateTimeFormat(S,m).format(c);let y={},M,W=null;const b="datetime format";for(let C=0;C<_.length&&(M=_[C],y=n[M]||{},W=y[l],!te(W));C++)Mr(e,l,M,h,b);if(!te(W)||!H(M))return r?Fn:l;let L=`${M}__${l}`;$n(m)||(L=`${L}__${JSON.stringify(m)}`);let N=i.get(L);return N||(N=new Intl.DateTimeFormat(M,Ne({},W,m)),i.set(L,N)),v?N.formatToParts(c):N.format(c)}const no=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function dr(...e){const[t,n,r,s]=e,a={};let o={},i;if(H(t)){const l=t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw ze(We.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();i=new Date(c);try{i.toISOString()}catch{throw ze(We.INVALID_ISO_DATE_ARGUMENT)}}else if(mp(t)){if(isNaN(t.getTime()))throw ze(We.INVALID_DATE_ARGUMENT);i=t}else if(Se(t))i=t;else throw ze(We.INVALID_ARGUMENT);return H(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{no.includes(l)?o[l]=n[l]:a[l]=n[l]}),H(r)?a.locale=r:te(r)&&(o=r),te(s)&&(o=s),[a.key||"",i,a,o]}function Ca(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__datetimeFormatters.has(a)&&r.__datetimeFormatters.delete(a)}}function Ta(e,...t){const{numberFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:o}=e,{__numberFormatters:i}=e,[l,c,d,m]=hr(...t),h=re(d.missingWarn)?d.missingWarn:e.missingWarn;re(d.fallbackWarn)?d.fallbackWarn:e.fallbackWarn;const v=!!d.part,S=Nr(e,d),_=o(e,s,S);if(!H(l)||l==="")return new Intl.NumberFormat(S,m).format(c);let y={},M,W=null;const b="number format";for(let C=0;C<_.length&&(M=_[C],y=n[M]||{},W=y[l],!te(W));C++)Mr(e,l,M,h,b);if(!te(W)||!H(M))return r?Fn:l;let L=`${M}__${l}`;$n(m)||(L=`${L}__${JSON.stringify(m)}`);let N=i.get(L);return N||(N=new Intl.NumberFormat(M,Ne({},W,m)),i.set(L,N)),v?N.formatToParts(c):N.format(c)}const ro=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function hr(...e){const[t,n,r,s]=e,a={};let o={};if(!Se(t))throw ze(We.INVALID_ARGUMENT);const i=t;return H(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{ro.includes(l)?o[l]=n[l]:a[l]=n[l]}),H(r)?a.locale=r:te(r)&&(o=r),te(s)&&(o=s),[a.key||"",i,a,o]}function Aa(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__numberFormatters.has(a)&&r.__numberFormatters.delete(a)}}zp();/*!
  * vue-i18n v9.12.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const R0="9.12.0";function F0(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(lt().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(lt().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(lt().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(lt().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(lt().__INTLIFY_PROD_DEVTOOLS__=!1)}const ao=g0.__EXTEND_POINT__,st=Rn(ao);st(),st(),st(),st(),st(),st(),st(),st(),st();const so=We.__EXTEND_POINT__,Re=Rn(so),Oe={UNEXPECTED_RETURN_TYPE:so,INVALID_ARGUMENT:Re(),MUST_BE_CALL_SETUP_TOP:Re(),NOT_INSTALLED:Re(),NOT_AVAILABLE_IN_LEGACY_MODE:Re(),REQUIRED_VALUE:Re(),INVALID_VALUE:Re(),CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:Re(),NOT_INSTALLED_WITH_PROVIDE:Re(),UNEXPECTED_ERROR:Re(),NOT_COMPATIBLE_LEGACY_VUE_I18N:Re(),BRIDGE_SUPPORT_VUE_2_ONLY:Re(),MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION:Re(),NOT_AVAILABLE_COMPOSITION_IN_LEGACY:Re(),__EXTEND_POINT__:Re()};function Ae(e,...t){return Kt(e,null,void 0)}const mr=bt("__translateVNode"),fr=bt("__datetimeParts"),pr=bt("__numberParts"),oo=bt("__setPluralRules"),io=bt("__injectWithOption"),gr=bt("__dispose");function Zt(e){if(!ce(e))return e;for(const t in e)if(Ln(e,t))if(!t.includes("."))ce(e[t])&&Zt(e[t]);else{const n=t.split("."),r=n.length-1;let s=e,a=!1;for(let o=0;o<r;o++){if(n[o]in s||(s[n[o]]={}),!ce(s[n[o]])){a=!0;break}s=s[n[o]]}a||(s[n[r]]=e[t],delete e[t]),ce(s[n[r]])&&Zt(s[n[r]])}return e}function Dn(e,t){const{messages:n,__i18n:r,messageResolver:s,flatJson:a}=t,o=te(n)?n:ve(r)?{}:{[e]:{}};if(ve(r)&&r.forEach(i=>{if("locale"in i&&"resource"in i){const{locale:l,resource:c}=i;l?(o[l]=o[l]||{},pn(c,o[l])):pn(c,o)}else H(i)&&pn(JSON.parse(i),o)}),s==null&&a)for(const i in o)Ln(o,i)&&Zt(o[i]);return o}function lo(e){return e.type}function co(e,t,n){let r=ce(t.messages)?t.messages:{};"__i18nGlobal"in n&&(r=Dn(e.locale.value,{messages:r,__i18n:n.__i18nGlobal}));const s=Object.keys(r);s.length&&s.forEach(a=>{e.mergeLocaleMessage(a,r[a])});{if(ce(t.datetimeFormats)){const a=Object.keys(t.datetimeFormats);a.length&&a.forEach(o=>{e.mergeDateTimeFormat(o,t.datetimeFormats[o])})}if(ce(t.numberFormats)){const a=Object.keys(t.numberFormats);a.length&&a.forEach(o=>{e.mergeNumberFormat(o,t.numberFormats[o])})}}}function Na(e){return Y(Uo,null,e,0)}const Ma="__INTLIFY_META__",Pa=()=>[],D0=()=>!1;let $a=0;function Ra(e){return(t,n,r,s)=>e(n,r,Dt()||void 0,s)}const x0=()=>{const e=Dt();let t=null;return e&&(t=lo(e)[Ma])?{[Ma]:t}:null};function Pr(e={},t){const{__root:n,__injectWithOption:r}=e,s=n===void 0,a=e.flatJson,o=wn?X:Cn,i=!!e.translateExistCompatible;let l=re(e.inheritLocale)?e.inheritLocale:!0;const c=o(n&&l?n.locale.value:H(e.locale)?e.locale:Vt),d=o(n&&l?n.fallbackLocale.value:H(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:c.value),m=o(Dn(c.value,e)),h=o(te(e.datetimeFormats)?e.datetimeFormats:{[c.value]:{}}),v=o(te(e.numberFormats)?e.numberFormats:{[c.value]:{}});let S=n?n.missingWarn:re(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,_=n?n.fallbackWarn:re(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,y=n?n.fallbackRoot:re(e.fallbackRoot)?e.fallbackRoot:!0,M=!!e.fallbackFormat,W=fe(e.missing)?e.missing:null,b=fe(e.missing)?Ra(e.missing):null,L=fe(e.postTranslation)?e.postTranslation:null,N=n?n.warnHtmlMessage:re(e.warnHtmlMessage)?e.warnHtmlMessage:!0,C=!!e.escapeParameter;const P=n?n.modifiers:te(e.modifiers)?e.modifiers:{};let F=e.pluralRules||n&&n.pluralRules,$;$=(()=>{s&&wa(null);const T={version:R0,locale:c.value,fallbackLocale:d.value,messages:m.value,modifiers:P,pluralRules:F,missing:b===null?void 0:b,missingWarn:S,fallbackWarn:_,fallbackFormat:M,unresolving:!0,postTranslation:L===null?void 0:L,warnHtmlMessage:N,escapeParameter:C,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};T.datetimeFormats=h.value,T.numberFormats=v.value,T.__datetimeFormatters=te($)?$.__datetimeFormatters:void 0,T.__numberFormatters=te($)?$.__numberFormatters:void 0;const R=I0(T);return s&&wa(R),R})(),zt($,c.value,d.value);function be(){return[c.value,d.value,m.value,h.value,v.value]}const Q=x({get:()=>c.value,set:T=>{c.value=T,$.locale=c.value}}),D=x({get:()=>d.value,set:T=>{d.value=T,$.fallbackLocale=d.value,zt($,c.value,T)}}),se=x(()=>m.value),ke=x(()=>h.value),Ee=x(()=>v.value);function ge(){return fe(L)?L:null}function He(T){L=T,$.postTranslation=T}function je(){return W}function _e(T){T!==null&&(b=Ra(T)),W=T,$.missing=b}const ye=(T,R,he,Le,ht,on)=>{be();let It;try{__INTLIFY_PROD_DEVTOOLS__,s||($.fallbackContext=n?O0():void 0),It=T($)}finally{__INTLIFY_PROD_DEVTOOLS__,s||($.fallbackContext=void 0)}if(he!=="translate exists"&&Se(It)&&It===Fn||he==="translate exists"&&!It){const[bo,gg]=R();return n&&y?Le(n):ht(bo)}else{if(on(It))return It;throw Ae(Oe.UNEXPECTED_RETURN_TYPE)}};function Ke(...T){return ye(R=>Reflect.apply(Oa,null,[R,...T]),()=>ur(...T),"translate",R=>Reflect.apply(R.t,R,[...T]),R=>R,R=>H(R))}function j(...T){const[R,he,Le]=T;if(Le&&!ce(Le))throw Ae(Oe.INVALID_ARGUMENT);return Ke(R,he,Ne({resolvedMessage:!0},Le||{}))}function ie(...T){return ye(R=>Reflect.apply(Ia,null,[R,...T]),()=>dr(...T),"datetime format",R=>Reflect.apply(R.d,R,[...T]),()=>ba,R=>H(R))}function oe(...T){return ye(R=>Reflect.apply(Ta,null,[R,...T]),()=>hr(...T),"number format",R=>Reflect.apply(R.n,R,[...T]),()=>ba,R=>H(R))}function de(T){return T.map(R=>H(R)||Se(R)||re(R)?Na(String(R)):R)}const xe={normalize:de,interpolate:T=>T,type:"vnode"};function nt(...T){return ye(R=>{let he;const Le=R;try{Le.processor=xe,he=Reflect.apply(Oa,null,[Le,...T])}finally{Le.processor=null}return he},()=>ur(...T),"translate",R=>R[mr](...T),R=>[Na(R)],R=>ve(R))}function Ge(...T){return ye(R=>Reflect.apply(Ta,null,[R,...T]),()=>hr(...T),"number format",R=>R[pr](...T),Pa,R=>H(R)||ve(R))}function kt(...T){return ye(R=>Reflect.apply(Ia,null,[R,...T]),()=>dr(...T),"datetime format",R=>R[fr](...T),Pa,R=>H(R)||ve(R))}function Gt(T){F=T,$.pluralRules=F}function f(T,R){return ye(()=>{if(!T)return!1;const he=H(R)?R:c.value,Le=B(he),ht=$.messageResolver(Le,T);return i?ht!=null:Ht(ht)||Ve(ht)||H(ht)},()=>[T],"translate exists",he=>Reflect.apply(he.te,he,[T,R]),D0,he=>re(he))}function u(T){let R=null;const he=Gs($,d.value,c.value);for(let Le=0;Le<he.length;Le++){const ht=m.value[he[Le]]||{},on=$.messageResolver(ht,T);if(on!=null){R=on;break}}return R}function E(T){const R=u(T);return R??(n?n.tm(T)||{}:{})}function B(T){return m.value[T]||{}}function Z(T,R){if(a){const he={[T]:R};for(const Le in he)Ln(he,Le)&&Zt(he[Le]);R=he[T]}m.value[T]=R,$.messages=m.value}function le(T,R){m.value[T]=m.value[T]||{};const he={[T]:R};if(a)for(const Le in he)Ln(he,Le)&&Zt(he[Le]);R=he[T],pn(R,m.value[T]),$.messages=m.value}function Ye(T){return h.value[T]||{}}function rt(T,R){h.value[T]=R,$.datetimeFormats=h.value,Ca($,T,R)}function po(T,R){h.value[T]=Ne(h.value[T]||{},R),$.datetimeFormats=h.value,Ca($,T,R)}function go(T){return v.value[T]||{}}function vo(T,R){v.value[T]=R,$.numberFormats=v.value,Aa($,T,R)}function _o(T,R){v.value[T]=Ne(v.value[T]||{},R),$.numberFormats=v.value,Aa($,T,R)}$a++,n&&wn&&(we(n.locale,T=>{l&&(c.value=T,$.locale=T,zt($,c.value,d.value))}),we(n.fallbackLocale,T=>{l&&(d.value=T,$.fallbackLocale=T,zt($,c.value,d.value))}));const Te={id:$a,locale:Q,fallbackLocale:D,get inheritLocale(){return l},set inheritLocale(T){l=T,T&&n&&(c.value=n.locale.value,d.value=n.fallbackLocale.value,zt($,c.value,d.value))},get availableLocales(){return Object.keys(m.value).sort()},messages:se,get modifiers(){return P},get pluralRules(){return F||{}},get isGlobal(){return s},get missingWarn(){return S},set missingWarn(T){S=T,$.missingWarn=S},get fallbackWarn(){return _},set fallbackWarn(T){_=T,$.fallbackWarn=_},get fallbackRoot(){return y},set fallbackRoot(T){y=T},get fallbackFormat(){return M},set fallbackFormat(T){M=T,$.fallbackFormat=M},get warnHtmlMessage(){return N},set warnHtmlMessage(T){N=T,$.warnHtmlMessage=T},get escapeParameter(){return C},set escapeParameter(T){C=T,$.escapeParameter=T},t:Ke,getLocaleMessage:B,setLocaleMessage:Z,mergeLocaleMessage:le,getPostTranslationHandler:ge,setPostTranslationHandler:He,getMissingHandler:je,setMissingHandler:_e,[oo]:Gt};return Te.datetimeFormats=ke,Te.numberFormats=Ee,Te.rt=j,Te.te=f,Te.tm=E,Te.d=ie,Te.n=oe,Te.getDateTimeFormat=Ye,Te.setDateTimeFormat=rt,Te.mergeDateTimeFormat=po,Te.getNumberFormat=go,Te.setNumberFormat=vo,Te.mergeNumberFormat=_o,Te[io]=r,Te[mr]=nt,Te[fr]=kt,Te[pr]=Ge,Te}function V0(e){const t=H(e.locale)?e.locale:Vt,n=H(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:t,r=fe(e.missing)?e.missing:void 0,s=re(e.silentTranslationWarn)||pt(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,a=re(e.silentFallbackWarn)||pt(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,o=re(e.fallbackRoot)?e.fallbackRoot:!0,i=!!e.formatFallbackMessages,l=te(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,d=fe(e.postTranslation)?e.postTranslation:void 0,m=H(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,h=!!e.escapeParameterHtml,v=re(e.sync)?e.sync:!0;let S=e.messages;if(te(e.sharedMessages)){const C=e.sharedMessages;S=Object.keys(C).reduce((F,$)=>{const ue=F[$]||(F[$]={});return Ne(ue,C[$]),F},S||{})}const{__i18n:_,__root:y,__injectWithOption:M}=e,W=e.datetimeFormats,b=e.numberFormats,L=e.flatJson,N=e.translateExistCompatible;return{locale:t,fallbackLocale:n,messages:S,flatJson:L,datetimeFormats:W,numberFormats:b,missing:r,missingWarn:s,fallbackWarn:a,fallbackRoot:o,fallbackFormat:i,modifiers:l,pluralRules:c,postTranslation:d,warnHtmlMessage:m,escapeParameter:h,messageResolver:e.messageResolver,inheritLocale:v,translateExistCompatible:N,__i18n:_,__root:y,__injectWithOption:M}}function vr(e={},t){{const n=Pr(V0(e)),{__extender:r}=e,s={id:n.id,get locale(){return n.locale.value},set locale(a){n.locale.value=a},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(a){n.fallbackLocale.value=a},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get formatter(){return{interpolate(){return[]}}},set formatter(a){},get missing(){return n.getMissingHandler()},set missing(a){n.setMissingHandler(a)},get silentTranslationWarn(){return re(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(a){n.missingWarn=re(a)?!a:a},get silentFallbackWarn(){return re(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(a){n.fallbackWarn=re(a)?!a:a},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(a){n.fallbackFormat=a},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(a){n.setPostTranslationHandler(a)},get sync(){return n.inheritLocale},set sync(a){n.inheritLocale=a},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(a){n.warnHtmlMessage=a!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(a){n.escapeParameter=a},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(a){},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...a){const[o,i,l]=a,c={};let d=null,m=null;if(!H(o))throw Ae(Oe.INVALID_ARGUMENT);const h=o;return H(i)?c.locale=i:ve(i)?d=i:te(i)&&(m=i),ve(l)?d=l:te(l)&&(m=l),Reflect.apply(n.t,n,[h,d||m||{},c])},rt(...a){return Reflect.apply(n.rt,n,[...a])},tc(...a){const[o,i,l]=a,c={plural:1};let d=null,m=null;if(!H(o))throw Ae(Oe.INVALID_ARGUMENT);const h=o;return H(i)?c.locale=i:Se(i)?c.plural=i:ve(i)?d=i:te(i)&&(m=i),H(l)?c.locale=l:ve(l)?d=l:te(l)&&(m=l),Reflect.apply(n.t,n,[h,d||m||{},c])},te(a,o){return n.te(a,o)},tm(a){return n.tm(a)},getLocaleMessage(a){return n.getLocaleMessage(a)},setLocaleMessage(a,o){n.setLocaleMessage(a,o)},mergeLocaleMessage(a,o){n.mergeLocaleMessage(a,o)},d(...a){return Reflect.apply(n.d,n,[...a])},getDateTimeFormat(a){return n.getDateTimeFormat(a)},setDateTimeFormat(a,o){n.setDateTimeFormat(a,o)},mergeDateTimeFormat(a,o){n.mergeDateTimeFormat(a,o)},n(...a){return Reflect.apply(n.n,n,[...a])},getNumberFormat(a){return n.getNumberFormat(a)},setNumberFormat(a,o){n.setNumberFormat(a,o)},mergeNumberFormat(a,o){n.mergeNumberFormat(a,o)},getChoiceIndex(a,o){return-1}};return s.__extender=r,s}}const $r={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function H0({slots:e},t){return t.length===1&&t[0]==="default"?(e.default?e.default():[]).reduce((r,s)=>[...r,...s.type===pe?s.children:[s]],[]):t.reduce((n,r)=>{const s=e[r];return s&&(n[r]=s()),n},{})}function uo(e){return pe}const U0=V({name:"i18n-t",props:Ne({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Se(e)||!isNaN(e)}},$r),setup(e,t){const{slots:n,attrs:r}=t,s=e.i18n||xn({useScope:e.scope,__useComponent:!0});return()=>{const a=Object.keys(n).filter(m=>m!=="_"),o={};e.locale&&(o.locale=e.locale),e.plural!==void 0&&(o.plural=H(e.plural)?+e.plural:e.plural);const i=H0(t,a),l=s[mr](e.keypath,i,o),c=Ne({},r),d=H(e.tag)||ce(e.tag)?e.tag:uo();return Ft(d,c,l)}}}),Fa=U0;function B0(e){return ve(e)&&!H(e[0])}function ho(e,t,n,r){const{slots:s,attrs:a}=t;return()=>{const o={part:!0};let i={};e.locale&&(o.locale=e.locale),H(e.format)?o.key=e.format:ce(e.format)&&(H(e.format.key)&&(o.key=e.format.key),i=Object.keys(e.format).reduce((h,v)=>n.includes(v)?Ne({},h,{[v]:e.format[v]}):h,{}));const l=r(e.value,o,i);let c=[o.key];ve(l)?c=l.map((h,v)=>{const S=s[h.type],_=S?S({[h.type]:h.value,index:v,parts:l}):[h.value];return B0(_)&&(_[0].key=`${h.type}-${v}`),_}):H(l)&&(c=[l]);const d=Ne({},a),m=H(e.tag)||ce(e.tag)?e.tag:uo();return Ft(m,d,c)}}const W0=V({name:"i18n-n",props:Ne({value:{type:Number,required:!0},format:{type:[String,Object]}},$r),setup(e,t){const n=e.i18n||xn({useScope:e.scope,__useComponent:!0});return ho(e,t,ro,(...r)=>n[pr](...r))}}),Da=W0,j0=V({name:"i18n-d",props:Ne({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},$r),setup(e,t){const n=e.i18n||xn({useScope:e.scope,__useComponent:!0});return ho(e,t,no,(...r)=>n[fr](...r))}}),xa=j0;function K0(e,t){const n=e;if(e.mode==="composition")return n.__getInstance(t)||e.global;{const r=n.__getInstance(t);return r!=null?r.__composer:e.global.__composer}}function G0(e){const t=o=>{const{instance:i,modifiers:l,value:c}=o;if(!i||!i.$)throw Ae(Oe.UNEXPECTED_ERROR);const d=K0(e,i.$),m=Va(c);return[Reflect.apply(d.t,d,[...Ha(m)]),d]};return{created:(o,i)=>{const[l,c]=t(i);wn&&e.global===c&&(o.__i18nWatcher=we(c.locale,()=>{i.instance&&i.instance.$forceUpdate()})),o.__composer=c,o.textContent=l},unmounted:o=>{wn&&o.__i18nWatcher&&(o.__i18nWatcher(),o.__i18nWatcher=void 0,delete o.__i18nWatcher),o.__composer&&(o.__composer=void 0,delete o.__composer)},beforeUpdate:(o,{value:i})=>{if(o.__composer){const l=o.__composer,c=Va(i);o.textContent=Reflect.apply(l.t,l,[...Ha(c)])}},getSSRProps:o=>{const[i]=t(o);return{textContent:i}}}}function Va(e){if(H(e))return{path:e};if(te(e)){if(!("path"in e))throw Ae(Oe.REQUIRED_VALUE,"path");return e}else throw Ae(Oe.INVALID_VALUE)}function Ha(e){const{path:t,locale:n,args:r,choice:s,plural:a}=e,o={},i=r||{};return H(n)&&(o.locale=n),Se(s)&&(o.plural=s),Se(a)&&(o.plural=a),[t,i,o]}function Y0(e,t,...n){const r=te(n[0])?n[0]:{},s=!!r.useI18nComponentName;(re(r.globalInstall)?r.globalInstall:!0)&&([s?"i18n":Fa.name,"I18nT"].forEach(o=>e.component(o,Fa)),[Da.name,"I18nN"].forEach(o=>e.component(o,Da)),[xa.name,"I18nD"].forEach(o=>e.component(o,xa))),e.directive("t",G0(t))}function X0(e,t,n){return{beforeCreate(){const r=Dt();if(!r)throw Ae(Oe.UNEXPECTED_ERROR);const s=this.$options;if(s.i18n){const a=s.i18n;if(s.__i18n&&(a.__i18n=s.__i18n),a.__root=t,this===this.$root)this.$i18n=Ua(e,a);else{a.__injectWithOption=!0,a.__extender=n.__vueI18nExtend,this.$i18n=vr(a);const o=this.$i18n;o.__extender&&(o.__disposer=o.__extender(this.$i18n))}}else if(s.__i18n)if(this===this.$root)this.$i18n=Ua(e,s);else{this.$i18n=vr({__i18n:s.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:t});const a=this.$i18n;a.__extender&&(a.__disposer=a.__extender(this.$i18n))}else this.$i18n=e;s.__i18nGlobal&&co(t,s,s),this.$t=(...a)=>this.$i18n.t(...a),this.$rt=(...a)=>this.$i18n.rt(...a),this.$tc=(...a)=>this.$i18n.tc(...a),this.$te=(a,o)=>this.$i18n.te(a,o),this.$d=(...a)=>this.$i18n.d(...a),this.$n=(...a)=>this.$i18n.n(...a),this.$tm=a=>this.$i18n.tm(a),n.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=Dt();if(!r)throw Ae(Oe.UNEXPECTED_ERROR);const s=this.$i18n;delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,s.__disposer&&(s.__disposer(),delete s.__disposer,delete s.__extender),n.__deleteInstance(r),delete this.$i18n}}}function Ua(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[oo](t.pluralizationRules||e.pluralizationRules);const n=Dn(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(n).forEach(r=>e.mergeLocaleMessage(r,n[r])),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,t.datetimeFormats[r])),t.numberFormats&&Object.keys(t.numberFormats).forEach(r=>e.mergeNumberFormat(r,t.numberFormats[r])),e}const z0=bt("global-vue-i18n");function q0(e={},t){const n=__VUE_I18N_LEGACY_API__&&re(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,r=re(e.globalInjection)?e.globalInjection:!0,s=__VUE_I18N_LEGACY_API__&&n?!!e.allowComposition:!0,a=new Map,[o,i]=J0(e,n),l=bt("");function c(h){return a.get(h)||null}function d(h,v){a.set(h,v)}function m(h){a.delete(h)}{const h={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},get allowComposition(){return s},async install(v,...S){if(v.__VUE_I18N_SYMBOL__=l,v.provide(v.__VUE_I18N_SYMBOL__,h),te(S[0])){const M=S[0];h.__composerExtend=M.__composerExtend,h.__vueI18nExtend=M.__vueI18nExtend}let _=null;!n&&r&&(_=og(v,h.global)),__VUE_I18N_FULL_INSTALL__&&Y0(v,h,...S),__VUE_I18N_LEGACY_API__&&n&&v.mixin(X0(i,i.__composer,h));const y=v.unmount;v.unmount=()=>{_&&_(),h.dispose(),y()}},get global(){return i},dispose(){o.stop()},__instances:a,__getInstance:c,__setInstance:d,__deleteInstance:m};return h}}function xn(e={}){const t=Dt();if(t==null)throw Ae(Oe.MUST_BE_CALL_SETUP_TOP);if(!t.isCE&&t.appContext.app!=null&&!t.appContext.app.__VUE_I18N_SYMBOL__)throw Ae(Oe.NOT_INSTALLED);const n=Q0(t),r=eg(n),s=lo(t),a=Z0(e,s);if(__VUE_I18N_LEGACY_API__&&n.mode==="legacy"&&!e.__useComponent){if(!n.allowComposition)throw Ae(Oe.NOT_AVAILABLE_IN_LEGACY_MODE);return ag(t,a,r,e)}if(a==="global")return co(r,e,s),r;if(a==="parent"){let l=tg(n,t,e.__useComponent);return l==null&&(l=r),l}const o=n;let i=o.__getInstance(t);if(i==null){const l=Ne({},e);"__i18n"in s&&(l.__i18n=s.__i18n),r&&(l.__root=r),i=Pr(l),o.__composerExtend&&(i[gr]=o.__composerExtend(i)),rg(o,t,i),o.__setInstance(t,i)}return i}function J0(e,t,n){const r=xo();{const s=__VUE_I18N_LEGACY_API__&&t?r.run(()=>vr(e)):r.run(()=>Pr(e));if(s==null)throw Ae(Oe.UNEXPECTED_ERROR);return[r,s]}}function Q0(e){{const t=Ut(e.isCE?z0:e.appContext.app.__VUE_I18N_SYMBOL__);if(!t)throw Ae(e.isCE?Oe.NOT_INSTALLED_WITH_PROVIDE:Oe.UNEXPECTED_ERROR);return t}}function Z0(e,t){return $n(e)?"__i18n"in t?"local":"global":e.useScope?e.useScope:"local"}function eg(e){return e.mode==="composition"?e.global:e.global.__composer}function tg(e,t,n=!1){let r=null;const s=t.root;let a=ng(t,n);for(;a!=null;){const o=e;if(e.mode==="composition")r=o.__getInstance(a);else if(__VUE_I18N_LEGACY_API__){const i=o.__getInstance(a);i!=null&&(r=i.__composer,n&&r&&!r[io]&&(r=null))}if(r!=null||s===a)break;a=a.parent}return r}function ng(e,t=!1){return e==null?null:t&&e.vnode.ctx||e.parent}function rg(e,t,n){tt(()=>{},t),In(()=>{const r=n;e.__deleteInstance(t);const s=r[gr];s&&(s(),delete r[gr])},t)}function ag(e,t,n,r={}){const s=t==="local",a=Cn(null);if(s&&e.proxy&&!(e.proxy.$options.i18n||e.proxy.$options.__i18n))throw Ae(Oe.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);const o=re(r.inheritLocale)?r.inheritLocale:!H(r.locale),i=X(!s||o?n.locale.value:H(r.locale)?r.locale:Vt),l=X(!s||o?n.fallbackLocale.value:H(r.fallbackLocale)||ve(r.fallbackLocale)||te(r.fallbackLocale)||r.fallbackLocale===!1?r.fallbackLocale:i.value),c=X(Dn(i.value,r)),d=X(te(r.datetimeFormats)?r.datetimeFormats:{[i.value]:{}}),m=X(te(r.numberFormats)?r.numberFormats:{[i.value]:{}}),h=s?n.missingWarn:re(r.missingWarn)||pt(r.missingWarn)?r.missingWarn:!0,v=s?n.fallbackWarn:re(r.fallbackWarn)||pt(r.fallbackWarn)?r.fallbackWarn:!0,S=s?n.fallbackRoot:re(r.fallbackRoot)?r.fallbackRoot:!0,_=!!r.fallbackFormat,y=fe(r.missing)?r.missing:null,M=fe(r.postTranslation)?r.postTranslation:null,W=s?n.warnHtmlMessage:re(r.warnHtmlMessage)?r.warnHtmlMessage:!0,b=!!r.escapeParameter,L=s?n.modifiers:te(r.modifiers)?r.modifiers:{},N=r.pluralRules||s&&n.pluralRules;function C(){return[i.value,l.value,c.value,d.value,m.value]}const P=x({get:()=>a.value?a.value.locale.value:i.value,set:u=>{a.value&&(a.value.locale.value=u),i.value=u}}),F=x({get:()=>a.value?a.value.fallbackLocale.value:l.value,set:u=>{a.value&&(a.value.fallbackLocale.value=u),l.value=u}}),$=x(()=>a.value?a.value.messages.value:c.value),ue=x(()=>d.value),be=x(()=>m.value);function Q(){return a.value?a.value.getPostTranslationHandler():M}function D(u){a.value&&a.value.setPostTranslationHandler(u)}function se(){return a.value?a.value.getMissingHandler():y}function ke(u){a.value&&a.value.setMissingHandler(u)}function Ee(u){return C(),u()}function ge(...u){return a.value?Ee(()=>Reflect.apply(a.value.t,null,[...u])):Ee(()=>"")}function He(...u){return a.value?Reflect.apply(a.value.rt,null,[...u]):""}function je(...u){return a.value?Ee(()=>Reflect.apply(a.value.d,null,[...u])):Ee(()=>"")}function _e(...u){return a.value?Ee(()=>Reflect.apply(a.value.n,null,[...u])):Ee(()=>"")}function ye(u){return a.value?a.value.tm(u):{}}function Ke(u,E){return a.value?a.value.te(u,E):!1}function j(u){return a.value?a.value.getLocaleMessage(u):{}}function ie(u,E){a.value&&(a.value.setLocaleMessage(u,E),c.value[u]=E)}function oe(u,E){a.value&&a.value.mergeLocaleMessage(u,E)}function de(u){return a.value?a.value.getDateTimeFormat(u):{}}function Fe(u,E){a.value&&(a.value.setDateTimeFormat(u,E),d.value[u]=E)}function xe(u,E){a.value&&a.value.mergeDateTimeFormat(u,E)}function nt(u){return a.value?a.value.getNumberFormat(u):{}}function Ge(u,E){a.value&&(a.value.setNumberFormat(u,E),m.value[u]=E)}function kt(u,E){a.value&&a.value.mergeNumberFormat(u,E)}const Gt={get id(){return a.value?a.value.id:-1},locale:P,fallbackLocale:F,messages:$,datetimeFormats:ue,numberFormats:be,get inheritLocale(){return a.value?a.value.inheritLocale:o},set inheritLocale(u){a.value&&(a.value.inheritLocale=u)},get availableLocales(){return a.value?a.value.availableLocales:Object.keys(c.value)},get modifiers(){return a.value?a.value.modifiers:L},get pluralRules(){return a.value?a.value.pluralRules:N},get isGlobal(){return a.value?a.value.isGlobal:!1},get missingWarn(){return a.value?a.value.missingWarn:h},set missingWarn(u){a.value&&(a.value.missingWarn=u)},get fallbackWarn(){return a.value?a.value.fallbackWarn:v},set fallbackWarn(u){a.value&&(a.value.missingWarn=u)},get fallbackRoot(){return a.value?a.value.fallbackRoot:S},set fallbackRoot(u){a.value&&(a.value.fallbackRoot=u)},get fallbackFormat(){return a.value?a.value.fallbackFormat:_},set fallbackFormat(u){a.value&&(a.value.fallbackFormat=u)},get warnHtmlMessage(){return a.value?a.value.warnHtmlMessage:W},set warnHtmlMessage(u){a.value&&(a.value.warnHtmlMessage=u)},get escapeParameter(){return a.value?a.value.escapeParameter:b},set escapeParameter(u){a.value&&(a.value.escapeParameter=u)},t:ge,getPostTranslationHandler:Q,setPostTranslationHandler:D,getMissingHandler:se,setMissingHandler:ke,rt:He,d:je,n:_e,tm:ye,te:Ke,getLocaleMessage:j,setLocaleMessage:ie,mergeLocaleMessage:oe,getDateTimeFormat:de,setDateTimeFormat:Fe,mergeDateTimeFormat:xe,getNumberFormat:nt,setNumberFormat:Ge,mergeNumberFormat:kt};function f(u){u.locale.value=i.value,u.fallbackLocale.value=l.value,Object.keys(c.value).forEach(E=>{u.mergeLocaleMessage(E,c.value[E])}),Object.keys(d.value).forEach(E=>{u.mergeDateTimeFormat(E,d.value[E])}),Object.keys(m.value).forEach(E=>{u.mergeNumberFormat(E,m.value[E])}),u.escapeParameter=b,u.fallbackFormat=_,u.fallbackRoot=S,u.fallbackWarn=v,u.missingWarn=h,u.warnHtmlMessage=W}return Vo(()=>{if(e.proxy==null||e.proxy.$i18n==null)throw Ae(Oe.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const u=a.value=e.proxy.$i18n.__composer;t==="global"?(i.value=u.locale.value,l.value=u.fallbackLocale.value,c.value=u.messages.value,d.value=u.datetimeFormats.value,m.value=u.numberFormats.value):s&&f(u)}),Gt}const sg=["locale","fallbackLocale","availableLocales"],Ba=["t","rt","d","n","tm","te"];function og(e,t){const n=Object.create(null);return sg.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a)throw Ae(Oe.UNEXPECTED_ERROR);const o=Ho(a.value)?{get(){return a.value.value},set(i){a.value.value=i}}:{get(){return a.get&&a.get()}};Object.defineProperty(n,s,o)}),e.config.globalProperties.$i18n=n,Ba.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a||!a.value)throw Ae(Oe.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${s}`,a)}),()=>{delete e.config.globalProperties.$i18n,Ba.forEach(s=>{delete e.config.globalProperties[`$${s}`]})}}F0();__INTLIFY_JIT_COMPILATION__?ka(A0):ka(T0);w0(r0);L0(Gs);if(__INTLIFY_PROD_DEVTOOLS__){const e=lt();e.__INTLIFY__=!0,h0(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const mo=()=>{const e=Ut("$env"),{t,locale:n}=xn();return{locale:n,$env:e,t}},ig={class:"text-slate-600 text-base mt-2"},lg={class:"flex flex-row justify-start items-start mt-4"},cg={class:"relative h-14"},ug=["label","status"],dg={key:0,class:"absolute bottom-0 left-0 text-sm text-[#ff4d4f]"},hg={class:"text-[#3451b2] text-base"},mg=V({__name:"TOTP",setup(e){const{t,$env:n,locale:r}=mo(),s=X(""),a=X(At.NORMAL),o=X(""),i=X({code:"",expires:""}),l=d=>{s.value=d.detail.value,a.value=At.NORMAL},c=()=>{if(s.value.length<=0)o.value=t("components_totp_3"),a.value=At.ERROR;else try{const{otp:d,expires:m}=ep.generate(s.value);i.value.code=d,i.value.expires=rp(m).format()}catch{o.value=t("components_totp_5"),a.value=At.ERROR}};return(d,m)=>(p(),I("div",null,[k("div",ig,ne(g(t)("components_totp_6")),1),k("div",lg,[k("div",cg,[k("r-input",{label:g(t)("components_totp_2"),class:"w-60 h-8 rounded-lg block text-lg",status:a.value,onInput:l},null,40,ug),a.value===g(At).ERROR?(p(),I("div",dg,ne(o.value),1)):G("",!0)]),k("r-button",{class:"ml-4",onClick:c},ne(g(t)("components_totp_1")),1)]),k("div",hg,[k("div",null,"code: "+ne(i.value.code),1),k("div",null,ne(g(t)("components_totp_4"))+": "+ne(i.value.expires),1)])]))}}),Rr=lr.locale,Rt=q0({legacy:!1,locale:Rr,fallbackLocale:sn.EN,messages:lp,devtools:!1}),Yn=e=>(Rt.mode===xs.LEGACY?Rt.global.locale=e:Rt.global.locale.value=e,e),fg=(e,t=Rr)=>{Rt.global.mergeLocaleMessage(t,e)},fo=(e=Rr)=>e?Rt.global.locale===e||la.includes(e)?Promise.resolve(Yn(e)):Bo(Object.assign({"./en.json":()=>zn(()=>import("./en.m1bAnvv_.js"),[]),"./zh-CN.json":()=>zn(()=>import("./zh-CN.PUkQxDBJ.js"),[])}),`./${e}.json`).then(t=>(fg(t.default,e),la.push(e),Yn(e))):Promise.reject("lang is undefined"),pg=V({__name:"Layout",setup(e){const{$env:t,locale:n}=mo(),{lang:r}=gn(),s=()=>{const a=r.value||sn.EN;n.value=a,t.locale=a,fo(a).catch(o=>{console.log("error",o)}),tp(Ds,a)};return gt(()=>{s()}),(a,o)=>(p(),z(g(Ls).Layout))}}),Lg={extends:Ls,enhanceApp({app:e,router:t,siteData:n}){zn(()=>import("./index.CV-dxUKH.js").then(s=>s.i),__vite__mapDeps([0,1])),e.use(up);const r=np(Ds)||sn.EN;fo(r).then(()=>{sp("__VUE_PROD_DEVTOOLS__",!1),e.use(Rt),e.component("Layout",pg),e.component("TOTP",mg)}).catch(s=>{console.log("error",s)})}};export{Lg as R};
