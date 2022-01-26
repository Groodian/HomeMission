import {
  Arg,
  Authorized,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import databaseConnection from '../../typeorm/connection';
import {
  Task,
  TaskReceipt,
  TaskSeries,
  TaskType,
  HistoryType,
} from '../../../entities';
import Helper from './helper';

@Resolver(Task)
export default class TaskResolver implements ResolverInterface<Task> {
  /**
   * Get all tasks including their task types that belong to the users home.
   */
  @Authorized()
  @Query(() => [Task])
  async tasks() {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();

    try {
      return await Task.find({
        relations: ['type', 'series', 'receipt'],
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all tasks!');
    }
  }

  /**
   * Only load task type if required.
   */
  @FieldResolver(() => TaskType)
  async type(@Root() task: Task) {
    return await TaskType.findOne(task.type?.id);
  }

  /**
   * Only load task series if required.
   */
  @FieldResolver(() => TaskSeries, { nullable: true })
  async series(@Root() task: Task) {
    return task.series ? await TaskSeries.findOne(task.series?.id) : null;
  }

  /**
   * Only load task receipt if required.
   */
  @FieldResolver(() => TaskReceipt, { nullable: true })
  async receipt(@Root() task: Task) {
    return task.receipt ? await TaskReceipt.findOne(task.receipt?.id) : null;
  }

  /**
   * Create a new task.
   */
  @Authorized()
  @Mutation(() => Task)
  async createTask(@Arg('type') type: string, @Arg('date') date: string) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();
    const user = await Helper.getMeOrFail();
    const validDate = Helper.getDateFromStringOrFail(date);
    const taskType = await Helper.getTypeOrFail(type, home.id);

    try {
      const task = new Task(validDate, home, taskType);
      await Helper.createHistory(home, user, HistoryType.TASK_CREATED);
      return await task.save();
    } catch (e) {
      throw Error(
        'Failed to create task! Check that type is valid and part of users home.'
      );
    }
  }

  /**
   * Delete an existing task. The task must belong to the users home.
   */
  @Authorized()
  @Mutation(() => Boolean)
  async deleteTask(@Arg('task') task: string) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail();
    const user = await Helper.getMeOrFail();
    const taskEntity = await Helper.getTaskOrFail(task, home.id);

    try {
      await Task.remove(taskEntity);
      await Helper.createHistory(home, user, HistoryType.TASK_DELETED);
      return true;
    } catch (e) {
      throw Error('Failed to delete task!');
    }
  }
}
