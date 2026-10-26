import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-markdown`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const markdownText = defineText({
  en: {
    'markdown.copy': 'Copy code',
    'markdown.copyError': 'Could not copy. Try again.',
    'markdown.download': 'Download',
  },
  zh: {
    'markdown.copy': '复制代码',
    'markdown.copyError': '复制失败，请重试。',
    'markdown.download': '下载',
  },
  ja: {
    'markdown.copy': 'コードをコピー',
    'markdown.copyError': 'コピーできませんでした。もう一度お試しください。',
    'markdown.download': 'ダウンロード',
  },
  ko: {
    'markdown.copy': '코드 복사',
    'markdown.copyError': '복사하지 못했습니다. 다시 시도하세요.',
    'markdown.download': '다운로드',
  },
  es: {
    'markdown.copy': 'Copiar código',
    'markdown.copyError': 'No se pudo copiar. Inténtalo de nuevo.',
    'markdown.download': 'Descargar',
  },
  pt: {
    'markdown.copy': 'Copiar código',
    'markdown.copyError': 'Não foi possível copiar. Tente novamente.',
    'markdown.download': 'Baixar',
  },
  de: {
    'markdown.copy': 'Code kopieren',
    'markdown.copyError': 'Kopieren fehlgeschlagen. Bitte erneut versuchen.',
    'markdown.download': 'Herunterladen',
  },
  fa: {
    'markdown.copy': 'کپی کد',
    'markdown.copyError': 'کپی نشد. دوباره تلاش کنید.',
    'markdown.download': 'بارگیری',
  },
});
