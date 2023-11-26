import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrainingCategoriesEntity } from './training_Categories.entity';
import { TrainingSubCategoriesEntity } from './training_sub_Category';

@Entity()
export class TrainingVideosEntity extends BaseEntity {
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
    length: 10,
    nullable: false,
  })
  duration: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  video_link: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  sequence: number;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  tactic_img: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_tactic: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_tactic_ru: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @ManyToOne(
    () => TrainingSubCategoriesEntity,
    (sub_Categories) => sub_Categories.Training_videos,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  sub_Category_id: TrainingCategoriesEntity;
}
