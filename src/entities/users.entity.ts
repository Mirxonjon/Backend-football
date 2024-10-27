import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TakeEntity } from './take.entity';
import { TakeBooksEntity } from './take_books.entity';
import { SeenHistoryEntity } from './seen_short_history.entity';

@Entity()
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 200,
    nullable: true,
  })
  surname: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'character varying',
  })
  phone: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  was_born_date: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'character varying',
    nullable: true,
  })
  code: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  codeTime: Date;

  @Column({
    type: 'character varying',
    default: 'user',
  })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(() => TakeEntity, (course) => course.user_id)
  active_users: TakeEntity[];

  @OneToMany(() => TakeBooksEntity, (take_book) => take_book.user_id)
  take_books_users: TakeEntity[];

  @OneToMany(
    () => SeenHistoryEntity,
    (seen_history) => seen_history.userId,
  )
  seen_histories: SeenHistoryEntity[];
}
