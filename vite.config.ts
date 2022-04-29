import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from "vite-plugin-mock";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),viteMockServe()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  base: './', // 打包路径
  server: {
    port: 4000, // 服务端口号
    // open: true, // 服务启动时是否自动打开浏览器
    cors: true // 允许跨域
  }
})
