import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://countries.trevorblades.com/',
      //   uri: endpoint,
      //   headers: {
      //     Authorization: `Bearer ${apiKey}`,
      //   },
    }),
    cache: new InMemoryCache(),
  });
}
