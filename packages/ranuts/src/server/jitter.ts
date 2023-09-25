interface Options {
  url?: string; // 请求地址
  duration?: number; // 请求的间隔
  count?: number; // 请求的次数
}

interface ReturnType {
  ping: number;
  jitter: number;
}

/**
 * @description: 图片请求
 * @param {string} url
 * @return {Promise<ImageLoadError | number>}
 */
const imageRequest = (url?: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const startTime = new Date().getTime();
    // 此处选择加载 github 的 favicon，大小为2.2kB
    img.src = url ? url : `https://github.com/favicon.ico?d=${startTime}`;
    img.onload = () => {
      const endTime = new Date().getTime();
      const delta = endTime - startTime;
      resolve(delta);
    };
    img.onerror = (err) => {
      console.log('error', err);
      reject(err);
    };
  });
};

/**
 * @description: 间隔一定时间，执行指定的函数
 * @param {HandlerFunction} handler
 * @param {array} params
 */
const durationHandler =
  <T, U>(
    handler: (...args: T[]) => U,
    ...params: T[]
  ): ((a: number) => Promise<U>) =>
  (duration: number): Promise<U> =>
    new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const result = await handler(...params);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, duration);
    });

/**
 * @description: 通过请求来测试当前网络的ping值
 * @param {*} options
 */
const networkSpeed = async (options: Options): Promise<ReturnType> => {
  const { url, duration = 3000, count = 5 } = options;
  // 抖动，用来描述网络的波动情况。比如每秒测量一次 ping 值，5s 后取五次测量结果的最大最小值求差，可以看出网络的波动情况，差值越小代表网络越稳定；
  let jitter = 0;
  // 平均的ping值
  let ping = 0;
  // ping值的数组
  const pingList: Array<number> = [];
  for (let i = 0; i < count; i++) {
    const handler = durationHandler(imageRequest, url);
    const delta = await handler(duration);
    pingList.push(delta);
  }
  const maxPing = Math.max(...pingList);
  const minPing = Math.min(...pingList);
  jitter = maxPing - minPing;
  ping = pingList.reduce((a, b) => a + b) / pingList.length;
  return { ping, jitter };
};

export default networkSpeed;
