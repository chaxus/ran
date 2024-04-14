import DefaultTheme from "vitepress/theme";
import env from "../plugins/env";
import TOTP from "../components/TOTP.vue";
import Layout from "../components/Layout.vue";
import i18n, { loadLanguageAsync } from "../lang";
import { RAN_CHAXUS_LANG, LANGS_DICT } from "../lib/constant";
import { localStorageGetItem } from "ranuts/utils";
import "./styles/index.less";
import "./styles/vars.less";
import "./tailwind.less";

declare global {
  interface ImportMeta {
    env: {
      SSR: boolean;
    };
  }
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      import("ranui");
      app.component("TOTP", TOTP);
      app.use(env);
      const locale = localStorageGetItem(RAN_CHAXUS_LANG) || LANGS_DICT.EN;
      app.use(i18n)
      loadLanguageAsync(locale)
        .then(() => app.use(i18n))
        .catch((error) => {
          console.log("error", error);
        });
    }
  },
};
