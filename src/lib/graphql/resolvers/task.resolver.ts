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
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';
import { Task, TaskType, User } from '../../../entities';

@Resolver(Task)
export default class TaskResolver implements ResolverInterface<Task> {
  /**
   * Get all tasks including their task types that belong to the users home.
   */
  @Query(() => [Task])
  async tasks() {
    await databaseConnection();
    const home = await this.getHomeOrFail();
    try {
      return await Task.find({
        relations: ['type'],
        where: { relatedHome: home.id },
      });
    } catch (e) {
      throw Error('Failed to get all tasks.');
    }
  }

  /**
   * Only load task types if required.
   */
  @FieldResolver(() => TaskType)
  async type(@Root() task: Task) {
    return await TaskType.findOne(task.type?.id);
  }

  /**
   * Create a new task.
   */
  @Authorized()
  @Mutation(() => Task)
  async createTask(@Arg('type') type: string, @Arg('date') date: string) {
    await databaseConnection();
    const home = await this.getHomeOrFail();
    const validDate = this.getDateFromStringOrFail(date);
    const taskType = await this.getTypeOrFail(type, home.id);

    try {
      const task = new Task(validDate, home, taskType);
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
    const home = await this.getHomeOrFail();
    const taskEntity = await this.getTaskOrFail(task, home.id);

    try {
      await Task.remove(taskEntity);
      return true;
    } catch (e) {
      throw Error('Failed to delete task!');
    }
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
      throw Error(
        'Failed to get users home. Check that both the user has a home!'
      );
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

  private getDateFromStringOrFail(value: string) {
    if (isNaN(Date.parse(value))) {
      throw Error('Failed to execute! Check the date argument.');
    } else {
      return new Date(Date.parse(value));
    }
  }
}
