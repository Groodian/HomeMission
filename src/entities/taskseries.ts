import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import Task from './task';

/**
 * A series of tasks.
 * Is used to manage multiple tasks belonging to the same series.
 */
@Entity()
@ObjectType({
  description: `A series of tasks.
Is used to manage multiple tasks belonging to the same series.`,
})
export default class TaskSeries extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The tasks that belong to the series.
   */
  @OneToMany('Task', 'series', { onDelete: 'CASCADE' })
  tasks!: Task[];

  /**
   * The home that the series belongs to.
   * Null if the series is deleted.
   */
  @ManyToOne('Home', 'taskSeries')
  relatedHome: Home | null | undefined;

  constructor(home: Home) {
    super();
    this.relatedHome = home;
  }
}
