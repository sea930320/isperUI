// import Vue from 'vue'

// 此处配置后端 API 根路径 以及 全局错误处理
// 更多配置请根据业务逻辑自行实现

// 后端 API 根路径

export const rootPath = process.env.VUE_APP_API_ENDPOINT

// XHR 错误处理
export const errHandler = (reject, err) => {
  // Vue.toasted.error('请求 API 失败')
  reject(err)
}