// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueProgressBar from 'vue-progressbar'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/global.css';

import App from './App'
import router from './router'
import store from './store'
import api from './api'

Vue.config.productionTip = false

localStorage.setItem('debug', 'leancloud*') // 开启调试模式


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.needLogin)) {
    if (!store.state.user) {
      // Vue.prototype.$message.error("请先登录");
      app.$message.error("请先登录");
      next({
        path: '/signIn'
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

Vue.mixin({
  beforeCreate() {
    if (!this.$api) {
      this.$api = api;
    }
  }
});


const options = {
  color: '#20a0ff',
  failedColor: '#874b4b',
  thickness: '4px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(VueProgressBar, options)

Vue.use(ElementUI)

const user = api.SDK.User.current()
console.log(user)
if (user) {
  store.commit('setUser', user);
}

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  // template: '<App/>',
  // components: { App }
  render: h => h(App)
})
