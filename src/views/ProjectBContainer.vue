<template>
  <div id="project-b-container">
    <!-- 方案A：iframe 加载（最简单，无需改造项目B） -->
    <iframe
      ref="iframe"
      :src="iframeUrl"
      frameborder="0"
      style="width: 100%; height: 100vh; border: none"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'ProjectBContainer',
  computed: {
    iframeUrl() {
      // 获取当前 URL 中 /agent 后面的路径
      const fullPath = this.$route.fullPath // 例如: /agent/dashboard?id=1

      // 去掉 /agent 前缀，保留后面的路径和参数
      const subPath = fullPath.replace(/^\/agent/, '') || '/'

      // 关键：Hash 模式下，把路径拼接到 # 后面
      // 如果项目B是 Hash 路由，它监听的路径是 #/dashboard
      // 所以拼接后整个 URL 是：http://localhost:8081/agent/index.html#/dashboard?id=1

      if (import.meta.env.DEV) {
        // 开发环境：直接指向项目B的 dev server
        return `http://localhost:8081/agent/index.html#${subPath}`
      } else {
        // 生产环境：使用相对路径（依赖构建后的文件）
        return `/agent/index.html#${subPath}`
      }
    },
  },
  mounted() {
    // 监听 iframe 加载完成后的消息（可选）
    window.addEventListener('message', this.handleIframeMessage)
  },
  methods: {
    handleIframeMessage(event) {
      // 如果项目B需要通知项目A，可以通过 postMessage
      if (event.data?.type === 'navigate') {
        // 比如项目B想跳转到项目A的某个页面
        this.$router.push(event.data.path)
      }
    },
  },
}
</script>
