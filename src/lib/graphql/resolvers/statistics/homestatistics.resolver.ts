import { Session } from '@auth0/nextjs-auth0';
import CurrentSession from '../../../auth0/current-session';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';
import databaseConnection from '../../../typeorm/connection';
import { Between } from 'typeorm';
import TaskReceipt from '../../../../entities/taskreceipt';
import HomeStatistic from '../../../../entities/statistics/homeStatistic';
import Helper from '../helper';
import {
  getBlankDataPointsArray,
  getDatesDifference,
} from './statisticsHelper';

@Resolver(HomeStatistic)
export default class HomeStatisticsResolver {
  /**
   * Generate the statistics for a home.
   * Calculate the sum of points achieved per day and week in the users home.
   * @param start The start date of the statistics to generate.
   * @param end The end date of the statistics to generate.
   */
  @Authorized()
  @Query(() => HomeStatistic, {
    description: `Generate the statistics for a home.
Calculate the sum of points achieved per day and week in the users home.`,
  })
  async homeStatistic(
    @CurrentSession() session: Session,
    // prettier-ignore
    @Arg('start', { description: 'The start date of the statistics to generate.' })
    start: number,
    @Arg('end', { description: 'The end date of the statistics to generate.' })
    end: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (start > end)
      throw Error(
        'Could not create statistic for home because start date must be before end date'
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

      const dataPoints = getBlankDataPointsArray(startDate, endDate);

      // iterate through all receipts and attribute appropriate points
      for (const receipt of receipts) {
        // get index of receipt completion date in dataPoints array
        const index = getDatesDifference(startDate, receipt.completionDate);

        // add points to dataPoints of that day and the following week
        dataPoints[index]?.addPointsDay(receipt.points);
        for (let i = 0; i < 7; i++)
          dataPoints[index + i]?.addPointsWeek(receipt.points);
      }

      return new HomeStatistic(dataPoints);
    } catch (e) {
      throw Error('Could not create statistics for home');
    }
  }
}
