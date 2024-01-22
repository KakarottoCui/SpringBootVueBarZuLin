/**
 * @author NuoMi （不想保留author可删除）
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { authentication, loginInterception, progressBar, recordRoute, routesWhiteList } from '@/config'
import common from '@/utils/commonRequest'


VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeResolve(async (to, from, next) => {
  if (progressBar) VabProgress.start()
  let hasToken = false;//store.getters['user/accessToken']

  let user = common.getUserInfo();
  if (user) {
    hasToken = true;
  }
  // if (!loginInterception) hasToken = true
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      if (progressBar) VabProgress.done()
    } else {
      const hasPermissions = store.getters['user/permissions'] && store.getters['user/permissions'].length > 0
      if (hasPermissions) {
        next()
      } else {
        try {
          let permissions
          if (!loginInterception) {
            let pow = 'none';
            if(user.type == 1)
              pow = 'admin';
            if(user.type == 2)
              pow = 'editor';
            //settings.js loginInterception为false时，创建虚拟权限
            await store.dispatch('user/setPermissions', [pow])
            permissions = [pow]
          } else {
            permissions = await store.dispatch('user/getUserInfo')
          }

          let accessRoutes = []
          if (authentication === 'intelligence') {
            accessRoutes = await store.dispatch('routes/setRoutes', permissions)
          } else if (authentication === 'all') {
            accessRoutes = await store.dispatch('routes/setAllRoutes')
          }
          accessRoutes.forEach((item) => {
            router.addRoute(item)
          })
          next({ ...to, replace: true })
        } catch {
          await store.dispatch('user/resetAccessToken')
          if (progressBar) VabProgress.done()
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // if (recordRoute) {
      //   next(`/login?redirect=${to.path}`)
      // } else {
      //   next('/login')
      // }
      next({ path: '/nmCar' });
      if (progressBar) VabProgress.done()
    }
  }
  document.title = getPageTitle(to.meta.title)
})
router.afterEach(() => {
  if (progressBar) VabProgress.done()
})
