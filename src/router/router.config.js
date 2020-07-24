// eslint-disable-next-line


import Login from '@/pages/login/Login'



// const RouteView = {
//   name: 'RouteView',
//   render: (h) => h('router-view')
// }


/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    name: '登录页',
    component: Login
  }

]
