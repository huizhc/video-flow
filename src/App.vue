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
    itemColor: 'transparent',
    itemColorHover: 'rgba(255,255,255,0.04)',
    itemColorActive: 'rgba(79, 209, 197, 0.12)',
    itemColorActiveHover: 'rgba(79, 209, 197, 0.16)',
    itemBorderRadius: '8px',
    itemHeight: '40px',
    itemTextColor: 'rgba(255,255,255,0.62)',
    itemIconColor: 'rgba(255,255,255,0.5)',
    itemTextColorActive: '#4fd1c5',
    itemIconColorActive: '#4fd1c5',
    itemTextColorHover: '#e5e7eb',
    itemIconColorHover: '#e5e7eb',
    groupTextColor: 'rgba(255,255,255,0.32)',
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
    color: 'transparent',
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
    color: 'tansparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderHover: '1px solid rgba(79,209,197,0.4)',
    borderFocus: '1px solid #4fd1c5',
    boxShadowFocus: '0 0 0 2px rgba(79,209,197,0.2)',
    caretColor: '#4fd1c5',
    lineHeight: '1.6',
  },
  // Tag: {
  //   borderRadius: '4px',
  //   heightMedium: '34px',
  //   fontSizeMedium: '14px',
  //   fontWeightStrong: '500',
  //   opacityDisabled: '0.5',
  //   textColor: 'rgba(255,255,255,0.82)',
  //   color: '#1a1c1e',
  //   colorBordered: '#1a1c1e',
  //   border: '1px solid rgba(255,255,255,0.12)',
  //   closeIconColor: '#d1d5db',
  //   closeIconColorHover: '#e5e7eb',
  //   closeIconColorPressed: '#ffffff',
  //   closeColorHover: 'rgba(79,209,197,0.08)',
  //   closeColorPressed: 'rgba(79,209,197,0.16)',
  //   borderPrimary: '1px solid #4fd1c5',
  //   textColorPrimary: '#1a1c1e',
  //   colorPrimary: '#4fd1c5',
  //   colorBorderedPrimary: '#4fd1c5',
  //   closeIconColorPrimary: '#1a1c1e',
  //   closeIconColorHoverPrimary: '#1a1c1e',
  //   closeIconColorPressedPrimary: '#1a1c1e',
  //   closeColorHoverPrimary: 'rgba(79,209,197,0.16)',
  //   closeColorPressedPrimary: 'rgba(79,209,197,0.24)',
  // },
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
    textColorPrimary: '#fff',
    textColorHoverPrimary: '#fff',
    textColorPressedPrimary: '#fff',
    textColorFocusPrimary: '#fff',
    textColorDisabledPrimary: '#fff',
    borderPrimary: '1px solid #4fd1c5',
    borderHoverPrimary: '1px solid #5eead4',
    borderPressedPrimary: '1px solid #38b2ac',
    borderFocusPrimary: '1px solid #5eead4',
    borderDisabledPrimary: '1px solid #4fd1c5',
    rippleColorPrimary: '#4fd1c5',
    // colorWarning: '#4fd1c5',
    // colorHoverWarning: '#5eead4',
    // colorPressedWarning: '#38b2ac',
    // colorFocusWarning: '#5eead4',
    // colorDisabledWarning: '#4fd1c5',
    textColorWarning: '#fff',
    textColorHoverWarning: '#fff',
    textColorPressedWarning: '#fff',
    textColorFocusWarning: '#fff',
    textColorDisabledWarning: '#fff',
    // borderWarning: '1px solid #4fd1c5',
    // borderHoverWarning: '1px solid #5eead4',
    // borderPressedWarning: '1px solid #38b2ac',
    // borderFocusWarning: '1px solid #5eead4',
    // borderDisabledWarning: '1px solid #4fd1c5',
    // rippleColorWarning: '#4fd1c5',
    // Success
    colorSuccess: '#4dd865',
    colorHoverSuccess: '#4dd865',
    colorPressedSuccess: '#4dd865',
    colorFocusSuccess: '#4dd865',
    colorDisabledSuccess: '#4dd865',
    textColorSuccess: '#fff',
    textColorHoverSuccess: '#fff',
    textColorPressedSuccess: '#fff',
    textColorFocusSuccess: '#fff',
    textColorDisabledSuccess: '#fff',
    borderSuccess: '1px solid #4dd865',
    borderHoverSuccess: '1px solid #4dd865',
    borderPressedSuccess: '1px solid #4dd865',
    borderFocusSuccess: '1px solid #4dd865',
    borderDisabledSuccess: '1px solid #4dd865',
    // rippleColorSuccess: '#4fd1c5',
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
