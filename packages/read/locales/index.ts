import { toString } from 'ranuts/utils';
import zhCN from './zh-CN.json';
import zhHK from './zh-HK.json';
import en from './en.json';

export enum Locales {
  'zh-CN' = 'zh-CN',
  'zh-HK' = 'zh-HK',
  'en' = 'en',
}

export const resources: Record<string, { translation: Record<string, string> }> = {
  ['zh-CN']: { translation: zhCN },
  ['zh-HK']: { translation: zhHK },
  ['en']: { translation: en },
};
// 语言匹配函数
// 将语言代码转换为小写并分割成语言和地区部分
// 对于中文：
//   - 简体中文：zh-CN, zh-SG 等
//   - 繁体中文：zh-TW, zh-HK, zh-MO 等
// 对于英语（en），统一返回 en
// 其他语言默认返回英语
export const normalizeLanguage = (lang: string): Locales => {
  // 将语言代码转换为小写并分割
  const [language, region] = lang.toLowerCase().split('-');

  // 匹配中文
  if (language === 'zh') {
    // 繁体中文地区
    const traditionalRegions = ['tw', 'hk', 'mo'];

    if (region && traditionalRegions.includes(region)) {
      return Locales['zh-HK'];
    }
    return Locales['zh-CN'];
  }

  // 匹配英语
  if (language === 'en') {
    return Locales.en;
  }

  // 默认返回英语
  return Locales.en;
};

export const t = (key: string, params?: Array<string | number>): string => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const browserLang = navigator?.language || Locales.en;
  const lang = normalizeLanguage(browserLang);
  const text = resources[lang]?.translation[key] || '';
  if (params) {
    return text?.replace(/\{\{(\w+)\}\}/g, (match, p1) => toString(params[Number(p1)] || match));
  }
  return text;
};
