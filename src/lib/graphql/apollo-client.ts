import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { GraphQLSchema } from 'graphql';
import { IncomingMessage, ServerResponse } from 'http';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

export type ResolverContext = {
  req?: IncomingMessage;
  res?: ServerResponse;
};

function createIsomorphLink(
  schema: GraphQLSchema,
  context: ResolverContext = {}
) {
  if (typeof window === 'undefined') {
    return new SchemaLink({ schema, context });
  } else {
    return new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    });
  }
}

function createApolloClient(schema: GraphQLSchema, context?: ResolverContext) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphLink(schema, context),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  schema: GraphQLSchema,
  initialState: any = null,
  // Pages with Next.js data fetching methods, like `getStaticProps`, can send
  // a custom context which will be used by `SchemaLink` to server render pages
  context?: ResolverContext
) {
  const _apolloClient = apolloClient ?? createApolloClient(schema, context);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(schema: GraphQLSchema, initialState: any) {
  return useMemo(() => initializeApollo(schema, initialState), [initialState]);
}
