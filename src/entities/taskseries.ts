import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home, Task } from '.';

@Entity()
@ObjectType()
export class TaskSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @ManyToOne(() => Home, (home) => home.taskSeries)
  relatedHome: Home | null | undefined;

  @OneToMany(() => Task, (task) => task.series, { onDelete: 'CASCADE' })
  tasks!: Task[];

  constructor(home: Home) {
    super();
    this.relatedHome = home;
  }
}
