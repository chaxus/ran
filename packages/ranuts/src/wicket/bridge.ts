// 需要实现两个类，Platform 和 Client
// Platform 是父容器，Client 是在父容器中的子容器
// 其中通信需要实现一对一的通信，和广播的通信方式
// 同时支持 worker 的通信方式

// Platform
// 一对一通信
// 发送信息
export const sendMessage = (message: string, target = '*'): void => {
  window.postMessage(message, target);
};
// 接收信息
export const receiveMessage = (callback: (message: string) => void): void => {
  window.addEventListener('message', (event) => {
    callback(event.data);
  });
};
// 广播通信
// 发送信息
export const broadcastMessage = (message: string): void => {
  window.postMessage(message, '*');
};
// 接收信息
export const receiveBroadcastMessage = (callback: (message: string) => void): void => {
  window.addEventListener('message', (event) => {
    callback(event.data);
  });
};
