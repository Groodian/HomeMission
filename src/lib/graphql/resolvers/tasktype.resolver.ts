import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import databaseConnection from '../../typeorm/connection';
import { TaskType } from '../../../entities';
import Helper from './helper';

@Resolver(TaskType)
export default class TaskTypeResolver {
  /**
   * Get all task types that belong to the users home.
   */
  @Query(() => [TaskType])
  async taskTypes() {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();

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
    @Arg('name') name: string,
    @Arg('points') points: number
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();

    try {
      const taskType = new TaskType(name, points, home);
      return await taskType.save();
    } catch (e) {
      throw Error('Failed to create task type!');
    }
  }

  /**
   * Remove a task type.
   */
  @Authorized()
  @Mutation(() => TaskType)
  async removeTaskType(@Arg('type') type: string) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();
    const taskType = await Helper.getTypeOrFail(type, home.id);

    try {
      // only remove reference between home and task type
      taskType.relatedHome = null;
      return await taskType.save();
    } catch (e) {
      throw Error('Failed to remove task type!');
    }
  }
}
