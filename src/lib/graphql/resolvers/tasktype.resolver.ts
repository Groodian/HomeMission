import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import databaseConnection from '../../typeorm/connection';
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';
import { TaskType, User } from '../../../entities';

@Resolver(TaskType)
export default class TaskTypeResolver {
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
    const home = await this.getHomeOrFail();
    try {
      const taskType = new TaskType(name, points);
      taskType.relatedHome = home;
      return await taskType.save();
    } catch (e) {
      throw Error('Failed to create task type! Check that user has home.');
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
}
