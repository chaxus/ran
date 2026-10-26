import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-input`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const inputText = defineText({
  en: {
    'input.required': 'Please fill out this field.',
  },
  zh: {
    'input.required': '请填写此字段。',
  },
  ja: {
    'input.required': 'このフィールドを入力してください。',
  },
  ko: {
    'input.required': '이 입력란을 작성하세요.',
  },
  es: {
    'input.required': 'Completa este campo.',
  },
  pt: {
    'input.required': 'Preencha este campo.',
  },
  de: {
    'input.required': 'Füllen Sie dieses Feld aus.',
  },
  fa: {
    'input.required': 'لطفاً این قسمت را پر کنید.',
  },
});
