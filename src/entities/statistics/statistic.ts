import { Field, InterfaceType } from 'type-graphql';
import DataPoint from './dataPoint';

@InterfaceType()
export default abstract class Statistic {
  @Field(() => [DataPoint])
  data: DataPoint[];

  protected constructor(data: DataPoint[]) {
    this.data = data;
  }
}
