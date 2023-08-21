import { BaseEntity, Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TakeEntity } from "./take.entity";
import { TakeBooksEntity } from "./take_books.entity";

export class UsersEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
    type: 'character varying',
    length: 100,
    nullable: true,
    })
    surname: string;

    @Column({
        type: 'character varying',
        length: 100,
        nullable: false,
    })
    username: string;
    
    @Column({
        type: 'integer',
        nullable: false,
      })
    phone: number;

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

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
    
    @OneToMany(() => TakeEntity, (course) => course.user_id)
    active_users: TakeEntity[];

    @OneToMany(() => TakeBooksEntity, (take_book) => take_book.user_id)
    take_books_users: TakeEntity[];
}