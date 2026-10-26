import { defineText } from '@/utils/ui-text';

/** Built-in text of `r-select`, by language. Keys are what an app overrides as `ranui.<key>`. */
export const selectText = defineText({
  en: {
    'select.required': 'Please select an item in the list.',
  },
  zh: {
    'select.required': '请从列表中选择一项。',
  },
  ja: {
    'select.required': 'リスト内の項目を選択してください。',
  },
  ko: {
    'select.required': '목록에서 항목을 선택하세요.',
  },
  es: {
    'select.required': 'Selecciona un elemento de la lista.',
  },
  pt: {
    'select.required': 'Selecione um item da lista.',
  },
  de: {
    'select.required': 'Wählen Sie ein Element in der Liste aus.',
  },
  fa: {
    'select.required': 'لطفاً یک مورد از فهرست انتخاب کنید.',
  },
});
