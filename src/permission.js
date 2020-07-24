import router from './router'
import store from './store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { title } from '@/config'
import { ACCESS_TOKEN } from '@/store/mutation-types'
//import { getInfo } from '@/services'


const whiteList = ['/login', '/register', '/registerResult'] // no redirect whitelist
const loginRoutePath = '/login'
const defaultRoutePath = '/dashboard/workplace'



router.beforeEach((to, from, next) => {
  to.meta && (typeof to.meta.title !== 'undefined' && `to.meta.title- ${title}`)
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
    } else {
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store.dispatch('GetInfo')
          .then(res => {
            const roles = res.result && res.result.role
            //console.log('--roles::', roles)
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              //console.log('--routers::', store.getters.addRouters)
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true })
              } else {
                // 跳转到目的路由
                next({ path: redirect })
              }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            // store.dispatch('Logout').then(() => {
            //   next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            // })
            console.log("logout...")
            //next({ path: loginRoutePath, query: { redirect: to.fullPath } })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
    }
  }
})

router.afterEach(() => {
  //NProgress.done() // finish progress bar
})
