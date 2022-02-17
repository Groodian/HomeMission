import { Field, ObjectType } from 'type-graphql';
import Statistic from './statistic';
import DataPoint from './dataPoint';

/**
 * No database entity.
 * A statistic for a specific home.
 */
@ObjectType({
  implements: Statistic,
  description: `No database entity.
A statistic for a specific home.`,
})
export default class HomeStatistic implements Statistic {
  /**
   * The calculated data points for the home.
   */
  @Field(() => [DataPoint], {
    description: 'The calculated data points for the home.',
  })
  data: DataPoint[];

  constructor(data: DataPoint[]) {
    this.data = data;
  }
}
