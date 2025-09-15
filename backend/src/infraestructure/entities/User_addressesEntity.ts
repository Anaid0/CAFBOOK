import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AddressesEntity } from "./AddressesEntity";
import { UsersEntity } from "./UsersEntity";

@Entity({ name: "user_addresses" })
export class User_addressesEntity {
  @PrimaryGeneratedColumn()
  user_address_id!: number;   

  @ManyToOne(() => AddressesEntity)
  @JoinColumn({ name: "address_id" })
  address_id!: AddressesEntity;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: "user_id" })
  user_id!: UsersEntity;
}
