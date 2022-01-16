import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import databaseConnection from '../../typeorm/connection';
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';
import { Task, TaskSeries, TaskType, User } from '../../../entities';

@Resolver(TaskSeries)
export default class TaskSeriesResolver {
  /**
   * Create a new task series and correlating tasks.
   */
  @Authorized()
  @Mutation(() => TaskType)
  async createTaskSeries(
    @Arg('start') start: string,
    @Arg('interval') interval: number,
    @Arg('iterations') iterations: number,
    @Arg('type') type: string
  ) {
    await databaseConnection();
    const home = await this.getHomeOrFail();
    const taskType = await this.getTypeOrFail(type, home.id);
    const startDate = this.getDateFromStringOrFail(start);
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

      return taskSeries;
    } catch (e) {
      throw Error('Failed to create task series!');
    }
  }

  /**
   * Delete all tasks correlating to task series.
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTaskSeries(@Arg('series') series: string) {
    await databaseConnection();
    const home = await this.getHomeOrFail();
    const taskSeries = await this.getSeriesOrFail(series, home.id);

    try {
      // delete tasks from series
      for (const task of taskSeries.tasks) {
        await task.remove();
      }

      // delete series
      await taskSeries.remove();

      return true;
    } catch (e) {
      throw Error('Failed to remove task series!');
    }
  }

  /**
   * Delete tasks correlating to task series starting from a specified task.
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTaskSeriesSubsection(
    @Arg('series') series: string,
    @Arg('start') start: string
  ) {
    await databaseConnection();
    const home = await this.getHomeOrFail();
    const taskSeries = await this.getSeriesOrFail(series, home.id);
    const startTask = await this.getTaskOrFail(start, home.id);
    if (String(startTask.series) !== String(taskSeries.id)) {
      throw Error(
        'Failed to remove tasks from series! Start task is not part of task series.'
      );
    }
    try {
      // delete tasks from series if they are after the specified start task
      for (const task of taskSeries.tasks) {
        if (task.date >= startTask.date) await task.remove();
      }

      return true;
    } catch (e) {
      throw Error('Failed to remove task series!');
    }
  }

  private getDateFromStringOrFail(value: string) {
    if (isNaN(Date.parse(value))) {
      throw Error('Failed to execute! Check the date argument.');
    } else {
      return new Date(Date.parse(value));
    }
  }

  // helper function that returns a task
  private async getTypeOrFail(typeId: string, homeId: string) {
    const taskType = await TaskType.findOneOrFail(typeId, {
      loadRelationIds: true,
    });

    // check that the type of new task is part of the users home
    if (String(homeId) !== String(taskType.relatedHome))
      throw Error('Failed to execute! Task type belongs to a different home.');

    return taskType;
  }

  // helper function that returns the users home
  private async getTaskOrFail(taskId: string, homeId: string) {
    const task = await Task.findOneOrFail(taskId, {
      loadRelationIds: true,
    });

    // check that the type of new task is part of the users home
    if (String(homeId) !== String(task.relatedHome))
      throw Error('Failed to execute! Task belongs to a different home.');

    return task;
  }

  // helper function that returns a series
  private async getSeriesOrFail(seriesId: string, homeId: string) {
    const taskSeries = await TaskSeries.findOneOrFail(seriesId, {
      relations: ['relatedHome', 'tasks'],
    });

    // check that the type of new task is part of the users home
    if (String(homeId) !== String(taskSeries.relatedHome?.id))
      throw Error(
        'Failed to execute! Task series belongs to a different home.'
      );

    return taskSeries;
  }

  // helper function that returns the users home
  private async getHomeOrFail(@CurrentSession() session?: Session) {
    try {
      // get user from database
      const user = await User.findOneOrFail(session?.user.sub as string, {
        relations: ['home'],
      });

      // check if user has a home
      if (!user.home) throw Error('User does not have home');
      else return user.home;
    } catch (e) {
      throw Error('Failed to get users home. Check that the user has a home!');
    }
  }
}
