/**
 * @description: 判断当前设备
 * @param {*} function
 * @return {*}
 */

type JudgeDeviceReturn = "ipad" | "android" | "iphone" | "pc";
export const currentDevice = (): JudgeDeviceReturn => {
  if (typeof window !== "undefined") {
    const ua = navigator.userAgent.toLowerCase();
    if (/ipad|ipod/.test(ua)) return "ipad";
    if (/android/.test(ua)) return "android";
    if (/iphone/.test(ua)) return "iphone";
    return "pc";
  }
  return "pc";
};

export const isClient = typeof window !== "undefined";

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
    return ua.includes("micromessenger");
  }
  return false;
};

/**
 * 是否是移动端
 */
export const isMobile = (): boolean => {
  if(!isClient) return false
  const ua = window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(ua)) {
    return true;
  }
  return false;
};

// 判断是否是刘海屏机型
export const isBangDevice = (): boolean => {
  if(!isClient) return false
  const iphone = /iphone/gi.test(window.navigator.userAgent); // 是否 iphone 机型
  const ratio2 = window.devicePixelRatio && window.devicePixelRatio === 2; // 像素比是否为 2
  const ratio3 = window.devicePixelRatio && window.devicePixelRatio === 3; // 像素比是否为 3

  const mini12 = window.screen.width === 360 && window.screen.height === 780; // 12mini
  const pro11 = window.screen.width === 375 && window.screen.height === 812; // X Xs 11pro
  const pro12 = window.screen.width === 390 && window.screen.height === 844; // 12 12pro
  const promax11 = window.screen.width === 414 && window.screen.height === 896; // Xsm XR 11 11promax
  const promax12 = window.screen.width === 428 && window.screen.height === 926; // 12promax

  switch (true) {
    case iphone && ratio3 && mini12: // 12 mini
    case iphone && ratio3 && pro11: // X Xs 11pro
    case iphone && ratio3 && pro12: // 12 12pro
    case iphone && ratio2 && promax11: // XR 11
    case iphone && ratio3 && promax11: // Xsm 11promax
    case iphone && ratio3 && promax12: // 12promax
      return true;
    default:
      return false;
  }
};
