import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import schema from '../../lib/graphql/schema';

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export default async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    const apolloServer = new ApolloServer({
      schema,
      context: (context) => context,
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
