const __vite__fileDeps=["assets/chunks/index.Jlax9Txa.js","assets/chunks/framework.DU63L2vM.js"],__vite__mapDeps=i=>i.map(i=>__vite__fileDeps[i]);
import{d as H,o as p,c as I,r as S,a as Qe,t as re,n as fe,b as q,w as C,e as G,T as Cn,_ as J,u as bn,i as Li,f as Ei,g as An,h as V,j as X,k as Ke,l as w,m as v,p as Ae,q as Ne,s as Lt,v as Zn,x as Le,y as ft,z as Nn,A as Ya,B as Si,C as Oi,D as pt,F as ge,E as $e,G as Mn,H as Pn,I as Y,J as za,K as $t,L as rn,M as fn,N as Ut,O as Ii,P as Xa,Q as Ti,R as it,S as qa,U as $n,V as Ci,W as en,X as wr,Y as Lr,Z as Ai,$ as yn,a0 as kn,a1 as Ni,a2 as Ft,a3 as Ja,a4 as Qa,a5 as Dt,a6 as Mi,a7 as Pi,a8 as $i,a9 as Ri,aa as Za,ab as Fi,ac as Di,ad as xi,ae as Vi,af as Hi,ag as Ui,ah as Bi,ai as Wi,aj as ji,ak as wn}from"./framework.DU63L2vM.js";const Ki=H({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(t,n)=>(p(),I("span",{class:fe(["VPBadge",t.type])},[S(t.$slots,"default",{},()=>[Qe(re(t.text),1)])],2))}}),Gi={key:0,class:"VPBackdrop"},Yi=H({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(t,n)=>(p(),q(Cn,{name:"fade"},{default:C(()=>[t.show?(p(),I("div",Gi)):G("",!0)]),_:1}))}}),zi=J(Yi,[["__scopeId","data-v-db7b4bf6"]]),se=bn;function Xi(e,t){let n,r=!1;return()=>{n&&clearTimeout(n),r?n=setTimeout(e,t):(e(),(r=!0)&&setTimeout(()=>r=!1,t))}}function er(e){return/^\//.test(e)?e:`/${e}`}function Er(e){const{pathname:t,search:n,hash:r,protocol:s}=new URL(e,"http://a.com");if(Li(e)||e.startsWith("#")||!s.startsWith("http")||!Ei(t))return e;const{site:a}=se(),i=t.endsWith("/")||t.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${t.replace(/(\.md)?$/,a.value.cleanUrls?"":".html")}${n}${r}`);return An(i)}function an({removeCurrent:e=!0,correspondingLink:t=!1}={}){const{site:n,localeIndex:r,page:s,theme:a,hash:i}=se(),o=V(()=>{var c,u;return{index:r.value,label:(c=n.value.locales[r.value])==null?void 0:c.label,link:((u=n.value.locales[r.value])==null?void 0:u.link)||(r.value==="root"?"/":`/${r.value}/`)}});return{localeLinks:V(()=>Object.entries(n.value.locales).flatMap(([c,u])=>e&&o.value.label===u.label?[]:{index:c,text:u.label,link:qi(u.link||(c==="root"?"/":`/${c}/`),a.value.i18nRouting!==!1&&t,s.value.relativePath.slice(o.value.link.length-1),!n.value.cleanUrls)+i.value})),currentLang:o}}function qi(e,t,n,r){return t?e.replace(/\/$/,"")+er(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):e}const Ji=e=>(Ae("data-v-160de489"),e=e(),Ne(),e),Qi={class:"NotFound"},Zi={class:"code"},eo={class:"title"},to=Ji(()=>w("div",{class:"divider"},null,-1)),no={class:"quote"},ro={class:"action"},ao=["href","aria-label"],so=H({__name:"NotFound",setup(e){const{site:t}=se(),{localeLinks:n}=an({removeCurrent:!1}),r=X({link:"/",index:"root"});Ke(()=>{const a=window.location.pathname.replace(t.value.base,"").replace(/(^.*?\/).*$/,"/$1");n.value.length&&(r.value=n.value.find(({link:i})=>i.startsWith(a))||n.value[0])});const s=V(()=>{var a,i,o,l;return{code:404,title:"PAGE NOT FOUND",quote:"But if you don't change your direction, and if you keep looking, you may end up where you are heading.",linkLabel:"go to home",linkText:"Take me home",...r.value.index==="root"?(a=t.value.themeConfig)==null?void 0:a.notFound:(l=(o=(i=t.value.locales)==null?void 0:i[r.value.index])==null?void 0:o.themeConfig)==null?void 0:l.notFound}});return(a,i)=>(p(),I("div",Qi,[w("p",Zi,re(s.value.code),1),w("h1",eo,re(s.value.title),1),to,w("blockquote",no,re(s.value.quote),1),w("div",ro,[w("a",{class:"link",href:v(An)(r.value.link),"aria-label":s.value.linkLabel},re(s.value.linkText),9,ao)])]))}}),io=J(so,[["__scopeId","data-v-160de489"]]);function es(e,t){if(Array.isArray(e))return pn(e);if(e==null)return[];t=er(t);const n=Object.keys(e).sort((s,a)=>a.split("/").length-s.split("/").length).find(s=>t.startsWith(er(s))),r=n?e[n]:[];return Array.isArray(r)?pn(r):pn(r.items,r.base)}function oo(e){const t=[];let n=0;for(const r in e){const s=e[r];if(s.items){n=t.push(s);continue}t[n]||t.push({items:[]}),t[n].items.push(s)}return t}function lo(e){const t=[];function n(r){for(const s of r)s.text&&s.link&&t.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&n(s.items)}return n(e),t}function tr(e,t){return Array.isArray(t)?t.some(n=>tr(e,n)):Lt(e,t.link)?!0:t.items?tr(e,t.items):!1}function pn(e,t){return[...e].map(n=>{const r={...n},s=r.base||t;return s&&r.link&&(r.link=s+r.link),r.items&&(r.items=pn(r.items,s)),r})}function lt(){const{frontmatter:e,page:t,theme:n}=se(),r=Zn("(min-width: 960px)"),s=X(!1),a=V(()=>{const _=n.value.sidebar,b=t.value.relativePath;return _?es(_,b):[]}),i=X(a.value);Le(a,(_,b)=>{JSON.stringify(_)!==JSON.stringify(b)&&(i.value=a.value)});const o=V(()=>e.value.sidebar!==!1&&i.value.length>0&&e.value.layout!=="home"),l=V(()=>c?e.value.aside==null?n.value.aside==="left":e.value.aside==="left":!1),c=V(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:n.value.aside!==!1),u=V(()=>o.value&&r.value),h=V(()=>o.value?oo(i.value):[]);function d(){s.value=!0}function g(){s.value=!1}function E(){s.value?g():d()}return{isOpen:s,sidebar:i,sidebarGroups:h,hasSidebar:o,hasAside:c,leftAside:l,isSidebarEnabled:u,open:d,close:g,toggle:E}}function co(e,t){let n;ft(()=>{n=e.value?document.activeElement:void 0}),Ke(()=>{window.addEventListener("keyup",r)}),Nn(()=>{window.removeEventListener("keyup",r)});function r(s){s.key==="Escape"&&e.value&&(t(),n==null||n.focus())}}function uo(e){const{page:t,hash:n}=se(),r=X(!1),s=V(()=>e.value.collapsed!=null),a=V(()=>!!e.value.link),i=X(!1),o=()=>{i.value=Lt(t.value.relativePath,e.value.link)};Le([t,e,n],o),Ke(o);const l=V(()=>i.value?!0:e.value.items?tr(t.value.relativePath,e.value.items):!1),c=V(()=>!!(e.value.items&&e.value.items.length));ft(()=>{r.value=!!(s.value&&e.value.collapsed)}),Ya(()=>{(i.value||l.value)&&(r.value=!1)});function u(){s.value&&(r.value=!r.value)}return{collapsed:r,collapsible:s,isLink:a,isActiveLink:i,hasActiveLink:l,hasChildren:c,toggle:u}}function ho(){const{hasSidebar:e}=lt(),t=Zn("(min-width: 960px)"),n=Zn("(min-width: 1280px)");return{isAsideEnabled:V(()=>!n.value&&!t.value?!1:e.value?n.value:t.value)}}const nr=[];function ts(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function Sr(e){const t=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const r=Number(n.tagName[1]);return{element:n,title:mo(n),link:"#"+n.id,level:r}});return fo(t,e)}function mo(e){let t="";for(const n of e.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor")||n.classList.contains("ignore-header"))continue;t+=n.textContent}else n.nodeType===3&&(t+=n.textContent);return t.trim()}function fo(e,t){if(t===!1)return[];const n=(typeof t=="object"&&!Array.isArray(t)?t.level:t)||2,[r,s]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;e=e.filter(i=>i.level>=r&&i.level<=s),nr.length=0;for(const{element:i,link:o}of e)nr.push({element:i,link:o});const a=[];e:for(let i=0;i<e.length;i++){const o=e[i];if(i===0)a.push(o);else{for(let l=i-1;l>=0;l--){const c=e[l];if(c.level<o.level){(c.children||(c.children=[])).push(o);continue e}}a.push(o)}}return a}function po(e,t){const{isAsideEnabled:n}=ho(),r=Xi(a,100);let s=null;Ke(()=>{requestAnimationFrame(a),window.addEventListener("scroll",r)}),Si(()=>{i(location.hash)}),Nn(()=>{window.removeEventListener("scroll",r)});function a(){if(!n.value)return;const o=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,u=Math.abs(o+l-c)<1,h=nr.map(({element:g,link:E})=>({link:E,top:go(g)})).filter(({top:g})=>!Number.isNaN(g)).sort((g,E)=>g.top-E.top);if(!h.length){i(null);return}if(o<1){i(null);return}if(u){i(h[h.length-1].link);return}let d=null;for(const{link:g,top:E}of h){if(E>o+Oi()+4)break;d=g}i(d)}function i(o){s&&s.classList.remove("active"),o==null?s=null:s=e.value.querySelector(`a[href="${decodeURIComponent(o)}"]`);const l=s;l?(l.classList.add("active"),t.value.style.top=l.offsetTop+39+"px",t.value.style.opacity="1"):(t.value.style.top="33px",t.value.style.opacity="0")}}function go(e){let t=0;for(;e!==document.body;){if(e===null)return NaN;t+=e.offsetTop,e=e.offsetParent}return t}const vo=["href","title"],_o=H({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function t({target:n}){const r=n.href.split("#")[1],s=document.getElementById(decodeURIComponent(r));s==null||s.focus({preventScroll:!0})}return(n,r)=>{const s=pt("VPDocOutlineItem",!0);return p(),I("ul",{class:fe(["VPDocOutlineItem",n.root?"root":"nested"])},[(p(!0),I(ge,null,$e(n.headers,({children:a,link:i,title:o})=>(p(),I("li",null,[w("a",{class:"outline-link",href:i,onClick:t,title:o},re(o),9,vo),a!=null&&a.length?(p(),q(s,{key:0,headers:a},null,8,["headers"])):G("",!0)]))),256))],2)}}}),ns=J(_o,[["__scopeId","data-v-52e48c5e"]]),bo={class:"content"},yo={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},ko=H({__name:"VPDocAsideOutline",setup(e){const{frontmatter:t,theme:n}=se(),r=Mn([]);Pn(()=>{r.value=Sr(t.value.outline??n.value.outline)});const s=X(),a=X();return po(s,a),(i,o)=>(p(),I("nav",{"aria-labelledby":"doc-outline-aria-label",class:fe(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:s,role:"navigation"},[w("div",bo,[w("div",{class:"outline-marker",ref_key:"marker",ref:a},null,512),w("div",yo,re(v(ts)(v(n))),1),Y(ns,{headers:r.value,root:!0},null,8,["headers"])])],2))}}),wo=J(ko,[["__scopeId","data-v-5b17eb0e"]]),Lo={class:"VPDocAsideCarbonAds"},Eo=H({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const t=()=>null;return(n,r)=>(p(),I("div",Lo,[Y(v(t),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),So=e=>(Ae("data-v-14ca046b"),e=e(),Ne(),e),Oo={class:"VPDocAside"},Io=So(()=>w("div",{class:"spacer"},null,-1)),To=H({__name:"VPDocAside",setup(e){const{theme:t}=se();return(n,r)=>(p(),I("div",Oo,[S(n.$slots,"aside-top",{},void 0,!0),S(n.$slots,"aside-outline-before",{},void 0,!0),Y(wo),S(n.$slots,"aside-outline-after",{},void 0,!0),Io,S(n.$slots,"aside-ads-before",{},void 0,!0),v(t).carbonAds?(p(),q(Eo,{key:0,"carbon-ads":v(t).carbonAds},null,8,["carbon-ads"])):G("",!0),S(n.$slots,"aside-ads-after",{},void 0,!0),S(n.$slots,"aside-bottom",{},void 0,!0)]))}}),Co=J(To,[["__scopeId","data-v-14ca046b"]]);function Ao(){const{theme:e,page:t}=se();return V(()=>{const{text:n="Edit this page",pattern:r=""}=e.value.editLink||{};let s;return typeof r=="function"?s=r(t.value):s=r.replace(/:path/g,t.value.filePath),{url:s,text:n}})}function No(){const{page:e,theme:t,frontmatter:n}=se();return V(()=>{var c,u,h,d,g,E,_,b;const r=es(t.value.sidebar,e.value.relativePath),s=lo(r),a=Mo(s,M=>M.link.replace(/[?#].*$/,"")),i=a.findIndex(M=>Lt(e.value.relativePath,M.link)),o=((c=t.value.docFooter)==null?void 0:c.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((u=t.value.docFooter)==null?void 0:u.next)===!1&&!n.value.next||n.value.next===!1;return{prev:o?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((h=a[i-1])==null?void 0:h.docFooterText)??((d=a[i-1])==null?void 0:d.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((g=a[i-1])==null?void 0:g.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((E=a[i+1])==null?void 0:E.docFooterText)??((_=a[i+1])==null?void 0:_.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((b=a[i+1])==null?void 0:b.link)}}})}function Mo(e,t){const n=new Set;return e.filter(r=>{const s=t(r);return n.has(s)?!1:n.add(s)})}const Xe=H({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const t=e,n=V(()=>t.tag??(t.href?"a":"span")),r=V(()=>t.href&&za.test(t.href));return(s,a)=>(p(),q($t(n.value),{class:fe(["VPLink",{link:s.href,"vp-external-link-icon":r.value,"no-icon":s.noIcon}]),href:s.href?v(Er)(s.href):void 0,target:s.target??(r.value?"_blank":void 0),rel:s.rel??(r.value?"noreferrer":void 0)},{default:C(()=>[S(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Po={class:"VPLastUpdated"},$o=["datetime"],Ro=H({__name:"VPDocFooterLastUpdated",setup(e){const{theme:t,page:n,frontmatter:r,lang:s}=se(),a=V(()=>new Date(r.value.lastUpdated??n.value.lastUpdated)),i=V(()=>a.value.toISOString()),o=X("");return Ke(()=>{ft(()=>{var l,c,u;o.value=new Intl.DateTimeFormat((c=(l=t.value.lastUpdated)==null?void 0:l.formatOptions)!=null&&c.forceLocale?s.value:void 0,((u=t.value.lastUpdated)==null?void 0:u.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(a.value)})}),(l,c)=>{var u;return p(),I("p",Po,[Qe(re(((u=v(t).lastUpdated)==null?void 0:u.text)||v(t).lastUpdatedText||"Last updated")+": ",1),w("time",{datetime:i.value},re(o.value),9,$o)])}}}),Fo=J(Ro,[["__scopeId","data-v-c15509d5"]]),rs=e=>(Ae("data-v-2fd85e37"),e=e(),Ne(),e),Do={key:0,class:"VPDocFooter"},xo={key:0,class:"edit-info"},Vo={key:0,class:"edit-link"},Ho=rs(()=>w("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),Uo={key:1,class:"last-updated"},Bo={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},Wo=rs(()=>w("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),jo={class:"pager"},Ko=["innerHTML"],Go=["innerHTML"],Yo={class:"pager"},zo=["innerHTML"],Xo=["innerHTML"],qo=H({__name:"VPDocFooter",setup(e){const{theme:t,page:n,frontmatter:r}=se(),s=Ao(),a=No(),i=V(()=>t.value.editLink&&r.value.editLink!==!1),o=V(()=>n.value.lastUpdated&&r.value.lastUpdated!==!1),l=V(()=>i.value||o.value||a.value.prev||a.value.next);return(c,u)=>{var h,d,g,E;return l.value?(p(),I("footer",Do,[S(c.$slots,"doc-footer-before",{},void 0,!0),i.value||o.value?(p(),I("div",xo,[i.value?(p(),I("div",Vo,[Y(Xe,{class:"edit-link-button",href:v(s).url,"no-icon":!0},{default:C(()=>[Ho,Qe(" "+re(v(s).text),1)]),_:1},8,["href"])])):G("",!0),o.value?(p(),I("div",Uo,[Y(Fo)])):G("",!0)])):G("",!0),(h=v(a).prev)!=null&&h.link||(d=v(a).next)!=null&&d.link?(p(),I("nav",Bo,[Wo,w("div",jo,[(g=v(a).prev)!=null&&g.link?(p(),q(Xe,{key:0,class:"pager-link prev",href:v(a).prev.link},{default:C(()=>{var _;return[w("span",{class:"desc",innerHTML:((_=v(t).docFooter)==null?void 0:_.prev)||"Previous page"},null,8,Ko),w("span",{class:"title",innerHTML:v(a).prev.text},null,8,Go)]}),_:1},8,["href"])):G("",!0)]),w("div",Yo,[(E=v(a).next)!=null&&E.link?(p(),q(Xe,{key:0,class:"pager-link next",href:v(a).next.link},{default:C(()=>{var _;return[w("span",{class:"desc",innerHTML:((_=v(t).docFooter)==null?void 0:_.next)||"Next page"},null,8,zo),w("span",{class:"title",innerHTML:v(a).next.text},null,8,Xo)]}),_:1},8,["href"])):G("",!0)])])):G("",!0)])):G("",!0)}}}),Jo=J(qo,[["__scopeId","data-v-2fd85e37"]]),Qo=e=>(Ae("data-v-c1a9569f"),e=e(),Ne(),e),Zo={class:"container"},el=Qo(()=>w("div",{class:"aside-curtain"},null,-1)),tl={class:"aside-container"},nl={class:"aside-content"},rl={class:"content"},al={class:"content-container"},sl={class:"main"},il=H({__name:"VPDoc",setup(e){const{theme:t}=se(),n=rn(),{hasSidebar:r,hasAside:s,leftAside:a}=lt(),i=V(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(o,l)=>{const c=pt("Content");return p(),I("div",{class:fe(["VPDoc",{"has-sidebar":v(r),"has-aside":v(s)}])},[S(o.$slots,"doc-top",{},void 0,!0),w("div",Zo,[v(s)?(p(),I("div",{key:0,class:fe(["aside",{"left-aside":v(a)}])},[el,w("div",tl,[w("div",nl,[Y(Co,null,{"aside-top":C(()=>[S(o.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":C(()=>[S(o.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":C(()=>[S(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[S(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[S(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[S(o.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):G("",!0),w("div",rl,[w("div",al,[S(o.$slots,"doc-before",{},void 0,!0),w("main",sl,[Y(c,{class:fe(["vp-doc",[i.value,v(t).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),Y(Jo,null,{"doc-footer-before":C(()=>[S(o.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),S(o.$slots,"doc-after",{},void 0,!0)])])]),S(o.$slots,"doc-bottom",{},void 0,!0)],2)}}}),ol=J(il,[["__scopeId","data-v-c1a9569f"]]),ll=H({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const t=e,n=V(()=>t.href&&za.test(t.href)),r=V(()=>t.tag||t.href?"a":"button");return(s,a)=>(p(),q($t(r.value),{class:fe(["VPButton",[s.size,s.theme]]),href:s.href?v(Er)(s.href):void 0,target:t.target??(n.value?"_blank":void 0),rel:t.rel??(n.value?"noreferrer":void 0)},{default:C(()=>[Qe(re(s.text),1)]),_:1},8,["class","href","target","rel"]))}}),cl=J(ll,[["__scopeId","data-v-797bb5ff"]]),ul=["src","alt"],dl=H({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(t,n)=>{const r=pt("VPImage",!0);return t.image?(p(),I(ge,{key:0},[typeof t.image=="string"||"src"in t.image?(p(),I("img",fn({key:0,class:"VPImage"},typeof t.image=="string"?t.$attrs:{...t.image,...t.$attrs},{src:v(An)(typeof t.image=="string"?t.image:t.image.src),alt:t.alt??(typeof t.image=="string"?"":t.image.alt||"")}),null,16,ul)):(p(),I(ge,{key:1},[Y(r,fn({class:"dark",image:t.image.dark,alt:t.image.alt},t.$attrs),null,16,["image","alt"]),Y(r,fn({class:"light",image:t.image.light,alt:t.image.alt},t.$attrs),null,16,["image","alt"])],64))],64)):G("",!0)}}}),Ln=J(dl,[["__scopeId","data-v-14491e2f"]]),hl=e=>(Ae("data-v-a28d1e75"),e=e(),Ne(),e),ml={class:"container"},fl={class:"main"},pl={key:0,class:"name"},gl=["innerHTML"],vl=["innerHTML"],_l=["innerHTML"],bl={key:0,class:"actions"},yl={key:0,class:"image"},kl={class:"image-container"},wl=hl(()=>w("div",{class:"image-bg"},null,-1)),Ll=H({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const t=Ut("hero-image-slot-exists");return(n,r)=>(p(),I("div",{class:fe(["VPHero",{"has-image":n.image||v(t)}])},[w("div",ml,[w("div",fl,[S(n.$slots,"home-hero-info-before",{},void 0,!0),S(n.$slots,"home-hero-info",{},()=>[n.name?(p(),I("h1",pl,[w("span",{innerHTML:n.name,class:"clip"},null,8,gl)])):G("",!0),n.text?(p(),I("p",{key:1,innerHTML:n.text,class:"text"},null,8,vl)):G("",!0),n.tagline?(p(),I("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,_l)):G("",!0)],!0),S(n.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(p(),I("div",bl,[(p(!0),I(ge,null,$e(n.actions,s=>(p(),I("div",{key:s.link,class:"action"},[Y(cl,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link,target:s.target,rel:s.rel},null,8,["theme","text","href","target","rel"])]))),128))])):G("",!0),S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||v(t)?(p(),I("div",yl,[w("div",kl,[wl,S(n.$slots,"home-hero-image",{},()=>[n.image?(p(),q(Ln,{key:0,class:"image-src",image:n.image},null,8,["image"])):G("",!0)],!0)])])):G("",!0)])],2))}}),El=J(Ll,[["__scopeId","data-v-a28d1e75"]]),Sl=H({__name:"VPHomeHero",setup(e){const{frontmatter:t}=se();return(n,r)=>v(t).hero?(p(),q(El,{key:0,class:"VPHomeHero",name:v(t).hero.name,text:v(t).hero.text,tagline:v(t).hero.tagline,image:v(t).hero.image,actions:v(t).hero.actions},{"home-hero-info-before":C(()=>[S(n.$slots,"home-hero-info-before")]),"home-hero-info":C(()=>[S(n.$slots,"home-hero-info")]),"home-hero-info-after":C(()=>[S(n.$slots,"home-hero-info-after")]),"home-hero-actions-after":C(()=>[S(n.$slots,"home-hero-actions-after")]),"home-hero-image":C(()=>[S(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):G("",!0)}}),Ol=e=>(Ae("data-v-64656a11"),e=e(),Ne(),e),Il={class:"box"},Tl={key:0,class:"icon"},Cl=["innerHTML"],Al=["innerHTML"],Nl=["innerHTML"],Ml={key:4,class:"link-text"},Pl={class:"link-text-value"},$l=Ol(()=>w("span",{class:"vpi-arrow-right link-text-icon"},null,-1)),Rl=H({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(t,n)=>(p(),q(Xe,{class:"VPFeature",href:t.link,rel:t.rel,target:t.target,"no-icon":!0,tag:t.link?"a":"div"},{default:C(()=>[w("article",Il,[typeof t.icon=="object"&&t.icon.wrap?(p(),I("div",Tl,[Y(Ln,{image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])])):typeof t.icon=="object"?(p(),q(Ln,{key:1,image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])):t.icon?(p(),I("div",{key:2,class:"icon",innerHTML:t.icon},null,8,Cl)):G("",!0),w("h2",{class:"title",innerHTML:t.title},null,8,Al),t.details?(p(),I("p",{key:3,class:"details",innerHTML:t.details},null,8,Nl)):G("",!0),t.linkText?(p(),I("div",Ml,[w("p",Pl,[Qe(re(t.linkText)+" ",1),$l])])):G("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),Fl=J(Rl,[["__scopeId","data-v-64656a11"]]),Dl={key:0,class:"VPFeatures"},xl={class:"container"},Vl={class:"items"},Hl=H({__name:"VPFeatures",props:{features:{}},setup(e){const t=e,n=V(()=>{const r=t.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,s)=>r.features?(p(),I("div",Dl,[w("div",xl,[w("div",Vl,[(p(!0),I(ge,null,$e(r.features,a=>(p(),I("div",{key:a.title,class:fe(["item",[n.value]])},[Y(Fl,{icon:a.icon,title:a.title,details:a.details,link:a.link,"link-text":a.linkText,rel:a.rel,target:a.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):G("",!0)}}),Ul=J(Hl,[["__scopeId","data-v-099d4ef0"]]),Bl=H({__name:"VPHomeFeatures",setup(e){const{frontmatter:t}=se();return(n,r)=>v(t).features?(p(),q(Ul,{key:0,class:"VPHomeFeatures",features:v(t).features},null,8,["features"])):G("",!0)}}),Wl=H({__name:"VPHomeContent",setup(e){const{width:t}=Ii({includeScrollbar:!1});return(n,r)=>(p(),I("div",{class:"vp-doc container",style:Xa(v(t)?{"--vp-offset":`calc(50% - ${v(t)/2}px)`}:{})},[S(n.$slots,"default",{},void 0,!0)],4))}}),jl=J(Wl,[["__scopeId","data-v-03d388c6"]]),Kl={class:"VPHome"},Gl=H({__name:"VPHome",setup(e){const{frontmatter:t}=se();return(n,r)=>{const s=pt("Content");return p(),I("div",Kl,[S(n.$slots,"home-hero-before",{},void 0,!0),Y(Sl,null,{"home-hero-info-before":C(()=>[S(n.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[S(n.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[S(n.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[S(n.$slots,"home-hero-image",{},void 0,!0)]),_:3}),S(n.$slots,"home-hero-after",{},void 0,!0),S(n.$slots,"home-features-before",{},void 0,!0),Y(Bl),S(n.$slots,"home-features-after",{},void 0,!0),v(t).markdownStyles!==!1?(p(),q(jl,{key:0},{default:C(()=>[Y(s)]),_:1})):(p(),q(s,{key:1}))])}}}),Yl=J(Gl,[["__scopeId","data-v-c13b82e0"]]),zl={},Xl={class:"VPPage"};function ql(e,t){const n=pt("Content");return p(),I("div",Xl,[S(e.$slots,"page-top"),Y(n),S(e.$slots,"page-bottom")])}const Jl=J(zl,[["render",ql]]),Ql=H({__name:"VPContent",setup(e){const{page:t,frontmatter:n}=se(),{hasSidebar:r}=lt();return(s,a)=>(p(),I("div",{class:fe(["VPContent",{"has-sidebar":v(r),"is-home":v(n).layout==="home"}]),id:"VPContent"},[v(t).isNotFound?S(s.$slots,"not-found",{key:0},()=>[Y(io)],!0):v(n).layout==="page"?(p(),q(Jl,{key:1},{"page-top":C(()=>[S(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":C(()=>[S(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):v(n).layout==="home"?(p(),q(Yl,{key:2},{"home-hero-before":C(()=>[S(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":C(()=>[S(s.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[S(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[S(s.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[S(s.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[S(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":C(()=>[S(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":C(()=>[S(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":C(()=>[S(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):v(n).layout&&v(n).layout!=="doc"?(p(),q($t(v(n).layout),{key:3})):(p(),q(ol,{key:4},{"doc-top":C(()=>[S(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":C(()=>[S(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":C(()=>[S(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":C(()=>[S(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":C(()=>[S(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":C(()=>[S(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":C(()=>[S(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[S(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[S(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[S(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":C(()=>[S(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Zl=J(Ql,[["__scopeId","data-v-d5329665"]]),ec={class:"container"},tc=["innerHTML"],nc=["innerHTML"],rc=H({__name:"VPFooter",setup(e){const{theme:t,frontmatter:n}=se(),{hasSidebar:r}=lt();return(s,a)=>v(t).footer&&v(n).footer!==!1?(p(),I("footer",{key:0,class:fe(["VPFooter",{"has-sidebar":v(r)}])},[w("div",ec,[v(t).footer.message?(p(),I("p",{key:0,class:"message",innerHTML:v(t).footer.message},null,8,tc)):G("",!0),v(t).footer.copyright?(p(),I("p",{key:1,class:"copyright",innerHTML:v(t).footer.copyright},null,8,nc)):G("",!0)])],2)):G("",!0)}}),ac=J(rc,[["__scopeId","data-v-b699d399"]]);function sc(){const{theme:e,frontmatter:t}=se(),n=Mn([]),r=V(()=>n.value.length>0);return Pn(()=>{n.value=Sr(t.value.outline??e.value.outline)}),{headers:n,hasLocalNav:r}}const ic=e=>(Ae("data-v-472e2b9b"),e=e(),Ne(),e),oc={class:"menu-text"},lc=ic(()=>w("span",{class:"vpi-chevron-right icon"},null,-1)),cc={class:"header"},uc={class:"outline"},dc=H({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const t=e,{theme:n}=se(),r=X(!1),s=X(0),a=X(),i=X();function o(h){var d;(d=a.value)!=null&&d.contains(h.target)||(r.value=!1)}Le(r,h=>{if(h){document.addEventListener("click",o);return}document.removeEventListener("click",o)}),Ti("Escape",()=>{r.value=!1}),Pn(()=>{r.value=!1});function l(){r.value=!r.value,s.value=window.innerHeight+Math.min(window.scrollY-t.navHeight,0)}function c(h){h.target.classList.contains("outline-link")&&(i.value&&(i.value.style.transition="none"),it(()=>{r.value=!1}))}function u(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,d)=>(p(),I("div",{class:"VPLocalNavOutlineDropdown",style:Xa({"--vp-vh":s.value+"px"}),ref_key:"main",ref:a},[h.headers.length>0?(p(),I("button",{key:0,onClick:l,class:fe({open:r.value})},[w("span",oc,re(v(ts)(v(n))),1),lc],2)):(p(),I("button",{key:1,onClick:u},re(v(n).returnToTopLabel||"Return to top"),1)),Y(Cn,{name:"flyout"},{default:C(()=>[r.value?(p(),I("div",{key:0,ref_key:"items",ref:i,class:"items",onClick:c},[w("div",cc,[w("a",{class:"top-link",href:"#",onClick:u},re(v(n).returnToTopLabel||"Return to top"),1)]),w("div",uc,[Y(ns,{headers:h.headers},null,8,["headers"])])],512)):G("",!0)]),_:1})],4))}}),hc=J(dc,[["__scopeId","data-v-472e2b9b"]]),mc=e=>(Ae("data-v-4b514e37"),e=e(),Ne(),e),fc={class:"container"},pc=["aria-expanded"],gc=mc(()=>w("span",{class:"vpi-align-left menu-icon"},null,-1)),vc={class:"menu-text"},_c=H({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:t,frontmatter:n}=se(),{hasSidebar:r}=lt(),{headers:s}=sc(),{y:a}=qa(),i=X(0);Ke(()=>{i.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Pn(()=>{s.value=Sr(n.value.outline??t.value.outline)});const o=V(()=>s.value.length===0),l=V(()=>o.value&&!r.value),c=V(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:o.value,fixed:l.value}));return(u,h)=>v(n).layout!=="home"&&(!l.value||v(a)>=i.value)?(p(),I("div",{key:0,class:fe(c.value)},[w("div",fc,[v(r)?(p(),I("button",{key:0,class:"menu","aria-expanded":u.open,"aria-controls":"VPSidebarNav",onClick:h[0]||(h[0]=d=>u.$emit("open-menu"))},[gc,w("span",vc,re(v(t).sidebarMenuLabel||"Menu"),1)],8,pc)):G("",!0),Y(hc,{headers:v(s),navHeight:i.value},null,8,["headers","navHeight"])])],2)):G("",!0)}}),bc=J(_c,[["__scopeId","data-v-4b514e37"]]);function yc(){const e=X(!1);function t(){e.value=!0,window.addEventListener("resize",s)}function n(){e.value=!1,window.removeEventListener("resize",s)}function r(){e.value?n():t()}function s(){window.outerWidth>=768&&n()}const a=rn();return Le(()=>a.path,n),{isScreenOpen:e,openScreen:t,closeScreen:n,toggleScreen:r}}const kc={},wc={class:"VPSwitch",type:"button",role:"switch"},Lc={class:"check"},Ec={key:0,class:"icon"};function Sc(e,t){return p(),I("button",wc,[w("span",Lc,[e.$slots.default?(p(),I("span",Ec,[S(e.$slots,"default",{},void 0,!0)])):G("",!0)])])}const Oc=J(kc,[["render",Sc],["__scopeId","data-v-e827bda8"]]),as=e=>(Ae("data-v-869324af"),e=e(),Ne(),e),Ic=as(()=>w("span",{class:"vpi-sun sun"},null,-1)),Tc=as(()=>w("span",{class:"vpi-moon moon"},null,-1)),Cc=H({__name:"VPSwitchAppearance",setup(e){const{isDark:t,theme:n}=se(),r=Ut("toggle-appearance",()=>{t.value=!t.value}),s=V(()=>t.value?n.value.lightModeSwitchTitle||"Switch to light theme":n.value.darkModeSwitchTitle||"Switch to dark theme");return(a,i)=>(p(),q(Oc,{title:s.value,class:"VPSwitchAppearance","aria-checked":v(t),onClick:v(r)},{default:C(()=>[Ic,Tc]),_:1},8,["title","aria-checked","onClick"]))}}),Or=J(Cc,[["__scopeId","data-v-869324af"]]),Ac={key:0,class:"VPNavBarAppearance"},Nc=H({__name:"VPNavBarAppearance",setup(e){const{site:t}=se();return(n,r)=>v(t).appearance&&v(t).appearance!=="force-dark"?(p(),I("div",Ac,[Y(Or)])):G("",!0)}}),Mc=J(Nc,[["__scopeId","data-v-1d57cb43"]]),Ir=X();let ss=!1,jn=0;function Pc(e){const t=X(!1);if($n){!ss&&$c(),jn++;const n=Le(Ir,r=>{var s,a,i;r===e.el.value||(s=e.el.value)!=null&&s.contains(r)?(t.value=!0,(a=e.onFocus)==null||a.call(e)):(t.value=!1,(i=e.onBlur)==null||i.call(e))});Nn(()=>{n(),jn--,jn||Rc()})}return Ci(t)}function $c(){document.addEventListener("focusin",is),ss=!0,Ir.value=document.activeElement}function Rc(){document.removeEventListener("focusin",is)}function is(){Ir.value=document.activeElement}const Fc={class:"VPMenuLink"},Dc=H({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:t}=se();return(n,r)=>(p(),I("div",Fc,[Y(Xe,{class:fe({active:v(Lt)(v(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:C(()=>[Qe(re(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Rn=J(Dc,[["__scopeId","data-v-29d85418"]]),xc={class:"VPMenuGroup"},Vc={key:0,class:"title"},Hc=H({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",xc,[t.text?(p(),I("p",Vc,re(t.text),1)):G("",!0),(p(!0),I(ge,null,$e(t.items,r=>(p(),I(ge,null,["link"in r?(p(),q(Rn,{key:0,item:r},null,8,["item"])):G("",!0)],64))),256))]))}}),Uc=J(Hc,[["__scopeId","data-v-838c8e19"]]),Bc={class:"VPMenu"},Wc={key:0,class:"items"},jc=H({__name:"VPMenu",props:{items:{}},setup(e){return(t,n)=>(p(),I("div",Bc,[t.items?(p(),I("div",Wc,[(p(!0),I(ge,null,$e(t.items,r=>(p(),I(ge,{key:r.text},["link"in r?(p(),q(Rn,{key:0,item:r},null,8,["item"])):(p(),q(Uc,{key:1,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):G("",!0),S(t.$slots,"default",{},void 0,!0)]))}}),Kc=J(jc,[["__scopeId","data-v-ed75d3da"]]),Gc=e=>(Ae("data-v-b94ef4ac"),e=e(),Ne(),e),Yc=["aria-expanded","aria-label"],zc={key:0,class:"text"},Xc=["innerHTML"],qc=Gc(()=>w("span",{class:"vpi-chevron-down text-icon"},null,-1)),Jc={key:1,class:"vpi-more-horizontal icon"},Qc={class:"menu"},Zc=H({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const t=X(!1),n=X();Pc({el:n,onBlur:r});function r(){t.value=!1}return(s,a)=>(p(),I("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:a[1]||(a[1]=i=>t.value=!0),onMouseleave:a[2]||(a[2]=i=>t.value=!1)},[w("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":t.value,"aria-label":s.label,onClick:a[0]||(a[0]=i=>t.value=!t.value)},[s.button||s.icon?(p(),I("span",zc,[s.icon?(p(),I("span",{key:0,class:fe([s.icon,"option-icon"])},null,2)):G("",!0),s.button?(p(),I("span",{key:1,innerHTML:s.button},null,8,Xc)):G("",!0),qc])):(p(),I("span",Jc))],8,Yc),w("div",Qc,[Y(Kc,{items:s.items},{default:C(()=>[S(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Tr=J(Zc,[["__scopeId","data-v-b94ef4ac"]]),eu=["href","aria-label","innerHTML"],tu=H({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const t=e,n=V(()=>typeof t.icon=="object"?t.icon.svg:`<span class="vpi-social-${t.icon}" />`);return(r,s)=>(p(),I("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,eu))}}),nu=J(tu,[["__scopeId","data-v-9fc61c31"]]),ru={class:"VPSocialLinks"},au=H({__name:"VPSocialLinks",props:{links:{}},setup(e){return(t,n)=>(p(),I("div",ru,[(p(!0),I(ge,null,$e(t.links,({link:r,icon:s,ariaLabel:a})=>(p(),q(nu,{key:r,icon:s,link:r,ariaLabel:a},null,8,["icon","link","ariaLabel"]))),128))]))}}),Cr=J(au,[["__scopeId","data-v-eac2c8d6"]]),su={key:0,class:"group translations"},iu={class:"trans-title"},ou={key:1,class:"group"},lu={class:"item appearance"},cu={class:"label"},uu={class:"appearance-action"},du={key:2,class:"group"},hu={class:"item social-links"},mu=H({__name:"VPNavBarExtra",setup(e){const{site:t,theme:n}=se(),{localeLinks:r,currentLang:s}=an({correspondingLink:!0}),a=V(()=>r.value.length&&s.value.label||t.value.appearance||n.value.socialLinks);return(i,o)=>a.value?(p(),q(Tr,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:C(()=>[v(r).length&&v(s).label?(p(),I("div",su,[w("p",iu,re(v(s).label),1),(p(!0),I(ge,null,$e(v(r),l=>(p(),q(Rn,{key:l.link,item:l},null,8,["item"]))),128))])):G("",!0),v(t).appearance&&v(t).appearance!=="force-dark"?(p(),I("div",ou,[w("div",lu,[w("p",cu,re(v(n).darkModeSwitchLabel||"Appearance"),1),w("div",uu,[Y(Or)])])])):G("",!0),v(n).socialLinks?(p(),I("div",du,[w("div",hu,[Y(Cr,{class:"social-links-list",links:v(n).socialLinks},null,8,["links"])])])):G("",!0)]),_:1})):G("",!0)}}),fu=J(mu,[["__scopeId","data-v-2f98f87a"]]),pu=e=>(Ae("data-v-4f214d0c"),e=e(),Ne(),e),gu=["aria-expanded"],vu=pu(()=>w("span",{class:"container"},[w("span",{class:"top"}),w("span",{class:"middle"}),w("span",{class:"bottom"})],-1)),_u=[vu],bu=H({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(t,n)=>(p(),I("button",{type:"button",class:fe(["VPNavBarHamburger",{active:t.active}]),"aria-label":"mobile navigation","aria-expanded":t.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=r=>t.$emit("click"))},_u,10,gu))}}),yu=J(bu,[["__scopeId","data-v-4f214d0c"]]),ku=["innerHTML"],wu=H({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:t}=se();return(n,r)=>(p(),q(Xe,{class:fe({VPNavBarMenuLink:!0,active:v(Lt)(v(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,noIcon:n.item.noIcon,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:C(()=>[w("span",{innerHTML:n.item.text},null,8,ku)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Lu=J(wu,[["__scopeId","data-v-5f61206c"]]),Eu=H({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const t=e,{page:n}=se(),r=a=>"link"in a?Lt(n.value.relativePath,a.link,!!t.item.activeMatch):a.items.some(r),s=V(()=>r(t.item));return(a,i)=>(p(),q(Tr,{class:fe({VPNavBarMenuGroup:!0,active:v(Lt)(v(n).relativePath,a.item.activeMatch,!!a.item.activeMatch)||s.value}),button:a.item.text,items:a.item.items},null,8,["class","button","items"]))}}),Su=e=>(Ae("data-v-520257dc"),e=e(),Ne(),e),Ou={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Iu=Su(()=>w("span",{id:"main-nav-aria-label",class:"visually-hidden"},"Main Navigation",-1)),Tu=H({__name:"VPNavBarMenu",setup(e){const{theme:t}=se();return(n,r)=>v(t).nav?(p(),I("nav",Ou,[Iu,(p(!0),I(ge,null,$e(v(t).nav,s=>(p(),I(ge,{key:s.text},["link"in s?(p(),q(Lu,{key:0,item:s},null,8,["item"])):(p(),q(Eu,{key:1,item:s},null,8,["item"]))],64))),128))])):G("",!0)}}),Cu=J(Tu,[["__scopeId","data-v-520257dc"]]);var Vr;const os=typeof window<"u",Au=e=>typeof e=="string",gn=()=>{};os&&((Vr=window==null?void 0:window.navigator)!=null&&Vr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function rr(e){return typeof e=="function"?e():v(e)}function Nu(e,t){function n(...r){e(()=>t.apply(this,r),{fn:t,thisArg:this,args:r})}return n}function Mu(e,t={}){let n,r;return s=>{const a=rr(e),i=rr(t.maxWait);if(n&&clearTimeout(n),a<=0||i!==void 0&&i<=0)return r&&(clearTimeout(r),r=null),s();i&&!r&&(r=setTimeout(()=>{n&&clearTimeout(n),r=null,s()},i)),n=setTimeout(()=>{r&&clearTimeout(r),r=null,s()},a)}}function Pu(e){return e}function $u(e){return Ja()?(Qa(e),!0):!1}function ls(e,t=200,n={}){return Nu(Mu(t,n),e)}function Kn(e,t=200,n={}){if(t<=0)return e;const r=X(e.value),s=ls(()=>{r.value=e.value},t,n);return Le(e,()=>s()),r}function cs(e,t,n){return Le(e,(r,s,a)=>{r&&t(r,s,a)},n)}function Ru(e){var t;const n=rr(e);return(t=n==null?void 0:n.$el)!=null?t:n}const us=os?window:void 0;function dn(...e){let t,n,r,s;if(Au(e[0])?([n,r,s]=e,t=us):[t,n,r,s]=e,!t)return gn;let a=gn;const i=Le(()=>Ru(t),l=>{a(),l&&(l.addEventListener(n,r,s),a=()=>{l.removeEventListener(n,r,s),a=gn})},{immediate:!0,flush:"post"}),o=()=>{i(),a()};return $u(o),o}const Hr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ur="__vueuse_ssr_handlers__";Hr[Ur]=Hr[Ur]||{};const Fu={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Du(e={}){const{reactive:t=!1,target:n=us,aliasMap:r=Fu,passive:s=!0,onEventFired:a=gn}=e,i=en(new Set),o={toJSON(){return{}},current:i},l=t?en(o):o,c=new Set,u=new Set;function h(_,b){_ in l&&(t?l[_]=b:l[_].value=b)}function d(){for(const _ of u)h(_,!1)}function g(_,b){var M,W;const y=(M=_.key)==null?void 0:M.toLowerCase(),L=[(W=_.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?i.add(y):i.delete(y));for(const A of L)u.add(A),h(A,b);y==="meta"&&!b?(c.forEach(A=>{i.delete(A),h(A,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&b&&[...i,...L].forEach(A=>c.add(A))}dn(n,"keydown",_=>(g(_,!0),a(_)),{passive:s}),dn(n,"keyup",_=>(g(_,!1),a(_)),{passive:s}),dn("blur",d,{passive:!0}),dn("focus",d,{passive:!0});const E=new Proxy(l,{get(_,b,M){if(typeof b!="string")return Reflect.get(_,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=V(()=>y.every(L=>v(E[L])))}else l[b]=X(!1);const W=Reflect.get(_,b,M);return t?v(W):W}});return E}var Br;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Br||(Br={}));var xu=Object.defineProperty,Wr=Object.getOwnPropertySymbols,Vu=Object.prototype.hasOwnProperty,Hu=Object.prototype.propertyIsEnumerable,jr=(e,t,n)=>t in e?xu(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Uu=(e,t)=>{for(var n in t||(t={}))Vu.call(t,n)&&jr(e,n,t[n]);if(Wr)for(var n of Wr(t))Hu.call(t,n)&&jr(e,n,t[n]);return e};const Bu={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Uu({linear:Pu},Bu);function ot(e){return Array.isArray?Array.isArray(e):ms(e)==="[object Array]"}const Wu=1/0;function ju(e){if(typeof e=="string")return e;let t=e+"";return t=="0"&&1/e==-Wu?"-0":t}function Ku(e){return e==null?"":ju(e)}function Ye(e){return typeof e=="string"}function ds(e){return typeof e=="number"}function Gu(e){return e===!0||e===!1||Yu(e)&&ms(e)=="[object Boolean]"}function hs(e){return typeof e=="object"}function Yu(e){return hs(e)&&e!==null}function xe(e){return e!=null}function Gn(e){return!e.trim().length}function ms(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const zu="Incorrect 'index' type",Xu=e=>`Invalid value for key ${e}`,qu=e=>`Pattern length exceeds max of ${e}.`,Ju=e=>`Missing ${e} property in key`,Qu=e=>`Property 'weight' in key '${e}' must be a positive integer`,Kr=Object.prototype.hasOwnProperty;class Zu{constructor(t){this._keys=[],this._keyMap={};let n=0;t.forEach(r=>{let s=fs(r);n+=s.weight,this._keys.push(s),this._keyMap[s.id]=s,n+=s.weight}),this._keys.forEach(r=>{r.weight/=n})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function fs(e){let t=null,n=null,r=null,s=1,a=null;if(Ye(e)||ot(e))r=e,t=Gr(e),n=ar(e);else{if(!Kr.call(e,"name"))throw new Error(Ju("name"));const i=e.name;if(r=i,Kr.call(e,"weight")&&(s=e.weight,s<=0))throw new Error(Qu(i));t=Gr(i),n=ar(i),a=e.getFn}return{path:t,id:n,weight:s,src:r,getFn:a}}function Gr(e){return ot(e)?e:e.split(".")}function ar(e){return ot(e)?e.join("."):e}function ed(e,t){let n=[],r=!1;const s=(a,i,o)=>{if(xe(a))if(!i[o])n.push(a);else{let l=i[o];const c=a[l];if(!xe(c))return;if(o===i.length-1&&(Ye(c)||ds(c)||Gu(c)))n.push(Ku(c));else if(ot(c)){r=!0;for(let u=0,h=c.length;u<h;u+=1)s(c[u],i,o+1)}else i.length&&s(c,i,o+1)}};return s(e,Ye(t)?t.split("."):t,0),r?n:n[0]}const td={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},nd={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},rd={location:0,threshold:.6,distance:100},ad={useExtendedSearch:!1,getFn:ed,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var ee={...nd,...td,...rd,...ad};const sd=/[^ ]+/g;function id(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(s){const a=s.match(sd).length;if(n.has(a))return n.get(a);const i=1/Math.pow(a,.5*e),o=parseFloat(Math.round(i*r)/r);return n.set(a,o),o},clear(){n.clear()}}}class Ar{constructor({getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){this.norm=id(n,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((n,r)=>{this._keysMap[n.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,Ye(this.docs[0])?this.docs.forEach((t,n)=>{this._addString(t,n)}):this.docs.forEach((t,n)=>{this._addObject(t,n)}),this.norm.clear())}add(t){const n=this.size();Ye(t)?this._addString(t,n):this._addObject(t,n)}removeAt(t){this.records.splice(t,1);for(let n=t,r=this.size();n<r;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(t,n){return t[this._keysMap[n]]}size(){return this.records.length}_addString(t,n){if(!xe(t)||Gn(t))return;let r={v:t,i:n,n:this.norm.get(t)};this.records.push(r)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach((s,a)=>{let i=s.getFn?s.getFn(t):this.getFn(t,s.path);if(xe(i)){if(ot(i)){let o=[];const l=[{nestedArrIndex:-1,value:i}];for(;l.length;){const{nestedArrIndex:c,value:u}=l.pop();if(xe(u))if(Ye(u)&&!Gn(u)){let h={v:u,i:c,n:this.norm.get(u)};o.push(h)}else ot(u)&&u.forEach((h,d)=>{l.push({nestedArrIndex:d,value:h})})}r.$[a]=o}else if(Ye(i)&&!Gn(i)){let o={v:i,n:this.norm.get(i)};r.$[a]=o}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function ps(e,t,{getFn:n=ee.getFn,fieldNormWeight:r=ee.fieldNormWeight}={}){const s=new Ar({getFn:n,fieldNormWeight:r});return s.setKeys(e.map(fs)),s.setSources(t),s.create(),s}function od(e,{getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){const{keys:r,records:s}=e,a=new Ar({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(s),a}function hn(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:s=ee.distance,ignoreLocation:a=ee.ignoreLocation}={}){const i=t/e.length;if(a)return i;const o=Math.abs(r-n);return s?i+o/s:o?1:i}function ld(e=[],t=ee.minMatchCharLength){let n=[],r=-1,s=-1,a=0;for(let i=e.length;a<i;a+=1){let o=e[a];o&&r===-1?r=a:!o&&r!==-1&&(s=a-1,s-r+1>=t&&n.push([r,s]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}const wt=32;function cd(e,t,n,{location:r=ee.location,distance:s=ee.distance,threshold:a=ee.threshold,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,includeMatches:l=ee.includeMatches,ignoreLocation:c=ee.ignoreLocation}={}){if(t.length>wt)throw new Error(qu(wt));const u=t.length,h=e.length,d=Math.max(0,Math.min(r,h));let g=a,E=d;const _=o>1||l,b=_?Array(h):[];let M;for(;(M=e.indexOf(t,E))>-1;){let $=hn(t,{currentLocation:M,expectedLocation:d,distance:s,ignoreLocation:c});if(g=Math.min($,g),E=M+u,_){let D=0;for(;D<u;)b[M+D]=1,D+=1}}E=-1;let W=[],y=1,L=u+h;const A=1<<u-1;for(let $=0;$<u;$+=1){let D=0,R=L;for(;D<R;)hn(t,{errors:$,currentLocation:d+R,expectedLocation:d,distance:s,ignoreLocation:c})<=g?D=R:L=R,R=Math.floor((L-D)/2+D);L=R;let de=Math.max(1,d-R+1),ke=i?h:Math.min(d+R,h)+u,Z=Array(ke+2);Z[ke+1]=(1<<$)-1;for(let x=ke;x>=de;x-=1){let oe=x-1,Ee=n[e.charAt(oe)];if(_&&(b[oe]=+!!Ee),Z[x]=(Z[x+1]<<1|1)&Ee,$&&(Z[x]|=(W[x+1]|W[x])<<1|1|W[x+1]),Z[x]&A&&(y=hn(t,{errors:$,currentLocation:oe,expectedLocation:d,distance:s,ignoreLocation:c}),y<=g)){if(g=y,E=oe,E<=d)break;de=Math.max(1,2*d-E)}}if(hn(t,{errors:$+1,currentLocation:d,expectedLocation:d,distance:s,ignoreLocation:c})>g)break;W=Z}const T={isMatch:E>=0,score:Math.max(.001,y)};if(_){const $=ld(b,o);$.length?l&&(T.indices=$):T.isMatch=!1}return T}function ud(e){let t={};for(let n=0,r=e.length;n<r;n+=1){const s=e.charAt(n);t[s]=(t[s]||0)|1<<r-n-1}return t}class gs{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){if(this.options={location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:l,ignoreLocation:c},this.pattern=l?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const u=(d,g)=>{this.chunks.push({pattern:d,alphabet:ud(d),startIndex:g})},h=this.pattern.length;if(h>wt){let d=0;const g=h%wt,E=h-g;for(;d<E;)u(this.pattern.substr(d,wt),d),d+=wt;if(g){const _=h-wt;u(this.pattern.substr(_),_)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:n,includeMatches:r}=this.options;if(n||(t=t.toLowerCase()),this.pattern===t){let E={isMatch:!0,score:0};return r&&(E.indices=[[0,t.length-1]]),E}const{location:s,distance:a,threshold:i,findAllMatches:o,minMatchCharLength:l,ignoreLocation:c}=this.options;let u=[],h=0,d=!1;this.chunks.forEach(({pattern:E,alphabet:_,startIndex:b})=>{const{isMatch:M,score:W,indices:y}=cd(t,E,_,{location:s+b,distance:a,threshold:i,findAllMatches:o,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});M&&(d=!0),h+=W,M&&y&&(u=[...u,...y])});let g={isMatch:d,score:d?h/this.chunks.length:1};return d&&r&&(g.indices=u),g}}class gt{constructor(t){this.pattern=t}static isMultiMatch(t){return Yr(t,this.multiRegex)}static isSingleMatch(t){return Yr(t,this.singleRegex)}search(){}}function Yr(e,t){const n=e.match(t);return n?n[1]:null}class dd extends gt{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const n=t===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class hd extends gt{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const n=t.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class md extends gt{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const n=t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class fd extends gt{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const n=!t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class pd extends gt{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const n=t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class gd extends gt{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const n=!t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class vs extends gt{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:s=ee.distance,includeMatches:a=ee.includeMatches,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){super(t),this._bitapSearch=new gs(t,{location:n,threshold:r,distance:s,includeMatches:a,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:l,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class _s extends gt{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let n=0,r;const s=[],a=this.pattern.length;for(;(r=t.indexOf(this.pattern,n))>-1;)n=r+a,s.push([r,n-1]);const i=!!s.length;return{isMatch:i,score:i?0:1,indices:s}}}const sr=[dd,_s,md,fd,gd,pd,hd,vs],zr=sr.length,vd=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,_d="|";function bd(e,t={}){return e.split(_d).map(n=>{let r=n.trim().split(vd).filter(a=>a&&!!a.trim()),s=[];for(let a=0,i=r.length;a<i;a+=1){const o=r[a];let l=!1,c=-1;for(;!l&&++c<zr;){const u=sr[c];let h=u.isMultiMatch(o);h&&(s.push(new u(h,t)),l=!0)}if(!l)for(c=-1;++c<zr;){const u=sr[c];let h=u.isSingleMatch(o);if(h){s.push(new u(h,t));break}}}return s})}const yd=new Set([vs.type,_s.type]);class kd{constructor(t,{isCaseSensitive:n=ee.isCaseSensitive,includeMatches:r=ee.includeMatches,minMatchCharLength:s=ee.minMatchCharLength,ignoreLocation:a=ee.ignoreLocation,findAllMatches:i=ee.findAllMatches,location:o=ee.location,threshold:l=ee.threshold,distance:c=ee.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:r,minMatchCharLength:s,findAllMatches:i,ignoreLocation:a,location:o,threshold:l,distance:c},this.pattern=n?t:t.toLowerCase(),this.query=bd(this.pattern,this.options)}static condition(t,n){return n.useExtendedSearch}searchIn(t){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:s}=this.options;t=s?t:t.toLowerCase();let a=0,i=[],o=0;for(let l=0,c=n.length;l<c;l+=1){const u=n[l];i.length=0,a=0;for(let h=0,d=u.length;h<d;h+=1){const g=u[h],{isMatch:E,indices:_,score:b}=g.search(t);if(E){if(a+=1,o+=b,r){const M=g.constructor.type;yd.has(M)?i=[...i,..._]:i.push(_)}}else{o=0,a=0,i.length=0;break}}if(a){let h={isMatch:!0,score:o/a};return r&&(h.indices=i),h}}return{isMatch:!1,score:1}}}const ir=[];function wd(...e){ir.push(...e)}function or(e,t){for(let n=0,r=ir.length;n<r;n+=1){let s=ir[n];if(s.condition(e,t))return new s(e,t)}return new gs(e,t)}const En={AND:"$and",OR:"$or"},lr={PATH:"$path",PATTERN:"$val"},cr=e=>!!(e[En.AND]||e[En.OR]),Ld=e=>!!e[lr.PATH],Ed=e=>!ot(e)&&hs(e)&&!cr(e),Xr=e=>({[En.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function bs(e,t,{auto:n=!0}={}){const r=s=>{let a=Object.keys(s);const i=Ld(s);if(!i&&a.length>1&&!cr(s))return r(Xr(s));if(Ed(s)){const l=i?s[lr.PATH]:a[0],c=i?s[lr.PATTERN]:s[l];if(!Ye(c))throw new Error(Xu(l));const u={keyId:ar(l),pattern:c};return n&&(u.searcher=or(c,t)),u}let o={children:[],operator:a[0]};return a.forEach(l=>{const c=s[l];ot(c)&&c.forEach(u=>{o.children.push(r(u))})}),o};return cr(e)||(e=Xr(e)),r(e)}function Sd(e,{ignoreFieldNorm:t=ee.ignoreFieldNorm}){e.forEach(n=>{let r=1;n.matches.forEach(({key:s,norm:a,score:i})=>{const o=s?s.weight:null;r*=Math.pow(i===0&&o?Number.EPSILON:i,(o||1)*(t?1:a))}),n.score=r})}function Od(e,t){const n=e.matches;t.matches=[],xe(n)&&n.forEach(r=>{if(!xe(r.indices)||!r.indices.length)return;const{indices:s,value:a}=r;let i={indices:s,value:a};r.key&&(i.key=r.key.src),r.idx>-1&&(i.refIndex=r.idx),t.matches.push(i)})}function Id(e,t){t.score=e.score}function Td(e,t,{includeMatches:n=ee.includeMatches,includeScore:r=ee.includeScore}={}){const s=[];return n&&s.push(Od),r&&s.push(Id),e.map(a=>{const{idx:i}=a,o={item:t[i],refIndex:i};return s.length&&s.forEach(l=>{l(a,o)}),o})}class Et{constructor(t,n={},r){this.options={...ee,...n},this.options.useExtendedSearch,this._keyStore=new Zu(this.options.keys),this.setCollection(t,r)}setCollection(t,n){if(this._docs=t,n&&!(n instanceof Ar))throw new Error(zu);this._myIndex=n||ps(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){!xe(t)||(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const n=[];for(let r=0,s=this._docs.length;r<s;r+=1){const a=this._docs[r];t(a,r)&&(this.removeAt(r),r-=1,s-=1,n.push(a))}return n}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:n=-1}={}){const{includeMatches:r,includeScore:s,shouldSort:a,sortFn:i,ignoreFieldNorm:o}=this.options;let l=Ye(t)?Ye(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Sd(l,{ignoreFieldNorm:o}),a&&l.sort(i),ds(n)&&n>-1&&(l=l.slice(0,n)),Td(l,this._docs,{includeMatches:r,includeScore:s})}_searchStringList(t){const n=or(t,this.options),{records:r}=this._myIndex,s=[];return r.forEach(({v:a,i,n:o})=>{if(!xe(a))return;const{isMatch:l,score:c,indices:u}=n.searchIn(a);l&&s.push({item:a,idx:i,matches:[{score:c,value:a,norm:o,indices:u}]})}),s}_searchLogical(t){const n=bs(t,this.options),r=(o,l,c)=>{if(!o.children){const{keyId:h,searcher:d}=o,g=this._findMatches({key:this._keyStore.get(h),value:this._myIndex.getValueForItemAtKeyId(l,h),searcher:d});return g&&g.length?[{idx:c,item:l,matches:g}]:[]}const u=[];for(let h=0,d=o.children.length;h<d;h+=1){const g=o.children[h],E=r(g,l,c);if(E.length)u.push(...E);else if(o.operator===En.AND)return[]}return u},s=this._myIndex.records,a={},i=[];return s.forEach(({$:o,i:l})=>{if(xe(o)){let c=r(n,o,l);c.length&&(a[l]||(a[l]={idx:l,item:o,matches:[]},i.push(a[l])),c.forEach(({matches:u})=>{a[l].matches.push(...u)}))}}),i}_searchObjectList(t){const n=or(t,this.options),{keys:r,records:s}=this._myIndex,a=[];return s.forEach(({$:i,i:o})=>{if(!xe(i))return;let l=[];r.forEach((c,u)=>{l.push(...this._findMatches({key:c,value:i[u],searcher:n}))}),l.length&&a.push({idx:o,item:i,matches:l})}),a}_findMatches({key:t,value:n,searcher:r}){if(!xe(n))return[];let s=[];if(ot(n))n.forEach(({v:a,i,n:o})=>{if(!xe(a))return;const{isMatch:l,score:c,indices:u}=r.searchIn(a);l&&s.push({score:c,key:t,value:a,idx:i,norm:o,indices:u})});else{const{v:a,n:i}=n,{isMatch:o,score:l,indices:c}=r.searchIn(a);o&&s.push({score:l,key:t,value:a,norm:i,indices:c})}return s}}Et.version="6.6.2";Et.createIndex=ps;Et.parseIndex=od;Et.config=ee;Et.parseQuery=bs;wd(kd);const qr=en({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Bt=()=>({isSearching:V(()=>qr.search!==""),...Ni(qr)});function Cd(e){return{all:e=e||new Map,on:function(t,n){var r=e.get(t);r?r.push(n):e.set(t,[n])},off:function(t,n){var r=e.get(t);r&&(n?r.splice(r.indexOf(n)>>>0,1):e.set(t,[]))},emit:function(t,n){var r=e.get(t);r&&r.slice().map(function(s){s(n)}),(r=e.get("*"))&&r.slice().map(function(s){s(t,n)})}}}const Ad=Cd(),Fn=()=>({emitter:Ad});function Nd(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return n;n=n.nextElementSibling}}function Md(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}const Pd=["command-theme"],$d={"command-root":""},Rd=H({name:"Command"}),Fd=H({...Rd,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(e,{emit:t}){const n=e,r='[command-item=""]',s="command-item-key",a='[command-group=""]',i="command-group-key",o='[command-group-heading=""]',l=`${r}:not([aria-disabled="true"])`,c=`${r}[aria-selected="true"]`,u="command-item-select",h="data-value";wr("theme",n.theme||"default");const{selectedNode:d,search:g,dataValue:E,filtered:_}=Bt(),{emitter:b}=Fn(),M=X(),W=Kn(X(new Map),333),y=Kn(X(new Set),333),L=Kn(X(new Map)),A=V(()=>{const j=[];for(const[le,ie]of W.value.entries())j.push({key:le,label:ie});return j}),T=V(()=>{const j=Et.createIndex(n.fuseOptions.keys,A.value);return new Et(A.value,n.fuseOptions,j)}),$=()=>{var j,le,ie;const he=D();he&&(((j=he.parentElement)==null?void 0:j.firstElementChild)===he&&((ie=(le=he.closest(a))==null?void 0:le.querySelector(o))==null||ie.scrollIntoView({block:"nearest"})),he.scrollIntoView({block:"nearest"}))},D=()=>{var j;return(j=M.value)==null?void 0:j.querySelector(c)},R=(j=M.value)=>{const le=j==null?void 0:j.querySelectorAll(l);return le?Array.from(le):[]},de=()=>{var j;const le=(j=M.value)==null?void 0:j.querySelectorAll(a);return le?Array.from(le):[]},ke=()=>{const[j]=R();j&&j.getAttribute(s)&&(d.value=j.getAttribute(s)||"")},Z=j=>{const le=R()[j];le&&(d.value=le.getAttribute(s)||"")},x=j=>{const le=D(),ie=R(),he=ie.findIndex(Ge=>Ge===le),De=ie[he+j];De?d.value=De.getAttribute(s)||"":j>0?Z(0):Z(ie.length-1)},oe=j=>{const le=D();let ie=le==null?void 0:le.closest(a),he=null;for(;ie&&!he;)ie=j>0?Nd(ie,a):Md(ie,a),he=ie==null?void 0:ie.querySelector(l);he?d.value=he.getAttribute(s)||"":x(j)},Ee=()=>Z(0),Oe=()=>Z(R().length-1),_e=j=>{j.preventDefault(),j.metaKey?Oe():j.altKey?oe(1):x(1)},He=j=>{j.preventDefault(),j.metaKey?Ee():j.altKey?oe(-1):x(-1)},et=j=>{switch(j.key){case"n":case"j":{j.ctrlKey&&_e(j);break}case"ArrowDown":{_e(j);break}case"p":case"k":{j.ctrlKey&&He(j);break}case"ArrowUp":{He(j);break}case"Home":{Ee();break}case"End":{Oe();break}case"Enter":{const le=D();if(le){const ie=new Event(u);le.dispatchEvent(ie)}}}},be=()=>{if(!g.value){_.value.count=y.value.size;return}_.value.groups=new Set("");const j=new Map,le=T.value.search(g.value).map(ie=>ie.item);for(const{key:ie,label:he}of le)j.set(ie,he);for(const[ie,he]of L.value)for(const De of he)j.get(De)&&_.value.groups.add(ie);it(()=>{_.value.count=j.size,_.value.items=j})},we=()=>{const j=R(),le=de();for(const ie of j){const he=ie.getAttribute(s)||"",De=ie.getAttribute(h)||"";y.value.add(he),W.value.set(he,De),_.value.count=W.value.size}for(const ie of le){const he=R(ie),De=ie.getAttribute(i)||"",Ge=new Set("");for(const bt of he){const ct=bt.getAttribute(s)||"";Ge.add(ct)}L.value.set(De,Ge)}};Le(()=>d.value,j=>{j&&it($)},{deep:!0}),Le(()=>g.value,j=>{be(),it(ke)}),b.on("selectItem",j=>{t("select-item",j)});const Ue=ls(j=>{j&&(we(),it(ke))},100);return b.on("rerenderList",Ue),Ke(()=>{we(),ke()}),(j,le)=>(p(),I("div",{class:fe(e.theme),onKeydown:et,ref_key:"commandRef",ref:M,"command-theme":e.theme},[w("div",$d,[S(j.$slots,"default")])],42,Pd))}}),Wt=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},ur=Wt(Fd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),Dd={"command-dialog":""},xd={"command-dialog-mask":""},Vd={"command-dialog-wrapper":""},Hd={"command-dialog-header":""},Ud={"command-dialog-body":""},Bd={key:0,"command-dialog-footer":""},Wd=H({name:"Command.Dialog"}),jd=H({...Wd,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(e,{emit:t}){const n=e,{search:r,filtered:s}=Bt(),{emitter:a}=Fn(),i=X();a.on("selectItem",l=>{t("select-item",l)});const o=()=>{r.value="",s.value.count=0,s.value.items=new Map,s.value.groups=new Set};return cs(()=>n.visible,o),Lr(o),(l,c)=>(p(),q(Ai,{to:"body",ref_key:"dialogRef",ref:i},[Y(Cn,{name:"command-dialog",appear:""},{default:C(()=>[e.visible?(p(),q(ur,{key:0,theme:e.theme},{default:C(()=>[w("div",Dd,[w("div",xd,[w("div",Vd,[w("div",Hd,[S(l.$slots,"header")]),w("div",Ud,[S(l.$slots,"body")]),l.$slots.footer?(p(),I("div",Bd,[S(l.$slots,"footer")])):G("v-if",!0)])])])]),_:3},8,["theme"])):G("v-if",!0)]),_:3})],512))}}),Kd=Wt(jd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let ys=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((t,n)=>(n&=63,n<36?t+=n.toString(36):n<62?t+=(n-26).toString(36).toUpperCase():n>62?t+="-":t+="_",t),"");const Gd=["command-group-key","data-value"],Yd={key:0,"command-group-heading":""},zd={"command-group-items":"",role:"group"},Xd=H({name:"Command.Group"}),qd=H({...Xd,props:{heading:{type:String,required:!0}},setup(e){const t=V(()=>`command-group-${ys()}`),{filtered:n,isSearching:r}=Bt(),s=V(()=>r.value?n.value.groups.has(t.value):!0);return(a,i)=>yn((p(),I("div",{"command-group":"",role:"presentation",key:v(t),"command-group-key":v(t),"data-value":e.heading},[e.heading?(p(),I("div",Yd,re(e.heading),1)):G("v-if",!0),w("div",zd,[S(a.$slots,"default")])],8,Gd)),[[kn,v(s)]])}}),Jd=Wt(qd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),Qd=["placeholder","value"],Zd=H({name:"Command.Input"}),eh=H({...Zd,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(e,{emit:t}){const n=X(null),{search:r}=Bt(),s=V(()=>r.value),a=i=>{const o=i,l=i.target;r.value=l==null?void 0:l.value,t("input",o),t("update:value",r.value)};return ft(()=>{var i;(i=n.value)==null||i.focus()}),(i,o)=>(p(),I("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:e.placeholder,value:v(s),onInput:a},null,40,Qd))}}),th=Wt(eh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),nh=["aria-selected","aria-disabled","command-item-key"],rh=H({name:"Command.Item"}),ah=H({...rh,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(e,{emit:t}){const n=e,r="command-item-select",s="data-value",{current:a}=Du(),{selectedNode:i,filtered:o,isSearching:l}=Bt(),{emitter:c}=Fn(),u=X(),h=V(()=>`command-item-${ys()}`),d=V(()=>{const _=o.value.items.get(h.value);return l.value?_!==void 0:!0}),g=V(()=>Array.from(a)),E=()=>{var _;const b={key:h.value,value:((_=u.value)==null?void 0:_.getAttribute(s))||""};t("select",b),c.emit("selectItem",b)};return cs(g,_=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(b=>a.has(b.toLowerCase()))&&n.perform&&n.perform()}),ft(()=>{var _;(_=u.value)==null||_.addEventListener(r,E)}),Lr(()=>{var _;(_=u.value)==null||_.removeEventListener(r,E)}),(_,b)=>yn((p(),I("div",{ref_key:"itemRef",ref:u,"command-item":"",role:"option","aria-selected":v(i)===v(h),"aria-disabled":!v(d),key:v(h),"command-item-key":v(h),onClick:E},[S(_.$slots,"default")],8,nh)),[[kn,v(d)]])}}),sh=Wt(ah,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),ih=H({name:"Command.List"}),oh=H({...ih,setup(e){const{emitter:t}=Fn(),n=X(),r=X();let s=null,a;return ft(()=>{a=r.value;const i=n.value;a&&i&&(s=new ResizeObserver(o=>{it(()=>{const l=a==null?void 0:a.offsetHeight;i==null||i.style.setProperty("--command-list-height",`${l==null?void 0:l.toFixed(1)}px`),t.emit("rerenderList",!0)})}),s.observe(a))}),Lr(()=>{s!==null&&a&&s.unobserve(a)}),(i,o)=>(p(),I("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[w("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[S(i.$slots,"default")],512)],512))}}),lh=Wt(oh,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),ch=H({name:"Command.Empty",setup(e,{attrs:t,slots:n}){const{filtered:r}=Bt(),s=V(()=>r.value.count===0);return()=>s.value?Ft("div",{"command-empty":"",role:"presentation",...t},n):Ft("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...t})}}),uh=H({name:"Command.Loading",setup(e,{attrs:t,slots:n}){return()=>Ft("div",{"command-loading":"",role:"progressbar",...t},n)}}),dh=H({name:"Command.Separator",setup(e,{attrs:t,slots:n}){return()=>Ft("div",{"command-separator":"",role:"separator",...t})}}),Tt=Object.assign(ur,{Dialog:Kd,Empty:ch,Group:Jd,Input:th,Item:sh,List:lh,Loading:uh,Separator:dh,Root:ur});var Jr;const ks=typeof window<"u",hh=e=>typeof e=="string",ws=()=>{};ks&&((Jr=window==null?void 0:window.navigator)!=null&&Jr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function Ls(e){return typeof e=="function"?e():v(e)}function mh(e){return e}function fh(e){return Ja()?(Qa(e),!0):!1}function ph(e,t=!0){Dt()?Ke(e):t?e():it(e)}function gh(e){var t;const n=Ls(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Nr=ks?window:void 0;function Mt(...e){let t,n,r,s;if(hh(e[0])||Array.isArray(e[0])?([n,r,s]=e,t=Nr):[t,n,r,s]=e,!t)return ws;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const a=[],i=()=>{a.forEach(u=>u()),a.length=0},o=(u,h,d,g)=>(u.addEventListener(h,d,g),()=>u.removeEventListener(h,d,g)),l=Le(()=>[gh(t),Ls(s)],([u,h])=>{i(),u&&a.push(...n.flatMap(d=>r.map(g=>o(u,d,g,h))))},{immediate:!0,flush:"post"}),c=()=>{l(),i()};return fh(c),c}const Qr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Zr="__vueuse_ssr_handlers__";Qr[Zr]=Qr[Zr]||{};const vh={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function _h(e={}){const{reactive:t=!1,target:n=Nr,aliasMap:r=vh,passive:s=!0,onEventFired:a=ws}=e,i=en(new Set),o={toJSON(){return{}},current:i},l=t?en(o):o,c=new Set,u=new Set;function h(_,b){_ in l&&(t?l[_]=b:l[_].value=b)}function d(){i.clear();for(const _ of u)h(_,!1)}function g(_,b){var M,W;const y=(M=_.key)==null?void 0:M.toLowerCase(),A=[(W=_.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?i.add(y):i.delete(y));for(const T of A)u.add(T),h(T,b);y==="meta"&&!b?(c.forEach(T=>{i.delete(T),h(T,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&b&&[...i,...A].forEach(T=>c.add(T))}Mt(n,"keydown",_=>(g(_,!0),a(_)),{passive:s}),Mt(n,"keyup",_=>(g(_,!1),a(_)),{passive:s}),Mt("blur",d,{passive:!0}),Mt("focus",d,{passive:!0});const E=new Proxy(l,{get(_,b,M){if(typeof b!="string")return Reflect.get(_,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=V(()=>y.every(L=>v(E[L])))}else l[b]=X(!1);const W=Reflect.get(_,b,M);return t?v(W):W}});return E}var ea;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(ea||(ea={}));var bh=Object.defineProperty,ta=Object.getOwnPropertySymbols,yh=Object.prototype.hasOwnProperty,kh=Object.prototype.propertyIsEnumerable,na=(e,t,n)=>t in e?bh(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,wh=(e,t)=>{for(var n in t||(t={}))yh.call(t,n)&&na(e,n,t[n]);if(ta)for(var n of ta(t))kh.call(t,n)&&na(e,n,t[n]);return e};const Lh={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};wh({linear:mh},Lh);function Eh(e={}){const{window:t=Nr,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:s=!0,includeScrollbar:a=!0}=e,i=X(n),o=X(r),l=()=>{t&&(a?(i.value=t.innerWidth,o.value=t.innerHeight):(i.value=t.document.documentElement.clientWidth,o.value=t.document.documentElement.clientHeight))};return l(),ph(l),Mt("resize",l,{passive:!0}),s&&Mt("orientationchange",l,{passive:!0}),{width:i,height:o}}const Yn=X([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-05-14 03:58:34"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-05-14 03:58:34"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-05-14 03:58:34"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-05-14 03:58:34"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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
| `,title:"r-player",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-05-14 03:58:34"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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
| `,title:"r-player视频播放器",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-05-14 03:58:34"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-05-14 03:58:34"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-05-14 03:58:34"}}]),Sh={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Oh(e,t="yyyy-MM-dd hh:mm:ss"){e instanceof Date||(e=new Date(e));const n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,`${e.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in n)new RegExp(`(${r})`).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length===1?n[r]:`00${n[r]}`.substr(`${n[r]}`.length)));return t}const Ih={},Th={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"},Ch=Mi('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11),Ah=[Ch];function Nh(e,t){return p(),I("svg",Th,Ah)}const Mh=J(Ih,[["render",Nh]]),Mr=e=>(Ae("data-v-e93b2392"),e=e(),Ne(),e),Ph={class:"blog-search","data-pagefind-ignore":"all"},$h=Mr(()=>w("span",null,[w("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[w("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),Rh={class:"search-dialog"},Fh={class:"link"},Dh={class:"title"},xh={key:0,class:"date"},Vh=["innerHTML"],Hh={class:"command-palette-logo"},Uh={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},Bh=Mr(()=>w("span",{class:"command-palette-Label"},"Search by",-1)),Wh=Mr(()=>w("ul",{class:"command-palette-commands"},[w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),w("span",{class:"command-palette-Label"},"to select")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),w("span",{class:"command-palette-Label"},"to navigate")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),w("span",{class:"command-palette-Label"},"to close")])],-1)),jh=H({__name:"Search",setup(e){Pi(x=>({"5b3346c5":c.value}));const t=X([]),n=Sh,{localeIndex:r,site:s}=bn(),a=V(()=>{var x;return{...n,...((x=n==null?void 0:n.locales)==null?void 0:x[r.value])||{}}}),i=V(()=>{var x;return((x=a.value)==null?void 0:x.showDate)??!0}),o=Eh(),l=V(()=>o.width.value<760),c=V(()=>l.value?0:1),u=V(()=>{var x;return(x=a.value)!=null&&x.heading?a.value.heading.replace(/\{\{searchResult\}\}/,t.value.length):`Total: ${t.value.length} search results.`}),h=X("");Ke(()=>{h.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const d=X(!1),g=X(""),E=_h({passive:!1,onEventFired(x){x.ctrlKey&&x.key==="k"&&x.type==="keydown"&&x.preventDefault()}}),_=E["Meta+K"],b=E["Ctrl+K"],M=E.Escape;Le(_,x=>{x&&(d.value=!0)}),Le(b,x=>{x&&(d.value=!0)}),Le(M,x=>{x&&(d.value=!1)});function W(){if(!g.value){t.value=[];return}t.value=Yn.value.filter(x=>`${x.meta.description}${x.meta.title}`.includes(g.value)).map(x=>{var oe,Ee;return{...x,meta:{...x.meta,description:((Ee=(oe=x.meta)==null?void 0:oe.description)==null?void 0:Ee.replace(new RegExp(`(${g.value})`,"g"),"<mark>$1</mark>"))||""}}}),t.value.sort((x,oe)=>+new Date(oe.meta.date)-+new Date(x.meta.date))}const y=V(()=>{var x;return((x=a.value)==null?void 0:x.resultOptimization)??!0});Le(()=>g.value,async()=>{var x,oe,Ee;if(!((x=window==null?void 0:window.__pagefind__)!=null&&x.search))W();else{const Oe=typeof a.value.customSearchQuery=="function"?a.value.customSearchQuery(g.value):g.value;await((Ee=(oe=window==null?void 0:window.__pagefind__)==null?void 0:oe.search)==null?void 0:Ee.call(oe,Oe).then(async _e=>{const et=(await Promise.all(_e.results.map(be=>be.data()))).map(be=>{var we;return{route:be.url.startsWith(s.value.base)?be.url:An(be.url),meta:{title:be.meta.title,description:be.excerpt,date:(we=be==null?void 0:be.meta)==null?void 0:we.date}}}).map(be=>{const we=Yn.value.find(Ue=>Ue.route===be.route);return{...be,meta:{...be.meta,...we==null?void 0:we.meta}}}).filter(be=>!y.value||Yn.value.some(we=>we.route===be.route));t.value=et.filter(a.value.filter??(()=>!0))}))}it(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(Oe=>{Oe.setAttribute("aria-disabled","false")})})});function L(x){x.target===x.currentTarget&&(d.value=!1)}Le(()=>d.value,x=>{var oe;x?it(()=>{var Ee;(Ee=document.querySelector("div[command-dialog-mask]"))==null||Ee.addEventListener("click",L)}):(oe=document.querySelector("div[command-dialog-mask]"))==null||oe.removeEventListener("click",L)});const A=X(999),T=X(0),$=V(()=>{const oe=T.value%Math.ceil(t.value.length/A.value)*A.value;return t.value.slice(oe,oe+A.value)}),D=$i(),R=rn();function de(x){d.value=!1,R.path!==x.value&&D.go(x.value)}const{lang:ke}=bn(),Z=V(()=>a.value.langReload??!0);return Le(()=>ke.value,()=>{Z.value&&window.location.reload()}),(x,oe)=>{var Oe;const Ee=pt("ClientOnly");return p(),I("div",Ph,[w("div",{class:"nav-search-btn-wait",onClick:oe[0]||(oe[0]=_e=>d.value=!0)},[$h,yn(w("span",{class:"search-tip"},re(((Oe=a.value)==null?void 0:Oe.btnPlaceholder)||"Search"),513),[[kn,!l.value]]),yn(w("span",{class:"metaKey"},re(h.value)+" K ",513),[[kn,!l.value]])]),Y(Ee,null,{default:C(()=>[Y(v(Tt).Dialog,{visible:d.value,theme:"algolia"},Ri({header:C(()=>{var _e;return[Y(v(Tt).Input,{value:g.value,"onUpdate:value":oe[1]||(oe[1]=He=>g.value=He),placeholder:((_e=a.value)==null?void 0:_e.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:C(()=>[w("div",Rh,[Y(v(Tt).List,null,{default:C(()=>[t.value.length?(p(),q(v(Tt).Group,{key:1,heading:u.value},{default:C(()=>[(p(!0),I(ge,null,$e($.value,_e=>(p(),q(v(Tt).Item,{key:_e.route,"data-value":_e.route,onSelect:de},{default:C(()=>[w("div",Fh,[w("div",Dh,[w("span",null,re(_e.meta.title),1),i.value&&_e.meta.date?(p(),I("span",xh,re(v(Oh)(_e.meta.date,"yyyy-MM-dd")),1)):G("",!0)]),w("div",{class:"des",innerHTML:_e.meta.description},null,8,Vh)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(p(),q(v(Tt).Empty,{key:0},{default:C(()=>{var _e;return[Qe(re(((_e=a.value)==null?void 0:_e.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[t.value.length?{name:"footer",fn:C(()=>[w("div",Hh,[w("a",Uh,[Bh,Y(Mh,{style:{width:"77px"}})])]),Wh]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),Kh=J(jh,[["__scopeId","data-v-e93b2392"]]),Gh=H({__name:"VPNavBarSocialLinks",setup(e){const{theme:t}=se();return(n,r)=>v(t).socialLinks?(p(),q(Cr,{key:0,class:"VPNavBarSocialLinks",links:v(t).socialLinks},null,8,["links"])):G("",!0)}}),Yh=J(Gh,[["__scopeId","data-v-fd5eee01"]]),zh=["href","rel","target"],Xh={key:1},qh={key:2},Jh=H({__name:"VPNavBarTitle",setup(e){const{site:t,theme:n}=se(),{hasSidebar:r}=lt(),{currentLang:s}=an(),a=V(()=>{var l;return typeof n.value.logoLink=="string"?n.value.logoLink:(l=n.value.logoLink)==null?void 0:l.link}),i=V(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.rel}),o=V(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.target});return(l,c)=>(p(),I("div",{class:fe(["VPNavBarTitle",{"has-sidebar":v(r)}])},[w("a",{class:"title",href:a.value??v(Er)(v(s).link),rel:i.value,target:o.value},[S(l.$slots,"nav-bar-title-before",{},void 0,!0),v(n).logo?(p(),q(Ln,{key:0,class:"logo",image:v(n).logo},null,8,["image"])):G("",!0),v(n).siteTitle?(p(),I("span",Xh,re(v(n).siteTitle),1)):v(n).siteTitle===void 0?(p(),I("span",qh,re(v(t).title),1)):G("",!0),S(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,zh)],2))}}),Qh=J(Jh,[["__scopeId","data-v-4103f1c8"]]),Zh={class:"items"},em={class:"title"},tm=H({__name:"VPNavBarTranslations",setup(e){const{theme:t}=se(),{localeLinks:n,currentLang:r}=an({correspondingLink:!0});return(s,a)=>v(n).length&&v(r).label?(p(),q(Tr,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:v(t).langMenuLabel||"Change language"},{default:C(()=>[w("div",Zh,[w("p",em,re(v(r).label),1),(p(!0),I(ge,null,$e(v(n),i=>(p(),q(Rn,{key:i.link,item:i},null,8,["item"]))),128))])]),_:1},8,["label"])):G("",!0)}}),nm=J(tm,[["__scopeId","data-v-a36b8724"]]),rm=e=>(Ae("data-v-a1054205"),e=e(),Ne(),e),am={class:"wrapper"},sm={class:"container"},im={class:"title"},om={class:"content"},lm={class:"content-body"},cm=rm(()=>w("div",{class:"divider"},[w("div",{class:"divider-line"})],-1)),um=H({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const{y:t}=qa(),{hasSidebar:n}=lt(),{frontmatter:r}=se(),s=X({});return Ya(()=>{s.value={"has-sidebar":n.value,home:r.value.layout==="home",top:t.value===0}}),(a,i)=>(p(),I("div",{class:fe(["VPNavBar",s.value])},[w("div",am,[w("div",sm,[w("div",im,[Y(Qh,null,{"nav-bar-title-before":C(()=>[S(a.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[S(a.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),w("div",om,[w("div",lm,[S(a.$slots,"nav-bar-content-before",{},void 0,!0),Y(Kh,{class:"search"}),Y(Cu,{class:"menu"}),Y(nm,{class:"translations"}),Y(Mc,{class:"appearance"}),Y(Yh,{class:"social-links"}),Y(fu,{class:"extra"}),S(a.$slots,"nav-bar-content-after",{},void 0,!0),Y(yu,{class:"hamburger",active:a.isScreenOpen,onClick:i[0]||(i[0]=o=>a.$emit("toggle-screen"))},null,8,["active"])])])])]),cm],2))}}),dm=J(um,[["__scopeId","data-v-a1054205"]]),hm={key:0,class:"VPNavScreenAppearance"},mm={class:"text"},fm=H({__name:"VPNavScreenAppearance",setup(e){const{site:t,theme:n}=se();return(r,s)=>v(t).appearance&&v(t).appearance!=="force-dark"?(p(),I("div",hm,[w("p",mm,re(v(n).darkModeSwitchLabel||"Appearance"),1),Y(Or)])):G("",!0)}}),pm=J(fm,[["__scopeId","data-v-735b8858"]]),gm=H({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(p(),q(Xe,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:v(t),innerHTML:n.item.text},null,8,["href","target","rel","onClick","innerHTML"]))}}),vm=J(gm,[["__scopeId","data-v-4fa446b1"]]),_m=H({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(p(),q(Xe,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:v(t)},{default:C(()=>[Qe(re(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),Es=J(_m,[["__scopeId","data-v-249acb55"]]),bm={class:"VPNavScreenMenuGroupSection"},ym={key:0,class:"title"},km=H({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(t,n)=>(p(),I("div",bm,[t.text?(p(),I("p",ym,re(t.text),1)):G("",!0),(p(!0),I(ge,null,$e(t.items,r=>(p(),q(Es,{key:r.text,item:r},null,8,["item"]))),128))]))}}),wm=J(km,[["__scopeId","data-v-51fa1251"]]),Lm=e=>(Ae("data-v-4f1212a8"),e=e(),Ne(),e),Em=["aria-controls","aria-expanded"],Sm=["innerHTML"],Om=Lm(()=>w("span",{class:"vpi-plus button-icon"},null,-1)),Im=["id"],Tm={key:1,class:"group"},Cm=H({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const t=e,n=X(!1),r=V(()=>`NavScreenGroup-${t.text.replace(" ","-").toLowerCase()}`);function s(){n.value=!n.value}return(a,i)=>(p(),I("div",{class:fe(["VPNavScreenMenuGroup",{open:n.value}])},[w("button",{class:"button","aria-controls":r.value,"aria-expanded":n.value,onClick:s},[w("span",{class:"button-text",innerHTML:a.text},null,8,Sm),Om],8,Em),w("div",{id:r.value,class:"items"},[(p(!0),I(ge,null,$e(a.items,o=>(p(),I(ge,{key:o.text},["link"in o?(p(),I("div",{key:o.text,class:"item"},[Y(Es,{item:o},null,8,["item"])])):(p(),I("div",Tm,[Y(wm,{text:o.text,items:o.items},null,8,["text","items"])]))],64))),128))],8,Im)],2))}}),Am=J(Cm,[["__scopeId","data-v-4f1212a8"]]),Nm={key:0,class:"VPNavScreenMenu"},Mm=H({__name:"VPNavScreenMenu",setup(e){const{theme:t}=se();return(n,r)=>v(t).nav?(p(),I("nav",Nm,[(p(!0),I(ge,null,$e(v(t).nav,s=>(p(),I(ge,{key:s.text},["link"in s?(p(),q(vm,{key:0,item:s},null,8,["item"])):(p(),q(Am,{key:1,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):G("",!0)}}),Pm=H({__name:"VPNavScreenSocialLinks",setup(e){const{theme:t}=se();return(n,r)=>v(t).socialLinks?(p(),q(Cr,{key:0,class:"VPNavScreenSocialLinks",links:v(t).socialLinks},null,8,["links"])):G("",!0)}}),Ss=e=>(Ae("data-v-73fb048d"),e=e(),Ne(),e),$m=Ss(()=>w("span",{class:"vpi-languages icon lang"},null,-1)),Rm=Ss(()=>w("span",{class:"vpi-chevron-down icon chevron"},null,-1)),Fm={class:"list"},Dm=H({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:t,currentLang:n}=an({correspondingLink:!0}),r=X(!1);function s(){r.value=!r.value}return(a,i)=>v(t).length&&v(n).label?(p(),I("div",{key:0,class:fe(["VPNavScreenTranslations",{open:r.value}])},[w("button",{class:"title",onClick:s},[$m,Qe(" "+re(v(n).label)+" ",1),Rm]),w("ul",Fm,[(p(!0),I(ge,null,$e(v(t),o=>(p(),I("li",{key:o.link,class:"item"},[Y(Xe,{class:"link",href:o.link},{default:C(()=>[Qe(re(o.text),1)]),_:2},1032,["href"])]))),128))])],2)):G("",!0)}}),xm=J(Dm,[["__scopeId","data-v-73fb048d"]]),Vm={class:"container"},Hm=H({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const t=X(null),n=Za($n?document.body:null);return(r,s)=>(p(),q(Cn,{name:"fade",onEnter:s[0]||(s[0]=a=>n.value=!0),onAfterLeave:s[1]||(s[1]=a=>n.value=!1)},{default:C(()=>[r.open?(p(),I("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:t,id:"VPNavScreen"},[w("div",Vm,[S(r.$slots,"nav-screen-content-before",{},void 0,!0),Y(Mm,{class:"menu"}),Y(xm,{class:"translations"}),Y(pm,{class:"appearance"}),Y(Pm,{class:"social-links"}),S(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):G("",!0)]),_:3}))}}),Um=J(Hm,[["__scopeId","data-v-cef80ea0"]]),Bm={key:0,class:"VPNav"},Wm=H({__name:"VPNav",setup(e){const{isScreenOpen:t,closeScreen:n,toggleScreen:r}=yc(),{frontmatter:s}=se(),a=V(()=>s.value.navbar!==!1);return wr("close-screen",n),ft(()=>{$n&&document.documentElement.classList.toggle("hide-nav",!a.value)}),(i,o)=>a.value?(p(),I("header",Bm,[Y(dm,{"is-screen-open":v(t),onToggleScreen:v(r)},{"nav-bar-title-before":C(()=>[S(i.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[S(i.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":C(()=>[S(i.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":C(()=>[S(i.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),Y(Um,{open:v(t)},{"nav-screen-content-before":C(()=>[S(i.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":C(()=>[S(i.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):G("",!0)}}),jm=J(Wm,[["__scopeId","data-v-e4dfd592"]]),Os=e=>(Ae("data-v-2e393b64"),e=e(),Ne(),e),Km=["role","tabindex"],Gm=Os(()=>w("div",{class:"indicator"},null,-1)),Ym=Os(()=>w("span",{class:"vpi-chevron-right caret-icon"},null,-1)),zm=[Ym],Xm={key:1,class:"items"},qm=H({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const t=e,{collapsed:n,collapsible:r,isLink:s,isActiveLink:a,hasActiveLink:i,hasChildren:o,toggle:l}=uo(V(()=>t.item)),c=V(()=>o.value?"section":"div"),u=V(()=>s.value?"a":"div"),h=V(()=>o.value?t.depth+2===7?"p":`h${t.depth+2}`:"p"),d=V(()=>s.value?void 0:"button"),g=V(()=>[[`level-${t.depth}`],{collapsible:r.value},{collapsed:n.value},{"is-link":s.value},{"is-active":a.value},{"has-active":i.value}]);function E(b){"key"in b&&b.key!=="Enter"||!t.item.link&&l()}function _(){t.item.link&&l()}return(b,M)=>{const W=pt("VPSidebarItem",!0);return p(),q($t(c.value),{class:fe(["VPSidebarItem",g.value])},{default:C(()=>[b.item.text?(p(),I("div",fn({key:0,class:"item",role:d.value},Fi(b.item.items?{click:E,keydown:E}:{},!0),{tabindex:b.item.items&&0}),[Gm,b.item.link?(p(),q(Xe,{key:0,tag:u.value,class:"link",href:b.item.link,rel:b.item.rel,target:b.item.target},{default:C(()=>[(p(),q($t(h.value),{class:"text",innerHTML:b.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(p(),q($t(h.value),{key:1,class:"text",innerHTML:b.item.text},null,8,["innerHTML"])),b.item.collapsed!=null&&b.item.items&&b.item.items.length?(p(),I("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:Di(_,["enter"]),tabindex:"0"},zm,32)):G("",!0)],16,Km)):G("",!0),b.item.items&&b.item.items.length?(p(),I("div",Xm,[b.depth<5?(p(!0),I(ge,{key:0},$e(b.item.items,y=>(p(),q(W,{key:y.text,item:y,depth:b.depth+1},null,8,["item","depth"]))),128)):G("",!0)])):G("",!0)]),_:1},8,["class"])}}}),Jm=J(qm,[["__scopeId","data-v-2e393b64"]]),Is=e=>(Ae("data-v-3369626d"),e=e(),Ne(),e),Qm=Is(()=>w("div",{class:"curtain"},null,-1)),Zm={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},ef=Is(()=>w("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),tf=H({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:t,hasSidebar:n}=lt(),r=e,s=X(null),a=Za($n?document.body:null);return Le([r,s],()=>{var i;r.open?(a.value=!0,(i=s.value)==null||i.focus()):a.value=!1},{immediate:!0,flush:"post"}),(i,o)=>v(n)?(p(),I("aside",{key:0,class:fe(["VPSidebar",{open:i.open}]),ref_key:"navEl",ref:s,onClick:o[0]||(o[0]=xi(()=>{},["stop"]))},[Qm,w("nav",Zm,[ef,S(i.$slots,"sidebar-nav-before",{},void 0,!0),(p(!0),I(ge,null,$e(v(t),l=>(p(),I("div",{key:l.text,class:"group"},[Y(Jm,{item:l,depth:0},null,8,["item"])]))),128)),S(i.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):G("",!0)}}),nf=J(tf,[["__scopeId","data-v-3369626d"]]),rf=H({__name:"VPSkipLink",setup(e){const t=rn(),n=X();Le(()=>t.path,()=>n.value.focus());function r({target:s}){const a=document.getElementById(decodeURIComponent(s.hash).slice(1));if(a){const i=()=>{a.removeAttribute("tabindex"),a.removeEventListener("blur",i)};a.setAttribute("tabindex","-1"),a.addEventListener("blur",i),a.focus(),window.scrollTo(0,0)}}return(s,a)=>(p(),I(ge,null,[w("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),w("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),af=J(rf,[["__scopeId","data-v-dd68a2ee"]]),sf=H({__name:"Layout",setup(e){const{isOpen:t,open:n,close:r}=lt(),s=rn();Le(()=>s.path,r),co(t,r);const{frontmatter:a}=se(),i=Vi(),o=V(()=>!!i["home-hero-image"]);return wr("hero-image-slot-exists",o),(l,c)=>{const u=pt("Content");return v(a).layout!==!1?(p(),I("div",{key:0,class:fe(["Layout",v(a).pageClass])},[S(l.$slots,"layout-top",{},void 0,!0),Y(af),Y(zi,{class:"backdrop",show:v(t),onClick:v(r)},null,8,["show","onClick"]),Y(jm,null,{"nav-bar-title-before":C(()=>[S(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":C(()=>[S(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":C(()=>[S(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":C(()=>[S(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":C(()=>[S(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":C(()=>[S(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),Y(bc,{open:v(t),onOpenMenu:v(n)},null,8,["open","onOpenMenu"]),Y(nf,{open:v(t)},{"sidebar-nav-before":C(()=>[S(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":C(()=>[S(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),Y(Zl,{"data-pagefind-body":""},{"page-top":C(()=>[S(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":C(()=>[S(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":C(()=>[S(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":C(()=>[S(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":C(()=>[S(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":C(()=>[S(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":C(()=>[S(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":C(()=>[S(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":C(()=>[S(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":C(()=>[S(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":C(()=>[S(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":C(()=>[S(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":C(()=>[S(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":C(()=>[S(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":C(()=>[S(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":C(()=>[S(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":C(()=>[S(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":C(()=>[S(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":C(()=>[S(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":C(()=>[S(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":C(()=>[S(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":C(()=>[S(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":C(()=>[S(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),Y(ac),S(l.$slots,"layout-bottom",{},void 0,!0)],2)):(p(),q(u,{key:1}))}}}),of=J(sf,[["__scopeId","data-v-0d99ae77"]]),Ts={Layout:of,enhanceApp:({app:e})=>{e.component("Badge",Ki)}};var lf=Object.defineProperty,cf=(e,t,n)=>t in e?lf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,B=(e,t,n)=>(cf(e,typeof t!="symbol"?t+"":t,n),n),Cs=(e=>(e.IPAD="ipad",e.ANDROID="android",e.IPhONE="iphone",e.PC="pc",e))(Cs||{});const As=()=>{if(typeof window<"u"){const e=navigator.userAgent.toLowerCase();return/ipad|ipod/.test(e)?"ipad":/android/.test(e)?"android":/iphone/.test(e)?"iphone":"pc"}return"pc"},sn=typeof window<"u",uf=()=>sn?window.navigator.userAgent.toLowerCase().includes("micromessenger"):!1,df=()=>{if(!sn)return!1;const e=window.navigator.userAgent;return!!/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(e)},hf=()=>{if(!sn)return!1;const e=/iphone/i.test(window.navigator.userAgent),t=window.devicePixelRatio&&window.devicePixelRatio===2,n=window.devicePixelRatio&&window.devicePixelRatio===3,r=window.screen.width===360&&window.screen.height===780,s=window.screen.width===375&&window.screen.height===812,a=window.screen.width===390&&window.screen.height===844,i=window.screen.width===414&&window.screen.height===896,o=window.screen.width===428&&window.screen.height===926;switch(!0){case(e&&n&&r):case(e&&n&&s):case(e&&n&&a):case(e&&t&&i):case(e&&n&&i):case(e&&n&&o):return!0;default:return!1}},Ns="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ms="ARRAYBUFFER not supported by this environment",Ps="UINT8ARRAY not supported by this environment";function mf(e,t,n,r,s){let a,i,o=0,l,c,u,h,d,g;r=r||0;const E=n||[0],_=r>>>3;if(t==="UTF8")for(d=s===-1?3:0,l=0;l<e.length;l+=1)for(a=e.charCodeAt(l),i=[],128>a?i.push(a):2048>a?(i.push(192|a>>>6),i.push(128|a&63)):55296>a||57344<=a?i.push(224|a>>>12,128|a>>>6&63,128|a&63):(l+=1,a=65536+((a&1023)<<10|e.charCodeAt(l)&1023),i.push(240|a>>>18,128|a>>>12&63,128|a>>>6&63,128|a&63)),c=0;c<i.length;c+=1){for(h=o+_,u=h>>>2;E.length<=u;)E.push(0);E[u]|=i[c]<<8*(d+s*(h%4)),o+=1}else for(d=s===-1?2:0,g=t==="UTF16LE"&&s!==1||t!=="UTF16LE"&&s===1,l=0;l<e.length;l+=1){for(a=e.charCodeAt(l),g===!0&&(c=a&255,a=c<<8|a>>>8),h=o+_,u=h>>>2;E.length<=u;)E.push(0);E[u]|=a<<8*(d+s*(h%4)),o+=2}return{value:E,binLen:o*8+r}}function ff(e,t,n,r){let s,a,i,o;if(e.length%2!==0)throw new Error("String of HEX type must be in byte increments");n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(s=0;s<e.length;s+=2){if(a=parseInt(e.substr(s,2),16),isNaN(a))throw new Error("String of HEX type contains invalid characters");for(o=(s>>>1)+c,i=o>>>2;l.length<=i;)l.push(0);l[i]|=a<<8*(u+r*(o%4))}return{value:l,binLen:e.length*4+n}}function pf(e,t,n,r){let s,a,i,o;n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(a=0;a<e.length;a+=1)s=e.charCodeAt(a),o=a+c,i=o>>>2,l.length<=i&&l.push(0),l[i]|=s<<8*(u+r*(o%4));return{value:l,binLen:e.length*8+n}}function gf(e,t,n,r){let s=0,a,i,o,l,c,u,h;n=n||0;const d=t||[0],g=n>>>3,E=r===-1?3:0,_=e.indexOf("=");if(e.search(/^[a-z\d=+/]+$/i)===-1)throw new Error("Invalid character in base-64 string");if(e=e.replace(/=/g,""),_!==-1&&_<e.length)throw new Error("Invalid '=' found in base-64 string");for(i=0;i<e.length;i+=4){for(c=e.substr(i,4),l=0,o=0;o<c.length;o+=1)a=Ns.indexOf(c.charAt(o)),l|=a<<18-6*o;for(o=0;o<c.length-1;o+=1){for(h=s+g,u=h>>>2;d.length<=u;)d.push(0);d[u]|=(l>>>16-o*8&255)<<8*(E+r*(h%4)),s+=1}}return{value:d,binLen:s*8+n}}function $s(e,t,n,r){let s,a,i;n=n||0;const o=t||[0],l=n>>>3,c=r===-1?3:0;for(s=0;s<e.length;s+=1)i=s+l,a=i>>>2,o.length<=a&&o.push(0),o[a]|=e[s]<<8*(c+r*(i%4));return{value:o,binLen:e.length*8+n}}function vf(e,t,n,r){return $s(new Uint8Array(e),t,n,r)}function jt(e,t,n){switch(t){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(e){case"HEX":return function(r,s,a){return ff(r,s,a,n)};case"TEXT":return function(r,s,a){return mf(r,t,s,a,n)};case"B64":return function(r,s,a){return gf(r,s,a,n)};case"BYTES":return function(r,s,a){return pf(r,s,a,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ms)}return function(r,s,a){return vf(r,s,a,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Ps)}return function(r,s,a){return $s(r,s,a,n)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function _f(e,t,n,r){const s="0123456789abcdef";let a="",i,o;const l=t/8,c=n===-1?3:0;for(i=0;i<l;i+=1)o=e[i>>>2]>>>8*(c+n*(i%4)),a+=s.charAt(o>>>4&15)+s.charAt(o&15);return r.outputUpper?a.toUpperCase():a}function bf(e,t,n,r){let s="",a,i,o,l,c;const u=t/8,h=n===-1?3:0;for(a=0;a<u;a+=3)for(l=a+1<u?e[a+1>>>2]:0,c=a+2<u?e[a+2>>>2]:0,o=(e[a>>>2]>>>8*(h+n*(a%4))&255)<<16|(l>>>8*(h+n*((a+1)%4))&255)<<8|c>>>8*(h+n*((a+2)%4))&255,i=0;i<4;i+=1)a*8+i*6<=t?s+=Ns.charAt(o>>>6*(3-i)&63):s+=r.b64Pad;return s}function yf(e,t,n){let r="",s,a;const i=t/8,o=n===-1?3:0;for(s=0;s<i;s+=1)a=e[s>>>2]>>>8*(o+n*(s%4))&255,r+=String.fromCharCode(a);return r}function kf(e,t,n){let r;const s=t/8,a=new ArrayBuffer(s),i=new Uint8Array(a),o=n===-1?3:0;for(r=0;r<s;r+=1)i[r]=e[r>>>2]>>>8*(o+n*(r%4))&255;return a}function wf(e,t,n){let r;const s=t/8,a=n===-1?3:0,i=new Uint8Array(s);for(r=0;r<s;r+=1)i[r]=e[r>>>2]>>>8*(a+n*(r%4))&255;return i}function ra(e,t,n,r){switch(e){case"HEX":return function(s){return _f(s,t,n,r)};case"B64":return function(s){return bf(s,t,n,r)};case"BYTES":return function(s){return yf(s,t,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ms)}return function(s){return kf(s,t,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Ps)}return function(s){return wf(s,t,n)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}const on=4294967296,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],rt=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],at=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],ln="Chosen SHA variant is not supported",Rs="Cannot set numRounds with MAC";function Sn(e,t){let n,r;const s=e.binLen>>>3,a=t.binLen>>>3,i=s<<3,o=4-s<<3;if(s%4!==0){for(n=0;n<a;n+=4)r=s+n>>>2,e.value[r]|=t.value[n>>>2]<<i,e.value.push(0),e.value[r+1]|=t.value[n>>>2]>>>o;return(e.value.length<<2)-4>=a+s&&e.value.pop(),{value:e.value,binLen:e.binLen+t.binLen}}else return{value:e.value.concat(t.value),binLen:e.binLen+t.binLen}}function aa(e){const t={outputUpper:!1,b64Pad:"=",outputLen:-1},n=e||{},r="Output length must be a multiple of 8";if(t.outputUpper=n.outputUpper||!1,n.b64Pad&&(t.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!==0)throw new Error(r);t.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!==0)throw new Error(r);t.outputLen=n.shakeLen}if(typeof t.outputUpper!="boolean")throw new Error("Invalid outputUpper formatting option");if(typeof t.b64Pad!="string")throw new Error("Invalid b64Pad formatting option");return t}function ht(e,t,n,r){const s=e+" must include a value and format";if(!t){if(!r)throw new Error(s);return r}if(typeof t.value>"u"||!t.format)throw new Error(s);return jt(t.format,t.encoding||"UTF8",n)(t.value)}class Dn{constructor(t,n,r){B(this,"shaVariant"),B(this,"inputFormat"),B(this,"utfType"),B(this,"numRounds"),B(this,"keyWithIPad"),B(this,"keyWithOPad"),B(this,"remainder"),B(this,"remainderLen"),B(this,"updateCalled"),B(this,"processedLen"),B(this,"macKeySet");const s=r||{};if(this.inputFormat=n,this.utfType=s.encoding||"UTF8",this.numRounds=s.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.shaVariant=t,this.remainder=[],this.remainderLen=0,this.updateCalled=!1,this.processedLen=0,this.macKeySet=!1,this.keyWithIPad=[],this.keyWithOPad=[]}update(t){let n,r=0;const s=this.variantBlockSize>>>5,a=this.converterFunc(t,this.remainder,this.remainderLen),i=a.binLen,o=a.value,l=i>>>5;for(n=0;n<l;n+=s)r+this.variantBlockSize<=i&&(this.intermediateState=this.roundFunc(o.slice(n,n+s),this.intermediateState),r+=this.variantBlockSize);return this.processedLen+=r,this.remainder=o.slice(r>>>5),this.remainderLen=i%this.variantBlockSize,this.updateCalled=!0,this}getHash(t,n){let r,s,a=this.outputBinLen;const i=aa(n);if(this.isVariableLen){if(i.outputLen===-1)throw new Error("Output length must be specified in options");a=i.outputLen}const o=ra(t,a,this.bigEndianMod,i);if(this.macKeySet&&this.getMAC)return o(this.getMAC(i));for(s=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),a),r=1;r<this.numRounds;r+=1)this.isVariableLen&&a%32!==0&&(s[s.length-1]&=16777215>>>24-a%32),s=this.finalizeFunc(s,a,0,this.newStateFunc(this.shaVariant),a);return o(s)}setHMACKey(t,n,r){if(!this.HMACSupported)throw new Error("Variant does not support HMAC");if(this.updateCalled)throw new Error("Cannot set MAC key after calling update");const s=r||{},a=jt(n,s.encoding||"UTF8",this.bigEndianMod);this._setHMACKey(a(t))}_setHMACKey(t){const n=this.variantBlockSize>>>3,r=n/4-1;let s;if(this.numRounds!==1)throw new Error(Rs);if(this.macKeySet)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.finalizeFunc(t.value,t.binLen,0,this.newStateFunc(this.shaVariant),this.outputBinLen));t.value.length<=r;)t.value.push(0);for(s=0;s<=r;s+=1)this.keyWithIPad[s]=t.value[s]^909522486,this.keyWithOPad[s]=t.value[s]^1549556828;this.intermediateState=this.roundFunc(this.keyWithIPad,this.intermediateState),this.processedLen=this.variantBlockSize,this.macKeySet=!0}getHMAC(t,n){const r=aa(n);return ra(t,this.outputBinLen,this.bigEndianMod,r)(this._getHMAC())}_getHMAC(){let t;if(!this.macKeySet)throw new Error("Cannot call getHMAC without first setting MAC key");const n=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),this.outputBinLen);return t=this.roundFunc(this.keyWithOPad,this.newStateFunc(this.shaVariant)),t=this.finalizeFunc(n,this.outputBinLen,this.variantBlockSize,t,this.outputBinLen),t}}function Ct(e,t){return e<<t|e>>>32-t}function qe(e,t){return e>>>t|e<<32-t}function Fs(e,t){return e>>>t}function sa(e,t,n){return e^t^n}function Ds(e,t,n){return e&t^~e&n}function xs(e,t,n){return e&t^e&n^t&n}function Lf(e){return qe(e,2)^qe(e,13)^qe(e,22)}function Pe(e,t){const n=(e&65535)+(t&65535);return((e>>>16)+(t>>>16)+(n>>>16)&65535)<<16|n&65535}function Ef(e,t,n,r){const s=(e&65535)+(t&65535)+(n&65535)+(r&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)&65535)<<16|s&65535}function Zt(e,t,n,r,s){const a=(e&65535)+(t&65535)+(n&65535)+(r&65535)+(s&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(s>>>16)+(a>>>16)&65535)<<16|a&65535}function Sf(e){return qe(e,17)^qe(e,19)^Fs(e,10)}function Of(e){return qe(e,7)^qe(e,18)^Fs(e,3)}function If(e){return qe(e,6)^qe(e,11)^qe(e,25)}function ia(e){return[1732584193,4023233417,2562383102,271733878,3285377520]}function Vs(e,t){let n,r,s,a,i,o,l;const c=[];for(n=t[0],r=t[1],s=t[2],a=t[3],i=t[4],l=0;l<80;l+=1)l<16?c[l]=e[l]:c[l]=Ct(c[l-3]^c[l-8]^c[l-14]^c[l-16],1),l<20?o=Zt(Ct(n,5),Ds(r,s,a),i,1518500249,c[l]):l<40?o=Zt(Ct(n,5),sa(r,s,a),i,1859775393,c[l]):l<60?o=Zt(Ct(n,5),xs(r,s,a),i,2400959708,c[l]):o=Zt(Ct(n,5),sa(r,s,a),i,3395469782,c[l]),i=a,a=s,s=Ct(r,30),r=n,n=o;return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(s,t[2]),t[3]=Pe(a,t[3]),t[4]=Pe(i,t[4]),t}function Tf(e,t,n,r){let s;const a=(t+65>>>9<<4)+15,i=t+n;for(;e.length<=a;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[a]=i&4294967295,e[a-1]=i/on|0,s=0;s<e.length;s+=16)r=Vs(e.slice(s,s+16),r);return r}let Cf=class extends Dn{constructor(t,n,r){if(t!=="SHA-1")throw new Error(ln);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.HMACSupported=!0,this.getMAC=this._getHMAC,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Vs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=ia,this.finalizeFunc=Tf,this.intermediateState=ia(),this.variantBlockSize=512,this.outputBinLen=160,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ht("hmacKey",s.hmacKey,this.bigEndianMod))}};function oa(e){let t;return e=="SHA-224"?t=rt.slice():t=at.slice(),t}function Hs(e,t){let n,r,s,a,i,o,l,c,u,h,d;const g=[];for(n=t[0],r=t[1],s=t[2],a=t[3],i=t[4],o=t[5],l=t[6],c=t[7],d=0;d<64;d+=1)d<16?g[d]=e[d]:g[d]=Ef(Sf(g[d-2]),g[d-7],Of(g[d-15]),g[d-16]),u=Zt(c,If(i),Ds(i,o,l),K[d],g[d]),h=Pe(Lf(n),xs(n,r,s)),c=l,l=o,o=i,i=Pe(a,u),a=s,s=r,r=n,n=Pe(u,h);return t[0]=Pe(n,t[0]),t[1]=Pe(r,t[1]),t[2]=Pe(s,t[2]),t[3]=Pe(a,t[3]),t[4]=Pe(i,t[4]),t[5]=Pe(o,t[5]),t[6]=Pe(l,t[6]),t[7]=Pe(c,t[7]),t}function Af(e,t,n,r,s){let a,i;const o=(t+65>>>9<<4)+15,l=16,c=t+n;for(;e.length<=o;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[o]=c&4294967295,e[o-1]=c/on|0,a=0;a<e.length;a+=l)r=Hs(e.slice(a,a+l),r);return s==="SHA-224"?i=[r[0],r[1],r[2],r[3],r[4],r[5],r[6]]:i=r,i}let Nf=class extends Dn{constructor(t,n,r){if(!(t==="SHA-224"||t==="SHA-256"))throw new Error(ln);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Hs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=oa,this.finalizeFunc=function(a,i,o,l){return Af(a,i,o,l,t)},this.intermediateState=oa(t),this.variantBlockSize=512,this.outputBinLen=t==="SHA-224"?224:256,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ht("hmacKey",s.hmacKey,this.bigEndianMod))}};class k{constructor(t,n){B(this,"highOrder"),B(this,"lowOrder"),this.highOrder=t,this.lowOrder=n}}function la(e,t){let n;return t>32?(n=64-t,new k(e.lowOrder<<t|e.highOrder>>>n,e.highOrder<<t|e.lowOrder>>>n)):t!==0?(n=32-t,new k(e.highOrder<<t|e.lowOrder>>>n,e.lowOrder<<t|e.highOrder>>>n)):e}function Je(e,t){let n;return t<32?(n=32-t,new k(e.highOrder>>>t|e.lowOrder<<n,e.lowOrder>>>t|e.highOrder<<n)):(n=64-t,new k(e.lowOrder>>>t|e.highOrder<<n,e.highOrder>>>t|e.lowOrder<<n))}function Us(e,t){return new k(e.highOrder>>>t,e.lowOrder>>>t|e.highOrder<<32-t)}function Mf(e,t,n){return new k(e.highOrder&t.highOrder^~e.highOrder&n.highOrder,e.lowOrder&t.lowOrder^~e.lowOrder&n.lowOrder)}function Pf(e,t,n){return new k(e.highOrder&t.highOrder^e.highOrder&n.highOrder^t.highOrder&n.highOrder,e.lowOrder&t.lowOrder^e.lowOrder&n.lowOrder^t.lowOrder&n.lowOrder)}function $f(e){const t=Je(e,28),n=Je(e,34),r=Je(e,39);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Be(e,t){let n,r;n=(e.lowOrder&65535)+(t.lowOrder&65535),r=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n>>>16);const s=(r&65535)<<16|n&65535;n=(e.highOrder&65535)+(t.highOrder&65535)+(r>>>16),r=(e.highOrder>>>16)+(t.highOrder>>>16)+(n>>>16);const a=(r&65535)<<16|n&65535;return new k(a,s)}function Rf(e,t,n,r){let s,a;s=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535),a=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s>>>16);const i=(a&65535)<<16|s&65535;s=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(a>>>16),a=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s>>>16);const o=(a&65535)<<16|s&65535;return new k(o,i)}function Ff(e,t,n,r,s){let a,i;a=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535)+(s.lowOrder&65535),i=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(s.lowOrder>>>16)+(a>>>16);const o=(i&65535)<<16|a&65535;a=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(s.highOrder&65535)+(i>>>16),i=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(s.highOrder>>>16)+(a>>>16);const l=(i&65535)<<16|a&65535;return new k(l,o)}function qt(e,t){return new k(e.highOrder^t.highOrder,e.lowOrder^t.lowOrder)}function Df(e,t,n,r,s){return new k(e.highOrder^t.highOrder^n.highOrder^r.highOrder^s.highOrder,e.lowOrder^t.lowOrder^n.lowOrder^r.lowOrder^s.lowOrder)}function xf(e){const t=Je(e,19),n=Je(e,61),r=Us(e,6);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Vf(e){const t=Je(e,1),n=Je(e,8),r=Us(e,7);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Hf(e){const t=Je(e,14),n=Je(e,18),r=Je(e,41);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}const Uf=[new k(K[0],3609767458),new k(K[1],602891725),new k(K[2],3964484399),new k(K[3],2173295548),new k(K[4],4081628472),new k(K[5],3053834265),new k(K[6],2937671579),new k(K[7],3664609560),new k(K[8],2734883394),new k(K[9],1164996542),new k(K[10],1323610764),new k(K[11],3590304994),new k(K[12],4068182383),new k(K[13],991336113),new k(K[14],633803317),new k(K[15],3479774868),new k(K[16],2666613458),new k(K[17],944711139),new k(K[18],2341262773),new k(K[19],2007800933),new k(K[20],1495990901),new k(K[21],1856431235),new k(K[22],3175218132),new k(K[23],2198950837),new k(K[24],3999719339),new k(K[25],766784016),new k(K[26],2566594879),new k(K[27],3203337956),new k(K[28],1034457026),new k(K[29],2466948901),new k(K[30],3758326383),new k(K[31],168717936),new k(K[32],1188179964),new k(K[33],1546045734),new k(K[34],1522805485),new k(K[35],2643833823),new k(K[36],2343527390),new k(K[37],1014477480),new k(K[38],1206759142),new k(K[39],344077627),new k(K[40],1290863460),new k(K[41],3158454273),new k(K[42],3505952657),new k(K[43],106217008),new k(K[44],3606008344),new k(K[45],1432725776),new k(K[46],1467031594),new k(K[47],851169720),new k(K[48],3100823752),new k(K[49],1363258195),new k(K[50],3750685593),new k(K[51],3785050280),new k(K[52],3318307427),new k(K[53],3812723403),new k(K[54],2003034995),new k(K[55],3602036899),new k(K[56],1575990012),new k(K[57],1125592928),new k(K[58],2716904306),new k(K[59],442776044),new k(K[60],593698344),new k(K[61],3733110249),new k(K[62],2999351573),new k(K[63],3815920427),new k(3391569614,3928383900),new k(3515267271,566280711),new k(3940187606,3454069534),new k(4118630271,4000239992),new k(116418474,1914138554),new k(174292421,2731055270),new k(289380356,3203993006),new k(460393269,320620315),new k(685471733,587496836),new k(852142971,1086792851),new k(1017036298,365543100),new k(1126000580,2618297676),new k(1288033470,3409855158),new k(1501505948,4234509866),new k(1607167915,987167468),new k(1816402316,1246189591)];function ca(e){return e==="SHA-384"?[new k(3418070365,rt[0]),new k(1654270250,rt[1]),new k(2438529370,rt[2]),new k(355462360,rt[3]),new k(1731405415,rt[4]),new k(41048885895,rt[5]),new k(3675008525,rt[6]),new k(1203062813,rt[7])]:[new k(at[0],4089235720),new k(at[1],2227873595),new k(at[2],4271175723),new k(at[3],1595750129),new k(at[4],2917565137),new k(at[5],725511199),new k(at[6],4215389547),new k(at[7],327033209)]}function Bs(e,t){let n,r,s,a,i,o,l,c,u,h,d,g;const E=[];for(n=t[0],r=t[1],s=t[2],a=t[3],i=t[4],o=t[5],l=t[6],c=t[7],d=0;d<80;d+=1)d<16?(g=d*2,E[d]=new k(e[g],e[g+1])):E[d]=Rf(xf(E[d-2]),E[d-7],Vf(E[d-15]),E[d-16]),u=Ff(c,Hf(i),Mf(i,o,l),Uf[d],E[d]),h=Be($f(n),Pf(n,r,s)),c=l,l=o,o=i,i=Be(a,u),a=s,s=r,r=n,n=Be(u,h);return t[0]=Be(n,t[0]),t[1]=Be(r,t[1]),t[2]=Be(s,t[2]),t[3]=Be(a,t[3]),t[4]=Be(i,t[4]),t[5]=Be(o,t[5]),t[6]=Be(l,t[6]),t[7]=Be(c,t[7]),t}function Bf(e,t,n,r,s){let a,i;const o=(t+129>>>10<<5)+31,l=32,c=t+n;for(;e.length<=o;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[o]=c&4294967295,e[o-1]=c/on|0,a=0;a<e.length;a+=l)r=Bs(e.slice(a,a+l),r);return s==="SHA-384"?(r=r,i=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder]):i=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder,r[6].highOrder,r[6].lowOrder,r[7].highOrder,r[7].lowOrder],i}let Wf=class extends Dn{constructor(t,n,r){if(!(t==="SHA-384"||t==="SHA-512"))throw new Error(ln);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const s=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Bs,this.stateCloneFunc=function(a){return a.slice()},this.newStateFunc=ca,this.finalizeFunc=function(a,i,o,l){return Bf(a,i,o,l,t)},this.intermediateState=ca(t),this.variantBlockSize=1024,this.outputBinLen=t==="SHA-384"?384:512,this.isVariableLen=!1,s.hmacKey&&this._setHMACKey(ht("hmacKey",s.hmacKey,this.bigEndianMod))}};const jf=[new k(0,1),new k(0,32898),new k(2147483648,32906),new k(2147483648,2147516416),new k(0,32907),new k(0,2147483649),new k(2147483648,2147516545),new k(2147483648,32777),new k(0,138),new k(0,136),new k(0,2147516425),new k(0,2147483658),new k(0,2147516555),new k(2147483648,139),new k(2147483648,32905),new k(2147483648,32771),new k(2147483648,32770),new k(2147483648,128),new k(0,32778),new k(2147483648,2147483658),new k(2147483648,2147516545),new k(2147483648,32896),new k(0,2147483649),new k(2147483648,2147516424)],Kf=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function dr(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=[new k(0,0),new k(0,0),new k(0,0),new k(0,0),new k(0,0)];return n}function Gf(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=e[t].slice();return n}function vn(e,t){let n,r,s,a;const i=[],o=[];if(e!==null)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=qt(t[(r>>>1)%5][(r>>>1)/5|0],new k(e[r+1],e[r]));for(n=0;n<24;n+=1){for(a=dr(),r=0;r<5;r+=1)i[r]=Df(t[r][0],t[r][1],t[r][2],t[r][3],t[r][4]);for(r=0;r<5;r+=1)o[r]=qt(i[(r+4)%5],la(i[(r+1)%5],1));for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=qt(t[r][s],o[r]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)a[s][(2*r+3*s)%5]=la(t[r][s],Kf[r][s]);for(r=0;r<5;r+=1)for(s=0;s<5;s+=1)t[r][s]=qt(a[r][s],new k(~a[(r+1)%5][s].highOrder&a[(r+2)%5][s].highOrder,~a[(r+1)%5][s].lowOrder&a[(r+2)%5][s].lowOrder));t[0][0]=qt(t[0][0],jf[n])}return t}function Yf(e,t,n,r,s,a,i){let o,l=0,c;const u=[],h=s>>>5,d=t>>>5;for(o=0;o<d&&t>=s;o+=h)r=vn(e.slice(o,o+h),r),t-=s;for(e=e.slice(o),t=t%s;e.length<h;)e.push(0);for(o=t>>>3,e[o>>2]^=a<<8*(o%4),e[h-1]^=2147483648,r=vn(e,r);u.length*32<i&&(c=r[l%5][l/5|0],u.push(c.lowOrder),!(u.length*32>=i));)u.push(c.highOrder),l+=1,l*64%s===0&&(vn(null,r),l=0);return u}function Ws(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/on&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r+1>>2]|=n<<(r+1)*8,r+=1);return r=r!==0?r:1,s[0]|=r,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function zf(e){let t,n,r=0;const s=[0,0],a=[e&4294967295,e/on&2097151];for(t=6;t>=0;t--)n=a[t>>2]>>>8*t&255,(n!==0||r!==0)&&(s[r>>2]|=n<<r*8,r+=1);return r=r!==0?r:1,s[r>>2]|=r<<r*8,{value:r+1>4?s:[s[0]],binLen:8+r*8}}function zn(e){return Sn(Ws(e.binLen),e)}function ua(e,t){let n=Ws(t),r;n=Sn(n,e);const s=t>>>2,a=(s-n.value.length%s)%s;for(r=0;r<a;r++)n.value.push(0);return n.value}function Xf(e){const t=e||{};return{funcName:ht("funcName",t.funcName,1,{value:[],binLen:0}),customization:ht("Customization",t.customization,1,{value:[],binLen:0})}}function qf(e){const t=e||{};return{kmacKey:ht("kmacKey",t.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:ht("Customization",t.customization,1,{value:[],binLen:0})}}let Jf=class extends Dn{constructor(t,n,r){let s=6,a=0;super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const i=r||{};if(this.numRounds!==1){if(i.kmacKey||i.hmacKey)throw new Error(Rs);if(this.shaVariant==="CSHAKE128"||this.shaVariant==="CSHAKE256")throw new Error("Cannot set numRounds for CSHAKE variants")}switch(this.bigEndianMod=1,this.converterFunc=jt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=vn,this.stateCloneFunc=Gf,this.newStateFunc=dr,this.intermediateState=dr(),this.isVariableLen=!1,t){case"SHA3-224":this.variantBlockSize=a=1152,this.outputBinLen=224,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-256":this.variantBlockSize=a=1088,this.outputBinLen=256,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-384":this.variantBlockSize=a=832,this.outputBinLen=384,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-512":this.variantBlockSize=a=576,this.outputBinLen=512,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHAKE128":s=31,this.variantBlockSize=a=1344,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"SHAKE256":s=31,this.variantBlockSize=a=1088,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"KMAC128":s=4,this.variantBlockSize=a=1344,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"KMAC256":s=4,this.variantBlockSize=a=1088,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"CSHAKE128":this.variantBlockSize=a=1344,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"CSHAKE256":this.variantBlockSize=a=1088,s=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;default:throw new Error(ln)}this.finalizeFunc=function(o,l,c,u,h){return Yf(o,l,c,u,a,s,h)},i.hmacKey&&this._setHMACKey(ht("hmacKey",i.hmacKey,this.bigEndianMod))}_initializeCSHAKE(t,n){const r=Xf(t||{});n&&(r.funcName=n);const s=Sn(zn(r.funcName),zn(r.customization));if(r.customization.binLen!==0||r.funcName.binLen!==0){const a=ua(s,this.variantBlockSize>>>3);for(let i=0;i<a.length;i+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(a.slice(i,i+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;return 4}else return 31}_initializeKMAC(t){const n=qf(t||{});this._initializeCSHAKE(t,n.funcName);const r=ua(zn(n.kmacKey),this.variantBlockSize>>>3);for(let s=0;s<r.length;s+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(r.slice(s,s+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;this.macKeySet=!0}_getKMAC(t){const n=Sn({value:this.remainder.slice(),binLen:this.remainderLen},zf(t.outputLen));return this.finalizeFunc(n.value,n.binLen,this.processedLen,this.stateCloneFunc(this.intermediateState),t.outputLen)}};class Qf{constructor(t,n,r){if(B(this,"shaObj"),t=="SHA-1")this.shaObj=new Cf(t,n,r);else if(t=="SHA-224"||t=="SHA-256")this.shaObj=new Nf(t,n,r);else if(t=="SHA-384"||t=="SHA-512")this.shaObj=new Wf(t,n,r);else if(t=="SHA3-224"||t=="SHA3-256"||t=="SHA3-384"||t=="SHA3-512"||t=="SHAKE128"||t=="SHAKE256"||t=="CSHAKE128"||t=="CSHAKE256"||t=="KMAC128"||t=="KMAC256")this.shaObj=new Jf(t,n,r);else throw new Error(ln)}update(t){return this.shaObj.update(t),this}getHash(t,n){return this.shaObj.getHash(t,n)}setHMACKey(t,n,r){this.shaObj.setHMACKey(t,n,r)}getHMAC(t,n){return this.shaObj.getHMAC(t,n)}}class Zf{static generate(t,n){const r={digits:6,algorithm:"SHA-1",period:30,timestamp:Date.now(),...n},s=Math.floor(r.timestamp/1e3),a=this.leftpad(this.dec2hex(Math.floor(s/r.period)),16,"0"),i=new Qf(r.algorithm,"HEX");i.setHMACKey(this.base32tohex(t),"HEX"),i.update(a);const o=i.getHMAC("HEX"),l=this.hex2dec(o.substring(o.length-1));let c=(this.hex2dec(o.substr(l*2,8))&this.hex2dec("7fffffff"))+"";const u=Math.max(c.length-r.digits,0);c=c.substring(u,u+r.digits);const h=Math.ceil((r.timestamp+1)/(r.period*1e3))*r.period*1e3;return{otp:c,expires:h}}static hex2dec(t){return parseInt(t,16)}static dec2hex(t){return(t<15.5?"0":"")+Math.round(t).toString(16)}static base32tohex(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let r="",s="";const a=t.replace(/=+$/,"");for(let i=0;i<a.length;i++){const o=n.indexOf(t.charAt(i).toUpperCase());if(o===-1)throw new Error("Invalid base32 character in key");r+=this.leftpad(o.toString(2),5,"0")}for(let i=0;i+8<=r.length;i+=8){const o=r.substr(i,8);s=s+this.leftpad(parseInt(o,2).toString(16),2,"0")}return s}static leftpad(t,n,r){return n+1>=t.length&&(t=Array(n+1-t.length).join(r)+t),t}}const ep=(e,t)=>{sn&&localStorage.setItem(e,t)},tp=e=>sn&&localStorage.getItem(e)||"";function Jt(e){return e<10?`0${e}`:e}function np(e){let t=new Date;return e&&(t=new Date(e)),t.format=(n="YYYY-MM-DD HH:mm:ss")=>{const r=t.getFullYear(),s=Jt(t.getMonth()+1),a=Jt(t.getDate()),i=Jt(t.getHours()),o=Jt(t.getMinutes()),l=Jt(t.getSeconds());return n.replace(/Y+/gi,`${r}`).replace(/M+/g,`${s}`).replace(/D+/gi,`${a}`).replace(/H+/gi,`${i}`).replace(/m+/g,`${o}`).replace(/S+/gi,`${l}`)},t}const rp=e=>{if(typeof window<"u"){const t={},n=window.location.href;return n.split("?")[1]&&n.split("?")[1].split("&").forEach(a=>{const[i,o]=a.split("=");i&&o&&(t[i]=decodeURIComponent(o))}),t}return{}},ap=(e,t)=>{typeof window<"u"&&(window[e]=t),typeof global<"u"&&(global[e]=t)},sp=(e=375)=>{let t=e;const{documentElement:n}=document,r=window.matchMedia("(orientation: portrait)");let s,a=667/375;As()===Cs.IPAD&&(a=1024/768,t=768);function i(){const o=!r.matches;let l=window.screen.width,c=window.screen.height;l<c&&([l,c]=[c,l]);let u=n.clientWidth,h=c;u/h>=a?(u=h*a,n.classList.remove("adjustHeight"),n.classList.add("adjustWidth")):(h=u/a,n.classList.remove("adjustWidth"),n.classList.add("adjustHeight"));let g=u/t*16;o&&(g/=a),n.style.fontSize=`${g}px`;const E=window.getComputedStyle(n).fontSize.replace("px","")||0;g!==E&&(n.style.fontSize=`${g/Number(E)*g}px`)}window.addEventListener("resize",function(){clearTimeout(s),s=setTimeout(i,300)},!1),window.addEventListener("pageshow",function(o){o.persisted&&(clearTimeout(s),s=setTimeout(i,300))},!1),window.addEventListener("orientationchange",function(){i()},!1),i()},Xn=new Map([[100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],[200,"OK"],[201,"Created"],[202,"Accepted"],[203,"Non-Authoritative Information"],[204,"No Content"],[205,"Reset Content"],[206,"Partial Content"],[207,"Multi-Status"],[208,"Already Reported"],[226,"IM Used"],[300,"Multiple Choices"],[301,"Moved Permanently"],[302,"Found"],[303,"See Other"],[304,"Not Modified"],[305,"Use Proxy"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],[400,"Bad Request"],[401,"Unauthorized"],[402,"Payment Required"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[406,"Not Acceptable"],[407,"Proxy Authentication Required"],[408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[411,"Length Required"],[412,"Precondition Failed"],[413,"Payload Too Large"],[414,"URI Too Long"],[415,"Unsupported Media Type"],[416,"Range Not Satisfiable"],[417,"Expectation Failed"],[418,"I'm a Teapot"],[421,"Misdirected Request"],[422,"Unprocessable Entity"],[423,"Locked"],[424,"Failed Dependency"],[425,"Too Early"],[426,"Upgrade Required"],[428,"Precondition Required"],[429,"Too Many Requests"],[431,"Request Header Fields Too Large"],[451,"Unavailable For Legal Reasons"],[500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],[505,"HTTP Version Not Supported"],[506,"Variant Also Negotiates"],[507,"Insufficient Storage"],[508,"Loop Detected"],[509,"Bandwidth Limit Exceeded"],[510,"Not Extended"],[511,"Network Authentication Required"]]);ip(Xn),op(Xn);function ip(e){const t=new Map;for(const[n,r]of e)t.set(r.toLowerCase(),n);return t}function op(e){const t=[];for(const[n,r]of e)t.push(n);return t}const Ze=class{constructor(){B(this,"getDecimalLength",t=>{const[n,r]=t.toString().split(".");return r?r.length:0}),B(this,"amend",(t,n=15)=>parseFloat(Number(t).toPrecision(n))),B(this,"power",(t,n)=>Math.pow(10,Math.max(this.getDecimalLength(t),this.getDecimalLength(n))))}};B(Ze,"handleMethod",(e,t)=>{const n=new Ze,{power:r,amend:s}=n,a=r(e,t),i=s(e*a),o=s(t*a);return l=>{switch(l){case"+":return(i+o)/a;case"-":return(i-o)/a;case"*":return i*o/(a*a);case"/":return i/o}}});B(Ze,"add",(e,t)=>Ze.handleMethod(e,t)("+"));B(Ze,"divide",(e,t)=>Ze.handleMethod(e,t)("/"));B(Ze,"multiply",(e,t)=>Ze.handleMethod(e,t)("*"));B(Ze,"subtract",(e,t)=>Ze.handleMethod(e,t)("-"));var At=(e=>(e.NORMAL="normal",e.ERROR="error",e.WARNING="warning",e))(At||{}),cn=(e=>(e.EN="en",e.ZH_CN="zh-CN",e))(cn||{});const js="ran_chaxus_lang",da=[],lp={"zh-CN":{lang:"简体中文"},en:{lang:"English"}};var Ks=(e=>(e.LEGACY="legacy",e))(Ks||{});const ha="PWA_INSTALL_ID",cp="pwa-install",up="/ran/manifest.json",dp=!1;rp();const hr={isDev:dp,locale:cn.EN,currentDevice:As(),isWeiXin:uf(),isMobile:df(),isBang:hf()},hp={install:e=>{e.config.globalProperties.$env=hr,e.provide("$env",hr)}};/*!
  * shared v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const On=typeof window<"u",vt=(e,t=!1)=>t?Symbol.for(e):Symbol(e),mp=(e,t,n)=>fp({l:e,k:t,s:n}),fp=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Ie=e=>typeof e=="number"&&isFinite(e),pp=e=>Ys(e)==="[object Date]",mt=e=>Ys(e)==="[object RegExp]",xn=e=>te(e)&&Object.keys(e).length===0,Me=Object.assign;let ma;const st=()=>ma||(ma=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function fa(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const gp=Object.prototype.hasOwnProperty;function In(e,t){return gp.call(e,t)}const ve=Array.isArray,pe=e=>typeof e=="function",U=e=>typeof e=="string",ae=e=>typeof e=="boolean",ue=e=>e!==null&&typeof e=="object",vp=e=>ue(e)&&pe(e.then)&&pe(e.catch),Gs=Object.prototype.toString,Ys=e=>Gs.call(e),te=e=>{if(!ue(e))return!1;const t=Object.getPrototypeOf(e);return t===null||t.constructor===Object},_p=e=>e==null?"":ve(e)||te(e)&&e.toString===Gs?JSON.stringify(e,null,2):String(e);function bp(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}function Vn(e){let t=e;return()=>++t}function yp(e,t){typeof console<"u"&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const mn=e=>!ue(e)||ve(e);function _n(e,t){if(mn(e)||mn(t))throw new Error("Invalid value");const n=[{src:e,des:t}];for(;n.length;){const{src:r,des:s}=n.pop();Object.keys(r).forEach(a=>{mn(r[a])||mn(s[a])?s[a]=r[a]:n.push({src:r[a],des:s[a]})})}}/*!
  * message-compiler v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function kp(e,t,n){return{line:e,column:t,offset:n}}function Tn(e,t,n){return{start:e,end:t}}const wp=/\{([0-9a-zA-Z]+)\}/g;function zs(e,...t){return t.length===1&&Lp(t[0])&&(t=t[0]),(!t||!t.hasOwnProperty)&&(t={}),e.replace(wp,(n,r)=>t.hasOwnProperty(r)?t[r]:"")}const Xs=Object.assign,pa=e=>typeof e=="string",Lp=e=>e!==null&&typeof e=="object";function qs(e,t=""){return e.reduce((n,r,s)=>s===0?n+r:n+t+r,"")}const Pr={USE_MODULO_SYNTAX:1,__EXTEND_POINT__:2},Ep={[Pr.USE_MODULO_SYNTAX]:"Use modulo before '{{0}}'."};function Sp(e,t,...n){const r=zs(Ep[e],...n||[]),s={message:String(r),code:e};return t&&(s.location=t),s}const Q={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14,UNHANDLED_CODEGEN_NODE_TYPE:15,UNHANDLED_MINIFIER_NODE_TYPE:16,__EXTEND_POINT__:17},Op={[Q.EXPECTED_TOKEN]:"Expected token: '{0}'",[Q.INVALID_TOKEN_IN_PLACEHOLDER]:"Invalid token in placeholder: '{0}'",[Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]:"Unterminated single quote in placeholder",[Q.UNKNOWN_ESCAPE_SEQUENCE]:"Unknown escape sequence: \\{0}",[Q.INVALID_UNICODE_ESCAPE_SEQUENCE]:"Invalid unicode escape sequence: {0}",[Q.UNBALANCED_CLOSING_BRACE]:"Unbalanced closing brace",[Q.UNTERMINATED_CLOSING_BRACE]:"Unterminated closing brace",[Q.EMPTY_PLACEHOLDER]:"Empty placeholder",[Q.NOT_ALLOW_NEST_PLACEHOLDER]:"Not allowed nest placeholder",[Q.INVALID_LINKED_FORMAT]:"Invalid linked format",[Q.MUST_HAVE_MESSAGES_IN_PLURAL]:"Plural must have messages",[Q.UNEXPECTED_EMPTY_LINKED_MODIFIER]:"Unexpected empty linked modifier",[Q.UNEXPECTED_EMPTY_LINKED_KEY]:"Unexpected empty linked key",[Q.UNEXPECTED_LEXICAL_ANALYSIS]:"Unexpected lexical analysis in token: '{0}'",[Q.UNHANDLED_CODEGEN_NODE_TYPE]:"unhandled codegen node type: '{0}'",[Q.UNHANDLED_MINIFIER_NODE_TYPE]:"unhandled mimifier node type: '{0}'"};function Kt(e,t,n={}){const{domain:r,messages:s,args:a}=n,i=zs((s||Op)[e]||"",...a||[]),o=new SyntaxError(String(i));return o.code=e,t&&(o.location=t),o.domain=r,o}function Ip(e){throw e}const tt=" ",Tp="\r",Re=`
`,Cp="\u2028",Ap="\u2029";function Np(e){const t=e;let n=0,r=1,s=1,a=0;const i=$=>t[$]===Tp&&t[$+1]===Re,o=$=>t[$]===Re,l=$=>t[$]===Ap,c=$=>t[$]===Cp,u=$=>i($)||o($)||l($)||c($),h=()=>n,d=()=>r,g=()=>s,E=()=>a,_=$=>i($)||l($)||c($)?Re:t[$],b=()=>_(n),M=()=>_(n+a);function W(){return a=0,u(n)&&(r++,s=0),i(n)&&n++,n++,s++,t[n]}function y(){return i(n+a)&&a++,a++,t[n+a]}function L(){n=0,r=1,s=1,a=0}function A($=0){a=$}function T(){const $=n+a;for(;$!==n;)W();a=0}return{index:h,line:d,column:g,peekOffset:E,charAt:_,currentChar:b,currentPeek:M,next:W,peek:y,reset:L,resetPeek:A,skipToPeek:T}}const dt=void 0,Mp=".",ga="'",Pp="tokenizer";function $p(e,t={}){const n=t.location!==!1,r=Np(e),s=()=>r.index(),a=()=>kp(r.line(),r.column(),r.index()),i=a(),o=s(),l={currentType:14,offset:o,startLoc:i,endLoc:i,lastType:14,lastOffset:o,lastStartLoc:i,lastEndLoc:i,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:u}=t;function h(m,f,N,...z){const ye=c();if(f.column+=N,f.offset+=N,u){const ne=n?Tn(ye.startLoc,f):null,O=Kt(m,ne,{domain:Pp,args:z});u(O)}}function d(m,f,N){m.endLoc=a(),m.currentType=f;const z={type:f};return n&&(z.loc=Tn(m.startLoc,m.endLoc)),N!=null&&(z.value=N),z}const g=m=>d(m,14);function E(m,f){return m.currentChar()===f?(m.next(),f):(h(Q.EXPECTED_TOKEN,a(),0,f),"")}function _(m){let f="";for(;m.currentPeek()===tt||m.currentPeek()===Re;)f+=m.currentPeek(),m.peek();return f}function b(m){const f=_(m);return m.skipToPeek(),f}function M(m){if(m===dt)return!1;const f=m.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f===95}function W(m){if(m===dt)return!1;const f=m.charCodeAt(0);return f>=48&&f<=57}function y(m,f){const{currentType:N}=f;if(N!==2)return!1;_(m);const z=M(m.currentPeek());return m.resetPeek(),z}function L(m,f){const{currentType:N}=f;if(N!==2)return!1;_(m);const z=m.currentPeek()==="-"?m.peek():m.currentPeek(),ye=W(z);return m.resetPeek(),ye}function A(m,f){const{currentType:N}=f;if(N!==2)return!1;_(m);const z=m.currentPeek()===ga;return m.resetPeek(),z}function T(m,f){const{currentType:N}=f;if(N!==8)return!1;_(m);const z=m.currentPeek()===".";return m.resetPeek(),z}function $(m,f){const{currentType:N}=f;if(N!==9)return!1;_(m);const z=M(m.currentPeek());return m.resetPeek(),z}function D(m,f){const{currentType:N}=f;if(!(N===8||N===12))return!1;_(m);const z=m.currentPeek()===":";return m.resetPeek(),z}function R(m,f){const{currentType:N}=f;if(N!==10)return!1;const z=()=>{const ne=m.currentPeek();return ne==="{"?M(m.peek()):ne==="@"||ne==="%"||ne==="|"||ne===":"||ne==="."||ne===tt||!ne?!1:ne===Re?(m.peek(),z()):Z(m,!1)},ye=z();return m.resetPeek(),ye}function de(m){_(m);const f=m.currentPeek()==="|";return m.resetPeek(),f}function ke(m){const f=_(m),N=m.currentPeek()==="%"&&m.peek()==="{";return m.resetPeek(),{isModulo:N,hasSpace:f.length>0}}function Z(m,f=!0){const N=(ye=!1,ne="",O=!1)=>{const P=m.currentPeek();return P==="{"?ne==="%"?!1:ye:P==="@"||!P?ne==="%"?!0:ye:P==="%"?(m.peek(),N(ye,"%",!0)):P==="|"?ne==="%"||O?!0:!(ne===tt||ne===Re):P===tt?(m.peek(),N(!0,tt,O)):P===Re?(m.peek(),N(!0,Re,O)):!0},z=N();return f&&m.resetPeek(),z}function x(m,f){const N=m.currentChar();return N===dt?dt:f(N)?(m.next(),N):null}function oe(m){const f=m.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f>=48&&f<=57||f===95||f===36}function Ee(m){return x(m,oe)}function Oe(m){const f=m.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f>=48&&f<=57||f===95||f===36||f===45}function _e(m){return x(m,Oe)}function He(m){const f=m.charCodeAt(0);return f>=48&&f<=57}function et(m){return x(m,He)}function be(m){const f=m.charCodeAt(0);return f>=48&&f<=57||f>=65&&f<=70||f>=97&&f<=102}function we(m){return x(m,be)}function Ue(m){let f="",N="";for(;f=et(m);)N+=f;return N}function j(m){b(m);const f=m.currentChar();return f!=="%"&&h(Q.EXPECTED_TOKEN,a(),0,f),m.next(),"%"}function le(m){let f="";for(;;){const N=m.currentChar();if(N==="{"||N==="}"||N==="@"||N==="|"||!N)break;if(N==="%")if(Z(m))f+=N,m.next();else break;else if(N===tt||N===Re)if(Z(m))f+=N,m.next();else{if(de(m))break;f+=N,m.next()}else f+=N,m.next()}return f}function ie(m){b(m);let f="",N="";for(;f=_e(m);)N+=f;return m.currentChar()===dt&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N}function he(m){b(m);let f="";return m.currentChar()==="-"?(m.next(),f+=`-${Ue(m)}`):f+=Ue(m),m.currentChar()===dt&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),f}function De(m){return m!==ga&&m!==Re}function Ge(m){b(m),E(m,"'");let f="",N="";for(;f=x(m,De);)f==="\\"?N+=bt(m):N+=f;const z=m.currentChar();return z===Re||z===dt?(h(Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,a(),0),z===Re&&(m.next(),E(m,"'")),N):(E(m,"'"),N)}function bt(m){const f=m.currentChar();switch(f){case"\\":case"'":return m.next(),`\\${f}`;case"u":return ct(m,f,4);case"U":return ct(m,f,6);default:return h(Q.UNKNOWN_ESCAPE_SEQUENCE,a(),0,f),""}}function ct(m,f,N){E(m,f);let z="";for(let ye=0;ye<N;ye++){const ne=we(m);if(!ne){h(Q.INVALID_UNICODE_ESCAPE_SEQUENCE,a(),0,`\\${f}${z}${m.currentChar()}`);break}z+=ne}return`\\${f}${z}`}function Gt(m){return m!=="{"&&m!=="}"&&m!==tt&&m!==Re}function Yt(m){b(m);let f="",N="";for(;f=x(m,Gt);)N+=f;return N}function zt(m){let f="",N="";for(;f=Ee(m);)N+=f;return N}function F(m){const f=N=>{const z=m.currentChar();return z==="{"||z==="%"||z==="@"||z==="|"||z==="("||z===")"||!z||z===tt?N:(N+=z,m.next(),f(N))};return f("")}function ce(m){b(m);const f=E(m,"|");return b(m),f}function St(m,f){let N=null;switch(m.currentChar()){case"{":return f.braceNest>=1&&h(Q.NOT_ALLOW_NEST_PLACEHOLDER,a(),0),m.next(),N=d(f,2,"{"),b(m),f.braceNest++,N;case"}":return f.braceNest>0&&f.currentType===2&&h(Q.EMPTY_PLACEHOLDER,a(),0),m.next(),N=d(f,3,"}"),f.braceNest--,f.braceNest>0&&b(m),f.inLinked&&f.braceNest===0&&(f.inLinked=!1),N;case"@":return f.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N=Ot(m,f)||g(f),f.braceNest=0,N;default:{let ye=!0,ne=!0,O=!0;if(de(m))return f.braceNest>0&&h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),N=d(f,1,ce(m)),f.braceNest=0,f.inLinked=!1,N;if(f.braceNest>0&&(f.currentType===5||f.currentType===6||f.currentType===7))return h(Q.UNTERMINATED_CLOSING_BRACE,a(),0),f.braceNest=0,Xt(m,f);if(ye=y(m,f))return N=d(f,5,ie(m)),b(m),N;if(ne=L(m,f))return N=d(f,6,he(m)),b(m),N;if(O=A(m,f))return N=d(f,7,Ge(m)),b(m),N;if(!ye&&!ne&&!O)return N=d(f,13,Yt(m)),h(Q.INVALID_TOKEN_IN_PLACEHOLDER,a(),0,N.value),b(m),N;break}}return N}function Ot(m,f){const{currentType:N}=f;let z=null;const ye=m.currentChar();switch((N===8||N===9||N===12||N===10)&&(ye===Re||ye===tt)&&h(Q.INVALID_LINKED_FORMAT,a(),0),ye){case"@":return m.next(),z=d(f,8,"@"),f.inLinked=!0,z;case".":return b(m),m.next(),d(f,9,".");case":":return b(m),m.next(),d(f,10,":");default:return de(m)?(z=d(f,1,ce(m)),f.braceNest=0,f.inLinked=!1,z):T(m,f)||D(m,f)?(b(m),Ot(m,f)):$(m,f)?(b(m),d(f,12,zt(m))):R(m,f)?(b(m),ye==="{"?St(m,f)||z:d(f,11,F(m))):(N===8&&h(Q.INVALID_LINKED_FORMAT,a(),0),f.braceNest=0,f.inLinked=!1,Xt(m,f))}}function Xt(m,f){let N={type:14};if(f.braceNest>0)return St(m,f)||g(f);if(f.inLinked)return Ot(m,f)||g(f);switch(m.currentChar()){case"{":return St(m,f)||g(f);case"}":return h(Q.UNBALANCED_CLOSING_BRACE,a(),0),m.next(),d(f,3,"}");case"@":return Ot(m,f)||g(f);default:{if(de(m))return N=d(f,1,ce(m)),f.braceNest=0,f.inLinked=!1,N;const{isModulo:ye,hasSpace:ne}=ke(m);if(ye)return ne?d(f,0,le(m)):d(f,4,j(m));if(Z(m))return d(f,0,le(m));break}}return N}function Wn(){const{currentType:m,offset:f,startLoc:N,endLoc:z}=l;return l.lastType=m,l.lastOffset=f,l.lastStartLoc=N,l.lastEndLoc=z,l.offset=s(),l.startLoc=a(),r.currentChar()===dt?d(l,14):Xt(r,l)}return{nextToken:Wn,currentOffset:s,currentPosition:a,context:c}}const Rp="parser",Fp=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Dp(e,t,n){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(t||n,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function xp(e={}){const t=e.location!==!1,{onError:n,onWarn:r}=e;function s(y,L,A,T,...$){const D=y.currentPosition();if(D.offset+=T,D.column+=T,n){const R=t?Tn(A,D):null,de=Kt(L,R,{domain:Rp,args:$});n(de)}}function a(y,L,A,T,...$){const D=y.currentPosition();if(D.offset+=T,D.column+=T,r){const R=t?Tn(A,D):null;r(Sp(L,R,$))}}function i(y,L,A){const T={type:y};return t&&(T.start=L,T.end=L,T.loc={start:A,end:A}),T}function o(y,L,A,T){t&&(y.end=L,y.loc&&(y.loc.end=A))}function l(y,L){const A=y.context(),T=i(3,A.offset,A.startLoc);return T.value=L,o(T,y.currentOffset(),y.currentPosition()),T}function c(y,L){const A=y.context(),{lastOffset:T,lastStartLoc:$}=A,D=i(5,T,$);return D.index=parseInt(L,10),y.nextToken(),o(D,y.currentOffset(),y.currentPosition()),D}function u(y,L,A){const T=y.context(),{lastOffset:$,lastStartLoc:D}=T,R=i(4,$,D);return R.key=L,A===!0&&(R.modulo=!0),y.nextToken(),o(R,y.currentOffset(),y.currentPosition()),R}function h(y,L){const A=y.context(),{lastOffset:T,lastStartLoc:$}=A,D=i(9,T,$);return D.value=L.replace(Fp,Dp),y.nextToken(),o(D,y.currentOffset(),y.currentPosition()),D}function d(y){const L=y.nextToken(),A=y.context(),{lastOffset:T,lastStartLoc:$}=A,D=i(8,T,$);return L.type!==12?(s(y,Q.UNEXPECTED_EMPTY_LINKED_MODIFIER,A.lastStartLoc,0),D.value="",o(D,T,$),{nextConsumeToken:L,node:D}):(L.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,A.lastStartLoc,0,We(L)),D.value=L.value||"",o(D,y.currentOffset(),y.currentPosition()),{node:D})}function g(y,L){const A=y.context(),T=i(7,A.offset,A.startLoc);return T.value=L,o(T,y.currentOffset(),y.currentPosition()),T}function E(y){const L=y.context(),A=i(6,L.offset,L.startLoc);let T=y.nextToken();if(T.type===9){const $=d(y);A.modifier=$.node,T=$.nextConsumeToken||y.nextToken()}switch(T.type!==10&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(T)),T=y.nextToken(),T.type===2&&(T=y.nextToken()),T.type){case 11:T.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(T)),A.key=g(y,T.value||"");break;case 5:T.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(T)),A.key=u(y,T.value||"");break;case 6:T.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(T)),A.key=c(y,T.value||"");break;case 7:T.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(T)),A.key=h(y,T.value||"");break;default:{s(y,Q.UNEXPECTED_EMPTY_LINKED_KEY,L.lastStartLoc,0);const $=y.context(),D=i(7,$.offset,$.startLoc);return D.value="",o(D,$.offset,$.startLoc),A.key=D,o(A,$.offset,$.startLoc),{nextConsumeToken:T,node:A}}}return o(A,y.currentOffset(),y.currentPosition()),{node:A}}function _(y){const L=y.context(),A=L.currentType===1?y.currentOffset():L.offset,T=L.currentType===1?L.endLoc:L.startLoc,$=i(2,A,T);$.items=[];let D=null,R=null;do{const Z=D||y.nextToken();switch(D=null,Z.type){case 0:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(l(y,Z.value||""));break;case 6:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(c(y,Z.value||""));break;case 4:R=!0;break;case 5:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(u(y,Z.value||"",!!R)),R&&(a(y,Pr.USE_MODULO_SYNTAX,L.lastStartLoc,0,We(Z)),R=null);break;case 7:Z.value==null&&s(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,We(Z)),$.items.push(h(y,Z.value||""));break;case 8:{const x=E(y);$.items.push(x.node),D=x.nextConsumeToken||null;break}}}while(L.currentType!==14&&L.currentType!==1);const de=L.currentType===1?L.lastOffset:y.currentOffset(),ke=L.currentType===1?L.lastEndLoc:y.currentPosition();return o($,de,ke),$}function b(y,L,A,T){const $=y.context();let D=T.items.length===0;const R=i(1,L,A);R.cases=[],R.cases.push(T);do{const de=_(y);D||(D=de.items.length===0),R.cases.push(de)}while($.currentType!==14);return D&&s(y,Q.MUST_HAVE_MESSAGES_IN_PLURAL,A,0),o(R,y.currentOffset(),y.currentPosition()),R}function M(y){const L=y.context(),{offset:A,startLoc:T}=L,$=_(y);return L.currentType===14?$:b(y,A,T,$)}function W(y){const L=$p(y,Xs({},e)),A=L.context(),T=i(0,A.offset,A.startLoc);return t&&T.loc&&(T.loc.source=y),T.body=M(L),e.onCacheKey&&(T.cacheKey=e.onCacheKey(y)),A.currentType!==14&&s(L,Q.UNEXPECTED_LEXICAL_ANALYSIS,A.lastStartLoc,0,y[A.offset]||""),o(T,L.currentOffset(),L.currentPosition()),T}return{parse:W}}function We(e){if(e.type===14)return"EOF";const t=(e.value||"").replace(/\r?\n/gu,"\\n");return t.length>10?t.slice(0,9)+"…":t}function Vp(e,t={}){const n={ast:e,helpers:new Set};return{context:()=>n,helper:a=>(n.helpers.add(a),a)}}function va(e,t){for(let n=0;n<e.length;n++)$r(e[n],t)}function $r(e,t){switch(e.type){case 1:va(e.cases,t),t.helper("plural");break;case 2:va(e.items,t);break;case 6:{$r(e.key,t),t.helper("linked"),t.helper("type");break}case 5:t.helper("interpolate"),t.helper("list");break;case 4:t.helper("interpolate"),t.helper("named");break}}function Hp(e,t={}){const n=Vp(e);n.helper("normalize"),e.body&&$r(e.body,n);const r=n.context();e.helpers=Array.from(r.helpers)}function Up(e){const t=e.body;return t.type===2?_a(t):t.cases.forEach(n=>_a(n)),e}function _a(e){if(e.items.length===1){const t=e.items[0];(t.type===3||t.type===9)&&(e.static=t.value,delete t.value)}else{const t=[];for(let n=0;n<e.items.length;n++){const r=e.items[n];if(!(r.type===3||r.type===9)||r.value==null)break;t.push(r.value)}if(t.length===e.items.length){e.static=qs(t);for(let n=0;n<e.items.length;n++){const r=e.items[n];(r.type===3||r.type===9)&&delete r.value}}}}const Bp="minifier";function Nt(e){switch(e.t=e.type,e.type){case 0:{const t=e;Nt(t.body),t.b=t.body,delete t.body;break}case 1:{const t=e,n=t.cases;for(let r=0;r<n.length;r++)Nt(n[r]);t.c=n,delete t.cases;break}case 2:{const t=e,n=t.items;for(let r=0;r<n.length;r++)Nt(n[r]);t.i=n,delete t.items,t.static&&(t.s=t.static,delete t.static);break}case 3:case 9:case 8:case 7:{const t=e;t.value&&(t.v=t.value,delete t.value);break}case 6:{const t=e;Nt(t.key),t.k=t.key,delete t.key,t.modifier&&(Nt(t.modifier),t.m=t.modifier,delete t.modifier);break}case 5:{const t=e;t.i=t.index,delete t.index;break}case 4:{const t=e;t.k=t.key,delete t.key;break}default:throw Kt(Q.UNHANDLED_MINIFIER_NODE_TYPE,null,{domain:Bp,args:[e.type]})}delete e.type}const Wp="parser";function jp(e,t){const{sourceMap:n,filename:r,breakLineCode:s,needIndent:a}=t,i=t.location!==!1,o={filename:r,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:s,needIndent:a,indentLevel:0};i&&e.loc&&(o.source=e.loc.source);const l=()=>o;function c(b,M){o.code+=b}function u(b,M=!0){const W=M?s:"";c(a?W+"  ".repeat(b):W)}function h(b=!0){const M=++o.indentLevel;b&&u(M)}function d(b=!0){const M=--o.indentLevel;b&&u(M)}function g(){u(o.indentLevel)}return{context:l,push:c,indent:h,deindent:d,newline:g,helper:b=>`_${b}`,needIndent:()=>o.needIndent}}function Kp(e,t){const{helper:n}=e;e.push(`${n("linked")}(`),xt(e,t.key),t.modifier?(e.push(", "),xt(e,t.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function Gp(e,t){const{helper:n,needIndent:r}=e;e.push(`${n("normalize")}([`),e.indent(r());const s=t.items.length;for(let a=0;a<s&&(xt(e,t.items[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}function Yp(e,t){const{helper:n,needIndent:r}=e;if(t.cases.length>1){e.push(`${n("plural")}([`),e.indent(r());const s=t.cases.length;for(let a=0;a<s&&(xt(e,t.cases[a]),a!==s-1);a++)e.push(", ");e.deindent(r()),e.push("])")}}function zp(e,t){t.body?xt(e,t.body):e.push("null")}function xt(e,t){const{helper:n}=e;switch(t.type){case 0:zp(e,t);break;case 1:Yp(e,t);break;case 2:Gp(e,t);break;case 6:Kp(e,t);break;case 8:e.push(JSON.stringify(t.value),t);break;case 7:e.push(JSON.stringify(t.value),t);break;case 5:e.push(`${n("interpolate")}(${n("list")}(${t.index}))`,t);break;case 4:e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`,t);break;case 9:e.push(JSON.stringify(t.value),t);break;case 3:e.push(JSON.stringify(t.value),t);break;default:throw Kt(Q.UNHANDLED_CODEGEN_NODE_TYPE,null,{domain:Wp,args:[t.type]})}}const Xp=(e,t={})=>{const n=pa(t.mode)?t.mode:"normal",r=pa(t.filename)?t.filename:"message.intl",s=!!t.sourceMap,a=t.breakLineCode!=null?t.breakLineCode:n==="arrow"?";":`
`,i=t.needIndent?t.needIndent:n!=="arrow",o=e.helpers||[],l=jp(e,{mode:n,filename:r,sourceMap:s,breakLineCode:a,needIndent:i});l.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),l.indent(i),o.length>0&&(l.push(`const { ${qs(o.map(h=>`${h}: _${h}`),", ")} } = ctx`),l.newline()),l.push("return "),xt(l,e),l.deindent(i),l.push("}"),delete e.helpers;const{code:c,map:u}=l.context();return{ast:e,code:c,map:u?u.toJSON():void 0}};function qp(e,t={}){const n=Xs({},t),r=!!n.jit,s=!!n.minify,a=n.optimize==null?!0:n.optimize,o=xp(n).parse(e);return r?(a&&Up(o),s&&Nt(o),{ast:o,code:""}):(Hp(o,n),Xp(o,n))}/*!
  * core-base v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function Jp(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(st().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(st().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(st().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}const _t=[];_t[0]={w:[0],i:[3,0],"[":[4],o:[7]};_t[1]={w:[1],".":[2],"[":[4],o:[7]};_t[2]={w:[2],i:[3,0],0:[3,0]};_t[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};_t[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};_t[5]={"'":[4,0],o:8,l:[5,0]};_t[6]={'"':[4,0],o:8,l:[6,0]};const Qp=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function Zp(e){return Qp.test(e)}function eg(e){const t=e.charCodeAt(0),n=e.charCodeAt(e.length-1);return t===n&&(t===34||t===39)?e.slice(1,-1):e}function tg(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function ng(e){const t=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:Zp(t)?eg(t):"*"+t}function rg(e){const t=[];let n=-1,r=0,s=0,a,i,o,l,c,u,h;const d=[];d[0]=()=>{i===void 0?i=o:i+=o},d[1]=()=>{i!==void 0&&(t.push(i),i=void 0)},d[2]=()=>{d[0](),s++},d[3]=()=>{if(s>0)s--,r=4,d[0]();else{if(s=0,i===void 0||(i=ng(i),i===!1))return!1;d[1]()}};function g(){const E=e[n+1];if(r===5&&E==="'"||r===6&&E==='"')return n++,o="\\"+E,d[0](),!0}for(;r!==null;)if(n++,a=e[n],!(a==="\\"&&g())){if(l=tg(a),h=_t[r],c=h[l]||h.l||8,c===8||(r=c[0],c[1]!==void 0&&(u=d[c[1]],u&&(o=a,u()===!1))))return;if(r===7)return t}}const ba=new Map;function ag(e,t){return ue(e)?e[t]:null}function sg(e,t){if(!ue(e))return null;let n=ba.get(t);if(n||(n=rg(t),n&&ba.set(t,n)),!n)return null;const r=n.length;let s=e,a=0;for(;a<r;){const i=s[n[a]];if(i===void 0||pe(s))return null;s=i,a++}return s}const ig=e=>e,og=e=>"",lg="text",cg=e=>e.length===0?"":bp(e),ug=_p;function ya(e,t){return e=Math.abs(e),t===2?e?e>1?1:0:1:e?Math.min(e,2):0}function dg(e){const t=Ie(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Ie(e.named.count)||Ie(e.named.n))?Ie(e.named.count)?e.named.count:Ie(e.named.n)?e.named.n:t:t}function hg(e,t){t.count||(t.count=e),t.n||(t.n=e)}function mg(e={}){const t=e.locale,n=dg(e),r=ue(e.pluralRules)&&U(t)&&pe(e.pluralRules[t])?e.pluralRules[t]:ya,s=ue(e.pluralRules)&&U(t)&&pe(e.pluralRules[t])?ya:void 0,a=M=>M[r(n,M.length,s)],i=e.list||[],o=M=>i[M],l=e.named||{};Ie(e.pluralIndex)&&hg(n,l);const c=M=>l[M];function u(M){const W=pe(e.messages)?e.messages(M):ue(e.messages)?e.messages[M]:!1;return W||(e.parent?e.parent.message(M):og)}const h=M=>e.modifiers?e.modifiers[M]:ig,d=te(e.processor)&&pe(e.processor.normalize)?e.processor.normalize:cg,g=te(e.processor)&&pe(e.processor.interpolate)?e.processor.interpolate:ug,E=te(e.processor)&&U(e.processor.type)?e.processor.type:lg,b={list:o,named:c,plural:a,linked:(M,...W)=>{const[y,L]=W;let A="text",T="";W.length===1?ue(y)?(T=y.modifier||T,A=y.type||A):U(y)&&(T=y||T):W.length===2&&(U(y)&&(T=y||T),U(L)&&(A=L||A));const $=u(M)(b),D=A==="vnode"&&ve($)&&T?$[0]:$;return T?h(T)(D,A):D},message:u,type:E,interpolate:g,normalize:d,values:Me({},i,l)};return b}let tn=null;function fg(e){tn=e}function pg(e,t,n){tn&&tn.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:t,meta:n})}const gg=vg("function:translate");function vg(e){return t=>tn&&tn.emit(e,t)}const Js=Pr.__EXTEND_POINT__,yt=Vn(Js),_g={NOT_FOUND_KEY:Js,FALLBACK_TO_TRANSLATE:yt(),CANNOT_FORMAT_NUMBER:yt(),FALLBACK_TO_NUMBER_FORMAT:yt(),CANNOT_FORMAT_DATE:yt(),FALLBACK_TO_DATE_FORMAT:yt(),EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER:yt(),__EXTEND_POINT__:yt()},Qs=Q.__EXTEND_POINT__,kt=Vn(Qs),je={INVALID_ARGUMENT:Qs,INVALID_DATE_ARGUMENT:kt(),INVALID_ISO_DATE_ARGUMENT:kt(),NOT_SUPPORT_NON_STRING_MESSAGE:kt(),NOT_SUPPORT_LOCALE_PROMISE_VALUE:kt(),NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:kt(),NOT_SUPPORT_LOCALE_TYPE:kt(),__EXTEND_POINT__:kt()};function ze(e){return Kt(e,null,void 0)}function Rr(e,t){return t.locale!=null?ka(t.locale):ka(e.locale)}let qn;function ka(e){if(U(e))return e;if(pe(e)){if(e.resolvedOnce&&qn!=null)return qn;if(e.constructor.name==="Function"){const t=e();if(vp(t))throw ze(je.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return qn=t}else throw ze(je.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw ze(je.NOT_SUPPORT_LOCALE_TYPE)}function bg(e,t,n){return[...new Set([n,...ve(t)?t:ue(t)?Object.keys(t):U(t)?[t]:[n]])]}function Zs(e,t,n){const r=U(n)?n:Vt,s=e;s.__localeChainCache||(s.__localeChainCache=new Map);let a=s.__localeChainCache.get(r);if(!a){a=[];let i=[n];for(;ve(i);)i=wa(a,i,t);const o=ve(t)||!te(t)?t:t.default?t.default:null;i=U(o)?[o]:o,ve(i)&&wa(a,i,!1),s.__localeChainCache.set(r,a)}return a}function wa(e,t,n){let r=!0;for(let s=0;s<t.length&&ae(r);s++){const a=t[s];U(a)&&(r=yg(e,t[s],n))}return r}function yg(e,t,n){let r;const s=t.split("-");do{const a=s.join("-");r=kg(e,a,n),s.splice(-1,1)}while(s.length&&r===!0);return r}function kg(e,t,n){let r=!1;if(!e.includes(t)&&(r=!0,t)){r=t[t.length-1]!=="!";const s=t.replace(/!/g,"");e.push(s),(ve(n)||te(n))&&n[s]&&(r=n[s])}return r}const wg="9.13.1",Hn=-1,Vt="en-US",La="",Ea=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function Lg(){return{upper:(e,t)=>t==="text"&&U(e)?e.toUpperCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,t)=>t==="text"&&U(e)?e.toLowerCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,t)=>t==="text"&&U(e)?Ea(e):t==="vnode"&&ue(e)&&"__v_isVNode"in e?Ea(e.children):e}}let ei;function Sa(e){ei=e}let ti;function Eg(e){ti=e}let ni;function Sg(e){ni=e}let ri=null;const Og=e=>{ri=e},Ig=()=>ri;let ai=null;const Oa=e=>{ai=e},Tg=()=>ai;let Ia=0;function Cg(e={}){const t=pe(e.onWarn)?e.onWarn:yp,n=U(e.version)?e.version:wg,r=U(e.locale)||pe(e.locale)?e.locale:Vt,s=pe(r)?Vt:r,a=ve(e.fallbackLocale)||te(e.fallbackLocale)||U(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:s,i=te(e.messages)?e.messages:{[s]:{}},o=te(e.datetimeFormats)?e.datetimeFormats:{[s]:{}},l=te(e.numberFormats)?e.numberFormats:{[s]:{}},c=Me({},e.modifiers||{},Lg()),u=e.pluralRules||{},h=pe(e.missing)?e.missing:null,d=ae(e.missingWarn)||mt(e.missingWarn)?e.missingWarn:!0,g=ae(e.fallbackWarn)||mt(e.fallbackWarn)?e.fallbackWarn:!0,E=!!e.fallbackFormat,_=!!e.unresolving,b=pe(e.postTranslation)?e.postTranslation:null,M=te(e.processor)?e.processor:null,W=ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,y=!!e.escapeParameter,L=pe(e.messageCompiler)?e.messageCompiler:ei,A=pe(e.messageResolver)?e.messageResolver:ti||ag,T=pe(e.localeFallbacker)?e.localeFallbacker:ni||bg,$=ue(e.fallbackContext)?e.fallbackContext:void 0,D=e,R=ue(D.__datetimeFormatters)?D.__datetimeFormatters:new Map,de=ue(D.__numberFormatters)?D.__numberFormatters:new Map,ke=ue(D.__meta)?D.__meta:{};Ia++;const Z={version:n,cid:Ia,locale:r,fallbackLocale:a,messages:i,modifiers:c,pluralRules:u,missing:h,missingWarn:d,fallbackWarn:g,fallbackFormat:E,unresolving:_,postTranslation:b,processor:M,warnHtmlMessage:W,escapeParameter:y,messageCompiler:L,messageResolver:A,localeFallbacker:T,fallbackContext:$,onWarn:t,__meta:ke};return Z.datetimeFormats=o,Z.numberFormats=l,Z.__datetimeFormatters=R,Z.__numberFormatters=de,__INTLIFY_PROD_DEVTOOLS__&&pg(Z,n,ke),Z}function Fr(e,t,n,r,s){const{missing:a,onWarn:i}=e;if(a!==null){const o=a(e,n,t,s);return U(o)?o:t}else return t}function Qt(e,t,n){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,n,t)}function Ag(e,t){return e===t?!1:e.split("-")[0]===t.split("-")[0]}function Ng(e,t){const n=t.indexOf(e);if(n===-1)return!1;for(let r=n+1;r<t.length;r++)if(Ag(e,t[r]))return!0;return!1}function Jn(e){return n=>Mg(n,e)}function Mg(e,t){const n=t.b||t.body;if((n.t||n.type)===1){const r=n,s=r.c||r.cases;return e.plural(s.reduce((a,i)=>[...a,Ta(e,i)],[]))}else return Ta(e,n)}function Ta(e,t){const n=t.s||t.static;if(n)return e.type==="text"?n:e.normalize([n]);{const r=(t.i||t.items).reduce((s,a)=>[...s,mr(e,a)],[]);return e.normalize(r)}}function mr(e,t){const n=t.t||t.type;switch(n){case 3:{const r=t;return r.v||r.value}case 9:{const r=t;return r.v||r.value}case 4:{const r=t;return e.interpolate(e.named(r.k||r.key))}case 5:{const r=t;return e.interpolate(e.list(r.i!=null?r.i:r.index))}case 6:{const r=t,s=r.m||r.modifier;return e.linked(mr(e,r.k||r.key),s?mr(e,s):void 0,e.type)}case 7:{const r=t;return r.v||r.value}case 8:{const r=t;return r.v||r.value}default:throw new Error(`unhandled node type on format message part: ${n}`)}}const si=e=>e;let Pt=Object.create(null);const Ht=e=>ue(e)&&(e.t===0||e.type===0)&&("b"in e||"body"in e);function ii(e,t={}){let n=!1;const r=t.onError||Ip;return t.onError=s=>{n=!0,r(s)},{...qp(e,t),detectError:n}}const Pg=(e,t)=>{if(!U(e))throw ze(je.NOT_SUPPORT_NON_STRING_MESSAGE);{ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||si)(e),s=Pt[r];if(s)return s;const{code:a,detectError:i}=ii(e,t),o=new Function(`return ${a}`)();return i?o:Pt[r]=o}};function $g(e,t){if(__INTLIFY_JIT_COMPILATION__&&!__INTLIFY_DROP_MESSAGE_COMPILER__&&U(e)){ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||si)(e),s=Pt[r];if(s)return s;const{ast:a,detectError:i}=ii(e,{...t,location:!1,jit:!0}),o=Jn(a);return i?o:Pt[r]=o}else{const n=e.cacheKey;if(n){const r=Pt[n];return r||(Pt[n]=Jn(e))}else return Jn(e)}}const Ca=()=>"",Ve=e=>pe(e);function Aa(e,...t){const{fallbackFormat:n,postTranslation:r,unresolving:s,messageCompiler:a,fallbackLocale:i,messages:o}=e,[l,c]=fr(...t),u=ae(c.missingWarn)?c.missingWarn:e.missingWarn,h=ae(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,d=ae(c.escapeParameter)?c.escapeParameter:e.escapeParameter,g=!!c.resolvedMessage,E=U(c.default)||ae(c.default)?ae(c.default)?a?l:()=>l:c.default:n?a?l:()=>l:"",_=n||E!=="",b=Rr(e,c);d&&Rg(c);let[M,W,y]=g?[l,b,o[b]||{}]:oi(e,l,b,i,h,u),L=M,A=l;if(!g&&!(U(L)||Ht(L)||Ve(L))&&_&&(L=E,A=L),!g&&(!(U(L)||Ht(L)||Ve(L))||!U(W)))return s?Hn:l;let T=!1;const $=()=>{T=!0},D=Ve(L)?L:li(e,l,W,L,A,$);if(T)return L;const R=xg(e,W,y,c),de=mg(R),ke=Fg(e,D,de),Z=r?r(ke,l):ke;if(__INTLIFY_PROD_DEVTOOLS__){const x={timestamp:Date.now(),key:U(l)?l:Ve(L)?L.key:"",locale:W||(Ve(L)?L.locale:""),format:U(L)?L:Ve(L)?L.source:"",message:Z};x.meta=Me({},e.__meta,Ig()||{}),gg(x)}return Z}function Rg(e){ve(e.list)?e.list=e.list.map(t=>U(t)?fa(t):t):ue(e.named)&&Object.keys(e.named).forEach(t=>{U(e.named[t])&&(e.named[t]=fa(e.named[t]))})}function oi(e,t,n,r,s,a){const{messages:i,onWarn:o,messageResolver:l,localeFallbacker:c}=e,u=c(e,r,n);let h={},d,g=null;const E="translate";for(let _=0;_<u.length&&(d=u[_],h=i[d]||{},(g=l(h,t))===null&&(g=h[t]),!(U(g)||Ht(g)||Ve(g)));_++)if(!Ng(d,u)){const b=Fr(e,t,d,a,E);b!==t&&(g=b)}return[g,d,h]}function li(e,t,n,r,s,a){const{messageCompiler:i,warnHtmlMessage:o}=e;if(Ve(r)){const c=r;return c.locale=c.locale||n,c.key=c.key||t,c}if(i==null){const c=()=>r;return c.locale=n,c.key=t,c}const l=i(r,Dg(e,n,s,r,o,a));return l.locale=n,l.key=t,l.source=r,l}function Fg(e,t,n){return t(n)}function fr(...e){const[t,n,r]=e,s={};if(!U(t)&&!Ie(t)&&!Ve(t)&&!Ht(t))throw ze(je.INVALID_ARGUMENT);const a=Ie(t)?String(t):(Ve(t),t);return Ie(n)?s.plural=n:U(n)?s.default=n:te(n)&&!xn(n)?s.named=n:ve(n)&&(s.list=n),Ie(r)?s.plural=r:U(r)?s.default=r:te(r)&&Me(s,r),[a,s]}function Dg(e,t,n,r,s,a){return{locale:t,key:n,warnHtmlMessage:s,onError:i=>{throw a&&a(i),i},onCacheKey:i=>mp(t,n,i)}}function xg(e,t,n,r){const{modifiers:s,pluralRules:a,messageResolver:i,fallbackLocale:o,fallbackWarn:l,missingWarn:c,fallbackContext:u}=e,d={locale:t,modifiers:s,pluralRules:a,messages:g=>{let E=i(n,g);if(E==null&&u){const[,,_]=oi(u,g,t,o,l,c);E=i(_,g)}if(U(E)||Ht(E)){let _=!1;const M=li(e,g,t,E,g,()=>{_=!0});return _?Ca:M}else return Ve(E)?E:Ca}};return e.processor&&(d.processor=e.processor),r.list&&(d.list=r.list),r.named&&(d.named=r.named),Ie(r.plural)&&(d.pluralIndex=r.plural),d}function Na(e,...t){const{datetimeFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:i}=e,{__datetimeFormatters:o}=e,[l,c,u,h]=pr(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const g=!!u.part,E=Rr(e,u),_=i(e,s,E);if(!U(l)||l==="")return new Intl.DateTimeFormat(E,h).format(c);let b={},M,W=null;const y="datetime format";for(let T=0;T<_.length&&(M=_[T],b=n[M]||{},W=b[l],!te(W));T++)Fr(e,l,M,d,y);if(!te(W)||!U(M))return r?Hn:l;let L=`${M}__${l}`;xn(h)||(L=`${L}__${JSON.stringify(h)}`);let A=o.get(L);return A||(A=new Intl.DateTimeFormat(M,Me({},W,h)),o.set(L,A)),g?A.formatToParts(c):A.format(c)}const ci=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function pr(...e){const[t,n,r,s]=e,a={};let i={},o;if(U(t)){const l=t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw ze(je.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();o=new Date(c);try{o.toISOString()}catch{throw ze(je.INVALID_ISO_DATE_ARGUMENT)}}else if(pp(t)){if(isNaN(t.getTime()))throw ze(je.INVALID_DATE_ARGUMENT);o=t}else if(Ie(t))o=t;else throw ze(je.INVALID_ARGUMENT);return U(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{ci.includes(l)?i[l]=n[l]:a[l]=n[l]}),U(r)?a.locale=r:te(r)&&(i=r),te(s)&&(i=s),[a.key||"",o,a,i]}function Ma(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__datetimeFormatters.has(a)&&r.__datetimeFormatters.delete(a)}}function Pa(e,...t){const{numberFormats:n,unresolving:r,fallbackLocale:s,onWarn:a,localeFallbacker:i}=e,{__numberFormatters:o}=e,[l,c,u,h]=gr(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const g=!!u.part,E=Rr(e,u),_=i(e,s,E);if(!U(l)||l==="")return new Intl.NumberFormat(E,h).format(c);let b={},M,W=null;const y="number format";for(let T=0;T<_.length&&(M=_[T],b=n[M]||{},W=b[l],!te(W));T++)Fr(e,l,M,d,y);if(!te(W)||!U(M))return r?Hn:l;let L=`${M}__${l}`;xn(h)||(L=`${L}__${JSON.stringify(h)}`);let A=o.get(L);return A||(A=new Intl.NumberFormat(M,Me({},W,h)),o.set(L,A)),g?A.formatToParts(c):A.format(c)}const ui=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function gr(...e){const[t,n,r,s]=e,a={};let i={};if(!Ie(t))throw ze(je.INVALID_ARGUMENT);const o=t;return U(n)?a.key=n:te(n)&&Object.keys(n).forEach(l=>{ui.includes(l)?i[l]=n[l]:a[l]=n[l]}),U(r)?a.locale=r:te(r)&&(i=r),te(s)&&(i=s),[a.key||"",o,a,i]}function $a(e,t,n){const r=e;for(const s in n){const a=`${t}__${s}`;r.__numberFormatters.has(a)&&r.__numberFormatters.delete(a)}}Jp();/*!
  * vue-i18n v9.13.1
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const Vg="9.13.1";function Hg(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(st().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(st().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(st().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(st().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(st().__INTLIFY_PROD_DEVTOOLS__=!1)}const di=_g.__EXTEND_POINT__,nt=Vn(di);nt(),nt(),nt(),nt(),nt(),nt(),nt(),nt(),nt();const hi=je.__EXTEND_POINT__,Fe=Vn(hi),Te={UNEXPECTED_RETURN_TYPE:hi,INVALID_ARGUMENT:Fe(),MUST_BE_CALL_SETUP_TOP:Fe(),NOT_INSTALLED:Fe(),NOT_AVAILABLE_IN_LEGACY_MODE:Fe(),REQUIRED_VALUE:Fe(),INVALID_VALUE:Fe(),CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:Fe(),NOT_INSTALLED_WITH_PROVIDE:Fe(),UNEXPECTED_ERROR:Fe(),NOT_COMPATIBLE_LEGACY_VUE_I18N:Fe(),BRIDGE_SUPPORT_VUE_2_ONLY:Fe(),MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION:Fe(),NOT_AVAILABLE_COMPOSITION_IN_LEGACY:Fe(),__EXTEND_POINT__:Fe()};function Ce(e,...t){return Kt(e,null,void 0)}const vr=vt("__translateVNode"),_r=vt("__datetimeParts"),br=vt("__numberParts"),mi=vt("__setPluralRules"),fi=vt("__injectWithOption"),yr=vt("__dispose");function nn(e){if(!ue(e))return e;for(const t in e)if(In(e,t))if(!t.includes("."))ue(e[t])&&nn(e[t]);else{const n=t.split("."),r=n.length-1;let s=e,a=!1;for(let i=0;i<r;i++){if(n[i]in s||(s[n[i]]={}),!ue(s[n[i]])){a=!0;break}s=s[n[i]]}a||(s[n[r]]=e[t],delete e[t]),ue(s[n[r]])&&nn(s[n[r]])}return e}function Un(e,t){const{messages:n,__i18n:r,messageResolver:s,flatJson:a}=t,i=te(n)?n:ve(r)?{}:{[e]:{}};if(ve(r)&&r.forEach(o=>{if("locale"in o&&"resource"in o){const{locale:l,resource:c}=o;l?(i[l]=i[l]||{},_n(c,i[l])):_n(c,i)}else U(o)&&_n(JSON.parse(o),i)}),s==null&&a)for(const o in i)In(i,o)&&nn(i[o]);return i}function pi(e){return e.type}function gi(e,t,n){let r=ue(t.messages)?t.messages:{};"__i18nGlobal"in n&&(r=Un(e.locale.value,{messages:r,__i18n:n.__i18nGlobal}));const s=Object.keys(r);s.length&&s.forEach(a=>{e.mergeLocaleMessage(a,r[a])});{if(ue(t.datetimeFormats)){const a=Object.keys(t.datetimeFormats);a.length&&a.forEach(i=>{e.mergeDateTimeFormat(i,t.datetimeFormats[i])})}if(ue(t.numberFormats)){const a=Object.keys(t.numberFormats);a.length&&a.forEach(i=>{e.mergeNumberFormat(i,t.numberFormats[i])})}}}function Ra(e){return Y(Wi,null,e,0)}const Fa="__INTLIFY_META__",Da=()=>[],Ug=()=>!1;let xa=0;function Va(e){return(t,n,r,s)=>e(n,r,Dt()||void 0,s)}const Bg=()=>{const e=Dt();let t=null;return e&&(t=pi(e)[Fa])?{[Fa]:t}:null};function Dr(e={},t){const{__root:n,__injectWithOption:r}=e,s=n===void 0,a=e.flatJson,i=On?X:Mn,o=!!e.translateExistCompatible;let l=ae(e.inheritLocale)?e.inheritLocale:!0;const c=i(n&&l?n.locale.value:U(e.locale)?e.locale:Vt),u=i(n&&l?n.fallbackLocale.value:U(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:c.value),h=i(Un(c.value,e)),d=i(te(e.datetimeFormats)?e.datetimeFormats:{[c.value]:{}}),g=i(te(e.numberFormats)?e.numberFormats:{[c.value]:{}});let E=n?n.missingWarn:ae(e.missingWarn)||mt(e.missingWarn)?e.missingWarn:!0,_=n?n.fallbackWarn:ae(e.fallbackWarn)||mt(e.fallbackWarn)?e.fallbackWarn:!0,b=n?n.fallbackRoot:ae(e.fallbackRoot)?e.fallbackRoot:!0,M=!!e.fallbackFormat,W=pe(e.missing)?e.missing:null,y=pe(e.missing)?Va(e.missing):null,L=pe(e.postTranslation)?e.postTranslation:null,A=n?n.warnHtmlMessage:ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,T=!!e.escapeParameter;const $=n?n.modifiers:te(e.modifiers)?e.modifiers:{};let D=e.pluralRules||n&&n.pluralRules,R;R=(()=>{s&&Oa(null);const O={version:Vg,locale:c.value,fallbackLocale:u.value,messages:h.value,modifiers:$,pluralRules:D,missing:y===null?void 0:y,missingWarn:E,fallbackWarn:_,fallbackFormat:M,unresolving:!0,postTranslation:L===null?void 0:L,warnHtmlMessage:A,escapeParameter:T,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};O.datetimeFormats=d.value,O.numberFormats=g.value,O.__datetimeFormatters=te(R)?R.__datetimeFormatters:void 0,O.__numberFormatters=te(R)?R.__numberFormatters:void 0;const P=Cg(O);return s&&Oa(P),P})(),Qt(R,c.value,u.value);function ke(){return[c.value,u.value,h.value,d.value,g.value]}const Z=V({get:()=>c.value,set:O=>{c.value=O,R.locale=c.value}}),x=V({get:()=>u.value,set:O=>{u.value=O,R.fallbackLocale=u.value,Qt(R,c.value,O)}}),oe=V(()=>h.value),Ee=V(()=>d.value),Oe=V(()=>g.value);function _e(){return pe(L)?L:null}function He(O){L=O,R.postTranslation=O}function et(){return W}function be(O){O!==null&&(y=Va(O)),W=O,R.missing=y}const we=(O,P,me,Se,ut,un)=>{ke();let It;try{__INTLIFY_PROD_DEVTOOLS__,s||(R.fallbackContext=n?Tg():void 0),It=O(R)}finally{__INTLIFY_PROD_DEVTOOLS__,s||(R.fallbackContext=void 0)}if(me!=="translate exists"&&Ie(It)&&It===Hn||me==="translate exists"&&!It){const[wi,k0]=P();return n&&b?Se(n):ut(wi)}else{if(un(It))return It;throw Ce(Te.UNEXPECTED_RETURN_TYPE)}};function Ue(...O){return we(P=>Reflect.apply(Aa,null,[P,...O]),()=>fr(...O),"translate",P=>Reflect.apply(P.t,P,[...O]),P=>P,P=>U(P))}function j(...O){const[P,me,Se]=O;if(Se&&!ue(Se))throw Ce(Te.INVALID_ARGUMENT);return Ue(P,me,Me({resolvedMessage:!0},Se||{}))}function le(...O){return we(P=>Reflect.apply(Na,null,[P,...O]),()=>pr(...O),"datetime format",P=>Reflect.apply(P.d,P,[...O]),()=>La,P=>U(P))}function ie(...O){return we(P=>Reflect.apply(Pa,null,[P,...O]),()=>gr(...O),"number format",P=>Reflect.apply(P.n,P,[...O]),()=>La,P=>U(P))}function he(O){return O.map(P=>U(P)||Ie(P)||ae(P)?Ra(String(P)):P)}const Ge={normalize:he,interpolate:O=>O,type:"vnode"};function bt(...O){return we(P=>{let me;const Se=P;try{Se.processor=Ge,me=Reflect.apply(Aa,null,[Se,...O])}finally{Se.processor=null}return me},()=>fr(...O),"translate",P=>P[vr](...O),P=>[Ra(P)],P=>ve(P))}function ct(...O){return we(P=>Reflect.apply(Pa,null,[P,...O]),()=>gr(...O),"number format",P=>P[br](...O),Da,P=>U(P)||ve(P))}function Gt(...O){return we(P=>Reflect.apply(Na,null,[P,...O]),()=>pr(...O),"datetime format",P=>P[_r](...O),Da,P=>U(P)||ve(P))}function Yt(O){D=O,R.pluralRules=D}function zt(O,P){return we(()=>{if(!O)return!1;const me=U(P)?P:c.value,Se=St(me),ut=R.messageResolver(Se,O);return o?ut!=null:Ht(ut)||Ve(ut)||U(ut)},()=>[O],"translate exists",me=>Reflect.apply(me.te,me,[O,P]),Ug,me=>ae(me))}function F(O){let P=null;const me=Zs(R,u.value,c.value);for(let Se=0;Se<me.length;Se++){const ut=h.value[me[Se]]||{},un=R.messageResolver(ut,O);if(un!=null){P=un;break}}return P}function ce(O){const P=F(O);return P??(n?n.tm(O)||{}:{})}function St(O){return h.value[O]||{}}function Ot(O,P){if(a){const me={[O]:P};for(const Se in me)In(me,Se)&&nn(me[Se]);P=me[O]}h.value[O]=P,R.messages=h.value}function Xt(O,P){h.value[O]=h.value[O]||{};const me={[O]:P};if(a)for(const Se in me)In(me,Se)&&nn(me[Se]);P=me[O],_n(P,h.value[O]),R.messages=h.value}function Wn(O){return d.value[O]||{}}function m(O,P){d.value[O]=P,R.datetimeFormats=d.value,Ma(R,O,P)}function f(O,P){d.value[O]=Me(d.value[O]||{},P),R.datetimeFormats=d.value,Ma(R,O,P)}function N(O){return g.value[O]||{}}function z(O,P){g.value[O]=P,R.numberFormats=g.value,$a(R,O,P)}function ye(O,P){g.value[O]=Me(g.value[O]||{},P),R.numberFormats=g.value,$a(R,O,P)}xa++,n&&On&&(Le(n.locale,O=>{l&&(c.value=O,R.locale=O,Qt(R,c.value,u.value))}),Le(n.fallbackLocale,O=>{l&&(u.value=O,R.fallbackLocale=O,Qt(R,c.value,u.value))}));const ne={id:xa,locale:Z,fallbackLocale:x,get inheritLocale(){return l},set inheritLocale(O){l=O,O&&n&&(c.value=n.locale.value,u.value=n.fallbackLocale.value,Qt(R,c.value,u.value))},get availableLocales(){return Object.keys(h.value).sort()},messages:oe,get modifiers(){return $},get pluralRules(){return D||{}},get isGlobal(){return s},get missingWarn(){return E},set missingWarn(O){E=O,R.missingWarn=E},get fallbackWarn(){return _},set fallbackWarn(O){_=O,R.fallbackWarn=_},get fallbackRoot(){return b},set fallbackRoot(O){b=O},get fallbackFormat(){return M},set fallbackFormat(O){M=O,R.fallbackFormat=M},get warnHtmlMessage(){return A},set warnHtmlMessage(O){A=O,R.warnHtmlMessage=O},get escapeParameter(){return T},set escapeParameter(O){T=O,R.escapeParameter=O},t:Ue,getLocaleMessage:St,setLocaleMessage:Ot,mergeLocaleMessage:Xt,getPostTranslationHandler:_e,setPostTranslationHandler:He,getMissingHandler:et,setMissingHandler:be,[mi]:Yt};return ne.datetimeFormats=Ee,ne.numberFormats=Oe,ne.rt=j,ne.te=zt,ne.tm=ce,ne.d=le,ne.n=ie,ne.getDateTimeFormat=Wn,ne.setDateTimeFormat=m,ne.mergeDateTimeFormat=f,ne.getNumberFormat=N,ne.setNumberFormat=z,ne.mergeNumberFormat=ye,ne[fi]=r,ne[vr]=bt,ne[_r]=Gt,ne[br]=ct,ne}function Wg(e){const t=U(e.locale)?e.locale:Vt,n=U(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:t,r=pe(e.missing)?e.missing:void 0,s=ae(e.silentTranslationWarn)||mt(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,a=ae(e.silentFallbackWarn)||mt(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,i=ae(e.fallbackRoot)?e.fallbackRoot:!0,o=!!e.formatFallbackMessages,l=te(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,u=pe(e.postTranslation)?e.postTranslation:void 0,h=U(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,d=!!e.escapeParameterHtml,g=ae(e.sync)?e.sync:!0;let E=e.messages;if(te(e.sharedMessages)){const T=e.sharedMessages;E=Object.keys(T).reduce((D,R)=>{const de=D[R]||(D[R]={});return Me(de,T[R]),D},E||{})}const{__i18n:_,__root:b,__injectWithOption:M}=e,W=e.datetimeFormats,y=e.numberFormats,L=e.flatJson,A=e.translateExistCompatible;return{locale:t,fallbackLocale:n,messages:E,flatJson:L,datetimeFormats:W,numberFormats:y,missing:r,missingWarn:s,fallbackWarn:a,fallbackRoot:i,fallbackFormat:o,modifiers:l,pluralRules:c,postTranslation:u,warnHtmlMessage:h,escapeParameter:d,messageResolver:e.messageResolver,inheritLocale:g,translateExistCompatible:A,__i18n:_,__root:b,__injectWithOption:M}}function kr(e={},t){{const n=Dr(Wg(e)),{__extender:r}=e,s={id:n.id,get locale(){return n.locale.value},set locale(a){n.locale.value=a},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(a){n.fallbackLocale.value=a},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get formatter(){return{interpolate(){return[]}}},set formatter(a){},get missing(){return n.getMissingHandler()},set missing(a){n.setMissingHandler(a)},get silentTranslationWarn(){return ae(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(a){n.missingWarn=ae(a)?!a:a},get silentFallbackWarn(){return ae(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(a){n.fallbackWarn=ae(a)?!a:a},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(a){n.fallbackFormat=a},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(a){n.setPostTranslationHandler(a)},get sync(){return n.inheritLocale},set sync(a){n.inheritLocale=a},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(a){n.warnHtmlMessage=a!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(a){n.escapeParameter=a},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(a){},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...a){const[i,o,l]=a,c={};let u=null,h=null;if(!U(i))throw Ce(Te.INVALID_ARGUMENT);const d=i;return U(o)?c.locale=o:ve(o)?u=o:te(o)&&(h=o),ve(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},rt(...a){return Reflect.apply(n.rt,n,[...a])},tc(...a){const[i,o,l]=a,c={plural:1};let u=null,h=null;if(!U(i))throw Ce(Te.INVALID_ARGUMENT);const d=i;return U(o)?c.locale=o:Ie(o)?c.plural=o:ve(o)?u=o:te(o)&&(h=o),U(l)?c.locale=l:ve(l)?u=l:te(l)&&(h=l),Reflect.apply(n.t,n,[d,u||h||{},c])},te(a,i){return n.te(a,i)},tm(a){return n.tm(a)},getLocaleMessage(a){return n.getLocaleMessage(a)},setLocaleMessage(a,i){n.setLocaleMessage(a,i)},mergeLocaleMessage(a,i){n.mergeLocaleMessage(a,i)},d(...a){return Reflect.apply(n.d,n,[...a])},getDateTimeFormat(a){return n.getDateTimeFormat(a)},setDateTimeFormat(a,i){n.setDateTimeFormat(a,i)},mergeDateTimeFormat(a,i){n.mergeDateTimeFormat(a,i)},n(...a){return Reflect.apply(n.n,n,[...a])},getNumberFormat(a){return n.getNumberFormat(a)},setNumberFormat(a,i){n.setNumberFormat(a,i)},mergeNumberFormat(a,i){n.mergeNumberFormat(a,i)},getChoiceIndex(a,i){return-1}};return s.__extender=r,s}}const xr={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function jg({slots:e},t){return t.length===1&&t[0]==="default"?(e.default?e.default():[]).reduce((r,s)=>[...r,...s.type===ge?s.children:[s]],[]):t.reduce((n,r)=>{const s=e[r];return s&&(n[r]=s()),n},{})}function vi(e){return ge}const Kg=H({name:"i18n-t",props:Me({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Ie(e)||!isNaN(e)}},xr),setup(e,t){const{slots:n,attrs:r}=t,s=e.i18n||Bn({useScope:e.scope,__useComponent:!0});return()=>{const a=Object.keys(n).filter(h=>h!=="_"),i={};e.locale&&(i.locale=e.locale),e.plural!==void 0&&(i.plural=U(e.plural)?+e.plural:e.plural);const o=jg(t,a),l=s[vr](e.keypath,o,i),c=Me({},r),u=U(e.tag)||ue(e.tag)?e.tag:vi();return Ft(u,c,l)}}}),Ha=Kg;function Gg(e){return ve(e)&&!U(e[0])}function _i(e,t,n,r){const{slots:s,attrs:a}=t;return()=>{const i={part:!0};let o={};e.locale&&(i.locale=e.locale),U(e.format)?i.key=e.format:ue(e.format)&&(U(e.format.key)&&(i.key=e.format.key),o=Object.keys(e.format).reduce((d,g)=>n.includes(g)?Me({},d,{[g]:e.format[g]}):d,{}));const l=r(e.value,i,o);let c=[i.key];ve(l)?c=l.map((d,g)=>{const E=s[d.type],_=E?E({[d.type]:d.value,index:g,parts:l}):[d.value];return Gg(_)&&(_[0].key=`${d.type}-${g}`),_}):U(l)&&(c=[l]);const u=Me({},a),h=U(e.tag)||ue(e.tag)?e.tag:vi();return Ft(h,u,c)}}const Yg=H({name:"i18n-n",props:Me({value:{type:Number,required:!0},format:{type:[String,Object]}},xr),setup(e,t){const n=e.i18n||Bn({useScope:e.scope,__useComponent:!0});return _i(e,t,ui,(...r)=>n[br](...r))}}),Ua=Yg,zg=H({name:"i18n-d",props:Me({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},xr),setup(e,t){const n=e.i18n||Bn({useScope:e.scope,__useComponent:!0});return _i(e,t,ci,(...r)=>n[_r](...r))}}),Ba=zg;function Xg(e,t){const n=e;if(e.mode==="composition")return n.__getInstance(t)||e.global;{const r=n.__getInstance(t);return r!=null?r.__composer:e.global.__composer}}function qg(e){const t=i=>{const{instance:o,modifiers:l,value:c}=i;if(!o||!o.$)throw Ce(Te.UNEXPECTED_ERROR);const u=Xg(e,o.$),h=Wa(c);return[Reflect.apply(u.t,u,[...ja(h)]),u]};return{created:(i,o)=>{const[l,c]=t(o);On&&e.global===c&&(i.__i18nWatcher=Le(c.locale,()=>{o.instance&&o.instance.$forceUpdate()})),i.__composer=c,i.textContent=l},unmounted:i=>{On&&i.__i18nWatcher&&(i.__i18nWatcher(),i.__i18nWatcher=void 0,delete i.__i18nWatcher),i.__composer&&(i.__composer=void 0,delete i.__composer)},beforeUpdate:(i,{value:o})=>{if(i.__composer){const l=i.__composer,c=Wa(o);i.textContent=Reflect.apply(l.t,l,[...ja(c)])}},getSSRProps:i=>{const[o]=t(i);return{textContent:o}}}}function Wa(e){if(U(e))return{path:e};if(te(e)){if(!("path"in e))throw Ce(Te.REQUIRED_VALUE,"path");return e}else throw Ce(Te.INVALID_VALUE)}function ja(e){const{path:t,locale:n,args:r,choice:s,plural:a}=e,i={},o=r||{};return U(n)&&(i.locale=n),Ie(s)&&(i.plural=s),Ie(a)&&(i.plural=a),[t,o,i]}function Jg(e,t,...n){const r=te(n[0])?n[0]:{},s=!!r.useI18nComponentName;(ae(r.globalInstall)?r.globalInstall:!0)&&([s?"i18n":Ha.name,"I18nT"].forEach(i=>e.component(i,Ha)),[Ua.name,"I18nN"].forEach(i=>e.component(i,Ua)),[Ba.name,"I18nD"].forEach(i=>e.component(i,Ba))),e.directive("t",qg(t))}function Qg(e,t,n){return{beforeCreate(){const r=Dt();if(!r)throw Ce(Te.UNEXPECTED_ERROR);const s=this.$options;if(s.i18n){const a=s.i18n;if(s.__i18n&&(a.__i18n=s.__i18n),a.__root=t,this===this.$root)this.$i18n=Ka(e,a);else{a.__injectWithOption=!0,a.__extender=n.__vueI18nExtend,this.$i18n=kr(a);const i=this.$i18n;i.__extender&&(i.__disposer=i.__extender(this.$i18n))}}else if(s.__i18n)if(this===this.$root)this.$i18n=Ka(e,s);else{this.$i18n=kr({__i18n:s.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:t});const a=this.$i18n;a.__extender&&(a.__disposer=a.__extender(this.$i18n))}else this.$i18n=e;s.__i18nGlobal&&gi(t,s,s),this.$t=(...a)=>this.$i18n.t(...a),this.$rt=(...a)=>this.$i18n.rt(...a),this.$tc=(...a)=>this.$i18n.tc(...a),this.$te=(a,i)=>this.$i18n.te(a,i),this.$d=(...a)=>this.$i18n.d(...a),this.$n=(...a)=>this.$i18n.n(...a),this.$tm=a=>this.$i18n.tm(a),n.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=Dt();if(!r)throw Ce(Te.UNEXPECTED_ERROR);const s=this.$i18n;delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,s.__disposer&&(s.__disposer(),delete s.__disposer,delete s.__extender),n.__deleteInstance(r),delete this.$i18n}}}function Ka(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[mi](t.pluralizationRules||e.pluralizationRules);const n=Un(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(n).forEach(r=>e.mergeLocaleMessage(r,n[r])),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,t.datetimeFormats[r])),t.numberFormats&&Object.keys(t.numberFormats).forEach(r=>e.mergeNumberFormat(r,t.numberFormats[r])),e}const Zg=vt("global-vue-i18n");function e0(e={},t){const n=__VUE_I18N_LEGACY_API__&&ae(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,r=ae(e.globalInjection)?e.globalInjection:!0,s=__VUE_I18N_LEGACY_API__&&n?!!e.allowComposition:!0,a=new Map,[i,o]=t0(e,n),l=vt("");function c(d){return a.get(d)||null}function u(d,g){a.set(d,g)}function h(d){a.delete(d)}{const d={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},get allowComposition(){return s},async install(g,...E){if(g.__VUE_I18N_SYMBOL__=l,g.provide(g.__VUE_I18N_SYMBOL__,d),te(E[0])){const M=E[0];d.__composerExtend=M.__composerExtend,d.__vueI18nExtend=M.__vueI18nExtend}let _=null;!n&&r&&(_=u0(g,d.global)),__VUE_I18N_FULL_INSTALL__&&Jg(g,d,...E),__VUE_I18N_LEGACY_API__&&n&&g.mixin(Qg(o,o.__composer,d));const b=g.unmount;g.unmount=()=>{_&&_(),d.dispose(),b()}},get global(){return o},dispose(){i.stop()},__instances:a,__getInstance:c,__setInstance:u,__deleteInstance:h};return d}}function Bn(e={}){const t=Dt();if(t==null)throw Ce(Te.MUST_BE_CALL_SETUP_TOP);if(!t.isCE&&t.appContext.app!=null&&!t.appContext.app.__VUE_I18N_SYMBOL__)throw Ce(Te.NOT_INSTALLED);const n=n0(t),r=a0(n),s=pi(t),a=r0(e,s);if(__VUE_I18N_LEGACY_API__&&n.mode==="legacy"&&!e.__useComponent){if(!n.allowComposition)throw Ce(Te.NOT_AVAILABLE_IN_LEGACY_MODE);return l0(t,a,r,e)}if(a==="global")return gi(r,e,s),r;if(a==="parent"){let l=s0(n,t,e.__useComponent);return l==null&&(l=r),l}const i=n;let o=i.__getInstance(t);if(o==null){const l=Me({},e);"__i18n"in s&&(l.__i18n=s.__i18n),r&&(l.__root=r),o=Dr(l),i.__composerExtend&&(o[yr]=i.__composerExtend(o)),o0(i,t,o),i.__setInstance(t,o)}return o}function t0(e,t,n){const r=Hi();{const s=__VUE_I18N_LEGACY_API__&&t?r.run(()=>kr(e)):r.run(()=>Dr(e));if(s==null)throw Ce(Te.UNEXPECTED_ERROR);return[r,s]}}function n0(e){{const t=Ut(e.isCE?Zg:e.appContext.app.__VUE_I18N_SYMBOL__);if(!t)throw Ce(e.isCE?Te.NOT_INSTALLED_WITH_PROVIDE:Te.UNEXPECTED_ERROR);return t}}function r0(e,t){return xn(e)?"__i18n"in t?"local":"global":e.useScope?e.useScope:"local"}function a0(e){return e.mode==="composition"?e.global:e.global.__composer}function s0(e,t,n=!1){let r=null;const s=t.root;let a=i0(t,n);for(;a!=null;){const i=e;if(e.mode==="composition")r=i.__getInstance(a);else if(__VUE_I18N_LEGACY_API__){const o=i.__getInstance(a);o!=null&&(r=o.__composer,n&&r&&!r[fi]&&(r=null))}if(r!=null||s===a)break;a=a.parent}return r}function i0(e,t=!1){return e==null?null:t&&e.vnode.ctx||e.parent}function o0(e,t,n){Ke(()=>{},t),Nn(()=>{const r=n;e.__deleteInstance(t);const s=r[yr];s&&(s(),delete r[yr])},t)}function l0(e,t,n,r={}){const s=t==="local",a=Mn(null);if(s&&e.proxy&&!(e.proxy.$options.i18n||e.proxy.$options.__i18n))throw Ce(Te.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);const i=ae(r.inheritLocale)?r.inheritLocale:!U(r.locale),o=X(!s||i?n.locale.value:U(r.locale)?r.locale:Vt),l=X(!s||i?n.fallbackLocale.value:U(r.fallbackLocale)||ve(r.fallbackLocale)||te(r.fallbackLocale)||r.fallbackLocale===!1?r.fallbackLocale:o.value),c=X(Un(o.value,r)),u=X(te(r.datetimeFormats)?r.datetimeFormats:{[o.value]:{}}),h=X(te(r.numberFormats)?r.numberFormats:{[o.value]:{}}),d=s?n.missingWarn:ae(r.missingWarn)||mt(r.missingWarn)?r.missingWarn:!0,g=s?n.fallbackWarn:ae(r.fallbackWarn)||mt(r.fallbackWarn)?r.fallbackWarn:!0,E=s?n.fallbackRoot:ae(r.fallbackRoot)?r.fallbackRoot:!0,_=!!r.fallbackFormat,b=pe(r.missing)?r.missing:null,M=pe(r.postTranslation)?r.postTranslation:null,W=s?n.warnHtmlMessage:ae(r.warnHtmlMessage)?r.warnHtmlMessage:!0,y=!!r.escapeParameter,L=s?n.modifiers:te(r.modifiers)?r.modifiers:{},A=r.pluralRules||s&&n.pluralRules;function T(){return[o.value,l.value,c.value,u.value,h.value]}const $=V({get:()=>a.value?a.value.locale.value:o.value,set:F=>{a.value&&(a.value.locale.value=F),o.value=F}}),D=V({get:()=>a.value?a.value.fallbackLocale.value:l.value,set:F=>{a.value&&(a.value.fallbackLocale.value=F),l.value=F}}),R=V(()=>a.value?a.value.messages.value:c.value),de=V(()=>u.value),ke=V(()=>h.value);function Z(){return a.value?a.value.getPostTranslationHandler():M}function x(F){a.value&&a.value.setPostTranslationHandler(F)}function oe(){return a.value?a.value.getMissingHandler():b}function Ee(F){a.value&&a.value.setMissingHandler(F)}function Oe(F){return T(),F()}function _e(...F){return a.value?Oe(()=>Reflect.apply(a.value.t,null,[...F])):Oe(()=>"")}function He(...F){return a.value?Reflect.apply(a.value.rt,null,[...F]):""}function et(...F){return a.value?Oe(()=>Reflect.apply(a.value.d,null,[...F])):Oe(()=>"")}function be(...F){return a.value?Oe(()=>Reflect.apply(a.value.n,null,[...F])):Oe(()=>"")}function we(F){return a.value?a.value.tm(F):{}}function Ue(F,ce){return a.value?a.value.te(F,ce):!1}function j(F){return a.value?a.value.getLocaleMessage(F):{}}function le(F,ce){a.value&&(a.value.setLocaleMessage(F,ce),c.value[F]=ce)}function ie(F,ce){a.value&&a.value.mergeLocaleMessage(F,ce)}function he(F){return a.value?a.value.getDateTimeFormat(F):{}}function De(F,ce){a.value&&(a.value.setDateTimeFormat(F,ce),u.value[F]=ce)}function Ge(F,ce){a.value&&a.value.mergeDateTimeFormat(F,ce)}function bt(F){return a.value?a.value.getNumberFormat(F):{}}function ct(F,ce){a.value&&(a.value.setNumberFormat(F,ce),h.value[F]=ce)}function Gt(F,ce){a.value&&a.value.mergeNumberFormat(F,ce)}const Yt={get id(){return a.value?a.value.id:-1},locale:$,fallbackLocale:D,messages:R,datetimeFormats:de,numberFormats:ke,get inheritLocale(){return a.value?a.value.inheritLocale:i},set inheritLocale(F){a.value&&(a.value.inheritLocale=F)},get availableLocales(){return a.value?a.value.availableLocales:Object.keys(c.value)},get modifiers(){return a.value?a.value.modifiers:L},get pluralRules(){return a.value?a.value.pluralRules:A},get isGlobal(){return a.value?a.value.isGlobal:!1},get missingWarn(){return a.value?a.value.missingWarn:d},set missingWarn(F){a.value&&(a.value.missingWarn=F)},get fallbackWarn(){return a.value?a.value.fallbackWarn:g},set fallbackWarn(F){a.value&&(a.value.missingWarn=F)},get fallbackRoot(){return a.value?a.value.fallbackRoot:E},set fallbackRoot(F){a.value&&(a.value.fallbackRoot=F)},get fallbackFormat(){return a.value?a.value.fallbackFormat:_},set fallbackFormat(F){a.value&&(a.value.fallbackFormat=F)},get warnHtmlMessage(){return a.value?a.value.warnHtmlMessage:W},set warnHtmlMessage(F){a.value&&(a.value.warnHtmlMessage=F)},get escapeParameter(){return a.value?a.value.escapeParameter:y},set escapeParameter(F){a.value&&(a.value.escapeParameter=F)},t:_e,getPostTranslationHandler:Z,setPostTranslationHandler:x,getMissingHandler:oe,setMissingHandler:Ee,rt:He,d:et,n:be,tm:we,te:Ue,getLocaleMessage:j,setLocaleMessage:le,mergeLocaleMessage:ie,getDateTimeFormat:he,setDateTimeFormat:De,mergeDateTimeFormat:Ge,getNumberFormat:bt,setNumberFormat:ct,mergeNumberFormat:Gt};function zt(F){F.locale.value=o.value,F.fallbackLocale.value=l.value,Object.keys(c.value).forEach(ce=>{F.mergeLocaleMessage(ce,c.value[ce])}),Object.keys(u.value).forEach(ce=>{F.mergeDateTimeFormat(ce,u.value[ce])}),Object.keys(h.value).forEach(ce=>{F.mergeNumberFormat(ce,h.value[ce])}),F.escapeParameter=y,F.fallbackFormat=_,F.fallbackRoot=E,F.fallbackWarn=g,F.missingWarn=d,F.warnHtmlMessage=W}return Ui(()=>{if(e.proxy==null||e.proxy.$i18n==null)throw Ce(Te.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const F=a.value=e.proxy.$i18n.__composer;t==="global"?(o.value=F.locale.value,l.value=F.fallbackLocale.value,c.value=F.messages.value,u.value=F.datetimeFormats.value,h.value=F.numberFormats.value):s&&zt(F)}),Yt}const c0=["locale","fallbackLocale","availableLocales"],Ga=["t","rt","d","n","tm","te"];function u0(e,t){const n=Object.create(null);return c0.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a)throw Ce(Te.UNEXPECTED_ERROR);const i=Bi(a.value)?{get(){return a.value.value},set(o){a.value.value=o}}:{get(){return a.get&&a.get()}};Object.defineProperty(n,s,i)}),e.config.globalProperties.$i18n=n,Ga.forEach(s=>{const a=Object.getOwnPropertyDescriptor(t,s);if(!a||!a.value)throw Ce(Te.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${s}`,a)}),()=>{delete e.config.globalProperties.$i18n,Ga.forEach(s=>{delete e.config.globalProperties[`$${s}`]})}}Hg();__INTLIFY_JIT_COMPILATION__?Sa($g):Sa(Pg);Eg(sg);Sg(Zs);if(__INTLIFY_PROD_DEVTOOLS__){const e=st();e.__INTLIFY__=!0,fg(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const bi=()=>{const e=Ut("$env"),{t,locale:n}=Bn();return{locale:n,$env:e,t}},d0={class:"text-slate-600 text-base mt-2"},h0={class:"flex flex-row justify-start items-start mt-4"},m0={class:"relative h-14"},f0=["label","status"],p0={key:0,class:"absolute bottom-0 left-0 text-sm text-[#ff4d4f]"},g0={class:"text-[#3451b2] text-base"},v0=H({__name:"TOTP",setup(e){const{t,$env:n,locale:r}=bi(),s=X(""),a=X(At.NORMAL),i=X(""),o=X({code:"",expires:""}),l=u=>{s.value=u.detail.value,a.value=At.NORMAL},c=()=>{if(s.value.length<=0)i.value=t("components_totp_3"),a.value=At.ERROR;else try{const{otp:u,expires:h}=Zf.generate(s.value);o.value.code=u,o.value.expires=np(h).format()}catch{i.value=t("components_totp_5"),a.value=At.ERROR}};return(u,h)=>(p(),I("div",null,[w("div",d0,re(v(t)("components_totp_6")),1),w("div",h0,[w("div",m0,[w("r-input",{label:v(t)("components_totp_2"),class:"w-64 h-8 rounded-lg block text-lg",status:a.value,onInput:l},null,40,f0),a.value===v(At).ERROR?(p(),I("div",p0,re(i.value),1)):G("",!0)]),w("r-button",{class:"ml-1 h-8",onClick:c},re(v(t)("components_totp_1")),1)]),w("div",g0,[w("div",null,"code: "+re(o.value.code),1),w("div",null,re(v(t)("components_totp_4"))+": "+re(o.value.expires),1)])]))}}),yi=hr.locale,Rt=e0({legacy:!1,locale:yi,fallbackLocale:cn.EN,messages:lp,devtools:!1}),Qn=e=>(Rt.mode===Ks.LEGACY?Rt.global.locale=e:Rt.global.locale.value=e,e),_0=(e,t=yi)=>{Rt.global.mergeLocaleMessage(t,e)},ki=e=>e?Rt.global.locale===e||da.includes(e)?Promise.resolve(Qn(e)):ji(Object.assign({"./en.json":()=>wn(()=>import("./en.Bkn4-Vvy.js"),[]),"./zh-CN.json":()=>wn(()=>import("./zh-CN.PUkQxDBJ.js"),[])}),`./${e}.json`,2).then(t=>(_0(t.default,e),da.push(e),Qn(e))):Promise.reject("lang is undefined"),b0=H({__name:"Layout",setup(e){const{$env:t,locale:n}=bi(),{lang:r}=bn(),s=()=>{const a=r.value||cn.EN;n.value=a,t.locale=a,ki(a).catch(i=>{console.log("error",i)}),ep(js,a)};return ft(()=>{s()}),Ke(()=>{sp()}),(a,i)=>(p(),q(v(Ts).Layout))}}),y0=()=>{wn(()=>import("./pwa-install.es.BZyo4fnY.js"),[]).then(()=>{let e=document.getElementById(ha);e||(e=document.createElement(cp),e.setAttribute("manifest-url",up),e.setAttribute("id",ha),document.body.appendChild(e))})},T0={extends:Ts,enhanceApp({app:e,router:t,siteData:n}){wn(()=>import("./index.Jlax9Txa.js").then(s=>s.i),__vite__mapDeps([0,1])),y0(),e.use(hp);const r=tp(js)||cn.EN;ki(r).then(()=>{ap("__VUE_PROD_DEVTOOLS__",!1),e.use(Rt),e.component("Layout",b0),e.component("TOTP",v0)}).catch(s=>{console.log("error",s)})}};export{T0 as R};
