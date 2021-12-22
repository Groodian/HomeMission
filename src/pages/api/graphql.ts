import { NextApiRequest, NextApiResponse } from 'next';
import getApolloServerHandler from '../../lib/graphql/apollo-server';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const apolloServerHandler = await getApolloServerHandler();
  return apolloServerHandler(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
