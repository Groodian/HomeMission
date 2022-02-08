import { Session } from '@auth0/nextjs-auth0';
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
import { Between } from 'typeorm';
import { HistoryType } from '../../../entities/history';
import Task from '../../../entities/task';
import TaskReceipt from '../../../entities/taskreceipt';
import TaskSeries from '../../../entities/taskseries';
import TaskType from '../../../entities/tasktype';
import User from '../../../entities/user';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';

@Resolver(Task)
export default class TaskResolver implements ResolverInterface<Task> {
  /**
   * Get all tasks including their task types that belong to the users home.
   */
  @Authorized()
  @Query(() => [Task])
  async tasks(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);

    try {
      return await Task.find({
        loadRelationIds: true,
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all tasks!');
    }
  }

  /**
   * Get open tasks that have not been completed yet and are not assigned to another user.
   */
  @Authorized()
  @Query(() => [Task])
  async openTasks(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);

    try {
      const commonConditions = {
        relatedHome: home.id, // condition: tasks must be from users home
        receipt: null, // condition: tasks must not be completed yet
        date: Between(
          new Date(new Date().getTime() - 2 * 7 * 24 * 60 * 60 * 1000), // max two weeks into the past
          new Date(new Date().getTime() + 4 * 7 * 24 * 60 * 60 * 1000) // max four weeks into the future
        ),
      };

      return await Task.find({
        loadRelationIds: true,
        where: [
          {
            ...commonConditions,
            ...{ assignee: null },
          },
          {
            ...commonConditions,
            ...{ assignee: user.id },
          },
        ],
        take: 8,
        order: {
          date: 'ASC',
        },
      });
    } catch (e) {
      throw Error('Failed to get open tasks!');
    }
  }

  /**
   * Only load task type if required.
   */
  @FieldResolver(() => TaskType)
  async type(@Root() task: Task) {
    return task.type ? await TaskType.findOne(task.type) : null;
  }

  /**
   * Only load task series if required.
   */
  @FieldResolver(() => TaskSeries, { nullable: true })
  async series(@Root() task: Task) {
    return task.series ? await TaskSeries.findOne(task.series) : null;
  }

  /**
   * Only load task receipt if required.
   */
  @FieldResolver(() => TaskReceipt, { nullable: true })
  async receipt(@Root() task: Task) {
    return task.receipt
      ? await TaskReceipt.findOne(task.receipt, { loadRelationIds: true })
      : null;
  }

  /**
   * Only load user assigned to task if required.
   */
  @FieldResolver(() => User, { nullable: true })
  async assignee(@Root() task: Task) {
    return task.assignee ? await User.findOne(task.assignee) : null;
  }

  /**
   * Create a new task.
   */
  @Authorized()
  @Mutation(() => Task)
  async createTask(
    @CurrentSession() session: Session,
    @Arg('type') type: string,
    @Arg('date') date: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
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
  async deleteTask(
    @CurrentSession() session: Session,
    @Arg('task') task: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);

    try {
      await Task.remove(taskEntity);
      await Helper.createHistory(home, user, HistoryType.TASK_DELETED);
      return true;
    } catch (e) {
      throw Error('Failed to delete task!');
    }
  }

  /**
   * Assign a user to a task. The task must belong to the users home.
   */
  @Authorized()
  @Mutation(() => Task)
  async assignTask(
    @CurrentSession() session: Session,
    @Arg('task') task: string,
    @Arg('user') assignee: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);
    const roommate = await Helper.getRoommateOrFail(assignee, home.id);

    try {
      taskEntity.assignee = roommate.id as any; // Only save id for field resolver
      return await taskEntity.save();
    } catch (e) {
      throw Error('Failed to assign task!');
    }
  }

  /**
   * Remove assignee from task. The task must belong to the users home.
   */
  @Authorized()
  @Mutation(() => Task)
  async unassignTask(
    @CurrentSession() session: Session,
    @Arg('task') task: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);

    if (!taskEntity.assignee) {
      throw Error(
        `Failed to remove assignee from task ${taskEntity.id} because nobody was assigned!`
      );
    }
    try {
      taskEntity.assignee = null;
      return await taskEntity.save();
    } catch (e) {
      throw Error(`Failed to remove assignee from task ${taskEntity.id}!`);
    }
  }
}
