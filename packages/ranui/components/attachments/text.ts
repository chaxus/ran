import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-attachments`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const attachmentsText = defineText({
  en: {
    'attachments.remove': 'Remove {name}',
  },
  zh: {
    'attachments.remove': '移除 {name}',
  },
  ja: {
    'attachments.remove': '{name} を削除',
  },
  ko: {
    'attachments.remove': '{name} 제거',
  },
  es: {
    'attachments.remove': 'Quitar {name}',
  },
  pt: {
    'attachments.remove': 'Remover {name}',
  },
  de: {
    'attachments.remove': '{name} entfernen',
  },
  fa: {
    'attachments.remove': 'حذف {name}',
  },
});
