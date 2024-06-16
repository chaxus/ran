function formatDuration(time: number): string | number {
  return time < 10 ? `0${time}` : time;
}
/**
 * @description: 时间戳转日期
 * @param {*} timestamp
 * @param {*} returnType
 * @return {*}
 */
export function timestampToTime(timestamp?: number | string): Date & { format?: Function } {
  let date = new Date();
  if (timestamp) {
    date = new Date(timestamp);
  }
  (date as Date & { format?: Function }).format = (format = 'YYYY-MM-DD HH:mm:ss'): string => {
    const year = date.getFullYear();
    const month = formatDuration(date.getMonth() + 1);
    const day = formatDuration(date.getDate());
    const hour = formatDuration(date.getHours());
    const minute = formatDuration(date.getMinutes());
    const second = formatDuration(date.getSeconds());
    return format
      .replace(/Y+/gi, `${year}`)
      .replace(/M+/g, `${month}`)
      .replace(/D+/gi, `${day}`)
      .replace(/H+/gi, `${hour}`)
      .replace(/m+/g, `${minute}`)
      .replace(/S+/gi, `${second}`);
  };
  return date;
}

/**
 * @description: 时间秒，转化成:分割的时间
 * @param {number} time
 * @return {*}
 */
export const timeFormat = (time: number): string => {
  if (time === 0) return '00:00';
  if (!time) return '';
  const hour = Math.trunc(time / 3600);
  const minute = Math.trunc((time % 3600) / 60);
  const second = formatDuration(Math.trunc(time - hour * 3600 - minute * 60));
  if (hour === 0) {
    return `${formatDuration(minute)}:${second}`;
  }
  return `${formatDuration(hour)}:${formatDuration(minute)}:${second}`;
};

/**
 * @description: 获取当前时间戳
 * @return {*}
 */
export const performanceTime = (): number => {
  if (typeof document !== 'undefined') {
    return performance.now();
  }
  if (typeof process !== 'undefined') {
    // process.hrtime.bigint()
    const [seconds, nanosecond] = process.hrtime();
    return seconds * 1000 + nanosecond / 1000000;
  }
  return Date.now();
};
