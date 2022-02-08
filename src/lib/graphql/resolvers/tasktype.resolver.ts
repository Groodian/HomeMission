import { Session } from '@auth0/nextjs-auth0';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { HistoryType } from '../../../entities/history';
import TaskType from '../../../entities/tasktype';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';

@Resolver(TaskType)
export default class TaskTypeResolver {
  /**
   * Get all task types that belong to the users home.
   */
  @Authorized()
  @Query(() => [TaskType])
  async taskTypes(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);

    try {
      return await TaskType.find({
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all task types!');
    }
  }

  /**
   * Create a new task type.
   */
  @Authorized()
  @Mutation(() => TaskType)
  async createTaskType(
    @CurrentSession() session: Session,
    @Arg('name') name: string,
    @Arg('points') points: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);

    try {
      const type = new TaskType(name, points, home);
      await Helper.createHistory(home, user, HistoryType.TASK_TYPE_CREATED);
      return await type.save();
    } catch (e) {
      throw Error('Failed to create task type!');
    }
  }

  /**
   * Remove a task type.
   */
  @Authorized()
  @Mutation(() => TaskType)
  async removeTaskType(
    @CurrentSession() session: Session,
    @Arg('type') type: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskType = await Helper.getTypeOrFail(type, home.id);

    try {
      // only remove reference between home and task type
      taskType.relatedHome = null;
      await Helper.createHistory(home, user, HistoryType.TASK_TYPE_DELETED);
      return await taskType.save();
    } catch (e) {
      throw Error('Failed to remove task type!');
    }
  }
}
