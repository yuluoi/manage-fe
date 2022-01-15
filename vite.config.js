
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import '@/assets/style/base.scss';`
  //     }
  //   }
  // },
  server: {
    port: 8080,
    // 增加代理文件 访问api路径 自动跳转
    proxy: {
      "/api": {
        target: "http://localhost:3000"
      }
    }
  },
  plugins: [vue()]
})
