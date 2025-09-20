import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'number_types'})
export class Number_typesEntity {
    @PrimaryGeneratedColumn()
    number_type_id!: number;   
    
    @Column({type: "character varying", length:255})
    description!:string;

}