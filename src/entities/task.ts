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

@Entity()
@ObjectType()
export default class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  date!: Date;

  @ManyToOne('TaskType', 'tasksOfType')
  type: TaskType | null | undefined;

  @ManyToOne('TaskSeries', 'tasks', {
    nullable: true,
  })
  series?: TaskSeries | null | undefined;

  @ManyToOne('User', 'tasks', {
    nullable: true,
  })
  assignee?: User | null | undefined;

  @ManyToOne('Home', 'tasks')
  relatedHome: Home | null | undefined;

  @OneToOne('TaskReceipt', {
    nullable: true,
  })
  @JoinColumn()
  receipt?: TaskReceipt | undefined | null;

  constructor(date: Date, home: Home, type: TaskType) {
    super();
    this.date = date;
    this.relatedHome = home;
    this.type = type;
  }
}
