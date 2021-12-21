import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import { resolvers } from './resolvers/resolvers';

const schema = buildSchemaSync({
  resolvers: resolvers,
  emitSchemaFile: true,
});

export default schema;
