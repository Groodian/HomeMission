import { Field, ObjectType } from 'type-graphql';

/**
 * No database entity.
 * Each data point contains the points per day and per week for a specific date.
 */
@ObjectType({
  description: `No database entity.
The data points contains the points per day and per week for a specific date.`,
})
export default class DataPoint {
  /**
   * The date that the points were calculated for.
   */
  @Field({ description: 'The date that the points were calculated for.' })
  date: Date;

  /**
   * Sum of achieved points at this day.
   */
  @Field({ description: 'Sum of achieved points at this day.' })
  pointsDay: number;

  /**
   * Sum of achieved points in the last 7 days.
   */
  @Field({ description: 'Sum of achieved points in the last 7 days.' })
  pointsWeek: number;

  addPointsDay(value: number) {
    this.pointsDay += value;
  }

  addPointsWeek(value: number) {
    this.pointsWeek += value;
  }

  constructor(date: Date, pointsDay = 0, pointsWeek = 0) {
    this.date = date;
    this.pointsDay = pointsDay;
    this.pointsWeek = pointsWeek;
  }
}
