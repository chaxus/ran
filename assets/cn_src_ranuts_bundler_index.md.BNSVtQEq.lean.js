import{_ as s}from"./chunks/bundle.BxrzsuA1.js";import{_ as a,c as e,a8 as p,o as t}from"./chunks/framework.BV76-6_x.js";const h=JSON.parse('{"title":"Bundler","description":"","frontmatter":{},"headers":[],"relativePath":"cn/src/ranuts/bundler/index.md","filePath":"cn/src/ranuts/bundler/index.md","lastUpdated":1733105545000}'),l={name:"cn/src/ranuts/bundler/index.md"};function r(i,n,d,o,c,u){return t(),e("div",null,n[0]||(n[0]=[p(`<h1 id="bundler" tabindex="-1">Bundler <a class="header-anchor" href="#bundler" aria-label="Permalink to &quot;Bundler&quot;">​</a></h1><p><code>Bundler</code>的使用： 传入 options 参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>function build(options: Options):Promise&lt;Build&gt; {</span></span>
<span class="line"><span>  const bundle = new Bundle({</span></span>
<span class="line"><span>    entry: options.input</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>  return bundle.build().then(() =&gt; {</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>      generate: () =&gt; bundle.render()</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>  });</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>架构图</p><p><img src="`+s+'" alt=""></p>',5)]))}const g=a(l,[["render",r]]);export{h as __pageData,g as default};