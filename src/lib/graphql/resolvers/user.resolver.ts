import { Session } from '@auth0/nextjs-auth0';
import { Query, Resolver } from 'type-graphql';
import { User } from '../../../entities';

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
    return await User.findOne((session?.user.sub as string) || '');
  }
}
