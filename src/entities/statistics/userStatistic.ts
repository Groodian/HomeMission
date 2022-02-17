import { Field, ObjectType } from 'type-graphql';
import User from '../user';
import Statistic from './statistic';
import DataPoint from './dataPoint';

@ObjectType({ implements: Statistic })
export default class UserStatistic implements Statistic {
  @Field(() => [DataPoint])
  data: DataPoint[];

  @Field(() => User, { nullable: true })
  user?: User | null | undefined;

  constructor(user: User | null, data: DataPoint[]) {
    this.user = user;
    this.data = data;
  }
}
