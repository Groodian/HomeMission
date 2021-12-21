import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import User from '../../../entities/user';

@Resolver(User)
export default class UserResolver {
  private userProfile = {
    id: String(1),
    name: 'John Smith',
    status: 'cached',
  };

  @Query(() => User)
  async user() {
    return this.userProfile;
  }

  @Mutation(() => User)
  async updateName(@Arg('name') name: string) {
    this.userProfile.name = name;
    return this.userProfile;
  }
}
