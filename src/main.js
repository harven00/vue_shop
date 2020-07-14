import Vue from 'vue'
import App from './App.vue'

import router from './router'
import './css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios




Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
