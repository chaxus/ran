import{_ as n}from"./chunks/bundle.BxrzsuA1.js";import{_ as s,o as a,c as e,a6 as p}from"./chunks/framework.BZEwi-oL.js";const g=JSON.parse('{"title":"Bundler","description":"","frontmatter":{},"headers":[],"relativePath":"src/ranuts/bundler/index.md","filePath":"src/ranuts/bundler/index.md","lastUpdated":1718767210000}'),t={name:"src/ranuts/bundler/index.md"},l=p(`<h1 id="bundler" tabindex="-1">Bundler <a class="header-anchor" href="#bundler" aria-label="Permalink to &quot;Bundler&quot;">​</a></h1><p><code>Bundler</code>的使用： 传入 options 参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function build(options: Options):Promise&lt;Build&gt; {</span></span>
<span class="line"><span>  const bundle = new Bundle({</span></span>
<span class="line"><span>    entry: options.input</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  return bundle.build().then(() =&gt; {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      generate: () =&gt; bundle.render()</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>架构图</p><p><img src="`+n+'" alt=""></p>',5),i=[l];function r(d,o,c,u,_,h){return a(),e("div",null,i)}const f=s(t,[["render",r]]);export{g as __pageData,f as default};
