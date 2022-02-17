import { Session } from '@auth0/nextjs-auth0';
import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { HistoryType } from '../../../entities/history';
import Task from '../../../entities/task';
import TaskSeries from '../../../entities/taskseries';
import TaskType from '../../../entities/tasktype';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';

@Resolver(TaskSeries)
export default class TaskSeriesResolver {
  /**
   * Create a new task series and correlating tasks.
   * @param start The date of the first task of the series.
   * @param interval The interval between tasks in weeks.
   * @param iterations The number of tasks to create.
   * @param type The id of the task type.
   */
  @Authorized()
  @Mutation(() => TaskType, {
    description: 'Create a new task series and correlating tasks.',
  })
  async createTaskSeries(
    @CurrentSession() session: Session,
    @Arg('start', { description: 'The date of the first task of the series.' })
    start: number,
    @Arg('interval', { description: 'The interval between tasks in weeks.' })
    interval: number,
    @Arg('iterations', { description: 'The number of tasks to create.' })
    iterations: number,
    @Arg('type', { description: 'The id of the task type.' })
    type: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const startDate = new Date(start);
    const taskType = await Helper.getTypeOrFail(type, home.id);
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
   * Delete all tasks correlating to a task series by removing their related home.
   * The series must belong to the users home.
   * @param series The id of the task series to delete.
   */
  @Authorized()
  @Mutation(() => TaskSeries, {
    description: `Delete all tasks correlating to a task series by removing their related home.
The series must belong to the users home.`,
  })
  async deleteTaskSeries(
    @CurrentSession() session: Session,
    @Arg('series', { description: 'The id of the task series to delete.' })
    series: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskSeries = await Helper.getSeriesOrFail(series, home.id);

    try {
      // remove reference to home from tasks of series
      for (const task of taskSeries.tasks) {
        task.assignee = null;
        task.relatedHome = null;
        await task.save();
      }

      // remove reference to home from series
      taskSeries.relatedHome = null;
      await taskSeries.save();

      await Helper.createHistory(home, user, HistoryType.TASK_SERIES_DELETED);

      return taskSeries;
    } catch (e) {
      throw Error('Failed to delete task series!');
    }
  }

  /**
   * Delete tasks correlating to a task series starting from a specified task by removing their related home.
   * The series must belong to the users home.
   * @param series The id of the task series to delete a subsection from.
   * @param start The id of the first task to delete.
   */
  @Authorized()
  @Mutation(() => TaskSeries, {
    description: `Delete tasks correlating to a task series starting from a specified task by removing their related home.
The series must belong to the users home.`,
  })
  async deleteTaskSeriesSubsection(
    @CurrentSession() session: Session,
    // prettier-ignore
    @Arg('series', { description: 'The id of the task series to delete a subsection from.' })
    series: string,
    @Arg('start', { description: 'The id of the first task to delete.' })
    start: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskSeries = await Helper.getSeriesOrFail(series, home.id);
    const startTask = await Helper.getTaskOrFail(start, home.id);
    if (String(startTask.series) !== String(taskSeries.id))
      throw Error(
        'Failed to delete tasks from series! Start task is not part of task series.'
      );

    try {
      // remove reference to home from tasks of series if they are after the specified start task
      for (const task of taskSeries.tasks) {
        if (task.date >= startTask.date) {
          task.assignee = null;
          task.relatedHome = null;
          await task.save();
        }
      }

      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_SERIES_SUB_DELETED
      );

      return taskSeries;
    } catch (e) {
      throw Error('Failed to delete task series subsection!');
    }
  }
}
