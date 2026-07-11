<template>
  <Layout>
    <template #nav-bar-title-after>
      <ProductSwitcher />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme-without-fonts';
import ProductSwitcher from './ProductSwitcher.vue';

const { Layout } = DefaultTheme;
</script>
