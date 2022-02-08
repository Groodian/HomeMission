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

export enum HistoryType {
  USER_JOIN = 'user_join',
  USER_LEAVE = 'user_leave',
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
}

registerEnumType(HistoryType, {
  name: 'HistoryType',
  description: 'Type of a history entry',
});

@Entity()
@ObjectType()
export default class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @ManyToOne('Home', 'history')
  home!: Home;

  @ManyToOne('User', 'history', { eager: true })
  @Field()
  user!: User;

  @Column()
  @Field()
  date!: string;

  @Column({ type: 'enum', enum: HistoryType })
  @Field(() => HistoryType)
  type!: HistoryType;

  constructor() {
    super();
    this.date = new Date().toISOString();
  }
}
