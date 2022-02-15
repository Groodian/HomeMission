import { Session } from '@auth0/nextjs-auth0';
import CurrentSession from '../../../auth0/current-session';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';
import databaseConnection from '../../../typeorm/connection';
import { Between } from 'typeorm';
import TaskReceipt from '../../../../entities/taskreceipt';
import HomeStatistic from '../../../../entities/statistics/homeStatistic';
import Helper from '../helper';
import {
  compareDatesWeek,
  compareDatesDay,
  getBlankDataPointsArray,
} from './statisticsHelper';

@Resolver(HomeStatistic)
export default class HomeStatisticsResolver {
  /**
   * Generate the statistics for a home.
   */
  @Authorized()
  @Query(() => HomeStatistic)
  async homeStatistic(
    @CurrentSession() session: Session,
    @Arg('start') start: string,
    @Arg('end') end: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate.getTime() > endDate.getTime())
      throw Error(
        'Could not create statistic for home because start date must be before end date'
      );

    try {
      const receipts = await TaskReceipt.find({
        where: {
          relatedHome: home.id,
          completionDate: Between(
            new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
            endDate
          ),
        },
        loadRelationIds: true,
      });

      const dataPoints = getBlankDataPointsArray(startDate, endDate);

      // iterate through all receipts and attribute appropriate points
      for (const receipt of receipts) {
        // check every data point if the date matches the completion date of the receipt
        for (const dataPoint of dataPoints) {
          if (compareDatesWeek(receipt.completionDate, dataPoint.date)) {
            dataPoint.addPointsWeek(receipt.points);

            if (compareDatesDay(receipt.completionDate, dataPoint.date)) {
              dataPoint.addPointsDay(receipt.points);
            }
          }
        }
      }

      return new HomeStatistic(dataPoints);
    } catch (e) {
      throw Error('Could not create statistics for home');
    }
  }
}
