import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { NextApiRequest, NextApiResponse } from 'next';
import schema from '../../lib/graphql/schema';

export type ContextType = {
  req: NextApiRequest;
  res: NextApiResponse;
};

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export default async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    const apolloServer = new ApolloServer({
      schema,
      context: (context: ContextType) => context,
      plugins:
        process.env.NODE_ENV === 'production'
          ? [ApolloServerPluginLandingPageDisabled()]
          : [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await apolloServer.start();
    apolloServerHandler = apolloServer.createHandler({ path: '/api/graphql' });
  }
  return apolloServerHandler;
}
