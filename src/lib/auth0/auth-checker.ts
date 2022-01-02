import { getSession } from '@auth0/nextjs-auth0';
import { AuthChecker } from 'type-graphql';
import { ContextType } from '../graphql/apollo-server';

const auth0AuthChecker: AuthChecker<ContextType> = ({ context }) => {
  const session = getSession(context.req, context.res);
  return session ? true : false;
};

export default auth0AuthChecker;
