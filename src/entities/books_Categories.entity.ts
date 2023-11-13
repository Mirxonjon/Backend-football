import {
  BaseEntity,
  Column,
  CreateDateColumn,
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

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(() => BooksEntity, (books) => books.category_id)
  books: BooksEntity[];
}
