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
  import { TrainingVideosEntity } from './training_Videos.entity';
import { TrainingCategoriesEntity } from './training_Categories.entity';
  
  @Entity()
  export class TrainingSubCategoriesEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'character varying',
      length: 200,
      nullable: false,
    })
    title: string;
  
    @Column({
      type: 'character varying',
      length: 200,
      nullable: false,
    })
    title_ru: string;

  
    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;

    @ManyToOne(
        () => TrainingCategoriesEntity,
        (categories) => categories.Training_sub_category,
        {
          onDelete: 'CASCADE',
        },
      )
      @JoinColumn({ name: 'category_id' })
      category_id: TrainingCategoriesEntity;
  
    @OneToMany(() => TrainingVideosEntity, (videos) => videos.sub_Category_id)
    Training_videos: TrainingVideosEntity[];
  }
  