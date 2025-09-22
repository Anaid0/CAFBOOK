import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { AddressesEntity } from "./AddressesEntity";
import { UserEntity } from "./UsersEntity";

@Entity({name: 'user_addresses'})
export class User_addressesEntity {
    @PrimaryGeneratedColumn()
    user_address_id!: number;   
    
    @ManyToOne(()=> AddressesEntity, {eager: true})
    @JoinColumn({name: "address_id"})
    address_id!:AddressesEntity;

    @ManyToOne(()=> UserEntity, {eager:true})
    @JoinColumn({name: "user_id"})
    user_id!:UserEntity;

}