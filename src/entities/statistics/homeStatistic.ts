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

  /**
   * The calculated percentage of completed tasks in the next 7 days.
   */
  @Field({
    description:
      'The calculated percentage of completed tasks in the next 7 days.',
  })
  weeklyProgress: number;

  /**
   * The calculated percentage of completed tasks in the next 30 days.
   */
  @Field({
    description:
      'The calculated percentage of completed tasks in the next 30 days.',
  })
  monthlyProgress: number;

  constructor(
    data: DataPoint[],
    weeklyProgress: number,
    monthlyProgress: number
  ) {
    this.data = data;
    this.weeklyProgress = weeklyProgress;
    this.monthlyProgress = monthlyProgress;
  }
}
