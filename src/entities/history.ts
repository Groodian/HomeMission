import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import User from './user';
import Task from './task';
import TaskType from './tasktype';
import TaskSeries from './taskseries';

/**
 * The event type of a history entry.
 */
export enum HistoryType {
  HOME_CREATED = 'home_created',
  HOME_RENAMED = 'home_renamed',
  USER_JOIN = 'user_join',
  USER_LEAVE = 'user_leave',
  USER_RENAME = 'user_rename',
  TASK_TYPE_CREATED = 'task_type_created',
  TASK_TYPE_DELETED = 'task_type_deleted',
  TASK_TYPE_UPDATED = 'task_type_updated',
  TASK_SERIES_CREATED = 'task_series_created',
  TASK_SERIES_DELETED = 'task_series_deleted',
  TASK_SERIES_SUB_DELETED = 'task_series_sub_deleted',
  TASK_SERIES_UPDATED = 'task_series_updated',
  TASK_CREATED = 'task_created',
  TASK_DELETED = 'task_deleted',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  TASK_ASSIGNED = 'task_assigned',
  TASK_UNASSIGNED = 'task_unassigned',
}

registerEnumType(HistoryType, {
  name: 'HistoryType',
  description: 'The event type of a history entry.',
});

/**
 * The activity history of a home.
 * Is used to document all events.
 */
@Entity()
@ObjectType({
  description: `The activity history of a home.
Is used to document all events.`,
})
export default class History extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The home that this history entry belongs to.
   */
  @ManyToOne('Home', 'history')
  home!: Home;

  /**
   * The user that triggered the event.
   */
  @ManyToOne('User', 'history')
  user!: User;

  /**
   * The date when the event was recorded.
   */
  @Column()
  @Field({ description: 'The date when the event was recorded.' })
  date!: string;

  /**
   * The type of the event.
   */
  @Column({ type: 'enum', enum: HistoryType })
  @Field(() => HistoryType, { description: 'The type of the event.' })
  type!: HistoryType;

  /**
   * The history may contain a reference to a task type.
   */
  @ManyToOne('TaskType', { nullable: true })
  taskType?: TaskType | null | undefined;

  /**
   * The history may contain a reference to a task.
   */
  @ManyToOne('Task', { nullable: true })
  task?: Task | null | undefined;

  /**
   * The history may contain a reference to a task series.
   */
  @ManyToOne('TaskSeries', { nullable: true })
  taskSeries?: TaskSeries | null | undefined;

  /**
   * The history may contain a reference to an affected user.
   */
  @ManyToOne('User', { nullable: true })
  affectedUser?: User | null | undefined;

  /**
   * The history may contain extra info.
   */
  @Column({ nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'The history may contain extra info.',
  })
  extraInfo?: string | null | undefined;

  constructor() {
    super();
    this.date = new Date(Date.now()).toISOString();
  }
}
