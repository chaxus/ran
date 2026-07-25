// First Contentful Paint (FCP): when the browser first paints any text, image, or
// non-white canvas/svg element — the moment the first screenful becomes visible.

// First Paint (FP): when the browser first renders any pixel — the end of the blank screen.

// Largest Contentful Paint (LCP): when the largest visible element (text, image, video)
// finishes painting — where the user perceives the page as loaded.

// Time to Interactive (TTI): when loading is done and the page can actually be used.

// Total Blocking Time (TBT): how long the main thread was blocked before the page became
// fully interactive. Keep it as low as possible — under 300 ms as a rule.

// Search Engine Optimization (SEO): ranking and visibility in search engines. Scored 0-100, where 100 means every SEO best practice is met.

// TTFB: the span from requesting a resource to the first byte of its response.

// DCL (DOMContentLoaded)
// DCL: when DOMContentLoaded fires — the HTML is fully loaded and parsed, without waiting for stylesheets, images or subframes.
interface BasicType {
  [x: string]: number | undefined;
  dnsSearch: number; // DNS lookup time
  tcpConnect: number; // TCP connect time
  sslConnect: number; // TLS handshake time
  request: number; // TTFB — request time
  response: number; // content transfer time
  parseDomTree: number; // DOM parse time
  resource: number; // resource load time
  domReady: number; // DOM Ready
  httpHead: number; // HTTP header size
  interactive: number; // time to first interactive
  complete: number; // page fully loaded
  redirect: number; // number of redirects
  redirectTime: number; // time spent redirecting
  duration: number; // total request time (responseEnd - startTime)
  fp: number | undefined; // first pixel painted — end of the blank screen
  fcp: number | undefined; // first content painted — first screenful complete
}

export function getPerformance(): BasicType | undefined {
  if (typeof window !== 'undefined') {
    const [performanceNavigationTiming] = performance.getEntriesByType('navigation');
    const [firstPaint = {}, firstContentfulPaint = {}] = performance.getEntriesByType('paint');
    const { startTime: fp } = firstPaint as PerformancePaintTiming;
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
      // DNS
      dnsSearch: domainLookupEnd - domainLookupStart,
      // TCP
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
      // redirect
      redirectTime: redirectEnd - redirectStart,
      duration,
      fp,
      fcp,
    };
  }
}
