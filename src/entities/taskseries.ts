import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import Task from './task';

@Entity()
@ObjectType()
export default class TaskSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @ManyToOne('Home', 'taskSeries')
  relatedHome: Home | null | undefined;

  @OneToMany('Task', 'series', { onDelete: 'CASCADE' })
  tasks!: Task[];

  constructor(home: Home) {
    super();
    this.relatedHome = home;
  }
}
