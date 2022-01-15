import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Home } from '.';

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

  constructor(name: string, points: number) {
    super();
    this.name = name;
    this.points = points;
  }
}
