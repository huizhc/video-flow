import { ref } from 'vue'
import { defineStore } from 'pinia'

const SUPPORT_QR_CODE =
  'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=AIKC%20Support'

export const useSupportStore = defineStore('support', () => {
  const qrVisible = ref(false)

  function openQr() {
    qrVisible.value = true
  }

  function closeQr() {
    qrVisible.value = false
  }

  return {
    qrVisible,
    qrCodeSrc: SUPPORT_QR_CODE,
    openQr,
    closeQr,
  }
})
