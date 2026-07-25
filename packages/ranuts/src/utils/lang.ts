import { isClient } from './device';

/** 粗粒度语言桶：只区分中文 / 英文 / 其他 */
export type TextLanguage = 'zh' | 'en' | 'other';

/**
 * @description: 按 CJK / 拉丁字符占比判定一段文本的主语言。纯统计，不加载任何模型或词典，
 * 适合「选哪套分词规则 / 哪个语言专属模型 / 哪种排版度量」这类分支判断。
 *
 * 只采样开头若干字符——正文语言在全文是一致的，扫全文（一本书上百万字）纯属浪费。
 * 夹杂少量 CJK 的仍判中文（拉丁明显占多才判英文），因为中文文本里混英文很常见，
 * 反过来则少见。
 *
 * @param {string} text 待检测文本
 * @param {number} sampleSize 采样长度，默认 20000
 * @return {TextLanguage}
 */
export const detectLanguage = (text: string, sampleSize = 20000): TextLanguage => {
  const sample = text.slice(0, sampleSize);
  let cjk = 0;
  let latin = 0;
  for (const ch of sample) {
    const c = ch.codePointAt(0) ?? 0;
    // CJK 统一表意文字（含扩展 A 常用区）
    if ((c >= 0x4e00 && c <= 0x9fff) || (c >= 0x3400 && c <= 0x4dbf)) {
      cjk++;
    } else if ((c >= 0x41 && c <= 0x5a) || (c >= 0x61 && c <= 0x7a)) {
      latin++;
    }
  }
  if (cjk === 0 && latin === 0) return 'other';
  if (cjk >= latin) return 'zh';
  return latin > cjk * 3 ? 'en' : 'zh';
};

/**
 * @description: 浏览器 UI 语言映射到同一套语言桶（无内容可检测时的默认值）。SSR 返回 'other'。
 * @return {TextLanguage}
 */
export const navigatorLanguage = (): TextLanguage => {
  if (!isClient) return 'other';
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  return 'other';
};
