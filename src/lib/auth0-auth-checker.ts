import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthChecker } from 'type-graphql';

interface ContextType {
  req: NextApiRequest;
  res: NextApiResponse;
}

const auth0AuthChecker: AuthChecker<ContextType> = ({ context }) => {
  const session = getSession(context.req, context.res);
  return session ? true : false;
};

export default auth0AuthChecker;
