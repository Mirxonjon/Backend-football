import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { MasterclassCategoryEntity } from './masterclass_category';
  
  @Entity()
  export class MasterclassVideosEntity extends BaseEntity {
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
    tactic_img: string;

    @Column({
        type: 'character varying',
        nullable: false,
      })
    description_title: string;
    
    
    @Column({
        type: 'character varying',
        nullable: false,
      })
    description_title_ru: string;

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

    @Column({
      type: 'character varying',
      nullable: false,
    })
    video_link: string;

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
  
    @ManyToOne(() => MasterclassCategoryEntity, (MasterclassCategory) => MasterclassCategory.MasterclassVideos, {
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'category_id' })
      category_id: MasterclassCategoryEntity;

  }
  