import { Session } from '@auth0/nextjs-auth0';
import { Authorized, Query, Resolver } from 'type-graphql';
import User from '../../../entities/user';
import Home from '../../../entities/home';
import CurrentSession from '../../auth0/current-session';
import databaseConnection from '../../typeorm/connection';

@Resolver(User)
export default class UserResolver {
  /**
   * Get the authenticated user from the database or null if the user is not authenticated.
   */
  @Query(() => User, { nullable: true })
  async user(@CurrentSession() session?: Session) {
    await databaseConnection();
    return await User.findOne((session?.user.sub as string) || '', {
      relations: ['home'],
    });
  }

  /**
   * Get the roommates of the authenticated user (including the user himself).
   */
  @Authorized()
  @Query(() => [User])
  async roommates(@CurrentSession() session: Session) {
    await databaseConnection();
    try {
      const user = await User.findOneOrFail(session.user.sub as string, {
        loadRelationIds: true,
      });
      if (!user.home) throw Error('User does not have a home.');
      const home = await Home.findOneOrFail(user.home);
      return home?.users || [];
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      } else {
        throw Error('Failed to get users roommates!');
      }
    }
  }
}
