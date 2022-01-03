import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Home from './home';

@Entity()
@ObjectType()
export default class User extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  picture!: string;

  @Column({ default: 0 })
  @Field()
  points!: number;

  @ManyToOne(() => Home, (home) => home.users)
  @Field(() => Home, { nullable: true })
  home: Home | null | undefined;
}
