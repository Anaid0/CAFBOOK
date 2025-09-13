import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({name: 'company_addresses'})
export class Company_addressesEntity {
    @PrimaryGeneratedColumn()
    company_address_id!: number;   
    
    @Column({type: "int"})
    address_id!:number;

    @Column({type: "int"})
    company_id!:number;

}