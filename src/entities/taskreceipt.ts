import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Home from './home';
import User from './user';

@Entity()
@ObjectType()
export default class TaskReceipt extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  completionDate!: Date;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  points!: number;

  @ManyToOne('Home', 'taskReceipts')
  relatedHome: Home;

  @ManyToOne('User', 'receipts')
  completer: User | undefined | null;

  constructor(home: Home, completer: User, name: string, points: number) {
    super();
    this.relatedHome = home;
    this.completer = completer;
    this.name = name;
    this.points = points;
    this.completionDate = new Date();
  }
}
