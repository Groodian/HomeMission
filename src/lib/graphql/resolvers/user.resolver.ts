import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import User from '../../../entities/user';
import databaseConnection from '../../typeorm/connection';

@Resolver(User)
export default class UserResolver {
  @Query(() => User)
  async user() {
    await databaseConnection();

    let user = await User.findOne();
    if (!user) {
      user = new User();
      user.name = 'John Smith';
      user.status = 'cached';
      user = await user.save();
    }

    return user;
  }

  @Authorized() // Test only authorized users may update the name
  @Mutation(() => User)
  async updateName(@Arg('name') name: string) {
    await databaseConnection();

    let user = await this.user();
    user.name = name;
    user = await user.save();

    return user;
  }
}
