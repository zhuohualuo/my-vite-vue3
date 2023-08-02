import { AxiosRequestConfig, AxiosResponse, AxiosError, Canceler as AxiosCanceler } from 'axios'

// eslint-disable-next-line no-shadow
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

export interface RequestResult<T = any> {
  data: T
  code?: string | number
  success?: boolean
  msg?: string
  message?: string
  status?: number
}

// 请求传参方式
export type RequestType = 'json' | 'formUrlencoded' | 'formData'

/**
 * @description 错误提示等级
 * - none: 错误不提示
 * - business: 只在接口返回格式符合RequestResult且 code !== 0 || code !== '0' || success === true 时提示， 具体判断规则可在requestSuccessHook中自定义
 * - http: 只在 http状态码不为200且异常时提示
 * - all: 请求异常即提示
 * */
export type ErrorMessageLevel = 'none' | 'business' | 'http' | 'all'

// 错误提示弹窗的模式
export type ErrorMessageMode = 'toast' | 'dialog' | 'notify'

// 错误提示弹框方法
export type ErrorMessageFunc = (errorMessage: string, errorMessageMode?: ErrorMessageMode) => void

// 自定义的请求形式配置
export interface RequestOptions {
  ignoreCancel?: boolean // 取消请求时会被忽略
  cancelExecutor?: (canceler: AxiosCanceler) => void // 取消请求的executor,详见axios文档
  isReturnNativeResponse?: boolean // 是否返回原生的response
  isStandardResult?: boolean // 接口返回格式是否标准 即返回符合 RequestResult 格式
  requestType?: RequestType
  errorMessageLevel?: ErrorMessageLevel
  errorMessageMode?: ErrorMessageMode
  errorMessageFunc?: ErrorMessageFunc
}

// 请求拦截钩子配置
export interface HttpHooks {
  /**
   * @description 请求前的钩子
   */
  beforeRequestHook?: (config: AxiosRequestConfig, requestOptions: RequestOptions) => AxiosRequestConfig
  /**
   * @description 请求成功的钩子
   */
  requestSuccessHook?: (response: AxiosResponse<any>, requestOptions: RequestOptions) => any
  /**
   * @description 请求失败的钩子
   */
  requestFailHook?: (error: AxiosError, requestOptions: RequestOptions) => AxiosError
}

// 实列初始化配置
export interface CreateHttpOptions extends AxiosRequestConfig {
  hooks?: HttpHooks
  requestOptions?: RequestOptions
}

// 请求配置
export interface RequestConfig extends AxiosRequestConfig {
  requestOptions?: RequestOptions
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: any
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}
