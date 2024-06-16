import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Env } from '../plugins/env';

export default (): any => {
  const $env: Env = inject('$env')!;
  const { t, locale } = useI18n();
  return { locale, $env, t };
};
