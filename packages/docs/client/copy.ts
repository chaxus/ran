/** Localized interaction feedback shared by page chrome and progressive enhancement. */
export interface InteractionCopy {
  skip: string;
  loading: string;
  error: string;
  retry: string;
  count: string;
  copy: string;
  copied: string;
  copyFailed: string;
  guide: string;
  reference: string;
  article: string;
}
const copy: Record<string, InteractionCopy> = {
  en: {
    skip: 'Skip to content',
    loading: 'Loading search…',
    error: 'Search could not load. Check your connection and retry.',
    retry: 'Retry',
    count: '{count} results',
    copy: 'Copy code',
    copied: 'Copied',
    copyFailed: 'Copy failed. Select the code and copy it manually.',
    guide: 'Guide',
    reference: 'Reference',
    article: 'Article',
  },
  zh: {
    skip: '跳到正文',
    loading: '正在加载搜索…',
    error: '搜索加载失败，请检查网络后重试。',
    retry: '重试',
    count: '{count} 个结果',
    copy: '复制代码',
    copied: '已复制',
    copyFailed: '复制失败，请选择代码后手动复制。',
    guide: '指南',
    reference: '参考',
    article: '文章',
  },
  ja: {
    skip: '本文へスキップ',
    loading: '検索を読み込み中…',
    error: '検索を読み込めません。接続を確認して再試行してください。',
    retry: '再試行',
    count: '{count} 件の結果',
    copy: 'コードをコピー',
    copied: 'コピーしました',
    copyFailed: 'コピーできません。コードを選択して手動でコピーしてください。',
    guide: 'ガイド',
    reference: 'リファレンス',
    article: '記事',
  },
  es: {
    skip: 'Saltar al contenido',
    loading: 'Cargando búsqueda…',
    error: 'No se pudo cargar la búsqueda. Comprueba la conexión y reintenta.',
    retry: 'Reintentar',
    count: '{count} resultados',
    copy: 'Copiar código',
    copied: 'Copiado',
    copyFailed: 'Error al copiar. Selecciona el código y cópialo manualmente.',
    guide: 'Guía',
    reference: 'Referencia',
    article: 'Artículo',
  },
  pt: {
    skip: 'Ir para o conteúdo',
    loading: 'Carregando busca…',
    error: 'Não foi possível carregar a busca. Verifique a conexão e tente novamente.',
    retry: 'Tentar novamente',
    count: '{count} resultados',
    copy: 'Copiar código',
    copied: 'Copiado',
    copyFailed: 'Falha ao copiar. Selecione o código e copie manualmente.',
    guide: 'Guia',
    reference: 'Referência',
    article: 'Artigo',
  },
  ko: {
    skip: '본문으로 건너뛰기',
    loading: '검색을 불러오는 중…',
    error: '검색을 불러오지 못했습니다. 연결을 확인하고 다시 시도하세요.',
    retry: '다시 시도',
    count: '결과 {count}개',
    copy: '코드 복사',
    copied: '복사됨',
    copyFailed: '복사하지 못했습니다. 코드를 선택하여 직접 복사하세요.',
    guide: '가이드',
    reference: '참조',
    article: '문서',
  },
  de: {
    skip: 'Zum Inhalt springen',
    loading: 'Suche wird geladen…',
    error: 'Suche konnte nicht geladen werden. Verbindung prüfen und erneut versuchen.',
    retry: 'Erneut versuchen',
    count: '{count} Ergebnisse',
    copy: 'Code kopieren',
    copied: 'Kopiert',
    copyFailed: 'Kopieren fehlgeschlagen. Code auswählen und manuell kopieren.',
    guide: 'Anleitung',
    reference: 'Referenz',
    article: 'Artikel',
  },
  fa: {
    skip: 'رفتن به محتوا',
    loading: 'در حال بارگذاری جست‌وجو…',
    error: 'جست‌وجو بارگذاری نشد. اتصال را بررسی کرده و دوباره تلاش کنید.',
    retry: 'تلاش دوباره',
    count: '{count} نتیجه',
    copy: 'کپی کد',
    copied: 'کپی شد',
    copyFailed: 'کپی انجام نشد. کد را انتخاب کرده و دستی کپی کنید.',
    guide: 'راهنما',
    reference: 'مرجع',
    article: 'مقاله',
  },
};
export const interactionCopy = (lang: string): InteractionCopy => copy[lang.split('-')[0]] ?? copy.en;

export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

let dismissTimer: number | undefined;
export const announceCopy = (success: boolean): void => {
  let status = document.querySelector<HTMLElement>('.copy-status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'copy-status';
    status.setAttribute('role', 'status');
    document.body.appendChild(status);
  }
  const text = interactionCopy(document.documentElement.lang);
  status.textContent = success ? text.copied : text.copyFailed;
  window.clearTimeout(dismissTimer);
  dismissTimer = window.setTimeout(
    () => {
      if (status) status.textContent = '';
    },
    success ? 2500 : 6000,
  );
};
