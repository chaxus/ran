const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/index.Dk0BAPAJ.js","assets/chunks/framework.BvvoErfm.js"])))=>i.map(i=>d[i]);
import{d as V,o as h,c as C,r as S,a as qe,t as se,n as de,b as X,w as A,e as G,T as Cn,_ as q,u as vn,i as hi,f as gi,g as In,h as U,j as w,k as g,l as Lt,m as Qn,p as z,q as ke,s as ft,v as We,x as An,y as kr,z as vi,A as _i,B as ht,F as ge,C as Me,D as Tn,E as Nn,G as Y,H as Ks,I as Ye,J as nn,K as dt,L as Ut,M as bi,N as Gs,O as yi,P as at,Q as Ys,R as Mn,S as ki,U as Zt,V as wr,W as Pn,X as wi,Y as _n,Z as bn,$ as Li,a0 as $t,a1 as zs,a2 as Xs,a3 as Ft,a4 as Ei,a5 as Si,a6 as Oi,a7 as Ci,a8 as Js,a9 as Ii,aa as Ai,ab as Ti,ac as Ni,ad as Mi,ae as Pi,af as Ri,ag as $i,ah as Fi,ai as yn}from"./framework.BvvoErfm.js";const xi=V({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(e){return(t,n)=>(h(),C("span",{class:de(["VPBadge",t.type])},[S(t.$slots,"default",{},()=>[qe(se(t.text),1)])],2))}}),Di={key:0,class:"VPBackdrop"},Vi=V({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(e){return(t,n)=>(h(),X(Cn,{name:"fade"},{default:A(()=>[t.show?(h(),C("div",Di)):G("",!0)]),_:1}))}}),Ui=q(Vi,[["__scopeId","data-v-aa2f5bb7"]]),ie=vn;function Hi(e,t){let n,r=!1;return()=>{n&&clearTimeout(n),r?n=setTimeout(e,t):(e(),(r=!0)&&setTimeout(()=>r=!1,t))}}function Zn(e){return/^\//.test(e)?e:`/${e}`}function Lr(e){const{pathname:t,search:n,hash:r,protocol:a}=new URL(e,"http://a.com");if(hi(e)||e.startsWith("#")||!a.startsWith("http")||!gi(t))return e;const{site:s}=ie(),i=t.endsWith("/")||t.endsWith(".html")?e:e.replace(/(?:(^\.+)\/)?.*$/,`$1${t.replace(/(\.md)?$/,s.value.cleanUrls?"":".html")}${n}${r}`);return In(i)}function rn({correspondingLink:e=!1}={}){const{site:t,localeIndex:n,page:r,theme:a,hash:s}=ie(),i=U(()=>{var l,c;return{label:(l=t.value.locales[n.value])==null?void 0:l.label,link:((c=t.value.locales[n.value])==null?void 0:c.link)||(n.value==="root"?"/":`/${n.value}/`)}});return{localeLinks:U(()=>Object.entries(t.value.locales).flatMap(([l,c])=>i.value.label===c.label?[]:{text:c.label,link:Bi(c.link||(l==="root"?"/":`/${l}/`),a.value.i18nRouting!==!1&&e,r.value.relativePath.slice(i.value.link.length-1),!t.value.cleanUrls)+s.value})),currentLang:i}}function Bi(e,t,n,r){return t?e.replace(/\/$/,"")+Zn(n.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,r?".html":"")):e}const Wi={class:"NotFound"},ji={class:"code"},Ki={class:"title"},Gi={class:"quote"},Yi={class:"action"},zi=["href","aria-label"],Xi=V({__name:"NotFound",setup(e){const{theme:t}=ie(),{currentLang:n}=rn();return(r,a)=>{var s,i,o,l,c;return h(),C("div",Wi,[w("p",ji,se(((s=g(t).notFound)==null?void 0:s.code)??"404"),1),w("h1",Ki,se(((i=g(t).notFound)==null?void 0:i.title)??"PAGE NOT FOUND"),1),a[0]||(a[0]=w("div",{class:"divider"},null,-1)),w("blockquote",Gi,se(((o=g(t).notFound)==null?void 0:o.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),w("div",Yi,[w("a",{class:"link",href:g(In)(g(n).link),"aria-label":((l=g(t).notFound)==null?void 0:l.linkLabel)??"go to home"},se(((c=g(t).notFound)==null?void 0:c.linkText)??"Take me home"),9,zi)])])}}}),Ji=q(Xi,[["__scopeId","data-v-46f27357"]]);function qs(e,t){if(Array.isArray(e))return pn(e);if(e==null)return[];t=Zn(t);const n=Object.keys(e).sort((a,s)=>s.split("/").length-a.split("/").length).find(a=>t.startsWith(Zn(a))),r=n?e[n]:[];return Array.isArray(r)?pn(r):pn(r.items,r.base)}function qi(e){const t=[];let n=0;for(const r in e){const a=e[r];if(a.items){n=t.push(a);continue}t[n]||t.push({items:[]}),t[n].items.push(a)}return t}function Qi(e){const t=[];function n(r){for(const a of r)a.text&&a.link&&t.push({text:a.text,link:a.link,docFooterText:a.docFooterText}),a.items&&n(a.items)}return n(e),t}function er(e,t){return Array.isArray(t)?t.some(n=>er(e,n)):Lt(e,t.link)?!0:t.items?er(e,t.items):!1}function pn(e,t){return[...e].map(n=>{const r={...n},a=r.base||t;return a&&r.link&&(r.link=a+r.link),r.items&&(r.items=pn(r.items,a)),r})}function ot(){const{frontmatter:e,page:t,theme:n}=ie(),r=Qn("(min-width: 960px)"),a=z(!1),s=U(()=>{const _=n.value.sidebar,b=t.value.relativePath;return _?qs(_,b):[]}),i=z(s.value);ke(s,(_,b)=>{JSON.stringify(_)!==JSON.stringify(b)&&(i.value=s.value)});const o=U(()=>e.value.sidebar!==!1&&i.value.length>0&&e.value.layout!=="home"),l=U(()=>c?e.value.aside==null?n.value.aside==="left":e.value.aside==="left":!1),c=U(()=>e.value.layout==="home"?!1:e.value.aside!=null?!!e.value.aside:n.value.aside!==!1),u=U(()=>o.value&&r.value),m=U(()=>o.value?qi(i.value):[]);function d(){a.value=!0}function v(){a.value=!1}function E(){a.value?v():d()}return{isOpen:a,sidebar:i,sidebarGroups:m,hasSidebar:o,hasAside:c,leftAside:l,isSidebarEnabled:u,open:d,close:v,toggle:E}}function Zi(e,t){let n;ft(()=>{n=e.value?document.activeElement:void 0}),We(()=>{window.addEventListener("keyup",r)}),An(()=>{window.removeEventListener("keyup",r)});function r(a){a.key==="Escape"&&e.value&&(t(),n==null||n.focus())}}function eo(e){const{page:t,hash:n}=ie(),r=z(!1),a=U(()=>e.value.collapsed!=null),s=U(()=>!!e.value.link),i=z(!1),o=()=>{i.value=Lt(t.value.relativePath,e.value.link)};ke([t,e,n],o),We(o);const l=U(()=>i.value?!0:e.value.items?er(t.value.relativePath,e.value.items):!1),c=U(()=>!!(e.value.items&&e.value.items.length));ft(()=>{r.value=!!(a.value&&e.value.collapsed)}),kr(()=>{(i.value||l.value)&&(r.value=!1)});function u(){a.value&&(r.value=!r.value)}return{collapsed:r,collapsible:a,isLink:s,isActiveLink:i,hasActiveLink:l,hasChildren:c,toggle:u}}function to(){const{hasSidebar:e}=ot(),t=Qn("(min-width: 960px)"),n=Qn("(min-width: 1280px)");return{isAsideEnabled:U(()=>!n.value&&!t.value?!1:e.value?n.value:t.value)}}const tr=[];function Qs(e){return typeof e.outline=="object"&&!Array.isArray(e.outline)&&e.outline.label||e.outlineTitle||"On this page"}function Er(e){const t=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(n=>n.id&&n.hasChildNodes()).map(n=>{const r=Number(n.tagName[1]);return{element:n,title:no(n),link:"#"+n.id,level:r}});return ro(t,e)}function no(e){let t="";for(const n of e.childNodes)if(n.nodeType===1){if(n.classList.contains("VPBadge")||n.classList.contains("header-anchor")||n.classList.contains("ignore-header"))continue;t+=n.textContent}else n.nodeType===3&&(t+=n.textContent);return t.trim()}function ro(e,t){if(t===!1)return[];const n=(typeof t=="object"&&!Array.isArray(t)?t.level:t)||2,[r,a]=typeof n=="number"?[n,n]:n==="deep"?[2,6]:n;e=e.filter(i=>i.level>=r&&i.level<=a),tr.length=0;for(const{element:i,link:o}of e)tr.push({element:i,link:o});const s=[];e:for(let i=0;i<e.length;i++){const o=e[i];if(i===0)s.push(o);else{for(let l=i-1;l>=0;l--){const c=e[l];if(c.level<o.level){(c.children||(c.children=[])).push(o);continue e}}s.push(o)}}return s}function so(e,t){const{isAsideEnabled:n}=to(),r=Hi(s,100);let a=null;We(()=>{requestAnimationFrame(s),window.addEventListener("scroll",r)}),vi(()=>{i(location.hash)}),An(()=>{window.removeEventListener("scroll",r)});function s(){if(!n.value)return;const o=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,u=Math.abs(o+l-c)<1,m=tr.map(({element:v,link:E})=>({link:E,top:ao(v)})).filter(({top:v})=>!Number.isNaN(v)).sort((v,E)=>v.top-E.top);if(!m.length){i(null);return}if(o<1){i(null);return}if(u){i(m[m.length-1].link);return}let d=null;for(const{link:v,top:E}of m){if(E>o+_i()+4)break;d=v}i(d)}function i(o){a&&a.classList.remove("active"),o==null?a=null:a=e.value.querySelector(`a[href="${decodeURIComponent(o)}"]`);const l=a;l?(l.classList.add("active"),t.value.style.top=l.offsetTop+39+"px",t.value.style.opacity="1"):(t.value.style.top="33px",t.value.style.opacity="0")}}function ao(e){let t=0;for(;e!==document.body;){if(e===null)return NaN;t+=e.offsetTop,e=e.offsetParent}return t}const io=["href","title"],oo=V({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(e){function t({target:n}){const r=n.href.split("#")[1],a=document.getElementById(decodeURIComponent(r));a==null||a.focus({preventScroll:!0})}return(n,r)=>{const a=ht("VPDocOutlineItem",!0);return h(),C("ul",{class:de(["VPDocOutlineItem",n.root?"root":"nested"])},[(h(!0),C(ge,null,Me(n.headers,({children:s,link:i,title:o})=>(h(),C("li",null,[w("a",{class:"outline-link",href:i,onClick:t,title:o},se(o),9,io),s!=null&&s.length?(h(),X(a,{key:0,headers:s},null,8,["headers"])):G("",!0)]))),256))],2)}}}),Zs=q(oo,[["__scopeId","data-v-fc78d431"]]),lo={class:"content"},co={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},uo=V({__name:"VPDocAsideOutline",setup(e){const{frontmatter:t,theme:n}=ie(),r=Tn([]);Nn(()=>{r.value=Er(t.value.outline??n.value.outline)});const a=z(),s=z();return so(a,s),(i,o)=>(h(),C("nav",{"aria-labelledby":"doc-outline-aria-label",class:de(["VPDocAsideOutline",{"has-outline":r.value.length>0}]),ref_key:"container",ref:a},[w("div",lo,[w("div",{class:"outline-marker",ref_key:"marker",ref:s},null,512),w("div",co,se(g(Qs)(g(n))),1),Y(Zs,{headers:r.value,root:!0},null,8,["headers"])])],2))}}),mo=q(uo,[["__scopeId","data-v-e95709bb"]]),po={class:"VPDocAsideCarbonAds"},fo=V({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(e){const t=()=>null;return(n,r)=>(h(),C("div",po,[Y(g(t),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),ho={class:"VPDocAside"},go=V({__name:"VPDocAside",setup(e){const{theme:t}=ie();return(n,r)=>(h(),C("div",ho,[S(n.$slots,"aside-top",{},void 0,!0),S(n.$slots,"aside-outline-before",{},void 0,!0),Y(mo),S(n.$slots,"aside-outline-after",{},void 0,!0),r[0]||(r[0]=w("div",{class:"spacer"},null,-1)),S(n.$slots,"aside-ads-before",{},void 0,!0),g(t).carbonAds?(h(),X(fo,{key:0,"carbon-ads":g(t).carbonAds},null,8,["carbon-ads"])):G("",!0),S(n.$slots,"aside-ads-after",{},void 0,!0),S(n.$slots,"aside-bottom",{},void 0,!0)]))}}),vo=q(go,[["__scopeId","data-v-4bbff643"]]);function _o(){const{theme:e,page:t}=ie();return U(()=>{const{text:n="Edit this page",pattern:r=""}=e.value.editLink||{};let a;return typeof r=="function"?a=r(t.value):a=r.replace(/:path/g,t.value.filePath),{url:a,text:n}})}function bo(){const{page:e,theme:t,frontmatter:n}=ie();return U(()=>{var c,u,m,d,v,E,_,b;const r=qs(t.value.sidebar,e.value.relativePath),a=Qi(r),s=yo(a,M=>M.link.replace(/[?#].*$/,"")),i=s.findIndex(M=>Lt(e.value.relativePath,M.link)),o=((c=t.value.docFooter)==null?void 0:c.prev)===!1&&!n.value.prev||n.value.prev===!1,l=((u=t.value.docFooter)==null?void 0:u.next)===!1&&!n.value.next||n.value.next===!1;return{prev:o?void 0:{text:(typeof n.value.prev=="string"?n.value.prev:typeof n.value.prev=="object"?n.value.prev.text:void 0)??((m=s[i-1])==null?void 0:m.docFooterText)??((d=s[i-1])==null?void 0:d.text),link:(typeof n.value.prev=="object"?n.value.prev.link:void 0)??((v=s[i-1])==null?void 0:v.link)},next:l?void 0:{text:(typeof n.value.next=="string"?n.value.next:typeof n.value.next=="object"?n.value.next.text:void 0)??((E=s[i+1])==null?void 0:E.docFooterText)??((_=s[i+1])==null?void 0:_.text),link:(typeof n.value.next=="object"?n.value.next.link:void 0)??((b=s[i+1])==null?void 0:b.link)}}})}function yo(e,t){const n=new Set;return e.filter(r=>{const a=t(r);return n.has(a)?!1:n.add(a)})}const ze=V({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.tag??(t.href?"a":"span")),r=U(()=>t.href&&Ks.test(t.href)||t.target==="_blank");return(a,s)=>(h(),X(Ye(n.value),{class:de(["VPLink",{link:a.href,"vp-external-link-icon":r.value,"no-icon":a.noIcon}]),href:a.href?g(Lr)(a.href):void 0,target:a.target??(r.value?"_blank":void 0),rel:a.rel??(r.value?"noreferrer":void 0)},{default:A(()=>[S(a.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),ko={class:"VPLastUpdated"},wo=["datetime"],Lo=V({__name:"VPDocFooterLastUpdated",setup(e){const{theme:t,page:n,lang:r}=ie(),a=U(()=>new Date(n.value.lastUpdated)),s=U(()=>a.value.toISOString()),i=z("");return We(()=>{ft(()=>{var o,l,c;i.value=new Intl.DateTimeFormat((l=(o=t.value.lastUpdated)==null?void 0:o.formatOptions)!=null&&l.forceLocale?r.value:void 0,((c=t.value.lastUpdated)==null?void 0:c.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(a.value)})}),(o,l)=>{var c;return h(),C("p",ko,[qe(se(((c=g(t).lastUpdated)==null?void 0:c.text)||g(t).lastUpdatedText||"Last updated")+": ",1),w("time",{datetime:s.value},se(i.value),9,wo)])}}}),Eo=q(Lo,[["__scopeId","data-v-3c231858"]]),So={key:0,class:"VPDocFooter"},Oo={key:0,class:"edit-info"},Co={key:0,class:"edit-link"},Io={key:1,class:"last-updated"},Ao={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},To={class:"pager"},No=["innerHTML"],Mo=["innerHTML"],Po={class:"pager"},Ro=["innerHTML"],$o=["innerHTML"],Fo=V({__name:"VPDocFooter",setup(e){const{theme:t,page:n,frontmatter:r}=ie(),a=_o(),s=bo(),i=U(()=>t.value.editLink&&r.value.editLink!==!1),o=U(()=>n.value.lastUpdated),l=U(()=>i.value||o.value||s.value.prev||s.value.next);return(c,u)=>{var m,d,v,E;return l.value?(h(),C("footer",So,[S(c.$slots,"doc-footer-before",{},void 0,!0),i.value||o.value?(h(),C("div",Oo,[i.value?(h(),C("div",Co,[Y(ze,{class:"edit-link-button",href:g(a).url,"no-icon":!0},{default:A(()=>[u[0]||(u[0]=w("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),qe(" "+se(g(a).text),1)]),_:1},8,["href"])])):G("",!0),o.value?(h(),C("div",Io,[Y(Eo)])):G("",!0)])):G("",!0),(m=g(s).prev)!=null&&m.link||(d=g(s).next)!=null&&d.link?(h(),C("nav",Ao,[u[1]||(u[1]=w("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),w("div",To,[(v=g(s).prev)!=null&&v.link?(h(),X(ze,{key:0,class:"pager-link prev",href:g(s).prev.link},{default:A(()=>{var _;return[w("span",{class:"desc",innerHTML:((_=g(t).docFooter)==null?void 0:_.prev)||"Previous page"},null,8,No),w("span",{class:"title",innerHTML:g(s).prev.text},null,8,Mo)]}),_:1},8,["href"])):G("",!0)]),w("div",Po,[(E=g(s).next)!=null&&E.link?(h(),X(ze,{key:0,class:"pager-link next",href:g(s).next.link},{default:A(()=>{var _;return[w("span",{class:"desc",innerHTML:((_=g(t).docFooter)==null?void 0:_.next)||"Next page"},null,8,Ro),w("span",{class:"title",innerHTML:g(s).next.text},null,8,$o)]}),_:1},8,["href"])):G("",!0)])])):G("",!0)])):G("",!0)}}}),xo=q(Fo,[["__scopeId","data-v-00ab7d08"]]),Do={class:"container"},Vo={class:"aside-container"},Uo={class:"aside-content"},Ho={class:"content"},Bo={class:"content-container"},Wo={class:"main"},jo=V({__name:"VPDoc",setup(e){const{theme:t}=ie(),n=nn(),{hasSidebar:r,hasAside:a,leftAside:s}=ot(),i=U(()=>n.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(o,l)=>{const c=ht("Content");return h(),C("div",{class:de(["VPDoc",{"has-sidebar":g(r),"has-aside":g(a)}])},[S(o.$slots,"doc-top",{},void 0,!0),w("div",Do,[g(a)?(h(),C("div",{key:0,class:de(["aside",{"left-aside":g(s)}])},[l[0]||(l[0]=w("div",{class:"aside-curtain"},null,-1)),w("div",Vo,[w("div",Uo,[Y(vo,null,{"aside-top":A(()=>[S(o.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(o.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(o.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):G("",!0),w("div",Ho,[w("div",Bo,[S(o.$slots,"doc-before",{},void 0,!0),w("main",Wo,[Y(c,{class:de(["vp-doc",[i.value,g(t).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),Y(xo,null,{"doc-footer-before":A(()=>[S(o.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),S(o.$slots,"doc-after",{},void 0,!0)])])]),S(o.$slots,"doc-bottom",{},void 0,!0)],2)}}}),Ko=q(jo,[["__scopeId","data-v-9f8645df"]]),Go=V({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(e){const t=e,n=U(()=>t.href&&Ks.test(t.href)),r=U(()=>t.tag||t.href?"a":"button");return(a,s)=>(h(),X(Ye(r.value),{class:de(["VPButton",[a.size,a.theme]]),href:a.href?g(Lr)(a.href):void 0,target:t.target??(n.value?"_blank":void 0),rel:t.rel??(n.value?"noreferrer":void 0)},{default:A(()=>[qe(se(a.text),1)]),_:1},8,["class","href","target","rel"]))}}),Yo=q(Go,[["__scopeId","data-v-bbea5d5d"]]),zo=["src","alt"],Xo=V({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(e){return(t,n)=>{const r=ht("VPImage",!0);return t.image?(h(),C(ge,{key:0},[typeof t.image=="string"||"src"in t.image?(h(),C("img",dt({key:0,class:"VPImage"},typeof t.image=="string"?t.$attrs:{...t.image,...t.$attrs},{src:g(In)(typeof t.image=="string"?t.image:t.image.src),alt:t.alt??(typeof t.image=="string"?"":t.image.alt||"")}),null,16,zo)):(h(),C(ge,{key:1},[Y(r,dt({class:"dark",image:t.image.dark,alt:t.image.alt},t.$attrs),null,16,["image","alt"]),Y(r,dt({class:"light",image:t.image.light,alt:t.image.alt},t.$attrs),null,16,["image","alt"])],64))],64)):G("",!0)}}}),kn=q(Xo,[["__scopeId","data-v-7b8f395d"]]),Jo={class:"container"},qo={class:"main"},Qo={key:0,class:"name"},Zo=["innerHTML"],el=["innerHTML"],tl=["innerHTML"],nl={key:0,class:"actions"},rl={key:0,class:"image"},sl={class:"image-container"},al=V({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(e){const t=Ut("hero-image-slot-exists");return(n,r)=>(h(),C("div",{class:de(["VPHero",{"has-image":n.image||g(t)}])},[w("div",Jo,[w("div",qo,[S(n.$slots,"home-hero-info-before",{},void 0,!0),S(n.$slots,"home-hero-info",{},()=>[n.name?(h(),C("h1",Qo,[w("span",{innerHTML:n.name,class:"clip"},null,8,Zo)])):G("",!0),n.text?(h(),C("p",{key:1,innerHTML:n.text,class:"text"},null,8,el)):G("",!0),n.tagline?(h(),C("p",{key:2,innerHTML:n.tagline,class:"tagline"},null,8,tl)):G("",!0)],!0),S(n.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(h(),C("div",nl,[(h(!0),C(ge,null,Me(n.actions,a=>(h(),C("div",{key:a.link,class:"action"},[Y(Yo,{tag:"a",size:"medium",theme:a.theme,text:a.text,href:a.link,target:a.target,rel:a.rel},null,8,["theme","text","href","target","rel"])]))),128))])):G("",!0),S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||g(t)?(h(),C("div",rl,[w("div",sl,[r[0]||(r[0]=w("div",{class:"image-bg"},null,-1)),S(n.$slots,"home-hero-image",{},()=>[n.image?(h(),X(kn,{key:0,class:"image-src",image:n.image},null,8,["image"])):G("",!0)],!0)])])):G("",!0)])],2))}}),il=q(al,[["__scopeId","data-v-0313f8fa"]]),ol=V({__name:"VPHomeHero",setup(e){const{frontmatter:t}=ie();return(n,r)=>g(t).hero?(h(),X(il,{key:0,class:"VPHomeHero",name:g(t).hero.name,text:g(t).hero.text,tagline:g(t).hero.tagline,image:g(t).hero.image,actions:g(t).hero.actions},{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before")]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info")]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after")]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after")]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):G("",!0)}}),ll={class:"box"},cl={key:0,class:"icon"},ul=["innerHTML"],dl=["innerHTML"],ml=["innerHTML"],pl={key:4,class:"link-text"},fl={class:"link-text-value"},hl=V({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(e){return(t,n)=>(h(),X(ze,{class:"VPFeature",href:t.link,rel:t.rel,target:t.target,"no-icon":!0,tag:t.link?"a":"div"},{default:A(()=>[w("article",ll,[typeof t.icon=="object"&&t.icon.wrap?(h(),C("div",cl,[Y(kn,{image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])])):typeof t.icon=="object"?(h(),X(kn,{key:1,image:t.icon,alt:t.icon.alt,height:t.icon.height||48,width:t.icon.width||48},null,8,["image","alt","height","width"])):t.icon?(h(),C("div",{key:2,class:"icon",innerHTML:t.icon},null,8,ul)):G("",!0),w("h2",{class:"title",innerHTML:t.title},null,8,dl),t.details?(h(),C("p",{key:3,class:"details",innerHTML:t.details},null,8,ml)):G("",!0),t.linkText?(h(),C("div",pl,[w("p",fl,[qe(se(t.linkText)+" ",1),n[0]||(n[0]=w("span",{class:"vpi-arrow-right link-text-icon"},null,-1))])])):G("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),gl=q(hl,[["__scopeId","data-v-ce15ebd4"]]),vl={key:0,class:"VPFeatures"},_l={class:"container"},bl={class:"items"},yl=V({__name:"VPFeatures",props:{features:{}},setup(e){const t=e,n=U(()=>{const r=t.features.length;if(r){if(r===2)return"grid-2";if(r===3)return"grid-3";if(r%3===0)return"grid-6";if(r>3)return"grid-4"}else return});return(r,a)=>r.features?(h(),C("div",vl,[w("div",_l,[w("div",bl,[(h(!0),C(ge,null,Me(r.features,s=>(h(),C("div",{key:s.title,class:de(["item",[n.value]])},[Y(gl,{icon:s.icon,title:s.title,details:s.details,link:s.link,"link-text":s.linkText,rel:s.rel,target:s.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):G("",!0)}}),kl=q(yl,[["__scopeId","data-v-b79e191c"]]),wl=V({__name:"VPHomeFeatures",setup(e){const{frontmatter:t}=ie();return(n,r)=>g(t).features?(h(),X(kl,{key:0,class:"VPHomeFeatures",features:g(t).features},null,8,["features"])):G("",!0)}}),Ll=V({__name:"VPHomeContent",setup(e){const{width:t}=bi({initialWidth:0,includeScrollbar:!1});return(n,r)=>(h(),C("div",{class:"vp-doc container",style:Gs(g(t)?{"--vp-offset":`calc(50% - ${g(t)/2}px)`}:{})},[S(n.$slots,"default",{},void 0,!0)],4))}}),El=q(Ll,[["__scopeId","data-v-269c2bad"]]),Sl={class:"VPHome"},Ol=V({__name:"VPHome",setup(e){const{frontmatter:t}=ie();return(n,r)=>{const a=ht("Content");return h(),C("div",Sl,[S(n.$slots,"home-hero-before",{},void 0,!0),Y(ol,null,{"home-hero-info-before":A(()=>[S(n.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(n.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(n.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(n.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(n.$slots,"home-hero-image",{},void 0,!0)]),_:3}),S(n.$slots,"home-hero-after",{},void 0,!0),S(n.$slots,"home-features-before",{},void 0,!0),Y(wl),S(n.$slots,"home-features-after",{},void 0,!0),g(t).markdownStyles!==!1?(h(),X(El,{key:0},{default:A(()=>[Y(a)]),_:1})):(h(),X(a,{key:1}))])}}}),Cl=q(Ol,[["__scopeId","data-v-c1e44215"]]),Il={},Al={class:"VPPage"};function Tl(e,t){const n=ht("Content");return h(),C("div",Al,[S(e.$slots,"page-top"),Y(n),S(e.$slots,"page-bottom")])}const Nl=q(Il,[["render",Tl]]),Ml=V({__name:"VPContent",setup(e){const{page:t,frontmatter:n}=ie(),{hasSidebar:r}=ot();return(a,s)=>(h(),C("div",{class:de(["VPContent",{"has-sidebar":g(r),"is-home":g(n).layout==="home"}]),id:"VPContent"},[g(t).isNotFound?S(a.$slots,"not-found",{key:0},()=>[Y(Ji)],!0):g(n).layout==="page"?(h(),X(Nl,{key:1},{"page-top":A(()=>[S(a.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(a.$slots,"page-bottom",{},void 0,!0)]),_:3})):g(n).layout==="home"?(h(),X(Cl,{key:2},{"home-hero-before":A(()=>[S(a.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(a.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(a.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(a.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(a.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(a.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(a.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(a.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(a.$slots,"home-features-after",{},void 0,!0)]),_:3})):g(n).layout&&g(n).layout!=="doc"?(h(),X(Ye(g(n).layout),{key:3})):(h(),X(Ko,{key:4},{"doc-top":A(()=>[S(a.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(a.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":A(()=>[S(a.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(a.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(a.$slots,"doc-after",{},void 0,!0)]),"aside-top":A(()=>[S(a.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":A(()=>[S(a.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(a.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(a.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(a.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":A(()=>[S(a.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),Pl=q(Ml,[["__scopeId","data-v-c575eed1"]]),Rl={class:"container"},$l=["innerHTML"],Fl=["innerHTML"],xl=V({__name:"VPFooter",setup(e){const{theme:t,frontmatter:n}=ie(),{hasSidebar:r}=ot();return(a,s)=>g(t).footer&&g(n).footer!==!1?(h(),C("footer",{key:0,class:de(["VPFooter",{"has-sidebar":g(r)}])},[w("div",Rl,[g(t).footer.message?(h(),C("p",{key:0,class:"message",innerHTML:g(t).footer.message},null,8,$l)):G("",!0),g(t).footer.copyright?(h(),C("p",{key:1,class:"copyright",innerHTML:g(t).footer.copyright},null,8,Fl)):G("",!0)])],2)):G("",!0)}}),Dl=q(xl,[["__scopeId","data-v-042815a5"]]);function Vl(){const{theme:e,frontmatter:t}=ie(),n=Tn([]),r=U(()=>n.value.length>0);return Nn(()=>{n.value=Er(t.value.outline??e.value.outline)}),{headers:n,hasLocalNav:r}}const Ul={class:"menu-text"},Hl={class:"header"},Bl={class:"outline"},Wl=V({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(e){const t=e,{theme:n}=ie(),r=z(!1),a=z(0),s=z(),i=z();function o(m){var d;(d=s.value)!=null&&d.contains(m.target)||(r.value=!1)}ke(r,m=>{if(m){document.addEventListener("click",o);return}document.removeEventListener("click",o)}),yi("Escape",()=>{r.value=!1}),Nn(()=>{r.value=!1});function l(){r.value=!r.value,a.value=window.innerHeight+Math.min(window.scrollY-t.navHeight,0)}function c(m){m.target.classList.contains("outline-link")&&(i.value&&(i.value.style.transition="none"),at(()=>{r.value=!1}))}function u(){r.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(m,d)=>(h(),C("div",{class:"VPLocalNavOutlineDropdown",style:Gs({"--vp-vh":a.value+"px"}),ref_key:"main",ref:s},[m.headers.length>0?(h(),C("button",{key:0,onClick:l,class:de({open:r.value})},[w("span",Ul,se(g(Qs)(g(n))),1),d[0]||(d[0]=w("span",{class:"vpi-chevron-right icon"},null,-1))],2)):(h(),C("button",{key:1,onClick:u},se(g(n).returnToTopLabel||"Return to top"),1)),Y(Cn,{name:"flyout"},{default:A(()=>[r.value?(h(),C("div",{key:0,ref_key:"items",ref:i,class:"items",onClick:c},[w("div",Hl,[w("a",{class:"top-link",href:"#",onClick:u},se(g(n).returnToTopLabel||"Return to top"),1)]),w("div",Bl,[Y(Zs,{headers:m.headers},null,8,["headers"])])],512)):G("",!0)]),_:1})],4))}}),jl=q(Wl,[["__scopeId","data-v-fd549330"]]),Kl={class:"container"},Gl=["aria-expanded"],Yl={class:"menu-text"},zl=V({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(e){const{theme:t,frontmatter:n}=ie(),{hasSidebar:r}=ot(),{headers:a}=Vl(),{y:s}=Ys(),i=z(0);We(()=>{i.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),Nn(()=>{a.value=Er(n.value.outline??t.value.outline)});const o=U(()=>a.value.length===0),l=U(()=>o.value&&!r.value),c=U(()=>({VPLocalNav:!0,"has-sidebar":r.value,empty:o.value,fixed:l.value}));return(u,m)=>g(n).layout!=="home"&&(!l.value||g(s)>=i.value)?(h(),C("div",{key:0,class:de(c.value)},[w("div",Kl,[g(r)?(h(),C("button",{key:0,class:"menu","aria-expanded":u.open,"aria-controls":"VPSidebarNav",onClick:m[0]||(m[0]=d=>u.$emit("open-menu"))},[m[1]||(m[1]=w("span",{class:"vpi-align-left menu-icon"},null,-1)),w("span",Yl,se(g(t).sidebarMenuLabel||"Menu"),1)],8,Gl)):G("",!0),Y(jl,{headers:g(a),navHeight:i.value},null,8,["headers","navHeight"])])],2)):G("",!0)}}),Xl=q(zl,[["__scopeId","data-v-6c3804f2"]]);function Jl(){const e=z(!1);function t(){e.value=!0,window.addEventListener("resize",a)}function n(){e.value=!1,window.removeEventListener("resize",a)}function r(){e.value?n():t()}function a(){window.outerWidth>=768&&n()}const s=nn();return ke(()=>s.path,n),{isScreenOpen:e,openScreen:t,closeScreen:n,toggleScreen:r}}const ql={},Ql={class:"VPSwitch",type:"button",role:"switch"},Zl={class:"check"},ec={key:0,class:"icon"};function tc(e,t){return h(),C("button",Ql,[w("span",Zl,[e.$slots.default?(h(),C("span",ec,[S(e.$slots,"default",{},void 0,!0)])):G("",!0)])])}const nc=q(ql,[["render",tc],["__scopeId","data-v-bdb57495"]]),rc=V({__name:"VPSwitchAppearance",setup(e){const{isDark:t,theme:n}=ie(),r=Ut("toggle-appearance",()=>{t.value=!t.value}),a=z("");return kr(()=>{a.value=t.value?n.value.lightModeSwitchTitle||"Switch to light theme":n.value.darkModeSwitchTitle||"Switch to dark theme"}),(s,i)=>(h(),X(nc,{title:a.value,class:"VPSwitchAppearance","aria-checked":g(t),onClick:g(r)},{default:A(()=>i[0]||(i[0]=[w("span",{class:"vpi-sun sun"},null,-1),w("span",{class:"vpi-moon moon"},null,-1)])),_:1},8,["title","aria-checked","onClick"]))}}),Sr=q(rc,[["__scopeId","data-v-41f06fec"]]),sc={key:0,class:"VPNavBarAppearance"},ac=V({__name:"VPNavBarAppearance",setup(e){const{site:t}=ie();return(n,r)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(h(),C("div",sc,[Y(Sr)])):G("",!0)}}),ic=q(ac,[["__scopeId","data-v-12ad808b"]]),Or=z();let ea=!1,Wn=0;function oc(e){const t=z(!1);if(Mn){!ea&&lc(),Wn++;const n=ke(Or,r=>{var a,s,i;r===e.el.value||(a=e.el.value)!=null&&a.contains(r)?(t.value=!0,(s=e.onFocus)==null||s.call(e)):(t.value=!1,(i=e.onBlur)==null||i.call(e))});An(()=>{n(),Wn--,Wn||cc()})}return ki(t)}function lc(){document.addEventListener("focusin",ta),ea=!0,Or.value=document.activeElement}function cc(){document.removeEventListener("focusin",ta)}function ta(){Or.value=document.activeElement}const uc={class:"VPMenuLink"},dc=V({__name:"VPMenuLink",props:{item:{}},setup(e){const{page:t}=ie();return(n,r)=>(h(),C("div",uc,[Y(ze,{class:de({active:g(Lt)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel},{default:A(()=>[qe(se(n.item.text),1)]),_:1},8,["class","href","target","rel"])]))}}),Rn=q(dc,[["__scopeId","data-v-7e61137e"]]),mc={class:"VPMenuGroup"},pc={key:0,class:"title"},fc=V({__name:"VPMenuGroup",props:{text:{},items:{}},setup(e){return(t,n)=>(h(),C("div",mc,[t.text?(h(),C("p",pc,se(t.text),1)):G("",!0),(h(!0),C(ge,null,Me(t.items,r=>(h(),C(ge,null,["link"in r?(h(),X(Rn,{key:0,item:r},null,8,["item"])):G("",!0)],64))),256))]))}}),hc=q(fc,[["__scopeId","data-v-b7ccc091"]]),gc={class:"VPMenu"},vc={key:0,class:"items"},_c=V({__name:"VPMenu",props:{items:{}},setup(e){return(t,n)=>(h(),C("div",gc,[t.items?(h(),C("div",vc,[(h(!0),C(ge,null,Me(t.items,r=>(h(),C(ge,{key:JSON.stringify(r)},["link"in r?(h(),X(Rn,{key:0,item:r},null,8,["item"])):"component"in r?(h(),X(Ye(r.component),dt({key:1,ref_for:!0},r.props),null,16)):(h(),X(hc,{key:2,text:r.text,items:r.items},null,8,["text","items"]))],64))),128))])):G("",!0),S(t.$slots,"default",{},void 0,!0)]))}}),bc=q(_c,[["__scopeId","data-v-e8a1c26e"]]),yc=["aria-expanded","aria-label"],kc={key:0,class:"text"},wc=["innerHTML"],Lc={key:1,class:"vpi-more-horizontal icon"},Ec={class:"menu"},Sc=V({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(e){const t=z(!1),n=z();oc({el:n,onBlur:r});function r(){t.value=!1}return(a,s)=>(h(),C("div",{class:"VPFlyout",ref_key:"el",ref:n,onMouseenter:s[1]||(s[1]=i=>t.value=!0),onMouseleave:s[2]||(s[2]=i=>t.value=!1)},[w("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":t.value,"aria-label":a.label,onClick:s[0]||(s[0]=i=>t.value=!t.value)},[a.button||a.icon?(h(),C("span",kc,[a.icon?(h(),C("span",{key:0,class:de([a.icon,"option-icon"])},null,2)):G("",!0),a.button?(h(),C("span",{key:1,innerHTML:a.button},null,8,wc)):G("",!0),s[3]||(s[3]=w("span",{class:"vpi-chevron-down text-icon"},null,-1))])):(h(),C("span",Lc))],8,yc),w("div",Ec,[Y(bc,{items:a.items},{default:A(()=>[S(a.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),Cr=q(Sc,[["__scopeId","data-v-7e42a472"]]),Oc=["href","aria-label","innerHTML"],Cc=V({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(e){const t=e,n=U(()=>typeof t.icon=="object"?t.icon.svg:`<span class="vpi-social-${t.icon}" />`);return(r,a)=>(h(),C("a",{class:"VPSocialLink no-icon",href:r.link,"aria-label":r.ariaLabel??(typeof r.icon=="string"?r.icon:""),target:"_blank",rel:"noopener",innerHTML:n.value},null,8,Oc))}}),Ic=q(Cc,[["__scopeId","data-v-1d65eafe"]]),Ac={class:"VPSocialLinks"},Tc=V({__name:"VPSocialLinks",props:{links:{}},setup(e){return(t,n)=>(h(),C("div",Ac,[(h(!0),C(ge,null,Me(t.links,({link:r,icon:a,ariaLabel:s})=>(h(),X(Ic,{key:r,icon:a,link:r,ariaLabel:s},null,8,["icon","link","ariaLabel"]))),128))]))}}),Ir=q(Tc,[["__scopeId","data-v-259de3d6"]]),Nc={key:0,class:"group translations"},Mc={class:"trans-title"},Pc={key:1,class:"group"},Rc={class:"item appearance"},$c={class:"label"},Fc={class:"appearance-action"},xc={key:2,class:"group"},Dc={class:"item social-links"},Vc=V({__name:"VPNavBarExtra",setup(e){const{site:t,theme:n}=ie(),{localeLinks:r,currentLang:a}=rn({correspondingLink:!0}),s=U(()=>r.value.length&&a.value.label||t.value.appearance||n.value.socialLinks);return(i,o)=>s.value?(h(),X(Cr,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:A(()=>[g(r).length&&g(a).label?(h(),C("div",Nc,[w("p",Mc,se(g(a).label),1),(h(!0),C(ge,null,Me(g(r),l=>(h(),X(Rn,{key:l.link,item:l},null,8,["item"]))),128))])):G("",!0),g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(h(),C("div",Pc,[w("div",Rc,[w("p",$c,se(g(n).darkModeSwitchLabel||"Appearance"),1),w("div",Fc,[Y(Sr)])])])):G("",!0),g(n).socialLinks?(h(),C("div",xc,[w("div",Dc,[Y(Ir,{class:"social-links-list",links:g(n).socialLinks},null,8,["links"])])])):G("",!0)]),_:1})):G("",!0)}}),Uc=q(Vc,[["__scopeId","data-v-1b59c413"]]),Hc=["aria-expanded"],Bc=V({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(e){return(t,n)=>(h(),C("button",{type:"button",class:de(["VPNavBarHamburger",{active:t.active}]),"aria-label":"mobile navigation","aria-expanded":t.active,"aria-controls":"VPNavScreen",onClick:n[0]||(n[0]=r=>t.$emit("click"))},n[1]||(n[1]=[w("span",{class:"container"},[w("span",{class:"top"}),w("span",{class:"middle"}),w("span",{class:"bottom"})],-1)]),10,Hc))}}),Wc=q(Bc,[["__scopeId","data-v-0fa0fd27"]]),jc=["innerHTML"],Kc=V({__name:"VPNavBarMenuLink",props:{item:{}},setup(e){const{page:t}=ie();return(n,r)=>(h(),X(ze,{class:de({VPNavBarMenuLink:!0,active:g(Lt)(g(t).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,noIcon:n.item.noIcon,target:n.item.target,rel:n.item.rel,tabindex:"0"},{default:A(()=>[w("span",{innerHTML:n.item.text},null,8,jc)]),_:1},8,["class","href","noIcon","target","rel"]))}}),Gc=q(Kc,[["__scopeId","data-v-e692fe86"]]),Yc=V({__name:"VPNavBarMenuGroup",props:{item:{}},setup(e){const t=e,{page:n}=ie(),r=s=>"component"in s?!1:"link"in s?Lt(n.value.relativePath,s.link,!!t.item.activeMatch):s.items.some(r),a=U(()=>r(t.item));return(s,i)=>(h(),X(Cr,{class:de({VPNavBarMenuGroup:!0,active:g(Lt)(g(n).relativePath,s.item.activeMatch,!!s.item.activeMatch)||a.value}),button:s.item.text,items:s.item.items},null,8,["class","button","items"]))}}),zc={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},Xc=V({__name:"VPNavBarMenu",setup(e){const{theme:t}=ie();return(n,r)=>g(t).nav?(h(),C("nav",zc,[r[0]||(r[0]=w("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),(h(!0),C(ge,null,Me(g(t).nav,a=>(h(),C(ge,{key:JSON.stringify(a)},["link"in a?(h(),X(Gc,{key:0,item:a},null,8,["item"])):"component"in a?(h(),X(Ye(a.component),dt({key:1,ref_for:!0},a.props),null,16)):(h(),X(Yc,{key:2,item:a},null,8,["item"]))],64))),128))])):G("",!0)}}),Jc=q(Xc,[["__scopeId","data-v-30753f5b"]]);var xr;const na=typeof window<"u",qc=e=>typeof e=="string",fn=()=>{};na&&((xr=window==null?void 0:window.navigator)!=null&&xr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function nr(e){return typeof e=="function"?e():g(e)}function Qc(e,t){function n(...r){e(()=>t.apply(this,r),{fn:t,thisArg:this,args:r})}return n}function Zc(e,t={}){let n,r;return a=>{const s=nr(e),i=nr(t.maxWait);if(n&&clearTimeout(n),s<=0||i!==void 0&&i<=0)return r&&(clearTimeout(r),r=null),a();i&&!r&&(r=setTimeout(()=>{n&&clearTimeout(n),r=null,a()},i)),n=setTimeout(()=>{r&&clearTimeout(r),r=null,a()},s)}}function eu(e){return e}function tu(e){return zs()?(Xs(e),!0):!1}function ra(e,t=200,n={}){return Qc(Zc(t,n),e)}function jn(e,t=200,n={}){if(t<=0)return e;const r=z(e.value),a=ra(()=>{r.value=e.value},t,n);return ke(e,()=>a()),r}function sa(e,t,n){return ke(e,(r,a,s)=>{r&&t(r,a,s)},n)}function nu(e){var t;const n=nr(e);return(t=n==null?void 0:n.$el)!=null?t:n}const aa=na?window:void 0;function un(...e){let t,n,r,a;if(qc(e[0])?([n,r,a]=e,t=aa):[t,n,r,a]=e,!t)return fn;let s=fn;const i=ke(()=>nu(t),l=>{s(),l&&(l.addEventListener(n,r,a),s=()=>{l.removeEventListener(n,r,a),s=fn})},{immediate:!0,flush:"post"}),o=()=>{i(),s()};return tu(o),o}const Dr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Vr="__vueuse_ssr_handlers__";Dr[Vr]=Dr[Vr]||{};const ru={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function su(e={}){const{reactive:t=!1,target:n=aa,aliasMap:r=ru,passive:a=!0,onEventFired:s=fn}=e,i=Zt(new Set),o={toJSON(){return{}},current:i},l=t?Zt(o):o,c=new Set,u=new Set;function m(_,b){_ in l&&(t?l[_]=b:l[_].value=b)}function d(){for(const _ of u)m(_,!1)}function v(_,b){var M,W;const y=(M=_.key)==null?void 0:M.toLowerCase(),L=[(W=_.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?i.add(y):i.delete(y));for(const T of L)u.add(T),m(T,b);y==="meta"&&!b?(c.forEach(T=>{i.delete(T),m(T,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&b&&[...i,...L].forEach(T=>c.add(T))}un(n,"keydown",_=>(v(_,!0),s(_)),{passive:a}),un(n,"keyup",_=>(v(_,!1),s(_)),{passive:a}),un("blur",d,{passive:!0}),un("focus",d,{passive:!0});const E=new Proxy(l,{get(_,b,M){if(typeof b!="string")return Reflect.get(_,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(_,b,M);return t?g(W):W}});return E}var Ur;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Ur||(Ur={}));var au=Object.defineProperty,Hr=Object.getOwnPropertySymbols,iu=Object.prototype.hasOwnProperty,ou=Object.prototype.propertyIsEnumerable,Br=(e,t,n)=>t in e?au(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,lu=(e,t)=>{for(var n in t||(t={}))iu.call(t,n)&&Br(e,n,t[n]);if(Hr)for(var n of Hr(t))ou.call(t,n)&&Br(e,n,t[n]);return e};const cu={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};lu({linear:eu},cu);function it(e){return Array.isArray?Array.isArray(e):la(e)==="[object Array]"}const uu=1/0;function du(e){if(typeof e=="string")return e;let t=e+"";return t=="0"&&1/e==-uu?"-0":t}function mu(e){return e==null?"":du(e)}function Ke(e){return typeof e=="string"}function ia(e){return typeof e=="number"}function pu(e){return e===!0||e===!1||fu(e)&&la(e)=="[object Boolean]"}function oa(e){return typeof e=="object"}function fu(e){return oa(e)&&e!==null}function Fe(e){return e!=null}function Kn(e){return!e.trim().length}function la(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}const hu="Incorrect 'index' type",gu=e=>`Invalid value for key ${e}`,vu=e=>`Pattern length exceeds max of ${e}.`,_u=e=>`Missing ${e} property in key`,bu=e=>`Property 'weight' in key '${e}' must be a positive integer`,Wr=Object.prototype.hasOwnProperty;class yu{constructor(t){this._keys=[],this._keyMap={};let n=0;t.forEach(r=>{let a=ca(r);n+=a.weight,this._keys.push(a),this._keyMap[a.id]=a,n+=a.weight}),this._keys.forEach(r=>{r.weight/=n})}get(t){return this._keyMap[t]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}}function ca(e){let t=null,n=null,r=null,a=1,s=null;if(Ke(e)||it(e))r=e,t=jr(e),n=rr(e);else{if(!Wr.call(e,"name"))throw new Error(_u("name"));const i=e.name;if(r=i,Wr.call(e,"weight")&&(a=e.weight,a<=0))throw new Error(bu(i));t=jr(i),n=rr(i),s=e.getFn}return{path:t,id:n,weight:a,src:r,getFn:s}}function jr(e){return it(e)?e:e.split(".")}function rr(e){return it(e)?e.join("."):e}function ku(e,t){let n=[],r=!1;const a=(s,i,o)=>{if(Fe(s))if(!i[o])n.push(s);else{let l=i[o];const c=s[l];if(!Fe(c))return;if(o===i.length-1&&(Ke(c)||ia(c)||pu(c)))n.push(mu(c));else if(it(c)){r=!0;for(let u=0,m=c.length;u<m;u+=1)a(c[u],i,o+1)}else i.length&&a(c,i,o+1)}};return a(e,Ke(t)?t.split("."):t,0),r?n:n[0]}const wu={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},Lu={isCaseSensitive:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},Eu={location:0,threshold:.6,distance:100},Su={useExtendedSearch:!1,getFn:ku,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1};var ee={...Lu,...wu,...Eu,...Su};const Ou=/[^ ]+/g;function Cu(e=1,t=3){const n=new Map,r=Math.pow(10,t);return{get(a){const s=a.match(Ou).length;if(n.has(s))return n.get(s);const i=1/Math.pow(s,.5*e),o=parseFloat(Math.round(i*r)/r);return n.set(s,o),o},clear(){n.clear()}}}class Ar{constructor({getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){this.norm=Cu(n,3),this.getFn=t,this.isCreated=!1,this.setIndexRecords()}setSources(t=[]){this.docs=t}setIndexRecords(t=[]){this.records=t}setKeys(t=[]){this.keys=t,this._keysMap={},t.forEach((n,r)=>{this._keysMap[n.id]=r})}create(){this.isCreated||!this.docs.length||(this.isCreated=!0,Ke(this.docs[0])?this.docs.forEach((t,n)=>{this._addString(t,n)}):this.docs.forEach((t,n)=>{this._addObject(t,n)}),this.norm.clear())}add(t){const n=this.size();Ke(t)?this._addString(t,n):this._addObject(t,n)}removeAt(t){this.records.splice(t,1);for(let n=t,r=this.size();n<r;n+=1)this.records[n].i-=1}getValueForItemAtKeyId(t,n){return t[this._keysMap[n]]}size(){return this.records.length}_addString(t,n){if(!Fe(t)||Kn(t))return;let r={v:t,i:n,n:this.norm.get(t)};this.records.push(r)}_addObject(t,n){let r={i:n,$:{}};this.keys.forEach((a,s)=>{let i=a.getFn?a.getFn(t):this.getFn(t,a.path);if(Fe(i)){if(it(i)){let o=[];const l=[{nestedArrIndex:-1,value:i}];for(;l.length;){const{nestedArrIndex:c,value:u}=l.pop();if(Fe(u))if(Ke(u)&&!Kn(u)){let m={v:u,i:c,n:this.norm.get(u)};o.push(m)}else it(u)&&u.forEach((m,d)=>{l.push({nestedArrIndex:d,value:m})})}r.$[s]=o}else if(Ke(i)&&!Kn(i)){let o={v:i,n:this.norm.get(i)};r.$[s]=o}}}),this.records.push(r)}toJSON(){return{keys:this.keys,records:this.records}}}function ua(e,t,{getFn:n=ee.getFn,fieldNormWeight:r=ee.fieldNormWeight}={}){const a=new Ar({getFn:n,fieldNormWeight:r});return a.setKeys(e.map(ca)),a.setSources(t),a.create(),a}function Iu(e,{getFn:t=ee.getFn,fieldNormWeight:n=ee.fieldNormWeight}={}){const{keys:r,records:a}=e,s=new Ar({getFn:t,fieldNormWeight:n});return s.setKeys(r),s.setIndexRecords(a),s}function dn(e,{errors:t=0,currentLocation:n=0,expectedLocation:r=0,distance:a=ee.distance,ignoreLocation:s=ee.ignoreLocation}={}){const i=t/e.length;if(s)return i;const o=Math.abs(r-n);return a?i+o/a:o?1:i}function Au(e=[],t=ee.minMatchCharLength){let n=[],r=-1,a=-1,s=0;for(let i=e.length;s<i;s+=1){let o=e[s];o&&r===-1?r=s:!o&&r!==-1&&(a=s-1,a-r+1>=t&&n.push([r,a]),r=-1)}return e[s-1]&&s-r>=t&&n.push([r,s-1]),n}const wt=32;function Tu(e,t,n,{location:r=ee.location,distance:a=ee.distance,threshold:s=ee.threshold,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,includeMatches:l=ee.includeMatches,ignoreLocation:c=ee.ignoreLocation}={}){if(t.length>wt)throw new Error(vu(wt));const u=t.length,m=e.length,d=Math.max(0,Math.min(r,m));let v=s,E=d;const _=o>1||l,b=_?Array(m):[];let M;for(;(M=e.indexOf(t,E))>-1;){let R=dn(t,{currentLocation:M,expectedLocation:d,distance:a,ignoreLocation:c});if(v=Math.min(R,v),E=M+u,_){let x=0;for(;x<u;)b[M+x]=1,x+=1}}E=-1;let W=[],y=1,L=u+m;const T=1<<u-1;for(let R=0;R<u;R+=1){let x=0,$=L;for(;x<$;)dn(t,{errors:R,currentLocation:d+$,expectedLocation:d,distance:a,ignoreLocation:c})<=v?x=$:L=$,$=Math.floor((L-x)/2+x);L=$;let me=Math.max(1,d-$+1),we=i?m:Math.min(d+$,m)+u,Z=Array(we+2);Z[we+1]=(1<<R)-1;for(let D=we;D>=me;D-=1){let re=D-1,Ee=n[e.charAt(re)];if(_&&(b[re]=+!!Ee),Z[D]=(Z[D+1]<<1|1)&Ee,R&&(Z[D]|=(W[D+1]|W[D])<<1|1|W[D+1]),Z[D]&T&&(y=dn(t,{errors:R,currentLocation:re,expectedLocation:d,distance:a,ignoreLocation:c}),y<=v)){if(v=y,E=re,E<=d)break;me=Math.max(1,2*d-E)}}if(dn(t,{errors:R+1,currentLocation:d,expectedLocation:d,distance:a,ignoreLocation:c})>v)break;W=Z}const I={isMatch:E>=0,score:Math.max(.001,y)};if(_){const R=Au(b,o);R.length?l&&(I.indices=R):I.isMatch=!1}return I}function Nu(e){let t={};for(let n=0,r=e.length;n<r;n+=1){const a=e.charAt(n);t[a]=(t[a]||0)|1<<r-n-1}return t}class da{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:a=ee.distance,includeMatches:s=ee.includeMatches,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){if(this.options={location:n,threshold:r,distance:a,includeMatches:s,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:l,ignoreLocation:c},this.pattern=l?t:t.toLowerCase(),this.chunks=[],!this.pattern.length)return;const u=(d,v)=>{this.chunks.push({pattern:d,alphabet:Nu(d),startIndex:v})},m=this.pattern.length;if(m>wt){let d=0;const v=m%wt,E=m-v;for(;d<E;)u(this.pattern.substr(d,wt),d),d+=wt;if(v){const _=m-wt;u(this.pattern.substr(_),_)}}else u(this.pattern,0)}searchIn(t){const{isCaseSensitive:n,includeMatches:r}=this.options;if(n||(t=t.toLowerCase()),this.pattern===t){let E={isMatch:!0,score:0};return r&&(E.indices=[[0,t.length-1]]),E}const{location:a,distance:s,threshold:i,findAllMatches:o,minMatchCharLength:l,ignoreLocation:c}=this.options;let u=[],m=0,d=!1;this.chunks.forEach(({pattern:E,alphabet:_,startIndex:b})=>{const{isMatch:M,score:W,indices:y}=Tu(t,E,_,{location:a+b,distance:s,threshold:i,findAllMatches:o,minMatchCharLength:l,includeMatches:r,ignoreLocation:c});M&&(d=!0),m+=W,M&&y&&(u=[...u,...y])});let v={isMatch:d,score:d?m/this.chunks.length:1};return d&&r&&(v.indices=u),v}}class gt{constructor(t){this.pattern=t}static isMultiMatch(t){return Kr(t,this.multiRegex)}static isSingleMatch(t){return Kr(t,this.singleRegex)}search(){}}function Kr(e,t){const n=e.match(t);return n?n[1]:null}class Mu extends gt{constructor(t){super(t)}static get type(){return"exact"}static get multiRegex(){return/^="(.*)"$/}static get singleRegex(){return/^=(.*)$/}search(t){const n=t===this.pattern;return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class Pu extends gt{constructor(t){super(t)}static get type(){return"inverse-exact"}static get multiRegex(){return/^!"(.*)"$/}static get singleRegex(){return/^!(.*)$/}search(t){const n=t.indexOf(this.pattern)===-1;return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class Ru extends gt{constructor(t){super(t)}static get type(){return"prefix-exact"}static get multiRegex(){return/^\^"(.*)"$/}static get singleRegex(){return/^\^(.*)$/}search(t){const n=t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,this.pattern.length-1]}}}class $u extends gt{constructor(t){super(t)}static get type(){return"inverse-prefix-exact"}static get multiRegex(){return/^!\^"(.*)"$/}static get singleRegex(){return/^!\^(.*)$/}search(t){const n=!t.startsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class Fu extends gt{constructor(t){super(t)}static get type(){return"suffix-exact"}static get multiRegex(){return/^"(.*)"\$$/}static get singleRegex(){return/^(.*)\$$/}search(t){const n=t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[t.length-this.pattern.length,t.length-1]}}}class xu extends gt{constructor(t){super(t)}static get type(){return"inverse-suffix-exact"}static get multiRegex(){return/^!"(.*)"\$$/}static get singleRegex(){return/^!(.*)\$$/}search(t){const n=!t.endsWith(this.pattern);return{isMatch:n,score:n?0:1,indices:[0,t.length-1]}}}class ma extends gt{constructor(t,{location:n=ee.location,threshold:r=ee.threshold,distance:a=ee.distance,includeMatches:s=ee.includeMatches,findAllMatches:i=ee.findAllMatches,minMatchCharLength:o=ee.minMatchCharLength,isCaseSensitive:l=ee.isCaseSensitive,ignoreLocation:c=ee.ignoreLocation}={}){super(t),this._bitapSearch=new da(t,{location:n,threshold:r,distance:a,includeMatches:s,findAllMatches:i,minMatchCharLength:o,isCaseSensitive:l,ignoreLocation:c})}static get type(){return"fuzzy"}static get multiRegex(){return/^"(.*)"$/}static get singleRegex(){return/^(.*)$/}search(t){return this._bitapSearch.searchIn(t)}}class pa extends gt{constructor(t){super(t)}static get type(){return"include"}static get multiRegex(){return/^'"(.*)"$/}static get singleRegex(){return/^'(.*)$/}search(t){let n=0,r;const a=[],s=this.pattern.length;for(;(r=t.indexOf(this.pattern,n))>-1;)n=r+s,a.push([r,n-1]);const i=!!a.length;return{isMatch:i,score:i?0:1,indices:a}}}const sr=[Mu,pa,Ru,$u,xu,Fu,Pu,ma],Gr=sr.length,Du=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,Vu="|";function Uu(e,t={}){return e.split(Vu).map(n=>{let r=n.trim().split(Du).filter(s=>s&&!!s.trim()),a=[];for(let s=0,i=r.length;s<i;s+=1){const o=r[s];let l=!1,c=-1;for(;!l&&++c<Gr;){const u=sr[c];let m=u.isMultiMatch(o);m&&(a.push(new u(m,t)),l=!0)}if(!l)for(c=-1;++c<Gr;){const u=sr[c];let m=u.isSingleMatch(o);if(m){a.push(new u(m,t));break}}}return a})}const Hu=new Set([ma.type,pa.type]);class Bu{constructor(t,{isCaseSensitive:n=ee.isCaseSensitive,includeMatches:r=ee.includeMatches,minMatchCharLength:a=ee.minMatchCharLength,ignoreLocation:s=ee.ignoreLocation,findAllMatches:i=ee.findAllMatches,location:o=ee.location,threshold:l=ee.threshold,distance:c=ee.distance}={}){this.query=null,this.options={isCaseSensitive:n,includeMatches:r,minMatchCharLength:a,findAllMatches:i,ignoreLocation:s,location:o,threshold:l,distance:c},this.pattern=n?t:t.toLowerCase(),this.query=Uu(this.pattern,this.options)}static condition(t,n){return n.useExtendedSearch}searchIn(t){const n=this.query;if(!n)return{isMatch:!1,score:1};const{includeMatches:r,isCaseSensitive:a}=this.options;t=a?t:t.toLowerCase();let s=0,i=[],o=0;for(let l=0,c=n.length;l<c;l+=1){const u=n[l];i.length=0,s=0;for(let m=0,d=u.length;m<d;m+=1){const v=u[m],{isMatch:E,indices:_,score:b}=v.search(t);if(E){if(s+=1,o+=b,r){const M=v.constructor.type;Hu.has(M)?i=[...i,..._]:i.push(_)}}else{o=0,s=0,i.length=0;break}}if(s){let m={isMatch:!0,score:o/s};return r&&(m.indices=i),m}}return{isMatch:!1,score:1}}}const ar=[];function Wu(...e){ar.push(...e)}function ir(e,t){for(let n=0,r=ar.length;n<r;n+=1){let a=ar[n];if(a.condition(e,t))return new a(e,t)}return new da(e,t)}const wn={AND:"$and",OR:"$or"},or={PATH:"$path",PATTERN:"$val"},lr=e=>!!(e[wn.AND]||e[wn.OR]),ju=e=>!!e[or.PATH],Ku=e=>!it(e)&&oa(e)&&!lr(e),Yr=e=>({[wn.AND]:Object.keys(e).map(t=>({[t]:e[t]}))});function fa(e,t,{auto:n=!0}={}){const r=a=>{let s=Object.keys(a);const i=ju(a);if(!i&&s.length>1&&!lr(a))return r(Yr(a));if(Ku(a)){const l=i?a[or.PATH]:s[0],c=i?a[or.PATTERN]:a[l];if(!Ke(c))throw new Error(gu(l));const u={keyId:rr(l),pattern:c};return n&&(u.searcher=ir(c,t)),u}let o={children:[],operator:s[0]};return s.forEach(l=>{const c=a[l];it(c)&&c.forEach(u=>{o.children.push(r(u))})}),o};return lr(e)||(e=Yr(e)),r(e)}function Gu(e,{ignoreFieldNorm:t=ee.ignoreFieldNorm}){e.forEach(n=>{let r=1;n.matches.forEach(({key:a,norm:s,score:i})=>{const o=a?a.weight:null;r*=Math.pow(i===0&&o?Number.EPSILON:i,(o||1)*(t?1:s))}),n.score=r})}function Yu(e,t){const n=e.matches;t.matches=[],Fe(n)&&n.forEach(r=>{if(!Fe(r.indices)||!r.indices.length)return;const{indices:a,value:s}=r;let i={indices:a,value:s};r.key&&(i.key=r.key.src),r.idx>-1&&(i.refIndex=r.idx),t.matches.push(i)})}function zu(e,t){t.score=e.score}function Xu(e,t,{includeMatches:n=ee.includeMatches,includeScore:r=ee.includeScore}={}){const a=[];return n&&a.push(Yu),r&&a.push(zu),e.map(s=>{const{idx:i}=s,o={item:t[i],refIndex:i};return a.length&&a.forEach(l=>{l(s,o)}),o})}class Et{constructor(t,n={},r){this.options={...ee,...n},this.options.useExtendedSearch,this._keyStore=new yu(this.options.keys),this.setCollection(t,r)}setCollection(t,n){if(this._docs=t,n&&!(n instanceof Ar))throw new Error(hu);this._myIndex=n||ua(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight})}add(t){!Fe(t)||(this._docs.push(t),this._myIndex.add(t))}remove(t=()=>!1){const n=[];for(let r=0,a=this._docs.length;r<a;r+=1){const s=this._docs[r];t(s,r)&&(this.removeAt(r),r-=1,a-=1,n.push(s))}return n}removeAt(t){this._docs.splice(t,1),this._myIndex.removeAt(t)}getIndex(){return this._myIndex}search(t,{limit:n=-1}={}){const{includeMatches:r,includeScore:a,shouldSort:s,sortFn:i,ignoreFieldNorm:o}=this.options;let l=Ke(t)?Ke(this._docs[0])?this._searchStringList(t):this._searchObjectList(t):this._searchLogical(t);return Gu(l,{ignoreFieldNorm:o}),s&&l.sort(i),ia(n)&&n>-1&&(l=l.slice(0,n)),Xu(l,this._docs,{includeMatches:r,includeScore:a})}_searchStringList(t){const n=ir(t,this.options),{records:r}=this._myIndex,a=[];return r.forEach(({v:s,i,n:o})=>{if(!Fe(s))return;const{isMatch:l,score:c,indices:u}=n.searchIn(s);l&&a.push({item:s,idx:i,matches:[{score:c,value:s,norm:o,indices:u}]})}),a}_searchLogical(t){const n=fa(t,this.options),r=(o,l,c)=>{if(!o.children){const{keyId:m,searcher:d}=o,v=this._findMatches({key:this._keyStore.get(m),value:this._myIndex.getValueForItemAtKeyId(l,m),searcher:d});return v&&v.length?[{idx:c,item:l,matches:v}]:[]}const u=[];for(let m=0,d=o.children.length;m<d;m+=1){const v=o.children[m],E=r(v,l,c);if(E.length)u.push(...E);else if(o.operator===wn.AND)return[]}return u},a=this._myIndex.records,s={},i=[];return a.forEach(({$:o,i:l})=>{if(Fe(o)){let c=r(n,o,l);c.length&&(s[l]||(s[l]={idx:l,item:o,matches:[]},i.push(s[l])),c.forEach(({matches:u})=>{s[l].matches.push(...u)}))}}),i}_searchObjectList(t){const n=ir(t,this.options),{keys:r,records:a}=this._myIndex,s=[];return a.forEach(({$:i,i:o})=>{if(!Fe(i))return;let l=[];r.forEach((c,u)=>{l.push(...this._findMatches({key:c,value:i[u],searcher:n}))}),l.length&&s.push({idx:o,item:i,matches:l})}),s}_findMatches({key:t,value:n,searcher:r}){if(!Fe(n))return[];let a=[];if(it(n))n.forEach(({v:s,i,n:o})=>{if(!Fe(s))return;const{isMatch:l,score:c,indices:u}=r.searchIn(s);l&&a.push({score:c,key:t,value:s,idx:i,norm:o,indices:u})});else{const{v:s,n:i}=n,{isMatch:o,score:l,indices:c}=r.searchIn(s);o&&a.push({score:l,key:t,value:s,norm:i,indices:c})}return a}}Et.version="6.6.2";Et.createIndex=ua;Et.parseIndex=Iu;Et.config=ee;Et.parseQuery=fa;Wu(Bu);const zr=Zt({selectedNode:"",selectedGroup:"",search:"",dataValue:"",filtered:{count:0,items:new Map,groups:new Set}}),Ht=()=>({isSearching:U(()=>zr.search!==""),...Li(zr)});function Ju(e){return{all:e=e||new Map,on:function(t,n){var r=e.get(t);r?r.push(n):e.set(t,[n])},off:function(t,n){var r=e.get(t);r&&(n?r.splice(r.indexOf(n)>>>0,1):e.set(t,[]))},emit:function(t,n){var r=e.get(t);r&&r.slice().map(function(a){a(n)}),(r=e.get("*"))&&r.slice().map(function(a){a(t,n)})}}}const qu=Ju(),$n=()=>({emitter:qu});function Qu(e,t){let n=e.nextElementSibling;for(;n;){if(n.matches(t))return n;n=n.nextElementSibling}}function Zu(e,t){let n=e.previousElementSibling;for(;n;){if(n.matches(t))return n;n=n.previousElementSibling}}const ed=["command-theme"],td={"command-root":""},nd=V({name:"Command"}),rd=V({...nd,props:{theme:{type:String,default:"default"},fuseOptions:{type:Object,default:()=>({threshold:.2,keys:["label"]})}},emits:["select-item"],setup(e,{emit:t}){const n=e,r='[command-item=""]',a="command-item-key",s='[command-group=""]',i="command-group-key",o='[command-group-heading=""]',l=`${r}:not([aria-disabled="true"])`,c=`${r}[aria-selected="true"]`,u="command-item-select",m="data-value";wr("theme",n.theme||"default");const{selectedNode:d,search:v,dataValue:E,filtered:_}=Ht(),{emitter:b}=$n(),M=z(),W=jn(z(new Map),333),y=jn(z(new Set),333),L=jn(z(new Map)),T=U(()=>{const j=[];for(const[le,oe]of W.value.entries())j.push({key:le,label:oe});return j}),I=U(()=>{const j=Et.createIndex(n.fuseOptions.keys,T.value);return new Et(T.value,n.fuseOptions,j)}),R=()=>{var j,le,oe;const pe=x();pe&&(((j=pe.parentElement)==null?void 0:j.firstElementChild)===pe&&((oe=(le=pe.closest(s))==null?void 0:le.querySelector(o))==null||oe.scrollIntoView({block:"nearest"})),pe.scrollIntoView({block:"nearest"}))},x=()=>{var j;return(j=M.value)==null?void 0:j.querySelector(c)},$=(j=M.value)=>{const le=j==null?void 0:j.querySelectorAll(l);return le?Array.from(le):[]},me=()=>{var j;const le=(j=M.value)==null?void 0:j.querySelectorAll(s);return le?Array.from(le):[]},we=()=>{const[j]=$();j&&j.getAttribute(a)&&(d.value=j.getAttribute(a)||"")},Z=j=>{const le=$()[j];le&&(d.value=le.getAttribute(a)||"")},D=j=>{const le=x(),oe=$(),pe=oe.findIndex(je=>je===le),$e=oe[pe+j];$e?d.value=$e.getAttribute(a)||"":j>0?Z(0):Z(oe.length-1)},re=j=>{const le=x();let oe=le==null?void 0:le.closest(s),pe=null;for(;oe&&!pe;)oe=j>0?Qu(oe,s):Zu(oe,s),pe=oe==null?void 0:oe.querySelector(l);pe?d.value=pe.getAttribute(a)||"":D(j)},Ee=()=>Z(0),Oe=()=>Z($().length-1),_e=j=>{j.preventDefault(),j.metaKey?Oe():j.altKey?re(1):D(1)},De=j=>{j.preventDefault(),j.metaKey?Ee():j.altKey?re(-1):D(-1)},Ze=j=>{switch(j.key){case"n":case"j":{j.ctrlKey&&_e(j);break}case"ArrowDown":{_e(j);break}case"p":case"k":{j.ctrlKey&&De(j);break}case"ArrowUp":{De(j);break}case"Home":{Ee();break}case"End":{Oe();break}case"Enter":{const le=x();if(le){const oe=new Event(u);le.dispatchEvent(oe)}}}},be=()=>{if(!v.value){_.value.count=y.value.size;return}_.value.groups=new Set("");const j=new Map,le=I.value.search(v.value).map(oe=>oe.item);for(const{key:oe,label:pe}of le)j.set(oe,pe);for(const[oe,pe]of L.value)for(const $e of pe)j.get($e)&&_.value.groups.add(oe);at(()=>{_.value.count=j.size,_.value.items=j})},Le=()=>{const j=$(),le=me();for(const oe of j){const pe=oe.getAttribute(a)||"",$e=oe.getAttribute(m)||"";y.value.add(pe),W.value.set(pe,$e),_.value.count=W.value.size}for(const oe of le){const pe=$(oe),$e=oe.getAttribute(i)||"",je=new Set("");for(const bt of pe){const lt=bt.getAttribute(a)||"";je.add(lt)}L.value.set($e,je)}};ke(()=>d.value,j=>{j&&at(R)},{deep:!0}),ke(()=>v.value,j=>{be(),at(we)}),b.on("selectItem",j=>{t("select-item",j)});const Ve=ra(j=>{j&&(Le(),at(we))},100);return b.on("rerenderList",Ve),We(()=>{Le(),we()}),(j,le)=>(h(),C("div",{class:de(e.theme),onKeydown:Ze,ref_key:"commandRef",ref:M,"command-theme":e.theme},[w("div",td,[S(j.$slots,"default")])],42,ed))}}),Bt=(e,t)=>{const n=e.__vccOpts||e;for(const[r,a]of t)n[r]=a;return n},cr=Bt(rd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/Command.vue"]]),sd={"command-dialog":""},ad={"command-dialog-mask":""},id={"command-dialog-wrapper":""},od={"command-dialog-header":""},ld={"command-dialog-body":""},cd={key:0,"command-dialog-footer":""},ud=V({name:"Command.Dialog"}),dd=V({...ud,props:{visible:{type:Boolean,required:!0},theme:{type:String,required:!0}},emits:["select-item"],setup(e,{emit:t}){const n=e,{search:r,filtered:a}=Ht(),{emitter:s}=$n(),i=z();s.on("selectItem",l=>{t("select-item",l)});const o=()=>{r.value="",a.value.count=0,a.value.items=new Map,a.value.groups=new Set};return sa(()=>n.visible,o),Pn(o),(l,c)=>(h(),X(wi,{to:"body",ref_key:"dialogRef",ref:i},[Y(Cn,{name:"command-dialog",appear:""},{default:A(()=>[e.visible?(h(),X(cr,{key:0,theme:e.theme},{default:A(()=>[w("div",sd,[w("div",ad,[w("div",id,[w("div",od,[S(l.$slots,"header")]),w("div",ld,[S(l.$slots,"body")]),l.$slots.footer?(h(),C("div",cd,[S(l.$slots,"footer")])):G("v-if",!0)])])])]),_:3},8,["theme"])):G("v-if",!0)]),_:3})],512))}}),md=Bt(dd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandDialog.vue"]]);let ha=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce((t,n)=>(n&=63,n<36?t+=n.toString(36):n<62?t+=(n-26).toString(36).toUpperCase():n>62?t+="-":t+="_",t),"");const pd=["command-group-key","data-value"],fd={key:0,"command-group-heading":""},hd={"command-group-items":"",role:"group"},gd=V({name:"Command.Group"}),vd=V({...gd,props:{heading:{type:String,required:!0}},setup(e){const t=U(()=>`command-group-${ha()}`),{filtered:n,isSearching:r}=Ht(),a=U(()=>r.value?n.value.groups.has(t.value):!0);return(s,i)=>_n((h(),C("div",{"command-group":"",role:"presentation",key:g(t),"command-group-key":g(t),"data-value":e.heading},[e.heading?(h(),C("div",fd,se(e.heading),1)):G("v-if",!0),w("div",hd,[S(s.$slots,"default")])],8,pd)),[[bn,g(a)]])}}),_d=Bt(vd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandGroup.vue"]]),bd=["placeholder","value"],yd=V({name:"Command.Input"}),kd=V({...yd,props:{placeholder:{type:String,required:!0},value:{type:String,required:!1}},emits:["input","update:value"],setup(e,{emit:t}){const n=z(null),{search:r}=Ht(),a=U(()=>r.value),s=i=>{const o=i,l=i.target;r.value=l==null?void 0:l.value,t("input",o),t("update:value",r.value)};return ft(()=>{var i;(i=n.value)==null||i.focus()}),(i,o)=>(h(),C("input",{ref_key:"inputRef",ref:n,"command-input":"","auto-focus":"","auto-complete":"off","auto-correct":"off","spell-check":!1,"aria-autocomplete":"list",role:"combobox","aria-expanded":!0,placeholder:e.placeholder,value:g(a),onInput:s},null,40,bd))}}),wd=Bt(kd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandInput.vue"]]),Ld=["aria-selected","aria-disabled","command-item-key"],Ed=V({name:"Command.Item"}),Sd=V({...Ed,props:{shortcut:{type:Array,required:!1},perform:{type:null,required:!1}},emits:["select"],setup(e,{emit:t}){const n=e,r="command-item-select",a="data-value",{current:s}=su(),{selectedNode:i,filtered:o,isSearching:l}=Ht(),{emitter:c}=$n(),u=z(),m=U(()=>`command-item-${ha()}`),d=U(()=>{const _=o.value.items.get(m.value);return l.value?_!==void 0:!0}),v=U(()=>Array.from(s)),E=()=>{var _;const b={key:m.value,value:((_=u.value)==null?void 0:_.getAttribute(a))||""};t("select",b),c.emit("selectItem",b)};return sa(v,_=>{n.shortcut&&n.shortcut.length>0&&n.shortcut.every(b=>s.has(b.toLowerCase()))&&n.perform&&n.perform()}),ft(()=>{var _;(_=u.value)==null||_.addEventListener(r,E)}),Pn(()=>{var _;(_=u.value)==null||_.removeEventListener(r,E)}),(_,b)=>_n((h(),C("div",{ref_key:"itemRef",ref:u,"command-item":"",role:"option","aria-selected":g(i)===g(m),"aria-disabled":!g(d),key:g(m),"command-item-key":g(m),onClick:E},[S(_.$slots,"default")],8,Ld)),[[bn,g(d)]])}}),Od=Bt(Sd,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandItem.vue"]]),Cd=V({name:"Command.List"}),Id=V({...Cd,setup(e){const{emitter:t}=$n(),n=z(),r=z();let a=null,s;return ft(()=>{s=r.value;const i=n.value;s&&i&&(a=new ResizeObserver(o=>{at(()=>{const l=s==null?void 0:s.offsetHeight;i==null||i.style.setProperty("--command-list-height",`${l==null?void 0:l.toFixed(1)}px`),t.emit("rerenderList",!0)})}),a.observe(s))}),Pn(()=>{a!==null&&s&&a.unobserve(s)}),(i,o)=>(h(),C("div",{"command-list":"",role:"listbox","aria-label":"Suggestions",ref_key:"listRef",ref:n},[w("div",{"command-list-sizer":"",ref_key:"heightRef",ref:r},[S(i.$slots,"default")],512)],512))}}),Ad=Bt(Id,[["__file","/Users/xiaoyunwei/Documents/GitHub/oss/vue-command-palette/packages/CommandList.vue"]]),Td=V({name:"Command.Empty",setup(e,{attrs:t,slots:n}){const{filtered:r}=Ht(),a=U(()=>r.value.count===0);return()=>a.value?$t("div",{"command-empty":"",role:"presentation",...t},n):$t("div",{"command-empty":"hidden",role:"presentation",style:{display:"none"},...t})}}),Nd=V({name:"Command.Loading",setup(e,{attrs:t,slots:n}){return()=>$t("div",{"command-loading":"",role:"progressbar",...t},n)}}),Md=V({name:"Command.Separator",setup(e,{attrs:t,slots:n}){return()=>$t("div",{"command-separator":"",role:"separator",...t})}}),It=Object.assign(cr,{Dialog:md,Empty:Td,Group:_d,Input:wd,Item:Od,List:Ad,Loading:Nd,Separator:Md,Root:cr});var Xr;const ga=typeof window<"u",Pd=e=>typeof e=="string",va=()=>{};ga&&((Xr=window==null?void 0:window.navigator)!=null&&Xr.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function _a(e){return typeof e=="function"?e():g(e)}function Rd(e){return e}function $d(e){return zs()?(Xs(e),!0):!1}function Fd(e,t=!0){Ft()?We(e):t?e():at(e)}function xd(e){var t;const n=_a(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Tr=ga?window:void 0;function Mt(...e){let t,n,r,a;if(Pd(e[0])||Array.isArray(e[0])?([n,r,a]=e,t=Tr):[t,n,r,a]=e,!t)return va;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const s=[],i=()=>{s.forEach(u=>u()),s.length=0},o=(u,m,d,v)=>(u.addEventListener(m,d,v),()=>u.removeEventListener(m,d,v)),l=ke(()=>[xd(t),_a(a)],([u,m])=>{i(),u&&s.push(...n.flatMap(d=>r.map(v=>o(u,d,v,m))))},{immediate:!0,flush:"post"}),c=()=>{l(),i()};return $d(c),c}const Jr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},qr="__vueuse_ssr_handlers__";Jr[qr]=Jr[qr]||{};const Dd={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Vd(e={}){const{reactive:t=!1,target:n=Tr,aliasMap:r=Dd,passive:a=!0,onEventFired:s=va}=e,i=Zt(new Set),o={toJSON(){return{}},current:i},l=t?Zt(o):o,c=new Set,u=new Set;function m(_,b){_ in l&&(t?l[_]=b:l[_].value=b)}function d(){i.clear();for(const _ of u)m(_,!1)}function v(_,b){var M,W;const y=(M=_.key)==null?void 0:M.toLowerCase(),T=[(W=_.code)==null?void 0:W.toLowerCase(),y].filter(Boolean);y&&(b?i.add(y):i.delete(y));for(const I of T)u.add(I),m(I,b);y==="meta"&&!b?(c.forEach(I=>{i.delete(I),m(I,!1)}),c.clear()):typeof _.getModifierState=="function"&&_.getModifierState("Meta")&&b&&[...i,...T].forEach(I=>c.add(I))}Mt(n,"keydown",_=>(v(_,!0),s(_)),{passive:a}),Mt(n,"keyup",_=>(v(_,!1),s(_)),{passive:a}),Mt("blur",d,{passive:!0}),Mt("focus",d,{passive:!0});const E=new Proxy(l,{get(_,b,M){if(typeof b!="string")return Reflect.get(_,b,M);if(b=b.toLowerCase(),b in r&&(b=r[b]),!(b in l))if(/[+_-]/.test(b)){const y=b.split(/[+_-]/g).map(L=>L.trim());l[b]=U(()=>y.every(L=>g(E[L])))}else l[b]=z(!1);const W=Reflect.get(_,b,M);return t?g(W):W}});return E}var Qr;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(Qr||(Qr={}));var Ud=Object.defineProperty,Zr=Object.getOwnPropertySymbols,Hd=Object.prototype.hasOwnProperty,Bd=Object.prototype.propertyIsEnumerable,es=(e,t,n)=>t in e?Ud(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Wd=(e,t)=>{for(var n in t||(t={}))Hd.call(t,n)&&es(e,n,t[n]);if(Zr)for(var n of Zr(t))Bd.call(t,n)&&es(e,n,t[n]);return e};const jd={easeInSine:[.12,0,.39,0],easeOutSine:[.61,1,.88,1],easeInOutSine:[.37,0,.63,1],easeInQuad:[.11,0,.5,0],easeOutQuad:[.5,1,.89,1],easeInOutQuad:[.45,0,.55,1],easeInCubic:[.32,0,.67,0],easeOutCubic:[.33,1,.68,1],easeInOutCubic:[.65,0,.35,1],easeInQuart:[.5,0,.75,0],easeOutQuart:[.25,1,.5,1],easeInOutQuart:[.76,0,.24,1],easeInQuint:[.64,0,.78,0],easeOutQuint:[.22,1,.36,1],easeInOutQuint:[.83,0,.17,1],easeInExpo:[.7,0,.84,0],easeOutExpo:[.16,1,.3,1],easeInOutExpo:[.87,0,.13,1],easeInCirc:[.55,0,1,.45],easeOutCirc:[0,.55,.45,1],easeInOutCirc:[.85,0,.15,1],easeInBack:[.36,0,.66,-.56],easeOutBack:[.34,1.56,.64,1],easeInOutBack:[.68,-.6,.32,1.6]};Wd({linear:Rd},jd);function Kd(e={}){const{window:t=Tr,initialWidth:n=1/0,initialHeight:r=1/0,listenOrientation:a=!0,includeScrollbar:s=!0}=e,i=z(n),o=z(r),l=()=>{t&&(s?(i.value=t.innerWidth,o.value=t.innerHeight):(i.value=t.document.documentElement.clientWidth,o.value=t.document.documentElement.clientHeight))};return l(),Fd(l),Mt("resize",l,{passive:!0}),a&&Mt("orientationchange",l,{passive:!0}),{width:i,height:o}}const Gn=z([{route:"/ran/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/designMode.html",meta:{description:"",title:"23classicdesignpatterns",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/",meta:{description:`# ranuts overview

## Method list

| Method        | description                                                            | detail                              |
| `,title:"ranutsoverview",date:"2024-09-16 09:19:44"}},{route:"/ran/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-09-16 09:19:44"}},{route:"/ran/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-09-16 09:19:44"}},{route:"/ran/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-09-16 09:19:44"}},{route:"/ran/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/babel.html",meta:{description:"",title:"Babel",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/bundle.html",meta:{description:"",title:"Bundle",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/designMode.html",meta:{description:"",title:"23种经典设计模式",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/docPreview.html",meta:{description:`<h1> 最全的 docx,pptx,xlsx(excel),pdf 文件预览方案总结 </h1>

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

## 一：市面上现有的文件预览服务

### 1.微软

\`docx\`,\`pptx\`,\`xlsx\`可以说是\`office\`三件套，那自然得看一下 **微软官方** 提供的文件预览服务。使用方法特别简单，只需要将文件链接，拼接到参数后面即可。

记得\`encodeURL\`

\`\`\`js
https://view.officeapps.live.com/op/view.aspx?src=\${encodeURIComponent(url)}
\`\`\`

#### (1).PPTX 预览效果：

![image.png](../../../assets/article/docPreview/ms_ppt.webp)

- 优点：还原度很高，功能很丰富，可以选择翻页，甚至支持点击播放动画。
- 缺点：不知道是不是墙的原因，加载稍慢。

#### (2).Excel 预览效果：

![image.png](../../../assets/article/docPreview/ms_excel.webp)

#### (3).Doxc 预览效果

![image.png](../../../assets/article/docPreview/ms_word.webp)

#### (4).PDF 预览效果

这个我测试没有成功，返回了一个错误，其他人可以试试。

![image.png](../../../assets/article/docPreview/ms_file_not.webp)

#### (5).总的来说

对于\`docx\`,\`pptx\`,\`xlsx\`都有较好的支持，\`pdf\`不行。

还有一个坑点是：这个服务是否稳定，有什么限制，是否收费，都查不到一个定论。在\`office\`官方网站上甚至找不到介绍这个东西的地方。

目前只能找到一个\`Q&A\`:https://answers.microsoft.com/en-us/msoffice/forum/all/what-is-the-status-of-viewofficeappslivecom/830fd75c-9b47-43f9-89c9-4303703fd7f6

微软官方人员回答表示：

![image.png](../../../assets/article/docPreview/ms_answer.webp)

翻译翻译，就是：几乎永久使用，没有收费计划，不会存储预览的文件数据，限制文件\`10MB\`，建议用于 **查看互联网上公开的文件**。

但经过某些用户测试发现：

![image.png](../../../assets/article/docPreview/ms_answer_2.webp)

使用了微软的文件预览服务，然后删除了文件地址，仍然可访问，但过一段时间会失效。

### 2.Google Drive 查看器

接入简单，同 \`Office Web Viewer\`，只需要把 \`src\` 改为\`https://drive.google.com/viewer?url=\${encodeURIComponent(url)}\`即可。

限制\`25MB\`,支持以下格式：

![image.png](../../../assets/article/docPreview/google_doc_view.webp)

测试效果，支持\`docx,pptx,xlsx,pdf\`预览，但\`pptx\`预览的效果不如微软，没有动画效果，样式有小部分会错乱。

**由于某些众所周知的原因，不可用**

### 3.阿里云 IMM

官方文档如下：https://help.aliyun.com/document_detail/63273.html

![image.png](../../../assets/article/docPreview/ali_doc.webp)

付费使用

### 4.XDOC 文档预览

说了一些大厂的，在介绍一些其他的，**需要自行分辨**

官网地址：https://view.xdocin.com/view-xdocin-com_6x5f4x.htm

![image.png](../../../assets/article/docPreview/xdoc.webp)

### 5.Office Web 365

需要注意的是，虽然名字很像\`office\`，但我们看网页的\`Copyright\`可以发现，其实是一个西安的公司，**不是微软**。

但毕竟也提供了文件预览的服务

官网地址：https://www.officeweb365.com/

![image.png](../../../assets/article/docPreview/ow365.webp)

### 6.WPS 开放平台

官方地址：https://solution.wps.cn/

![image.png](../../../assets/article/docPreview/wps_office.webp)

付费使用，价格如下：

![image.png](../../../assets/article/docPreview/wps_office_price.webp)

## 二：前端处理方案

### 1.pptx 的预览方案

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
| `,title:"",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/functionalProgramming.html",meta:{description:"",title:"函数式编程",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/imagemin.html",meta:{description:"",title:"imagemin图片压缩源码分析",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/systemDesign.html",meta:{description:"",title:"如何处理一个系统设计",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/video.html",meta:{description:`<h1>实现自适应码率 Web 视频加密播放：前后端的挑战与解决方案</h1>

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

源码地址：https://github.com/chaxus/ran

\`demo\`文档做了国际化，可切换到中文

任何一个项目，立项肯定先是技术调研，我们先看看一些大公司的视频播放方案

## 一：一些知名公司的 web 视频播放方案

### 1.B 站

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

### 2. 爱奇艺：（爱奇艺、土豆、优酷）

爱奇艺这里就不贴视频链接了，因为随便点一个视频，都要先看广告。

![image.png](../../../assets/article/video/aqiyi_demo.webp)

爱奇艺的视频主要请求的是\`f4v\`格式，也是分片加载。

播放一个视频时，请求多个\`f4v\`文件。

也采用\`Range\`。但和 B 站不一样的是，B 站的\`Range\`属性是在\`m4s\`请求的请求头里面，而爱奇艺的看起来是在\`querystring\`上，在请求\`query\`上带着\`range\`参数。

因为没发现这个请求的\`header\`里面有\`range\`参数。比如：

\`https://v-6fce1712.71edge.com/videos/other/20231113/6b/bb/3f3fe83b89124248c3216156dfe2f4c3.f4v?dis_k=2ba39ee8c55c4d23781e3fb9f91fa7a46&dis_t=1701439831&dis_dz=CNC-BeiJing&dis_st=46&src=iqiyi.com&dis_hit=0&dis_tag=01010000&uuid=72713f52-6569e957-351&cross-domain=1&ssl=1&pv=0.1&cphc=arta&range=0-9000\`

### 3.抖音：

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

### 4.小红书：

测试用的例子链接：https://www.xiaohongshu.com/discovery/item/63b286d1000000001f00b495

小红书的方案更加简单粗暴，打开控制台，直接告诉你就是请求一个\`mp4\`，然后直接播放就完事了。

![image.png](../../../assets/article/video/red_book.webp)

### 5.总结

看完了以上的各家大厂的方案，我们可以看到，基本原理都是边播放边加载，减少直接加载大视频文本的成本。并且通过分片传输，还能动态控制视频码率（清晰度）。做到根据网速，加载不同码率的分片文件，做到动态码率适应。

同时采用的视频格式，比如\`f4v\`，\`m4s\`，都不是能直接播放的媒体格式，需要一定的处理。增加盗取视频的成本，增加一定的安全性。

如果没有强要求，也可以直接采用\`mp4\`，或者直接用\`video\`播放一个视频文件地址。

## 二：常见的视频格式与协议

我们知道视频的常见格式有\`mp4\`，同时上面介绍了 B 站播放用的\`m4s\`格式，爱奇艺用的\`f4v\`格式

- 除了这些还有哪些视频格式？
- 为什么有这么多视频格式，有哪些不同点呢？
- 为什么这些公司会采用这种格式来播放视频呢？

### 1. B 站用的\`m4s\`

\`M4S\`格式不是一种通用的视频格式，需要使用专门的软件或工具才能打开和编辑。

\`M4S\` 通常会和 \`MPEG-DASH\` 流媒体技术一起，通过流式传输的视频的一小部分。播放器会按接收顺序播放这些片段。第一个 \`M4S\` 段会包含一些初始化的数据标识。

\`MPEG-DASH\` 是一种自适应比特率流媒体技术，通过将内容分解为一系列不同码率的\`M4S\`片段，然后根据当前网络带宽进行自动调整。如果想在在\`web\`音视频中采用\`DASH\`技术，可以看下
https://github.com/Dash-Industry-Forum/dash.js

### 2. 爱奇艺的\`f4v\`

\`F4V\`是一种流媒体格式，它是由\`Adobe\`公司推出的，继\`FLV\`格式之后支持\`H.264\`编码的流媒体格式。\`F4V\`格式的视频不是一种通用的视频格式，**但通常情况下**，都可以将文件后缀改为\`FLV\`，这样就可以使用支持\`FLV\`的播放器进行观看。

\`FLV\`格式跟常见的\`MP4\`格式比起来，结构更加简单，所以加载\`metadata\`(视频元数据，比如视频时长等信息) 会更快。具体结构我们可以在这里查到：https://en.wikipedia.org/wiki/Flash_Video#Flash_Video_Structure

比如，这是\`FLV\`文件的标准头，定义了从几个比特到几个比特之间，是什么含义。我们知道后，可以用\`MediaSource\`进行读取和转码。

| Field          | Data Type    | Default  | Details                                             |
| `,title:"",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/visual.html",meta:{description:"",title:"实现曲线",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/note/centos.html",meta:{description:"",title:"CentOS",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/note/docker.html",meta:{description:"",title:"docker",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/note/libreoffice2wasm.html",meta:{description:"",title:"总的来说，项目还是非常大的",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/note/ubuntu.html",meta:{description:"",title:"ubuntu",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/",meta:{description:`# ranui

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
    console.log('e`,title:"ranui",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/",meta:{description:`# ranuts overview

## 方法列表

| 方法          | 说明                               | 详细内容                            |
| `,title:"ranutsoverview",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/types/TS类型.html",meta:{description:"",title:"TypeScript类型系统中的类型",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/types/模式匹配.html",meta:{description:"",title:"模式匹配",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/types/类型运算.html",meta:{description:"",title:"TypeScript类型系统中的类型运算",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/types/高级类型.html",meta:{description:"",title:"TypeScript内置的高级类型",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/",meta:{description:"",title:"Tenclassicsortingalgorithms",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/button/",meta:{description:"",title:"Button",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/checkbox/",meta:{description:"",title:"CheckBox",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/icon/",meta:{description:"",title:"Icon",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/image/",meta:{description:"",title:"Image",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/input/",meta:{description:"",title:"Input",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/math/",meta:{description:"",title:"math",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/message/",meta:{description:`# message

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
| `,title:"message",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/modal/",meta:{description:"",title:"",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/player/",meta:{description:`# r-player

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
| `,title:"r-player",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/popover/",meta:{description:"",title:"Popover",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/preview/",meta:{description:"",title:"preview",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/progress/",meta:{description:`# progress

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
| `,title:"progress",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/radar/",meta:{description:`# Radar

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
| `,title:"Radar",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/select/",meta:{description:"",title:"Select",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/skeleton/",meta:{description:"",title:"skeleton",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/tab/",meta:{description:"",title:"Tab",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

Picture turn 'base64'

## API

### Return

| argument  | Instructions                                     | type                            |
| `,title:"convertImageToBase64",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument | Instructions     | type     |
| `,title:"filterObj",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument | Instructions     | type     |
| `,title:"formatJson",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

Pass in a string to get the value of the cookie with the specified name

## API

### Return

| argument | Instructions                                          | type     |
| `,title:"getCookie",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/ocr.html",meta:{description:`# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| `,title:"OCR",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

Pass in a string and convert it to 'xml'

## API

### Return

| argument      | Instructions          | type          |
| `,title:"str2Xml",date:"2024-09-16 09:19:44"}},{route:"/ran/src/ranuts/utils/task.html",meta:{description:`# Statistical execution time

Sometimes, we need statistics on the execution time of a function to analyze performance. Therefore, the 'startTask' and 'taskEnd' functions are wrapped. Three other statistical methods are also introduced

1. \`new Date().getTime()\`,
2. \`console.time()\` , \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

Execute before the task begins

#### Return

| 参数   | 说明     | 类型             |
| `,title:"Statisticalexecutiontime",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/astParse/tokenizer.html",meta:{description:"",title:"AbstractSyntaxTree",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/javascript/domLoad.html",meta:{description:"",title:"页面加载完成后事件",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/",meta:{description:"",title:"十大经典排序",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/calculate.html",meta:{description:"",title:"数组长度做计数",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/",meta:{description:"",title:"TypeScript的类型系统",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/pattern.html",meta:{description:"",title:"模式匹配提取",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/reconstruction.html",meta:{description:"",title:"重新构造做变换",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/recursion.html",meta:{description:"",title:"递归复用",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/typescript/unionType.html",meta:{description:"",title:"分布式条件类型",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/button/",meta:{description:"",title:"Button按钮",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/checkbox/",meta:{description:"",title:"CheckBox多选框",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/icon/",meta:{description:"",title:"Icon图标",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/image/",meta:{description:"",title:"Image图片",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/input/",meta:{description:"",title:"Input输入框",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/loading/",meta:{description:"",title:"Loading",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/math/",meta:{description:"",title:"math数学公式",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/message/",meta:{description:`# message 全局提示

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
| `,title:"message全局提示",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/modal/",meta:{description:"",title:"",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/player/",meta:{description:`# r-player 视频播放器

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
| `,title:"r-player视频播放器",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/popover/",meta:{description:"",title:"Popover气泡卡片",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/preview/",meta:{description:"",title:"preview文件预览",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/progress/",meta:{description:`# progress 进度条

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
| `,title:"progress进度条",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/radar/",meta:{description:`# Radar 雷达图

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
| `,title:"Radar雷达图",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/select/",meta:{description:"",title:"Select下拉选择框",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/skeleton/",meta:{description:"",title:"skeleton骨架屏",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/tab/",meta:{description:"",title:"Tab图标",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranui/tabs/",meta:{description:"",title:"Tab",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/binaryTree/",meta:{description:"",title:"二叉树的定义",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/bundler/",meta:{description:"",title:"Bundler",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/appendFile.html",meta:{description:`# AppendFile

追加一些数据到文件内

## API

### Return

- Promise

| 参数    | 说明                                 | 类型      | 描述                         |
| `,title:"AppendFile",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/fileInfo.html",meta:{description:`# QueryFileInfo

查询一个文件的详细信息，一般用于区分文件还是目录，可以通过返回的 data 来判断（data.isDirectory()）

## API

### Return

- Promise

| 参数    | 说明                       | 类型      | 描述                 |
| `,title:"QueryFileInfo",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/readDir.html",meta:{description:`# ReadDir

读一个目录下的所有文件

## API

### Return

- Promise

| 参数   | 说明                 | 类型    | 描述           |
| `,title:"ReadDir",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/readFile.html",meta:{description:`# ReadFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数 | 说明           | 类型      | 描述                         |
| `,title:"ReadFile",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/watchFile.html",meta:{description:`# WatchFile

观察一个文件是否改变

## API

### Return

- Promise

| 参数   | 说明           | 类型      | 描述                         |
| `,title:"WatchFile",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/file/writeFile.html",meta:{description:`# WriteFile

将内容写入文件

## API

### Return

- Promise

| 参数    | 说明                                           | 类型      | 描述                 |
| `,title:"WriteFile",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/mimeType/mimeType.html",meta:{description:`# getMime

传入文件格式后缀，返回\`mime type\`

## API

### Return

| 参数     | 说明            | 类型     |
| `,title:"getMime",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/mode/subscribe.html",meta:{description:`# EventEmitter

发布订阅的类

## Class

### Methods

| 方法 | 参数                                   | 说明                               | 默认值 |
| `,title:"EventEmitter",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/convertImageToBase64.html",meta:{description:`# convertImageToBase64

图片转\`base64\`

## API

### Return

| 参数      | 说明                 | 类型                            |
| `,title:"convertImageToBase64",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/filterObj.html",meta:{description:`# filterObj

过滤对象的属性，去除对象中在 list 数组里面有的属性，返回一个新对象，一般是用于去除空字符和 null

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"filterObj",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/formatJson.html",meta:{description:`# formatJson

传入一个 JSON 或者 JSON 的字符串，添加空格和换行进行返回一个格式化的 JSON 字符串

## API

### Return

| 参数     | 说明           | 类型     |
| `,title:"formatJson",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/getCookie.html",meta:{description:`# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| `,title:"getCookie",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/ocr.html",meta:{description:`# OCR

传入图片和对应的语言类型，返回图片中的文本。

## API

### Return

| 参数      | 说明                 | 类型      |
| `,title:"OCR",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/str2xml.html",meta:{description:`# str2Xml

传入字符串，转成\`xml\`

## API

### Return

| 参数          | 说明                  | 类型          |
| `,title:"str2Xml",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/ranuts/utils/task.html",meta:{description:`# 统计执行时间

有的时候，我们需要统计一个函数的执行时间，用于分析性能。因此封装了\`startTask\`和\`taskEnd\`函数。同时介绍其他三种统计方法

1. \`new Date().getTime()\`,
2. \`console.time()\` 和 \`console.timeEnd()\`,
3. \`performance.now()\`

## 一.\`startTask\`,\`taskEnd\`

### 1.startTask

任务开始之前执行

#### Return

| 参数   | 说明     | 类型             |
| `,title:"统计执行时间",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/bubble/",meta:{description:"",title:"BubbleSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/bucket/",meta:{description:"",title:"BucketSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/count/",meta:{description:"",title:"CountSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/heap/",meta:{description:"",title:"HeapSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/insert/",meta:{description:"",title:"InsertSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/merge/",meta:{description:"",title:"MergeSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/quick/",meta:{description:"",title:"QuickSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/radix/",meta:{description:"",title:"RadixSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/select/",meta:{description:"",title:"SelectionSort",date:"2024-09-16 09:19:44"}},{route:"/ran/src/article/sort/shell/",meta:{description:"",title:"ShellSort",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/bubble/",meta:{description:"",title:"冒泡排序（BubbleSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/bucket/",meta:{description:"",title:"桶排序(BucketSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/count/",meta:{description:"",title:"计数排序（CountSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/heap/",meta:{description:"",title:"堆排序（HeapSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/insert/",meta:{description:"",title:"插入排序（InsertSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/merge/",meta:{description:"",title:"归并排序（MergeSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/quick/",meta:{description:"",title:"快速排序（QuickSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/radix/",meta:{description:"",title:"基数排序（RadixSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/select/",meta:{description:"",title:"选择排序（SelectionSort）",date:"2024-09-16 09:19:44"}},{route:"/ran/cn/src/article/sort/shell/",meta:{description:"",title:"希尔排序（ShellSort）",date:"2024-09-16 09:19:44"}}]),Gd={locales:{root:{btnPlaceholder:"Search",placeholder:"Search Docs...",emptyText:"No results",heading:"Total: {{searchResult}} search results."},zh:{customSearchQuery(e){return e.replace(/[\u4e00-\u9fa5]/g," $& ").replace(/\s+/g," ").trim()},btnPlaceholder:"搜索",placeholder:"搜索文档",emptyText:"空空如也",heading:"共：{{searchResult}} 条结果",showDate:!1}}};function Yd(e,t="yyyy-MM-dd hh:mm:ss"){e instanceof Date||(e=new Date(e));const n={"M+":e.getMonth()+1,"d+":e.getDate(),"h+":e.getHours(),"m+":e.getMinutes(),"s+":e.getSeconds(),"q+":Math.floor((e.getMonth()+3)/3),S:e.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,`${e.getFullYear()}`.substr(4-RegExp.$1.length)));for(const r in n)new RegExp(`(${r})`).test(t)&&(t=t.replace(RegExp.$1,RegExp.$1.length===1?n[r]:`00${n[r]}`.substr(`${n[r]}`.length)));return t}const zd={},Xd={width:"594",height:"112",viewBox:"0 0 594 112",fill:"none",xmlns:"http://www.w3.org/2000/svg"};function Jd(e,t){return h(),C("svg",Xd,t[0]||(t[0]=[Ei('<path d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z" fill="black"></path><path d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z" fill="black"></path><path d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z" fill="black"></path><path d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z" fill="black"></path><path d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z" fill="black"></path><path d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z" fill="black"></path><path d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z" fill="black"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z" fill="black"></path><path d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z" fill="white" stroke="black" stroke-width="8"></path><path d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z" fill="black"></path><ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="white"></ellipse>',11)]))}const qd=q(zd,[["render",Jd]]),Qd={class:"blog-search","data-pagefind-ignore":"all"},Zd={class:"search-dialog"},em={class:"link"},tm={class:"title"},nm={key:0,class:"date"},rm=["innerHTML"],sm={class:"command-palette-logo"},am={href:"https://github.com/cloudcannon/pagefind",target:"_blank",rel:"noopener noreferrer"},im=V({__name:"Search",setup(e){Si(D=>({"5b3346c5":c.value}));const t=z([]),n=Gd,{localeIndex:r,site:a}=vn(),s=U(()=>{var D;return{...n,...((D=n==null?void 0:n.locales)==null?void 0:D[r.value])||{}}}),i=U(()=>{var D;return((D=s.value)==null?void 0:D.showDate)??!0}),o=Kd(),l=U(()=>o.width.value<760),c=U(()=>l.value?0:1),u=U(()=>{var D;return(D=s.value)!=null&&D.heading?s.value.heading.replace(/\{\{searchResult\}\}/,t.value.length):`Total: ${t.value.length} search results.`}),m=z("");We(()=>{m.value=/(Mac|iPhone|iPod|iPad)/i.test(navigator==null?void 0:navigator.platform)?"⌘":"Ctrl"});const d=z(!1),v=z(""),E=Vd({passive:!1,onEventFired(D){D.ctrlKey&&D.key==="k"&&D.type==="keydown"&&D.preventDefault()}}),_=E["Meta+K"],b=E["Ctrl+K"],M=E.Escape;ke(_,D=>{D&&(d.value=!0)}),ke(b,D=>{D&&(d.value=!0)}),ke(M,D=>{D&&(d.value=!1)});function W(){if(!v.value){t.value=[];return}t.value=Gn.value.filter(D=>`${D.meta.description}${D.meta.title}`.includes(v.value)).map(D=>{var re,Ee;return{...D,meta:{...D.meta,description:((Ee=(re=D.meta)==null?void 0:re.description)==null?void 0:Ee.replace(new RegExp(`(${v.value})`,"g"),"<mark>$1</mark>"))||""}}}),t.value.sort((D,re)=>+new Date(re.meta.date)-+new Date(D.meta.date))}const y=U(()=>{var D;return((D=s.value)==null?void 0:D.resultOptimization)??!0});ke(()=>v.value,async()=>{var D,re,Ee;if(!((D=window==null?void 0:window.__pagefind__)!=null&&D.search))W();else{const Oe=typeof s.value.customSearchQuery=="function"?s.value.customSearchQuery(v.value):v.value;await((Ee=(re=window==null?void 0:window.__pagefind__)==null?void 0:re.search)==null?void 0:Ee.call(re,Oe).then(async _e=>{const Ze=(await Promise.all(_e.results.map(be=>be.data()))).map(be=>{var Le;return{route:be.url.startsWith(a.value.base)?be.url:In(be.url),meta:{title:be.meta.title,description:be.excerpt,date:(Le=be==null?void 0:be.meta)==null?void 0:Le.date}}}).map(be=>{const Le=Gn.value.find(Ve=>Ve.route===be.route);return{...be,meta:{...be.meta,...Le==null?void 0:Le.meta}}}).filter(be=>!y.value||Gn.value.some(Le=>Le.route===be.route));t.value=Ze.filter(s.value.filter??(()=>!0))}))}at(()=>{document.querySelectorAll('div[aria-disabled="true"]').forEach(Oe=>{Oe.setAttribute("aria-disabled","false")})})});function L(D){D.target===D.currentTarget&&(d.value=!1)}ke(()=>d.value,D=>{var re;D?at(()=>{var Ee;(Ee=document.querySelector("div[command-dialog-mask]"))==null||Ee.addEventListener("click",L)}):(re=document.querySelector("div[command-dialog-mask]"))==null||re.removeEventListener("click",L)});const T=z(999),I=z(0),R=U(()=>{const re=I.value%Math.ceil(t.value.length/T.value)*T.value;return t.value.slice(re,re+T.value)}),x=Oi(),$=nn();function me(D){d.value=!1,$.path!==D.value&&x.go(D.value)}const{lang:we}=vn(),Z=U(()=>s.value.langReload??!0);return ke(()=>we.value,()=>{Z.value&&window.location.reload()}),(D,re)=>{var Oe;const Ee=ht("ClientOnly");return h(),C("div",Qd,[w("div",{class:"nav-search-btn-wait",onClick:re[0]||(re[0]=_e=>d.value=!0)},[re[2]||(re[2]=w("span",null,[w("svg",{width:"14",height:"14",viewBox:"0 0 20 20"},[w("path",{d:"M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z",stroke:"currentColor",fill:"none","fill-rule":"evenodd","stroke-linecap":"round","stroke-linejoin":"round"})])],-1)),_n(w("span",{class:"search-tip"},se(((Oe=s.value)==null?void 0:Oe.btnPlaceholder)||"Search"),513),[[bn,!l.value]]),_n(w("span",{class:"metaKey"},se(m.value)+" K ",513),[[bn,!l.value]])]),Y(Ee,null,{default:A(()=>[Y(g(It).Dialog,{visible:d.value,theme:"algolia"},Ci({header:A(()=>{var _e;return[Y(g(It).Input,{value:v.value,"onUpdate:value":re[1]||(re[1]=De=>v.value=De),placeholder:((_e=s.value)==null?void 0:_e.placeholder)||"Search Docs"},null,8,["value","placeholder"])]}),body:A(()=>[w("div",Zd,[Y(g(It).List,null,{default:A(()=>[t.value.length?(h(),X(g(It).Group,{key:1,heading:u.value},{default:A(()=>[(h(!0),C(ge,null,Me(R.value,_e=>(h(),X(g(It).Item,{key:_e.route,"data-value":_e.route,onSelect:me},{default:A(()=>[w("div",em,[w("div",tm,[w("span",null,se(_e.meta.title),1),i.value&&_e.meta.date?(h(),C("span",nm,se(g(Yd)(_e.meta.date,"yyyy-MM-dd")),1)):G("",!0)]),w("div",{class:"des",innerHTML:_e.meta.description},null,8,rm)])]),_:2},1032,["data-value"]))),128))]),_:1},8,["heading"])):(h(),X(g(It).Empty,{key:0},{default:A(()=>{var _e;return[qe(se(((_e=s.value)==null?void 0:_e.emptyText)||"No results found."),1)]}),_:1}))]),_:1})])]),_:2},[t.value.length?{name:"footer",fn:A(()=>[w("div",sm,[w("a",am,[re[3]||(re[3]=w("span",{class:"command-palette-Label"},"Search by",-1)),Y(qd,{style:{width:"77px"}})])]),re[4]||(re[4]=w("ul",{class:"command-palette-commands"},[w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Enter key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"})])])]),w("span",{class:"command-palette-Label"},"to select")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow down",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 3.5v8M10.5 8.5l-3 3-3-3"})])])]),w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Arrow up",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M7.5 11.5v-8M10.5 6.5l-3-3-3 3"})])])]),w("span",{class:"command-palette-Label"},"to navigate")]),w("li",null,[w("kbd",{class:"command-palette-commands-key"},[w("svg",{width:"15",height:"15","aria-label":"Escape key",role:"img"},[w("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.2"},[w("path",{d:"M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"})])])]),w("span",{class:"command-palette-Label"},"to close")])],-1))]),key:"0"}:void 0]),1032,["visible"])]),_:1})])}}}),om=q(im,[["__scopeId","data-v-e93b2392"]]),lm=V({__name:"VPNavBarSocialLinks",setup(e){const{theme:t}=ie();return(n,r)=>g(t).socialLinks?(h(),X(Ir,{key:0,class:"VPNavBarSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),cm=q(lm,[["__scopeId","data-v-b7887d5a"]]),um=["href","rel","target"],dm={key:1},mm={key:2},pm=V({__name:"VPNavBarTitle",setup(e){const{site:t,theme:n}=ie(),{hasSidebar:r}=ot(),{currentLang:a}=rn(),s=U(()=>{var l;return typeof n.value.logoLink=="string"?n.value.logoLink:(l=n.value.logoLink)==null?void 0:l.link}),i=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.rel}),o=U(()=>{var l;return typeof n.value.logoLink=="string"||(l=n.value.logoLink)==null?void 0:l.target});return(l,c)=>(h(),C("div",{class:de(["VPNavBarTitle",{"has-sidebar":g(r)}])},[w("a",{class:"title",href:s.value??g(Lr)(g(a).link),rel:i.value,target:o.value},[S(l.$slots,"nav-bar-title-before",{},void 0,!0),g(n).logo?(h(),X(kn,{key:0,class:"logo",image:g(n).logo},null,8,["image"])):G("",!0),g(n).siteTitle?(h(),C("span",dm,se(g(n).siteTitle),1)):g(n).siteTitle===void 0?(h(),C("span",mm,se(g(t).title),1)):G("",!0),S(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,um)],2))}}),fm=q(pm,[["__scopeId","data-v-9f785053"]]),hm={class:"items"},gm={class:"title"},vm=V({__name:"VPNavBarTranslations",setup(e){const{theme:t}=ie(),{localeLinks:n,currentLang:r}=rn({correspondingLink:!0});return(a,s)=>g(n).length&&g(r).label?(h(),X(Cr,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:g(t).langMenuLabel||"Change language"},{default:A(()=>[w("div",hm,[w("p",gm,se(g(r).label),1),(h(!0),C(ge,null,Me(g(n),i=>(h(),X(Rn,{key:i.link,item:i},null,8,["item"]))),128))])]),_:1},8,["label"])):G("",!0)}}),_m=q(vm,[["__scopeId","data-v-d78d18d0"]]),bm={class:"wrapper"},ym={class:"container"},km={class:"title"},wm={class:"content"},Lm={class:"content-body"},Em=V({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(e){const t=e,{y:n}=Ys(),{hasSidebar:r}=ot(),{frontmatter:a}=ie(),s=z({});return kr(()=>{s.value={"has-sidebar":r.value,home:a.value.layout==="home",top:n.value===0,"screen-open":t.isScreenOpen}}),(i,o)=>(h(),C("div",{class:de(["VPNavBar",s.value])},[w("div",bm,[w("div",ym,[w("div",km,[Y(fm,null,{"nav-bar-title-before":A(()=>[S(i.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(i.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),w("div",wm,[w("div",Lm,[S(i.$slots,"nav-bar-content-before",{},void 0,!0),Y(om,{class:"search"}),Y(Jc,{class:"menu"}),Y(_m,{class:"translations"}),Y(ic,{class:"appearance"}),Y(cm,{class:"social-links"}),Y(Uc,{class:"extra"}),S(i.$slots,"nav-bar-content-after",{},void 0,!0),Y(Wc,{class:"hamburger",active:i.isScreenOpen,onClick:o[0]||(o[0]=l=>i.$emit("toggle-screen"))},null,8,["active"])])])])]),o[1]||(o[1]=w("div",{class:"divider"},[w("div",{class:"divider-line"})],-1))],2))}}),Sm=q(Em,[["__scopeId","data-v-f9756f2d"]]),Om={key:0,class:"VPNavScreenAppearance"},Cm={class:"text"},Im=V({__name:"VPNavScreenAppearance",setup(e){const{site:t,theme:n}=ie();return(r,a)=>g(t).appearance&&g(t).appearance!=="force-dark"&&g(t).appearance!=="force-auto"?(h(),C("div",Om,[w("p",Cm,se(g(n).darkModeSwitchLabel||"Appearance"),1),Y(Sr)])):G("",!0)}}),Am=q(Im,[["__scopeId","data-v-f7aa697b"]]),Tm=V({__name:"VPNavScreenMenuLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(h(),X(ze,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t),innerHTML:n.item.text},null,8,["href","target","rel","onClick","innerHTML"]))}}),Nm=q(Tm,[["__scopeId","data-v-8f3b9429"]]),Mm=V({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(e){const t=Ut("close-screen");return(n,r)=>(h(),X(ze,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,onClick:g(t)},{default:A(()=>[qe(se(n.item.text),1)]),_:1},8,["href","target","rel","onClick"]))}}),ba=q(Mm,[["__scopeId","data-v-7b9fb56c"]]),Pm={class:"VPNavScreenMenuGroupSection"},Rm={key:0,class:"title"},$m=V({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(e){return(t,n)=>(h(),C("div",Pm,[t.text?(h(),C("p",Rm,se(t.text),1)):G("",!0),(h(!0),C(ge,null,Me(t.items,r=>(h(),X(ba,{key:r.text,item:r},null,8,["item"]))),128))]))}}),Fm=q($m,[["__scopeId","data-v-4af57996"]]),xm=["aria-controls","aria-expanded"],Dm=["innerHTML"],Vm=["id"],Um={key:0,class:"item"},Hm={key:1,class:"item"},Bm={key:2,class:"group"},Wm=V({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(e){const t=e,n=z(!1),r=U(()=>`NavScreenGroup-${t.text.replace(" ","-").toLowerCase()}`);function a(){n.value=!n.value}return(s,i)=>(h(),C("div",{class:de(["VPNavScreenMenuGroup",{open:n.value}])},[w("button",{class:"button","aria-controls":r.value,"aria-expanded":n.value,onClick:a},[w("span",{class:"button-text",innerHTML:s.text},null,8,Dm),i[0]||(i[0]=w("span",{class:"vpi-plus button-icon"},null,-1))],8,xm),w("div",{id:r.value,class:"items"},[(h(!0),C(ge,null,Me(s.items,o=>(h(),C(ge,{key:JSON.stringify(o)},["link"in o?(h(),C("div",Um,[Y(ba,{item:o},null,8,["item"])])):"component"in o?(h(),C("div",Hm,[(h(),X(Ye(o.component),dt({ref_for:!0},o.props,{"screen-menu":""}),null,16))])):(h(),C("div",Bm,[Y(Fm,{text:o.text,items:o.items},null,8,["text","items"])]))],64))),128))],8,Vm)],2))}}),jm=q(Wm,[["__scopeId","data-v-9e6433b0"]]),Km={key:0,class:"VPNavScreenMenu"},Gm=V({__name:"VPNavScreenMenu",setup(e){const{theme:t}=ie();return(n,r)=>g(t).nav?(h(),C("nav",Km,[(h(!0),C(ge,null,Me(g(t).nav,a=>(h(),C(ge,{key:JSON.stringify(a)},["link"in a?(h(),X(Nm,{key:0,item:a},null,8,["item"])):"component"in a?(h(),X(Ye(a.component),dt({key:1,ref_for:!0},a.props,{"screen-menu":""}),null,16)):(h(),X(jm,{key:2,text:a.text||"",items:a.items},null,8,["text","items"]))],64))),128))])):G("",!0)}}),Ym=V({__name:"VPNavScreenSocialLinks",setup(e){const{theme:t}=ie();return(n,r)=>g(t).socialLinks?(h(),X(Ir,{key:0,class:"VPNavScreenSocialLinks",links:g(t).socialLinks},null,8,["links"])):G("",!0)}}),zm={class:"list"},Xm=V({__name:"VPNavScreenTranslations",setup(e){const{localeLinks:t,currentLang:n}=rn({correspondingLink:!0}),r=z(!1);function a(){r.value=!r.value}return(s,i)=>g(t).length&&g(n).label?(h(),C("div",{key:0,class:de(["VPNavScreenTranslations",{open:r.value}])},[w("button",{class:"title",onClick:a},[i[0]||(i[0]=w("span",{class:"vpi-languages icon lang"},null,-1)),qe(" "+se(g(n).label)+" ",1),i[1]||(i[1]=w("span",{class:"vpi-chevron-down icon chevron"},null,-1))]),w("ul",zm,[(h(!0),C(ge,null,Me(g(t),o=>(h(),C("li",{key:o.link,class:"item"},[Y(ze,{class:"link",href:o.link},{default:A(()=>[qe(se(o.text),1)]),_:2},1032,["href"])]))),128))])],2)):G("",!0)}}),Jm=q(Xm,[["__scopeId","data-v-642b9e57"]]),qm={class:"container"},Qm=V({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(e){const t=z(null),n=Js(Mn?document.body:null);return(r,a)=>(h(),X(Cn,{name:"fade",onEnter:a[0]||(a[0]=s=>n.value=!0),onAfterLeave:a[1]||(a[1]=s=>n.value=!1)},{default:A(()=>[r.open?(h(),C("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:t,id:"VPNavScreen"},[w("div",qm,[S(r.$slots,"nav-screen-content-before",{},void 0,!0),Y(Gm,{class:"menu"}),Y(Jm,{class:"translations"}),Y(Am,{class:"appearance"}),Y(Ym,{class:"social-links"}),S(r.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):G("",!0)]),_:3}))}}),Zm=q(Qm,[["__scopeId","data-v-1b440f23"]]),ep={key:0,class:"VPNav"},tp=V({__name:"VPNav",setup(e){const{isScreenOpen:t,closeScreen:n,toggleScreen:r}=Jl(),{frontmatter:a}=ie(),s=U(()=>a.value.navbar!==!1);return wr("close-screen",n),ft(()=>{Mn&&document.documentElement.classList.toggle("hide-nav",!s.value)}),(i,o)=>s.value?(h(),C("header",ep,[Y(Sm,{"is-screen-open":g(t),onToggleScreen:g(r)},{"nav-bar-title-before":A(()=>[S(i.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(i.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(i.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(i.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),Y(Zm,{open:g(t)},{"nav-screen-content-before":A(()=>[S(i.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(i.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):G("",!0)}}),np=q(tp,[["__scopeId","data-v-a62deceb"]]),rp=["role","tabindex"],sp={key:1,class:"items"},ap=V({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(e){const t=e,{collapsed:n,collapsible:r,isLink:a,isActiveLink:s,hasActiveLink:i,hasChildren:o,toggle:l}=eo(U(()=>t.item)),c=U(()=>o.value?"section":"div"),u=U(()=>a.value?"a":"div"),m=U(()=>o.value?t.depth+2===7?"p":`h${t.depth+2}`:"p"),d=U(()=>a.value?void 0:"button"),v=U(()=>[[`level-${t.depth}`],{collapsible:r.value},{collapsed:n.value},{"is-link":a.value},{"is-active":s.value},{"has-active":i.value}]);function E(b){"key"in b&&b.key!=="Enter"||!t.item.link&&l()}function _(){t.item.link&&l()}return(b,M)=>{const W=ht("VPSidebarItem",!0);return h(),X(Ye(c.value),{class:de(["VPSidebarItem",v.value])},{default:A(()=>[b.item.text?(h(),C("div",dt({key:0,class:"item",role:d.value},Ii(b.item.items?{click:E,keydown:E}:{},!0),{tabindex:b.item.items&&0}),[M[1]||(M[1]=w("div",{class:"indicator"},null,-1)),b.item.link?(h(),X(ze,{key:0,tag:u.value,class:"link",href:b.item.link,rel:b.item.rel,target:b.item.target},{default:A(()=>[(h(),X(Ye(m.value),{class:"text",innerHTML:b.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(h(),X(Ye(m.value),{key:1,class:"text",innerHTML:b.item.text},null,8,["innerHTML"])),b.item.collapsed!=null&&b.item.items&&b.item.items.length?(h(),C("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:_,onKeydown:Ai(_,["enter"]),tabindex:"0"},M[0]||(M[0]=[w("span",{class:"vpi-chevron-right caret-icon"},null,-1)]),32)):G("",!0)],16,rp)):G("",!0),b.item.items&&b.item.items.length?(h(),C("div",sp,[b.depth<5?(h(!0),C(ge,{key:0},Me(b.item.items,y=>(h(),X(W,{key:y.text,item:y,depth:b.depth+1},null,8,["item","depth"]))),128)):G("",!0)])):G("",!0)]),_:1},8,["class"])}}}),ip=q(ap,[["__scopeId","data-v-3d6ff150"]]),op=V({__name:"VPSidebarGroup",props:{items:{}},setup(e){const t=z(!0);let n=null;return We(()=>{n=setTimeout(()=>{n=null,t.value=!1},300)}),Pn(()=>{n!=null&&(clearTimeout(n),n=null)}),(r,a)=>(h(!0),C(ge,null,Me(r.items,s=>(h(),C("div",{key:s.text,class:de(["group",{"no-transition":t.value}])},[Y(ip,{item:s,depth:0},null,8,["item"])],2))),128))}}),lp=q(op,[["__scopeId","data-v-1952544a"]]),cp={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},up=V({__name:"VPSidebar",props:{open:{type:Boolean}},setup(e){const{sidebarGroups:t,hasSidebar:n}=ot(),r=e,a=z(null),s=Js(Mn?document.body:null);ke([r,a],()=>{var o;r.open?(s.value=!0,(o=a.value)==null||o.focus()):s.value=!1},{immediate:!0,flush:"post"});const i=z(0);return ke(t,()=>{i.value+=1},{deep:!0}),(o,l)=>g(n)?(h(),C("aside",{key:0,class:de(["VPSidebar",{open:o.open}]),ref_key:"navEl",ref:a,onClick:l[0]||(l[0]=Ti(()=>{},["stop"]))},[l[2]||(l[2]=w("div",{class:"curtain"},null,-1)),w("nav",cp,[l[1]||(l[1]=w("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),S(o.$slots,"sidebar-nav-before",{},void 0,!0),(h(),X(lp,{items:g(t),key:i.value},null,8,["items"])),S(o.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):G("",!0)}}),dp=q(up,[["__scopeId","data-v-452d748b"]]),mp=V({__name:"VPSkipLink",setup(e){const t=nn(),n=z();ke(()=>t.path,()=>n.value.focus());function r({target:a}){const s=document.getElementById(decodeURIComponent(a.hash).slice(1));if(s){const i=()=>{s.removeAttribute("tabindex"),s.removeEventListener("blur",i)};s.setAttribute("tabindex","-1"),s.addEventListener("blur",i),s.focus(),window.scrollTo(0,0)}}return(a,s)=>(h(),C(ge,null,[w("span",{ref_key:"backToTop",ref:n,tabindex:"-1"},null,512),w("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:r}," Skip to content ")],64))}}),pp=q(mp,[["__scopeId","data-v-e8369309"]]),fp=V({__name:"Layout",setup(e){const{isOpen:t,open:n,close:r}=ot(),a=nn();ke(()=>a.path,r),Zi(t,r);const{frontmatter:s}=ie(),i=Ni(),o=U(()=>!!i["home-hero-image"]);return wr("hero-image-slot-exists",o),(l,c)=>{const u=ht("Content");return g(s).layout!==!1?(h(),C("div",{key:0,class:de(["Layout",g(s).pageClass])},[S(l.$slots,"layout-top",{},void 0,!0),Y(pp),Y(Ui,{class:"backdrop",show:g(t),onClick:g(r)},null,8,["show","onClick"]),Y(np,null,{"nav-bar-title-before":A(()=>[S(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":A(()=>[S(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":A(()=>[S(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":A(()=>[S(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":A(()=>[S(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":A(()=>[S(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),Y(Xl,{open:g(t),onOpenMenu:g(n)},null,8,["open","onOpenMenu"]),Y(dp,{open:g(t)},{"sidebar-nav-before":A(()=>[S(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":A(()=>[S(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),Y(Pl,{"data-pagefind-body":""},{"page-top":A(()=>[S(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":A(()=>[S(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":A(()=>[S(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":A(()=>[S(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":A(()=>[S(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":A(()=>[S(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":A(()=>[S(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":A(()=>[S(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":A(()=>[S(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":A(()=>[S(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":A(()=>[S(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":A(()=>[S(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":A(()=>[S(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":A(()=>[S(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":A(()=>[S(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":A(()=>[S(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":A(()=>[S(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":A(()=>[S(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":A(()=>[S(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":A(()=>[S(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":A(()=>[S(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":A(()=>[S(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":A(()=>[S(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),Y(Dl),S(l.$slots,"layout-bottom",{},void 0,!0)],2)):(h(),X(u,{key:1}))}}}),hp=q(fp,[["__scopeId","data-v-4b62e9e8"]]),ya={Layout:hp,enhanceApp:({app:e})=>{e.component("Badge",xi)}};var gp=Object.defineProperty,vp=(e,t,n)=>t in e?gp(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,B=(e,t,n)=>vp(e,typeof t!="symbol"?t+"":t,n),ka=(e=>(e.IPAD="ipad",e.ANDROID="android",e.IPhONE="iphone",e.PC="pc",e))(ka||{});const wa=()=>{if(typeof window<"u"){const e=navigator.userAgent.toLowerCase();return/ipad|ipod/.test(e)?"ipad":/android/.test(e)?"android":/iphone/.test(e)?"iphone":"pc"}return"pc"},sn=typeof window<"u",_p=()=>sn?window.navigator.userAgent.toLowerCase().includes("micromessenger"):!1,bp=()=>{if(!sn)return!1;const e=window.navigator.userAgent;return!!/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(e)},yp=()=>{if(!sn)return!1;const e=/iphone/i.test(window.navigator.userAgent),t=window.devicePixelRatio&&window.devicePixelRatio===2,n=window.devicePixelRatio&&window.devicePixelRatio===3,r=window.screen.width===360&&window.screen.height===780,a=window.screen.width===375&&window.screen.height===812,s=window.screen.width===390&&window.screen.height===844,i=window.screen.width===414&&window.screen.height===896,o=window.screen.width===428&&window.screen.height===926;switch(!0){case(e&&n&&r):case(e&&n&&a):case(e&&n&&s):case(e&&t&&i):case(e&&n&&i):case(e&&n&&o):return!0;default:return!1}},La="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ea="ARRAYBUFFER not supported by this environment",Sa="UINT8ARRAY not supported by this environment";function kp(e,t,n,r,a){let s,i,o=0,l,c,u,m,d,v;r=r||0;const E=n||[0],_=r>>>3;if(t==="UTF8")for(d=a===-1?3:0,l=0;l<e.length;l+=1)for(s=e.charCodeAt(l),i=[],128>s?i.push(s):2048>s?(i.push(192|s>>>6),i.push(128|s&63)):55296>s||57344<=s?i.push(224|s>>>12,128|s>>>6&63,128|s&63):(l+=1,s=65536+((s&1023)<<10|e.charCodeAt(l)&1023),i.push(240|s>>>18,128|s>>>12&63,128|s>>>6&63,128|s&63)),c=0;c<i.length;c+=1){for(m=o+_,u=m>>>2;E.length<=u;)E.push(0);E[u]|=i[c]<<8*(d+a*(m%4)),o+=1}else for(d=a===-1?2:0,v=t==="UTF16LE"&&a!==1||t!=="UTF16LE"&&a===1,l=0;l<e.length;l+=1){for(s=e.charCodeAt(l),v===!0&&(c=s&255,s=c<<8|s>>>8),m=o+_,u=m>>>2;E.length<=u;)E.push(0);E[u]|=s<<8*(d+a*(m%4)),o+=2}return{value:E,binLen:o*8+r}}function wp(e,t,n,r){let a,s,i,o;if(e.length%2!==0)throw new Error("String of HEX type must be in byte increments");n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(a=0;a<e.length;a+=2){if(s=parseInt(e.substr(a,2),16),isNaN(s))throw new Error("String of HEX type contains invalid characters");for(o=(a>>>1)+c,i=o>>>2;l.length<=i;)l.push(0);l[i]|=s<<8*(u+r*(o%4))}return{value:l,binLen:e.length*4+n}}function Lp(e,t,n,r){let a,s,i,o;n=n||0;const l=t||[0],c=n>>>3,u=r===-1?3:0;for(s=0;s<e.length;s+=1)a=e.charCodeAt(s),o=s+c,i=o>>>2,l.length<=i&&l.push(0),l[i]|=a<<8*(u+r*(o%4));return{value:l,binLen:e.length*8+n}}function Ep(e,t,n,r){let a=0,s,i,o,l,c,u,m;n=n||0;const d=t||[0],v=n>>>3,E=r===-1?3:0,_=e.indexOf("=");if(e.search(/^[a-z\d=+/]+$/i)===-1)throw new Error("Invalid character in base-64 string");if(e=e.replace(/=/g,""),_!==-1&&_<e.length)throw new Error("Invalid '=' found in base-64 string");for(i=0;i<e.length;i+=4){for(c=e.substr(i,4),l=0,o=0;o<c.length;o+=1)s=La.indexOf(c.charAt(o)),l|=s<<18-6*o;for(o=0;o<c.length-1;o+=1){for(m=a+v,u=m>>>2;d.length<=u;)d.push(0);d[u]|=(l>>>16-o*8&255)<<8*(E+r*(m%4)),a+=1}}return{value:d,binLen:a*8+n}}function Oa(e,t,n,r){let a,s,i;n=n||0;const o=t||[0],l=n>>>3,c=r===-1?3:0;for(a=0;a<e.length;a+=1)i=a+l,s=i>>>2,o.length<=s&&o.push(0),o[s]|=e[a]<<8*(c+r*(i%4));return{value:o,binLen:e.length*8+n}}function Sp(e,t,n,r){return Oa(new Uint8Array(e),t,n,r)}function Wt(e,t,n){switch(t){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(e){case"HEX":return function(r,a,s){return wp(r,a,s,n)};case"TEXT":return function(r,a,s){return kp(r,t,a,s,n)};case"B64":return function(r,a,s){return Ep(r,a,s,n)};case"BYTES":return function(r,a,s){return Lp(r,a,s,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ea)}return function(r,a,s){return Sp(r,a,s,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Sa)}return function(r,a,s){return Oa(r,a,s,n)};default:throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}function Op(e,t,n,r){const a="0123456789abcdef";let s="",i,o;const l=t/8,c=n===-1?3:0;for(i=0;i<l;i+=1)o=e[i>>>2]>>>8*(c+n*(i%4)),s+=a.charAt(o>>>4&15)+a.charAt(o&15);return r.outputUpper?s.toUpperCase():s}function Cp(e,t,n,r){let a="",s,i,o,l,c;const u=t/8,m=n===-1?3:0;for(s=0;s<u;s+=3)for(l=s+1<u?e[s+1>>>2]:0,c=s+2<u?e[s+2>>>2]:0,o=(e[s>>>2]>>>8*(m+n*(s%4))&255)<<16|(l>>>8*(m+n*((s+1)%4))&255)<<8|c>>>8*(m+n*((s+2)%4))&255,i=0;i<4;i+=1)s*8+i*6<=t?a+=La.charAt(o>>>6*(3-i)&63):a+=r.b64Pad;return a}function Ip(e,t,n){let r="",a,s;const i=t/8,o=n===-1?3:0;for(a=0;a<i;a+=1)s=e[a>>>2]>>>8*(o+n*(a%4))&255,r+=String.fromCharCode(s);return r}function Ap(e,t,n){let r;const a=t/8,s=new ArrayBuffer(a),i=new Uint8Array(s),o=n===-1?3:0;for(r=0;r<a;r+=1)i[r]=e[r>>>2]>>>8*(o+n*(r%4))&255;return s}function Tp(e,t,n){let r;const a=t/8,s=n===-1?3:0,i=new Uint8Array(a);for(r=0;r<a;r+=1)i[r]=e[r>>>2]>>>8*(s+n*(r%4))&255;return i}function ts(e,t,n,r){switch(e){case"HEX":return function(a){return Op(a,t,n,r)};case"B64":return function(a){return Cp(a,t,n,r)};case"BYTES":return function(a){return Ip(a,t,n)};case"ARRAYBUFFER":try{new ArrayBuffer(0)}catch{throw new Error(Ea)}return function(a){return Ap(a,t,n)};case"UINT8ARRAY":try{new Uint8Array(0)}catch{throw new Error(Sa)}return function(a){return Tp(a,t,n)};default:throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY")}}const an=4294967296,K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],nt=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],rt=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],on="Chosen SHA variant is not supported",Ca="Cannot set numRounds with MAC";function Ln(e,t){let n,r;const a=e.binLen>>>3,s=t.binLen>>>3,i=a<<3,o=4-a<<3;if(a%4!==0){for(n=0;n<s;n+=4)r=a+n>>>2,e.value[r]|=t.value[n>>>2]<<i,e.value.push(0),e.value[r+1]|=t.value[n>>>2]>>>o;return(e.value.length<<2)-4>=s+a&&e.value.pop(),{value:e.value,binLen:e.binLen+t.binLen}}else return{value:e.value.concat(t.value),binLen:e.binLen+t.binLen}}function ns(e){const t={outputUpper:!1,b64Pad:"=",outputLen:-1},n=e||{},r="Output length must be a multiple of 8";if(t.outputUpper=n.outputUpper||!1,n.b64Pad&&(t.b64Pad=n.b64Pad),n.outputLen){if(n.outputLen%8!==0)throw new Error(r);t.outputLen=n.outputLen}else if(n.shakeLen){if(n.shakeLen%8!==0)throw new Error(r);t.outputLen=n.shakeLen}if(typeof t.outputUpper!="boolean")throw new Error("Invalid outputUpper formatting option");if(typeof t.b64Pad!="string")throw new Error("Invalid b64Pad formatting option");return t}function mt(e,t,n,r){const a=e+" must include a value and format";if(!t){if(!r)throw new Error(a);return r}if(typeof t.value>"u"||!t.format)throw new Error(a);return Wt(t.format,t.encoding||"UTF8",n)(t.value)}class Fn{constructor(t,n,r){B(this,"shaVariant"),B(this,"inputFormat"),B(this,"utfType"),B(this,"numRounds"),B(this,"keyWithIPad"),B(this,"keyWithOPad"),B(this,"remainder"),B(this,"remainderLen"),B(this,"updateCalled"),B(this,"processedLen"),B(this,"macKeySet");const a=r||{};if(this.inputFormat=n,this.utfType=a.encoding||"UTF8",this.numRounds=a.numRounds||1,isNaN(this.numRounds)||this.numRounds!==parseInt(this.numRounds,10)||1>this.numRounds)throw new Error("numRounds must a integer >= 1");this.shaVariant=t,this.remainder=[],this.remainderLen=0,this.updateCalled=!1,this.processedLen=0,this.macKeySet=!1,this.keyWithIPad=[],this.keyWithOPad=[]}update(t){let n,r=0;const a=this.variantBlockSize>>>5,s=this.converterFunc(t,this.remainder,this.remainderLen),i=s.binLen,o=s.value,l=i>>>5;for(n=0;n<l;n+=a)r+this.variantBlockSize<=i&&(this.intermediateState=this.roundFunc(o.slice(n,n+a),this.intermediateState),r+=this.variantBlockSize);return this.processedLen+=r,this.remainder=o.slice(r>>>5),this.remainderLen=i%this.variantBlockSize,this.updateCalled=!0,this}getHash(t,n){let r,a,s=this.outputBinLen;const i=ns(n);if(this.isVariableLen){if(i.outputLen===-1)throw new Error("Output length must be specified in options");s=i.outputLen}const o=ts(t,s,this.bigEndianMod,i);if(this.macKeySet&&this.getMAC)return o(this.getMAC(i));for(a=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),s),r=1;r<this.numRounds;r+=1)this.isVariableLen&&s%32!==0&&(a[a.length-1]&=16777215>>>24-s%32),a=this.finalizeFunc(a,s,0,this.newStateFunc(this.shaVariant),s);return o(a)}setHMACKey(t,n,r){if(!this.HMACSupported)throw new Error("Variant does not support HMAC");if(this.updateCalled)throw new Error("Cannot set MAC key after calling update");const a=r||{},s=Wt(n,a.encoding||"UTF8",this.bigEndianMod);this._setHMACKey(s(t))}_setHMACKey(t){const n=this.variantBlockSize>>>3,r=n/4-1;let a;if(this.numRounds!==1)throw new Error(Ca);if(this.macKeySet)throw new Error("MAC key already set");for(n<t.binLen/8&&(t.value=this.finalizeFunc(t.value,t.binLen,0,this.newStateFunc(this.shaVariant),this.outputBinLen));t.value.length<=r;)t.value.push(0);for(a=0;a<=r;a+=1)this.keyWithIPad[a]=t.value[a]^909522486,this.keyWithOPad[a]=t.value[a]^1549556828;this.intermediateState=this.roundFunc(this.keyWithIPad,this.intermediateState),this.processedLen=this.variantBlockSize,this.macKeySet=!0}getHMAC(t,n){const r=ns(n);return ts(t,this.outputBinLen,this.bigEndianMod,r)(this._getHMAC())}_getHMAC(){let t;if(!this.macKeySet)throw new Error("Cannot call getHMAC without first setting MAC key");const n=this.finalizeFunc(this.remainder.slice(),this.remainderLen,this.processedLen,this.stateCloneFunc(this.intermediateState),this.outputBinLen);return t=this.roundFunc(this.keyWithOPad,this.newStateFunc(this.shaVariant)),t=this.finalizeFunc(n,this.outputBinLen,this.variantBlockSize,t,this.outputBinLen),t}}function At(e,t){return e<<t|e>>>32-t}function Xe(e,t){return e>>>t|e<<32-t}function Ia(e,t){return e>>>t}function rs(e,t,n){return e^t^n}function Aa(e,t,n){return e&t^~e&n}function Ta(e,t,n){return e&t^e&n^t&n}function Np(e){return Xe(e,2)^Xe(e,13)^Xe(e,22)}function Ne(e,t){const n=(e&65535)+(t&65535);return((e>>>16)+(t>>>16)+(n>>>16)&65535)<<16|n&65535}function Mp(e,t,n,r){const a=(e&65535)+(t&65535)+(n&65535)+(r&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(a>>>16)&65535)<<16|a&65535}function Qt(e,t,n,r,a){const s=(e&65535)+(t&65535)+(n&65535)+(r&65535)+(a&65535);return((e>>>16)+(t>>>16)+(n>>>16)+(r>>>16)+(a>>>16)+(s>>>16)&65535)<<16|s&65535}function Pp(e){return Xe(e,17)^Xe(e,19)^Ia(e,10)}function Rp(e){return Xe(e,7)^Xe(e,18)^Ia(e,3)}function $p(e){return Xe(e,6)^Xe(e,11)^Xe(e,25)}function ss(e){return[1732584193,4023233417,2562383102,271733878,3285377520]}function Na(e,t){let n,r,a,s,i,o,l;const c=[];for(n=t[0],r=t[1],a=t[2],s=t[3],i=t[4],l=0;l<80;l+=1)l<16?c[l]=e[l]:c[l]=At(c[l-3]^c[l-8]^c[l-14]^c[l-16],1),l<20?o=Qt(At(n,5),Aa(r,a,s),i,1518500249,c[l]):l<40?o=Qt(At(n,5),rs(r,a,s),i,1859775393,c[l]):l<60?o=Qt(At(n,5),Ta(r,a,s),i,2400959708,c[l]):o=Qt(At(n,5),rs(r,a,s),i,3395469782,c[l]),i=s,s=a,a=At(r,30),r=n,n=o;return t[0]=Ne(n,t[0]),t[1]=Ne(r,t[1]),t[2]=Ne(a,t[2]),t[3]=Ne(s,t[3]),t[4]=Ne(i,t[4]),t}function Fp(e,t,n,r){let a;const s=(t+65>>>9<<4)+15,i=t+n;for(;e.length<=s;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[s]=i&4294967295,e[s-1]=i/an|0,a=0;a<e.length;a+=16)r=Na(e.slice(a,a+16),r);return r}let xp=class extends Fn{constructor(t,n,r){if(t!=="SHA-1")throw new Error(on);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.HMACSupported=!0,this.getMAC=this._getHMAC,this.bigEndianMod=-1,this.converterFunc=Wt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Na,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=ss,this.finalizeFunc=Fp,this.intermediateState=ss(),this.variantBlockSize=512,this.outputBinLen=160,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};function as(e){let t;return e==="SHA-224"?t=nt.slice():t=rt.slice(),t}function Ma(e,t){let n,r,a,s,i,o,l,c,u,m,d;const v=[];for(n=t[0],r=t[1],a=t[2],s=t[3],i=t[4],o=t[5],l=t[6],c=t[7],d=0;d<64;d+=1)d<16?v[d]=e[d]:v[d]=Mp(Pp(v[d-2]),v[d-7],Rp(v[d-15]),v[d-16]),u=Qt(c,$p(i),Aa(i,o,l),K[d],v[d]),m=Ne(Np(n),Ta(n,r,a)),c=l,l=o,o=i,i=Ne(s,u),s=a,a=r,r=n,n=Ne(u,m);return t[0]=Ne(n,t[0]),t[1]=Ne(r,t[1]),t[2]=Ne(a,t[2]),t[3]=Ne(s,t[3]),t[4]=Ne(i,t[4]),t[5]=Ne(o,t[5]),t[6]=Ne(l,t[6]),t[7]=Ne(c,t[7]),t}function Dp(e,t,n,r,a){let s,i;const o=(t+65>>>9<<4)+15,l=16,c=t+n;for(;e.length<=o;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[o]=c&4294967295,e[o-1]=c/an|0,s=0;s<e.length;s+=l)r=Ma(e.slice(s,s+l),r);return a==="SHA-224"?i=[r[0],r[1],r[2],r[3],r[4],r[5],r[6]]:i=r,i}let Vp=class extends Fn{constructor(t,n,r){if(!(t==="SHA-224"||t==="SHA-256"))throw new Error(on);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Wt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ma,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=as,this.finalizeFunc=function(s,i,o,l){return Dp(s,i,o,l,t)},this.intermediateState=as(t),this.variantBlockSize=512,this.outputBinLen=t==="SHA-224"?224:256,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};class k{constructor(t,n){B(this,"highOrder"),B(this,"lowOrder"),this.highOrder=t,this.lowOrder=n}}function is(e,t){let n;return t>32?(n=64-t,new k(e.lowOrder<<t|e.highOrder>>>n,e.highOrder<<t|e.lowOrder>>>n)):t!==0?(n=32-t,new k(e.highOrder<<t|e.lowOrder>>>n,e.lowOrder<<t|e.highOrder>>>n)):e}function Je(e,t){let n;return t<32?(n=32-t,new k(e.highOrder>>>t|e.lowOrder<<n,e.lowOrder>>>t|e.highOrder<<n)):(n=64-t,new k(e.lowOrder>>>t|e.highOrder<<n,e.highOrder>>>t|e.lowOrder<<n))}function Pa(e,t){return new k(e.highOrder>>>t,e.lowOrder>>>t|e.highOrder<<32-t)}function Up(e,t,n){return new k(e.highOrder&t.highOrder^~e.highOrder&n.highOrder,e.lowOrder&t.lowOrder^~e.lowOrder&n.lowOrder)}function Hp(e,t,n){return new k(e.highOrder&t.highOrder^e.highOrder&n.highOrder^t.highOrder&n.highOrder,e.lowOrder&t.lowOrder^e.lowOrder&n.lowOrder^t.lowOrder&n.lowOrder)}function Bp(e){const t=Je(e,28),n=Je(e,34),r=Je(e,39);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Ue(e,t){let n,r;n=(e.lowOrder&65535)+(t.lowOrder&65535),r=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n>>>16);const a=(r&65535)<<16|n&65535;n=(e.highOrder&65535)+(t.highOrder&65535)+(r>>>16),r=(e.highOrder>>>16)+(t.highOrder>>>16)+(n>>>16);const s=(r&65535)<<16|n&65535;return new k(s,a)}function Wp(e,t,n,r){let a,s;a=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535),s=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(a>>>16);const i=(s&65535)<<16|a&65535;a=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(s>>>16),s=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(a>>>16);const o=(s&65535)<<16|a&65535;return new k(o,i)}function jp(e,t,n,r,a){let s,i;s=(e.lowOrder&65535)+(t.lowOrder&65535)+(n.lowOrder&65535)+(r.lowOrder&65535)+(a.lowOrder&65535),i=(e.lowOrder>>>16)+(t.lowOrder>>>16)+(n.lowOrder>>>16)+(r.lowOrder>>>16)+(a.lowOrder>>>16)+(s>>>16);const o=(i&65535)<<16|s&65535;s=(e.highOrder&65535)+(t.highOrder&65535)+(n.highOrder&65535)+(r.highOrder&65535)+(a.highOrder&65535)+(i>>>16),i=(e.highOrder>>>16)+(t.highOrder>>>16)+(n.highOrder>>>16)+(r.highOrder>>>16)+(a.highOrder>>>16)+(s>>>16);const l=(i&65535)<<16|s&65535;return new k(l,o)}function Xt(e,t){return new k(e.highOrder^t.highOrder,e.lowOrder^t.lowOrder)}function Kp(e,t,n,r,a){return new k(e.highOrder^t.highOrder^n.highOrder^r.highOrder^a.highOrder,e.lowOrder^t.lowOrder^n.lowOrder^r.lowOrder^a.lowOrder)}function Gp(e){const t=Je(e,19),n=Je(e,61),r=Pa(e,6);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function Yp(e){const t=Je(e,1),n=Je(e,8),r=Pa(e,7);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}function zp(e){const t=Je(e,14),n=Je(e,18),r=Je(e,41);return new k(t.highOrder^n.highOrder^r.highOrder,t.lowOrder^n.lowOrder^r.lowOrder)}const Xp=[new k(K[0],3609767458),new k(K[1],602891725),new k(K[2],3964484399),new k(K[3],2173295548),new k(K[4],4081628472),new k(K[5],3053834265),new k(K[6],2937671579),new k(K[7],3664609560),new k(K[8],2734883394),new k(K[9],1164996542),new k(K[10],1323610764),new k(K[11],3590304994),new k(K[12],4068182383),new k(K[13],991336113),new k(K[14],633803317),new k(K[15],3479774868),new k(K[16],2666613458),new k(K[17],944711139),new k(K[18],2341262773),new k(K[19],2007800933),new k(K[20],1495990901),new k(K[21],1856431235),new k(K[22],3175218132),new k(K[23],2198950837),new k(K[24],3999719339),new k(K[25],766784016),new k(K[26],2566594879),new k(K[27],3203337956),new k(K[28],1034457026),new k(K[29],2466948901),new k(K[30],3758326383),new k(K[31],168717936),new k(K[32],1188179964),new k(K[33],1546045734),new k(K[34],1522805485),new k(K[35],2643833823),new k(K[36],2343527390),new k(K[37],1014477480),new k(K[38],1206759142),new k(K[39],344077627),new k(K[40],1290863460),new k(K[41],3158454273),new k(K[42],3505952657),new k(K[43],106217008),new k(K[44],3606008344),new k(K[45],1432725776),new k(K[46],1467031594),new k(K[47],851169720),new k(K[48],3100823752),new k(K[49],1363258195),new k(K[50],3750685593),new k(K[51],3785050280),new k(K[52],3318307427),new k(K[53],3812723403),new k(K[54],2003034995),new k(K[55],3602036899),new k(K[56],1575990012),new k(K[57],1125592928),new k(K[58],2716904306),new k(K[59],442776044),new k(K[60],593698344),new k(K[61],3733110249),new k(K[62],2999351573),new k(K[63],3815920427),new k(3391569614,3928383900),new k(3515267271,566280711),new k(3940187606,3454069534),new k(4118630271,4000239992),new k(116418474,1914138554),new k(174292421,2731055270),new k(289380356,3203993006),new k(460393269,320620315),new k(685471733,587496836),new k(852142971,1086792851),new k(1017036298,365543100),new k(1126000580,2618297676),new k(1288033470,3409855158),new k(1501505948,4234509866),new k(1607167915,987167468),new k(1816402316,1246189591)];function os(e){return e==="SHA-384"?[new k(3418070365,nt[0]),new k(1654270250,nt[1]),new k(2438529370,nt[2]),new k(355462360,nt[3]),new k(1731405415,nt[4]),new k(41048885895,nt[5]),new k(3675008525,nt[6]),new k(1203062813,nt[7])]:[new k(rt[0],4089235720),new k(rt[1],2227873595),new k(rt[2],4271175723),new k(rt[3],1595750129),new k(rt[4],2917565137),new k(rt[5],725511199),new k(rt[6],4215389547),new k(rt[7],327033209)]}function Ra(e,t){let n,r,a,s,i,o,l,c,u,m,d,v;const E=[];for(n=t[0],r=t[1],a=t[2],s=t[3],i=t[4],o=t[5],l=t[6],c=t[7],d=0;d<80;d+=1)d<16?(v=d*2,E[d]=new k(e[v],e[v+1])):E[d]=Wp(Gp(E[d-2]),E[d-7],Yp(E[d-15]),E[d-16]),u=jp(c,zp(i),Up(i,o,l),Xp[d],E[d]),m=Ue(Bp(n),Hp(n,r,a)),c=l,l=o,o=i,i=Ue(s,u),s=a,a=r,r=n,n=Ue(u,m);return t[0]=Ue(n,t[0]),t[1]=Ue(r,t[1]),t[2]=Ue(a,t[2]),t[3]=Ue(s,t[3]),t[4]=Ue(i,t[4]),t[5]=Ue(o,t[5]),t[6]=Ue(l,t[6]),t[7]=Ue(c,t[7]),t}function Jp(e,t,n,r,a){let s,i;const o=(t+129>>>10<<5)+31,l=32,c=t+n;for(;e.length<=o;)e.push(0);for(e[t>>>5]|=128<<24-t%32,e[o]=c&4294967295,e[o-1]=c/an|0,s=0;s<e.length;s+=l)r=Ra(e.slice(s,s+l),r);return a==="SHA-384"?(r=r,i=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder]):i=[r[0].highOrder,r[0].lowOrder,r[1].highOrder,r[1].lowOrder,r[2].highOrder,r[2].lowOrder,r[3].highOrder,r[3].lowOrder,r[4].highOrder,r[4].lowOrder,r[5].highOrder,r[5].lowOrder,r[6].highOrder,r[6].lowOrder,r[7].highOrder,r[7].lowOrder],i}let qp=class extends Fn{constructor(t,n,r){if(!(t==="SHA-384"||t==="SHA-512"))throw new Error(on);super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const a=r||{};this.getMAC=this._getHMAC,this.HMACSupported=!0,this.bigEndianMod=-1,this.converterFunc=Wt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=Ra,this.stateCloneFunc=function(s){return s.slice()},this.newStateFunc=os,this.finalizeFunc=function(s,i,o,l){return Jp(s,i,o,l,t)},this.intermediateState=os(t),this.variantBlockSize=1024,this.outputBinLen=t==="SHA-384"?384:512,this.isVariableLen=!1,a.hmacKey&&this._setHMACKey(mt("hmacKey",a.hmacKey,this.bigEndianMod))}};const Qp=[new k(0,1),new k(0,32898),new k(2147483648,32906),new k(2147483648,2147516416),new k(0,32907),new k(0,2147483649),new k(2147483648,2147516545),new k(2147483648,32777),new k(0,138),new k(0,136),new k(0,2147516425),new k(0,2147483658),new k(0,2147516555),new k(2147483648,139),new k(2147483648,32905),new k(2147483648,32771),new k(2147483648,32770),new k(2147483648,128),new k(0,32778),new k(2147483648,2147483658),new k(2147483648,2147516545),new k(2147483648,32896),new k(0,2147483649),new k(2147483648,2147516424)],Zp=[[0,36,3,41,18],[1,44,10,45,2],[62,6,43,15,61],[28,55,25,21,56],[27,20,39,8,14]];function ur(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=[new k(0,0),new k(0,0),new k(0,0),new k(0,0),new k(0,0)];return n}function ef(e){let t;const n=[];for(t=0;t<5;t+=1)n[t]=e[t].slice();return n}function hn(e,t){let n,r,a,s;const i=[],o=[];if(e!=null)for(r=0;r<e.length;r+=2)t[(r>>>1)%5][(r>>>1)/5|0]=Xt(t[(r>>>1)%5][(r>>>1)/5|0],new k(e[r+1],e[r]));for(n=0;n<24;n+=1){for(s=ur(),r=0;r<5;r+=1)i[r]=Kp(t[r][0],t[r][1],t[r][2],t[r][3],t[r][4]);for(r=0;r<5;r+=1)o[r]=Xt(i[(r+4)%5],is(i[(r+1)%5],1));for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)t[r][a]=Xt(t[r][a],o[r]);for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)s[a][(2*r+3*a)%5]=is(t[r][a],Zp[r][a]);for(r=0;r<5;r+=1)for(a=0;a<5;a+=1)t[r][a]=Xt(s[r][a],new k(~s[(r+1)%5][a].highOrder&s[(r+2)%5][a].highOrder,~s[(r+1)%5][a].lowOrder&s[(r+2)%5][a].lowOrder));t[0][0]=Xt(t[0][0],Qp[n])}return t}function tf(e,t,n,r,a,s,i){let o,l=0,c;const u=[],m=a>>>5,d=t>>>5;for(o=0;o<d&&t>=a;o+=m)r=hn(e.slice(o,o+m),r),t-=a;for(e=e.slice(o),t=t%a;e.length<m;)e.push(0);for(o=t>>>3,e[o>>2]^=s<<8*(o%4),e[m-1]^=2147483648,r=hn(e,r);u.length*32<i&&(c=r[l%5][l/5|0],u.push(c.lowOrder),!(u.length*32>=i));)u.push(c.highOrder),l+=1,l*64%a===0&&(hn(null,r),l=0);return u}function $a(e){let t,n,r=0;const a=[0,0],s=[e&4294967295,e/an&2097151];for(t=6;t>=0;t--)n=s[t>>2]>>>8*t&255,(n!==0||r!==0)&&(a[r+1>>2]|=n<<(r+1)*8,r+=1);return r=r!==0?r:1,a[0]|=r,{value:r+1>4?a:[a[0]],binLen:8+r*8}}function nf(e){let t,n,r=0;const a=[0,0],s=[e&4294967295,e/an&2097151];for(t=6;t>=0;t--)n=s[t>>2]>>>8*t&255,(n!==0||r!==0)&&(a[r>>2]|=n<<r*8,r+=1);return r=r!==0?r:1,a[r>>2]|=r<<r*8,{value:r+1>4?a:[a[0]],binLen:8+r*8}}function Yn(e){return Ln($a(e.binLen),e)}function ls(e,t){let n=$a(t),r;n=Ln(n,e);const a=t>>>2,s=(a-n.value.length%a)%a;for(r=0;r<s;r++)n.value.push(0);return n.value}function rf(e){const t=e||{};return{funcName:mt("funcName",t.funcName,1,{value:[],binLen:0}),customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}function sf(e){const t=e||{};return{kmacKey:mt("kmacKey",t.kmacKey,1),funcName:{value:[1128353099],binLen:32},customization:mt("Customization",t.customization,1,{value:[],binLen:0})}}let af=class extends Fn{constructor(t,n,r){let a=6,s=0;super(t,n,r),B(this,"intermediateState"),B(this,"variantBlockSize"),B(this,"bigEndianMod"),B(this,"outputBinLen"),B(this,"isVariableLen"),B(this,"HMACSupported"),B(this,"converterFunc"),B(this,"roundFunc"),B(this,"finalizeFunc"),B(this,"stateCloneFunc"),B(this,"newStateFunc"),B(this,"getMAC");const i=r||{};if(this.numRounds!==1){if(i.kmacKey||i.hmacKey)throw new Error(Ca);if(this.shaVariant==="CSHAKE128"||this.shaVariant==="CSHAKE256")throw new Error("Cannot set numRounds for CSHAKE variants")}switch(this.bigEndianMod=1,this.converterFunc=Wt(this.inputFormat,this.utfType,this.bigEndianMod),this.roundFunc=hn,this.stateCloneFunc=ef,this.newStateFunc=ur,this.intermediateState=ur(),this.isVariableLen=!1,t){case"SHA3-224":this.variantBlockSize=s=1152,this.outputBinLen=224,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-256":this.variantBlockSize=s=1088,this.outputBinLen=256,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-384":this.variantBlockSize=s=832,this.outputBinLen=384,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHA3-512":this.variantBlockSize=s=576,this.outputBinLen=512,this.HMACSupported=!0,this.getMAC=this._getHMAC;break;case"SHAKE128":a=31,this.variantBlockSize=s=1344,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"SHAKE256":a=31,this.variantBlockSize=s=1088,this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"KMAC128":a=4,this.variantBlockSize=s=1344,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"KMAC256":a=4,this.variantBlockSize=s=1088,this._initializeKMAC(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=this._getKMAC;break;case"CSHAKE128":this.variantBlockSize=s=1344,a=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;case"CSHAKE256":this.variantBlockSize=s=1088,a=this._initializeCSHAKE(r),this.outputBinLen=-1,this.isVariableLen=!0,this.HMACSupported=!1,this.getMAC=null;break;default:throw new Error(on)}this.finalizeFunc=function(o,l,c,u,m){return tf(o,l,c,u,s,a,m)},i.hmacKey&&this._setHMACKey(mt("hmacKey",i.hmacKey,this.bigEndianMod))}_initializeCSHAKE(t,n){const r=rf(t||{});n&&(r.funcName=n);const a=Ln(Yn(r.funcName),Yn(r.customization));if(r.customization.binLen!==0||r.funcName.binLen!==0){const s=ls(a,this.variantBlockSize>>>3);for(let i=0;i<s.length;i+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(s.slice(i,i+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;return 4}else return 31}_initializeKMAC(t){const n=sf(t||{});this._initializeCSHAKE(t,n.funcName);const r=ls(Yn(n.kmacKey),this.variantBlockSize>>>3);for(let a=0;a<r.length;a+=this.variantBlockSize>>>5)this.intermediateState=this.roundFunc(r.slice(a,a+(this.variantBlockSize>>>5)),this.intermediateState),this.processedLen+=this.variantBlockSize;this.macKeySet=!0}_getKMAC(t){const n=Ln({value:this.remainder.slice(),binLen:this.remainderLen},nf(t.outputLen));return this.finalizeFunc(n.value,n.binLen,this.processedLen,this.stateCloneFunc(this.intermediateState),t.outputLen)}};class of{constructor(t,n,r){if(B(this,"shaObj"),t==="SHA-1")this.shaObj=new xp(t,n,r);else if(t==="SHA-224"||t==="SHA-256")this.shaObj=new Vp(t,n,r);else if(t==="SHA-384"||t==="SHA-512")this.shaObj=new qp(t,n,r);else if(t==="SHA3-224"||t==="SHA3-256"||t==="SHA3-384"||t==="SHA3-512"||t==="SHAKE128"||t==="SHAKE256"||t==="CSHAKE128"||t==="CSHAKE256"||t==="KMAC128"||t==="KMAC256")this.shaObj=new af(t,n,r);else throw new Error(on)}update(t){return this.shaObj.update(t),this}getHash(t,n){return this.shaObj.getHash(t,n)}setHMACKey(t,n,r){this.shaObj.setHMACKey(t,n,r)}getHMAC(t,n){return this.shaObj.getHMAC(t,n)}}class lf{static generate(t,n){const r={digits:6,algorithm:"SHA-1",period:30,timestamp:Date.now(),...n},a=Math.floor(r.timestamp/1e3),s=this.leftpad(this.dec2hex(Math.floor(a/r.period)),16,"0"),i=new of(r.algorithm,"HEX");i.setHMACKey(this.base32tohex(t),"HEX"),i.update(s);const o=i.getHMAC("HEX"),l=this.hex2dec(o.substring(o.length-1));let c=(this.hex2dec(o.substr(l*2,8))&this.hex2dec("7fffffff"))+"";const u=Math.max(c.length-r.digits,0);c=c.substring(u,u+r.digits);const m=Math.ceil((r.timestamp+1)/(r.period*1e3))*r.period*1e3;return{otp:c,expires:m}}static hex2dec(t){return parseInt(t,16)}static dec2hex(t){return(t<15.5?"0":"")+Math.round(t).toString(16)}static base32tohex(t){const n="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let r="",a="";const s=t.replace(/=+$/,"");for(let i=0;i<s.length;i++){const o=n.indexOf(t.charAt(i).toUpperCase());if(o===-1)throw new Error("Invalid base32 character in key");r+=this.leftpad(o.toString(2),5,"0")}for(let i=0;i+8<=r.length;i+=8){const o=r.substr(i,8);a=a+this.leftpad(parseInt(o,2).toString(16),2,"0")}return a}static leftpad(t,n,r){return n+1>=t.length&&(t=Array(n+1-t.length).join(r)+t),t}}const cf=(e,t)=>{sn&&localStorage.setItem(e,t)},uf=e=>sn&&localStorage.getItem(e)||"";function Jt(e){return e<10?`0${e}`:e}function df(e){let t=new Date;return e&&(t=new Date(e)),t.format=(n="YYYY-MM-DD HH:mm:ss")=>{const r=t.getFullYear(),a=Jt(t.getMonth()+1),s=Jt(t.getDate()),i=Jt(t.getHours()),o=Jt(t.getMinutes()),l=Jt(t.getSeconds());return n.replace(/Y+/gi,`${r}`).replace(/M+/g,`${a}`).replace(/D+/gi,`${s}`).replace(/H+/gi,`${i}`).replace(/m+/g,`${o}`).replace(/S+/gi,`${l}`)},t}const mf=e=>{if(typeof window<"u"){const t={},n=window.location.href;return n.split("?")[1]&&n.split("?")[1].split("&").forEach(s=>{const[i,o]=s.split("=");i&&o&&(t[i]=decodeURIComponent(o))}),t}return{}},pf=(e,t)=>{typeof window<"u"&&(window[e]=t),typeof global<"u"&&(global[e]=t)},ff=(e=375)=>{let t=e;const{documentElement:n}=document,r=window.matchMedia("(orientation: portrait)");let a,s=667/375;wa()===ka.IPAD&&(s=1024/768,t=768);function i(){const o=!r.matches;let l=window.screen.width,c=window.screen.height;l<c&&([l,c]=[c,l]);let u=n.clientWidth,m=c;u/m>=s?(u=m*s,n.classList.remove("adjustHeight"),n.classList.add("adjustWidth")):(m=u/s,n.classList.remove("adjustWidth"),n.classList.add("adjustHeight"));let v=u/t*16;o&&(v/=s),n.style.fontSize=`${v}px`;const E=window.getComputedStyle(n).fontSize.replace("px","")||0;v!==E&&(n.style.fontSize=`${v/Number(E)*v}px`)}window.addEventListener("resize",function(){clearTimeout(a),a=setTimeout(i,300)},!1),window.addEventListener("pageshow",function(o){o.persisted&&(clearTimeout(a),a=setTimeout(i,300))},!1),window.addEventListener("orientationchange",function(){i()},!1),i()},zn=new Map([[100,"Continue"],[101,"Switching Protocols"],[102,"Processing"],[103,"Early Hints"],[200,"OK"],[201,"Created"],[202,"Accepted"],[203,"Non-Authoritative Information"],[204,"No Content"],[205,"Reset Content"],[206,"Partial Content"],[207,"Multi-Status"],[208,"Already Reported"],[226,"IM Used"],[300,"Multiple Choices"],[301,"Moved Permanently"],[302,"Found"],[303,"See Other"],[304,"Not Modified"],[305,"Use Proxy"],[307,"Temporary Redirect"],[308,"Permanent Redirect"],[400,"Bad Request"],[401,"Unauthorized"],[402,"Payment Required"],[403,"Forbidden"],[404,"Not Found"],[405,"Method Not Allowed"],[406,"Not Acceptable"],[407,"Proxy Authentication Required"],[408,"Request Timeout"],[409,"Conflict"],[410,"Gone"],[411,"Length Required"],[412,"Precondition Failed"],[413,"Payload Too Large"],[414,"URI Too Long"],[415,"Unsupported Media Type"],[416,"Range Not Satisfiable"],[417,"Expectation Failed"],[418,"I'm a Teapot"],[421,"Misdirected Request"],[422,"Unprocessable Entity"],[423,"Locked"],[424,"Failed Dependency"],[425,"Too Early"],[426,"Upgrade Required"],[428,"Precondition Required"],[429,"Too Many Requests"],[431,"Request Header Fields Too Large"],[451,"Unavailable For Legal Reasons"],[500,"Internal Server Error"],[501,"Not Implemented"],[502,"Bad Gateway"],[503,"Service Unavailable"],[504,"Gateway Timeout"],[505,"HTTP Version Not Supported"],[506,"Variant Also Negotiates"],[507,"Insufficient Storage"],[508,"Loop Detected"],[509,"Bandwidth Limit Exceeded"],[510,"Not Extended"],[511,"Network Authentication Required"]]);hf(zn),gf(zn);function hf(e){const t=new Map;for(const[n,r]of e)t.set(r.toLowerCase(),n);return t}function gf(e){const t=[];for(const[n,r]of e)t.push(n);return t}const Qe=class{constructor(){B(this,"getDecimalLength",t=>{const[n,r]=t.toString().split(".");return r?r.length:0}),B(this,"amend",(t,n=15)=>parseFloat(Number(t).toPrecision(n))),B(this,"power",(t,n)=>Math.pow(10,Math.max(this.getDecimalLength(t),this.getDecimalLength(n))))}};B(Qe,"handleMethod",(e,t)=>{const n=new Qe,{power:r,amend:a}=n,s=r(e,t),i=a(e*s),o=a(t*s);return l=>{switch(l){case"+":return(i+o)/s;case"-":return(i-o)/s;case"*":return i*o/(s*s);case"/":return i/o}}});B(Qe,"add",(e,t)=>Qe.handleMethod(e,t)("+"));B(Qe,"divide",(e,t)=>Qe.handleMethod(e,t)("/"));B(Qe,"multiply",(e,t)=>Qe.handleMethod(e,t)("*"));B(Qe,"subtract",(e,t)=>Qe.handleMethod(e,t)("-"));var Tt=(e=>(e.NORMAL="normal",e.ERROR="error",e.WARNING="warning",e))(Tt||{}),ln=(e=>(e.EN="en",e.ZH_CN="zh-CN",e))(ln||{});const Fa="ran_chaxus_lang",cs=[],vf={"zh-CN":{lang:"简体中文"},en:{lang:"English"}};var xa=(e=>(e.LEGACY="legacy",e))(xa||{});const us="PWA_INSTALL_ID",_f="pwa-install",bf="/ran/manifest.json",yf=!1;mf();const dr={isDev:yf,locale:ln.EN,currentDevice:wa(),isWeiXin:_p(),isMobile:bp(),isBang:yp()},kf={install:e=>{e.config.globalProperties.$env=dr,e.provide("$env",dr)}};/*!
  * shared v9.14.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const En=typeof window<"u",vt=(e,t=!1)=>t?Symbol.for(e):Symbol(e),wf=(e,t,n)=>Lf({l:e,k:t,s:n}),Lf=e=>JSON.stringify(e).replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029").replace(/\u0027/g,"\\u0027"),Ce=e=>typeof e=="number"&&isFinite(e),Ef=e=>Va(e)==="[object Date]",pt=e=>Va(e)==="[object RegExp]",xn=e=>te(e)&&Object.keys(e).length===0,Te=Object.assign;let ds;const st=()=>ds||(ds=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function ms(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")}const Sf=Object.prototype.hasOwnProperty;function Sn(e,t){return Sf.call(e,t)}const ve=Array.isArray,he=e=>typeof e=="function",H=e=>typeof e=="string",ae=e=>typeof e=="boolean",ue=e=>e!==null&&typeof e=="object",Of=e=>ue(e)&&he(e.then)&&he(e.catch),Da=Object.prototype.toString,Va=e=>Da.call(e),te=e=>{if(!ue(e))return!1;const t=Object.getPrototypeOf(e);return t===null||t.constructor===Object},Cf=e=>e==null?"":ve(e)||te(e)&&e.toString===Da?JSON.stringify(e,null,2):String(e);function If(e,t=""){return e.reduce((n,r,a)=>a===0?n+r:n+t+r,"")}function Dn(e){let t=e;return()=>++t}function Af(e,t){typeof console<"u"&&(console.warn("[intlify] "+e),t&&console.warn(t.stack))}const mn=e=>!ue(e)||ve(e);function gn(e,t){if(mn(e)||mn(t))throw new Error("Invalid value");const n=[{src:e,des:t}];for(;n.length;){const{src:r,des:a}=n.pop();Object.keys(r).forEach(s=>{mn(r[s])||mn(a[s])?a[s]=r[s]:n.push({src:r[s],des:a[s]})})}}/*!
  * message-compiler v9.14.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function Tf(e,t,n){return{line:e,column:t,offset:n}}function On(e,t,n){return{start:e,end:t}}const Nf=/\{([0-9a-zA-Z]+)\}/g;function Ua(e,...t){return t.length===1&&Mf(t[0])&&(t=t[0]),(!t||!t.hasOwnProperty)&&(t={}),e.replace(Nf,(n,r)=>t.hasOwnProperty(r)?t[r]:"")}const Ha=Object.assign,ps=e=>typeof e=="string",Mf=e=>e!==null&&typeof e=="object";function Ba(e,t=""){return e.reduce((n,r,a)=>a===0?n+r:n+t+r,"")}const Nr={USE_MODULO_SYNTAX:1,__EXTEND_POINT__:2},Pf={[Nr.USE_MODULO_SYNTAX]:"Use modulo before '{{0}}'."};function Rf(e,t,...n){const r=Ua(Pf[e],...n||[]),a={message:String(r),code:e};return t&&(a.location=t),a}const Q={EXPECTED_TOKEN:1,INVALID_TOKEN_IN_PLACEHOLDER:2,UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER:3,UNKNOWN_ESCAPE_SEQUENCE:4,INVALID_UNICODE_ESCAPE_SEQUENCE:5,UNBALANCED_CLOSING_BRACE:6,UNTERMINATED_CLOSING_BRACE:7,EMPTY_PLACEHOLDER:8,NOT_ALLOW_NEST_PLACEHOLDER:9,INVALID_LINKED_FORMAT:10,MUST_HAVE_MESSAGES_IN_PLURAL:11,UNEXPECTED_EMPTY_LINKED_MODIFIER:12,UNEXPECTED_EMPTY_LINKED_KEY:13,UNEXPECTED_LEXICAL_ANALYSIS:14,UNHANDLED_CODEGEN_NODE_TYPE:15,UNHANDLED_MINIFIER_NODE_TYPE:16,__EXTEND_POINT__:17},$f={[Q.EXPECTED_TOKEN]:"Expected token: '{0}'",[Q.INVALID_TOKEN_IN_PLACEHOLDER]:"Invalid token in placeholder: '{0}'",[Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]:"Unterminated single quote in placeholder",[Q.UNKNOWN_ESCAPE_SEQUENCE]:"Unknown escape sequence: \\{0}",[Q.INVALID_UNICODE_ESCAPE_SEQUENCE]:"Invalid unicode escape sequence: {0}",[Q.UNBALANCED_CLOSING_BRACE]:"Unbalanced closing brace",[Q.UNTERMINATED_CLOSING_BRACE]:"Unterminated closing brace",[Q.EMPTY_PLACEHOLDER]:"Empty placeholder",[Q.NOT_ALLOW_NEST_PLACEHOLDER]:"Not allowed nest placeholder",[Q.INVALID_LINKED_FORMAT]:"Invalid linked format",[Q.MUST_HAVE_MESSAGES_IN_PLURAL]:"Plural must have messages",[Q.UNEXPECTED_EMPTY_LINKED_MODIFIER]:"Unexpected empty linked modifier",[Q.UNEXPECTED_EMPTY_LINKED_KEY]:"Unexpected empty linked key",[Q.UNEXPECTED_LEXICAL_ANALYSIS]:"Unexpected lexical analysis in token: '{0}'",[Q.UNHANDLED_CODEGEN_NODE_TYPE]:"unhandled codegen node type: '{0}'",[Q.UNHANDLED_MINIFIER_NODE_TYPE]:"unhandled mimifier node type: '{0}'"};function jt(e,t,n={}){const{domain:r,messages:a,args:s}=n,i=Ua((a||$f)[e]||"",...s||[]),o=new SyntaxError(String(i));return o.code=e,t&&(o.location=t),o.domain=r,o}function Ff(e){throw e}const et=" ",xf="\r",Pe=`
`,Df="\u2028",Vf="\u2029";function Uf(e){const t=e;let n=0,r=1,a=1,s=0;const i=R=>t[R]===xf&&t[R+1]===Pe,o=R=>t[R]===Pe,l=R=>t[R]===Vf,c=R=>t[R]===Df,u=R=>i(R)||o(R)||l(R)||c(R),m=()=>n,d=()=>r,v=()=>a,E=()=>s,_=R=>i(R)||l(R)||c(R)?Pe:t[R],b=()=>_(n),M=()=>_(n+s);function W(){return s=0,u(n)&&(r++,a=0),i(n)&&n++,n++,a++,t[n]}function y(){return i(n+s)&&s++,s++,t[n+s]}function L(){n=0,r=1,a=1,s=0}function T(R=0){s=R}function I(){const R=n+s;for(;R!==n;)W();s=0}return{index:m,line:d,column:v,peekOffset:E,charAt:_,currentChar:b,currentPeek:M,next:W,peek:y,reset:L,resetPeek:T,skipToPeek:I}}const ut=void 0,Hf=".",fs="'",Bf="tokenizer";function Wf(e,t={}){const n=t.location!==!1,r=Uf(e),a=()=>r.index(),s=()=>Tf(r.line(),r.column(),r.index()),i=s(),o=a(),l={currentType:14,offset:o,startLoc:i,endLoc:i,lastType:14,lastOffset:o,lastStartLoc:i,lastEndLoc:i,braceNest:0,inLinked:!1,text:""},c=()=>l,{onError:u}=t;function m(p,f,N,...J){const ye=c();if(f.column+=N,f.offset+=N,u){const ne=n?On(ye.startLoc,f):null,O=jt(p,ne,{domain:Bf,args:J});u(O)}}function d(p,f,N){p.endLoc=s(),p.currentType=f;const J={type:f};return n&&(J.loc=On(p.startLoc,p.endLoc)),N!=null&&(J.value=N),J}const v=p=>d(p,14);function E(p,f){return p.currentChar()===f?(p.next(),f):(m(Q.EXPECTED_TOKEN,s(),0,f),"")}function _(p){let f="";for(;p.currentPeek()===et||p.currentPeek()===Pe;)f+=p.currentPeek(),p.peek();return f}function b(p){const f=_(p);return p.skipToPeek(),f}function M(p){if(p===ut)return!1;const f=p.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f===95}function W(p){if(p===ut)return!1;const f=p.charCodeAt(0);return f>=48&&f<=57}function y(p,f){const{currentType:N}=f;if(N!==2)return!1;_(p);const J=M(p.currentPeek());return p.resetPeek(),J}function L(p,f){const{currentType:N}=f;if(N!==2)return!1;_(p);const J=p.currentPeek()==="-"?p.peek():p.currentPeek(),ye=W(J);return p.resetPeek(),ye}function T(p,f){const{currentType:N}=f;if(N!==2)return!1;_(p);const J=p.currentPeek()===fs;return p.resetPeek(),J}function I(p,f){const{currentType:N}=f;if(N!==8)return!1;_(p);const J=p.currentPeek()===".";return p.resetPeek(),J}function R(p,f){const{currentType:N}=f;if(N!==9)return!1;_(p);const J=M(p.currentPeek());return p.resetPeek(),J}function x(p,f){const{currentType:N}=f;if(!(N===8||N===12))return!1;_(p);const J=p.currentPeek()===":";return p.resetPeek(),J}function $(p,f){const{currentType:N}=f;if(N!==10)return!1;const J=()=>{const ne=p.currentPeek();return ne==="{"?M(p.peek()):ne==="@"||ne==="%"||ne==="|"||ne===":"||ne==="."||ne===et||!ne?!1:ne===Pe?(p.peek(),J()):Z(p,!1)},ye=J();return p.resetPeek(),ye}function me(p){_(p);const f=p.currentPeek()==="|";return p.resetPeek(),f}function we(p){const f=_(p),N=p.currentPeek()==="%"&&p.peek()==="{";return p.resetPeek(),{isModulo:N,hasSpace:f.length>0}}function Z(p,f=!0){const N=(ye=!1,ne="",O=!1)=>{const P=p.currentPeek();return P==="{"?ne==="%"?!1:ye:P==="@"||!P?ne==="%"?!0:ye:P==="%"?(p.peek(),N(ye,"%",!0)):P==="|"?ne==="%"||O?!0:!(ne===et||ne===Pe):P===et?(p.peek(),N(!0,et,O)):P===Pe?(p.peek(),N(!0,Pe,O)):!0},J=N();return f&&p.resetPeek(),J}function D(p,f){const N=p.currentChar();return N===ut?ut:f(N)?(p.next(),N):null}function re(p){const f=p.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f>=48&&f<=57||f===95||f===36}function Ee(p){return D(p,re)}function Oe(p){const f=p.charCodeAt(0);return f>=97&&f<=122||f>=65&&f<=90||f>=48&&f<=57||f===95||f===36||f===45}function _e(p){return D(p,Oe)}function De(p){const f=p.charCodeAt(0);return f>=48&&f<=57}function Ze(p){return D(p,De)}function be(p){const f=p.charCodeAt(0);return f>=48&&f<=57||f>=65&&f<=70||f>=97&&f<=102}function Le(p){return D(p,be)}function Ve(p){let f="",N="";for(;f=Ze(p);)N+=f;return N}function j(p){b(p);const f=p.currentChar();return f!=="%"&&m(Q.EXPECTED_TOKEN,s(),0,f),p.next(),"%"}function le(p){let f="";for(;;){const N=p.currentChar();if(N==="{"||N==="}"||N==="@"||N==="|"||!N)break;if(N==="%")if(Z(p))f+=N,p.next();else break;else if(N===et||N===Pe)if(Z(p))f+=N,p.next();else{if(me(p))break;f+=N,p.next()}else f+=N,p.next()}return f}function oe(p){b(p);let f="",N="";for(;f=_e(p);)N+=f;return p.currentChar()===ut&&m(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N}function pe(p){b(p);let f="";return p.currentChar()==="-"?(p.next(),f+=`-${Ve(p)}`):f+=Ve(p),p.currentChar()===ut&&m(Q.UNTERMINATED_CLOSING_BRACE,s(),0),f}function $e(p){return p!==fs&&p!==Pe}function je(p){b(p),E(p,"'");let f="",N="";for(;f=D(p,$e);)f==="\\"?N+=bt(p):N+=f;const J=p.currentChar();return J===Pe||J===ut?(m(Q.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER,s(),0),J===Pe&&(p.next(),E(p,"'")),N):(E(p,"'"),N)}function bt(p){const f=p.currentChar();switch(f){case"\\":case"'":return p.next(),`\\${f}`;case"u":return lt(p,f,4);case"U":return lt(p,f,6);default:return m(Q.UNKNOWN_ESCAPE_SEQUENCE,s(),0,f),""}}function lt(p,f,N){E(p,f);let J="";for(let ye=0;ye<N;ye++){const ne=Le(p);if(!ne){m(Q.INVALID_UNICODE_ESCAPE_SEQUENCE,s(),0,`\\${f}${J}${p.currentChar()}`);break}J+=ne}return`\\${f}${J}`}function Kt(p){return p!=="{"&&p!=="}"&&p!==et&&p!==Pe}function Gt(p){b(p);let f="",N="";for(;f=D(p,Kt);)N+=f;return N}function Yt(p){let f="",N="";for(;f=Ee(p);)N+=f;return N}function F(p){const f=N=>{const J=p.currentChar();return J==="{"||J==="%"||J==="@"||J==="|"||J==="("||J===")"||!J||J===et?N:(N+=J,p.next(),f(N))};return f("")}function ce(p){b(p);const f=E(p,"|");return b(p),f}function St(p,f){let N=null;switch(p.currentChar()){case"{":return f.braceNest>=1&&m(Q.NOT_ALLOW_NEST_PLACEHOLDER,s(),0),p.next(),N=d(f,2,"{"),b(p),f.braceNest++,N;case"}":return f.braceNest>0&&f.currentType===2&&m(Q.EMPTY_PLACEHOLDER,s(),0),p.next(),N=d(f,3,"}"),f.braceNest--,f.braceNest>0&&b(p),f.inLinked&&f.braceNest===0&&(f.inLinked=!1),N;case"@":return f.braceNest>0&&m(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N=Ot(p,f)||v(f),f.braceNest=0,N;default:{let ye=!0,ne=!0,O=!0;if(me(p))return f.braceNest>0&&m(Q.UNTERMINATED_CLOSING_BRACE,s(),0),N=d(f,1,ce(p)),f.braceNest=0,f.inLinked=!1,N;if(f.braceNest>0&&(f.currentType===5||f.currentType===6||f.currentType===7))return m(Q.UNTERMINATED_CLOSING_BRACE,s(),0),f.braceNest=0,zt(p,f);if(ye=y(p,f))return N=d(f,5,oe(p)),b(p),N;if(ne=L(p,f))return N=d(f,6,pe(p)),b(p),N;if(O=T(p,f))return N=d(f,7,je(p)),b(p),N;if(!ye&&!ne&&!O)return N=d(f,13,Gt(p)),m(Q.INVALID_TOKEN_IN_PLACEHOLDER,s(),0,N.value),b(p),N;break}}return N}function Ot(p,f){const{currentType:N}=f;let J=null;const ye=p.currentChar();switch((N===8||N===9||N===12||N===10)&&(ye===Pe||ye===et)&&m(Q.INVALID_LINKED_FORMAT,s(),0),ye){case"@":return p.next(),J=d(f,8,"@"),f.inLinked=!0,J;case".":return b(p),p.next(),d(f,9,".");case":":return b(p),p.next(),d(f,10,":");default:return me(p)?(J=d(f,1,ce(p)),f.braceNest=0,f.inLinked=!1,J):I(p,f)||x(p,f)?(b(p),Ot(p,f)):R(p,f)?(b(p),d(f,12,Yt(p))):$(p,f)?(b(p),ye==="{"?St(p,f)||J:d(f,11,F(p))):(N===8&&m(Q.INVALID_LINKED_FORMAT,s(),0),f.braceNest=0,f.inLinked=!1,zt(p,f))}}function zt(p,f){let N={type:14};if(f.braceNest>0)return St(p,f)||v(f);if(f.inLinked)return Ot(p,f)||v(f);switch(p.currentChar()){case"{":return St(p,f)||v(f);case"}":return m(Q.UNBALANCED_CLOSING_BRACE,s(),0),p.next(),d(f,3,"}");case"@":return Ot(p,f)||v(f);default:{if(me(p))return N=d(f,1,ce(p)),f.braceNest=0,f.inLinked=!1,N;const{isModulo:ye,hasSpace:ne}=we(p);if(ye)return ne?d(f,0,le(p)):d(f,4,j(p));if(Z(p))return d(f,0,le(p));break}}return N}function Bn(){const{currentType:p,offset:f,startLoc:N,endLoc:J}=l;return l.lastType=p,l.lastOffset=f,l.lastStartLoc=N,l.lastEndLoc=J,l.offset=a(),l.startLoc=s(),r.currentChar()===ut?d(l,14):zt(r,l)}return{nextToken:Bn,currentOffset:a,currentPosition:s,context:c}}const jf="parser",Kf=/(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;function Gf(e,t,n){switch(e){case"\\\\":return"\\";case"\\'":return"'";default:{const r=parseInt(t||n,16);return r<=55295||r>=57344?String.fromCodePoint(r):"�"}}}function Yf(e={}){const t=e.location!==!1,{onError:n,onWarn:r}=e;function a(y,L,T,I,...R){const x=y.currentPosition();if(x.offset+=I,x.column+=I,n){const $=t?On(T,x):null,me=jt(L,$,{domain:jf,args:R});n(me)}}function s(y,L,T,I,...R){const x=y.currentPosition();if(x.offset+=I,x.column+=I,r){const $=t?On(T,x):null;r(Rf(L,$,R))}}function i(y,L,T){const I={type:y};return t&&(I.start=L,I.end=L,I.loc={start:T,end:T}),I}function o(y,L,T,I){t&&(y.end=L,y.loc&&(y.loc.end=T))}function l(y,L){const T=y.context(),I=i(3,T.offset,T.startLoc);return I.value=L,o(I,y.currentOffset(),y.currentPosition()),I}function c(y,L){const T=y.context(),{lastOffset:I,lastStartLoc:R}=T,x=i(5,I,R);return x.index=parseInt(L,10),y.nextToken(),o(x,y.currentOffset(),y.currentPosition()),x}function u(y,L,T){const I=y.context(),{lastOffset:R,lastStartLoc:x}=I,$=i(4,R,x);return $.key=L,T===!0&&($.modulo=!0),y.nextToken(),o($,y.currentOffset(),y.currentPosition()),$}function m(y,L){const T=y.context(),{lastOffset:I,lastStartLoc:R}=T,x=i(9,I,R);return x.value=L.replace(Kf,Gf),y.nextToken(),o(x,y.currentOffset(),y.currentPosition()),x}function d(y){const L=y.nextToken(),T=y.context(),{lastOffset:I,lastStartLoc:R}=T,x=i(8,I,R);return L.type!==12?(a(y,Q.UNEXPECTED_EMPTY_LINKED_MODIFIER,T.lastStartLoc,0),x.value="",o(x,I,R),{nextConsumeToken:L,node:x}):(L.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,He(L)),x.value=L.value||"",o(x,y.currentOffset(),y.currentPosition()),{node:x})}function v(y,L){const T=y.context(),I=i(7,T.offset,T.startLoc);return I.value=L,o(I,y.currentOffset(),y.currentPosition()),I}function E(y){const L=y.context(),T=i(6,L.offset,L.startLoc);let I=y.nextToken();if(I.type===9){const R=d(y);T.modifier=R.node,I=R.nextConsumeToken||y.nextToken()}switch(I.type!==10&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(I)),I=y.nextToken(),I.type===2&&(I=y.nextToken()),I.type){case 11:I.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(I)),T.key=v(y,I.value||"");break;case 5:I.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(I)),T.key=u(y,I.value||"");break;case 6:I.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(I)),T.key=c(y,I.value||"");break;case 7:I.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(I)),T.key=m(y,I.value||"");break;default:{a(y,Q.UNEXPECTED_EMPTY_LINKED_KEY,L.lastStartLoc,0);const R=y.context(),x=i(7,R.offset,R.startLoc);return x.value="",o(x,R.offset,R.startLoc),T.key=x,o(T,R.offset,R.startLoc),{nextConsumeToken:I,node:T}}}return o(T,y.currentOffset(),y.currentPosition()),{node:T}}function _(y){const L=y.context(),T=L.currentType===1?y.currentOffset():L.offset,I=L.currentType===1?L.endLoc:L.startLoc,R=i(2,T,I);R.items=[];let x=null,$=null;do{const Z=x||y.nextToken();switch(x=null,Z.type){case 0:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(Z)),R.items.push(l(y,Z.value||""));break;case 6:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(Z)),R.items.push(c(y,Z.value||""));break;case 4:$=!0;break;case 5:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(Z)),R.items.push(u(y,Z.value||"",!!$)),$&&(s(y,Nr.USE_MODULO_SYNTAX,L.lastStartLoc,0,He(Z)),$=null);break;case 7:Z.value==null&&a(y,Q.UNEXPECTED_LEXICAL_ANALYSIS,L.lastStartLoc,0,He(Z)),R.items.push(m(y,Z.value||""));break;case 8:{const D=E(y);R.items.push(D.node),x=D.nextConsumeToken||null;break}}}while(L.currentType!==14&&L.currentType!==1);const me=L.currentType===1?L.lastOffset:y.currentOffset(),we=L.currentType===1?L.lastEndLoc:y.currentPosition();return o(R,me,we),R}function b(y,L,T,I){const R=y.context();let x=I.items.length===0;const $=i(1,L,T);$.cases=[],$.cases.push(I);do{const me=_(y);x||(x=me.items.length===0),$.cases.push(me)}while(R.currentType!==14);return x&&a(y,Q.MUST_HAVE_MESSAGES_IN_PLURAL,T,0),o($,y.currentOffset(),y.currentPosition()),$}function M(y){const L=y.context(),{offset:T,startLoc:I}=L,R=_(y);return L.currentType===14?R:b(y,T,I,R)}function W(y){const L=Wf(y,Ha({},e)),T=L.context(),I=i(0,T.offset,T.startLoc);return t&&I.loc&&(I.loc.source=y),I.body=M(L),e.onCacheKey&&(I.cacheKey=e.onCacheKey(y)),T.currentType!==14&&a(L,Q.UNEXPECTED_LEXICAL_ANALYSIS,T.lastStartLoc,0,y[T.offset]||""),o(I,L.currentOffset(),L.currentPosition()),I}return{parse:W}}function He(e){if(e.type===14)return"EOF";const t=(e.value||"").replace(/\r?\n/gu,"\\n");return t.length>10?t.slice(0,9)+"…":t}function zf(e,t={}){const n={ast:e,helpers:new Set};return{context:()=>n,helper:s=>(n.helpers.add(s),s)}}function hs(e,t){for(let n=0;n<e.length;n++)Mr(e[n],t)}function Mr(e,t){switch(e.type){case 1:hs(e.cases,t),t.helper("plural");break;case 2:hs(e.items,t);break;case 6:{Mr(e.key,t),t.helper("linked"),t.helper("type");break}case 5:t.helper("interpolate"),t.helper("list");break;case 4:t.helper("interpolate"),t.helper("named");break}}function Xf(e,t={}){const n=zf(e);n.helper("normalize"),e.body&&Mr(e.body,n);const r=n.context();e.helpers=Array.from(r.helpers)}function Jf(e){const t=e.body;return t.type===2?gs(t):t.cases.forEach(n=>gs(n)),e}function gs(e){if(e.items.length===1){const t=e.items[0];(t.type===3||t.type===9)&&(e.static=t.value,delete t.value)}else{const t=[];for(let n=0;n<e.items.length;n++){const r=e.items[n];if(!(r.type===3||r.type===9)||r.value==null)break;t.push(r.value)}if(t.length===e.items.length){e.static=Ba(t);for(let n=0;n<e.items.length;n++){const r=e.items[n];(r.type===3||r.type===9)&&delete r.value}}}}const qf="minifier";function Nt(e){switch(e.t=e.type,e.type){case 0:{const t=e;Nt(t.body),t.b=t.body,delete t.body;break}case 1:{const t=e,n=t.cases;for(let r=0;r<n.length;r++)Nt(n[r]);t.c=n,delete t.cases;break}case 2:{const t=e,n=t.items;for(let r=0;r<n.length;r++)Nt(n[r]);t.i=n,delete t.items,t.static&&(t.s=t.static,delete t.static);break}case 3:case 9:case 8:case 7:{const t=e;t.value&&(t.v=t.value,delete t.value);break}case 6:{const t=e;Nt(t.key),t.k=t.key,delete t.key,t.modifier&&(Nt(t.modifier),t.m=t.modifier,delete t.modifier);break}case 5:{const t=e;t.i=t.index,delete t.index;break}case 4:{const t=e;t.k=t.key,delete t.key;break}default:throw jt(Q.UNHANDLED_MINIFIER_NODE_TYPE,null,{domain:qf,args:[e.type]})}delete e.type}const Qf="parser";function Zf(e,t){const{sourceMap:n,filename:r,breakLineCode:a,needIndent:s}=t,i=t.location!==!1,o={filename:r,code:"",column:1,line:1,offset:0,map:void 0,breakLineCode:a,needIndent:s,indentLevel:0};i&&e.loc&&(o.source=e.loc.source);const l=()=>o;function c(b,M){o.code+=b}function u(b,M=!0){const W=M?a:"";c(s?W+"  ".repeat(b):W)}function m(b=!0){const M=++o.indentLevel;b&&u(M)}function d(b=!0){const M=--o.indentLevel;b&&u(M)}function v(){u(o.indentLevel)}return{context:l,push:c,indent:m,deindent:d,newline:v,helper:b=>`_${b}`,needIndent:()=>o.needIndent}}function eh(e,t){const{helper:n}=e;e.push(`${n("linked")}(`),xt(e,t.key),t.modifier?(e.push(", "),xt(e,t.modifier),e.push(", _type")):e.push(", undefined, _type"),e.push(")")}function th(e,t){const{helper:n,needIndent:r}=e;e.push(`${n("normalize")}([`),e.indent(r());const a=t.items.length;for(let s=0;s<a&&(xt(e,t.items[s]),s!==a-1);s++)e.push(", ");e.deindent(r()),e.push("])")}function nh(e,t){const{helper:n,needIndent:r}=e;if(t.cases.length>1){e.push(`${n("plural")}([`),e.indent(r());const a=t.cases.length;for(let s=0;s<a&&(xt(e,t.cases[s]),s!==a-1);s++)e.push(", ");e.deindent(r()),e.push("])")}}function rh(e,t){t.body?xt(e,t.body):e.push("null")}function xt(e,t){const{helper:n}=e;switch(t.type){case 0:rh(e,t);break;case 1:nh(e,t);break;case 2:th(e,t);break;case 6:eh(e,t);break;case 8:e.push(JSON.stringify(t.value),t);break;case 7:e.push(JSON.stringify(t.value),t);break;case 5:e.push(`${n("interpolate")}(${n("list")}(${t.index}))`,t);break;case 4:e.push(`${n("interpolate")}(${n("named")}(${JSON.stringify(t.key)}))`,t);break;case 9:e.push(JSON.stringify(t.value),t);break;case 3:e.push(JSON.stringify(t.value),t);break;default:throw jt(Q.UNHANDLED_CODEGEN_NODE_TYPE,null,{domain:Qf,args:[t.type]})}}const sh=(e,t={})=>{const n=ps(t.mode)?t.mode:"normal",r=ps(t.filename)?t.filename:"message.intl",a=!!t.sourceMap,s=t.breakLineCode!=null?t.breakLineCode:n==="arrow"?";":`
`,i=t.needIndent?t.needIndent:n!=="arrow",o=e.helpers||[],l=Zf(e,{mode:n,filename:r,sourceMap:a,breakLineCode:s,needIndent:i});l.push(n==="normal"?"function __msg__ (ctx) {":"(ctx) => {"),l.indent(i),o.length>0&&(l.push(`const { ${Ba(o.map(m=>`${m}: _${m}`),", ")} } = ctx`),l.newline()),l.push("return "),xt(l,e),l.deindent(i),l.push("}"),delete e.helpers;const{code:c,map:u}=l.context();return{ast:e,code:c,map:u?u.toJSON():void 0}};function ah(e,t={}){const n=Ha({},t),r=!!n.jit,a=!!n.minify,s=n.optimize==null?!0:n.optimize,o=Yf(n).parse(e);return r?(s&&Jf(o),a&&Nt(o),{ast:o,code:""}):(Xf(o,n),sh(o,n))}/*!
  * core-base v9.14.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */function ih(){typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(st().__INTLIFY_PROD_DEVTOOLS__=!1),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(st().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(st().__INTLIFY_DROP_MESSAGE_COMPILER__=!1)}const _t=[];_t[0]={w:[0],i:[3,0],"[":[4],o:[7]};_t[1]={w:[1],".":[2],"[":[4],o:[7]};_t[2]={w:[2],i:[3,0],0:[3,0]};_t[3]={i:[3,0],0:[3,0],w:[1,1],".":[2,1],"[":[4,1],o:[7,1]};_t[4]={"'":[5,0],'"':[6,0],"[":[4,2],"]":[1,3],o:8,l:[4,0]};_t[5]={"'":[4,0],o:8,l:[5,0]};_t[6]={'"':[4,0],o:8,l:[6,0]};const oh=/^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;function lh(e){return oh.test(e)}function ch(e){const t=e.charCodeAt(0),n=e.charCodeAt(e.length-1);return t===n&&(t===34||t===39)?e.slice(1,-1):e}function uh(e){if(e==null)return"o";switch(e.charCodeAt(0)){case 91:case 93:case 46:case 34:case 39:return e;case 95:case 36:case 45:return"i";case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"w"}return"i"}function dh(e){const t=e.trim();return e.charAt(0)==="0"&&isNaN(parseInt(e))?!1:lh(t)?ch(t):"*"+t}function mh(e){const t=[];let n=-1,r=0,a=0,s,i,o,l,c,u,m;const d=[];d[0]=()=>{i===void 0?i=o:i+=o},d[1]=()=>{i!==void 0&&(t.push(i),i=void 0)},d[2]=()=>{d[0](),a++},d[3]=()=>{if(a>0)a--,r=4,d[0]();else{if(a=0,i===void 0||(i=dh(i),i===!1))return!1;d[1]()}};function v(){const E=e[n+1];if(r===5&&E==="'"||r===6&&E==='"')return n++,o="\\"+E,d[0](),!0}for(;r!==null;)if(n++,s=e[n],!(s==="\\"&&v())){if(l=uh(s),m=_t[r],c=m[l]||m.l||8,c===8||(r=c[0],c[1]!==void 0&&(u=d[c[1]],u&&(o=s,u()===!1))))return;if(r===7)return t}}const vs=new Map;function ph(e,t){return ue(e)?e[t]:null}function fh(e,t){if(!ue(e))return null;let n=vs.get(t);if(n||(n=mh(t),n&&vs.set(t,n)),!n)return null;const r=n.length;let a=e,s=0;for(;s<r;){const i=a[n[s]];if(i===void 0||he(a))return null;a=i,s++}return a}const hh=e=>e,gh=e=>"",vh="text",_h=e=>e.length===0?"":If(e),bh=Cf;function _s(e,t){return e=Math.abs(e),t===2?e?e>1?1:0:1:e?Math.min(e,2):0}function yh(e){const t=Ce(e.pluralIndex)?e.pluralIndex:-1;return e.named&&(Ce(e.named.count)||Ce(e.named.n))?Ce(e.named.count)?e.named.count:Ce(e.named.n)?e.named.n:t:t}function kh(e,t){t.count||(t.count=e),t.n||(t.n=e)}function wh(e={}){const t=e.locale,n=yh(e),r=ue(e.pluralRules)&&H(t)&&he(e.pluralRules[t])?e.pluralRules[t]:_s,a=ue(e.pluralRules)&&H(t)&&he(e.pluralRules[t])?_s:void 0,s=M=>M[r(n,M.length,a)],i=e.list||[],o=M=>i[M],l=e.named||{};Ce(e.pluralIndex)&&kh(n,l);const c=M=>l[M];function u(M){const W=he(e.messages)?e.messages(M):ue(e.messages)?e.messages[M]:!1;return W||(e.parent?e.parent.message(M):gh)}const m=M=>e.modifiers?e.modifiers[M]:hh,d=te(e.processor)&&he(e.processor.normalize)?e.processor.normalize:_h,v=te(e.processor)&&he(e.processor.interpolate)?e.processor.interpolate:bh,E=te(e.processor)&&H(e.processor.type)?e.processor.type:vh,b={list:o,named:c,plural:s,linked:(M,...W)=>{const[y,L]=W;let T="text",I="";W.length===1?ue(y)?(I=y.modifier||I,T=y.type||T):H(y)&&(I=y||I):W.length===2&&(H(y)&&(I=y||I),H(L)&&(T=L||T));const R=u(M)(b),x=T==="vnode"&&ve(R)&&I?R[0]:R;return I?m(I)(x,T):x},message:u,type:E,interpolate:v,normalize:d,values:Te({},i,l)};return b}let en=null;function Lh(e){en=e}function Eh(e,t,n){en&&en.emit("i18n:init",{timestamp:Date.now(),i18n:e,version:t,meta:n})}const Sh=Oh("function:translate");function Oh(e){return t=>en&&en.emit(e,t)}const Wa=Nr.__EXTEND_POINT__,yt=Dn(Wa),Ch={NOT_FOUND_KEY:Wa,FALLBACK_TO_TRANSLATE:yt(),CANNOT_FORMAT_NUMBER:yt(),FALLBACK_TO_NUMBER_FORMAT:yt(),CANNOT_FORMAT_DATE:yt(),FALLBACK_TO_DATE_FORMAT:yt(),EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER:yt(),__EXTEND_POINT__:yt()},ja=Q.__EXTEND_POINT__,kt=Dn(ja),Be={INVALID_ARGUMENT:ja,INVALID_DATE_ARGUMENT:kt(),INVALID_ISO_DATE_ARGUMENT:kt(),NOT_SUPPORT_NON_STRING_MESSAGE:kt(),NOT_SUPPORT_LOCALE_PROMISE_VALUE:kt(),NOT_SUPPORT_LOCALE_ASYNC_FUNCTION:kt(),NOT_SUPPORT_LOCALE_TYPE:kt(),__EXTEND_POINT__:kt()};function Ge(e){return jt(e,null,void 0)}function Pr(e,t){return t.locale!=null?bs(t.locale):bs(e.locale)}let Xn;function bs(e){if(H(e))return e;if(he(e)){if(e.resolvedOnce&&Xn!=null)return Xn;if(e.constructor.name==="Function"){const t=e();if(Of(t))throw Ge(Be.NOT_SUPPORT_LOCALE_PROMISE_VALUE);return Xn=t}else throw Ge(Be.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)}else throw Ge(Be.NOT_SUPPORT_LOCALE_TYPE)}function Ih(e,t,n){return[...new Set([n,...ve(t)?t:ue(t)?Object.keys(t):H(t)?[t]:[n]])]}function Ka(e,t,n){const r=H(n)?n:Dt,a=e;a.__localeChainCache||(a.__localeChainCache=new Map);let s=a.__localeChainCache.get(r);if(!s){s=[];let i=[n];for(;ve(i);)i=ys(s,i,t);const o=ve(t)||!te(t)?t:t.default?t.default:null;i=H(o)?[o]:o,ve(i)&&ys(s,i,!1),a.__localeChainCache.set(r,s)}return s}function ys(e,t,n){let r=!0;for(let a=0;a<t.length&&ae(r);a++){const s=t[a];H(s)&&(r=Ah(e,t[a],n))}return r}function Ah(e,t,n){let r;const a=t.split("-");do{const s=a.join("-");r=Th(e,s,n),a.splice(-1,1)}while(a.length&&r===!0);return r}function Th(e,t,n){let r=!1;if(!e.includes(t)&&(r=!0,t)){r=t[t.length-1]!=="!";const a=t.replace(/!/g,"");e.push(a),(ve(n)||te(n))&&n[a]&&(r=n[a])}return r}const Nh="9.14.0",Vn=-1,Dt="en-US",ks="",ws=e=>`${e.charAt(0).toLocaleUpperCase()}${e.substr(1)}`;function Mh(){return{upper:(e,t)=>t==="text"&&H(e)?e.toUpperCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toUpperCase():e,lower:(e,t)=>t==="text"&&H(e)?e.toLowerCase():t==="vnode"&&ue(e)&&"__v_isVNode"in e?e.children.toLowerCase():e,capitalize:(e,t)=>t==="text"&&H(e)?ws(e):t==="vnode"&&ue(e)&&"__v_isVNode"in e?ws(e.children):e}}let Ga;function Ls(e){Ga=e}let Ya;function Ph(e){Ya=e}let za;function Rh(e){za=e}let Xa=null;const $h=e=>{Xa=e},Fh=()=>Xa;let Ja=null;const Es=e=>{Ja=e},xh=()=>Ja;let Ss=0;function Dh(e={}){const t=he(e.onWarn)?e.onWarn:Af,n=H(e.version)?e.version:Nh,r=H(e.locale)||he(e.locale)?e.locale:Dt,a=he(r)?Dt:r,s=ve(e.fallbackLocale)||te(e.fallbackLocale)||H(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:a,i=te(e.messages)?e.messages:{[a]:{}},o=te(e.datetimeFormats)?e.datetimeFormats:{[a]:{}},l=te(e.numberFormats)?e.numberFormats:{[a]:{}},c=Te({},e.modifiers||{},Mh()),u=e.pluralRules||{},m=he(e.missing)?e.missing:null,d=ae(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,v=ae(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,E=!!e.fallbackFormat,_=!!e.unresolving,b=he(e.postTranslation)?e.postTranslation:null,M=te(e.processor)?e.processor:null,W=ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,y=!!e.escapeParameter,L=he(e.messageCompiler)?e.messageCompiler:Ga,T=he(e.messageResolver)?e.messageResolver:Ya||ph,I=he(e.localeFallbacker)?e.localeFallbacker:za||Ih,R=ue(e.fallbackContext)?e.fallbackContext:void 0,x=e,$=ue(x.__datetimeFormatters)?x.__datetimeFormatters:new Map,me=ue(x.__numberFormatters)?x.__numberFormatters:new Map,we=ue(x.__meta)?x.__meta:{};Ss++;const Z={version:n,cid:Ss,locale:r,fallbackLocale:s,messages:i,modifiers:c,pluralRules:u,missing:m,missingWarn:d,fallbackWarn:v,fallbackFormat:E,unresolving:_,postTranslation:b,processor:M,warnHtmlMessage:W,escapeParameter:y,messageCompiler:L,messageResolver:T,localeFallbacker:I,fallbackContext:R,onWarn:t,__meta:we};return Z.datetimeFormats=o,Z.numberFormats=l,Z.__datetimeFormatters=$,Z.__numberFormatters=me,__INTLIFY_PROD_DEVTOOLS__&&Eh(Z,n,we),Z}function Rr(e,t,n,r,a){const{missing:s,onWarn:i}=e;if(s!==null){const o=s(e,n,t,a);return H(o)?o:t}else return t}function qt(e,t,n){const r=e;r.__localeChainCache=new Map,e.localeFallbacker(e,n,t)}function Vh(e,t){return e===t?!1:e.split("-")[0]===t.split("-")[0]}function Uh(e,t){const n=t.indexOf(e);if(n===-1)return!1;for(let r=n+1;r<t.length;r++)if(Vh(e,t[r]))return!0;return!1}function Jn(e){return n=>Hh(n,e)}function Hh(e,t){const n=t.b||t.body;if((n.t||n.type)===1){const r=n,a=r.c||r.cases;return e.plural(a.reduce((s,i)=>[...s,Os(e,i)],[]))}else return Os(e,n)}function Os(e,t){const n=t.s||t.static;if(n)return e.type==="text"?n:e.normalize([n]);{const r=(t.i||t.items).reduce((a,s)=>[...a,mr(e,s)],[]);return e.normalize(r)}}function mr(e,t){const n=t.t||t.type;switch(n){case 3:{const r=t;return r.v||r.value}case 9:{const r=t;return r.v||r.value}case 4:{const r=t;return e.interpolate(e.named(r.k||r.key))}case 5:{const r=t;return e.interpolate(e.list(r.i!=null?r.i:r.index))}case 6:{const r=t,a=r.m||r.modifier;return e.linked(mr(e,r.k||r.key),a?mr(e,a):void 0,e.type)}case 7:{const r=t;return r.v||r.value}case 8:{const r=t;return r.v||r.value}default:throw new Error(`unhandled node type on format message part: ${n}`)}}const qa=e=>e;let Pt=Object.create(null);const Vt=e=>ue(e)&&(e.t===0||e.type===0)&&("b"in e||"body"in e);function Qa(e,t={}){let n=!1;const r=t.onError||Ff;return t.onError=a=>{n=!0,r(a)},{...ah(e,t),detectError:n}}const Bh=(e,t)=>{if(!H(e))throw Ge(Be.NOT_SUPPORT_NON_STRING_MESSAGE);{ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||qa)(e),a=Pt[r];if(a)return a;const{code:s,detectError:i}=Qa(e,t),o=new Function(`return ${s}`)();return i?o:Pt[r]=o}};function Wh(e,t){if(__INTLIFY_JIT_COMPILATION__&&!__INTLIFY_DROP_MESSAGE_COMPILER__&&H(e)){ae(t.warnHtmlMessage)&&t.warnHtmlMessage;const r=(t.onCacheKey||qa)(e),a=Pt[r];if(a)return a;const{ast:s,detectError:i}=Qa(e,{...t,location:!1,jit:!0}),o=Jn(s);return i?o:Pt[r]=o}else{const n=e.cacheKey;if(n){const r=Pt[n];return r||(Pt[n]=Jn(e))}else return Jn(e)}}const Cs=()=>"",xe=e=>he(e);function Is(e,...t){const{fallbackFormat:n,postTranslation:r,unresolving:a,messageCompiler:s,fallbackLocale:i,messages:o}=e,[l,c]=pr(...t),u=ae(c.missingWarn)?c.missingWarn:e.missingWarn,m=ae(c.fallbackWarn)?c.fallbackWarn:e.fallbackWarn,d=ae(c.escapeParameter)?c.escapeParameter:e.escapeParameter,v=!!c.resolvedMessage,E=H(c.default)||ae(c.default)?ae(c.default)?s?l:()=>l:c.default:n?s?l:()=>l:"",_=n||E!=="",b=Pr(e,c);d&&jh(c);let[M,W,y]=v?[l,b,o[b]||{}]:Za(e,l,b,i,m,u),L=M,T=l;if(!v&&!(H(L)||Vt(L)||xe(L))&&_&&(L=E,T=L),!v&&(!(H(L)||Vt(L)||xe(L))||!H(W)))return a?Vn:l;let I=!1;const R=()=>{I=!0},x=xe(L)?L:ei(e,l,W,L,T,R);if(I)return L;const $=Yh(e,W,y,c),me=wh($),we=Kh(e,x,me),Z=r?r(we,l):we;if(__INTLIFY_PROD_DEVTOOLS__){const D={timestamp:Date.now(),key:H(l)?l:xe(L)?L.key:"",locale:W||(xe(L)?L.locale:""),format:H(L)?L:xe(L)?L.source:"",message:Z};D.meta=Te({},e.__meta,Fh()||{}),Sh(D)}return Z}function jh(e){ve(e.list)?e.list=e.list.map(t=>H(t)?ms(t):t):ue(e.named)&&Object.keys(e.named).forEach(t=>{H(e.named[t])&&(e.named[t]=ms(e.named[t]))})}function Za(e,t,n,r,a,s){const{messages:i,onWarn:o,messageResolver:l,localeFallbacker:c}=e,u=c(e,r,n);let m={},d,v=null;const E="translate";for(let _=0;_<u.length&&(d=u[_],m=i[d]||{},(v=l(m,t))===null&&(v=m[t]),!(H(v)||Vt(v)||xe(v)));_++)if(!Uh(d,u)){const b=Rr(e,t,d,s,E);b!==t&&(v=b)}return[v,d,m]}function ei(e,t,n,r,a,s){const{messageCompiler:i,warnHtmlMessage:o}=e;if(xe(r)){const c=r;return c.locale=c.locale||n,c.key=c.key||t,c}if(i==null){const c=()=>r;return c.locale=n,c.key=t,c}const l=i(r,Gh(e,n,a,r,o,s));return l.locale=n,l.key=t,l.source=r,l}function Kh(e,t,n){return t(n)}function pr(...e){const[t,n,r]=e,a={};if(!H(t)&&!Ce(t)&&!xe(t)&&!Vt(t))throw Ge(Be.INVALID_ARGUMENT);const s=Ce(t)?String(t):(xe(t),t);return Ce(n)?a.plural=n:H(n)?a.default=n:te(n)&&!xn(n)?a.named=n:ve(n)&&(a.list=n),Ce(r)?a.plural=r:H(r)?a.default=r:te(r)&&Te(a,r),[s,a]}function Gh(e,t,n,r,a,s){return{locale:t,key:n,warnHtmlMessage:a,onError:i=>{throw s&&s(i),i},onCacheKey:i=>wf(t,n,i)}}function Yh(e,t,n,r){const{modifiers:a,pluralRules:s,messageResolver:i,fallbackLocale:o,fallbackWarn:l,missingWarn:c,fallbackContext:u}=e,d={locale:t,modifiers:a,pluralRules:s,messages:v=>{let E=i(n,v);if(E==null&&u){const[,,_]=Za(u,v,t,o,l,c);E=i(_,v)}if(H(E)||Vt(E)){let _=!1;const M=ei(e,v,t,E,v,()=>{_=!0});return _?Cs:M}else return xe(E)?E:Cs}};return e.processor&&(d.processor=e.processor),r.list&&(d.list=r.list),r.named&&(d.named=r.named),Ce(r.plural)&&(d.pluralIndex=r.plural),d}function As(e,...t){const{datetimeFormats:n,unresolving:r,fallbackLocale:a,onWarn:s,localeFallbacker:i}=e,{__datetimeFormatters:o}=e,[l,c,u,m]=fr(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const v=!!u.part,E=Pr(e,u),_=i(e,a,E);if(!H(l)||l==="")return new Intl.DateTimeFormat(E,m).format(c);let b={},M,W=null;const y="datetime format";for(let I=0;I<_.length&&(M=_[I],b=n[M]||{},W=b[l],!te(W));I++)Rr(e,l,M,d,y);if(!te(W)||!H(M))return r?Vn:l;let L=`${M}__${l}`;xn(m)||(L=`${L}__${JSON.stringify(m)}`);let T=o.get(L);return T||(T=new Intl.DateTimeFormat(M,Te({},W,m)),o.set(L,T)),v?T.formatToParts(c):T.format(c)}const ti=["localeMatcher","weekday","era","year","month","day","hour","minute","second","timeZoneName","formatMatcher","hour12","timeZone","dateStyle","timeStyle","calendar","dayPeriod","numberingSystem","hourCycle","fractionalSecondDigits"];function fr(...e){const[t,n,r,a]=e,s={};let i={},o;if(H(t)){const l=t.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);if(!l)throw Ge(Be.INVALID_ISO_DATE_ARGUMENT);const c=l[3]?l[3].trim().startsWith("T")?`${l[1].trim()}${l[3].trim()}`:`${l[1].trim()}T${l[3].trim()}`:l[1].trim();o=new Date(c);try{o.toISOString()}catch{throw Ge(Be.INVALID_ISO_DATE_ARGUMENT)}}else if(Ef(t)){if(isNaN(t.getTime()))throw Ge(Be.INVALID_DATE_ARGUMENT);o=t}else if(Ce(t))o=t;else throw Ge(Be.INVALID_ARGUMENT);return H(n)?s.key=n:te(n)&&Object.keys(n).forEach(l=>{ti.includes(l)?i[l]=n[l]:s[l]=n[l]}),H(r)?s.locale=r:te(r)&&(i=r),te(a)&&(i=a),[s.key||"",o,s,i]}function Ts(e,t,n){const r=e;for(const a in n){const s=`${t}__${a}`;r.__datetimeFormatters.has(s)&&r.__datetimeFormatters.delete(s)}}function Ns(e,...t){const{numberFormats:n,unresolving:r,fallbackLocale:a,onWarn:s,localeFallbacker:i}=e,{__numberFormatters:o}=e,[l,c,u,m]=hr(...t),d=ae(u.missingWarn)?u.missingWarn:e.missingWarn;ae(u.fallbackWarn)?u.fallbackWarn:e.fallbackWarn;const v=!!u.part,E=Pr(e,u),_=i(e,a,E);if(!H(l)||l==="")return new Intl.NumberFormat(E,m).format(c);let b={},M,W=null;const y="number format";for(let I=0;I<_.length&&(M=_[I],b=n[M]||{},W=b[l],!te(W));I++)Rr(e,l,M,d,y);if(!te(W)||!H(M))return r?Vn:l;let L=`${M}__${l}`;xn(m)||(L=`${L}__${JSON.stringify(m)}`);let T=o.get(L);return T||(T=new Intl.NumberFormat(M,Te({},W,m)),o.set(L,T)),v?T.formatToParts(c):T.format(c)}const ni=["localeMatcher","style","currency","currencyDisplay","currencySign","useGrouping","minimumIntegerDigits","minimumFractionDigits","maximumFractionDigits","minimumSignificantDigits","maximumSignificantDigits","compactDisplay","notation","signDisplay","unit","unitDisplay","roundingMode","roundingPriority","roundingIncrement","trailingZeroDisplay"];function hr(...e){const[t,n,r,a]=e,s={};let i={};if(!Ce(t))throw Ge(Be.INVALID_ARGUMENT);const o=t;return H(n)?s.key=n:te(n)&&Object.keys(n).forEach(l=>{ni.includes(l)?i[l]=n[l]:s[l]=n[l]}),H(r)?s.locale=r:te(r)&&(i=r),te(a)&&(i=a),[s.key||"",o,s,i]}function Ms(e,t,n){const r=e;for(const a in n){const s=`${t}__${a}`;r.__numberFormatters.has(s)&&r.__numberFormatters.delete(s)}}ih();/*!
  * vue-i18n v9.14.0
  * (c) 2024 kazuya kawaguchi
  * Released under the MIT License.
  */const zh="9.14.0";function Xh(){typeof __VUE_I18N_FULL_INSTALL__!="boolean"&&(st().__VUE_I18N_FULL_INSTALL__=!0),typeof __VUE_I18N_LEGACY_API__!="boolean"&&(st().__VUE_I18N_LEGACY_API__=!0),typeof __INTLIFY_JIT_COMPILATION__!="boolean"&&(st().__INTLIFY_JIT_COMPILATION__=!1),typeof __INTLIFY_DROP_MESSAGE_COMPILER__!="boolean"&&(st().__INTLIFY_DROP_MESSAGE_COMPILER__=!1),typeof __INTLIFY_PROD_DEVTOOLS__!="boolean"&&(st().__INTLIFY_PROD_DEVTOOLS__=!1)}const ri=Ch.__EXTEND_POINT__,tt=Dn(ri);tt(),tt(),tt(),tt(),tt(),tt(),tt(),tt(),tt();const si=Be.__EXTEND_POINT__,Re=Dn(si),Ie={UNEXPECTED_RETURN_TYPE:si,INVALID_ARGUMENT:Re(),MUST_BE_CALL_SETUP_TOP:Re(),NOT_INSTALLED:Re(),NOT_AVAILABLE_IN_LEGACY_MODE:Re(),REQUIRED_VALUE:Re(),INVALID_VALUE:Re(),CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN:Re(),NOT_INSTALLED_WITH_PROVIDE:Re(),UNEXPECTED_ERROR:Re(),NOT_COMPATIBLE_LEGACY_VUE_I18N:Re(),BRIDGE_SUPPORT_VUE_2_ONLY:Re(),MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION:Re(),NOT_AVAILABLE_COMPOSITION_IN_LEGACY:Re(),__EXTEND_POINT__:Re()};function Ae(e,...t){return jt(e,null,void 0)}const gr=vt("__translateVNode"),vr=vt("__datetimeParts"),_r=vt("__numberParts"),ai=vt("__setPluralRules"),ii=vt("__injectWithOption"),br=vt("__dispose");function tn(e){if(!ue(e))return e;for(const t in e)if(Sn(e,t))if(!t.includes("."))ue(e[t])&&tn(e[t]);else{const n=t.split("."),r=n.length-1;let a=e,s=!1;for(let i=0;i<r;i++){if(n[i]in a||(a[n[i]]={}),!ue(a[n[i]])){s=!0;break}a=a[n[i]]}s||(a[n[r]]=e[t],delete e[t]),ue(a[n[r]])&&tn(a[n[r]])}return e}function Un(e,t){const{messages:n,__i18n:r,messageResolver:a,flatJson:s}=t,i=te(n)?n:ve(r)?{}:{[e]:{}};if(ve(r)&&r.forEach(o=>{if("locale"in o&&"resource"in o){const{locale:l,resource:c}=o;l?(i[l]=i[l]||{},gn(c,i[l])):gn(c,i)}else H(o)&&gn(JSON.parse(o),i)}),a==null&&s)for(const o in i)Sn(i,o)&&tn(i[o]);return i}function oi(e){return e.type}function li(e,t,n){let r=ue(t.messages)?t.messages:{};"__i18nGlobal"in n&&(r=Un(e.locale.value,{messages:r,__i18n:n.__i18nGlobal}));const a=Object.keys(r);a.length&&a.forEach(s=>{e.mergeLocaleMessage(s,r[s])});{if(ue(t.datetimeFormats)){const s=Object.keys(t.datetimeFormats);s.length&&s.forEach(i=>{e.mergeDateTimeFormat(i,t.datetimeFormats[i])})}if(ue(t.numberFormats)){const s=Object.keys(t.numberFormats);s.length&&s.forEach(i=>{e.mergeNumberFormat(i,t.numberFormats[i])})}}}function Ps(e){return Y($i,null,e,0)}const Rs="__INTLIFY_META__",$s=()=>[],Jh=()=>!1;let Fs=0;function xs(e){return(t,n,r,a)=>e(n,r,Ft()||void 0,a)}const qh=()=>{const e=Ft();let t=null;return e&&(t=oi(e)[Rs])?{[Rs]:t}:null};function $r(e={},t){const{__root:n,__injectWithOption:r}=e,a=n===void 0,s=e.flatJson,i=En?z:Tn,o=!!e.translateExistCompatible;let l=ae(e.inheritLocale)?e.inheritLocale:!0;const c=i(n&&l?n.locale.value:H(e.locale)?e.locale:Dt),u=i(n&&l?n.fallbackLocale.value:H(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:c.value),m=i(Un(c.value,e)),d=i(te(e.datetimeFormats)?e.datetimeFormats:{[c.value]:{}}),v=i(te(e.numberFormats)?e.numberFormats:{[c.value]:{}});let E=n?n.missingWarn:ae(e.missingWarn)||pt(e.missingWarn)?e.missingWarn:!0,_=n?n.fallbackWarn:ae(e.fallbackWarn)||pt(e.fallbackWarn)?e.fallbackWarn:!0,b=n?n.fallbackRoot:ae(e.fallbackRoot)?e.fallbackRoot:!0,M=!!e.fallbackFormat,W=he(e.missing)?e.missing:null,y=he(e.missing)?xs(e.missing):null,L=he(e.postTranslation)?e.postTranslation:null,T=n?n.warnHtmlMessage:ae(e.warnHtmlMessage)?e.warnHtmlMessage:!0,I=!!e.escapeParameter;const R=n?n.modifiers:te(e.modifiers)?e.modifiers:{};let x=e.pluralRules||n&&n.pluralRules,$;$=(()=>{a&&Es(null);const O={version:zh,locale:c.value,fallbackLocale:u.value,messages:m.value,modifiers:R,pluralRules:x,missing:y===null?void 0:y,missingWarn:E,fallbackWarn:_,fallbackFormat:M,unresolving:!0,postTranslation:L===null?void 0:L,warnHtmlMessage:T,escapeParameter:I,messageResolver:e.messageResolver,messageCompiler:e.messageCompiler,__meta:{framework:"vue"}};O.datetimeFormats=d.value,O.numberFormats=v.value,O.__datetimeFormatters=te($)?$.__datetimeFormatters:void 0,O.__numberFormatters=te($)?$.__numberFormatters:void 0;const P=Dh(O);return a&&Es(P),P})(),qt($,c.value,u.value);function we(){return[c.value,u.value,m.value,d.value,v.value]}const Z=U({get:()=>c.value,set:O=>{c.value=O,$.locale=c.value}}),D=U({get:()=>u.value,set:O=>{u.value=O,$.fallbackLocale=u.value,qt($,c.value,O)}}),re=U(()=>m.value),Ee=U(()=>d.value),Oe=U(()=>v.value);function _e(){return he(L)?L:null}function De(O){L=O,$.postTranslation=O}function Ze(){return W}function be(O){O!==null&&(y=xs(O)),W=O,$.missing=y}const Le=(O,P,fe,Se,ct,cn)=>{we();let Ct;try{__INTLIFY_PROD_DEVTOOLS__,a||($.fallbackContext=n?xh():void 0),Ct=O($)}finally{__INTLIFY_PROD_DEVTOOLS__,a||($.fallbackContext=void 0)}if(fe!=="translate exists"&&Ce(Ct)&&Ct===Vn||fe==="translate exists"&&!Ct){const[fi,T0]=P();return n&&b?Se(n):ct(fi)}else{if(cn(Ct))return Ct;throw Ae(Ie.UNEXPECTED_RETURN_TYPE)}};function Ve(...O){return Le(P=>Reflect.apply(Is,null,[P,...O]),()=>pr(...O),"translate",P=>Reflect.apply(P.t,P,[...O]),P=>P,P=>H(P))}function j(...O){const[P,fe,Se]=O;if(Se&&!ue(Se))throw Ae(Ie.INVALID_ARGUMENT);return Ve(P,fe,Te({resolvedMessage:!0},Se||{}))}function le(...O){return Le(P=>Reflect.apply(As,null,[P,...O]),()=>fr(...O),"datetime format",P=>Reflect.apply(P.d,P,[...O]),()=>ks,P=>H(P))}function oe(...O){return Le(P=>Reflect.apply(Ns,null,[P,...O]),()=>hr(...O),"number format",P=>Reflect.apply(P.n,P,[...O]),()=>ks,P=>H(P))}function pe(O){return O.map(P=>H(P)||Ce(P)||ae(P)?Ps(String(P)):P)}const je={normalize:pe,interpolate:O=>O,type:"vnode"};function bt(...O){return Le(P=>{let fe;const Se=P;try{Se.processor=je,fe=Reflect.apply(Is,null,[Se,...O])}finally{Se.processor=null}return fe},()=>pr(...O),"translate",P=>P[gr](...O),P=>[Ps(P)],P=>ve(P))}function lt(...O){return Le(P=>Reflect.apply(Ns,null,[P,...O]),()=>hr(...O),"number format",P=>P[_r](...O),$s,P=>H(P)||ve(P))}function Kt(...O){return Le(P=>Reflect.apply(As,null,[P,...O]),()=>fr(...O),"datetime format",P=>P[vr](...O),$s,P=>H(P)||ve(P))}function Gt(O){x=O,$.pluralRules=x}function Yt(O,P){return Le(()=>{if(!O)return!1;const fe=H(P)?P:c.value,Se=St(fe),ct=$.messageResolver(Se,O);return o?ct!=null:Vt(ct)||xe(ct)||H(ct)},()=>[O],"translate exists",fe=>Reflect.apply(fe.te,fe,[O,P]),Jh,fe=>ae(fe))}function F(O){let P=null;const fe=Ka($,u.value,c.value);for(let Se=0;Se<fe.length;Se++){const ct=m.value[fe[Se]]||{},cn=$.messageResolver(ct,O);if(cn!=null){P=cn;break}}return P}function ce(O){const P=F(O);return P??(n?n.tm(O)||{}:{})}function St(O){return m.value[O]||{}}function Ot(O,P){if(s){const fe={[O]:P};for(const Se in fe)Sn(fe,Se)&&tn(fe[Se]);P=fe[O]}m.value[O]=P,$.messages=m.value}function zt(O,P){m.value[O]=m.value[O]||{};const fe={[O]:P};if(s)for(const Se in fe)Sn(fe,Se)&&tn(fe[Se]);P=fe[O],gn(P,m.value[O]),$.messages=m.value}function Bn(O){return d.value[O]||{}}function p(O,P){d.value[O]=P,$.datetimeFormats=d.value,Ts($,O,P)}function f(O,P){d.value[O]=Te(d.value[O]||{},P),$.datetimeFormats=d.value,Ts($,O,P)}function N(O){return v.value[O]||{}}function J(O,P){v.value[O]=P,$.numberFormats=v.value,Ms($,O,P)}function ye(O,P){v.value[O]=Te(v.value[O]||{},P),$.numberFormats=v.value,Ms($,O,P)}Fs++,n&&En&&(ke(n.locale,O=>{l&&(c.value=O,$.locale=O,qt($,c.value,u.value))}),ke(n.fallbackLocale,O=>{l&&(u.value=O,$.fallbackLocale=O,qt($,c.value,u.value))}));const ne={id:Fs,locale:Z,fallbackLocale:D,get inheritLocale(){return l},set inheritLocale(O){l=O,O&&n&&(c.value=n.locale.value,u.value=n.fallbackLocale.value,qt($,c.value,u.value))},get availableLocales(){return Object.keys(m.value).sort()},messages:re,get modifiers(){return R},get pluralRules(){return x||{}},get isGlobal(){return a},get missingWarn(){return E},set missingWarn(O){E=O,$.missingWarn=E},get fallbackWarn(){return _},set fallbackWarn(O){_=O,$.fallbackWarn=_},get fallbackRoot(){return b},set fallbackRoot(O){b=O},get fallbackFormat(){return M},set fallbackFormat(O){M=O,$.fallbackFormat=M},get warnHtmlMessage(){return T},set warnHtmlMessage(O){T=O,$.warnHtmlMessage=O},get escapeParameter(){return I},set escapeParameter(O){I=O,$.escapeParameter=O},t:Ve,getLocaleMessage:St,setLocaleMessage:Ot,mergeLocaleMessage:zt,getPostTranslationHandler:_e,setPostTranslationHandler:De,getMissingHandler:Ze,setMissingHandler:be,[ai]:Gt};return ne.datetimeFormats=Ee,ne.numberFormats=Oe,ne.rt=j,ne.te=Yt,ne.tm=ce,ne.d=le,ne.n=oe,ne.getDateTimeFormat=Bn,ne.setDateTimeFormat=p,ne.mergeDateTimeFormat=f,ne.getNumberFormat=N,ne.setNumberFormat=J,ne.mergeNumberFormat=ye,ne[ii]=r,ne[gr]=bt,ne[vr]=Kt,ne[_r]=lt,ne}function Qh(e){const t=H(e.locale)?e.locale:Dt,n=H(e.fallbackLocale)||ve(e.fallbackLocale)||te(e.fallbackLocale)||e.fallbackLocale===!1?e.fallbackLocale:t,r=he(e.missing)?e.missing:void 0,a=ae(e.silentTranslationWarn)||pt(e.silentTranslationWarn)?!e.silentTranslationWarn:!0,s=ae(e.silentFallbackWarn)||pt(e.silentFallbackWarn)?!e.silentFallbackWarn:!0,i=ae(e.fallbackRoot)?e.fallbackRoot:!0,o=!!e.formatFallbackMessages,l=te(e.modifiers)?e.modifiers:{},c=e.pluralizationRules,u=he(e.postTranslation)?e.postTranslation:void 0,m=H(e.warnHtmlInMessage)?e.warnHtmlInMessage!=="off":!0,d=!!e.escapeParameterHtml,v=ae(e.sync)?e.sync:!0;let E=e.messages;if(te(e.sharedMessages)){const I=e.sharedMessages;E=Object.keys(I).reduce((x,$)=>{const me=x[$]||(x[$]={});return Te(me,I[$]),x},E||{})}const{__i18n:_,__root:b,__injectWithOption:M}=e,W=e.datetimeFormats,y=e.numberFormats,L=e.flatJson,T=e.translateExistCompatible;return{locale:t,fallbackLocale:n,messages:E,flatJson:L,datetimeFormats:W,numberFormats:y,missing:r,missingWarn:a,fallbackWarn:s,fallbackRoot:i,fallbackFormat:o,modifiers:l,pluralRules:c,postTranslation:u,warnHtmlMessage:m,escapeParameter:d,messageResolver:e.messageResolver,inheritLocale:v,translateExistCompatible:T,__i18n:_,__root:b,__injectWithOption:M}}function yr(e={},t){{const n=$r(Qh(e)),{__extender:r}=e,a={id:n.id,get locale(){return n.locale.value},set locale(s){n.locale.value=s},get fallbackLocale(){return n.fallbackLocale.value},set fallbackLocale(s){n.fallbackLocale.value=s},get messages(){return n.messages.value},get datetimeFormats(){return n.datetimeFormats.value},get numberFormats(){return n.numberFormats.value},get availableLocales(){return n.availableLocales},get formatter(){return{interpolate(){return[]}}},set formatter(s){},get missing(){return n.getMissingHandler()},set missing(s){n.setMissingHandler(s)},get silentTranslationWarn(){return ae(n.missingWarn)?!n.missingWarn:n.missingWarn},set silentTranslationWarn(s){n.missingWarn=ae(s)?!s:s},get silentFallbackWarn(){return ae(n.fallbackWarn)?!n.fallbackWarn:n.fallbackWarn},set silentFallbackWarn(s){n.fallbackWarn=ae(s)?!s:s},get modifiers(){return n.modifiers},get formatFallbackMessages(){return n.fallbackFormat},set formatFallbackMessages(s){n.fallbackFormat=s},get postTranslation(){return n.getPostTranslationHandler()},set postTranslation(s){n.setPostTranslationHandler(s)},get sync(){return n.inheritLocale},set sync(s){n.inheritLocale=s},get warnHtmlInMessage(){return n.warnHtmlMessage?"warn":"off"},set warnHtmlInMessage(s){n.warnHtmlMessage=s!=="off"},get escapeParameterHtml(){return n.escapeParameter},set escapeParameterHtml(s){n.escapeParameter=s},get preserveDirectiveContent(){return!0},set preserveDirectiveContent(s){},get pluralizationRules(){return n.pluralRules||{}},__composer:n,t(...s){const[i,o,l]=s,c={};let u=null,m=null;if(!H(i))throw Ae(Ie.INVALID_ARGUMENT);const d=i;return H(o)?c.locale=o:ve(o)?u=o:te(o)&&(m=o),ve(l)?u=l:te(l)&&(m=l),Reflect.apply(n.t,n,[d,u||m||{},c])},rt(...s){return Reflect.apply(n.rt,n,[...s])},tc(...s){const[i,o,l]=s,c={plural:1};let u=null,m=null;if(!H(i))throw Ae(Ie.INVALID_ARGUMENT);const d=i;return H(o)?c.locale=o:Ce(o)?c.plural=o:ve(o)?u=o:te(o)&&(m=o),H(l)?c.locale=l:ve(l)?u=l:te(l)&&(m=l),Reflect.apply(n.t,n,[d,u||m||{},c])},te(s,i){return n.te(s,i)},tm(s){return n.tm(s)},getLocaleMessage(s){return n.getLocaleMessage(s)},setLocaleMessage(s,i){n.setLocaleMessage(s,i)},mergeLocaleMessage(s,i){n.mergeLocaleMessage(s,i)},d(...s){return Reflect.apply(n.d,n,[...s])},getDateTimeFormat(s){return n.getDateTimeFormat(s)},setDateTimeFormat(s,i){n.setDateTimeFormat(s,i)},mergeDateTimeFormat(s,i){n.mergeDateTimeFormat(s,i)},n(...s){return Reflect.apply(n.n,n,[...s])},getNumberFormat(s){return n.getNumberFormat(s)},setNumberFormat(s,i){n.setNumberFormat(s,i)},mergeNumberFormat(s,i){n.mergeNumberFormat(s,i)},getChoiceIndex(s,i){return-1}};return a.__extender=r,a}}const Fr={tag:{type:[String,Object]},locale:{type:String},scope:{type:String,validator:e=>e==="parent"||e==="global",default:"parent"},i18n:{type:Object}};function Zh({slots:e},t){return t.length===1&&t[0]==="default"?(e.default?e.default():[]).reduce((r,a)=>[...r,...a.type===ge?a.children:[a]],[]):t.reduce((n,r)=>{const a=e[r];return a&&(n[r]=a()),n},{})}function ci(e){return ge}const e0=V({name:"i18n-t",props:Te({keypath:{type:String,required:!0},plural:{type:[Number,String],validator:e=>Ce(e)||!isNaN(e)}},Fr),setup(e,t){const{slots:n,attrs:r}=t,a=e.i18n||Hn({useScope:e.scope,__useComponent:!0});return()=>{const s=Object.keys(n).filter(m=>m!=="_"),i={};e.locale&&(i.locale=e.locale),e.plural!==void 0&&(i.plural=H(e.plural)?+e.plural:e.plural);const o=Zh(t,s),l=a[gr](e.keypath,o,i),c=Te({},r),u=H(e.tag)||ue(e.tag)?e.tag:ci();return $t(u,c,l)}}}),Ds=e0;function t0(e){return ve(e)&&!H(e[0])}function ui(e,t,n,r){const{slots:a,attrs:s}=t;return()=>{const i={part:!0};let o={};e.locale&&(i.locale=e.locale),H(e.format)?i.key=e.format:ue(e.format)&&(H(e.format.key)&&(i.key=e.format.key),o=Object.keys(e.format).reduce((d,v)=>n.includes(v)?Te({},d,{[v]:e.format[v]}):d,{}));const l=r(e.value,i,o);let c=[i.key];ve(l)?c=l.map((d,v)=>{const E=a[d.type],_=E?E({[d.type]:d.value,index:v,parts:l}):[d.value];return t0(_)&&(_[0].key=`${d.type}-${v}`),_}):H(l)&&(c=[l]);const u=Te({},s),m=H(e.tag)||ue(e.tag)?e.tag:ci();return $t(m,u,c)}}const n0=V({name:"i18n-n",props:Te({value:{type:Number,required:!0},format:{type:[String,Object]}},Fr),setup(e,t){const n=e.i18n||Hn({useScope:e.scope,__useComponent:!0});return ui(e,t,ni,(...r)=>n[_r](...r))}}),Vs=n0,r0=V({name:"i18n-d",props:Te({value:{type:[Number,Date],required:!0},format:{type:[String,Object]}},Fr),setup(e,t){const n=e.i18n||Hn({useScope:e.scope,__useComponent:!0});return ui(e,t,ti,(...r)=>n[vr](...r))}}),Us=r0;function s0(e,t){const n=e;if(e.mode==="composition")return n.__getInstance(t)||e.global;{const r=n.__getInstance(t);return r!=null?r.__composer:e.global.__composer}}function a0(e){const t=i=>{const{instance:o,modifiers:l,value:c}=i;if(!o||!o.$)throw Ae(Ie.UNEXPECTED_ERROR);const u=s0(e,o.$),m=Hs(c);return[Reflect.apply(u.t,u,[...Bs(m)]),u]};return{created:(i,o)=>{const[l,c]=t(o);En&&e.global===c&&(i.__i18nWatcher=ke(c.locale,()=>{o.instance&&o.instance.$forceUpdate()})),i.__composer=c,i.textContent=l},unmounted:i=>{En&&i.__i18nWatcher&&(i.__i18nWatcher(),i.__i18nWatcher=void 0,delete i.__i18nWatcher),i.__composer&&(i.__composer=void 0,delete i.__composer)},beforeUpdate:(i,{value:o})=>{if(i.__composer){const l=i.__composer,c=Hs(o);i.textContent=Reflect.apply(l.t,l,[...Bs(c)])}},getSSRProps:i=>{const[o]=t(i);return{textContent:o}}}}function Hs(e){if(H(e))return{path:e};if(te(e)){if(!("path"in e))throw Ae(Ie.REQUIRED_VALUE,"path");return e}else throw Ae(Ie.INVALID_VALUE)}function Bs(e){const{path:t,locale:n,args:r,choice:a,plural:s}=e,i={},o=r||{};return H(n)&&(i.locale=n),Ce(a)&&(i.plural=a),Ce(s)&&(i.plural=s),[t,o,i]}function i0(e,t,...n){const r=te(n[0])?n[0]:{},a=!!r.useI18nComponentName;(ae(r.globalInstall)?r.globalInstall:!0)&&([a?"i18n":Ds.name,"I18nT"].forEach(i=>e.component(i,Ds)),[Vs.name,"I18nN"].forEach(i=>e.component(i,Vs)),[Us.name,"I18nD"].forEach(i=>e.component(i,Us))),e.directive("t",a0(t))}function o0(e,t,n){return{beforeCreate(){const r=Ft();if(!r)throw Ae(Ie.UNEXPECTED_ERROR);const a=this.$options;if(a.i18n){const s=a.i18n;if(a.__i18n&&(s.__i18n=a.__i18n),s.__root=t,this===this.$root)this.$i18n=Ws(e,s);else{s.__injectWithOption=!0,s.__extender=n.__vueI18nExtend,this.$i18n=yr(s);const i=this.$i18n;i.__extender&&(i.__disposer=i.__extender(this.$i18n))}}else if(a.__i18n)if(this===this.$root)this.$i18n=Ws(e,a);else{this.$i18n=yr({__i18n:a.__i18n,__injectWithOption:!0,__extender:n.__vueI18nExtend,__root:t});const s=this.$i18n;s.__extender&&(s.__disposer=s.__extender(this.$i18n))}else this.$i18n=e;a.__i18nGlobal&&li(t,a,a),this.$t=(...s)=>this.$i18n.t(...s),this.$rt=(...s)=>this.$i18n.rt(...s),this.$tc=(...s)=>this.$i18n.tc(...s),this.$te=(s,i)=>this.$i18n.te(s,i),this.$d=(...s)=>this.$i18n.d(...s),this.$n=(...s)=>this.$i18n.n(...s),this.$tm=s=>this.$i18n.tm(s),n.__setInstance(r,this.$i18n)},mounted(){},unmounted(){const r=Ft();if(!r)throw Ae(Ie.UNEXPECTED_ERROR);const a=this.$i18n;delete this.$t,delete this.$rt,delete this.$tc,delete this.$te,delete this.$d,delete this.$n,delete this.$tm,a.__disposer&&(a.__disposer(),delete a.__disposer,delete a.__extender),n.__deleteInstance(r),delete this.$i18n}}}function Ws(e,t){e.locale=t.locale||e.locale,e.fallbackLocale=t.fallbackLocale||e.fallbackLocale,e.missing=t.missing||e.missing,e.silentTranslationWarn=t.silentTranslationWarn||e.silentFallbackWarn,e.silentFallbackWarn=t.silentFallbackWarn||e.silentFallbackWarn,e.formatFallbackMessages=t.formatFallbackMessages||e.formatFallbackMessages,e.postTranslation=t.postTranslation||e.postTranslation,e.warnHtmlInMessage=t.warnHtmlInMessage||e.warnHtmlInMessage,e.escapeParameterHtml=t.escapeParameterHtml||e.escapeParameterHtml,e.sync=t.sync||e.sync,e.__composer[ai](t.pluralizationRules||e.pluralizationRules);const n=Un(e.locale,{messages:t.messages,__i18n:t.__i18n});return Object.keys(n).forEach(r=>e.mergeLocaleMessage(r,n[r])),t.datetimeFormats&&Object.keys(t.datetimeFormats).forEach(r=>e.mergeDateTimeFormat(r,t.datetimeFormats[r])),t.numberFormats&&Object.keys(t.numberFormats).forEach(r=>e.mergeNumberFormat(r,t.numberFormats[r])),e}const l0=vt("global-vue-i18n");function c0(e={},t){const n=__VUE_I18N_LEGACY_API__&&ae(e.legacy)?e.legacy:__VUE_I18N_LEGACY_API__,r=ae(e.globalInjection)?e.globalInjection:!0,a=__VUE_I18N_LEGACY_API__&&n?!!e.allowComposition:!0,s=new Map,[i,o]=u0(e,n),l=vt("");function c(d){return s.get(d)||null}function u(d,v){s.set(d,v)}function m(d){s.delete(d)}{const d={get mode(){return __VUE_I18N_LEGACY_API__&&n?"legacy":"composition"},get allowComposition(){return a},async install(v,...E){if(v.__VUE_I18N_SYMBOL__=l,v.provide(v.__VUE_I18N_SYMBOL__,d),te(E[0])){const M=E[0];d.__composerExtend=M.__composerExtend,d.__vueI18nExtend=M.__vueI18nExtend}let _=null;!n&&r&&(_=b0(v,d.global)),__VUE_I18N_FULL_INSTALL__&&i0(v,d,...E),__VUE_I18N_LEGACY_API__&&n&&v.mixin(o0(o,o.__composer,d));const b=v.unmount;v.unmount=()=>{_&&_(),d.dispose(),b()}},get global(){return o},dispose(){i.stop()},__instances:s,__getInstance:c,__setInstance:u,__deleteInstance:m};return d}}function Hn(e={}){const t=Ft();if(t==null)throw Ae(Ie.MUST_BE_CALL_SETUP_TOP);if(!t.isCE&&t.appContext.app!=null&&!t.appContext.app.__VUE_I18N_SYMBOL__)throw Ae(Ie.NOT_INSTALLED);const n=d0(t),r=p0(n),a=oi(t),s=m0(e,a);if(__VUE_I18N_LEGACY_API__&&n.mode==="legacy"&&!e.__useComponent){if(!n.allowComposition)throw Ae(Ie.NOT_AVAILABLE_IN_LEGACY_MODE);return v0(t,s,r,e)}if(s==="global")return li(r,e,a),r;if(s==="parent"){let l=f0(n,t,e.__useComponent);return l==null&&(l=r),l}const i=n;let o=i.__getInstance(t);if(o==null){const l=Te({},e);"__i18n"in a&&(l.__i18n=a.__i18n),r&&(l.__root=r),o=$r(l),i.__composerExtend&&(o[br]=i.__composerExtend(o)),g0(i,t,o),i.__setInstance(t,o)}return o}function u0(e,t,n){const r=Mi();{const a=__VUE_I18N_LEGACY_API__&&t?r.run(()=>yr(e)):r.run(()=>$r(e));if(a==null)throw Ae(Ie.UNEXPECTED_ERROR);return[r,a]}}function d0(e){{const t=Ut(e.isCE?l0:e.appContext.app.__VUE_I18N_SYMBOL__);if(!t)throw Ae(e.isCE?Ie.NOT_INSTALLED_WITH_PROVIDE:Ie.UNEXPECTED_ERROR);return t}}function m0(e,t){return xn(e)?"__i18n"in t?"local":"global":e.useScope?e.useScope:"local"}function p0(e){return e.mode==="composition"?e.global:e.global.__composer}function f0(e,t,n=!1){let r=null;const a=t.root;let s=h0(t,n);for(;s!=null;){const i=e;if(e.mode==="composition")r=i.__getInstance(s);else if(__VUE_I18N_LEGACY_API__){const o=i.__getInstance(s);o!=null&&(r=o.__composer,n&&r&&!r[ii]&&(r=null))}if(r!=null||a===s)break;s=s.parent}return r}function h0(e,t=!1){return e==null?null:t&&e.vnode.ctx||e.parent}function g0(e,t,n){We(()=>{},t),An(()=>{const r=n;e.__deleteInstance(t);const a=r[br];a&&(a(),delete r[br])},t)}function v0(e,t,n,r={}){const a=t==="local",s=Tn(null);if(a&&e.proxy&&!(e.proxy.$options.i18n||e.proxy.$options.__i18n))throw Ae(Ie.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);const i=ae(r.inheritLocale)?r.inheritLocale:!H(r.locale),o=z(!a||i?n.locale.value:H(r.locale)?r.locale:Dt),l=z(!a||i?n.fallbackLocale.value:H(r.fallbackLocale)||ve(r.fallbackLocale)||te(r.fallbackLocale)||r.fallbackLocale===!1?r.fallbackLocale:o.value),c=z(Un(o.value,r)),u=z(te(r.datetimeFormats)?r.datetimeFormats:{[o.value]:{}}),m=z(te(r.numberFormats)?r.numberFormats:{[o.value]:{}}),d=a?n.missingWarn:ae(r.missingWarn)||pt(r.missingWarn)?r.missingWarn:!0,v=a?n.fallbackWarn:ae(r.fallbackWarn)||pt(r.fallbackWarn)?r.fallbackWarn:!0,E=a?n.fallbackRoot:ae(r.fallbackRoot)?r.fallbackRoot:!0,_=!!r.fallbackFormat,b=he(r.missing)?r.missing:null,M=he(r.postTranslation)?r.postTranslation:null,W=a?n.warnHtmlMessage:ae(r.warnHtmlMessage)?r.warnHtmlMessage:!0,y=!!r.escapeParameter,L=a?n.modifiers:te(r.modifiers)?r.modifiers:{},T=r.pluralRules||a&&n.pluralRules;function I(){return[o.value,l.value,c.value,u.value,m.value]}const R=U({get:()=>s.value?s.value.locale.value:o.value,set:F=>{s.value&&(s.value.locale.value=F),o.value=F}}),x=U({get:()=>s.value?s.value.fallbackLocale.value:l.value,set:F=>{s.value&&(s.value.fallbackLocale.value=F),l.value=F}}),$=U(()=>s.value?s.value.messages.value:c.value),me=U(()=>u.value),we=U(()=>m.value);function Z(){return s.value?s.value.getPostTranslationHandler():M}function D(F){s.value&&s.value.setPostTranslationHandler(F)}function re(){return s.value?s.value.getMissingHandler():b}function Ee(F){s.value&&s.value.setMissingHandler(F)}function Oe(F){return I(),F()}function _e(...F){return s.value?Oe(()=>Reflect.apply(s.value.t,null,[...F])):Oe(()=>"")}function De(...F){return s.value?Reflect.apply(s.value.rt,null,[...F]):""}function Ze(...F){return s.value?Oe(()=>Reflect.apply(s.value.d,null,[...F])):Oe(()=>"")}function be(...F){return s.value?Oe(()=>Reflect.apply(s.value.n,null,[...F])):Oe(()=>"")}function Le(F){return s.value?s.value.tm(F):{}}function Ve(F,ce){return s.value?s.value.te(F,ce):!1}function j(F){return s.value?s.value.getLocaleMessage(F):{}}function le(F,ce){s.value&&(s.value.setLocaleMessage(F,ce),c.value[F]=ce)}function oe(F,ce){s.value&&s.value.mergeLocaleMessage(F,ce)}function pe(F){return s.value?s.value.getDateTimeFormat(F):{}}function $e(F,ce){s.value&&(s.value.setDateTimeFormat(F,ce),u.value[F]=ce)}function je(F,ce){s.value&&s.value.mergeDateTimeFormat(F,ce)}function bt(F){return s.value?s.value.getNumberFormat(F):{}}function lt(F,ce){s.value&&(s.value.setNumberFormat(F,ce),m.value[F]=ce)}function Kt(F,ce){s.value&&s.value.mergeNumberFormat(F,ce)}const Gt={get id(){return s.value?s.value.id:-1},locale:R,fallbackLocale:x,messages:$,datetimeFormats:me,numberFormats:we,get inheritLocale(){return s.value?s.value.inheritLocale:i},set inheritLocale(F){s.value&&(s.value.inheritLocale=F)},get availableLocales(){return s.value?s.value.availableLocales:Object.keys(c.value)},get modifiers(){return s.value?s.value.modifiers:L},get pluralRules(){return s.value?s.value.pluralRules:T},get isGlobal(){return s.value?s.value.isGlobal:!1},get missingWarn(){return s.value?s.value.missingWarn:d},set missingWarn(F){s.value&&(s.value.missingWarn=F)},get fallbackWarn(){return s.value?s.value.fallbackWarn:v},set fallbackWarn(F){s.value&&(s.value.missingWarn=F)},get fallbackRoot(){return s.value?s.value.fallbackRoot:E},set fallbackRoot(F){s.value&&(s.value.fallbackRoot=F)},get fallbackFormat(){return s.value?s.value.fallbackFormat:_},set fallbackFormat(F){s.value&&(s.value.fallbackFormat=F)},get warnHtmlMessage(){return s.value?s.value.warnHtmlMessage:W},set warnHtmlMessage(F){s.value&&(s.value.warnHtmlMessage=F)},get escapeParameter(){return s.value?s.value.escapeParameter:y},set escapeParameter(F){s.value&&(s.value.escapeParameter=F)},t:_e,getPostTranslationHandler:Z,setPostTranslationHandler:D,getMissingHandler:re,setMissingHandler:Ee,rt:De,d:Ze,n:be,tm:Le,te:Ve,getLocaleMessage:j,setLocaleMessage:le,mergeLocaleMessage:oe,getDateTimeFormat:pe,setDateTimeFormat:$e,mergeDateTimeFormat:je,getNumberFormat:bt,setNumberFormat:lt,mergeNumberFormat:Kt};function Yt(F){F.locale.value=o.value,F.fallbackLocale.value=l.value,Object.keys(c.value).forEach(ce=>{F.mergeLocaleMessage(ce,c.value[ce])}),Object.keys(u.value).forEach(ce=>{F.mergeDateTimeFormat(ce,u.value[ce])}),Object.keys(m.value).forEach(ce=>{F.mergeNumberFormat(ce,m.value[ce])}),F.escapeParameter=y,F.fallbackFormat=_,F.fallbackRoot=E,F.fallbackWarn=v,F.missingWarn=d,F.warnHtmlMessage=W}return Pi(()=>{if(e.proxy==null||e.proxy.$i18n==null)throw Ae(Ie.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);const F=s.value=e.proxy.$i18n.__composer;t==="global"?(o.value=F.locale.value,l.value=F.fallbackLocale.value,c.value=F.messages.value,u.value=F.datetimeFormats.value,m.value=F.numberFormats.value):a&&Yt(F)}),Gt}const _0=["locale","fallbackLocale","availableLocales"],js=["t","rt","d","n","tm","te"];function b0(e,t){const n=Object.create(null);return _0.forEach(a=>{const s=Object.getOwnPropertyDescriptor(t,a);if(!s)throw Ae(Ie.UNEXPECTED_ERROR);const i=Ri(s.value)?{get(){return s.value.value},set(o){s.value.value=o}}:{get(){return s.get&&s.get()}};Object.defineProperty(n,a,i)}),e.config.globalProperties.$i18n=n,js.forEach(a=>{const s=Object.getOwnPropertyDescriptor(t,a);if(!s||!s.value)throw Ae(Ie.UNEXPECTED_ERROR);Object.defineProperty(e.config.globalProperties,`$${a}`,s)}),()=>{delete e.config.globalProperties.$i18n,js.forEach(a=>{delete e.config.globalProperties[`$${a}`]})}}Xh();__INTLIFY_JIT_COMPILATION__?Ls(Wh):Ls(Bh);Ph(fh);Rh(Ka);if(__INTLIFY_PROD_DEVTOOLS__){const e=st();e.__INTLIFY__=!0,Lh(e.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__)}const di=()=>{const e=Ut("$env"),{t,locale:n}=Hn();return{locale:n,$env:e,t}},y0={class:"text-slate-600 text-base mt-2"},k0={class:"flex flex-row justify-start items-start mt-4"},w0={class:"relative h-14"},L0=["label","status"],E0={key:0,class:"absolute bottom-0 left-0 text-sm text-[#ff4d4f]"},S0={class:"text-[#3451b2] text-base"},O0=V({__name:"TOTP",setup(e){const{t,$env:n,locale:r}=di(),a=z(""),s=z(Tt.NORMAL),i=z(""),o=z({code:"",expires:""}),l=u=>{a.value=u.detail.value,s.value=Tt.NORMAL},c=()=>{if(a.value.length<=0)i.value=t("components_totp_3"),s.value=Tt.ERROR;else try{const{otp:u,expires:m}=lf.generate(a.value);o.value.code=u,o.value.expires=df(m).format()}catch{i.value=t("components_totp_5"),s.value=Tt.ERROR}};return(u,m)=>(h(),C("div",null,[w("div",y0,se(g(t)("components_totp_6")),1),w("div",k0,[w("div",w0,[w("r-input",{label:g(t)("components_totp_2"),class:"w-64 h-8 rounded-lg block text-lg",status:s.value,onInput:l},null,40,L0),s.value===g(Tt).ERROR?(h(),C("div",E0,se(i.value),1)):G("",!0)]),w("r-button",{class:"ml-1 h-8",onClick:c},se(g(t)("components_totp_1")),1)]),w("div",S0,[w("div",null,"code: "+se(o.value.code),1),w("div",null,se(g(t)("components_totp_4"))+": "+se(o.value.expires),1)])]))}}),mi=dr.locale,Rt=c0({legacy:!1,locale:mi,fallbackLocale:ln.EN,messages:vf,devtools:!1}),qn=e=>(Rt.mode===xa.LEGACY?Rt.global.locale=e:Rt.global.locale.value=e,e),C0=(e,t=mi)=>{Rt.global.mergeLocaleMessage(t,e)},pi=e=>e?Rt.global.locale===e||cs.includes(e)?Promise.resolve(qn(e)):Fi(Object.assign({"./en.json":()=>yn(()=>import("./en.Bkn4-Vvy.js"),[]),"./zh-CN.json":()=>yn(()=>import("./zh-CN.PUkQxDBJ.js"),[])}),`./${e}.json`,2).then(t=>(C0(t.default,e),cs.push(e),qn(e))):Promise.reject("lang is undefined"),I0=V({__name:"Layout",setup(e){const{$env:t,locale:n}=di(),{lang:r}=vn(),a=()=>{const s=r.value||ln.EN;n.value=s,t.locale=s,pi(s).catch(i=>{console.log("error",i)}),cf(Fa,s)};return ft(()=>{a()}),We(()=>{ff()}),(s,i)=>(h(),X(g(ya).Layout))}}),A0=()=>{yn(()=>import("./pwa-install.es.m5I_sFSJ.js"),[]).then(()=>{let e=document.getElementById(us);e||(e=document.createElement(_f),e.setAttribute("manifest-url",bf),e.setAttribute("id",us),document.body.appendChild(e))})},x0={extends:ya,enhanceApp({app:e,router:t,siteData:n}){yn(()=>import("./index.Dk0BAPAJ.js").then(a=>a.i),__vite__mapDeps([0,1])),A0(),e.use(kf);const r=uf(Fa)||ln.EN;pi(r).then(()=>{pf("__VUE_PROD_DEVTOOLS__",!1),e.use(Rt),e.component("Layout",I0),e.component("TOTP",O0)}).catch(a=>{console.log("error",a)})}};export{x0 as R};
