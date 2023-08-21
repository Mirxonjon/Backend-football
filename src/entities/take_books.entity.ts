import { BaseEntity, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";
import { BooksEntity } from "./books.entity";

export class TakeBooksEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;

    @ManyToOne(() => UsersEntity, (user) => user.take_books_users, {
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'user_id' })
      user_id: UsersEntity;

      @ManyToOne(() => BooksEntity, (books) => books.sell_books, {
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'book_id' })
      book_id: UsersEntity;
}