import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { TacticCategoriesEntity } from './tactic_Categories.entity';
  
  @Entity()
  export class MasterclassEntity extends BaseEntity {
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
    title_img_link: string;

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
    description_tactic: string;
  
    @Column({
      type: 'character varying',
      nullable: false,
    })
    description_tactic_ru: string;

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;
  

  }
  