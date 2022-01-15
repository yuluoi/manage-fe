/**
 * api管理
 * @description: 
 * @param {*}
 * @return {*}
 */

import request from "../utils/request"

export default {
    // 登录页面
    // 登录
    login (params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            mock: false
        })
    },

    // user页面
    // 通知数量
    noticeCount (params) {
        return request({
            url: '/leave/count',
            method: 'get',
            data: { },
            mock: false
        })
    },
    // 菜单列表
    menuList (params) {
        return request({
            url: '/menu/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 获取权限数据
    getPermissionList () {
        return request({
            url: '/users/getPermissionList',
            method: 'get',
            data: { },
            mock: false
        })
    },
    // 用户列表
    userList (params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 全部用户列表
    userAllList () {
        return request({
            url: '/users/all/list',
            method: 'get',
            data: { },
            mock: false
        })
    },
    // 用户删除
    userDelete (params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 获取用户角色列表
    roleAllList () {
        return request({
            url: '/roles/allList',
            method: 'get',
            data: { },
            mock: false
        })
    },
    // 获取部门列表数据
    deptList (params) {
        return request({
            url: '/dept/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 用户创建/编辑
    userSubmit (params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },



    // menu页面
    // 菜单 提交/编辑/删除
    menuSubmit (params) {
        return request({
            url: '/menu/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },

    // role页面
    roleList (params) {
        return request({
            url: '/roles/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 角色 创建/ 编辑/ 删除
    roleOperate (params) {
        return request({
            url: '/roles/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },
    // 更新权限
    updatePermission (params) {
        return request({
            url: '/roles/update/permission',
            method: 'post',
            data: params,
            mock: false
        })
    },

    // dept页面
    // 部门操作：新增编辑删除
    deptOperate (params) {
        return request({
            url: '/dept/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },

    // leave页面
    // 获取审批列表
    applyList (params) {
        return request({
            url: '/leave/list',
            method: 'get',
            data: params,
            mock: false
        })
    },
    // 操作按钮：新增 删除
    leaveOperate (params) {
        return request({
            url: '/leave/operate',
            method: 'post',
            data: params,
            mock: false
        })
    },

    // Approve页面
    // 审核：通过/驳回
    leaveApprove (params) {
        return request({
            url: '/leave/approve',
            method: 'post',
            data: params,
            mock: false
        })
    }
}