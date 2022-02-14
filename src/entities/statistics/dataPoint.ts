import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class DataPoint {
  @Field()
  date: Date;

  @Field()
  pointsDay: number;

  @Field()
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
