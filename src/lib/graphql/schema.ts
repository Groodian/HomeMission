import 'reflect-metadata';
import { buildSchemaSync } from 'type-graphql';
import resolvers from './resolvers/resolvers';

const schema = buildSchemaSync({
  resolvers,
  emitSchemaFile: true,
});

export default schema;
