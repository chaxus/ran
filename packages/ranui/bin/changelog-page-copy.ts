import type { DocLocaleDir } from './doc-site-locales.ts';

/**
 * One language's chrome for the generated changelog page.
 *
 * Only Chinese has a translated changelog source (`CHANGELOG.zh-CN.md`); every other
 * language falls back to the English entries, and `generatedNote` says so in that language
 * rather than leaving the reader to guess why the list below is in English. Translating
 * entries at generation time was rejected for Chinese too — the wording is reviewed by a
 * person — and the same reasoning holds here.
 */
export interface ChangelogPageCopy {
  title: string;
  description: string;
  heading: string;
  /** @param translated whether this language has its own changelog source. */
  generatedNote: (translated: boolean) => string;
  alphaTitle: string;
  alphaBody: string[];
  notesHeading: string;
  notesIntro: string[];
  /** Column headers: `[date, ranui notes, repository-wide notes]`. */
  tableHeaders: [string, string, string];
  footer: (releases: string, npm: string) => string[];
}

export const CHANGELOG_PAGE_COPY: Record<DocLocaleDir, ChangelogPageCopy> = {
  '': {
    title: 'ranui changelog',
    description:
      'What changed in ranui — added, changed, fixed and removed, with the reasoning, plus the dated engineering notes behind each batch.',
    heading: 'Changelog',
    generatedNote: () =>
      'Generated from `packages/ranui/CHANGELOG.md` by `pnpm -F ranui doc:changelog`, so this page\nand the copy inside the npm tarball cannot disagree.',
    alphaTitle: 'ranui is alpha',
    alphaBody: [
      'Versions are published as `0.x-alpha`, and **breaking changes ship in them**. The design is',
      'still being improved in preference to preserving an API shape, so pin an exact version and',
      'read this page before upgrading.',
    ],
    notesHeading: 'Engineering notes',
    notesIntro: [
      'Longer-form notes on why a batch of changes happened, kept beside the code rather than',
      'summarised here. They are the reasoning behind the entries above.',
    ],
    tableHeaders: ['Date', 'ranui', 'Repository-wide'],
    footer: (releases, npm) => [
      `Releases and tags are on [GitHub](${releases}), and every`,
      `published version is on [npm](${npm}).`,
    ],
  },
  cn: {
    title: 'ranui 更新日志',
    description: 'ranui 的变更记录——新增、变更、修复与移除及其原因，以及每一批改动背后的工程记录。',
    heading: 'Changelog 更新日志',
    generatedNote: (translated) =>
      translated
        ? '由 `pnpm -F ranui doc:changelog` 从 `packages/ranui/CHANGELOG.zh-CN.md` 生成，与英文版一同维护，\n因此本页与 npm 包内的副本不会出现分歧。'
        : '由 `pnpm -F ranui doc:changelog` 从 `packages/ranui/CHANGELOG.md` 生成，因此本页与 npm 包内的\n副本不会出现分歧。条目内容直接取自源文件，保持英文。',
    alphaTitle: 'ranui 处于 alpha 阶段',
    alphaBody: [
      '版本以 `0.x-alpha` 发布，**其中会包含破坏性变更**——现阶段优先把设计做对，而不是保住 API 形状。',
      '请锁定确切版本，并在升级前先读本页。',
    ],
    notesHeading: '工程记录',
    notesIntro: ['每一批改动为什么发生的长文记录，与代码放在一起，不在此处摘要。它们是上面这些条目背后的推理过程。'],
    tableHeaders: ['日期', 'ranui', '仓库整体'],
    footer: (releases, npm) => [`发布与标签见 [GitHub](${releases})，已发布的每个版本见`, `[npm](${npm})。`],
  },
  ja: {
    title: 'ranui 更新履歴',
    description: 'ranui の変更点——追加・変更・修正・削除とその理由、そして各バッチの背景にある日付つきの技術メモ。',
    heading: '更新履歴',
    generatedNote: () =>
      '`pnpm -F ranui doc:changelog` が `packages/ranui/CHANGELOG.md` から生成しているため、このページと\nnpm パッケージ内の写しが食い違うことはありません。項目は原文をそのまま載せているので英語です。',
    alphaTitle: 'ranui は alpha 段階です',
    alphaBody: [
      'バージョンは `0.x-alpha` として公開しており、**破壊的変更もその中で入ります**。API の形を保つことより',
      '設計を良くすることを優先している段階なので、バージョンは正確に固定し、アップグレード前にこのページを',
      '読んでください。',
    ],
    notesHeading: '技術メモ',
    notesIntro: [
      'まとまった変更がなぜ起きたのかを書いた長めのメモです。ここで要約せず、コードのそばに置いています。',
      '上の項目の背景にある考え方がそこにあります。',
    ],
    tableHeaders: ['日付', 'ranui', 'リポジトリ全体'],
    footer: (releases, npm) => [
      `リリースとタグは [GitHub](${releases})、公開済みの各バージョンは`,
      `[npm](${npm}) にあります。`,
    ],
  },
  es: {
    title: 'Registro de cambios de ranui',
    description:
      'Qué cambió en ranui: lo añadido, lo modificado, lo corregido y lo eliminado, con su razonamiento, además de las notas técnicas fechadas detrás de cada tanda.',
    heading: 'Registro de cambios',
    generatedNote: () =>
      'Generado desde `packages/ranui/CHANGELOG.md` por `pnpm -F ranui doc:changelog`, de modo que esta\npágina y la copia del paquete npm no pueden contradecirse. Las entradas se toman tal cual del\norigen, así que están en inglés.',
    alphaTitle: 'ranui está en alfa',
    alphaBody: [
      'Las versiones se publican como `0.x-alpha`, y **los cambios incompatibles llegan en ellas**. Se',
      'sigue mejorando el diseño antes que preservar la forma de la API, así que fija una versión',
      'exacta y lee esta página antes de actualizar.',
    ],
    notesHeading: 'Notas técnicas',
    notesIntro: [
      'Notas más extensas sobre por qué ocurrió una tanda de cambios, guardadas junto al código en',
      'lugar de resumidas aquí. Son el razonamiento detrás de las entradas anteriores.',
    ],
    tableHeaders: ['Fecha', 'ranui', 'Todo el repositorio'],
    footer: (releases, npm) => [
      `Las publicaciones y etiquetas están en [GitHub](${releases}), y cada versión`,
      `publicada está en [npm](${npm}).`,
    ],
  },
  pt: {
    title: 'Registro de alterações do ranui',
    description:
      'O que mudou no ranui: adicionado, alterado, corrigido e removido, com o raciocínio, além das notas técnicas datadas por trás de cada lote.',
    heading: 'Registro de alterações',
    generatedNote: () =>
      'Gerado a partir de `packages/ranui/CHANGELOG.md` por `pnpm -F ranui doc:changelog`, de modo que\nesta página e a cópia dentro do pacote npm não podem divergir. As entradas vêm direto da fonte,\nportanto estão em inglês.',
    alphaTitle: 'o ranui está em alfa',
    alphaBody: [
      'As versões são publicadas como `0.x-alpha`, e **mudanças incompatíveis chegam nelas**. O design',
      'ainda está sendo melhorado em vez de preservar o formato da API, então fixe uma versão exata e',
      'leia esta página antes de atualizar.',
    ],
    notesHeading: 'Notas técnicas',
    notesIntro: [
      'Notas mais longas sobre por que um lote de mudanças aconteceu, mantidas junto ao código em vez',
      'de resumidas aqui. São o raciocínio por trás das entradas acima.',
    ],
    tableHeaders: ['Data', 'ranui', 'Todo o repositório'],
    footer: (releases, npm) => [
      `Lançamentos e tags estão no [GitHub](${releases}), e cada versão`,
      `publicada está no [npm](${npm}).`,
    ],
  },
  ko: {
    title: 'ranui 변경 이력',
    description:
      'ranui에서 무엇이 바뀌었는지 — 추가·변경·수정·제거와 그 이유, 그리고 각 묶음 뒤에 있는 날짜별 엔지니어링 노트.',
    heading: '변경 이력',
    generatedNote: () =>
      '`pnpm -F ranui doc:changelog`가 `packages/ranui/CHANGELOG.md`에서 생성하므로 이 페이지와 npm\n패키지 안의 사본이 어긋날 수 없습니다. 항목은 원문 그대로라서 영어입니다.',
    alphaTitle: 'ranui는 alpha 단계입니다',
    alphaBody: [
      '버전은 `0.x-alpha`로 배포되며 **호환성을 깨는 변경도 그 안에 들어갑니다**. API 모양을 지키기보다',
      '설계를 더 낫게 만드는 쪽을 우선하는 단계이니, 정확한 버전을 고정하고 업그레이드 전에 이 페이지를',
      '읽어 주세요.',
    ],
    notesHeading: '엔지니어링 노트',
    notesIntro: [
      '한 묶음의 변경이 왜 일어났는지 적은 긴 글입니다. 여기서 요약하지 않고 코드 옆에 둡니다.',
      '위 항목들 뒤에 있는 판단 과정이 거기에 있습니다.',
    ],
    tableHeaders: ['날짜', 'ranui', '저장소 전체'],
    footer: (releases, npm) => [
      `릴리스와 태그는 [GitHub](${releases})에, 배포된 모든 버전은`,
      `[npm](${npm})에 있습니다.`,
    ],
  },
  de: {
    title: 'ranui-Änderungsprotokoll',
    description:
      'Was sich in ranui geändert hat — Hinzugefügtes, Geändertes, Behobenes und Entferntes samt Begründung, dazu die datierten Engineering-Notizen hinter jedem Schub.',
    heading: 'Änderungsprotokoll',
    generatedNote: () =>
      'Von `pnpm -F ranui doc:changelog` aus `packages/ranui/CHANGELOG.md` erzeugt — diese Seite und\ndie Kopie im npm-Paket können sich also nicht widersprechen. Die Einträge stammen unverändert\naus der Quelle und sind deshalb englisch.',
    alphaTitle: 'ranui ist Alpha',
    alphaBody: [
      'Versionen erscheinen als `0.x-alpha`, und **Breaking Changes kommen darin vor**. Das Design wird',
      'weiterhin verbessert, statt eine API-Form zu konservieren — pinne also eine exakte Version und',
      'lies diese Seite vor einem Upgrade.',
    ],
    notesHeading: 'Engineering-Notizen',
    notesIntro: [
      'Ausführlichere Notizen dazu, warum ein Schub an Änderungen passiert ist — beim Code abgelegt',
      'statt hier zusammengefasst. Sie sind die Begründung hinter den Einträgen oben.',
    ],
    tableHeaders: ['Datum', 'ranui', 'Repository-weit'],
    footer: (releases, npm) => [
      `Releases und Tags liegen auf [GitHub](${releases}), jede veröffentlichte`,
      `Version auf [npm](${npm}).`,
    ],
  },
  fa: {
    title: 'تغییرات ranui',
    description:
      'چه چیزی در ranui تغییر کرد — افزوده، تغییریافته، اصلاح‌شده و حذف‌شده به همراه دلیل آن، و یادداشت‌های فنی تاریخ‌دار پشت هر دسته تغییر.',
    heading: 'تغییرات',
    generatedNote: () =>
      '`pnpm -F ranui doc:changelog` این صفحه را از `packages/ranui/CHANGELOG.md` می‌سازد، بنابراین این\nصفحه و نسخهٔ درون بستهٔ npm نمی‌توانند با هم اختلاف داشته باشند. مدخل‌ها مستقیم از منبع برداشته\nمی‌شوند و به همین دلیل انگلیسی‌اند.',
    alphaTitle: 'ranui در مرحلهٔ alpha است',
    alphaBody: [
      'نسخه‌ها با برچسب `0.x-alpha` منتشر می‌شوند و **تغییرات ناسازگار هم در همین‌ها می‌آیند**. در این',
      'مرحله بهتر شدن طراحی بر حفظ شکل API اولویت دارد؛ پس نسخهٔ دقیق را قفل کنید و پیش از ارتقا این',
      'صفحه را بخوانید.',
    ],
    notesHeading: 'یادداشت‌های فنی',
    notesIntro: [
      'یادداشت‌های بلندتر دربارهٔ اینکه چرا یک دسته تغییر رخ داد، کنار خود کد نگه داشته می‌شوند نه',
      'خلاصه‌شده در اینجا. استدلال پشت مدخل‌های بالا همان‌جاست.',
    ],
    tableHeaders: ['تاریخ', 'ranui', 'کل مخزن'],
    footer: (releases, npm) => [
      `انتشارها و برچسب‌ها در [GitHub](${releases}) و هر نسخهٔ منتشرشده در`,
      `[npm](${npm}) است.`,
    ],
  },
};
