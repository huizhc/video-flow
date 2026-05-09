<script setup>
import { NLayout, NLayoutContent } from 'naive-ui'
import AppTopHeader from '@/components/layout/AppTopHeader.vue'
</script>

<template>
  <n-layout class="h-screen bg-[#121212]">
    <app-top-header logo-route-name="tools-all" :show-back-button="true" />

    <n-layout-content class="h-[calc(100vh-3.5rem)] overflow-auto bg-[#121212]">
      <router-view />
    </n-layout-content>
  </n-layout>
</template>
