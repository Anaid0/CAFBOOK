import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PhonesEntity } from "./PhonesEntity";

@Entity({name: 'number_types'})
export class Number_typesEntity {
    @PrimaryGeneratedColumn()
    number_type_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

    @OneToMany(()=> PhonesEntity, (phone)=> phone.number_type_id)
    phone!: PhonesEntity[]
}