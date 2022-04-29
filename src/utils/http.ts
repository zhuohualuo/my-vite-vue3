/*
 * @Descripttion: 
 * @Date: 2022-04-27 14:51:54
 * @LastEditors: luozhuohua
 * @LastEditTime: 2022-04-28 18:40:31
 */

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const baseURL = ''
const service = axios.create({
    baseURL,
    timeout: 1000,
})

// 发起请求之前的拦截器
service.interceptors.request.use( 
    (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 如果有token 就携带token
    const token = window.localStorage.getItem('accessToken')
    if(token) {
        config.headers!.Authorization = token
    }
    console.log('axios拦截器----');
    return config;
  }, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(function (response: AxiosResponse) {
    // 对响应数据做点什么
    if(response.status !== 200) {
        return Promise.reject(new Error(response.data.msg || 'ERROR'))
    }
    return response.data;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
)

export default service