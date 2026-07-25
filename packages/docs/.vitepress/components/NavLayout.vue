<template>
  <Layout>
    <!--
      Must NOT be `#nav-bar-title-after`: that slot renders *inside* the logo's
      `<a class="title" href="/">`, and ProductSwitcher's menu items are `<a>` elements.
      Nested anchors are invalid HTML, so the browser's parser auto-closes the outer `<a>`
      and hoists the menu out — the DOM then no longer matches Vue's vdom and hydration
      fails with "Hydration children mismatch on [node HTMLAnchorElement]".

      `#nav-bar-content-before` sits outside the anchor, which also removes the reason the
      component had to intercept its own clicks.
    -->
    <template #nav-bar-content-before>
      <ProductSwitcher />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts';
import ProductSwitcher from './ProductSwitcher.vue';

const { Layout } = DefaultTheme;
</script>
