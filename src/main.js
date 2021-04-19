import Vue from 'vue'
import VueMeta from 'vue-meta'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import _apollo from './apollo'
import config from './config';

Vue.config.productionTip = false

const apollo = _apollo();
 
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

Vue.prototype.$eventHub = new Vue(); // Global event bus
Vue.mixin({ methods: { 
  url: (path) => `${config.app.url}${path}`
 }});

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: apollo.provider,
  render: h => h(App)
}).$mount('#app')
