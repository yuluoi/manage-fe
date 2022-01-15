/*
 * @Author: your name
 * @Date: 2021-08-15 14:30:30
 * @LastEditTime: 2021-08-15 14:54:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \manage-fe\src\store\mution.js
 */
/**
 * Mutations业务层提交
 * @description: 
 * @param {*}
 * @return {*}
 */
import storage from '../utils/storage'

// 同步
export default {
    saveUserInfo (state, userInfo) {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo)
    },
    saveUserMenu (state, menuList) {
        state.menuList = menuList;
        storage.setItem('menuList', menuList)
    },
    saveUserAction (state, actionList) {
        state.actionList = actionList;
        storage.setItem('actionList', actionList)
    },
    saveNoticeCount (state, noticeCount) {
        state.noticeCount = noticeCount;
        storage.setItem('noticeCount', noticeCount)
    },

}