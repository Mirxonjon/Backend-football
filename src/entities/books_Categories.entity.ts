import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BooksEntity } from './books.entity';

@Entity()
export class BooksCategoriesEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title_ru: string;

  @OneToMany(() => BooksEntity, (books) => books.category_id)
  books: BooksEntity[];
}
