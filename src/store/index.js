import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import setting from './modules/setting'
import permission from './modules/async-router'
import user from './modules/user'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    setting,
    user,
    permission
  },
  getters
})
