import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'user_addresses'})
export class User_addressesEntity {
    @PrimaryGeneratedColumn()
    user_address_id!: number;   
    
    @Column({type: "int"})
    address_id!:number;

    @Column({type: "int"})
    user_id!:number;

}