import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/agent': {
        target: 'http://localhost:8081', // 指向项目B的dev服务器地址
        changeOrigin: true,
        // 如果项目B的 base 不是 '/agent'，可能需要重写路径
        // rewrite: (path) => path.replace(/^\/agent/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        // 项目A的主入口
        main: resolve(__dirname, 'index.html'),
        // 项目B的入口，指定到 project-b 目录下的 index.html
        agent: resolve(__dirname, 'agent/index.html'),
      },
    },
  },
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [NaiveUiResolver()],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
