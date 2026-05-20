<script setup>
import {
  NCard,
  NConfigProvider,
  NModal,
  NMessageProvider,
  darkTheme,
  dateZhCN,
  zhCN,
} from 'naive-ui'
import { useSupportStore } from '@/stores/support'

const supportStore = useSupportStore()

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
  Select: {
    menuBoxShadow: '0 4px 12px rgba(0,0,0,0.6)',
  },
  InternalSelection: {
    fontSizeMedium: '14px',
    heightMedium: '34px',
    borderRadius: '4px',
    textColor: '#d1d5db',
    placeholderColor: '#6b7280',
    color: '#1a1c1e',
    border: '1px solid rgba(255,255,255,0.12)',
    borderHover: '1px solid rgba(79,209,197,0.4)',
    borderFocus: '1px solid #4fd1c5',
  },
  InternalSelectMenu: {
    optionTextColor: '#d1d5db',
    optionTextColorActive: '#4fd1c5',
    optionColorActive: 'rgba(79,209,197,0.12)',
    color: '#1a1c1e',
    borderRadius: '4px',
  },
  Radio: {
    // buttonColor: 'transparent',
    // buttonColorActive: '#57d7ea',
    // buttonTextColor: '#fff',
    // buttonTextColorHover: '#57d7ea',
    buttonTextColorActive: '#fff',
    // buttonBorderColorActive: '#57d7ea',
    // buttonBoxShadow: 'none',
    // buttonBoxShadowFocus: 'none',
    // buttonBoxShadowHover: 'none',
  },
  Input: {
    borderRadius: '4px',
    heightMedium: '34px',
    fontSizeMedium: '14px',
    textColor: '#d1d5db',
    placeholderColor: '#6b7280',
    color: '#1a1c1e',
    border: '1px solid rgba(255,255,255,0.12)',
    borderHover: '1px solid rgba(79,209,197,0.4)',
    borderFocus: '1px solid #4fd1c5',
    boxShadowFocus: '0 0 0 2px rgba(79,209,197,0.2)',
    caretColor: '#4fd1c5',
    lineHeight: '1.6',
  },
  Button: {
    heightMedium: '34px',
    borderRadiusMedium: '4px',
    fontSizeMedium: '14px',
    paddingMedium: '0 14px',
    fontWeight: '400',
    fontWeightStrong: '500',
    opacityDisabled: '0.5',
    color: '#0000',
    colorHover: '#0000',
    colorPressed: '#0000',
    textColor: 'rgba(255,255,255,0.82)',
    textColorHover: '#4fd1c5',
    textColorPressed: '#38b2ac',
    textColorFocus: '#4fd1c5',
    textColorDisabled: 'rgba(255,255,255,0.3)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderHover: '1px solid #4fd1c5',
    borderPressed: '1px solid #38b2ac',
    borderFocus: '1px solid #4fd1c5',
    borderDisabled: '1px solid rgba(255,255,255,0.06)',
    rippleColor: '#4fd1c5',
    colorPrimary: '#4fd1c5',
    colorHoverPrimary: '#5eead4',
    colorPressedPrimary: '#38b2ac',
    colorFocusPrimary: '#5eead4',
    colorDisabledPrimary: '#4fd1c5',
    textColorPrimary: '#1a1c1e',
    textColorHoverPrimary: '#1a1c1e',
    textColorPressedPrimary: '#1a1c1e',
    textColorFocusPrimary: '#1a1c1e',
    textColorDisabledPrimary: '#1a1c1e',
    borderPrimary: '1px solid #4fd1c5',
    borderHoverPrimary: '1px solid #5eead4',
    borderPressedPrimary: '1px solid #38b2ac',
    borderFocusPrimary: '1px solid #5eead4',
    borderDisabledPrimary: '1px solid #4fd1c5',
    rippleColorPrimary: '#4fd1c5',
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
    <n-message-provider>
      <router-view />
    </n-message-provider>
    <n-modal
      v-model:show="supportStore.qrVisible"
      preset="card"
      class="max-w-[360px]"
      :mask-closable="true"
      :bordered="false"
    >
      <div class="flex flex-col items-center text-center">
        <img
          :src="supportStore.qrCodeSrc"
          alt="联系客服二维码"
          class="h-[220px] w-[220px] rounded-lg bg-white p-2"
          referrerpolicy="no-referrer"
        />
        <p class="mt-4 mb-0 text-sm text-white/70">请使用微信扫码联系客服</p>
      </div>
    </n-modal>
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
