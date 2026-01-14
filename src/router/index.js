import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
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
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
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
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@/views/study/calendar'),
        meta: { title: '学习记录', icon: 'table', roles: ['01'] }
      }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export function resetRouter() {
  // Vue Router 4 removes 'matcher', so we cannot reset it easily.
  // Instead, typically valid to reload page or manage added routes manually.
  // For now, we leave this as no-op or you can add logic to removeRoute().
  console.warn('resetRouter is not fully supported in Vue Router 4 migration yet.')
}

export default router
