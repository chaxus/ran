interface OfflineCopy {
  title: string;
  waiting: string;
  working: string;
  ready: string;
  paused: string;
  connection: string;
  hidden: string;
  network: string;
  storage: string;
  pause: string;
  resume: string;
  scope: string;
}
const copies: Record<string, OfflineCopy> = {
  en: {
    title: 'Offline reading',
    waiting: 'Preparing when idle',
    working: 'Saving for offline use',
    ready: 'This language is ready offline',
    paused: 'Paused',
    connection: 'Waiting for a suitable connection',
    hidden: 'Paused while this page is hidden',
    network: 'Waiting for a connection to retry',
    storage: 'Not enough storage. Free space and retry.',
    pause: 'Pause',
    resume: 'Resume',
    scope:
      'Includes this language’s documents, search and local components. Videos, external services and online demos still require a connection.',
  },
  zh: {
    title: '离线阅读',
    waiting: '将在空闲时准备',
    working: '正在保存离线内容',
    ready: '当前语言的内容已离线就绪',
    paused: '已暂停',
    connection: '等待合适的网络连接',
    hidden: '页面隐藏时暂停',
    network: '等待网络恢复后重试',
    storage: '存储空间不足，请清理后重试',
    pause: '暂停',
    resume: '继续',
    scope: '包含当前语言的文档、搜索和本地组件。视频、外部服务及联网演示仍需网络连接。',
  },
  ja: {
    title: 'オフライン閲覧',
    waiting: '操作が落ち着いたら準備します',
    working: 'オフライン用に保存中',
    ready: 'この言語のコンテンツはオフラインで利用できます',
    paused: '一時停止中',
    connection: '適切な接続を待っています',
    hidden: 'ページが非表示のため一時停止中',
    network: '接続の回復後に再試行します',
    storage: '空き容量が不足しています。空きを確保して再試行してください。',
    pause: '一時停止',
    resume: '再開',
    scope:
      'この言語の文書、検索、ローカルコンポーネントが対象です。動画、外部サービス、オンラインデモには接続が必要です。',
  },
  ko: {
    title: '오프라인 읽기',
    waiting: '사용하지 않을 때 준비합니다',
    working: '오프라인 콘텐츠 저장 중',
    ready: '현재 언어를 오프라인으로 사용할 수 있습니다',
    paused: '일시 중지됨',
    connection: '적절한 연결을 기다리는 중',
    hidden: '페이지가 숨겨져 일시 중지됨',
    network: '연결이 복구되면 다시 시도합니다',
    storage: '저장 공간이 부족합니다. 공간을 확보하고 다시 시도하세요.',
    pause: '일시 중지',
    resume: '계속',
    scope:
      '현재 언어의 문서, 검색 및 로컬 컴포넌트를 포함합니다. 동영상, 외부 서비스 및 온라인 데모에는 연결이 필요합니다.',
  },
  es: {
    title: 'Lectura sin conexión',
    waiting: 'Se preparará cuando no haya actividad',
    working: 'Guardando contenido sin conexión',
    ready: 'Este idioma está disponible sin conexión',
    paused: 'En pausa',
    connection: 'Esperando una conexión adecuada',
    hidden: 'En pausa mientras la página está oculta',
    network: 'Se reintentará al recuperar la conexión',
    storage: 'No hay espacio suficiente. Libera espacio y reintenta.',
    pause: 'Pausar',
    resume: 'Continuar',
    scope:
      'Incluye documentos, búsqueda y componentes locales de este idioma. Los vídeos, servicios externos y demos en línea requieren conexión.',
  },
  pt: {
    title: 'Leitura offline',
    waiting: 'Preparando quando não houver atividade',
    working: 'Salvando conteúdo offline',
    ready: 'Este idioma está disponível offline',
    paused: 'Pausado',
    connection: 'Aguardando uma conexão adequada',
    hidden: 'Pausado enquanto a página está oculta',
    network: 'Tentará novamente ao recuperar a conexão',
    storage: 'Espaço insuficiente. Libere espaço e tente novamente.',
    pause: 'Pausar',
    resume: 'Continuar',
    scope:
      'Inclui documentos, pesquisa e componentes locais deste idioma. Vídeos, serviços externos e demonstrações online precisam de conexão.',
  },
  de: {
    title: 'Offline lesen',
    waiting: 'Wird bei Inaktivität vorbereitet',
    working: 'Offline-Inhalte werden gespeichert',
    ready: 'Diese Sprache ist offline verfügbar',
    paused: 'Pausiert',
    connection: 'Wartet auf eine geeignete Verbindung',
    hidden: 'Pausiert, während die Seite ausgeblendet ist',
    network: 'Wiederholung bei verfügbarer Verbindung',
    storage: 'Nicht genug Speicher. Speicher freigeben und erneut versuchen.',
    pause: 'Pausieren',
    resume: 'Fortsetzen',
    scope:
      'Enthält Dokumente, Suche und lokale Komponenten dieser Sprache. Videos, externe Dienste und Online-Demos benötigen eine Verbindung.',
  },
  fa: {
    title: 'مطالعه آفلاین',
    waiting: 'آماده‌سازی در زمان بیکاری',
    working: 'ذخیره محتوای آفلاین',
    ready: 'محتوای این زبان به صورت آفلاین آماده است',
    paused: 'متوقف شده',
    connection: 'در انتظار اتصال مناسب',
    hidden: 'هنگام پنهان بودن صفحه متوقف است',
    network: 'پس از اتصال دوباره تلاش می‌شود',
    storage: 'فضای کافی نیست. فضا آزاد کنید و دوباره تلاش کنید.',
    pause: 'توقف',
    resume: 'ادامه',
    scope:
      'شامل اسناد، جستجو و مؤلفه‌های محلی این زبان است. ویدیوها، خدمات خارجی و نمونه‌های آنلاین به اتصال نیاز دارند.',
  },
};
export const offlineCopy = (lang: string): OfflineCopy => copies[lang] ?? copies[lang.split('-')[0]!] ?? copies.en!;
