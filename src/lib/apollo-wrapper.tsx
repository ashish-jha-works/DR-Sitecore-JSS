'use client';

import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from './apollo-client';

export default function ApolloWrapper({ children }: any) {
  const client = createApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
