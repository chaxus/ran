export enum INPUT_STATUS {
  NORMAL = 'normal',
  ERROR = 'error',
  WARNING = 'warning',
}
// 支持语言包字典
export enum LANGS_DICT {
  EN = 'en', // 英文
  ZH_CN = 'zh-CN', // 简体中文
}
// localStorage 中的多语言标识
export const RAN_CHAXUS_LANG = 'ran_chaxus_lang';

export const LOADED_LOCALES = [];

export const LANG_MESSAGES = {
  'zh-CN': {
    lang: '简体中文',
  },
  en: {
    lang: 'English',
  },
};

export enum I18N_MODE {
  LEGACY = 'legacy',
}
