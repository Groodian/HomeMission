import { Field, ID, ObjectType } from 'type-graphql';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Home, History } from './index';

@Entity()
@ObjectType()
export class User extends BaseEntity {
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
  home: Home | null | undefined;

  @OneToMany(() => History, (history) => history.user)
  history!: History[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    // ensures that property history is never undefined
    if (!this.history) {
      this.history = [];
    }
  }
}
