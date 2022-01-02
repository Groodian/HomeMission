import { getSession } from '@auth0/nextjs-auth0';
import { createParamDecorator } from 'type-graphql';
import { ContextType } from '../graphql/apollo-server';

export default function CurrentSession() {
  return createParamDecorator<ContextType>(({ context }) =>
    getSession(context.req, context.res)
  );
}
