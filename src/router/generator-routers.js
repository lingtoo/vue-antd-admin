// eslint-disable-next-line
import * as loginService from '@/services/user'
// eslint-disable-next-line
//import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import PageView from '@/layouts/PageView'
import BlankView from '@/layouts/BlankView'
import TabsView from '@/layouts/TabsView'
import RouteView from '@/layouts/RouteView'


// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  //BasicLayout: BasicLayout,
  TabsView,
  BlankView: BlankView,
  RouteView: RouteView,
  PageView: PageView,
  'Exception403': () => import(/* webpackChunkName: "error" */ '@/pages/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "error" */ '@/pages/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "error" */ '@/pages/exception/500'),

  // 你需要动态引入的页面组件
  'Workplace': () => import('@/pages/dashboard/workplace/WorkPlace'),
  'Analysis': () => {
    return import('@/pages/dashboard/analysis/Analysis')
    // const compt = import('@/pages/dashboard/analysis/Analysis')
    // return compt
  },

  'UserList': () => import('@/pages/other/UserList'),
  'RoleList': () => import('@/pages/other/RoleList'),
  'PermissionList': () => import('@/pages/other/PermissionList'),
  'TreeList': () => import('@/pages/other/TreeList'),

  'PageSuccess': () => import('@/pages/result/Success'),


}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  path: '/',
  name: '首页',
  component: 'TabsView',
  redirect: '/dashboard/workplace',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (token) => {
  return new Promise((resolve, reject) => {
    loginService.getCurrentUserNav(token).then(res => {
      //console.log('res', res)
      const { result } = res.data || res
      const menuNav = []
      const childrenNav = []
      //      后端数据, 根级树数组,  根级 PID
      listToTree(result, childrenNav, 0)
      rootRouter.children = childrenNav
      menuNav.push(rootRouter)
      // console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      // console.log('routers', routers)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, hideChildren, icon } = item.meta || {}
    //let cmpt = constantRouterComponents[item.component]
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.component || item.key]) || (() => import(`@/pages/${item.component}`)),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        invisible: show === false  //是否设置了隐藏菜单
      }
    }
    // // 是否设置了隐藏菜单
    // if (show === false) {
    //   currentRouter.meta.invisible = true
    // }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
