import { BaseEntity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TrainingVideosEntity } from "./training_Videos.entity";

export class TrainingCategoriesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id :string

    @Column({
        type: 'character varying',
        length: 200,
        nullable: false
    })
    title : string
    
    @Column({
        type: 'character varying',
        length: 200,
        nullable: false
    })
    title_ru : string

    @Column({
        type:  "character varying",
        length: 100,
        nullable:false
    })
    traning_for_age: string

    @Column({
        type : 'character varying',
        nullable: false
    })  
    description_training: string
    
    
    @Column({
        type : 'character varying',
        nullable: false
    })  
    description_training_ru: string
    
    @Column({
        type: 'character varying',
        nullable: false,
    })
    image: string;

    @OneToMany(() => TrainingVideosEntity, (videos) => videos.category_id)
    Training_videos: TrainingVideosEntity[];
}