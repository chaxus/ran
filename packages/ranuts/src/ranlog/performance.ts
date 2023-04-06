
interface BasicType {
    [x:string]: number | undefined
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
    if(typeof window !== 'undefined'){
    const [performanceNavigationTiming] = performance.getEntriesByType('navigation')
    const [firstPaint = {}, firstContentfulPaint = {}] = performance.getEntriesByType('paint')
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
        redirectCount
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
