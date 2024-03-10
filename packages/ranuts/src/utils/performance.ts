// 首屏加载时间First Contentful Paint（FCP）：首次内容绘制时间，指浏览器首次绘制页面中至少一个文本、
// 图像、非白色背景色的canvas/svg元素等的时间，代表页面首屏加载的时间点。

// 首次绘制时间First Paint（FP）：首次绘制时间，指浏览器首次在屏幕上渲染像素的时间，代表页面开始渲染的时间点。(白屏时间）

// 最大内容绘制时间Largest Contentful Paint（LCP）：最大内容绘制时间，指页面上最大的可见元素（文本、图像、视频等）绘制完成的时间，
// 代表用户视觉上感知到页面加载完成的时间点。

// 用户可交互时间Time to Interactive（TTI）：可交互时间，指页面加载完成并且用户能够与页面进行交互的时间，代表用户可以开始操作页面的时间点。

// 页面总阻塞时间Total Blocking Time (TBT)：页面上出现阻塞的时间，指在页面变得完全交互之前，用户与页面上的元素交互时出现阻塞的时间。
// TBT应该尽可能小，通常应该在300毫秒以内。

// 搜索引擎优化Search Engine Optimization (SEO)：网站在搜索引擎中的排名和可见性。评分范围从0到100，100分表示网站符合所有SEO最佳实践。

// TTFB指代从资源的请求到响应第一个字节的时间跨度。

// DCL (DOMContentLoaded)
// DCL指代当HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式，图像和子框架的完成加载的时间。
interface BasicType {
  [x: string]: number | undefined;
  dnsSearch: number; // DNS 解析耗时
  tcpConnect: number; // TCP 连接耗时
  sslConnect: number; // SSL安全连接耗时
  request: number; // TTFB 网络请求耗时
  response: number; // 数据传输耗时
  parseDomTree: number; // DOM 解析耗时
  resource: number; // 资源加载耗时
  domReady: number; // DOM Ready
  httpHead: number; // http 头部大小
  interactive: number; // 首次可交互时间
  complete: number; // 页面完全加载
  redirect: number; // 重定向次数
  redirectTime: number; // 重定向耗时
  duration: number; // 资源请求的总耗时 responseEnd-startTime
  fp: number | undefined; // 渲染出第一个像素点，白屏时间
  fcp: number | undefined; // 渲染出第一个内容，首屏结束时间
}

export function getPerformance(): BasicType | undefined {
  if (typeof window !== 'undefined') {
    const [performanceNavigationTiming] = performance.getEntriesByType('navigation');
    const [firstPaint = {}, firstContentfulPaint = {}] = performance.getEntriesByType('paint');
    const { startTime: fp } = firstPaint as PerformancePaintTiming;
    // First Contentful paint
    const { startTime: fcp } = firstContentfulPaint as PerformancePaintTiming;
    const {
      domainLookupEnd,
      domainLookupStart,
      connectEnd,
      connectStart,
      secureConnectionStart,
      loadEventStart,
      domInteractive,
      domContentLoadedEventEnd,
      duration,
      responseStart,
      requestStart,
      responseEnd,
      fetchStart,
      transferSize,
      encodedBodySize,
      redirectEnd,
      redirectStart,
      redirectCount,
    } = performanceNavigationTiming as PerformanceNavigationTiming;
    return {
      dnsSearch: domainLookupEnd - domainLookupStart,
      tcpConnect: connectEnd - connectStart,
      sslConnect: connectEnd - secureConnectionStart,
      request: responseStart - requestStart,
      response: responseEnd - responseStart,
      parseDomTree: domInteractive - responseEnd,
      resource: loadEventStart - domContentLoadedEventEnd,
      domReady: domContentLoadedEventEnd - fetchStart,
      interactive: domInteractive - fetchStart,
      complete: loadEventStart - fetchStart,
      httpHead: transferSize - encodedBodySize,
      redirect: redirectCount,
      redirectTime: redirectEnd - redirectStart,
      duration,
      fp,
      fcp,
    };
  }
}
