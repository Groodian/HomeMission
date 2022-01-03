import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';

const resolvers = [UserResolver, HomeResolver] as const;

export default resolvers;
