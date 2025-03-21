import { currentDevice, isBangDevice, isMobile, isWeiXin } from 'ranuts/utils';
import type { App } from 'vue';
import type { CurrentDevice } from 'ranuts/utils';
import { LANGS_DICT } from '../lib/constant';

// env 信息
const isDev = process.env.NODE_ENV !== 'production';

// debug 开关信息
// const { debug = '' } = getAllQueryString() || {};

export interface Env {
  isDev: boolean;
  locale: LANGS_DICT | string;
  currentDevice: CurrentDevice;
  isWeiXin: boolean;
  isMobile: boolean;
  isBang: boolean;
}

export const $env: Env = {
  isDev,
  locale: LANGS_DICT.EN,
  currentDevice: currentDevice(),
  isWeiXin: isWeiXin(),
  isMobile: isMobile(),
  isBang: isBangDevice(), // 是否是刘海机型
  // theme: localStorage.getItem("ran-chaxus-theme")
};

export default {
  install: (app: App): void => {
    app.config.globalProperties.$env = $env;
    app.provide('$env', $env);
  },
};
