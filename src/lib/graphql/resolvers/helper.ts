import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';
import { Task, TaskSeries, TaskType, User } from '../../../entities';

export default class Helper {
  // helper function that turns a string into a date or throws an error
  static getDateFromStringOrFail(value: string): Date {
    if (isNaN(Date.parse(value))) {
      throw Error(
        `Failed to turn value ${value} into a date! Check that it has the format yyyy-mm-dd.'`
      );
    } else {
      return new Date(Date.parse(value));
    }
  }

  /**
   * helper function that returns the users home and fails if user has no home
   */
  static async getHomeOrFail(@CurrentSession() session?: Session) {
    try {
      // get user from database
      const user = await User.findOneOrFail(session?.user.sub as string, {
        relations: ['home'],
      });

      // check if user has a home
      if (!user.home) throw Error('User does not have home');
      else return user.home;
    } catch (e) {
      throw Error('Failed to get users home! Check that the user has a home.');
    }
  }

  /**
   * helper function that returns a task type and fails if it is not correlated to users home
   */
  static async getTypeOrFail(typeId: string, homeId: string) {
    const type = await TaskType.findOneOrFail(typeId, {
      loadRelationIds: true,
    });

    // check that the type is part of the users home
    if (String(homeId) !== String(type.relatedHome))
      throw Error(
        'Failed to execute! Task type does not belong to users home.'
      );

    return type;
  }

  /**
   * helper function that returns a task and fails if it is not correlated to users home
   */
  static async getTaskOrFail(taskId: string, homeId: string) {
    const task = await Task.findOneOrFail(taskId, {
      loadRelationIds: true,
    });

    // check that the task is part of the users home
    if (String(homeId) !== String(task.relatedHome))
      throw Error('Failed to execute! Task does not belong to users home.');

    return task;
  }

  // helper function that returns a series and fails if it is not correlated to users home
  static async getSeriesOrFail(seriesId: string, homeId: string) {
    const series = await TaskSeries.findOneOrFail(seriesId, {
      relations: ['relatedHome', 'tasks'],
    });

    // check that the series is part of the users home
    if (String(homeId) !== String(series.relatedHome?.id))
      throw Error(
        'Failed to execute! Task series does not belong to users home.'
      );

    return series;
  }
}
