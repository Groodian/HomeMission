import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import History from './history';
import Home from './home';
import Task from './task';
import TaskReceipt from './taskreceipt';

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  picture!: string;

  @Column({ default: 0 })
  @Field()
  points!: number;

  @ManyToOne('Home', 'users')
  home: Home | null | undefined;

  @OneToMany('History', 'user')
  history!: History[];

  @OneToMany('TaskReceipt', 'completer')
  receipts!: TaskReceipt[];

  @OneToMany('Task', 'assignee')
  tasks!: Task[];
}
