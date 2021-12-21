import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import schema from '../../lib/graphql/schema';

let apolloServerHandler: (req: any, res: any) => Promise<void>;

export async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    const apolloServer = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    await apolloServer.start();
    apolloServerHandler = apolloServer.createHandler({ path: '/api/graphql' });
  }
  return apolloServerHandler;
}
