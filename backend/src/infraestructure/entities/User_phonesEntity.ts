import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PhonesEntity } from "./PhonesEntity";
import { UsersEntity } from "./UsersEntity";

@Entity({ name: "user_phones" })
export class User_phonesEntity {
  @PrimaryGeneratedColumn()
  user_phone!: number;   

  @ManyToOne(() => PhonesEntity)
  @JoinColumn({ name: "phone_id" })
  phone_id!: PhonesEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user_id!: UsersEntity;
}
