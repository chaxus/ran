import{_ as n,o as s,c as a,N as e}from"./chunks/framework.6fe2e870.js";const l="/ran/assets/bundle.9ebe4911.png",b=JSON.parse('{"title":"Bundler","description":"","frontmatter":{},"headers":[],"relativePath":"src/ranuts/bundler/index.md","lastUpdated":1691839446000}'),t={name:"src/ranuts/bundler/index.md"},p=e(`<h1 id="bundler" tabindex="-1">Bundler <a class="header-anchor" href="#bundler" aria-label="Permalink to &quot;Bundler&quot;">​</a></h1><p><code>Bundler</code>的使用： 传入 options 参数</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">function build(options: Options):Promise&lt;Build&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">  const bundle = new Bundle({</span></span>
<span class="line"><span style="color:#A6ACCD;">    entry: options.input</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">  return bundle.build().then(() =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    return {</span></span>
<span class="line"><span style="color:#A6ACCD;">      generate: () =&gt; bundle.render()</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span></code></pre></div><p>架构图</p><p><img src="`+l+'" alt=""></p>',5),o=[p];function r(c,i,d,u,_,C){return s(),a("div",null,o)}const h=n(t,[["render",r]]);export{b as __pageData,h as default};
