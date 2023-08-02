import Http from './Http'
import { HttpHooks, ErrorMessageFunc, ContentTypeEnum, RequestResult } from './types'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import Auth from '@/components/Auth/index.vue'
import Agreement from '@/components/Auth/agreement.vue'
import router from '@/router/index'
import qs from 'qs'
import { h } from 'vue'

const _errorMessageFunc: ErrorMessageFunc = (errorMessage, errorMessageMode) => {
  if (errorMessageMode === 'toast') {
    ElMessage.error(errorMessage)
  }
  if (errorMessageMode === 'dialog') {
    ElMessageBox.alert(errorMessage, '提示', {
      confirmButtonText: '确定'
    })
  }
  if (errorMessageMode === 'notify') {
    ElNotification({
      title: '提示',
      message: errorMessage
    })
  }
}

const hooks: HttpHooks = {
  beforeRequestHook(config, requestOptions) {
    const { requestType } = requestOptions
    config.headers = config.headers || {}
    if (requestType === 'json') config.headers['Content-Type'] = ContentTypeEnum.JSON
    if (requestType === 'formUrlencoded') config.headers['Content-Type'] = ContentTypeEnum.FORM_URLENCODED
    if (requestType === 'formData') config.headers['Content-Type'] = ContentTypeEnum.FORM_DATA
    if (localStorage.getItem('Authorization') && !/(\/captcha)|(\/login\/resetPwd)/g.test(config.url as any)) {
      config.headers['Authorization'] = localStorage.getItem('Authorization') || ''
    }

    const data = config.data || config.params || {}
    if (config.method?.toUpperCase() === 'GET') {
      config.params = data
    } else {
      if (requestType === 'json') config.data = data
      if (requestType === 'formUrlencoded') config.data = qs.stringify(config.data, { arrayFormat: 'brackets' })
      if (requestType === 'formData') {
        const formData = new FormData()
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key])
        })
        config.data = formData
      }
    }
    return config
  },
  requestSuccessHook(response, requestOptions) {
    const { isReturnNativeResponse, isStandardResult, errorMessageLevel = 'all', errorMessageMode, errorMessageFunc } = requestOptions
    if (isReturnNativeResponse) return response
    if (isStandardResult) {
      const res: RequestResult = response.data
      // 验证码成功code为030100000
      if (res.code === '0' || res.code === 0 || res.success || res.code === '030100000') {
        return res.data
      } else {
        const errMsg = res.msg || res.message || '请求错误'
        if (res.code === '401' || res.status === 401) {
          ElMessage.warning('登录信息过期，请您重新登录')
          localStorage.removeItem('Authorization')
          localStorage.removeItem('userInfo')
          setTimeout(() => {
            router.replace('/login')
            location.reload()
          }, 1000)
          return res
        } else if (res.code === '10001') {
          ElMessage.warning('权限已修改请重新登录')
          setTimeout(() => {
            router.replace('/403')
          }, 1000)
          return res
        } else if (res.code === '030201004') {
          // @ts-ignore
          window.SHOW_SMS(res.data.bizType)
          return res
        } else if (res.code === '030200022') {
          ElMessageBox({
            title: '实名认证提醒',
            showConfirmButton: false,
            closeOnClickModal: false,
            showCancelButton: false,
            showClose: false,
            closeOnPressEscape: false,
            customClass: 'auth-tip-wrap',
            message: h(Auth)
          })
          return res
        } else if (res.code === '030200023') {
          ElMessageBox({
            title: '在线协议签署',
            showConfirmButton: false,
            closeOnClickModal: false,
            showCancelButton: false,
            showClose: false,
            closeOnPressEscape: false,
            customClass: 'auth-tip-wrap',
            message: h(Agreement)
          })
          return res
        }
        if (errorMessageFunc && ['all', 'business'].includes(errorMessageLevel)) {
          errorMessageFunc(errMsg, errorMessageMode)
        }
        return res
      }
    } else {
      console.log(response.data)
      return response.data
    }
  },
  requestFailHook(error, requestOptions) {
    const { errorMessageLevel = 'all', errorMessageMode, errorMessageFunc } = requestOptions
    let errMsg = '请求失败'
    if (error.response) {
      switch (Number(error.response.status)) {
        case 401:
        case 403:
          errMsg = '登录信息过期'
          break
        case 404:
          errMsg = '网络请求不存在'
          break
        default:
          if (error.response.data?.message) {
            errMsg = error.response.data.message
          }
      }
    } else if (error.message?.includes('timeout')) {
      errMsg = '请求超时！请检查网络是否正常'
    } else if ((error as any).__CANCEL__) {
      console.log('请求已取消', error)
      errMsg = '请勿频繁操作'
    }
    if (errorMessageFunc && ['all', 'http'].includes(errorMessageLevel)) {
      errorMessageFunc(errMsg, errorMessageMode)
    }

    return error
  }
}

export const http = new Http({
  timeout: 10 * 1000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  hooks,
  requestOptions: {
    ignoreCancel: false,
    isReturnNativeResponse: false,
    isStandardResult: true,
    requestType: 'json',
    errorMessageLevel: 'all',
    errorMessageMode: 'toast',
    errorMessageFunc: _errorMessageFunc
  }
})

export default http
