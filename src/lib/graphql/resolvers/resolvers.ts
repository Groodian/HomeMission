import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import TaskTypeResolver from './tasktype.resolver';
import TaskResolver from './task.resolver';
import TaskSeriesResolver from './taskseries.resolver';
import TaskReceiptResolver from './taskreceipt.resolver';
import UserStatisticsResolver from './statistics/userstatistics.resolver';
import HomeStatisticsResolver from './statistics/homestatistics.resolver';
import HistoryResolver from './history.resolver';

const resolvers = [
  UserResolver,
  HomeResolver,
  TaskTypeResolver,
  TaskResolver,
  TaskSeriesResolver,
  TaskReceiptResolver,
  HomeStatisticsResolver,
  UserStatisticsResolver,
  HistoryResolver,
] as const;

export default resolvers;
