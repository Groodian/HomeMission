import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import databaseConnection from '../../typeorm/connection';
import { Task, TaskSeries, TaskType, HistoryType } from '../../../entities';
import Helper from './helper';
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';

@Resolver(TaskSeries)
export default class TaskSeriesResolver {
  /**
   * Create a new task series and correlating tasks.
   */
  @Authorized()
  @Mutation(() => TaskType)
  async createTaskSeries(
    @CurrentSession() session: Session,
    @Arg('start') start: string,
    @Arg('interval') interval: number,
    @Arg('iterations') iterations: number,
    @Arg('type') type: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskType = await Helper.getTypeOrFail(type, home.id);
    const startDate = Helper.getDateFromStringOrFail(start);
    if (interval <= 0 || iterations <= 0) {
      throw Error(
        'Failed to create task series! Check that arguments interval and iterations are greater than zero.'
      );
    }

    try {
      // create series
      const taskSeries = new TaskSeries(home);
      await taskSeries.save();

      // create tasks belonging to series
      const date = startDate;
      for (let i = 0; i < iterations; i++) {
        const task = new Task(date, home, taskType);
        task.series = taskSeries;
        await task.save();
        date.setDate(date.getDate() + interval * 7);
      }

      await Helper.createHistory(home, user, HistoryType.TASK_SERIES_CREATED);

      return taskSeries;
    } catch (e) {
      throw Error('Failed to create task series!');
    }
  }

  /**
   * Delete all tasks correlating to a task series.
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTaskSeries(
    @CurrentSession() session: Session,
    @Arg('series') series: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskSeries = await Helper.getSeriesOrFail(series, home.id);

    try {
      // delete tasks from series
      for (const task of taskSeries.tasks) {
        await task.remove();
      }

      // delete series
      await taskSeries.remove();

      await Helper.createHistory(home, user, HistoryType.TASK_SERIES_DELETED);

      return true;
    } catch (e) {
      throw Error('Failed to remove task series!');
    }
  }

  /**
   * Delete tasks correlating to a task series starting from a specified task.
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTaskSeriesSubsection(
    @CurrentSession() session: Session,
    @Arg('series') series: string,
    @Arg('start') start: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskSeries = await Helper.getSeriesOrFail(series, home.id);
    const startTask = await Helper.getTaskOrFail(start, home.id);
    if (String(startTask.series) !== String(taskSeries.id))
      throw Error(
        'Failed to remove tasks from series! Start task is not part of task series.'
      );

    try {
      // delete tasks from series if they are after the specified start task
      for (const task of taskSeries.tasks) {
        if (task.date >= startTask.date) await task.remove();
      }

      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_SERIES_SUB_DELETED
      );

      return true;
    } catch (e) {
      throw Error('Failed to remove task series!');
    }
  }
}
