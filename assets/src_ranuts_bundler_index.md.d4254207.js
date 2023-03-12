import{_ as s,c as n,o as a,a as e}from"./app.30635d54.js";const l="/ran/assets/bundle.9ebe4911.png",b=JSON.parse('{"title":"Bundler","description":"","frontmatter":{},"headers":[],"relativePath":"src/ranuts/bundler/index.md","lastUpdated":1678636976000}'),p={name:"src/ranuts/bundler/index.md"},t=e(`<h1 id="bundler" tabindex="-1">Bundler <a class="header-anchor" href="#bundler" aria-hidden="true">#</a></h1><p><code>Bundler</code>\u7684\u4F7F\u7528\uFF1A \u4F20\u5165 options \u53C2\u6570</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki"><code><span class="line"><span style="color:#A6ACCD;">function build(options: Options):Promise&lt;Build&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">  const bundle = new Bundle({</span></span>
<span class="line"><span style="color:#A6ACCD;">    entry: options.input</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">  return bundle.build().then(() =&gt; {</span></span>
<span class="line"><span style="color:#A6ACCD;">    return {</span></span>
<span class="line"><span style="color:#A6ACCD;">      generate: () =&gt; bundle.render()</span></span>
<span class="line"><span style="color:#A6ACCD;">    };</span></span>
<span class="line"><span style="color:#A6ACCD;">  });</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>\u67B6\u6784\u56FE</p><p><img src="`+l+'" alt=""></p>',5),o=[t];function r(c,i,d,u,_,C){return a(),n("div",null,o)}const y=s(p,[["render",r]]);export{b as __pageData,y as default};
