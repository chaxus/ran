/** Coarse language bucket: Chinese / English / other only */
export type TextLanguage = 'zh' | 'en' | 'other';

/**
 * @description: Decide a text's primary language from the ratio of CJK to Latin characters.
 * Pure statistics, no model or dictionary loaded — good enough to branch on "which
 * tokenizer / which language-specific model / which typographic metrics".
 *
 * Only the first N characters are sampled: the body language is consistent throughout, so
 * scanning a whole book (millions of characters) is pure waste. Text with a little CJK still
 * counts as Chinese (Latin has to clearly dominate for English), because English mixed into
 * Chinese text is common while the reverse is rare.
 *
 * @param {string} text text to inspect
 * @param {number} sampleSize sample length, defaults to 20000
 * @return {TextLanguage}
 */
export const detectLanguage = (text: string, sampleSize = 20000): TextLanguage => {
  const sample = text.slice(0, sampleSize);
  let cjk = 0;
  let latin = 0;
  for (const ch of sample) {
    const c = ch.codePointAt(0) ?? 0;
    // CJK Unified Ideographs (including the commonly used Extension A block)
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
 * @description: Map the browser UI language into the same buckets (the default when there is
 * no content to inspect). Returns 'other' under SSR.
 * @return {TextLanguage}
 */
export const navigatorLanguage = (): TextLanguage => {
  if (typeof navigator === 'undefined') return 'other';
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('en')) return 'en';
  return 'other';
};
