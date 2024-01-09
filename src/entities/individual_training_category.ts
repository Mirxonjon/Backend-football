import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { TrainingSubCategoriesEntity } from './training_sub_Category';
import { IndividualTrainingVideosEntity } from './individual_training_videos';
  
  @Entity()
  export class IndividualTrainingCategoriesEntity extends BaseEntity {
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
  
    @Column({
      type: 'character varying',
      length: 100,
      nullable: false,
    })
    traning_for_indivudual: string;
  
    @Column({
      type: 'character varying',
      nullable: false,
    })
    description_training: string;
  
    @Column({
      type: 'character varying',
      nullable: false,
    })
    description_training_ru: string;
  
    @Column({
      type: 'character varying',
      nullable: false,
    })
    image: string;
  
    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
  
    @OneToMany(
      () => IndividualTrainingVideosEntity,
      (video) => video.category_id,
    )
    videos: IndividualTrainingVideosEntity[];
  }
  