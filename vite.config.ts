import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import visualizer from 'rollup-plugin-visualizer';
import { viteMockServe } from 'vite-plugin-mock';

const plugins = [];

// 打包生产环境才引入的插件
if (process.env.report === 'true') {
  // 打包依赖展示
  plugins.push(
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  );
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteMockServe(), ...plugins],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  base: './', // 打包路径
  server: {
    port: 4000, // 服务端口号
    // open: true, // 服务启动时是否自动打开浏览器
    cors: true // 允许跨域
  }
});
