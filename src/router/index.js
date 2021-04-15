import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
    },

    {
        path: '/nimbus',
        component: Layout,
        redirect: '/nimbus/worktime_weekly',
        name: 'Nimbus',
        meta: { title: 'Nimbus', icon: 'example' },
        children: [
            {
                path: 'worktime_weekly',
                name: 'worktime_weekly',
                component: () => import('@/views/worktime/weekly'),
                meta: { title: '工数統計（週）', icon: 'table' }
            },
            {
                path: 'worktime_monthly',
                name: 'worktime_monthly',
                component: () => import('@/views/worktime/monthly'),
                meta: { title: '工数統計（月）', icon: 'table' }
            },
            {
                path: 'worktime_check',
                name: 'worktime_check',
                component: () => import('@/views/worktime/check'),
                meta: { title: 'エピックチェック', icon: 'table' }
            }
        ]
    },

    {
        path: '/tools',
        component: Layout,
        redirect: '/tools/dictionary',
        name: 'Tools',
        meta: { title: 'ツール', icon: 'example' },
        children: [
            {
                path: 'dictionary',
                name: 'dictionary',
                component: () => import('@/views/dictionary/index'),
                meta: { title: '辞書', icon: 'table' }
            }
        ]
    }
]

export const asyncRoutes = [
    {
        path: '/study',
        component: Layout,
        redirect: '/study/books',
        name: 'Study',
        meta: { title: '学習管理', icon: 'example', roles: ['01'] },
        children: [
            {
                path: 'books',
                name: 'books',
                component: () => import('@/views/study/books'),
                meta: { title: '生詞本', icon: 'table', roles: ['01'] }
            },
            {
                path: 'daily',
                name: 'daily',
                component: () => import('@/views/study/daily'),
                meta: { title: '每日任务', icon: 'table', roles: ['01'] }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;

    // 動的メニューのロール情報を初期化する。
    for (let i = 0; i < asyncRoutes.length; i++) {
        let route = asyncRoutes[i];
        if (route.meta && route.meta.roles) {
            route.meta.roles = [];
        }
        if (route.children) {
            for (let j = 0; j < route.children.length; j++) {
                let child = route.children[j];
                if (child.meta && child.meta.roles) {
                    child.meta.roles = [];
                }
            }
        }
    }
}

export default router
