import { Session } from '@auth0/nextjs-auth0';
import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { HistoryType } from '../../../entities/history';
import User from '../../../entities/user';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';
import Helper from './helper';

@Resolver(User)
export default class UserResolver {
  /**
   * Get the authenticated user from the database or null if the user is not authenticated.
   */
  @Query(() => User, {
    nullable: true,
    description:
      'Get the authenticated user from the database or null if the user is not authenticated.',
  })
  async user(@CurrentSession() session?: Session) {
    await databaseConnection();
    return await User.findOne((session?.user.sub as string) || '');
  }

  /**
   * Rename the authenticated user.
   * @param name The new name.
   */
  @Authorized()
  @Mutation(() => User, { description: 'Rename the authenticated user.' })
  async renameUser(
    @CurrentSession() session: Session,
    @Arg('name', { description: 'The new name.' })
    name: string
  ) {
    await databaseConnection();
    const user = await Helper.getMeOrFail(session);

    let home = null;
    try {
      home = await Helper.getHomeOrFail(session);
    } catch (e) {
      // if the user has no home dont save in history
    }

    try {
      user.name = name;

      // save
      await user.save();
      if (home) {
        await Helper.createHistory(home, user, HistoryType.USER_RENAME, {
          extraInfo: name,
        });
      }

      return user;
    } catch (e) {
      throw Error('Failed to rename user!');
    }
  }
}
