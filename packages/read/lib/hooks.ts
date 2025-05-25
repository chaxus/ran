import { useEffect, useState } from 'react';

export enum DEVICE_ENUM {
  UNKNOWN = 'unknown',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}
// 检测当前设备
export const useCheckDevice = (): [DEVICE_ENUM] => {
  const [currentDevice, setCurrentDevice] = useState<DEVICE_ENUM>(DEVICE_ENUM.UNKNOWN);
  const checkDevice = () => {
    // 使用 matchMedia 检查是否是移动设备
    const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
    if (isMobileDevice) {
      setCurrentDevice(DEVICE_ENUM.MOBILE);
    }
    const isDesktopDevice = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktopDevice) {
      setCurrentDevice(DEVICE_ENUM.DESKTOP);
    }
  };

  useEffect(() => {
    // 初始检查
    checkDevice();
    // 监听窗口大小变化
    window.addEventListener('resize', checkDevice);
    // 清理监听器
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return [currentDevice];
};
