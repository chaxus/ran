/**
 * @description: 返回当前网络状态，当前吞吐量，是否切换网络
 */
const connect = () => {
  if (typeof window !== 'undefined') {
    return (window.navigator as any).connection;
  }
};
