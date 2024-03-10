/**
 * @description: 判断当前设备
 * @param {*} function
 * @return {*}
 */

type JudgeDeviceReturn = 'ipad' | 'android' | 'iphone' | 'pc';
export const currentDevice = (): JudgeDeviceReturn => {
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (/ipad|ipod/.test(ua)) return 'ipad';
    if (/android/.test(ua)) return 'android';
    if (/iphone/.test(ua)) return 'iphone';
    return 'pc';
  }
  return 'pc';
};

export const isClient = typeof window !== 'undefined';

/**
 * @description: 判断是否是微信浏览器的函数
 * @param {*} boolean
 * @return {*}
 */
export const isWeiXin = (): boolean => {
  if (isClient) {
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    const ua = window.navigator.userAgent.toLowerCase();
    // alert(ua)
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    return ua.includes('micromessenger');
  }
  return false;
};

/**
 * 是否是移动端
 */
export const isMobile = (): boolean => {
  const ua = window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua)) {
    return true;
  }
  return false;
};
