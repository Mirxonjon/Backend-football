import { BaseEntity, Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users.entity";

export class TakeEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id :string

    @Column({
        type: 'boolean' ,
        default :true
    })
    active: boolean

    @CreateDateColumn({ name: 'created_at' })
    create_data: Date;


    @ManyToOne(() => UsersEntity, (user) => user.active_users, {
        onDelete: 'CASCADE',
      })
      @JoinColumn({ name: 'user_id' })
      user_id: UsersEntity;

     
}