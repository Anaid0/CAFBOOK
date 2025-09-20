import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AddressesEntity } from "./AddressesEntity";
import { CompaniesEntity } from "./CompaniesEntity";

@Entity({name: 'company_addresses'})
export class Company_addressesEntity {
    @PrimaryGeneratedColumn()
    company_address_id!: number;   
    
    @ManyToOne(()=> AddressesEntity, {eager: true})
    @JoinColumn({name: "address_id"})
    address_id!:AddressesEntity;

    @ManyToOne(()=>CompaniesEntity, {eager:true})
    @JoinColumn({name: "company_id"})
    company_id!:CompaniesEntity;

}