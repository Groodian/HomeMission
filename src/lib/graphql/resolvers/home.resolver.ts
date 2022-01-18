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
import { Home, Task, TaskReceipt, TaskType, User } from '../../../entities';
import databaseConnection from '../../typeorm/connection';
import CurrentSession from '../../auth0/current-session';
import { Session } from '@auth0/nextjs-auth0';
import Helper from './helper';

@Resolver(Home)
export default class HomeResolver implements ResolverInterface<Home> {
  /**
   * Get the home of the authenticated user from the database or null if the user has no home.
   */
  @Authorized()
  @Query(() => Home, { nullable: true })
  async home() {
    await databaseConnection();
    return await Helper.getHomeOrFail();
  }

  /**
   * Only load users if required.
   */
  @FieldResolver(() => [User])
  async users(@Root() home: Home) {
    return await User.find({ where: { home: home.id } });
  }

  /**
   * Only load task types if required.
   */
  @FieldResolver(() => [TaskType])
  async taskTypes(@Root() home: Home) {
    return await TaskType.find({ where: { relatedHome: home.id } });
  }

  /**
   * Only load tasks if required.
   */
  @FieldResolver(() => [Task])
  async tasks(@Root() home: Home) {
    return await Task.find({ where: { relatedHome: home.id } });
  }

  /**
   * Only load task receipts if required.
   */
  @FieldResolver(() => [TaskReceipt])
  async receipts(@Root() home: Home) {
    return await TaskReceipt.find({ where: { relatedHome: home.id } });
  }

  // TODO: Remove
  // ! Only for testing purposes.
  /**
   * Get all homes including the users and task types in the homes.
   */
  @Query(() => [Home])
  async homes() {
    try {
      await databaseConnection();
      return await Home.find({ relations: ['users', 'taskTypes', 'tasks'] });
    } catch (e) {
      throw Error('Failed to get all homes!');
    }
  }

  // TODO: Create home with name
  /**
   * Create a new home and add the user to it.
   */
  @Authorized()
  @Mutation(() => Home)
  async createHome() {
    await databaseConnection();
    try {
      const createdHome = await new Home().save();
      return this.addUserToHome(createdHome);
    } catch (e) {
      throw Error('Failed to create home.');
    }
  }

  /**
   * Add user to a home that has the requested invitation code.
   */
  @Authorized()
  @Mutation(() => Home)
  async joinHomeByCode(@Arg('code') code: string) {
    await databaseConnection();
    try {
      const home = await this.getHomeByCode(code);
      return await this.addUserToHome(home);
    } catch (e) {
      throw Error('Failed to add user to home. Check that the code is valid!');
    }
  }

  private async addUserToHome(home: Home, @CurrentSession() session?: Session) {
    try {
      // get user from database
      const user = await User.findOneOrFail(session?.user.sub as string);

      // add reference
      user.home = home;

      // save
      await user.save();

      // return the home
      return home;
    } catch (e) {
      throw Error(
        'Failed to add user to home. Check that both the home and user exist!'
      );
    }
  }

  private async getHomeByCode(code: string) {
    await databaseConnection();
    try {
      return await Home.findOneOrFail({ where: { code: code } });
    } catch (e) {
      throw Error(`Failed to find home with code ${code}`);
    }
  }
}
