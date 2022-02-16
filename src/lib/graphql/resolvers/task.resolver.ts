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
   * Get all tasks that belong to the users home.
   */
  @Authorized()
  @Query(() => [Task], {
    description: 'Get all tasks that belong to the users home.',
  })
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
   * Only load tasks max two weeks in the past and max four weeks in the future.
   */
  @Authorized()
  @Query(() => [Task], {
    description: `Get open tasks that have not been completed yet and are not assigned to another user.
Only load tasks max two weeks in the past and max four weeks in the future.`,
  })
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
  @FieldResolver(() => TaskType, {
    description: 'The type of the task.',
  })
  async type(@Root() task: Task) {
    return (await TaskType.findOne(task.type)) as TaskType;
  }

  /**
   * Only load task series if required.
   */
  @FieldResolver(() => TaskSeries, {
    nullable: true,
    description: `The series that the task belongs to.
Null if the task does not belong to a series.`,
  })
  async series(@Root() task: Task) {
    return task.series ? await TaskSeries.findOne(task.series) : null;
  }

  /**
   * Only load user assigned to task if required.
   */
  @FieldResolver(() => User, {
    nullable: true,
    description: `The user that the task is assigned to.
Null if no user is assigned.`,
  })
  async assignee(@Root() task: Task) {
    return task.assignee ? await User.findOne(task.assignee) : null;
  }

  /**
   * Only load task receipt if required.
   */
  @FieldResolver(() => TaskReceipt, {
    nullable: true,
    description: `The receipt of the task.
Null if the task has not been completed.`,
  })
  async receipt(@Root() task: Task) {
    return task.receipt
      ? await TaskReceipt.findOne(task.receipt, { loadRelationIds: true })
      : null;
  }

  /**
   * Create a new task.
   * @param date The date when the task should be completed.
   * @param type The id of the task type.
   */
  @Authorized()
  @Mutation(() => Task, { description: 'Create a new task.' })
  async createTask(
    @CurrentSession() session: Session,
    @Arg('date', { description: 'The date when the task should be completed.' })
    date: number,
    @Arg('type', { description: 'The id of the task type.' })
    type: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const validDate = new Date(date);
    const taskType = await Helper.getTypeOrFail(type, home.id);

    try {
      const task = new Task(validDate, home, taskType);

      // save
      const savedTask = await task.save();
      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_CREATED,
        null,
        null,
        savedTask
      );

      return savedTask;
    } catch (e) {
      throw Error(
        'Failed to create task! Check that type is valid and part of users home.'
      );
    }
  }

  /**
   * Delete an existing task by removing its related home.
   * The task must belong to the users home.
   * @param task The id of the task to delete.
   */
  @Authorized()
  @Mutation(() => Task, {
    description: `Delete an existing task by removing its related home.
The task must belong to the users home.`,
  })
  async deleteTask(
    @CurrentSession() session: Session,
    @Arg('task', { description: 'The id of the task to delete.' })
    task: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);

    try {
      taskEntity.assignee = null;
      taskEntity.relatedHome = null;

      // save
      const savedTaskEntity = await taskEntity.save();
      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_DELETED,
        null,
        null,
        savedTaskEntity
      );

      return savedTaskEntity;
    } catch (e) {
      throw Error('Failed to delete task!');
    }
  }

  /**
   * Assign a roommate to a task.
   * The task must belong to the users home.
   * @param task The id of the task to be assigned.
   * @param assign The id of the new assignee of the task.
   */
  @Authorized()
  @Mutation(() => Task, {
    description: `Assign a roommate to a task.
The task must belong to the users home.`,
  })
  async assignTask(
    @CurrentSession() session: Session,
    @Arg('task', { description: 'The id of the task to be assigned.' })
    task: string,
    @Arg('user', { description: 'The id of the new assignee of the task.' })
    assignee: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);
    const roommate = await Helper.getRoommateOrFail(assignee, home.id);

    try {
      taskEntity.assignee = roommate.id as any; // Only save id for field resolver

      // save
      const taskEntriySaved = await taskEntity.save();
      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_ASSIGNED,
        null,
        null,
        taskEntriySaved
      );

      return taskEntriySaved;
    } catch (e) {
      throw Error('Failed to assign task!');
    }
  }

  /**
   * Remove assignee from task.
   * The task must belong to the users home.
   * @param task The id of the task to unassign.
   */
  @Authorized()
  @Mutation(() => Task, {
    description: `Remove assignee from task.
The task must belong to the users home.`,
  })
  async unassignTask(
    @CurrentSession() session: Session,
    @Arg('task', { description: 'The id of the task to unassign.' })
    task: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    const taskEntity = await Helper.getTaskOrFail(task, home.id);

    if (!taskEntity.assignee) {
      throw Error(
        `Failed to remove assignee from task ${taskEntity.id} because nobody was assigned!`
      );
    }
    try {
      taskEntity.assignee = null;

      // save
      const taskEntriySaved = await taskEntity.save();
      await Helper.createHistory(
        home,
        user,
        HistoryType.TASK_UNASSIGNED,
        null,
        null,
        taskEntriySaved
      );

      return taskEntriySaved;
    } catch (e) {
      throw Error(`Failed to remove assignee from task ${taskEntity.id}!`);
    }
  }
}
