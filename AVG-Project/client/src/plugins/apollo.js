import Vue from "vue";
import VueApollo from "vue-apollo";
import {ApolloClient} from "apollo-client";
import {createHttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import {PRISMA_ENDPOINT} from "../../config/entrypoint";
import {setContext} from 'apollo-link-context';
import {LS_TOKEN} from "../../config/constant";

const httpLink = createHttpLink({
  uri: PRISMA_ENDPOINT,
});

const authLink = setContext(async (_, {headers}) => {
  const token = localStorage.getItem(LS_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },

});

Vue.use(VueApollo);

export default new VueApollo({
  defaultClient: apolloClient,
});
