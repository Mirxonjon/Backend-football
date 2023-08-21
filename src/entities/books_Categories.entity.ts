import { BaseEntity, Collection, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BooksEntity } from "./books.entity";

export class BooksCategoriesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id :string

    @Column({
        type : 'character varying',
        nullable: false 
    })
    title: string

    @Column({
        type : 'character varying',
        nullable: false 
    })
    title_ru: string

    @OneToMany(() => BooksEntity, (books) => books.category_id)
    books: BooksEntity[];
}