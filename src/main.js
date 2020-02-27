import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.config.productionTip = false
Vue.use(VueApollo);

const getHeaders = () => {
  const headers = {};
   const token = window.localStorage.getItem('apollo-token');
   if (token) {
     headers.authorization = `Bearer ${token}`;
   }
   return headers;
 };
 // Create an http link:
 const httpLink = new HttpLink({
   uri: 'https://us-central1-guestregistration-4140a.cloudfunctions.net/api',
   fetch,
   headers: getHeaders()
 });

 // Error Handling
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
          console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
      )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

 const client = new ApolloClient({
   link: errorLink.concat(httpLink),
   cache: new InMemoryCache({
     addTypename: true
   })
 });

 const apolloProvider = new VueApollo({
  defaultClient: client,
})

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
