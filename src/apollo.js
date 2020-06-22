
import Vue from 'vue'
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
// import firebase from './firebase'
import gr_tokens from './tokens'

Vue.use(VueApollo);

export default () => {
    const tokens = gr_tokens()
    // Create an http link:
    const httpLink = new HttpLink({
    uri: 'https://us-central1-guestregistration-4140a.cloudfunctions.net/api',
    // uri: 'http://localhost:5000/guestregistration-4140a/us-central1/api',
    fetch,
    headers: {
        'gr-client-token': tokens.client,
        'gr-user-token': tokens.user
      }
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
  
    const provider = new VueApollo({
    defaultClient: client,
  })

  return {client, provider}
}