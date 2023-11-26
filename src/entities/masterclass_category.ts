import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterclassVideosEntity } from './masterclass_Videos';

@Entity()
export class MasterclassCategoryEntity extends BaseEntity {
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
  img_link: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title_descrioption: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  title_descrioption_ru: string;

  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;

  @OneToMany(
    () => MasterclassVideosEntity,
    (MasterclassVideos) => MasterclassVideos.category_id,
  )
  MasterclassVideos: MasterclassVideosEntity[];
}
