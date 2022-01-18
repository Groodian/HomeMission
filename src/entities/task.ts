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
import { Home, TaskType, TaskSeries, TaskReceipt } from '.';

@Entity()
@ObjectType()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  date!: Date;

  @ManyToOne(() => TaskType, (taskType) => taskType.tasksOfType)
  type: TaskType | null | undefined;

  @ManyToOne(() => TaskSeries, (taskSeries) => taskSeries.tasks, {
    nullable: true,
  })
  series?: TaskSeries | null | undefined;

  @ManyToOne(() => Home, (home) => home.tasks)
  relatedHome: Home | null | undefined;

  @OneToOne(() => TaskReceipt, {
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
