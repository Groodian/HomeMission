import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import Task from './task';

@Entity()
@ObjectType()
export default class TaskType extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column({ default: 'Task' })
  @Field()
  name!: string;

  @Column()
  @Field()
  points!: number;

  @ManyToOne('Home', 'taskTypes', { nullable: true })
  relatedHome?: Home | null | undefined;

  @ManyToOne('Task', 'type')
  tasksOfType!: Task[];

  constructor(name: string, points: number, home: Home) {
    super();
    this.name = name;
    this.points = points;
    this.relatedHome = home;
  }
}
