import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import HistoryResolver from './history.resolver';

const resolvers = [UserResolver, HomeResolver, HistoryResolver] as const;

export default resolvers;
