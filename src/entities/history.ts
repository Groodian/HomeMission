import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import {
  BaseEntity,
  Column,
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

registerEnumType(HistoryType, {
  name: 'HistoryType',
  description: 'Type of a history entry',
});

@Entity()
@ObjectType()
export class History extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @ManyToOne(() => Home, (home) => home.history)
  home!: Home;

  @ManyToOne(() => User, (user) => user.history, { eager: true })
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
