import { Session } from '@auth0/nextjs-auth0';
import { Authorized, Query, Resolver } from 'type-graphql';
import User from '../../../entities/user';
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
    return User.findOne((session?.user.sub as string) || '');
  }

  /**
   * Get the roommates of the authenticated user (including the user himself).
   */
  @Authorized()
  @Query(() => [User])
  async roommates(@CurrentSession() _session?: Session) {
    await databaseConnection();

    // TODO:
    // const user = await User.findOne(session.user.sub as string, {
    //   loadRelationIds: true,
    // });
    // const home = await Home.findOne(user?.home, { relations: ['users'] });
    // return home?.users || [];

    return User.find();
  }
}
