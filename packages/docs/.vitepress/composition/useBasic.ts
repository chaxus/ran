import { inject } from "vue";
import { useI18n } from "vue-i18n";
export default () => {
  const $env = inject("$env");
  const { t, locale } = useI18n();
  return { locale, $env, t };
};
