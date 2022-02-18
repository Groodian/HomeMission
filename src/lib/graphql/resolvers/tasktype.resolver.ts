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
  @Query(() => [TaskType], {
    description: 'Get all task types that belong to the users home.',
  })
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
   * @param name The name of the new task type.
   * @param points The amount of points that associated tasks will be worth.
   */
  @Authorized()
  @Mutation(() => TaskType, { description: 'Create a new task type.' })
  async createTaskType(
    @CurrentSession() session: Session,
    @Arg('name', {
      description: 'The name of the new task type.',
    })
    name: string,
    @Arg('points', {
      description: 'The amount of points that associated tasks will be worth.',
    })
    points: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);

    try {
      const taskType = new TaskType(name, points, home);

      // save
      await taskType.save();
      await Helper.createHistory(home, user, HistoryType.TASK_TYPE_CREATED, {
        taskType,
      });

      return taskType;
    } catch (e) {
      throw Error('Failed to create task type!');
    }
  }

  /**
   * Delete a task type by removing its related home.
   * The task type must belong to the users home.
   * @param type The id of the task type to delete.
   */
  @Authorized()
  @Mutation(() => TaskType, {
    description: `Delete a task type by removing its related home.
The task type must belong to the users home.`,
  })
  async deleteTaskType(
    @CurrentSession() session: Session,
    @Arg('type', { description: 'The id of the task type to delete.' })
    type: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskType = await Helper.getTypeOrFail(type, home.id);

    try {
      // only remove reference between home and task type
      taskType.relatedHome = null;

      // save
      await taskType.save();
      await Helper.createHistory(home, user, HistoryType.TASK_TYPE_DELETED, {
        taskType,
      });

      return taskType;
    } catch (e) {
      throw Error('Failed to delete task type!');
    }
  }
}
