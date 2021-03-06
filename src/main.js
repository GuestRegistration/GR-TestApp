import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueIntercom from 'vue-intercom'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
// import _apollo from './apollo'
import config from './config';
import filters from './plugins/filters'

Vue.config.productionTip = false

// const apollo = _apollo();
 
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

if(config.intercom.app_id) {
  Vue.use(VueIntercom, { appId: config.intercom.app_id });
}

Vue.prototype.$eventHub = new Vue(); // Global event bus

Vue.mixin({ methods: { 
  url: (path) => `${config.app.url}${path}`
 }});

 Vue.use(filters);

new Vue({
  router,
  store,
  vuetify,
  // apolloProvider: apollo.provider,
  render: h => h(App)
}).$mount('#app')
