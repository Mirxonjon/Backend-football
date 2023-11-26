import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompetitionCategoriesEntity } from './competition_Categories.entity';

@Entity()
export class CompetitionVideosEntity extends BaseEntity {
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
    nullable: false,
  })
  video_link: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_video: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  description_video_ru: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToOne(
    () => CompetitionCategoriesEntity,
    (categories) => categories.Tactic_videos,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'category_id' })
  category_id: CompetitionCategoriesEntity;
}
