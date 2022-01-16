import { Field, ID, ObjectType } from 'type-graphql';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User, History } from './index';

@Entity()
@ObjectType()
export class Home extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: string;

  @Column({ default: 'Home' })
  @Field()
  name!: string;

  @Column({ unique: true })
  @Field()
  code!: string;

  @OneToMany(() => User, (user) => user.home)
  users!: User[];

  @OneToMany(() => History, (history) => history.home)
  history!: History[];

  constructor() {
    super();
    this.code = generateRandomString(6);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async nullChecks() {
    // ensures that property users is never undefined
    if (!this.users) {
      this.users = [];
    }
  }
}

// helper function to generate random string for join code
function generateRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
