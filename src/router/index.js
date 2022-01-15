import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Home from '@/components/Home.vue'

import storage from './../utils/storage'
import utils from './../utils/utils'
import API from './../api'
// const API = import.meta.globEager('./../api')
import request from "../utils/request"
const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('@/views/Welcome.vue'),
            },
            /*
            {
                name: 'user',
                path: '/system/user',
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/User.vue'),
            },
            {
                name: 'menu',
                path: '/system/menu',
                meta: {
                    title: '菜单管理'
                },
                component: () => import('@/views/Menu.vue'),
            },
            {
                name: 'role',
                path: '/system/role',
                meta: {
                    title: '角色管理'
                },
                component: () => import('@/views/Role.vue'),
            },
            {
                name: 'dept',
                path: '/system/dept',
                meta: {
                    title: '部门管理'
                },
                component: () => import('@/views/Dept.vue'),
            }
            */
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/Login.vue')
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('@/views/404.vue')
    }

]

const router = createRouter(
    {
        history: createWebHashHistory(),
        routes
    }
)


// 导航守卫

// 动态添加路由
// router.addRoute('home', {
//     name: 'menu',
//     path: '/system/menu',
//     meta: {
//         title: '菜单管理'
//     },
//     component: () => import('@/views/Menu.vue')
// })

// 根据用户拥有的菜单权限 动态遍历出路由
const loadAsyncRoutes = async () => {
    let userInfo = storage.getItem('userInfo') || {}
    if (userInfo.token) {
        // vite 会报错
        // const { menuList } = await API.getPermissionList()
        try {
            let menuList = storage.getItem('menuList') || []
            let routes = utils.generateRoute(menuList)
            routes.map(route => {
                let url = `./../views/${route.component}.vue`;
                route.component = () => import(url)
                router.addRoute('home', route)
            })
        } catch (err) {

        }
    }
}

await loadAsyncRoutes();

// 判断当前地址是否可以访问
function checkPermission (path) {
    // 1.使用router.getRouters()获取全部路由列表 
    // 2..filter(route => route.path == path).length 判断是否拥有path路由
    const hasPermission = router.getRoutes().filter(route => route.path == path).length
    console.log(router.getRoutes());
    console.log(API);
    if (hasPermission) {
        return true
    } else {
        return false
    }
}

// to 到哪 form 来自哪 next 做什么
router.beforeEach((to, form, next) => {
    if (checkPermission(to.path)) {
        document.title = to.meta.title
        next()
    } else {
        next('/404')
    }
})

export default router