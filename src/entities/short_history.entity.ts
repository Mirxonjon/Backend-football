import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  
  @Entity()
  export class ShortHistoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({
      type: 'character varying',
      nullable:true
    })
    image_link: string;

    @Column({
        type: 'character varying',
        nullable:true
      })
    title: string;
  
    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;

  }
  