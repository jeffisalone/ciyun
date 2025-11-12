// src/env.d.ts（确保文件在 src 目录下）
/// <reference types="vite/client" />

// 声明 .vue 模块，解决 TS7016 错误
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 允许组件是任意类型（或根据实际情况指定更严格的类型）
  const component: DefineComponent<{}, {}, any>
  export default component
}