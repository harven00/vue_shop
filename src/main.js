import Vue from 'vue'
import App from './App.vue'

import router from './router'
import './css/global.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import treetable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table',treetable)
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
