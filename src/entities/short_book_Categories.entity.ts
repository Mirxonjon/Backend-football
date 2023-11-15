import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { BooksEntity } from './books.entity';
import { ShortBooksEntity } from './short_books.entity';
  
  @Entity()
  export class ShortBookCategoriesEntity extends BaseEntity {
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
  
    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
  
    @OneToMany(() => ShortBooksEntity, (short_books) => short_books.category_id)
    short_books: ShortBooksEntity [];
  }
  