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
import History, { HistoryType } from '../../../entities/history';
import Home from '../../../entities/home';
import Task from '../../../entities/task';
import TaskReceipt from '../../../entities/taskreceipt';
import TaskType from '../../../entities/tasktype';
import User from '../../../entities/user';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';

@Resolver(Home)
export default class HomeResolver implements ResolverInterface<Home> {
  /**
   * Get the home of the authenticated user from the database or null if the user has no home.
   */
  @Authorized()
  @Query(() => Home, { nullable: true })
  async home(@CurrentSession() session: Session) {
    await databaseConnection();
    try {
      return await Helper.getHomeOrFail(session);
    } catch (e) {
      return null;
    }
  }

  /**
   * Only load users if required.
   */
  @FieldResolver(() => [User])
  async users(@Root() home: Home) {
    return await User.find({ where: { home: home.id } });
  }

  /**
   * Only load history if required.
   */
  @FieldResolver(() => [History])
  async history(@Root() home: Home) {
    return await History.find({ where: { home: home.id } });
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
  async createHome(@CurrentSession() session: Session) {
    await databaseConnection();
    try {
      const createdHome = await new Home().save();
      return this.addUserToHome(createdHome, session);
    } catch (e) {
      throw Error('Failed to create home.');
    }
  }

  /**
   * Add user to a home that has the requested invitation code.
   */
  @Authorized()
  @Mutation(() => Home)
  async joinHomeByCode(
    @CurrentSession() session: Session,
    @Arg('code') code: string
  ) {
    await databaseConnection();
    try {
      const home = await this.getHomeByCode(code);
      return await this.addUserToHome(home, session);
    } catch (e) {
      throw Error('Failed to add user to home. Check that the code is valid!');
    }
  }

  private async addUserToHome(home: Home, session: Session) {
    try {
      // get user from database
      const user = await Helper.getMeOrFail(session);

      // add reference
      user.home = home;

      // save
      await user.save();
      await Helper.createHistory(home, user, HistoryType.USER_JOIN);

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
