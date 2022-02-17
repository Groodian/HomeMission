import { Field, InterfaceType } from 'type-graphql';
import DataPoint from './dataPoint';

/**
 * An array of data points that contain the calculated points.
 */
@InterfaceType({
  description: 'An array of data points that contain the calculated points.',
})
export default abstract class Statistic {
  /**
   * The calculated data points.
   */
  @Field(() => [DataPoint], { description: 'The calculated data points.' })
  data: DataPoint[];

  protected constructor(data: DataPoint[]) {
    this.data = data;
  }
}
