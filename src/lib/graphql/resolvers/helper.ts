import { Session } from '@auth0/nextjs-auth0';
import History, { HistoryType } from '../../../entities/history';
import Home from '../../../entities/home';
import Task from '../../../entities/task';
import TaskSeries from '../../../entities/taskseries';
import TaskType from '../../../entities/tasktype';
import User from '../../../entities/user';
import databaseConnection from '../../typeorm/connection';

export default class Helper {
  /**
   * Helper function that returns the user and fails if user is not authenticated.
   */
  static async getMeOrFail(session: Session, relations?: string[]) {
    try {
      // get user from database
      return await User.findOneOrFail(session.user.sub as string, {
        relations,
      });
    } catch (e) {
      throw Error('Failed to get user!');
    }
  }

  /**
   * Helper function that returns the users home and fails if user has no home.
   */
  static async getHomeOrFail(session: Session, relations: string[] = []) {
    const user = await User.findOneOrFail(session.user.sub as string, {
      relations: ['home', ...relations.map((relation) => 'home.' + relation)],
    });
    if (!user.home)
      throw Error('Failed to get users home! Check that user has a home.');
    return user.home;
  }

  /**
   * Helper function that returns a roommate from the users home and fails if roommate is not correlated to users home. (can also return the user themself)
   */
  static async getRoommateOrFail(userId: string, homeId: string) {
    const roommate = await User.findOneOrFail(userId, {
      loadRelationIds: true,
    });

    // check that the roommate is part of the users home
    if (String(homeId) !== String(roommate.home))
      throw Error(
        'Failed to execute! Requested roommate does not belong to users home.'
      );

    return roommate;
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
      await history.save();

      return history;
    } catch (e) {
      throw Error('Failed to create history!');
    }
  }
}
