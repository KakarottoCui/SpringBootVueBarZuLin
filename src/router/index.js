/**
 * @author NuoMi （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/nmCar',
    name: 'nmCar',
    component: () => import('@/views/NmCarRental'),
    hidden: true,
  },
  {
    path: '/carInfo',
    name: 'carInfo',
    component: () => import('@/views/carInfo'),
    hidden: true,
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/cart'),
    hidden: true,
  },{
    path: '/myOrder',
    name: 'myOrder',
    component: () => import('@/views/myOrder'),
    hidden: true,
  },{
    path: '/notice',
    name: 'notice',
    component: () => import('@/views/notice'),
    hidden: true,
  },


]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },

  {
    path: '/carManager',
    component: Layout,
    redirect: 'noRedirect',
    name: 'car',
    meta: {
      title: '车辆管理',
      icon: 'car',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'car',
        name: 'Car',
        component: () => import('@/views/carManager/carManager'),
        meta: {
          title: '车辆管理'
        },
        children: null,
      },{
        path: 'carEdit',
        name: 'CarEdit',
        component: () => import('@/views/carManager/carEdit'),
        meta: {
          title: '车辆编辑'
        },
        children: null,
        hidden: true
      }
      // {
      //   path: 'goodsList',
      //   name: 'GoodsList',
      //   component: () => import('@/views/mall/goodsList/index'),
      //   meta: {
      //     title: '商品列表',
      //     noKeepAlive: true,
      //   },
      // },
    ],
  },

  {
    path: '/nmOrder',
    component: Layout,
    redirect: 'noRedirect',
    name: 'nmOrder',
    meta: {
      title: '订单管理',
      icon: 'photo-video',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'nmOrder',
        name: 'NmOrder',
        component: () => import('@/views/orderManager/orderManager'),
        meta: {
          title: '订单管理'
        },
        children: null,
      }
    ],
  },

  {
    path: '/noticeManager',
    component: Layout,
    redirect: 'noRedirect',
    name: 'noticeManager',
    meta: {
      title: '公告管理',
      icon: 'photo-video',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/noticeManager/noticeManager'),
        meta: {
          title: '公告管理'
        },
        children: null,
      }
    ],
  },

  {
    path: '/carouselManager',
    component: Layout,
    redirect: 'noRedirect',
    name: 'carousel',
    meta: {
      title: '轮播图管理',
      icon: 'photo-video',
      permissions: ['admin'],
    },

    children: [
      {
        path: 'carousel',
        name: 'Carousel',
        component: () => import('@/views/carouselManager/carouselManager'),
        meta: {
          title: '轮播图管理'
        },
        children: null,
      }
    ],
  },
  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */
  {
    path: '/error',
    component: EmptyLayout,
    redirect: 'noRedirect',
    name: 'Error',
    meta: { title: '错误页', icon: 'bug' },
    hidden:true,
    children: [
      {
        path: '401',
        name: 'Error401',
        component: () => import('@/views/401'),
        meta: { title: '401' },
      },
      {
        path: '404',
        name: 'Error404',
        component: () => import('@/views/404'),
        meta: { title: '404' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
