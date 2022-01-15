/*
 * @Author: your name
 * @Date: 2021-08-12 20:05:30
 * @LastEditTime: 2021-08-15 14:28:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manage-fe\src\utils\request.js
 */
// axios二次封装
import axios from 'axios'
import config from './../config'
import { ElMessage } from 'element-plus'
import router from '../router'

import storage from './storage'

const TOKEN_INVALID = 'Token认证失败，请重新登录';
const NETWORK_ERROR = '网络请求异常，请稍后重试';

// 创建axios实例对象，添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
    // TO-DO
    const headers = req.headers;
    // console.log(req);
    const { token = "" } = storage.getItem('userInfo') || {};

    // token检测
    if (!headers.Authorization) headers.Authorization = 'Bearer ' + token;

    return req;
})

// 响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    // 成功返回数据
    if (code === 200) {
        return data;
    }
    // 登录失败 跳转到登录页面
    // token失效
    else if (code === 50001) {
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 2000)

        return Promise.reject(TOKEN_INVALID)
    }
    // 网络报错
    else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

// 请求的核心函数
function request (options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }


    let isMock = config.mock
    // 设置局部mock
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock;
    }


    // 防止线上使用mockApi
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi
    }
    else {
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
    }

    return service(options)
}

['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

// 获取权限数据
request['getPermissionList'] = () => {
    return request({
        url: '/users/getPermissionList',
        method: 'get',
        data: {},
        mock: false
    })
}

export default request;