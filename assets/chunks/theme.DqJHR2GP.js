const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/index.DJu_DrSV.js","assets/chunks/framework.Bda4bexJ.js"])))=>i.map(i=>d[i]);
import{d as V,o as f,c as I,r as S,a as Ze,t as re,n as de,b as X,w as A,e as G,T as An,_ as q,u as bn,i as Eo,f as So,g as Tn,h as U,j as k,k as g,p as Te,l as Ne,m as St,q as er,s as z,v as we,x as gt,y as Ke,z as Nn,A as Lr,B as Oo,C as Io,D as _t,F as ge,E as $e,G as Mn,H as Pn,I as Y,J as zs,K as Xe,L as sn,M as pt,N as Bt,O as Co,P as Xs,Q as Ao,R as it,S as Js,U as $n,V as To,W as tn,X as Er,Y as Rn,Z as No,$ as yn,a0 as wn,a1 as Mo,a2 as xt,a3 as qs,a4 as Qs,a5 as Dt,a6 as Po,a7 as $o,a8 as Ro,a9 as Fo,aa as Zs,ab as xo,ac as Do,ad as Vo,ae as Uo,af as Ho,ag as Bo,ah as Wo,ai as jo,aj as Ko,ak as kn}from"./framework.Bda4bexJ.js";const Go=V({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(t,n)=>(f(),I("span",{class:de(["VPBadge",t.type])},[S(t.$slots,"default",{},()=>[Ze(re(t.text),1)])],2))}}),Yo={key:0,class:"VPBackdrop"},zo=V({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(t,n)=>(f(),X(An,{name:"fade"},{default:A(()=>[t.show?(f(),I("div",Yo)):G("",!0)]),_:1}))}}),Xo=q(zo,[["__scopeId","data-v-2bff0ce9"]]),ae=bn;function Jo(e,t){let n,r=!1;return()=>{n&&clearTimeout(n),r?n=setTimeout(e,t):(e(),(r=!0)&&setTimeout(()=>r=!1,t))}}function tr(e){return/^\//.test(e)?e:`/${e}`}function Sr(e){const{pathname:t,search:n,hash:r,protocol:a}=new URL(e,"http://a.com");if(Eo(e)||e.startsWith("#")||!a.startsWith("http")||!So(t))return e;const{site:s}=ae(),o=t.endsWith("/")||t.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${t.replace(/(\.md)?$/,s.value.cleanUrls?"":".html")}${n}${r}`);return Tn(o)}function an({correspondingLink:e=!1}={}){const{site:t,localeIndex:n,page:r,theme:a,hash:s}=ae(),o=U(()=>{var l,c;return{label:(l=t.value.locales[n.value])==null?void 0:l.label,link:((c=t.value.locales[n.value])==null?void 0:c.link)||(n.value==="root"?"/":`/${n.value}/`)}});return{localeLinks:U(()=>Object.entries(t.value.locales).flatMap(([l,c])=>o.value.label===c.label?[]:{text:c.label,link:qo(c.link||(l==="root"?"/":`/${l}/`),a.value.i18nRouting!==!1&&e,r.value.relativePath.slice(o.value.link.length-1),!t.value.cleanUrls)+s.value})),currentLang:o}}function qo(e,t,n,r){return t?e.replace(/\/$/,"")+tr(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):e}const Qo=e=>(Te("data-v-baf2b25f"),e=e(),Ne(),e),Zo={class:"NotFound"},ei={class:"code"},ti={class:"title"},ni=Qo(()=>k("div",{class:"divider"},null,-1)),ri={class:"quote"},si={class:"action"},ai=["href","aria-label"],oi=V({__name:"NotFound",setup(e){const{theme:t}=ae(),{currentLang:n}=an();return(r,a)=>{var s,o,i,l,c;return f(),I("div",Zo,[k("p",ei,re(((s=g(t).notFound)==null?void 0:s.code)??"404"),1),k("h1",ti,re(((o=g(t).notFound)==null?void 0:o.title)??"PAGE NOT FOUND"),1),ni,k("blockquote",ri,re(((i=g(t).notFound)==null?void 0:i.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),k("div",si,[k("a",{class:"link",href:g(Tn)(g(n).link),"aria-label":((l=g(t).notFound)==null?void 0:l.linkLabel)??"go to home"},re(((c=g(t).notFound)==null?void 0:c.linkText)??"Take me home"),9,ai)])])}}}),ii=q(oi,[["__scopeId","data-v-baf2b25f"]]);function ea(e,t){if(Array.isArray(e))return fn(e);if(e==null)return[];t=tr(t);const n=Object.keys(e).sort((a,s)=>s.split("/").length-a.split("/").length).find(a=>t.startsWith(tr(a))),r=n?e[n]:[];return Array.isArray(r)?fn(r):fn(r.items,r.base)}function li(e){const t=[];let n=0;for(const r in e){const a=e[r];if(a.items){n=t.push(a);continue}t[n]||t.push({items:[]}),t[n].items.push(a)}return t}function ci(e){const t=[];function n(r){for(const a of r)a.text&&a.link&&t.push({text:a.text,link:a.link,docFooterText:a.docFooterText}),a.items&&n(a.items)}return n(e),t}function nr(e,t){return Array.isArray(t)?t.some(n=>nr(e,n)):St(e,t.link)?!0:t.items?nr(e,t.items):!1}function fn(e,t){return[...e].map(n=>{const r={...n},a=r.base||t;return a&&r.link&&(r.link=a+r.link),r.items&&(r.items=fn(r.items,a)),r})}function ct(){const{frontmatter:e,page:t,theme:n}=ae(),r=er("(min-width: 960px)"),a=z(!1),s=U(()=>{const v=n.value.sidebar,b=t.value.relativePath;return v?ea(v,b):[]}),o=z(s.value);we(s,(v,b)=>{JSON.stringify(v)!==JSON.stringify(b)&&(o.value=s.value)});const i=U(()=>e.value.sidebar!==!1&&o.value.length>0&&e.value.layout!=="home"),l=U(()=>c?e.value.aside==null?n.value.aside==="left":e.value.aside==="left":!1),c=U(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:n.value.aside!==!1),u=U(()=>i.value&&r.value),h=U(()=>i.value?li(o.value):[]);function d(){a.value=!0}function _(){a.value=!1}function E(){a.value?_():d()}return{isOpen:a,sidebar:o,sidebarGroups:h,hasSidebar:i,hasAside:c,leftAside:l,isSidebarEnabled:u,open:d,close:_,toggle:E}}function ui(e,t){let n;gt(()=>{n=e.value?document.activeElement:void 0}),Ke(()=>{window.addEventListener("keyup",r)}),Nn(()=>{window.removeEventListener("keyup",r)});function r(a){a.key==="Escape"&&e.value&&(t(),n==null||n.focus())}}function di(e){const{page:t,hash:n}=ae(),r=z(!1),a=U(()=>e.value.collapsed!=null),s=U(()=>!!e.value.link),o=z(!1),i=()=>{o.value=St(t.value.relativePath,e.value.link)};we([t,e,n],i),Ke(i);const l=U(()=>o.value?!0:e.value.items?nr(t.value.relativePath,e.value.items):!1),c=U(()=>!!(e.value.items&&e.value.items.length));gt(()=>{r.value=!!(a.value&&e.value.collapsed)}),Lr(()=>{(o.value||l.value)&&(r.value=!1)});function u(){a.value&&(r.value=!r.value)}return{collapsed:r,collapsible:a,isLink:s,isActiveLink:o,hasActiveLink:l,hasChildren:c,toggle:u}}function hi(){const{hasSidebar:e}=ct(),t=er("(min-width: 960px)"),n=er("(min-width: 1280px)");return{isAsideEnabled:U(()=>!n.value&&!t.value?!1:e.value?n.value:t.value)}}const rr=[];function ta(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function Or(e){const t=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const r=Number(n.tagName[1]);return{element:n,title:pi(n),link:"#"+n.id,level:r}});return mi(t,e)}function pi(e){let t="";for(const n of e.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor")||n.classList.contains("ignore-header"))continue;t+=n.textContent}else n.nodeType===3&&(t+=n.textContent);return t.trim()}function mi(e,t){if(t===!1)return[];const n=(typeof t=="object"&&!Array.isArray(t)?t.level:t)||2,[r,a]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;e=e.filter(o=>o.level>=r&&o.level<=a),rr.length=0;for(const{element:o,link:i}of e)rr.push({element:o,link:i});const s=[];e:for(let o=0;o<e.length;o++){const i=e[o];if(o===0)s.push(i);else{for(let l=o-1;l>=0;l--){const c=e[l];if(c.level<i.level){(c.children||(c.children=[])).push(i);continue e}}s.push(i)}}return s}function fi(e,t){const{isAsideEnabled:n}=hi(),r=Jo(s,100);let a=null;Ke(()=>{requestAnimationFrame(s),window.addEventListener("scroll",r)}),Oo(()=>{o(location.hash)}),Nn(()=>{window.removeEventListener("scroll",r)});function s(){if(!n.value)return;const i=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,u=Math.abs(i+l-c)<1,h=rr.map(({element:_,link:E})=>({link:E,top:gi(_)})).filter(({top:_})=>!Number.isNaN(_)).sort((_,E)=>_.top-E.top);if(!h.length){o(null);return}if(i<1){o(null);return}if(u){o(h[h.length-1].link);return}let d=null;for(const{link:_,top:E}of h){if(E>i+Io()+4)break;d=_}o(d)}function o(i){a&&a.classList.remove("active"),i==null?a=null:a=e.value.querySelector(`a[href="${decodeURIComponent(i)}"]`);const l=a;l?(l.classList.add("active"),t.value.style.top=l.offsetTop+39+"px",t.value.style.opacity="1"):(t.value.style.top="33px",t.value.style.opacity="0")}}function gi(e){let t=0;for(;e!==document.body;){if(e===null)return NaN;t+=e.offsetTop,e=e.offsetParent}return t}const _i=["href","title"],vi=V({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function t({target:n}){const r=n.href.split("#")[1],a=document.getElementById(decodeURIComponent(r));a==null||a.focus({preventScroll:!0})}return(n,r)=>{const a=_t("VPDocOutlineItem",!0);return f(),I("ul",{class:de(["VPDocOutlineItem",n.root?"root":"nested"])},[(f(!0),I(ge,null,$e(n.headers,({children:s,link:o,title:i})=>(f(),I("li",null,[k("a",{class:"outline-link",href:o,onClick:t,title:i},re(i),9,_i),s!=null&&s.length?(f(),X(a,{key:0,headers:s},null,8,["headers"])):G("",!0)]))),256))],2)}}}),na=q(vi,[["__scopeId","data-v-e6e2a982"]]),bi={class:"content"},yi={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},wi=V({__name:"VPDocAsideOutline",setup(e){const{frontmatter:t,theme:n}=ae(),r=Mn([]);Pn(()=>{r.value=Or(t.value.outline??n.value.outline)});const a=z(),s=z();return fi(a,s),(o,i)=>(f(),I("nav",{"aria-labelledby":"doc-outline-aria-label",class:de(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:a},[k("div",bi,[k("div",{class:"outline-marker",ref_key:"marker",ref:s},null,512),k("div",yi,re(g(ta)(g(n))),1),Y(na,{headers:r.value,root:!0},null,8,["headers"])])],2))}}),ki=q(wi,[["__scopeId","data-v-66911269"]]),Li={class:"VPDocAsideCarbonAds"},Ei=V({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const t=()=>null;return(n,r)=>(f(),I("div",Li,[Y(g(t),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),Si=e=>(Te("data-v-50f1b2fe"),e=e(),Ne(),e),Oi={class:"VPDocAside"},Ii=Si(()=>k("div",{class:"spacer"},null,-1)),Ci=V({__name:"VPDocAside",setup(e){const{theme:t}=ae();return(n,r)=>(f(),I("div",Oi,[S(n.$slots,"aside-top",{},void 0,!0),S(n.$slots,"aside-outline-before",{},void 0,!0),Y(ki),S(n.$slots,"aside-outline-after",{},void 0,!0),Ii,S(n.$slots,"aside-ads-before",{},void 0,!0),g(t).carbonAds?(f(),X(Ei,{key:0,"carbon-ads":g(t).carbonAds},null,8,["carbon-ads"])):G("",!0),S(n.$slots,"aside-ads-after",{},void 0,!0),S(n.$slots,"aside-bottom",{},void 0,!0)]))}}),Ai=q(Ci,[["__scopeId","data-v-50f1b2fe"]]);function Ti(){const{theme:e,page:t}=ae();return U(()=>{const{text:n="Edit this page",pattern:r=""}=e.value.editLink||{};let a;return typeof r=="function"?a=r(t.value):a=r.replace(/:path/g,t.value.filePath),{url:a,text:n}})}function Ni(){const{page:e,theme:t,frontmatter:n}=ae();return U(()=>{var c,u,h,d,_,E,v,b;const r=ea(t.value.sidebar,e.value.relativePath),a=ci(r),s=Mi(a,M=>M.link.replace(/[?#].*$/,"")),o=s.findIndex(M=>St(e.value.relativePath,M.link)),i=((c=t.value.docFooter)==null?void 0:c.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((u=t.value.docFooter)==null?void 0:u.next)===!1&&!n.value.next||n.value.next===!1;return{prev:i?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((h=s[o-1])==null?void 0:h.docFooterText)??((d=s[o-1])==null?void 0:d.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((_=s[o-1])==null?void 0:_.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((E=s[o+1])==null?void 0:E.docFooterText)??((v=s[o+1])==null?void 0:v.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((b=s[o+1])==null?void 0:b.link)}}})}function Mi(e,t){const n=new Set;return e.filter(r=>{const a=t(r);return n.has(a)?!1:n.add(a)})}const Je=V({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.tag??(t.href?"a":"span")),r=U(()=>t.href&&zs.test(t.href)||t.target==="_blank");return(a,s)=>(f(),X(Xe(n.value),{class:de(["VPLink",{link:a.href,"vp-external-link-icon":r.value,"no-icon":a.noIcon}]),href:a.href?g(Sr)(a.href):void 0,target:a.target??(r.value?"_blank":void 0),rel:a.rel??(r.value?"noreferrer":void 0)},{default:A(()=>[S(a.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Pi={class:"VPLastUpdated"},$i=["datetime"],Ri=V({__name:"VPDocFooterLastUpdated",setup(e){const{theme:t,page:n,lang:r}=ae(),a=U(()=>new Date(n.value.lastUpdated)),s=U(()=>a.value.toISOString()),o=z("");return Ke(()=>{gt(()=>{var i,l,c;o.value=new Intl.DateTimeFormat((l=(i=t.value.lastUpdated)==null?void 0:i.formatOptions)!=null&&l.forceLocale?r.value:void 0,((c=t.value.lastUpdated)==null?void 0:c.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(a.value)})}),(i,l)=>{var c;return f(),I("p",Pi,[Ze(re(((c=g(t).lastUpdated)==null?void 0:c.text)||g(t).lastUpdatedText||"Last updated")+": ",1),k("time",{datetime:s.value},re(o.value),9,$i)])}}}),Fi=q(Ri,[["__scopeId","data-v-0383dd33"]]),ra=e=>(Te("data-v-8aed38a6"),e=e(),Ne(),e),xi={key:0,class:"VPDocFooter"},Di={key:0,class:"edit-info"},Vi={key:0,class:"edit-link"},Ui=ra(()=>k("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Hi={key:1,class:"last-updated"},Bi={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},Wi=ra(()=>k("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),ji={class:"pager"},Ki=["innerHTML"],Gi=["innerHTML"],Yi={class:"pager"},zi=["innerHTML"],Xi=["innerHTML"],Ji=V({__name:"VPDocFooter",setup(e){const{theme:t,page:n,frontmatter:r}=ae(),a=Ti(),s=Ni(),o=U(()=>t.value.editLink&&r.value.editLink!==!1),i=U(()=>n.value.lastUpdated),l=U(()=>o.value||i.value||s.value.prev||s.value.next);return(c,u)=>{var h,d,_,E;return l.value?(f(),I("footer",xi,[S(c.$slots,"doc-footer-before",{},void 0,!0),o.value||i.value?(f(),I("div",Di,[o.value?(f(),I("div",Vi,[Y(Je,{class:"edit-link-button",href:g(a).url,"no-icon":!0},{default:A(()=>[Ui,Ze(" "+re(g(a).text),1)]),_:1},8,["href"])])):G("",!0),i.value?(f(),I("div",Hi,[Y(Fi)])):G("",!0)])):G("",!0),(h=g(s).prev)!=null&&h.link||(d=g(s).next)!=null&&d.link?(f(),I("nav",Bi,[Wi,k("div",ji,[(_=g(s).prev)!=null&&_.link?(f(),X(Je,{key:0,class:"pager-link prev",href:g(s).prev.link},{default:A(()=>{var v;return[k("span",{class:"desc",innerHTML:((v=g(t).docFooter)==null?void 0:v.prev)||"Previous page"},null,8,Ki),k("span",{class:"title",innerHTML:g(s).prev.text},null,8,Gi)]}),_:1},8,["href"])):G("",!0)]),k("div",Yi,[(E=g(s).next)!=null&&E.link?(f(),X(Je,{key:0,class:"pager-link next",href:g(s).next.link},{default:A(()=>{var v;return[k("span",{class:"desc",innerHTML:((v=g(t).docFooter)==null?void 0:v.next)||"Next page"},null,8,zi),k("span",{class:"title",innerHTML:g(s).next.text},null,8,Xi)]}),_:1},8,["href"])):G("",!0)])])):G("",!0)])):G("",!0)}}}),qi=q(Ji,[["__scopeId","data-v-8aed38a6"]]),Qi=e=>(Te("data-v-1e8f6485"),e=e(),Ne(),e),Zi={class:"container"},el=Qi(()=>k("div",{class:"aside-curtain"},null,-1)),tl={class:"aside-container"},nl={class:"aside-content"},rl={class:"content"},sl={class:"content-container"},al={class:"main"},ol=V({__name:"VPDoc",setup(e){const{theme:t}=ae(),n=sn(),{hasSidebar:r,hasAside:a,leftAside:s}=ct(),o=U(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(i,l)=>{const c=_t("Content");return f(),I("div",{class:de(["VPDoc",{"has-sidebar":g(r),"has-aside":g(a)}])},[S(i.$slots,"doc-top",{},void 0,!0),k("div",Zi,[g(a)?(f(),I("div",{key:0,class:de(["aside",{"left-aside":g(s)}])},[el,k("div",tl,[k("div",nl,[Y(Ai,null,{"aside-top":A(()=>[S(i.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(i.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(i.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(i.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(i.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(i.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):G("",!0),k("div",rl,[k("div",sl,[S(i.$slots,"doc-before",{},void 0,!0),k("main",al,[Y(c,{class:de(["vp-doc",[o.value,g(t).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),Y(qi,null,{"doc-footer-before":A(()=>[S(i.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),S(i.$slots,"doc-after",{},void 0,!0)])])]),S(i.$slots,"doc-bottom",{},void 0,!0)],2)}}}),il=q(ol,[["__scopeId","data-v-1e8f6485"]]),ll=V({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.href&&zs.test(t.href)),r=U(()=>t.tag||t.href?"a":"button");return(a,s)=>(f(),X(Xe(r.value),{class:de(["VPButton",[a.size,a.theme]]),href:a.href?g(Sr)(a.href):void 0,target:t.target??(n.value?"_blank":void 0),rel:t.rel??(n.value?"noreferrer":void 0)},{default:A(()=>[Ze(re(a.text),1)]),_:1},8,["class","href","target","rel"]))}}),cl=q(ll,[["__scopeId","data-v-20e5cd77"]]),ul=["src","alt"],dl=V({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(t,n)=>{const r=_t("VPImage",!0);return t.image?(f(),I(ge,{key:0},[typeof t.image=="string"||"src"in t.image?(f(),I("img",pt({key:0,class:"VPImage"},typeof t.image=="string"?t.$attrs:{...t.image,...t.$attrs},{src:g(Tn)(typeof t.image=="string"?t.image:t.image.src),alt:t.alt??(typeof t.image=="string"?"":t.image.alt||"")}),null,16,ul)):(f(),I(ge,{key:1},[Y(r,pt({class:"dark",image:t.image.dark,alt:t.image.alt},t.$attrs),null,16,["image","alt"]),Y(r,pt({class:"light",image:t.image.light,alt:t.image.alt},t.$attrs),null,16,["image","alt"])],64))],64)):G("",!0)}}}),Ln=q(dl,[["__scopeId","data-v-47795a9e"]]),hl=e=>(Te("data-v-3ccca08d"),e=e(),Ne(),e),pl={class:"container"},ml={class:"main"},fl={key:0,class:"name"},gl=["innerHTML"],_l=["innerHTML"],vl=["innerHTML"],bl={key:0,class:"actions"},yl={key:0,class:"image"},wl={class:"image-container"},kl=hl(()=>k("div",{class:"image-bg"},null,-1)),Ll=V({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const t=Bt("hero-image-slot-exists");return(n,r)=>(f(),I("div",{class:de(["VPHero",{"has-image":n.image||g(t)}])},[k("div",pl,[k("div",ml,[S(n.$slots,"home-hero-info-before",{},void 0,!0),S(n.$slots,"home-hero-info",{},()=>[n.name?(f(),I("h1",fl,[k("span",{innerHTML:n.name,class:"clip"},null,8,gl)])):G("",!0),n.text?(f(),I("p",{key:1,innerHTML:n.text,class:"text"},null,8,_l)):G("",!0),n.tagline?(f(),I("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,vl)):G("",!0)],!0),S(n.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(f(),I("div",bl,[(f(!0),I(ge,null,$e(n.actions,a=>(f(),I("div",{key:a.link,class:"action"},[Y(cl,{tag:"a",size:"medium",theme:a.theme,text:a.text,href:a.link,target:a.target,rel:a.rel},null,8,["theme","text","href","target","rel"])]))),128))])):G("",!0),S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||g(t)?(f(),I("div",yl,[k("div",wl,[kl,S(n.$slots,"home-hero-image",{},()=>[n.image?(f(),X(Ln,{key:0,class:"image-src",image:n.image},null,8,["image"])):G("",!0)],!0)])])):G("",!0)])],2))}}),El=q(Ll,[["__scopeId","data-v-3ccca08d"]]),Sl=V({__name:"VPHomeHero",setup(e){const{frontmatter:t}=ae();return(n,r)=>g(t).hero?(f(),X(El,{key:0,class:"VPHomeHero",name:g(t).hero.name,text:g(t).hero.text,tagline:g(t).hero.tagline,image:g(t).hero.image,actions:g(t).hero.actions},{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before")]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info")]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after")]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after")]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):G("",!0)}}),Ol=e=>(Te("data-v-e02c768e"),e=e(),Ne(),e),Il={class:"box"},Cl={key:0,class:"icon"},Al=["innerHTML"],Tl=["innerHTML"],Nl=["innerHTML"],Ml={key:4,class:"link-text"},Pl={class:"link-text-value"},$l=Ol(()=>k("span",{class:"vpi-arrow-right link-text-icon"},null,-1)),Rl=V({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(t,n)=>(f(),X(Je,{class:"VPFeature",href:t.link,rel:t.rel,target:t.target,"no-icon":!0,tag:t.link?"a":"div"},{default:A(()=>[k("article",Il,[typeof t.icon=="object"&&t.icon.wrap?(f(),I("div",Cl,[Y(Ln,{image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])])):typeof t.icon=="object"?(f(),X(Ln,{key:1,image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])):t.icon?(f(),I("div",{key:2,class:"icon",innerHTML:t.icon},null,8,Al)):G("",!0),k("h2",{class:"title",innerHTML:t.title},null,8,Tl),t.details?(f(),I("p",{key:3,class:"details",innerHTML:t.details},null,8,Nl)):G("",!0),t.linkText?(f(),I("div",Ml,[k("p",Pl,[Ze(re(t.linkText)+" ",1),$l])])):G("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Fl=q(Rl,[["__scopeId","data-v-e02c768e"]]),xl={key:0,class:"VPFeatures"},Dl={class:"container"},Vl={class:"items"},Ul=V({__name:"VPFeatures",props:{features:{}},setup(e){const t=e,n=U(()=>{const r=t.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,a)=>r.features?(f(),I("div",xl,[k("div",Dl,[k("div",Vl,[(f(!0),I(ge,null,$e(r.features,s=>(f(),I("div",{key:s.title,class:de(["item",[n.value]])},[Y(Fl,{icon:s.icon,title:s.title,details:s.details,link:s.link,"link-text":s.linkText,rel:s.rel,target:s.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):G("",!0)}}),Hl=q(Ul,[["__scopeId","data-v-75abe6f3"]]),Bl=V({__name:"VPHomeFeatures",setup(e){const{frontmatter:t}=ae();return(n,r)=>g(t).features?(f(),X(Hl,{key:0,class:"VPHomeFeatures",features:g(t).features},null,8,["features"])):G("",!0)}}),Wl=V({__name:"VPHomeContent",setup(e){const{width:t}=Co({initialWidth:0,includeScrollbar:!1});return(n,r)=>(f(),I("div",{class:"vp-doc container",style:Xs(g(t)?{"--vp-offset":`calc(50% - ${g(t)/2}px)`}:{})},[S(n.$slots,"default",{},void 0,!0)],4))}}),jl=q(Wl,[["__scopeId","data-v-ec262a10"]]),Kl={class:"VPHome"},Gl=V({__name:"VPHome",setup(e){const{frontmatter:t}=ae();return(n,r)=>{const a=_t("Content");return f(),I("div",Kl,[S(n.$slots,"home-hero-before",{},void 0,!0),Y(Sl,null,{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image",{},void 0,!0)]),_:3}),S(n.$slots,"home-hero-after",{},void 0,!0),S(n.$slots,"home-features-before",{},void 0,!0),Y(Bl),S(n.$slots,"home-features-after",{},void 0,!0),g(t).markdownStyles!==!1?(f(),X(jl,{key:0},{default:A(()=>[Y(a)]),_:1})):(f(),X(a,{key:1}))])}}}),Yl=q(Gl,[["__scopeId","data-v-a56a5b02"]]),zl={},Xl={class:"VPPage"};function Jl(e,t){const n=_t("Content");return f(),I("div",Xl,[S(e.$slots,"page-top"),Y(n),S(e.$slots,"page-bottom")])}const ql=q(zl,[["render",Jl]]),Ql=V({__name:"VPContent",setup(e){const{page:t,frontmatter:n}=ae(),{hasSidebar:r}=ct();return(a,s)=>(f(),I("div",{class:de(["VPContent",{"has-sidebar":g(r),"is-home":g(n).layout==="home"}]),id:"VPContent"},[g(t).isNotFound?S(a.$slots,"not-found",{key:0},()=>[Y(ii)],!0):g(n).layout==="page"?(f(),X(ql,{key:1},{"page-top":A(()=>[S(a.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(a.$slots,"page-bottom",{},void 0,!0)]),_:3})):g(n).layout==="home"?(f(),X(Yl,{key:2},{"home-hero-before":A(()=>[S(a.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(a.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(a.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(a.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(a.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(a.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(a.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(a.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(a.$slots,"home-features-after",{},void 0,!0)]),_:3})):g(n).layout&&g(n).layout!=="doc"?(f(),X(Xe(g(n).layout),{key:3})):(f(),X(il,{key:4},{"doc-top":A(()=>[S(a.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(a.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":A(()=>[S(a.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(a.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(a.$slots,"doc-after",{},void 0,!0)]),"aside-top":A(()=>[S(a.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":A(()=>[S(a.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(a.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(a.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(a.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":A(()=>[S(a.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Zl=q(Ql,[["__scopeId","data-v-206f6da1"]]),ec={class:"container"},tc=["innerHTML"],nc=["innerHTML"],rc=V({__name:"VPFooter",setup(e){const{theme:t,frontmatter:n}=ae(),{hasSidebar:r}=ct();return(a,s)=>g(t).footer&&g(n).footer!==!1?(f(),I("footer",{key:0,class:de(["VPFooter",{"has-sidebar":g(r)}])},[k("div",ec,[g(t).footer.message?(f(),I("p",{key:0,class:"message",innerHTML:g(t).footer.message},null,8,tc)):G("",!0),g(t).footer.copyright?(f(),I("p",{key:1,class:"copyright",innerHTML:g(t).footer.copyright},null,8,nc)):G("",!0)])],2)):G("",!0)}}),sc=q(rc,[["__scopeId","data-v-63954fb6"]]);function ac(){const{theme:e,frontmatter:t}=ae(),n=Mn([]),r=U(()=>n.value.length>0);return Pn(()=>{n.value=Or(t.value.outline??e.value.outline)}),{headers:n,hasLocalNav:r}}const oc=e=>(Te("data-v-2a46a704"),e=e(),Ne(),e),ic={class:"menu-text"},lc=oc(()=>k("span",{class:"vpi-chevron-right icon"},null,-1)),cc={class:"header"},uc={class:"outline"},dc=V({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const t=e,{theme:n}=ae(),r=z(!1),a=z(0),s=z(),o=z();function i(h){var d;(d=s.value)!=null&&d.contains(h.target)||(r.value=!1)}we(r,h=>{if(h){document.addEventListener("click",i);return}document.removeEventListener("click",i)}),Ao("Escape",()=>{r.value=!1}),Pn(()=>{r.value=!1});function l(){r.value=!r.value,a.value=window.innerHeight+Math.min(window.scrollY-t.navHeight,0)}function c(h){h.target.classList.contains("outline-link")&&(o.value&&(o.value.style.transition="none"),it(()=>{r.value=!1}))}function u(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,d)=>(f(),I("div",{class:"VPLocalNavOutlineDropdown",style:Xs({"--vp-vh":a.value+"px"}),ref_key:"main",ref:s},[h.headers.length>0?(f(),I("button",{key:0,onClick:l,class:de({open:r.value})},[k("span",ic,re(g(ta)(g(n))),1),lc],2)):(f(),I("button",{key:1,onClick:u},re(g(n).returnToTopLabel||"Return to top"),1)),Y(An,{name:"flyout"},{default:A(()=>[r.value?(f(),I("div",{key:0,ref_key:"items",ref:o,class:"items",onClick:c},[k("div",cc,[k("a",{class:"top-link",href:"#",onClick:u},re(g(n).returnToTopLabel||"Return to top"),1)]),k("div",uc,[Y(na,{headers:h.headers},null,8,["headers"])])],512)):G("",!0)]),_:1})],4))}}),hc=q(dc,[["__scopeId","data-v-2a46a704"]]),pc=e=>(Te("data-v-311e1b0c"),e=e(),Ne(),e),mc={class:"container"},fc=["aria-expanded"],gc=pc(()=>k("span",{class:"vpi-align-left menu-icon"},null,-1)),_c={class:"menu-text"},vc=V({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:t,frontmatter:n}=ae(),{hasSidebar:r}=ct(),{headers:a}=ac(),{y:s}=Js(),o=z(0);Ke(()=>{o.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Pn(()=>{a.value=Or(n.value.outline??t.value.outline)});const i=U(()=>a.value.length===0),l=U(()=>i.value&&!r.value),c=U(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:i.value,fixed:l.value}));return(u,h)=>g(n).layout!=="home"&&(!l.value||g(s)>=o.value)?(f(),I("div",{key:0,class:de(c.value)},[k("div",mc,[g(r)?(f(),I("button",{key:0,class:"menu","aria-expanded":u.open,"aria-controls":"VPSidebarNav",onClick:h[0]||(h[0]=d=>u.$emit("open-menu"))},[gc,k("span",_c,re(g(t).sidebarMenuLabel||"Menu"),1)],8,fc)):G("",!0),Y(hc,{headers:g(a),navHeight:o.value},null,8,["headers","navHeight"])])],2)):G("",!0)}}),bc=q(vc,[["__scopeId","data-v-311e1b0c"]]);function yc(){const e=z(!1);function t(){e.value=!0,window.addEventListener("resize",a)}function n(){e.value=!1,window.removeEventListener("resize",a)}function r(){e.value?n():t()}function a(){window.outerWidth>=768&&n()}const s=sn();return we(()=>s.path,n),{isScreenOpen:e,openScreen:t,closeScreen:n,toggleScreen:r}}const wc={},kc={class:"VPSwitch",type:"button",role:"switch"},Lc={class:"check"},Ec={key:0,class:"icon"};function Sc(e,t){return f(),I("button",kc,[k("span",Lc,[e.$slots.default?(f(),I("span",Ec,[S(e.$slots,"default",{},void 0,!0)])):G("",!0)])])}const Oc=q(wc,[["render",Sc],["__scopeId","data-v-2095caca"]]),sa=e=>(Te("data-v-69c3bd3a"),e=e(),Ne(),e),Ic=sa(()=>k("span",{class:"vpi-sun sun"},null,-1)),Cc=sa(()=>k("span",{class:"vpi-moon moon"},null,-1)),Ac=V({__name:"VPSwitchAppearance",setup(e){const{isDark:t,theme:n}=ae(),r=Bt("toggle-appearance",()=>{t.value=!t.value}),a=z("");return Lr(()=>{a.value=t.value?n.value.lightModeSwitchTitle||"Switch to light theme":n.value.darkModeSwitchTitle||"Switch to dark theme"}),(s,o)=>(f(),X(Oc,{title:a.value,class:"VPSwitchAppearance","aria-checked":g(t),onClick:g(r)},{default:A(()=>[Ic,Cc]),_:1},8,["title","aria-checked","onClick"]))}}),Ir=q(Ac,[["__scopeId","data-v-69c3bd3a"]]),Tc={key:0,class:"VPNavBarAppearance"},Nc=V({__name:"VPNavBarAppearance",setup(e){const{site:t}=ae();return(n,r)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(f(),I("div",Tc,[Y(Ir)])):G("",!0)}}),Mc=q(Nc,[["__scopeId","data-v-4519fd65"]]),Cr=z();let aa=!1,Kn=0;function Pc(e){const t=z(!1);if($n){!aa&&$c(),Kn++;const n=we(Cr,r=>{var a,s,o;r===e.el.value||(a=e.el.value)!=null&&a.contains(r)?(t.value=!0,(s=e.onFocus)==null||s.call(e)):(t.value=!1,(o=e.onBlur)==null||o.call(e))});Nn(()=>{n(),Kn--,Kn||Rc()})}return To(t)}function $c(){document.addEventListener("focusin",oa),aa=!0,Cr.value=document.activeElement}function Rc(){document.removeEventListener("focusin",oa)}function oa(){Cr.value=document.activeElement}const Fc={class:"VPMenuLink"},xc=V({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:t}=ae();return(n,r)=>(f(),I("div",Fc,[Y(Je,{class:de({active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:A(()=>[Ze(re(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Fn=q(xc,[["__scopeId","data-v-3ef37361"]]),Dc={class:"VPMenuGroup"},Vc={key:0,class:"title"},Uc=V({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(t,n)=>(f(),I("div",Dc,[t.text?(f(),I("p",Vc,re(t.text),1)):G("",!0),(f(!0),I(ge,null,$e(t.items,r=>(f(),I(ge,null,["link"in r?(f(),X(Fn,{key:0,item:r},null,8,["item"])):G("",!0)],64))),256))]))}}),Hc=q(Uc,[["__scopeId","data-v-528cb70d"]]),Bc={class:"VPMenu"},Wc={key:0,class:"items"},jc=V({__name:"VPMenu",props:{items:{}},setup(e){return(t,n)=>(f(),I("div",Bc,[t.items?(f(),I("div",Wc,[(f(!0),I(ge,null,$e(t.items,r=>(f(),I(ge,{key:JSON.stringify(r)},["link"in r?(f(),X(Fn,{key:0,item:r},null,8,["item"])):"component"in r?(f(),X(Xe(r.component),pt({key:1,ref_for:!0},r.props),null,16)):(f(),X(Hc,{key:2,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):G("",!0),S(t.$slots,"default",{},void 0,!0)]))}}),Kc=q(jc,[["__scopeId","data-v-e17025cc"]]),Gc=e=>(Te("data-v-4859153d"),e=e(),Ne(),e),Yc=["aria-expanded","aria-label"],zc={key:0,class:"text"},Xc=["innerHTML"],Jc=Gc(()=>k("span",{class:"vpi-chevron-down text-icon"},null,-1)),qc={key:1,class:"vpi-more-horizontal icon"},Qc={class:"menu"},Zc=V({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const t=z(!1),n=z();Pc({el:n,onBlur:r});function r(){t.value=!1}return(a,s)=>(f(),I("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:s[1]||(s[1]=o=>t.value=!0),onMouseleave:s[2]||(s[2]=o=>t.value=!1)},[k("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":t.value,"aria-label":a.label,onClick:s[0]||(s[0]=o=>t.value=!t.value)},[a.button||a.icon?(f(),I("span",zc,[a.icon?(f(),I("span",{key:0,class:de([a.icon,"option-icon"])},null,2)):G("",!0),a.button?(f(),I("span",{key:1,innerHTML:a.button},null,8,Xc)):G("",!0),Jc])):(f(),I("span",qc))],8,Yc),k("div",Qc,[Y(Kc,{items:a.items},{default:A(()=>[S(a.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Ar=q(Zc,[["__scopeId","data-v-4859153d"]]),eu=["href","aria-label","innerHTML"],tu=V({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const t=e,n=U(()=>typeof t.icon=="object"?t.icon.svg:`<span class="vpi-social-${t.icon}" />`);return(r,a)=>(f(),I("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,eu))}}),nu=q(tu,[["__scopeId","data-v-4a679308"]]),ru={class:"VPSocialLinks"},su=V({__name:"VPSocialLinks",props:{links:{}},setup(e){return(t,n)=>(f(),I("div",ru,[(f(!0),I(ge,null,$e(t.links,({link:r,icon:a,ariaLabel:s})=>(f(),X(nu,{key:r,icon:a,link:r,ariaLabel:s},null,8,["icon","link","ariaLabel"]))),128))]))}}),Tr=q(su,[["__scopeId","data-v-c6f0ccb2"]]),au={key:0,class:"group translations"},ou={class:"trans-title"},iu={key:1,class:"group"},lu={class:"item appearance"},cu={class:"label"},uu={class:"appearance-action"},du={key:2,class:"group"},hu={class:"item social-links"},pu=V({__name:"VPNavBarExtra",setup(e){const{site:t,theme:n}=ae(),{localeLinks:r,currentLang:a}=an({correspondingLink:!0}),s=U(()=>r.value.length&&a.value.label||t.value.appearance||n.value.socialLinks);return(o,i)=>s.value?(f(),X(Ar,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:A(()=>[g(r).length&&g(a).label?(f(),I("div",au,[k("p",ou,re(g(a).label),1),(f(!0),I(ge,null,$e(g(r),l=>(f(),X(Fn,{key:l.link,item:l},null,8,["item"]))),128))])):G("",!0),g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(f(),I("div",iu,[k("div",lu,[k("p",cu,re(g(n).darkModeSwitchLabel||"Appearance"),1),k("div",uu,[Y(Ir)])])])):G("",!0),g(n).socialLinks?(f(),I("div",du,[k("div",hu,[Y(Tr,{class:"social-links-list",links:g(n).socialLinks},null,8,["links"])])])):G("",!0)]),_:1})):G("",!0)}}),mu=q(pu,[["__scopeId","data-v-f7f93bcb"]]),fu=e=>(Te("data-v-69b47a68"),e=e(),Ne(),e),gu=["aria-expanded"],_u=fu(()=>k("span",{class:"container"},[k("span",{class:"top"}),k("span",{class:"middle"}),k("span",{class:"bottom"})],-1)),vu=[_u],bu=V({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(t,n)=>(f(),I("button",{type:"button",class:de(["VPNavBarHamburger",{active:t.active}]),"aria-label":"mobile navigation","aria-expanded":t.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=r=>t.$emit("click"))},vu,10,gu))}}),yu=q(bu,[["__scopeId","data-v-69b47a68"]]),wu=["innerHTML"],ku=V({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:t}=ae();return(n,r)=>(f(),X(Je,{class:de({VPNavBarMenuLink:!0,active:g(St)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,noIcon:n.item.noIcon,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:A(()=>[k("span",{innerHTML:n.item.text},null,8,wu)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Lu=q(ku,[["__scopeId","data-v-a60c5f21"]]),Eu=V({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const t=e,{page:n}=ae(),r=s=>"component"in s?!1:"link"in s?St(n.value.relativePath,s.link,!!t.item.activeMatch):s.items.some(r),a=U(()=>r(t.item));return(s,o)=>(f(),X(Ar,{class:de({VPNavBarMenuGroup:!0,active:g(St)(g(n).relativePath,s.item.activeMatch,!!s.item.activeMatch)||a.value}),button:s.item.text,items:s.item.items},null,8,["class","button","items"]))}}),Su=e=>(Te("data-v-8ffc6322"),e=e(),Ne(),e),Ou={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Iu=Su(()=>k("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),Cu=V({__name:"VPNavBarMenu",setup(e){const{theme:t}=ae();return(n,r)=>g(t).nav?(f(),I("nav",Ou,[Iu,(f(!0),I(ge,null,$e(g(t).nav,a=>(f(),I(ge,{key:JSON.stringify(a)},["link"in a?(f(),X(Lu,{key:0,item:a},null,8,["item"])):"component"in a?(f(),X(Xe(a.component),pt({key:1,ref_for:!0},a.props),null,16)):(f(),X(Eu,{key:2,item:a},null,8,["item"]))],64))),128))])):G("",!0)}}),Au=q(Cu,[["__scopeId","data-v-8ffc6322"]]);var Ur;const ia=typeof window<"u",Tu=e=>typeof e=="string",gn=()=>{};ia&&((Ur=window==null?void 0:window.navigator)!=null&&Ur.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function sr(e){return typeof e=="function"?e():g(e)}function Nu(e,t){function n(...r){e(()=>t.apply(this,r),{fn:t,thisArg:this,args:r})}return n}function Mu(e,t={}){let n,r;return a=>{const s=sr(e),o=sr(t.maxWait);if(n&&clearTimeout(n),s<=0||o!==void 0&&o<=0)return r&&(clearTimeout(r),r=null),a();o&&!r&&(r=setTimeout(()=>{n&&clearTimeout(n),r=null,a()},o)),n=setTimeout(()=>{r&&clearTimeout(r),r=null,a()},s)}}function Pu(e){return e}function $u(e){return qs()?(Qs(e),!0):!1}function la(e,t=200,n={}){return Nu(Mu(t,n),e)}function Gn(e,t=200,n={}){if(t<=0)return e;const r=z(e.value),a=la(()=>{r.value=e.value},t,n);return we(e,()=>a()),r}function ca(e,t,n){return we(e,(r,a,s)=>{r&&t(r,a,s)},n)}function Ru(e){var t;const n=sr(e);return(t=n==null?void 0:n.$el)!=null?t:n}const ua=ia?window:void 0;function hn(...e){let t,n,r,a;if(Tu(e[0])?([n,r,a]=e,t=ua):[t,n,r,a]=e,!t)return gn;let s=gn;const o=we(()=>Ru(t),l=>{s(),l&&(l.addEventListener(n,r,a),s=()=>{l.removeEventListener(n,r,a),s=gn})},{immediate:!0,flush:"post"}),i=()=>{o(),s()};return $u(i),i}const Hr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Br="__vueuse_ssr_handlers__";Hr[Br]=Hr[Br]||{};const Fu={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function xu(e={}){const{reactive:t=!1,target:n=ua,aliasMap:r=Fu,passive:a=!0,onEventFired:s=gn}=e,o=tn(new Set),i={toJSON(){return{}},current:o},l=t?tn(i):i,c=new Set,u=new Set;function h(v,b){v in l&&(t?l[v]=b:l[v].value=b)}function d(){for(const v of u)h(v,!1)}function _(v,b){var M,W;const y=(M=v.key)==null?void 0:M.toLowerCase(),L=[(W=v.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?o.add(y):o.delete(y));for(const T of L)u.add(T),h(T,b);y==="meta"&&!b?(c.forEach(T=>{o.delete(T),h(T,!1)}),c.clear()):typeof v.getModifierState=="function"&&v.getModifierState("Meta")&&b&&[...o,...L].forEach(T=>c.add(T))}hn(n,"keydown",v=>(_(v,!0),s(v)),{passive:a}),hn(n,"keyup",v=>(_(v,!1),s(v)),{passive:a}),hn("blur",d,{passive:!0}),hn("focus",d,{passive:!0});const E=new Proxy(l,{get(v,b,M){if(typeof b!="string")return Reflect.get(v,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(v,b,M);return t?g(W):W}});return E}var Wr;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Wr||(Wr={}));var Du=Object.defineProperty,jr=Object.getOwnPropertySymbols,Vu=Object.prototype.hasOwnProperty,Uu=Object.prototype.propertyIsEnumerable,Kr=(e,t,n)=>t in e?Du(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Hu=(e,t)=>{for(var n in t||(t={}))Vu.call(t,n)&&Kr(e,n,t[n]);if(jr)for(var n of jr(t))Uu.call(t,n)&&Kr(e,n,t[n]);return e};const Bu={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Hu({linear:Pu},Bu);function lt(e){return Array.isArray?Array.isArray(e):pa(e)==="[object Array]"}const Wu=1/0;function ju(e){if(typeof e=="string")return e;let t=e+"";return t=="0"&&1/e==-Wu?"-0":t}function Ku(e){return e==null?"":ju(e)}function Ye(e){return typeof e=="string"}function da(e){return typeof e=="number"}function Gu(e){return e===!0||e===!1||Yu(e)&&pa(e)=="[object Boolean]"}function ha(e){return typeof e=="object"}function Yu(e){return ha(e)&&e!==null}function De(e){return e!=null}function Yn(e){return!e.trim().length}function pa(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const zu="Incorrect 'index' type",Xu=e=>`Invalid value for key ${e}`,Ju=e=>`Pattern length exceeds max of ${e}.`,qu=e=>`Missing ${e} property in key`,Qu=e=>`Property 'weight' in key '${e}' must be a positive integer`,Gr=Object.prototype.hasOwnProperty;class Zu{constructor(t){this._keys=[],this._keyMap={};let n=0;t.forEach(r=>{let a=ma(r);n+=a.weight,this._keys.push(a),this._keyMap[a.id]=a,n+=a.weight}),this._keys.forEach(r=>{r.weight/=n})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function ma(e){let t=null,n=null,r=null,a=1,s=null;if(Ye(e)||lt(e))r=e,t=Yr(e),n=ar(e);else{if(!Gr.call(e,"name"))throw new Error(qu("name"));const o=e.name;if(r=o,Gr.call(e,"weight")&&(a=e.weight,a<=0))throw new Error(Qu(o));t=Yr(o),n=ar(o),s=e.getFn}return{path:t,id:n,weight:a,src:r,getFn:s}}function Yr(e){return lt(e)?e:e.split(".")}function ar(e){return lt(e)?e.join("."):e}function ed(e,t){let n=[],r=!1;const a=(s,o,i)=>{if(De(s))if(!o[i])n.push(s);else{let l=o[i];const c=s[l];if(!De(c))return;if(i===o.length-1&&(Ye(c)||da(c)||Gu(c)))n.push(Ku(c));else if(lt(c)){r=!0;for(let u=0,h=c.length;u<h;u+=1)a(c[u],o,i+1)}else o.length&&a(c,o,i+1)}};return a(e,Ye(t)?t.split("."):t,0),r?n:n[0]}const td={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},nd={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},rd={location:0,threshold:.6,distance:100},sd={useExtendedSearch:!1,getFn:ed,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var ee={...nd,...td,...rd,...sd};const ad=/[^ ]+/g;function od(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(a){const s=a.match(ad).length;if(n.has(s))return n.get(s);const o=1/Math.pow(s,.5*e),i=parseFloat(Math.round(o*r)/r);return n.set(s,i),i},clear(){n.clear()}}}class Nr{constructor({getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){this.norm=od(n,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((n,r)=>{this._keysMap[n.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,Ye(this.docs[0])?this.docs.forEach((t,n)=>{this._addString(t,n)}):this.docs.forEach((t,n)=>{this._addObject(t,n)}),this.norm.clear())}add(t){const n=this.size();Ye(t)?this._addString(t,n):this._addObject(t,n)}removeAt(t){this.records.splice(t,1);for(let n=t,r=this.size();n<r;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(t,n){return t[this._keysMap[n]]}size(){return this.records.length}_addString(t,n){if(!De(t)||Yn(t))return;let r={v:t,i:n,n:this.norm.get(t)};this.records.push(r)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach((a,s)=>{let o=a.getFn?a.getFn(t):this.getFn(t,a.path);if(De(o)){if(lt(o)){let i=[];const l=[{nestedArrIndex:-1,value:o}];for(;l.length;){const{nestedArrIndex:c,value:u}=l.pop();if(De(u))if(Ye(u)&&!Yn(u)){let h={v:u,i:c,n:this.norm.get(u)};i.push(h)}else lt(u)&&u.forEach((h,d)=>{l.push({nestedArrIndex:d,value:h})})}r.$[s]=i}else if(Ye(o)&&!Yn(o)){let i={v:o,n:this.norm.get(o)};r.$[s]=i}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function fa(e,t,{getFn:n=ee.getFn,fieldNormWeight:r=ee.fieldNormWeight}={}){const a=new Nr({getFn:n,fieldNormWeight:r});return a.setKeys(e.map(ma)),a.setSources(t),a.create(),a}function id(e,{getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){const{keys:r,records:a}=e,s=new Nr({getFn:t,fieldNormWeight:n});return s.setKeys(r),s.setIndexRecords(a),s}function pn(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:a=ee.distance,ignoreLocation:s=ee.ignoreLocation}={}){const o=t/e.length;if(s)return o;const i=Math.abs(r-n);return a?o+i/a:i?1:o}function ld(e=[],t=ee.minMatchCharLength){let n=[],r=-1,a=-1,s=0;for(let o=e.length;s<o;s+=1){let i=e[s];i&&r===-1?r=s:!i&&r!==-1&&(a=s-1,a-r+1>=t&&n.push([r,a]),r=-1)}return e[s-1]&&s-r>=t&&n.push([r,s-1]),n}const Et=32;function cd(e,t,n,{location:r=ee.location,distance:a=ee.distance,threshold:s=ee.threshold,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,includeMatches:l=ee.includeMatches,ignoreLocation:c=ee.ignoreLocation}={}){if(t.length>Et)throw new Error(Ju(Et));const u=t.length,h=e.length,d=Math.max(0,Math.min(r,h));let _=s,E=d;const v=i>1||l,b=v?Array(h):[];let M;for(;(M=e.indexOf(t,E))>-1;){let $=pn(t,{currentLocation:M,expectedLocation:d,distance:a,ignoreLocation:c});if(_=Math.min($,_),E=M+u,v){let x=0;for(;x<u;)b[M+x]=1,x+=1}}E=-1;let W=[],y=1,L=u+h;const T=1<<u-1;for(let $=0;$<u;$+=1){let x=0,R=L;for(;x<R;)pn(t,{errors:$,currentLocation:d+R,expectedLocation:d,distance:a,ignoreLocation:c})<=_?x=R:L=R,R=Math.floor((L-x)/2+x);L=R;let he=Math.max(1,d-R+1),ke=o?h:Math.min(d+R,h)+u,Z=Array(ke+2);Z[ke+1]=(1<<$)-1;for(let D=ke;D>=he;D-=1){let ie=D-1,Ee=n[e.charAt(ie)];if(v&&(b[ie]=+!!Ee),Z[D]=(Z[D+1]<<1|1)&Ee,$&&(Z[D]|=(W[D+1]|W[D])<<1|1|W[D+1]),Z[D]&T&&(y=pn(t,{errors:$,currentLocation:ie,expectedLocation:d,distance:a,ignoreLocation:c}),y<=_)){if(_=y,E=ie,E<=d)break;he=Math.max(1,2*d-E)}}if(pn(t,{errors:$+1,currentLocation:d,expectedLocation:d,distance:a,ignoreLocation:c})>_)break;W=Z}const C={isMatch:E>=0,score:Math.max(.001,y)};if(v){const $=ld(b,i);$.length?l&&(C.indices=$):C.isMatch=!1}return C}function ud(e){let t={};for(let n=0,r=e.length;n<r;n+=1){const a=e.charAt(n);t[a]=(t[a]||0)|1<<r-n-1}return t}class ga{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:a=ee.distance,includeMatches:s=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){if(this.options={location:n,threshold:r,distance:a,includeMatches:s,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c},this.pattern=l?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const u=(d,_)=>{this.chunks.push({pattern:d,alphabet:ud(d),startIndex:_})},h=this.pattern.length;if(h>Et){let d=0;const _=h%Et,E=h-_;for(;d<E;)u(this.pattern.substr(d,Et),d),d+=Et;if(_){const v=h-Et;u(this.pattern.substr(v),v)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:n,includeMatches:r}=this.options;if(n||(t=t.toLowerCase()),this.pattern===t){let E={isMatch:!0,score:0};return r&&(E.indices=[[0,t.length-1]]),E}const{location:a,distance:s,threshold:o,findAllMatches:i,minMatchCharLength:l,ignoreLocation:c}=this.options;let u=[],h=0,d=!1;this.chunks.forEach(({pattern:E,alphabet:v,startIndex:b})=>{const{isMatch:M,score:W,indices:y}=cd(t,E,v,{location:a+b,distance:s,threshold:o,findAllMatches:i,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});M&&(d=!0),h+=W,M&&y&&(u=[...u,...y])});let _={isMatch:d,score:d?h/this.chunks.length:1};return d&&r&&(_.indices=u),_}}class vt{constructor(t){this.pattern=t}static isMultiMatch(t){return zr(t,this.multiRegex)}static isSingleMatch(t){return zr(t,this.singleRegex)}search(){}}function zr(e,t){const n=e.match(t);return n?n[1]:null}class dd extends vt{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const n=t===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class hd extends vt{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const n=t.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class pd extends vt{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const n=t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class md extends vt{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const n=!t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class fd extends vt{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const n=t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class gd extends vt{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const n=!t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class _a extends vt{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:a=ee.distance,includeMatches:s=ee.includeMatches,findAllMatches:o=ee.findAllMatches,minMatchCharLength:i=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){super(t),this._bitapSearch=new ga(t,{location:n,threshold:r,distance:a,includeMatches:s,findAllMatches:o,minMatchCharLength:i,isCaseSensitive:l,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class va extends vt{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let n=0,r;const a=[],s=this.pattern.length;for(;(r=t.indexOf(this.pattern,n))>-1;)n=r+s,a.push([r,n-1]);const o=!!a.length;return{isMatch:o,score:o?0:1,indices:a}}}const or=[dd,va,pd,md,gd,fd,hd,_a],Xr=or.length,_d=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,vd="|";function bd(e,t={}){return e.split(vd).map(n=>{let r=n.trim().split(_d).filter(s=>s&&!!s.trim()),a=[];for(let s=0,o=r.length;s<o;s+=1){const i=r[s];let l=!1,c=-1;for(;!l&&++c<Xr;){const u=or[c];let h=u.isMultiMatch(i);h&&(a.push(new u(h,t)),l=!0)}if(!l)for(c=-1;++c<Xr;){const u=or[c];let h=u.isSingleMatch(i);if(h){a.push(new u(h,t));break}}}return a})}const yd=new Set([_a.type,va.type]);class wd{constructor(t,{isCaseSensitive:n=ee.isCaseSensitive,includeMatches:r=ee.includeMatches,minMatchCharLength:a=ee.minMatchCharLength,ignoreLocation:s=ee.ignoreLocation,findAllMatches:o=ee.findAllMatches,location:i=ee.location,threshold:l=ee.threshold,distance:c=ee.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:r,minMatchCharLength:a,findAllMatches:o,ignoreLocation:s,location:i,threshold:l,distance:c},this.pattern=n?t:t.toLowerCase(),this.query=bd(this.pattern,this.options)}static condition(t,n){return n.useExtendedSearch}searchIn(t){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:a}=this.options;t=a?t:t.toLowerCase();let s=0,o=[],i=0;for(let l=0,c=n.length;l<c;l+=1){const u=n[l];o.length=0,s=0;for(let h=0,d=u.length;h<d;h+=1){const _=u[h],{isMatch:E,indices:v,score:b}=_.search(t);if(E){if(s+=1,i+=b,r){const M=_.constructor.type;yd.has(M)?o=[...o,...v]:o.push(v)}}else{i=0,s=0,o.length=0;break}}if(s){let h={isMatch:!0,score:i/s};return r&&(h.indices=o),h}}return{isMatch:!1,score:1}}}const ir=[];function kd(...e){ir.push(...e)}function lr(e,t){for(let n=0,r=ir.length;n<r;n+=1){let a=ir[n];if(a.condition(e,t))return new a(e,t)}return new ga(e,t)}const En={AND:"$and",OR:"$or"},cr={PATH:"$path",PATTERN:"$val"},ur=e=>!!(e[En.AND]||e[En.OR]),Ld=e=>!!e[cr.PATH],Ed=e=>!lt(e)&&ha(e)&&!ur(e),Jr=e=>({[En.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function ba(e,t,{auto:n=!0}={}){const r=a=>{let s=Object.keys(a);const o=Ld(a);if(!o&&s.length>1&&!ur(a))return r(Jr(a));if(Ed(a)){const l=o?a[cr.PATH]:s[0],c=o?a[cr.PATTERN]:a[l];if(!Ye(c))throw new Error(Xu(l));const u={keyId:ar(l),pattern:c};return n&&(u.searcher=lr(c,t)),u}let i={children:[],operator:s[0]};return s.forEach(l=>{const c=a[l];lt(c)&&c.forEach(u=>{i.children.push(r(u))})}),i};return ur(e)||(e=Jr(e)),r(e)}function Sd(e,{ignoreFieldNorm:t=ee.ignoreFieldNorm}){e.forEach(n=>{let r=1;n.matches.forEach(({key:a,norm:s,score:o})=>{const i=a?a.weight:null;r*=Math.pow(o===0&&i?Number.EPSILON:o,(i||1)*(t?1:s))}),n.score=r})}function Od(e,t){const n=e.matches;t.matches=[],De(n)&&n.forEach(r=>{if(!De(r.indices)||!r.indices.length)return;const{indices:a,value:s}=r;let o={indices:a,value:s};r.key&&(o.key=r.key.src),r.idx>-1&&(o.refIndex=r.idx),t.matches.push(o)})}function Id(e,t){t.score=e.score}function Cd(e,t,{includeMatches:n=ee.includeMatches,includeScore:r=ee.includeScore}={}){const a=[];return n&&a.push(Od),r&&a.push(Id),e.map(s=>{const{idx:o}=s,i={item:t[o],refIndex:o};return a.length&&a.forEach(l=>{l(s,i)}),i})}class Ot{constructor(t,n={},r){this.options={...ee,...n},this.options.useExtendedSearch,this._keyStore=new Zu(this.options.keys),this.setCollection(t,r)}setCollection(t,n){if(this._docs=t,n&&!(n instanceof Nr))throw new Error(zu);this._myIndex=n||fa(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){!De(t)||(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const n=[];for(let r=0,a=this._docs.length;r<a;r+=1){const s=this._docs[r];t(s,r)&&(this.removeAt(r),r-=1,a-=1,n.push(s))}return n}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:n=-1}={}){const{includeMatches:r,includeScore:a,shouldSort:s,sortFn:o,ignoreFieldNorm:i}=this.options;let l=Ye(t)?Ye(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Sd(l,{ignoreFieldNorm:i}),s&&l.sort(o),da(n)&&n>-1&&(l=l.slice(0,n)),Cd(l,this._docs,{includeMatches:r,includeScore:a})}_searchStringList(t){const n=lr(t,this.options),{records:r}=this._myIndex,a=[];return r.forEach(({v:s,i:o,n:i})=>{if(!De(s))return;const{isMatch:l,score:c,indices:u}=n.searchIn(s);l&&a.push({item:s,idx:o,matches:[{score:c,value:s,norm:i,indices:u}]})}),a}_searchLogical(t){const n=ba(t,this.options),r=(i,l,c)=>{if(!i.children){const{keyId:h,searcher:d}=i,_=this._findMatches({key:this._keyStore.get(h),value:this._myIndex.getValueForItemAtKeyId(l,h),searcher:d});return _&&_.length?[{idx:c,item:l,matches:_}]:[]}const u=[];for(let h=0,d=i.children.length;h<d;h+=1){const _=i.children[h],E=r(_,l,c);if(E.length)u.push(...E);else if(i.operator===En.AND)return[]}return u},a=this._myIndex.records,s={},o=[];return a.forEach(({$:i,i:l})=>{if(De(i)){let c=r(n,i,l);c.length&&(s[l]||(s[l]={idx:l,item:i,matches:[]},o.push(s[l])),c.forEach(({matches:u})=>{s[l].matches.push(...u)}))}}),o}_searchObjectList(t){const n=lr(t,this.options),{keys:r,records:a}=this._myIndex,s=[];return a.forEach(({$:o,i})=>{if(!De(o))return;let l=[];r.forEach((c,u)=>{l.push(...this._findMatches({key:c,value:o[u],searcher:n}))}),l.length&&s.push({idx:i,item:o,matches:l})}),s}_findMatches({key:t,value:n,searcher:r}){if(!De(n))return[];let a=[];if(lt(n))n.forEach(({v:s,i:o,n:i})=>{if(!De(s))return;const{isMatch:l,score:c,indices:u}=r.searchIn(s);l&&a.push({score:c,key:t,value:s,idx:o,norm:i,indices:u})});else{const{v:s,n:o}=n,{isMatch:i,score:l,indices:c}=r.searchIn(s);i&&a.push({score:l,key:t,value:s,norm:o,indices:c})}return a}}Ot.version="6.6.2";Ot.createIndex=fa;Ot.parseIndex=id;Ot.config=ee;Ot.parseQuery=ba;kd(wd);const qr=tn({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Wt=()=>({isSearching:U(()=>qr.search!==""),...Mo(qr)});function Ad(e){return{all:e=e||new Map,on:function(t,n){var r=e.get(t);r?r.push(n):e.set(t,[n])},off:function(t,n){var r=e.get(t);r&&(n?r.splice(r.indexOf(n)>>>0,1):e.set(t,[]))},emit:function(t,n){var r=e.get(t);r&&r.slice().map(function(a){a(n)}),(r=e.get("*"))&&r.slice().map(function(a){a(t,n)})}}}const Td=Ad(),xn=()=>({emitter:Td});function Nd(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return n;n=n.nextElementSibling}}function Md(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}const Pd=["command-theme"],$d={"command-root":""},Rd=V({name:"Command"}),Fd=V({...Rd,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(e,{emit:t}){const n=e,r='[command-item=""]',a="command-item-key",s='[command-group=""]',o="command-group-key",i='[command-group-heading=""]',l=`${r}:not([aria-disabled="true"])`,c=`${r}[aria-selected="true"]`,u="command-item-select",h="data-value";Er("theme",n.theme||"default");const{selectedNode:d,search:_,dataValue:E,filtered:v}=Wt(),{emitter:b}=xn(),M=z(),W=Gn(z(new Map),333),y=Gn(z(new Set),333),L=Gn(z(new Map)),T=U(()=>{const j=[];for(const[le,oe]of W.value.entries())j.push({key:le,label:oe});return j}),C=U(()=>{const j=Ot.createIndex(n.fuseOptions.keys,T.value);return new Ot(T.value,n.fuseOptions,j)}),$=()=>{var j,le,oe;const pe=x();pe&&(((j=pe.parentElement)==null?void 0:j.firstElementChild)===pe&&((oe=(le=pe.closest(s))==null?void 0:le.querySelector(i))==null||oe.scrollIntoView({block:"nearest"})),pe.scrollIntoView({block:"nearest"}))},x=()=>{var j;return(j=M.value)==null?void 0:j.querySelector(c)},R=(j=M.value)=>{const le=j==null?void 0:j.querySelectorAll(l);return le?Array.from(le):[]},he=()=>{var j;const le=(j=M.value)==null?void 0:j.querySelectorAll(s);return le?Array.from(le):[]},ke=()=>{const[j]=R();j&&j.getAttribute(a)&&(d.value=j.getAttribute(a)||"")},Z=j=>{const le=R()[j];le&&(d.value=le.getAttribute(a)||"")},D=j=>{const le=x(),oe=R(),pe=oe.findIndex(Ge=>Ge===le),xe=oe[pe+j];xe?d.value=xe.getAttribute(a)||"":j>0?Z(0):Z(oe.length-1)},ie=j=>{const le=x();let oe=le==null?void 0:le.closest(s),pe=null;for(;oe&&!pe;)oe=j>0?Nd(oe,s):Md(oe,s),pe=oe==null?void 0:oe.querySelector(l);pe?d.value=pe.getAttribute(a)||"":D(j)},Ee=()=>Z(0),Oe=()=>Z(R().length-1),ve=j=>{j.preventDefault(),j.metaKey?Oe():j.altKey?ie(1):D(1)},Ue=j=>{j.preventDefault(),j.metaKey?Ee():j.altKey?ie(-1):D(-1)},tt=j=>{switch(j.key){case"n":case"j":{j.ctrlKey&&ve(j);break}case"ArrowDown":{ve(j);break}case"p":case"k":{j.ctrlKey&&Ue(j);break}case"ArrowUp":{Ue(j);break}case"Home":{Ee();break}case"End":{Oe();break}case"Enter":{const le=x();if(le){const oe=new Event(u);le.dispatchEvent(oe)}}}},be=()=>{if(!_.value){v.value.count=y.value.size;return}v.value.groups=new Set("");const j=new Map,le=C.value.search(_.value).map(oe=>oe.item);for(const{key:oe,label:pe}of le)j.set(oe,pe);for(const[oe,pe]of L.value)for(const xe of pe)j.get(xe)&&v.value.groups.add(oe);it(()=>{v.value.count=j.size,v.value.items=j})},Le=()=>{const j=R(),le=he();for(const oe of j){const pe=oe.getAttribute(a)||"",xe=oe.getAttribute(h)||"";y.value.add(pe),W.value.set(pe,xe),v.value.count=W.value.size}for(const oe of le){const pe=R(oe),xe=oe.getAttribute(o)||"",Ge=new Set("");for(const wt of pe){const ut=wt.getAttribute(a)||"";Ge.add(ut)}L.value.set(xe,Ge)}};we(()=>d.value,j=>{j&&it($)},{deep:!0}),we(()=>_.value,j=>{be(),it(ke)}),b.on("selectItem",j=>{t("select-item",j)});const He=la(j=>{j&&(Le(),it(ke))},100);return b.on("rerenderList",He),Ke(()=>{Le(),ke()}),(j,le)=>(f(),I("div",{class:de(e.theme),onKeydown:tt,ref_key:"commandRef",ref:M,"command-theme":e.theme},[k("div",$d,[S(j.$slots,"default")])],42,Pd))}}),jt=(e,t)=>{const n=e.__vccOpts||e;for(const[r,a]of t)n[r]=a;return n},dr=jt(Fd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),xd={"command-dialog":""},Dd={"command-dialog-mask":""},Vd={"command-dialog-wrapper":""},Ud={"command-dialog-header":""},Hd={"command-dialog-body":""},Bd={key:0,"command-dialog-footer":""},Wd=V({name:"Command.Dialog"}),jd=V({...Wd,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(e,{emit:t}){const n=e,{search:r,filtered:a}=Wt(),{emitter:s}=xn(),o=z();s.on("selectItem",l=>{t("select-item",l)});const i=()=>{r.value="",a.value.count=0,a.value.items=new Map,a.value.groups=new Set};return ca(()=>n.visible,i),Rn(i),(l,c)=>(f(),X(No,{to:"body",ref_key:"dialogRef",ref:o},[Y(An,{name:"command-dialog",appear:""},{default:A(()=>[e.visible?(f(),X(dr,{key:0,theme:e.theme},{default:A(()=>[k("div",xd,[k("div",Dd,[k("div",Vd,[k("div",Ud,[S(l.$slots,"header")]),k("div",Hd,[S(l.$slots,"body")]),l.$slots.footer?(f(),I("div",Bd,[S(l.$slots,"footer")])):G("v-if",!0)])])])]),_:3},8,["theme"])):G("v-if",!0)]),_:3})],512))}}),Kd=jt(jd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let ya=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((t,n)=>(n&=63,n<36?t+=n.toString(36):n<62?t+=(n-26).toString(36).toUpperCase():n>62?t+="-":t+="_",t),"");const Gd=["command-group-key","data-value"],Yd={key:0,"command-group-heading":""},zd={"command-group-items":"",role:"group"},Xd=V({name:"Command.Group"}),Jd=V({...Xd,props:{heading:{type:String,required:!0}},setup(e){const t=U(()=>`command-group-${ya()}`),{filtered:n,isSearching:r}=Wt(),a=U(()=>r.value?n.value.groups.has(t.value):!0);return(s,o)=>yn((f(),I("div",{"command-group":"",role:"presentation",key:g(t),"command-group-key":g(t),"data-value":e.heading},[e.heading?(f(),I("div",Yd,re(e.heading),1)):G("v-if",!0),k("div",zd,[S(s.$slots,"default")])],8,Gd)),[[wn,g(a)]])}}),qd=jt(Jd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),Qd=["placeholder","value"],Zd=V({name:"Command.Input"}),eh=V({...Zd,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(e,{emit:t}){const n=z(null),{search:r}=Wt(),a=U(()=>r.value),s=o=>{const i=o,l=o.target;r.value=l==null?void 0:l.value,t("input",i),t("update:value",r.value)};return gt(()=>{var o;(o=n.value)==null||o.focus()}),(o,i)=>(f(),I("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:e.placeholder,value:g(a),onInput:s},null,40,Qd))}}),th=jt(eh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),nh=["aria-selected","aria-disabled","command-item-key"],rh=V({name:"Command.Item"}),sh=V({...rh,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(e,{emit:t}){const n=e,r="command-item-select",a="data-value",{current:s}=xu(),{selectedNode:o,filtered:i,isSearching:l}=Wt(),{emitter:c}=xn(),u=z(),h=U(()=>`command-item-${ya()}`),d=U(()=>{const v=i.value.items.get(h.value);return l.value?v!==void 0:!0}),_=U(()=>Array.from(s)),E=()=>{var v;const b={key:h.value,value:((v=u.value)==null?void 0:v.getAttribute(a))||""};t("select",b),c.emit("selectItem",b)};return ca(_,v=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(b=>s.has(b.toLowerCase()))&&n.perform&&n.perform()}),gt(()=>{var v;(v=u.value)==null||v.addEventListener(r,E)}),Rn(()=>{var v;(v=u.value)==null||v.removeEventListener(r,E)}),(v,b)=>yn((f(),I("div",{ref_key:"itemRef",ref:u,"command-item":"",role:"option","aria-selected":g(o)===g(h),"aria-disabled":!g(d),key:g(h),"command-item-key":g(h),onClick:E},[S(v.$slots,"default")],8,nh)),[[wn,g(d)]])}}),ah=jt(sh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),oh=V({name:"Command.List"}),ih=V({...oh,setup(e){const{emitter:t}=xn(),n=z(),r=z();let a=null,s;return gt(()=>{s=r.value;const o=n.value;s&&o&&(a=new ResizeObserver(i=>{it(()=>{const l=s==null?void 0:s.offsetHeight;o==null||o.style.setProperty("--command-list-height",`${l==null?void 0:l.toFixed(1)}px`),t.emit("rerenderList",!0)})}),a.observe(s))}),Rn(()=>{a!==null&&s&&a.unobserve(s)}),(o,i)=>(f(),I("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[k("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[S(o.$slots,"default")],512)],512))}}),lh=jt(ih,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ch=V({name:"Command.Empty",setup(e,{attrs:t,slots:n}){const{filtered:r}=Wt(),a=U(()=>r.value.count===0);return()=>a.value?xt("div",{"command-empty":"",role:"presentation",...t},n):xt("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...t})}}),uh=V({name:"Command.Loading",setup(e,{attrs:t,slots:n}){return()=>xt("div",{"command-loading":"",role:"progressbar",...t},n)}}),dh=V({name:"Command.Separator",setup(e,{attrs:t,slots:n}){return()=>xt("div",{"command-separator":"",role:"separator",...t})}}),Tt=Object.assign(dr,{Dialog:Kd,Empty:ch,Group:qd,Input:th,Item:ah,List:lh,Loading:uh,Separator:dh,Root:dr});var Qr;const wa=typeof window<"u",hh=e=>typeof e=="string",ka=()=>{};wa&&((Qr=window==null?void 0:window.navigator)!=null&&Qr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function La(e){return typeof e=="function"?e():g(e)}function ph(e){return e}function mh(e){return qs()?(Qs(e),!0):!1}function fh(e,t=!0){Dt()?Ke(e):t?e():it(e)}function gh(e){var t;const n=La(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Mr=wa?window:void 0;function $t(...e){let t,n,r,a;if(hh(e[0])||Array.isArray(e[0])?([n,r,a]=e,t=Mr):[t,n,r,a]=e,!t)return ka;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const s=[],o=()=>{s.forEach(u=>u()),s.length=0},i=(u,h,d,_)=>(u.addEventListener(h,d,_),()=>u.removeEventListener(h,d,_)),l=we(()=>[gh(t),La(a)],([u,h])=>{o(),u&&s.push(...n.flatMap(d=>r.map(_=>i(u,d,_,h))))},{immediate:!0,flush:"post"}),c=()=>{l(),o()};return mh(c),c}const Zr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},es="__vueuse_ssr_handlers__";Zr[es]=Zr[es]||{};const _h={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function vh(e={}){const{reactive:t=!1,target:n=Mr,aliasMap:r=_h,passive:a=!0,onEventFired:s=ka}=e,o=tn(new Set),i={toJSON(){return{}},current:o},l=t?tn(i):i,c=new Set,u=new Set;function h(v,b){v in l&&(t?l[v]=b:l[v].value=b)}function d(){o.clear();for(const v of u)h(v,!1)}function _(v,b){var M,W;const y=(M=v.key)==null?void 0:M.toLowerCase(),T=[(W=v.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?o.add(y):o.delete(y));for(const C of T)u.add(C),h(C,b);y==="meta"&&!b?(c.forEach(C=>{o.delete(C),h(C,!1)}),c.clear()):typeof v.getModifierState=="function"&&v.getModifierState("Meta")&&b&&[...o,...T].forEach(C=>c.add(C))}$t(n,"keydown",v=>(_(v,!0),s(v)),{passive:a}),$t(n,"keyup",v=>(_(v,!1),s(v)),{passive:a}),$t("blur",d,{passive:!0}),$t("focus",d,{passive:!0});const E=new Proxy(l,{get(v,b,M){if(typeof b!="string")return Reflect.get(v,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(v,b,M);return t?g(W):W}});return E}var ts;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(ts||(ts={}));var bh=Object.defineProperty,ns=Object.getOwnPropertySymbols,yh=Object.prototype.hasOwnProperty,wh=Object.prototype.propertyIsEnumerable,rs=(e,t,n)=>t in e?bh(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,kh=(e,t)=>{for(var n in t||(t={}))yh.call(t,n)&&rs(e,n,t[n]);if(ns)for(var n of ns(t))wh.call(t,n)&&rs(e,n,t[n]);return e};const Lh={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};kh({linear:ph},Lh);function Eh(e={}){const{window:t=Mr,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:a=!0,includeScrollbar:s=!0}=e,o=z(n),i=z(r),l=()=>{t&&(s?(o.value=t.innerWidth,i.value=t.innerHeight):(o.value=t.document.documentElement.clientWidth,i.value=t.document.documentElement.clientHeight))};return l(),fh(l),$t("resize",l,{passive:!0}),a&&$t("orientationchange",l,{passive:!0}),{width:o,height:i}}const zn=z([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-08-03 05:07:46"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-08-03 05:07:46"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-08-03 05:07:46"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-08-03 05:07:46"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/docPreview.html",meta:{description:`<h1> 最全的 docx,pptx,xlsx(excel),pdf 文件预览方案总结 </h1>

最近遇到了文件预览的需求，但一搜索发现，这还不是一个简单的功能。于是又去查询了很多资料，调研了一些方案，也踩了好多坑。最后总结方案如下

1. 花钱解决 (使用市面上现有的文件预览服务)
   1. 微软
   2. google
   3. 阿里云 IMM
   4. XDOC
   5. Office Web 365
   6. wps 开放平台
2. 前端方案
   1. pptx 的预览方案
   2. pdf 的预览方案
   3. docx 的预览方案
   4. xlsx(excel) 的预览方案
   5. 前端预览方案总结
3. 服务端方案
   1. openOffice
   2. kkFileView
   3. onlyOffice

如果有其他人也遇到了同样的问题，有了这篇文章，希望能更方便的解决。

基本涵盖了所有解决方案。因此，标题写上 **最全** 的文件预览方案调研总结，应该不为过吧。

# 一。市面上现有的文件预览服务

## 1.微软

\`docx\`,\`pptx\`,\`xlsx\`可以说是\`office\`三件套，那自然得看一下 **微软官方** 提供的文件预览服务。使用方法特别简单，只需要将文件链接，拼接到参数后面即可。

记得\`encodeURL\`

\`\`\`js
https://view.officeapps.live.com/op/view.aspx?src=\${encodeURIComponent(url)}
\`\`\`

### (1).PPTX 预览效果：

![image.png](../../../assets/article/docPreview/ms_ppt.webp)

- 优点：还原度很高，功能很丰富，可以选择翻页，甚至支持点击播放动画。
- 缺点：不知道是不是墙的原因，加载稍慢。

### (2).Excel 预览效果：

![image.png](../../../assets/article/docPreview/ms_excel.webp)

### (3).Doxc 预览效果

![image.png](../../../assets/article/docPreview/ms_word.webp)

### (4).PDF 预览效果

这个我测试没有成功，返回了一个错误，其他人可以试试。

![image.png](../../../assets/article/docPreview/ms_file_not.webp)

### (5).总的来说

对于\`docx\`,\`pptx\`,\`xlsx\`都有较好的支持，\`pdf\`不行。

还有一个坑点是：这个服务是否稳定，有什么限制，是否收费，都查不到一个定论。在\`office\`官方网站上甚至找不到介绍这个东西的地方。

目前只能找到一个\`Q&A\`:https://answers.microsoft.com/en-us/msoffice/forum/all/what-is-the-status-of-viewofficeappslivecom/830fd75c-9b47-43f9-89c9-4303703fd7f6

微软官方人员回答表示：

![image.png](../../../assets/article/docPreview/ms_answer.webp)

翻译翻译，就是：几乎永久使用，没有收费计划，不会存储预览的文件数据，限制文件\`10MB\`，建议用于 **查看互联网上公开的文件**。

但经过某些用户测试发现：

![image.png](../../../assets/article/docPreview/ms_answer_2.webp)

使用了微软的文件预览服务，然后删除了文件地址，仍然可访问，但过一段时间会失效。

## 2.Google Drive 查看器

接入简单，同 \`Office Web Viewer\`，只需要把 \`src\` 改为\`https://drive.google.com/viewer?url=\${encodeURIComponent(url)}\`即可。

限制\`25MB\`,支持以下格式：

![image.png](../../../assets/article/docPreview/google_doc_view.webp)

测试效果，支持\`docx,pptx,xlsx,pdf\`预览，但\`pptx\`预览的效果不如微软，没有动画效果，样式有小部分会错乱。

**由于某些众所周知的原因，不可用**

## 3.阿里云 IMM

官方文档如下：https://help.aliyun.com/document_detail/63273.html

![image.png](../../../assets/article/docPreview/ali_doc.webp)

付费使用

## 4.XDOC 文档预览

说了一些大厂的，在介绍一些其他的，**需要自行分辨**

官网地址：https://view.xdocin.com/view-xdocin-com_6x5f4x.htm

![image.png](../../../assets/article/docPreview/xdoc.webp)

## 5.Office Web 365

需要注意的是，虽然名字很像\`office\`，但我们看网页的\`Copyright\`可以发现，其实是一个西安的公司，**不是微软**。

但毕竟也提供了文件预览的服务

官网地址：https://www.officeweb365.com/

![image.png](../../../assets/article/docPreview/ow365.webp)

## 6.WPS 开放平台

官方地址：https://solution.wps.cn/

![image.png](../../../assets/article/docPreview/wps_office.webp)

付费使用，价格如下：

![image.png](../../../assets/article/docPreview/wps_office_price.webp)

# 二。前端处理方案

## 1.pptx 的预览方案

先查一下有没有现成的轮子，目前\`pptx\`的开源预览方案能找到的只有这个：https://github.com/g21589/PPTX2HTML。但已经六七年没有更新，也没有维护，笔者使用的时候发现有很多兼容性问题。

简单来说就是，没有。对于这种情况，我们可以自行解析，主要步骤如下：

1. 查询\`pptx\`的国际标准
2. 解析\`pptx\`文件
3. 渲染成\`html\`或者\`canvas\`进行展示

我们先去找一下\`pptx\`的国际标准，官方地址：[officeopenxml](http://officeopenxml.com/)

先解释下什么是\`officeopenxml\`:

> Office OpenXML，也称为 OpenXML 或 OOXML，是一种基于 XML 的办公文档格式，包括文字处理文档、电子表格、演示文稿以及图表、图表、形状和其他图形材料。该规范由微软开发，并于 2006 年被 ECMA 国际采用为 ECMA-376。第二个版本于 2008 年 12 月发布，第三个版本于 2011 年 6 月发布。该规范已被 ISO 和 IEC 采用为 ISO/IEC 29500。

> 虽然 Microsoft 继续支持较旧的二进制格式 (.doc、.xls 和.ppt)，但 OOXML 现在是所有 Microsoft Office 文档 (.docx、.xlsx 和.pptx) 的默认格式。

由此可见，\`Office OpenXML\`由微软开发，目前已经是国际标准。接下来我们看一下\`pptx\`里面有哪些内容，具体可以看\`pptx\`的官方标准：[officeopenxml-pptx](http://officeopenxml.com/anatomyofOOXML-pptx.php)

> PresentationML 或.pptx 文件是一个**zip 文件**，其中包含许多“部分”（通常是 UTF-8 或 UTF-16 编码）或 XML 文件。该包还可能包含其他媒体文件，例如图像。该结构根据 OOXML 标准 ECMA-376 第 2 部分中概述的开放打包约定进行组织。

![image.png](../../../assets/article/docPreview/xml.webp)

根据国际标准，我们知道，\`pptx\`文件本质就是一个\`zip\`文件，其中包含许多部分：

> 部件的数量和类型将根据演示文稿中的内容而有所不同，但始终会有一个 [Content_Types].xml、一个或多个关系（.rels）部件和一个演示文稿部件（演示文稿.xml），它位于 ppt 文件夹中，用于 Microsoft Powerpoint 文件。通常，还将至少有一个幻灯片部件，以及一张母版幻灯片和一张版式幻灯片，从中形成幻灯片。

那么\`js\`如何读取\`zip\`呢？

找到一个工具：https://www.npmjs.com/package/jszip

于是我们可以开始尝试解析\`pptx\`了。

\`\`\`ts
import JSZip from 'jszip';
// 加载 pptx 数据
const zip = await JSZip.loadAsync(pptxData);
\`\`\`

- 解析\`[Content_Types].xml\`

每个\`pptx\`必然会有一个 \`[Content_Types].xml\`。此文件包含包中部件的所有内容类型的列表。每个部件及其类型都必须列在 \`[Content_Types].xml\` 中。通过它里面的内容，可以解析其他的文件数据

\`\`\`ts
const filesInfo = await getContentTypes(zip);

async function getContentTypes(zip: JSZip) {
  const ContentTypesJson = await readXmlFile(zip, '[Content_Types].xml');
  const subObj = ContentTypesJson['Types']['Override'];
  const slidesLocArray = [];
  const slideLayoutsLocArray = [];
  for (let i = 0; i < subObj.length; i++) {
    switch (subObj[i]['attrs']['ContentType']) {
      case 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml':
        slidesLocArray.push(subObj[i]['attrs']['PartName'].substr(1));
        break;
      case 'application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml':
        slideLayoutsLocArray.push(subObj[i]['attrs']['PartName'].substr(1));
        break;
      default:
    }
  }
  return {
    slides: slidesLocArray,
    slideLayouts: slideLayoutsLocArray,
  };
}
\`\`\`

- 解析演示文稿

先获取\`ppt\`目录下的\`presentation.xml\`演示文稿的大小

由于演示文稿是\`xml\`格式，要真正的读取内容需要执行 \`readXmlFile\`

\`\`\`ts
const slideSize = await getSlideSize(zip);
async function getSlideSize(zip: JSZip) {
  const content = await readXmlFile(zip, 'ppt/presentation.xml');
  const sldSzAttrs = content['p:presentation']['p:sldSz']['attrs'];
  return {
    width: (parseInt(sldSzAttrs['cx']) * 96) / 914400,
    height: (parseInt(sldSzAttrs['cy']) * 96) / 914400,
  };
}
\`\`\`

- 加载主题

根据 \`officeopenxml\`的标准解释

> 每个包都包含一个关系部件，用于定义其他部件之间的关系以及与包外部资源的关系。这样可以将关系与内容分开，并且可以轻松地更改关系，而无需更改引用目标的源。

> 除了包的关系部分之外，作为一个或多个关系源的每个部件都有自己的关系部分。每个这样的关系部件都可以在部件的\\_rels 子文件夹中找到，并通过在部件名称后附加“.rels”来命名。

其中主题的相关信息就在\`ppt/_rels/presentation.xml.rels\`中

\`\`\`ts
async function loadTheme(zip: JSZip) {
  const preResContent = await readXmlFile(zip, 'ppt/_rels/presentation.xml.rels');
  const relationshipArray = preResContent['Relationships']['Relationship'];
  let themeURI;
  if (relationshipArray.constructor === Array) {
    for (let i = 0; i < relationshipArray.length; i++) {
      if (
        relationshipArray[i]['attrs']['Type'] ===
        'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme'
      ) {
        themeURI = relationshipArray[i]['attrs']['Target'];
        break;
      }
    }
  } else if (
    relationshipArray['attrs']['Type'] === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme'
  ) {
    themeURI = relationshipArray['attrs']['Target'];
  }

  if (themeURI === undefined) {
    throw Error("Can't open theme file.");
  }

  return readXmlFile(zip, 'ppt/' + themeURI);
}
\`\`\`

后续\`ppt\`里面的其他内容，都可以这么去解析。根据\`officeopenxml\`标准，可能包含：
Part | Description |
| `,title:"一。市面上现有的文件预览服务",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/video.html",meta:{description:`<h1>实现自适应码率 Web 视频加密播放：前后端的挑战与解决方案</h1>

最近又遇到了\`web\`视频化的场景，之前也有过调研：[H5 视频化调研浅析](https://juejin.cn/post/7238739662822735933)

但这次稍微复杂一些，这次解决的是：

1. 视频播放的技术方案调研

服务端实现：

1. 视频转码
2. 生成不同码率的视频
3. 进行视频标准加密
4. 不同码率视频合并，用于动态码率播放

\`web\`端实现

1. \`web\`端播放器的设计
2. \`web\`端播放器的自定义扩展
3. 可拖拽进度条
4. 音量控制
5. 根据当前带宽自适应码率切换
6. 手动清晰度切换
7. 倍速播放
8. 样式自定义覆盖
9. 标准加密视频播放
10. 基于原生开发，可在所有框架运行，统一跨框架情况
11. 各浏览器控件统一

其中\`web\`端源码已添加\`MIT\`协议并完全开源，如果看完对大家有帮助的话，欢迎大家\`star\`,\`issue\`,\`pr\`，也希望能友好交流～

demo 地址：https://chaxus.github.io/ran/src/ranui/player/

源码地址：https://github.com/chaxus/ran/tree/main/packages/ranui

\`demo\`文档做了国际化，可切换到中文

任何一个项目，立项肯定先是技术调研，我们先看看一些大公司的视频播放方案

# 一。一些知名公司的 web 视频播放方案

## 1.B 站

我们先看看 B 站的，毕竟 B 站的主营业务就是视频弹幕网站，简直专业对口。

先找一个例子：https://www.bilibili.com/video/BV1FM411N7LJ 访问它。

![image.png](../../../assets/article/video/bilibili_video_code.webp)

打开控制台，可以看到，视频在播放的时候，会不断的请求\`m4s\`的视频文件。

毕竟一整个视频文件往往比较大，不可能先请求完视频文件，再进行播放。因此将一个大的视频文件分割成很多小的片段，边加载边播放，是一种更好的方式。

![image.png](../../../assets/article/video/bili_demo_url.webp)

每次请求的\`m4s\`文件大概在几十\`kb\`到几百\`kb\`不等。

![image.png](../../../assets/article/video/bilibili_video_m4s.webp)

那为什么不采用\`http\`的\`range\`呢，可以请求一个文件的部分内容，而且粒度更细，可以设置字节范围。在\`http\`请求的\`header\`中，类似这样

\`\`\`js
Range: bytes = 3171375 - 3203867;
\`\`\`

我们可以检查这个链接请求\`https://upos-sz-mirror08c.bilivideo.com/upgcxcode/67/92/1008149267/1008149267-1-30064.m4s\`的请求头，就能发现，B 站采用的是，即分片加载，同时还用了\`range\`的方式。

## 2. 爱奇艺：（爱奇艺、土豆、优酷）

爱奇艺这里就不贴视频链接了，因为随便点一个视频，都要先看广告。

![image.png](../../../assets/article/video/aqiyi_demo.webp)

爱奇艺的视频主要请求的是\`f4v\`格式，也是分片加载。

播放一个视频时，请求多个\`f4v\`文件。

也采用\`Range\`。但和 B 站不一样的是，B 站的\`Range\`属性是在\`m4s\`请求的请求头里面，而爱奇艺的看起来是在\`querystring\`上，在请求\`query\`上带着\`range\`参数。

因为没发现这个请求的\`header\`里面有\`range\`参数。比如：

\`https://v-6fce1712.71edge.com/videos/other/20231113/6b/bb/3f3fe83b89124248c3216156dfe2f4c3.f4v?dis_k=2ba39ee8c55c4d23781e3fb9f91fa7a46&dis_t=1701439831&dis_dz=CNC-BeiJing&dis_st=46&src=iqiyi.com&dis_hit=0&dis_tag=01010000&uuid=72713f52-6569e957-351&cross-domain=1&ssl=1&pv=0.1&cphc=arta&range=0-9000\`

## 3.抖音：

抖音的方案简单粗暴，访问的链接是这个：
https://m.ixigua.com/douyin/share/video/7206914252840370721?aweme_type=107&schema_type=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&app=aweme

通过查看控制台，我们可以发现，直接请求了一个视频的地址

![image.png](../../../assets/article/video/tiktok_video.webp)

没有进行分片，但用到了请求\`range\`，所以可以看到视频，是边播放边缓冲一部分。

不过我在开发的时候发现，目前租用的服务云厂商，默认会帮我们实现这项技术。

因为我把\`mp4\`视频上传到云服务器，通过链接进行播放的时候，就是边缓冲边播放的。

我们可以直接把这个视频地址拿出来，放到浏览器里面能直接播放，这样观察更明显。

![image.png](../../../assets/article/video/tiktik_video_demo.webp)

但 B 站和爱奇艺却不能这样，因为他们采用的\`m4s\`和\`f4v\`都不是一种通用的视频格式，需要使用专门的软件或工具才能打开和编辑。

## 4.小红书：

测试用的例子链接：https://www.xiaohongshu.com/discovery/item/63b286d1000000001f00b495

小红书的方案更加简单粗暴，打开控制台，直接告诉你就是请求一个\`mp4\`，然后直接播放就完事了。

![image.png](../../../assets/article/video/red_book.webp)

## 5.总结

看完了以上的各家大厂的方案，我们可以看到，基本原理都是边播放边加载，减少直接加载大视频文本的成本。并且通过分片传输，还能动态控制视频码率（清晰度）。做到根据网速，加载不同码率的分片文件，做到动态码率适应。

同时采用的视频格式，比如\`f4v\`，\`m4s\`，都不是能直接播放的媒体格式，需要一定的处理。增加盗取视频的成本，增加一定的安全性。

如果没有强要求，也可以直接采用\`mp4\`，或者直接用\`video\`播放一个视频文件地址。

# 二。常见的视频格式与协议

我们知道视频的常见格式有\`mp4\`，同时上面介绍了 B 站播放用的\`m4s\`格式，爱奇艺用的\`f4v\`格式

- 除了这些还有哪些视频格式？
- 为什么有这么多视频格式，有哪些不同点呢？
- 为什么这些公司会采用这种格式来播放视频呢？

## 1. B 站用的\`m4s\`

\`M4S\`格式不是一种通用的视频格式，需要使用专门的软件或工具才能打开和编辑。

\`M4S\` 通常会和 \`MPEG-DASH\` 流媒体技术一起，通过流式传输的视频的一小部分。播放器会按接收顺序播放这些片段。第一个 \`M4S\` 段会包含一些初始化的数据标识。

\`MPEG-DASH\` 是一种自适应比特率流媒体技术，通过将内容分解为一系列不同码率的\`M4S\`片段，然后根据当前网络带宽进行自动调整。如果想在在\`web\`音视频中采用\`DASH\`技术，可以看下
https://github.com/Dash-Industry-Forum/dash.js

## 2. 爱奇艺的\`f4v\`

\`F4V\`是一种流媒体格式，它是由\`Adobe\`公司推出的，继\`FLV\`格式之后支持\`H.264\`编码的流媒体格式。\`F4V\`格式的视频不是一种通用的视频格式，**但通常情况下**，都可以将文件后缀改为\`FLV\`，这样就可以使用支持\`FLV\`的播放器进行观看。

\`FLV\`格式跟常见的\`MP4\`格式比起来，结构更加简单，所以加载\`metadata\`(视频元数据，比如视频时长等信息) 会更快。具体结构我们可以在这里查到：https://en.wikipedia.org/wiki/Flash_Video#Flash_Video_Structure

比如，这是\`FLV\`文件的标准头，定义了从几个比特到几个比特之间，是什么含义。我们知道后，可以用\`MediaSource\`进行读取和转码。

| Field          | Data Type    | Default  | Details                                             |
| `,title:"一。一些知名公司的web视频播放方案",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/visual.html",meta:{description:"",title:"实现曲线",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/math/",meta:{description:"",title:"math",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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
| `,title:"r-player",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-08-03 05:07:46"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/math/",meta:{description:"",title:"math数学公式",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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
| `,title:"r-player视频播放器",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-08-03 05:07:46"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-08-03 05:07:46"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-08-03 05:07:46"}}]),Sh={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Oh(e,t="yyyy-MM-dd hh:mm:ss"){e instanceof Date||(e=new Date(e));const n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,`${e.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in n)new RegExp(`(${r})`).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length===1?n[r]:`00${n[r]}`.substr(`${n[r]}`.length)));return t}const Ih={},Ch={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Ah=Po('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Th=[Ah];function Nh(e,t){return f(),I("svg",Ch,Th)}const Mh=q(Ih,[["render",Nh]]),Pr=e=>(Te("data-v-e93b2392"),e=e(),Ne(),e),Ph={class:"blog-search","data-pagefind-ignore":"all"},$h=Pr(()=>k("span",null,[k("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[k("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),Rh={class:"search-dialog"},Fh={class:"link"},xh={class:"title"},Dh={key:0,class:"date"},Vh=["innerHTML"],Uh={class:"command-palette-logo"},Hh={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Bh=Pr(()=>k("span",{class:"command-palette-Label"},"Search by",-1)),Wh=Pr(()=>k("ul",{class:"command-palette-commands"},[k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),k("span",{class:"command-palette-Label"},"to select")]),k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),k("span",{class:"command-palette-Label"},"to navigate")]),k("li",null,[k("kbd",{class:"command-palette-commands-key"},[k("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[k("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[k("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),k("span",{class:"command-palette-Label"},"to close")])],-1)),jh=V({__name:"Search",setup(e){$o(D=>({"5b3346c5":c.value}));const t=z([]),n=Sh,{localeIndex:r,site:a}=bn(),s=U(()=>{var D;return{...n,...((D=n==null?void 0:n.locales)==null?void 0:D[r.value])||{}}}),o=U(()=>{var D;return((D=s.value)==null?void 0:D.showDate)??!0}),i=Eh(),l=U(()=>i.width.value<760),c=U(()=>l.value?0:1),u=U(()=>{var D;return(D=s.value)!=null&&D.heading?s.value.heading.replace(/\{\{searchResult\}\}/,t.value.length):`Total: ${t.value.length} search results.`}),h=z("");Ke(()=>{h.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const d=z(!1),_=z(""),E=vh({passive:!1,onEventFired(D){D.ctrlKey&&D.key==="k"&&D.type==="keydown"&&D.preventDefault()}}),v=E["Meta+K"],b=E["Ctrl+K"],M=E.Escape;we(v,D=>{D&&(d.value=!0)}),we(b,D=>{D&&(d.value=!0)}),we(M,D=>{D&&(d.value=!1)});function W(){if(!_.value){t.value=[];return}t.value=zn.value.filter(D=>`${D.meta.description}${D.meta.title}`.includes(_.value)).map(D=>{var ie,Ee;return{...D,meta:{...D.meta,description:((Ee=(ie=D.meta)==null?void 0:ie.description)==null?void 0:Ee.replace(new RegExp(`(${_.value})`,"g"),"<mark>$1</mark>"))||""}}}),t.value.sort((D,ie)=>+new Date(ie.meta.date)-+new Date(D.meta.date))}const y=U(()=>{var D;return((D=s.value)==null?void 0:D.resultOptimization)??!0});we(()=>_.value,async()=>{var D,ie,Ee;if(!((D=window==null?void 0:window.__pagefind__)!=null&&D.search))W();else{const Oe=typeof s.value.customSearchQuery=="function"?s.value.customSearchQuery(_.value):_.value;await((Ee=(ie=window==null?void 0:window.__pagefind__)==null?void 0:ie.search)==null?void 0:Ee.call(ie,Oe).then(async ve=>{const tt=(await Promise.all(ve.results.map(be=>be.data()))).map(be=>{var Le;return{route:be.url.startsWith(a.value.base)?be.url:Tn(be.url),meta:{title:be.meta.title,description:be.excerpt,date:(Le=be==null?void 0:be.meta)==null?void 0:Le.date}}}).map(be=>{const Le=zn.value.find(He=>He.route===be.route);return{...be,meta:{...be.meta,...Le==null?void 0:Le.meta}}}).filter(be=>!y.value||zn.value.some(Le=>Le.route===be.route));t.value=tt.filter(s.value.filter??(()=>!0))}))}it(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(Oe=>{Oe.setAttribute("aria-disabled","false")})})});function L(D){D.target===D.currentTarget&&(d.value=!1)}we(()=>d.value,D=>{var ie;D?it(()=>{var Ee;(Ee=document.querySelector("div[command-dialog-mask]"))==null||Ee.addEventListener("click",L)}):(ie=document.querySelector("div[command-dialog-mask]"))==null||ie.removeEventListener("click",L)});const T=z(999),C=z(0),$=U(()=>{const ie=C.value%Math.ceil(t.value.length/T.value)*T.value;return t.value.slice(ie,ie+T.value)}),x=Ro(),R=sn();function he(D){d.value=!1,R.path!==D.value&&x.go(D.value)}const{lang:ke}=bn(),Z=U(()=>s.value.langReload??!0);return we(()=>ke.value,()=>{Z.value&&window.location.reload()}),(D,ie)=>{var Oe;const Ee=_t("ClientOnly");return f(),I("div",Ph,[k("div",{class:"nav-search-btn-wait",onClick:ie[0]||(ie[0]=ve=>d.value=!0)},[$h,yn(k("span",{class:"search-tip"},re(((Oe=s.value)==null?void 0:Oe.btnPlaceholder)||"Search"),513),[[wn,!l.value]]),yn(k("span",{class:"metaKey"},re(h.value)+" K ",513),[[wn,!l.value]])]),Y(Ee,null,{default:A(()=>[Y(g(Tt).Dialog,{visible:d.value,theme:"algolia"},Fo({header:A(()=>{var ve;return[Y(g(Tt).Input,{value:_.value,"onUpdate:value":ie[1]||(ie[1]=Ue=>_.value=Ue),placeholder:((ve=s.value)==null?void 0:ve.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:A(()=>[k("div",Rh,[Y(g(Tt).List,null,{default:A(()=>[t.value.length?(f(),X(g(Tt).Group,{key:1,heading:u.value},{default:A(()=>[(f(!0),I(ge,null,$e($.value,ve=>(f(),X(g(Tt).Item,{key:ve.route,"data-value":ve.route,onSelect:he},{default:A(()=>[k("div",Fh,[k("div",xh,[k("span",null,re(ve.meta.title),1),o.value&&ve.meta.date?(f(),I("span",Dh,re(g(Oh)(ve.meta.date,"yyyy-MM-dd")),1)):G("",!0)]),k("div",{class:"des",innerHTML:ve.meta.description},null,8,Vh)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(f(),X(g(Tt).Empty,{key:0},{default:A(()=>{var ve;return[Ze(re(((ve=s.value)==null?void 0:ve.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[t.value.length?{name:"footer",fn:A(()=>[k("div",Uh,[k("a",Hh,[Bh,Y(Mh,{style:{width:"77px"}})])]),Wh]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),Kh=q(jh,[["__scopeId","data-v-e93b2392"]]),Gh=V({__name:"VPNavBarSocialLinks",setup(e){const{theme:t}=ae();return(n,r)=>g(t).socialLinks?(f(),X(Tr,{key:0,class:"VPNavBarSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),Yh=q(Gh,[["__scopeId","data-v-6c2e1ed8"]]),zh=["href","rel","target"],Xh={key:1},Jh={key:2},qh=V({__name:"VPNavBarTitle",setup(e){const{site:t,theme:n}=ae(),{hasSidebar:r}=ct(),{currentLang:a}=an(),s=U(()=>{var l;return typeof n.value.logoLink=="string"?n.value.logoLink:(l=n.value.logoLink)==null?void 0:l.link}),o=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.rel}),i=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.target});return(l,c)=>(f(),I("div",{class:de(["VPNavBarTitle",{"has-sidebar":g(r)}])},[k("a",{class:"title",href:s.value??g(Sr)(g(a).link),rel:o.value,target:i.value},[S(l.$slots,"nav-bar-title-before",{},void 0,!0),g(n).logo?(f(),X(Ln,{key:0,class:"logo",image:g(n).logo},null,8,["image"])):G("",!0),g(n).siteTitle?(f(),I("span",Xh,re(g(n).siteTitle),1)):g(n).siteTitle===void 0?(f(),I("span",Jh,re(g(t).title),1)):G("",!0),S(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,zh)],2))}}),Qh=q(qh,[["__scopeId","data-v-ef354163"]]),Zh={class:"items"},ep={class:"title"},tp=V({__name:"VPNavBarTranslations",setup(e){const{theme:t}=ae(),{localeLinks:n,currentLang:r}=an({correspondingLink:!0});return(a,s)=>g(n).length&&g(r).label?(f(),X(Ar,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:g(t).langMenuLabel||"Change language"},{default:A(()=>[k("div",Zh,[k("p",ep,re(g(r).label),1),(f(!0),I(ge,null,$e(g(n),o=>(f(),X(Fn,{key:o.link,item:o},null,8,["item"]))),128))])]),_:1},8,["label"])):G("",!0)}}),np=q(tp,[["__scopeId","data-v-674d0fc2"]]),rp=e=>(Te("data-v-01068026"),e=e(),Ne(),e),sp={class:"wrapper"},ap={class:"container"},op={class:"title"},ip={class:"content"},lp={class:"content-body"},cp=rp(()=>k("div",{class:"divider"},[k("div",{class:"divider-line"})],-1)),up=V({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const t=e,{y:n}=Js(),{hasSidebar:r}=ct(),{frontmatter:a}=ae(),s=z({});return Lr(()=>{s.value={"has-sidebar":r.value,home:a.value.layout==="home",top:n.value===0,"screen-open":t.isScreenOpen}}),(o,i)=>(f(),I("div",{class:de(["VPNavBar",s.value])},[k("div",sp,[k("div",ap,[k("div",op,[Y(Qh,null,{"nav-bar-title-before":A(()=>[S(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(o.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),k("div",ip,[k("div",lp,[S(o.$slots,"nav-bar-content-before",{},void 0,!0),Y(Kh,{class:"search"}),Y(Au,{class:"menu"}),Y(np,{class:"translations"}),Y(Mc,{class:"appearance"}),Y(Yh,{class:"social-links"}),Y(mu,{class:"extra"}),S(o.$slots,"nav-bar-content-after",{},void 0,!0),Y(yu,{class:"hamburger",active:o.isScreenOpen,onClick:i[0]||(i[0]=l=>o.$emit("toggle-screen"))},null,8,["active"])])])])]),cp],2))}}),dp=q(up,[["__scopeId","data-v-01068026"]]),hp={key:0,class:"VPNavScreenAppearance"},pp={class:"text"},mp=V({__name:"VPNavScreenAppearance",setup(e){const{site:t,theme:n}=ae();return(r,a)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(f(),I("div",hp,[k("p",pp,re(g(n).darkModeSwitchLabel||"Appearance"),1),Y(Ir)])):G("",!0)}}),fp=q(mp,[["__scopeId","data-v-b3777260"]]),gp=V({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const t=Bt("close-screen");return(n,r)=>(f(),X(Je,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t),innerHTML:n.item.text},null,8,["href","target","rel","onClick","innerHTML"]))}}),_p=q(gp,[["__scopeId","data-v-37712f63"]]),vp=V({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const t=Bt("close-screen");return(n,r)=>(f(),X(Je,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t)},{default:A(()=>[Ze(re(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Ea=q(vp,[["__scopeId","data-v-5eefc8a0"]]),bp={class:"VPNavScreenMenuGroupSection"},yp={key:0,class:"title"},wp=V({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(t,n)=>(f(),I("div",bp,[t.text?(f(),I("p",yp,re(t.text),1)):G("",!0),(f(!0),I(ge,null,$e(t.items,r=>(f(),X(Ea,{key:r.text,item:r},null,8,["item"]))),128))]))}}),kp=q(wp,[["__scopeId","data-v-3bfba495"]]),Lp=e=>(Te("data-v-bb2a26d1"),e=e(),Ne(),e),Ep=["aria-controls","aria-expanded"],Sp=["innerHTML"],Op=Lp(()=>k("span",{class:"vpi-plus button-icon"},null,-1)),Ip=["id"],Cp={key:0,class:"item"},Ap={key:1,class:"item"},Tp={key:2,class:"group"},Np=V({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const t=e,n=z(!1),r=U(()=>`NavScreenGroup-${t.text.replace(" ","-").toLowerCase()}`);function a(){n.value=!n.value}return(s,o)=>(f(),I("div",{class:de(["VPNavScreenMenuGroup",{open:n.value}])},[k("button",{class:"button","aria-controls":r.value,"aria-expanded":n.value,onClick:a},[k("span",{class:"button-text",innerHTML:s.text},null,8,Sp),Op],8,Ep),k("div",{id:r.value,class:"items"},[(f(!0),I(ge,null,$e(s.items,i=>(f(),I(ge,{key:JSON.stringify(i)},["link"in i?(f(),I("div",Cp,[Y(Ea,{item:i},null,8,["item"])])):"component"in i?(f(),I("div",Ap,[(f(),X(Xe(i.component),pt({ref_for:!0},i.props,{"screen-menu":""}),null,16))])):(f(),I("div",Tp,[Y(kp,{text:i.text,items:i.items},null,8,["text","items"])]))],64))),128))],8,Ip)],2))}}),Mp=q(Np,[["__scopeId","data-v-bb2a26d1"]]),Pp={key:0,class:"VPNavScreenMenu"},$p=V({__name:"VPNavScreenMenu",setup(e){const{theme:t}=ae();return(n,r)=>g(t).nav?(f(),I("nav",Pp,[(f(!0),I(ge,null,$e(g(t).nav,a=>(f(),I(ge,{key:JSON.stringify(a)},["link"in a?(f(),X(_p,{key:0,item:a},null,8,["item"])):"component"in a?(f(),X(Xe(a.component),pt({key:1,ref_for:!0},a.props,{"screen-menu":""}),null,16)):(f(),X(Mp,{key:2,text:a.text||"",items:a.items},null,8,["text","items"]))],64))),128))])):G("",!0)}}),Rp=V({__name:"VPNavScreenSocialLinks",setup(e){const{theme:t}=ae();return(n,r)=>g(t).socialLinks?(f(),X(Tr,{key:0,class:"VPNavScreenSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),Sa=e=>(Te("data-v-e6a7804e"),e=e(),Ne(),e),Fp=Sa(()=>k("span",{class:"vpi-languages icon lang"},null,-1)),xp=Sa(()=>k("span",{class:"vpi-chevron-down icon chevron"},null,-1)),Dp={class:"list"},Vp=V({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:t,currentLang:n}=an({correspondingLink:!0}),r=z(!1);function a(){r.value=!r.value}return(s,o)=>g(t).length&&g(n).label?(f(),I("div",{key:0,class:de(["VPNavScreenTranslations",{open:r.value}])},[k("button",{class:"title",onClick:a},[Fp,Ze(" "+re(g(n).label)+" ",1),xp]),k("ul",Dp,[(f(!0),I(ge,null,$e(g(t),i=>(f(),I("li",{key:i.link,class:"item"},[Y(Je,{class:"link",href:i.link},{default:A(()=>[Ze(re(i.text),1)]),_:2},1032,["href"])]))),128))])],2)):G("",!0)}}),Up=q(Vp,[["__scopeId","data-v-e6a7804e"]]),Hp={class:"container"},Bp=V({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const t=z(null),n=Zs($n?document.body:null);return(r,a)=>(f(),X(An,{name:"fade",onEnter:a[0]||(a[0]=s=>n.value=!0),onAfterLeave:a[1]||(a[1]=s=>n.value=!1)},{default:A(()=>[r.open?(f(),I("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:t,id:"VPNavScreen"},[k("div",Hp,[S(r.$slots,"nav-screen-content-before",{},void 0,!0),Y($p,{class:"menu"}),Y(Up,{class:"translations"}),Y(fp,{class:"appearance"}),Y(Rp,{class:"social-links"}),S(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):G("",!0)]),_:3}))}}),Wp=q(Bp,[["__scopeId","data-v-973630e2"]]),jp={key:0,class:"VPNav"},Kp=V({__name:"VPNav",setup(e){const{isScreenOpen:t,closeScreen:n,toggleScreen:r}=yc(),{frontmatter:a}=ae(),s=U(()=>a.value.navbar!==!1);return Er("close-screen",n),gt(()=>{$n&&document.documentElement.classList.toggle("hide-nav",!s.value)}),(o,i)=>s.value?(f(),I("header",jp,[Y(dp,{"is-screen-open":g(t),onToggleScreen:g(r)},{"nav-bar-title-before":A(()=>[S(o.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(o.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(o.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(o.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),Y(Wp,{open:g(t)},{"nav-screen-content-before":A(()=>[S(o.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(o.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):G("",!0)}}),Gp=q(Kp,[["__scopeId","data-v-a633b982"]]),Oa=e=>(Te("data-v-adba6566"),e=e(),Ne(),e),Yp=["role","tabindex"],zp=Oa(()=>k("div",{class:"indicator"},null,-1)),Xp=Oa(()=>k("span",{class:"vpi-chevron-right caret-icon"},null,-1)),Jp=[Xp],qp={key:1,class:"items"},Qp=V({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const t=e,{collapsed:n,collapsible:r,isLink:a,isActiveLink:s,hasActiveLink:o,hasChildren:i,toggle:l}=di(U(()=>t.item)),c=U(()=>i.value?"section":"div"),u=U(()=>a.value?"a":"div"),h=U(()=>i.value?t.depth+2===7?"p":`h${t.depth+2}`:"p"),d=U(()=>a.value?void 0:"button"),_=U(()=>[[`level-${t.depth}`],{collapsible:r.value},{collapsed:n.value},{"is-link":a.value},{"is-active":s.value},{"has-active":o.value}]);function E(b){"key"in b&&b.key!=="Enter"||!t.item.link&&l()}function v(){t.item.link&&l()}return(b,M)=>{const W=_t("VPSidebarItem",!0);return f(),X(Xe(c.value),{class:de(["VPSidebarItem",_.value])},{default:A(()=>[b.item.text?(f(),I("div",pt({key:0,class:"item",role:d.value},xo(b.item.items?{click:E,keydown:E}:{},!0),{tabindex:b.item.items&&0}),[zp,b.item.link?(f(),X(Je,{key:0,tag:u.value,class:"link",href:b.item.link,rel:b.item.rel,target:b.item.target},{default:A(()=>[(f(),X(Xe(h.value),{class:"text",innerHTML:b.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(f(),X(Xe(h.value),{key:1,class:"text",innerHTML:b.item.text},null,8,["innerHTML"])),b.item.collapsed!=null&&b.item.items&&b.item.items.length?(f(),I("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:v,onKeydown:Do(v,["enter"]),tabindex:"0"},Jp,32)):G("",!0)],16,Yp)):G("",!0),b.item.items&&b.item.items.length?(f(),I("div",qp,[b.depth<5?(f(!0),I(ge,{key:0},$e(b.item.items,y=>(f(),X(W,{key:y.text,item:y,depth:b.depth+1},null,8,["item","depth"]))),128)):G("",!0)])):G("",!0)]),_:1},8,["class"])}}}),Zp=q(Qp,[["__scopeId","data-v-adba6566"]]),em=V({__name:"VPSidebarGroup",props:{items:{}},setup(e){const t=z(!0);let n=null;return Ke(()=>{n=setTimeout(()=>{n=null,t.value=!1},300)}),Rn(()=>{n!=null&&(clearTimeout(n),n=null)}),(r,a)=>(f(!0),I(ge,null,$e(r.items,s=>(f(),I("div",{key:s.text,class:de(["group",{"no-transition":t.value}])},[Y(Zp,{item:s,depth:0},null,8,["item"])],2))),128))}}),tm=q(em,[["__scopeId","data-v-92e4e92a"]]),Ia=e=>(Te("data-v-d31a5c76"),e=e(),Ne(),e),nm=Ia(()=>k("div",{class:"curtain"},null,-1)),rm={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},sm=Ia(()=>k("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),am=V({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:t,hasSidebar:n}=ct(),r=e,a=z(null),s=Zs($n?document.body:null);we([r,a],()=>{var i;r.open?(s.value=!0,(i=a.value)==null||i.focus()):s.value=!1},{immediate:!0,flush:"post"});const o=z(0);return we(t,()=>{o.value+=1},{deep:!0}),(i,l)=>g(n)?(f(),I("aside",{key:0,class:de(["VPSidebar",{open:i.open}]),ref_key:"navEl",ref:a,onClick:l[0]||(l[0]=Vo(()=>{},["stop"]))},[nm,k("nav",rm,[sm,S(i.$slots,"sidebar-nav-before",{},void 0,!0),(f(),X(tm,{items:g(t),key:o.value},null,8,["items"])),S(i.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):G("",!0)}}),om=q(am,[["__scopeId","data-v-d31a5c76"]]),im=V({__name:"VPSkipLink",setup(e){const t=sn(),n=z();we(()=>t.path,()=>n.value.focus());function r({target:a}){const s=document.getElementById(decodeURIComponent(a.hash).slice(1));if(s){const o=()=>{s.removeAttribute("tabindex"),s.removeEventListener("blur",o)};s.setAttribute("tabindex","-1"),s.addEventListener("blur",o),s.focus(),window.scrollTo(0,0)}}return(a,s)=>(f(),I(ge,null,[k("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),k("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),lm=q(im,[["__scopeId","data-v-0ee04779"]]),cm=V({__name:"Layout",setup(e){const{isOpen:t,open:n,close:r}=ct(),a=sn();we(()=>a.path,r),ui(t,r);const{frontmatter:s}=ae(),o=Uo(),i=U(()=>!!o["home-hero-image"]);return Er("hero-image-slot-exists",i),(l,c)=>{const u=_t("Content");return g(s).layout!==!1?(f(),I("div",{key:0,class:de(["Layout",g(s).pageClass])},[S(l.$slots,"layout-top",{},void 0,!0),Y(lm),Y(Xo,{class:"backdrop",show:g(t),onClick:g(r)},null,8,["show","onClick"]),Y(Gp,null,{"nav-bar-title-before":A(()=>[S(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":A(()=>[S(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),Y(bc,{open:g(t),onOpenMenu:g(n)},null,8,["open","onOpenMenu"]),Y(om,{open:g(t)},{"sidebar-nav-before":A(()=>[S(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":A(()=>[S(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),Y(Zl,{"data-pagefind-body":""},{"page-top":A(()=>[S(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":A(()=>[S(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":A(()=>[S(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":A(()=>[S(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":A(()=>[S(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":A(()=>[S(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),Y(sc),S(l.$slots,"layout-bottom",{},void 0,!0)],2)):(f(),X(u,{key:1}))}}}),um=q(cm,[["__scopeId","data-v-f45e9522"]]),Ca={Layout:um,enhanceApp:({app:e})=>{e.component("Badge",Go)}};var dm=Object.defineProperty,hm=(e,t,n)=>t in e?dm(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,B=(e,t,n)=>hm(e,typeof t!="symbol"?t+"":t,n),Aa=(e=>(e.IPAD="ipad",e.ANDROID="android",e.IPhONE="iphone",e.PC="pc",e))(Aa||{});const Ta=()=>{if(typeof window<"u"){const e=navigator.userAgent.toLowerCase();return/ipad|ipod/.test(e)?"ipad":/android/.test(e)?"android":/iphone/.test(e)?"iphone":"pc"}return"pc"},on=typeof window<"u",pm=()=>on?window.navigator.userAgent.toLowerCase().includes("micromessenger"):!1,mm=()=>{if(!on)return!1;const e=window.navigator.userAgent;return!!/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(e)},fm=()=>{if(!on)return!1;const e=/iphone/i.test(window.navigator.userAgent),t=window.devicePixelRatio&&window.devicePixelRatio===2,n=window.devicePixelRatio&&window.devicePixelRatio===3,r=window.screen.width===360&&window.screen.height===780,a=window.screen.width===375&&window.screen.height===812,s=window.screen.width===390&&window.screen.height===844,o=window.screen.width===414&&window.screen.height===896,i=window.screen.width===428&&window.screen.height===926;switch(!0){case(e&&n&&r):case(e&&n&&a):case(e&&n&&s):case(e&&t&&o):case(e&&n&&o):case(e&&n&&i):return!0;default:return!1}},Na="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ma="ARRAYBUFFER not supported by this environment",Pa="UINT8ARRAY not supported by this environment";function gm(e,t,n,r,a){let s,o,i=0,l,c,u,h,d,_;r=r||0;const E=n||[0],v=r>>>3;if(t==="UTF8")for(d=a===-1?3:0,l=0;l<e.length;l+=1)for(s=e.charCodeAt(l),o=[],128>s?o.push(s):2048>s?(o.push(192|s>>>6),o.push(128|s&63)):55296>s||57344<=s?o.push(224|s>>>12,128|s>>>6&63,128|s&63):(l+=1,s=65536+((s&1023)<<10|e.charCodeAt(l)&1023),o.push(240|s>>>18,128|s>>>12&63,128|s>>>6&63,128|s&63)),c=0;c<o.length;c+=1){for(h=i+v,u=h>>>2;E.length<=u;)E.push(0);E[u]|=o[c]<<8*(d+a*(h%4)),i+=1}else for(d=a===-1?2:0,_=t==="UTF16LE"&&a!==1||t!=="UTF16LE"&&a===1,l=0;l<e.length;l+=1){for(s=e.charCodeAt(l),_===!0&&(c=s&255,s=c<<8|s>>>8),h=i+v,u=h>>>2;E.length<=u;)E.push(0);E[u]|=s<<8*(d+a*(h%4)),i+=2}return{value:E,binLen:i*8+r}}function _m(e,t,n,r){let a,s,o,i;if(e.length%2!==0)throw new Error("String of HEX type must be in byte increments");n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(a=0;a<e.length;a+=2){if(s=parseInt(e.substr(a,2),16),isNaN(s))throw new Error("String of HEX type contains invalid characters");for(i=(a>>>1)+c,o=i>>>2;l.length<=o;)l.push(0);l[o]|=s<<8*(u+r*(i%4))}return{value:l,binLen:e.length*4+n}}function vm(e,t,n,r){let a,s,o,i;n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(s=0;s<e.length;s+=1)a=e.charCodeAt(s),i=s+c,o=i>>>2,l.length<=o&&l.push(0),l[o]|=a<<8*(u+r*(i%4));return{value:l,binLen:e.length*8+n}}function bm(e,t,n,r){let a=0,s,o,i,l,c,u,h;n=n||0;const d=t||[0],_=n>>>3,E=r===-1?3:0,v=e.indexOf("=");if(e.search(/^[a-z\d=+/]+$/i)===-1)throw new Error("Invalid character in base-64 string");if(e=e.replace(/=/g,""),v!==-1&&v<e.length)throw new Error("Invalid '=' found in base-64 string");for(o=0;o<e.length;o+=4){for(c=e.substr(o,4),l=0,i=0;i<c.length;i+=1)s=Na.indexOf(c.charAt(i)),l|=s<<18-6*i;for(i=0;i<c.length-1;i+=1){for(h=a+_,u=h>>>2;d.length<=u;)d.push(0);d[u]|=(l>>>16-i*8&255)<<8*(E+r*(h%4)),a+=1}}return{value:d,binLen:a*8+n}}function $a(e,t,n,r){let a,s,o;n=n||0;const i=t||[0],l=n>>>3,c=r===-1?3:0;for(a=0;a<e.length;a+=1)o=a+l,s=o>>>2,i.length<=s&&i.push(0),i[s]|=e[a]<<8*(c+r*(o%4));return{value:i,binLen:e.length*8+n}}function ym(e,t,n,r){return $a(new Uint8Array(e),t,n,r)}function Kt(e,t,n){switch(t){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(e){case"HEX":return function(r,a,s){return _m(r,a,s,n)};case"TEXT":return function(r,a,s){return gm(r,t,a,s,n)};case"B64":return function(r,a,s){return bm(r,a,s,n)};case"BYTES":return function(r,a,s){return vm(r,a,s,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ma)}return function(r,a,s){return ym(r,a,s,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Pa)}return function(r,a,s){return $a(r,a,s,n)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function wm(e,t,n,r){const a="0123456789abcdef";let s="",o,i;const l=t/8,c=n===-1?3:0;for(o=0;o<l;o+=1)i=e[o>>>2]>>>8*(c+n*(o%4)),s+=a.charAt(i>>>4&15)+a.charAt(i&15);return r.outputUpper?s.toUpperCase():s}function km(e,t,n,r){let a="",s,o,i,l,c;const u=t/8,h=n===-1?3:0;for(s=0;s<u;s+=3)for(l=s+1<u?e[s+1>>>2]:0,c=s+2<u?e[s+2>>>2]:0,i=(e[s>>>2]>>>8*(h+n*(s%4))&255)<<16|(l>>>8*(h+n*((s+1)%4))&255)<<8|c>>>8*(h+n*((s+2)%4))&255,o=0;o<4;o+=1)s*8+o*6<=t?a+=Na.charAt(i>>>6*(3-o)&63):a+=r.b64Pad;return a}function Lm(e,t,n){let r="",a,s;const o=t/8,i=n===-1?3:0;for(a=0;a<o;a+=1)s=e[a>>>2]>>>8*(i+n*(a%4))&255,r+=String.fromCharCode(s);return r}function Em(e,t,n){let r;const a=t/8,s=new ArrayBuffer(a),o=new Uint8Array(s),i=n===-1?3:0;for(r=0;r<a;r+=1)o[r]=e[r>>>2]>>>8*(i+n*(r%4))&255;return s}function Sm(e,t,n){let r;const a=t/8,s=n===-1?3:0,o=new Uint8Array(a);for(r=0;r<a;r+=1)o[r]=e[r>>>2]>>>8*(s+n*(r%4))&255;return o}function ss(e,t,n,r){switch(e){case"HEX":return function(a){return wm(a,t,n,r)};case"B64":return function(a){return km(a,t,n,r)};case"BYTES":return function(a){return Lm(a,t,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ma)}return function(a){return Em(a,t,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Pa)}return function(a){return Sm(a,t,n)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}const ln=4294967296,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],st=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],at=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],cn="Chosen SHA variant is not supported",Ra="Cannot set numRounds with MAC";function Sn(e,t){let n,r;const a=e.binLen>>>3,s=t.binLen>>>3,o=a<<3,i=4-a<<3;if(a%4!==0){for(n=0;n<s;n+=4)r=a+n>>>2,e.value[r]|=t.value[n>>>2]<<o,e.value.push(0),e.value[r+1]|=t.value[n>>>2]>>>i;return(e.value.length<<2)-4>=s+a&&e.value.pop(),{value:e.value,binLen:e.binLen+t.binLen}}else return{value:e.value.concat(t.value),binLen:e.binLen+t.binLen}}function as(e){const t={outputUpper:!1,b64Pad:"=",outputLen:-1},n=e||{},r="Output length must be a multiple of 8";if(t.outputUpper=n.outputUpper||!1,n.b64Pad&&(t.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!==0)throw new Error(r);t.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!==0)throw new Error(r);t.outputLen=n.shakeLen}if(typeof t.outputUpper!="boolean")throw new Error("Invalid outputUpper formatting option");if(typeof t.b64Pad!="string")throw new Error("Invalid b64Pad formatting option");return t}function mt(e,t,n,r){const a=e+" must include a value and format";if(!t){if(!r)throw new Error(a);return r}if(typeof t.value>"u"||!t.format)throw new Error(a);return Kt(t.format,t.encoding||"UTF8",n)(t.value)}class Dn{constructor(t,n,r){B(this,"shaVariant"),B(this,"inputFormat"),B(this,"utfType"),B(this,"numRounds"),B(this,"keyWithIPad"),B(this,"keyWithOPad"),B(this,"remainder"),B(this,"remainderLen"),B(this,"updateCalled"),B(this,"processedLen"),B(this,"macKeySet");const a=r||{};if(this.inputFormat=n,this.utfType=a.encoding||"UTF8",this.numRounds=a.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.shaVariant=t,this.remainder=[],this.remainderLen=0,this.updateCalled=!1,this.processedLen=0,this.macKeySet=!1,this.keyWithIPad=[],this.keyWithOPad=[]}update(t){let n,r=0;const a=this.variantBlockSize>>>5,s=this.converterFunc(t,this.remainder,this.remainderLen),o=s.binLen,i=s.value,l=o>>>5;for(n=0;n<l;n+=a)r+this.variantBlockSize<=o&&(this.intermediateState=this.roundFunc(i.slice(n,n+a),this.intermediateState),r+=this.variantBlockSize);return this.processedLen+=r,this.remainder=i.slice(r>>>5),this.remainderLen=o%this.variantBlockSize,this.updateCalled=!0,this}getHash(t,n){let r,a,s=this.outputBinLen;const o=as(n);if(this.isVariableLen){if(o.outputLen===-1)throw new Error("Output length must be specified in options");s=o.outputLen}const i=ss(t,s,this.bigEndianMod,o);if(this.macKeySet&&this.getMAC)return i(this.getMAC(o));for(a=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),s),r=1;r<this.numRounds;r+=1)this.isVariableLen&&s%32!==0&&(a[a.length-1]&=16777215>>>24-s%32),a=this.finalizeFunc(a,s,0,this.newStateFunc(this.shaVariant),s);return i(a)}setHMACKey(t,n,r){if(!this.HMACSupported)throw new Error("Variant does not support HMAC");if(this.updateCalled)throw new Error("Cannot set MAC key after calling update");const a=r||{},s=Kt(n,a.encoding||"UTF8",this.bigEndianMod);this._setHMACKey(s(t))}_setHMACKey(t){const n=this.variantBlockSize>>>3,r=n/4-1;let a;if(this.numRounds!==1)throw new Error(Ra);if(this.macKeySet)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.finalizeFunc(t.value,t.binLen,0,this.newStateFunc(this.shaVariant),this.outputBinLen));t.value.length<=r;)t.value.push(0);for(a=0;a<=r;a+=1)this.keyWithIPad[a]=t.value[a]^909522486,this.keyWithOPad[a]=t.value[a]^1549556828;this.intermediateState=this.roundFunc(this.keyWithIPad,this.intermediateState),this.processedLen=this.variantBlockSize,this.macKeySet=!0}getHMAC(t,n){const r=as(n);return ss(t,this.outputBinLen,this.bigEndianMod,r)(this._getHMAC())}_getHMAC(){let t;if(!this.macKeySet)throw new Error("Cannot call getHMAC without first setting MAC key");const n=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),this.outputBinLen);return t=this.roundFunc(this.keyWithOPad,this.newStateFunc(this.shaVariant)),t=this.finalizeFunc(n,this.outputBinLen,this.variantBlockSize,t,this.outputBinLen),t}}function Nt(e,t){return e<<t|e>>>32-t}function qe(e,t){return e>>>t|e<<32-t}function Fa(e,t){return e>>>t}function os(e,t,n){return e^t^n}function xa(e,t,n){return e&t^~e&n}function Da(e,t,n){return e&t^e&n^t&n}function Om(e){return qe(e,2)^qe(e,13)^qe(e,22)}function Pe(e,t){const n=(e&65535)+(t&65535);return((e>>>16)+(t>>>16)+(n>>>16)&65535)<<16|n&65535}function Im(e,t,n,r){const a=(e&65535)+(t&65535)+(n&65535)+(r&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(a>>>16)&65535)<<16|a&65535}function en(e,t,n,r,a){const s=(e&65535)+(t&65535)+(n&65535)+(r&65535)+(a&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(a>>>16)+(s>>>16)&65535)<<16|s&65535}function Cm(e){return qe(e,17)^qe(e,19)^Fa(e,10)}function Am(e){return qe(e,7)^qe(e,18)^Fa(e,3)}function Tm(e){return qe(e,6)^qe(e,11)^qe(e,25)}function is(e){return[1732584193,4023233417,2562383102,271733878,3285377520]}function Va(e,t){let n,r,a,s,o,i,l;const c=[];for(n=t[0],r=t[1],a=t[2],s=t[3],o=t[4],l=0;l<80;l+=1)l<16?c[l]=e[l]:c[l]=Nt(c[l-3]^c[l-8]^c[l-14]^c[l-16],1),l<20?i=en(Nt(n,5),xa(r,a,s),o,1518500249,c[l]):l<40?i=en(Nt(n,5),os(r,a,s),o,1859775393,c[l]):l<60?i=en(Nt(n,5),Da(r,a,s),o,2400959708,c[l]):i=en(Nt(n,5),os(r,a,s),o,3395469782,c[l]),o=s,s=a,a=Nt(r,30),r=n,n=i;return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(a,t[2]),t[3]=Pe(s,t[3]),t[4]=Pe(o,t[4]),t}function Nm(e,t,n,r){let a;const s=(t+65>>>9<<4)+15,o=t+n;for(;e.length<=s;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[s]=o&4294967295,e[s-1]=o/ln|0,a=0;a<e.length;a+=16)r=Va(e.slice(a,a+16),r);return r}let Mm=class extends Dn{constructor(t,n,r){if(t!=="SHA-1")throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.HMACSupported=!0,this.getMAC=this._getHMAC,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Va,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=is,this.finalizeFunc=Nm,this.intermediateState=is(),this.variantBlockSize=512,this.outputBinLen=160,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};function ls(e){let t;return e==="SHA-224"?t=st.slice():t=at.slice(),t}function Ua(e,t){let n,r,a,s,o,i,l,c,u,h,d;const _=[];for(n=t[0],r=t[1],a=t[2],s=t[3],o=t[4],i=t[5],l=t[6],c=t[7],d=0;d<64;d+=1)d<16?_[d]=e[d]:_[d]=Im(Cm(_[d-2]),_[d-7],Am(_[d-15]),_[d-16]),u=en(c,Tm(o),xa(o,i,l),K[d],_[d]),h=Pe(Om(n),Da(n,r,a)),c=l,l=i,i=o,o=Pe(s,u),s=a,a=r,r=n,n=Pe(u,h);return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(a,t[2]),t[3]=Pe(s,t[3]),t[4]=Pe(o,t[4]),t[5]=Pe(i,t[5]),t[6]=Pe(l,t[6]),t[7]=Pe(c,t[7]),t}function Pm(e,t,n,r,a){let s,o;const i=(t+65>>>9<<4)+15,l=16,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/ln|0,s=0;s<e.length;s+=l)r=Ua(e.slice(s,s+l),r);return a==="SHA-224"?o=[r[0],r[1],r[2],r[3],r[4],r[5],r[6]]:o=r,o}let $m=class extends Dn{constructor(t,n,r){if(!(t==="SHA-224"||t==="SHA-256"))throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ua,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=ls,this.finalizeFunc=function(s,o,i,l){return Pm(s,o,i,l,t)},this.intermediateState=ls(t),this.variantBlockSize=512,this.outputBinLen=t==="SHA-224"?224:256,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};class w{constructor(t,n){B(this,"highOrder"),B(this,"lowOrder"),this.highOrder=t,this.lowOrder=n}}function cs(e,t){let n;return t>32?(n=64-t,new w(e.lowOrder<<t|e.highOrder>>>n,e.highOrder<<t|e.lowOrder>>>n)):t!==0?(n=32-t,new w(e.highOrder<<t|e.lowOrder>>>n,e.lowOrder<<t|e.highOrder>>>n)):e}function Qe(e,t){let n;return t<32?(n=32-t,new w(e.highOrder>>>t|e.lowOrder<<n,e.lowOrder>>>t|e.highOrder<<n)):(n=64-t,new w(e.lowOrder>>>t|e.highOrder<<n,e.highOrder>>>t|e.lowOrder<<n))}function Ha(e,t){return new w(e.highOrder>>>t,e.lowOrder>>>t|e.highOrder<<32-t)}function Rm(e,t,n){return new w(e.highOrder&t.highOrder^~e.highOrder&n.highOrder,e.lowOrder&t.lowOrder^~e.lowOrder&n.lowOrder)}function Fm(e,t,n){return new w(e.highOrder&t.highOrder^e.highOrder&n.highOrder^t.highOrder&n.highOrder,e.lowOrder&t.lowOrder^e.lowOrder&n.lowOrder^t.lowOrder&n.lowOrder)}function xm(e){const t=Qe(e,28),n=Qe(e,34),r=Qe(e,39);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Be(e,t){let n,r;n=(e.lowOrder&65535)+(t.lowOrder&65535),r=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n>>>16);const a=(r&65535)<<16|n&65535;n=(e.highOrder&65535)+(t.highOrder&65535)+(r>>>16),r=(e.highOrder>>>16)+(t.highOrder>>>16)+(n>>>16);const s=(r&65535)<<16|n&65535;return new w(s,a)}function Dm(e,t,n,r){let a,s;a=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535),s=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(a>>>16);const o=(s&65535)<<16|a&65535;a=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(s>>>16),s=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(a>>>16);const i=(s&65535)<<16|a&65535;return new w(i,o)}function Vm(e,t,n,r,a){let s,o;s=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535)+(a.lowOrder&65535),o=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(a.lowOrder>>>16)+(s>>>16);const i=(o&65535)<<16|s&65535;s=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(a.highOrder&65535)+(o>>>16),o=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(a.highOrder>>>16)+(s>>>16);const l=(o&65535)<<16|s&65535;return new w(l,i)}function qt(e,t){return new w(e.highOrder^t.highOrder,e.lowOrder^t.lowOrder)}function Um(e,t,n,r,a){return new w(e.highOrder^t.highOrder^n.highOrder^r.highOrder^a.highOrder,e.lowOrder^t.lowOrder^n.lowOrder^r.lowOrder^a.lowOrder)}function Hm(e){const t=Qe(e,19),n=Qe(e,61),r=Ha(e,6);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Bm(e){const t=Qe(e,1),n=Qe(e,8),r=Ha(e,7);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Wm(e){const t=Qe(e,14),n=Qe(e,18),r=Qe(e,41);return new w(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}const jm=[new w(K[0],3609767458),new w(K[1],602891725),new w(K[2],3964484399),new w(K[3],2173295548),new w(K[4],4081628472),new w(K[5],3053834265),new w(K[6],2937671579),new w(K[7],3664609560),new w(K[8],2734883394),new w(K[9],1164996542),new w(K[10],1323610764),new w(K[11],3590304994),new w(K[12],4068182383),new w(K[13],991336113),new w(K[14],633803317),new w(K[15],3479774868),new w(K[16],2666613458),new w(K[17],944711139),new w(K[18],2341262773),new w(K[19],2007800933),new w(K[20],1495990901),new w(K[21],1856431235),new w(K[22],3175218132),new w(K[23],2198950837),new w(K[24],3999719339),new w(K[25],766784016),new w(K[26],2566594879),new w(K[27],3203337956),new w(K[28],1034457026),new w(K[29],2466948901),new w(K[30],3758326383),new w(K[31],168717936),new w(K[32],1188179964),new w(K[33],1546045734),new w(K[34],1522805485),new w(K[35],2643833823),new w(K[36],2343527390),new w(K[37],1014477480),new w(K[38],1206759142),new w(K[39],344077627),new w(K[40],1290863460),new w(K[41],3158454273),new w(K[42],3505952657),new w(K[43],106217008),new w(K[44],3606008344),new w(K[45],1432725776),new w(K[46],1467031594),new w(K[47],851169720),new w(K[48],3100823752),new w(K[49],1363258195),new w(K[50],3750685593),new w(K[51],3785050280),new w(K[52],3318307427),new w(K[53],3812723403),new w(K[54],2003034995),new w(K[55],3602036899),new w(K[56],1575990012),new w(K[57],1125592928),new w(K[58],2716904306),new w(K[59],442776044),new w(K[60],593698344),new w(K[61],3733110249),new w(K[62],2999351573),new w(K[63],3815920427),new w(3391569614,3928383900),new w(3515267271,566280711),new w(3940187606,3454069534),new w(4118630271,4000239992),new w(116418474,1914138554),new w(174292421,2731055270),new w(289380356,3203993006),new w(460393269,320620315),new w(685471733,587496836),new w(852142971,1086792851),new w(1017036298,365543100),new w(1126000580,2618297676),new w(1288033470,3409855158),new w(1501505948,4234509866),new w(1607167915,987167468),new w(1816402316,1246189591)];function us(e){return e==="SHA-384"?[new w(3418070365,st[0]),new w(1654270250,st[1]),new w(2438529370,st[2]),new w(355462360,st[3]),new w(1731405415,st[4]),new w(41048885895,st[5]),new w(3675008525,st[6]),new w(1203062813,st[7])]:[new w(at[0],4089235720),new w(at[1],2227873595),new w(at[2],4271175723),new w(at[3],1595750129),new w(at[4],2917565137),new w(at[5],725511199),new w(at[6],4215389547),new w(at[7],327033209)]}function Ba(e,t){let n,r,a,s,o,i,l,c,u,h,d,_;const E=[];for(n=t[0],r=t[1],a=t[2],s=t[3],o=t[4],i=t[5],l=t[6],c=t[7],d=0;d<80;d+=1)d<16?(_=d*2,E[d]=new w(e[_],e[_+1])):E[d]=Dm(Hm(E[d-2]),E[d-7],Bm(E[d-15]),E[d-16]),u=Vm(c,Wm(o),Rm(o,i,l),jm[d],E[d]),h=Be(xm(n),Fm(n,r,a)),c=l,l=i,i=o,o=Be(s,u),s=a,a=r,r=n,n=Be(u,h);return t[0]=Be(n,t[0]),t[1]=Be(r,t[1]),t[2]=Be(a,t[2]),t[3]=Be(s,t[3]),t[4]=Be(o,t[4]),t[5]=Be(i,t[5]),t[6]=Be(l,t[6]),t[7]=Be(c,t[7]),t}function Km(e,t,n,r,a){let s,o;const i=(t+129>>>10<<5)+31,l=32,c=t+n;for(;e.length<=i;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[i]=c&4294967295,e[i-1]=c/ln|0,s=0;s<e.length;s+=l)r=Ba(e.slice(s,s+l),r);return a==="SHA-384"?(r=r,o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder]):o=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder,r[6].highOrder,r[6].lowOrder,r[7].highOrder,r[7].lowOrder],o}let Gm=class extends Dn{constructor(t,n,r){if(!(t==="SHA-384"||t==="SHA-512"))throw new Error(cn);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ba,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=us,this.finalizeFunc=function(s,o,i,l){return Km(s,o,i,l,t)},this.intermediateState=us(t),this.variantBlockSize=1024,this.outputBinLen=t==="SHA-384"?384:512,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};const Ym=[new w(0,1),new w(0,32898),new w(2147483648,32906),new w(2147483648,2147516416),new w(0,32907),new w(0,2147483649),new w(2147483648,2147516545),new w(2147483648,32777),new w(0,138),new w(0,136),new w(0,2147516425),new w(0,2147483658),new w(0,2147516555),new w(2147483648,139),new w(2147483648,32905),new w(2147483648,32771),new w(2147483648,32770),new w(2147483648,128),new w(0,32778),new w(2147483648,2147483658),new w(2147483648,2147516545),new w(2147483648,32896),new w(0,2147483649),new w(2147483648,2147516424)],zm=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function hr(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=[new w(0,0),new w(0,0),new w(0,0),new w(0,0),new w(0,0)];return n}function Xm(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=e[t].slice();return n}function _n(e,t){let n,r,a,s;const o=[],i=[];if(e!=null)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=qt(t[(r>>>1)%5][(r>>>1)/5|0],new w(e[r+1],e[r]));for(n=0;n<24;n+=1){for(s=hr(),r=0;r<5;r+=1)o[r]=Um(t[r][0],t[r][1],t[r][2],t[r][3],t[r][4]);for(r=0;r<5;r+=1)i[r]=qt(o[(r+4)%5],cs(o[(r+1)%5],1));for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)t[r][a]=qt(t[r][a],i[r]);for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)s[a][(2*r+3*a)%5]=cs(t[r][a],zm[r][a]);for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)t[r][a]=qt(s[r][a],new w(~s[(r+1)%5][a].highOrder&s[(r+2)%5][a].highOrder,~s[(r+1)%5][a].lowOrder&s[(r+2)%5][a].lowOrder));t[0][0]=qt(t[0][0],Ym[n])}return t}function Jm(e,t,n,r,a,s,o){let i,l=0,c;const u=[],h=a>>>5,d=t>>>5;for(i=0;i<d&&t>=a;i+=h)r=_n(e.slice(i,i+h),r),t-=a;for(e=e.slice(i),t=t%a;e.length<h;)e.push(0);for(i=t>>>3,e[i>>2]^=s<<8*(i%4),e[h-1]^=2147483648,r=_n(e,r);u.length*32<o&&(c=r[l%5][l/5|0],u.push(c.lowOrder),!(u.length*32>=o));)u.push(c.highOrder),l+=1,l*64%a===0&&(_n(null,r),l=0);return u}function Wa(e){let t,n,r=0;const a=[0,0],s=[e&4294967295,e/ln&2097151];for(t=6;t>=0;t--)n=s[t>>2]>>>8*t&255,(n!==0||r!==0)&&(a[r+1>>2]|=n<<(r+1)*8,r+=1);return r=r!==0?r:1,a[0]|=r,{value:r+1>4?a:[a[0]],binLen:8+r*8}}function qm(e){let t,n,r=0;const a=[0,0],s=[e&4294967295,e/ln&2097151];for(t=6;t>=0;t--)n=s[t>>2]>>>8*t&255,(n!==0||r!==0)&&(a[r>>2]|=n<<r*8,r+=1);return r=r!==0?r:1,a[r>>2]|=r<<r*8,{value:r+1>4?a:[a[0]],binLen:8+r*8}}function Xn(e){return Sn(Wa(e.binLen),e)}function ds(e,t){let n=Wa(t),r;n=Sn(n,e);const a=t>>>2,s=(a-n.value.length%a)%a;for(r=0;r<s;r++)n.value.push(0);return n.value}function Qm(e){const t=e||{};return{funcName:mt("funcName",t.funcName,1,{value:[],binLen:0}),customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}function Zm(e){const t=e||{};return{kmacKey:mt("kmacKey",t.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}let ef=class extends Dn{constructor(t,n,r){let a=6,s=0;super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const o=r||{};if(this.numRounds!==1){if(o.kmacKey||o.hmacKey)throw new Error(Ra);if(this.shaVariant==="CSHAKE128"||this.shaVariant==="CSHAKE256")throw new Error("Cannot set numRounds for CSHAKE variants")}switch(this.bigEndianMod=1,this.converterFunc=Kt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=_n,this.stateCloneFunc=Xm,this.newStateFunc=hr,this.intermediateState=hr(),this.isVariableLen=!1,t){case"SHA3-224":this.variantBlockSize=s=1152,this.outputBinLen=224,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-256":this.variantBlockSize=s=1088,this.outputBinLen=256,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-384":this.variantBlockSize=s=832,this.outputBinLen=384,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-512":this.variantBlockSize=s=576,this.outputBinLen=512,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHAKE128":a=31,this.variantBlockSize=s=1344,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"SHAKE256":a=31,this.variantBlockSize=s=1088,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"KMAC128":a=4,this.variantBlockSize=s=1344,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"KMAC256":a=4,this.variantBlockSize=s=1088,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"CSHAKE128":this.variantBlockSize=s=1344,a=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"CSHAKE256":this.variantBlockSize=s=1088,a=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;default:throw new Error(cn)}this.finalizeFunc=function(i,l,c,u,h){return Jm(i,l,c,u,s,a,h)},o.hmacKey&&this._setHMACKey(mt("hmacKey",o.hmacKey,this.bigEndianMod))}_initializeCSHAKE(t,n){const r=Qm(t||{});n&&(r.funcName=n);const a=Sn(Xn(r.funcName),Xn(r.customization));if(r.customization.binLen!==0||r.funcName.binLen!==0){const s=ds(a,this.variantBlockSize>>>3);for(let o=0;o<s.length;o+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(s.slice(o,o+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;return 4}else return 31}_initializeKMAC(t){const n=Zm(t||{});this._initializeCSHAKE(t,n.funcName);const r=ds(Xn(n.kmacKey),this.variantBlockSize>>>3);for(let a=0;a<r.length;a+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(r.slice(a,a+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;this.macKeySet=!0}_getKMAC(t){const n=Sn({value:this.remainder.slice(),binLen:this.remainderLen},qm(t.outputLen));return this.finalizeFunc(n.value,n.binLen,this.processedLen,this.stateCloneFunc(this.intermediateState),t.outputLen)}};class tf{constructor(t,n,r){if(B(this,"shaObj"),t==="SHA-1")this.shaObj=new Mm(t,n,r);else if(t==="SHA-224"||t==="SHA-256")this.shaObj=new $m(t,n,r);else if(t==="SHA-384"||t==="SHA-512")this.shaObj=new Gm(t,n,r);else if(t==="SHA3-224"||t==="SHA3-256"||t==="SHA3-384"||t==="SHA3-512"||t==="SHAKE128"||t==="SHAKE256"||t==="CSHAKE128"||t==="CSHAKE256"||t==="KMAC128"||t==="KMAC256")this.shaObj=new ef(t,n,r);else throw new Error(cn)}update(t){return this.shaObj.update(t),this}getHash(t,n){return this.shaObj.getHash(t,n)}setHMACKey(t,n,r){this.shaObj.setHMACKey(t,n,r)}getHMAC(t,n){return this.shaObj.getHMAC(t,n)}}class nf{static generate(t,n){const r={digits:6,algorithm:"SHA-1",period:30,timestamp:Date.now(),...n},a=Math.floor(r.timestamp/1e3),s=this.leftpad(this.dec2hex(Math.floor(a/r.period)),16,"0"),o=new tf(r.algorithm,"HEX");o.setHMACKey(this.base32tohex(t),"HEX"),o.update(s);const i=o.getHMAC("HEX"),l=this.hex2dec(i.substring(i.length-1));let c=(this.hex2dec(i.substr(l*2,8))&this.hex2dec("7fffffff"))+"";const u=Math.max(c.length-r.digits,0);c=c.substring(u,u+r.digits);const h=Math.ceil((r.timestamp+1)/(r.period*1e3))*r.period*1e3;return{otp:c,expires:h}}static hex2dec(t){return parseInt(t,16)}static dec2hex(t){return(t<15.5?"0":"")+Math.round(t).toString(16)}static base32tohex(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let r="",a="";const s=t.replace(/=+$/,"");for(let o=0;o<s.length;o++){const i=n.indexOf(t.charAt(o).toUpperCase());if(i===-1)throw new Error("Invalid base32 character in key");r+=this.leftpad(i.toString(2),5,"0")}for(let o=0;o+8<=r.length;o+=8){const i=r.substr(o,8);a=a+this.leftpad(parseInt(i,2).toString(16),2,"0")}return a}static leftpad(t,n,r){return n+1>=t.length&&(t=Array(n+1-t.length).join(r)+t),t}}const rf=(e,t)=>{on&&localStorage.setItem(e,t)},sf=e=>on&&localStorage.getItem(e)||"";function Qt(e){return e<10?`0${e}`:e}function af(e){let t=new Date;return e&&(t=new Date(e)),t.format=(n="YYYY-MM-DD HH:mm:ss")=>{const r=t.getFullYear(),a=Qt(t.getMonth()+1),s=Qt(t.getDate()),o=Qt(t.getHours()),i=Qt(t.getMinutes()),l=Qt(t.getSeconds());return n.replace(/Y+/gi,`${r}`).replace(/M+/g,`${a}`).replace(/D+/gi,`${s}`).replace(/H+/gi,`${o}`).replace(/m+/g,`${i}`).replace(/S+/gi,`${l}`)},t}const of=e=>{if(typeof window<"u"){const t={},n=window.location.href;return n.split("?")[1]&&n.split("?")[1].split("&").forEach(s=>{const[o,i]=s.split("=");o&&i&&(t[o]=decodeURIComponent(i))}),t}return{}},lf=(e,t)=>{typeof window<"u"&&(window[e]=t),typeof global<"u"&&(global[e]=t)},cf=(e=375)=>{let t=e;const{documentElement:n}=document,r=window.matchMedia("(orientation: portrait)");let a,s=667/375;Ta()===Aa.IPAD&&(s=1024/768,t=768);function o(){const i=!r.matches;let l=window.screen.width,c=window.screen.height;l<c&&([l,c]=[c,l]);let u=n.clientWidth,h=c;u/h>=s?(u=h*s,n.classList.remove("adjustHeight"),n.classList.add("adjustWidth")):(h=u/s,n.classList.remove("adjustWidth"),n.classList.add("adjustHeight"));let _=u/t*16;i&&(_/=s),n.style.fontSize=`${_}px`;const E=window.getComputedStyle(n).fontSize.replace("px","")||0;_!==E&&(n.style.fontSize=`${_/Number(E)*_}px`)}window.addEventListener("resize",function(){clearTimeout(a),a=setTimeout(o,300)},!1),window.addEventListener("pageshow",function(i){i.persisted&&(clearTimeout(a),a=setTimeout(o,300))},!1),window.addEventListener("orientationchange",function(){o()},!1),o()},Jn=new Map([[100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],[200,"OK"],[201,"Created"],[202,"Accepted"],[203,"Non-Authoritative Information"],[204,"No Content"],[205,"Reset Content"],[206,"Partial Content"],[207,"Multi-Status"],[208,"Already Reported"],[226,"IM Used"],[300,"Multiple Choices"],[301,"Moved Permanently"],[302,"Found"],[303,"See Other"],[304,"Not Modified"],[305,"Use Proxy"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],[400,"Bad Request"],[401,"Unauthorized"],[402,"Payment Required"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[406,"Not Acceptable"],[407,"Proxy Authentication Required"],[408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[411,"Length Required"],[412,"Precondition Failed"],[413,"Payload Too Large"],[414,"URI Too Long"],[415,"Unsupported Media Type"],[416,"Range Not Satisfiable"],[417,"Expectation Failed"],[418,"I'm a Teapot"],[421,"Misdirected Request"],[422,"Unprocessable Entity"],[423,"Locked"],[424,"Failed Dependency"],[425,"Too Early"],[426,"Upgrade Required"],[428,"Precondition Required"],[429,"Too Many Requests"],[431,"Request Header Fields Too Large"],[451,"Unavailable For Legal Reasons"],[500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],[505,"HTTP Version Not Supported"],[506,"Variant Also Negotiates"],[507,"Insufficient Storage"],[508,"Loop Detected"],[509,"Bandwidth Limit Exceeded"],[510,"Not Extended"],[511,"Network Authentication Required"]]);uf(Jn),df(Jn);function uf(e){const t=new Map;for(const[n,r]of e)t.set(r.toLowerCase(),n);return t}function df(e){const t=[];for(const[n,r]of e)t.push(n);return t}const et=class{constructor(){B(this,"getDecimalLength",t=>{const[n,r]=t.toString().split(".");return r?r.length:0}),B(this,"amend",(t,n=15)=>parseFloat(Number(t).toPrecision(n))),B(this,"power",(t,n)=>Math.pow(10,Math.max(this.getDecimalLength(t),this.getDecimalLength(n))))}};B(et,"handleMethod",(e,t)=>{const n=new et,{power:r,amend:a}=n,s=r(e,t),o=a(e*s),i=a(t*s);return l=>{switch(l){case"+":return(o+i)/s;case"-":return(o-i)/s;case"*":return o*i/(s*s);case"/":return o/i}}});B(et,"add",(e,t)=>et.handleMethod(e,t)("+"));B(et,"divide",(e,t)=>et.handleMethod(e,t)("/"));B(et,"multiply",(e,t)=>et.handleMethod(e,t)("*"));B(et,"subtract",(e,t)=>et.handleMethod(e,t)("-"));var Mt=(e=>(e.NORMAL="normal",e.ERROR="error",e.WARNING="warning",e))(Mt||{}),un=(e=>(e.EN="en",e.ZH_CN="zh-CN",e))(un||{});const ja="ran_chaxus_lang",hs=[],hf={"zh-CN":{lang:"简体中文"},en:{lang:"English"}};var Ka=(e=>(e.LEGACY="legacy",e))(Ka||{});const ps="PWA_INSTALL_ID",pf="pwa-install",mf="/ran/manifest.json",ff=!1;of();const pr={isDev:ff,locale:un.EN,currentDevice:Ta(),isWeiXin:pm(),isMobile:mm(),isBang:fm()},gf={install:e=>{e.config.globalProperties.$env=pr,e.provide("$env",pr)}};/*!
  * shared v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const On=typeof window<"u",bt=(e,t=!1)=>t?Symbol.for(e):Symbol(e),_f=(e,t,n)=>vf({l:e,k:t,s:n}),vf=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Ie=e=>typeof e=="number"&&isFinite(e),bf=e=>Ya(e)==="[object Date]",ft=e=>Ya(e)==="[object RegExp]",Vn=e=>te(e)&&Object.keys(e).length===0,Me=Object.assign;let ms;const ot=()=>ms||(ms=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function fs(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const yf=Object.prototype.hasOwnProperty;function In(e,t){return yf.call(e,t)}const _e=Array.isArray,fe=e=>typeof e=="function",H=e=>typeof e=="string",se=e=>typeof e=="boolean",ue=e=>e!==null&&typeof e=="object",wf=e=>ue(e)&&fe(e.then)&&fe(e.catch),Ga=Object.prototype.toString,Ya=e=>Ga.call(e),te=e=>{if(!ue(e))return!1;const t=Object.getPrototypeOf(e);return t===null||t.constructor===Object},kf=e=>e==null?"":_e(e)||te(e)&&e.toString===Ga?JSON.stringify(e,null,2):String(e);function Lf(e,t=""){return e.reduce((n,r,a)=>a===0?n+r:n+t+r,"")}function Un(e){let t=e;return()=>++t}function Ef(e,t){typeof console<"u"&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const mn=e=>!ue(e)||_e(e);function vn(e,t){if(mn(e)||mn(t))throw new Error("Invalid value");const n=[{src:e,des:t}];for(;n.length;){const{src:r,des:a}=n.pop();Object.keys(r).forEach(s=>{mn(r[s])||mn(a[s])?a[s]=r[s]:n.push({src:r[s],des:a[s]})})}}/*!
  * message-compiler v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function Sf(e,t,n){return{line:e,column:t,offset:n}}function Cn(e,t,n){return{start:e,end:t}}const Of=/\{([0-9a-zA-Z]+)\}/g;function za(e,...t){return t.length===1&&If(t[0])&&(t=t[0]),(!t||!t.hasOwnProperty)&&(t={}),e.replace(Of,(n,r)=>t.hasOwnProperty(r)?t[r]:"")}const Xa=Object.assign,gs=e=>typeof e=="string",If=e=>e!==null&&typeof e=="object";function Ja(e,t=""){return e.reduce((n,r,a)=>a===0?n+r:n+t+r,"")}const $r={USE_MODULO_SYNTAX:1,__EXTEND_POINT__:2},Cf={[$r.USE_MODULO_SYNTAX]:"Use modulo before '{{0}}'."};function Af(e,t,...n){const r=za(Cf[e],...n||[]),a={message:String(r),code:e};return t&&(a.location=t),a}const Q={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14,UNHANDLED_CODEGEN_NODE_TYPE:15,UNHANDLED_MINIFIER_NODE_TYPE:16,__EXTEND_POINT__:17},Tf={[Q.EXPECTED_TOKEN]:"Expected token: '{0}'",[Q.INVALID_TOKEN_IN_PLACEHOLDER]:"Invalid token in placeholder: '{0}'",[Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]:"Unterminated single quote in placeholder",[Q.UNKNOWN_ESCAPE_SEQUENCE]:"Unknown escape sequence: \\{0}",[Q.INVALID_UNICODE_ESCAPE_SEQUENCE]:"Invalid unicode escape sequence: {0}",[Q.UNBALANCED_CLOSING_BRACE]:"Unbalanced closing brace",[Q.UNTERMINATED_CLOSING_BRACE]:"Unterminated closing brace",[Q.EMPTY_PLACEHOLDER]:"Empty placeholder",[Q.NOT_ALLOW_NEST_PLACEHOLDER]:"Not allowed nest placeholder",[Q.INVALID_LINKED_FORMAT]:"Invalid linked format",[Q.MUST_HAVE_MESSAGES_IN_PLURAL]:"Plural must have messages",[Q.UNEXPECTED_EMPTY_LINKED_MODIFIER]:"Unexpected empty linked modifier",[Q.UNEXPECTED_EMPTY_LINKED_KEY]:"Unexpected empty linked key",[Q.UNEXPECTED_LEXICAL_ANALYSIS]:"Unexpected lexical analysis in token: '{0}'",[Q.UNHANDLED_CODEGEN_NODE_TYPE]:"unhandled codegen node type: '{0}'",[Q.UNHANDLED_MINIFIER_NODE_TYPE]:"unhandled mimifier node type: '{0}'"};function Gt(e,t,n={}){const{domain:r,messages:a,args:s}=n,o=za((a||Tf)[e]||"",...s||[]),i=new SyntaxError(String(o));return i.code=e,t&&(i.location=t),i.domain=r,i}function Nf(e){throw e}const nt=" ",Mf="\r",Re=`
`,Pf="\u2028",$f="\u2029";function Rf(e){const t=e;let n=0,r=1,a=1,s=0;const o=$=>t[$]===Mf&&t[$+1]===Re,i=$=>t[$]===Re,l=$=>t[$]===$f,c=$=>t[$]===Pf,u=$=>o($)||i($)||l($)||c($),h=()=>n,d=()=>r,_=()=>a,E=()=>s,v=$=>o($)||l($)||c($)?Re:t[$],b=()=>v(n),M=()=>v(n+s);function W(){return s=0,u(n)&&(r++,a=0),o(n)&&n++,n++,a++,t[n]}function y(){return o(n+s)&&s++,s++,t[n+s]}function L(){n=0,r=1,a=1,s=0}function T($=0){s=$}function C(){const $=n+s;for(;$!==n;)W();s=0}return{index:h,line:d,column:_,peekOffset:E,charAt:v,currentChar:b,currentPeek:M,next:W,peek:y,reset:L,resetPeek:T,skipToPeek:C}}const ht=void 0,Ff=".",_s="'",xf="tokenizer";function Df(e,t={}){const n=t.location!==!1,r=Rf(e),a=()=>r.index(),s=()=>Sf(r.line(),r.column(),r.index()),o=s(),i=a(),l={currentType:14,offset:i,startLoc:o,endLoc:o,lastType:14,lastOffset:i,lastStartLoc:o,lastEndLoc:o,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:u}=t;function h(p,m,N,...J){const ye=c();if(m.column+=N,m.offset+=N,u){const ne=n?Cn(ye.startLoc,m):null,O=Gt(p,ne,{domain:xf,args:J});u(O)}}function d(p,m,N){p.endLoc=s(),p.currentType=m;const J={type:m};return n&&(J.loc=Cn(p.startLoc,p.endLoc)),N!=null&&(J.value=N),J}const _=p=>d(p,14);function E(p,m){return p.currentChar()===m?(p.next(),m):(h(Q.EXPECTED_TOKEN,s(),0,m),"")}function v(p){let m="";for(;p.currentPeek()===nt||p.currentPeek()===Re;)m+=p.currentPeek(),p.peek();return m}function b(p){const m=v(p);return p.skipToPeek(),m}function M(p){if(p===ht)return!1;const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m===95}function W(p){if(p===ht)return!1;const m=p.charCodeAt(0);return m>=48&&m<=57}function y(p,m){const{currentType:N}=m;if(N!==2)return!1;v(p);const J=M(p.currentPeek());return p.resetPeek(),J}function L(p,m){const{currentType:N}=m;if(N!==2)return!1;v(p);const J=p.currentPeek()==="-"?p.peek():p.currentPeek(),ye=W(J);return p.resetPeek(),ye}function T(p,m){const{currentType:N}=m;if(N!==2)return!1;v(p);const J=p.currentPeek()===_s;return p.resetPeek(),J}function C(p,m){const{currentType:N}=m;if(N!==8)return!1;v(p);const J=p.currentPeek()===".";return p.resetPeek(),J}function $(p,m){const{currentType:N}=m;if(N!==9)return!1;v(p);const J=M(p.currentPeek());return p.resetPeek(),J}function x(p,m){const{currentType:N}=m;if(!(N===8||N===12))return!1;v(p);const J=p.currentPeek()===":";return p.resetPeek(),J}function R(p,m){const{currentType:N}=m;if(N!==10)return!1;const J=()=>{const ne=p.currentPeek();return ne==="{"?M(p.peek()):ne==="@"||ne==="%"||ne==="|"||ne===":"||ne==="."||ne===nt||!ne?!1:ne===Re?(p.peek(),J()):Z(p,!1)},ye=J();return p.resetPeek(),ye}function he(p){v(p);const m=p.currentPeek()==="|";return p.resetPeek(),m}function ke(p){const m=v(p),N=p.currentPeek()==="%"&&p.peek()==="{";return p.resetPeek(),{isModulo:N,hasSpace:m.length>0}}function Z(p,m=!0){const N=(ye=!1,ne="",O=!1)=>{const P=p.currentPeek();return P==="{"?ne==="%"?!1:ye:P==="@"||!P?ne==="%"?!0:ye:P==="%"?(p.peek(),N(ye,"%",!0)):P==="|"?ne==="%"||O?!0:!(ne===nt||ne===Re):P===nt?(p.peek(),N(!0,nt,O)):P===Re?(p.peek(),N(!0,Re,O)):!0},J=N();return m&&p.resetPeek(),J}function D(p,m){const N=p.currentChar();return N===ht?ht:m(N)?(p.next(),N):null}function ie(p){const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36}function Ee(p){return D(p,ie)}function Oe(p){const m=p.charCodeAt(0);return m>=97&&m<=122||m>=65&&m<=90||m>=48&&m<=57||m===95||m===36||m===45}function ve(p){return D(p,Oe)}function Ue(p){const m=p.charCodeAt(0);return m>=48&&m<=57}function tt(p){return D(p,Ue)}function be(p){const m=p.charCodeAt(0);return m>=48&&m<=57||m>=65&&m<=70||m>=97&&m<=102}function Le(p){return D(p,be)}function He(p){let m="",N="";for(;m=tt(p);)N+=m;return N}function j(p){b(p);const m=p.currentChar();return m!=="%"&&h(Q.EXPECTED_TOKEN,s(),0,m),p.next(),"%"}function le(p){let m="";for(;;){const N=p.currentChar();if(N==="{"||N==="}"||N==="@"||N==="|"||!N)break;if(N==="%")if(Z(p))m+=N,p.next();else break;else if(N===nt||N===Re)if(Z(p))m+=N,p.next();else{if(he(p))break;m+=N,p.next()}else m+=N,p.next()}return m}function oe(p){b(p);let m="",N="";for(;m=ve(p);)N+=m;return p.currentChar()===ht&&h(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N}function pe(p){b(p);let m="";return p.currentChar()==="-"?(p.next(),m+=`-${He(p)}`):m+=He(p),p.currentChar()===ht&&h(Q.UNTERMINATED_CLOSING_BRACE,s(),0),m}function xe(p){return p!==_s&&p!==Re}function Ge(p){b(p),E(p,"'");let m="",N="";for(;m=D(p,xe);)m==="\\"?N+=wt(p):N+=m;const J=p.currentChar();return J===Re||J===ht?(h(Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,s(),0),J===Re&&(p.next(),E(p,"'")),N):(E(p,"'"),N)}function wt(p){const m=p.currentChar();switch(m){case"\\":case"'":return p.next(),`\\${m}`;case"u":return ut(p,m,4);case"U":return ut(p,m,6);default:return h(Q.UNKNOWN_ESCAPE_SEQUENCE,s(),0,m),""}}function ut(p,m,N){E(p,m);let J="";for(let ye=0;ye<N;ye++){const ne=Le(p);if(!ne){h(Q.INVALID_UNICODE_ESCAPE_SEQUENCE,s(),0,`\\${m}${J}${p.currentChar()}`);break}J+=ne}return`\\${m}${J}`}function Yt(p){return p!=="{"&&p!=="}"&&p!==nt&&p!==Re}function zt(p){b(p);let m="",N="";for(;m=D(p,Yt);)N+=m;return N}function Xt(p){let m="",N="";for(;m=Ee(p);)N+=m;return N}function F(p){const m=N=>{const J=p.currentChar();return J==="{"||J==="%"||J==="@"||J==="|"||J==="("||J===")"||!J||J===nt?N:(N+=J,p.next(),m(N))};return m("")}function ce(p){b(p);const m=E(p,"|");return b(p),m}function It(p,m){let N=null;switch(p.currentChar()){case"{":return m.braceNest>=1&&h(Q.NOT_ALLOW_NEST_PLACEHOLDER,s(),0),p.next(),N=d(m,2,"{"),b(p),m.braceNest++,N;case"}":return m.braceNest>0&&m.currentType===2&&h(Q.EMPTY_PLACEHOLDER,s(),0),p.next(),N=d(m,3,"}"),m.braceNest--,m.braceNest>0&&b(p),m.inLinked&&m.braceNest===0&&(m.inLinked=!1),N;case"@":return m.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N=Ct(p,m)||_(m),m.braceNest=0,N;default:{let ye=!0,ne=!0,O=!0;if(he(p))return m.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N=d(m,1,ce(p)),m.braceNest=0,m.inLinked=!1,N;if(m.braceNest>0&&(m.currentType===5||m.currentType===6||m.currentType===7))return h(Q.UNTERMINATED_CLOSING_BRACE,s(),0),m.braceNest=0,Jt(p,m);if(ye=y(p,m))return N=d(m,5,oe(p)),b(p),N;if(ne=L(p,m))return N=d(m,6,pe(p)),b(p),N;if(O=T(p,m))return N=d(m,7,Ge(p)),b(p),N;if(!ye&&!ne&&!O)return N=d(m,13,zt(p)),h(Q.INVALID_TOKEN_IN_PLACEHOLDER,s(),0,N.value),b(p),N;break}}return N}function Ct(p,m){const{currentType:N}=m;let J=null;const ye=p.currentChar();switch((N===8||N===9||N===12||N===10)&&(ye===Re||ye===nt)&&h(Q.INVALID_LINKED_FORMAT,s(),0),ye){case"@":return p.next(),J=d(m,8,"@"),m.inLinked=!0,J;case".":return b(p),p.next(),d(m,9,".");case":":return b(p),p.next(),d(m,10,":");default:return he(p)?(J=d(m,1,ce(p)),m.braceNest=0,m.inLinked=!1,J):C(p,m)||x(p,m)?(b(p),Ct(p,m)):$(p,m)?(b(p),d(m,12,Xt(p))):R(p,m)?(b(p),ye==="{"?It(p,m)||J:d(m,11,F(p))):(N===8&&h(Q.INVALID_LINKED_FORMAT,s(),0),m.braceNest=0,m.inLinked=!1,Jt(p,m))}}function Jt(p,m){let N={type:14};if(m.braceNest>0)return It(p,m)||_(m);if(m.inLinked)return Ct(p,m)||_(m);switch(p.currentChar()){case"{":return It(p,m)||_(m);case"}":return h(Q.UNBALANCED_CLOSING_BRACE,s(),0),p.next(),d(m,3,"}");case"@":return Ct(p,m)||_(m);default:{if(he(p))return N=d(m,1,ce(p)),m.braceNest=0,m.inLinked=!1,N;const{isModulo:ye,hasSpace:ne}=ke(p);if(ye)return ne?d(m,0,le(p)):d(m,4,j(p));if(Z(p))return d(m,0,le(p));break}}return N}function jn(){const{currentType:p,offset:m,startLoc:N,endLoc:J}=l;return l.lastType=p,l.lastOffset=m,l.lastStartLoc=N,l.lastEndLoc=J,l.offset=a(),l.startLoc=s(),r.currentChar()===ht?d(l,14):Jt(r,l)}return{nextToken:jn,currentOffset:a,currentPosition:s,context:c}}const Vf="parser",Uf=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Hf(e,t,n){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(t||n,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function Bf(e={}){const t=e.location!==!1,{onError:n,onWarn:r}=e;function a(y,L,T,C,...$){const x=y.currentPosition();if(x.offset+=C,x.column+=C,n){const R=t?Cn(T,x):null,he=Gt(L,R,{domain:Vf,args:$});n(he)}}function s(y,L,T,C,...$){const x=y.currentPosition();if(x.offset+=C,x.column+=C,r){const R=t?Cn(T,x):null;r(Af(L,R,$))}}function o(y,L,T){const C={type:y};return t&&(C.start=L,C.end=L,C.loc={start:T,end:T}),C}function i(y,L,T,C){t&&(y.end=L,y.loc&&(y.loc.end=T))}function l(y,L){const T=y.context(),C=o(3,T.offset,T.startLoc);return C.value=L,i(C,y.currentOffset(),y.currentPosition()),C}function c(y,L){const T=y.context(),{lastOffset:C,lastStartLoc:$}=T,x=o(5,C,$);return x.index=parseInt(L,10),y.nextToken(),i(x,y.currentOffset(),y.currentPosition()),x}function u(y,L,T){const C=y.context(),{lastOffset:$,lastStartLoc:x}=C,R=o(4,$,x);return R.key=L,T===!0&&(R.modulo=!0),y.nextToken(),i(R,y.currentOffset(),y.currentPosition()),R}function h(y,L){const T=y.context(),{lastOffset:C,lastStartLoc:$}=T,x=o(9,C,$);return x.value=L.replace(Uf,Hf),y.nextToken(),i(x,y.currentOffset(),y.currentPosition()),x}function d(y){const L=y.nextToken(),T=y.context(),{lastOffset:C,lastStartLoc:$}=T,x=o(8,C,$);return L.type!==12?(a(y,Q.UNEXPECTED_EMPTY_LINKED_MODIFIER,T.lastStartLoc,0),x.value="",i(x,C,$),{nextConsumeToken:L,node:x}):(L.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,We(L)),x.value=L.value||"",i(x,y.currentOffset(),y.currentPosition()),{node:x})}function _(y,L){const T=y.context(),C=o(7,T.offset,T.startLoc);return C.value=L,i(C,y.currentOffset(),y.currentPosition()),C}function E(y){const L=y.context(),T=o(6,L.offset,L.startLoc);let C=y.nextToken();if(C.type===9){const $=d(y);T.modifier=$.node,C=$.nextConsumeToken||y.nextToken()}switch(C.type!==10&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),C=y.nextToken(),C.type===2&&(C=y.nextToken()),C.type){case 11:C.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=_(y,C.value||"");break;case 5:C.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=u(y,C.value||"");break;case 6:C.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=c(y,C.value||"");break;case 7:C.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(C)),T.key=h(y,C.value||"");break;default:{a(y,Q.UNEXPECTED_EMPTY_LINKED_KEY,L.lastStartLoc,0);const $=y.context(),x=o(7,$.offset,$.startLoc);return x.value="",i(x,$.offset,$.startLoc),T.key=x,i(T,$.offset,$.startLoc),{nextConsumeToken:C,node:T}}}return i(T,y.currentOffset(),y.currentPosition()),{node:T}}function v(y){const L=y.context(),T=L.currentType===1?y.currentOffset():L.offset,C=L.currentType===1?L.endLoc:L.startLoc,$=o(2,T,C);$.items=[];let x=null,R=null;do{const Z=x||y.nextToken();switch(x=null,Z.type){case 0:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(l(y,Z.value||""));break;case 6:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(c(y,Z.value||""));break;case 4:R=!0;break;case 5:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(u(y,Z.value||"",!!R)),R&&(s(y,$r.USE_MODULO_SYNTAX,L.lastStartLoc,0,We(Z)),R=null);break;case 7:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(h(y,Z.value||""));break;case 8:{const D=E(y);$.items.push(D.node),x=D.nextConsumeToken||null;break}}}while(L.currentType!==14&&L.currentType!==1);const he=L.currentType===1?L.lastOffset:y.currentOffset(),ke=L.currentType===1?L.lastEndLoc:y.currentPosition();return i($,he,ke),$}function b(y,L,T,C){const $=y.context();let x=C.items.length===0;const R=o(1,L,T);R.cases=[],R.cases.push(C);do{const he=v(y);x||(x=he.items.length===0),R.cases.push(he)}while($.currentType!==14);return x&&a(y,Q.MUST_HAVE_MESSAGES_IN_PLURAL,T,0),i(R,y.currentOffset(),y.currentPosition()),R}function M(y){const L=y.context(),{offset:T,startLoc:C}=L,$=v(y);return L.currentType===14?$:b(y,T,C,$)}function W(y){const L=Df(y,Xa({},e)),T=L.context(),C=o(0,T.offset,T.startLoc);return t&&C.loc&&(C.loc.source=y),C.body=M(L),e.onCacheKey&&(C.cacheKey=e.onCacheKey(y)),T.currentType!==14&&a(L,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,y[T.offset]||""),i(C,L.currentOffset(),L.currentPosition()),C}return{parse:W}}function We(e){if(e.type===14)return"EOF";const t=(e.value||"").replace(/\r?\n/gu,"\\n");return t.length>10?t.slice(0,9)+"…":t}function Wf(e,t={}){const n={ast:e,helpers:new Set};return{context:()=>n,helper:s=>(n.helpers.add(s),s)}}function vs(e,t){for(let n=0;n<e.length;n++)Rr(e[n],t)}function Rr(e,t){switch(e.type){case 1:vs(e.cases,t),t.helper("plural");break;case 2:vs(e.items,t);break;case 6:{Rr(e.key,t),t.helper("linked"),t.helper("type");break}case 5:t.helper("interpolate"),t.helper("list");break;case 4:t.helper("interpolate"),t.helper("named");break}}function jf(e,t={}){const n=Wf(e);n.helper("normalize"),e.body&&Rr(e.body,n);const r=n.context();e.helpers=Array.from(r.helpers)}function Kf(e){const t=e.body;return t.type===2?bs(t):t.cases.forEach(n=>bs(n)),e}function bs(e){if(e.items.length===1){const t=e.items[0];(t.type===3||t.type===9)&&(e.static=t.value,delete t.value)}else{const t=[];for(let n=0;n<e.items.length;n++){const r=e.items[n];if(!(r.type===3||r.type===9)||r.value==null)break;t.push(r.value)}if(t.length===e.items.length){e.static=Ja(t);for(let n=0;n<e.items.length;n++){const r=e.items[n];(r.type===3||r.type===9)&&delete r.value}}}}const Gf="minifier";function Pt(e){switch(e.t=e.type,e.type){case 0:{const t=e;Pt(t.body),t.b=t.body,delete t.body;break}case 1:{const t=e,n=t.cases;for(let r=0;r<n.length;r++)Pt(n[r]);t.c=n,delete t.cases;break}case 2:{const t=e,n=t.items;for(let r=0;r<n.length;r++)Pt(n[r]);t.i=n,delete t.items,t.static&&(t.s=t.static,delete t.static);break}case 3:case 9:case 8:case 7:{const t=e;t.value&&(t.v=t.value,delete t.value);break}case 6:{const t=e;Pt(t.key),t.k=t.key,delete t.key,t.modifier&&(Pt(t.modifier),t.m=t.modifier,delete t.modifier);break}case 5:{const t=e;t.i=t.index,delete t.index;break}case 4:{const t=e;t.k=t.key,delete t.key;break}default:throw Gt(Q.UNHANDLED_MINIFIER_NODE_TYPE,null,{domain:Gf,args:[e.type]})}delete e.type}const Yf="parser";function zf(e,t){const{sourceMap:n,filename:r,breakLineCode:a,needIndent:s}=t,o=t.location!==!1,i={filename:r,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:a,needIndent:s,indentLevel:0};o&&e.loc&&(i.source=e.loc.source);const l=()=>i;function c(b,M){i.code+=b}function u(b,M=!0){const W=M?a:"";c(s?W+"  ".repeat(b):W)}function h(b=!0){const M=++i.indentLevel;b&&u(M)}function d(b=!0){const M=--i.indentLevel;b&&u(M)}function _(){u(i.indentLevel)}return{context:l,push:c,indent:h,deindent:d,newline:_,helper:b=>`_${b}`,needIndent:()=>i.needIndent}}function Xf(e,t){const{helper:n}=e;e.push(`${n("linked")}(`),Vt(e,t.key),t.modifier?(e.push(", "),Vt(e,t.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function Jf(e,t){const{helper:n,needIndent:r}=e;e.push(`${n("normalize")}([`),e.indent(r());const a=t.items.length;for(let s=0;s<a&&(Vt(e,t.items[s]),s!==a-1);s++)e.push(", ");e.deindent(r()),e.push("])")}function qf(e,t){const{helper:n,needIndent:r}=e;if(t.cases.length>1){e.push(`${n("plural")}([`),e.indent(r());const a=t.cases.length;for(let s=0;s<a&&(Vt(e,t.cases[s]),s!==a-1);s++)e.push(", ");e.deindent(r()),e.push("])")}}function Qf(e,t){t.body?Vt(e,t.body):e.push("null")}function Vt(e,t){const{helper:n}=e;switch(t.type){case 0:Qf(e,t);break;case 1:qf(e,t);break;case 2:Jf(e,t);break;case 6:Xf(e,t);break;case 8:e.push(JSON.stringify(t.value),t);break;case 7:e.push(JSON.stringify(t.value),t);break;case 5:e.push(`${n("interpolate")}(${n("list")}(${t.index}))`,t);break;case 4:e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`,t);break;case 9:e.push(JSON.stringify(t.value),t);break;case 3:e.push(JSON.stringify(t.value),t);break;default:throw Gt(Q.UNHANDLED_CODEGEN_NODE_TYPE,null,{domain:Yf,args:[t.type]})}}const Zf=(e,t={})=>{const n=gs(t.mode)?t.mode:"normal",r=gs(t.filename)?t.filename:"message.intl",a=!!t.sourceMap,s=t.breakLineCode!=null?t.breakLineCode:n==="arrow"?";":`
`,o=t.needIndent?t.needIndent:n!=="arrow",i=e.helpers||[],l=zf(e,{mode:n,filename:r,sourceMap:a,breakLineCode:s,needIndent:o});l.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),l.indent(o),i.length>0&&(l.push(`const { ${Ja(i.map(h=>`${h}: _${h}`),", ")} } = ctx`),l.newline()),l.push("return "),Vt(l,e),l.deindent(o),l.push("}"),delete e.helpers;const{code:c,map:u}=l.context();return{ast:e,code:c,map:u?u.toJSON():void 0}};function e0(e,t={}){const n=Xa({},t),r=!!n.jit,a=!!n.minify,s=n.optimize==null?!0:n.optimize,i=Bf(n).parse(e);return r?(s&&Kf(i),a&&Pt(i),{ast:i,code:""}):(jf(i,n),Zf(i,n))}/*!
  * core-base v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function t0(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(ot().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(ot().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(ot().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}const yt=[];yt[0]={w:[0],i:[3,0],"[":[4],o:[7]};yt[1]={w:[1],".":[2],"[":[4],o:[7]};yt[2]={w:[2],i:[3,0],0:[3,0]};yt[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};yt[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};yt[5]={"'":[4,0],o:8,l:[5,0]};yt[6]={'"':[4,0],o:8,l:[6,0]};const n0=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function r0(e){return n0.test(e)}function s0(e){const t=e.charCodeAt(0),n=e.charCodeAt(e.length-1);return t===n&&(t===34||t===39)?e.slice(1,-1):e}function a0(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function o0(e){const t=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:r0(t)?s0(t):"*"+t}function i0(e){const t=[];let n=-1,r=0,a=0,s,o,i,l,c,u,h;const d=[];d[0]=()=>{o===void 0?o=i:o+=i},d[1]=()=>{o!==void 0&&(t.push(o),o=void 0)},d[2]=()=>{d[0](),a++},d[3]=()=>{if(a>0)a--,r=4,d[0]();else{if(a=0,o===void 0||(o=o0(o),o===!1))return!1;d[1]()}};function _(){const E=e[n+1];if(r===5&&E==="'"||r===6&&E==='"')return n++,i="\\"+E,d[0](),!0}for(;r!==null;)if(n++,s=e[n],!(s==="\\"&&_())){if(l=a0(s),h=yt[r],c=h[l]||h.l||8,c===8||(r=c[0],c[1]!==void 0&&(u=d[c[1]],u&&(i=s,u()===!1))))return;if(r===7)return t}}const ys=new Map;function l0(e,t){return ue(e)?e[t]:null}function c0(e,t){if(!ue(e))return null;let n=ys.get(t);if(n||(n=i0(t),n&&ys.set(t,n)),!n)return null;const r=n.length;let a=e,s=0;for(;s<r;){const o=a[n[s]];if(o===void 0||fe(a))return null;a=o,s++}return a}const u0=e=>e,d0=e=>"",h0="text",p0=e=>e.length===0?"":Lf(e),m0=kf;function ws(e,t){return e=Math.abs(e),t===2?e?e>1?1:0:1:e?Math.min(e,2):0}function f0(e){const t=Ie(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Ie(e.named.count)||Ie(e.named.n))?Ie(e.named.count)?e.named.count:Ie(e.named.n)?e.named.n:t:t}function g0(e,t){t.count||(t.count=e),t.n||(t.n=e)}function _0(e={}){const t=e.locale,n=f0(e),r=ue(e.pluralRules)&&H(t)&&fe(e.pluralRules[t])?e.pluralRules[t]:ws,a=ue(e.pluralRules)&&H(t)&&fe(e.pluralRules[t])?ws:void 0,s=M=>M[r(n,M.length,a)],o=e.list||[],i=M=>o[M],l=e.named||{};Ie(e.pluralIndex)&&g0(n,l);const c=M=>l[M];function u(M){const W=fe(e.messages)?e.messages(M):ue(e.messages)?e.messages[M]:!1;return W||(e.parent?e.parent.message(M):d0)}const h=M=>e.modifiers?e.modifiers[M]:u0,d=te(e.processor)&&fe(e.processor.normalize)?e.processor.normalize:p0,_=te(e.processor)&&fe(e.processor.interpolate)?e.processor.interpolate:m0,E=te(e.processor)&&H(e.processor.type)?e.processor.type:h0,b={list:i,named:c,plural:s,linked:(M,...W)=>{const[y,L]=W;let T="text",C="";W.length===1?ue(y)?(C=y.modifier||C,T=y.type||T):H(y)&&(C=y||C):W.length===2&&(H(y)&&(C=y||C),H(L)&&(T=L||T));const $=u(M)(b),x=T==="vnode"&&_e($)&&C?$[0]:$;return C?h(C)(x,T):x},message:u,type:E,interpolate:_,normalize:d,values:Me({},o,l)};return b}let nn=null;function v0(e){nn=e}function b0(e,t,n){nn&&nn.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:t,meta:n})}const y0=w0("function:translate");function w0(e){return t=>nn&&nn.emit(e,t)}const qa=$r.__EXTEND_POINT__,kt=Un(qa),k0={NOT_FOUND_KEY:qa,FALLBACK_TO_TRANSLATE:kt(),CANNOT_FORMAT_NUMBER:kt(),FALLBACK_TO_NUMBER_FORMAT:kt(),CANNOT_FORMAT_DATE:kt(),FALLBACK_TO_DATE_FORMAT:kt(),EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER:kt(),__EXTEND_POINT__:kt()},Qa=Q.__EXTEND_POINT__,Lt=Un(Qa),je={INVALID_ARGUMENT:Qa,INVALID_DATE_ARGUMENT:Lt(),INVALID_ISO_DATE_ARGUMENT:Lt(),NOT_SUPPORT_NON_STRING_MESSAGE:Lt(),NOT_SUPPORT_LOCALE_PROMISE_VALUE:Lt(),NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:Lt(),NOT_SUPPORT_LOCALE_TYPE:Lt(),__EXTEND_POINT__:Lt()};function ze(e){return Gt(e,null,void 0)}function Fr(e,t){return t.locale!=null?ks(t.locale):ks(e.locale)}let qn;function ks(e){if(H(e))return e;if(fe(e)){if(e.resolvedOnce&&qn!=null)return qn;if(e.constructor.name==="Function"){const t=e();if(wf(t))throw ze(je.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return qn=t}else throw ze(je.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw ze(je.NOT_SUPPORT_LOCALE_TYPE)}function L0(e,t,n){return[...new Set([n,..._e(t)?t:ue(t)?Object.keys(t):H(t)?[t]:[n]])]}function Za(e,t,n){const r=H(n)?n:Ut,a=e;a.__localeChainCache||(a.__localeChainCache=new Map);let s=a.__localeChainCache.get(r);if(!s){s=[];let o=[n];for(;_e(o);)o=Ls(s,o,t);const i=_e(t)||!te(t)?t:t.default?t.default:null;o=H(i)?[i]:i,_e(o)&&Ls(s,o,!1),a.__localeChainCache.set(r,s)}return s}function Ls(e,t,n){let r=!0;for(let a=0;a<t.length&&se(r);a++){const s=t[a];H(s)&&(r=E0(e,t[a],n))}return r}function E0(e,t,n){let r;const a=t.split("-");do{const s=a.join("-");r=S0(e,s,n),a.splice(-1,1)}while(a.length&&r===!0);return r}function S0(e,t,n){let r=!1;if(!e.includes(t)&&(r=!0,t)){r=t[t.length-1]!=="!";const a=t.replace(/!/g,"");e.push(a),(_e(n)||te(n))&&n[a]&&(r=n[a])}return r}const O0="9.13.1",Hn=-1,Ut="en-US",Es="",Ss=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function I0(){return{upper:(e,t)=>t==="text"&&H(e)?e.toUpperCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,t)=>t==="text"&&H(e)?e.toLowerCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,t)=>t==="text"&&H(e)?Ss(e):t==="vnode"&&ue(e)&&"__v_isVNode"in e?Ss(e.children):e}}let eo;function Os(e){eo=e}let to;function C0(e){to=e}let no;function A0(e){no=e}let ro=null;const T0=e=>{ro=e},N0=()=>ro;let so=null;const Is=e=>{so=e},M0=()=>so;let Cs=0;function P0(e={}){const t=fe(e.onWarn)?e.onWarn:Ef,n=H(e.version)?e.version:O0,r=H(e.locale)||fe(e.locale)?e.locale:Ut,a=fe(r)?Ut:r,s=_e(e.fallbackLocale)||te(e.fallbackLocale)||H(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:a,o=te(e.messages)?e.messages:{[a]:{}},i=te(e.datetimeFormats)?e.datetimeFormats:{[a]:{}},l=te(e.numberFormats)?e.numberFormats:{[a]:{}},c=Me({},e.modifiers||{},I0()),u=e.pluralRules||{},h=fe(e.missing)?e.missing:null,d=se(e.missingWarn)||ft(e.missingWarn)?e.missingWarn:!0,_=se(e.fallbackWarn)||ft(e.fallbackWarn)?e.fallbackWarn:!0,E=!!e.fallbackFormat,v=!!e.unresolving,b=fe(e.postTranslation)?e.postTranslation:null,M=te(e.processor)?e.processor:null,W=se(e.warnHtmlMessage)?e.warnHtmlMessage:!0,y=!!e.escapeParameter,L=fe(e.messageCompiler)?e.messageCompiler:eo,T=fe(e.messageResolver)?e.messageResolver:to||l0,C=fe(e.localeFallbacker)?e.localeFallbacker:no||L0,$=ue(e.fallbackContext)?e.fallbackContext:void 0,x=e,R=ue(x.__datetimeFormatters)?x.__datetimeFormatters:new Map,he=ue(x.__numberFormatters)?x.__numberFormatters:new Map,ke=ue(x.__meta)?x.__meta:{};Cs++;const Z={version:n,cid:Cs,locale:r,fallbackLocale:s,messages:o,modifiers:c,pluralRules:u,missing:h,missingWarn:d,fallbackWarn:_,fallbackFormat:E,unresolving:v,postTranslation:b,processor:M,warnHtmlMessage:W,escapeParameter:y,messageCompiler:L,messageResolver:T,localeFallbacker:C,fallbackContext:$,onWarn:t,__meta:ke};return Z.datetimeFormats=i,Z.numberFormats=l,Z.__datetimeFormatters=R,Z.__numberFormatters=he,__INTLIFY_PROD_DEVTOOLS__&&b0(Z,n,ke),Z}function xr(e,t,n,r,a){const{missing:s,onWarn:o}=e;if(s!==null){const i=s(e,n,t,a);return H(i)?i:t}else return t}function Zt(e,t,n){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,n,t)}function $0(e,t){return e===t?!1:e.split("-")[0]===t.split("-")[0]}function R0(e,t){const n=t.indexOf(e);if(n===-1)return!1;for(let r=n+1;r<t.length;r++)if($0(e,t[r]))return!0;return!1}function Qn(e){return n=>F0(n,e)}function F0(e,t){const n=t.b||t.body;if((n.t||n.type)===1){const r=n,a=r.c||r.cases;return e.plural(a.reduce((s,o)=>[...s,As(e,o)],[]))}else return As(e,n)}function As(e,t){const n=t.s||t.static;if(n)return e.type==="text"?n:e.normalize([n]);{const r=(t.i||t.items).reduce((a,s)=>[...a,mr(e,s)],[]);return e.normalize(r)}}function mr(e,t){const n=t.t||t.type;switch(n){case 3:{const r=t;return r.v||r.value}case 9:{const r=t;return r.v||r.value}case 4:{const r=t;return e.interpolate(e.named(r.k||r.key))}case 5:{const r=t;return e.interpolate(e.list(r.i!=null?r.i:r.index))}case 6:{const r=t,a=r.m||r.modifier;return e.linked(mr(e,r.k||r.key),a?mr(e,a):void 0,e.type)}case 7:{const r=t;return r.v||r.value}case 8:{const r=t;return r.v||r.value}default:throw new Error(`unhandled node type on format message part: ${n}`)}}const ao=e=>e;let Rt=Object.create(null);const Ht=e=>ue(e)&&(e.t===0||e.type===0)&&("b"in e||"body"in e);function oo(e,t={}){let n=!1;const r=t.onError||Nf;return t.onError=a=>{n=!0,r(a)},{...e0(e,t),detectError:n}}const x0=(e,t)=>{if(!H(e))throw ze(je.NOT_SUPPORT_NON_STRING_MESSAGE);{se(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||ao)(e),a=Rt[r];if(a)return a;const{code:s,detectError:o}=oo(e,t),i=new Function(`return ${s}`)();return o?i:Rt[r]=i}};function D0(e,t){if(__INTLIFY_JIT_COMPILATION__&&!__INTLIFY_DROP_MESSAGE_COMPILER__&&H(e)){se(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||ao)(e),a=Rt[r];if(a)return a;const{ast:s,detectError:o}=oo(e,{...t,location:!1,jit:!0}),i=Qn(s);return o?i:Rt[r]=i}else{const n=e.cacheKey;if(n){const r=Rt[n];return r||(Rt[n]=Qn(e))}else return Qn(e)}}const Ts=()=>"",Ve=e=>fe(e);function Ns(e,...t){const{fallbackFormat:n,postTranslation:r,unresolving:a,messageCompiler:s,fallbackLocale:o,messages:i}=e,[l,c]=fr(...t),u=se(c.missingWarn)?c.missingWarn:e.missingWarn,h=se(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,d=se(c.escapeParameter)?c.escapeParameter:e.escapeParameter,_=!!c.resolvedMessage,E=H(c.default)||se(c.default)?se(c.default)?s?l:()=>l:c.default:n?s?l:()=>l:"",v=n||E!=="",b=Fr(e,c);d&&V0(c);let[M,W,y]=_?[l,b,i[b]||{}]:io(e,l,b,o,h,u),L=M,T=l;if(!_&&!(H(L)||Ht(L)||Ve(L))&&v&&(L=E,T=L),!_&&(!(H(L)||Ht(L)||Ve(L))||!H(W)))return a?Hn:l;let C=!1;const $=()=>{C=!0},x=Ve(L)?L:lo(e,l,W,L,T,$);if(C)return L;const R=B0(e,W,y,c),he=_0(R),ke=U0(e,x,he),Z=r?r(ke,l):ke;if(__INTLIFY_PROD_DEVTOOLS__){const D={timestamp:Date.now(),key:H(l)?l:Ve(L)?L.key:"",locale:W||(Ve(L)?L.locale:""),format:H(L)?L:Ve(L)?L.source:"",message:Z};D.meta=Me({},e.__meta,N0()||{}),y0(D)}return Z}function V0(e){_e(e.list)?e.list=e.list.map(t=>H(t)?fs(t):t):ue(e.named)&&Object.keys(e.named).forEach(t=>{H(e.named[t])&&(e.named[t]=fs(e.named[t]))})}function io(e,t,n,r,a,s){const{messages:o,onWarn:i,messageResolver:l,localeFallbacker:c}=e,u=c(e,r,n);let h={},d,_=null;const E="translate";for(let v=0;v<u.length&&(d=u[v],h=o[d]||{},(_=l(h,t))===null&&(_=h[t]),!(H(_)||Ht(_)||Ve(_)));v++)if(!R0(d,u)){const b=xr(e,t,d,s,E);b!==t&&(_=b)}return[_,d,h]}function lo(e,t,n,r,a,s){const{messageCompiler:o,warnHtmlMessage:i}=e;if(Ve(r)){const c=r;return c.locale=c.locale||n,c.key=c.key||t,c}if(o==null){const c=()=>r;return c.locale=n,c.key=t,c}const l=o(r,H0(e,n,a,r,i,s));return l.locale=n,l.key=t,l.source=r,l}function U0(e,t,n){return t(n)}function fr(...e){const[t,n,r]=e,a={};if(!H(t)&&!Ie(t)&&!Ve(t)&&!Ht(t))throw ze(je.INVALID_ARGUMENT);const s=Ie(t)?String(t):(Ve(t),t);return Ie(n)?a.plural=n:H(n)?a.default=n:te(n)&&!Vn(n)?a.named=n:_e(n)&&(a.list=n),Ie(r)?a.plural=r:H(r)?a.default=r:te(r)&&Me(a,r),[s,a]}function H0(e,t,n,r,a,s){return{locale:t,key:n,warnHtmlMessage:a,onError:o=>{throw s&&s(o),o},onCacheKey:o=>_f(t,n,o)}}function B0(e,t,n,r){const{modifiers:a,pluralRules:s,messageResolver:o,fallbackLocale:i,fallbackWarn:l,missingWarn:c,fallbackContext:u}=e,d={locale:t,modifiers:a,pluralRules:s,messages:_=>{let E=o(n,_);if(E==null&&u){const[,,v]=io(u,_,t,i,l,c);E=o(v,_)}if(H(E)||Ht(E)){let v=!1;const M=lo(e,_,t,E,_,()=>{v=!0});return v?Ts:M}else return Ve(E)?E:Ts}};return e.processor&&(d.processor=e.processor),r.list&&(d.list=r.list),r.named&&(d.named=r.named),Ie(r.plural)&&(d.pluralIndex=r.plural),d}function Ms(e,...t){const{datetimeFormats:n,unresolving:r,fallbackLocale:a,onWarn:s,localeFallbacker:o}=e,{__datetimeFormatters:i}=e,[l,c,u,h]=gr(...t),d=se(u.missingWarn)?u.missingWarn:e.missingWarn;se(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const _=!!u.part,E=Fr(e,u),v=o(e,a,E);if(!H(l)||l==="")return new Intl.DateTimeFormat(E,h).format(c);let b={},M,W=null;const y="datetime format";for(let C=0;C<v.length&&(M=v[C],b=n[M]||{},W=b[l],!te(W));C++)xr(e,l,M,d,y);if(!te(W)||!H(M))return r?Hn:l;let L=`${M}__${l}`;Vn(h)||(L=`${L}__${JSON.stringify(h)}`);let T=i.get(L);return T||(T=new Intl.DateTimeFormat(M,Me({},W,h)),i.set(L,T)),_?T.formatToParts(c):T.format(c)}const co=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function gr(...e){const[t,n,r,a]=e,s={};let o={},i;if(H(t)){const l=t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw ze(je.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();i=new Date(c);try{i.toISOString()}catch{throw ze(je.INVALID_ISO_DATE_ARGUMENT)}}else if(bf(t)){if(isNaN(t.getTime()))throw ze(je.INVALID_DATE_ARGUMENT);i=t}else if(Ie(t))i=t;else throw ze(je.INVALID_ARGUMENT);return H(n)?s.key=n:te(n)&&Object.keys(n).forEach(l=>{co.includes(l)?o[l]=n[l]:s[l]=n[l]}),H(r)?s.locale=r:te(r)&&(o=r),te(a)&&(o=a),[s.key||"",i,s,o]}function Ps(e,t,n){const r=e;for(const a in n){const s=`${t}__${a}`;r.__datetimeFormatters.has(s)&&r.__datetimeFormatters.delete(s)}}function $s(e,...t){const{numberFormats:n,unresolving:r,fallbackLocale:a,onWarn:s,localeFallbacker:o}=e,{__numberFormatters:i}=e,[l,c,u,h]=_r(...t),d=se(u.missingWarn)?u.missingWarn:e.missingWarn;se(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const _=!!u.part,E=Fr(e,u),v=o(e,a,E);if(!H(l)||l==="")return new Intl.NumberFormat(E,h).format(c);let b={},M,W=null;const y="number format";for(let C=0;C<v.length&&(M=v[C],b=n[M]||{},W=b[l],!te(W));C++)xr(e,l,M,d,y);if(!te(W)||!H(M))return r?Hn:l;let L=`${M}__${l}`;Vn(h)||(L=`${L}__${JSON.stringify(h)}`);let T=i.get(L);return T||(T=new Intl.NumberFormat(M,Me({},W,h)),i.set(L,T)),_?T.formatToParts(c):T.format(c)}const uo=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function _r(...e){const[t,n,r,a]=e,s={};let o={};if(!Ie(t))throw ze(je.INVALID_ARGUMENT);const i=t;return H(n)?s.key=n:te(n)&&Object.keys(n).forEach(l=>{uo.includes(l)?o[l]=n[l]:s[l]=n[l]}),H(r)?s.locale=r:te(r)&&(o=r),te(a)&&(o=a),[s.key||"",i,s,o]}function Rs(e,t,n){const r=e;for(const a in n){const s=`${t}__${a}`;r.__numberFormatters.has(s)&&r.__numberFormatters.delete(s)}}t0();/*!
  * vue-i18n v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const W0="9.13.1";function j0(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(ot().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(ot().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(ot().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(ot().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(ot().__INTLIFY_PROD_DEVTOOLS__=!1)}const ho=k0.__EXTEND_POINT__,rt=Un(ho);rt(),rt(),rt(),rt(),rt(),rt(),rt(),rt(),rt();const po=je.__EXTEND_POINT__,Fe=Un(po),Ce={UNEXPECTED_RETURN_TYPE:po,INVALID_ARGUMENT:Fe(),MUST_BE_CALL_SETUP_TOP:Fe(),NOT_INSTALLED:Fe(),NOT_AVAILABLE_IN_LEGACY_MODE:Fe(),REQUIRED_VALUE:Fe(),INVALID_VALUE:Fe(),CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:Fe(),NOT_INSTALLED_WITH_PROVIDE:Fe(),UNEXPECTED_ERROR:Fe(),NOT_COMPATIBLE_LEGACY_VUE_I18N:Fe(),BRIDGE_SUPPORT_VUE_2_ONLY:Fe(),MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION:Fe(),NOT_AVAILABLE_COMPOSITION_IN_LEGACY:Fe(),__EXTEND_POINT__:Fe()};function Ae(e,...t){return Gt(e,null,void 0)}const vr=bt("__translateVNode"),br=bt("__datetimeParts"),yr=bt("__numberParts"),mo=bt("__setPluralRules"),fo=bt("__injectWithOption"),wr=bt("__dispose");function rn(e){if(!ue(e))return e;for(const t in e)if(In(e,t))if(!t.includes("."))ue(e[t])&&rn(e[t]);else{const n=t.split("."),r=n.length-1;let a=e,s=!1;for(let o=0;o<r;o++){if(n[o]in a||(a[n[o]]={}),!ue(a[n[o]])){s=!0;break}a=a[n[o]]}s||(a[n[r]]=e[t],delete e[t]),ue(a[n[r]])&&rn(a[n[r]])}return e}function Bn(e,t){const{messages:n,__i18n:r,messageResolver:a,flatJson:s}=t,o=te(n)?n:_e(r)?{}:{[e]:{}};if(_e(r)&&r.forEach(i=>{if("locale"in i&&"resource"in i){const{locale:l,resource:c}=i;l?(o[l]=o[l]||{},vn(c,o[l])):vn(c,o)}else H(i)&&vn(JSON.parse(i),o)}),a==null&&s)for(const i in o)In(o,i)&&rn(o[i]);return o}function go(e){return e.type}function _o(e,t,n){let r=ue(t.messages)?t.messages:{};"__i18nGlobal"in n&&(r=Bn(e.locale.value,{messages:r,__i18n:n.__i18nGlobal}));const a=Object.keys(r);a.length&&a.forEach(s=>{e.mergeLocaleMessage(s,r[s])});{if(ue(t.datetimeFormats)){const s=Object.keys(t.datetimeFormats);s.length&&s.forEach(o=>{e.mergeDateTimeFormat(o,t.datetimeFormats[o])})}if(ue(t.numberFormats)){const s=Object.keys(t.numberFormats);s.length&&s.forEach(o=>{e.mergeNumberFormat(o,t.numberFormats[o])})}}}function Fs(e){return Y(jo,null,e,0)}const xs="__INTLIFY_META__",Ds=()=>[],K0=()=>!1;let Vs=0;function Us(e){return(t,n,r,a)=>e(n,r,Dt()||void 0,a)}const G0=()=>{const e=Dt();let t=null;return e&&(t=go(e)[xs])?{[xs]:t}:null};function Dr(e={},t){const{__root:n,__injectWithOption:r}=e,a=n===void 0,s=e.flatJson,o=On?z:Mn,i=!!e.translateExistCompatible;let l=se(e.inheritLocale)?e.inheritLocale:!0;const c=o(n&&l?n.locale.value:H(e.locale)?e.locale:Ut),u=o(n&&l?n.fallbackLocale.value:H(e.fallbackLocale)||_e(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:c.value),h=o(Bn(c.value,e)),d=o(te(e.datetimeFormats)?e.datetimeFormats:{[c.value]:{}}),_=o(te(e.numberFormats)?e.numberFormats:{[c.value]:{}});let E=n?n.missingWarn:se(e.missingWarn)||ft(e.missingWarn)?e.missingWarn:!0,v=n?n.fallbackWarn:se(e.fallbackWarn)||ft(e.fallbackWarn)?e.fallbackWarn:!0,b=n?n.fallbackRoot:se(e.fallbackRoot)?e.fallbackRoot:!0,M=!!e.fallbackFormat,W=fe(e.missing)?e.missing:null,y=fe(e.missing)?Us(e.missing):null,L=fe(e.postTranslation)?e.postTranslation:null,T=n?n.warnHtmlMessage:se(e.warnHtmlMessage)?e.warnHtmlMessage:!0,C=!!e.escapeParameter;const $=n?n.modifiers:te(e.modifiers)?e.modifiers:{};let x=e.pluralRules||n&&n.pluralRules,R;R=(()=>{a&&Is(null);const O={version:W0,locale:c.value,fallbackLocale:u.value,messages:h.value,modifiers:$,pluralRules:x,missing:y===null?void 0:y,missingWarn:E,fallbackWarn:v,fallbackFormat:M,unresolving:!0,postTranslation:L===null?void 0:L,warnHtmlMessage:T,escapeParameter:C,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};O.datetimeFormats=d.value,O.numberFormats=_.value,O.__datetimeFormatters=te(R)?R.__datetimeFormatters:void 0,O.__numberFormatters=te(R)?R.__numberFormatters:void 0;const P=P0(O);return a&&Is(P),P})(),Zt(R,c.value,u.value);function ke(){return[c.value,u.value,h.value,d.value,_.value]}const Z=U({get:()=>c.value,set:O=>{c.value=O,R.locale=c.value}}),D=U({get:()=>u.value,set:O=>{u.value=O,R.fallbackLocale=u.value,Zt(R,c.value,O)}}),ie=U(()=>h.value),Ee=U(()=>d.value),Oe=U(()=>_.value);function ve(){return fe(L)?L:null}function Ue(O){L=O,R.postTranslation=O}function tt(){return W}function be(O){O!==null&&(y=Us(O)),W=O,R.missing=y}const Le=(O,P,me,Se,dt,dn)=>{ke();let At;try{__INTLIFY_PROD_DEVTOOLS__,a||(R.fallbackContext=n?M0():void 0),At=O(R)}finally{__INTLIFY_PROD_DEVTOOLS__,a||(R.fallbackContext=void 0)}if(me!=="translate exists"&&Ie(At)&&At===Hn||me==="translate exists"&&!At){const[Lo,Sg]=P();return n&&b?Se(n):dt(Lo)}else{if(dn(At))return At;throw Ae(Ce.UNEXPECTED_RETURN_TYPE)}};function He(...O){return Le(P=>Reflect.apply(Ns,null,[P,...O]),()=>fr(...O),"translate",P=>Reflect.apply(P.t,P,[...O]),P=>P,P=>H(P))}function j(...O){const[P,me,Se]=O;if(Se&&!ue(Se))throw Ae(Ce.INVALID_ARGUMENT);return He(P,me,Me({resolvedMessage:!0},Se||{}))}function le(...O){return Le(P=>Reflect.apply(Ms,null,[P,...O]),()=>gr(...O),"datetime format",P=>Reflect.apply(P.d,P,[...O]),()=>Es,P=>H(P))}function oe(...O){return Le(P=>Reflect.apply($s,null,[P,...O]),()=>_r(...O),"number format",P=>Reflect.apply(P.n,P,[...O]),()=>Es,P=>H(P))}function pe(O){return O.map(P=>H(P)||Ie(P)||se(P)?Fs(String(P)):P)}const Ge={normalize:pe,interpolate:O=>O,type:"vnode"};function wt(...O){return Le(P=>{let me;const Se=P;try{Se.processor=Ge,me=Reflect.apply(Ns,null,[Se,...O])}finally{Se.processor=null}return me},()=>fr(...O),"translate",P=>P[vr](...O),P=>[Fs(P)],P=>_e(P))}function ut(...O){return Le(P=>Reflect.apply($s,null,[P,...O]),()=>_r(...O),"number format",P=>P[yr](...O),Ds,P=>H(P)||_e(P))}function Yt(...O){return Le(P=>Reflect.apply(Ms,null,[P,...O]),()=>gr(...O),"datetime format",P=>P[br](...O),Ds,P=>H(P)||_e(P))}function zt(O){x=O,R.pluralRules=x}function Xt(O,P){return Le(()=>{if(!O)return!1;const me=H(P)?P:c.value,Se=It(me),dt=R.messageResolver(Se,O);return i?dt!=null:Ht(dt)||Ve(dt)||H(dt)},()=>[O],"translate exists",me=>Reflect.apply(me.te,me,[O,P]),K0,me=>se(me))}function F(O){let P=null;const me=Za(R,u.value,c.value);for(let Se=0;Se<me.length;Se++){const dt=h.value[me[Se]]||{},dn=R.messageResolver(dt,O);if(dn!=null){P=dn;break}}return P}function ce(O){const P=F(O);return P??(n?n.tm(O)||{}:{})}function It(O){return h.value[O]||{}}function Ct(O,P){if(s){const me={[O]:P};for(const Se in me)In(me,Se)&&rn(me[Se]);P=me[O]}h.value[O]=P,R.messages=h.value}function Jt(O,P){h.value[O]=h.value[O]||{};const me={[O]:P};if(s)for(const Se in me)In(me,Se)&&rn(me[Se]);P=me[O],vn(P,h.value[O]),R.messages=h.value}function jn(O){return d.value[O]||{}}function p(O,P){d.value[O]=P,R.datetimeFormats=d.value,Ps(R,O,P)}function m(O,P){d.value[O]=Me(d.value[O]||{},P),R.datetimeFormats=d.value,Ps(R,O,P)}function N(O){return _.value[O]||{}}function J(O,P){_.value[O]=P,R.numberFormats=_.value,Rs(R,O,P)}function ye(O,P){_.value[O]=Me(_.value[O]||{},P),R.numberFormats=_.value,Rs(R,O,P)}Vs++,n&&On&&(we(n.locale,O=>{l&&(c.value=O,R.locale=O,Zt(R,c.value,u.value))}),we(n.fallbackLocale,O=>{l&&(u.value=O,R.fallbackLocale=O,Zt(R,c.value,u.value))}));const ne={id:Vs,locale:Z,fallbackLocale:D,get inheritLocale(){return l},set inheritLocale(O){l=O,O&&n&&(c.value=n.locale.value,u.value=n.fallbackLocale.value,Zt(R,c.value,u.value))},get availableLocales(){return Object.keys(h.value).sort()},messages:ie,get modifiers(){return $},get pluralRules(){return x||{}},get isGlobal(){return a},get missingWarn(){return E},set missingWarn(O){E=O,R.missingWarn=E},get fallbackWarn(){return v},set fallbackWarn(O){v=O,R.fallbackWarn=v},get fallbackRoot(){return b},set fallbackRoot(O){b=O},get fallbackFormat(){return M},set fallbackFormat(O){M=O,R.fallbackFormat=M},get warnHtmlMessage(){return T},set warnHtmlMessage(O){T=O,R.warnHtmlMessage=O},get escapeParameter(){return C},set escapeParameter(O){C=O,R.escapeParameter=O},t:He,getLocaleMessage:It,setLocaleMessage:Ct,mergeLocaleMessage:Jt,getPostTranslationHandler:ve,setPostTranslationHandler:Ue,getMissingHandler:tt,setMissingHandler:be,[mo]:zt};return ne.datetimeFormats=Ee,ne.numberFormats=Oe,ne.rt=j,ne.te=Xt,ne.tm=ce,ne.d=le,ne.n=oe,ne.getDateTimeFormat=jn,ne.setDateTimeFormat=p,ne.mergeDateTimeFormat=m,ne.getNumberFormat=N,ne.setNumberFormat=J,ne.mergeNumberFormat=ye,ne[fo]=r,ne[vr]=wt,ne[br]=Yt,ne[yr]=ut,ne}function Y0(e){const t=H(e.locale)?e.locale:Ut,n=H(e.fallbackLocale)||_e(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:t,r=fe(e.missing)?e.missing:void 0,a=se(e.silentTranslationWarn)||ft(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,s=se(e.silentFallbackWarn)||ft(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,o=se(e.fallbackRoot)?e.fallbackRoot:!0,i=!!e.formatFallbackMessages,l=te(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,u=fe(e.postTranslation)?e.postTranslation:void 0,h=H(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,d=!!e.escapeParameterHtml,_=se(e.sync)?e.sync:!0;let E=e.messages;if(te(e.sharedMessages)){const C=e.sharedMessages;E=Object.keys(C).reduce((x,R)=>{const he=x[R]||(x[R]={});return Me(he,C[R]),x},E||{})}const{__i18n:v,__root:b,__injectWithOption:M}=e,W=e.datetimeFormats,y=e.numberFormats,L=e.flatJson,T=e.translateExistCompatible;return{locale:t,fallbackLocale:n,messages:E,flatJson:L,datetimeFormats:W,numberFormats:y,missing:r,missingWarn:a,fallbackWarn:s,fallbackRoot:o,fallbackFormat:i,modifiers:l,pluralRules:c,postTranslation:u,warnHtmlMessage:h,escapeParameter:d,messageResolver:e.messageResolver,inheritLocale:_,translateExistCompatible:T,__i18n:v,__root:b,__injectWithOption:M}}function kr(e={},t){{const n=Dr(Y0(e)),{__extender:r}=e,a={id:n.id,get locale(){return n.locale.value},set locale(s){n.locale.value=s},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(s){n.fallbackLocale.value=s},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get formatter(){return{interpolate(){return[]}}},set formatter(s){},get missing(){return n.getMissingHandler()},set missing(s){n.setMissingHandler(s)},get silentTranslationWarn(){return se(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(s){n.missingWarn=se(s)?!s:s},get silentFallbackWarn(){return se(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(s){n.fallbackWarn=se(s)?!s:s},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(s){n.fallbackFormat=s},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(s){n.setPostTranslationHandler(s)},get sync(){return n.inheritLocale},set sync(s){n.inheritLocale=s},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(s){n.warnHtmlMessage=s!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(s){n.escapeParameter=s},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(s){},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...s){const[o,i,l]=s,c={};let u=null,h=null;if(!H(o))throw Ae(Ce.INVALID_ARGUMENT);const d=o;return H(i)?c.locale=i:_e(i)?u=i:te(i)&&(h=i),_e(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},rt(...s){return Reflect.apply(n.rt,n,[...s])},tc(...s){const[o,i,l]=s,c={plural:1};let u=null,h=null;if(!H(o))throw Ae(Ce.INVALID_ARGUMENT);const d=o;return H(i)?c.locale=i:Ie(i)?c.plural=i:_e(i)?u=i:te(i)&&(h=i),H(l)?c.locale=l:_e(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},te(s,o){return n.te(s,o)},tm(s){return n.tm(s)},getLocaleMessage(s){return n.getLocaleMessage(s)},setLocaleMessage(s,o){n.setLocaleMessage(s,o)},mergeLocaleMessage(s,o){n.mergeLocaleMessage(s,o)},d(...s){return Reflect.apply(n.d,n,[...s])},getDateTimeFormat(s){return n.getDateTimeFormat(s)},setDateTimeFormat(s,o){n.setDateTimeFormat(s,o)},mergeDateTimeFormat(s,o){n.mergeDateTimeFormat(s,o)},n(...s){return Reflect.apply(n.n,n,[...s])},getNumberFormat(s){return n.getNumberFormat(s)},setNumberFormat(s,o){n.setNumberFormat(s,o)},mergeNumberFormat(s,o){n.mergeNumberFormat(s,o)},getChoiceIndex(s,o){return-1}};return a.__extender=r,a}}const Vr={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function z0({slots:e},t){return t.length===1&&t[0]==="default"?(e.default?e.default():[]).reduce((r,a)=>[...r,...a.type===ge?a.children:[a]],[]):t.reduce((n,r)=>{const a=e[r];return a&&(n[r]=a()),n},{})}function vo(e){return ge}const X0=V({name:"i18n-t",props:Me({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Ie(e)||!isNaN(e)}},Vr),setup(e,t){const{slots:n,attrs:r}=t,a=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return()=>{const s=Object.keys(n).filter(h=>h!=="_"),o={};e.locale&&(o.locale=e.locale),e.plural!==void 0&&(o.plural=H(e.plural)?+e.plural:e.plural);const i=z0(t,s),l=a[vr](e.keypath,i,o),c=Me({},r),u=H(e.tag)||ue(e.tag)?e.tag:vo();return xt(u,c,l)}}}),Hs=X0;function J0(e){return _e(e)&&!H(e[0])}function bo(e,t,n,r){const{slots:a,attrs:s}=t;return()=>{const o={part:!0};let i={};e.locale&&(o.locale=e.locale),H(e.format)?o.key=e.format:ue(e.format)&&(H(e.format.key)&&(o.key=e.format.key),i=Object.keys(e.format).reduce((d,_)=>n.includes(_)?Me({},d,{[_]:e.format[_]}):d,{}));const l=r(e.value,o,i);let c=[o.key];_e(l)?c=l.map((d,_)=>{const E=a[d.type],v=E?E({[d.type]:d.value,index:_,parts:l}):[d.value];return J0(v)&&(v[0].key=`${d.type}-${_}`),v}):H(l)&&(c=[l]);const u=Me({},s),h=H(e.tag)||ue(e.tag)?e.tag:vo();return xt(h,u,c)}}const q0=V({name:"i18n-n",props:Me({value:{type:Number,required:!0},format:{type:[String,Object]}},Vr),setup(e,t){const n=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return bo(e,t,uo,(...r)=>n[yr](...r))}}),Bs=q0,Q0=V({name:"i18n-d",props:Me({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},Vr),setup(e,t){const n=e.i18n||Wn({useScope:e.scope,__useComponent:!0});return bo(e,t,co,(...r)=>n[br](...r))}}),Ws=Q0;function Z0(e,t){const n=e;if(e.mode==="composition")return n.__getInstance(t)||e.global;{const r=n.__getInstance(t);return r!=null?r.__composer:e.global.__composer}}function eg(e){const t=o=>{const{instance:i,modifiers:l,value:c}=o;if(!i||!i.$)throw Ae(Ce.UNEXPECTED_ERROR);const u=Z0(e,i.$),h=js(c);return[Reflect.apply(u.t,u,[...Ks(h)]),u]};return{created:(o,i)=>{const[l,c]=t(i);On&&e.global===c&&(o.__i18nWatcher=we(c.locale,()=>{i.instance&&i.instance.$forceUpdate()})),o.__composer=c,o.textContent=l},unmounted:o=>{On&&o.__i18nWatcher&&(o.__i18nWatcher(),o.__i18nWatcher=void 0,delete o.__i18nWatcher),o.__composer&&(o.__composer=void 0,delete o.__composer)},beforeUpdate:(o,{value:i})=>{if(o.__composer){const l=o.__composer,c=js(i);o.textContent=Reflect.apply(l.t,l,[...Ks(c)])}},getSSRProps:o=>{const[i]=t(o);return{textContent:i}}}}function js(e){if(H(e))return{path:e};if(te(e)){if(!("path"in e))throw Ae(Ce.REQUIRED_VALUE,"path");return e}else throw Ae(Ce.INVALID_VALUE)}function Ks(e){const{path:t,locale:n,args:r,choice:a,plural:s}=e,o={},i=r||{};return H(n)&&(o.locale=n),Ie(a)&&(o.plural=a),Ie(s)&&(o.plural=s),[t,i,o]}function tg(e,t,...n){const r=te(n[0])?n[0]:{},a=!!r.useI18nComponentName;(se(r.globalInstall)?r.globalInstall:!0)&&([a?"i18n":Hs.name,"I18nT"].forEach(o=>e.component(o,Hs)),[Bs.name,"I18nN"].forEach(o=>e.component(o,Bs)),[Ws.name,"I18nD"].forEach(o=>e.component(o,Ws))),e.directive("t",eg(t))}function ng(e,t,n){return{beforeCreate(){const r=Dt();if(!r)throw Ae(Ce.UNEXPECTED_ERROR);const a=this.$options;if(a.i18n){const s=a.i18n;if(a.__i18n&&(s.__i18n=a.__i18n),s.__root=t,this===this.$root)this.$i18n=Gs(e,s);else{s.__injectWithOption=!0,s.__extender=n.__vueI18nExtend,this.$i18n=kr(s);const o=this.$i18n;o.__extender&&(o.__disposer=o.__extender(this.$i18n))}}else if(a.__i18n)if(this===this.$root)this.$i18n=Gs(e,a);else{this.$i18n=kr({__i18n:a.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:t});const s=this.$i18n;s.__extender&&(s.__disposer=s.__extender(this.$i18n))}else this.$i18n=e;a.__i18nGlobal&&_o(t,a,a),this.$t=(...s)=>this.$i18n.t(...s),this.$rt=(...s)=>this.$i18n.rt(...s),this.$tc=(...s)=>this.$i18n.tc(...s),this.$te=(s,o)=>this.$i18n.te(s,o),this.$d=(...s)=>this.$i18n.d(...s),this.$n=(...s)=>this.$i18n.n(...s),this.$tm=s=>this.$i18n.tm(s),n.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=Dt();if(!r)throw Ae(Ce.UNEXPECTED_ERROR);const a=this.$i18n;delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,a.__disposer&&(a.__disposer(),delete a.__disposer,delete a.__extender),n.__deleteInstance(r),delete this.$i18n}}}function Gs(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[mo](t.pluralizationRules||e.pluralizationRules);const n=Bn(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(n).forEach(r=>e.mergeLocaleMessage(r,n[r])),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,t.datetimeFormats[r])),t.numberFormats&&Object.keys(t.numberFormats).forEach(r=>e.mergeNumberFormat(r,t.numberFormats[r])),e}const rg=bt("global-vue-i18n");function sg(e={},t){const n=__VUE_I18N_LEGACY_API__&&se(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,r=se(e.globalInjection)?e.globalInjection:!0,a=__VUE_I18N_LEGACY_API__&&n?!!e.allowComposition:!0,s=new Map,[o,i]=ag(e,n),l=bt("");function c(d){return s.get(d)||null}function u(d,_){s.set(d,_)}function h(d){s.delete(d)}{const d={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},get allowComposition(){return a},async install(_,...E){if(_.__VUE_I18N_SYMBOL__=l,_.provide(_.__VUE_I18N_SYMBOL__,d),te(E[0])){const M=E[0];d.__composerExtend=M.__composerExtend,d.__vueI18nExtend=M.__vueI18nExtend}let v=null;!n&&r&&(v=mg(_,d.global)),__VUE_I18N_FULL_INSTALL__&&tg(_,d,...E),__VUE_I18N_LEGACY_API__&&n&&_.mixin(ng(i,i.__composer,d));const b=_.unmount;_.unmount=()=>{v&&v(),d.dispose(),b()}},get global(){return i},dispose(){o.stop()},__instances:s,__getInstance:c,__setInstance:u,__deleteInstance:h};return d}}function Wn(e={}){const t=Dt();if(t==null)throw Ae(Ce.MUST_BE_CALL_SETUP_TOP);if(!t.isCE&&t.appContext.app!=null&&!t.appContext.app.__VUE_I18N_SYMBOL__)throw Ae(Ce.NOT_INSTALLED);const n=og(t),r=lg(n),a=go(t),s=ig(e,a);if(__VUE_I18N_LEGACY_API__&&n.mode==="legacy"&&!e.__useComponent){if(!n.allowComposition)throw Ae(Ce.NOT_AVAILABLE_IN_LEGACY_MODE);return hg(t,s,r,e)}if(s==="global")return _o(r,e,a),r;if(s==="parent"){let l=cg(n,t,e.__useComponent);return l==null&&(l=r),l}const o=n;let i=o.__getInstance(t);if(i==null){const l=Me({},e);"__i18n"in a&&(l.__i18n=a.__i18n),r&&(l.__root=r),i=Dr(l),o.__composerExtend&&(i[wr]=o.__composerExtend(i)),dg(o,t,i),o.__setInstance(t,i)}return i}function ag(e,t,n){const r=Ho();{const a=__VUE_I18N_LEGACY_API__&&t?r.run(()=>kr(e)):r.run(()=>Dr(e));if(a==null)throw Ae(Ce.UNEXPECTED_ERROR);return[r,a]}}function og(e){{const t=Bt(e.isCE?rg:e.appContext.app.__VUE_I18N_SYMBOL__);if(!t)throw Ae(e.isCE?Ce.NOT_INSTALLED_WITH_PROVIDE:Ce.UNEXPECTED_ERROR);return t}}function ig(e,t){return Vn(e)?"__i18n"in t?"local":"global":e.useScope?e.useScope:"local"}function lg(e){return e.mode==="composition"?e.global:e.global.__composer}function cg(e,t,n=!1){let r=null;const a=t.root;let s=ug(t,n);for(;s!=null;){const o=e;if(e.mode==="composition")r=o.__getInstance(s);else if(__VUE_I18N_LEGACY_API__){const i=o.__getInstance(s);i!=null&&(r=i.__composer,n&&r&&!r[fo]&&(r=null))}if(r!=null||a===s)break;s=s.parent}return r}function ug(e,t=!1){return e==null?null:t&&e.vnode.ctx||e.parent}function dg(e,t,n){Ke(()=>{},t),Nn(()=>{const r=n;e.__deleteInstance(t);const a=r[wr];a&&(a(),delete r[wr])},t)}function hg(e,t,n,r={}){const a=t==="local",s=Mn(null);if(a&&e.proxy&&!(e.proxy.$options.i18n||e.proxy.$options.__i18n))throw Ae(Ce.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);const o=se(r.inheritLocale)?r.inheritLocale:!H(r.locale),i=z(!a||o?n.locale.value:H(r.locale)?r.locale:Ut),l=z(!a||o?n.fallbackLocale.value:H(r.fallbackLocale)||_e(r.fallbackLocale)||te(r.fallbackLocale)||r.fallbackLocale===!1?r.fallbackLocale:i.value),c=z(Bn(i.value,r)),u=z(te(r.datetimeFormats)?r.datetimeFormats:{[i.value]:{}}),h=z(te(r.numberFormats)?r.numberFormats:{[i.value]:{}}),d=a?n.missingWarn:se(r.missingWarn)||ft(r.missingWarn)?r.missingWarn:!0,_=a?n.fallbackWarn:se(r.fallbackWarn)||ft(r.fallbackWarn)?r.fallbackWarn:!0,E=a?n.fallbackRoot:se(r.fallbackRoot)?r.fallbackRoot:!0,v=!!r.fallbackFormat,b=fe(r.missing)?r.missing:null,M=fe(r.postTranslation)?r.postTranslation:null,W=a?n.warnHtmlMessage:se(r.warnHtmlMessage)?r.warnHtmlMessage:!0,y=!!r.escapeParameter,L=a?n.modifiers:te(r.modifiers)?r.modifiers:{},T=r.pluralRules||a&&n.pluralRules;function C(){return[i.value,l.value,c.value,u.value,h.value]}const $=U({get:()=>s.value?s.value.locale.value:i.value,set:F=>{s.value&&(s.value.locale.value=F),i.value=F}}),x=U({get:()=>s.value?s.value.fallbackLocale.value:l.value,set:F=>{s.value&&(s.value.fallbackLocale.value=F),l.value=F}}),R=U(()=>s.value?s.value.messages.value:c.value),he=U(()=>u.value),ke=U(()=>h.value);function Z(){return s.value?s.value.getPostTranslationHandler():M}function D(F){s.value&&s.value.setPostTranslationHandler(F)}function ie(){return s.value?s.value.getMissingHandler():b}function Ee(F){s.value&&s.value.setMissingHandler(F)}function Oe(F){return C(),F()}function ve(...F){return s.value?Oe(()=>Reflect.apply(s.value.t,null,[...F])):Oe(()=>"")}function Ue(...F){return s.value?Reflect.apply(s.value.rt,null,[...F]):""}function tt(...F){return s.value?Oe(()=>Reflect.apply(s.value.d,null,[...F])):Oe(()=>"")}function be(...F){return s.value?Oe(()=>Reflect.apply(s.value.n,null,[...F])):Oe(()=>"")}function Le(F){return s.value?s.value.tm(F):{}}function He(F,ce){return s.value?s.value.te(F,ce):!1}function j(F){return s.value?s.value.getLocaleMessage(F):{}}function le(F,ce){s.value&&(s.value.setLocaleMessage(F,ce),c.value[F]=ce)}function oe(F,ce){s.value&&s.value.mergeLocaleMessage(F,ce)}function pe(F){return s.value?s.value.getDateTimeFormat(F):{}}function xe(F,ce){s.value&&(s.value.setDateTimeFormat(F,ce),u.value[F]=ce)}function Ge(F,ce){s.value&&s.value.mergeDateTimeFormat(F,ce)}function wt(F){return s.value?s.value.getNumberFormat(F):{}}function ut(F,ce){s.value&&(s.value.setNumberFormat(F,ce),h.value[F]=ce)}function Yt(F,ce){s.value&&s.value.mergeNumberFormat(F,ce)}const zt={get id(){return s.value?s.value.id:-1},locale:$,fallbackLocale:x,messages:R,datetimeFormats:he,numberFormats:ke,get inheritLocale(){return s.value?s.value.inheritLocale:o},set inheritLocale(F){s.value&&(s.value.inheritLocale=F)},get availableLocales(){return s.value?s.value.availableLocales:Object.keys(c.value)},get modifiers(){return s.value?s.value.modifiers:L},get pluralRules(){return s.value?s.value.pluralRules:T},get isGlobal(){return s.value?s.value.isGlobal:!1},get missingWarn(){return s.value?s.value.missingWarn:d},set missingWarn(F){s.value&&(s.value.missingWarn=F)},get fallbackWarn(){return s.value?s.value.fallbackWarn:_},set fallbackWarn(F){s.value&&(s.value.missingWarn=F)},get fallbackRoot(){return s.value?s.value.fallbackRoot:E},set fallbackRoot(F){s.value&&(s.value.fallbackRoot=F)},get fallbackFormat(){return s.value?s.value.fallbackFormat:v},set fallbackFormat(F){s.value&&(s.value.fallbackFormat=F)},get warnHtmlMessage(){return s.value?s.value.warnHtmlMessage:W},set warnHtmlMessage(F){s.value&&(s.value.warnHtmlMessage=F)},get escapeParameter(){return s.value?s.value.escapeParameter:y},set escapeParameter(F){s.value&&(s.value.escapeParameter=F)},t:ve,getPostTranslationHandler:Z,setPostTranslationHandler:D,getMissingHandler:ie,setMissingHandler:Ee,rt:Ue,d:tt,n:be,tm:Le,te:He,getLocaleMessage:j,setLocaleMessage:le,mergeLocaleMessage:oe,getDateTimeFormat:pe,setDateTimeFormat:xe,mergeDateTimeFormat:Ge,getNumberFormat:wt,setNumberFormat:ut,mergeNumberFormat:Yt};function Xt(F){F.locale.value=i.value,F.fallbackLocale.value=l.value,Object.keys(c.value).forEach(ce=>{F.mergeLocaleMessage(ce,c.value[ce])}),Object.keys(u.value).forEach(ce=>{F.mergeDateTimeFormat(ce,u.value[ce])}),Object.keys(h.value).forEach(ce=>{F.mergeNumberFormat(ce,h.value[ce])}),F.escapeParameter=y,F.fallbackFormat=v,F.fallbackRoot=E,F.fallbackWarn=_,F.missingWarn=d,F.warnHtmlMessage=W}return Bo(()=>{if(e.proxy==null||e.proxy.$i18n==null)throw Ae(Ce.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const F=s.value=e.proxy.$i18n.__composer;t==="global"?(i.value=F.locale.value,l.value=F.fallbackLocale.value,c.value=F.messages.value,u.value=F.datetimeFormats.value,h.value=F.numberFormats.value):a&&Xt(F)}),zt}const pg=["locale","fallbackLocale","availableLocales"],Ys=["t","rt","d","n","tm","te"];function mg(e,t){const n=Object.create(null);return pg.forEach(a=>{const s=Object.getOwnPropertyDescriptor(t,a);if(!s)throw Ae(Ce.UNEXPECTED_ERROR);const o=Wo(s.value)?{get(){return s.value.value},set(i){s.value.value=i}}:{get(){return s.get&&s.get()}};Object.defineProperty(n,a,o)}),e.config.globalProperties.$i18n=n,Ys.forEach(a=>{const s=Object.getOwnPropertyDescriptor(t,a);if(!s||!s.value)throw Ae(Ce.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${a}`,s)}),()=>{delete e.config.globalProperties.$i18n,Ys.forEach(a=>{delete e.config.globalProperties[`$${a}`]})}}j0();__INTLIFY_JIT_COMPILATION__?Os(D0):Os(x0);C0(c0);A0(Za);if(__INTLIFY_PROD_DEVTOOLS__){const e=ot();e.__INTLIFY__=!0,v0(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const yo=()=>{const e=Bt("$env"),{t,locale:n}=Wn();return{locale:n,$env:e,t}},fg={class:"text-slate-600 text-base mt-2"},gg={class:"flex flex-row justify-start items-start mt-4"},_g={class:"relative h-14"},vg=["label","status"],bg={key:0,class:"absolute bottom-0 left-0 text-sm text-[#ff4d4f]"},yg={class:"text-[#3451b2] text-base"},wg=V({__name:"TOTP",setup(e){const{t,$env:n,locale:r}=yo(),a=z(""),s=z(Mt.NORMAL),o=z(""),i=z({code:"",expires:""}),l=u=>{a.value=u.detail.value,s.value=Mt.NORMAL},c=()=>{if(a.value.length<=0)o.value=t("components_totp_3"),s.value=Mt.ERROR;else try{const{otp:u,expires:h}=nf.generate(a.value);i.value.code=u,i.value.expires=af(h).format()}catch{o.value=t("components_totp_5"),s.value=Mt.ERROR}};return(u,h)=>(f(),I("div",null,[k("div",fg,re(g(t)("components_totp_6")),1),k("div",gg,[k("div",_g,[k("r-input",{label:g(t)("components_totp_2"),class:"w-64 h-8 rounded-lg block text-lg",status:s.value,onInput:l},null,40,vg),s.value===g(Mt).ERROR?(f(),I("div",bg,re(o.value),1)):G("",!0)]),k("r-button",{class:"ml-1 h-8",onClick:c},re(g(t)("components_totp_1")),1)]),k("div",yg,[k("div",null,"code: "+re(i.value.code),1),k("div",null,re(g(t)("components_totp_4"))+": "+re(i.value.expires),1)])]))}}),wo=pr.locale,Ft=sg({legacy:!1,locale:wo,fallbackLocale:un.EN,messages:hf,devtools:!1}),Zn=e=>(Ft.mode===Ka.LEGACY?Ft.global.locale=e:Ft.global.locale.value=e,e),kg=(e,t=wo)=>{Ft.global.mergeLocaleMessage(t,e)},ko=e=>e?Ft.global.locale===e||hs.includes(e)?Promise.resolve(Zn(e)):Ko(Object.assign({"./en.json":()=>kn(()=>import("./en.Bkn4-Vvy.js"),[]),"./zh-CN.json":()=>kn(()=>import("./zh-CN.PUkQxDBJ.js"),[])}),`./${e}.json`,2).then(t=>(kg(t.default,e),hs.push(e),Zn(e))):Promise.reject("lang is undefined"),Lg=V({__name:"Layout",setup(e){const{$env:t,locale:n}=yo(),{lang:r}=bn(),a=()=>{const s=r.value||un.EN;n.value=s,t.locale=s,ko(s).catch(o=>{console.log("error",o)}),rf(ja,s)};return gt(()=>{a()}),Ke(()=>{cf()}),(s,o)=>(f(),X(g(Ca).Layout))}}),Eg=()=>{kn(()=>import("./pwa-install.es.Boqgbkxy.js"),[]).then(()=>{let e=document.getElementById(ps);e||(e=document.createElement(pf),e.setAttribute("manifest-url",mf),e.setAttribute("id",ps),document.body.appendChild(e))})},Mg={extends:Ca,enhanceApp({app:e,router:t,siteData:n}){kn(()=>import("./index.DJu_DrSV.js").then(a=>a.i),__vite__mapDeps([0,1])),Eg(),e.use(gf);const r=sf(ja)||un.EN;ko(r).then(()=>{lf("__VUE_PROD_DEVTOOLS__",!1),e.use(Ft),e.component("Layout",Lg),e.component("TOTP",wg)}).catch(a=>{console.log("error",a)})}};export{Mg as R};
