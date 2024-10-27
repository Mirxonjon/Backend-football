import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { SeenHistoryEntity } from './seen_short_history.entity';
  
  
  @Entity()
  export class ShortHistoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
      type: 'character varying',
      nullable: true,
    })
    image_link: string;

    @Column({
      type: 'character varying',
      nullable: true,
    })
    title: string;

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;

    @OneToMany(() => SeenHistoryEntity, (seen_history) => seen_history.shortHistoryId)
    seen_histories: SeenHistoryEntity[];
  }
  