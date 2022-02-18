import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import Task from './task';

/**
 * A template for tasks containing name and points.
 */
@Entity()
@ObjectType({ description: 'A template for tasks containing name and points.' })
export default class TaskType extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The name of the task.
   */
  @Column()
  @Field({ description: 'The name of the task type.' })
  name!: string;

  /**
   * The amount of points the task is worth.
   */
  @Column()
  @Field({ description: 'The amount of points the task is worth.' })
  points!: number;

  /**
   * The tasks with the task type.
   */
  @ManyToOne('Task', 'type')
  tasksOfType!: Task[];

  /**
   * The home that the task type belongs to.
   * Null if the task type is deleted.
   */
  @ManyToOne('Home', 'taskTypes', { nullable: true })
  relatedHome?: Home | null | undefined;

  constructor(name: string, points: number, home: Home) {
    super();
    this.name = name;
    this.points = points;
    this.relatedHome = home;
  }
}
