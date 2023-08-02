import type { AxiosRequestConfig, Canceler as AxiosCanceler } from 'axios'
import axios from 'axios'

// 用于存储每个请求的标识和取消方法
let pendingMap = new Map<string, AxiosCanceler>()

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&')

class Canceler {
  /**
   * @description: 添加请求
   * @param {Object} config
   */
  addPending(config: AxiosRequestConfig) {
    this.removePending(config)
    const url = getPendingUrl(config)
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          pendingMap.set(url, cancel)
        }
      })
  }

  /**
   * @description: 取消所有的请求
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && cancel()
    })
    pendingMap.clear()
  }

  /**
   * @description: 取消请求
   * @param {Object} config
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)

    if (pendingMap.has(url)) {
      const cancel = pendingMap.get(url)
      cancel && cancel(url)
      pendingMap.delete(url)
    }
  }

  /**
   * @description: 获取取消请求方法
   * @param config
   */
  getCanceler(config: AxiosRequestConfig) {
    const url = getPendingUrl(config)
    return pendingMap.get(url)
  }

  /**
   * @description: 重置
   */
  reset(): void {
    pendingMap = new Map<string, AxiosCanceler>()
  }
}

export default Canceler
