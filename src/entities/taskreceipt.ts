import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import User from './user';

/**
 * The receipt of a task when the task is completed.
 */
@Entity()
@ObjectType({
  description: 'The receipt of a task when the task is completed.',
})
export default class TaskReceipt extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The date when the task was completed.
   */
  @Column()
  @Field({ description: 'The date when the task was completed.' })
  completionDate!: Date;

  /**
   * Copy of the name of the task type to avoid cascading.
   */
  @Column()
  @Field({
    description: 'Copy of the name of the task type to avoid cascading.',
  })
  name!: string;

  /**
   * Copy of the points of the task type to disable cascading.
   */
  @Column()
  @Field({
    description: 'Copy of the points of the task type to disable cascading.',
  })
  points!: number;

  /**
   * The user that completed the task.
   */
  @ManyToOne('User', 'receipts')
  completer!: User;

  /**
   * The home that the task belongs to.
   */
  @ManyToOne('Home', 'taskReceipts')
  relatedHome: Home;

  constructor(home: Home, completer: User, name: string, points: number) {
    super();
    this.relatedHome = home;
    this.completer = completer;
    this.name = name;
    this.points = points;
    this.completionDate = new Date(Date.now());
  }
}
