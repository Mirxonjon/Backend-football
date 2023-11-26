import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CompetitionVideosEntity } from './competition_Videos.entity';

@Entity()
export class CompetitionCategoriesEntity extends BaseEntity {
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
  image: string;

  // @Column({
  //   type: 'character varying',
  //   nullable: false,
  // })
  // tactic_categories: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToOne(() => CompetitionVideosEntity, (videos) => videos.category_id)
  Tactic_videos: CompetitionVideosEntity[];
}
