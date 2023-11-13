import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TacticVideosEntity } from './tactic_Videos.entity';

@Entity()
export class TacticCategoriesEntity extends BaseEntity {
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

  @Column({
    type: 'character varying',
    nullable: false,
  })
  tactic_categories: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(() => TacticVideosEntity, (videos) => videos.category_id)
  Tactic_videos: TacticVideosEntity[];
}
