import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home, TaskType } from '.';

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

  @ManyToOne(() => Home, (home) => home.tasks)
  relatedHome: Home | null | undefined;

  constructor(date: Date, home: Home, type: TaskType) {
    super();
    this.date = date;
    this.relatedHome = home;
    this.type = type;
  }
}
