import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ShortHistoryEntity } from './short_history.entity';
import { UsersEntity } from './users.entity';

@Entity()
export class SeenHistoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'character varying',
    nullable: true,
    default: 'true',
  })
  seen: string;

  @ManyToOne(
    () => ShortHistoryEntity,
    (shortHistories) => shortHistories.seen_histories,
  )
  shortHistoryId: ShortHistoryEntity;

  @ManyToOne(
    () => UsersEntity,
    (user) => user.seen_histories,
  )
  userId: UsersEntity;
   
    
  @CreateDateColumn({ name: 'created_at' })
  create_data: Date;
}
