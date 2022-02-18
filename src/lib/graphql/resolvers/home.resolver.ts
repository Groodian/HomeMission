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
  @Query(() => Home, {
    nullable: true,
    description:
      'Get the home of the authenticated user from the database or null if the user has no home.',
  })
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
  @FieldResolver(() => [User], {
    description: 'The users that are part of the home (roommates).',
  })
  async users(@Root() home: Home) {
    return await User.find({ where: { home: home.id } });
  }

  /**
   * Only load history if required.
   */
  @FieldResolver(() => [History], {
    description: 'The history entries for the home.',
  })
  async history(@Root() home: Home) {
    return await History.find({
      loadRelationIds: true,
      where: { home: home.id },
      order: { date: 'DESC' },
    });
  }

  /**
   * Only load task types if required.
   */
  @FieldResolver(() => [TaskType], { description: 'The available task types.' })
  async taskTypes(@Root() home: Home) {
    return await TaskType.find({ where: { relatedHome: home.id } });
  }

  /**
   * Only load tasks if required.
   */
  @FieldResolver(() => [Task], {
    description: 'Tasks that belong to the home.',
  })
  async tasks(@Root() home: Home) {
    return await Task.find({ where: { relatedHome: home.id } });
  }

  /**
   * Only load task receipts if required.
   */
  @FieldResolver(() => [TaskReceipt], {
    description: 'Task receipts that belong to the home.',
  })
  async receipts(@Root() home: Home) {
    return await TaskReceipt.find({ where: { relatedHome: home.id } });
  }

  /**
   * Create a new home and add the authenticated user to it.
   * Generate default task types in the specified language.
   * @param name The name of the home.
   * @param language The language of the default tasks.
   */
  @Authorized()
  @Mutation(() => Home, {
    description: `Create a new home and add the authenticated user to it.
Generate default task types in the specified language.`,
  })
  async createHome(
    @CurrentSession() session: Session,
    @Arg('name', { description: 'The name of the home.' })
    name: string,
    @Arg('language', { description: 'The language of the default tasks.' })
    language: string
  ) {
    await databaseConnection();
    const user = await Helper.getMeOrFail(session);
    try {
      const createdHome = await new Home(name).save();

      await Helper.createHistory(createdHome, user, HistoryType.HOME_CREATED);

      await this.generateDefaultTaskTypes(createdHome, language);
      return this.addUserToHome(createdHome, session);
    } catch (e) {
      throw Error('Failed to create home.');
    }
  }

  /**
   * Add the authenticated user to a home that has the requested invitation code.
   * @param code The invitation code.
   */
  @Authorized()
  @Mutation(() => Home, {
    description:
      'Add the authenticated user to a home that has the requested invitation code.',
  })
  async joinHome(
    @CurrentSession() session: Session,
    @Arg('code', { description: 'The invitation code.' })
    code: string
  ) {
    await databaseConnection();
    try {
      const home = await this.getHomeByCode(code);
      return await this.addUserToHome(home, session);
    } catch (e) {
      throw Error('Failed to add user to home. Check that the code is valid!');
    }
  }

  /**
   * Rename the home of the authenticated user.
   * @param name The new name.
   */
  @Authorized()
  @Mutation(() => Home, {
    description: 'Rename the home of the authenticated user.',
  })
  async renameHome(
    @CurrentSession() session: Session,
    @Arg('name', { description: 'The new name.' })
    name: string
  ) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    try {
      home.name = name;

      // save
      await home.save();
      await Helper.createHistory(home, user, HistoryType.HOME_RENAMED, {
        extraInfo: name,
      });

      return home;
    } catch (e) {
      throw Error('Failed to rename home!');
    }
  }

  /**
   * Remove the authenticated user from the home.
   */
  @Authorized()
  @Mutation(() => Home, {
    nullable: true,
    description: 'Remove the authenticated user from the home.',
  })
  async leaveHome(@CurrentSession() session: Session) {
    await databaseConnection();
    const home = await Helper.getHomeOrFail(session);
    const user = await Helper.getMeOrFail(session);
    try {
      user.home = null;
      user.points = 0;

      // save
      await user.save();
      await Helper.createHistory(home, user, HistoryType.USER_LEAVE);

      return null;
    } catch (e) {
      throw Error('Failed to leave home!');
    }
  }

  private async addUserToHome(home: Home, session: Session) {
    try {
      // get user from database
      const user = await Helper.getMeOrFail(session);

      // add reference
      user.home = home;

      // set points to zero
      user.points = 0;

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

  private async generateDefaultTaskTypes(home: Home, language: string) {
    const t = language === 'de' ? defaultTasksDe : defaultTasksEn;
    const taskTypes = [
      new TaskType(t['vacuum'], 50, home),
      new TaskType(t['clean-kitchen'], 60, home),
      new TaskType(t['clean-bath'], 60, home),
      new TaskType(t['wash-dishes'], 30, home),
      new TaskType(t['take-out-garbage'], 20, home),
      new TaskType(t['water-plants'], 10, home),
    ];
    await TaskType.save(taskTypes);
  }
}

const defaultTasksDe = {
  vacuum: 'Staubsaugen',
  'clean-kitchen': 'Küche putzen',
  'clean-bath': 'Bad putzen',
  'wash-dishes': 'Geschirr spülen',
  'take-out-garbage': 'Müll rausbringen',
  'water-plants': 'Pflanzen gießen',
};

const defaultTasksEn = {
  vacuum: 'Vacuum',
  'clean-kitchen': 'Clean kitchen',
  'clean-bath': 'Clean bath',
  'wash-dishes': 'Do dishes',
  'take-out-garbage': 'Take out garbage',
  'water-plants': 'Water plants',
};
