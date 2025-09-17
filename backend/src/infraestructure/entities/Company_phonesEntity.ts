import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'company_phones'})
export class Company_phonesEntity {
    @PrimaryGeneratedColumn()
    company_phone!: number;   
    
    @ManyToOne
    phone_id!:number;

    @Column({type: "int"})
    company_id!:number;
        
}