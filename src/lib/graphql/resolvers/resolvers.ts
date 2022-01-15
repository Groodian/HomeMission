import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import TaskTypeResolver from './tasktype.resolver';

const resolvers = [UserResolver, HomeResolver, TaskTypeResolver] as const;

export default resolvers;
