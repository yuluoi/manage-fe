
import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';

import storage from './utils/storage';
import api from './api/index';
import request from './utils/request';

import App from './App.vue'
import router from './router'
import store from './store'


console.log('环境变量=>', import.meta.env);

const app = createApp(App);

// 自定义全局指令 v-has
app.directive('has', {
    // 里面填写生命周期函数
    beforeMount (el, binding) {
        // 获取按钮权限
        let actionList = storage.getItem('actionList')
        let value = binding.value
        // hasOwnProperty 对象
        // includes 数组
        // 判断列表中是否包含有对应按钮权限标识
        let hasPermission = actionList.includes(value)
        // 没有的话 设置按钮隐藏 移除dom节点
        if (!hasPermission) {
            el.style = 'display:none;';
            // 移除节点 domApi
            setTimeout(() => {
                el.parentNode.removeChild(el)
            }, 0)
        }
    }
})

// globalProperties全局挂在对象 类似.prototype
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(store).use(router).use(ElementPlus, { size: 'small' }).mount('#app')
