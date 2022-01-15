/*
 * @Author: your name
 * @Date: 2021-08-15 14:30:11
 * @LastEditTime: 2021-08-15 15:12:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manage-fe\src\store\index.js
 */
/**
 * Vuex状态管理
 * @description: 
 * @param {*}
 * @return {*}
 */

import { createStore } from 'vuex';

import mutations from './mutations';
import storage from '../utils/storage';

const state = {
    // 获取用户信息
    userInfo: storage.getItem("userInfo") || { },
    menuList: storage.getItem("menuList") || [],
    actionList: storage.getItem("actionList") || [],
    noticeCount: 0
}


export default createStore({
    state,
    mutations
})