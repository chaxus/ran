<template>
  <DefaultTheme.Layout />
</template>
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import useBasic from '../composition/useBasic';
import { watchEffect, onMounted } from 'vue';
import { localStorageSetItem, setFontSize2html } from 'ranuts/utils';
import { RAN_CHAXUS_LANG, LANGS_DICT } from '../lib/constant';
import { loadLanguageAsync } from '../lang';
const { $env, locale } = useBasic();
const { lang } = useData();

const setLang = () => {
  const language = lang.value || LANGS_DICT.EN;
  locale.value = language;
  $env.locale = language;
  loadLanguageAsync(language).catch((error) => {
    console.log('error', error);
  });
  localStorageSetItem(RAN_CHAXUS_LANG, language);
};

watchEffect(() => {
  setLang();
});

onMounted(() => {
  setFontSize2html();
});
</script>
