const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/index.R2KlXi5a.js","assets/chunks/framework.BHXmBVOg.js"])))=>i.map(i=>d[i]);
import{d as x,o as p,c as I,r as S,a as Ze,t as re,n as de,b as X,w as A,e as G,T as An,_ as J,u as bn,i as Eo,f as So,g as Tn,h as U,j as w,k as g,p as Te,l as Ne,m as St,q as er,s as z,v as ke,x as gt,y as Ke,z as Nn,A as Lr,B as Oo,C as Io,D as _t,F as ge,E as $e,G as Mn,H as Pn,I as Y,J as za,K as Xe,L as an,M as ft,N as Bt,O as Co,P as Xa,Q as Ao,R as it,S as qa,U as $n,V as To,W as tn,X as Er,Y as Rn,Z as No,$ as yn,a0 as kn,a1 as Mo,a2 as Dt,a3 as Ja,a4 as Qa,a5 as Vt,a6 as Po,a7 as $o,a8 as Ro,a9 as Fo,aa as Za,ab as Do,ac as Vo,ad as xo,ae as Uo,af as Ho,ag as Bo,ah as Wo,ai as jo,aj as Ko,ak as wn}from"./framework.BHXmBVOg.js";const Go=x({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(t,n)=>(p(),I("span",{class:de(["VPBadge",t.type])},[S(t.$slots,"default",{},()=>[Ze(re(t.text),1)])],2))}}),Yo={key:0,class:"VPBackdrop"},zo=x({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(t,n)=>(p(),X(An,{name:"fade"},{default:A(()=>[t.show?(p(),I("div",Yo)):G("",!0)]),_:1}))}}),Xo=J(zo,[["__scopeId","data-v-f9ffd925"]]),se=bn;function qo(e,t){let n,r=!1;return()=>{n&&clearTimeout(n),r?n=setTimeout(e,t):(e(),(r=!0)&&setTimeout(()=>r=!1,t))}}function tr(e){return/^\//.test(e)?e:`/${e}`}function Sr(e){const{pathname:t,search:n,hash:r,protocol:s}=new URL(e,"http://a.com");if(Eo(e)||e.startsWith("#")||!s.startsWith("http")||!So(t))return e;const{site:a}=se(),o=t.endsWith("/")||t.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${t.replace(/(\.md)?$/,a.value.cleanUrls?"":".html")}${n}${r}`);return Tn(o)}function sn({correspondingLink:e=!1}={}){const{site:t,localeIndex:n,page:r,theme:s,hash:a}=se(),o=U(()=>{var l,c;return{label:(l=t.value.locales[n.value])==null?void 0:l.label,link:((c=t.value.locales[n.value])==null?void 0:c.link)||(n.value==="root"?"/":`/${n.value}/`)}});return{localeLinks:U(()=>Object.entries(t.value.locales).flatMap(([l,c])=>o.value.label===c.label?[]:{text:c.label,link:Jo(c.link||(l==="root"?"/":`/${l}/`),s.value.i18nRouting!==!1&&e,r.value.relativePath.slice(o.value.link.length-1),!t.value.cleanUrls)+a.value})),currentLang:o}}function Jo(e,t,n,r){return t?e.replace(/\/$/,"")+tr(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):e}const Qo=e=>(Te("data-v-f21fa4f0"),e=e(),Ne(),e),Zo={class:"NotFound"},ei={class:"code"},ti={class:"title"},ni=Qo(()=>w("div",{class:"divider"},null,-1)),ri={class:"quote"},ai={class:"action"},si=["href","aria-label"],oi=x({__name:"NotFound",setup(e){const{theme:t}=se(),{currentLang:n}=sn();return(r,s)=>{var a,o,i,l,c;return p(),I("div",Zo,[w("p",ei,re(((a=g(t).notFound)==null?void 0:a.code)??"404"),1),w("h1",ti,re(((o=g(t).notFound)==null?void 0:o.title)??"PAGE NOT FOUND"),1),ni,w("blockquote",ri,re(((i=g(t).notFound)==null?void 0:i.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),w("div",ai,[w("a",{class:"link",href:g(Tn)(g(n).link),"aria-label":((l=g(t).notFound)==null?void 0:l.linkLabel)??"go to home"},re(((c=g(t).notFound)==null?void 0:c.linkText)??"Take me home"),9,si)])])}}}),ii=J(oi,[["__scopeId","data-v-f21fa4f0"]]);function es(e,t){if(Array.isArray(e))return pn(e);if(e==null)return[];t=tr(t);const n=Object.keys(e).sort((s,a)=>a.split("/").length-s.split("/").length).find(s=>t.startsWith(tr(s))),r=n?e[n]:[];return Array.isArray(r)?pn(r):pn(r.items,r.base)}function li(e){const t=[];let n=0;for(const r in e){const s=e[r];if(s.items){n=t.push(s);continue}t[n]||t.push({items:[]}),t[n].items.push(s)}return t}function ci(e){const t=[];function n(r){for(const s of r)s.text&&s.link&&t.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&n(s.items)}return n(e),t}function nr(e,t){return Array.isArray(t)?t.some(n=>nr(e,n)):St(e,t.link)?!0:t.items?nr(e,t.items):!1}function pn(e,t){return[...e].map(n=>{const r={...n},s=r.base||t;return s&&r.link&&(r.link=s+r.link),r.items&&(r.items=pn(r.items,s)),r})}function ct(){const{frontmatter:e,page:t,theme:n}=se(),r=er("(min-width: 960px)"),s=z(!1),a=U(()=>{const v=n.value.sidebar,b=t.value.relativePath;return v?es(v,b):[]}),o=z(a.value);ke(a,(v,b)=>{JSON.stringify(v)!==JSON.stringify(b)&&(o.value=a.value)});const i=U(()=>e.value.sidebar!==!1&&o.value.length>0&&e.value.layout!=="home"),l=U(()=>c?e.value.aside==null?n.value.aside==="left":e.value.aside==="left":!1),c=U(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:n.value.aside!==!1),u=U(()=>i.value&&r.value),h=U(()=>i.value?li(o.value):[]);function d(){s.value=!0}function _(){s.value=!1}function E(){s.value?_():d()}return{isOpen:s,sidebar:o,sidebarGroups:h,hasSidebar:i,hasAside:c,leftAside:l,isSidebarEnabled:u,open:d,close:_,toggle:E}}function ui(e,t){let n;gt(()=>{n=e.value?document.activeElement:void 0}),Ke(()=>{window.addEventListener("keyup",r)}),Nn(()=>{window.removeEventListener("keyup",r)});function r(s){s.key==="Escape"&&e.value&&(t(),n==null||n.focus())}}function di(e){const{page:t,hash:n}=se(),r=z(!1),s=U(()=>e.value.collapsed!=null),a=U(()=>!!e.value.link),o=z(!1),i=()=>{o.value=St(t.value.relativePath,e.value.link)};ke([t,e,n],i),Ke(i);const l=U(()=>o.value?!0:e.value.items?nr(t.value.relativePath,e.value.items):!1),c=U(()=>!!(e.value.items&&e.value.items.length));gt(()=>{r.value=!!(s.value&&e.value.collapsed)}),Lr(()=>{(o.value||l.value)&&(r.value=!1)});function u(){s.value&&(r.value=!r.value)}return{collapsed:r,collapsible:s,isLink:a,isActiveLink:o,hasActiveLink:l,hasChildren:c,toggle:u}}function hi(){const{hasSidebar:e}=ct(),t=er("(min-width: 960px)"),n=er("(min-width: 1280px)");return{isAsideEnabled:U(()=>!n.value&&!t.value?!1:e.value?n.value:t.value)}}const rr=[];function ts(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function Or(e){const t=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const r=Number(n.tagName[1]);return{element:n,title:fi(n),link:"#"+n.id,level:r}});return mi(t,e)}function fi(e){let t="";for(const n of e.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor")||n.classList.contains("ignore-header"))continue;t+=n.textContent}else n.nodeType===3&&(t+=n.textContent);return t.trim()}function mi(e,t){if(t===!1)return[];const n=(typeof t=="object"&&!Array.isArray(t)?t.level:t)||2,[r,s]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;e=e.filter(o=>o.level>=r&&o.level<=s),rr.length=0;for(const{element:o,link:i}of e)rr.push({element:o,link:i});const a=[];e:for(let o=0;o<e.length;o++){const i=e[o];if(o===0)a.push(i);else{for(let l=o-1;l>=0;l--){const c=e[l];if(c.level<i.level){(c.children||(c.children=[])).push(i);continue e}}a.push(i)}}return a}function pi(e,t){const{isAsideEnabled:n}=hi(),r=qo(a,100);let s=null;Ke(()=>{requestAnimationFrame(a),window.addEventListener("scroll",r)}),Oo(()=>{o(location.hash)}),Nn(()=>{window.removeEventListener("scroll",r)});function a(){if(!n.value)return;const i=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,u=Math.abs(i+l-c)<1,h=rr.map(({element:_,link:E})=>({link:E,top:gi(_)})).filter(({top:_})=>!Number.isNaN(_)).sort((_,E)=>_.top-E.top);if(!h.length){o(null);return}if(i<1){o(null);return}if(u){o(h[h.length-1].link);return}let d=null;for(const{link:_,top:E}of h){if(E>i+Io()+4)break;d=_}o(d)}function o(i){s&&s.classList.remove("active"),i==null?s=null:s=e.value.querySelector(`a[href="${decodeURIComponent(i)}"]`);const l=s;l?(l.classList.add("active"),t.value.style.top=l.offsetTop+39+"px",t.value.style.opacity="1"):(t.value.style.top="33px",t.value.style.opacity="0")}}function gi(e){let t=0;for(;e!==document.body;){if(e===null)return NaN;t+=e.offsetTop,e=e.offsetParent}return t}const _i=["href","title"],vi=x({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function t({target:n}){const r=n.href.split("#")[1],s=document.getElementById(decodeURIComponent(r));s==null||s.focus({preventScroll:!0})}return(n,r)=>{const s=_t("VPDocOutlineItem",!0);return p(),I("ul",{class:de(["VPDocOutlineItem",n.root?"root":"nested"])},[(p(!0),I(ge,null,$e(n.headers,({children:a,link:o,title:i})=>(p(),I("li",null,[w("a",{class:"outline-link",href:o,onClick:t,title:i},re(i),9,_i),a!=null&&a.length?(p(),X(s,{key:0,headers:a},null,8,["headers"])):G("",!0)]))),256))],2)}}}),ns=J(vi,[["__scopeId","data-v-222a0e43"]]),bi={class:"content"},yi={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},ki=x({__name:"VPDocAsideOutline",setup(e){const{frontmatter:t,theme:n}=se(),r=Mn([]);Pn(()=>{r.value=Or(t.value.outline??n.value.outline)});const s=z(),a=z();return pi(s,a),(o,i)=>(p(),I("nav",{"aria-labelledby":"doc-outline-aria-label",class:de(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:s},[w("div",bi,[w("div",{class:"outline-marker",ref_key:"marker",ref:a},null,512),w("div",yi,re(g(ts)(g(n))),1),Y(ns,{headers:r.value,root:!0},null,8,["headers"])])],2))}}),wi=J(ki,[["__scopeId","data-v-b00a836d"]]),Li={class:"VPDocAsideCarbonAds"},Ei=x({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const t=()=>null;return(n,r)=>(p(),I("div",Li,[Y(g(t),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),Si=e=>(Te("data-v-4658682f"),e=e(),Ne(),e),Oi={class:"VPDocAside"},Ii=Si(()=>w("div",{class:"spacer"},null,-1)),Ci=x({__name:"VPDocAside",setup(e){const{theme:t}=se();return(n,r)=>(p(),I("div",Oi,[S(n.$slots,"aside-top",{},void 0,!0),S(n.$slots,"aside-outline-before",{},void 0,!0),Y(wi),S(n.$slots,"aside-outline-after",{},void 0,!0),Ii,S(n.$slots,"aside-ads-before",{},void 0,!0),g(t).carbonAds?(p(),X(Ei,{key:0,"carbon-ads":g(t).carbonAds},null,8,["carbon-ads"])):G("",!0),S(n.$slots,"aside-ads-after",{},void 0,!0),S(n.$slots,"aside-bottom",{},void 0,!0)]))}}),Ai=J(Ci,[["__scopeId","data-v-4658682f"]]);function Ti(){const{theme:e,page:t}=se();return U(()=>{const{text:n="Edit this page",pattern:r=""}=e.value.editLink||{};let s;return typeof r=="function"?s=r(t.value):s=r.replace(/:path/g,t.value.filePath),{url:s,text:n}})}function Ni(){const{page:e,theme:t,frontmatter:n}=se();return U(()=>{var c,u,h,d,_,E,v,b;const r=es(t.value.sidebar,e.value.relativePath),s=ci(r),a=Mi(s,M=>M.link.replace(/[?#].*$/,"")),o=a.findIndex(M=>St(e.value.relativePath,M.link)),i=((c=t.value.docFooter)==null?void 0:c.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((u=t.value.docFooter)==null?void 0:u.next)===!1&&!n.value.next||n.value.next===!1;return{prev:i?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((h=a[o-1])==null?void 0:h.docFooterText)??((d=a[o-1])==null?void 0:d.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((_=a[o-1])==null?void 0:_.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((E=a[o+1])==null?void 0:E.docFooterText)??((v=a[o+1])==null?void 0:v.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((b=a[o+1])==null?void 0:b.link)}}})}function Mi(e,t){const n=new Set;return e.filter(r=>{const s=t(r);return n.has(s)?!1:n.add(s)})}const qe=x({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.tag??(t.href?"a":"span")),r=U(()=>t.href&&za.test(t.href)||t.target==="_blank");return(s,a)=>(p(),X(Xe(n.value),{class:de(["VPLink",{link:s.href,"vp-external-link-icon":r.value,"no-icon":s.noIcon}]),href:s.href?g(Sr)(s.href):void 0,target:s.target??(r.value?"_blank":void 0),rel:s.rel??(r.value?"noreferrer":void 0)},{default:A(()=>[S(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Pi={class:"VPLastUpdated"},$i=["datetime"],Ri=x({__name:"VPDocFooterLastUpdated",setup(e){const{theme:t,page:n,lang:r}=se(),s=U(()=>new Date(n.value.lastUpdated)),a=U(()=>s.value.toISOString()),o=z("");return Ke(()=>{gt(()=>{var i,l,c;o.value=new Intl.DateTimeFormat((l=(i=t.value.lastUpdated)==null?void 0:i.formatOptions)!=null&&l.forceLocale?r.value:void 0,((c=t.value.lastUpdated)==null?void 0:c.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(s.value)})}),(i,l)=>{var c;return p(),I("p",Pi,[Ze(re(((c=g(t).lastUpdated)==null?void 0:c.text)||g(t).lastUpdatedText||"Last updated")+": ",1),w("time",{datetime:a.value},re(o.value),9,$i)])}}}),Fi=J(Ri,[["__scopeId","data-v-76b0af40"]]),rs=e=>(Te("data-v-d559afa1"),e=e(),Ne(),e),Di={key:0,class:"VPDocFooter"},Vi={key:0,class:"edit-info"},xi={key:0,class:"edit-link"},Ui=rs(()=>w("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Hi={key:1,class:"last-updated"},Bi={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},Wi=rs(()=>w("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),ji={class:"pager"},Ki=["innerHTML"],Gi=["innerHTML"],Yi={class:"pager"},zi=["innerHTML"],Xi=["innerHTML"],qi=x({__name:"VPDocFooter",setup(e){const{theme:t,page:n,frontmatter:r}=se(),s=Ti(),a=Ni(),o=U(()=>t.value.editLink&&r.value.editLink!==!1),i=U(()=>n.value.lastUpdated),l=U(()=>o.value||i.value||a.value.prev||a.value.next);return(c,u)=>{var h,d,_,E;return l.value?(p(),I("footer",Di,[S(c.$slots,"doc-footer-before",{},void 0,!0),o.value||i.value?(p(),I("div",Vi,[o.value?(p(),I("div",xi,[Y(qe,{class:"edit-link-button",href:g(s).url,"no-icon":!0},{default:A(()=>[Ui,Ze(" "+re(g(s).text),1)]),_:1},8,["href"])])):G("",!0),i.value?(p(),I("div",Hi,[Y(Fi)])):G("",!0)])):G("",!0),(h=g(a).prev)!=null&&h.link||(d=g(a).next)!=null&&d.link?(p(),I("nav",Bi,[Wi,w("div",ji,[(_=g(a).prev)!=null&&_.link?(p(),X(qe,{key:0,class:"pager-link prev",href:g(a).prev.link},{default:A(()=>{var v;return[w("span",{class:"desc",innerHTML:((v=g(t).docFooter)==null?void 0:v.prev)||"Previous page"},null,8,Ki),w("span",{class:"title",innerHTML:g(a).prev.text},null,8,Gi)]}),_:1},8,["href"])):G("",!0)]),w("div",Yi,[(E=g(a).next)!=null&&E.link?(p(),X(qe,{key:0,class:"pager-link next",href:g(a).next.link},{default:A(()=>{var v;return[w("span",{class:"desc",innerHTML:((v=g(t).docFooter)==null?void 0:v.next)||"Next page"},null,8,zi),w("span",{class:"title",innerHTML:g(a).next.text},null,8,Xi)]}),_:1},8,["href"])):G("",!0)])])):G("",!0)])):G("",!0)}}}),Ji=J(qi,[["__scopeId","data-v-d559afa1"]]),Qi=e=>(Te("data-v-5abf72ea"),e=e(),Ne(),e),Zi={class:"container"},el=Qi(()=>w("div",{class:"aside-curtain"},null,-1)),tl={class:"aside-container"},nl={class:"aside-content"},rl={class:"content"},al={class:"content-container"},sl={class:"main"},ol=x({__name:"VPDoc",setup(e){const{theme:t}=se(),n=an(),{hasSidebar:r,hasAside:s,leftAside:a}=ct(),o=U(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(i,l)=>{const c=_t("Content");return p(),I("div",{class:de(["VPDoc",{"has-sidebar":g(r),"has-aside":g(s)}])},[S(i.$slots,"doc-top",{},void 0,!0),w("div",Zi,[g(s)?(p(),I("div",{key:0,class:de(["aside",{"left-aside":g(a)}])},[el,w("div",tl,[w("div",nl,[Y(Ai,null,{"aside-top":A(()=>[S(i.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(i.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(i.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):G("",!0),w("div",rl,[w("div",al,[S(i.$slots,"doc-before",{},void 0,!0),w("main",sl,[Y(c,{class:de(["vp-doc",[o.value,g(t).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),Y(Ji,null,{"doc-footer-before":A(()=>[S(i.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),S(i.$slots,"doc-after",{},void 0,!0)])])]),S(i.$slots,"doc-bottom",{},void 0,!0)],2)}}}),il=J(ol,[["__scopeId","data-v-5abf72ea"]]),ll=x({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.href&&za.test(t.href)),r=U(()=>t.tag||t.href?"a":"button");return(s,a)=>(p(),X(Xe(r.value),{class:de(["VPButton",[s.size,s.theme]]),href:s.href?g(Sr)(s.href):void 0,target:t.target??(n.value?"_blank":void 0),rel:t.rel??(n.value?"noreferrer":void 0)},{default:A(()=>[Ze(re(s.text),1)]),_:1},8,["class","href","target","rel"]))}}),cl=J(ll,[["__scopeId","data-v-2e2cc773"]]),ul=["src","alt"],dl=x({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(t,n)=>{const r=_t("VPImage",!0);return t.image?(p(),I(ge,{key:0},[typeof t.image=="string"||"src"in t.image?(p(),I("img",ft({key:0,class:"VPImage"},typeof t.image=="string"?t.$attrs:{...t.image,...t.$attrs},{src:g(Tn)(typeof t.image=="string"?t.image:t.image.src),alt:t.alt??(typeof t.image=="string"?"":t.image.alt||"")}),null,16,ul)):(p(),I(ge,{key:1},[Y(r,ft({class:"dark",image:t.image.dark,alt:t.image.alt},t.$attrs),null,16,["image","alt"]),Y(r,ft({class:"light",image:t.image.light,alt:t.image.alt},t.$attrs),null,16,["image","alt"])],64))],64)):G("",!0)}}}),Ln=J(dl,[["__scopeId","data-v-9575efa8"]]),hl=e=>(Te("data-v-4ee8f0e8"),e=e(),Ne(),e),fl={class:"container"},ml={class:"main"},pl={key:0,class:"name"},gl=["innerHTML"],_l=["innerHTML"],vl=["innerHTML"],bl={key:0,class:"actions"},yl={key:0,class:"image"},kl={class:"image-container"},wl=hl(()=>w("div",{class:"image-bg"},null,-1)),Ll=x({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const t=Bt("hero-image-slot-exists");return(n,r)=>(p(),I("div",{class:de(["VPHero",{"has-image":n.image||g(t)}])},[w("div",fl,[w("div",ml,[S(n.$slots,"home-hero-info-before",{},void 0,!0),S(n.$slots,"home-hero-info",{},()=>[n.name?(p(),I("h1",pl,[w("span",{innerHTML:n.name,class:"clip"},null,8,gl)])):G("",!0),n.text?(p(),I("p",{key:1,innerHTML:n.text,class:"text"},null,8,_l)):G("",!0),n.tagline?(p(),I("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,vl)):G("",!0)],!0),S(n.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(p(),I("div",bl,[(p(!0),I(ge,null,$e(n.actions,s=>(p(),I("div",{key:s.link,class:"action"},[Y(cl,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link,target:s.target,rel:s.rel},null,8,["theme","text","href","target","rel"])]))),128))])):G("",!0),S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||g(t)?(p(),I("div",yl,[w("div",kl,[wl,S(n.$slots,"home-hero-image",{},()=>[n.image?(p(),X(Ln,{key:0,class:"image-src",image:n.image},null,8,["image"])):G("",!0)],!0)])])):G("",!0)])],2))}}),El=J(Ll,[["__scopeId","data-v-4ee8f0e8"]]),Sl=x({__name:"VPHomeHero",setup(e){const{frontmatter:t}=se();return(n,r)=>g(t).hero?(p(),X(El,{key:0,class:"VPHomeHero",name:g(t).hero.name,text:g(t).hero.text,tagline:g(t).hero.tagline,image:g(t).hero.image,actions:g(t).hero.actions},{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before")]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info")]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after")]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after")]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):G("",!0)}}),Ol=e=>(Te("data-v-049ac8d8"),e=e(),Ne(),e),Il={class:"box"},Cl={key:0,class:"icon"},Al=["innerHTML"],Tl=["innerHTML"],Nl=["innerHTML"],Ml={key:4,class:"link-text"},Pl={class:"link-text-value"},$l=Ol(()=>w("span",{class:"vpi-arrow-right link-text-icon"},null,-1)),Rl=x({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(t,n)=>(p(),X(qe,{class:"VPFeature",href:t.link,rel:t.rel,target:t.target,"no-icon":!0,tag:t.link?"a":"div"},{default:A(()=>[w("article",Il,[typeof t.icon=="object"&&t.icon.wrap?(p(),I("div",Cl,[Y(Ln,{image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])])):typeof t.icon=="object"?(p(),X(Ln,{key:1,image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])):t.icon?(p(),I("div",{key:2,class:"icon",innerHTML:t.icon},null,8,Al)):G("",!0),w("h2",{class:"title",innerHTML:t.title},null,8,Tl),t.details?(p(),I("p",{key:3,class:"details",innerHTML:t.details},null,8,Nl)):G("",!0),t.linkText?(p(),I("div",Ml,[w("p",Pl,[Ze(re(t.linkText)+" ",1),$l])])):G("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Fl=J(Rl,[["__scopeId","data-v-049ac8d8"]]),Dl={key:0,class:"VPFeatures"},Vl={class:"container"},xl={class:"items"},Ul=x({__name:"VPFeatures",props:{features:{}},setup(e){const t=e,n=U(()=>{const r=t.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,s)=>r.features?(p(),I("div",Dl,[w("div",Vl,[w("div",xl,[(p(!0),I(ge,null,$e(r.features,a=>(p(),I("div",{key:a.title,class:de(["item",[n.value]])},[Y(Fl,{icon:a.icon,title:a.title,details:a.details,link:a.link,"link-text":a.linkText,rel:a.rel,target:a.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):G("",!0)}}),Hl=J(Ul,[["__scopeId","data-v-7db191e7"]]),Bl=x({__name:"VPHomeFeatures",setup(e){const{frontmatter:t}=se();return(n,r)=>g(t).features?(p(),X(Hl,{key:0,class:"VPHomeFeatures",features:g(t).features},null,8,["features"])):G("",!0)}}),Wl=x({__name:"VPHomeContent",setup(e){const{width:t}=Co({initialWidth:0,includeScrollbar:!1});return(n,r)=>(p(),I("div",{class:"vp-doc container",style:Xa(g(t)?{"--vp-offset":`calc(50% - ${g(t)/2}px)`}:{})},[S(n.$slots,"default",{},void 0,!0)],4))}}),jl=J(Wl,[["__scopeId","data-v-19bd15b0"]]),Kl={class:"VPHome"},Gl=x({__name:"VPHome",setup(e){const{frontmatter:t}=se();return(n,r)=>{const s=_t("Content");return p(),I("div",Kl,[S(n.$slots,"home-hero-before",{},void 0,!0),Y(Sl,null,{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image",{},void 0,!0)]),_:3}),S(n.$slots,"home-hero-after",{},void 0,!0),S(n.$slots,"home-features-before",{},void 0,!0),Y(Bl),S(n.$slots,"home-features-after",{},void 0,!0),g(t).markdownStyles!==!1?(p(),X(jl,{key:0},{default:A(()=>[Y(s)]),_:1})):(p(),X(s,{key:1}))])}}}),Yl=J(Gl,[["__scopeId","data-v-0f4801bd"]]),zl={},Xl={class:"VPPage"};function ql(e,t){const n=_t("Content");return p(),I("div",Xl,[S(e.$slots,"page-top"),Y(n),S(e.$slots,"page-bottom")])}const Jl=J(zl,[["render",ql]]),Ql=x({__name:"VPContent",setup(e){const{page:t,frontmatter:n}=se(),{hasSidebar:r}=ct();return(s,a)=>(p(),I("div",{class:de(["VPContent",{"has-sidebar":g(r),"is-home":g(n).layout==="home"}]),id:"VPContent"},[g(t).isNotFound?S(s.$slots,"not-found",{key:0},()=>[Y(ii)],!0):g(n).layout==="page"?(p(),X(Jl,{key:1},{"page-top":A(()=>[S(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):g(n).layout==="home"?(p(),X(Yl,{key:2},{"home-hero-before":A(()=>[S(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(s.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(s.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(s.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):g(n).layout&&g(n).layout!=="doc"?(p(),X(Xe(g(n).layout),{key:3})):(p(),X(il,{key:4},{"doc-top":A(()=>[S(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":A(()=>[S(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":A(()=>[S(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":A(()=>[S(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":A(()=>[S(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Zl=J(Ql,[["__scopeId","data-v-9ec0cef3"]]),ec={class:"container"},tc=["innerHTML"],nc=["innerHTML"],rc=x({__name:"VPFooter",setup(e){const{theme:t,frontmatter:n}=se(),{hasSidebar:r}=ct();return(s,a)=>g(t).footer&&g(n).footer!==!1?(p(),I("footer",{key:0,class:de(["VPFooter",{"has-sidebar":g(r)}])},[w("div",ec,[g(t).footer.message?(p(),I("p",{key:0,class:"message",innerHTML:g(t).footer.message},null,8,tc)):G("",!0),g(t).footer.copyright?(p(),I("p",{key:1,class:"copyright",innerHTML:g(t).footer.copyright},null,8,nc)):G("",!0)])],2)):G("",!0)}}),ac=J(rc,[["__scopeId","data-v-4dac48fd"]]);function sc(){const{theme:e,frontmatter:t}=se(),n=Mn([]),r=U(()=>n.value.length>0);return Pn(()=>{n.value=Or(t.value.outline??e.value.outline)}),{headers:n,hasLocalNav:r}}const oc=e=>(Te("data-v-1543e967"),e=e(),Ne(),e),ic={class:"menu-text"},lc=oc(()=>w("span",{class:"vpi-chevron-right icon"},null,-1)),cc={class:"header"},uc={class:"outline"},dc=x({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const t=e,{theme:n}=se(),r=z(!1),s=z(0),a=z(),o=z();function i(h){var d;(d=a.value)!=null&&d.contains(h.target)||(r.value=!1)}ke(r,h=>{if(h){document.addEventListener("click",i);return}document.removeEventListener("click",i)}),Ao("Escape",()=>{r.value=!1}),Pn(()=>{r.value=!1});function l(){r.value=!r.value,s.value=window.innerHeight+Math.min(window.scrollY-t.navHeight,0)}function c(h){h.target.classList.contains("outline-link")&&(o.value&&(o.value.style.transition="none"),it(()=>{r.value=!1}))}function u(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,d)=>(p(),I("div",{class:"VPLocalNavOutlineDropdown",style:Xa({"--vp-vh":s.value+"px"}),ref_key:"main",ref:a},[h.headers.length>0?(p(),I("button",{key:0,onClick:l,class:de({open:r.value})},[w("span",ic,re(g(ts)(g(n))),1),lc],2)):(p(),I("button",{key:1,onClick:u},re(g(n).returnToTopLabel||"Return to top"),1)),Y(An,{name:"flyout"},{default:A(()=>[r.value?(p(),I("div",{key:0,ref_key:"items",ref:o,class:"items",onClick:c},[w("div",cc,[w("a",{class:"top-link",href:"#",onClick:u},re(g(n).returnToTopLabel||"Return to top"),1)]),w("div",uc,[Y(ns,{headers:h.headers},null,8,["headers"])])],512)):G("",!0)]),_:1})],4))}}),hc=J(dc,[["__scopeId","data-v-1543e967"]]),fc=e=>(Te("data-v-748e1dce"),e=e(),Ne(),e),mc={class:"container"},pc=["aria-expanded"],gc=fc(()=>w("span",{class:"vpi-align-left menu-icon"},null,-1)),_c={class:"menu-text"},vc=x({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:t,frontmatter:n}=se(),{hasSidebar:r}=ct(),{headers:s}=sc(),{y:a}=qa(),o=z(0);Ke(()=>{o.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Pn(()=>{s.value=Or(n.value.outline??t.value.outline)});const i=U(()=>s.value.length===0),l=U(()=>i.value&&!r.value),c=U(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:i.value,fixed:l.value}));return(u,h)=>g(n).layout!=="home"&&(!l.value||g(a)>=o.value)?(p(),I("div",{key:0,class:de(c.value)},[w("div",mc,[g(r)?(p(),I("button",{key:0,class:"menu","aria-expanded":u.open,"aria-controls":"VPSidebarNav",onClick:h[0]||(h[0]=d=>u.$emit("open-menu"))},[gc,w("span",_c,re(g(t).sidebarMenuLabel||"Menu"),1)],8,pc)):G("",!0),Y(hc,{headers:g(s),navHeight:o.value},null,8,["headers","navHeight"])])],2)):G("",!0)}}),bc=J(vc,[["__scopeId","data-v-748e1dce"]]);function yc(){const e=z(!1);function t(){e.value=!0,window.addEventListener("resize",s)}function n(){e.value=!1,window.removeEventListener("resize",s)}function r(){e.value?n():t()}function s(){window.outerWidth>=768&&n()}const a=an();return ke(()=>a.path,n),{isScreenOpen:e,openScreen:t,closeScreen:n,toggleScreen:r}}const kc={},wc={class:"VPSwitch",type:"button",role:"switch"},Lc={class:"check"},Ec={key:0,class:"icon"};function Sc(e,t){return p(),I("button",wc,[w("span",Lc,[e.$slots.default?(p(),I("span",Ec,[S(e.$slots,"default",{},void 0,!0)])):G("",!0)])])}const Oc=J(kc,[["render",Sc],["__scopeId","data-v-2f4ff675"]]),as=e=>(Te("data-v-68601306"),e=e(),Ne(),e),Ic=as(()=>w("span",{class:"vpi-sun sun"},null,-1)),Cc=as(()=>w("span",{class:"vpi-moon moon"},null,-1)),Ac=x({__name:"VPSwitchAppearance",setup(e){const{isDark:t,theme:n}=se(),r=Bt("toggle-appearance",()=>{t.value=!t.value}),s=z("");return Lr(()=>{s.value=t.value?n.value.lightModeSwitchTitle||"Switch to light theme":n.value.darkModeSwitchTitle||"Switch to dark theme"}),(a,o)=>(p(),X(Oc,{title:s.value,class:"VPSwitchAppearance","aria-checked":g(t),onClick:g(r)},{default:A(()=>[Ic,Cc]),_:1},8,["title","aria-checked","onClick"]))}}),Ir=J(Ac,[["__scopeId","data-v-68601306"]]),Tc={key:0,class:"VPNavBarAppearance"},Nc=x({__name:"VPNavBarAppearance",setup(e){const{site:t}=se();return(n,r)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(p(),I("div",Tc,[Y(Ir)])):G("",!0)}}),Mc=J(Nc,[["__scopeId","data-v-2aba815b"]]),Cr=z();let ss=!1,Kn=0;function Pc(e){const t=z(!1);if($n){!ss&&$c(),Kn++;const n=ke(Cr,r=>{var s,a,o;r===e.el.value||(s=e.el.value)!=null&&s.contains(r)?(t.value=!0,(a=e.onFocus)==null||a.call(e)):(t.value=!1,(o=e.onBlur)==null||o.call(e))});Nn(()=>{n(),Kn--,Kn||Rc()})}return To(t)}function $c(){document.addEventListener("focusin",os),ss=!0,Cr.value=document.activeElement}function Rc(){document.removeEventListener("focusin",os)}function os(){Cr.value=document.activeElement}const Fc={class:"VPMenuLink"},Dc=x({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:t}=se();return(n,r)=>(p(),I("div",Fc,[Y(qe,{class:de({active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:A(()=>[Ze(re(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Fn=J(Dc,[["__scopeId","data-v-d4a443a7"]]),Vc={class:"VPMenuGroup"},xc={key:0,class:"title"},Uc=x({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",Vc,[t.text?(p(),I("p",xc,re(t.text),1)):G("",!0),(p(!0),I(ge,null,$e(t.items,r=>(p(),I(ge,null,["link"in r?(p(),X(Fn,{key:0,item:r},null,8,["item"])):G("",!0)],64))),256))]))}}),Hc=J(Uc,[["__scopeId","data-v-588c8f9a"]]),Bc={class:"VPMenu"},Wc={key:0,class:"items"},jc=x({__name:"VPMenu",props:{items:{}},setup(e){return(t,n)=>(p(),I("div",Bc,[t.items?(p(),I("div",Wc,[(p(!0),I(ge,null,$e(t.items,r=>(p(),I(ge,{key:JSON.stringify(r)},["link"in r?(p(),X(Fn,{key:0,item:r},null,8,["item"])):"component"in r?(p(),X(Xe(r.component),ft({key:1,ref_for:!0},r.props),null,16)):(p(),X(Hc,{key:2,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):G("",!0),S(t.$slots,"default",{},void 0,!0)]))}}),Kc=J(jc,[["__scopeId","data-v-3491eb4b"]]),Gc=e=>(Te("data-v-bab2d525"),e=e(),Ne(),e),Yc=["aria-expanded","aria-label"],zc={key:0,class:"text"},Xc=["innerHTML"],qc=Gc(()=>w("span",{class:"vpi-chevron-down text-icon"},null,-1)),Jc={key:1,class:"vpi-more-horizontal icon"},Qc={class:"menu"},Zc=x({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const t=z(!1),n=z();Pc({el:n,onBlur:r});function r(){t.value=!1}return(s,a)=>(p(),I("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:a[1]||(a[1]=o=>t.value=!0),onMouseleave:a[2]||(a[2]=o=>t.value=!1)},[w("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":t.value,"aria-label":s.label,onClick:a[0]||(a[0]=o=>t.value=!t.value)},[s.button||s.icon?(p(),I("span",zc,[s.icon?(p(),I("span",{key:0,class:de([s.icon,"option-icon"])},null,2)):G("",!0),s.button?(p(),I("span",{key:1,innerHTML:s.button},null,8,Xc)):G("",!0),qc])):(p(),I("span",Jc))],8,Yc),w("div",Qc,[Y(Kc,{items:s.items},{default:A(()=>[S(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Ar=J(Zc,[["__scopeId","data-v-bab2d525"]]),eu=["href","aria-label","innerHTML"],tu=x({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const t=e,n=U(()=>typeof t.icon=="object"?t.icon.svg:`<span class="vpi-social-${t.icon}" />`);return(r,s)=>(p(),I("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,eu))}}),nu=J(tu,[["__scopeId","data-v-acc91311"]]),ru={class:"VPSocialLinks"},au=x({__name:"VPSocialLinks",props:{links:{}},setup(e){return(t,n)=>(p(),I("div",ru,[(p(!0),I(ge,null,$e(t.links,({link:r,icon:s,ariaLabel:a})=>(p(),X(nu,{key:r,icon:s,link:r,ariaLabel:a},null,8,["icon","link","ariaLabel"]))),128))]))}}),Tr=J(au,[["__scopeId","data-v-99b30aa2"]]),su={key:0,class:"group translations"},ou={class:"trans-title"},iu={key:1,class:"group"},lu={class:"item appearance"},cu={class:"label"},uu={class:"appearance-action"},du={key:2,class:"group"},hu={class:"item social-links"},fu=x({__name:"VPNavBarExtra",setup(e){const{site:t,theme:n}=se(),{localeLinks:r,currentLang:s}=sn({correspondingLink:!0}),a=U(()=>r.value.length&&s.value.label||t.value.appearance||n.value.socialLinks);return(o,i)=>a.value?(p(),X(Ar,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:A(()=>[g(r).length&&g(s).label?(p(),I("div",su,[w("p",ou,re(g(s).label),1),(p(!0),I(ge,null,$e(g(r),l=>(p(),X(Fn,{key:l.link,item:l},null,8,["item"]))),128))])):G("",!0),g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(p(),I("div",iu,[w("div",lu,[w("p",cu,re(g(n).darkModeSwitchLabel||"Appearance"),1),w("div",uu,[Y(Ir)])])])):G("",!0),g(n).socialLinks?(p(),I("div",du,[w("div",hu,[Y(Tr,{class:"social-links-list",links:g(n).socialLinks},null,8,["links"])])])):G("",!0)]),_:1})):G("",!0)}}),mu=J(fu,[["__scopeId","data-v-c72287d1"]]),pu=e=>(Te("data-v-ff3f902a"),e=e(),Ne(),e),gu=["aria-expanded"],_u=pu(()=>w("span",{class:"container"},[w("span",{class:"top"}),w("span",{class:"middle"}),w("span",{class:"bottom"})],-1)),vu=[_u],bu=x({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(t,n)=>(p(),I("button",{type:"button",class:de(["VPNavBarHamburger",{active:t.active}]),"aria-label":"mobile navigation","aria-expanded":t.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=r=>t.$emit("click"))},vu,10,gu))}}),yu=J(bu,[["__scopeId","data-v-ff3f902a"]]),ku=["innerHTML"],wu=x({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:t}=se();return(n,r)=>(p(),X(qe,{class:de({VPNavBarMenuLink:!0,active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,noIcon:n.item.noIcon,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:A(()=>[w("span",{innerHTML:n.item.text},null,8,ku)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Lu=J(wu,[["__scopeId","data-v-8cfdc400"]]),Eu=x({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const t=e,{page:n}=se(),r=a=>"component"in a?!1:"link"in a?St(n.value.relativePath,a.link,!!t.item.activeMatch):a.items.some(r),s=U(()=>r(t.item));return(a,o)=>(p(),X(Ar,{class:de({VPNavBarMenuGroup:!0,active:g(St)(g(n).relativePath,a.item.activeMatch,!!a.item.activeMatch)||s.value}),button:a.item.text,items:a.item.items},null,8,["class","button","items"]))}}),Su=e=>(Te("data-v-059a729d"),e=e(),Ne(),e),Ou={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Iu=Su(()=>w("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),Cu=x({__name:"VPNavBarMenu",setup(e){const{theme:t}=se();return(n,r)=>g(t).nav?(p(),I("nav",Ou,[Iu,(p(!0),I(ge,null,$e(g(t).nav,s=>(p(),I(ge,{key:JSON.stringify(s)},["link"in s?(p(),X(Lu,{key:0,item:s},null,8,["item"])):"component"in s?(p(),X(Xe(s.component),ft({key:1,ref_for:!0},s.props),null,16)):(p(),X(Eu,{key:2,item:s},null,8,["item"]))],64))),128))])):G("",!0)}}),Au=J(Cu,[["__scopeId","data-v-059a729d"]]);var Ur;const is=typeof window<"u",Tu=e=>typeof e=="string",gn=()=>{};is&&((Ur=window==null?void 0:window.navigator)!=null&&Ur.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function ar(e){return typeof e=="function"?e():g(e)}function Nu(e,t){function n(...r){e(()=>t.apply(this,r),{fn:t,thisArg:this,args:r})}return n}function Mu(e,t={}){let n,r;return s=>{const a=ar(e),o=ar(t.maxWait);if(n&&clearTimeout(n),a<=0||o!==void 0&&o<=0)return r&&(clearTimeout(r),r=null),s();o&&!r&&(r=setTimeout(()=>{n&&clearTimeout(n),r=null,s()},o)),n=setTimeout(()=>{r&&clearTimeout(r),r=null,s()},a)}}function Pu(e){return e}function $u(e){return Ja()?(Qa(e),!0):!1}function ls(e,t=200,n={}){return Nu(Mu(t,n),e)}function Gn(e,t=200,n={}){if(t<=0)return e;const r=z(e.value),s=ls(()=>{r.value=e.value},t,n);return ke(e,()=>s()),r}function cs(e,t,n){return ke(e,(r,s,a)=>{r&&t(r,s,a)},n)}function Ru(e){var t;const n=ar(e);return(t=n==null?void 0:n.$el)!=null?t:n}const us=is?window:void 0;function hn(...e){let t,n,r,s;if(Tu(e[0])?([n,r,s]=e,t=us):[t,n,r,s]=e,!t)return gn;let a=gn;const o=ke(()=>Ru(t),l=>{a(),l&&(l.addEventListener(n,r,s),a=()=>{l.removeEventListener(n,r,s),a=gn})},{immediate:!0,flush:"post"}),i=()=>{o(),a()};return $u(i),i}const Hr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Br="__vueuse_ssr_handlers__";Hr[Br]=Hr[Br]||{};const Fu={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Du(e={}){const{reactive:t=!1,target:n=us,aliasMap:r=Fu,passive:s=!0,onEventFired:a=gn}=e,o=tn(new Set),i={toJSON(){return{}},current:o},l=t?tn(i):i,c=new Set,u=new Set;function h(v,b){v in l&&(t?l[v]=b:l[v].value=b)}function d(){for(const v of u)h(v,!1)}function _(v,b){var M,W;const y=(M=v.key)==null?void 0:M.toLowerCase(),L=[(W=v.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?o.add(y):o.delete(y));for(const T of L)u.add(T),h(T,b);y==="meta"&&!b?(c.forEach(T=>{o.delete(T),h(T,!1)}),c.clear()):typeof v.getModifierState=="function"&&v.getModifierState("Meta")&&b&&[...o,...L].forEach(T=>c.add(T))}hn(n,"keydown",v=>(_(v,!0),a(v)),{passive:s}),hn(n,"keyup",v=>(_(v,!1),a(v)),{passive:s}),hn("blur",d,{passive:!0}),hn("focus",d,{passive:!0});const E=new Proxy(l,{get(v,b,M){if(typeof b!="string")return Reflect.get(v,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(v,b,M);return t?g(W):W}});return E}var Wr;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Wr||(Wr={}));var Vu=Object.defineProperty,jr=Object.getOwnPropertySymbols,xu=Object.prototype.hasOwnProperty,Uu=Object.prototype.propertyIsEnumerable,Kr=(e,t,n)=>t in e?Vu(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Hu=(e,t)=>{for(var n in t||(t={}))xu.call(t,n)&&Kr(e,n,t[n]);if(jr)for(var n of jr(t))Uu.call(t,n)&&Kr(e,n,t[n]);return e};const Bu={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Hu({linear:Pu},Bu);function lt(e){return Array.isArray?Array.isArray(e):fs(e)==="[object Array]"}const Wu=1/0;function ju(e){if(typeof e=="string")return e;let t=e+"";return t=="0"&&1/e==-Wu?"-0":t}function Ku(e){return e==null?"":ju(e)}function Ye(e){return typeof e=="string"}function ds(e){return typeof e=="number"}function Gu(e){return e===!0||e===!1||Yu(e)&&fs(e)=="[object Boolean]"}function hs(e){return typeof e=="object"}function Yu(e){return hs(e)&&e!==null}function Ve(e){return e!=null}function Yn(e){return!e.trim().length}function fs(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const zu="Incorrect 'index' type",Xu=e=>`Invalid value for key ${e}`,qu=e=>`Pattern length exceeds max of ${e}.`,Ju=e=>`Missing ${e} property in key`,Qu=e=>`Property 'weight' in key '${e}' must be a positive integer`,Gr=Object.prototype.hasOwnProperty;class Zu{constructor(t){this._keys=[],this._keyMap={};let n=0;t.forEach(r=>{let s=ms(r);n+=s.weight,this._keys.push(s),this._keyMap[s.id]=s,n+=s.weight}),this._keys.forEach(r=>{r.weight/=n})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function ms(e){let t=null,n=null,r=null,s=1,a=null;if(Ye(e)||lt(e))r=e,t=Yr(e),n=sr(e);else{if(!Gr.call(e,"name"))throw new Error(Ju("name"));const o=e.name;if(r=o,Gr.call(e,"weight")&&(s=e.weight,s<=0))throw new Error(Qu(o));t=Yr(o),n=sr(o),a=e.getFn}return{path:t,id:n,weight:s,src:r,getFn:a}}function Yr(e){return lt(e)?e:e.split(".")}function sr(e){return lt(e)?e.join("."):e}function ed(e,t){let n=[],r=!1;const s=(a,o,i)=>{if(Ve(a))if(!o[i])n.push(a);else{let l=o[i];const c=a[l];if(!Ve(c))return;if(i===o.length-1&&(Ye(c)||ds(c)||Gu(c)))n.push(Ku(c));else if(lt(c)){r=!0;for(let u=0,h=c.length;u<h;u+=1)s(c[u],o,i+1)}else o.length&&s(c,o,i+1)}};return s(e,Ye(t)?t.split("."):t,0),r?n:n[0]}const td={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},nd={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},rd={location:0,threshold:.6,distance:100},ad={useExtendedSearch:!1,getFn:ed,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var ee={...nd,...td,...rd,...ad};const sd=/[^ ]+/g;function od(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(s){const a=s.match(sd).length;if(n.has(a))return n.get(a);const o=1/Math.pow(a,.5*e),i=parseFloat(Math.round(o*r)/r);return n.set(a,i),i},clear(){n.clear()}}}class Nr{constructor({getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){this.norm=od(n,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((n,r)=>{this._keysMap[n.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,Ye(this.docs[0])?this.docs.forEach((t,n)=>{this._addString(t,n)}):this.docs.forEach((t,n)=>{this._addObject(t,n)}),this.norm.clear())}add(t){const n=this.size();Ye(t)?this._addString(t,n):this._addObject(t,n)}removeAt(t){this.records.splice(t,1);for(let n=t,r=this.size();n<r;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(t,n){return t[this._keysMap[n]]}size(){return this.records.length}_addString(t,n){if(!Ve(t)||Yn(t))return;let r={v:t,i:n,n:this.norm.get(t)};this.records.push(r)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach((s,a)=>{let o=s.getFn?s.getFn(t):this.getFn(t,s.path);if(Ve(o)){if(lt(o)){let i=[];const l=[{nestedArrIndex:-1,value:o}];for(;l.length;){const{nestedArrIndex:c,value:u}=l.pop();if(Ve(u))if(Ye(u)&&!Yn(u)){let h={v:u,i:c,n:this.norm.get(u)};i.push(h)}else lt(u)&&u.forEach((h,d)=>{l.push({nestedArrIndex:d,value:h})})}r.$[a]=i}else if(Ye(o)&&!Yn(o)){let i={v:o,n:this.norm.get(o)};r.$[a]=i}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function ps(e,t,{getFn:n=ee.getFn,fieldNormWeight:r=ee.fieldNormWeight}={}){const s=new Nr({getFn:n,fieldNormWeight:r});return s.setKeys(e.map(ms)),s.setSources(t),s.create(),s}function id(e,{getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){const{keys:r,records:s}=e,a=new Nr({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(s),a}function fn(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:s=ee.distance,ignoreLocation:a=ee.ignoreLocation}={}){const o=t/e.length;if(a)return o;const i=Math.abs(r-n);return s?o+i/s:i?1:o}function ld(e=[],t=ee.minMatchCharLength){let n=[],r=-1,s=-1,a=0;for(let o=e.length;a<o;a+=1){let i=e[a];i&&r===-1?r=a:!i&&r!==-1&&(s=a-1,s-r+1>=t&&n.push([r,s]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}const Et=32;function cd(e,t,n,{location:r=ee.location,distance:s=ee.distance,threshold:a=ee.threshold,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,includeMatches:l=ee.includeMatches,ignoreLocation:c=ee.ignoreLocation}={}){if(t.length>Et)throw new Error(qu(Et));const u=t.length,h=e.length,d=Math.max(0,Math.min(r,h));let _=a,E=d;const v=i>1||l,b=v?Array(h):[];let M;for(;(M=e.indexOf(t,E))>-1;){let $=fn(t,{currentLocation:M,expectedLocation:d,distance:s,ignoreLocation:c});if(_=Math.min($,_),E=M+u,v){let D=0;for(;D<u;)b[M+D]=1,D+=1}}E=-1;let W=[],y=1,L=u+h;const T=1<<u-1;for(let $=0;$<u;$+=1){let D=0,R=L;for(;D<R;)fn(t,{errors:$,currentLocation:d+R,expectedLocation:d,distance:s,ignoreLocation:c})<=_?D=R:L=R,R=Math.floor((L-D)/2+D);L=R;let he=Math.max(1,d-R+1),we=o?h:Math.min(d+R,h)+u,Z=Array(we+2);Z[we+1]=(1<<$)-1;for(let V=we;V>=he;V-=1){let ie=V-1,Ee=n[e.charAt(ie)];if(v&&(b[ie]=+!!Ee),Z[V]=(Z[V+1]<<1|1)&Ee,$&&(Z[V]|=(W[V+1]|W[V])<<1|1|W[V+1]),Z[V]&T&&(y=fn(t,{errors:$,currentLocation:ie,expectedLocation:d,distance:s,ignoreLocation:c}),y<=_)){if(_=y,E=ie,E<=d)break;he=Math.max(1,2*d-E)}}if(fn(t,{errors:$+1,currentLocation:d,expectedLocation:d,distance:s,ignoreLocation:c})>_)break;W=Z}const C={isMatch:E>=0,score:Math.max(.001,y)};if(v){const $=ld(b,i);$.length?l&&(C.indices=$):C.isMatch=!1}return C}function ud(e){let t={};for(let n=0,r=e.length;n<r;n+=1){const s=e.charAt(n);t[s]=(t[s]||0)|1<<r-n-1}return t}class gs{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){if(this.options={location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c},this.pattern=l?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const u=(d,_)=>{this.chunks.push({pattern:d,alphabet:ud(d),startIndex:_})},h=this.pattern.length;if(h>Et){let d=0;const _=h%Et,E=h-_;for(;d<E;)u(this.pattern.substr(d,Et),d),d+=Et;if(_){const v=h-Et;u(this.pattern.substr(v),v)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:n,includeMatches:r}=this.options;if(n||(t=t.toLowerCase()),this.pattern===t){let E={isMatch:!0,score:0};return r&&(E.indices=[[0,t.length-1]]),E}const{location:s,distance:a,threshold:o,findAllMatches:i,minMatchCharLength:l,ignoreLocation:c}=this.options;let u=[],h=0,d=!1;this.chunks.forEach(({pattern:E,alphabet:v,startIndex:b})=>{const{isMatch:M,score:W,indices:y}=cd(t,E,v,{location:s+b,distance:a,threshold:o,findAllMatches:i,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});M&&(d=!0),h+=W,M&&y&&(u=[...u,...y])});let _={isMatch:d,score:d?h/this.chunks.length:1};return d&&r&&(_.indices=u),_}}class vt{constructor(t){this.pattern=t}static isMultiMatch(t){return zr(t,this.multiRegex)}static isSingleMatch(t){return zr(t,this.singleRegex)}search(){}}function zr(e,t){const n=e.match(t);return n?n[1]:null}class dd extends vt{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const n=t===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class hd extends vt{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const n=t.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class fd extends vt{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const n=t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class md extends vt{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const n=!t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class pd extends vt{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const n=t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class gd extends vt{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const n=!t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class _s extends vt{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){super(t),this._bitapSearch=new gs(t,{location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class vs extends vt{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let n=0,r;const s=[],a=this.pattern.length;for(;(r=t.indexOf(this.pattern,n))>-1;)n=r+a,s.push([r,n-1]);const o=!!s.length;return{isMatch:o,score:o?0:1,indices:s}}}const or=[dd,vs,fd,md,gd,pd,hd,_s],Xr=or.length,_d=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,vd="|";function bd(e,t={}){return e.split(vd).map(n=>{let r=n.trim().split(_d).filter(a=>a&&!!a.trim()),s=[];for(let a=0,o=r.length;a<o;a+=1){const i=r[a];let l=!1,c=-1;for(;!l&&++c<Xr;){const u=or[c];let h=u.isMultiMatch(i);h&&(s.push(new u(h,t)),l=!0)}if(!l)for(c=-1;++c<Xr;){const u=or[c];let h=u.isSingleMatch(i);if(h){s.push(new u(h,t));break}}}return s})}const yd=new Set([_s.type,vs.type]);class kd{constructor(t,{isCaseSensitive:n=ee.isCaseSensitive,includeMatches:r=ee.includeMatches,minMatchCharLength:s=ee.minMatchCharLength,ignoreLocation:a=ee.ignoreLocation,findAllMatches:o=ee.findAllMatches,location:i=ee.location,threshold:l=ee.threshold,distance:c=ee.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:r,minMatchCharLength:s,findAllMatches:o,ignoreLocation:a,location:i,threshold:l,distance:c},this.pattern=n?t:t.toLowerCase(),this.query=bd(this.pattern,this.options)}static condition(t,n){return n.useExtendedSearch}searchIn(t){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:s}=this.options;t=s?t:t.toLowerCase();let a=0,o=[],i=0;for(let l=0,c=n.length;l<c;l+=1){const u=n[l];o.length=0,a=0;for(let h=0,d=u.length;h<d;h+=1){const _=u[h],{isMatch:E,indices:v,score:b}=_.search(t);if(E){if(a+=1,i+=b,r){const M=_.constructor.type;yd.has(M)?o=[...o,...v]:o.push(v)}}else{i=0,a=0,o.length=0;break}}if(a){let h={isMatch:!0,score:i/a};return r&&(h.indices=o),h}}return{isMatch:!1,score:1}}}const ir=[];function wd(...e){ir.push(...e)}function lr(e,t){for(let n=0,r=ir.length;n<r;n+=1){let s=ir[n];if(s.condition(e,t))return new s(e,t)}return new gs(e,t)}const En={AND:"$and",OR:"$or"},cr={PATH:"$path",PATTERN:"$val"},ur=e=>!!(e[En.AND]||e[En.OR]),Ld=e=>!!e[cr.PATH],Ed=e=>!lt(e)&&hs(e)&&!ur(e),qr=e=>({[En.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function bs(e,t,{auto:n=!0}={}){const r=s=>{let a=Object.keys(s);const o=Ld(s);if(!o&&a.length>1&&!ur(s))return r(qr(s));if(Ed(s)){const l=o?s[cr.PATH]:a[0],c=o?s[cr.PATTERN]:s[l];if(!Ye(c))throw new Error(Xu(l));const u={keyId:sr(l),pattern:c};return n&&(u.searcher=lr(c,t)),u}let i={children:[],operator:a[0]};return a.forEach(l=>{const c=s[l];lt(c)&&c.forEach(u=>{i.children.push(r(u))})}),i};return ur(e)||(e=qr(e)),r(e)}function Sd(e,{ignoreFieldNorm:t=ee.ignoreFieldNorm}){e.forEach(n=>{let r=1;n.matches.forEach(({key:s,norm:a,score:o})=>{const i=s?s.weight:null;r*=Math.pow(o===0&&i?Number.EPSILON:o,(i||1)*(t?1:a))}),n.score=r})}function Od(e,t){const n=e.matches;t.matches=[],Ve(n)&&n.forEach(r=>{if(!Ve(r.indices)||!r.indices.length)return;const{indices:s,value:a}=r;let o={indices:s,value:a};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),t.matches.push(o)})}function Id(e,t){t.score=e.score}function Cd(e,t,{includeMatches:n=ee.includeMatches,includeScore:r=ee.includeScore}={}){const s=[];return n&&s.push(Od),r&&s.push(Id),e.map(a=>{const{idx:o}=a,i={item:t[o],refIndex:o};return s.length&&s.forEach(l=>{l(a,i)}),i})}class Ot{constructor(t,n={},r){this.options={...ee,...n},this.options.useExtendedSearch,this._keyStore=new Zu(this.options.keys),this.setCollection(t,r)}setCollection(t,n){if(this._docs=t,n&&!(n instanceof Nr))throw new Error(zu);this._myIndex=n||ps(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){!Ve(t)||(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const n=[];for(let r=0,s=this._docs.length;r<s;r+=1){const a=this._docs[r];t(a,r)&&(this.removeAt(r),r-=1,s-=1,n.push(a))}return n}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:n=-1}={}){const{includeMatches:r,includeScore:s,shouldSort:a,sortFn:o,ignoreFieldNorm:i}=this.options;let l=Ye(t)?Ye(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Sd(l,{ignoreFieldNorm:i}),a&&l.sort(o),ds(n)&&n>-1&&(l=l.slice(0,n)),Cd(l,this._docs,{includeMatches:r,includeScore:s})}_searchStringList(t){const n=lr(t,this.options),{records:r}=this._myIndex,s=[];return r.forEach(({v:a,i:o,n:i})=>{if(!Ve(a))return;const{isMatch:l,score:c,indices:u}=n.searchIn(a);l&&s.push({item:a,idx:o,matches:[{score:c,value:a,norm:i,indices:u}]})}),s}_searchLogical(t){const n=bs(t,this.options),r=(i,l,c)=>{if(!i.children){const{keyId:h,searcher:d}=i,_=this._findMatches({key:this._keyStore.get(h),value:this._myIndex.getValueForItemAtKeyId(l,h),searcher:d});return _&&_.length?[{idx:c,item:l,matches:_}]:[]}const u=[];for(let h=0,d=i.children.length;h<d;h+=1){const _=i.children[h],E=r(_,l,c);if(E.length)u.push(...E);else if(i.operator===En.AND)return[]}return u},s=this._myIndex.records,a={},o=[];return s.forEach(({$:i,i:l})=>{if(Ve(i)){let c=r(n,i,l);c.length&&(a[l]||(a[l]={idx:l,item:i,matches:[]},o.push(a[l])),c.forEach(({matches:u})=>{a[l].matches.push(...u)}))}}),o}_searchObjectList(t){const n=lr(t,this.options),{keys:r,records:s}=this._myIndex,a=[];return s.forEach(({$:o,i})=>{if(!Ve(o))return;let l=[];r.forEach((c,u)=>{l.push(...this._findMatches({key:c,value:o[u],searcher:n}))}),l.length&&a.push({idx:i,item:o,matches:l})}),a}_findMatches({key:t,value:n,searcher:r}){if(!Ve(n))return[];let s=[];if(lt(n))n.forEach(({v:a,i:o,n:i})=>{if(!Ve(a))return;const{isMatch:l,score:c,indices:u}=r.searchIn(a);l&&s.push({score:c,key:t,value:a,idx:o,norm:i,indices:u})});else{const{v:a,n:o}=n,{isMatch:i,score:l,indices:c}=r.searchIn(a);i&&s.push({score:l,key:t,value:a,norm:o,indices:c})}return s}}Ot.version="6.6.2";Ot.createIndex=ps;Ot.parseIndex=id;Ot.config=ee;Ot.parseQuery=bs;wd(kd);const Jr=tn({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Wt=()=>({isSearching:U(()=>Jr.search!==""),...Mo(Jr)});function Ad(e){return{all:e=e||new Map,on:function(t,n){var r=e.get(t);r?r.push(n):e.set(t,[n])},off:function(t,n){var r=e.get(t);r&&(n?r.splice(r.indexOf(n)>>>0,1):e.set(t,[]))},emit:function(t,n){var r=e.get(t);r&&r.slice().map(function(s){s(n)}),(r=e.get("*"))&&r.slice().map(function(s){s(t,n)})}}}const Td=Ad(),Dn=()=>({emitter:Td});function Nd(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return n;n=n.nextElementSibling}}function Md(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}const Pd=["command-theme"],$d={"command-root":""},Rd=x({name:"Command"}),Fd=x({...Rd,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(e,{emit:t}){const n=e,r='[command-item=""]',s="command-item-key",a='[command-group=""]',o="command-group-key",i='[command-group-heading=""]',l=`${r}:not([aria-disabled="true"])`,c=`${r}[aria-selected="true"]`,u="command-item-select",h="data-value";Er("theme",n.theme||"default");const{selectedNode:d,search:_,dataValue:E,filtered:v}=Wt(),{emitter:b}=Dn(),M=z(),W=Gn(z(new Map),333),y=Gn(z(new Set),333),L=Gn(z(new Map)),T=U(()=>{const j=[];for(const[le,oe]of W.value.entries())j.push({key:le,label:oe});return j}),C=U(()=>{const j=Ot.createIndex(n.fuseOptions.keys,T.value);return new Ot(T.value,n.fuseOptions,j)}),$=()=>{var j,le,oe;const fe=D();fe&&(((j=fe.parentElement)==null?void 0:j.firstElementChild)===fe&&((oe=(le=fe.closest(a))==null?void 0:le.querySelector(i))==null||oe.scrollIntoView({block:"nearest"})),fe.scrollIntoView({block:"nearest"}))},D=()=>{var j;return(j=M.value)==null?void 0:j.querySelector(c)},R=(j=M.value)=>{const le=j==null?void 0:j.querySelectorAll(l);return le?Array.from(le):[]},he=()=>{var j;const le=(j=M.value)==null?void 0:j.querySelectorAll(a);return le?Array.from(le):[]},we=()=>{const[j]=R();j&&j.getAttribute(s)&&(d.value=j.getAttribute(s)||"")},Z=j=>{const le=R()[j];le&&(d.value=le.getAttribute(s)||"")},V=j=>{const le=D(),oe=R(),fe=oe.findIndex(Ge=>Ge===le),De=oe[fe+j];De?d.value=De.getAttribute(s)||"":j>0?Z(0):Z(oe.length-1)},ie=j=>{const le=D();let oe=le==null?void 0:le.closest(a),fe=null;for(;oe&&!fe;)oe=j>0?Nd(oe,a):Md(oe,a),fe=oe==null?void 0:oe.querySelector(l);fe?d.value=fe.getAttribute(s)||"":V(j)},Ee=()=>Z(0),Oe=()=>Z(R().length-1),ve=j=>{j.preventDefault(),j.metaKey?Oe():j.altKey?ie(1):V(1)},Ue=j=>{j.preventDefault(),j.metaKey?Ee():j.altKey?ie(-1):V(-1)},tt=j=>{switch(j.key){case"n":case"j":{j.ctrlKey&&ve(j);break}case"ArrowDown":{ve(j);break}case"p":case"k":{j.ctrlKey&&Ue(j);break}case"ArrowUp":{Ue(j);break}case"Home":{Ee();break}case"End":{Oe();break}case"Enter":{const le=D();if(le){const oe=new Event(u);le.dispatchEvent(oe)}}}},be=()=>{if(!_.value){v.value.count=y.value.size;return}v.value.groups=new Set("");const j=new Map,le=C.value.search(_.value).map(oe=>oe.item);for(const{key:oe,label:fe}of le)j.set(oe,fe);for(const[oe,fe]of L.value)for(const De of fe)j.get(De)&&v.value.groups.add(oe);it(()=>{v.value.count=j.size,v.value.items=j})},Le=()=>{const j=R(),le=he();for(const oe of j){const fe=oe.getAttribute(s)||"",De=oe.getAttribute(h)||"";y.value.add(fe),W.value.set(fe,De),v.value.count=W.value.size}for(const oe of le){const fe=R(oe),De=oe.getAttribute(o)||"",Ge=new Set("");for(const kt of fe){const ut=kt.getAttribute(s)||"";Ge.add(ut)}L.value.set(De,Ge)}};ke(()=>d.value,j=>{j&&it($)},{deep:!0}),ke(()=>_.value,j=>{be(),it(we)}),b.on("selectItem",j=>{t("select-item",j)});const He=ls(j=>{j&&(Le(),it(we))},100);return b.on("rerenderList",He),Ke(()=>{Le(),we()}),(j,le)=>(p(),I("div",{class:de(e.theme),onKeydown:tt,ref_key:"commandRef",ref:M,"command-theme":e.theme},[w("div",$d,[S(j.$slots,"default")])],42,Pd))}}),jt=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},dr=jt(Fd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Dd={"command-dialog":""},Vd={"command-dialog-mask":""},xd={"command-dialog-wrapper":""},Ud={"command-dialog-header":""},Hd={"command-dialog-body":""},Bd={key:0,"command-dialog-footer":""},Wd=x({name:"Command.Dialog"}),jd=x({...Wd,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(e,{emit:t}){const n=e,{search:r,filtered:s}=Wt(),{emitter:a}=Dn(),o=z();a.on("selectItem",l=>{t("select-item",l)});const i=()=>{r.value="",s.value.count=0,s.value.items=new Map,s.value.groups=new Set};return cs(()=>n.visible,i),Rn(i),(l,c)=>(p(),X(No,{to:"body",ref_key:"dialogRef",ref:o},[Y(An,{name:"command-dialog",appear:""},{default:A(()=>[e.visible?(p(),X(dr,{key:0,theme:e.theme},{default:A(()=>[w("div",Dd,[w("div",Vd,[w("div",xd,[w("div",Ud,[S(l.$slots,"header")]),w("div",Hd,[S(l.$slots,"body")]),l.$slots.footer?(p(),I("div",Bd,[S(l.$slots,"footer")])):G("v-if",!0)])])])]),_:3},8,["theme"])):G("v-if",!0)]),_:3})],512))}}),Kd=jt(jd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let ys=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((t,n)=>(n&=63,n<36?t+=n.toString(36):n<62?t+=(n-26).toString(36).toUpperCase():n>62?t+="-":t+="_",t),"");const Gd=["command-group-key","data-value"],Yd={key:0,"command-group-heading":""},zd={"command-group-items":"",role:"group"},Xd=x({name:"Command.Group"}),qd=x({...Xd,props:{heading:{type:String,required:!0}},setup(e){const t=U(()=>`command-group-${ys()}`),{filtered:n,isSearching:r}=Wt(),s=U(()=>r.value?n.value.groups.has(t.value):!0);return(a,o)=>yn((p(),I("div",{"command-group":"",role:"presentation",key:g(t),"command-group-key":g(t),"data-value":e.heading},[e.heading?(p(),I("div",Yd,re(e.heading),1)):G("v-if",!0),w("div",zd,[S(a.$slots,"default")])],8,Gd)),[[kn,g(s)]])}}),Jd=jt(qd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),Qd=["placeholder","value"],Zd=x({name:"Command.Input"}),eh=x({...Zd,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(e,{emit:t}){const n=z(null),{search:r}=Wt(),s=U(()=>r.value),a=o=>{const i=o,l=o.target;r.value=l==null?void 0:l.value,t("input",i),t("update:value",r.value)};return gt(()=>{var o;(o=n.value)==null||o.focus()}),(o,i)=>(p(),I("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:e.placeholder,value:g(s),onInput:a},null,40,Qd))}}),th=jt(eh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),nh=["aria-selected","aria-disabled","command-item-key"],rh=x({name:"Command.Item"}),ah=x({...rh,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(e,{emit:t}){const n=e,r="command-item-select",s="data-value",{current:a}=Du(),{selectedNode:o,filtered:i,isSearching:l}=Wt(),{emitter:c}=Dn(),u=z(),h=U(()=>`command-item-${ys()}`),d=U(()=>{const v=i.value.items.get(h.value);return l.value?v!==void 0:!0}),_=U(()=>Array.from(a)),E=()=>{var v;const b={key:h.value,value:((v=u.value)==null?void 0:v.getAttribute(s))||""};t("select",b),c.emit("selectItem",b)};return cs(_,v=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(b=>a.has(b.toLowerCase()))&&n.perform&&n.perform()}),gt(()=>{var v;(v=u.value)==null||v.addEventListener(r,E)}),Rn(()=>{var v;(v=u.value)==null||v.removeEventListener(r,E)}),(v,b)=>yn((p(),I("div",{ref_key:"itemRef",ref:u,"command-item":"",role:"option","aria-selected":g(o)===g(h),"aria-disabled":!g(d),key:g(h),"command-item-key":g(h),onClick:E},[S(v.$slots,"default")],8,nh)),[[kn,g(d)]])}}),sh=jt(ah,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),oh=x({name:"Command.List"}),ih=x({...oh,setup(e){const{emitter:t}=Dn(),n=z(),r=z();let s=null,a;return gt(()=>{a=r.value;const o=n.value;a&&o&&(s=new ResizeObserver(i=>{it(()=>{const l=a==null?void 0:a.offsetHeight;o==null||o.style.setProperty("--command-list-height",`${l==null?void 0:l.toFixed(1)}px`),t.emit("rerenderList",!0)})}),s.observe(a))}),Rn(()=>{s!==null&&a&&s.unobserve(a)}),(o,i)=>(p(),I("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[w("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[S(o.$slots,"default")],512)],512))}}),lh=jt(ih,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ch=x({name:"Command.Empty",setup(e,{attrs:t,slots:n}){const{filtered:r}=Wt(),s=U(()=>r.value.count===0);return()=>s.value?Dt("div",{"command-empty":"",role:"presentation",...t},n):Dt("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...t})}}),uh=x({name:"Command.Loading",setup(e,{attrs:t,slots:n}){return()=>Dt("div",{"command-loading":"",role:"progressbar",...t},n)}}),dh=x({name:"Command.Separator",setup(e,{attrs:t,slots:n}){return()=>Dt("div",{"command-separator":"",role:"separator",...t})}}),Tt=Object.assign(dr,{Dialog:Kd,Empty:ch,Group:Jd,Input:th,Item:sh,List:lh,Loading:uh,Separator:dh,Root:dr});var Qr;const ks=typeof window<"u",hh=e=>typeof e=="string",ws=()=>{};ks&&((Qr=window==null?void 0:window.navigator)!=null&&Qr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function Ls(e){return typeof e=="function"?e():g(e)}function fh(e){return e}function mh(e){return Ja()?(Qa(e),!0):!1}function ph(e,t=!0){Vt()?Ke(e):t?e():it(e)}function gh(e){var t;const n=Ls(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Mr=ks?window:void 0;function $t(...e){let t,n,r,s;if(hh(e[0])||Array.isArray(e[0])?([n,r,s]=e,t=Mr):[t,n,r,s]=e,!t)return ws;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const a=[],o=()=>{a.forEach(u=>u()),a.length=0},i=(u,h,d,_)=>(u.addEventListener(h,d,_),()=>u.removeEventListener(h,d,_)),l=ke(()=>[gh(t),Ls(s)],([u,h])=>{o(),u&&a.push(...n.flatMap(d=>r.map(_=>i(u,d,_,h))))},{immediate:!0,flush:"post"}),c=()=>{l(),o()};return mh(c),c}const Zr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},ea="__vueuse_ssr_handlers__";Zr[ea]=Zr[ea]||{};const _h={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function vh(e={}){const{reactive:t=!1,target:n=Mr,aliasMap:r=_h,passive:s=!0,onEventFired:a=ws}=e,o=tn(new Set),i={toJSON(){return{}},current:o},l=t?tn(i):i,c=new Set,u=new Set;function h(v,b){v in l&&(t?l[v]=b:l[v].value=b)}function d(){o.clear();for(const v of u)h(v,!1)}function _(v,b){var M,W;const y=(M=v.key)==null?void 0:M.toLowerCase(),T=[(W=v.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?o.add(y):o.delete(y));for(const C of T)u.add(C),h(C,b);y==="meta"&&!b?(c.forEach(C=>{o.delete(C),h(C,!1)}),c.clear()):typeof v.getModifierState=="function"&&v.getModifierState("Meta")&&b&&[...o,...T].forEach(C=>c.add(C))}$t(n,"keydown",v=>(_(v,!0),a(v)),{passive:s}),$t(n,"keyup",v=>(_(v,!1),a(v)),{passive:s}),$t("blur",d,{passive:!0}),$t("focus",d,{passive:!0});const E=new Proxy(l,{get(v,b,M){if(typeof b!="string")return Reflect.get(v,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(v,b,M);return t?g(W):W}});return E}var ta;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(ta||(ta={}));var bh=Object.defineProperty,na=Object.getOwnPropertySymbols,yh=Object.prototype.hasOwnProperty,kh=Object.prototype.propertyIsEnumerable,ra=(e,t,n)=>t in e?bh(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,wh=(e,t)=>{for(var n in t||(t={}))yh.call(t,n)&&ra(e,n,t[n]);if(na)for(var n of na(t))kh.call(t,n)&&ra(e,n,t[n]);return e};const Lh={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};wh({linear:fh},Lh);function Eh(e={}){const{window:t=Mr,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:s=!0,includeScrollbar:a=!0}=e,o=z(n),i=z(r),l=()=>{t&&(a?(o.value=t.innerWidth,i.value=t.innerHeight):(o.value=t.document.documentElement.clientWidth,i.value=t.document.documentElement.clientHeight))};return l(),ph(l),$t("resize",l,{passive:!0}),s&&$t("orientationchange",l,{passive:!0}),{width:o,height:i}}const zn=z([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

Development scheme based on \`Web Components\`

## Feature

1. **Cross-Framework Compatibility**: Works seamlessly with React, Vue, Preact, SolidJS, Svelte, and more. Integrates with any JavaScript project following W3C standards.
2. **Pure Native Experience**: No need for npm, React/Vue, or build tools. Easy to start, like using native div tags, simplifying structure and reducing learning costs.
3. **Modular Design**: Breaks systems into small, reusable components for enhanced maintainability and scalability.
4. **Open-Source**: Licensed under MIT, providing free access to all source code for personal or commercial use.
5. **Interactive Documentation**: Offers detailed, interactive documentation with live examples for efficient learning.
6. **Type-Checking**: Built on TypeScript with full type support, ensuring robust and maintainable code.
7. **Stability and Durability**: Provides exceptional stability, avoiding disruptive updates and ensuring continuous project operation.

## Situation

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
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

## Import

Support for on-demand import

\`\`\`js
import 'ranui/button';
\`\`\`

If there is a style problem, you can import the style manually

\`\`\`js
import 'ranui/style';
\`\`\`

If there is a type problem, you can manually import the type

\`\`\`ts
import 'ranui/types';
\`\`\`

Or

\`\`\`ts
import 'ranui/dist/typings';
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

 <r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>

- \`Loading\`

<r-loading name="circle-fold"></r-loading>

- \`math\`

<r-math latex="x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}"></r-math>

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
    console.log('e`,title:"ranui",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-07-15 07:48:23"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-07-15 07:48:23"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-07-15 07:48:23"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-07-15 07:48:23"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/visual.html",meta:{description:"",title:"",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

基于 \`Web Components\`开发方案

## 特点

1. **跨框架兼容：** 与 React, Vue, Preact, SolidJS, Svelte 等兼容。可以和遵循 W3C 标准的任何 JavaScript 项目集成。
2. **原生体验：** 易于入门，像使用本地 div 标签，简化项目大小和减少学习成本。
3. **模块化设计：** 可选导入和全量导入，以增强可维护性和可伸缩性。
4. **交互式丰富文档：** 提供详细的交互式文档，并附有有效的示例子。
5. **支持类型校验：** 基于 TypeScript 构建，具有类型支持，确保代码的健壮性和可维护性。
6. **持久和稳定：** 与框架 (React/vue) 无关，避免破坏性的更新，并确保持续的项目运行。

## 安装

使用 npm:

\`\`\`console
npm install ranui --save
\`\`\`

## 引入方式

支持按需导入，以显著减少包体积大小

\`\`\`js
import 'ranui/button';
\`\`\`

如果遇到样式问题，可以选择手动导入样式文件

\`\`\`js
import 'ranui/style';
\`\`\`

如果遇到类型问题，可以选择手动导入类型文件

\`\`\`ts
import 'ranui/types';
\`\`\`

或者

\`\`\`ts
import 'ranui/dist/typings';
\`\`\`

也支持全量导入

\`\`\`ts
import 'ranui';
\`\`\`

- ES module

\`\`\`js
import 'ranui';
\`\`\`

或者

\`\`\`js
import 'ranui/button';
\`\`\`

- UMD, IIFE, CJS

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>
\`\`\`

## 使用方式

它是基于\`Web Components\`的组件，你可以不用关注框架就可以使用它。

在大多数情况下，您可以像使用本地 \`div\` 标签一样使用它

下面是一些例子：

- html
- js
- jsx
- vue
- tsx

### html

\`\`\`html
<script src="./ranui/dist/umd/index.umd.cjs"><\/script>

<body>
  <r-button>Button</r-button>
</body>
\`\`\`

### js

\`\`\`js
import 'ranui';

const Button = document.createElement('r-button');
Button.appendChild('this is button text');
document.body.appendChild(Button);
\`\`\`

### jsx

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

### vue

\`\`\`vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
<\/script>
\`\`\`

### tsx

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

 <r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>

- \`Loading\`

<r-loading name="circle-fold"></r-loading>

- \`math\`

<r-math latex="x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}"></r-math>

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
    console.log('e`,title:"ranui",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/math/",meta:{description:"",title:"math",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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
| `,title:"r-player",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-07-15 07:48:23"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/math/",meta:{description:"",title:"math数学公式",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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
| `,title:"r-player视频播放器",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-07-15 07:48:23"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-07-15 07:48:23"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-07-15 07:48:23"}}]),Sh={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Oh(e,t="yyyy-MM-dd hh:mm:ss"){e instanceof Date||(e=new Date(e));const n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,`${e.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in n)new RegExp(`(${r})`).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length===1?n[r]:`00${n[r]}`.substr(`${n[r]}`.length)));return t}const Ih={},Ch={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Ah=Po('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Th=[Ah];function Nh(e,t){return p(),I("svg",Ch,Th)}const Mh=J(Ih,[["render",Nh]]),Pr=e=>(Te("data-v-e93b2392"),e=e(),Ne(),e),Ph={class:"blog-search","data-pagefind-ignore":"all"},$h=Pr(()=>w("span",null,[w("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[w("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),Rh={class:"search-dialog"},Fh={class:"link"},Dh={class:"title"},Vh={key:0,class:"date"},xh=["innerHTML"],Uh={class:"command-palette-logo"},Hh={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Bh=Pr(()=>w("span",{class:"command-palette-Label"},"Search by",-1)),Wh=Pr(()=>w("ul",{class:"command-palette-commands"},[w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),w("span",{class:"command-palette-Label"},"to select")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),w("span",{class:"command-palette-Label"},"to navigate")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),w("span",{class:"command-palette-Label"},"to close")])],-1)),jh=x({__name:"Search",setup(e){$o(V=>({"5b3346c5":c.value}));const t=z([]),n=Sh,{localeIndex:r,site:s}=bn(),a=U(()=>{var V;return{...n,...((V=n==null?void 0:n.locales)==null?void 0:V[r.value])||{}}}),o=U(()=>{var V;return((V=a.value)==null?void 0:V.showDate)??!0}),i=Eh(),l=U(()=>i.width.value<760),c=U(()=>l.value?0:1),u=U(()=>{var V;return(V=a.value)!=null&&V.heading?a.value.heading.replace(/\{\{searchResult\}\}/,t.value.length):`Total: ${t.value.length} search results.`}),h=z("");Ke(()=>{h.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const d=z(!1),_=z(""),E=vh({passive:!1,onEventFired(V){V.ctrlKey&&V.key==="k"&&V.type==="keydown"&&V.preventDefault()}}),v=E["Meta+K"],b=E["Ctrl+K"],M=E.Escape;ke(v,V=>{V&&(d.value=!0)}),ke(b,V=>{V&&(d.value=!0)}),ke(M,V=>{V&&(d.value=!1)});function W(){if(!_.value){t.value=[];return}t.value=zn.value.filter(V=>`${V.meta.description}${V.meta.title}`.includes(_.value)).map(V=>{var ie,Ee;return{...V,meta:{...V.meta,description:((Ee=(ie=V.meta)==null?void 0:ie.description)==null?void 0:Ee.replace(new RegExp(`(${_.value})`,"g"),"<mark>$1</mark>"))||""}}}),t.value.sort((V,ie)=>+new Date(ie.meta.date)-+new Date(V.meta.date))}const y=U(()=>{var V;return((V=a.value)==null?void 0:V.resultOptimization)??!0});ke(()=>_.value,async()=>{var V,ie,Ee;if(!((V=window==null?void 0:window.__pagefind__)!=null&&V.search))W();else{const Oe=typeof a.value.customSearchQuery=="function"?a.value.customSearchQuery(_.value):_.value;await((Ee=(ie=window==null?void 0:window.__pagefind__)==null?void 0:ie.search)==null?void 0:Ee.call(ie,Oe).then(async ve=>{const tt=(await Promise.all(ve.results.map(be=>be.data()))).map(be=>{var Le;return{route:be.url.startsWith(s.value.base)?be.url:Tn(be.url),meta:{title:be.meta.title,description:be.excerpt,date:(Le=be==null?void 0:be.meta)==null?void 0:Le.date}}}).map(be=>{const Le=zn.value.find(He=>He.route===be.route);return{...be,meta:{...be.meta,...Le==null?void 0:Le.meta}}}).filter(be=>!y.value||zn.value.some(Le=>Le.route===be.route));t.value=tt.filter(a.value.filter??(()=>!0))}))}it(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(Oe=>{Oe.setAttribute("aria-disabled","false")})})});function L(V){V.target===V.currentTarget&&(d.value=!1)}ke(()=>d.value,V=>{var ie;V?it(()=>{var Ee;(Ee=document.querySelector("div[command-dialog-mask]"))==null||Ee.addEventListener("click",L)}):(ie=document.querySelector("div[command-dialog-mask]"))==null||ie.removeEventListener("click",L)});const T=z(999),C=z(0),$=U(()=>{const ie=C.value%Math.ceil(t.value.length/T.value)*T.value;return t.value.slice(ie,ie+T.value)}),D=Ro(),R=an();function he(V){d.value=!1,R.path!==V.value&&D.go(V.value)}const{lang:we}=bn(),Z=U(()=>a.value.langReload??!0);return ke(()=>we.value,()=>{Z.value&&window.location.reload()}),(V,ie)=>{var Oe;const Ee=_t("ClientOnly");return p(),I("div",Ph,[w("div",{class:"nav-search-btn-wait",onClick:ie[0]||(ie[0]=ve=>d.value=!0)},[$h,yn(w("span",{class:"search-tip"},re(((Oe=a.value)==null?void 0:Oe.btnPlaceholder)||"Search"),513),[[kn,!l.value]]),yn(w("span",{class:"metaKey"},re(h.value)+" K ",513),[[kn,!l.value]])]),Y(Ee,null,{default:A(()=>[Y(g(Tt).Dialog,{visible:d.value,theme:"algolia"},Fo({header:A(()=>{var ve;return[Y(g(Tt).Input,{value:_.value,"onUpdate:value":ie[1]||(ie[1]=Ue=>_.value=Ue),placeholder:((ve=a.value)==null?void 0:ve.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:A(()=>[w("div",Rh,[Y(g(Tt).List,null,{default:A(()=>[t.value.length?(p(),X(g(Tt).Group,{key:1,heading:u.value},{default:A(()=>[(p(!0),I(ge,null,$e($.value,ve=>(p(),X(g(Tt).Item,{key:ve.route,"data-value":ve.route,onSelect:he},{default:A(()=>[w("div",Fh,[w("div",Dh,[w("span",null,re(ve.meta.title),1),o.value&&ve.meta.date?(p(),I("span",Vh,re(g(Oh)(ve.meta.date,"yyyy-MM-dd")),1)):G("",!0)]),w("div",{class:"des",innerHTML:ve.meta.description},null,8,xh)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(p(),X(g(Tt).Empty,{key:0},{default:A(()=>{var ve;return[Ze(re(((ve=a.value)==null?void 0:ve.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[t.value.length?{name:"footer",fn:A(()=>[w("div",Uh,[w("a",Hh,[Bh,Y(Mh,{style:{width:"77px"}})])]),Wh]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),Kh=J(jh,[["__scopeId","data-v-e93b2392"]]),Gh=x({__name:"VPNavBarSocialLinks",setup(e){const{theme:t}=se();return(n,r)=>g(t).socialLinks?(p(),X(Tr,{key:0,class:"VPNavBarSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),Yh=J(Gh,[["__scopeId","data-v-24169980"]]),zh=["href","rel","target"],Xh={key:1},qh={key:2},Jh=x({__name:"VPNavBarTitle",setup(e){const{site:t,theme:n}=se(),{hasSidebar:r}=ct(),{currentLang:s}=sn(),a=U(()=>{var l;return typeof n.value.logoLink=="string"?n.value.logoLink:(l=n.value.logoLink)==null?void 0:l.link}),o=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.rel}),i=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.target});return(l,c)=>(p(),I("div",{class:de(["VPNavBarTitle",{"has-sidebar":g(r)}])},[w("a",{class:"title",href:a.value??g(Sr)(g(s).link),rel:o.value,target:i.value},[S(l.$slots,"nav-bar-title-before",{},void 0,!0),g(n).logo?(p(),X(Ln,{key:0,class:"logo",image:g(n).logo},null,8,["image"])):G("",!0),g(n).siteTitle?(p(),I("span",Xh,re(g(n).siteTitle),1)):g(n).siteTitle===void 0?(p(),I("span",qh,re(g(t).title),1)):G("",!0),S(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,zh)],2))}}),Qh=J(Jh,[["__scopeId","data-v-538a7fdb"]]),Zh={class:"items"},ef={class:"title"},tf=x({__name:"VPNavBarTranslations",setup(e){const{theme:t}=se(),{localeLinks:n,currentLang:r}=sn({correspondingLink:!0});return(s,a)=>g(n).length&&g(r).label?(p(),X(Ar,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:g(t).langMenuLabel||"Change language"},{default:A(()=>[w("div",Zh,[w("p",ef,re(g(r).label),1),(p(!0),I(ge,null,$e(g(n),o=>(p(),X(Fn,{key:o.link,item:o},null,8,["item"]))),128))])]),_:1},8,["label"])):G("",!0)}}),nf=J(tf,[["__scopeId","data-v-7dc9fd39"]]),rf=e=>(Te("data-v-0df9086f"),e=e(),Ne(),e),af={class:"wrapper"},sf={class:"container"},of={class:"title"},lf={class:"content"},cf={class:"content-body"},uf=rf(()=>w("div",{class:"divider"},[w("div",{class:"divider-line"})],-1)),df=x({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const t=e,{y:n}=qa(),{hasSidebar:r}=ct(),{frontmatter:s}=se(),a=z({});return Lr(()=>{a.value={"has-sidebar":r.value,home:s.value.layout==="home",top:n.value===0,"screen-open":t.isScreenOpen}}),(o,i)=>(p(),I("div",{class:de(["VPNavBar",a.value])},[w("div",af,[w("div",sf,[w("div",of,[Y(Qh,null,{"nav-bar-title-before":A(()=>[S(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(o.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),w("div",lf,[w("div",cf,[S(o.$slots,"nav-bar-content-before",{},void 0,!0),Y(Kh,{class:"search"}),Y(Au,{class:"menu"}),Y(nf,{class:"translations"}),Y(Mc,{class:"appearance"}),Y(Yh,{class:"social-links"}),Y(mu,{class:"extra"}),S(o.$slots,"nav-bar-content-after",{},void 0,!0),Y(yu,{class:"hamburger",active:o.isScreenOpen,onClick:i[0]||(i[0]=l=>o.$emit("toggle-screen"))},null,8,["active"])])])])]),uf],2))}}),hf=J(df,[["__scopeId","data-v-0df9086f"]]),ff={key:0,class:"VPNavScreenAppearance"},mf={class:"text"},pf=x({__name:"VPNavScreenAppearance",setup(e){const{site:t,theme:n}=se();return(r,s)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(p(),I("div",ff,[w("p",mf,re(g(n).darkModeSwitchLabel||"Appearance"),1),Y(Ir)])):G("",!0)}}),gf=J(pf,[["__scopeId","data-v-4ca77a4d"]]),_f=x({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const t=Bt("close-screen");return(n,r)=>(p(),X(qe,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t),innerHTML:n.item.text},null,8,["href","target","rel","onClick","innerHTML"]))}}),vf=J(_f,[["__scopeId","data-v-4fc9d3ab"]]),bf=x({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const t=Bt("close-screen");return(n,r)=>(p(),X(qe,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t)},{default:A(()=>[Ze(re(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Es=J(bf,[["__scopeId","data-v-e1d9c7ab"]]),yf={class:"VPNavScreenMenuGroupSection"},kf={key:0,class:"title"},wf=x({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",yf,[t.text?(p(),I("p",kf,re(t.text),1)):G("",!0),(p(!0),I(ge,null,$e(t.items,r=>(p(),X(Es,{key:r.text,item:r},null,8,["item"]))),128))]))}}),Lf=J(wf,[["__scopeId","data-v-d2376a26"]]),Ef=e=>(Te("data-v-1936178f"),e=e(),Ne(),e),Sf=["aria-controls","aria-expanded"],Of=["innerHTML"],If=Ef(()=>w("span",{class:"vpi-plus button-icon"},null,-1)),Cf=["id"],Af={key:0,class:"item"},Tf={key:1,class:"item"},Nf={key:2,class:"group"},Mf=x({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const t=e,n=z(!1),r=U(()=>`NavScreenGroup-${t.text.replace(" ","-").toLowerCase()}`);function s(){n.value=!n.value}return(a,o)=>(p(),I("div",{class:de(["VPNavScreenMenuGroup",{open:n.value}])},[w("button",{class:"button","aria-controls":r.value,"aria-expanded":n.value,onClick:s},[w("span",{class:"button-text",innerHTML:a.text},null,8,Of),If],8,Sf),w("div",{id:r.value,class:"items"},[(p(!0),I(ge,null,$e(a.items,i=>(p(),I(ge,{key:JSON.stringify(i)},["link"in i?(p(),I("div",Af,[Y(Es,{item:i},null,8,["item"])])):"component"in i?(p(),I("div",Tf,[(p(),X(Xe(i.component),ft({ref_for:!0},i.props,{"screen-menu":""}),null,16))])):(p(),I("div",Nf,[Y(Lf,{text:i.text,items:i.items},null,8,["text","items"])]))],64))),128))],8,Cf)],2))}}),Pf=J(Mf,[["__scopeId","data-v-1936178f"]]),$f={key:0,class:"VPNavScreenMenu"},Rf=x({__name:"VPNavScreenMenu",setup(e){const{theme:t}=se();return(n,r)=>g(t).nav?(p(),I("nav",$f,[(p(!0),I(ge,null,$e(g(t).nav,s=>(p(),I(ge,{key:JSON.stringify(s)},["link"in s?(p(),X(vf,{key:0,item:s},null,8,["item"])):"component"in s?(p(),X(Xe(s.component),ft({key:1,ref_for:!0},s.props,{"screen-menu":""}),null,16)):(p(),X(Pf,{key:2,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):G("",!0)}}),Ff=x({__name:"VPNavScreenSocialLinks",setup(e){const{theme:t}=se();return(n,r)=>g(t).socialLinks?(p(),X(Tr,{key:0,class:"VPNavScreenSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),Ss=e=>(Te("data-v-5becddcf"),e=e(),Ne(),e),Df=Ss(()=>w("span",{class:"vpi-languages icon lang"},null,-1)),Vf=Ss(()=>w("span",{class:"vpi-chevron-down icon chevron"},null,-1)),xf={class:"list"},Uf=x({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:t,currentLang:n}=sn({correspondingLink:!0}),r=z(!1);function s(){r.value=!r.value}return(a,o)=>g(t).length&&g(n).label?(p(),I("div",{key:0,class:de(["VPNavScreenTranslations",{open:r.value}])},[w("button",{class:"title",onClick:s},[Df,Ze(" "+re(g(n).label)+" ",1),Vf]),w("ul",xf,[(p(!0),I(ge,null,$e(g(t),i=>(p(),I("li",{key:i.link,class:"item"},[Y(qe,{class:"link",href:i.link},{default:A(()=>[Ze(re(i.text),1)]),_:2},1032,["href"])]))),128))])],2)):G("",!0)}}),Hf=J(Uf,[["__scopeId","data-v-5becddcf"]]),Bf={class:"container"},Wf=x({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const t=z(null),n=Za($n?document.body:null);return(r,s)=>(p(),X(An,{name:"fade",onEnter:s[0]||(s[0]=a=>n.value=!0),onAfterLeave:s[1]||(s[1]=a=>n.value=!1)},{default:A(()=>[r.open?(p(),I("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:t,id:"VPNavScreen"},[w("div",Bf,[S(r.$slots,"nav-screen-content-before",{},void 0,!0),Y(Rf,{class:"menu"}),Y(Hf,{class:"translations"}),Y(gf,{class:"appearance"}),Y(Ff,{class:"social-links"}),S(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):G("",!0)]),_:3}))}}),jf=J(Wf,[["__scopeId","data-v-902aa58f"]]),Kf={key:0,class:"VPNav"},Gf=x({__name:"VPNav",setup(e){const{isScreenOpen:t,closeScreen:n,toggleScreen:r}=yc(),{frontmatter:s}=se(),a=U(()=>s.value.navbar!==!1);return Er("close-screen",n),gt(()=>{$n&&document.documentElement.classList.toggle("hide-nav",!a.value)}),(o,i)=>a.value?(p(),I("header",Kf,[Y(hf,{"is-screen-open":g(t),onToggleScreen:g(r)},{"nav-bar-title-before":A(()=>[S(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(o.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),Y(jf,{open:g(t)},{"nav-screen-content-before":A(()=>[S(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):G("",!0)}}),Yf=J(Gf,[["__scopeId","data-v-50c1c551"]]),Os=e=>(Te("data-v-102945ae"),e=e(),Ne(),e),zf=["role","tabindex"],Xf=Os(()=>w("div",{class:"indicator"},null,-1)),qf=Os(()=>w("span",{class:"vpi-chevron-right caret-icon"},null,-1)),Jf=[qf],Qf={key:1,class:"items"},Zf=x({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const t=e,{collapsed:n,collapsible:r,isLink:s,isActiveLink:a,hasActiveLink:o,hasChildren:i,toggle:l}=di(U(()=>t.item)),c=U(()=>i.value?"section":"div"),u=U(()=>s.value?"a":"div"),h=U(()=>i.value?t.depth+2===7?"p":`h${t.depth+2}`:"p"),d=U(()=>s.value?void 0:"button"),_=U(()=>[[`level-${t.depth}`],{collapsible:r.value},{collapsed:n.value},{"is-link":s.value},{"is-active":a.value},{"has-active":o.value}]);function E(b){"key"in b&&b.key!=="Enter"||!t.item.link&&l()}function v(){t.item.link&&l()}return(b,M)=>{const W=_t("VPSidebarItem",!0);return p(),X(Xe(c.value),{class:de(["VPSidebarItem",_.value])},{default:A(()=>[b.item.text?(p(),I("div",ft({key:0,class:"item",role:d.value},Do(b.item.items?{click:E,keydown:E}:{},!0),{tabindex:b.item.items&&0}),[Xf,b.item.link?(p(),X(qe,{key:0,tag:u.value,class:"link",href:b.item.link,rel:b.item.rel,target:b.item.target},{default:A(()=>[(p(),X(Xe(h.value),{class:"text",innerHTML:b.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(p(),X(Xe(h.value),{key:1,class:"text",innerHTML:b.item.text},null,8,["innerHTML"])),b.item.collapsed!=null&&b.item.items&&b.item.items.length?(p(),I("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:v,onKeydown:Vo(v,["enter"]),tabindex:"0"},Jf,32)):G("",!0)],16,zf)):G("",!0),b.item.items&&b.item.items.length?(p(),I("div",Qf,[b.depth<5?(p(!0),I(ge,{key:0},$e(b.item.items,y=>(p(),X(W,{key:y.text,item:y,depth:b.depth+1},null,8,["item","depth"]))),128)):G("",!0)])):G("",!0)]),_:1},8,["class"])}}}),em=J(Zf,[["__scopeId","data-v-102945ae"]]),tm=x({__name:"VPSidebarGroup",props:{items:{}},setup(e){const t=z(!0);let n=null;return Ke(()=>{n=setTimeout(()=>{n=null,t.value=!1},300)}),Rn(()=>{n!=null&&(clearTimeout(n),n=null)}),(r,s)=>(p(!0),I(ge,null,$e(r.items,a=>(p(),I("div",{key:a.text,class:de(["group",{"no-transition":t.value}])},[Y(em,{item:a,depth:0},null,8,["item"])],2))),128))}}),nm=J(tm,[["__scopeId","data-v-5e1efc68"]]),Is=e=>(Te("data-v-9a89f506"),e=e(),Ne(),e),rm=Is(()=>w("div",{class:"curtain"},null,-1)),am={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},sm=Is(()=>w("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),om=x({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:t,hasSidebar:n}=ct(),r=e,s=z(null),a=Za($n?document.body:null);ke([r,s],()=>{var i;r.open?(a.value=!0,(i=s.value)==null||i.focus()):a.value=!1},{immediate:!0,flush:"post"});const o=z(0);return ke(t,()=>{o.value+=1},{deep:!0}),(i,l)=>g(n)?(p(),I("aside",{key:0,class:de(["VPSidebar",{open:i.open}]),ref_key:"navEl",ref:s,onClick:l[0]||(l[0]=xo(()=>{},["stop"]))},[rm,w("nav",am,[sm,S(i.$slots,"sidebar-nav-before",{},void 0,!0),(p(),X(nm,{items:g(t),key:o.value},null,8,["items"])),S(i.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):G("",!0)}}),im=J(om,[["__scopeId","data-v-9a89f506"]]),lm=x({__name:"VPSkipLink",setup(e){const t=an(),n=z();ke(()=>t.path,()=>n.value.focus());function r({target:s}){const a=document.getElementById(decodeURIComponent(s.hash).slice(1));if(a){const o=()=>{a.removeAttribute("tabindex"),a.removeEventListener("blur",o)};a.setAttribute("tabindex","-1"),a.addEventListener("blur",o),a.focus(),window.scrollTo(0,0)}}return(s,a)=>(p(),I(ge,null,[w("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),w("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),cm=J(lm,[["__scopeId","data-v-a37366e1"]]),um=x({__name:"Layout",setup(e){const{isOpen:t,open:n,close:r}=ct(),s=an();ke(()=>s.path,r),ui(t,r);const{frontmatter:a}=se(),o=Uo(),i=U(()=>!!o["home-hero-image"]);return Er("hero-image-slot-exists",i),(l,c)=>{const u=_t("Content");return g(a).layout!==!1?(p(),I("div",{key:0,class:de(["Layout",g(a).pageClass])},[S(l.$slots,"layout-top",{},void 0,!0),Y(cm),Y(Xo,{class:"backdrop",show:g(t),onClick:g(r)},null,8,["show","onClick"]),Y(Yf,null,{"nav-bar-title-before":A(()=>[S(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":A(()=>[S(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),Y(bc,{open:g(t),onOpenMenu:g(n)},null,8,["open","onOpenMenu"]),Y(im,{open:g(t)},{"sidebar-nav-before":A(()=>[S(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":A(()=>[S(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),Y(Zl,{"data-pagefind-body":""},{"page-top":A(()=>[S(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":A(()=>[S(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":A(()=>[S(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":A(()=>[S(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":A(()=>[S(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":A(()=>[S(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),Y(ac),S(l.$slots,"layout-bottom",{},void 0,!0)],2)):(p(),X(u,{key:1}))}}}),dm=J(um,[["__scopeId","data-v-a10adc86"]]),Cs={Layout:dm,enhanceApp:({app:e})=>{e.component("Badge",Go)}};var hm=Object.defineProperty,fm=(e,t,n)=>t in e?hm(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,B=(e,t,n)=>fm(e,typeof t!="symbol"?t+"":t,n),As=(e=>(e.IPAD="ipad",e.ANDROID="android",e.IPhONE="iphone",e.PC="pc",e))(As||{});const Ts=()=>{if(typeof window<"u"){const e=navigator.userAgent.toLowerCase();return/ipad|ipod/.test(e)?"ipad":/android/.test(e)?"android":/iphone/.test(e)?"iphone":"pc"}return"pc"},on=typeof window<"u",mm=()=>on?window.navigator.userAgent.toLowerCase().includes("micromessenger"):!1,pm=()=>{if(!on)return!1;const e=window.navigator.userAgent;return!!/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(e)},gm=()=>{if(!on)return!1;const e=/iphone/i.test(window.navigator.userAgent),t=window.devicePixelRatio&&window.devicePixelRatio===2,n=window.devicePixelRatio&&window.devicePixelRatio===3,r=window.screen.width===360&&window.screen.height===780,s=window.screen.width===375&&window.screen.height===812,a=window.screen.width===390&&window.screen.height===844,o=window.screen.width===414&&window.screen.height===896,i=window.screen.width===428&&window.screen.height===926;switch(!0){case(e&&n&&r):case(e&&n&&s):case(e&&n&&a):case(e&&t&&o):case(e&&n&&o):case(e&&n&&i):return!0;default:return!1}},Ns="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ms="ARRAYBUFFER not supported by this environment",Ps="UINT8ARRAY not supported by this environment";function _m(e,t,n,r,s){let a,o,i=0,l,c,u,h,d,_;r=r||0;const E=n||[0],v=r>>>3;if(t==="UTF8")for(d=s===-1?3:0,l=0;l<e.length;l+=1)for(a=e.charCodeAt(l),o=[],128>a?o.push(a):2048>a?(o.push(192|a>>>6),o.push(128|a&63)):55296>a||57344<=a?o.push(224|a>>>12,128|a>>>6&63,128|a&63):(l+=1,a=65536+((a&1023)<<10|e.charCodeAt(l)&1023),o.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)),c=0;c<o.length;c+=1){for(h=i+v,u=h>>>2;E.length<=u;)E.push(0);E[u]|=o[c]<<8*(d+s*(h%4)),i+=1}else for(d=s===-1?2:0,_=t==="UTF16LE"&&s!==1||t!=="UTF16LE"&&s===1,l=0;l<e.length;l+=1){for(a=e.charCodeAt(l),_===!0&&(c=a&255,a=c<<8|a>>>8),h=i+v,u=h>>>2;E.length<=u;)E.push(0);E[u]|=a<<8*(d+s*(h%4)),i+=2}return{value:E,binLen:i*8+r}}function vm(e,t,n,r){let s,a,o,i;if(e.length%2!==0)throw new Error("String of HEX type must be in byte increments");n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(s=0;s<e.length;s+=2){if(a=parseInt(e.substr(s,2),16),isNaN(a))throw new Error("String of HEX type contains invalid characters");for(i=(s>>>1)+c,o=i>>>2;l.length<=o;)l.push(0);l[o]|=a<<8*(u+r*(i%4))}return{value:l,binLen:e.length*4+n}}function bm(e,t,n,r){let s,a,o,i;n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(a=0;a<e.length;a+=1)s=e.charCodeAt(a),i=a+c,o=i>>>2,l.length<=o&&l.push(0),l[o]|=s<<8*(u+r*(i%4));return{value:l,binLen:e.length*8+n}}function ym(e,t,n,r){let s=0,a,o,i,l,c,u,h;n=n||0;const d=t||[0],_=n>>>3,E=r===-1?3:0,v=e.indexOf("=");if(e.search(/^[a-z\d=+/]+$/i)===-1)throw new Error("Invalid character in base-64 string");if(e=e.replace(/=/g,""),v!==-1&&v<e.length)throw new Error("Invalid '=' found in base-64 string");for(o=0;o<e.length;o+=4){for(c=e.substr(o,4),l=0,i=0;i<c.length;i+=1)a=Ns.indexOf(c.charAt(i)),l|=a<<18-6*i;for(i=0;i<c.length-1;i+=1){for(h=s+_,u=h>>>2;d.length<=u;)d.push(0);d[u]|=(l>>>16-i*8&255)<<8*(E+r*(h%4)),s+=1}}return{value:d,binLen:s*8+n}}function $s(e,t,n,r){let s,a,o;n=n||0;const i=t||[0],l=n>>>3,c=r===-1?3:0;for(s=0;s<e.length;s+=1)o=s+l,a=o>>>2,i.length<=a&&i.push(0),i[a]|=e[s]<<8*(c+r*(o%4));return{value:i,binLen:e.length*8+n}}function km(e,t,n,r){return $s(new Uint8Array(e),t,n,r)}function Kt(e,t,n){switch(t){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(e){case"HEX":return function(r,s,a){return vm(r,s,a,n)};case"TEXT":return function(r,s,a){return _m(r,t,s,a,n)};case"B64":return function(r,s,a){return ym(r,s,a,n)};case"BYTES":return function(r,s,a){return bm(r,s,a,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ms)}return function(r,s,a){return km(r,s,a,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Ps)}return function(r,s,a){return $s(r,s,a,n)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function wm(e,t,n,r){const s="0123456789abcdef";let a="",o,i;const l=t/8,c=n===-1?3:0;for(o=0;o<l;o+=1)i=e[o>>>2]>>>8*(c+n*(o%4)),a+=s.charAt(i>>>4&15)+s.charAt(i&15);return r.outputUpper?a.toUpperCase():a}function Lm(e,t,n,r){let s="",a,o,i,l,c;const u=t/8,h=n===-1?3:0;for(a=0;a<u;a+=3)for(l=a+1<u?e[a+1>>>2]:0,c=a+2<u?e[a+2>>>2]:0,i=(e[a>>>2]>>>8*(h+n*(a%4))&255)<<16|(l>>>8*(h+n*((a+1)%4))&255)<<8|c>>>8*(h+n*((a+2)%4))&255,o=0;o<4;o+=1)a*8+o*6<=t?s+=Ns.charAt(i>>>6*(3-o)&63):s+=r.b64Pad;return s}function Em(e,t,n){let r="",s,a;const o=t/8,i=n===-1?3:0;for(s=0;s<o;s+=1)a=e[s>>>2]>>>8*(i+n*(s%4))&255,r+=String.fromCharCode(a);return r}function Sm(e,t,n){let r;const s=t/8,a=new ArrayBuffer(s),o=new Uint8Array(a),i=n===-1?3:0;for(r=0;r<s;r+=1)o[r]=e[r>>>2]>>>8*(i+n*(r%4))&255;return a}function Om(e,t,n){let r;const s=t/8,a=n===-1?3:0,o=new Uint8Array(s);for(r=0;r<s;r+=1)o[r]=e[r>>>2]>>>8*(a+n*(r%4))&255;return o}function aa(e,t,n,r){switch(e){case"HEX":return function(s){return wm(s,t,n,r)};case"B64":return function(s){return Lm(s,t,n,r)};case"BYTES":return function(s){return Em(s,t,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ms)}return function(s){return Sm(s,t,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Ps)}return function(s){return Om(s,t,n)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}const ln=4294967296,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],at=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],st=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],cn="Chosen SHA variant is not supported",Rs="Cannot set numRounds with MAC";function Sn(e,t){let n,r;const s=e.binLen>>>3,a=t.binLen>>>3,o=s<<3,i=4-s<<3;if(s%4!==0){for(n=0;n<a;n+=4)r=s+n>>>2,e.value[r]|=t.value[n>>>2]<<o,e.value.push(0),e.value[r+1]|=t.value[n>>>2]>>>i;return(e.value.length<<2)-4>=a+s&&e.value.pop(),{value:e.value,binLen:e.binLen+t.binLen}}else return{value:e.value.concat(t.value),binLen:e.binLen+t.binLen}}function sa(e){const t={outputUpper:!1,b64Pad:"=",outputLen:-1},n=e||{},r="Output length must be a multiple of 8";if(t.outputUpper=n.outputUpper||!1,n.b64Pad&&(t.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!==0)throw new Error(r);t.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!==0)throw new Error(r);t.outputLen=n.shakeLen}if(typeof t.outputUpper!="boolean")throw new Error("Invalid outputUpper formatting option");if(typeof t.b64Pad!="string")throw new Error("Invalid b64Pad formatting option");return t}function mt(e,t,n,r){const s=e+" must include a value and format";if(!t){if(!r)throw new Error(s);return r}if(typeof t.value>"u"||!t.format)throw new Error(s);return Kt(t.format,t.encoding||"UTF8",n)(t.value)}class Vn{constructor(t,n,r){B(this,"shaVariant"),B(this,"inputFormat"),B(this,"utfType"),B(this,"numRounds"),B(this,"keyWithIPad"),B(this,"keyWithOPad"),B(this,"remainder"),B(this,"remainderLen"),B(this,"updateCalled"),B(this,"processedLen"),B(this,"macKeySet");const s=r||{};if(this.inputFormat=n,this.utfType=s.encoding||"UTF8",this.numRounds=s.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.shaVariant=t,this.remainder=[],this.remainderLen=0,this.updateCalled=!1,this.processedLen=0,this.macKeySet=!1,this.keyWithIPad=[],this.keyWithOPad=[]}update(t){let n,r=0;const s=this.variantBlockSize>>>5,a=this.converterFunc(t,this.remainder,this.remainderLen),o=a.binLen,i=a.value,l=o>>>5;for(n=0;n<l;n+=s)r+this.variantBlockSize<=o&&(this.intermediateState=this.roundFunc(i.slice(n,n+s),this.intermediateState),r+=this.variantBlockSize);return this.processedLen+=r,this.remainder=i.slice(r>>>5),this.remainderLen=o%this.variantBlockSize,this.updateCalled=!0,this}getHash(t,n){let r,s,a=this.outputBinLen;const o=sa(n);if(this.isVariableLen){if(o.outputLen===-1)throw new Error("Output length must be specified in options");a=o.outputLen}const i=aa(t,a,this.bigEndianMod,o);if(this.macKeySet&&this.getMAC)return i(this.getMAC(o));for(s=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),a),r=1;r<this.numRounds;r+=1)this.isVariableLen&&a%32!==0&&(s[s.length-1]&=16777215>>>24-a%32),s=this.finalizeFunc(s,a,0,this.newStateFunc(this.shaVariant),a);return i(s)}setHMACKey(t,n,r){if(!this.HMACSupported)throw new Error("Variant does not support HMAC");if(this.updateCalled)throw new Error("Cannot set MAC key after calling update");const s=r||{},a=Kt(n,s.encoding||"UTF8",this.bigEndianMod);this._setHMACKey(a(t))}_setHMACKey(t){const n=this.variantBlockSize>>>3,r=n/4-1;let s;if(this.numRounds!==1)throw new Error(Rs);if(this.macKeySet)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.finalizeFunc(t.value,t.binLen,0,this.newStateFunc(this.shaVariant),this.outputBinLen));t.value.length<=r;)t.value.push(0);for(s=0;s<=r;s+=1)this.keyWithIPad[s]=t.value[s]^909522486,this.keyWithOPad[s]=t.value[s]^1549556828;this.intermediateState=this.roundFunc(this.keyWithIPad,this.intermediateState),this.processedLen=this.variantBlockSize,this.macKeySet=!0}getHMAC(t,n){const r=sa(n);return aa(t,this.outputBinLen,this.bigEndianMod,r)(this._getHMAC())}_getHMAC(){let t;if(!this.macKeySet)throw new Error("Cannot call getHMAC without first setting MAC key");const n=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),this.outputBinLen);return t=this.roundFunc(this.keyWithOPad,this.newStateFunc(this.shaVariant)),t=this.finalizeFunc(n,this.outputBinLen,this.variantBlockSize,t,this.outputBinLen),t}}function Nt(e,t){return e<<t|e>>>32-t}function Je(e,t){return e>>>t|e<<32-t}function Fs(e,t){return e>>>t}function oa(e,t,n){return e^t^n}function Ds(e,t,n){return e&t^~e&n}function Vs(e,t,n){return e&t^e&n^t&n}function Im(e){return Je(e,2)^Je(e,13)^Je(e,22)}function Pe(e,t){const n=(e&65535)+(t&65535);return((e>>>16)+(t>>>16)+(n>>>16)&65535)<<16|n&65535}function Cm(e,t,n,r){const s=(e&65535)+(t&65535)+(n&65535)+(r&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)&65535)<<16|s&65535}function en(e,t,n,r,s){const a=(e&65535)+(t&65535)+(n&65535)+(r&65535)+(s&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)+(a>>>16)&65535)<<16|a&65535}function Am(e){return Je(e,17)^Je(e,19)^Fs(e,10)}function Tm(e){return Je(e,7)^Je(e,18)^Fs(e,3)}function Nm(e){return Je(e,6)^Je(e,11)^Je(e,25)}function ia(e){return[1732584193,4023233417,2562383102,271733878,3285377520]}function xs(e,t){let n,r,s,a,o,i,l;const c=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],l=0;l<80;l+=1)l<16?c[l]=e[l]:c[l]=Nt(c[l-3]^c[l-8]^c[l-14]^c[l-16],1),l<20?i=en(Nt(n,5),Ds(r,s,a),o,1518500249,c[l]):l<40?i=en(Nt(n,5),oa(r,s,a),o,1859775393,c[l]):l<60?i=en(Nt(n,5),Vs(r,s,a),o,2400959708,c[l]):i=en(Nt(n,5),oa(r,s,a),o,3395469782,c[l]),o=a,a=s,s=Nt(r,30),r=n,n=i;return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(s,t[2]),t[3]=Pe(a,t[3]),t[4]=Pe(o,t[4]),t}function Mm(e,t,n,r){let s;const a=(t+65>>>9<<4)+15,o=t+n;for(;e.length<=a;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[a]=o&4294967295,e[a-1]=o/ln|0,s=0;s<e.length;s+=16)r=xs(e.slice(s,s+16),r);return r}let Pm=class extends Vn{constructor(t,n,r){if(t!=="SHA-1")throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.HMACSupported=!0,this.getMAC=this._getHMAC,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=xs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=ia,this.finalizeFunc=Mm,this.intermediateState=ia(),this.variantBlockSize=512,this.outputBinLen=160,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(mt("hmacKey",s.hmacKey,this.bigEndianMod))}};function la(e){let t;return e==="SHA-224"?t=at.slice():t=st.slice(),t}function Us(e,t){let n,r,s,a,o,i,l,c,u,h,d;const _=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],i=t[5],l=t[6],c=t[7],d=0;d<64;d+=1)d<16?_[d]=e[d]:_[d]=Cm(Am(_[d-2]),_[d-7],Tm(_[d-15]),_[d-16]),u=en(c,Nm(o),Ds(o,i,l),K[d],_[d]),h=Pe(Im(n),Vs(n,r,s)),c=l,l=i,i=o,o=Pe(a,u),a=s,s=r,r=n,n=Pe(u,h);return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(s,t[2]),t[3]=Pe(a,t[3]),t[4]=Pe(o,t[4]),t[5]=Pe(i,t[5]),t[6]=Pe(l,t[6]),t[7]=Pe(c,t[7]),t}function $m(e,t,n,r,s){let a,o;const i=(t+65>>>9<<4)+15,l=16,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/ln|0,a=0;a<e.length;a+=l)r=Us(e.slice(a,a+l),r);return s==="SHA-224"?o=[r[0],r[1],r[2],r[3],r[4],r[5],r[6]]:o=r,o}let Rm=class extends Vn{constructor(t,n,r){if(!(t==="SHA-224"||t==="SHA-256"))throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Us,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=la,this.finalizeFunc=function(a,o,i,l){return $m(a,o,i,l,t)},this.intermediateState=la(t),this.variantBlockSize=512,this.outputBinLen=t==="SHA-224"?224:256,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(mt("hmacKey",s.hmacKey,this.bigEndianMod))}};class k{constructor(t,n){B(this,"highOrder"),B(this,"lowOrder"),this.highOrder=t,this.lowOrder=n}}function ca(e,t){let n;return t>32?(n=64-t,new k(e.lowOrder<<t|e.highOrder>>>n,e.highOrder<<t|e.lowOrder>>>n)):t!==0?(n=32-t,new k(e.highOrder<<t|e.lowOrder>>>n,e.lowOrder<<t|e.highOrder>>>n)):e}function Qe(e,t){let n;return t<32?(n=32-t,new k(e.highOrder>>>t|e.lowOrder<<n,e.lowOrder>>>t|e.highOrder<<n)):(n=64-t,new k(e.lowOrder>>>t|e.highOrder<<n,e.highOrder>>>t|e.lowOrder<<n))}function Hs(e,t){return new k(e.highOrder>>>t,e.lowOrder>>>t|e.highOrder<<32-t)}function Fm(e,t,n){return new k(e.highOrder&t.highOrder^~e.highOrder&n.highOrder,e.lowOrder&t.lowOrder^~e.lowOrder&n.lowOrder)}function Dm(e,t,n){return new k(e.highOrder&t.highOrder^e.highOrder&n.highOrder^t.highOrder&n.highOrder,e.lowOrder&t.lowOrder^e.lowOrder&n.lowOrder^t.lowOrder&n.lowOrder)}function Vm(e){const t=Qe(e,28),n=Qe(e,34),r=Qe(e,39);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Be(e,t){let n,r;n=(e.lowOrder&65535)+(t.lowOrder&65535),r=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n>>>16);const s=(r&65535)<<16|n&65535;n=(e.highOrder&65535)+(t.highOrder&65535)+(r>>>16),r=(e.highOrder>>>16)+(t.highOrder>>>16)+(n>>>16);const a=(r&65535)<<16|n&65535;return new k(a,s)}function xm(e,t,n,r){let s,a;s=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535),a=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s>>>16);const o=(a&65535)<<16|s&65535;s=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(a>>>16),a=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s>>>16);const i=(a&65535)<<16|s&65535;return new k(i,o)}function Um(e,t,n,r,s){let a,o;a=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535)+(s.lowOrder&65535),o=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s.lowOrder>>>16)+(a>>>16);const i=(o&65535)<<16|a&65535;a=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(s.highOrder&65535)+(o>>>16),o=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s.highOrder>>>16)+(a>>>16);const l=(o&65535)<<16|a&65535;return new k(l,i)}function Jt(e,t){return new k(e.highOrder^t.highOrder,e.lowOrder^t.lowOrder)}function Hm(e,t,n,r,s){return new k(e.highOrder^t.highOrder^n.highOrder^r.highOrder^s.highOrder,e.lowOrder^t.lowOrder^n.lowOrder^r.lowOrder^s.lowOrder)}function Bm(e){const t=Qe(e,19),n=Qe(e,61),r=Hs(e,6);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Wm(e){const t=Qe(e,1),n=Qe(e,8),r=Hs(e,7);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function jm(e){const t=Qe(e,14),n=Qe(e,18),r=Qe(e,41);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}const Km=[new k(K[0],3609767458),new k(K[1],602891725),new k(K[2],3964484399),new k(K[3],2173295548),new k(K[4],4081628472),new k(K[5],3053834265),new k(K[6],2937671579),new k(K[7],3664609560),new k(K[8],2734883394),new k(K[9],1164996542),new k(K[10],1323610764),new k(K[11],3590304994),new k(K[12],4068182383),new k(K[13],991336113),new k(K[14],633803317),new k(K[15],3479774868),new k(K[16],2666613458),new k(K[17],944711139),new k(K[18],2341262773),new k(K[19],2007800933),new k(K[20],1495990901),new k(K[21],1856431235),new k(K[22],3175218132),new k(K[23],2198950837),new k(K[24],3999719339),new k(K[25],766784016),new k(K[26],2566594879),new k(K[27],3203337956),new k(K[28],1034457026),new k(K[29],2466948901),new k(K[30],3758326383),new k(K[31],168717936),new k(K[32],1188179964),new k(K[33],1546045734),new k(K[34],1522805485),new k(K[35],2643833823),new k(K[36],2343527390),new k(K[37],1014477480),new k(K[38],1206759142),new k(K[39],344077627),new k(K[40],1290863460),new k(K[41],3158454273),new k(K[42],3505952657),new k(K[43],106217008),new k(K[44],3606008344),new k(K[45],1432725776),new k(K[46],1467031594),new k(K[47],851169720),new k(K[48],3100823752),new k(K[49],1363258195),new k(K[50],3750685593),new k(K[51],3785050280),new k(K[52],3318307427),new k(K[53],3812723403),new k(K[54],2003034995),new k(K[55],3602036899),new k(K[56],1575990012),new k(K[57],1125592928),new k(K[58],2716904306),new k(K[59],442776044),new k(K[60],593698344),new k(K[61],3733110249),new k(K[62],2999351573),new k(K[63],3815920427),new k(3391569614,3928383900),new k(3515267271,566280711),new k(3940187606,3454069534),new k(4118630271,4000239992),new k(116418474,1914138554),new k(174292421,2731055270),new k(289380356,3203993006),new k(460393269,320620315),new k(685471733,587496836),new k(852142971,1086792851),new k(1017036298,365543100),new k(1126000580,2618297676),new k(1288033470,3409855158),new k(1501505948,4234509866),new k(1607167915,987167468),new k(1816402316,1246189591)];function ua(e){return e==="SHA-384"?[new k(3418070365,at[0]),new k(1654270250,at[1]),new k(2438529370,at[2]),new k(355462360,at[3]),new k(1731405415,at[4]),new k(41048885895,at[5]),new k(3675008525,at[6]),new k(1203062813,at[7])]:[new k(st[0],4089235720),new k(st[1],2227873595),new k(st[2],4271175723),new k(st[3],1595750129),new k(st[4],2917565137),new k(st[5],725511199),new k(st[6],4215389547),new k(st[7],327033209)]}function Bs(e,t){let n,r,s,a,o,i,l,c,u,h,d,_;const E=[];for(n=t[0],r=t[1],s=t[2],a=t[3],o=t[4],i=t[5],l=t[6],c=t[7],d=0;d<80;d+=1)d<16?(_=d*2,E[d]=new k(e[_],e[_+1])):E[d]=xm(Bm(E[d-2]),E[d-7],Wm(E[d-15]),E[d-16]),u=Um(c,jm(o),Fm(o,i,l),Km[d],E[d]),h=Be(Vm(n),Dm(n,r,s)),c=l,l=i,i=o,o=Be(a,u),a=s,s=r,r=n,n=Be(u,h);return t[0]=Be(n,t[0]),t[1]=Be(r,t[1]),t[2]=Be(s,t[2]),t[3]=Be(a,t[3]),t[4]=Be(o,t[4]),t[5]=Be(i,t[5]),t[6]=Be(l,t[6]),t[7]=Be(c,t[7]),t}function Gm(e,t,n,r,s){let a,o;const i=(t+129>>>10<<5)+31,l=32,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/ln|0,a=0;a<e.length;a+=l)r=Bs(e.slice(a,a+l),r);return s==="SHA-384"?(r=r,o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder]):o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder,r[6].highOrder,r[6].lowOrder,r[7].highOrder,r[7].lowOrder],o}let Ym=class extends Vn{constructor(t,n,r){if(!(t==="SHA-384"||t==="SHA-512"))throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Bs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=ua,this.finalizeFunc=function(a,o,i,l){return Gm(a,o,i,l,t)},this.intermediateState=ua(t),this.variantBlockSize=1024,this.outputBinLen=t==="SHA-384"?384:512,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(mt("hmacKey",s.hmacKey,this.bigEndianMod))}};const zm=[new k(0,1),new k(0,32898),new k(2147483648,32906),new k(2147483648,2147516416),new k(0,32907),new k(0,2147483649),new k(2147483648,2147516545),new k(2147483648,32777),new k(0,138),new k(0,136),new k(0,2147516425),new k(0,2147483658),new k(0,2147516555),new k(2147483648,139),new k(2147483648,32905),new k(2147483648,32771),new k(2147483648,32770),new k(2147483648,128),new k(0,32778),new k(2147483648,2147483658),new k(2147483648,2147516545),new k(2147483648,32896),new k(0,2147483649),new k(2147483648,2147516424)],Xm=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function hr(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=[new k(0,0),new k(0,0),new k(0,0),new k(0,0),new k(0,0)];return n}function qm(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=e[t].slice();return n}function _n(e,t){let n,r,s,a;const o=[],i=[];if(e!=null)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=Jt(t[(r>>>1)%5][(r>>>1)/5|0],new k(e[r+1],e[r]));for(n=0;n<24;n+=1){for(a=hr(),r=0;r<5;r+=1)o[r]=Hm(t[r][0],t[r][1],t[r][2],t[r][3],t[r][4]);for(r=0;r<5;r+=1)i[r]=Jt(o[(r+4)%5],ca(o[(r+1)%5],1));for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=Jt(t[r][s],i[r]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)a[s][(2*r+3*s)%5]=ca(t[r][s],Xm[r][s]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=Jt(a[r][s],new k(~a[(r+1)%5][s].highOrder&a[(r+2)%5][s].highOrder,~a[(r+1)%5][s].lowOrder&a[(r+2)%5][s].lowOrder));t[0][0]=Jt(t[0][0],zm[n])}return t}function Jm(e,t,n,r,s,a,o){let i,l=0,c;const u=[],h=s>>>5,d=t>>>5;for(i=0;i<d&&t>=s;i+=h)r=_n(e.slice(i,i+h),r),t-=s;for(e=e.slice(i),t=t%s;e.length<h;)e.push(0);for(i=t>>>3,e[i>>2]^=a<<8*(i%4),e[h-1]^=2147483648,r=_n(e,r);u.length*32<o&&(c=r[l%5][l/5|0],u.push(c.lowOrder),!(u.length*32>=o));)u.push(c.highOrder),l+=1,l*64%s===0&&(_n(null,r),l=0);return u}function Ws(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/ln&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r+1>>2]|=n<<(r+1)*8,r+=1);return r=r!==0?r:1,s[0]|=r,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function Qm(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/ln&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r>>2]|=n<<r*8,r+=1);return r=r!==0?r:1,s[r>>2]|=r<<r*8,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function Xn(e){return Sn(Ws(e.binLen),e)}function da(e,t){let n=Ws(t),r;n=Sn(n,e);const s=t>>>2,a=(s-n.value.length%s)%s;for(r=0;r<a;r++)n.value.push(0);return n.value}function Zm(e){const t=e||{};return{funcName:mt("funcName",t.funcName,1,{value:[],binLen:0}),customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}function ep(e){const t=e||{};return{kmacKey:mt("kmacKey",t.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}let tp=class extends Vn{constructor(t,n,r){let s=6,a=0;super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const o=r||{};if(this.numRounds!==1){if(o.kmacKey||o.hmacKey)throw new Error(Rs);if(this.shaVariant==="CSHAKE128"||this.shaVariant==="CSHAKE256")throw new Error("Cannot set numRounds for CSHAKE variants")}switch(this.bigEndianMod=1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=_n,this.stateCloneFunc=qm,this.newStateFunc=hr,this.intermediateState=hr(),this.isVariableLen=!1,t){case"SHA3-224":this.variantBlockSize=a=1152,this.outputBinLen=224,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-256":this.variantBlockSize=a=1088,this.outputBinLen=256,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-384":this.variantBlockSize=a=832,this.outputBinLen=384,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-512":this.variantBlockSize=a=576,this.outputBinLen=512,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHAKE128":s=31,this.variantBlockSize=a=1344,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"SHAKE256":s=31,this.variantBlockSize=a=1088,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"KMAC128":s=4,this.variantBlockSize=a=1344,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"KMAC256":s=4,this.variantBlockSize=a=1088,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"CSHAKE128":this.variantBlockSize=a=1344,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"CSHAKE256":this.variantBlockSize=a=1088,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;default:throw new Error(cn)}this.finalizeFunc=function(i,l,c,u,h){return Jm(i,l,c,u,a,s,h)},o.hmacKey&&this._setHMACKey(mt("hmacKey",o.hmacKey,this.bigEndianMod))}_initializeCSHAKE(t,n){const r=Zm(t||{});n&&(r.funcName=n);const s=Sn(Xn(r.funcName),Xn(r.customization));if(r.customization.binLen!==0||r.funcName.binLen!==0){const a=da(s,this.variantBlockSize>>>3);for(let o=0;o<a.length;o+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(a.slice(o,o+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;return 4}else return 31}_initializeKMAC(t){const n=ep(t||{});this._initializeCSHAKE(t,n.funcName);const r=da(Xn(n.kmacKey),this.variantBlockSize>>>3);for(let s=0;s<r.length;s+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(r.slice(s,s+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;this.macKeySet=!0}_getKMAC(t){const n=Sn({value:this.remainder.slice(),binLen:this.remainderLen},Qm(t.outputLen));return this.finalizeFunc(n.value,n.binLen,this.processedLen,this.stateCloneFunc(this.intermediateState),t.outputLen)}};class np{constructor(t,n,r){if(B(this,"shaObj"),t==="SHA-1")this.shaObj=new Pm(t,n,r);else if(t==="SHA-224"||t==="SHA-256")this.shaObj=new Rm(t,n,r);else if(t==="SHA-384"||t==="SHA-512")this.shaObj=new Ym(t,n,r);else if(t==="SHA3-224"||t==="SHA3-256"||t==="SHA3-384"||t==="SHA3-512"||t==="SHAKE128"||t==="SHAKE256"||t==="CSHAKE128"||t==="CSHAKE256"||t==="KMAC128"||t==="KMAC256")this.shaObj=new tp(t,n,r);else throw new Error(cn)}update(t){return this.shaObj.update(t),this}getHash(t,n){return this.shaObj.getHash(t,n)}setHMACKey(t,n,r){this.shaObj.setHMACKey(t,n,r)}getHMAC(t,n){return this.shaObj.getHMAC(t,n)}}class rp{static generate(t,n){const r={digits:6,algorithm:"SHA-1",period:30,timestamp:Date.now(),...n},s=Math.floor(r.timestamp/1e3),a=this.leftpad(this.dec2hex(Math.floor(s/r.period)),16,"0"),o=new np(r.algorithm,"HEX");o.setHMACKey(this.base32tohex(t),"HEX"),o.update(a);const i=o.getHMAC("HEX"),l=this.hex2dec(i.substring(i.length-1));let c=(this.hex2dec(i.substr(l*2,8))&this.hex2dec("7fffffff"))+"";const u=Math.max(c.length-r.digits,0);c=c.substring(u,u+r.digits);const h=Math.ceil((r.timestamp+1)/(r.period*1e3))*r.period*1e3;return{otp:c,expires:h}}static hex2dec(t){return parseInt(t,16)}static dec2hex(t){return(t<15.5?"0":"")+Math.round(t).toString(16)}static base32tohex(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let r="",s="";const a=t.replace(/=+$/,"");for(let o=0;o<a.length;o++){const i=n.indexOf(t.charAt(o).toUpperCase());if(i===-1)throw new Error("Invalid base32 character in key");r+=this.leftpad(i.toString(2),5,"0")}for(let o=0;o+8<=r.length;o+=8){const i=r.substr(o,8);s=s+this.leftpad(parseInt(i,2).toString(16),2,"0")}return s}static leftpad(t,n,r){return n+1>=t.length&&(t=Array(n+1-t.length).join(r)+t),t}}const ap=(e,t)=>{on&&localStorage.setItem(e,t)},sp=e=>on&&localStorage.getItem(e)||"";function Qt(e){return e<10?`0${e}`:e}function op(e){let t=new Date;return e&&(t=new Date(e)),t.format=(n="YYYY-MM-DD HH:mm:ss")=>{const r=t.getFullYear(),s=Qt(t.getMonth()+1),a=Qt(t.getDate()),o=Qt(t.getHours()),i=Qt(t.getMinutes()),l=Qt(t.getSeconds());return n.replace(/Y+/gi,`${r}`).replace(/M+/g,`${s}`).replace(/D+/gi,`${a}`).replace(/H+/gi,`${o}`).replace(/m+/g,`${i}`).replace(/S+/gi,`${l}`)},t}const ip=e=>{if(typeof window<"u"){const t={},n=window.location.href;return n.split("?")[1]&&n.split("?")[1].split("&").forEach(a=>{const[o,i]=a.split("=");o&&i&&(t[o]=decodeURIComponent(i))}),t}return{}},lp=(e,t)=>{typeof window<"u"&&(window[e]=t),typeof global<"u"&&(global[e]=t)},cp=(e=375)=>{let t=e;const{documentElement:n}=document,r=window.matchMedia("(orientation: portrait)");let s,a=667/375;Ts()===As.IPAD&&(a=1024/768,t=768);function o(){const i=!r.matches;let l=window.screen.width,c=window.screen.height;l<c&&([l,c]=[c,l]);let u=n.clientWidth,h=c;u/h>=a?(u=h*a,n.classList.remove("adjustHeight"),n.classList.add("adjustWidth")):(h=u/a,n.classList.remove("adjustWidth"),n.classList.add("adjustHeight"));let _=u/t*16;i&&(_/=a),n.style.fontSize=`${_}px`;const E=window.getComputedStyle(n).fontSize.replace("px","")||0;_!==E&&(n.style.fontSize=`${_/Number(E)*_}px`)}window.addEventListener("resize",function(){clearTimeout(s),s=setTimeout(o,300)},!1),window.addEventListener("pageshow",function(i){i.persisted&&(clearTimeout(s),s=setTimeout(o,300))},!1),window.addEventListener("orientationchange",function(){o()},!1),o()},qn=new Map([[100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],[200,"OK"],[201,"Created"],[202,"Accepted"],[203,"Non-Authoritative Information"],[204,"No Content"],[205,"Reset Content"],[206,"Partial Content"],[207,"Multi-Status"],[208,"Already Reported"],[226,"IM Used"],[300,"Multiple Choices"],[301,"Moved Permanently"],[302,"Found"],[303,"See Other"],[304,"Not Modified"],[305,"Use Proxy"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],[400,"Bad Request"],[401,"Unauthorized"],[402,"Payment Required"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[406,"Not Acceptable"],[407,"Proxy Authentication Required"],[408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[411,"Length Required"],[412,"Precondition Failed"],[413,"Payload Too Large"],[414,"URI Too Long"],[415,"Unsupported Media Type"],[416,"Range Not Satisfiable"],[417,"Expectation Failed"],[418,"I'm a Teapot"],[421,"Misdirected Request"],[422,"Unprocessable Entity"],[423,"Locked"],[424,"Failed Dependency"],[425,"Too Early"],[426,"Upgrade Required"],[428,"Precondition Required"],[429,"Too Many Requests"],[431,"Request Header Fields Too Large"],[451,"Unavailable For Legal Reasons"],[500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],[505,"HTTP Version Not Supported"],[506,"Variant Also Negotiates"],[507,"Insufficient Storage"],[508,"Loop Detected"],[509,"Bandwidth Limit Exceeded"],[510,"Not Extended"],[511,"Network Authentication Required"]]);up(qn),dp(qn);function up(e){const t=new Map;for(const[n,r]of e)t.set(r.toLowerCase(),n);return t}function dp(e){const t=[];for(const[n,r]of e)t.push(n);return t}const et=class{constructor(){B(this,"getDecimalLength",t=>{const[n,r]=t.toString().split(".");return r?r.length:0}),B(this,"amend",(t,n=15)=>parseFloat(Number(t).toPrecision(n))),B(this,"power",(t,n)=>Math.pow(10,Math.max(this.getDecimalLength(t),this.getDecimalLength(n))))}};B(et,"handleMethod",(e,t)=>{const n=new et,{power:r,amend:s}=n,a=r(e,t),o=s(e*a),i=s(t*a);return l=>{switch(l){case"+":return(o+i)/a;case"-":return(o-i)/a;case"*":return o*i/(a*a);case"/":return o/i}}});B(et,"add",(e,t)=>et.handleMethod(e,t)("+"));B(et,"divide",(e,t)=>et.handleMethod(e,t)("/"));B(et,"multiply",(e,t)=>et.handleMethod(e,t)("*"));B(et,"subtract",(e,t)=>et.handleMethod(e,t)("-"));var Mt=(e=>(e.NORMAL="normal",e.ERROR="error",e.WARNING="warning",e))(Mt||{}),un=(e=>(e.EN="en",e.ZH_CN="zh-CN",e))(un||{});const js="ran_chaxus_lang",ha=[],hp={"zh-CN":{lang:"简体中文"},en:{lang:"English"}};var Ks=(e=>(e.LEGACY="legacy",e))(Ks||{});const fa="PWA_INSTALL_ID",fp="pwa-install",mp="/ran/manifest.json",pp=!1;ip();const fr={isDev:pp,locale:un.EN,currentDevice:Ts(),isWeiXin:mm(),isMobile:pm(),isBang:gm()},gp={install:e=>{e.config.globalProperties.$env=fr,e.provide("$env",fr)}};/*!
  * shared v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const On=typeof window<"u",bt=(e,t=!1)=>t?Symbol.for(e):Symbol(e),_p=(e,t,n)=>vp({l:e,k:t,s:n}),vp=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Ie=e=>typeof e=="number"&&isFinite(e),bp=e=>Ys(e)==="[object Date]",pt=e=>Ys(e)==="[object RegExp]",xn=e=>te(e)&&Object.keys(e).length===0,Me=Object.assign;let ma;const ot=()=>ma||(ma=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function pa(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const yp=Object.prototype.hasOwnProperty;function In(e,t){return yp.call(e,t)}const _e=Array.isArray,pe=e=>typeof e=="function",H=e=>typeof e=="string",ae=e=>typeof e=="boolean",ue=e=>e!==null&&typeof e=="object",kp=e=>ue(e)&&pe(e.then)&&pe(e.catch),Gs=Object.prototype.toString,Ys=e=>Gs.call(e),te=e=>{if(!ue(e))return!1;const t=Object.getPrototypeOf(e);return t===null||t.constructor===Object},wp=e=>e==null?"":_e(e)||te(e)&&e.toString===Gs?JSON.stringify(e,null,2):String(e);function Lp(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}function Un(e){let t=e;return()=>++t}function Ep(e,t){typeof console<"u"&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const mn=e=>!ue(e)||_e(e);function vn(e,t){if(mn(e)||mn(t))throw new Error("Invalid value");const n=[{src:e,des:t}];for(;n.length;){const{src:r,des:s}=n.pop();Object.keys(r).forEach(a=>{mn(r[a])||mn(s[a])?s[a]=r[a]:n.push({src:r[a],des:s[a]})})}}/*!
  * message-compiler v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function Sp(e,t,n){return{line:e,column:t,offset:n}}function Cn(e,t,n){return{start:e,end:t}}const Op=/\{([0-9a-zA-Z]+)\}/g;function zs(e,...t){return t.length===1&&Ip(t[0])&&(t=t[0]),(!t||!t.hasOwnProperty)&&(t={}),e.replace(Op,(n,r)=>t.hasOwnProperty(r)?t[r]:"")}const Xs=Object.assign,ga=e=>typeof e=="string",Ip=e=>e!==null&&typeof e=="object";function qs(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}const $r={USE_MODULO_SYNTAX:1,__EXTEND_POINT__:2},Cp={[$r.USE_MODULO_SYNTAX]:"Use modulo before '{{0}}'."};function Ap(e,t,...n){const r=zs(Cp[e],...n||[]),s={message:String(r),code:e};return t&&(s.location=t),s}const Q={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14,UNHANDLED_CODEGEN_NODE_TYPE:15,UNHANDLED_MINIFIER_NODE_TYPE:16,__EXTEND_POINT__:17},Tp={[Q.EXPECTED_TOKEN]:"Expected token: '{0}'",[Q.INVALID_TOKEN_IN_PLACEHOLDER]:"Invalid token in placeholder: '{0}'",[Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]:"Unterminated single quote in placeholder",[Q.UNKNOWN_ESCAPE_SEQUENCE]:"Unknown escape sequence: \\{0}",[Q.INVALID_UNICODE_ESCAPE_SEQUENCE]:"Invalid unicode escape sequence: {0}",[Q.UNBALANCED_CLOSING_BRACE]:"Unbalanced closing brace",[Q.UNTERMINATED_CLOSING_BRACE]:"Unterminated closing brace",[Q.EMPTY_PLACEHOLDER]:"Empty placeholder",[Q.NOT_ALLOW_NEST_PLACEHOLDER]:"Not allowed nest placeholder",[Q.INVALID_LINKED_FORMAT]:"Invalid linked format",[Q.MUST_HAVE_MESSAGES_IN_PLURAL]:"Plural must have messages",[Q.UNEXPECTED_EMPTY_LINKED_MODIFIER]:"Unexpected empty linked modifier",[Q.UNEXPECTED_EMPTY_LINKED_KEY]:"Unexpected empty linked key",[Q.UNEXPECTED_LEXICAL_ANALYSIS]:"Unexpected lexical analysis in token: '{0}'",[Q.UNHANDLED_CODEGEN_NODE_TYPE]:"unhandled codegen node type: '{0}'",[Q.UNHANDLED_MINIFIER_NODE_TYPE]:"unhandled mimifier node type: '{0}'"};function Gt(e,t,n={}){const{domain:r,messages:s,args:a}=n,o=zs((s||Tp)[e]||"",...a||[]),i=new SyntaxError(String(o));return i.code=e,t&&(i.location=t),i.domain=r,i}function Np(e){throw e}const nt=" ",Mp="\r",Re=`
`,Pp="\u2028",$p="\u2029";function Rp(e){const t=e;let n=0,r=1,s=1,a=0;const o=$=>t[$]===Mp&&t[$+1]===Re,i=$=>t[$]===Re,l=$=>t[$]===$p,c=$=>t[$]===Pp,u=$=>o($)||i($)||l($)||c($),h=()=>n,d=()=>r,_=()=>s,E=()=>a,v=$=>o($)||l($)||c($)?Re:t[$],b=()=>v(n),M=()=>v(n+a);function W(){return a=0,u(n)&&(r++,s=0),o(n)&&n++,n++,s++,t[n]}function y(){return o(n+a)&&a++,a++,t[n+a]}function L(){n=0,r=1,s=1,a=0}function T($=0){a=$}function C(){const $=n+a;for(;$!==n;)W();a=0}return{index:h,line:d,column:_,peekOffset:E,charAt:v,currentChar:b,currentPeek:M,next:W,peek:y,reset:L,resetPeek:T,skipToPeek:C}}const ht=void 0,Fp=".",_a="'",Dp="tokenizer";function Vp(e,t={}){const n=t.location!==!1,r=Rp(e),s=()=>r.index(),a=()=>Sp(r.line(),r.column(),r.index()),o=a(),i=s(),l={currentType:14,offset:i,startLoc:o,endLoc:o,lastType:14,lastOffset:i,lastStartLoc:o,lastEndLoc:o,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:u}=t;function h(f,m,N,...q){const ye=c();if(m.column+=N,m.offset+=N,u){const ne=n?Cn(ye.startLoc,m):null,O=Gt(f,ne,{domain:Dp,args:q});u(O)}}function d(f,m,N){f.endLoc=a(),f.currentType=m;const q={type:m};return n&&(q.loc=Cn(f.startLoc,f.endLoc)),N!=null&&(q.value=N),q}const _=f=>d(f,14);function E(f,m){return f.currentChar()===m?(f.next(),m):(h(Q.EXPECTED_TOKEN,a(),0,m),"")}function v(f){let m="";for(;f.currentPeek()===nt||f.currentPeek()===Re;)m+=f.currentPeek(),f.peek();return m}function b(f){const m=v(f);return f.skipToPeek(),m}function M(f){if(f===ht)return!1;const m=f.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m===95}function W(f){if(f===ht)return!1;const m=f.charCodeAt(0);return m>=48&&m<=57}function y(f,m){const{currentType:N}=m;if(N!==2)return!1;v(f);const q=M(f.currentPeek());return f.resetPeek(),q}function L(f,m){const{currentType:N}=m;if(N!==2)return!1;v(f);const q=f.currentPeek()==="-"?f.peek():f.currentPeek(),ye=W(q);return f.resetPeek(),ye}function T(f,m){const{currentType:N}=m;if(N!==2)return!1;v(f);const q=f.currentPeek()===_a;return f.resetPeek(),q}function C(f,m){const{currentType:N}=m;if(N!==8)return!1;v(f);const q=f.currentPeek()===".";return f.resetPeek(),q}function $(f,m){const{currentType:N}=m;if(N!==9)return!1;v(f);const q=M(f.currentPeek());return f.resetPeek(),q}function D(f,m){const{currentType:N}=m;if(!(N===8||N===12))return!1;v(f);const q=f.currentPeek()===":";return f.resetPeek(),q}function R(f,m){const{currentType:N}=m;if(N!==10)return!1;const q=()=>{const ne=f.currentPeek();return ne==="{"?M(f.peek()):ne==="@"||ne==="%"||ne==="|"||ne===":"||ne==="."||ne===nt||!ne?!1:ne===Re?(f.peek(),q()):Z(f,!1)},ye=q();return f.resetPeek(),ye}function he(f){v(f);const m=f.currentPeek()==="|";return f.resetPeek(),m}function we(f){const m=v(f),N=f.currentPeek()==="%"&&f.peek()==="{";return f.resetPeek(),{isModulo:N,hasSpace:m.length>0}}function Z(f,m=!0){const N=(ye=!1,ne="",O=!1)=>{const P=f.currentPeek();return P==="{"?ne==="%"?!1:ye:P==="@"||!P?ne==="%"?!0:ye:P==="%"?(f.peek(),N(ye,"%",!0)):P==="|"?ne==="%"||O?!0:!(ne===nt||ne===Re):P===nt?(f.peek(),N(!0,nt,O)):P===Re?(f.peek(),N(!0,Re,O)):!0},q=N();return m&&f.resetPeek(),q}function V(f,m){const N=f.currentChar();return N===ht?ht:m(N)?(f.next(),N):null}function ie(f){const m=f.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36}function Ee(f){return V(f,ie)}function Oe(f){const m=f.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36||m===45}function ve(f){return V(f,Oe)}function Ue(f){const m=f.charCodeAt(0);return m>=48&&m<=57}function tt(f){return V(f,Ue)}function be(f){const m=f.charCodeAt(0);return m>=48&&m<=57||m>=65&&m<=70||m>=97&&m<=102}function Le(f){return V(f,be)}function He(f){let m="",N="";for(;m=tt(f);)N+=m;return N}function j(f){b(f);const m=f.currentChar();return m!=="%"&&h(Q.EXPECTED_TOKEN,a(),0,m),f.next(),"%"}function le(f){let m="";for(;;){const N=f.currentChar();if(N==="{"||N==="}"||N==="@"||N==="|"||!N)break;if(N==="%")if(Z(f))m+=N,f.next();else break;else if(N===nt||N===Re)if(Z(f))m+=N,f.next();else{if(he(f))break;m+=N,f.next()}else m+=N,f.next()}return m}function oe(f){b(f);let m="",N="";for(;m=ve(f);)N+=m;return f.currentChar()===ht&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N}function fe(f){b(f);let m="";return f.currentChar()==="-"?(f.next(),m+=`-${He(f)}`):m+=He(f),f.currentChar()===ht&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),m}function De(f){return f!==_a&&f!==Re}function Ge(f){b(f),E(f,"'");let m="",N="";for(;m=V(f,De);)m==="\\"?N+=kt(f):N+=m;const q=f.currentChar();return q===Re||q===ht?(h(Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,a(),0),q===Re&&(f.next(),E(f,"'")),N):(E(f,"'"),N)}function kt(f){const m=f.currentChar();switch(m){case"\\":case"'":return f.next(),`\\${m}`;case"u":return ut(f,m,4);case"U":return ut(f,m,6);default:return h(Q.UNKNOWN_ESCAPE_SEQUENCE,a(),0,m),""}}function ut(f,m,N){E(f,m);let q="";for(let ye=0;ye<N;ye++){const ne=Le(f);if(!ne){h(Q.INVALID_UNICODE_ESCAPE_SEQUENCE,a(),0,`\\${m}${q}${f.currentChar()}`);break}q+=ne}return`\\${m}${q}`}function Yt(f){return f!=="{"&&f!=="}"&&f!==nt&&f!==Re}function zt(f){b(f);let m="",N="";for(;m=V(f,Yt);)N+=m;return N}function Xt(f){let m="",N="";for(;m=Ee(f);)N+=m;return N}function F(f){const m=N=>{const q=f.currentChar();return q==="{"||q==="%"||q==="@"||q==="|"||q==="("||q===")"||!q||q===nt?N:(N+=q,f.next(),m(N))};return m("")}function ce(f){b(f);const m=E(f,"|");return b(f),m}function It(f,m){let N=null;switch(f.currentChar()){case"{":return m.braceNest>=1&&h(Q.NOT_ALLOW_NEST_PLACEHOLDER,a(),0),f.next(),N=d(m,2,"{"),b(f),m.braceNest++,N;case"}":return m.braceNest>0&&m.currentType===2&&h(Q.EMPTY_PLACEHOLDER,a(),0),f.next(),N=d(m,3,"}"),m.braceNest--,m.braceNest>0&&b(f),m.inLinked&&m.braceNest===0&&(m.inLinked=!1),N;case"@":return m.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N=Ct(f,m)||_(m),m.braceNest=0,N;default:{let ye=!0,ne=!0,O=!0;if(he(f))return m.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N=d(m,1,ce(f)),m.braceNest=0,m.inLinked=!1,N;if(m.braceNest>0&&(m.currentType===5||m.currentType===6||m.currentType===7))return h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),m.braceNest=0,qt(f,m);if(ye=y(f,m))return N=d(m,5,oe(f)),b(f),N;if(ne=L(f,m))return N=d(m,6,fe(f)),b(f),N;if(O=T(f,m))return N=d(m,7,Ge(f)),b(f),N;if(!ye&&!ne&&!O)return N=d(m,13,zt(f)),h(Q.INVALID_TOKEN_IN_PLACEHOLDER,a(),0,N.value),b(f),N;break}}return N}function Ct(f,m){const{currentType:N}=m;let q=null;const ye=f.currentChar();switch((N===8||N===9||N===12||N===10)&&(ye===Re||ye===nt)&&h(Q.INVALID_LINKED_FORMAT,a(),0),ye){case"@":return f.next(),q=d(m,8,"@"),m.inLinked=!0,q;case".":return b(f),f.next(),d(m,9,".");case":":return b(f),f.next(),d(m,10,":");default:return he(f)?(q=d(m,1,ce(f)),m.braceNest=0,m.inLinked=!1,q):C(f,m)||D(f,m)?(b(f),Ct(f,m)):$(f,m)?(b(f),d(m,12,Xt(f))):R(f,m)?(b(f),ye==="{"?It(f,m)||q:d(m,11,F(f))):(N===8&&h(Q.INVALID_LINKED_FORMAT,a(),0),m.braceNest=0,m.inLinked=!1,qt(f,m))}}function qt(f,m){let N={type:14};if(m.braceNest>0)return It(f,m)||_(m);if(m.inLinked)return Ct(f,m)||_(m);switch(f.currentChar()){case"{":return It(f,m)||_(m);case"}":return h(Q.UNBALANCED_CLOSING_BRACE,a(),0),f.next(),d(m,3,"}");case"@":return Ct(f,m)||_(m);default:{if(he(f))return N=d(m,1,ce(f)),m.braceNest=0,m.inLinked=!1,N;const{isModulo:ye,hasSpace:ne}=we(f);if(ye)return ne?d(m,0,le(f)):d(m,4,j(f));if(Z(f))return d(m,0,le(f));break}}return N}function jn(){const{currentType:f,offset:m,startLoc:N,endLoc:q}=l;return l.lastType=f,l.lastOffset=m,l.lastStartLoc=N,l.lastEndLoc=q,l.offset=s(),l.startLoc=a(),r.currentChar()===ht?d(l,14):qt(r,l)}return{nextToken:jn,currentOffset:s,currentPosition:a,context:c}}const xp="parser",Up=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Hp(e,t,n){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(t||n,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function Bp(e={}){const t=e.location!==!1,{onError:n,onWarn:r}=e;function s(y,L,T,C,...$){const D=y.currentPosition();if(D.offset+=C,D.column+=C,n){const R=t?Cn(T,D):null,he=Gt(L,R,{domain:xp,args:$});n(he)}}function a(y,L,T,C,...$){const D=y.currentPosition();if(D.offset+=C,D.column+=C,r){const R=t?Cn(T,D):null;r(Ap(L,R,$))}}function o(y,L,T){const C={type:y};return t&&(C.start=L,C.end=L,C.loc={start:T,end:T}),C}function i(y,L,T,C){t&&(y.end=L,y.loc&&(y.loc.end=T))}function l(y,L){const T=y.context(),C=o(3,T.offset,T.startLoc);return C.value=L,i(C,y.currentOffset(),y.currentPosition()),C}function c(y,L){const T=y.context(),{lastOffset:C,lastStartLoc:$}=T,D=o(5,C,$);return D.index=parseInt(L,10),y.nextToken(),i(D,y.currentOffset(),y.currentPosition()),D}function u(y,L,T){const C=y.context(),{lastOffset:$,lastStartLoc:D}=C,R=o(4,$,D);return R.key=L,T===!0&&(R.modulo=!0),y.nextToken(),i(R,y.currentOffset(),y.currentPosition()),R}function h(y,L){const T=y.context(),{lastOffset:C,lastStartLoc:$}=T,D=o(9,C,$);return D.value=L.replace(Up,Hp),y.nextToken(),i(D,y.currentOffset(),y.currentPosition()),D}function d(y){const L=y.nextToken(),T=y.context(),{lastOffset:C,lastStartLoc:$}=T,D=o(8,C,$);return L.type!==12?(s(y,Q.UNEXPECTED_EMPTY_LINKED_MODIFIER,T.lastStartLoc,0),D.value="",i(D,C,$),{nextConsumeToken:L,node:D}):(L.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,We(L)),D.value=L.value||"",i(D,y.currentOffset(),y.currentPosition()),{node:D})}function _(y,L){const T=y.context(),C=o(7,T.offset,T.startLoc);return C.value=L,i(C,y.currentOffset(),y.currentPosition()),C}function E(y){const L=y.context(),T=o(6,L.offset,L.startLoc);let C=y.nextToken();if(C.type===9){const $=d(y);T.modifier=$.node,C=$.nextConsumeToken||y.nextToken()}switch(C.type!==10&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),C=y.nextToken(),C.type===2&&(C=y.nextToken()),C.type){case 11:C.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=_(y,C.value||"");break;case 5:C.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=u(y,C.value||"");break;case 6:C.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=c(y,C.value||"");break;case 7:C.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=h(y,C.value||"");break;default:{s(y,Q.UNEXPECTED_EMPTY_LINKED_KEY,L.lastStartLoc,0);const $=y.context(),D=o(7,$.offset,$.startLoc);return D.value="",i(D,$.offset,$.startLoc),T.key=D,i(T,$.offset,$.startLoc),{nextConsumeToken:C,node:T}}}return i(T,y.currentOffset(),y.currentPosition()),{node:T}}function v(y){const L=y.context(),T=L.currentType===1?y.currentOffset():L.offset,C=L.currentType===1?L.endLoc:L.startLoc,$=o(2,T,C);$.items=[];let D=null,R=null;do{const Z=D||y.nextToken();switch(D=null,Z.type){case 0:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(l(y,Z.value||""));break;case 6:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(c(y,Z.value||""));break;case 4:R=!0;break;case 5:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(u(y,Z.value||"",!!R)),R&&(a(y,$r.USE_MODULO_SYNTAX,L.lastStartLoc,0,We(Z)),R=null);break;case 7:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(h(y,Z.value||""));break;case 8:{const V=E(y);$.items.push(V.node),D=V.nextConsumeToken||null;break}}}while(L.currentType!==14&&L.currentType!==1);const he=L.currentType===1?L.lastOffset:y.currentOffset(),we=L.currentType===1?L.lastEndLoc:y.currentPosition();return i($,he,we),$}function b(y,L,T,C){const $=y.context();let D=C.items.length===0;const R=o(1,L,T);R.cases=[],R.cases.push(C);do{const he=v(y);D||(D=he.items.length===0),R.cases.push(he)}while($.currentType!==14);return D&&s(y,Q.MUST_HAVE_MESSAGES_IN_PLURAL,T,0),i(R,y.currentOffset(),y.currentPosition()),R}function M(y){const L=y.context(),{offset:T,startLoc:C}=L,$=v(y);return L.currentType===14?$:b(y,T,C,$)}function W(y){const L=Vp(y,Xs({},e)),T=L.context(),C=o(0,T.offset,T.startLoc);return t&&C.loc&&(C.loc.source=y),C.body=M(L),e.onCacheKey&&(C.cacheKey=e.onCacheKey(y)),T.currentType!==14&&s(L,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,y[T.offset]||""),i(C,L.currentOffset(),L.currentPosition()),C}return{parse:W}}function We(e){if(e.type===14)return"EOF";const t=(e.value||"").replace(/\r?\n/gu,"\\n");return t.length>10?t.slice(0,9)+"…":t}function Wp(e,t={}){const n={ast:e,helpers:new Set};return{context:()=>n,helper:a=>(n.helpers.add(a),a)}}function va(e,t){for(let n=0;n<e.length;n++)Rr(e[n],t)}function Rr(e,t){switch(e.type){case 1:va(e.cases,t),t.helper("plural");break;case 2:va(e.items,t);break;case 6:{Rr(e.key,t),t.helper("linked"),t.helper("type");break}case 5:t.helper("interpolate"),t.helper("list");break;case 4:t.helper("interpolate"),t.helper("named");break}}function jp(e,t={}){const n=Wp(e);n.helper("normalize"),e.body&&Rr(e.body,n);const r=n.context();e.helpers=Array.from(r.helpers)}function Kp(e){const t=e.body;return t.type===2?ba(t):t.cases.forEach(n=>ba(n)),e}function ba(e){if(e.items.length===1){const t=e.items[0];(t.type===3||t.type===9)&&(e.static=t.value,delete t.value)}else{const t=[];for(let n=0;n<e.items.length;n++){const r=e.items[n];if(!(r.type===3||r.type===9)||r.value==null)break;t.push(r.value)}if(t.length===e.items.length){e.static=qs(t);for(let n=0;n<e.items.length;n++){const r=e.items[n];(r.type===3||r.type===9)&&delete r.value}}}}const Gp="minifier";function Pt(e){switch(e.t=e.type,e.type){case 0:{const t=e;Pt(t.body),t.b=t.body,delete t.body;break}case 1:{const t=e,n=t.cases;for(let r=0;r<n.length;r++)Pt(n[r]);t.c=n,delete t.cases;break}case 2:{const t=e,n=t.items;for(let r=0;r<n.length;r++)Pt(n[r]);t.i=n,delete t.items,t.static&&(t.s=t.static,delete t.static);break}case 3:case 9:case 8:case 7:{const t=e;t.value&&(t.v=t.value,delete t.value);break}case 6:{const t=e;Pt(t.key),t.k=t.key,delete t.key,t.modifier&&(Pt(t.modifier),t.m=t.modifier,delete t.modifier);break}case 5:{const t=e;t.i=t.index,delete t.index;break}case 4:{const t=e;t.k=t.key,delete t.key;break}default:throw Gt(Q.UNHANDLED_MINIFIER_NODE_TYPE,null,{domain:Gp,args:[e.type]})}delete e.type}const Yp="parser";function zp(e,t){const{sourceMap:n,filename:r,breakLineCode:s,needIndent:a}=t,o=t.location!==!1,i={filename:r,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:s,needIndent:a,indentLevel:0};o&&e.loc&&(i.source=e.loc.source);const l=()=>i;function c(b,M){i.code+=b}function u(b,M=!0){const W=M?s:"";c(a?W+"  ".repeat(b):W)}function h(b=!0){const M=++i.indentLevel;b&&u(M)}function d(b=!0){const M=--i.indentLevel;b&&u(M)}function _(){u(i.indentLevel)}return{context:l,push:c,indent:h,deindent:d,newline:_,helper:b=>`_${b}`,needIndent:()=>i.needIndent}}function Xp(e,t){const{helper:n}=e;e.push(`${n("linked")}(`),xt(e,t.key),t.modifier?(e.push(", "),xt(e,t.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function qp(e,t){const{helper:n,needIndent:r}=e;e.push(`${n("normalize")}([`),e.indent(r());const s=t.items.length;for(let a=0;a<s&&(xt(e,t.items[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}function Jp(e,t){const{helper:n,needIndent:r}=e;if(t.cases.length>1){e.push(`${n("plural")}([`),e.indent(r());const s=t.cases.length;for(let a=0;a<s&&(xt(e,t.cases[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}}function Qp(e,t){t.body?xt(e,t.body):e.push("null")}function xt(e,t){const{helper:n}=e;switch(t.type){case 0:Qp(e,t);break;case 1:Jp(e,t);break;case 2:qp(e,t);break;case 6:Xp(e,t);break;case 8:e.push(JSON.stringify(t.value),t);break;case 7:e.push(JSON.stringify(t.value),t);break;case 5:e.push(`${n("interpolate")}(${n("list")}(${t.index}))`,t);break;case 4:e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`,t);break;case 9:e.push(JSON.stringify(t.value),t);break;case 3:e.push(JSON.stringify(t.value),t);break;default:throw Gt(Q.UNHANDLED_CODEGEN_NODE_TYPE,null,{domain:Yp,args:[t.type]})}}const Zp=(e,t={})=>{const n=ga(t.mode)?t.mode:"normal",r=ga(t.filename)?t.filename:"message.intl",s=!!t.sourceMap,a=t.breakLineCode!=null?t.breakLineCode:n==="arrow"?";":`
`,o=t.needIndent?t.needIndent:n!=="arrow",i=e.helpers||[],l=zp(e,{mode:n,filename:r,sourceMap:s,breakLineCode:a,needIndent:o});l.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),l.indent(o),i.length>0&&(l.push(`const { ${qs(i.map(h=>`${h}: _${h}`),", ")} } = ctx`),l.newline()),l.push("return "),xt(l,e),l.deindent(o),l.push("}"),delete e.helpers;const{code:c,map:u}=l.context();return{ast:e,code:c,map:u?u.toJSON():void 0}};function e0(e,t={}){const n=Xs({},t),r=!!n.jit,s=!!n.minify,a=n.optimize==null?!0:n.optimize,i=Bp(n).parse(e);return r?(a&&Kp(i),s&&Pt(i),{ast:i,code:""}):(jp(i,n),Zp(i,n))}/*!
  * core-base v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function t0(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(ot().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(ot().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(ot().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}const yt=[];yt[0]={w:[0],i:[3,0],"[":[4],o:[7]};yt[1]={w:[1],".":[2],"[":[4],o:[7]};yt[2]={w:[2],i:[3,0],0:[3,0]};yt[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};yt[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};yt[5]={"'":[4,0],o:8,l:[5,0]};yt[6]={'"':[4,0],o:8,l:[6,0]};const n0=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function r0(e){return n0.test(e)}function a0(e){const t=e.charCodeAt(0),n=e.charCodeAt(e.length-1);return t===n&&(t===34||t===39)?e.slice(1,-1):e}function s0(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function o0(e){const t=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:r0(t)?a0(t):"*"+t}function i0(e){const t=[];let n=-1,r=0,s=0,a,o,i,l,c,u,h;const d=[];d[0]=()=>{o===void 0?o=i:o+=i},d[1]=()=>{o!==void 0&&(t.push(o),o=void 0)},d[2]=()=>{d[0](),s++},d[3]=()=>{if(s>0)s--,r=4,d[0]();else{if(s=0,o===void 0||(o=o0(o),o===!1))return!1;d[1]()}};function _(){const E=e[n+1];if(r===5&&E==="'"||r===6&&E==='"')return n++,i="\\"+E,d[0](),!0}for(;r!==null;)if(n++,a=e[n],!(a==="\\"&&_())){if(l=s0(a),h=yt[r],c=h[l]||h.l||8,c===8||(r=c[0],c[1]!==void 0&&(u=d[c[1]],u&&(i=a,u()===!1))))return;if(r===7)return t}}const ya=new Map;function l0(e,t){return ue(e)?e[t]:null}function c0(e,t){if(!ue(e))return null;let n=ya.get(t);if(n||(n=i0(t),n&&ya.set(t,n)),!n)return null;const r=n.length;let s=e,a=0;for(;a<r;){const o=s[n[a]];if(o===void 0||pe(s))return null;s=o,a++}return s}const u0=e=>e,d0=e=>"",h0="text",f0=e=>e.length===0?"":Lp(e),m0=wp;function ka(e,t){return e=Math.abs(e),t===2?e?e>1?1:0:1:e?Math.min(e,2):0}function p0(e){const t=Ie(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Ie(e.named.count)||Ie(e.named.n))?Ie(e.named.count)?e.named.count:Ie(e.named.n)?e.named.n:t:t}function g0(e,t){t.count||(t.count=e),t.n||(t.n=e)}function _0(e={}){const t=e.locale,n=p0(e),r=ue(e.pluralRules)&&H(t)&&pe(e.pluralRules[t])?e.pluralRules[t]:ka,s=ue(e.pluralRules)&&H(t)&&pe(e.pluralRules[t])?ka:void 0,a=M=>M[r(n,M.length,s)],o=e.list||[],i=M=>o[M],l=e.named||{};Ie(e.pluralIndex)&&g0(n,l);const c=M=>l[M];function u(M){const W=pe(e.messages)?e.messages(M):ue(e.messages)?e.messages[M]:!1;return W||(e.parent?e.parent.message(M):d0)}const h=M=>e.modifiers?e.modifiers[M]:u0,d=te(e.processor)&&pe(e.processor.normalize)?e.processor.normalize:f0,_=te(e.processor)&&pe(e.processor.interpolate)?e.processor.interpolate:m0,E=te(e.processor)&&H(e.processor.type)?e.processor.type:h0,b={list:i,named:c,plural:a,linked:(M,...W)=>{const[y,L]=W;let T="text",C="";W.length===1?ue(y)?(C=y.modifier||C,T=y.type||T):H(y)&&(C=y||C):W.length===2&&(H(y)&&(C=y||C),H(L)&&(T=L||T));const $=u(M)(b),D=T==="vnode"&&_e($)&&C?$[0]:$;return C?h(C)(D,T):D},message:u,type:E,interpolate:_,normalize:d,values:Me({},o,l)};return b}let nn=null;function v0(e){nn=e}function b0(e,t,n){nn&&nn.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:t,meta:n})}const y0=k0("function:translate");function k0(e){return t=>nn&&nn.emit(e,t)}const Js=$r.__EXTEND_POINT__,wt=Un(Js),w0={NOT_FOUND_KEY:Js,FALLBACK_TO_TRANSLATE:wt(),CANNOT_FORMAT_NUMBER:wt(),FALLBACK_TO_NUMBER_FORMAT:wt(),CANNOT_FORMAT_DATE:wt(),FALLBACK_TO_DATE_FORMAT:wt(),EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER:wt(),__EXTEND_POINT__:wt()},Qs=Q.__EXTEND_POINT__,Lt=Un(Qs),je={INVALID_ARGUMENT:Qs,INVALID_DATE_ARGUMENT:Lt(),INVALID_ISO_DATE_ARGUMENT:Lt(),NOT_SUPPORT_NON_STRING_MESSAGE:Lt(),NOT_SUPPORT_LOCALE_PROMISE_VALUE:Lt(),NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:Lt(),NOT_SUPPORT_LOCALE_TYPE:Lt(),__EXTEND_POINT__:Lt()};function ze(e){return Gt(e,null,void 0)}function Fr(e,t){return t.locale!=null?wa(t.locale):wa(e.locale)}let Jn;function wa(e){if(H(e))return e;if(pe(e)){if(e.resolvedOnce&&Jn!=null)return Jn;if(e.constructor.name==="Function"){const t=e();if(kp(t))throw ze(je.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return Jn=t}else throw ze(je.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw ze(je.NOT_SUPPORT_LOCALE_TYPE)}function L0(e,t,n){return[...new Set([n,..._e(t)?t:ue(t)?Object.keys(t):H(t)?[t]:[n]])]}function Zs(e,t,n){const r=H(n)?n:Ut,s=e;s.__localeChainCache||(s.__localeChainCache=new Map);let a=s.__localeChainCache.get(r);if(!a){a=[];let o=[n];for(;_e(o);)o=La(a,o,t);const i=_e(t)||!te(t)?t:t.default?t.default:null;o=H(i)?[i]:i,_e(o)&&La(a,o,!1),s.__localeChainCache.set(r,a)}return a}function La(e,t,n){let r=!0;for(let s=0;s<t.length&&ae(r);s++){const a=t[s];H(a)&&(r=E0(e,t[s],n))}return r}function E0(e,t,n){let r;const s=t.split("-");do{const a=s.join("-");r=S0(e,a,n),s.splice(-1,1)}while(s.length&&r===!0);return r}function S0(e,t,n){let r=!1;if(!e.includes(t)&&(r=!0,t)){r=t[t.length-1]!=="!";const s=t.replace(/!/g,"");e.push(s),(_e(n)||te(n))&&n[s]&&(r=n[s])}return r}const O0="9.13.1",Hn=-1,Ut="en-US",Ea="",Sa=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function I0(){return{upper:(e,t)=>t==="text"&&H(e)?e.toUpperCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,t)=>t==="text"&&H(e)?e.toLowerCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,t)=>t==="text"&&H(e)?Sa(e):t==="vnode"&&ue(e)&&"__v_isVNode"in e?Sa(e.children):e}}let eo;function Oa(e){eo=e}let to;function C0(e){to=e}let no;function A0(e){no=e}let ro=null;const T0=e=>{ro=e},N0=()=>ro;let ao=null;const Ia=e=>{ao=e},M0=()=>ao;let Ca=0;function P0(e={}){const t=pe(e.onWarn)?e.onWarn:Ep,n=H(e.version)?e.version:O0,r=H(e.locale)||pe(e.locale)?e.locale:Ut,s=pe(r)?Ut:r,a=_e(e.fallbackLocale)||te(e.fallbackLocale)||H(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:s,o=te(e.messages)?e.messages:{[s]:{}},i=te(e.datetimeFormats)?e.datetimeFormats:{[s]:{}},l=te(e.numberFormats)?e.numberFormats:{[s]:{}},c=Me({},e.modifiers||{},I0()),u=e.pluralRules||{},h=pe(e.missing)?e.missing:null,d=ae(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,_=ae(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,E=!!e.fallbackFormat,v=!!e.unresolving,b=pe(e.postTranslation)?e.postTranslation:null,M=te(e.processor)?e.processor:null,W=ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,y=!!e.escapeParameter,L=pe(e.messageCompiler)?e.messageCompiler:eo,T=pe(e.messageResolver)?e.messageResolver:to||l0,C=pe(e.localeFallbacker)?e.localeFallbacker:no||L0,$=ue(e.fallbackContext)?e.fallbackContext:void 0,D=e,R=ue(D.__datetimeFormatters)?D.__datetimeFormatters:new Map,he=ue(D.__numberFormatters)?D.__numberFormatters:new Map,we=ue(D.__meta)?D.__meta:{};Ca++;const Z={version:n,cid:Ca,locale:r,fallbackLocale:a,messages:o,modifiers:c,pluralRules:u,missing:h,missingWarn:d,fallbackWarn:_,fallbackFormat:E,unresolving:v,postTranslation:b,processor:M,warnHtmlMessage:W,escapeParameter:y,messageCompiler:L,messageResolver:T,localeFallbacker:C,fallbackContext:$,onWarn:t,__meta:we};return Z.datetimeFormats=i,Z.numberFormats=l,Z.__datetimeFormatters=R,Z.__numberFormatters=he,__INTLIFY_PROD_DEVTOOLS__&&b0(Z,n,we),Z}function Dr(e,t,n,r,s){const{missing:a,onWarn:o}=e;if(a!==null){const i=a(e,n,t,s);return H(i)?i:t}else return t}function Zt(e,t,n){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,n,t)}function $0(e,t){return e===t?!1:e.split("-")[0]===t.split("-")[0]}function R0(e,t){const n=t.indexOf(e);if(n===-1)return!1;for(let r=n+1;r<t.length;r++)if($0(e,t[r]))return!0;return!1}function Qn(e){return n=>F0(n,e)}function F0(e,t){const n=t.b||t.body;if((n.t||n.type)===1){const r=n,s=r.c||r.cases;return e.plural(s.reduce((a,o)=>[...a,Aa(e,o)],[]))}else return Aa(e,n)}function Aa(e,t){const n=t.s||t.static;if(n)return e.type==="text"?n:e.normalize([n]);{const r=(t.i||t.items).reduce((s,a)=>[...s,mr(e,a)],[]);return e.normalize(r)}}function mr(e,t){const n=t.t||t.type;switch(n){case 3:{const r=t;return r.v||r.value}case 9:{const r=t;return r.v||r.value}case 4:{const r=t;return e.interpolate(e.named(r.k||r.key))}case 5:{const r=t;return e.interpolate(e.list(r.i!=null?r.i:r.index))}case 6:{const r=t,s=r.m||r.modifier;return e.linked(mr(e,r.k||r.key),s?mr(e,s):void 0,e.type)}case 7:{const r=t;return r.v||r.value}case 8:{const r=t;return r.v||r.value}default:throw new Error(`unhandled node type on format message part: ${n}`)}}const so=e=>e;let Rt=Object.create(null);const Ht=e=>ue(e)&&(e.t===0||e.type===0)&&("b"in e||"body"in e);function oo(e,t={}){let n=!1;const r=t.onError||Np;return t.onError=s=>{n=!0,r(s)},{...e0(e,t),detectError:n}}const D0=(e,t)=>{if(!H(e))throw ze(je.NOT_SUPPORT_NON_STRING_MESSAGE);{ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||so)(e),s=Rt[r];if(s)return s;const{code:a,detectError:o}=oo(e,t),i=new Function(`return ${a}`)();return o?i:Rt[r]=i}};function V0(e,t){if(__INTLIFY_JIT_COMPILATION__&&!__INTLIFY_DROP_MESSAGE_COMPILER__&&H(e)){ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||so)(e),s=Rt[r];if(s)return s;const{ast:a,detectError:o}=oo(e,{...t,location:!1,jit:!0}),i=Qn(a);return o?i:Rt[r]=i}else{const n=e.cacheKey;if(n){const r=Rt[n];return r||(Rt[n]=Qn(e))}else return Qn(e)}}const Ta=()=>"",xe=e=>pe(e);function Na(e,...t){const{fallbackFormat:n,postTranslation:r,unresolving:s,messageCompiler:a,fallbackLocale:o,messages:i}=e,[l,c]=pr(...t),u=ae(c.missingWarn)?c.missingWarn:e.missingWarn,h=ae(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,d=ae(c.escapeParameter)?c.escapeParameter:e.escapeParameter,_=!!c.resolvedMessage,E=H(c.default)||ae(c.default)?ae(c.default)?a?l:()=>l:c.default:n?a?l:()=>l:"",v=n||E!=="",b=Fr(e,c);d&&x0(c);let[M,W,y]=_?[l,b,i[b]||{}]:io(e,l,b,o,h,u),L=M,T=l;if(!_&&!(H(L)||Ht(L)||xe(L))&&v&&(L=E,T=L),!_&&(!(H(L)||Ht(L)||xe(L))||!H(W)))return s?Hn:l;let C=!1;const $=()=>{C=!0},D=xe(L)?L:lo(e,l,W,L,T,$);if(C)return L;const R=B0(e,W,y,c),he=_0(R),we=U0(e,D,he),Z=r?r(we,l):we;if(__INTLIFY_PROD_DEVTOOLS__){const V={timestamp:Date.now(),key:H(l)?l:xe(L)?L.key:"",locale:W||(xe(L)?L.locale:""),format:H(L)?L:xe(L)?L.source:"",message:Z};V.meta=Me({},e.__meta,N0()||{}),y0(V)}return Z}function x0(e){_e(e.list)?e.list=e.list.map(t=>H(t)?pa(t):t):ue(e.named)&&Object.keys(e.named).forEach(t=>{H(e.named[t])&&(e.named[t]=pa(e.named[t]))})}function io(e,t,n,r,s,a){const{messages:o,onWarn:i,messageResolver:l,localeFallbacker:c}=e,u=c(e,r,n);let h={},d,_=null;const E="translate";for(let v=0;v<u.length&&(d=u[v],h=o[d]||{},(_=l(h,t))===null&&(_=h[t]),!(H(_)||Ht(_)||xe(_)));v++)if(!R0(d,u)){const b=Dr(e,t,d,a,E);b!==t&&(_=b)}return[_,d,h]}function lo(e,t,n,r,s,a){const{messageCompiler:o,warnHtmlMessage:i}=e;if(xe(r)){const c=r;return c.locale=c.locale||n,c.key=c.key||t,c}if(o==null){const c=()=>r;return c.locale=n,c.key=t,c}const l=o(r,H0(e,n,s,r,i,a));return l.locale=n,l.key=t,l.source=r,l}function U0(e,t,n){return t(n)}function pr(...e){const[t,n,r]=e,s={};if(!H(t)&&!Ie(t)&&!xe(t)&&!Ht(t))throw ze(je.INVALID_ARGUMENT);const a=Ie(t)?String(t):(xe(t),t);return Ie(n)?s.plural=n:H(n)?s.default=n:te(n)&&!xn(n)?s.named=n:_e(n)&&(s.list=n),Ie(r)?s.plural=r:H(r)?s.default=r:te(r)&&Me(s,r),[a,s]}function H0(e,t,n,r,s,a){return{locale:t,key:n,warnHtmlMessage:s,onError:o=>{throw a&&a(o),o},onCacheKey:o=>_p(t,n,o)}}function B0(e,t,n,r){const{modifiers:s,pluralRules:a,messageResolver:o,fallbackLocale:i,fallbackWarn:l,missingWarn:c,fallbackContext:u}=e,d={locale:t,modifiers:s,pluralRules:a,messages:_=>{let E=o(n,_);if(E==null&&u){const[,,v]=io(u,_,t,i,l,c);E=o(v,_)}if(H(E)||Ht(E)){let v=!1;const M=lo(e,_,t,E,_,()=>{v=!0});return v?Ta:M}else return xe(E)?E:Ta}};return e.processor&&(d.processor=e.processor),r.list&&(d.list=r.list),r.named&&(d.named=r.named),Ie(r.plural)&&(d.pluralIndex=r.plural),d}function Ma(e,...t){const{datetimeFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:o}=e,{__datetimeFormatters:i}=e,[l,c,u,h]=gr(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const _=!!u.part,E=Fr(e,u),v=o(e,s,E);if(!H(l)||l==="")return new Intl.DateTimeFormat(E,h).format(c);let b={},M,W=null;const y="datetime format";for(let C=0;C<v.length&&(M=v[C],b=n[M]||{},W=b[l],!te(W));C++)Dr(e,l,M,d,y);if(!te(W)||!H(M))return r?Hn:l;let L=`${M}__${l}`;xn(h)||(L=`${L}__${JSON.stringify(h)}`);let T=i.get(L);return T||(T=new Intl.DateTimeFormat(M,Me({},W,h)),i.set(L,T)),_?T.formatToParts(c):T.format(c)}const co=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function gr(...e){const[t,n,r,s]=e,a={};let o={},i;if(H(t)){const l=t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw ze(je.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();i=new Date(c);try{i.toISOString()}catch{throw ze(je.INVALID_ISO_DATE_ARGUMENT)}}else if(bp(t)){if(isNaN(t.getTime()))throw ze(je.INVALID_DATE_ARGUMENT);i=t}else if(Ie(t))i=t;else throw ze(je.INVALID_ARGUMENT);return H(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{co.includes(l)?o[l]=n[l]:a[l]=n[l]}),H(r)?a.locale=r:te(r)&&(o=r),te(s)&&(o=s),[a.key||"",i,a,o]}function Pa(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__datetimeFormatters.has(a)&&r.__datetimeFormatters.delete(a)}}function $a(e,...t){const{numberFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:o}=e,{__numberFormatters:i}=e,[l,c,u,h]=_r(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const _=!!u.part,E=Fr(e,u),v=o(e,s,E);if(!H(l)||l==="")return new Intl.NumberFormat(E,h).format(c);let b={},M,W=null;const y="number format";for(let C=0;C<v.length&&(M=v[C],b=n[M]||{},W=b[l],!te(W));C++)Dr(e,l,M,d,y);if(!te(W)||!H(M))return r?Hn:l;let L=`${M}__${l}`;xn(h)||(L=`${L}__${JSON.stringify(h)}`);let T=i.get(L);return T||(T=new Intl.NumberFormat(M,Me({},W,h)),i.set(L,T)),_?T.formatToParts(c):T.format(c)}const uo=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function _r(...e){const[t,n,r,s]=e,a={};let o={};if(!Ie(t))throw ze(je.INVALID_ARGUMENT);const i=t;return H(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{uo.includes(l)?o[l]=n[l]:a[l]=n[l]}),H(r)?a.locale=r:te(r)&&(o=r),te(s)&&(o=s),[a.key||"",i,a,o]}function Ra(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__numberFormatters.has(a)&&r.__numberFormatters.delete(a)}}t0();/*!
  * vue-i18n v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const W0="9.13.1";function j0(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(ot().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(ot().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(ot().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(ot().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(ot().__INTLIFY_PROD_DEVTOOLS__=!1)}const ho=w0.__EXTEND_POINT__,rt=Un(ho);rt(),rt(),rt(),rt(),rt(),rt(),rt(),rt(),rt();const fo=je.__EXTEND_POINT__,Fe=Un(fo),Ce={UNEXPECTED_RETURN_TYPE:fo,INVALID_ARGUMENT:Fe(),MUST_BE_CALL_SETUP_TOP:Fe(),NOT_INSTALLED:Fe(),NOT_AVAILABLE_IN_LEGACY_MODE:Fe(),REQUIRED_VALUE:Fe(),INVALID_VALUE:Fe(),CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:Fe(),NOT_INSTALLED_WITH_PROVIDE:Fe(),UNEXPECTED_ERROR:Fe(),NOT_COMPATIBLE_LEGACY_VUE_I18N:Fe(),BRIDGE_SUPPORT_VUE_2_ONLY:Fe(),MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION:Fe(),NOT_AVAILABLE_COMPOSITION_IN_LEGACY:Fe(),__EXTEND_POINT__:Fe()};function Ae(e,...t){return Gt(e,null,void 0)}const vr=bt("__translateVNode"),br=bt("__datetimeParts"),yr=bt("__numberParts"),mo=bt("__setPluralRules"),po=bt("__injectWithOption"),kr=bt("__dispose");function rn(e){if(!ue(e))return e;for(const t in e)if(In(e,t))if(!t.includes("."))ue(e[t])&&rn(e[t]);else{const n=t.split("."),r=n.length-1;let s=e,a=!1;for(let o=0;o<r;o++){if(n[o]in s||(s[n[o]]={}),!ue(s[n[o]])){a=!0;break}s=s[n[o]]}a||(s[n[r]]=e[t],delete e[t]),ue(s[n[r]])&&rn(s[n[r]])}return e}function Bn(e,t){const{messages:n,__i18n:r,messageResolver:s,flatJson:a}=t,o=te(n)?n:_e(r)?{}:{[e]:{}};if(_e(r)&&r.forEach(i=>{if("locale"in i&&"resource"in i){const{locale:l,resource:c}=i;l?(o[l]=o[l]||{},vn(c,o[l])):vn(c,o)}else H(i)&&vn(JSON.parse(i),o)}),s==null&&a)for(const i in o)In(o,i)&&rn(o[i]);return o}function go(e){return e.type}function _o(e,t,n){let r=ue(t.messages)?t.messages:{};"__i18nGlobal"in n&&(r=Bn(e.locale.value,{messages:r,__i18n:n.__i18nGlobal}));const s=Object.keys(r);s.length&&s.forEach(a=>{e.mergeLocaleMessage(a,r[a])});{if(ue(t.datetimeFormats)){const a=Object.keys(t.datetimeFormats);a.length&&a.forEach(o=>{e.mergeDateTimeFormat(o,t.datetimeFormats[o])})}if(ue(t.numberFormats)){const a=Object.keys(t.numberFormats);a.length&&a.forEach(o=>{e.mergeNumberFormat(o,t.numberFormats[o])})}}}function Fa(e){return Y(jo,null,e,0)}const Da="__INTLIFY_META__",Va=()=>[],K0=()=>!1;let xa=0;function Ua(e){return(t,n,r,s)=>e(n,r,Vt()||void 0,s)}const G0=()=>{const e=Vt();let t=null;return e&&(t=go(e)[Da])?{[Da]:t}:null};function Vr(e={},t){const{__root:n,__injectWithOption:r}=e,s=n===void 0,a=e.flatJson,o=On?z:Mn,i=!!e.translateExistCompatible;let l=ae(e.inheritLocale)?e.inheritLocale:!0;const c=o(n&&l?n.locale.value:H(e.locale)?e.locale:Ut),u=o(n&&l?n.fallbackLocale.value:H(e.fallbackLocale)||_e(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:c.value),h=o(Bn(c.value,e)),d=o(te(e.datetimeFormats)?e.datetimeFormats:{[c.value]:{}}),_=o(te(e.numberFormats)?e.numberFormats:{[c.value]:{}});let E=n?n.missingWarn:ae(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,v=n?n.fallbackWarn:ae(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,b=n?n.fallbackRoot:ae(e.fallbackRoot)?e.fallbackRoot:!0,M=!!e.fallbackFormat,W=pe(e.missing)?e.missing:null,y=pe(e.missing)?Ua(e.missing):null,L=pe(e.postTranslation)?e.postTranslation:null,T=n?n.warnHtmlMessage:ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,C=!!e.escapeParameter;const $=n?n.modifiers:te(e.modifiers)?e.modifiers:{};let D=e.pluralRules||n&&n.pluralRules,R;R=(()=>{s&&Ia(null);const O={version:W0,locale:c.value,fallbackLocale:u.value,messages:h.value,modifiers:$,pluralRules:D,missing:y===null?void 0:y,missingWarn:E,fallbackWarn:v,fallbackFormat:M,unresolving:!0,postTranslation:L===null?void 0:L,warnHtmlMessage:T,escapeParameter:C,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};O.datetimeFormats=d.value,O.numberFormats=_.value,O.__datetimeFormatters=te(R)?R.__datetimeFormatters:void 0,O.__numberFormatters=te(R)?R.__numberFormatters:void 0;const P=P0(O);return s&&Ia(P),P})(),Zt(R,c.value,u.value);function we(){return[c.value,u.value,h.value,d.value,_.value]}const Z=U({get:()=>c.value,set:O=>{c.value=O,R.locale=c.value}}),V=U({get:()=>u.value,set:O=>{u.value=O,R.fallbackLocale=u.value,Zt(R,c.value,O)}}),ie=U(()=>h.value),Ee=U(()=>d.value),Oe=U(()=>_.value);function ve(){return pe(L)?L:null}function Ue(O){L=O,R.postTranslation=O}function tt(){return W}function be(O){O!==null&&(y=Ua(O)),W=O,R.missing=y}const Le=(O,P,me,Se,dt,dn)=>{we();let At;try{__INTLIFY_PROD_DEVTOOLS__,s||(R.fallbackContext=n?M0():void 0),At=O(R)}finally{__INTLIFY_PROD_DEVTOOLS__,s||(R.fallbackContext=void 0)}if(me!=="translate exists"&&Ie(At)&&At===Hn||me==="translate exists"&&!At){const[Lo,Sg]=P();return n&&b?Se(n):dt(Lo)}else{if(dn(At))return At;throw Ae(Ce.UNEXPECTED_RETURN_TYPE)}};function He(...O){return Le(P=>Reflect.apply(Na,null,[P,...O]),()=>pr(...O),"translate",P=>Reflect.apply(P.t,P,[...O]),P=>P,P=>H(P))}function j(...O){const[P,me,Se]=O;if(Se&&!ue(Se))throw Ae(Ce.INVALID_ARGUMENT);return He(P,me,Me({resolvedMessage:!0},Se||{}))}function le(...O){return Le(P=>Reflect.apply(Ma,null,[P,...O]),()=>gr(...O),"datetime format",P=>Reflect.apply(P.d,P,[...O]),()=>Ea,P=>H(P))}function oe(...O){return Le(P=>Reflect.apply($a,null,[P,...O]),()=>_r(...O),"number format",P=>Reflect.apply(P.n,P,[...O]),()=>Ea,P=>H(P))}function fe(O){return O.map(P=>H(P)||Ie(P)||ae(P)?Fa(String(P)):P)}const Ge={normalize:fe,interpolate:O=>O,type:"vnode"};function kt(...O){return Le(P=>{let me;const Se=P;try{Se.processor=Ge,me=Reflect.apply(Na,null,[Se,...O])}finally{Se.processor=null}return me},()=>pr(...O),"translate",P=>P[vr](...O),P=>[Fa(P)],P=>_e(P))}function ut(...O){return Le(P=>Reflect.apply($a,null,[P,...O]),()=>_r(...O),"number format",P=>P[yr](...O),Va,P=>H(P)||_e(P))}function Yt(...O){return Le(P=>Reflect.apply(Ma,null,[P,...O]),()=>gr(...O),"datetime format",P=>P[br](...O),Va,P=>H(P)||_e(P))}function zt(O){D=O,R.pluralRules=D}function Xt(O,P){return Le(()=>{if(!O)return!1;const me=H(P)?P:c.value,Se=It(me),dt=R.messageResolver(Se,O);return i?dt!=null:Ht(dt)||xe(dt)||H(dt)},()=>[O],"translate exists",me=>Reflect.apply(me.te,me,[O,P]),K0,me=>ae(me))}function F(O){let P=null;const me=Zs(R,u.value,c.value);for(let Se=0;Se<me.length;Se++){const dt=h.value[me[Se]]||{},dn=R.messageResolver(dt,O);if(dn!=null){P=dn;break}}return P}function ce(O){const P=F(O);return P??(n?n.tm(O)||{}:{})}function It(O){return h.value[O]||{}}function Ct(O,P){if(a){const me={[O]:P};for(const Se in me)In(me,Se)&&rn(me[Se]);P=me[O]}h.value[O]=P,R.messages=h.value}function qt(O,P){h.value[O]=h.value[O]||{};const me={[O]:P};if(a)for(const Se in me)In(me,Se)&&rn(me[Se]);P=me[O],vn(P,h.value[O]),R.messages=h.value}function jn(O){return d.value[O]||{}}function f(O,P){d.value[O]=P,R.datetimeFormats=d.value,Pa(R,O,P)}function m(O,P){d.value[O]=Me(d.value[O]||{},P),R.datetimeFormats=d.value,Pa(R,O,P)}function N(O){return _.value[O]||{}}function q(O,P){_.value[O]=P,R.numberFormats=_.value,Ra(R,O,P)}function ye(O,P){_.value[O]=Me(_.value[O]||{},P),R.numberFormats=_.value,Ra(R,O,P)}xa++,n&&On&&(ke(n.locale,O=>{l&&(c.value=O,R.locale=O,Zt(R,c.value,u.value))}),ke(n.fallbackLocale,O=>{l&&(u.value=O,R.fallbackLocale=O,Zt(R,c.value,u.value))}));const ne={id:xa,locale:Z,fallbackLocale:V,get inheritLocale(){return l},set inheritLocale(O){l=O,O&&n&&(c.value=n.locale.value,u.value=n.fallbackLocale.value,Zt(R,c.value,u.value))},get availableLocales(){return Object.keys(h.value).sort()},messages:ie,get modifiers(){return $},get pluralRules(){return D||{}},get isGlobal(){return s},get missingWarn(){return E},set missingWarn(O){E=O,R.missingWarn=E},get fallbackWarn(){return v},set fallbackWarn(O){v=O,R.fallbackWarn=v},get fallbackRoot(){return b},set fallbackRoot(O){b=O},get fallbackFormat(){return M},set fallbackFormat(O){M=O,R.fallbackFormat=M},get warnHtmlMessage(){return T},set warnHtmlMessage(O){T=O,R.warnHtmlMessage=O},get escapeParameter(){return C},set escapeParameter(O){C=O,R.escapeParameter=O},t:He,getLocaleMessage:It,setLocaleMessage:Ct,mergeLocaleMessage:qt,getPostTranslationHandler:ve,setPostTranslationHandler:Ue,getMissingHandler:tt,setMissingHandler:be,[mo]:zt};return ne.datetimeFormats=Ee,ne.numberFormats=Oe,ne.rt=j,ne.te=Xt,ne.tm=ce,ne.d=le,ne.n=oe,ne.getDateTimeFormat=jn,ne.setDateTimeFormat=f,ne.mergeDateTimeFormat=m,ne.getNumberFormat=N,ne.setNumberFormat=q,ne.mergeNumberFormat=ye,ne[po]=r,ne[vr]=kt,ne[br]=Yt,ne[yr]=ut,ne}function Y0(e){const t=H(e.locale)?e.locale:Ut,n=H(e.fallbackLocale)||_e(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:t,r=pe(e.missing)?e.missing:void 0,s=ae(e.silentTranslationWarn)||pt(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,a=ae(e.silentFallbackWarn)||pt(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,o=ae(e.fallbackRoot)?e.fallbackRoot:!0,i=!!e.formatFallbackMessages,l=te(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,u=pe(e.postTranslation)?e.postTranslation:void 0,h=H(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,d=!!e.escapeParameterHtml,_=ae(e.sync)?e.sync:!0;let E=e.messages;if(te(e.sharedMessages)){const C=e.sharedMessages;E=Object.keys(C).reduce((D,R)=>{const he=D[R]||(D[R]={});return Me(he,C[R]),D},E||{})}const{__i18n:v,__root:b,__injectWithOption:M}=e,W=e.datetimeFormats,y=e.numberFormats,L=e.flatJson,T=e.translateExistCompatible;return{locale:t,fallbackLocale:n,messages:E,flatJson:L,datetimeFormats:W,numberFormats:y,missing:r,missingWarn:s,fallbackWarn:a,fallbackRoot:o,fallbackFormat:i,modifiers:l,pluralRules:c,postTranslation:u,warnHtmlMessage:h,escapeParameter:d,messageResolver:e.messageResolver,inheritLocale:_,translateExistCompatible:T,__i18n:v,__root:b,__injectWithOption:M}}function wr(e={},t){{const n=Vr(Y0(e)),{__extender:r}=e,s={id:n.id,get locale(){return n.locale.value},set locale(a){n.locale.value=a},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(a){n.fallbackLocale.value=a},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get formatter(){return{interpolate(){return[]}}},set formatter(a){},get missing(){return n.getMissingHandler()},set missing(a){n.setMissingHandler(a)},get silentTranslationWarn(){return ae(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(a){n.missingWarn=ae(a)?!a:a},get silentFallbackWarn(){return ae(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(a){n.fallbackWarn=ae(a)?!a:a},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(a){n.fallbackFormat=a},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(a){n.setPostTranslationHandler(a)},get sync(){return n.inheritLocale},set sync(a){n.inheritLocale=a},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(a){n.warnHtmlMessage=a!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(a){n.escapeParameter=a},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(a){},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...a){const[o,i,l]=a,c={};let u=null,h=null;if(!H(o))throw Ae(Ce.INVALID_ARGUMENT);const d=o;return H(i)?c.locale=i:_e(i)?u=i:te(i)&&(h=i),_e(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},rt(...a){return Reflect.apply(n.rt,n,[...a])},tc(...a){const[o,i,l]=a,c={plural:1};let u=null,h=null;if(!H(o))throw Ae(Ce.INVALID_ARGUMENT);const d=o;return H(i)?c.locale=i:Ie(i)?c.plural=i:_e(i)?u=i:te(i)&&(h=i),H(l)?c.locale=l:_e(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},te(a,o){return n.te(a,o)},tm(a){return n.tm(a)},getLocaleMessage(a){return n.getLocaleMessage(a)},setLocaleMessage(a,o){n.setLocaleMessage(a,o)},mergeLocaleMessage(a,o){n.mergeLocaleMessage(a,o)},d(...a){return Reflect.apply(n.d,n,[...a])},getDateTimeFormat(a){return n.getDateTimeFormat(a)},setDateTimeFormat(a,o){n.setDateTimeFormat(a,o)},mergeDateTimeFormat(a,o){n.mergeDateTimeFormat(a,o)},n(...a){return Reflect.apply(n.n,n,[...a])},getNumberFormat(a){return n.getNumberFormat(a)},setNumberFormat(a,o){n.setNumberFormat(a,o)},mergeNumberFormat(a,o){n.mergeNumberFormat(a,o)},getChoiceIndex(a,o){return-1}};return s.__extender=r,s}}const xr={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function z0({slots:e},t){return t.length===1&&t[0]==="default"?(e.default?e.default():[]).reduce((r,s)=>[...r,...s.type===ge?s.children:[s]],[]):t.reduce((n,r)=>{const s=e[r];return s&&(n[r]=s()),n},{})}function vo(e){return ge}const X0=x({name:"i18n-t",props:Me({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Ie(e)||!isNaN(e)}},xr),setup(e,t){const{slots:n,attrs:r}=t,s=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return()=>{const a=Object.keys(n).filter(h=>h!=="_"),o={};e.locale&&(o.locale=e.locale),e.plural!==void 0&&(o.plural=H(e.plural)?+e.plural:e.plural);const i=z0(t,a),l=s[vr](e.keypath,i,o),c=Me({},r),u=H(e.tag)||ue(e.tag)?e.tag:vo();return Dt(u,c,l)}}}),Ha=X0;function q0(e){return _e(e)&&!H(e[0])}function bo(e,t,n,r){const{slots:s,attrs:a}=t;return()=>{const o={part:!0};let i={};e.locale&&(o.locale=e.locale),H(e.format)?o.key=e.format:ue(e.format)&&(H(e.format.key)&&(o.key=e.format.key),i=Object.keys(e.format).reduce((d,_)=>n.includes(_)?Me({},d,{[_]:e.format[_]}):d,{}));const l=r(e.value,o,i);let c=[o.key];_e(l)?c=l.map((d,_)=>{const E=s[d.type],v=E?E({[d.type]:d.value,index:_,parts:l}):[d.value];return q0(v)&&(v[0].key=`${d.type}-${_}`),v}):H(l)&&(c=[l]);const u=Me({},a),h=H(e.tag)||ue(e.tag)?e.tag:vo();return Dt(h,u,c)}}const J0=x({name:"i18n-n",props:Me({value:{type:Number,required:!0},format:{type:[String,Object]}},xr),setup(e,t){const n=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return bo(e,t,uo,(...r)=>n[yr](...r))}}),Ba=J0,Q0=x({name:"i18n-d",props:Me({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},xr),setup(e,t){const n=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return bo(e,t,co,(...r)=>n[br](...r))}}),Wa=Q0;function Z0(e,t){const n=e;if(e.mode==="composition")return n.__getInstance(t)||e.global;{const r=n.__getInstance(t);return r!=null?r.__composer:e.global.__composer}}function eg(e){const t=o=>{const{instance:i,modifiers:l,value:c}=o;if(!i||!i.$)throw Ae(Ce.UNEXPECTED_ERROR);const u=Z0(e,i.$),h=ja(c);return[Reflect.apply(u.t,u,[...Ka(h)]),u]};return{created:(o,i)=>{const[l,c]=t(i);On&&e.global===c&&(o.__i18nWatcher=ke(c.locale,()=>{i.instance&&i.instance.$forceUpdate()})),o.__composer=c,o.textContent=l},unmounted:o=>{On&&o.__i18nWatcher&&(o.__i18nWatcher(),o.__i18nWatcher=void 0,delete o.__i18nWatcher),o.__composer&&(o.__composer=void 0,delete o.__composer)},beforeUpdate:(o,{value:i})=>{if(o.__composer){const l=o.__composer,c=ja(i);o.textContent=Reflect.apply(l.t,l,[...Ka(c)])}},getSSRProps:o=>{const[i]=t(o);return{textContent:i}}}}function ja(e){if(H(e))return{path:e};if(te(e)){if(!("path"in e))throw Ae(Ce.REQUIRED_VALUE,"path");return e}else throw Ae(Ce.INVALID_VALUE)}function Ka(e){const{path:t,locale:n,args:r,choice:s,plural:a}=e,o={},i=r||{};return H(n)&&(o.locale=n),Ie(s)&&(o.plural=s),Ie(a)&&(o.plural=a),[t,i,o]}function tg(e,t,...n){const r=te(n[0])?n[0]:{},s=!!r.useI18nComponentName;(ae(r.globalInstall)?r.globalInstall:!0)&&([s?"i18n":Ha.name,"I18nT"].forEach(o=>e.component(o,Ha)),[Ba.name,"I18nN"].forEach(o=>e.component(o,Ba)),[Wa.name,"I18nD"].forEach(o=>e.component(o,Wa))),e.directive("t",eg(t))}function ng(e,t,n){return{beforeCreate(){const r=Vt();if(!r)throw Ae(Ce.UNEXPECTED_ERROR);const s=this.$options;if(s.i18n){const a=s.i18n;if(s.__i18n&&(a.__i18n=s.__i18n),a.__root=t,this===this.$root)this.$i18n=Ga(e,a);else{a.__injectWithOption=!0,a.__extender=n.__vueI18nExtend,this.$i18n=wr(a);const o=this.$i18n;o.__extender&&(o.__disposer=o.__extender(this.$i18n))}}else if(s.__i18n)if(this===this.$root)this.$i18n=Ga(e,s);else{this.$i18n=wr({__i18n:s.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:t});const a=this.$i18n;a.__extender&&(a.__disposer=a.__extender(this.$i18n))}else this.$i18n=e;s.__i18nGlobal&&_o(t,s,s),this.$t=(...a)=>this.$i18n.t(...a),this.$rt=(...a)=>this.$i18n.rt(...a),this.$tc=(...a)=>this.$i18n.tc(...a),this.$te=(a,o)=>this.$i18n.te(a,o),this.$d=(...a)=>this.$i18n.d(...a),this.$n=(...a)=>this.$i18n.n(...a),this.$tm=a=>this.$i18n.tm(a),n.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=Vt();if(!r)throw Ae(Ce.UNEXPECTED_ERROR);const s=this.$i18n;delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,s.__disposer&&(s.__disposer(),delete s.__disposer,delete s.__extender),n.__deleteInstance(r),delete this.$i18n}}}function Ga(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[mo](t.pluralizationRules||e.pluralizationRules);const n=Bn(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(n).forEach(r=>e.mergeLocaleMessage(r,n[r])),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,t.datetimeFormats[r])),t.numberFormats&&Object.keys(t.numberFormats).forEach(r=>e.mergeNumberFormat(r,t.numberFormats[r])),e}const rg=bt("global-vue-i18n");function ag(e={},t){const n=__VUE_I18N_LEGACY_API__&&ae(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,r=ae(e.globalInjection)?e.globalInjection:!0,s=__VUE_I18N_LEGACY_API__&&n?!!e.allowComposition:!0,a=new Map,[o,i]=sg(e,n),l=bt("");function c(d){return a.get(d)||null}function u(d,_){a.set(d,_)}function h(d){a.delete(d)}{const d={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},get allowComposition(){return s},async install(_,...E){if(_.__VUE_I18N_SYMBOL__=l,_.provide(_.__VUE_I18N_SYMBOL__,d),te(E[0])){const M=E[0];d.__composerExtend=M.__composerExtend,d.__vueI18nExtend=M.__vueI18nExtend}let v=null;!n&&r&&(v=mg(_,d.global)),__VUE_I18N_FULL_INSTALL__&&tg(_,d,...E),__VUE_I18N_LEGACY_API__&&n&&_.mixin(ng(i,i.__composer,d));const b=_.unmount;_.unmount=()=>{v&&v(),d.dispose(),b()}},get global(){return i},dispose(){o.stop()},__instances:a,__getInstance:c,__setInstance:u,__deleteInstance:h};return d}}function Wn(e={}){const t=Vt();if(t==null)throw Ae(Ce.MUST_BE_CALL_SETUP_TOP);if(!t.isCE&&t.appContext.app!=null&&!t.appContext.app.__VUE_I18N_SYMBOL__)throw Ae(Ce.NOT_INSTALLED);const n=og(t),r=lg(n),s=go(t),a=ig(e,s);if(__VUE_I18N_LEGACY_API__&&n.mode==="legacy"&&!e.__useComponent){if(!n.allowComposition)throw Ae(Ce.NOT_AVAILABLE_IN_LEGACY_MODE);return hg(t,a,r,e)}if(a==="global")return _o(r,e,s),r;if(a==="parent"){let l=cg(n,t,e.__useComponent);return l==null&&(l=r),l}const o=n;let i=o.__getInstance(t);if(i==null){const l=Me({},e);"__i18n"in s&&(l.__i18n=s.__i18n),r&&(l.__root=r),i=Vr(l),o.__composerExtend&&(i[kr]=o.__composerExtend(i)),dg(o,t,i),o.__setInstance(t,i)}return i}function sg(e,t,n){const r=Ho();{const s=__VUE_I18N_LEGACY_API__&&t?r.run(()=>wr(e)):r.run(()=>Vr(e));if(s==null)throw Ae(Ce.UNEXPECTED_ERROR);return[r,s]}}function og(e){{const t=Bt(e.isCE?rg:e.appContext.app.__VUE_I18N_SYMBOL__);if(!t)throw Ae(e.isCE?Ce.NOT_INSTALLED_WITH_PROVIDE:Ce.UNEXPECTED_ERROR);return t}}function ig(e,t){return xn(e)?"__i18n"in t?"local":"global":e.useScope?e.useScope:"local"}function lg(e){return e.mode==="composition"?e.global:e.global.__composer}function cg(e,t,n=!1){let r=null;const s=t.root;let a=ug(t,n);for(;a!=null;){const o=e;if(e.mode==="composition")r=o.__getInstance(a);else if(__VUE_I18N_LEGACY_API__){const i=o.__getInstance(a);i!=null&&(r=i.__composer,n&&r&&!r[po]&&(r=null))}if(r!=null||s===a)break;a=a.parent}return r}function ug(e,t=!1){return e==null?null:t&&e.vnode.ctx||e.parent}function dg(e,t,n){Ke(()=>{},t),Nn(()=>{const r=n;e.__deleteInstance(t);const s=r[kr];s&&(s(),delete r[kr])},t)}function hg(e,t,n,r={}){const s=t==="local",a=Mn(null);if(s&&e.proxy&&!(e.proxy.$options.i18n||e.proxy.$options.__i18n))throw Ae(Ce.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);const o=ae(r.inheritLocale)?r.inheritLocale:!H(r.locale),i=z(!s||o?n.locale.value:H(r.locale)?r.locale:Ut),l=z(!s||o?n.fallbackLocale.value:H(r.fallbackLocale)||_e(r.fallbackLocale)||te(r.fallbackLocale)||r.fallbackLocale===!1?r.fallbackLocale:i.value),c=z(Bn(i.value,r)),u=z(te(r.datetimeFormats)?r.datetimeFormats:{[i.value]:{}}),h=z(te(r.numberFormats)?r.numberFormats:{[i.value]:{}}),d=s?n.missingWarn:ae(r.missingWarn)||pt(r.missingWarn)?r.missingWarn:!0,_=s?n.fallbackWarn:ae(r.fallbackWarn)||pt(r.fallbackWarn)?r.fallbackWarn:!0,E=s?n.fallbackRoot:ae(r.fallbackRoot)?r.fallbackRoot:!0,v=!!r.fallbackFormat,b=pe(r.missing)?r.missing:null,M=pe(r.postTranslation)?r.postTranslation:null,W=s?n.warnHtmlMessage:ae(r.warnHtmlMessage)?r.warnHtmlMessage:!0,y=!!r.escapeParameter,L=s?n.modifiers:te(r.modifiers)?r.modifiers:{},T=r.pluralRules||s&&n.pluralRules;function C(){return[i.value,l.value,c.value,u.value,h.value]}const $=U({get:()=>a.value?a.value.locale.value:i.value,set:F=>{a.value&&(a.value.locale.value=F),i.value=F}}),D=U({get:()=>a.value?a.value.fallbackLocale.value:l.value,set:F=>{a.value&&(a.value.fallbackLocale.value=F),l.value=F}}),R=U(()=>a.value?a.value.messages.value:c.value),he=U(()=>u.value),we=U(()=>h.value);function Z(){return a.value?a.value.getPostTranslationHandler():M}function V(F){a.value&&a.value.setPostTranslationHandler(F)}function ie(){return a.value?a.value.getMissingHandler():b}function Ee(F){a.value&&a.value.setMissingHandler(F)}function Oe(F){return C(),F()}function ve(...F){return a.value?Oe(()=>Reflect.apply(a.value.t,null,[...F])):Oe(()=>"")}function Ue(...F){return a.value?Reflect.apply(a.value.rt,null,[...F]):""}function tt(...F){return a.value?Oe(()=>Reflect.apply(a.value.d,null,[...F])):Oe(()=>"")}function be(...F){return a.value?Oe(()=>Reflect.apply(a.value.n,null,[...F])):Oe(()=>"")}function Le(F){return a.value?a.value.tm(F):{}}function He(F,ce){return a.value?a.value.te(F,ce):!1}function j(F){return a.value?a.value.getLocaleMessage(F):{}}function le(F,ce){a.value&&(a.value.setLocaleMessage(F,ce),c.value[F]=ce)}function oe(F,ce){a.value&&a.value.mergeLocaleMessage(F,ce)}function fe(F){return a.value?a.value.getDateTimeFormat(F):{}}function De(F,ce){a.value&&(a.value.setDateTimeFormat(F,ce),u.value[F]=ce)}function Ge(F,ce){a.value&&a.value.mergeDateTimeFormat(F,ce)}function kt(F){return a.value?a.value.getNumberFormat(F):{}}function ut(F,ce){a.value&&(a.value.setNumberFormat(F,ce),h.value[F]=ce)}function Yt(F,ce){a.value&&a.value.mergeNumberFormat(F,ce)}const zt={get id(){return a.value?a.value.id:-1},locale:$,fallbackLocale:D,messages:R,datetimeFormats:he,numberFormats:we,get inheritLocale(){return a.value?a.value.inheritLocale:o},set inheritLocale(F){a.value&&(a.value.inheritLocale=F)},get availableLocales(){return a.value?a.value.availableLocales:Object.keys(c.value)},get modifiers(){return a.value?a.value.modifiers:L},get pluralRules(){return a.value?a.value.pluralRules:T},get isGlobal(){return a.value?a.value.isGlobal:!1},get missingWarn(){return a.value?a.value.missingWarn:d},set missingWarn(F){a.value&&(a.value.missingWarn=F)},get fallbackWarn(){return a.value?a.value.fallbackWarn:_},set fallbackWarn(F){a.value&&(a.value.missingWarn=F)},get fallbackRoot(){return a.value?a.value.fallbackRoot:E},set fallbackRoot(F){a.value&&(a.value.fallbackRoot=F)},get fallbackFormat(){return a.value?a.value.fallbackFormat:v},set fallbackFormat(F){a.value&&(a.value.fallbackFormat=F)},get warnHtmlMessage(){return a.value?a.value.warnHtmlMessage:W},set warnHtmlMessage(F){a.value&&(a.value.warnHtmlMessage=F)},get escapeParameter(){return a.value?a.value.escapeParameter:y},set escapeParameter(F){a.value&&(a.value.escapeParameter=F)},t:ve,getPostTranslationHandler:Z,setPostTranslationHandler:V,getMissingHandler:ie,setMissingHandler:Ee,rt:Ue,d:tt,n:be,tm:Le,te:He,getLocaleMessage:j,setLocaleMessage:le,mergeLocaleMessage:oe,getDateTimeFormat:fe,setDateTimeFormat:De,mergeDateTimeFormat:Ge,getNumberFormat:kt,setNumberFormat:ut,mergeNumberFormat:Yt};function Xt(F){F.locale.value=i.value,F.fallbackLocale.value=l.value,Object.keys(c.value).forEach(ce=>{F.mergeLocaleMessage(ce,c.value[ce])}),Object.keys(u.value).forEach(ce=>{F.mergeDateTimeFormat(ce,u.value[ce])}),Object.keys(h.value).forEach(ce=>{F.mergeNumberFormat(ce,h.value[ce])}),F.escapeParameter=y,F.fallbackFormat=v,F.fallbackRoot=E,F.fallbackWarn=_,F.missingWarn=d,F.warnHtmlMessage=W}return Bo(()=>{if(e.proxy==null||e.proxy.$i18n==null)throw Ae(Ce.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const F=a.value=e.proxy.$i18n.__composer;t==="global"?(i.value=F.locale.value,l.value=F.fallbackLocale.value,c.value=F.messages.value,u.value=F.datetimeFormats.value,h.value=F.numberFormats.value):s&&Xt(F)}),zt}const fg=["locale","fallbackLocale","availableLocales"],Ya=["t","rt","d","n","tm","te"];function mg(e,t){const n=Object.create(null);return fg.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a)throw Ae(Ce.UNEXPECTED_ERROR);const o=Wo(a.value)?{get(){return a.value.value},set(i){a.value.value=i}}:{get(){return a.get&&a.get()}};Object.defineProperty(n,s,o)}),e.config.globalProperties.$i18n=n,Ya.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a||!a.value)throw Ae(Ce.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${s}`,a)}),()=>{delete e.config.globalProperties.$i18n,Ya.forEach(s=>{delete e.config.globalProperties[`$${s}`]})}}j0();__INTLIFY_JIT_COMPILATION__?Oa(V0):Oa(D0);C0(c0);A0(Zs);if(__INTLIFY_PROD_DEVTOOLS__){const e=ot();e.__INTLIFY__=!0,v0(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const yo=()=>{const e=Bt("$env"),{t,locale:n}=Wn();return{locale:n,$env:e,t}},pg={class:"text-slate-600 text-base mt-2"},gg={class:"flex flex-row justify-start items-start mt-4"},_g={class:"relative h-14"},vg=["label","status"],bg={key:0,class:"absolute bottom-0 left-0 text-sm text-[#ff4d4f]"},yg={class:"text-[#3451b2] text-base"},kg=x({__name:"TOTP",setup(e){const{t,$env:n,locale:r}=yo(),s=z(""),a=z(Mt.NORMAL),o=z(""),i=z({code:"",expires:""}),l=u=>{s.value=u.detail.value,a.value=Mt.NORMAL},c=()=>{if(s.value.length<=0)o.value=t("components_totp_3"),a.value=Mt.ERROR;else try{const{otp:u,expires:h}=rp.generate(s.value);i.value.code=u,i.value.expires=op(h).format()}catch{o.value=t("components_totp_5"),a.value=Mt.ERROR}};return(u,h)=>(p(),I("div",null,[w("div",pg,re(g(t)("components_totp_6")),1),w("div",gg,[w("div",_g,[w("r-input",{label:g(t)("components_totp_2"),class:"w-64 h-8 rounded-lg block text-lg",status:a.value,onInput:l},null,40,vg),a.value===g(Mt).ERROR?(p(),I("div",bg,re(o.value),1)):G("",!0)]),w("r-button",{class:"ml-1 h-8",onClick:c},re(g(t)("components_totp_1")),1)]),w("div",yg,[w("div",null,"code: "+re(i.value.code),1),w("div",null,re(g(t)("components_totp_4"))+": "+re(i.value.expires),1)])]))}}),ko=fr.locale,Ft=ag({legacy:!1,locale:ko,fallbackLocale:un.EN,messages:hp,devtools:!1}),Zn=e=>(Ft.mode===Ks.LEGACY?Ft.global.locale=e:Ft.global.locale.value=e,e),wg=(e,t=ko)=>{Ft.global.mergeLocaleMessage(t,e)},wo=e=>e?Ft.global.locale===e||ha.includes(e)?Promise.resolve(Zn(e)):Ko(Object.assign({"./en.json":()=>wn(()=>import("./en.Bkn4-Vvy.js"),[]),"./zh-CN.json":()=>wn(()=>import("./zh-CN.PUkQxDBJ.js"),[])}),`./${e}.json`,2).then(t=>(wg(t.default,e),ha.push(e),Zn(e))):Promise.reject("lang is undefined"),Lg=x({__name:"Layout",setup(e){const{$env:t,locale:n}=yo(),{lang:r}=bn(),s=()=>{const a=r.value||un.EN;n.value=a,t.locale=a,wo(a).catch(o=>{console.log("error",o)}),ap(js,a)};return gt(()=>{s()}),Ke(()=>{cp()}),(a,o)=>(p(),X(g(Cs).Layout))}}),Eg=()=>{wn(()=>import("./pwa-install.es.Boqgbkxy.js"),[]).then(()=>{let e=document.getElementById(fa);e||(e=document.createElement(fp),e.setAttribute("manifest-url",mp),e.setAttribute("id",fa),document.body.appendChild(e))})},Mg={extends:Cs,enhanceApp({app:e,router:t,siteData:n}){wn(()=>import("./index.R2KlXi5a.js").then(s=>s.i),__vite__mapDeps([0,1])),Eg(),e.use(gp);const r=sp(js)||un.EN;wo(r).then(()=>{lp("__VUE_PROD_DEVTOOLS__",!1),e.use(Ft),e.component("Layout",Lg),e.component("TOTP",kg)}).catch(s=>{console.log("error",s)})}};export{Mg as R};
