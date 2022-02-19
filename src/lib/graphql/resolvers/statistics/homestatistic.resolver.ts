import { Session } from '@auth0/nextjs-auth0';
import { Authorized, Query, Resolver } from 'type-graphql';
import { Between, IsNull, Not } from 'typeorm';
import HomeStatistic from '../../../../entities/statistics/homeStatistic';
import Task from '../../../../entities/task';
import TaskReceipt from '../../../../entities/taskreceipt';
import CurrentSession from '../../../auth0/current-session';
import databaseConnection from '../../../typeorm/connection';
import Helper from '../helper';
import {
  getBlankDataPointsArray,
  getDatesDifference,
} from './statisticsHelper';

@Resolver(HomeStatistic)
export default class HomeStatisticResolver {
  /**
   * Generate the statistics for a home.
   * Calculate the sum of points achieved per day and week in the users home for the past two weeks.
   * Calculate the percentage of completed tasks in the next week and month.
   */
  @Authorized()
  @Query(() => HomeStatistic, {
    description: `Generate the statistics for a home.
Calculate the sum of points achieved per day and week in the users home for the past two weeks.
Calculate the percentage of completed tasks in the next week and month.`,
  })
  async homeStatistic(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const start = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000); // two weeks earlier

    try {
      const receipts = await TaskReceipt.find({
        where: {
          relatedHome: home.id,
          completionDate: Between(
            new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000), // start one week earlier for weekly points
            new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000) // tasks of whole day
          ),
        },
        loadRelationIds: true,
      });

      const dataPoints = getBlankDataPointsArray(start, today);

      // iterate through all receipts and attribute appropriate points
      for (const receipt of receipts) {
        // get index of receipt completion date in dataPoints array
        const index = getDatesDifference(start, receipt.completionDate);

        // add points to dataPoints of that day and the following week
        dataPoints[index]?.addPointsDay(receipt.points);
        for (let i = 0; i < 7; i++)
          dataPoints[index + i]?.addPointsWeek(receipt.points);
      }

      // calculate progress
      const week = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const [, totalWeeklyTasks] = await Task.findAndCount({
        date: Between(today, week),
        relatedHome: home,
      });
      const [, completedWeeklyTasks] = await Task.findAndCount({
        date: Between(today, week),
        relatedHome: home,
        receipt: Not(IsNull()),
      });
      const weeklyProgress =
        (completedWeeklyTasks / totalWeeklyTasks) * 100 || 100; // not NaN

      const month = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const [, totalMonthlyTasks] = await Task.findAndCount({
        date: Between(today, month),
        relatedHome: home,
      });
      const [, completedMonthlyTasks] = await Task.findAndCount({
        date: Between(today, month),
        relatedHome: home,
        receipt: Not(IsNull()),
      });
      const monthlyProgress =
        (completedMonthlyTasks / totalMonthlyTasks) * 100 || 100; // not NaN

      return new HomeStatistic(dataPoints, weeklyProgress, monthlyProgress);
    } catch (e) {
      throw Error('Could not create statistics for home');
    }
  }
}
