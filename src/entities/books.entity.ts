import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BooksCategoriesEntity } from './books_Categories.entity';
import { TakeBooksEntity } from './take_books.entity';

@Entity()
export class BooksEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'character varying',
    length: 100,
    nullable: false,
  })
  title_ru: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  book_link: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  book_img: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_book: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_book_ru: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  book_lang: string;
  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @ManyToOne(() => BooksCategoriesEntity, (categories) => categories.books, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: BooksCategoriesEntity;

  @OneToMany(() => TakeBooksEntity, (take) => take.book_id)
  sell_books: TakeBooksEntity[];
}
