import { h, render, ref, onMounted, nextTick } from 'vue'
import UploadModal from '@/components/UploadModal.vue'
import { darkTheme, zhCN, dateZhCN, NConfigProvider } from 'naive-ui'

export function showUploadModal(options = {}) {
  const container = document.createElement('div')

  // 创建一个包装组件来管理内部的 show 状态，从而触发动画
  const Wrapper = {
    setup() {
      const show = ref(false)

      onMounted(() => {
        // 在组件挂载后，通过 nextTick 或小延迟将 show 设为 true，触发进入动画
        nextTick(() => {
          show.value = true
        })
      })

      function handleClose() {
        show.value = false
        // 等待退出动画结束后销毁 DOM
        setTimeout(() => {
          destroy()
        }, 300)
      }

      return () =>
        h(
          NConfigProvider,
          {
            theme: darkTheme,
            locale: zhCN,
            dateLocale: dateZhCN,
          },
          {
            default: () =>
              h(UploadModal, {
                ...options,
                show: show.value,
                'onUpdate:show': (val) => {
                  if (!val) handleClose()
                },
                onClose: handleClose,
              }),
          }
        )
    },
  }

  const vnode = h(Wrapper)

  function destroy() {
    render(null, container)
    if (container.parentNode) {
      container.remove()
    }
  }

  render(vnode, container)
  document.body.appendChild(container)
}
