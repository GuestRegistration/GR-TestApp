import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import _apollo from './apollo'

Vue.config.productionTip = false

const apollo = _apollo();

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: apollo.provider,
  render: h => h(App)
}).$mount('#app')
