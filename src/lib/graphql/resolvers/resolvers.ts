import UserResolver from './user.resolver';
import HomeResolver from './home.resolver';
import HistoryResolver from './history.resolver';
import TaskTypeResolver from './tasktype.resolver';
import TaskResolver from './task.resolver';
import TaskSeriesResolver from './taskseries.resolver';
import TaskReceiptResolver from './taskreceipt.resolver';
import UserStatisticsResolver from './statistics/userstatistics.resolver';
import HomeStatisticResolver from './statistics/homestatistic.resolver';

const resolvers = [
  UserResolver,
  HomeResolver,
  HistoryResolver,
  TaskTypeResolver,
  TaskResolver,
  TaskSeriesResolver,
  TaskReceiptResolver,
  HomeStatisticResolver,
  UserStatisticsResolver,
] as const;

export default resolvers;
