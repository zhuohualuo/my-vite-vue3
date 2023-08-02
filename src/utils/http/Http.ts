import type { AxiosInstance, AxiosResponse, Canceler as AxiosCanceler } from 'axios'
import { CreateHttpOptions, RequestConfig, ContentTypeEnum, UploadFileParams } from './types'
import axios from 'axios'
import Canceler from './Canceler'

const canceler = new Canceler()

class Http {
  private readonly axiosInstance: AxiosInstance
  private readonly options: CreateHttpOptions

  constructor(options: CreateHttpOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  getCanceler(): Canceler {
    return canceler
  }

  get<T = any>(config: RequestConfig) {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: RequestConfig) {
    return this.request<T>({ ...config, method: 'POST' })
  }

  put<T = any>(config: RequestConfig) {
    return this.request<T>({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: RequestConfig) {
    return this.request<T>({ ...config, method: 'DELETE' })
  }

  uploadFile<T = any>(params: UploadFileParams, config: RequestConfig) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data![key])
      })
    }

    return this.request<T>({
      ...config,
      data: formData,
      method: 'POST',
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA
      }
    })
  }

  request<T = any>(config: RequestConfig & { requestOptions: { isReturnNativeResponse: true } }): Promise<AxiosResponse<T>>
  request<T = any>(config: RequestConfig): Promise<T>
  request(config: RequestConfig) {
    const { beforeRequestHook, requestSuccessHook, requestFailHook } = this.options.hooks || {}
    const requestOptions = Object.assign({}, this.options.requestOptions, config.requestOptions)
    if (beforeRequestHook) {
      config = beforeRequestHook(config, requestOptions)
    }
    if (!requestOptions.ignoreCancel) {
      canceler.addPending(config)
      requestOptions.cancelExecutor && requestOptions.cancelExecutor(canceler.getCanceler(config) as AxiosCanceler)
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(config)
        .then((response) => {
          if (requestSuccessHook) {
            try {
              const ret = requestSuccessHook(response, { ...requestOptions })
              if (response.data?.code === '0' || response.data?.code === '030100000' || config.responseType === 'blob') {
                resolve(ret)
              } else {
                reject(ret)
              }
            } catch (err) {
              reject(err)
            }
            return
          }

          resolve(response.data)
        })
        .catch((e) => {
          if (requestFailHook) {
            reject(requestFailHook(e, requestOptions))
            return
          }
          reject(e)
        })
        .finally(() => {
          canceler.removePending(config)
        })
    })
  }
}

export default Http
