import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
//import axios from 'axios'
import '@/mock'
import store from './store'
import PouchDB from 'pouchdb'
import 'animate.css/source/animate.css'
import VueI18n from 'vue-i18n'
import Plugins from '@/plugins'
import bootstrap from './core/bootstrap'
import { VueAxios } from '@/utils/request'
import './permission' // permission control
import '@/utils/filter' 
import PermissionHelper from '@/utils/helper/permission'

Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Antd)
Vue.use(VueI18n)
Vue.use(Plugins)
// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(PermissionHelper)

const i18n = new VueI18n({
  locale: 'CN',
  fallbackLocale: 'US',
  silentFallbackWarn: true
})


new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created: bootstrap,
  mounted () {
    let db = new PouchDB('adminDb')
    db.get('currUser').then(doc => {
      this.$store.commit('account/setUser', doc.user)
    })
  },
}).$mount('#app')
