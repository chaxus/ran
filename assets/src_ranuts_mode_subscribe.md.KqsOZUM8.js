import{_ as s,o as n,c as a,R as l}from"./chunks/framework.iU_ih-rH.js";const b=JSON.parse('{"title":"EventEmitter","description":"","frontmatter":{},"headers":[],"relativePath":"src/ranuts/mode/subscribe.md","filePath":"src/ranuts/mode/subscribe.md","lastUpdated":1704205712000}'),p={name:"src/ranuts/mode/subscribe.md"},o=l(`<h1 id="eventemitter" tabindex="-1">EventEmitter <a class="header-anchor" href="#eventemitter" aria-label="Permalink to &quot;EventEmitter&quot;">​</a></h1><p>发布订阅的类</p><h2 id="class" tabindex="-1">Class <a class="header-anchor" href="#class" aria-label="Permalink to &quot;Class&quot;">​</a></h2><h3 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to &quot;Methods&quot;">​</a></h3><table><thead><tr><th>方法</th><th>参数</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>on</td><td>订阅事件</td><td>订阅事件，传入参数事件名，回调函数</td><td>无</td></tr><tr><td>once</td><td>订阅一次事件，传入参数事件名，回调函数</td><td>订阅一次事件，触发一次后不再会触发</td><td>无</td></tr><tr><td>off</td><td>取消订阅事件，传入参数事件名，回调函数</td><td>取消订阅事件</td><td>无</td></tr><tr><td>emit</td><td>触发事件，需要事件名</td><td>触发事件</td><td>无</td></tr></tbody></table><h2 id="example" tabindex="-1">Example <a class="header-anchor" href="#example" aria-label="Permalink to &quot;Example&quot;">​</a></h2><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Subscribe } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;ranuts&#39;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">subscribe</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Subscribe</span><span style="color:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件1</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件2</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件3</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">eventThree</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">3</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">};</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, eventThree);</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件4，需要传递参数</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">on</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, (</span><span style="color:#FFAB70;">num</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(num);</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 触发事件，同时传参数</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">emit</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">4</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#6A737D;">// console.log(1) console.log(2) console.log(3) console.log(4)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 取消事件三</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">off</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;event&#39;</span><span style="color:#E1E4E8;">, eventThree);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 订阅一次，触发一次自动取消</span></span>
<span class="line"><span style="color:#E1E4E8;">subscribe.</span><span style="color:#B392F0;">once</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;other&#39;</span><span style="color:#E1E4E8;">, () </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  console.</span><span style="color:#B392F0;">log</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">5</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">});</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Subscribe } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;ranuts&#39;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">subscribe</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Subscribe</span><span style="color:#24292E;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件1</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件2</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件3</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">eventThree</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">3</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">};</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, eventThree);</span></span>
<span class="line"><span style="color:#6A737D;">// 订阅事件4，需要传递参数</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">on</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, (</span><span style="color:#E36209;">num</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(num);</span></span>
<span class="line"><span style="color:#24292E;">});</span></span>
<span class="line"><span style="color:#6A737D;">// 触发事件，同时传参数</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">emit</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">4</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#6A737D;">// console.log(1) console.log(2) console.log(3) console.log(4)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 取消事件三</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">off</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;event&#39;</span><span style="color:#24292E;">, eventThree);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 订阅一次，触发一次自动取消</span></span>
<span class="line"><span style="color:#24292E;">subscribe.</span><span style="color:#6F42C1;">once</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;other&#39;</span><span style="color:#24292E;">, () </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  console.</span><span style="color:#6F42C1;">log</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">});</span></span></code></pre></div>`,7),e=[o];function t(c,r,E,y,i,d){return n(),a("div",null,e)}const h=s(p,[["render",t]]);export{b as __pageData,h as default};
