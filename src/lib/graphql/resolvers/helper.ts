import { Session } from '@auth0/nextjs-auth0';
import {
  History,
  HistoryType,
  Home,
  Task,
  TaskSeries,
  TaskType,
  User,
} from '../../../entities';
import databaseConnection from '../../typeorm/connection';

export default class Helper {
  /**
   * Helper function that turns a string into a date or throws an error.
   */
  static getDateFromStringOrFail(value: string): Date {
    if (isNaN(Date.parse(value))) {
      throw Error(
        `Failed to turn value ${value} into a date! Check that it has the format yyyy-mm-dd.'`
      );
    } else {
      return new Date(value);
    }
  }

  /**
   * Helper function that returns the user and fails if user is not authenticated.
   */
  static async getMeOrFail(session: Session) {
    try {
      // get user from database
      return await User.findOneOrFail(session.user.sub as string, {
        relations: ['home'],
      });
    } catch (e) {
      throw Error('Failed to get user!');
    }
  }

  /**
   * Helper function that returns the users home and fails if user has no home.
   */
  static async getHomeOrFail(session: Session) {
    const user = await this.getMeOrFail(session);
    if (!user.home)
      throw Error('Failed to get users home! Check that user has a home.');
    return user.home;
  }

  /**
   * Helper function that returns a task type and fails if it is not correlated to users home.
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
   * Helper function that returns a task and fails if it is not correlated to users home.
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

  /**
   * Helper function that returns a series and fails if it is not correlated to users home.
   */
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

  /**
   * Helper function that creates a history entry.
   */
  static async createHistory(
    home: Home,
    user: User,
    type: HistoryType
  ): Promise<History> {
    try {
      await databaseConnection();

      const history = new History();
      history.home = home;
      history.user = user;
      history.type = type;

      home.history.push(history);
      user.history.push(history);

      await history.save();

      return history;
    } catch (e) {
      throw Error('Failed to create history!');
    }
  }
}
