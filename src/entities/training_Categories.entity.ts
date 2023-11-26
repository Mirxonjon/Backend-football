import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrainingVideosEntity } from './training_Videos.entity';
import { TrainingSubCategoriesEntity } from './training_sub_Category';

@Entity()
export class TrainingCategoriesEntity extends BaseEntity {
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
  traning_for_age: string;

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
    () => TrainingSubCategoriesEntity,
    (sub_category) => sub_category.category_id,
  )
  Training_sub_category: TrainingSubCategoriesEntity[];
}
