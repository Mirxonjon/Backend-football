import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrainingCategoriesEntity } from './training_Categories.entity';

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

  @ManyToOne(
    () => TrainingCategoriesEntity,
    (categories) => categories.Training_videos,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category_id: TrainingCategoriesEntity;
}
