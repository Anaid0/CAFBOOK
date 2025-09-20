import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PhonesEntity } from "./PhonesEntity";
import { CompaniesEntity } from "./CompaniesEntity";

@Entity({name: 'company_phones'})
export class Company_phonesEntity {
    @PrimaryGeneratedColumn()
    company_phone!: number;   
    
    @ManyToOne(()=> PhonesEntity, {eager: true})
    @JoinColumn({name: "phone_id"})
    phone_id!:PhonesEntity;

    @ManyToOne(()=> CompaniesEntity, {eager: true})
    @JoinColumn({name: "company_id"})
    company_id!:CompaniesEntity;
        
}