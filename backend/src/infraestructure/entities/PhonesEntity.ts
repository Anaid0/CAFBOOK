
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'phones'})
export class PhonesEntity {
    @PrimaryGeneratedColumn()
    phone_id!: number;   
    
    @Column({type: "int"})
    number_type_id!:number;

}