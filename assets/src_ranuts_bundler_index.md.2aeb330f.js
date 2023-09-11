import{_ as n,o as s,c as a,N as e}from"./chunks/framework.6fe2e870.js";const l="/ran/assets/bundle.9ebe4911.png",m=JSON.parse('{"title":"Bundler","description":"","frontmatter":{},"headers":[],"relativePath":"src/ranuts/bundler/index.md","lastUpdated":1694423419000}'),t={name:"src/ranuts/bundler/index.md"},p=e(`<h1 id="bundler" tabindex="-1">Bundler <a class="header-anchor" href="#bundler" aria-label="Permalink to &quot;Bundler&quot;">​</a></h1><p><code>Bundler</code>的使用： 传入 options 参数</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">function build(options: Options):Promise&lt;Build&gt; {</span></span>
<span class="line"><span style="color:#babed8;">  const bundle = new Bundle({</span></span>
<span class="line"><span style="color:#babed8;">    entry: options.input</span></span>
<span class="line"><span style="color:#babed8;">  });</span></span>
<span class="line"><span style="color:#babed8;">  return bundle.build().then(() =&gt; {</span></span>
<span class="line"><span style="color:#babed8;">    return {</span></span>
<span class="line"><span style="color:#babed8;">      generate: () =&gt; bundle.render()</span></span>
<span class="line"><span style="color:#babed8;">    };</span></span>
<span class="line"><span style="color:#babed8;">  });</span></span>
<span class="line"><span style="color:#babed8;">}</span></span></code></pre></div><p>架构图</p><p><img src="`+l+'" alt=""></p>',5),o=[p];function r(c,d,i,b,u,_){return s(),a("div",null,o)}const y=n(t,[["render",r]]);export{m as __pageData,y as default};
