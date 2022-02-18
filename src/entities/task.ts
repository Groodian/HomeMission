import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import TaskReceipt from './taskreceipt';
import TaskSeries from './taskseries';
import TaskType from './tasktype';
import User from './user';

/**
 * A task is an instantiation of a task type at a specific date.
 * It can belong to a series and may have an assignee.
 * It also has a receipt if the task is completed.
 */
@Entity()
@ObjectType({
  description: `A task is an instantiation of a task type at a specific date.
It can belong to a series an may have an assignee.
It also has a receipt if the task is completed.`,
})
export default class Task extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The date when the task should be completed.
   */
  @Column()
  @Field({ description: 'The date when the task should be completed.' })
  date!: Date;

  /**
   * The type of the task.
   */
  @ManyToOne('TaskType', 'tasksOfType')
  type!: TaskType;

  /**
   * The series that the task belongs to.
   * Null if the task does not belong to a series.
   */
  @ManyToOne('TaskSeries', 'tasks', { nullable: true })
  series?: TaskSeries | null | undefined;

  /**
   * The user that the task is assigned to.
   * Null if no user is assigned.
   */
  @ManyToOne('User', 'tasks', { nullable: true })
  assignee?: User | null | undefined;

  /**
   * The receipt of the task.
   * Null if the task has not been completed.
   */
  @OneToOne('TaskReceipt', { nullable: true })
  @JoinColumn()
  receipt?: TaskReceipt | null | undefined;

  /**
   * The home that the task belongs to.
   * Null if the task is deleted.
   */
  @ManyToOne('Home', 'tasks', { nullable: true })
  relatedHome?: Home | null | undefined;

  constructor(date: Date, home: Home, type: TaskType) {
    super();
    this.date = date;
    this.relatedHome = home;
    this.type = type;
  }
}
