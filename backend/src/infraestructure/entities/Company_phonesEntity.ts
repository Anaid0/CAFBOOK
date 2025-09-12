import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Company_phones } from '../../domain/Company_phones';

@Entity({name: 'company_phones'})
export class Company_phonesEntity {
    @PrimaryGeneratedColumn()
    company_phone!: number;   
    
    @Column({type: "int"})
    phone_id!:number;

    @Column({type: "int"})
    company_id!:number;
        
}