import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, Home } from './index';

export enum HistoryType {
  USER_JOIN = 'user_join',
  USER_LEAVE = 'user_leave',
  TASK_CREATED = 'task_created',
  TASK_DELETED = 'task_deleted',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
}

@Entity()
@ObjectType()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @ManyToOne(() => Home, (home) => home.history)
  home!: Home;

  @ManyToOne(() => User, (user) => user.history)
  user!: User;

  @CreateDateColumn()
  date!: Date;

  @Column({ type: 'enum', enum: HistoryType })
  type!: HistoryType;
}
