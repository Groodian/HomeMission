import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import TaskTypeResolver from './tasktype.resolver';
import TaskResolver from './task.resolver';
import TaskSeriesResolver from './taskseries.resolver';

const resolvers = [
  UserResolver,
  HomeResolver,
  TaskTypeResolver,
  TaskResolver,
  TaskSeriesResolver,
] as const;

export default resolvers;
