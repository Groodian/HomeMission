import { Session } from '@auth0/nextjs-auth0';
import CurrentSession from '../../../auth0/current-session';
import databaseConnection from '../../../typeorm/connection';
import { Between } from 'typeorm';
import {
  Arg,
  Authorized,
  FieldResolver,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import User from '../../../../entities/user';
import TaskReceipt from '../../../../entities/taskreceipt';
import UserStatistic from '../../../../entities/statistics/userStatistic';
import DataPoint from '../../../../entities/statistics/dataPoint';
import Helper from '../helper';
import {
  getBlankDataPointsArray,
  getDatesDifference,
} from './statisticsHelper';

type UserAndDataPoints = { user: User | null; dataPoints: DataPoint[] };

@Resolver(UserStatistic)
export default class UserStatisticsResolver
  implements ResolverInterface<UserStatistic>
{
  /**
   * Generate the statistics for all users of home.
   */
  @Authorized()
  @Query(() => [UserStatistic])
  async userStatistics(
    @CurrentSession() session: Session,
    @Arg('start') start: number,
    @Arg('end') end: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (start > end)
      throw Error(
        'Could not create statistic for users because start date must be before end date'
      );

    // create a user-datapoint-tuple for each user
    const userAndDataPointsArrays: UserAndDataPoints[] = home.users.map(
      (user) => ({
        user: user,
        dataPoints: getBlankDataPointsArray(startDate, endDate),
      })
    );

    // create a user-datapoint-tuple for users that are no longer in the home
    const nullDataPoints: DataPoint[] = getBlankDataPointsArray(
      startDate,
      endDate
    );

    try {
      const receipts = await TaskReceipt.find({
        where: {
          relatedHome: home.id,
          completionDate: Between(
            new Date(start - 7 * 24 * 60 * 60 * 1000),
            endDate
          ),
        },
        loadRelationIds: true,
      });

      // iterate through all receipts and attribute appropriate points
      for (const receipt of receipts) {
        // identify who the receipt belongs to and set variable dataPoints to their dataPoints
        const dataPoints =
          userAndDataPointsArrays.filter((e) => receipt.completer === e.user)[0]
            ?.dataPoints || nullDataPoints;

        // get index of receipt completion date in dataPoints array
        const index = getDatesDifference(startDate, receipt.completionDate);

        // add points to dataPoints of that day and the following week
        dataPoints[index]?.addPointsDay(receipt.points);
        for (let i = 0; i < 7; i++)
          dataPoints[index + i]?.addPointsWeek(receipt.points);
      }

      // concatenate user-datapoint-tuples from roommates with user-datapoint-tuple from orphaned receipts, then map into return format
      return userAndDataPointsArrays
        .concat([{ user: null, dataPoints: nullDataPoints }])
        .map((tuple) => new UserStatistic(tuple.user, tuple.dataPoints));
    } catch (e) {
      throw Error('Could not create user statistics for home');
    }
  }

  /**
   * Only load related user if required.
   */
  @FieldResolver(() => User, { nullable: true })
  async user(@Root() userStatistic: UserStatistic) {
    return userStatistic.user ? await User.findOne(userStatistic.user) : null;
  }
}