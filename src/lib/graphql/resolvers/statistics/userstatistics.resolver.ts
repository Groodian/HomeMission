import { Session } from '@auth0/nextjs-auth0';
import CurrentSession from '../../../auth0/current-session';
import databaseConnection from '../../../typeorm/connection';
import { Between } from 'typeorm';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';
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
export default class UserStatisticsResolver {
  /**
   * Generate the statistics for each user of home.
   * Calculate the sum of points achieved per day and week per user.
   * Include a statistic for users that left the home.
   * @param start The start date of the statistics to generate.
   * @param end The end date of the statistics to generate.
   */
  @Authorized()
  @Query(() => [UserStatistic], {
    description: `Generate the statistics for each user of home.
Calculate the sum of points achieved per day and week per user.
Include a statistic for users that left the home.`,
  })
  async userStatistics(
    @CurrentSession() session: Session,
    // prettier-ignore
    @Arg('start', { description: 'The start date of the statistics to generate.' })
    start: number,
    @Arg('end', { description: 'The end date of the statistics to generate.' })
    end: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session, ['users']);
    const startDate = new Date(start);
    const endDate = new Date(end);

    let taskCompletedByUnknown = false;

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
        const completer = receipt.completer as unknown as string;
        let dataPoints = userAndDataPointsArrays.filter(
          (e) => completer === e.user?.id
        )[0]?.dataPoints;

        if (!dataPoints) {
          taskCompletedByUnknown = true;
          dataPoints = nullDataPoints;
        }

        // get index of receipt completion date in dataPoints array
        const index = getDatesDifference(startDate, receipt.completionDate);

        // add points to dataPoints of that day and the following week
        dataPoints[index]?.addPointsDay(receipt.points);
        for (let i = 0; i < 7; i++)
          dataPoints[index + i]?.addPointsWeek(receipt.points);
      }

      // concatenate user-datapoint-tuples from roommates with user-datapoint-tuple from orphaned receipts, then map into return format
      return userAndDataPointsArrays
        .concat(
          taskCompletedByUnknown
            ? [{ user: null, dataPoints: nullDataPoints }]
            : []
        )
        .map((tuple) => new UserStatistic(tuple.user, tuple.dataPoints));
    } catch (e) {
      throw Error('Could not create user statistics for home');
    }
  }
}
