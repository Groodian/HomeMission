import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import auth0AuthChecker from '../auth0/auth-checker';
import resolvers from './resolvers/resolvers';

const schema = buildSchemaSync({
  resolvers,
  emitSchemaFile: true,
  authChecker: auth0AuthChecker,
});

export default schema;
