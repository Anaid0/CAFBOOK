import { number } from "joi";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'cities'})
export class CitiesEntity {
    @PrimaryGeneratedColumn()
    city_id!: number;   
    
    @Column({type: "character varying", length:255})
    city_name!:string;

    @Column({type: "int", length:100})
    department_id!:number;

}