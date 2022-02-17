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
 * A template with name and points for tasks.
 */
@Entity()
@ObjectType({ description: 'A template with name and points for tasks.' })
export default class TaskType extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The name of the task (e.g. vacuum).
   */
  @Column()
  @Field({ description: 'The name of the task type (e.g. vacuum).' })
  name!: string;

  /**
   * The points of the task.
   */
  @Column()
  @Field({ description: 'The points of the task.' })
  points!: number;

  /**
   * The tasks with the task type.
   */
  @ManyToOne('Task', 'type')
  tasksOfType!: Task[];

  /**
   * The home that the task type belongs to.
   * Null if the task is deleted.
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
