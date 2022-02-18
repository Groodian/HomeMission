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

/**
 * Home is the main entity.
 * Homes are created by users.
 * Users can give their home a name.
 * Users can invite others by giving them the code (invitation code) of their home.
 * Each home has its own set of tasks, created and maintained by members of the home.
 */
@Entity()
@ObjectType({
  description: `Home is the main entity.
Homes are created by users.
Users can give their home a name.
Users can invite others by giving them the code (invitation code) of their home.
Each home has its own set of tasks, created and maintained by members of the home.`,
})
export default class Home extends BaseEntity {
  /**
   * The id is automatically generated.
   */
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'The id is automatically generated.' })
  id!: string;

  /**
   * The name of the home.
   */
  @Column()
  @Field({ description: 'The name of the home.' })
  name!: string;

  /**
   * The invitation code of the home.
   * Automatically generated string consisting of 6 alphanumeric uppercase characters.
   */
  @Column({ unique: true })
  @Field({
    description: `The invitation code of the home.
Automatically generated string consisting of 6 alphanumeric uppercase characters.`,
  })
  code!: string;

  /**
   * The users that are part of the home (roommates).
   */
  @OneToMany('User', 'home')
  users!: User[];

  /**
   * The history entries for the home.
   */
  @OneToMany('History', 'home')
  history!: History[];

  /**
   * The available task types.
   */
  @OneToMany('TaskType', 'relatedHome', {
    onDelete: 'CASCADE',
  })
  taskTypes!: TaskType[];

  /**
   * Task series that belong to the home.
   */
  @OneToMany('TaskSeries', 'relatedHome', {
    onDelete: 'CASCADE',
  })
  taskSeries!: TaskSeries[];

  /**
   * Tasks that belong to the home.
   */
  @OneToMany('Task', 'relatedHome', { onDelete: 'CASCADE' })
  tasks!: Task[];

  /**
   * Task receipts that belong to the home.
   */
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
