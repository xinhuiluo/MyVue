import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'


// 配置请求根路径  http://localhost:8080
axios.defaults.baseURL = window.gurl.SERVICE_CONTEXT_PATH;
// 请求添加token验证
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios;


Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
