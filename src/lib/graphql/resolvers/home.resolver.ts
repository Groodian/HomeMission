import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import Home from '../../../entities/home';
import User from '../../../entities/user';
import databaseConnection from '../../typeorm/connection';

@Resolver(Home)
export default class HomeResolver {
  /**
   * Get all homes including the users in the homes.
   */
  @Query(() => [Home])
  async getHomes() {
    try {
      await databaseConnection();
      return await Home.find({ relations: ['users'] });
    } catch (e) {
      throw Error('Failed to get all homes.');
    }
  }

  /**
   * Create a new home and add the user to it.
   */
  @Authorized()
  @Mutation(() => Home)
  async createHome() {
    await databaseConnection();
    try {
      const createdHome = await Home.save(new Home());
      return this.addUserToHome(createdHome.id);
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
      return await this.addUserToHome(home.id);
    } catch (e) {
      throw Error('Failed to add user to home. Check that the code is valid!');
    }
  }

  private async addUserToHome(homeId: string) {
    await databaseConnection();
    try {
      // get home and user from database
      const home = await Home.findOneOrFail(homeId);
      const user = await User.findOneOrFail({ relations: ['home'] }); // ... get correct user

      // remove user from previous home if necessary
      if (user.home) {
        const previousHome = await Home.findOne(user.home.id);
        if (previousHome) {
          previousHome.users.filter((u) => u.id !== user.id);
          await previousHome.save();
        }
      }

      // add references
      user.home = home;
      home.users = home.users ? home.users.concat([user]) : [user];

      // save both and then return the home with relations
      await user.save();
      await home.save();
      return Home.findOne(home.id, { relations: ['users'] });
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
