import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import History from './history';
import Home from './home';
import Task from './task';
import TaskReceipt from './taskreceipt';

/**
 * Users are saved in Auth0 and a copy is saved when the user logs in.
 * The name can be changed and the picture is updated by Auth0 on every log in.
 */
@Entity()
@ObjectType({
  description: `Users are saved in Auth0 and a copy is saved when the user logs in.
The name can be changed and the picture is updated by Auth0 on every log in.`,
})
export default class User extends BaseEntity {
  /**
   * The id is provided by Auth0.
   */
  @PrimaryColumn()
  @Field(() => ID, { description: 'The id is provided by Auth0.' })
  id!: string;

  /**
   * The name is initially provided by Auth0 and can be updated by the user.
   */
  @Column()
  @Field({
    description:
      'The name is initially provided by Auth0 and can be updated by the user.',
  })
  name!: string;

  /**
   * The picture is provided by Auth0 and is updated on every log in.
   */
  @Column()
  @Field({
    description:
      'The picture is provided by Auth0 and is updated on every log in.',
  })
  picture!: string;

  /**
   * The points of the user are increased on task completion and reset when the home changes.
   */
  @Column({ default: 0 })
  @Field({
    description:
      'The points of the user are increased on task completion and reset when the home changes.',
  })
  points!: number;

  /**
   * The home that the user belongs to.
   * Null if the user is not part of a home.
   */
  @ManyToOne('Home', 'users')
  home: Home | null | undefined;

  /**
   * The events triggered by the user.
   */
  @OneToMany('History', 'user')
  history!: History[];

  /**
   * The tasks completed by the user.
   */
  @OneToMany('TaskReceipt', 'completer')
  receipts!: TaskReceipt[];

  /**
   * The tasks that the user is assigned to.
   */
  @OneToMany('Task', 'assignee')
  tasks!: Task[];
}
