<script setup>
import { NConfigProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'

const themeOverrides = {
  common: {
    primaryColor: '#4fd1c5',
    primaryColorHover: '#5eead4',
    primaryColorPressed: '#38b2ac',
    primaryColorSuppl: '#2c7a7b',
  },
  Menu: {
    itemColorActive: 'rgba(79, 209, 197, 0.14)',
    itemTextColorActive: '#4fd1c5',
    itemIconColorActive: '#4fd1c5',
    itemTextColorHover: '#e5e7eb',
    itemIconColorHover: '#e5e7eb',
  },
}
</script>

<template>
  <n-config-provider
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <router-view />
  </n-config-provider>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
