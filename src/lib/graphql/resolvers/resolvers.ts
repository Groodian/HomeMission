import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import TaskTypeResolver from './tasktype.resolver';
import TaskResolver from './task.resolver';

const resolvers = [
  UserResolver,
  HomeResolver,
  TaskTypeResolver,
  TaskResolver,
] as const;

export default resolvers;
