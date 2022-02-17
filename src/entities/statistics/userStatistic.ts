import { Field, ObjectType } from 'type-graphql';
import User from '../user';
import Statistic from './statistic';
import DataPoint from './dataPoint';

/**
 * No database entity.
 * A statistic for a specific user.
 */
@ObjectType({ implements: Statistic })
export default class UserStatistic implements Statistic {
  /**
   * The calculated data points for the user.
   */
  @Field(() => [DataPoint], {
    description: 'The calculated data points for the user.',
  })
  data: DataPoint[];

  /**
   * The user that the statistic belongs to.
   * Is null for the aggregated statistics of users that left the home.
   */
  @Field(() => User, {
    nullable: true,
    description: `The user that the statistic belongs to.
Is null for the aggregated statistic of users that left the home.`,
  })
  user?: User | null | undefined;

  constructor(user: User | null, data: DataPoint[]) {
    this.user = user;
    this.data = data;
  }
}
