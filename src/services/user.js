//import { LOGIN, USER_INFO } from '@/services/api'
import request, { METHOD } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
async function login (name = "", password = "") {
  // return request(LOGIN, METHOD.POST, {
  //   name: name,
  //   password: password
  // })
  return request({
    url: '/login',
    method: METHOD.POST,
    data: { name, password }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

async function getInfo (parameter) {
  // return request(USER_INFO, METHOD.GET, {
  // })
  return request({
    url: '/user/info',
    method: METHOD.GET,
    params: parameter
  })
}

async function getCurrentUserNav (parameter) {
  // return request("/user/nav", METHOD.GET, {
  //   token
  // })

  return request({
    url: "/user/nav",
    method: METHOD.GET,
    params: parameter
  })
}

/**
 *  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
 */

export { login, getInfo, getCurrentUserNav }
