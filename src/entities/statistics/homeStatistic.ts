import { Field, ObjectType } from 'type-graphql';
import Statistic from './statistic';
import DataPoint from './dataPoint';

@ObjectType({ implements: Statistic })
export default class HomeStatistic implements Statistic {
  @Field(() => [DataPoint])
  data: DataPoint[];

  constructor(data: DataPoint[]) {
    this.data = data;
  }
}
