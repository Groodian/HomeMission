import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home, Task } from '.';

@Entity()
@ObjectType()
export class TaskType extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column({ default: 'Task' })
  @Field()
  name!: string;

  @Column()
  @Field()
  points!: number;

  @ManyToOne(() => Home, (home) => home.taskTypes)
  relatedHome: Home | null | undefined;

  @ManyToOne(() => Task, (task) => task.type)
  tasksOfType!: Task[];

  constructor(name: string, points: number, home: Home) {
    super();
    this.name = name;
    this.points = points;
    this.relatedHome = home;
  }
}
