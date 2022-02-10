import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import History from './history';
import Task from './task';
import TaskReceipt from './taskreceipt';
import TaskSeries from './taskseries';
import TaskType from './tasktype';
import User from './user';

@Entity()
@ObjectType()
export default class Home extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column({ default: 'Home' })
  @Field()
  name!: string;

  @Column({ unique: true })
  @Field()
  code!: string;

  @OneToMany('User', 'home')
  users!: User[];

  @OneToMany('History', 'home')
  history!: History[];

  @OneToMany('TaskType', 'relatedHome', {
    onDelete: 'CASCADE',
  })
  taskTypes!: TaskType[];

  @OneToMany('TaskSeries', 'relatedHome', {
    onDelete: 'CASCADE',
  })
  taskSeries!: TaskSeries[];

  @OneToMany('Task', 'relatedHome', { onDelete: 'CASCADE' })
  tasks!: Task[];

  @OneToMany('TaskReceipt', 'relatedHome', {
    onDelete: 'CASCADE',
  })
  taskReceipts!: TaskReceipt[];

  constructor(name: string) {
    super();
    this.name = name;
    this.code = generateRandomString(6);
  }
}

// helper function to generate random string for join code
function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
