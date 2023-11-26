import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortBookCategoriesEntity } from './short_book_Categories.entity';

@Entity()
export class ShortBooksEntity extends BaseEntity {
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
  short_book_link: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  short_book_img: string;

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
  short_book_lang: string;
  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @ManyToOne(
    () => ShortBookCategoriesEntity,
    (short_books_categories) => short_books_categories.short_books,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category_id: ShortBookCategoriesEntity;
}
