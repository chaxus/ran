import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-checkbox`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const checkboxText = defineText({
  en: {
    'checkbox.required': 'Please check this box if you want to proceed.',
  },
  zh: {
    'checkbox.required': '如果要继续，请勾选此复选框。',
  },
  ja: {
    'checkbox.required': '続行するには、このボックスをオンにしてください。',
  },
  ko: {
    'checkbox.required': '계속하려면 이 확인란을 선택하세요.',
  },
  es: {
    'checkbox.required': 'Marca esta casilla si quieres continuar.',
  },
  pt: {
    'checkbox.required': 'Marque esta caixa se deseja continuar.',
  },
  de: {
    'checkbox.required': 'Klicken Sie dieses Kästchen an, wenn Sie fortfahren wollen.',
  },
  fa: {
    'checkbox.required': 'اگر می‌خواهید ادامه دهید، این کادر را علامت بزنید.',
  },
});
